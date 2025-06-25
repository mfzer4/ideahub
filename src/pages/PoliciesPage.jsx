import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, PlusCircle, Search, Filter, Edit, Eye, ChevronDown, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';


const initialPoliciesData = [
  { id: 'POL001', clientName: 'Ana Silva', clientAvatar: 'AS', policyType: 'Automóvel Completo', status: 'Ativa', premium: 'R$ 2.500,00', expiryDate: '2025-12-31', startDate: '2024-12-31' },
  { id: 'POL002', clientName: 'Bruno Costa', clientAvatar: 'BC', policyType: 'Residencial Básico', status: 'Pendente Pagamento', premium: 'R$ 1.800,00', expiryDate: '2026-03-15', startDate: '2025-03-15' },
  { id: 'POL003', clientName: 'Carlos Dias', clientAvatar: 'CD', policyType: 'Vida Total', status: 'Expirada', premium: 'R$ 3.200,00', expiryDate: '2025-01-20', startDate: '2024-01-20' },
  { id: 'POL004', clientName: 'Daniela Lima', clientAvatar: 'DL', policyType: 'Saúde Premium', status: 'Ativa', premium: 'R$ 4.500,00', expiryDate: '2026-06-01', startDate: '2025-06-01' },
  { id: 'POL005', clientName: 'Eduarda Matos', clientAvatar: 'EM', policyType: 'Automóvel Roubo/Furto', status: 'Cancelada', premium: 'R$ 1.950,00', expiryDate: '2025-08-10', startDate: '2024-08-10' },
];

const getStatusPolicyBadgeVariant = (status) => {
  switch (status) {
    case 'Ativa': return 'default';
    case 'Pendente Pagamento': return 'secondary';
    case 'Expirada': return 'destructive';
    case 'Cancelada': return 'outline';
    case 'Em Cotação': return 'warning';
    default: return 'secondary';
  }
};

const getStatusPolicyIcon = (status) => {
  switch (status) {
    case 'Ativa': return <CheckCircle className="h-3 w-3 mr-1" />;
    case 'Pendente Pagamento': return <Clock className="h-3 w-3 mr-1" />;
    case 'Expirada': return <XCircle className="h-3 w-3 mr-1" />;
    case 'Cancelada': return <ShieldAlert className="h-3 w-3 mr-1" />;
    case 'Em Cotação': return <FileText className="h-3 w-3 mr-1" />;
    default: return null;
  }
};


const PoliciesPage = () => {
  const [policies, setPolicies] = useState(initialPoliciesData);
  const navigate = useNavigate();

  useEffect(() => {
    const registeredPolicies = JSON.parse(localStorage.getItem('registeredPolicies') || '[]');
    // Para evitar duplicatas se a página for recarregada, podemos filtrar as já existentes
    const newPolicies = registeredPolicies.filter(rp => !initialPoliciesData.some(ip => ip.id === rp.id));
    if (newPolicies.length > 0) {
      setPolicies(prevPolicies => [...prevPolicies, ...newPolicies]);
    }
  }, []);

  const handleCreateNewPolicy = () => {
    navigate('/cadastro-apolices');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-6"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Apólices Cadastradas</h1>
          <p className="text-muted-foreground">Visualize e administre todas as apólices de seguros ativas e passadas.</p>
        </div>
        <Button 
          onClick={handleCreateNewPolicy}
          className="bg-gradient-to-r from-primary via-emerald-500 to-green-400 text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Criar Nova Apólice
        </Button>
      </header>

      <Card className="shadow-xl backdrop-blur-lg bg-card/60 dark:bg-card/30 border-primary/30 dark:border-primary/20">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-xl">Lista de Apólices</CardTitle>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar apólice..." className="pl-10 w-full bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-transparent hover:bg-accent/50 border-primary/30">
                    <Filter className="mr-2 h-4 w-4" /> Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
                  <DropdownMenuItem>Status: Ativa</DropdownMenuItem>
                  <DropdownMenuItem>Status: Pendente Pagamento</DropdownMenuItem>
                  <DropdownMenuItem>Tipo: Automóvel</DropdownMenuItem>
                  <DropdownMenuItem>Tipo: Residencial</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/10 border-b-border/50">
                  <TableHead>ID Apólice</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo de Apólice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prêmio Anual</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Data de Expiração</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id} className="hover:bg-muted/20 border-b-border/30 last:border-b-0">
                    <TableCell className="font-medium text-primary">{policy.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-7 w-7">
                           <AvatarImage src={`https://source.unsplash.com/random/100x100/?person,face&sig=${policy.id}`} alt={policy.clientName} />
                          <AvatarFallback className="text-xs bg-primary/20 text-primary">{policy.clientName?.substring(0,2).toUpperCase() || 'N/A'}</AvatarFallback>
                        </Avatar>
                        <span>{policy.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{policy.policyType}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusPolicyBadgeVariant(policy.status)} 
                        className={cn("text-xs font-semibold px-2 py-0.5 rounded-full flex items-center", 
                          policy.status === 'Ativa' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30' :
                          policy.status === 'Pendente Pagamento' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' :
                          policy.status === 'Expirada' ? 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30' :
                          policy.status === 'Cancelada' ? 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30' :
                          policy.status === 'Em Cotação' ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30' :
                          ''
                        )}
                      >
                        {getStatusPolicyIcon(policy.status)}
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{policy.premium}</TableCell>
                    <TableCell>{policy.startDate}</TableCell>
                    <TableCell>{policy.expiryDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
                          <DropdownMenuItem className="hover:!bg-primary/10 focus:!bg-primary/10">
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:!bg-primary/10 focus:!bg-primary/10">
                            <Edit className="mr-2 h-4 w-4" /> Editar Apólice
                          </DropdownMenuItem>
                          {policy.status === 'Ativa' && (
                            <DropdownMenuItem className="text-orange-500 hover:!bg-orange-500/10 focus:!bg-orange-500/10">
                              <FileText className="mr-2 h-4 w-4" /> Renovar
                            </DropdownMenuItem>
                          )}
                           {policy.status !== 'Cancelada' && policy.status !== 'Expirada' && (
                            <DropdownMenuItem className="text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10">
                              <XCircle className="mr-2 h-4 w-4" /> Cancelar Apólice
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Mostrando {policies.length} de {policies.length} apólices.
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="bg-transparent hover:bg-accent/50 border-primary/30">Anterior</Button>
            <Button variant="outline" size="sm" className="bg-transparent hover:bg-accent/50 border-primary/30">Próxima</Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PoliciesPage;