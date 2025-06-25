import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { initialProspectsData, calculateCommissionsFromProspectData } from '@/components/prospects/prospectUtils';

const useProspectsData = () => {
  const [prospects, setProspects] = useState([]);
  const { toast } = useToast();

  const processRawData = useCallback((data) => {
    return data.map(p => ({
      ...p,
      ...calculateCommissionsFromProspectData(p)
    }));
  }, []);

  useEffect(() => {
    const storedProspectsRaw = localStorage.getItem('prospectsData');
    if (storedProspectsRaw) {
      setProspects(processRawData(JSON.parse(storedProspectsRaw)));
    } else {
      setProspects(initialProspectsData); // initialProspectsData is already processed
      localStorage.setItem('prospectsData', JSON.stringify(initialProspectsData.map(p => {
         const { comissaoAnterior, comissaoAtual, diferencaComissao, ...rest } = p;
         return rest;
      })));
    }
  }, [processRawData]);

  const saveProspectsToLocalStorage = (updatedProspects) => {
    localStorage.setItem('prospectsData', JSON.stringify(updatedProspects.map(p => {
      const { comissaoAnterior, comissaoAtual, diferencaComissao, ...rest } = p;
      return rest;
    })));
  };

  const handleAddOrUpdateProspect = (prospectData, editingProspect) => {
    const calculatedData = { ...prospectData, ...calculateCommissionsFromProspectData(prospectData) };
    let updatedProspects;

    if (editingProspect) {
      updatedProspects = prospects.map(p => p.id === calculatedData.id ? calculatedData : p);
      toast({ title: "Prospecção Atualizada!", description: `"${calculatedData.cliente}" foi atualizado.`, className: "bg-primary text-primary-foreground" });
    } else {
      const newProspect = { ...calculatedData, id: `PROS${Date.now()}` };
      updatedProspects = [newProspect, ...prospects];
      toast({ title: "Prospecção Adicionada!", description: `"${newProspect.cliente}" foi adicionado.`, className: "bg-primary text-primary-foreground" });
    }
    setProspects(updatedProspects);
    saveProspectsToLocalStorage(updatedProspects);
  };

  const handleDeleteProspect = (prospectId) => {
    const prospectToDelete = prospects.find(p => p.id === prospectId);
    if (window.confirm(`Tem certeza que deseja excluir a prospecção de "${prospectToDelete?.cliente}"?`)) {
      const updatedProspects = prospects.filter(p => p.id !== prospectId);
      setProspects(updatedProspects);
      saveProspectsToLocalStorage(updatedProspects);
      toast({ title: "Prospecção Excluída!", description: `"${prospectToDelete?.cliente}" foi excluído.`, variant: "destructive" });
    }
  };

  return {
    prospects,
    setProspects,
    handleAddOrUpdateProspect,
    handleDeleteProspect,
  };
};

export default useProspectsData;