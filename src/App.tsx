import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import STEAMExplorerPage from "./pages/STEAMExplorerPage";
import AlBattaniPage from "./pages/AlBattaniPage";
import JabirIbnHayyanPage from "./pages/JabirIbnHayyanPage";
import IbnSinaPage from "./pages/IbnSinaPage";
import AlKhwarizmiPage from "./pages/AlKhwarizmiPage";
import AlZahrawiPage from "./pages/AlZahrawiPage";
import FatimaAlFihriPage from "./pages/FatimaAlFihriPage";
import AbbasIbnFirnasPage from "./pages/AbbasIbnFirnasPage";
import AlJazariPage from "./pages/AlJazariPage";
import LessonGeneratorPage from "./pages/LessonGeneratorPage";
import LessonPlanDisplay from "./pages/LessonPlanDisplay";
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
            <Route path="/" element={<LessonGeneratorPage />} />
            <Route path="/about" element={<Index />} />
            <Route path="/steam-explorer" element={<STEAMExplorerPage />} />
            <Route path="/scientist/al-battani" element={<AlBattaniPage />} />
            <Route path="/scientist/jabir-ibn-hayyan" element={<JabirIbnHayyanPage />} />
            <Route path="/scientist/ibn-sina" element={<IbnSinaPage />} />
            <Route path="/scientist/al-khwarizmi" element={<AlKhwarizmiPage />} />
            <Route path="/scientist/al-zahrawi" element={<AlZahrawiPage />} />
            <Route path="/scientist/fatima-al-fihri" element={<FatimaAlFihriPage />} />
            <Route path="/scientist/abbas-ibn-firnas" element={<AbbasIbnFirnasPage />} />
            <Route path="/scientist/al-jazari" element={<AlJazariPage />} />
            <Route path="/lesson-generator" element={<LessonGeneratorPage />} />
            <Route path="/lesson-plan" element={<LessonPlanDisplay />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
