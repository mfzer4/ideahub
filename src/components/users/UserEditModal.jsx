import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Edit, UserPlus } from 'lucide-react';

const UserEditModal = ({ isOpen, onClose, user, roles, onSubmit, availableStatuses }) => {
  const [formData, setFormData] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({ 
        id: user.id,
        name: user.name || '', 
        email: user.email || '', 
        password: '', 
        confirmPassword: '', 
        roleId: user.role_id || (roles.length > 0 ? roles[0].id : ''), 
        status: user.status || 'Ativo' 
      });
    } else {
      setFormData({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        roleId: roles.length > 0 ? roles[0].id : '', 
        status: 'Ativo' 
      });
    }
  }, [user, isOpen, roles]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({ title: "Erro de Senha", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    
    const userDataToSubmit = { ...formData };
    delete userDataToSubmit.confirmPassword; 
    if (!userDataToSubmit.password) {
        delete userDataToSubmit.password;
    }
    onSubmit(userDataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-lg border-primary/30 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl flex items-center">
            {user ? <Edit className="mr-2 h-5 w-5" /> : <UserPlus className="mr-2 h-5 w-5" />}
            {user ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {user ? `Editando informações de ${formData.name || 'usuário'}.` : 'Preencha os dados do novo usuário.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name" className="text-muted-foreground">Nome</Label>
            <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" required />
          </div>
          <div>
            <Label htmlFor="email" className="text-muted-foreground">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} className="mt-1 bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" required disabled={!!user} />
          </div>
          <div>
            <Label htmlFor="password">{user ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha'}</Label>
            <Input id="password" name="password" type="password" value={formData.password || ''} onChange={handleChange} className="mt-1 bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" required={!user} />
          </div>
           {(formData.password || !user) && (
             <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword || ''} onChange={handleChange} className="mt-1 bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" required={!user || !!formData.password} />
             </div>
           )}
          <div>
            <Label htmlFor="roleId" className="text-muted-foreground">Cargo</Label>
            <Select name="roleId" value={formData.roleId || ''} onValueChange={(value) => handleSelectChange('roleId', value)}>
              <SelectTrigger id="roleId" className="mt-1 bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary">
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
                {roles.map(role => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status" className="text-muted-foreground">Status</Label>
            <Select name="status" value={formData.status || ''} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger id="status" className="mt-1 bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
                {availableStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="hover:bg-destructive/10 hover:text-destructive">Cancelar</Button>
            </DialogClose>
            <Button type="submit" className="bg-primary hover:bg-primary/90">{user ? 'Salvar Alterações' : 'Adicionar Usuário'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;