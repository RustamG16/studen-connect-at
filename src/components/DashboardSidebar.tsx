import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Banknote,
  Home,
  Users,
  FileText,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "@/assets/dragonfly-logo.png";

const DashboardSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Bonuses", path: "/dashboard/bonuses", icon: Banknote },
    { name: "My Housing", path: "/dashboard/housing", icon: Home },
    { name: "House Buddy", path: "/dashboard/buddy", icon: Users },
    { name: "Documents", path: "/dashboard/documents", icon: FileText },
    { name: "Chat & Support", path: "/dashboard/support", icon: MessageCircle },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sticky top-0 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-border p-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Care4Students" className="h-10 w-10" />
            <span className="text-xl font-bold text-foreground">Care4Students</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-smooth",
                isActive(item.path)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-4">
          <button
            onClick={() => {
              // Mock logout
              window.location.href = "/";
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
