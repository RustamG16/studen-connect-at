import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Bonuses from "./pages/Bonuses";
import HowItWorks from "./pages/HowItWorks";
import Housing from "./pages/Housing";
import FindBuddy from "./pages/FindBuddy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import Blog from "./pages/Blog";
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/bonuses" element={<DashboardBonuses />} />
          <Route path="/dashboard/housing" element={<DashboardHousing />} />
          <Route path="/dashboard/buddy" element={<DashboardBuddy />} />
          <Route path="/dashboard/documents" element={<DashboardDocuments />} />
          <Route path="/dashboard/support" element={<DashboardSupport />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
