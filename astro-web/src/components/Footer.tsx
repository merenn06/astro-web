import { Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-t from-primary/5 via-accent/5 to-white dark:from-primary/10 dark:via-accent/10 dark:to-black py-12 px-4 mt-16 border-t border-primary/20 dark:border-primary/30">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Astrolog Dilek Alkan Kara
          </span>
          <span className="text-gray-600 dark:text-gray-300 text-center">
            © {new Date().getFullYear()} Tüm hakları saklıdır.
          </span>
        </div>
        
        {/* Social Links */}
        <div className="flex gap-6 text-primary dark:text-primary">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener" 
            className="hover:text-accent transition-colors p-2 rounded-lg hover:bg-primary/10"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener" 
            className="hover:text-accent transition-colors p-2 rounded-lg hover:bg-primary/10"
            aria-label="YouTube"
          >
            <Youtube className="w-6 h-6" />
          </a>
          <a 
            href="mailto:info@dilekalkankara.com" 
            className="hover:text-accent transition-colors p-2 rounded-lg hover:bg-primary/10"
            aria-label="Email"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">İletişim</span>
          <a 
            href="mailto:info@dilekalkankara.com" 
            className="text-primary dark:text-primary hover:text-accent transition-colors"
          >
            info@dilekalkankara.com
          </a>
        </div>
      </div>
    </footer>
  );
} 