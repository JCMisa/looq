export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      university_id?: string;
      role?: "SUPER_ADMIN" | "ORG_ADMIN" | "TEACHER" | "STUDENT";
    };
  }
}
