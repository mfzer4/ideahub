import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

const RoleTable = ({ roles, onEdit, onDelete, allPages }) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <Table>
          <TableHeader>
              <TableRow className="hover:bg-muted/10 border-b-border/50">
                  <TableHead>Nome do Cargo</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {roles.map(role => (
                  <TableRow key={role.id} className="hover:bg-muted/20 border-b-border/30 last:border-b-0">
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md truncate">
                          {role.permissions && role.permissions.length > 0 
                            ? role.permissions.map(pId => allPages.find(p => p.id === pId)?.label || pId).join(', ') 
                            : 'Nenhuma permissão'}
                      </TableCell>
                      <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50 mr-1" onClick={() => onEdit(role)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => onDelete(role.id, role.name)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                      </TableCell>
                  </TableRow>
              ))}
          </TableBody>
      </Table>
    </div>
  );
};

export default RoleTable;