import { Button } from "@/components/ui/button";
import { Scale, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "For Lawyers", href: "#for-lawyers" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2" data-testid="logo-lawly">
          <Scale className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Lawly</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid={`link-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Link href="/login">
            <Button variant="ghost" data-testid="button-login">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button data-testid="button-get-started">
              Get Started
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`link-mobile-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-login">
                  Log In
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button className="w-full" data-testid="button-mobile-get-started">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}