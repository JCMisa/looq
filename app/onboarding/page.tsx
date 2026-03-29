import { CreateOrganization, OrganizationList } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, GraduationCap } from "lucide-react";
import { JoinUniversityForm } from "@/components/custom/JoinUniversityForm";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight font-heading">
            Welcome to Looq
          </h1>
          <p className="text-muted-foreground mt-2">
            Let&apos;s get you connected to your university.
          </p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
            <TabsTrigger value="student" className="gap-2">
              <GraduationCap className="h-4 w-4" /> I am a Student
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-2">
              <School className="h-4 w-4" /> I am Staff / Admin
            </TabsTrigger>
          </TabsList>

          {/* STUDENT PATH: Uses your DB + Join Code */}
          <TabsContent value="student">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Join your University</CardTitle>
                <CardDescription>
                  Enter the unique 6-digit code provided by your instructor or
                  registrar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JoinUniversityForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* STAFF PATH: Uses Clerk Organizations */}
          <TabsContent value="staff">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 transition-all hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Register a New University
                  </CardTitle>
                  <CardDescription>
                    For School Admins or Department Heads starting fresh.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateOrganization
                    afterCreateOrganizationUrl="/dashboard"
                    // skipInvitationScreen={true}
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-none p-0",
                      },
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Accept an Invitation
                  </CardTitle>
                  <CardDescription>
                    If a colleague already invited you via email.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrganizationList
                    hidePersonal={true}
                    afterCreateOrganizationUrl="/dashboard"
                    afterSelectOrganizationUrl="/dashboard"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
