import React, { useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, Settings, User, ChevronRight, Maximize, Minimize, LogOut as LogOutIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from 'framer-motion';
import { AppContext } from '@/App';
import { useToast } from "@/components/ui/use-toast";
import NotificationBell from '@/components/NotificationBell'; // Importado

const getPathFriendlyName = (path) => {
  if (path === '/') return 'Dashboard';
  const name = path.substring(1).replace(/-/g, ' ');
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="breadcrumb" className="flex items-center">
      <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        Ecosistema
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <React.Fragment key={name}>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            {isLast ? (
              <span className="text-sm font-semibold text-primary">{getPathFriendlyName(name)}</span>
            ) : (
              <Link to={routeTo} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {getPathFriendlyName(name)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
      {location.pathname === '/' && (
         <>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <span className="text-sm font-semibold text-primary">Dashboard</span>
         </>
      )}
    </nav>
  );
};


const Header = () => {
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const appContext = useContext(AppContext);
  const currentUser = appContext ? appContext.currentUser : null;
  const { toast } = useToast();


  const handleLogout = () => {
    toast({
      title: "Funcionalidade de Logout",
      description: "🚧 Este recurso de logout não está ativo, pois o sistema de login foi removido. 🚀",
    });
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-primary/20 bg-card/30 dark:bg-card/10 backdrop-blur-lg px-4 md:px-6"
    >
      <div className="flex items-center">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar em tudo..."
            className="w-full rounded-lg bg-background/50 pl-10 md:w-[200px] lg:w-[300px] border-primary/20 focus:border-primary"
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="rounded-full hover:bg-foreground/10 text-foreground">
                {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-popover text-popover-foreground border-none shadow-xl backdrop-blur-md bg-opacity-80">
              <p>{isFullScreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <ThemeToggle />

        <NotificationBell /> {/* Substituído o sino estático */}

        {!currentUser ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9 border-2 border-primary/50">
                  <AvatarImage src={currentUser.avatarUrl || `https://source.unsplash.com/random/100x100/?person&sig=${currentUser.id}`} alt={currentUser.name} />
                  <AvatarFallback className="bg-primary/20 text-primary">{currentUser.avatarFallback || currentUser.name?.substring(0,2).toUpperCase() || '??'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover/80 backdrop-blur-md border-primary/20 shadow-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-foreground">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="hover:!bg-primary/10 focus:!bg-primary/10 cursor-pointer">
                <Link to="/configuracoes" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:!bg-primary/10 focus:!bg-primary/10 cursor-pointer">
                 <Link to="/configuracoes" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:!text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10 cursor-pointer flex items-center">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.header>
  );
};

export default Header;