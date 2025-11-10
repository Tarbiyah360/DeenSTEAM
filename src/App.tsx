import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import DailyWisdom from "./pages/DailyWisdom";
import STEAMExplorerPage from "./pages/STEAMExplorerPage";
import AlBattaniPage from "./pages/AlBattaniPage";
import JabirIbnHayyanPage from "./pages/JabirIbnHayyanPage";
import IbnSinaPage from "./pages/IbnSinaPage";
import AlKhwarizmiPage from "./pages/AlKhwarizmiPage";
import LessonGeneratorPage from "./pages/LessonGeneratorPage";
import SavedLessons from "./pages/SavedLessons";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AmbassadorDashboard from "./pages/AmbassadorDashboard";
import AmbassadorApplication from "./pages/AmbassadorApplication";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/daily-wisdom" element={<DailyWisdom />} />
            <Route path="/steam-explorer" element={<STEAMExplorerPage />} />
            <Route path="/scientist/al-battani" element={<AlBattaniPage />} />
            <Route path="/scientist/jabir-ibn-hayyan" element={<JabirIbnHayyanPage />} />
            <Route path="/scientist/ibn-sina" element={<IbnSinaPage />} />
            <Route path="/scientist/al-khwarizmi" element={<AlKhwarizmiPage />} />
            <Route path="/lesson-generator" element={<LessonGeneratorPage />} />
            <Route path="/saved-lessons" element={<SavedLessons />} />
            <Route path="/community" element={<Community />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ambassador-dashboard" element={<AmbassadorDashboard />} />
            <Route path="/ambassador-application" element={<AmbassadorApplication />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
