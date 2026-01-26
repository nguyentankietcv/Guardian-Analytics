import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { TMALogo } from "./TMALogo";

export function Footer() {
  return (
    <footer id="contact" className="bg-[hsl(220,20%,12%)] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="mb-6" data-testid="footer-logo">
              <TMALogo variant="light" size="md" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              TMA Innovation delivers cutting-edge technology solutions for enterprise 
              digital transformation. T-GUARDIAN is our flagship fraud detection and 
              risk monitoring platform.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="link-linkedin"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:sales@tmasolutions.com" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="link-email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="tel:+84123456789" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="link-phone"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4" data-testid="footer-products">Products</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-product-tguardian">
                  T-GUARDIAN
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-product-tlearning">
                  T-Learning
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-product-mcare">
                  M-Care
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-product-signage">
                  Digital Signage
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4" data-testid="footer-technologies">Technologies</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-tech-bigdata">
                  Big Data & Analytics
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-tech-aiml">
                  AI/ML & Data Science
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-tech-cloud">
                  Cloud & DevOps
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors" data-testid="link-tech-lowcode">
                  Low Code Solutions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4" data-testid="footer-contact">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/70">Business enquiry:</p>
                  <a href="mailto:sales@tmasolutions.com" className="text-sm text-white hover:text-primary transition-colors">
                    sales@tmasolutions.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/70">TMA Tower address:</p>
                  <p className="text-sm text-white">
                    Street #10, Quang Trung Software City, District 12, Ho Chi Minh City
                  </p>
                </div>
              </div>
              <Button className="mt-4 w-full sm:w-auto" data-testid="button-footer-contact">
                Contact Us
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/50" data-testid="text-copyright">
              TMA Solutions CO., LTD. {new Date().getFullYear()} All Rights Reserved
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-white/50 hover:text-white transition-colors" data-testid="link-sitemap">
                Site Map
              </a>
              <a href="#" className="text-sm text-white/50 hover:text-white transition-colors" data-testid="link-privacy">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-white/50 hover:text-white transition-colors" data-testid="link-terms">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
