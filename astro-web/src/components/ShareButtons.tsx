"use client";
import { usePathname } from "next/navigation";
import { Clipboard, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  excerpt?: string;
}

export default function ShareButtons({ title, excerpt }: ShareButtonsProps) {
  const pathname = usePathname();
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';
  const url = `https://${domain}${pathname}`;
  const [copied, setCopied] = useState(false);
  
  // Create share text with title and excerpt
  const shareText = excerpt 
    ? `${title} - ${excerpt.slice(0, 100)}...`
    : title;

  const buttons = [
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(url)}`,
      Icon: MessageCircle,
      color: "bg-[#25D366] hover:bg-[#22c55e]",
      ariaLabel: "WhatsApp ile paylaş"
    },
    {
      name: "Instagram",
      url: `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
      Icon: Instagram,
      color: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] hover:from-[#f9d56a] hover:via-[#d62976] hover:to-[#4f5bd5]",
      ariaLabel: "Instagram ile paylaş"
    }
  ];

  function trackShare(platform: string) {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "share_click", { 
        event_category: "engagement",
        event_label: platform,
        value: 1
      });
    }
  }

  // Copy link function
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackShare("CopyLink");
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Paylaş:
        </span>
        <div className="flex gap-2">
          {buttons.map(({ name, url, Icon, color, ariaLabel }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              onClick={() => trackShare(name)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 ${color} shadow-sm hover:shadow-md`}
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
          
          {/* Copy Link Button */}
          <button
            onClick={copyLink}
            aria-label="Linki kopyala"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <Clipboard className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      {/* Copy success message */}
      {copied && (
        <div className="mt-2 text-sm text-green-600 dark:text-green-400 animate-fade-in">
          ✓ Link kopyalandı!
        </div>
      )}
    </div>
  );
} 