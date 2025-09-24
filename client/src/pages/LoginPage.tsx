import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, UserCheck, Briefcase } from "lucide-react";
import { Link } from "wouter";

export default function LoginPage() {
  const handleLogin = (userType: 'client' | 'lawyer') => {
    window.location.href = `/api/login?userType=${userType}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2" data-testid="link-home">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Lawly</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground" data-testid="text-login-title">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-login-description">
            Choose how you'd like to access your account
          </p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => handleLogin('client')}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center space-x-2">
                <UserCheck className="h-6 w-6 text-primary" />
                <span>Continue as Client</span>
              </CardTitle>
              <CardDescription>
                I need legal services and want to find a lawyer
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                className="w-full" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogin('client');
                }}
                data-testid="button-login-client"
              >
                Login as Client
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => handleLogin('lawyer')}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <span>Continue as Lawyer</span>
              </CardTitle>
              <CardDescription>
                I'm a verified lawyer offering legal services
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                className="w-full" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogin('lawyer');
                }}
                data-testid="button-login-lawyer"
              >
                Login as Lawyer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline" data-testid="link-signup">
              Sign up here
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}