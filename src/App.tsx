// routes ok
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
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
import ProgramDetail from "@/pages/ProgramDetail";
import GameLanding from "@/pages/GameLanding";
import GameSession from "@/pages/GameSession";
import ClubLogin from "@/pages/ClubLogin";
import ClubTeacher from "@/pages/ClubTeacher";
import ClubStudent from "@/pages/ClubStudent";
import BookDashboard from "@/pages/BookDashboard";
import BookChapter from "@/pages/BookChapter";
import BookLogin from "@/pages/BookLogin";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import BookFounderDashboard from "@/pages/BookFounderDashboard";
import MarketGame from "@/pages/MarketGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/game" element={<GameLanding />} />
          <Route path="/game/:code" element={<GameSession />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/chapter/:id" element={<ChapterDetail />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/community" element={<Community />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/book-login" element={<BookLogin />} />
          <Route path="/book-founder" element={<BookFounderDashboard />} />
          <Route path="/book-admin" element={<BookFounderDashboard />} />
          <Route path="/book" element={<BookDashboard />} />
          <Route path="/book/:id" element={<BookChapter />} />
          <Route path="/market-game" element={<MarketGame />} />
          <Route path="/club" element={<ClubLogin />} />
          <Route path="/club/teacher" element={<ClubTeacher />} />
          <Route path="/club/student" element={<ClubStudent />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
