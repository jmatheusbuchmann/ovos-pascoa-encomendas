
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ShoppingBasket, MessageCircle } from "lucide-react";

export function PromoHero() {
  const scrollToForm = () => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-8 pb-20 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Badge className="bg-easter-yellow text-chocolate hover:bg-easter-yellow font-bold text-sm md:text-base py-1 px-4 mb-6 chocolate-border animate-bounce-slow">
          PÁSCOA DOS PEQUENOS 2026
        </Badge>
        
        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight text-shadow-lg leading-none">
          Ovos de Páscoa <br />
          <span className="text-easter-yellow drop-shadow-[0_2px_2px_rgba(116,55,21,1)]">Sob Encomenda</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white font-medium mb-10 max-w-2xl mx-auto text-shadow-sm leading-relaxed">
          Escolha seu personagem favorito, personalize do seu jeito e faça seu pedido direto pelo WhatsApp!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={scrollToForm}
            size="lg" 
            className="bg-easter-yellow text-chocolate hover:bg-yellow-400 text-xl font-black h-16 px-10 rounded-full chocolate-border shadow-xl transform transition hover:scale-105 active:scale-95 uppercase"
          >
            <ShoppingBasket className="mr-2 h-6 w-6" />
            Montar Meu Pedido
          </Button>
          <Button 
            asChild
            size="lg" 
            className="bg-green-600 text-white hover:bg-green-700 text-xl font-black h-16 px-10 rounded-full border-4 border-white shadow-xl transform transition hover:scale-105 active:scale-95 uppercase"
          >
            <a href="https://wa.me/5547920008427" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <MessageCircle className="mr-2 h-6 w-6" />
              Chamar no WhatsApp
            </a>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-white font-bold">
          <div className="flex items-center bg-chocolate/30 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
            <CalendarDays className="mr-2 h-5 w-5 text-easter-yellow" />
            Pedidos até 30/03
          </div>
          <div className="flex items-center bg-chocolate/30 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
            <CalendarDays className="mr-2 h-5 w-5 text-easter-yellow" />
            Retirada até 04/04
          </div>
        </div>
      </div>
    </section>
  );
}
