
"use client";

import { useState } from "react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ShoppingBasket } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-easter-gradient p-4">
      <Card className="w-full max-w-md chocolate-outline rounded-3xl overflow-hidden shadow-2xl">
        <CardHeader className="bg-easter-yellow text-center p-8">
          <ShoppingBasket className="mx-auto h-12 w-12 text-chocolate mb-4" />
          <CardTitle className="text-chocolate font-black uppercase tracking-tight text-2xl">
            Acesso Restrito
          </CardTitle>
          <p className="text-chocolate/70 text-sm font-bold">Páscoa dos Pequenos 2026</p>
        </CardHeader>
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="E-mail" 
                className="rounded-xl h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Senha" 
                className="rounded-xl h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
            <Button type="submit" className="w-full h-14 bg-chocolate text-white rounded-xl font-black uppercase">
              Entrar no Painel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
