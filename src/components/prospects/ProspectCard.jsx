import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, DollarSign, Percent, Info, MessageSquare, Calendar, Shield, UserCheck, TrendingUp, Edit2, Trash2, ChevronDown, Eye, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { calculateCommissionsFromProspectData } from '@/components/prospects/prospectUtils';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ProspectCard = ({ prospect: initialProspect, onEdit, onDelete, onAction, onViewDetails }) => {
  const [prospect, setProspect] = useState(initialProspect);

  useEffect(() => {
    const calculatedCommissions = calculateCommissionsFromProspectData(initialProspect);
    setProspect(prev => ({...prev, ...calculatedCommissions}));
  }, [initialProspect]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data Inválida';
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Contatar': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Em Negociação': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Aguardando Documentos': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'Convertido': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Cadastrado': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      case 'Perdido': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };
  
  const getDifferenceClass = (diff) => {
    if (diff > 0) return 'text-green-500 dark:text-green-400';
    if (diff < 0) return 'text-red-500 dark:text-red-400';
    return 'text-muted-foreground';
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('[role="menuitem"]') || e.target.closest('[role="tooltip"]')) {
      return;
    }
    onViewDetails(prospect);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="h-full flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow duration-300 bg-card/80 dark:bg-card/50 border-primary/10 cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3 pt-4 px-4 border-b border-border/50">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg text-primary flex items-center">
                  <User className="w-5 h-5 mr-2 opacity-80" /> {prospect.cliente}
                </CardTitle>
                {prospect.attachment && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="flex items-center" onClick={(e) => e.stopPropagation()}>
                        <Paperclip className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Anexo: {prospect.attachment.name}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <CardDescription className="text-xs flex items-center mt-1">
                <Briefcase className="w-3 h-3 mr-1.5 opacity-70" /> {prospect.produto} - {prospect.seguradora}
              </CardDescription>
            </div>
            <Badge variant="outline" className={cn("text-xs font-medium", getStatusBadgeClass(prospect.status))}>
              {prospect.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-sm flex-grow">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-primary/70" />
              <div>
                <span className="font-medium text-muted-foreground">Vig. Final:</span>
                <p className="text-foreground">{formatDate(prospect.vigenciaFinal)}</p>
              </div>
            </div>
             <div className="flex items-center">
              <UserCheck className="w-4 h-4 mr-2 text-primary/70" />
              <div>
                <span className="font-medium text-muted-foreground">Vendedor:</span>
                <p className="text-foreground">{prospect.vendedor}</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-primary/70" />
              <div>
                <span className="font-medium text-muted-foreground">Comissão Atual:</span>
                <p className="text-foreground">{formatCurrency(prospect.comissaoAtual)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-primary/70" />
               <div>
                <span className="font-medium text-muted-foreground">Diferença:</span>
                <p className={cn("font-semibold", getDifferenceClass(prospect.diferencaComissao))}>
                  {formatCurrency(prospect.diferencaComissao)}
                </p>
              </div>
            </div>
          </div>
          
          {prospect.observacao && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground flex items-start">
                <MessageSquare className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-primary/60 flex-shrink-0" />
                <span className="line-clamp-2">{prospect.observacao}</span>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-3 border-t border-border/50 flex justify-end items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2.5 border-amber-500/40 hover:bg-amber-500/10 text-amber-600 dark:text-amber-500"
            onClick={(e) => { e.stopPropagation(); onEdit(prospect); }}
          >
            <Edit2 className="mr-1.5 h-3.5 w-3.5" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2.5 border-primary/40 hover:bg-primary/10 text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => { e.stopPropagation(); onAction(prospect); }}
            disabled={prospect.status === 'Cadastrado'}
          >
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
            {prospect.status === 'Cadastrado' ? 'Cadastrado' : 'Prospectar'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={(e) => e.stopPropagation()}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(prospect.id);}} className="text-red-500 hover:!text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProspectCard;