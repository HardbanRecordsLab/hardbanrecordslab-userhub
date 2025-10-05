import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MusicDashboard from "./pages/MusicDashboard";
import AIStudio from "./pages/AIStudio";
import StrategyGenerator from "./pages/StrategyGenerator";
import ContentGenerator from "./pages/ContentGenerator";
import ContactsManager from "./pages/ContactsManager";
import PublicationCalendar from "./pages/PublicationCalendar";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import RevenueTracker from "./pages/RevenueTracker";
import BrandAssets from "./pages/BrandAssets";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/music" element={
              <ProtectedRoute>
                <MusicDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/ai-studio" element={
              <ProtectedRoute>
                <AIStudio />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/strategy-generator" element={
              <ProtectedRoute>
                <StrategyGenerator />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/content-generator" element={
              <ProtectedRoute>
                <ContentGenerator />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/contacts" element={
              <ProtectedRoute>
                <ContactsManager />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/calendar" element={
              <ProtectedRoute>
                <PublicationCalendar />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analytics" element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/revenue" element={
              <ProtectedRoute>
                <RevenueTracker />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/brand-assets" element={
              <ProtectedRoute>
                <BrandAssets />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
