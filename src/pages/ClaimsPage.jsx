import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, FileText, Filter, PlusCircle, Search, Trash2, Edit, Eye, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const claimsData = [
  { id: 'SIN001', policyId: 'POL001', clientName: 'Ana Silva', claimType: 'Colisão', status: 'Em Análise', amount: 'R$ 5.200,00', dateReported: '2025-05-15' },
  { id: 'SIN002', policyId: 'POL002', clientName: 'Bruno Costa', claimType: 'Inundação', status: 'Aprovado', amount: 'R$ 3.800,00', dateReported: '2025-04-20' },
  { id: 'SIN003', policyId: 'POL004', clientName: 'Daniela Lima', claimType: 'Consulta Médica', status: 'Pago', amount: 'R$ 350,00', dateReported: '2025-05-01' },
  { id: 'SIN004', policyId: 'POL001', clientName: 'Ana Silva', claimType: 'Roubo Parcial', status: 'Rejeitado', amount: 'R$ 1.500,00', dateReported: '2025-03-10' },
  { id: 'SIN005', policyId: 'POL005', clientName: 'Eduarda Matos', claimType: 'Pane Elétrica', status: 'Em Análise', amount: 'R$ 950,00', dateReported: '2025-05-25' },
];

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'Em Análise':
      return 'secondary';
    case 'Aprovado':
      return 'default';
    case 'Pago':
      return 'outline';
    case 'Rejeitado':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Em Análise':
      return <Clock className="h-4 w-4 mr-1 text-yellow-500" />;
    case 'Aprovado':
      return <CheckCircle className="h-4 w-4 mr-1 text-green-500" />;
    case 'Pago':
      return <CheckCircle className="h-4 w-4 mr-1 text-blue-500" />;
    case 'Rejeitado':
      return <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />;
    default:
      return null;
  }
};

const ClaimsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-6"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Gerenciamento de Sinistros</h1>
          <p className="text-muted-foreground">Acompanhe e gerencie todos os sinistros reportados.</p>
        </div>
        <Button className="bg-gradient-to-r from-primary via-emerald-500 to-green-400 text-primary-foreground hover:opacity-90 transition-opacity">
          <PlusCircle className="mr-2 h-5 w-5" /> Reportar Novo Sinistro
        </Button>
      </header>

      <Card className="shadow-xl backdrop-blur-lg bg-card/60 dark:bg-card/30 border-primary/30 dark:border-primary/20">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-xl">Lista de Sinistros</CardTitle>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar sinistro..." className="pl-10 w-full bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-transparent hover:bg-accent/50 border-primary/30">
                    <Filter className="mr-2 h-4 w-4" /> Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
                  <DropdownMenuItem>Status: Em Análise</DropdownMenuItem>
                  <DropdownMenuItem>Status: Aprovado</DropdownMenuItem>
                  <DropdownMenuItem>Status: Pago</DropdownMenuItem>
                  <DropdownMenuItem>Status: Rejeitado</DropdownMenuItem>
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
                  <TableHead>ID Sinistro</TableHead>
                  <TableHead>ID Apólice</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo de Sinistro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor Reivindicado</TableHead>
                  <TableHead>Data Reportada</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claimsData.map((claim) => (
                  <TableRow key={claim.id} className="hover:bg-muted/20 border-b-border/30 last:border-b-0">
                    <TableCell className="font-medium text-primary">{claim.id}</TableCell>
                    <TableCell>{claim.policyId}</TableCell>
                    <TableCell>{claim.clientName}</TableCell>
                    <TableCell>{claim.claimType}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(claim.status)} className={cn("text-xs font-semibold px-2 py-0.5 rounded-full flex items-center", 
                        getStatusBadgeVariant(claim.status) === 'destructive' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                        getStatusBadgeVariant(claim.status) === 'default' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                        getStatusBadgeVariant(claim.status) === 'secondary' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' :
                        'bg-blue-500/20 text-blue-500 border-blue-500/30'
                      )}>
                        {getStatusIcon(claim.status)}
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{claim.amount}</TableCell>
                    <TableCell>{claim.dateReported}</TableCell>
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
                            <Edit className="mr-2 h-4 w-4" /> Editar Sinistro
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Cancelar Sinistro
                          </DropdownMenuItem>
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
            Mostrando {claimsData.length} de {claimsData.length} sinistros.
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

export default ClaimsPage;