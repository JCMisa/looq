import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

// --- University Types ---
export type University = InferSelectModel<typeof universities>;
export type NewUniversity = InferInsertModel<typeof universities>;

// --- Profile Types ---
export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;

// --- Exam Types ---
export type Exam = InferSelectModel<typeof exams>;
export type NewExam = InferInsertModel<typeof exams>;
// Specific helper for the JSONB config in Exams
export type ExamConfig = Exam["config"];

// --- Question Types ---
export type Question = InferSelectModel<typeof questions>;
export type NewQuestion = InferInsertModel<typeof questions>;
// Specific helper for the JSONB metadata in Questions
export type QuestionMetadata = Question["metadata"];

// --- Exam Session Types ---
export type ExamSession = InferSelectModel<typeof examSessions>;
export type NewExamSession = InferInsertModel<typeof examSessions>;

// --- Answer Types ---
export type Answer = InferSelectModel<typeof answers>;
export type NewAnswer = InferInsertModel<typeof answers>;

// --- Cheating Log Types ---
export type CheatingLog = InferSelectModel<typeof cheatingLogs>;
export type NewCheatingLog = InferInsertModel<typeof cheatingLogs>;

// --- Composite Types (Useful for Joins/Relations) ---
// Use these when you fetch an exam along with its questions
export type ExamWithQuestions = Exam & {
  questions: Question[];
};

// Use these for the Teacher's Live Room monitoring
export type SessionWithStudent = ExamSession & {
  student: Profile;
  logs: CheatingLog[];
};

// --- ENUMS (Standardized sets of values) ---

// Roles for access control within the app
export const roleEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "ORG_ADMIN",
  "TEACHER",
  "STUDENT",
]);

// Supported question types for the versatile exam builder
export const questionTypeEnum = pgEnum("question_type", [
  "MCQ",
  "ESSAY",
  "IDENTIFICATION",
  "CODING",
]);

// Status of a student's attempt at an exam
export const sessionStatusEnum = pgEnum("session_status", [
  "ONGOING",
  "SUBMITTED",
  "FLAGGED",
  "EXPIRED",
  "DISCONNECTED",
]);

// --- TABLES ---

// 1. UNIVERSITIES: The "Tenants" of your app.
// Each University is a separate entity with its own teachers and students.
export const universities = pgTable("universities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Official name of the University
  slug: text("slug").unique().notNull(), // URL-friendly name (e.g., 'pup-main')
  clerkOrgId: text("clerk_org_id").unique().notNull(), // Links this row to a Clerk Organization
  subscriptionPlan: text("subscription_plan").default("FREE").notNull(), // Used for Clerk Billing (FREE vs PRO)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. PROFILES: User data synced from Clerk via Webhooks.
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(), // The ID provided by Clerk (starts with user_)
  universityId: uuid("university_id").references(() => universities.id), // Which university they belong to
  email: text("email").notNull(), // User's email address
  fullName: text("full_name"), // Display name
  imageUrl: text("image_url"), // Profile picture URL from Clerk
  role: roleEnum("role").default("STUDENT").notNull(), // System role (Teacher, Student, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. EXAMS: Created by teachers. Contains proctoring and timing rules.
export const exams = pgTable("exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  universityId: uuid("university_id")
    .references(() => universities.id)
    .notNull(),
  teacherId: text("teacher_id")
    .references(() => profiles.id)
    .notNull(), // The creator
  title: text("title").notNull(),
  description: text("description"),
  timeLimit: integer("time_limit").notNull(), // Total exam duration in minutes
  passingScore: integer("passing_score").default(50).notNull(),

  // JSONB Config: Allows teachers to toggle proctoring features per exam
  config: jsonb("config")
    .$type<{
      requireCamera: boolean; // Must camera be on to start?
      requireMic: boolean; // Must mic be on to start?
      preventTabSwitch: boolean; // Trigger alert if tab loses focus?
      autoSubmitOnCheat: boolean; // Kill session immediately on violation?
      allowedViolations: number; // How many "strikes" before flagging/kicking?
    }>()
    .default({
      requireCamera: true,
      requireMic: true,
      preventTabSwitch: true,
      autoSubmitOnCheat: false,
      allowedViolations: 3,
    }),

  isActive: boolean("is_active").default(false).notNull(), // Is the exam open for students?
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. QUESTIONS: Polymorphic table. Stores all question types (MCQ, Coding, etc.)
export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("exam_id")
    .references(() => exams.id, { onDelete: "cascade" })
    .notNull(),
  type: questionTypeEnum("type").notNull(), // Type of question (determines UI rendering)
  order: integer("order").notNull(), // Sequence in the exam (1, 2, 3...)
  points: integer("points").default(1).notNull(), // Credit for this specific question
  content: text("content").notNull(), // The question text/prompt

  // Metadata: Type-specific data (Options for MCQ, Test cases for Coding)
  metadata: jsonb("metadata").$type<{
    options?: { id: string; text: string }[]; // For MCQ
    correctAnswer?: string; // For ID and MCQ
    testCases?: { input: string; output: string }[]; // For Coding (Piston API)
    rubric?: string; // For Gemini AI grading
    language?: string; // Coding language (e.g., 'javascript')
  }>(),
});

// 5. EXAM SESSIONS: Tracks a student's live attempt at an exam.
export const examSessions = pgTable(
  "exam_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    examId: uuid("exam_id")
      .references(() => exams.id)
      .notNull(),
    studentId: text("student_id")
      .references(() => profiles.id)
      .notNull(),
    status: sessionStatusEnum("status").default("ONGOING").notNull(),

    // Real-time Monitoring States (Updated via Socket.io)
    isCameraActive: boolean("is_camera_active").default(true).notNull(), // Live camera status
    isMicActive: boolean("is_mic_active").default(true).notNull(), // Live mic status
    lastHeartbeat: timestamp("last_heartbeat").defaultNow().notNull(), // For "Disconnected" detection

    startTime: timestamp("start_time").defaultNow().notNull(),
    endTime: timestamp("end_time"), // When they clicked 'Submit'
    finalScore: integer("final_score").default(0), // Total score calculated after submission
  },
  (table) => ({
    // Optimization: Fast lookup for a student's specific exam record
    studentExamIdx: index("student_exam_idx").on(table.studentId, table.examId),
  }),
);

// 6. ANSWERS: Every answer submitted by a student.
export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => examSessions.id, { onDelete: "cascade" })
    .notNull(),
  questionId: uuid("question_id")
    .references(() => questions.id)
    .notNull(),
  value: text("value").notNull(), // The raw answer (text, MCQ ID, or code string)
  isCorrect: boolean("is_correct").default(false), // Result of assessment
  pointsEarned: integer("points_earned").default(0), // Final points for this question
  aiFeedback: text("ai_feedback"), // Optional AI-generated feedback for the student
});

// 7. CHEATING LOGS: The audit trail for violations.
export const cheatingLogs = pgTable("cheating_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => examSessions.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(), // 'TAB_SWITCH', 'CAMERA_OFF', 'FULLSCREEN_EXIT', etc.
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: jsonb("metadata").$type<{
    reason?: string;
    duration?: number; // How long were they away from the tab?
  }>(),
});

// --- RELATIONS (For Drizzle Query API) ---

export const universityRelations = relations(universities, ({ many }) => ({
  exams: many(exams),
  profiles: many(profiles),
}));

export const profileRelations = relations(profiles, ({ one, many }) => ({
  university: one(universities, {
    fields: [profiles.universityId],
    references: [universities.id],
  }),
  sessions: many(examSessions),
}));

export const examRelations = relations(exams, ({ one, many }) => ({
  university: one(universities, {
    fields: [exams.universityId],
    references: [universities.id],
  }),
  questions: many(questions),
  sessions: many(examSessions),
}));

export const sessionRelations = relations(examSessions, ({ one, many }) => ({
  exam: one(exams, { fields: [examSessions.examId], references: [exams.id] }),
  student: one(profiles, {
    fields: [examSessions.studentId],
    references: [profiles.id],
  }),
  answers: many(answers),
  logs: many(cheatingLogs),
}));
