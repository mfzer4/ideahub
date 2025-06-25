import React, { useState, useContext, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, PlusCircle, Filter, Search, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from '@/App';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import CrmTaskCard from '@/components/crm/CrmTaskCard';
import CrmModal from '@/components/crm/CrmModal';
import { initialColumnsData, sellersData } from '@/data/crmData';

const CrmPage = () => {
  const [columns, setColumns] = useState(initialColumnsData);
  const { toast } = useToast();
  const appContext = useContext(AppContext);
  const currentUser = appContext ? appContext.currentUser : null;
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: null, task: null, columnId: null });

  useEffect(() => {
    if (currentUser && currentUser.roleName === 'Vendedor') { // Ajustado para roleName
      const filteredColumns = {};
      Object.entries(initialColumnsData).forEach(([columnId, columnData]) => {
        filteredColumns[columnId] = {
          ...columnData,
          items: columnData.items.filter(item => item.assignedTo === currentUser.id)
        };
      });
      setColumns(filteredColumns);
    } else {
      setColumns(initialColumnsData); 
    }
  }, [currentUser]);

  const updateTaskInColumns = (updatedTask, targetColumnId) => {
    setColumns(prev => {
      const newColumns = { ...prev };
      let taskFoundAndUpdated = false;

      if (newColumns[targetColumnId]) {
          const itemIndex = newColumns[targetColumnId].items.findIndex(item => item.id === updatedTask.id);
          if (itemIndex !== -1) {
              newColumns[targetColumnId].items[itemIndex] = updatedTask;
              taskFoundAndUpdated = true;
          } else if (modalConfig.type === 'newProject' && targetColumnId) { 
              newColumns[targetColumnId].items = [updatedTask, ...newColumns[targetColumnId].items];
              taskFoundAndUpdated = true;
          }
      }
      
      if (!taskFoundAndUpdated) {
        for (const colId in newColumns) {
          const itemIndex = newColumns[colId].items.findIndex(item => item.id === updatedTask.id);
          if (itemIndex !== -1) {
            newColumns[colId].items[itemIndex] = updatedTask;
            taskFoundAndUpdated = true;
            break;
          }
        }
      }
      
      if (!taskFoundAndUpdated && modalConfig.type === 'newProject') {
        const firstColumnId = Object.keys(newColumns)[0];
        newColumns[firstColumnId].items = [updatedTask, ...newColumns[firstColumnId].items];
      }
      return newColumns;
    });
  };
  
  const handleSaveTask = (taskData, targetColumnId, isNew) => {
    const taskToSave = {
      ...taskData,
      id: isNew ? `task-${Date.now()}` : taskData.id,
      lastActivity: new Date().toISOString().split('T')[0]
    };
    
    updateTaskInColumns(taskToSave, targetColumnId || modalConfig.columnId);

    toast({
      title: isNew ? "Projeto Criado!" : "Projeto Atualizado!",
      description: `O projeto "${taskToSave.title}" foi salvo com sucesso.`,
      className: "bg-primary text-primary-foreground"
    });
    setIsModalOpen(false);
  };

  const handleAddNoteToTask = (taskId, targetColumnId, noteText) => {
    const newNote = { id: `note-${Date.now()}`, text: noteText, date: new Date().toISOString() };
    setColumns(prev => {
      const newColumns = { ...prev };
      const column = newColumns[targetColumnId];
      if (column) {
        const taskIndex = column.items.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          const updatedTask = { ...column.items[taskIndex] };
          updatedTask.notes = [...(updatedTask.notes || []), newNote];
          updatedTask.lastActivity = new Date().toISOString().split('T')[0];
          column.items[taskIndex] = updatedTask;
        }
      }
      return newColumns;
    });
    toast({ title: "Nota Adicionada!", description: `Nova nota adicionada ao projeto.` });
  };
  
  const handleDeleteTask = (taskId, columnId) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.filter(task => task.id !== taskId)
      }
    }));
  };

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      const sourceColumn = newColumns[source.droppableId];
      const destColumn = newColumns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = source.droppableId === destination.droppableId ? sourceItems : [...destColumn.items];
      
      const [removed] = sourceItems.splice(source.index, 1);
      
      if (destination.droppableId === 'completed') removed.progress = 100;
      else if (destination.droppableId === 'in-progress' && removed.progress < 10) removed.progress = 10;
      else if (destination.droppableId === 'not-started') removed.progress = 0;
      removed.lastActivity = new Date().toISOString().split('T')[0];

      destItems.splice(destination.index, 0, removed);

      newColumns[source.droppableId] = { ...sourceColumn, items: sourceItems };
      newColumns[destination.droppableId] = { ...destColumn, items: destItems };
      return newColumns;
    });

    toast({
      title: "Projeto Movido!",
      description: `Projeto movido de "${columns[source.droppableId].name}" para "${columns[destination.droppableId].name}".`,
    });
  }, [columns, toast]);


  const filteredColumns = Object.entries(columns).reduce((acc, [columnId, columnData]) => {
    const filteredItems = columnData.items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
    acc[columnId] = { ...columnData, items: filteredItems };
    return acc;
  }, {});

  const openModal = (type, task = null, columnId = null) => {
    setModalConfig({ type, task, columnId });
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-6 h-full flex flex-col"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
            <Briefcase className="mr-3 h-8 w-8" /> CRM - Gestão de Projetos
          </h1>
          <p className="text-muted-foreground">Gerencie e execute os projetos do início ao fim.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-transparent hover:bg-accent/50 border-primary/30">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
          <Button onClick={() => openModal('newProject', null, Object.keys(columns)[0])} className="bg-gradient-to-r from-primary via-emerald-500 to-green-400 text-primary-foreground hover:opacity-90 transition-opacity">
            <PlusCircle className="mr-2 h-5 w-5" /> Novo Projeto
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 dark:bg-card/20 border border-primary/20 backdrop-blur-sm">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar projetos, clientes ou tags..." 
            className="pl-10 w-full bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto custom-scrollbar pb-4">
          {Object.entries(filteredColumns).map(([columnId, column]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided, snapshot) => (
                <motion.div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * Object.keys(columns).indexOf(columnId) }}
                  className={cn(
                    "h-full min-w-[280px] sm:min-w-[300px] flex flex-col",
                    snapshot.isDraggingOver && "bg-primary/5 rounded-lg" 
                  )}
                >
                  <Card className={cn("h-full flex flex-col bg-card/30 dark:bg-card/10 border-primary/10 shadow-md flex-1", snapshot.isDraggingOver && "border-primary/50")}>
                    <CardHeader className={cn("p-3 border-b border-border/30 flex flex-row items-center justify-between sticky top-0 z-10", column.color, "text-white rounded-t-lg")}>
                      <div className="flex items-center">
                        <span className="h-2.5 w-2.5 rounded-full mr-2 bg-white/70"></span>
                        <CardTitle className="text-sm font-semibold">{column.name}</CardTitle>
                        <Badge variant="secondary" className="ml-2 bg-white/20 text-white text-xs px-1.5 py-0.5">{column.items.length}</Badge>
                      </div>
                      <div className="flex items-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/20" onClick={() => openModal('newProject', null, columnId)}>
                              <PlusCircle className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/20">
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
                                  <DropdownMenuItem className="hover:!bg-primary/10 focus:!bg-primary/10">Editar Coluna</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-500 hover:!text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10">Excluir Coluna</DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 flex-1 overflow-y-auto custom-scrollbar min-h-[300px] sm:min-h-[400px]">
                      <AnimatePresence>
                        {column.items.length === 0 && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center text-muted-foreground py-10"
                          >
                            <p className="text-sm">Nenhum projeto aqui.</p>
                          </motion.div>
                        )}
                        {column.items.map((task, index) => (
                          <CrmTaskCard key={task.id} task={task} columnId={columnId} index={index} openModal={openModal} onDeleteTask={handleDeleteTask} />
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}
                    </CardContent>
                    <CardFooter className="p-2 border-t border-border/30">
                       <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary hover:bg-primary/10 text-sm" onClick={() => openModal('newProject', null, columnId)}>
                          <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Novo Projeto
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      
      <CrmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        modalConfig={modalConfig}
        onSaveTask={handleSaveTask}
        onAddNote={handleAddNoteToTask}
      />
    </motion.div>
  );
};

export default CrmPage;