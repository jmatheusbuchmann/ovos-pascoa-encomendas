
'use client';

import { AlertTriangle } from "lucide-react";

export function TopBanner() {
  return (
    <div className="bg-easter-yellow py-3 px-4 text-chocolate font-black text-center text-xs md:text-sm uppercase tracking-tighter md:tracking-wider relative z-50 border-b-2 border-chocolate flex items-center justify-center gap-2">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>PRODUÇÃO LIMITADA, GARANTA SEU PEDIDO, E FAÇA SUA ENCOMENDA ATÉ DIA 30/03</span>
    </div>
  );
}
