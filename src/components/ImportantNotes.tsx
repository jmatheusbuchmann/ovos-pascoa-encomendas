"use client";

import { Button } from "@/components/ui/button";
import { Send, AlertTriangle } from "lucide-react";

export function ImportantNotes() {
  const scrollToForm = () => {
    const form = document.getElementById("order-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 px-4 bg-chocolate/10">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <div className="inline-flex items-center gap-2 bg-easter-yellow text-chocolate px-6 py-2 rounded-full font-black uppercase chocolate-border shadow-lg">
          <AlertTriangle className="h-5 w-5" /> Atenção aos Prazos
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight text-shadow-sm">
          Garanta o seu <span className="text-easter-yellow">Ovo de Páscoa</span> antes que esgote!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {[
            "Produção artesanal e limitada",
            "Entrega rápida em Joinville",
            "Embalagens seguras e higienizadas",
            "Personagens licenciados e atuais",
            "Personalização de alta qualidade",
            "Atendimento humanizado via WhatsApp"
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl text-white font-bold flex items-center">
              <span className="text-easter-yellow mr-3">✔</span> {item}
            </div>
          ))}
        </div>

        <div className="pt-6">
          <Button 
            onClick={scrollToForm}
            size="lg" 
            className="bg-easter-yellow text-chocolate hover:bg-yellow-400 text-xl font-black h-20 px-12 rounded-full chocolate-border shadow-2xl transform transition hover:scale-110 uppercase"
          >
            <Send className="mr-3 h-7 w-7" />
            Quero fazer meu pedido agora!
          </Button>
        </div>
      </div>
    </section>
  );
}
