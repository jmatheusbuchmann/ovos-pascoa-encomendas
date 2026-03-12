
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Send, Truck, Plus, Trash2 } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, doc, writeBatch } from "firebase/firestore";

const BASE_PRICE = 49.9;
const EXTRA_CHARACTER_PRICE = 10.0;
const CUSTOM_DRAWING_PRICE = 10.0;

const THEMES = [
  "Bluey", "Frozen", "Patrulha Canina", "Homem-Aranha", 
  "Casa Mágica da Gabby", "Capivara", "Stitch", "Outro personagem"
];

interface OrderItem {
  id: string;
  tema: string;
  outroTema?: string;
  tipoDesenho: string;
  nomeCrianca: string;
  quantidade: number;
  totalItem: number;
}

export function OrderForm() {
  const db = useFirestore();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentItem, setCurrentItem] = useState({
    tema: "",
    outroTema: "",
    tipoDesenho: "normal",
    nomeCrianca: "",
    quantidade: 1,
  });

  const [customerDetails, setCustomerDetails] = useState({
    nome: "",
    whatsapp: "",
    observacoes: "",
    formaPagamento: "pix",
    formaRecebimento: "retirada",
    dataRetirada: "",
    horarioRetirada: "",
    cepEntrega: "",
  });

  const unitPrice = useMemo(() => {
    let total = BASE_PRICE;
    if (currentItem.tema === "Outro personagem") total += EXTRA_CHARACTER_PRICE;
    if (currentItem.tipoDesenho === "personalizado") total += CUSTOM_DRAWING_PRICE;
    return total;
  }, [currentItem.tema, currentItem.tipoDesenho]);

  const orderTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.totalItem, 0);
  }, [items]);

  const addItem = () => {
    if (!currentItem.tema) return;
    
    const newItem: OrderItem = {
      id: crypto.randomUUID(),
      ...currentItem,
      totalItem: unitPrice * currentItem.quantidade
    };
    
    setItems([...items, newItem]);
    setCurrentItem({
      tema: "",
      outroTema: "",
      tipoDesenho: "normal",
      nomeCrianca: "",
      quantidade: 1,
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const orderId = crypto.randomUUID();
      const batch = writeBatch(db);

      const orderData = {
        id: orderId,
        customerName: customerDetails.nome,
        customerWhatsapp: customerDetails.whatsapp,
        orderDate: new Date().toISOString(),
        status: "pendente",
        paymentStatus: "pendente",
        amountPaid: 0,
        paymentMethod: customerDetails.formaPagamento,
        receivingMethod: customerDetails.formaRecebimento,
        pickupDate: customerDetails.dataRetirada,
        pickupTime: customerDetails.horarioRetirada,
        deliveryZipCode: customerDetails.cepEntrega,
        estimatedTotalAmount: orderTotal,
        customerNotes: customerDetails.observacoes,
        isManuallyAdded: false
      };

      batch.set(doc(db, "orders", orderId), orderData);

      items.forEach((item) => {
        const itemRef = doc(collection(db, "orders", orderId, "items"));
        batch.set(itemRef, {
          id: itemRef.id,
          orderId,
          quantity: item.quantidade,
          characterTheme: item.tema === "Outro personagem" ? item.outroTema : item.tema,
          drawingType: item.tipoDesenho,
          childNameForDrawing: item.nomeCrianca,
          unitPrice: item.totalItem / item.quantidade,
          itemTotal: item.totalItem
        });
      });

      await batch.commit();

      let message = `*Novo Pedido de Páscoa!*\n\n`;
      message += `*Cliente:* ${customerDetails.nome}\n`;
      message += `*WhatsApp:* ${customerDetails.whatsapp}\n\n`;
      message += `*ITENS:*\n`;
      
      items.forEach((item, index) => {
        const tema = item.tema === "Outro personagem" ? item.outroTema : item.tema;
        message += `${index + 1}. ${item.quantity}x Ovo 250g - ${tema}\n`;
        message += `   Desenho: ${item.tipoDesenho === 'personalizado' ? `Personalizado (${item.nomeCrianca})` : 'Normal'}\n`;
      });

      message += `\n*Pagamento:* ${customerDetails.formaPagamento === 'pix' ? 'Pix (50% entrada)' : 'Link de Pagamento'}\n`;
      message += `*Recebimento:* ${customerDetails.formaRecebimento === 'retirada' ? 'Retirada no Aventureiro' : 'Entrega em Joinville'}\n`;
      if (customerDetails.cepEntrega) message += `*CEP:* ${customerDetails.cepEntrega}\n`;
      
      message += `\n*TOTAL ESTIMADO: R$ ${orderTotal.toFixed(2).replace('.', ',')}*`;

      window.open(`https://wa.me/5547920008427?text=${encodeURIComponent(message)}`, "_blank");
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order-form" className="py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-4 text-shadow-sm">
            Monte seu <span className="text-easter-yellow">Pedido</span>
          </h2>
          <p className="text-white/90 font-medium">Você pode adicionar mais de um ovo ao mesmo pedido!</p>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden chocolate-outline">
            <CardHeader className="bg-easter-yellow p-6 md:p-8">
              <CardTitle className="text-chocolate font-black uppercase text-xl md:text-2xl flex items-center">
                <Plus className="mr-3 h-6 w-6 md:h-8 md:w-8" /> Configurar Item
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-chocolate font-black uppercase text-xs">Personagem / Tema</Label>
                  <Select value={currentItem.tema} onValueChange={(val) => setCurrentItem({...currentItem, tema: val})}>
                    <SelectTrigger className="rounded-xl border-gray-200 h-12">
                      <SelectValue placeholder="Escolha o tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-chocolate font-black uppercase text-xs">Quantidade</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    className="rounded-xl h-12" 
                    value={currentItem.quantidade}
                    onChange={(e) => setCurrentItem({...currentItem, quantidade: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>

              {currentItem.tema === "Outro personagem" && (
                <div className="space-y-2 animate-in fade-in">
                  <Label className="text-chocolate font-black uppercase text-xs">Qual Personagem?</Label>
                  <Input 
                    required 
                    className="rounded-xl h-12" 
                    placeholder="Ex: Naruto, Princesas..." 
                    value={currentItem.outroTema}
                    onChange={(e) => setCurrentItem({...currentItem, outroTema: e.target.value})}
                  />
                </div>
              )}

              <div className="space-y-4">
                <Label className="text-chocolate font-black uppercase text-xs">Brinde: Desenhos de colorir</Label>
                <RadioGroup 
                  value={currentItem.tipoDesenho} 
                  className="grid md:grid-cols-2 gap-4"
                  onValueChange={(val) => setCurrentItem({...currentItem, tipoDesenho: val})}
                >
                  <Label
                    htmlFor="normal"
                    className={`flex flex-col items-center justify-between rounded-2xl border-2 p-4 cursor-pointer transition-all ${currentItem.tipoDesenho === 'normal' ? 'border-chocolate bg-easter-blue-light/5' : 'border-gray-100'}`}
                  >
                    <RadioGroupItem value="normal" id="normal" className="sr-only" />
                    <span className="font-black uppercase text-chocolate text-sm text-center leading-tight">Desenhos do personagem selecionado</span>
                    <span className="text-[10px] text-gray-500">Incluso</span>
                  </Label>
                  <Label
                    htmlFor="personalizado"
                    className={`flex flex-col items-center justify-between rounded-2xl border-2 p-4 cursor-pointer transition-all ${currentItem.tipoDesenho === 'personalizado' ? 'border-chocolate bg-easter-blue-light/5' : 'border-gray-100'}`}
                  >
                    <RadioGroupItem value="personalizado" id="personalizado" className="sr-only" />
                    <span className="font-black uppercase text-chocolate text-sm text-center">Desenhos personalizados</span>
                    <span className="text-[10px] text-gray-600 font-normal text-center leading-none">com foto e nome da criança com o personagem escolhido</span>
                    <span className="mt-2 text-[10px] font-bold text-chocolate">+ R$ 10,00</span>
                  </Label>
                </RadioGroup>
              </div>

              {currentItem.tipoDesenho === "personalizado" && (
                <div className="space-y-2 animate-in fade-in">
                  <Label className="text-chocolate font-black uppercase text-xs">Nome da Criança</Label>
                  <Input 
                    className="rounded-xl h-12" 
                    placeholder="Nome para os desenhos" 
                    value={currentItem.nomeCrianca}
                    onChange={(e) => setCurrentItem({...currentItem, nomeCrianca: e.target.value})}
                  />
                </div>
              )}

              <Button 
                onClick={addItem}
                disabled={!currentItem.tema}
                className="w-full h-14 bg-chocolate text-white rounded-2xl font-black uppercase tracking-wider"
              >
                <Plus className="mr-2" /> Adicionar ao Pedido
              </Button>
            </CardContent>
          </Card>

          {items.length > 0 && (
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden chocolate-outline animate-in slide-in-from-bottom-4">
              <CardHeader className="bg-easter-blue-dark p-6">
                <CardTitle className="text-white font-black uppercase text-xl flex items-center">
                  <ShoppingCart className="mr-3" /> Resumo do Pedido ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="font-black text-chocolate uppercase">
                        {item.quantity}x {item.tema === "Outro personagem" ? item.outroTema : item.tema}
                      </p>
                      <p className="text-xs text-gray-500">
                        Desenho: {item.tipoDesenho === 'personalizado' ? 'Personalizado' : 'Normal'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-black text-chocolate">R$ {item.totalItem.toFixed(2)}</p>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {items.length > 0 && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <Card className="border-none shadow-2xl rounded-3xl overflow-hidden chocolate-outline">
                <CardHeader className="bg-easter-yellow p-6 md:p-8">
                  <CardTitle className="text-chocolate font-black uppercase text-xl flex items-center">
                    <Truck className="mr-3" /> 2. Finalizar Detalhes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-chocolate font-black uppercase text-xs">Seu Nome</Label>
                      <Input 
                        required 
                        className="rounded-xl h-12" 
                        value={customerDetails.nome}
                        onChange={(e) => setCustomerDetails({...customerDetails, nome: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-chocolate font-black uppercase text-xs">Seu WhatsApp</Label>
                      <Input 
                        required 
                        placeholder="(00) 00000-0000"
                        className="rounded-xl h-12" 
                        value={customerDetails.whatsapp}
                        onChange={(e) => setCustomerDetails({...customerDetails, whatsapp: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-chocolate font-black uppercase text-xs">Como quer receber?</Label>
                    <RadioGroup 
                      value={customerDetails.formaRecebimento} 
                      className="flex gap-4"
                      onValueChange={(val) => setCustomerDetails({...customerDetails, formaRecebimento: val})}
                    >
                      <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl flex-1 cursor-pointer">
                        <RadioGroupItem value="retirada" id="ret-opt" />
                        <Label htmlFor="ret-opt" className="font-bold cursor-pointer">Retirada</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl flex-1 cursor-pointer">
                        <RadioGroupItem value="entrega" id="ent-opt" />
                        <Label htmlFor="ent-opt" className="font-bold cursor-pointer">Entrega</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {customerDetails.formaRecebimento === "entrega" && (
                    <div className="space-y-2 animate-in fade-in">
                      <Label className="text-chocolate font-black uppercase text-xs">CEP para Entrega</Label>
                      <Input 
                        required 
                        placeholder="00000-000"
                        className="rounded-xl h-12" 
                        value={customerDetails.cepEntrega}
                        onChange={(e) => setCustomerDetails({...customerDetails, cepEntrega: e.target.value})}
                      />
                      <p className="text-[10px] text-orange-600 font-bold uppercase">A taxa será calculada após o pedido.</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-chocolate font-black uppercase text-xs">Forma de Pagamento</Label>
                    <Select value={customerDetails.formaPagamento} onValueChange={(val) => setCustomerDetails({...customerDetails, formaPagamento: val})}>
                      <SelectTrigger className="rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">Pix (50% entrada)</SelectItem>
                        <SelectItem value="link">Link de Pagamento (+taxa)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="sticky bottom-4 z-40 bg-easter-yellow p-4 rounded-3xl chocolate-border shadow-2xl flex items-center justify-between gap-4">
                <div>
                  <p className="text-chocolate font-black uppercase text-[10px]">Total do Pedido</p>
                  <p className="text-chocolate text-2xl font-black">R$ {orderTotal.toFixed(2).replace('.', ',')}</p>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-chocolate text-white h-12 px-6 rounded-2xl font-black uppercase text-sm flex-1"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Salvando...' : 'Pedir no WhatsApp'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
