import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, ChevronDown, Shield, Briefcase, User, KeyRound, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const getRoleIcon = (roleName) => {
  const lowerRoleName = roleName?.toLowerCase();
  if (lowerRoleName === 'admin') return <Shield className="h-3.5 w-3.5 mr-1.5 text-red-500" />;
  if (lowerRoleName === 'vendedor') return <Briefcase className="h-3.5 w-3.5 mr-1.5 text-blue-500" />;
  if (lowerRoleName === 'cliente') return <User className="h-3.5 w-3.5 mr-1.5 text-green-500" />;
  if (lowerRoleName === 'cadastro') return <KeyRound className="h-3.5 w-3.5 mr-1.5 text-purple-500" />;
  return <Settings2 className="h-3.5 w-3.5 mr-1.5 text-gray-500" />;
};

const getRoleBadgeVariantStyle = (roleName) => {
  const lowerRoleName = roleName?.toLowerCase();
  if (lowerRoleName === 'admin') return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
  if (lowerRoleName === 'vendedor') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
  if (lowerRoleName === 'cliente') return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30';
  if (lowerRoleName === 'cadastro') return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
  return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30';
};

const getStatusBadgeVariantStyle = (status) => {
  if (status === 'Ativo') return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30';
  if (status === 'Inativo') return 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30';
  if (status === 'Pendente') return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
  return '';
};


const UserTable = ({ users, roles, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/10 border-b-border/50">
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Último Login</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const userRole = roles.find(r => r.id === user.role_id);
            return (
            <TableRow key={user.id} className="hover:bg-muted/20 border-b-border/30 last:border-b-0">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar_url || `https://source.unsplash.com/random/100x100/?person&sig=${user.id}`} alt={user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">{user.avatar_fallback || user.name?.substring(0,2).toUpperCase() || '??'}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("text-xs font-semibold px-2 py-0.5 rounded-full flex items-center", getRoleBadgeVariantStyle(userRole?.name))}>
                  {getRoleIcon(userRole?.name)}
                  {userRole?.name || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>
                 <Badge variant="outline" className={cn("text-xs", getStatusBadgeVariantStyle(user.status))}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.lastLogin || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl">
                     <DropdownMenuItem onClick={() => onEdit(user)} className="hover:!bg-primary/10 focus:!bg-primary/10">
                      <Edit className="mr-2 h-4 w-4" /> Editar Usuário
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(user.id, user.name)} className="text-red-500 hover:!bg-red-500/10 focus:!bg-red-500/10">
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir Usuário
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;