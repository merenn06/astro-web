"use client";
import { usePathname } from "next/navigation";
import { Facebook, Linkedin, Twitter, Share2, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  excerpt?: string;
}

export default function ShareButtons({ title, excerpt }: ShareButtonsProps) {
  const pathname = usePathname();
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';
  const url = `https://${domain}${pathname}`;
  
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
      name: "X",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
      Icon: Twitter,
      color: "bg-black hover:bg-gray-800",
      ariaLabel: "X (Twitter) ile paylaş"
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      Icon: Linkedin,
      color: "bg-[#0A66C2] hover:bg-[#0d4b8f]",
      ariaLabel: "LinkedIn ile paylaş"
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      Icon: Facebook,
      color: "bg-[#1877F2] hover:bg-[#166fe5]",
      ariaLabel: "Facebook ile paylaş"
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
              onClick={() => trackShare(name.toLowerCase())}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 ${color} shadow-sm hover:shadow-md`}
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
} 