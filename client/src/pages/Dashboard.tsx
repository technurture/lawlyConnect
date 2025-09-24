// Dashboard page for authenticated users
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type User } from "@shared/schema";
import { 
  Scale, 
  Users, 
  FileText, 
  MessageSquare, 
  CreditCard,
  Plus,
  LogOut
} from "lucide-react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  
  // Type assertion for the user object from useAuth
  const typedUser = user as User | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!typedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access your dashboard.</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        window.location.href = '/api/login';
      }
    } catch (error) {
      // Fallback to GET method
      window.location.href = '/api/logout';
    }
  };

  const isLawyer = typedUser.userType === 'lawyer';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Scale className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Lawly
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={typedUser.profileImageUrl || undefined} />
                  <AvatarFallback>
                    {`${typedUser.firstName?.[0] || ''}${typedUser.lastName?.[0] || ''}`.toUpperCase() || typedUser.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300" data-testid="text-username">
                    {typedUser.firstName && typedUser.lastName 
                      ? `${typedUser.firstName} ${typedUser.lastName}` 
                      : typedUser.email
                    }
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {isLawyer ? 'Lawyer' : 'Client'}
                  </Badge>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {typedUser.firstName || 'User'}!
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {isLawyer 
              ? "Manage your cases and connect with clients"
              : "Find legal help and manage your cases"
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {!isLawyer && (
            <Card className="hover-elevate cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Case
                </CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">Get Help</div>
                <p className="text-xs text-muted-foreground">
                  Start a new legal consultation
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="hover-elevate cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isLawyer ? 'Your Cases' : 'My Cases'}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                {isLawyer ? 'Active client cases' : 'Cases in progress'}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Unread messages
              </p>
            </CardContent>
          </Card>

          {isLawyer && (
            <Card className="hover-elevate cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦0</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Cases</CardTitle>
              <CardDescription>
                {isLawyer 
                  ? "Your latest client cases" 
                  : "Your recent legal matters"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  No cases yet. {!isLawyer && "Click 'Get Help' to start your first case."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isLawyer ? 'Available Opportunities' : 'Recommended Lawyers'}
              </CardTitle>
              <CardDescription>
                {isLawyer 
                  ? "New cases matching your expertise" 
                  : "Top-rated lawyers in your area"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  {isLawyer 
                    ? "No new opportunities available." 
                    : "Browse lawyers when you're ready to start a case."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Setup Reminder */}
        {isLawyer && !typedUser.isVerified && (
          <Card className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-300">
                Verify your credentials to start accepting cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300">
                Set Up Lawyer Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}