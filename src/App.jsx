import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardPage from '@/pages/DashboardPage';
import UsersPage from '@/pages/UsersPage';
import ClaimsPage from '@/pages/ClaimsPage';
import PoliciesPage from '@/pages/PoliciesPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import ProspectsPage from '@/pages/ProspectsPage';
import RegistrationTasksPage from '@/pages/RegistrationTasksPage';
import HelpPage from '@/pages/HelpPage';
import CrmPage from '@/pages/CrmPage';
import SellersPage from '@/pages/SellersPage';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

const PlaceholderComponent = ({ title, message, showImage = true }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
    <p className="text-muted-foreground mb-8">{message || "Conteúdo em breve..."}</p>
    {showImage && <img  className="mt-8 w-1/2 max-w-md opacity-50" alt="Placeholder" src="https://images.unsplash.com/photo-1693349215728-a07e968ae462" />}
  </div>
);

export const AppContext = createContext(null);

const App = () => {
  const [loadingApp, setLoadingApp] = useState(true);

  const mockCurrentUser = {
    id: 'mock-admin-id',
    email: 'admin@example.com',
    name: 'Admin Mockado',
    avatarFallback: 'AM',
    avatarUrl: null,
    roleId: 'mock-admin-role-id',
    roleName: 'Admin',
    role_permissions: ["/", "/dashboard", "/crm", "/prospeccoes", "/tarefas-cadastro", "/apolices", "/usuarios", "/vendedores", "/sinistros", "/relatorios", "/configuracoes", "/ajuda", "/acesso-negado"],
    status: 'Ativo',
  };
  
  const mockUsersAuth = [mockCurrentUser]; // Para ReportsPage

  useEffect(() => {
    // Simula um tempo de carregamento inicial, se necessário
    setTimeout(() => {
      setLoadingApp(false);
    }, 500); 
  }, []);


  const appRoutes = [
    { path: "/", element: <DashboardPage /> },
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/crm", element: <CrmPage /> },
    { path: "/prospeccoes", element: <ProspectsPage /> },
    { path: "/tarefas-cadastro", element: <RegistrationTasksPage /> },
    { path: "/apolices", element: <PoliciesPage /> },
    { path: "/usuarios", element: <UsersPage /> },
    { path: "/vendedores", element: <SellersPage /> },
    { path: "/sinistros", element: <ClaimsPage /> },
    { path: "/relatorios", element: <ReportsPage /> },
    { path: "/configuracoes", element: <SettingsPage /> },
    { path: "/ajuda", element: <HelpPage /> },
  ];

  if (loadingApp) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ currentUser: mockCurrentUser, usersAuth: mockUsersAuth }}>
      <ThemeProvider>
        <TooltipProvider>
          <Router>
            <Routes>
              {appRoutes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <DashboardLayout>{route.element}</DashboardLayout>
                  }
                />
              ))}
              <Route path="*" element={<DashboardLayout><PlaceholderComponent title="404 - Página Não Encontrada" message="A página que você está procurando não existe ou foi movida." /></DashboardLayout>} />
            </Routes>
          </Router>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;