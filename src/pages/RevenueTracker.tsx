import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Plus, ArrowLeft, Loader2, TrendingUp, Download } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function RevenueTracker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [formData, setFormData] = useState({
    source: "music",
    amount: "",
    currency: "USD",
    transaction_date: new Date().toISOString().split('T')[0],
    description: "",
  });

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("revenue_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("transaction_date", { ascending: false });

    if (data) {
      setTransactions(data);
      const total = data.reduce((sum, t) => sum + Number(t.amount), 0);
      setTotalRevenue(total);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("revenue_transactions")
        .insert({
          ...formData,
          amount: parseFloat(formData.amount),
          user_id: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Sukces!",
        description: "Transakcja została dodana",
      });

      setShowForm(false);
      setFormData({
        source: "music",
        amount: "",
        currency: "USD",
        transaction_date: new Date().toISOString().split('T')[0],
        description: "",
      });
      loadTransactions();
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Data", "Źródło", "Kwota", "Waluta", "Opis"];
    const rows = transactions.map(t => [
      t.transaction_date,
      t.source,
      t.amount,
      t.currency,
      t.description || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(r => r.map(v => `"${v}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Eksport ukończony",
      description: "Dane przychodów zostały wyeksportowane",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do panelu
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Śledzenie Przychodów</h1>
              <p className="text-muted-foreground">
                Zarządzaj przychodami ze wszystkich źródeł
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Eksportuj CSV
              </Button>
              <Button
                variant="gradient"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Dodaj Transakcję
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass-dark border-white/10">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Całkowity przychód</p>
                  <p className="text-4xl font-bold">
                    $<CountUp end={totalRevenue} duration={2} separator="," decimals={2} />
                  </p>
                </div>
                <div className="p-4 rounded-full bg-green-500/10">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="glass-dark border-white/10">
              <CardHeader>
                <CardTitle>Nowa Transakcja</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source">Źródło</Label>
                      <Select
                        value={formData.source}
                        onValueChange={(value) => setFormData({ ...formData, source: value })}
                      >
                        <SelectTrigger id="source">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="music">Muzyka</SelectItem>
                          <SelectItem value="publication">Publikacje</SelectItem>
                          <SelectItem value="campaign">Kampanie</SelectItem>
                          <SelectItem value="other">Inne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Kwota</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Waluta</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData({ ...formData, currency: value })}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="PLN">PLN</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Data transakcji</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.transaction_date}
                        onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Opis</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Opcjonalny opis transakcji"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" variant="gradient" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Dodawanie...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Dodaj Transakcję
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Anuluj
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-dark border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-green-500/10">
                        <DollarSign className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description || transaction.source}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.transaction_date).toLocaleDateString('pl-PL')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">
                        +{transaction.currency} {Number(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{transaction.source}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {transactions.length === 0 && !showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Brak transakcji</h3>
              <p className="text-muted-foreground mb-4">
                Zacznij śledzić swoje przychody dodając pierwszą transakcję
              </p>
              <Button variant="gradient" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Dodaj Pierwszą Transakcję
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
