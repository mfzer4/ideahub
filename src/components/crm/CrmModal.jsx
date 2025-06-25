import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/components/ui/use-toast";
import { X, Save, MessageSquare, CalendarDays, Tag, User, DollarSign, Phone, Mail, Edit, Eye, PlusCircle } from 'lucide-react';
import { sellersData } from '@/data/crmData';
import { AppContext } from '@/App';

const priorityOptions = [
  { value: 'Baixa', label: 'Baixa' },
  { value: 'Média', label: 'Média' },
  { value: 'Alta', label: 'Alta' },
];

const CrmModal = ({ isOpen, onClose, modalConfig, onSaveTask, onAddNote }) => {
  const { type, task, columnId } = modalConfig;
  const [formData, setFormData] = useState({});
  const [newNote, setNewNote] = useState('');
  const { toast } = useToast();
  const appContext = useContext(AppContext);
  const currentUser = appContext ? appContext.currentUser : null;

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
    } else if (type === 'newProject') {
      setFormData({
        title: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        description: '',
        assignedTo: currentUser?.roleName === 'Vendedor' ? currentUser.id : (sellersData.length > 0 ? sellersData[0].id : ''), // Ajustado para roleName
        tags: [],
        progress: 0,
        priority: 'Média',
        value: 0,
        notes: [],
        createdBy: currentUser?.id,
        lastActivity: new Date().toISOString().split('T')[0]
      });
    }
  }, [task, type, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSave = () => {
    if (type === 'note' && newNote.trim() !== '') {
      onAddNote(task.id, columnId, newNote);
      setNewNote('');
    } else if (type === 'edit' || type === 'newProject') {
      onSaveTask(formData, columnId, type === 'newProject');
    }
    onClose();
  };

  const getModalTitle = () => {
    switch (type) {
      case 'view': return `Detalhes: ${task?.title}`;
      case 'edit': return `Editar: ${task?.title}`;
      case 'note': return `Adicionar Nota: ${task?.title}`;
      case 'logCall': return `Registrar Ligação: ${task?.title}`;
      case 'sendEmail': return `Enviar Email: ${task?.title}`;
      case 'newProject': return 'Criar Novo Projeto';
      default: return 'Projeto CRM';
    }
  };

  const renderViewContent = () => (
    <ScrollArea className="max-h-[70vh] pr-4">
      <div className="space-y-4 text-sm">
        <p><strong className="text-primary">Cliente:</strong> {formData.clientName}</p>
        <p><strong className="text-primary">Telefone:</strong> {formData.clientPhone}</p>
        <p><strong className="text-primary">Email:</strong> {formData.clientEmail}</p>
        <p><strong className="text-primary">Descrição:</strong> {formData.description || 'N/A'}</p>
        <p><strong className="text-primary">Responsável:</strong> {sellersData.find(s => s.id === formData.assignedTo)?.name || 'N/A'}</p>
        <p><strong className="text-primary">Progresso:</strong> {formData.progress}%</p>
        <p><strong className="text-primary">Prioridade:</strong> {formData.priority}</p>
        <p><strong className="text-primary">Valor Estimado:</strong> R$ {Number(formData.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        <div><strong className="text-primary">Tags:</strong>
          <div className="flex flex-wrap gap-1 mt-1">
            {formData.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
        </div>
        <div><strong className="text-primary">Notas:</strong>
          {formData.notes?.length > 0 ? (
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {formData.notes.map(note => <li key={note.id}>"{note.text}" <span className="text-xs text-muted-foreground">({new Date(note.date).toLocaleDateString()})</span></li>)}
            </ul>
          ) : <p className="text-muted-foreground">Nenhuma nota.</p>}
        </div>
        <p><strong className="text-primary">Última Atividade:</strong> {new Date(formData.lastActivity).toLocaleDateString()}</p>
      </div>
    </ScrollArea>
  );

  const renderEditForm = () => (
    <ScrollArea className="max-h-[70vh] pr-4">
      <div className="space-y-4">
        <div><Label htmlFor="title">Título do Projeto</Label><Input id="title" name="title" value={formData.title || ''} onChange={handleChange} /></div>
        <div><Label htmlFor="clientName">Nome do Cliente</Label><Input id="clientName" name="clientName" value={formData.clientName || ''} onChange={handleChange} /></div>
        <div><Label htmlFor="clientPhone">Telefone do Cliente</Label><Input id="clientPhone" name="clientPhone" value={formData.clientPhone || ''} onChange={handleChange} /></div>
        <div><Label htmlFor="clientEmail">Email do Cliente</Label><Input id="clientEmail" name="clientEmail" type="email" value={formData.clientEmail || ''} onChange={handleChange} /></div>
        <div><Label htmlFor="description">Descrição</Label><Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} /></div>
        <div><Label htmlFor="assignedTo">Responsável</Label>
          <Select name="assignedTo" value={formData.assignedTo || ''} onValueChange={(value) => handleSelectChange('assignedTo', value)}>
            <SelectTrigger><SelectValue placeholder="Selecione um vendedor" /></SelectTrigger>
            <SelectContent>{sellersData.map(seller => <SelectItem key={seller.id} value={seller.id}>{seller.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label htmlFor="progress">Progresso (%)</Label><Input id="progress" name="progress" type="number" min="0" max="100" value={formData.progress || 0} onChange={handleChange} /></div>
        <div><Label htmlFor="priority">Prioridade</Label>
          <Select name="priority" value={formData.priority || 'Média'} onValueChange={(value) => handleSelectChange('priority', value)}>
            <SelectTrigger><SelectValue placeholder="Selecione a prioridade" /></SelectTrigger>
            <SelectContent>{priorityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label htmlFor="value">Valor Estimado (R$)</Label><Input id="value" name="value" type="number" step="0.01" value={formData.value || 0} onChange={handleChange} /></div>
        <div><Label htmlFor="tags-input">Tags (pressione Enter para adicionar)</Label>
          <Input id="tags-input" placeholder="Adicionar tag..." onKeyDown={handleTagsChange} />
          <div className="flex flex-wrap gap-1 mt-2">
            {formData.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center">
                {tag} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  const renderNoteForm = () => (
    <div className="space-y-4">
      <div><Label htmlFor="newNote">Nova Nota</Label><Textarea id="newNote" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Digite sua nota aqui..." /></div>
      {task?.notes?.length > 0 && (
        <div><Label>Notas Anteriores</Label>
          <ScrollArea className="h-32 border rounded-md p-2 mt-1">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {task.notes.map(note => <li key={note.id}>"{note.text}" <span className="text-xs text-muted-foreground">({new Date(note.date).toLocaleDateString()})</span></li>)}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
  
  const renderPlaceholderForm = (formType) => (
     <div className="space-y-4">
      <p className="text-muted-foreground">Formulário para "{formType}" ainda não implementado.</p>
      <p>Você pode adicionar campos aqui como:</p>
      <ul className="list-disc list-inside text-muted-foreground text-sm">
        <li>Data e Hora da Ligação</li>
        <li>Resumo da Conversa</li>
        <li>Próximos Passos</li>
      </ul>
    </div>
  );


  const renderContent = () => {
    switch (type) {
      case 'view': return renderViewContent();
      case 'edit':
      case 'newProject': return renderEditForm();
      case 'note': return renderNoteForm();
      case 'logCall': return renderPlaceholderForm("Registrar Ligação");
      case 'sendEmail': return renderPlaceholderForm("Enviar Email");
      default: return <p>Tipo de modal desconhecido.</p>;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-card/80 backdrop-blur-lg border-primary/30 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl flex items-center">
            {type === 'edit' && <Edit className="mr-2 h-5 w-5" />}
            {type === 'view' && <Eye className="mr-2 h-5 w-5" />}
            {type === 'note' && <MessageSquare className="mr-2 h-5 w-5" />}
            {type === 'newProject' && <PlusCircle className="mr-2 h-5 w-5" />}
            {getModalTitle()}
          </DialogTitle>
          {type !== 'view' && <DialogDescription>Faça as alterações necessárias e clique em salvar.</DialogDescription>}
        </DialogHeader>
        
        <div className="py-4">
          {renderContent()}
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          {type !== 'view' && (
            <Button type="button" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {type === 'note' ? 'Adicionar Nota' : 'Salvar Alterações'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrmModal;