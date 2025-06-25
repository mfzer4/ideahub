import React, { useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { MoreHorizontal, UserCircle, GripVertical, Eye, Edit, MessageSquare, Phone, Mail, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from '@/App';
import { sellersData } from '@/data/crmData';

const CrmTaskCard = ({ task, columnId, index, openModal, onDeleteTask }) => {
  const { toast } = useToast();
  const appContext = useContext(AppContext);
  const currentUser = appContext ? appContext.currentUser : null;
  
  const assignedSeller = sellersData.find(s => s.id === task.assignedTo);

  const handleAction = (actionType) => {
    switch(actionType) {
      case "Ver Detalhes": openModal('view', task, columnId); break;
      case "Editar": openModal('edit', task, columnId); break;
      case "Adicionar Nota": openModal('note', task, columnId); break;
      case "Registrar Ligação": openModal('logCall', task, columnId); break;
      case "Enviar Email": openModal('sendEmail', task, columnId); break;
      case "Excluir": 
        onDeleteTask(task.id, columnId);
        toast({
          title: `Ação: ${actionType}`,
          description: `Projeto "${task.title}" foi excluído.`,
          variant: "destructive"
        });
        break;
      default: 
        toast({
          title: `Ação: ${actionType}`,
          description: `Ação ${actionType} para "${task.title}".`,
        });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    dragging: { scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          variants={cardVariants}
          initial="hidden"
          animate={snapshot.isDragging ? "dragging" : "visible"}
          exit="hidden"
          layout
          className={cn("mb-3 select-none", snapshot.isDragging && "opacity-90")}
        >
          <Card className="bg-card/70 dark:bg-card/40 border-primary/20 hover:shadow-xl transition-all duration-200 relative group">
            <div {...provided.dragHandleProps} className="absolute top-1/2 -translate-y-1/2 left-1 p-1.5 cursor-grab text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={18} />
            </div>
            <CardHeader className="p-3 pl-8 border-b border-border/30">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm text-foreground truncate" title={task.title}>{task.title}</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
                    <DropdownMenuItem onClick={() => handleAction('Ver Detalhes')} className="hover:!bg-primary/10 focus:!bg-primary/10"><Eye className="mr-2 h-4 w-4" /> Ver Detalhes</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('Editar')} className="hover:!bg-primary/10 focus:!bg-primary/10"><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAction('Adicionar Nota')} className="hover:!bg-primary/10 focus:!bg-primary/10"><MessageSquare className="mr-2 h-4 w-4" /> Adicionar Nota</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('Registrar Ligação')} className="hover:!bg-primary/10 focus:!bg-primary/10"><Phone className="mr-2 h-4 w-4" /> Registrar Ligação</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('Enviar Email')} className="hover:!bg-primary/10 focus:!bg-primary/10"><Mail className="mr-2 h-4 w-4" /> Enviar Email</DropdownMenuItem>
                    {currentUser && currentUser.roleName === 'Admin' && ( // Ajustado para roleName
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction('Excluir')} className="text-red-500 hover:!text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2.5">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                 <UserCircle className="h-4 w-4 text-primary/70" />
                <span className="truncate" title={task.clientName}>Cliente: {task.clientName}</span>
              </div>
             {assignedSeller && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={`https://source.unsplash.com/random/50x50/?person&sig=${assignedSeller.id}`} />
                    <AvatarFallback className="text-xs bg-primary/20 text-primary">{assignedSeller.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <span className="truncate" title={assignedSeller.name}>Resp: {assignedSeller.name}</span>
                </div>
              )}
              <div className="w-full bg-muted rounded-full h-2 dark:bg-muted/50">
                <motion.div 
                  className={cn("h-2 rounded-full", 
                    task.progress === 100 ? "bg-green-500" : "bg-primary"
                  )} 
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.slice(0, 3).map(tag => ( 
                  <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary/80 border-primary/20">{tag}</Badge>
                ))}
                {task.tags.length > 3 && <Badge variant="outline" className="text-xs">+{task.tags.length - 3}</Badge>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Draggable>
  );
};

export default CrmTaskCard;