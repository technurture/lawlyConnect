import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function CTASection() {
  const benefits = [
    "Free account setup and case intake",
    "AI-powered lawyer matching", 
    "Secure messaging and file sharing",
    "Transparent pricing with no hidden fees"
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl md:text-5xl font-bold mb-6" data-testid="text-cta-title">
            Ready to Connect with Nigeria's Top Lawyers?
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90" data-testid="text-cta-description">
            Join thousands who have found trusted legal help through our AI-powered platform.
            Get started in minutes, not days.
          </p>

          {/* Benefits List */}
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 text-left"
                data-testid={`benefit-${index}`}
              >
                <CheckCircle className="h-5 w-5 text-chart-3 flex-shrink-0" />
                <span className="text-primary-foreground/90">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup">
              <Button 
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6"
                data-testid="button-cta-get-started"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                size="lg"
                variant="outline"
                className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 text-lg px-8 py-6"
                data-testid="button-cta-browse-lawyers"
              >
                Browse Lawyers
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-primary-foreground/80">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>NBA verified lawyers only</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Secure & confidential</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}