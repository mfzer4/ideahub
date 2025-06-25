import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FilePlus, User, Shield, CalendarDays, DollarSign, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const PolicyRegistrationPage = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    policyType: '',
    premium: '',
    startDate: '',
    expiryDate: '',
    status: 'Pendente Confirmação', 
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const prospectDataString = localStorage.getItem('prospectToRegister');
    if (prospectDataString) {
      const prospectData = JSON.parse(prospectDataString);
      setFormData(prev => ({
        ...prev,
        clientName: prospectData.clientName || '',
        policyType: prospectData.policyType || '',
        // Adicione outros campos relevantes da prospecção se necessário
      }));
      // localStorage.removeItem('prospectToRegister'); // Remover após carregar para não reutilizar
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validação básica
    if (!formData.clientName || !formData.policyType || !formData.premium || !formData.startDate || !formData.expiryDate) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
        action: <AlertCircle className="text-red-500" />,
      });
      return;
    }

    // Simular salvamento da apólice (localStorage por enquanto)
    const existingPolicies = JSON.parse(localStorage.getItem('registeredPolicies') || '[]');
    const newPolicy = { ...formData, id: `POL${String(existingPolicies.length + 1).padStart(3, '0')}`, status: 'Ativa' }; // Define como Ativa ao confirmar
    localStorage.setItem('registeredPolicies', JSON.stringify([...existingPolicies, newPolicy]));
    localStorage.removeItem('prospectToRegister'); // Limpa o prospecto após o cadastro

    toast({
      title: "Apólice Cadastrada!",
      description: `A apólice para ${formData.clientName} foi confirmada e cadastrada com sucesso.`,
      className: "bg-green-500 text-white dark:bg-green-700",
      action: <CheckCircle className="text-white" />,
    });
    
    // Limpar formulário e redirecionar
    setFormData({ clientName: '', policyType: '', premium: '', startDate: '', expiryDate: '', status: 'Pendente Confirmação' });
    navigate('/apolices'); 
  };

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
            <FilePlus className="mr-3 h-8 w-8" /> Cadastro e Confirmação de Apólice
          </h1>
          <p className="text-muted-foreground">Confirme os dados e cadastre a nova apólice.</p>
        </div>
      </header>

      <Card className="shadow-xl backdrop-blur-lg bg-card/60 dark:bg-card/30 border-primary/30 dark:border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Detalhes da Nova Apólice</CardTitle>
          <CardDescription>Revise as informações abaixo e confirme o cadastro.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="flex items-center"><User className="mr-2 h-4 w-4 text-primary" />Nome do Cliente</Label>
                <Input id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Nome completo do cliente" required className="bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyType" className="flex items-center"><Shield className="mr-2 h-4 w-4 text-primary" />Tipo de Apólice</Label>
                <Input id="policyType" name="policyType" value={formData.policyType} onChange={handleChange} placeholder="Ex: Automóvel, Residencial, Vida" required className="bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="premium" className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-primary" />Prêmio (Anual)</Label>
                <Input id="premium" name="premium" type="number" step="0.01" value={formData.premium} onChange={handleChange} placeholder="Ex: 2500.00" required className="bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary" />Data de Início</Label>
                <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required className="bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary" />Data de Vencimento</Label>
                <Input id="expiryDate" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} required className="bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center"><Shield className="mr-2 h-4 w-4 text-primary" />Status Atual</Label>
                <Input id="status" name="status" value={formData.status} disabled className="bg-muted/50 border-primary/20" />
            </div>


            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-gradient-to-r from-primary via-emerald-500 to-green-400 text-primary-foreground hover:opacity-90 transition-opacity">
                <Save className="mr-2 h-5 w-5" /> Confirmar e Cadastrar Apólice
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PolicyRegistrationPage;