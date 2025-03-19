import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Search, Filter, MoreHorizontal } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Teacher, User } from "@shared/schema";

interface TeacherWithUser extends Teacher {
  user?: User;
}

export default function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  
  // Fetch teachers with user details
  const { data: teachers, isLoading: teachersLoading } = useQuery<TeacherWithUser[]>({
    queryKey: ["/api/teachers"],
  });

  // Fetch schools for filter
  const { data: schools } = useQuery({
    queryKey: ["/api/schools"],
  });

  // Fetch users to join with teachers
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Join teacher data with user data
  const teachersWithUserData = teachers?.map(teacher => {
    const user = users?.find(u => u.id === teacher.userId);
    return { ...teacher, user };
  });

  // Filter teachers based on search query and school filter
  const filteredTeachers = teachersWithUserData?.filter(teacher => {
    const matchesSearch = teacher.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        teacher.user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        teacher.subjects?.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        teacher.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSchool = schoolFilter === "all" || teacher.schoolId === parseInt(schoolFilter);
    
    return matchesSearch && matchesSchool;
  });

  return (
    <AppLayout title="Teachers">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-neutral-800 font-heading">Teachers Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Teacher
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Teachers Directory</CardTitle>
              <CardDescription>
                Manage all the teachers in Bhavnagar Municipal Corporation schools
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                <Input
                  type="search"
                  placeholder="Search teachers..."
                  className="pl-8"
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
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {teachersLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTeachers && filteredTeachers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead>Joining Date</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => {
                    const schoolName = schools?.find(s => s.id === teacher.schoolId)?.name || "Unknown";
                    const formattedDate = new Date(teacher.joiningDate).toLocaleDateString();
                    
                    return (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.user?.name || "N/A"}</TableCell>
                        <TableCell>{schoolName}</TableCell>
                        <TableCell>
                          {teacher.subjects?.join(", ") || "N/A"}
                        </TableCell>
                        <TableCell>{teacher.qualification}</TableCell>
                        <TableCell>{formattedDate}</TableCell>
                        <TableCell>
                          {teacher.performanceScore ? (
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              teacher.performanceScore >= 80 ? "bg-green-100 text-green-800" :
                              teacher.performanceScore >= 60 ? "bg-blue-100 text-blue-800" :
                              teacher.performanceScore >= 40 ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {teacher.performanceScore}%
                            </span>
                          ) : (
                            <span className="text-neutral-500 text-sm">Not evaluated</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Performance History</DropdownMenuItem>
                              <DropdownMenuItem>Edit Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center text-neutral-500">
              No teachers found. {searchQuery && "Try a different search term."}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
