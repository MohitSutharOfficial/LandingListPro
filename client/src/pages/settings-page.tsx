import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppLayout from "@/components/layout/app-layout";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Shield, 
  Bell, 
  Mail, 
  Key, 
  PaintBucket, 
  Languages, 
  Save,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Profile settings form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  designation: z.string().optional(),
});

// Password settings form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Current password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "New password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Notification settings form schema
const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyReports: z.boolean(),
  criticalAlerts: z.boolean(),
  attendanceUpdates: z.boolean(),
  performanceReports: z.boolean(),
});

// School settings form schema
const schoolFormSchema = z.object({
  schoolName: z.string(),
  schoolCode: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  principalName: z.string(),
});

// Types for form values
type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type SchoolFormValues = z.infer<typeof schoolFormSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();
  const { toast } = useToast();

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      designation: "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReports: true,
      criticalAlerts: true,
      attendanceUpdates: false,
      performanceReports: true,
    },
  });

  // School form
  const schoolForm = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      schoolName: "Vidyanagar Higher Secondary",
      schoolCode: "VHS001",
      address: "123 Education Lane, Bhavnagar",
      phone: "+91 9876543210",
      email: "principal@vhs.edu",
      principalName: "Dr. Rajesh Mehta",
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    });
    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const onNotificationSubmit = (data: NotificationFormValues) => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const onSchoolSubmit = (data: SchoolFormValues) => {
    toast({
      title: "School settings saved",
      description: "School information has been updated successfully.",
    });
  };

  return (
    <AppLayout title="Settings">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 font-heading">Settings</h1>
        <p className="text-sm text-neutral-500">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-0">
              <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex flex-col h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="profile" 
                    className="justify-start border-r-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-3 text-left"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="justify-start border-r-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-3 text-left"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="justify-start border-r-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-3 text-left"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  {user?.role === "principal" && (
                    <TabsTrigger 
                      value="school" 
                      className="justify-start border-r-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-3 text-left"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      School Settings
                    </TabsTrigger>
                  )}
                  <TabsTrigger 
                    value="appearance" 
                    className="justify-start border-r-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-3 text-left"
                  >
                    <PaintBucket className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="language" 
                    className="justify-start border-r-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-3 text-left"
                  >
                    <Languages className="h-4 w-4 mr-2" />
                    Language
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <TabsContent value="profile" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Designation</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your designation" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your current password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-base font-medium">Notification Channels</h3>
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Push Notifications</FormLabel>
                              <FormDescription>
                                Receive push notifications on your device
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-base font-medium">Notification Types</h3>
                      <FormField
                        control={notificationForm.control}
                        name="weeklyReports"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Weekly Reports</FormLabel>
                              <FormDescription>
                                Receive weekly summary reports
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="criticalAlerts"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Critical Alerts</FormLabel>
                              <FormDescription>
                                Receive notifications for critical issues
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="attendanceUpdates"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Attendance Updates</FormLabel>
                              <FormDescription>
                                Receive daily attendance updates
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="performanceReports"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Performance Reports</FormLabel>
                              <FormDescription>
                                Receive notifications about performance reports
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit">
                      <Bell className="h-4 w-4 mr-2" />
                      Save Notification Preferences
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {user?.role === "principal" && (
            <TabsContent value="school" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>School Settings</CardTitle>
                  <CardDescription>
                    Manage your school information and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...schoolForm}>
                    <form onSubmit={schoolForm.handleSubmit(onSchoolSubmit)} className="space-y-6">
                      <FormField
                        control={schoolForm.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter school name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={schoolForm.control}
                        name="schoolCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter school code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={schoolForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter school address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={schoolForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter school contact number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={schoolForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter school email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={schoolForm.control}
                        name="principalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Principal Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter principal name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save School Settings
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="appearance" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="border-2 border-primary h-20 w-full bg-white rounded-md flex items-center justify-center cursor-pointer">
                          Light
                        </div>
                        <span className="text-xs">Light</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="border-2 border-neutral-300 h-20 w-full bg-neutral-900 text-white rounded-md flex items-center justify-center cursor-pointer">
                          Dark
                        </div>
                        <span className="text-xs">Dark</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="border-2 border-neutral-300 h-20 w-full bg-gradient-to-b from-white to-neutral-900 text-neutral-600 rounded-md flex items-center justify-center cursor-pointer">
                          System
                        </div>
                        <span className="text-xs">System</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Color Scheme</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="border-2 border-primary h-10 w-full bg-primary rounded-md cursor-pointer"></div>
                        <span className="text-xs">Blue</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="border-2 border-neutral-300 h-10 w-full bg-green-600 rounded-md cursor-pointer"></div>
                        <span className="text-xs">Green</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="border-2 border-neutral-300 h-10 w-full bg-purple-600 rounded-md cursor-pointer"></div>
                        <span className="text-xs">Purple</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="border-2 border-neutral-300 h-10 w-full bg-amber-600 rounded-md cursor-pointer"></div>
                        <span className="text-xs">Amber</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={() => toast({ title: "Appearance saved", description: "Your appearance preferences have been saved." })}>
                    <PaintBucket className="h-4 w-4 mr-2" />
                    Save Appearance Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Language Settings</CardTitle>
                <CardDescription>
                  Change the language of the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Select Language</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer bg-neutral-50">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white">
                          ✓
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-medium">English (US)</h4>
                          <p className="text-xs text-neutral-500">United States</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full border border-neutral-200"></div>
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Hindi</h4>
                          <p className="text-xs text-neutral-500">हिन्दी</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full border border-neutral-200"></div>
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Gujarati</h4>
                          <p className="text-xs text-neutral-500">ગુજરાતી</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full border border-neutral-200"></div>
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Marathi</h4>
                          <p className="text-xs text-neutral-500">मराठी</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={() => toast({ title: "Language saved", description: "Your language preference has been saved." })}>
                    <Languages className="h-4 w-4 mr-2" />
                    Save Language Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </AppLayout>
  );
}
