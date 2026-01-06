import { useMemo, useState } from "react";
import { BarChart3, AlertTriangle, Users, Settings, BookOpenCheck, Layers3, CheckCircle2 } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const mockStudents = [
  {
    id: "1",
    name: "Alex P.",
    ventureName: "EcoSnack Junior",
    status: "Building" as const,
    progress: 68,
    lastLoginDays: 1,
    latestPlan:
      "Our mission is to reduce plastic waste at school by offering reusable snack boxes and a student-run refill station.",
  },
  {
    id: "2",
    name: "Maria K.",
    ventureName: "Pet Pals Service",
    status: "Ideating" as const,
    progress: 35,
    lastLoginDays: 4,
    latestPlan:
      "A weekend service where students help neighbours with basic pet care, tracked through a simple booking board.",
  },
  {
    id: "3",
    name: "Nikos T.",
    ventureName: "Study Buddy App",
    status: "Revenue" as const,
    progress: 82,
    lastLoginDays: 2,
    latestPlan:
      "We match older students with younger ones for 30-minute study sessions and test a small subscription for families.",
  },
  {
    id: "4",
    name: "Eleni D.",
    ventureName: "Green School Market",
    status: "Building" as const,
    progress: 50,
    lastLoginDays: 5,
    latestPlan:
      "Monthly school market selling upcycled crafts and plants, co-managed by different classes as mini-teams.",
  },
];

type StudentStatus = "Ideating" | "Building" | "Revenue";

const statusVariant: Record<StudentStatus, "outline" | "default" | "secondary"> = {
  Ideating: "outline",
  Building: "default",
  Revenue: "secondary",
};

const TeacherPortal = () => {
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return mockStudents;
    return mockStudents.filter(
      (s) => s.name.toLowerCase().includes(term) || s.ventureName.toLowerCase().includes(term),
    );
  }, [search]);

  const totalActiveProjects = mockStudents.filter((s) => s.status !== "Ideating").length;
  const averageProgress =
    mockStudents.reduce((sum, s) => sum + s.progress, 0) / (mockStudents.length || 1);
  const redFlags = mockStudents.filter((s) => s.lastLoginDays >= 3).length;

  const selectedStudent = mockStudents.find((s) => s.id === selectedStudentId) || null;

  const handleOpenDrawer = (id: string) => {
    const student = mockStudents.find((s) => s.id === id) || null;
    setSelectedStudentId(id);
    setFeedback(student?.latestPlan ? "" : "");
  };

  const handleCloseDrawer = () => {
    setSelectedStudentId(null);
    setFeedback("");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_hsl(var(--background))_0,_hsl(var(--background))_35%,_hsl(var(--muted))_100%)] text-foreground">
        <div className="flex w-full min-h-screen">
          {/* Fixed Teacher Sidebar */}
          <Sidebar variant="inset" collapsible="icon" className="border-r bg-sidebar/95">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2 text-xs font-semibold tracking-tight">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="truncate">Teacher Portal</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive size="sm" className="text-xs">
                        <Layers3 className="h-4 w-4" />
                        <span>Classrooms</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton size="sm" className="text-xs">
                        <BookOpenCheck className="h-4 w-4" />
                        <span>Curriculum Editor</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton size="sm" className="text-xs">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="bg-gradient-to-br from-background via-background/95 to-card/95">
            <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border/60 bg-background/70 backdrop-blur-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Teacher View</p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
                  Administration Dashboard
                  <Badge
                    variant="outline"
                    className="text-[0.65rem] uppercase tracking-wide border-primary/60 text-primary px-2 py-0.5"
                  >
                    Graphite × Mint
                  </Badge>
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <SidebarTrigger className="hidden md:inline-flex" />
              </div>
            </header>

            <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full space-y-8">
              {/* Class Overview Metrics */}
              <section className="grid gap-4 md:grid-cols-3 animate-enter">
                <Card className="border border-border/80 bg-card/95 shadow-md hover-scale">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                      <Layers3 className="h-4 w-4 text-primary" />
                      Total Active Projects
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Ventures currently in the build or revenue phase.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold">{totalActiveProjects}</span>
                    <span className="text-xs text-muted-foreground">across this classroom</span>
                  </CardContent>
                </Card>

                <Card className="border border-border/80 bg-card/95 shadow-md hover-scale">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                      <BarChart3 className="h-4 w-4 text-emerald-400" />
                      Average Progress
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Mean completion across all student ventures.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-1 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Class average</span>
                      <span>{Math.round(averageProgress)}%</span>
                    </div>
                    <Progress value={averageProgress} className="h-2.5 bg-muted" />
                  </CardContent>
                </Card>

                <Card className="border border-border/80 bg-card/95 shadow-md hover-scale">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      Red Flags
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Students inactive for 3+ days.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex items-center gap-3">
                    <span className="text-3xl font-semibold text-amber-400">{redFlags}</span>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Use this list to decide who needs a quick check-in or encouragement.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Student Management Table */}
              <section className="space-y-4 animate-enter">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-2">
                      Student Ventures
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Search across your classroom and review progress before approving next steps.
                    </p>
                  </div>
                  <div className="w-full sm:w-64">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by student or venture name"
                      className="h-9 text-sm bg-background/80 border-border/70"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border/80 bg-card/95 shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 text-left">Student</th>
                        <th className="px-4 py-2 text-left">Venture Name</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Progress</th>
                        <th className="px-4 py-2 text-left hidden md:table-cell">Last Login</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-t border-border/60">
                          <td className="px-4 py-2 align-middle">
                            <div className="flex flex-col">
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 align-middle">
                            <p className="truncate max-w-xs text-muted-foreground">{student.ventureName}</p>
                          </td>
                          <td className="px-4 py-2 align-middle">
                            <Badge variant={statusVariant[student.status]} className="text-[0.7rem]">
                              {student.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 align-middle w-40">
                            <div className="flex items-center gap-2">
                              <Progress value={student.progress} className="h-2 bg-muted" />
                              <span className="text-xs text-muted-foreground w-10 text-right">
                                {student.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2 align-middle hidden md:table-cell text-xs text-muted-foreground">
                            {student.lastLoginDays === 0
                              ? "Today"
                              : `${student.lastLoginDays} day${student.lastLoginDays > 1 ? "s" : ""} ago`}
                          </td>
                          <td className="px-4 py-2 align-middle text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => handleOpenDrawer(student.id)}
                            >
                              Review &amp; Approve
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                            No students match this search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <Drawer open={!!selectedStudent} onOpenChange={(open) => !open && handleCloseDrawer()}>
                <DrawerContent className="max-h-[90vh]">
                  <DrawerHeader className="border-b border-border/80 bg-background/90">
                    <DrawerTitle className="flex items-center justify-between gap-3 text-base sm:text-lg">
                      <span>
                        Approve Venture — {selectedStudent?.name}
                      </span>
                      {selectedStudent && (
                        <Badge variant={statusVariant[selectedStudent.status]} className="text-[0.65rem]">
                          {selectedStudent.status}
                        </Badge>
                      )}
                    </DrawerTitle>
                  </DrawerHeader>

                  <div className="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto">
                    <section className="space-y-2">
                      <h3 className="text-sm font-semibold tracking-tight">Latest business plan draft</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground bg-muted/40 border border-border/60 rounded-md p-3 leading-relaxed">
                        {selectedStudent?.latestPlan ?? "No draft has been submitted yet."}
                      </p>
                    </section>

                    <section className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold tracking-tight">Mentor feedback</h3>
                        <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">Visible to student</span>
                      </div>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Highlight what works, where to focus next week, and one concrete action."
                        className="min-h-[120px] text-sm bg-background/80 border-border/70"
                      />
                    </section>
                  </div>

                  <DrawerFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/80 bg-background/90">
                    <p className="text-[0.7rem] text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      Feedback is stored locally for now. Use it as a script during your live discussion.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <DrawerClose asChild>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </DrawerClose>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-primary-foreground">
                        Mark as Approved
                      </Button>
                    </div>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeacherPortal;
