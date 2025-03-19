import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema, User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, UserCog, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
}).extend({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const registerSchema = insertUserSchema.extend({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

// Mock user for development
const mockUser: User = {
  id: 1,
  username: "admin",
  password: "hashed_password",
  name: "Admin User",
  email: "admin@bhavnagar.gov.in",
  role: "admin",
  schoolId: null,
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(true);
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [loginPending, setLoginPending] = useState(false);
  const [registerPending, setRegisterPending] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/");
    }
    setIsLoading(false);
  }, [navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Registration form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
      role: "teacher",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    setLoginPending(true);
    // Simplified login logic - store user if username and password provided
    if (data.username && data.password) {
      // Store mock user in localStorage
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
      
      // Navigate to dashboard
      navigate("/");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
    setLoginPending(false);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    setRegisterPending(true);
    // Simplified registration logic
    const { confirmPassword, ...userData } = data;
    
    // Create a new user with the provided data
    const newUser: User = {
      ...userData,
      id: 2, // Mock ID
      role: userData.role || "user",
      schoolId: null,
    };
    
    // Store the new user in localStorage
    localStorage.setItem("user", JSON.stringify(newUser));
    
    toast({
      title: "Registration successful",
      description: `Welcome, ${newUser.name}!`,
    });
    
    navigate("/");
    setRegisterPending(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-neutral-50 p-4 md:p-0">
      <div className="flex w-full flex-col md:flex-row">
        {/* Left column (forms) */}
        <div className="md:w-1/2 flex justify-center items-center p-4">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-primary font-heading">School Monitoring System</h1>
              <p className="mt-2 text-sm text-neutral-500">
                Bhavnagar Municipal Corporation
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                      Enter your credentials below to continue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={loginPending}
                        >
                          {loginPending ? "Logging in..." : "Login"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start text-sm text-neutral-500">
                    <p>Don't have an account? 
                      <Button 
                        variant="link" 
                        className="p-0 px-1 text-primary h-auto"
                        onClick={() => setActiveTab("register")}
                      >
                        Register
                      </Button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Fill in your details to create an account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                  {...field}
                                >
                                  <option value="teacher">Teacher</option>
                                  <option value="principal">Principal</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={registerPending}
                        >
                          {registerPending ? "Creating Account..." : "Create Account"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start text-sm text-neutral-500">
                    <p>Already have an account? 
                      <Button 
                        variant="link" 
                        className="p-0 px-1 text-primary h-auto"
                        onClick={() => setActiveTab("login")}
                      >
                        Login
                      </Button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right column (hero) */}
        <div className="hidden md:flex md:w-1/2 bg-primary p-8 text-white items-center justify-center">
          <div className="max-w-md space-y-6">
            <div className="flex flex-col space-y-2">
              <h2 className="text-3xl font-bold font-heading">School Monitoring System</h2>
              <p className="text-primary-100">
                A comprehensive platform for the Bhavnagar Municipal Corporation 
                to monitor and improve school performance.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <School className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">School Dashboard & Analytics</h3>
                  <p className="text-sm text-primary-100">Get real-time analytics and insights for all municipal schools</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <UserCog className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Performance Tracking</h3>
                  <p className="text-sm text-primary-100">Track teacher and student performance with AI-powered insights</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <ChevronRight className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Automated Reporting</h3>
                  <p className="text-sm text-primary-100">Generate and share reports automatically with stakeholders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
