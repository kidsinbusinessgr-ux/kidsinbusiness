import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Chapters from "@/pages/Chapters";
import ChapterDetail from "@/pages/ChapterDetail";
import Actions from "@/pages/Actions";
import Teachers from "@/pages/Teachers";
import Community from "@/pages/Community";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import FounderDashboard from "@/pages/FounderDashboard";
import VentureBuilder from "@/pages/VentureBuilder";
import Marketplace from "@/pages/Marketplace";
import MarketplaceDetail from "@/pages/MarketplaceDetail";
import StudentReview from "@/pages/StudentReview";
import StudentWallet from "@/components/StudentWallet";
import MentorReview from "@/components/MentorReview";
import StudentWorkspace from "@/pages/StudentWorkspace";
import Programs from "@/pages/Programs";
import StudentWorkbook from "@/pages/StudentWorkbook";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/student" element={<StudentWorkspace />} />
          <Route path="/workbook" element={<StudentWorkbook />} />
          <Route path="/wallet" element={<StudentWallet />} />
          <Route path="/founder" element={<FounderDashboard />} />
          <Route path="/venture-builder" element={<VentureBuilder />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<MarketplaceDetail />} />
          <Route path="/teacher-portal" element={<MentorReview />} />
          <Route path="/teacher/review/:studentId" element={<StudentReview />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/chapter/:id" element={<ChapterDetail />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/community" element={<Community />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
