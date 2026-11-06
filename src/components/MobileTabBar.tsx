import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Phone tab bar (mobile-app-shell). Five routes, text only; Sign Up is the one warm cell and
 * becomes "Dashboard" when signed in. Visibility is CSS (src/mobile.css): display:none from
 * 768 px, and under any dialog or focused field. Absent on /dashboard/*, which owns its sidebar.
 */
const MobileTabBar = () => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  if (pathname.startsWith("/dashboard")) return null;

  const tabs = [
    { to: "/", label: "Home" },
    { to: "/bonuses", label: "Bonuses" },
    { to: "/housing", label: "Housing" },
    { to: "/find-buddy", label: "Find Buddy" },
    { to: isAuthenticated ? "/dashboard" : "/signup", label: isAuthenticated ? "Dashboard" : "Sign Up", primary: true },
  ];

  return (
    <nav className="m-tabbar" aria-label="Quick navigation" data-tabbar>
      {tabs.map(({ to, label, primary }) => (
        <Link
          key={to}
          to={to}
          className={primary ? "m-tab-primary" : undefined}
          aria-current={pathname === to ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default MobileTabBar;
