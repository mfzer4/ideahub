import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Target, Search, PlusCircle, CalendarDays, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import ProspectModal from '@/components/prospects/ProspectModal'; 
import ProspectCard from '@/components/prospects/ProspectCard';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import useProspectsData from '@/hooks/useProspectsData';
import { statusOptions, situacaoOptions, sellerOptions } from '@/components/prospects/prospectUtils';

const ProspectsPage = () => {
  const { prospects, handleAddOrUpdateProspect, handleDeleteProspect } = useProspectsData();
  const [filteredProspects, setFilteredProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('todos'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    let result = [...prospects];

    if (searchTerm) {
      result = result.filter(p =>
        Object.values(p).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (expiryFilter !== 'todos') {
      const today = new Date();
      const filterDays = parseInt(expiryFilter.replace('d', ''));
      result = result.filter(p => {
        if (!p.vigenciaFinal) return false;
        const expiryDate = new Date(p.vigenciaFinal);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= filterDays;
      });
    }
    setFilteredProspects(result.sort((a,b) => new Date(a.vigenciaFinal) - new Date(b.vigenciaFinal)));
  }, [prospects, searchTerm, expiryFilter]);

  const openModalForEditOrView = (prospect) => {
    setEditingProspect(prospect);
    setIsModalOpen(true);
  };
  
  const handleProspectAction = (prospect) => {
    const registrationTask = {
      id: `TASK${Date.now()}`,
      prospectId: prospect.id,
      cliente: prospect.cliente,
      produto: prospect.produto,
      vendedor: prospect.vendedor,
      status: 'Pendente Cadastro',
      observacao: prospect.observacao,
      dataCriacao: new Date().toISOString(),
    };

    const existingTasks = JSON.parse(localStorage.getItem('registrationTasks') || '[]') ;
    localStorage.setItem('registrationTasks', JSON.stringify([...existingTasks, registrationTask]));
    
    toast({
      title: "Tarefa de Cadastro Criada!",
      description: `Tarefa para "${prospect.cliente}" enviada para a página de Tarefas de Cadastro.`,
      className: "bg-blue-500 text-white dark:bg-blue-700",
      action: <CheckSquare className="text-white" />,
    });
    navigate('/tarefas-cadastro');
  };

  const handleSubmitModal = (data) => {
    handleAddOrUpdateProspect(data, editingProspect);
    setIsModalOpen(false);
    setEditingProspect(null);
  }

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
            <Target className="mr-3 h-8 w-8" /> Prospecções
          </h1>
          <p className="text-muted-foreground">Gerencie renovações de apólices e novos leads.</p>
        </div>
        <Button onClick={() => { setEditingProspect(null); setIsModalOpen(true); }} className="bg-gradient-to-r from-primary via-emerald-500 to-green-400 text-primary-foreground hover:opacity-90 transition-opacity">
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Prospecção
        </Button>
      </header>

      <Card className="shadow-lg backdrop-blur-md bg-card/70 dark:bg-card/40 border-primary/20 flex-grow flex flex-col">
        <CardHeader className="border-b border-border/50 pb-4 pt-4 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative flex-grow w-full sm:w-auto max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar prospecções..." 
                className="pl-10 w-full bg-background/80 dark:bg-background/60 border-primary/30 focus:border-primary h-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-transparent hover:bg-accent/50 border-primary/30 w-full sm:w-auto h-9">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {expiryFilter === 'todos' ? 'Vencimento: Todos' : `Venc. em ${expiryFilter.replace('d', ' dias')}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
                <DropdownMenuLabel>Filtrar por Vencimento</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={expiryFilter} onValueChange={setExpiryFilter}>
                  <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="30d">Próximos 30 dias</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="45d">Próximos 45 dias</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="60d">Próximos 60 dias</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          {filteredProspects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Target className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Nenhuma prospecção encontrada.</p>
              <p className="text-sm">Tente ajustar os filtros ou adicione uma nova prospecção.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)] pr-3 -mr-3">
              <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredProspects.map((prospect) => (
                  <ProspectCard 
                    key={prospect.id} 
                    prospect={prospect} 
                    onEdit={() => openModalForEditOrView(prospect)}
                    onViewDetails={() => openModalForEditOrView(prospect)}
                    onDelete={() => handleDeleteProspect(prospect.id)}
                    onAction={handleProspectAction}
                  />
                ))}
              </motion.div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <ProspectModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProspect(null); }}
        onSubmit={handleSubmitModal}
        prospectData={editingProspect}
        statusOptions={statusOptions.filter(s => s !== 'Cadastrado')} 
        situacaoOptions={situacaoOptions}
        sellers={sellerOptions} 
      />
    </motion.div>
  );
};

export default ProspectsPage;