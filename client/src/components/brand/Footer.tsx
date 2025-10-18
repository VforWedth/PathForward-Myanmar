import Link from 'next/link';
import { Logo } from './Logo';
import { brandMessaging } from '@/config/brand';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--brand-primary)] text-white border-t border-[var(--brand-primary-dark)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo
              size="md"
              showText={true}
              linkTo="/"
              textClassName="text-white"
            />
            <p className="text-white/80 text-sm leading-relaxed">
              {brandMessaging.description}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-white/80 hover:text-white transition text-sm">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white/80 hover:text-white transition text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/80 hover:text-white transition text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-white/80 hover:text-white transition text-sm">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Users</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/student/dashboard" className="text-white/80 hover:text-white transition text-sm">
                  Students
                </Link>
              </li>
              <li>
                <Link href="/freelancer/dashboard" className="text-white/80 hover:text-white transition text-sm">
                  Freelancers
                </Link>
              </li>
              <li>
                <Link href="/company/dashboard" className="text-white/80 hover:text-white transition text-sm">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/university/dashboard" className="text-white/80 hover:text-white transition text-sm">
                  Universities
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/80" />
                <a href="mailto:info@pathforward.mm" className="text-white/80 hover:text-white transition">
                  info@pathforward.mm
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/80" />
                <a href="tel:+95123456789" className="text-white/80 hover:text-white transition">
                  +95 (1) 234-5678
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/80" />
                <span className="text-white/80">
                  Yangon, Myanmar
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/70 text-sm text-center md:text-left">
              © {currentYear} {brandMessaging.name}. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-white/70 hover:text-white transition text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/70 hover:text-white transition text-sm">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-white/70 hover:text-white transition text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Compact footer for dashboards
export function CompactFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-[var(--brand-text-secondary)] text-sm text-center md:text-left">
            © {currentYear} {brandMessaging.name} - {brandMessaging.tagline}
          </p>
          <div className="flex space-x-4">
            <Link href="/faq" className="text-[var(--brand-text-secondary)] hover:text-[var(--brand-primary)] transition text-sm">
              Help
            </Link>
            <Link href="/privacy" className="text-[var(--brand-text-secondary)] hover:text-[var(--brand-primary)] transition text-sm">
              Privacy
            </Link>
            <Link href="/terms" className="text-[var(--brand-text-secondary)] hover:text-[var(--brand-primary)] transition text-sm">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
