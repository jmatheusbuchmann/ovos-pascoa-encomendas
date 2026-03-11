import { Card, CardContent } from "@/components/ui/card";
import { Info, MapPin, Truck, Timer, PackageCheck } from "lucide-react";

export function QuickAlerts() {
  const alerts = [
    { icon: <Timer className="text-easter-yellow" />, text: "Pedidos até 30/03" },
    { icon: <PackageCheck className="text-easter-yellow" />, text: "Retirada até 04/04" },
    { icon: <MapPin className="text-easter-yellow" />, text: "Bairro Aventureiro" },
    { icon: <Truck className="text-easter-yellow" />, text: "Entrega sob consulta" },
    { icon: <Info className="text-easter-yellow" />, text: "Produção limitada" },
    { icon: <ShoppingBasket className="text-easter-yellow" />, text: "Sob encomenda" },
  ];

  function ShoppingBasket(props: any) {
    return <PackageCheck {...props} />
  }

  return (
    <div className="px-4 -mt-10 mb-12 relative z-20">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {alerts.map((alert, index) => (
          <Card key={index} className="bg-chocolate border-none shadow-lg transform hover:-translate-y-1 transition-transform">
            <CardContent className="p-4 flex flex-col items-center text-center justify-center gap-2">
              <div className="bg-white/10 p-2 rounded-full mb-1">
                {alert.icon}
              </div>
              <span className="text-white font-bold text-xs uppercase tracking-wide">
                {alert.text}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
