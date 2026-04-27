import Link from "next/link";
import { Heart, LayoutDashboard } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex" suppressHydrationWarning>
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2 text-slate-800 font-bold font-serif text-xl">
            <Heart className="text-pink-500 w-6 h-6" />
            Eternity
          </Link>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-md bg-slate-100 text-slate-900 font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 text-xs text-slate-500" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} Eternity Builder
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 md:hidden">
          <Link href="/" className="flex items-center gap-2 text-slate-800 font-bold font-serif text-xl">
            <Heart className="text-pink-500 w-6 h-6" />
            Eternity
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
