import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, MessageSquareText, FileSearch, CreditCard } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Create Your Account",
      description: "Sign up and tell us about your legal needs through our guided intake form."
    },
    {
      icon: <FileSearch className="h-8 w-8" />,
      title: "AI Case Analysis",
      description: "Our AI analyzes your case details and matches you with specialized lawyers."
    },
    {
      icon: <MessageSquareText className="h-8 w-8" />,
      title: "Connect with Lawyers",
      description: "Review lawyer profiles, read reviews, and start secure conversations."
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Secure Payment",
      description: "Book consultations with escrow protection and transparent pricing."
    }
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-how-it-works-title">
            How Lawly Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-how-it-works-description">
            Get connected with the right lawyer in minutes, not days. 
            Our streamlined process makes legal services accessible and transparent.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="relative hover-elevate" data-testid={`card-step-${index}`}>
              <CardContent className="p-6 text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <div className="mt-4 mb-4 text-primary flex justify-center">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-2" data-testid={`text-step-title-${index}`}>
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-sm" data-testid={`text-step-description-${index}`}>
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-card rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4" data-testid="text-ready-cta-title">
            Ready to Get Started?
          </h3>
          <p className="text-muted-foreground mb-6" data-testid="text-ready-cta-description">
            Join thousands of Nigerians who have found trusted legal help through Lawly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" data-testid="button-start-case">
              Start Your Case
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" data-testid="button-browse-lawyers">
              Browse Lawyers
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}