import {
  type LucideIcon,
  LayoutDashboard,
  BarChart3,
  BookOpen,
  Target,
  Smile,
  Bot,
  PlusCircle,
  Calendar,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Laptop,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  ChevronDown,
  MessageCircle,
  Send,
  Sparkles,
  X,
  Timer,
  Search,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  Dashboard: LayoutDashboard,
  Analytics: BarChart3,
  Subject: BookOpen,
  Goal: Target,
  Mood: Smile,
  Bot: Bot,
  Add: PlusCircle,
  Calendar: Calendar,
  Settings: Settings,
  User: User,
  Logout: LogOut,
  Moon: Moon,
  Sun: Sun,
  Laptop: Laptop,
  CheckCircle: CheckCircle,
  XCircle: XCircle,
  FileText: FileText,
  Clock: Clock,
  ChevronDown: ChevronDown,
  Message: MessageCircle,
  Send: Send,
  Sparkles: Sparkles,
  Close: X,
  Timer: Timer,
  Search: Search,
  Logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 12l-2-2.5 2-2.5 2 2.5-2 2.5z" />
      <path d="M12 17.5v-2.5" />
      <path d="M12 9V6.5" />
      <path d="M17.5 12h-2.5" />
      <path d="M9 12H6.5" />
    </svg>
  ),
};
