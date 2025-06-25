import React, { useState, useEffect, useContext } from 'react';
import { Bell, Check, X, Clock, AlertTriangle, Info, FileText, UserCheck, DollarSign, Shield, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { supabase } from '@/lib/supabaseClient'; // Supabase removido
import { AppContext } from '@/App';
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const iconMap = {
  FileText, UserCheck, DollarSign, Shield, Target, Info, AlertTriangle, Clock,
  default: Info,
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const appContext = useContext(AppContext);
  const currentUser = appContext?.currentUser;
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!currentUser || !currentUser.roleId) return;

    // Lógica de busca de notificações removida pois o Supabase foi desconectado.
    // console.log('Supabase client não está disponível. Notificações não podem ser buscadas.');
    // Exemplo de dados mockados para manter a UI:
    const mockNotifications = [
      { id: '1', task_title: 'Revisar Contrato Cliente X (Mock)', deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), priority: 'Alta', role_id: currentUser.roleId, created_at: new Date().toISOString(), is_read: false, icon: 'FileText', target_url: '/prospeccoes' },
      { id: '2', task_title: 'Aprovar Férias Funcionário Y (Mock)', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), priority: 'Média', role_id: currentUser.roleId, created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), is_read: true, icon: 'UserCheck', target_url: '/usuarios' },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
  };

  useEffect(() => {
    fetchNotifications();
    // Lógica de subscription do Supabase removida.
  }, [currentUser?.roleId]);

  const handleMarkAsRead = async (notificationId) => {
    // Lógica do Supabase removida.
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    // toast({ title: "Notificação marcada como lida (simulado)" });
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser || !currentUser.roleId) return;
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) {
      toast({ title: "Nenhuma notificação nova", description: "Todas as suas notificações já foram lidas." });
      return;
    }
    // Lógica do Supabase removida.
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    toast({ title: "Notificações Lidas!", description: "Todas as notificações foram marcadas como lidas (simulado).", className: "bg-primary text-primary-foreground" });
  };
  
  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.target_url) {
      navigate(notification.target_url);
    }
    setIsOpen(false);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Alta': return 'text-red-500 border-red-500/50 bg-red-500/10';
      case 'Média': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
      case 'Baixa': return 'text-blue-500 border-blue-500/50 bg-blue-500/10';
      default: return 'text-gray-500 border-gray-500/50 bg-gray-500/10';
    }
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || iconMap.default;
    return <IconComponent className="w-4 h-4 mr-2" />;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-foreground/10 text-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96 bg-popover/90 backdrop-blur-md border-primary/20 shadow-xl p-0">
        <DropdownMenuLabel className="flex justify-between items-center p-3 border-b border-border">
          <span className="font-semibold text-foreground">Notificações</span>
          {notifications.length > 0 && unreadCount > 0 && (
            <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary hover:underline" onClick={handleMarkAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <ScrollArea className="h-[300px] md:h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-muted-foreground">
              <Bell className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Nenhuma notificação por aqui.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "p-3 border-b border-border/50 last:border-b-0 cursor-pointer focus:bg-primary/10",
                  !notification.is_read && "bg-primary/5 dark:bg-primary/10"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start w-full">
                  <div className={cn("mr-3 mt-1", getPriorityClass(notification.priority).split(' ')[0])}>
                    {getIcon(notification.icon)}
                  </div>
                  <div className="flex-grow">
                    <p className={cn("text-sm font-medium text-foreground", !notification.is_read && "font-bold")}>
                      {notification.task_title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {notification.deadline && (
                        <>
                          Prazo: {formatDistanceToNow(parseISO(notification.deadline), { addSuffix: true, locale: ptBR })}
                          <span className="mx-1">·</span>
                        </>
                      )}
                       {formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                     <div className="flex items-center mt-1.5 gap-2">
                        <Badge variant="outline" className={cn("text-xs px-1.5 py-0.5", getPriorityClass(notification.priority))}>
                            {notification.priority}
                        </Badge>
                        {currentUser?.roleName && (
                             <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-muted/50 text-muted-foreground border-muted/20">
                                {currentUser.roleName}
                            </Badge>
                        )}
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div className="ml-2 mt-1 h-2 w-2 rounded-full bg-primary self-center shrink-0" title="Não lida"></div>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <DropdownMenuSeparator className="my-0" />
        )}
        <DropdownMenuItem 
            className="p-3 justify-center text-sm text-primary hover:!bg-primary/10 focus:!bg-primary/10 cursor-pointer"
            onClick={() => {
                toast({ title: "Funcionalidade em breve!", description: "Página para ver todas as notificações será implementada."});
                setIsOpen(false);
            }}
        >
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;