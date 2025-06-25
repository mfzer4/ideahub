import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox"; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/components/ui/use-toast";
import { Edit, PlusCircle } from 'lucide-react';

const RoleEditModal = ({ isOpen, onClose, role, onSubmit, allPages }) => {
  const [formData, setFormData] = useState({ name: '', permissions: [] });
  const { toast } = useToast();

  useEffect(() => {
    if (role) {
      setFormData({ id: role.id, name: role.name, permissions: role.permissions || [] });
    } else {
      setFormData({ name: '', permissions: [] });
    }
  }, [role, isOpen]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePermissionChange = (pageId) => {
    setFormData(prev => {
      const newPermissions = prev.permissions.includes(pageId)
        ? prev.permissions.filter(p => p !== pageId)
        : [...prev.permissions, pageId];
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
        toast({ title: "Nome do Cargo Inválido", description: "O nome do cargo não pode estar vazio.", variant: "destructive" });
        return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-lg border-primary/30 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl flex items-center">
            {role ? <Edit className="mr-2 h-5 w-5" /> : <PlusCircle className="mr-2 h-5 w-5" />}
            {role ? 'Editar Cargo' : 'Adicionar Novo Cargo'}
          </DialogTitle>
          <DialogDescription>
            {role ? `Editando o cargo ${formData.name}.` : 'Defina o nome e as permissões do novo cargo.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="roleName" className="text-muted-foreground">Nome do Cargo</Label>
            <Input id="roleName" name="name" value={formData.name} onChange={handleChange} className="mt-1 bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" required />
          </div>
          <div>
            <Label className="text-muted-foreground">Permissões de Acesso</Label>
            <ScrollArea className="h-48 mt-1 border border-primary/20 rounded-md p-3 bg-background/50 custom-scrollbar">
              {allPages.map(page => (
                <div key={page.id} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`perm-${page.id}-${role ? role.id : 'new'}`}
                    checked={formData.permissions.includes(page.id)}
                    onCheckedChange={() => handlePermissionChange(page.id)}
                    className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label htmlFor={`perm-${page.id}-${role ? role.id : 'new'}`} className="font-normal text-sm">{page.label}</Label>
                </div>
              ))}
            </ScrollArea>
          </div>
          <DialogFooter className="sm:justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="hover:bg-destructive/10 hover:text-destructive">Cancelar</Button>
            </DialogClose>
            <Button type="submit" className="bg-primary hover:bg-primary/90">{role ? 'Salvar Cargo' : 'Adicionar Cargo'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleEditModal;