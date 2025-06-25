import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { KeyRound as UsersRound, UserPlus, Search, Filter, Edit, Trash2, Eye, Shield, Briefcase, User, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from '@/App';

const initialSellersData = [
  { id: 'seller1', name: 'Bruno Vasconcelos', email: 'bruno.v@example.com', phone: '(11) 98877-6655', region: 'São Paulo - Capital', status: 'Ativo', commissionRate: 5, totalSales: 125000.00, targetsMet: 8, avatarFallback: 'BV', lastLogin: '2025-06-05 09:15' },
  { id: 'seller2', name: 'Daniel Furtado', email: 'daniel.f@example.com', phone: '(21) 97766-5544', region: 'Rio de Janeiro', status: 'Ativo', commissionRate: 4.5, totalSales: 98000.00, targetsMet: 6, avatarFallback: 'DF', lastLogin: '2025-06-04 11:00' },
  { id: 'seller3', name: 'Carla Matos', email: 'carla.m@example.com', phone: '(31) 96655-4433', region: 'Minas Gerais', status: 'Inativo', commissionRate: 5, totalSales: 55000.00, targetsMet: 3, avatarFallback: 'CM', lastLogin: '2025-04-10 14:30' },
  { id: 'seller4', name: 'Rafael Lima', email: 'rafael.l@example.com', phone: '(51) 95544-3322', region: 'Rio Grande do Sul', status: 'Ativo', commissionRate: 5.5, totalSales: 210000.00, targetsMet: 10, avatarFallback: 'RL', lastLogin: '2025-06-05 14:00' },
];

const getStatusBadgeVariant = (status) => {
  if (status === 'Ativo') return 'default';
  if (status === 'Inativo') return 'secondary';
  return 'outline';
};

const SellersPage = () => {
  const [sellers, setSellers] = useState(initialSellersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState({ Ativo: true, Inativo: true });
  const { toast } = useToast();
  const appContext = useContext(AppContext);
  const currentUser = appContext ? appContext.currentUser : null;

  const handleStatusFilterChange = (status) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          seller.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilters[seller.status];
    return matchesSearch && matchesStatus;
  });

  const handleAddSeller = () => {
    const newSellerId = `seller${sellers.length + 1}`;
    const newSeller = {
      id: newSellerId,
      name: 'Novo Vendedor',
      email: `novo${sellers.length+1}@example.com`,
      phone: '(XX) XXXXX-XXXX',
      region: 'Não Definida',
      status: 'Ativo',
      commissionRate: 5,
      totalSales: 0,
      targetsMet: 0,
      avatarFallback: 'NV',
      lastLogin: new Date().toISOString().split('T')[0]
    };
    setSellers(prev => [newSeller, ...prev]);
    toast({ title: "Novo Vendedor Adicionado!", description: `${newSeller.name} foi adicionado à lista.`, className: "bg-primary text-primary-foreground" });
  };

  const handleDeleteSeller = (sellerId) => {
    setSellers(prev => prev.filter(s => s.id !== sellerId));
    toast({ title: "Vendedor Removido!", description: `O vendedor foi removido da lista.`, variant: "destructive" });
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
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
            <UsersRound className="mr-3 h-8 w-8" /> Gestão de Vendedores
          </h1>
          <p className="text-muted-foreground">Cadastre, gerencie e acompanhe o desempenho dos seus vendedores.</p>
        </div>
        {currentUser && currentUser.roleName === 'Admin' && ( // Ajustado para roleName
          <Button onClick={handleAddSeller} className="bg-gradient-to-r from-primary via-emerald-500 to-green-400 text-primary-foreground hover:opacity-90 transition-opacity">
            <UserPlus className="mr-2 h-5 w-5" /> Adicionar Novo Vendedor
          </Button>
        )}
      </header>

      <Card className="shadow-xl backdrop-blur-lg bg-card/60 dark:bg-card/30 border-primary/30 dark:border-primary/20">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-xl">Lista de Vendedores</CardTitle>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar vendedor, email ou região..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-transparent hover:bg-accent/50 border-primary/30">
                    <Filter className="mr-2 h-4 w-4" /> Filtrar Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl w-48">
                   {Object.keys(statusFilters).map(status => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilters[status]}
                      onCheckedChange={() => handleStatusFilterChange(status)}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/10 border-b-border/50">
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Região</TableHead>
                  <TableHead className="text-center">Comissão (%)</TableHead>
                  <TableHead className="text-right">Vendas Totais</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSellers.map((seller) => (
                  <TableRow key={seller.id} className="hover:bg-muted/20 border-b-border/30 last:border-b-0">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://source.unsplash.com/random/100x100/?person,professional&sig=${seller.id}`} alt={seller.name} />
                          <AvatarFallback className="bg-primary/20 text-primary">{seller.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{seller.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="flex items-center text-muted-foreground"><Mail className="w-3 h-3 mr-1.5 text-primary/70"/>{seller.email}</span>
                        <span className="flex items-center text-muted-foreground"><Phone className="w-3 h-3 mr-1.5 text-primary/70"/>{seller.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                       <span className="flex items-center text-sm text-muted-foreground"><MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70"/>{seller.region}</span>
                    </TableCell>
                    <TableCell className="text-center">{seller.commissionRate}%</TableCell>
                    <TableCell className="text-right font-medium text-primary">R$ {seller.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-center">
                       <Badge variant={getStatusBadgeVariant(seller.status)} className={cn("text-xs",
                         seller.status === 'Ativo' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30' :
                         'bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30'
                       )}>
                        {seller.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
                          <DropdownMenuItem className="hover:!bg-primary/10 focus:!bg-primary/10">
                            <Eye className="mr-2 h-4 w-4" /> Ver Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:!bg-primary/10 focus:!bg-primary/10">
                            <Edit className="mr-2 h-4 w-4" /> Editar Vendedor
                          </DropdownMenuItem>
                           {currentUser && currentUser.roleName === 'Admin' && ( // Ajustado para roleName
                            <DropdownMenuItem onClick={() => handleDeleteSeller(seller.id)} className="text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10">
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir Vendedor
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
           {filteredSellers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum vendedor encontrado com os filtros atuais.</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Mostrando {filteredSellers.length} de {sellers.length} vendedores.
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

export default SellersPage;