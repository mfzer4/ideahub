import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Target, ListChecks, FileWarning, Users, Briefcase, Settings, CalendarCheck, Bell, UserPlus, FileText, DollarSign, TrendingUp, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '@/App';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ActionCard = ({ title, value, icon, description, navigateTo, bgColorClass = 'bg-primary/10', textColorClass = 'text-primary' }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="cursor-pointer"
      onClick={() => navigateTo && navigate(navigateTo)}
    >
      <Card className={`shadow-lg glassmorphic-card h-full flex flex-col justify-between ${bgColorClass} border-transparent hover:border-primary/50 transition-all`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-base font-semibold ${textColorClass}`}>{title}</CardTitle>
          {React.cloneElement(icon, { className: `h-6 w-6 ${textColorClass} opacity-80` })}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className={`text-4xl font-bold ${textColorClass}`}>{value}</div>
          <p className={`text-xs ${textColorClass} opacity-70 mt-1`}>{description}</p>
        </CardContent>
        {navigateTo && (
          <CardFooter className="pt-4">
            <Button variant="outline" size="sm" className={`w-full ${textColorClass} border-current/50 hover:bg-current/10 hover:${textColorClass}`}>
              Ver Detalhes
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

const QuickAccessCard = ({ title, icon, navigateTo, description }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      className="cursor-pointer"
      onClick={() => navigateTo && navigate(navigateTo)}
    >
      <Card className="shadow-md glassmorphic-card bg-card/50 hover:bg-card/70 transition-colors duration-300 border-primary/20 hover:border-primary/40">
        <CardContent className="p-4 flex flex-col items-center text-center">
          {React.cloneElement(icon, { className: "h-10 w-10 text-primary mb-3" })}
          <h3 className="text-md font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}


const DashboardPage = () => {
  const appContext = useContext(AppContext);
  const currentUser = appContext ? appContext.currentUser : null;

  const actionItems = [
    { title: 'Prospecções Ativas', value: '12', icon: <Target />, description: 'Leads para contatar ou em negociação.', navigateTo: '/prospeccoes', bgColorClass: 'bg-blue-500/10 dark:bg-blue-500/20', textColorClass: 'text-blue-600 dark:text-blue-300' },
    { title: 'Tarefas de Cadastro', value: '3', icon: <ListChecks />, description: 'Prospecções convertidas aguardando cadastro.', navigateTo: '/tarefas-cadastro', bgColorClass: 'bg-orange-500/10 dark:bg-orange-500/20', textColorClass: 'text-orange-600 dark:text-orange-300' },
    { title: 'Apólices Vencendo', value: '8', icon: <FileWarning />, description: 'Apólices com vencimento nos próximos 30 dias.', navigateTo: '/apolices', bgColorClass: 'bg-red-500/10 dark:bg-red-500/20', textColorClass: 'text-red-600 dark:text-red-300' },
    { title: 'Novos Clientes (Mês)', value: '23', icon: <UserPlus />, description: 'Clientes cadastrados este mês.', navigateTo: '/usuarios', bgColorClass: 'bg-green-500/10 dark:bg-green-500/20', textColorClass: 'text-green-600 dark:text-green-300' },
  ];

  const quickAccessItems = [
    { title: 'Gerenciar CRM', icon: <Briefcase />, navigateTo: '/crm', description: "Acompanhe seus projetos e funil de vendas." },
    { title: 'Cadastrar Apólice', icon: <FileText />, navigateTo: '/apolices', description: "Registre novas apólices rapidamente." },
    { title: 'Ver Relatórios', icon: <TrendingUp />, navigateTo: '/relatorios', description: "Analise o desempenho e comissões." },
    { title: 'Configurações', icon: <Settings />, navigateTo: '/configuracoes', description: "Ajuste as preferências do sistema." },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <header className="flex items-center justify-between mb-8 sticky top-0 py-4 glassmorphic-header z-10 px-4 -mx-4 md:px-0 md:mx-0">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-500 to-green-400"
          >
            Painel de Controle
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground text-sm"
          >
            Olá, {currentUser?.name || 'Usuário'}! Aqui estão suas tarefas e atalhos.
          </motion.p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-foreground/10 text-foreground">
                  <Bell className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground border-none shadow-xl backdrop-blur-md bg-opacity-80">
                <p>Notificações (Em breve)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-2">
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Ações Importantes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {actionItems.map((item, index) => (
              <ActionCard
                key={index}
                title={item.title}
                value={item.value}
                icon={item.icon}
                description={item.description}
                navigateTo={item.navigateTo}
                bgColorClass={item.bgColorClass}
                textColorClass={item.textColorClass}
              />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Acesso Rápido</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickAccessItems.map((item, index) => (
              <QuickAccessCard 
                key={index}
                title={item.title}
                icon={item.icon}
                navigateTo={item.navigateTo}
                description={item.description}
              />
            ))}
          </div>
        </section>
        
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-lg glassmorphic-card bg-card/70 dark:bg-card/40 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-primary flex items-center">
                <CalendarCheck className="mr-2 h-5 w-5" /> Lembretes e Agenda (Em Breve)
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Seus compromissos e lembretes importantes aparecerão aqui.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 border-2 border-dashed border-muted-foreground/30 rounded-md p-6">
                <p className="text-muted-foreground text-center">
                  Funcionalidade de agenda e lembretes será implementada em breve!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground/80 pb-4">
        <p>&copy; {new Date().getFullYear()} Corretora Seguros PRO. Todos os direitos reservados.</p>
        <p>Design por Hostinger Horizons AI ✨</p>
      </footer>
    </div>
  );
};

export default DashboardPage;