import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingScreen from "@/components/LoadingScreen";
import MobileTabBar from "@/components/MobileTabBar";
import { lazy, Suspense, useEffect } from "react";
const Index = lazy(() => import("./pages/Index"));
const Bonuses = lazy(() => import("./pages/Bonuses"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Housing = lazy(() => import("./pages/Housing"));
const FindBuddy = lazy(() => import("./pages/FindBuddy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Legal = lazy(() => import("./pages/Legal"));
const Blog = lazy(() => import("./pages/Blog"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardBonuses = lazy(() => import("./pages/DashboardBonuses"));
const DashboardHousing = lazy(() => import("./pages/DashboardHousing"));
const DashboardBuddy = lazy(() => import("./pages/DashboardBuddy"));
const DashboardDocuments = lazy(() => import("./pages/DashboardDocuments"));
const DashboardSupport = lazy(() => import("./pages/DashboardSupport"));
const DashboardSettings = lazy(() => import("./pages/DashboardSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

/** Scroll to top on PUSH navigation only; POP (back/forward) keeps the browser's own restoration. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType === "PUSH") window.scrollTo(0, 0);
  }, [pathname, navType]);
  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/bonuses" element={<Bonuses />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/housing" element={<Housing />} />
            <Route path="/find-buddy" element={<FindBuddy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/bonuses"
              element={
                <ProtectedRoute>
                  <DashboardBonuses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/housing"
              element={
                <ProtectedRoute>
                  <DashboardHousing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/buddy"
              element={
                <ProtectedRoute>
                  <DashboardBuddy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/documents"
              element={
                <ProtectedRoute>
                  <DashboardDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/support"
              element={
                <ProtectedRoute>
                  <DashboardSupport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <DashboardSettings />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <MobileTabBar />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
