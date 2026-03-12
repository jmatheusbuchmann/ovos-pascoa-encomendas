"use client";

import { useState } from "react";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
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
  User, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Trash2,
  PlusCircle,
  Package
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form state for manual order
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerWhatsapp: "",
    receivingMethod: "retirada",
    estimatedTotalAmount: 0,
    status: "pendente"
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

  const deleteOrder = (orderId: string) => {
    if (confirm("Deseja realmente excluir este pedido?")) {
      deleteDoc(doc(db, "orders", orderId));
    }
  };

  const handleAddManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = crypto.randomUUID();
    await addDoc(collection(db, "orders"), {
      ...newOrder,
      id: orderId,
      orderDate: newOrder.status === 'pendente' ? new Date().toISOString() : serverTimestamp(),
      isManuallyAdded: true
    });
    setIsAddDialogOpen(false);
    setNewOrder({
      customerName: "",
      customerWhatsapp: "",
      receivingMethod: "retirada",
      estimatedTotalAmount: 0,
      status: "pendente"
    });
  };

  const statusColors: Record<string, string> = {
    pendente: "bg-orange-500",
    confirmado: "bg-blue-500",
    pronto: "bg-purple-500",
    entregue: "bg-green-500",
    cancelado: "bg-red-500"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-chocolate uppercase">Gerenciador de Pedidos</h1>
            <p className="text-gray-500 font-medium">Controle total da sua produção de Páscoa</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-chocolate text-white rounded-xl font-bold">
                  <PlusCircle className="mr-2 h-4 w-4" /> Novo Pedido
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-chocolate font-black uppercase">Adicionar Pedido Manual</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddManualOrder} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Nome do Cliente</Label>
                    <Input 
                      required 
                      value={newOrder.customerName} 
                      onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input 
                      required 
                      placeholder="(47) 9..."
                      value={newOrder.customerWhatsapp} 
                      onChange={e => setNewOrder({...newOrder, customerWhatsapp: e.target.value})} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor Total (R$)</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        required
                        value={newOrder.estimatedTotalAmount} 
                        onChange={e => setNewOrder({...newOrder, estimatedTotalAmount: parseFloat(e.target.value)})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Recebimento</Label>
                      <Select value={newOrder.receivingMethod} onValueChange={v => setNewOrder({...newOrder, receivingMethod: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retirada">Retirada</SelectItem>
                          <SelectItem value="entrega">Entrega</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-chocolate text-white font-black uppercase h-12">Salvar Pedido</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => router.push("/")} className="rounded-xl">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </header>

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
              <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle2 /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Entregues</p>
                <p className="text-2xl font-black">{orders?.filter(o => o.status === 'entregue').length || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Package /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Total Pedidos</p>
                <p className="text-2xl font-black">{orders?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-chocolate p-6 text-white">
            <CardTitle className="uppercase font-black text-sm tracking-widest flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Histórico de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold uppercase text-[10px]">Data Pedido</TableHead>
                  <TableHead className="font-bold uppercase text-[10px]">Cliente</TableHead>
                  <TableHead className="font-bold uppercase text-[10px]">Entrega/Retirada</TableHead>
                  <TableHead className="font-bold uppercase text-[10px]">Total</TableHead>
                  <TableHead className="font-bold uppercase text-[10px]">Status</TableHead>
                  <TableHead className="text-right font-bold uppercase text-[10px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-xs font-medium">
                      {order.orderDate ? format(new Date(order.orderDate), "dd/MM - HH:mm", { locale: ptBR }) : 'Manual'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-chocolate">{order.customerName}</span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Smartphone className="h-3 w-3" /> {order.customerWhatsapp}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Badge variant="outline" className="w-fit text-[10px] uppercase">{order.receivingMethod}</Badge>
                        <span className="text-[10px] text-gray-500 mt-1">
                          {order.receivingMethod === 'entrega' ? (order.deliveryZipCode || 'A combinar') : `${order.pickupDate || ''} ${order.pickupTime || ''}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-sm">R$ {order.estimatedTotalAmount?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={order.status} 
                        onValueChange={(val) => updateStatus(order.id, val)}
                      >
                        <SelectTrigger className={`h-8 w-32 text-[10px] font-bold text-white uppercase rounded-full border-none ${statusColors[order.status] || 'bg-gray-400'}`}>
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
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500 hover:bg-red-50"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
