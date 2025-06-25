import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, BookOpen, MessageSquare, Phone, Mail, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const faqItems = [
  {
    question: "Como cadastrar uma nova apólice?",
    answer: "Para cadastrar uma nova apólice, vá para a seção 'Prospecções', converta um prospect para 'Cadastro Apólices' ou adicione manualmente. Em seguida, preencha todos os dados na página 'Cadastro Apólices' e clique em 'Confirmar e Cadastrar Apólice'. A apólice aparecerá em 'Apólices Cadastradas'."
  },
  {
    question: "Como gero um relatório de vendas?",
    answer: "Acesse a seção 'Relatórios'. Lá você encontrará diversos tipos de relatórios pré-definidos, incluindo 'Relatório de Vendas Mensais'. Você também pode criar relatórios personalizados especificando os campos e filtros desejados."
  },
  {
    question: "Esqueci minha senha, como recupero?",
    answer: "Na tela de login, clique em 'Esqueceu a senha?'. Siga as instruções para redefinir sua senha através do seu e-mail cadastrado. Se precisar de mais ajuda, entre em contato com o suporte."
  },
  {
    question: "Como alterar o tema da plataforma?",
    answer: "No canto superior direito do cabeçalho, você encontrará um ícone de sol/lua. Clique nele para alternar entre o tema claro e escuro. Você também pode definir sua preferência em 'Configurações' > 'Preferências de Tema'."
  },
];

const HelpPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header className="flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 120 }}
          className="p-4 bg-primary/10 rounded-full inline-block mb-4"
        >
          <HelpCircle className="h-12 w-12 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-500 to-green-400">
          Central de Ajuda Ecosistema
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
          Encontre respostas para suas dúvidas, tutoriais e entre em contato com nosso suporte.
        </p>
      </header>

      <Card className="glassmorphic-card shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-primary"/>
            <CardTitle className="text-xl">Busque em nossa Base de Conhecimento</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Input placeholder="Digite sua dúvida aqui... (Ex: Como renovar apólice?)" className="bg-background/70 dark:bg-background/50 border-primary/20 focus:border-primary text-base py-6" />
        </CardContent>
      </Card>

      <Card className="glassmorphic-card shadow-xl">
        <CardHeader>
           <div className="flex items-center space-x-3">
            <BookOpen className="h-5 w-5 text-primary"/>
            <CardTitle className="text-xl">Perguntas Frequentes (FAQ)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b-primary/10">
                <AccordionTrigger className="text-left hover:no-underline text-base text-foreground hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pt-2 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glassmorphic-card shadow-lg">
          <CardHeader className="items-center text-center">
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Chat Online</CardTitle>
            <CardDescription className="text-xs">Fale com um especialista agora mesmo.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Iniciar Chat</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic-card shadow-lg">
          <CardHeader className="items-center text-center">
            <Mail className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Enviar E-mail</CardTitle>
            <CardDescription className="text-xs">Receba suporte por e-mail em até 24h.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">suporte@ecosistema.com</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic-card shadow-lg">
          <CardHeader className="items-center text-center">
            <Phone className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Ligue para Nós</CardTitle>
            <CardDescription className="text-xs">Atendimento: Seg-Sex, 9h-18h.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">(XX) XXXX-XXXX</Button>
          </CardContent>
        </Card>
      </div>

    </motion.div>
  );
};

export default HelpPage;