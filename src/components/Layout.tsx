import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CreditCard, ScanLine, ClipboardList, Settings, Menu, X, Church } from 'lucide-react';
import { t } from '@/lib/i18n';

const navItems = [
  { id: 'members', labelKey: 'navMembers' as const, icon: Users },
  { id: 'nametags', labelKey: 'navNametags' as const, icon: CreditCard },
  { id: 'scan', labelKey: 'navScan' as const, icon: ScanLine },
  { id: 'attendance', labelKey: 'navAttendance' as const, icon: ClipboardList },
  { id: 'settings', labelKey: 'navSettings' as const, icon: Settings },
] as const;

export type PageId = (typeof navItems)[number]['id'];

interface LayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
}

export default function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const i = t();

  return (
    <div className="flex min-h-screen">
      <aside className="no-print hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <Church className="w-7 h-7 text-sidebar-primary" />
          <h1 className="text-lg font-bold">{i.appName}</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                {i[item.labelKey]}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="no-print md:hidden flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <Church className="w-6 h-6 text-accent" />
            <span className="font-bold">{i.appName}</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="no-print md:hidden bg-primary text-primary-foreground overflow-hidden"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm ${
                      currentPage === item.id ? 'bg-accent/20 text-accent' : 'text-primary-foreground/80'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {i[item.labelKey]}
                  </button>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
