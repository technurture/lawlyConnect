import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, UserPlus, Briefcase, CheckCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function SignupPage() {
  const [, setLocation] = useLocation();

  const handleSignup = (userType: 'client' | 'lawyer') => {
    setLocation(`/signup/${userType}`);
  };

  const clientFeatures = [
    "Free account setup",
    "AI-powered lawyer matching",
    "Secure messaging",
    "Transparent pricing"
  ];

  const lawyerFeatures = [
    "NBA verification process",
    "Client management tools", 
    "Secure payment processing",
    "Professional profile"
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2" data-testid="link-home">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Lawly</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground" data-testid="text-signup-title">
            Join Nigeria's Premier Legal Platform
          </h2>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-signup-description">
            Choose your account type to get started
          </p>
        </div>

        {/* Signup Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client Signup */}
          <Card className="cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center space-x-2">
                <UserPlus className="h-6 w-6 text-primary" />
                <span>Join as Client</span>
              </CardTitle>
              <CardDescription>
                Find trusted lawyers for your legal needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {clientFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleSignup('client')}
                data-testid="button-signup-client"
              >
                Sign Up as Client
              </Button>
            </CardContent>
          </Card>

          {/* Lawyer Signup */}
          <Card className="cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <span>Join as Lawyer</span>
              </CardTitle>
              <CardDescription>
                Grow your practice with verified clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {lawyerFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleSignup('lawyer')}
                data-testid="button-signup-lawyer"
              >
                Sign Up as Lawyer
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                NBA membership verification required
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline" data-testid="link-login">
              Log in here
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}