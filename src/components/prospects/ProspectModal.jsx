import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/components/ui/use-toast";
import { Save, XCircle, PlusCircle, DollarSign, Percent, Paperclip, X, FileText, CheckSquare, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { statusOptions as defaultStatusOptions, situacaoOptions as defaultSituacaoOptions, sellerOptions as defaultSellerOptions, parsePercentageForCalc, calculateCommissionsFromProspectData } from '@/components/prospects/prospectUtils';

const formatCurrencyDisplay = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const ProspectModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  prospectData, 
  statusOptions = defaultStatusOptions, 
  situacaoOptions = defaultSituacaoOptions, 
  sellers = defaultSellerOptions,
  mode = 'edit'
}) => {
  const [formData, setFormData] = useState({});
  const { toast } = useToast();
  const isEditing = !!prospectData;
  const isReadOnly = mode === 'confirm';

  const calculateCommissions = useCallback((currentFormData) => {
    return calculateCommissionsFromProspectData(currentFormData);
  }, []);

  useEffect(() => {
    const initialData = {
      vigenciaFinal: new Date().toISOString().split('T')[0],
      cliente: '',
      produto: '',
      seguradora: '',
      vendedor: sellers.length > 0 ? sellers[0].id : '',
      premioLiquidoAnterior: '',
      percentualAnterior: '',
      premioLiquidoAtual: '',
      percentualAtual: '',
      planoAnterior: '', 
      planoAtual: '', 
      analise: '',
      status: statusOptions.length > 0 ? statusOptions[0] : '',
      situacao: situacaoOptions.length > 0 ? situacaoOptions[0] : '',
      observacao: '',
      attachment: null,
      comissaoAnterior: 0,
      comissaoAtual: 0,
      diferencaComissao: 0,
    };

    const dataToSet = prospectData 
      ? { 
          ...initialData, 
          ...prospectData,
          premioLiquidoAnterior: prospectData.premioLiquidoAnterior || '',
          percentualAnterior: prospectData.percentualAnterior || '',
          premioLiquidoAtual: prospectData.premioLiquidoAtual || '',
          percentualAtual: prospectData.percentualAtual || '',
          attachment: prospectData.attachment || null,
        } 
      : initialData;

    const commissions = calculateCommissions(dataToSet);
    setFormData({ ...dataToSet, ...commissions });

  }, [prospectData, isOpen, sellers, statusOptions, situacaoOptions, calculateCommissions]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      const commissions = calculateCommissions(newFormData);
      return { ...newFormData, ...commissions };
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      const commissions = calculateCommissions(newFormData);
      return { ...newFormData, ...commissions };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "Arquivo muito grande!",
          description: "O tamanho máximo do anexo é 5MB.",
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        attachment: {
          name: file.name,
          size: file.size,
          type: file.type,
        }
      }));
    }
  };
  
  const handleViewAttachment = () => {
    if (!formData.attachment) return;
    toast({
        title: "Visualização de Anexo",
        description: `Em um ambiente real, o arquivo "${formData.attachment.name}" seria aberto.`,
        className: "bg-blue-600 text-white dark:bg-blue-800 border-blue-700",
    });
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, attachment: null }));
    const fileInput = document.getElementById('attachment');
    if(fileInput) {
        fileInput.value = '';
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      premioLiquidoAnterior: parseFloat(formData.premioLiquidoAnterior) || 0,
      percentualAnterior: parseFloat(formData.percentualAnterior) || 0,
      premioLiquidoAtual: parseFloat(formData.premioLiquidoAtual) || 0,
      percentualAtual: parseFloat(formData.percentualAtual) || 0,
    };
    onSubmit(dataToSubmit);
  };
  
  const inputFields = [
    { name: 'vigenciaFinal', label: 'Vigência Final', type: 'date', className: "md:col-span-1" },
    { name: 'cliente', label: 'Cliente', placeholder: 'Nome completo do cliente', className: "md:col-span-2 lg:col-span-1" },
    { name: 'produto', label: 'Produto', placeholder: 'Ex: Automóvel, Residencial', className: "md:col-span-1" },
    { name: 'seguradora', label: 'Seguradora', placeholder: 'Nome da seguradora', className: "md:col-span-1" },
    { name: 'vendedor', label: 'Vendedor', type: 'select', options: sellers.map(s => ({ value: s.id, label: s.name })), className: "md:col-span-1" },
    
    { type: 'separator', label: 'Dados Anteriores', className: "md:col-span-3 mt-2 mb-0" },
    { name: 'planoAnterior', label: 'Plano Anterior', placeholder: 'Descrição do plano antigo', className: "md:col-span-1" },
    { name: 'premioLiquidoAnterior', label: 'Prêmio Líquido Anterior (R$)', type: 'number', step: "0.01", placeholder: "0.00", className: "md:col-span-1" },
    { name: 'percentualAnterior', label: '% Anterior', type: 'number', step: "0.01", placeholder: 'Ex: 5 para 5%', className: "md:col-span-1" },
    
    { type: 'separator', label: 'Dados Atuais', className: "md:col-span-3 mt-2 mb-0" },
    { name: 'planoAtual', label: 'Plano Atual', placeholder: 'Descrição do novo plano', className: "md:col-span-1" },
    { name: 'premioLiquidoAtual', label: 'Prêmio Líquido Atual (R$)', type: 'number', step: "0.01", placeholder: "0.00", className: "md:col-span-1" },
    { name: 'percentualAtual', label: '% Atual', type: 'number', step: "0.01", placeholder: 'Ex: 7 para 7%', className: "md:col-span-1" },

    { type: 'separator', label: 'Comissões Calculadas', className: "md:col-span-3 mt-2 mb-0" },
    { name: 'comissaoAnterior', label: 'Comissão Anterior (R$)', type: 'text', readOnly: true, value: formatCurrencyDisplay(formData.comissaoAnterior), className: "md:col-span-1" },
    { name: 'comissaoAtual', label: 'Comissão Atual (R$)', type: 'text', readOnly: true, value: formatCurrencyDisplay(formData.comissaoAtual), className: "md:col-span-1" },
    { name: 'diferencaComissao', label: 'Diferença de Comissão (R$)', type: 'text', readOnly: true, value: formatCurrencyDisplay(formData.diferencaComissao), className: "md:col-span-1" },
    
    { type: 'separator', label: 'Outras Informações', className: "md:col-span-3 mt-2 mb-0" },
    { name: 'analise', label: 'Análise', placeholder: 'Breve análise da prospecção', className: "md:col-span-1" },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions.map(s => ({ value: s, label: s })), className: "md:col-span-1" },
    { name: 'situacao', label: 'Situação', type: 'select', options: situacaoOptions.map(s => ({ value: s, label: s })), className: "md:col-span-1" },
    { name: 'observacao', label: 'Observação', type: 'textarea', placeholder: 'Detalhes adicionais...', className: "md:col-span-3" },
    { name: 'attachment', label: 'Anexo', type: 'file', className: "md:col-span-3" },
  ];


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-card/90 backdrop-blur-lg border-primary/30 text-foreground max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-primary text-xl flex items-center">
            {mode === 'confirm' ? (
                <><FileText className="mr-2 h-5 w-5" /> Conferir Prospecção</>
            ) : (
                <>{isEditing ? <Save className="mr-2 h-5 w-5" /> : <PlusCircle className="mr-2 h-5 w-5" />} {isEditing ? 'Editar Prospecção' : 'Adicionar Nova Prospecção'}</>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'confirm' ? `Confira os dados de ${prospectData?.cliente} antes de criar a apólice.` : (isEditing ? `Editando dados para ${prospectData?.cliente || 'a prospecção'}.` : 'Preencha os campos abaixo para criar uma nova linha.')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto">
          <ScrollArea className="h-full px-6 custom-scrollbar">
            <form onSubmit={handleSubmitForm} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 py-4">
              {inputFields.map((field, index) => {
                if (field.type === 'separator') {
                  return (
                    <div key={`sep-${index}`} className={cn("md:col-span-3 my-3 py-2 border-b border-border/50", field.className)}>
                      <h4 className="text-sm font-semibold text-primary flex items-center">
                        {field.label === 'Comissões Calculadas' ? <DollarSign className="mr-2 h-4 w-4" /> : <Percent className="mr-2 h-4 w-4" />}
                        {field.label}
                      </h4>
                    </div>
                  );
                }
                 if (field.type === 'file') {
                  return (
                    <div key={field.name} className={cn("mb-3", field.className)}>
                      <Label htmlFor={field.name} className="text-xs font-medium text-muted-foreground">{field.label}</Label>
                      <div className="mt-1 flex items-center gap-2">
                        {isReadOnly ? (
                           formData.attachment ? (
                            <>
                              <div className="flex-grow flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm border border-input h-9">
                                <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate flex-grow">{formData.attachment.name}</span>
                              </div>
                              <Button type="button" variant="outline" onClick={handleViewAttachment} className="h-9">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Anexo
                              </Button>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground italic h-9 flex items-center">Nenhum anexo fornecido.</p>
                          )
                        ) : (
                          <>
                            <Input id={field.name} name={field.name} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xml" />
                            <Button type="button" variant="outline" onClick={() => document.getElementById(field.name)?.click()} className="h-9">
                              <Paperclip className="mr-2 h-4 w-4" />
                              {formData.attachment ? 'Trocar Anexo' : 'Adicionar Anexo'}
                            </Button>
                            {formData.attachment && (
                              <div className="flex-grow flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm border border-input h-9">
                                <span className="truncate flex-grow">{formData.attachment.name}</span>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleRemoveFile}>
                                  <X className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={field.name} className={cn("mb-3", field.className)}>
                    <Label htmlFor={field.name} className="text-xs font-medium text-muted-foreground">{field.label}</Label>
                    {field.type === 'select' ? (
                      <Select
                        name={field.name}
                        value={formData[field.name] || ''}
                        onValueChange={(value) => handleSelectChange(field.name, value)}
                        disabled={isReadOnly}
                      >
                        <SelectTrigger id={field.name} className={cn("mt-1 bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary text-sm h-9", isReadOnly && "cursor-not-allowed bg-muted/30")}>
                          <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover text-popover-foreground border-primary/20 shadow-xl text-sm">
                          {field.options.map(option => (
                            <SelectItem key={option.value} value={option.value} className="text-sm">{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === 'textarea' ? (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        readOnly={isReadOnly}
                        className={cn("mt-1 min-h-[60px] bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary text-sm", isReadOnly && "cursor-not-allowed bg-muted/30")}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type || 'text'}
                        value={field.readOnly ? field.value : (formData[field.name] || '')}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        step={field.step}
                        readOnly={isReadOnly || field.readOnly}
                        className={cn("mt-1 bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary text-sm h-9", (isReadOnly || field.readOnly) && "cursor-not-allowed bg-muted/30 focus:ring-0")}
                      />
                    )}
                  </div>
                );
              })}
            </form>
          </ScrollArea>
        </div>

        <DialogFooter className="sm:justify-end gap-2 px-6 pb-6 pt-4 border-t border-border/50 mt-auto">
          {mode === 'confirm' ? (
            <>
              <Button type="button" variant="outline" onClick={onClose} className="hover:bg-accent hover:text-accent-foreground">
                <XCircle className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button onClick={onSubmit} className="bg-gradient-to-r from-primary via-emerald-500 to-green-400 text-primary-foreground hover:opacity-90 transition-opacity">
                <CheckSquare className="mr-2 h-4 w-4" /> Confirmar Cadastro
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive">
                <XCircle className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button type="submit" onClick={handleSubmitForm} className="bg-primary hover:bg-primary/90">
                <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Salvar Alterações' : 'Adicionar Prospecção'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProspectModal;