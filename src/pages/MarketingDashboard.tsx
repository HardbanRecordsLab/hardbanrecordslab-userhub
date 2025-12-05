import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Target, TrendingUp, Users, DollarSign, 
  Calendar, BarChart3, PlusCircle, Eye, MousePointer,
  Share2, Mail, Megaphone
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const performanceData = [
  { name: 'Sty', impressions: 4000, clicks: 240, conversions: 24 },
  { name: 'Lut', impressions: 3000, clicks: 139, conversions: 22 },
  { name: 'Mar', impressions: 5000, clicks: 380, conversions: 35 },
  { name: 'Kwi', impressions: 2780, clicks: 190, conversions: 19 },
  { name: 'Maj', impressions: 1890, clicks: 148, conversions: 18 },
  { name: 'Cze', impressions: 6390, clicks: 380, conversions: 43 },
];

const channelData = [
  { name: 'Instagram', value: 35, color: '#E4405F' },
  { name: 'Facebook', value: 25, color: '#1877F2' },
  { name: 'TikTok', value: 20, color: '#000000' },
  { name: 'YouTube', value: 12, color: '#FF0000' },
  { name: 'Email', value: 8, color: '#7C3AED' },
];

const MarketingDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, [user]);

  const fetchCampaigns = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setCampaigns(data);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const statsCards = [
    { 
      title: "Całkowite Wydatki", 
      value: "12,450 zł", 
      change: "+12%", 
      icon: DollarSign,
      color: "from-green-500 to-emerald-500" 
    },
    { 
      title: "Impressions", 
      value: "245K", 
      change: "+23%", 
      icon: Eye,
      color: "from-blue-500 to-cyan-500" 
    },
    { 
      title: "Kliknięcia", 
      value: "8,420", 
      change: "+18%", 
      icon: MousePointer,
      color: "from-purple-500 to-pink-500" 
    },
    { 
      title: "Konwersje", 
      value: "342", 
      change: "+8%", 
      icon: Target,
      color: "from-orange-500 to-red-500" 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do Panelu
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
                <p className="text-muted-foreground">Zarządzaj kampaniami i analizuj wyniki</p>
              </div>
            </div>
            <Button onClick={() => navigate("/dashboard/content-generator")}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Nowa Kampania
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400/30">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Przegląd
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              <Target className="w-4 h-4 mr-2" />
              Kampanie
            </TabsTrigger>
            <TabsTrigger value="channels">
              <Share2 className="w-4 h-4 mr-2" />
              Kanały
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wydajność w Czasie</CardTitle>
                  <CardDescription>Porównanie impressions, kliknięć i konwersji</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a2e', 
                          border: '1px solid #333',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="clicks" stroke="#06b6d4" strokeWidth={2} />
                      <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Podział wg Kanałów</CardTitle>
                  <CardDescription>Rozkład budżetu marketingowego</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {channelData.map((channel) => (
                      <div key={channel.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }} />
                        <span className="text-sm text-muted-foreground">{channel.name} ({channel.value}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Twoje Kampanie</CardTitle>
                <CardDescription>Zarządzaj aktywnymi i zakończonymi kampaniami</CardDescription>
              </CardHeader>
              <CardContent>
                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Brak kampanii</h3>
                    <p className="text-muted-foreground mb-4">Zacznij swoją pierwszą kampanię marketingową</p>
                    <Button onClick={() => navigate("/dashboard/content-generator")}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Stwórz Kampanię
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Target className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground">{campaign.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          <div className="text-right">
                            <p className="font-medium">{campaign.budget} zł</p>
                            <p className="text-sm text-muted-foreground">budżet</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {channelData.map((channel) => (
                <Card key={channel.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${channel.color}20` }}>
                        <Share2 className="w-5 h-5" style={{ color: channel.color }} />
                      </div>
                      <Badge variant="outline">{channel.value}%</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{channel.name}</h3>
                    <Progress value={channel.value} className="h-2" />
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Zasięg</p>
                        <p className="font-medium">{Math.floor(Math.random() * 50 + 10)}K</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement</p>
                        <p className="font-medium">{(Math.random() * 5 + 1).toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketingDashboard;
