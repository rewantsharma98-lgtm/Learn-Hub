import { PlayCircle, Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-white/5 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <PlayCircle size={24} />
              </div>
              <span className="text-white text-lg font-black uppercase tracking-widest">MarshallLMS</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Empowering students with industry-standard knowledge and syllabus-compliant resources. Your journey to excellence starts here.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink icon={<FaTwitter size={18} />} href="#" />
              <SocialLink icon={<FaGithub size={18} />} href="#" />
              <SocialLink icon={<FaLinkedinIn size={18} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">Quick Links</h4>
            <ul className="space-y-4">
              <FooterLink to="/courses">Explore Courses</FooterLink>
              <FooterLink to="/my-courses">My Learning</FooterLink>
              <FooterLink to="/profile">Profile Settings</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">Support</h4>
            <ul className="space-y-4">
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/contact">Contact Support</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary shrink-0">
                  <Mail size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                  <p className="text-white/80 text-xs truncate">support@marshall-lms.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Location</p>
                  <p className="text-white/80 text-xs">Innovation Hub, Tech City</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} MarshallLMS. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ icon, href }) {
  return (
    <a 
      href={href} 
      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/20"
    >
      {icon}
    </a>
  );
}
