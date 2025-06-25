import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListChecks, User, Shield, UserCheck, FileText, CheckSquare, AlertCircle, Search, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProspectModal from '@/components/prospects/ProspectModal';
import { sellerOptions, statusOptions, situacaoOptions } from '@/components/prospects/prospectUtils';

const TaskCard = ({ task, onCheck }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pendente Cadastro': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'Confirmado': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow duration-300 bg-card/80 dark:bg-card/50 border-primary/10">
        <CardHeader className="pb-3 pt-4 px-4 border-b border-border/50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg text-primary flex items-center">
                <User className="w-5 h-5 mr-2 opacity-80" /> {task.cliente}
              </CardTitle>
              <CardDescription className="text-xs flex items-center mt-1">
                <Shield className="w-3 h-3 mr-1.5 opacity-70" /> {task.produto}
              </CardDescription>
            </div>
            <Badge variant="outline" className={cn("text-xs font-medium", getStatusBadgeClass(task.status))}>
              {task.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-sm flex-grow">
          <div className="flex items-center">
            <UserCheck className="w-4 h-4 mr-2 text-primary/70" />
            <div>
              <span className="font-medium text-muted-foreground">Vendedor:</span>
              <p className="text-foreground">{task.vendedor}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-primary/70" />
            <div>
              <span className="font-medium text-muted-foreground">Data Criação:</span>
              <p className="text-foreground">{formatDate(task.dataCriacao)}</p>
            </div>
          </div>
          {task.observacao && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground flex items-start">
                <Info className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-primary/60 flex-shrink-0" />
                <span className="line-clamp-3">{task.observacao}</span>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-3 border-t border-border/50 flex justify-end">
          {task.status === 'Pendente Cadastro' ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 border-primary/40 hover:bg-primary/10 text-primary"
              onClick={() => onCheck(task)}
            >
              <FileText className="mr-1.5 h-4 w-4" />
              Conferir Prospecção
            </Button>
          ) : (
            <Badge variant="outline" className={cn("font-normal text-sm py-1 px-2", getStatusBadgeClass(task.status))}>
              {task.status}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};


const RegistrationTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [prospectForModal, setProspectForModal] = useState(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem('registrationTasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    let result = [...tasks];
    if (searchTerm) {
      result = result.filter(task =>
        Object.values(task).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredTasks(result.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)));
  }, [tasks, searchTerm]);

  const handleCheckProspect = (task) => {
    const storedProspects = JSON.parse(localStorage.getItem('prospectsData') || '[]');
    const prospectData = storedProspects.find(p => p.id === task.prospectId);
    if (prospectData) {
        setProspectForModal(prospectData);
        setSelectedTask(task);
        setIsModalOpen(true);
    } else {
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Dados da prospecção associada não foram encontrados.",
        });
    }
  };

  const handleConfirmRegistration = () => {
    if (!selectedTask) return;
    const taskToConfirm = selectedTask;

    const updatedTasks = tasks.map(task =>
      task.id === taskToConfirm.id ? { ...task, status: 'Confirmado' } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('registrationTasks', JSON.stringify(updatedTasks));

    const storedProspects = JSON.parse(localStorage.getItem('prospectsData') || '[]');
    const confirmedProspect = storedProspects.find(p => p.id === taskToConfirm.prospectId);
    const updatedProspects = storedProspects.map(prospect =>
      prospect.id === taskToConfirm.prospectId ? { ...prospect, status: 'Cadastrado' } : prospect
    );
    localStorage.setItem('prospectsData', JSON.stringify(updatedProspects.map(p => {
        const { comissaoAnterior, comissaoAtual, diferencaComissao, ...rest } = p;
        return rest;
    })));

    if (confirmedProspect) {
        const newPolicy = {
            id: `APL${Date.now()}`,
            policyNumber: `POL-${Math.floor(1000 + Math.random() * 9000)}`,
            clientName: confirmedProspect.cliente,
            product: confirmedProspect.produto,
            insurer: confirmedProspect.seguradora,
            status: 'Ativa',
            startDate: new Date().toISOString().split('T')[0],
            endDate: confirmedProspect.vigenciaFinal,
            premium: confirmedProspect.premioLiquidoAtual,
            vendedor: confirmedProspect.vendedor,
        };
        const storedPolicies = JSON.parse(localStorage.getItem('policiesData') || '[]');
        const updatedPolicies = [newPolicy, ...storedPolicies];
        localStorage.setItem('policiesData', JSON.stringify(updatedPolicies));
    }

    setIsModalOpen(false);
    toast({
      title: "Cadastro Confirmado!",
      description: `A apólice para "${taskToConfirm.cliente}" foi criada com sucesso.`,
      className: "bg-green-500 text-white dark:bg-green-700",
      action: <CheckSquare className="text-white" />,
    });
    
    navigate('/apolices');
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
            <ListChecks className="mr-3 h-8 w-8" /> Tarefas de Cadastro
          </h1>
          <p className="text-muted-foreground">Gerencie as prospecções prontas para cadastro.</p>
        </div>
      </header>

      <Card className="shadow-lg backdrop-blur-md bg-card/70 dark:bg-card/40 border-primary/20 flex-grow flex flex-col">
        <CardHeader className="border-b border-border/50 pb-4 pt-4 px-4">
          <div className="relative flex-grow w-full sm:w-auto max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar tarefas..." 
              className="pl-10 w-full bg-background/80 dark:bg-background/60 border-primary/30 focus:border-primary h-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          {filteredTasks.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ListChecks className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Nenhuma tarefa de cadastro pendente.</p>
              <p className="text-sm">Quando uma prospecção for enviada para cadastro, ela aparecerá aqui.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-260px)] pr-3 -mr-3">
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onCheck={handleCheckProspect} 
                  />
                ))}
              </motion.div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {prospectForModal && (
        <ProspectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleConfirmRegistration}
          prospectData={prospectForModal}
          mode="confirm"
          statusOptions={statusOptions}
          situacaoOptions={situacaoOptions}
          sellers={sellerOptions}
        />
      )}
    </motion.div>
  );
};

export default RegistrationTasksPage;