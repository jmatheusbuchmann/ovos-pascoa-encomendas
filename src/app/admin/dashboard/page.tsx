
"use client";

import { useState } from "react";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, deleteDoc, writeBatch, getDocs } from "firebase/firestore";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LogOut, 
  Calendar, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Trash2,
  PlusCircle,
  Package,
  Eye,
  CreditCard,
  MapPin,
  ClipboardList,
  User,
  Plus,
  X,
  Pencil
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function OrderItemsList({ orderId }: { orderId: string }) {
  const db = useFirestore();
  const itemsQuery = useMemoFirebase(() => {
    return query(collection(db, "orders", orderId, "items"));
  }, [db, orderId]);
  const { data: items, isLoading } = useCollection(itemsQuery);

  if (isLoading) return <p className="text-xs text-gray-400">Carregando itens...</p>;
  if (!items || items.length === 0) return <p className="text-xs text-gray-400">Nenhum item detalhado.</p>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-start">
          <div>
            <p className="font-black text-chocolate uppercase text-sm">
              {item.quantity}x {item.characterTheme}
            </p>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
              Desenho: <span className={item.drawingType === 'personalizado' ? 'text-orange-600' : 'text-blue-600'}>
                {item.drawingType === 'personalizado' ? `Personalizado (${item.childNameForDrawing || 'Sem nome'})` : 'Normal'}
              </span>
            </p>
          </div>
          <p className="font-black text-chocolate text-xs">R$ {item.itemTotal?.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Estados para o formulário de pedido (Novo ou Edição)
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerWhatsapp: "",
    receivingMethod: "retirada",
    estimatedTotalAmount: 0,
    status: "pendente",
    paymentMethod: "pix",
    paymentStatus: "pendente",
    amountPaid: 0,
    pickupDate: "",
    pickupTime: "",
    deliveryZipCode: "",
    customerNotes: ""
  });

  const [manualItems, setManualItems] = useState<any[]>([]);
  const [currentManualItem, setCurrentManualItem] = useState({
    quantity: 1,
    characterTheme: "",
    drawingType: "normal",
    childNameForDrawing: "",
    unitPrice: 49.90
  });

  const ordersQuery = useMemoFirebase(() => {
    return query(collection(db, "orders"), orderBy("orderDate", "desc"));
  }, [db]);

  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  if (isUserLoading) return null;
  if (!user) {
    router.push("/admin/login");
    return null;
  }

  const updateStatus = (orderId: string, newStatus: string) => {
    updateDoc(doc(db, "orders", orderId), { status: newStatus });
  };

  const updatePaymentStatus = (orderId: string, newStatus: string) => {
    updateDoc(doc(db, "orders", orderId), { paymentStatus: newStatus });
  };

  const updateAmountPaid = (orderId: string, amount: number) => {
    updateDoc(doc(db, "orders", orderId), { amountPaid: amount });
  };

  const deleteOrder = (orderId: string) => {
    if (confirm("Deseja realmente excluir este pedido? Isso removerá o registro permanentemente.")) {
      deleteDoc(doc(db, "orders", orderId));
    }
  };

  const resetForm = () => {
    setOrderForm({
      customerName: "",
      customerWhatsapp: "",
      receivingMethod: "retirada",
      estimatedTotalAmount: 0,
      status: "pendente",
      paymentMethod: "pix",
      paymentStatus: "pendente",
      amountPaid: 0,
      pickupDate: "",
      pickupTime: "",
      deliveryZipCode: "",
      customerNotes: ""
    });
    setManualItems([]);
    setEditingOrderId(null);
  };

  const handleEditOrder = async (order: any) => {
    setEditingOrderId(order.id);
    setOrderForm({
      customerName: order.customerName || "",
      customerWhatsapp: order.customerWhatsapp || "",
      receivingMethod: order.receivingMethod || "retirada",
      estimatedTotalAmount: order.estimatedTotalAmount || 0,
      status: order.status || "pendente",
      paymentMethod: order.paymentMethod || "pix",
      paymentStatus: order.paymentStatus || "pendente",
      amountPaid: order.amountPaid || 0,
      pickupDate: order.pickupDate || "",
      pickupTime: order.pickupTime || "",
      deliveryZipCode: order.deliveryZipCode || "",
      customerNotes: order.customerNotes || ""
    });

    // Buscar itens para o formulário de edição
    const itemsSnap = await getDocs(collection(db, "orders", order.id, "items"));
    const items = itemsSnap.docs.map(d => ({ ...d.data(), id: d.id }));
    setManualItems(items);
    setIsFormDialogOpen(true);
  };

  const addManualItem = () => {
    if (!currentManualItem.characterTheme) return;
    const itemTotal = currentManualItem.quantity * currentManualItem.unitPrice;
    const itemToAdd = { ...currentManualItem, itemTotal, id: crypto.randomUUID() };
    setManualItems([...manualItems, itemToAdd]);
    
    setOrderForm(prev => ({
      ...prev,
      estimatedTotalAmount: prev.estimatedTotalAmount + itemTotal
    }));

    setCurrentManualItem({
      quantity: 1,
      characterTheme: "",
      drawingType: "normal",
      childNameForDrawing: "",
      unitPrice: 49.90
    });
  };

  const removeManualItem = (id: string, total: number) => {
    setManualItems(manualItems.filter(i => i.id !== id));
    setOrderForm(prev => ({
      ...prev,
      estimatedTotalAmount: Math.max(0, prev.estimatedTotalAmount - total)
    }));
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualItems.length === 0 && !confirm("Salvar pedido sem itens?")) return;

    const orderId = editingOrderId || crypto.randomUUID();
    const batch = writeBatch(db);
    const orderRef = doc(db, "orders", orderId);

    // Se for edição, vamos deletar os itens antigos antes de salvar os novos no batch
    // (Simplificação: em um sistema real, poderíamos atualizar apenas os alterados)
    if (editingOrderId) {
      const oldItemsSnap = await getDocs(collection(db, "orders", orderId, "items"));
      oldItemsSnap.docs.forEach(d => {
        batch.delete(d.ref);
      });
    }

    batch.set(orderRef, {
      ...orderForm,
      id: orderId,
      orderDate: editingOrderId ? orders?.find(o => o.id === editingOrderId)?.orderDate : new Date().toISOString(),
      isManuallyAdded: true
    }, { merge: true });

    manualItems.forEach(item => {
      const itemRef = doc(collection(db, "orders", orderId, "items"));
      batch.set(itemRef, {
        ...item,
        id: itemRef.id,
        orderId
      });
    });

    await batch.commit();
    
    setIsFormDialogOpen(false);
    resetForm();
  };

  const statusColors: Record<string, string> = {
    pendente: "bg-orange-500",
    confirmado: "bg-blue-500",
    pronto: "bg-purple-500",
    entregue: "bg-green-500",
    cancelado: "bg-red-500"
  };

  const payStatusColors: Record<string, string> = {
    pendente: "bg-red-100 text-red-700 border-red-200",
    pago: "bg-green-100 text-green-700 border-green-200",
    parcial: "bg-yellow-100 text-yellow-700 border-yellow-200"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-chocolate uppercase">Gerenciador de Pedidos</h1>
            <p className="text-gray-500 font-medium">Controle total da sua produção de Páscoa 2026</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isFormDialogOpen} onOpenChange={(open) => {
              setIsFormDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-chocolate text-white rounded-xl font-bold" onClick={() => resetForm()}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Novo Pedido Manual
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-chocolate font-black uppercase">
                    {editingOrderId ? "Editar Pedido" : "Adicionar Pedido Manual"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveOrder} className="space-y-6 pt-4">
                  {/* Seção Cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Cliente</Label>
                      <Input 
                        required 
                        value={orderForm.customerName} 
                        onChange={e => setOrderForm({...orderForm, customerName: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp</Label>
                      <Input 
                        required 
                        placeholder="(47) 9..."
                        value={orderForm.customerWhatsapp} 
                        onChange={e => setOrderForm({...orderForm, customerWhatsapp: e.target.value})} 
                      />
                    </div>
                  </div>

                  {/* Seção Itens */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                    <h3 className="text-xs font-black uppercase text-chocolate flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" /> Itens da Encomenda
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="md:col-span-2">
                        <Label className="text-[10px]">Tema/Personagem</Label>
                        <Input 
                          placeholder="Ex: Frozen, Stitch..."
                          value={currentManualItem.characterTheme}
                          onChange={e => setCurrentManualItem({...currentManualItem, characterTheme: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px]">Qtd</Label>
                        <Input 
                          type="number"
                          value={currentManualItem.quantity}
                          onChange={e => setCurrentManualItem({...currentManualItem, quantity: parseInt(e.target.value) || 1})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[10px]">Tipo Desenho</Label>
                        <Select 
                          value={currentManualItem.drawingType} 
                          onValueChange={v => setCurrentManualItem({...currentManualItem, drawingType: v})}
                        >
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal do Personagem</SelectItem>
                            <SelectItem value="personalizado">Personalizado (+R$10)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {currentManualItem.drawingType === 'personalizado' && (
                        <div>
                          <Label className="text-[10px]">Nome da Criança</Label>
                          <Input 
                            value={currentManualItem.childNameForDrawing}
                            onChange={e => setCurrentManualItem({...currentManualItem, childNameForDrawing: e.target.value})}
                          />
                        </div>
                      )}
                    </div>

                    <Button 
                      type="button" 
                      onClick={addManualItem}
                      className="w-full bg-white border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-white font-bold h-9"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Adicionar Item à Lista
                    </Button>

                    {/* Lista de itens adicionados */}
                    {manualItems.length > 0 && (
                      <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                        {manualItems.map((item) => (
                          <div key={item.id} className="bg-white p-2 rounded-lg border flex justify-between items-center shadow-sm">
                            <div className="text-xs font-bold">
                              {item.quantity}x {item.characterTheme} ({item.drawingType})
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-red-500"
                              onClick={() => removeManualItem(item.id, item.itemTotal)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Seção Logística e Financeiro */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase text-chocolate">Logística</Label>
                      <Select value={orderForm.receivingMethod} onValueChange={v => setOrderForm({...orderForm, receivingMethod: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retirada">Retirada (Aventureiro)</SelectItem>
                          <SelectItem value="entrega">Entrega (Joinville)</SelectItem>
                        </SelectContent>
                      </Select>
                      {orderForm.receivingMethod === 'entrega' ? (
                        <Input 
                          placeholder="CEP Entrega" 
                          value={orderForm.deliveryZipCode}
                          onChange={e => setOrderForm({...orderForm, deliveryZipCode: e.target.value})}
                        />
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Input type="date" value={orderForm.pickupDate} onChange={e => setOrderForm({...orderForm, pickupDate: e.target.value})} />
                          <Input type="time" value={orderForm.pickupTime} onChange={e => setOrderForm({...orderForm, pickupTime: e.target.value})} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase text-chocolate">Financeiro</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px]">Total (R$)</Label>
                          <Input 
                            type="number" step="0.01" 
                            value={orderForm.estimatedTotalAmount} 
                            onChange={e => setOrderForm({...orderForm, estimatedTotalAmount: parseFloat(e.target.value) || 0})} 
                          />
                        </div>
                        <div>
                          <Label className="text-[10px]">Pago (R$)</Label>
                          <Input 
                            type="number" step="0.01" 
                            value={orderForm.amountPaid} 
                            onChange={e => setOrderForm({...orderForm, amountPaid: parseFloat(e.target.value) || 0})} 
                          />
                        </div>
                      </div>
                      <Select value={orderForm.paymentStatus} onValueChange={v => setOrderForm({...orderForm, paymentStatus: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="parcial">Parcial</SelectItem>
                          <SelectItem value="pago">Pago</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-chocolate text-white font-black uppercase h-12 shadow-lg">
                    {editingOrderId ? "Salvar Alterações" : "Finalizar e Salvar Pedido"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => router.push("/")} className="rounded-xl">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </header>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Clock /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Pendentes</p>
                <p className="text-2xl font-black">{orders?.filter(o => o.status === 'pendente').length || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Package /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Confirmados</p>
                <p className="text-2xl font-black">{orders?.filter(o => o.status === 'confirmado' || o.status === 'pronto').length || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle2 /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Entregues</p>
                <p className="text-2xl font-black">{orders?.filter(o => o.status === 'entregue').length || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm font-black text-chocolate bg-easter-yellow/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-white p-3 rounded-full text-chocolate shadow-sm"><CreditCard /></div>
              <div>
                <p className="text-xs font-bold uppercase opacity-60">Total Previsto</p>
                <p className="text-2xl">R$ {orders?.reduce((acc, curr) => acc + (curr.estimatedTotalAmount || 0), 0).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Pedidos */}
        <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-chocolate p-6 text-white">
            <CardTitle className="uppercase font-black text-sm tracking-widest flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Todos os Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-bold uppercase text-[10px]">Data</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Cliente</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Pagamento</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Total</TableHead>
                    <TableHead className="font-bold uppercase text-[10px]">Status</TableHead>
                    <TableHead className="text-right font-bold uppercase text-[10px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50/50 group">
                      <TableCell className="text-[10px] font-medium whitespace-nowrap">
                        {order.orderDate ? format(new Date(order.orderDate), "dd/MM HH:mm", { locale: ptBR }) : 'Manual'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col min-w-[120px]">
                          <span className="font-bold text-sm text-chocolate leading-tight">{order.customerName}</span>
                          <a 
                            href={`https://wa.me/${order.customerWhatsapp?.replace(/\D/g, '')}`} 
                            target="_blank" 
                            className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-1 font-bold"
                          >
                            <Smartphone className="h-3 w-3" /> {order.customerWhatsapp}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col whitespace-nowrap">
                          <Badge variant="outline" className={`w-fit text-[9px] uppercase h-4 ${payStatusColors[order.paymentStatus || 'pendente']}`}>
                            {order.paymentStatus?.toUpperCase() || 'PENDENTE'}
                          </Badge>
                          <span className="text-[9px] text-gray-400 mt-1 font-bold">
                            R$ {order.amountPaid?.toFixed(2) || '0.00'} de R$ {order.estimatedTotalAmount?.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-sm whitespace-nowrap text-chocolate">
                        R$ {order.estimatedTotalAmount?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={order.status} 
                          onValueChange={(val) => updateStatus(order.id, val)}
                        >
                          <SelectTrigger className={`h-7 w-28 text-[9px] font-black text-white uppercase rounded-full border-none shadow-sm ${statusColors[order.status] || 'bg-gray-400'}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="confirmado">Confirmado</SelectItem>
                            <SelectItem value="pronto">Pronto</SelectItem>
                            <SelectItem value="entregue">Entregue</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-chocolate hover:bg-chocolate/10"
                            onClick={() => setViewingOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => deleteOrder(order.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DIALOG DE DETALHES COMPLETOS */}
      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          {viewingOrder && (
            <div className="flex flex-col max-h-[90vh]">
              <div className={`p-6 ${statusColors[viewingOrder.status]} text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Detalhes do Pedido</p>
                    <h2 className="text-2xl font-black uppercase">#{viewingOrder.id?.slice(-6)}</h2>
                  </div>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none font-black px-4 py-1">
                    {viewingOrder.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
                {/* Seção Cliente e Pagamento */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-chocolate flex items-center gap-2">
                      <User className="h-4 w-4" /> Informações do Cliente
                    </h3>
                    <div className="space-y-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{viewingOrder.customerName}</p>
                      <p className="text-xs text-gray-500 font-medium">{viewingOrder.customerWhatsapp}</p>
                      <p className="text-xs text-gray-400 italic pt-2">
                        Pedido em: {viewingOrder.orderDate ? format(new Date(viewingOrder.orderDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR }) : 'Manual'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-chocolate flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Gestão de Pagamento
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase font-bold text-gray-400">Status</Label>
                          <Select 
                            defaultValue={viewingOrder.paymentStatus || "pendente"} 
                            onValueChange={(val) => updatePaymentStatus(viewingOrder.id, val)}
                          >
                            <SelectTrigger className="h-8 text-xs font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="parcial">Parcial</SelectItem>
                              <SelectItem value="pago">Pago</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase font-bold text-gray-400">Valor Pago (R$)</Label>
                          <Input 
                            type="number" 
                            step="0.01" 
                            defaultValue={viewingOrder.amountPaid || 0}
                            className="h-8 text-xs font-bold"
                            onBlur={(e) => updateAmountPaid(viewingOrder.id, parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Restante</span>
                          <span className={`text-sm font-black ${(viewingOrder.estimatedTotalAmount - (viewingOrder.amountPaid || 0)) > 0 ? 'text-red-500' : 'text-green-600'}`}>
                            R$ {(viewingOrder.estimatedTotalAmount - (viewingOrder.amountPaid || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-chocolate flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" /> Itens da Encomenda
                  </h3>
                  <OrderItemsList orderId={viewingOrder.id} />
                </div>

                {/* Entrega/Retirada */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-chocolate flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Logística
                  </h3>
                  <div className="bg-chocolate/5 p-4 rounded-2xl border border-chocolate/10 flex items-center gap-4">
                    <div className="bg-chocolate text-white p-3 rounded-full">
                      {viewingOrder.receivingMethod === 'entrega' ? <Package /> : <MapPin />}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-chocolate leading-none mb-1">
                        {viewingOrder.receivingMethod === 'entrega' ? 'Entrega em Joinville' : 'Retirada no Aventureiro'}
                      </p>
                      <p className="text-sm font-bold text-chocolate/70">
                        {viewingOrder.receivingMethod === 'entrega' 
                          ? `CEP: ${viewingOrder.deliveryZipCode || 'A informar'}`
                          : `Data: ${viewingOrder.pickupDate || 'A combinar'} • Hora: ${viewingOrder.pickupTime || 'A combinar'}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                {viewingOrder.customerNotes && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase text-chocolate">Observações do Cliente</h3>
                    <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 italic text-sm text-gray-700">
                      "{viewingOrder.customerNotes}"
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setViewingOrder(null)}
                  className="rounded-xl font-bold text-gray-500"
                >
                  Fechar Painel
                </Button>
                <Button 
                  className="bg-chocolate text-white rounded-xl font-black uppercase px-8 shadow-lg hover:scale-105 transition-transform"
                  onClick={() => {
                    const statusOrder = ['pendente', 'confirmado', 'pronto', 'entregue'];
                    const nextIdx = (statusOrder.indexOf(viewingOrder.status) + 1) % statusOrder.length;
                    updateStatus(viewingOrder.id, statusOrder[nextIdx]);
                    setViewingOrder(null);
                  }}
                >
                  Avançar Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
