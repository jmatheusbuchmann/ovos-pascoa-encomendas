"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart, Send, Info, Star, Truck } from "lucide-react";

const BASE_PRICE = 49.9;
const EXTRA_CHARACTER_PRICE = 10.0;
const CUSTOM_BOOK_PRICE = 10.0;

const THEMES = [
  "Bluey", "Frozen", "Patrulha Canina", "Homem-Aranha", 
  "Casa Mágica da Gabby", "Capivara", "Stitch", "Outro personagem"
];

export function OrderForm() {
  const [formData, setFormData] = useState({
    nome: "",
    tema: "",
    outroTema: "",
    tipoLivro: "normal",
    nomeCrianca: "",
    observacoes: "",
    formaPagamento: "pix",
    formaRecebimento: "retirada",
    dataRetirada: "",
    horarioRetirada: "",
    cepEntrega: "",
  });

  const totalEstimado = useMemo(() => {
    let total = BASE_PRICE;
    if (formData.tema === "Outro personagem") total += EXTRA_CHARACTER_PRICE;
    if (formData.tipoLivro === "personalizado") total += CUSTOM_BOOK_PRICE;
    return total;
  }, [formData.tema, formData.tipoLivro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const temaFinal = formData.tema === "Outro personagem" ? `Outro (${formData.outroTema})` : formData.tema;
    const livroFinal = formData.tipoLivro === "personalizado" ? `Personalizado com foto (${formData.nomeCrianca})` : "Normal do personagem";
    
    let message = `Olá! Quero encomendar um ovo de Páscoa.\n\n`;
    message += `*Pedido:*\n`;
    message += `- Produto: Ovo 250g de chocolate ao leite com livro de colorir\n`;
    message += `- Cliente: ${formData.nome}\n`;
    message += `- Personagem/Tema: ${temaFinal}\n`;
    if (formData.outroTema) message += `- Outro personagem informado: ${formData.outroTema}\n`;
    message += `- Tipo de livro: ${livroFinal}\n`;
    if (formData.nomeCrianca) message += `- Nome da criança: ${formData.nomeCrianca}\n`;
    if (formData.observacoes) message += `- Observações: ${formData.observacoes}\n`;
    message += `- Forma de pagamento: ${formData.formaPagamento === 'pix' ? 'Entrada 50% via Pix' : 'Link de pagamento (Cartão)'}\n`;
    message += `- Forma de recebimento: ${formData.formaRecebimento === 'retirada' ? 'Retirada' : 'Entrega'}\n`;
    
    if (formData.formaRecebimento === "retirada") {
      message += `- Data desejada: ${formData.dataRetirada || 'A combinar'}\n`;
      message += `- Horário desejado: ${formData.horarioRetirada || 'A combinar'}\n`;
      message += `\n*Gostaria de agendar a retirada no bairro Aventureiro.*`;
    } else {
      message += `- CEP para entrega: ${formData.cepEntrega}\n`;
      message += `\n*Aguardo consulta da taxa de entrega pelo CEP informado.*`;
    }

    if (formData.tipoLivro === "personalizado") {
      message += `\n\n*Vou enviar a foto da criança para personalização.*`;
    }

    message += `\n\n*Valor estimado: R$ ${totalEstimado.toFixed(2).replace('.', ',')}*`;
    message += `\n(Taxa de entrega não incluída)`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5547920008427?text=${encodedMessage}`, "_blank");
  };

  return (
    <section id="order-form" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-4 text-shadow-sm">
            Monte seu <span className="text-easter-yellow">Pedido</span>
          </h2>
          <p className="text-white/90 font-medium">Preencha os campos abaixo com atenção.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden chocolate-outline">
            <CardHeader className="bg-easter-yellow p-8">
              <CardTitle className="text-chocolate font-black uppercase text-2xl flex items-center">
                <ShoppingCart className="mr-3 h-8 w-8" /> 1. Dados Básicos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-chocolate font-black uppercase text-xs">Seu Nome Completo</Label>
                <Input 
                  id="nome" 
                  required 
                  className="rounded-xl border-gray-200 h-12 focus:ring-easter-blue-dark" 
                  placeholder="Como devemos te chamar?" 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-chocolate font-black uppercase text-xs">Personagem / Tema</Label>
                  <Select required onValueChange={(val) => setFormData({...formData, tema: val})}>
                    <SelectTrigger className="rounded-xl border-gray-200 h-12">
                      <SelectValue placeholder="Escolha o tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {formData.tema === "Outro personagem" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="outroTema" className="text-chocolate font-black uppercase text-xs">Qual Personagem?</Label>
                    <Input 
                      id="outroTema" 
                      required 
                      className="rounded-xl border-gray-200 h-12" 
                      placeholder="Ex: Naruto, Princesas..." 
                      value={formData.outroTema}
                      onChange={(e) => setFormData({...formData, outroTema: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden chocolate-outline">
            <CardHeader className="bg-easter-yellow p-8">
              <CardTitle className="text-chocolate font-black uppercase text-2xl flex items-center">
                <Star className="mr-3 h-8 w-8" /> 2. Personalização do Livro
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <RadioGroup 
                defaultValue="normal" 
                className="grid md:grid-cols-2 gap-4"
                onValueChange={(val) => setFormData({...formData, tipoLivro: val})}
              >
                <Label
                  htmlFor="normal"
                  className={`flex flex-col items-center justify-between rounded-2xl border-2 p-6 cursor-pointer transition-all ${formData.tipoLivro === 'normal' ? 'border-chocolate bg-easter-blue-light/5' : 'border-gray-100 hover:border-easter-blue-light/50'}`}
                >
                  <RadioGroupItem value="normal" id="normal" className="sr-only" />
                  <span className="font-black uppercase text-chocolate mb-1">Livro Normal</span>
                  <span className="text-xs text-gray-500 text-center">Incluso no preço base</span>
                  <span className="mt-4 bg-chocolate text-white text-[10px] px-2 py-1 rounded-full uppercase">Grátis</span>
                </Label>
                <Label
                  htmlFor="personalizado"
                  className={`flex flex-col items-center justify-between rounded-2xl border-2 p-6 cursor-pointer transition-all ${formData.tipoLivro === 'personalizado' ? 'border-chocolate bg-easter-blue-light/5' : 'border-gray-100 hover:border-easter-blue-light/50'}`}
                >
                  <RadioGroupItem value="personalizado" id="personalizado" className="sr-only" />
                  <span className="font-black uppercase text-chocolate mb-1">Livro Personalizado</span>
                  <span className="text-xs text-gray-500 text-center">Com foto e nome da criança</span>
                  <span className="mt-4 bg-easter-yellow text-chocolate font-black text-[10px] px-2 py-1 rounded-full uppercase">+ R$ 10,00</span>
                </Label>
              </RadioGroup>

              {formData.tipoLivro === "personalizado" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label htmlFor="nomeCrianca" className="text-chocolate font-black uppercase text-xs">Nome da Criança</Label>
                  <Input 
                    id="nomeCrianca" 
                    required 
                    className="rounded-xl border-gray-200 h-12" 
                    placeholder="Como deve aparecer no livro?" 
                    value={formData.nomeCrianca}
                    onChange={(e) => setFormData({...formData, nomeCrianca: e.target.value})}
                  />
                  <p className="text-xs text-blue-600 font-bold">* Você enviará a foto pelo WhatsApp após o pedido.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden chocolate-outline">
            <CardHeader className="bg-easter-yellow p-8">
              <CardTitle className="text-chocolate font-black uppercase text-2xl flex items-center">
                <Truck className="mr-3 h-8 w-8" /> 3. Entrega e Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-chocolate font-black uppercase text-xs">Como quer receber?</Label>
                <RadioGroup 
                  defaultValue="retirada" 
                  className="flex gap-4"
                  onValueChange={(val) => setFormData({...formData, formaRecebimento: val})}
                >
                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl border border-gray-200 flex-1">
                    <RadioGroupItem value="retirada" id="retirada-opt" />
                    <Label htmlFor="retirada-opt" className="font-bold cursor-pointer">Retirada (Grátis)</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl border border-gray-200 flex-1">
                    <RadioGroupItem value="entrega" id="entrega-opt" />
                    <Label htmlFor="entrega-opt" className="font-bold cursor-pointer">Entrega</Label>
                  </div>
                </RadioGroup>

                {formData.formaRecebimento === "retirada" ? (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4 animate-in fade-in">
                    <p className="text-blue-800 text-sm font-medium">Retirada no bairro <strong>Aventureiro</strong> até 04/04.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase">Data Desejada</Label>
                        <Input type="date" value={formData.dataRetirada} onChange={(e) => setFormData({...formData, dataRetirada: e.target.value})} className="rounded-lg h-10" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase">Horário</Label>
                        <Input type="time" value={formData.horarioRetirada} onChange={(e) => setFormData({...formData, horarioRetirada: e.target.value})} className="rounded-lg h-10" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 space-y-2 animate-in fade-in">
                    <Label htmlFor="cep" className="text-orange-800 text-[10px] font-black uppercase">Seu CEP</Label>
                    <Input 
                      id="cep" 
                      required 
                      placeholder="00000-000" 
                      className="rounded-lg h-10"
                      value={formData.cepEntrega}
                      onChange={(e) => setFormData({...formData, cepEntrega: e.target.value})}
                    />
                    <p className="text-orange-800 text-[10px] font-bold uppercase">A taxa de entrega será informada via WhatsApp.</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-chocolate font-black uppercase text-xs">Forma de Pagamento Preferida</Label>
                <Select required defaultValue="pix" onValueChange={(val) => setFormData({...formData, formaPagamento: val})}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Escolha a forma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">Entrada 50% via Pix (Reserva)</SelectItem>
                    <SelectItem value="cartao">Cartão de Crédito (Link + Taxas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="obs" className="text-chocolate font-black uppercase text-xs">Observações Adicionais</Label>
                <Textarea 
                  id="obs" 
                  placeholder="Ex: Alguém mais irá retirar, recado especial..." 
                  className="rounded-xl min-h-[100px]" 
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-6 z-40 bg-easter-yellow p-6 rounded-3xl chocolate-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-chocolate font-black uppercase text-xs tracking-widest mb-1">Total Estimado</p>
              <div className="flex items-baseline gap-2">
                <span className="text-chocolate text-4xl font-black">R$ {totalEstimado.toFixed(2).replace('.', ',')}</span>
                <span className="text-chocolate/60 text-[10px] font-bold uppercase leading-tight">+ entrega <br /> se houver</span>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="bg-chocolate text-white hover:bg-black w-full md:w-auto h-16 px-10 rounded-2xl font-black text-lg uppercase flex items-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Send className="mr-3 h-6 w-6" />
              Enviar Pedido pelo WhatsApp
            </Button>
          </div>
        </form>

        <div className="mt-12 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white space-y-4">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-easter-yellow shrink-0 mt-1" />
            <div>
              <p className="font-bold text-sm uppercase text-easter-yellow">Informações Importantes:</p>
              <ul className="text-sm space-y-2 mt-2 opacity-90">
                <li>• Sua encomenda só é confirmada após o pagamento da <strong>entrada de 50%</strong>.</li>
                <li>• Pedidos via cartão possuem taxas da operadora (solicite o link).</li>
                <li>• Entregas são feitas apenas em Joinville (consulte seu bairro).</li>
                <li>• Prazo final para pedidos: <strong>30 de Março</strong>.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
