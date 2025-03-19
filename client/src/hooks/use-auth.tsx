import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { InsertUser, User as SelectUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Mock user for development
const mockUser: SelectUser = {
  id: 1,
  username: "admin",
  password: "hashed_password",
  name: "Admin User",
  email: "admin@bhavnagar.gov.in",
  role: "admin",
  schoolId: null,
};

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<SelectUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Check if user is already logged in (using localStorage for development)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // For development, accept any credentials and return mockUser
      if (credentials.username && credentials.password) {
        return mockUser;
      }
      throw new Error("Invalid username or password");
    },
    onSuccess: (user: SelectUser) => {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      // For development, just return a user with the data provided
      const newUser: SelectUser = {
        ...userData,
        id: 2, // Mock ID
        role: userData.role || "user",
        schoolId: userData.schoolId || null,
      };
      return newUser;
    },
    onSuccess: (user: SelectUser) => {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // For development, just clear the localStorage
      return Promise.resolve();
    },
    onSuccess: () => {
      setUser(null);
      localStorage.removeItem("user");
      toast({
        title: "Logged out successfully",
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
