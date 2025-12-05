import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MusicDashboard from "./pages/MusicDashboard";
import AdminMusicReview from "./pages/AdminMusicReview";
import AIStudio from "./pages/AIStudio";
import StrategyGenerator from "./pages/StrategyGenerator";
import ContentGenerator from "./pages/ContentGenerator";
import PrometheusAI from "./pages/PrometheusAI";
import PrometheusAutomation from "./pages/PrometheusAutomation";
import PrometheusNewsroom from "./pages/PrometheusNewsroom";
import PrometheusPodcasts from "./pages/PrometheusPodcasts";
import PrometheusARVR from "./pages/PrometheusARVR";
import ContactsManager from "./pages/ContactsManager";
import PublicationCalendar from "./pages/PublicationCalendar";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import RevenueTracker from "./pages/RevenueTracker";
import BrandAssets from "./pages/BrandAssets";
import ComprehensiveReport from "./pages/ComprehensiveReport";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MarketingDashboard from "./pages/MarketingDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FAQ from "./pages/FAQ";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />
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
            <Route path="/dashboard/marketing" element={
              <ProtectedRoute>
                <MarketingDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/admin/music-review" element={
              <ProtectedRoute>
                <AdminMusicReview />
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
            <Route path="/prometheus-ai" element={
              <ProtectedRoute>
                <PrometheusAI />
              </ProtectedRoute>
            } />
            <Route path="/prometheus-automation" element={
              <ProtectedRoute>
                <PrometheusAutomation />
              </ProtectedRoute>
            } />
            <Route path="/prometheus-newsroom" element={
              <ProtectedRoute>
                <PrometheusNewsroom />
              </ProtectedRoute>
            } />
            <Route path="/prometheus-podcasts" element={
              <ProtectedRoute>
                <PrometheusPodcasts />
              </ProtectedRoute>
            } />
            <Route path="/prometheus-arvr" element={
              <ProtectedRoute>
                <PrometheusARVR />
              </ProtectedRoute>
            } />
            <Route path="/comprehensive-report" element={
              <ProtectedRoute>
                <ComprehensiveReport />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
