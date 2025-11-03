import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Bonuses from "./pages/Bonuses";
import HowItWorks from "./pages/HowItWorks";
import Housing from "./pages/Housing";
import FindBuddy from "./pages/FindBuddy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DashboardBonuses from "./pages/DashboardBonuses";
import DashboardHousing from "./pages/DashboardHousing";
import DashboardBuddy from "./pages/DashboardBuddy";
import DashboardDocuments from "./pages/DashboardDocuments";
import DashboardSupport from "./pages/DashboardSupport";
import DashboardSettings from "./pages/DashboardSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
