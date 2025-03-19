import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarIcon, Check, Search, Filter, Loader2, FileText, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Attendance, Student, Teacher } from "@shared/schema";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("students");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const { toast } = useToast();

  // Format selected date
  const formattedDate = date ? format(date, "PP") : "Select date";

  // Fetch attendance records for selected date
  const { data: attendanceRecords, isLoading: attendanceLoading } = useQuery<Attendance[]>({
    queryKey: ["/api/attendance", date?.toISOString().split("T")[0], schoolFilter],
    enabled: !!date,
  });

  // Fetch schools
  const { data: schools } = useQuery({
    queryKey: ["/api/schools"],
  });

  // Fetch students and teachers
  const { data: students, isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
    enabled: activeTab === "students",
  });

  const { data: teachers, isLoading: teachersLoading } = useQuery<Teacher[]>({
    queryKey: ["/api/teachers"],
    enabled: activeTab === "teachers",
  });

  // Mutation for marking attendance
  const markAttendanceMutation = useMutation({
    mutationFn: async (data: { 
      date: string, 
      schoolId: number, 
      personId: number, 
      type: "student" | "teacher", 
      status: "present" | "absent" | "late" 
    }) => {
      return apiRequest("POST", "/api/attendance", {
        date: data.date,
        schoolId: data.schoolId,
        ...(data.type === "student" ? { studentId: data.personId } : { teacherId: data.personId }),
        type: data.type,
        status: data.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      toast({
        title: "Attendance updated",
        description: "Attendance has been marked successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to mark attendance",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter students based on search and school filter
  const filteredStudents = students?.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSchool = schoolFilter === "all" || student.schoolId === parseInt(schoolFilter);
    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter;
    
    return matchesSearch && matchesSchool && matchesGrade;
  });

  // Filter teachers based on search and school filter
  const filteredTeachers = teachers?.filter(teacher => {
    // We don't have direct access to teacher name here, so we just filter by schoolId
    const matchesSchool = schoolFilter === "all" || teacher.schoolId === parseInt(schoolFilter);
    return matchesSchool;
  });

  // Check if a person is marked present/absent
  const getAttendanceStatus = (personId: number, type: "student" | "teacher"): "present" | "absent" | "late" | undefined => {
    if (!attendanceRecords) return undefined;
    
    const record = attendanceRecords.find(record => {
      if (type === "student") {
        return record.studentId === personId && record.type === "student";
      } else {
        return record.teacherId === personId && record.type === "teacher";
      }
    });
    
    return record?.status as any;
  };

  // Mark attendance for a person
  const handleMarkAttendance = (personId: number, schoolId: number, type: "student" | "teacher", status: "present" | "absent" | "late") => {
    if (!date) return;
    
    markAttendanceMutation.mutate({
      date: date.toISOString(),
      schoolId,
      personId,
      type,
      status,
    });
  };

  // Get unique grades from students
  const uniqueGrades = [...new Set(students?.map(student => student.grade))];

  return (
    <AppLayout title="Attendance">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-neutral-800 font-heading">Attendance Management</h1>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formattedDate}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="students">Students Attendance</TabsTrigger>
            <TabsTrigger value="teachers">Teachers Attendance</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={schoolFilter} onValueChange={setSchoolFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools?.map(school => (
                  <SelectItem key={school.id} value={school.id.toString()}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeTab === "students" && (
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {uniqueGrades?.map(grade => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="students" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Students Attendance Sheet</CardTitle>
              <CardDescription>
                Mark attendance for students on {formattedDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentsLoading || attendanceLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredStudents && filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student, index) => {
                        const schoolName = schools?.find(s => s.id === student.schoolId)?.name || "Unknown";
                        const status = getAttendanceStatus(student.id, "student");
                        
                        return (
                          <TableRow key={student.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.rollNumber}</TableCell>
                            <TableCell>{student.grade}</TableCell>
                            <TableCell>{student.section}</TableCell>
                            <TableCell>{schoolName}</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                status === "present" ? "bg-green-100 text-green-800" :
                                status === "absent" ? "bg-red-100 text-red-800" :
                                status === "late" ? "bg-yellow-100 text-yellow-800" :
                                "bg-neutral-100 text-neutral-800"
                              }`}>
                                {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Not marked"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant={status === "present" ? "default" : "outline"} 
                                  size="sm"
                                  onClick={() => handleMarkAttendance(student.id, student.schoolId, "student", "present")}
                                  className="h-8 px-2"
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Present
                                </Button>
                                <Button 
                                  variant={status === "absent" ? "destructive" : "outline"} 
                                  size="sm"
                                  onClick={() => handleMarkAttendance(student.id, student.schoolId, "student", "absent")}
                                  className="h-8 px-2"
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Absent
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-500">
                  No students found. {searchQuery && "Try a different search term."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Teachers Attendance Sheet</CardTitle>
              <CardDescription>
                Mark attendance for teachers on {formattedDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teachersLoading || attendanceLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredTeachers && filteredTeachers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Teacher ID</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Subjects</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeachers.map((teacher, index) => {
                        const schoolName = schools?.find(s => s.id === teacher.schoolId)?.name || "Unknown";
                        const status = getAttendanceStatus(teacher.id, "teacher");
                        
                        return (
                          <TableRow key={teacher.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{teacher.id}</TableCell>
                            <TableCell>{schoolName}</TableCell>
                            <TableCell>{teacher.subjects?.join(", ") || "N/A"}</TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                status === "present" ? "bg-green-100 text-green-800" :
                                status === "absent" ? "bg-red-100 text-red-800" :
                                status === "late" ? "bg-yellow-100 text-yellow-800" :
                                "bg-neutral-100 text-neutral-800"
                              }`}>
                                {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Not marked"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant={status === "present" ? "default" : "outline"} 
                                  size="sm"
                                  onClick={() => handleMarkAttendance(teacher.id, teacher.schoolId, "teacher", "present")}
                                  className="h-8 px-2"
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Present
                                </Button>
                                <Button 
                                  variant={status === "absent" ? "destructive" : "outline"} 
                                  size="sm"
                                  onClick={() => handleMarkAttendance(teacher.id, teacher.schoolId, "teacher", "absent")}
                                  className="h-8 px-2"
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Absent
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-500">
                  No teachers found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
