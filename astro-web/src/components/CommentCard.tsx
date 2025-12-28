'use client';
import { useState, useRef, useLayoutEffect } from 'react';
import { MessageSquareQuote, Star, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

interface Comment {
  id: number;
  name: string;
  email: string;
  content: string;
  isApproved: boolean;
  isHighlighted: boolean;
  createdAt: string;
}

interface CommentCardProps {
  comment: Comment;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function CommentCard({ comment }: CommentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const isOverflowing = contentRef.current.scrollHeight - contentRef.current.clientHeight > 1;
    setShowToggle(isOverflowing);
  }, [comment.content]);

  const handleToggle = () => {
    setExpanded(p => !p);
    if (!expanded) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  return (
    <div
      id={`comment-${comment.id}`}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col gap-4 relative"
    >
      <MessageSquareQuote className="w-8 h-8 text-purple-400 mb-2" />
      <div className="relative flex flex-col space-y-1">
        <p
          ref={contentRef}
          className={clsx(
            "text-gray-800 dark:text-gray-200 text-base leading-relaxed transition-all",
            expanded ? "" : "line-clamp-3"
          )}
        >
          {comment.content}
        </p>
        {!expanded && showToggle && (
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
        )}
        {showToggle && (
          <button
            onClick={handleToggle}
            aria-expanded={expanded}
            className="mt-2 inline-flex items-center text-violet-600 hover:underline font-medium focus:outline-none"
            data-testid="toggle-link"
          >
            {expanded ? "Gizle" : "Devamını oku"}
            {expanded ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="font-semibold text-gray-900 dark:text-white">{comment.name}</span>
        <span className="text-gray-400 text-xs">{formatDate(comment.createdAt)}</span>
        {comment.isHighlighted && <Star className="h-4 w-4 text-amber-400 ml-1" />}
      </div>
    </div>
  );
} 