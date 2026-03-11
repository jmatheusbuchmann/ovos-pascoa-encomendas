import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Star } from "lucide-react";

export function ProductInfo() {
  const themes = [
    "Bluey", "Frozen", "Patrulha Canina", "Homem-Aranha", 
    "Casa Mágica da Gabby", "Capivara", "Stitch"
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-block bg-easter-yellow text-chocolate px-4 py-1 rounded-full font-bold text-sm chocolate-border mb-2 uppercase">
            Nosso Carro-Chefe
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-none">
            Ovo Gourmet <br />
            <span className="text-easter-yellow">250g de Chocolate</span>
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center text-white text-lg font-bold">
              <CheckCircle2 className="mr-3 h-6 w-6 text-easter-yellow" /> 
              Chocolate ao leite premium
            </li>
            <li className="flex items-center text-white text-lg font-bold">
              <CheckCircle2 className="mr-3 h-6 w-6 text-easter-yellow" /> 
              Acompanha Livro de Colorir
            </li>
            <li className="flex items-center text-white text-lg font-bold">
              <CheckCircle2 className="mr-3 h-6 w-6 text-easter-yellow" /> 
              Embalagem temática exclusiva
            </li>
          </ul>

          <div className="bg-easter-yellow p-6 rounded-2xl chocolate-border shadow-xl transform rotate-1">
            <p className="text-chocolate font-black text-center text-xl uppercase mb-1">A partir de</p>
            <p className="text-chocolate font-black text-center text-5xl tracking-tighter">R$ 49,90</p>
          </div>
        </div>

        <Card className="bg-white border-none shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-chocolate p-4 text-center">
            <h3 className="text-white font-black uppercase tracking-wider">Temas Inclusos no Preço Base</h3>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 gap-3">
              {themes.map((theme, i) => (
                <div key={i} className="flex items-center p-3 rounded-xl bg-easter-blue-light/10 border border-easter-blue-light/20 text-easter-blue-dark font-black uppercase text-sm">
                  <Star className="mr-3 h-4 w-4 fill-easter-yellow text-easter-yellow" />
                  {theme}
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-chocolate font-bold">Outros personagens</span>
                  <span className="bg-chocolate text-white px-3 py-1 rounded-full font-black text-xs uppercase">+ R$ 10,00</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-chocolate font-bold">Livro Personalizado</span>
                    <span className="text-gray-500 text-xs">(Com foto e nome da criança)</span>
                  </div>
                  <span className="bg-chocolate text-white px-3 py-1 rounded-full font-black text-xs uppercase">+ R$ 10,00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
