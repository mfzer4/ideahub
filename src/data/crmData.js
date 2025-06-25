import React from 'react';

export const sellersData = [
  { id: 'seller1', name: 'Bruno Vasconcelos', email: 'bruno.v@example.com', avatarFallback: 'BV' },
  { id: 'seller2', name: 'Daniel Furtado', email: 'daniel.f@example.com', avatarFallback: 'DF' },
  { id: 'seller3', name: 'Carla Matos', email: 'carla.m@example.com', avatarFallback: 'CM' },
  { id: 'seller4', name: 'Rafael Lima', email: 'rafael.l@example.com', avatarFallback: 'RL' },
];

export const initialColumnsData = {
  'not-started': {
    name: 'Não Iniciado',
    color: 'bg-slate-500',
    items: [
      { id: 'task-1', title: 'Miguel Ferreira - Prospecção Saúde', clientName: 'Miguel Ferreira', clientPhone: '12-99770-XXXX', clientEmail: 'miguel.f@example.com', description: 'Cliente interessado em plano de saúde individual. Ligar para agendar conversa.', progress: 0, tags: ['Saúde', 'Novo Cliente'], assignedTo: 'seller1', createdBy: 'admin', lastActivity: '2025-06-01', priority: 'Alta', value: 300.00, notes: [] },
      { id: 'task-2', title: 'Ana Clara - Cotação Residencial', clientName: 'Ana Clara Matos', clientPhone: '34-98866-YYYY', clientEmail: 'ana.clara@example.com', description: 'Solicitou cotação para seguro residencial completo. Verificar cobertura para área externa.', progress: 0, tags: ['Residencial', 'Urgente'], assignedTo: 'seller2', createdBy: 'admin', lastActivity: '2025-06-02', priority: 'Média', value: 550.00, notes: [] },
    ],
  },
  'in-progress': {
    name: 'Em Andamento',
    color: 'bg-blue-500',
    items: [
      { id: 'task-3', title: 'Follow-up João Silva', clientName: 'João Silva Pereira', clientPhone: '56-97755-ZZZZ', clientEmail: 'joao.silva@example.com', description: 'Realizar follow-up sobre a proposta de seguro auto enviada semana passada.', progress: 50, tags: ['Automóvel', 'Retorno'], assignedTo: 'seller1', createdBy: 'admin', lastActivity: '2025-06-03', priority: 'Alta', value: 1200.00, notes: [{ id: 'note-1', text: 'Cliente pediu para ligar após as 18h.', date: '2025-06-03' }]  },
    ],
  },
  'waiting-feedback': {
    name: 'Aguardando Retorno',
    color: 'bg-yellow-500',
    items: [
       { id: 'task-5', title: 'Proposta Empresa XYZ', clientName: 'Empresa XYZ (Contato: Sra. Marta)', clientPhone: '11-5555-4444', clientEmail: 'marta@xyzcorp.com', description: 'Proposta de seguro empresarial enviada. Aguardando aprovação da diretoria.', progress: 75, tags: ['Empresarial', 'Proposta Enviada'], assignedTo: 'seller3', createdBy: 'admin', lastActivity: '2025-06-04', priority: 'Alta', value: 5000.00, notes: [] },
    ],
  },
  'completed': {
    name: 'Concluído',
    color: 'bg-green-500',
    items: [
      { id: 'task-4', title: 'Apólice Vida - Família Souza', clientName: 'Família Souza (Contato: Roberto)', clientPhone: '78-96644-WWWW', clientEmail: 'roberto.souza@example.com', description: 'Apólice de seguro de vida familiar emitida e enviada ao cliente.', progress: 100, tags: ['Vida', 'Família', 'Fechado'], assignedTo: 'seller2', createdBy: 'admin', lastActivity: '2025-05-20', priority: 'Média', value: 800.00, notes: [] },
    ],
  },
};