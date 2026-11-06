import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import DragonflyMark from "@/components/brand/DragonflyMark";
import AuthCta from "@/components/AuthCta";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const SCROLL_THRESHOLD = 80;

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Bonuses", path: "/bonuses" },
  { name: "Housing", path: "/housing" },
  { name: "Find Buddy", path: "/find-buddy" },
  { name: "Guide", path: "/how-it-works" },
  { name: "FAQ", path: "/faq" },
];

const Navbar = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Transparent on canvas; past 80 px a full-bleed square depth bar. The phone bar never hides.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;
  const barClass = scrolled ? "bg-depth text-canvas" : "bg-background text-foreground";

  return (
    <nav
      aria-label="Main"
      data-ground={scrolled ? "depth" : undefined}
      className={`sticky top-0 z-40 transition-colors duration-150 ease-out ${barClass}`}
    >
      <div className="shell-x">
        <div className="flex items-center justify-between gap-4" style={{ height: "var(--nav-h)" }}>
          <Link to="/" className="press -ml-1 flex min-h-11 items-center gap-2 pr-2 md:mr-2">
            <DragonflyMark className={`h-9 w-9 shrink-0 transition-colors duration-150 ease-out md:h-10 md:w-10 ${scrolled ? "text-canvas" : "text-depth"}`} />
            <span className="nav-name text-base font-extrabold tracking-tight lg:text-lg">
              Care4Students
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden flex-1 items-center gap-5 md:flex lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? "page" : undefined}
                className={`t-nav-link press relative inline-flex min-h-11 items-center link-underline ${
                  isActive(link.path)
                    ? "after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 after:bg-current"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Button variant="nav" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="nav" className="gap-2 border border-current">
                      <User className="h-4 w-4" />
                      <span className="max-w-[16ch] truncate">{user?.name || user?.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{user?.name || "User"}</div>
                      <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="nav" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="warm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Phone: 44 px menu button, bottom sheet with every route */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="press -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="p-0 text-foreground" aria-describedby={undefined}>
              <SheetTitle className="sr-only">Toggle menu</SheetTitle>
              <ul className="pb-[env(safe-area-inset-bottom)] pt-12">
                {navLinks.map((link) => (
                  <li key={link.path} className="border-t border-border first:border-t-0">
                    <SheetClose asChild>
                      <Link
                        to={link.path}
                        aria-current={isActive(link.path) ? "page" : undefined}
                        className={`flex min-h-12 items-center px-4 text-base active:bg-canvas ${
                          isActive(link.path) ? "font-bold text-foreground" : "font-medium text-foreground"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
                {isAuthenticated ? (
                  <>
                    <li className="border-t border-border">
                      <SheetClose asChild>
                        <Link to="/dashboard" className="flex min-h-12 items-center px-4 text-base font-medium active:bg-canvas">
                          Dashboard
                        </Link>
                      </SheetClose>
                    </li>
                    <li className="border-t border-border">
                      <SheetClose asChild>
                        <Link to="/dashboard/settings" className="flex min-h-12 items-center px-4 text-base font-medium active:bg-canvas">
                          Settings
                        </Link>
                      </SheetClose>
                    </li>
                    <li className="border-t border-border">
                      <SheetClose asChild>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex min-h-12 w-full items-center gap-2 px-4 text-left text-base font-medium text-destructive active:bg-canvas"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </SheetClose>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="border-t border-border">
                      <SheetClose asChild>
                        <Link to="/login" className="flex min-h-12 items-center px-4 text-base font-medium active:bg-canvas">
                          Login
                        </Link>
                      </SheetClose>
                    </li>
                    <li className="border-t border-border">
                      <SheetClose asChild>
                        <AuthCta className="flex min-h-12 items-center bg-warm px-4 text-base font-bold text-warm-ink active:brightness-95">
                          Sign Up
                        </AuthCta>
                      </SheetClose>
                    </li>
                  </>
                )}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
