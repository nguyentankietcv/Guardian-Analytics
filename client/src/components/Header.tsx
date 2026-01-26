import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { TMALogo } from "./TMALogo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2" data-testid="logo-container">
            <TMALogo variant="light" size="md" />
          </div>

          <nav className="hidden md:flex items-center gap-8" data-testid="nav-desktop">
            <a 
              href="#home" 
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
              data-testid="link-home"
            >
              Home
            </a>
            <a 
              href="#features" 
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
              data-testid="link-features"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
              data-testid="link-how-it-works"
            >
              How It Works
            </a>
            <a 
              href="#contact" 
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
              data-testid="link-contact"
            >
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-white text-white bg-transparent"
              data-testid="button-contact"
            >
              Contact Us
            </Button>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div 
          className={`md:hidden pb-4 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden invisible'}`}
          data-testid="nav-mobile"
        >
            <nav className="flex flex-col gap-4">
              <a 
                href="#home" 
                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-home-mobile"
              >
                Home
              </a>
              <a 
                href="#features" 
                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-features-mobile"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-how-it-works-mobile"
              >
                How It Works
              </a>
              <a 
                href="#contact" 
                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-contact-mobile"
              >
                Contact
              </a>
              <Button 
                variant="outline" 
                className="border-white text-white bg-transparent w-fit"
                data-testid="button-contact-mobile"
              >
                Contact Us
              </Button>
            </nav>
          </div>
      </div>
    </header>
  );
}
