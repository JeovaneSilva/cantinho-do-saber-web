import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index"; 
import Alunos from "./pages/Alunos";
import Agenda from "./pages/Agenda";
import Pagamentos from "./pages/Pagamentos";
import Materiais from "./pages/Materiais";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Index />} /> 
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alunos" element={<Alunos />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/pagamentos" element={<Pagamentos />} />
              <Route path="/materiais" element={<Materiais />} />
            </Route>

            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;