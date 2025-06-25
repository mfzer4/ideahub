import React, { useState, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldAlert, FileText, FileSpreadsheet, ChevronRight, ChevronLeft, LayoutDashboard, Settings, LogOut as LogOutIcon, Building, Target, HelpCircle, Briefcase, KeyRound as UsersRoundIcon, ListChecks, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/App';
import { useToast } from "@/components/ui/use-toast";

const NavItem = ({ to, icon: Icon, text, isCollapsed, currentPath, isDisabled }) => {
  const isActive = currentPath === to || (currentPath.startsWith(to) && to !== "/" && to.length > 1) || (currentPath === "/" && to === "/dashboard");


  const linkClass = cn(
    "flex items-center py-3 px-4 rounded-lg transition-all duration-200 ease-in-out",
    isActive ? "bg-primary/10 text-primary font-semibold shadow-md" : "text-muted-foreground",
    isCollapsed ? "justify-center" : "",
    isDisabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : "hover:bg-primary/20 hover:text-foreground"
  );

  if (isDisabled) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={linkClass}>
              <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    {text}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-background/80 backdrop-blur-md border-foreground/20 shadow-xl text-foreground">
            <p>{text} (Acesso Negado)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink to={to} className={linkClass}>
            <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  {text}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="bg-background/80 backdrop-blur-md border-foreground/20 shadow-xl text-foreground">
            <p>{text}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const appContext = useContext(AppContext);
  const currentUser = appContext ? appContext.currentUser : null;
  const { toast } = useToast();
  
  const handleLogout = () => {
     toast({
      title: "Funcionalidade de Logout",
      description: "🚧 Este recurso de logout não está ativo, pois o sistema de login foi removido. 🚀",
    });
  };

  const navItemsConfig = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/crm", icon: Briefcase, text: "CRM" },
    { to: "/prospeccoes", icon: Target, text: "Prospecções" },
    { to: "/tarefas-cadastro", icon: ListChecks, text: "Tarefas de Cadastro" },
    { to: "/apolices", icon: FileText, text: "Apólices Cadastradas" },
    { to: "/usuarios", icon: Users, text: "Usuários" },
    { to: "/vendedores", icon: UsersRoundIcon, text: "Vendedores" }, 
    { to: "/sinistros", icon: ShieldAlert, text: "Sinistros" },
    { to: "/relatorios", icon: FileSpreadsheet, text: "Relatórios" },
  ];

  const bottomNavItemsConfig = [
    { to: "/configuracoes", icon: Settings, text: "Configurações" },
    { to: "/ajuda", icon: HelpCircle, text: "Ajuda & Suporte" },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  if (!currentUser) { // Se não há usuário mockado, não mostra nada (ou um loader)
    return (
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '5rem' : '16rem' }}
        className="h-screen sticky top-0 flex flex-col items-center justify-center bg-card/50 dark:bg-card/20 backdrop-blur-xl border-r border-primary/30 dark:border-primary/10 p-4 shadow-2xl z-40"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </motion.aside>
    );
  }
  
  const userPermissions = currentUser.role_permissions || [];
  const isAdmin = currentUser.roleName === 'Admin';

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col bg-card/50 dark:bg-card/20 backdrop-blur-xl border-r border-primary/30 dark:border-primary/10 p-4 shadow-2xl z-40"
    >
      <div className="flex items-center mb-8" style={{ paddingLeft: isCollapsed ? '0.25rem' : '0rem', justifyContent: isCollapsed ? 'center': 'space-between' }}>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center"
          >
            <Building className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-500 to-green-400">Ecosistema</span>
          </motion.div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-grow space-y-1.5 pr-1 custom-scrollbar overflow-y-auto">
        {navItemsConfig.map(item => {
          // Com login removido, todas as rotas são permitidas para o usuário mockado
          const isDisabled = false; 
          return (
            <NavItem 
              key={item.to} 
              {...item} 
              isCollapsed={isCollapsed} 
              currentPath={location.pathname} 
              isDisabled={isDisabled}
            />
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-primary/10 space-y-1.5">
        {bottomNavItemsConfig.map(item => (
           <NavItem 
            key={item.to} 
            {...item} 
            isCollapsed={isCollapsed} 
            currentPath={location.pathname} 
            isDisabled={false} // Todas permitidas
          />
        ))}
         <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center w-full py-3 px-4 rounded-lg transition-all duration-200 ease-in-out text-muted-foreground hover:bg-destructive/20 hover:text-destructive",
                            isCollapsed ? "justify-center" : ""
                        )}
                    >
                        <LogOutIcon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                        <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-nowrap"
                            >
                            Sair
                            </motion.span>
                        )}
                        </AnimatePresence>
                    </button>
                </TooltipTrigger>
                {isCollapsed && (
                <TooltipContent side="right" className="bg-background/80 backdrop-blur-md border-destructive/20 shadow-xl text-destructive">
                    <p>Sair</p>
                </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>

        {currentUser && (
          <div className={cn("flex items-center p-2 mt-2 border-t border-primary/10 pt-3", isCollapsed ? "justify-center" : "")}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser.avatarUrl || `https://source.unsplash.com/random/100x100/?person&sig=${currentUser.id}`} alt={currentUser.name} />
              <AvatarFallback className="bg-primary/20 text-primary">{currentUser.avatarFallback || currentUser.name?.substring(0,2).toUpperCase() || '??'}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="ml-3"
              >
                <p className="text-sm font-medium text-foreground truncate max-w-[120px]">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">{currentUser.roleName || 'Cargo desconhecido'}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;