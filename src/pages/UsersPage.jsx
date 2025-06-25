import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Filter, PlusCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
// import { supabase } from '@/lib/supabaseClient'; // Removido pois Supabase não está integrado
import UserEditModal from '@/components/users/UserEditModal';
import RoleEditModal from '@/components/users/RoleEditModal';
import UserTable from '@/components/users/UserTable';
import RoleTable from '@/components/users/RoleTable';
import { availablePagesForPermissions } from '@/components/users/permissionUtils';
import { AppContext } from '@/App';

const UsersPage = () => {
  const [usersData, setUsersData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const { toast } = useToast();
  const appContext = useContext(AppContext);
  const currentUser = appContext ? appContext.currentUser : null;


  const [roleFilters, setRoleFilters] = useState({});
  const [statusFilters, setStatusFilters] = useState({ Ativo: true, Inativo: true, Pendente: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  
  const availableUserStatuses = ['Ativo', 'Inativo', 'Pendente'];

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    // Simula a busca de usuários, já que o login foi removido
    // Em um cenário sem login, os dados seriam mockados ou viriam de uma API pública/sem auth
    const mockUsers = [
      { id: 'mock-admin-id', name: 'Admin Mockado', email: 'admin@example.com', role_id: 'mock-admin-role-id', status: 'Ativo', avatar_fallback: 'AM', lastLogin: new Date().toLocaleDateString(), roleName: 'Admin' },
      { id: 'mock-user1-id', name: 'Usuário Mock 1', email: 'user1@example.com', role_id: 'mock-user-role-id', status: 'Ativo', avatar_fallback: 'U1', lastLogin: new Date().toLocaleDateString(), roleName: 'Usuário' },
    ];
    setUsersData(mockUsers);
    setLoadingUsers(false);
  }, []);

  const fetchRoles = useCallback(async () => {
    setLoadingRoles(true);
    // Simula a busca de cargos
    const mockRoles = [
      { id: 'mock-admin-role-id', name: 'Admin', permissions: availablePagesForPermissions.map(p => p.path) },
      { id: 'mock-user-role-id', name: 'Usuário', permissions: ['/dashboard', '/ajuda'] },
    ];
    setRoles(mockRoles);
    const initialRoleFilters = mockRoles.reduce((acc, role) => {
      acc[role.id] = true;
      return acc;
    }, {});
    setRoleFilters(initialRoleFilters);
    setLoadingRoles(false);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleRoleFilterChange = (roleId) => {
    setRoleFilters(prev => ({ ...prev, [roleId]: !prev[roleId] }));
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const handleAddOrUpdateUser = async (userData) => {
    // Lógica mockada pois não há Supabase Auth
    let resultToast;
    if (editingUser) {
      setUsersData(prev => prev.map(u => u.id === userData.id ? {...u, ...userData, roleName: roles.find(r => r.id === userData.roleId)?.name || 'N/A'} : u));
      resultToast = { title: "Usuário Atualizado!", description: `"${userData.name}" foi atualizado (simulado).`, className: "bg-primary text-primary-foreground" };
    } else {
      const newUser = {...userData, id: `mock-user-${Date.now()}`, roleName: roles.find(r => r.id === userData.roleId)?.name || 'N/A', lastLogin: new Date().toLocaleDateString() };
      setUsersData(prev => [newUser, ...prev]);
      resultToast = { title: "Usuário Adicionado!", description: `"${userData.name}" foi adicionado (simulado).`, className: "bg-primary text-primary-foreground" };
    }
    toast(resultToast);
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${userName}"? Esta ação é irreversível (simulado).`)) {
      setUsersData(prev => prev.filter(u => u.id !== userId));
      toast({ title: "Usuário Excluído!", description: `"${userName}" foi excluído (simulado).`, variant: "destructive" });
    }
  };

  const handleAddOrUpdateRole = async (roleData) => {
    let resultToast;
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === roleData.id ? {...r, ...roleData} : r));
      resultToast = { title: "Cargo Atualizado!", description: `"${roleData.name}" foi atualizado (simulado).`, className: "bg-primary text-primary-foreground" };
    } else {
      const newRole = {...roleData, id: `mock-role-${Date.now()}`};
      setRoles(prev => [newRole, ...prev]);
      resultToast = { title: "Cargo Adicionado!", description: `"${roleData.name}" foi adicionado (simulado).`, className: "bg-primary text-primary-foreground" };
    }
    toast(resultToast);
    // Atualiza filtros de cargo se um novo cargo for adicionado
    if (!editingRole) {
        setRoleFilters(prev => ({...prev, [roleData.id || `mock-role-${Date.now()}`]: true}));
    }
    fetchUsers(); // Re-renderizar usuários para refletir novo nome de cargo se necessário
    setIsRoleModalOpen(false);
    setEditingRole(null);
  };
   
  const handleDeleteRole = async (roleId, roleName) => {
     const usersWithRole = usersData.filter(user => user.role_id === roleId);

    if (usersWithRole.length > 0) {
      toast({ title: "Erro ao Excluir Cargo", description: `Não é possível excluir o cargo "${roleName}" pois ele está atribuído a ${usersWithRole.length} usuário(s) (simulado).`, variant: "destructive" });
      return;
    }

    if (window.confirm(`Tem certeza que deseja excluir o cargo "${roleName}" (simulado)?`)) {
      setRoles(prev => prev.filter(r => r.id !== roleId));
      toast({ title: "Cargo Excluído!", description: `"${roleName}" foi excluído (simulado).`, variant: "destructive" });
    }
  };

  const filteredUsers = usersData.filter(user => {
    const roleMatch = roleFilters[user.role_id];
    const statusMatch = statusFilters[user.status];
    const searchTermMatch = searchTerm === '' || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return roleMatch && statusMatch && searchTermMatch;
  });

  if (loadingUsers || loadingRoles) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
            <Users className="mr-3 h-8 w-8" /> Controle de Usuários
          </h1>
          <p className="text-muted-foreground">Gerencie todos os usuários e cargos da plataforma.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => { setEditingRole(null); setIsRoleModalOpen(true); }} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
              <ShieldCheck className="mr-2 h-5 w-5" /> Adicionar Cargo
            </Button>
            <Button onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }} className="bg-gradient-to-r from-primary via-emerald-500 to-green-400 text-primary-foreground hover:opacity-90 transition-opacity">
              <UserPlus className="mr-2 h-5 w-5" /> Adicionar Usuário
            </Button>
        </div>
      </header>

      <Card className="shadow-xl backdrop-blur-lg bg-card/60 dark:bg-card/30 border-primary/30 dark:border-primary/20">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle className="text-xl">Lista de Usuários</CardTitle>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar usuário..." className="pl-10 w-full bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-transparent hover:bg-accent/50 border-primary/30">
                    <Filter className="mr-2 h-4 w-4" /> Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-primary/20 shadow-xl w-56">
                  <DropdownMenuLabel>Filtrar por Cargo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {roles.map(role => (
                    <DropdownMenuCheckboxItem
                      key={role.id}
                      checked={roleFilters[role.id] || false}
                      onCheckedChange={() => handleRoleFilterChange(role.id)}
                    >
                      {role.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuLabel className="mt-2">Filtrar por Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   {availableUserStatuses.map(status => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilters[status]}
                      onCheckedChange={() => handleStatusFilterChange(status)}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <UserTable 
            users={filteredUsers} 
            roles={roles}
            onEdit={(user) => { setEditingUser(user); setIsUserModalOpen(true); }}
            onDelete={handleDeleteUser}
          />
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-border/50 gap-4">
          <p className="text-xs text-muted-foreground">
            Mostrando {filteredUsers.length} de {usersData.length} usuários.
          </p>
          
        </CardFooter>
      </Card>

       <UserEditModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        user={editingUser} 
        roles={roles} 
        onSubmit={handleAddOrUpdateUser}
        availableStatuses={availableUserStatuses}
        isLoginSystemActive={false} 
      />

      <RoleEditModal 
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        role={editingRole}
        onSubmit={handleAddOrUpdateRole}
        allPages={availablePagesForPermissions}
      />

      <Card className="mt-6 shadow-xl backdrop-blur-lg bg-card/60 dark:bg-card/30 border-primary/30 dark:border-primary/20">
        <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex justify-between items-center">
                 <CardTitle className="text-xl">Gerenciamento de Cargos</CardTitle>
                 <Button onClick={() => { setEditingRole(null); setIsRoleModalOpen(true); }} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Cargo
                 </Button>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <RoleTable
              roles={roles}
              onEdit={(role) => {setEditingRole(role); setIsRoleModalOpen(true);}}
              onDelete={handleDeleteRole}
              allPages={availablePagesForPermissions}
            />
        </CardContent>
      </Card>

    </motion.div>
  );
};

export default UsersPage;