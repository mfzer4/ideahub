import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthContext } from '@/App';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
// import { supabase } from '@/lib/supabaseClient'; // Supabase removido
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const { login } = useContext(AuthContext); // O contexto AuthContext ainda pode existir, mas sua lógica de login precisaria ser adaptada se não usar Supabase
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || "/dashboard";
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/7b3d1925-ac73-4ab2-ab4b-519f8aaf61c1/6b54e285d24542f2a5b95ebf0e2e13ca.png";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Lógica de login com Supabase removida.
    // Você precisaria implementar uma lógica de autenticação alternativa aqui
    // ou usar dados mockados se o sistema de login for apenas visual.
    console.log("Tentativa de login com:", email, password);
    toast({
      variant: "destructive",
      title: "Funcionalidade Desabilitada",
      description: "O sistema de login com Supabase foi desabilitado.",
    });
    setIsLoading(false);
    // Exemplo de como poderia ser com dados mockados (se AuthContext for adaptado):
    // if (email === "admin@example.com" && password === "password") {
    //   await login({ user: { email: "admin@example.com", id:"mock-id" }, session: { access_token: "mock_token"} }); 
    //   toast({ title: "Login Bem-Sucedido (Mock)!", description: `Bem-vindo(a) de volta!`, className: "bg-primary text-primary-foreground"});
    //   navigate(from, { replace: true });
    // } else {
    //   toast({ variant: "destructive", title: "Falha no Login (Mock)", description: "E-mail ou senha incorretos."});
    //   setIsLoading(false);
    // }
  };
  
  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast({
        variant: "destructive",
        title: "E-mail Necessário",
        description: "Por favor, insira seu e-mail para recuperação de senha.",
      });
      return;
    }
    setIsRecoveryLoading(true);
    // Lógica de recuperação de senha com Supabase removida.
    console.log("Tentativa de recuperação de senha para:", recoveryEmail);
    toast({
      variant: "destructive",
      title: "Funcionalidade Desabilitada",
      description: "A recuperação de senha com Supabase foi desabilitada.",
    });
    setIsRecoveryLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-background/80">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md shadow-2xl glassmorphic-card border-primary/30">
          <CardHeader className="text-center">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <img-replace src={logoUrl} alt="Logo da Empresa" className="h-20 w-20 object-contain" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-500 to-green-400">
              Ecosistema Login
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-1">
              Acesse sua conta para gerenciar suas apólices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="email-login" className="text-sm font-medium text-muted-foreground">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email-login" 
                    type="email" 
                    placeholder="admin@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-foreground/20 focus:bg-background/70 focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">Senha</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button type="button" className="text-xs text-primary hover:underline">Esqueceu a senha?</button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-lg border-primary/30">
                        <DialogHeader>
                          <DialogTitle className="text-primary">Recuperar Senha</DialogTitle>
                          <DialogDescription>
                            Insira seu endereço de e-mail para receber um link de redefinição de senha.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePasswordRecovery} className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email-recovery" className="text-right text-muted-foreground">
                              E-mail
                            </Label>
                            <Input
                              id="email-recovery"
                              type="email"
                              value={recoveryEmail}
                              onChange={(e) => setRecoveryEmail(e.target.value)}
                              placeholder="seu@email.com"
                              className="col-span-3 bg-background/50 border-foreground/20 focus:bg-background/70 focus:border-primary"
                              disabled={isRecoveryLoading}
                            />
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isRecoveryLoading}>Cancelar</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isRecoveryLoading}>
                              {isRecoveryLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                              Enviar Link
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Digite sua senha" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-foreground/20 focus:bg-background/70 focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button type="submit" className="w-full bg-gradient-to-r from-primary via-emerald-500 to-green-400 text-primary-foreground hover:opacity-90 transition-opacity text-base py-3" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </motion.div>
            </form>
            
          </CardContent>
        </Card>
         <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6 text-center text-xs text-muted-foreground/70"
        >
            &copy; {new Date().getFullYear()} Ecosistema. Todos os direitos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;