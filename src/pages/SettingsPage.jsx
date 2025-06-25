import React from 'react';
import { motion } from 'framer-motion';
import { Settings, UserCircle, Bell, ShieldCheck, Palette, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; 
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

const SettingsSection = ({ title, description, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="shadow-xl glassmorphic-card">
      <CardHeader className="flex flex-row items-center space-x-4 pb-4">
        <div className="p-3 bg-primary/10 text-primary rounded-lg">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

const SettingsPage = () => {
  const { theme } = useTheme();
  
  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <header className="flex items-center justify-between mb-8 sticky top-0 py-4 glassmorphic-header z-10 px-4 -mx-4 md:px-0 md:mx-0">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-500 to-green-400"
          >
            Configurações
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-sm"
          >
            Personalize suas preferências e configurações da plataforma.
          </motion.p>
        </div>
      </header>

      <main className="pt-2 space-y-8">
        <SettingsSection title="Perfil do Usuário" description="Gerencie suas informações pessoais e de contato." icon={UserCircle}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" defaultValue="Admin User" className="mt-1 bg-background/50 border-foreground/20 focus:bg-background/70 focus:border-primary"/>
            </div>
            <div>
              <Label htmlFor="email">Endereço de E-mail</Label>
              <Input id="email" type="email" defaultValue="admin@segurospro.com" className="mt-1 bg-background/50 border-foreground/20 focus:bg-background/70 focus:border-primary"/>
            </div>
          </div>
          <div>
            <Label htmlFor="avatar">URL do Avatar</Label>
            <Input id="avatar" defaultValue="https://source.unsplash.com/random/100x100/?portrait,person" className="mt-1 bg-background/50 border-foreground/20 focus:bg-background/70 focus:border-primary"/>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar Alterações do Perfil</Button>
        </SettingsSection>

        <SettingsSection title="Preferências de Tema" description="Escolha a aparência da plataforma." icon={Palette}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Modo Atual: <span className="capitalize font-semibold text-primary">{theme}</span></p>
            <ThemeToggle />
          </div>
          <p className="text-xs text-muted-foreground">
            Alterne entre os temas claro e escuro para melhor visualização.
          </p>
        </SettingsSection>

        <SettingsSection title="Notificações" description="Configure como você recebe alertas e atualizações." icon={Bell}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                <span>Notificações por E-mail</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receba alertas importantes e resumos por e-mail.
                </span>
              </Label>
              <Switch id="emailNotifications" defaultChecked className="data-[state=checked]:bg-primary" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
                <span>Notificações Push</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                  Receba alertas em tempo real no seu navegador (requer permissão).
                </span>
              </Label>
              <Switch id="pushNotifications" className="data-[state=checked]:bg-primary" />
            </div>
          </div>
           <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar Preferências de Notificação</Button>
        </SettingsSection>

        <SettingsSection title="Segurança" description="Gerencie suas configurações de segurança e senha." icon={ShieldCheck}>
          <div>
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input id="currentPassword" type="password" className="mt-1 bg-background/50 border-foreground/20 focus:bg-background/70 focus:border-primary"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input id="newPassword" type="password" className="mt-1 bg-background/50 border-foreground/20 focus:bg-background/70 focus:border-primary"/>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input id="confirmPassword" type="password" className="mt-1 bg-background/50 border-foreground/20 focus:bg-background/70 focus:border-primary"/>
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Alterar Senha</Button>
          <div className="border-t border-foreground/10 pt-6 mt-6">
            <h4 className="text-md font-semibold mb-2">Autenticação de Dois Fatores (2FA)</h4>
            <p className="text-sm text-muted-foreground mb-3">Adicione uma camada extra de segurança à sua conta.</p>
            <Button variant="outline" className="bg-background/50 border-foreground/20 hover:bg-foreground/10 text-foreground">Configurar 2FA</Button>
          </div>
        </SettingsSection>
        
        <SettingsSection title="Sobre a Plataforma" icon={Info}>
            <p className="text-sm text-muted-foreground">Versão da Aplicação: <span className="font-semibold text-foreground">1.0.0</span></p>
            <p className="text-sm text-muted-foreground">Última Atualização: <span className="font-semibold text-foreground">05 de Junho de 2025</span></p>
            <p className="text-sm text-muted-foreground">Desenvolvido com ❤️ por Hostinger Horizons AI.</p>
            <div className="space-x-2 mt-2">
                <Button variant="link" className="text-primary p-0 h-auto">Termos de Serviço</Button>
                <Button variant="link" className="text-primary p-0 h-auto">Política de Privacidade</Button>
            </div>
        </SettingsSection>
      </main>
    </div>
  );
};

export default SettingsPage;