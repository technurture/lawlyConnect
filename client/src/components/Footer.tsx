import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "How It Works", href: "#how-it-works" },
        { name: "Find Lawyers", href: "#lawyers" },
        { name: "Pricing", href: "#pricing" },
        { name: "For Lawyers", href: "#for-lawyers" }
      ]
    },
    {
      title: "Legal Areas",
      links: [
        { name: "Corporate Law", href: "#corporate" },
        { name: "Family Law", href: "#family" },
        { name: "Property Law", href: "#property" },
        { name: "Criminal Defense", href: "#criminal" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Contact Us", href: "#contact" },
        { name: "Legal Resources", href: "#resources" },
        { name: "FAQ", href: "#faq" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Blog", href: "#blog" },
        { name: "Press", href: "#press" }
      ]
    }
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Lawly</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm" data-testid="text-footer-description">
              Nigeria's leading AI-powered legal platform connecting verified lawyers 
              with clients for transparent, secure, and efficient legal services.
            </p>
            <Button data-testid="button-footer-join">
              Join Lawly Today
            </Button>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="font-semibold mb-4" data-testid={`text-footer-section-${index}`}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      data-testid={`link-footer-${section.title.toLowerCase()}-${linkIndex}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
              <span data-testid="text-copyright">
                © 2025 Lawly. All rights reserved.
              </span>
              <div className="flex space-x-6">
                <a href="#privacy" className="hover:text-foreground transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </a>
                <a href="#terms" className="hover:text-foreground transition-colors" data-testid="link-terms">
                  Terms of Service
                </a>
                <a href="#compliance" className="hover:text-foreground transition-colors" data-testid="link-compliance">
                  NBA Compliance
                </a>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground" data-testid="text-compliance">
              Nigerian Bar Association Verified Platform
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}