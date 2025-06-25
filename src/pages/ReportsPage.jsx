import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, Users, DollarSign, Briefcase, TrendingUp, Filter, CalendarDays, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { AppContext } from '@/App'; 
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';

const mockSellers = [
  { id: 'vendedor1', name: 'Carlos Silva' },
  { id: 'vendedor2', name: 'Ana Beatriz' },
  { id: 'admin', name: 'Admin Ecosistema' },
  { id: 'mock-admin-id', name: 'Admin Mockado'}
];

const mockPolicyStatus = ['Ativa', 'Pendente', 'Cancelada', 'Expirada', 'Em Renovação'];

const mockCommissionsData = [
  { id: 'COM001', policyId: 'POL001', sellerId: 'vendedor1', commissionValue: 150.75, saleDate: '2025-05-10', clientName: 'Juliana Paes', product: 'Automóvel Completo' },
  { id: 'COM002', policyId: 'POL002', sellerId: 'vendedor2', commissionValue: 75.20, saleDate: '2025-05-12', clientName: 'Ricardo Alves', product: 'Residencial Essencial' },
  { id: 'COM003', policyId: 'POL003', sellerId: 'vendedor1', commissionValue: 220.00, saleDate: '2025-04-20', clientName: 'Sofia Bernardes', product: 'Vida Total' },
  { id: 'COM004', policyId: 'POL004', sellerId: 'mock-admin-id', commissionValue: 100.00, saleDate: '2025-06-01', clientName: 'Marcos Lemos', product: 'Automóvel Básico' },
];

const mockProductionData = [
  { id: 'PROD001', sellerId: 'vendedor1', policiesIssued: 15, totalPremium: 12500.00, month: '2025-05' },
  { id: 'PROD002', sellerId: 'vendedor2', policiesIssued: 10, totalPremium: 8750.50, month: '2025-05' },
  { id: 'PROD003', sellerId: 'mock-admin-id', policiesIssued: 5, totalPremium: 4500.00, month: '2025-05' },
  { id: 'PROD004', sellerId: 'vendedor1', policiesIssued: 12, totalPremium: 10200.00, month: '2025-04' },
];

const mockProspectsData = [
  { id: 'LEAD001', source: 'Indicação', status: 'Convertido', creationDate: '2025-03-15', assignedTo: 'vendedor1', clientName: 'Pedro Martins' },
  { id: 'LEAD002', source: 'Website', status: 'Em Negociação', creationDate: '2025-04-01', assignedTo: 'vendedor2', clientName: 'Luiza Costa' },
  { id: 'LEAD003', source: 'Feira', status: 'Perdido', creationDate: '2025-05-05', assignedTo: 'vendedor1', clientName: 'Fernando Oliveira' },
];

const ReportsPage = () => {
  const { toast } = useToast();
  const appContext = useContext(AppContext); 
  const usersAuth = appContext ? appContext.usersAuth : [];
  const [sellersList, setSellersList] = useState([]);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    sellerId: 'todos',
    status: 'todos',
  });

  useEffect(() => {
    const sellersFromUsers = usersAuth
      .filter(user => user.roleName === 'Vendedor' || user.roleName === 'Admin') 
      .map(user => ({ id: user.id, name: user.name }));
    setSellersList(sellersFromUsers.length > 0 ? sellersFromUsers : mockSellers);
  }, [usersAuth]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const applyFilters = (data, dateField = 'saleDate', sellerField = 'sellerId', statusField = 'status') => {
    if (!data) return [];
    return data.filter(item => {
      const itemDate = item[dateField] ? new Date(item[dateField]) : null;
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      const dateMatch = (!startDate || (itemDate && itemDate >= startDate)) &&
                        (!endDate || (itemDate && itemDate <= endDate));
      const sellerMatch = filters.sellerId === 'todos' || item[sellerField] === filters.sellerId;
      const statusMatch = filters.status === 'todos' || (item[statusField] && item[statusField].toLowerCase() === filters.status.toLowerCase());
      
      return dateMatch && sellerMatch && (statusField in item ? statusMatch : true) ;
    });
  };

  const exportToExcel = (data, fileName, sheetName = 'Relatorio') => {
    if (!data || data.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Por favor, ajuste os filtros ou verifique se há dados disponíveis.",
        variant: "destructive",
        action: <AlertCircle className="h-5 w-5" />
      });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast({
      title: "Relatório Exportado!",
      description: `${fileName}.xlsx foi baixado com sucesso.`,
      className: "bg-primary text-primary-foreground",
      action: <CheckCircle className="h-5 w-5" />
    });
  };

  const filteredCommissions = applyFilters(mockCommissionsData, 'saleDate', 'sellerId', null);
  const filteredProduction = applyFilters(mockProductionData, 'month', 'sellerId', null); 
  const filteredProspects = applyFilters(mockProspectsData, 'creationDate', 'assignedTo', 'status');
  
  const sellersReportData = sellersList.map(seller => {
    const sellerCommissions = filteredCommissions.filter(c => c.sellerId === seller.id);
    const sellerProduction = filteredProduction.filter(p => p.sellerId === seller.id);
    return {
      vendedor: seller.name,
      totalComissoes: sellerCommissions.reduce((sum, c) => sum + c.commissionValue, 0),
      apolicesEmitidas: sellerProduction.reduce((sum, p) => sum + p.policiesIssued, 0),
      totalPremios: sellerProduction.reduce((sum, p) => sum + p.totalPremium, 0),
      leadsConvertidos: filteredProspects.filter(l => l.assignedTo === seller.id && l.status === 'Convertido').length,
    };
  });

  const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-full"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-400 flex items-center">
            <FileSpreadsheet className="mr-3 h-8 w-8" /> Central de Relatórios Avançados
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Gere e exporte relatórios detalhados para análise.</p>
        </div>
      </header>

      <Card className="shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-blue-700 dark:text-blue-400 flex items-center"><Filter className="mr-2 h-5 w-5"/> Filtros Globais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Início</Label>
            <Input type="date" id="startDate" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"/>
          </div>
          <div>
            <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Fim</Label>
            <Input type="date" id="endDate" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"/>
          </div>
          <div>
            <Label htmlFor="sellerId" className="text-sm font-medium text-gray-700 dark:text-gray-300">Vendedor</Label>
            <Select value={filters.sellerId} onValueChange={value => handleFilterChange('sellerId', value)}>
              <SelectTrigger id="sellerId" className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Todos os Vendedores" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectItem value="todos">Todos os Vendedores</SelectItem>
                {sellersList.map(seller => <SelectItem key={seller.id} value={seller.id}>{seller.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">Status (Prospecção)</Label>
            <Select value={filters.status} onValueChange={value => handleFilterChange('status', value)}>
              <SelectTrigger id="status" className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectItem value="todos">Todos os Status</SelectItem>
                {mockPolicyStatus.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" collapsible className="w-full space-y-4">
        <AccordionItem value="report-sellers" className="bg-white dark:bg-gray-800 shadow-md rounded-lg border-gray-200 dark:border-gray-700">
          <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-blue-600 dark:text-blue-400 hover:no-underline">
            <div className="flex items-center"><Users className="mr-3 h-6 w-6"/> Relatório de Desempenho por Vendedores</div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Visão consolidada do desempenho individual dos vendedores.</p>
              <Button onClick={() => exportToExcel(sellersReportData, 'Relatorio_Vendedores')} variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
                <Download className="mr-2 h-4 w-4"/> Exportar Excel
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-700 dark:text-gray-300">Vendedor</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Total Comissões</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Apólices Emitidas</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Total Prêmios</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Leads Convertidos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellersReportData.map((row, i) => (
                  <TableRow key={i} className="border-gray-200 dark:border-gray-700">
                    <TableCell>{row.vendedor}</TableCell>
                    <TableCell>{formatCurrency(row.totalComissoes)}</TableCell>
                    <TableCell>{row.apolicesEmitidas}</TableCell>
                    <TableCell>{formatCurrency(row.totalPremios)}</TableCell>
                    <TableCell>{row.leadsConvertidos}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="report-commissions" className="bg-white dark:bg-gray-800 shadow-md rounded-lg border-gray-200 dark:border-gray-700">
          <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-blue-600 dark:text-blue-400 hover:no-underline">
            <div className="flex items-center"><DollarSign className="mr-3 h-6 w-6"/> Relatório de Comissões</div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Detalhes das comissões geradas por venda.</p>
                <Button onClick={() => exportToExcel(filteredCommissions.map(c => ({...c, vendedor: sellersList.find(s=>s.id === c.sellerId)?.name || c.sellerId})), 'Relatorio_Comissoes')} variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
                    <Download className="mr-2 h-4 w-4"/> Exportar Excel
                </Button>
            </div>
             <Table>
              <TableHeader><TableRow className="border-gray-200 dark:border-gray-700">
                <TableHead className="text-gray-700 dark:text-gray-300">ID Comissão</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Cliente</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Produto</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Vendedor</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Valor Comissão</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Data Venda</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredCommissions.map(c => (
                  <TableRow key={c.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell>{c.id}</TableCell><TableCell>{c.clientName}</TableCell><TableCell>{c.product}</TableCell><TableCell>{sellersList.find(s=>s.id === c.sellerId)?.name || c.sellerId}</TableCell><TableCell>{formatCurrency(c.commissionValue)}</TableCell><TableCell>{new Date(c.saleDate).toLocaleDateString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
                {filteredCommissions.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">Nenhum dado de comissão encontrado.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="report-production" className="bg-white dark:bg-gray-800 shadow-md rounded-lg border-gray-200 dark:border-gray-700">
          <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-blue-600 dark:text-blue-400 hover:no-underline">
            <div className="flex items-center"><Briefcase className="mr-3 h-6 w-6"/> Relatório de Produção</div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Quantidade total de apólices emitidas e prêmios.</p>
                <Button onClick={() => exportToExcel(filteredProduction.map(p => ({...p, vendedor: sellersList.find(s=>s.id === p.sellerId)?.name || p.sellerId})), 'Relatorio_Producao')} variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
                    <Download className="mr-2 h-4 w-4"/> Exportar Excel
                </Button>
            </div>
            <Table>
              <TableHeader><TableRow className="border-gray-200 dark:border-gray-700">
                <TableHead className="text-gray-700 dark:text-gray-300">Mês/Ano</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Vendedor</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Apólices Emitidas</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Total Prêmio</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredProduction.map(p => (
                  <TableRow key={p.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell>{p.month}</TableCell><TableCell>{sellersList.find(s=>s.id === p.sellerId)?.name || p.sellerId}</TableCell><TableCell>{p.policiesIssued}</TableCell><TableCell>{formatCurrency(p.totalPremium)}</TableCell>
                  </TableRow>
                ))}
                {filteredProduction.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">Nenhum dado de produção encontrado.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="report-prospects" className="bg-white dark:bg-gray-800 shadow-md rounded-lg border-gray-200 dark:border-gray-700">
          <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-blue-600 dark:text-blue-400 hover:no-underline">
            <div className="flex items-center"><TrendingUp className="mr-3 h-6 w-6"/> Relatório de Prospecções</div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Número e origem de leads.</p>
                <Button onClick={() => exportToExcel(filteredProspects.map(l => ({...l, responsavel: sellersList.find(s=>s.id === l.assignedTo)?.name || l.assignedTo})), 'Relatorio_Prospeccoes')} variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
                    <Download className="mr-2 h-4 w-4"/> Exportar Excel
                </Button>
            </div>
            <Table>
              <TableHeader><TableRow className="border-gray-200 dark:border-gray-700">
                <TableHead className="text-gray-700 dark:text-gray-300">Cliente</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Fonte</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Responsável</TableHead><TableHead className="text-gray-700 dark:text-gray-300">Data Criação</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredProspects.map(l => (
                  <TableRow key={l.id} className="border-gray-200 dark:border-gray-700">
                    <TableCell>{l.clientName}</TableCell><TableCell>{l.source}</TableCell><TableCell><Badge variant={l.status === 'Convertido' ? 'default' : 'secondary'} className={cn(l.status === 'Convertido' && 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300', l.status === 'Perdido' && 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300' )}>{l.status}</Badge></TableCell><TableCell>{sellersList.find(s=>s.id === l.assignedTo)?.name || l.assignedTo}</TableCell><TableCell>{new Date(l.creationDate).toLocaleDateString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
                {filteredProspects.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400">Nenhum dado de prospecção encontrado.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};

export default ReportsPage;