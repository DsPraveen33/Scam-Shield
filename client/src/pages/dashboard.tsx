import Layout from "@/components/layout";
import { useScans } from "@/hooks/use-scans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, ShieldQuestion, Loader2, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: scans, isLoading } = useScans();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const recentScans = scans?.slice(0, 5) || [];
  
  // Stats
  const totalScans = scans?.length || 0;
  const safeScans = scans?.filter(s => s.result === 'SAFE').length || 0;
  const fakeScans = scans?.filter(s => s.result === 'FAKE').length || 0;
  
  // Chart Data
  const chartData = [
    { name: 'Safe', value: safeScans, fill: '#22c55e' },
    { name: 'Suspicious', value: scans?.filter(s => s.result === 'SUSPICIOUS').length || 0, fill: '#f59e0b' },
    { name: 'Fake', value: fakeScans, fill: '#ef4444' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your recent scam checks.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalScans}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Threats Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{fakeScans}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Safe Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{safeScans}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Recent Activity</h2>
            <Link href="/scan" className="text-sm text-primary font-medium hover:underline flex items-center">
              New Scan <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentScans.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed">
                <p className="text-muted-foreground">No scans yet. Try scanning a job link!</p>
              </div>
            ) : (
              recentScans.map((scan) => (
                <div key={scan.id} className="bg-card p-4 rounded-xl border shadow-sm flex items-start gap-4 hover:border-primary/50 transition-colors">
                  <div className={cn(
                    "p-2 rounded-lg shrink-0",
                    scan.result === 'SAFE' && "bg-green-100 text-green-600",
                    scan.result === 'SUSPICIOUS' && "bg-orange-100 text-orange-600",
                    scan.result === 'FAKE' && "bg-red-100 text-red-600",
                  )}>
                    {scan.result === 'SAFE' && <ShieldCheck className="w-6 h-6" />}
                    {scan.result === 'SUSPICIOUS' && <ShieldQuestion className="w-6 h-6" />}
                    {scan.result === 'FAKE' && <ShieldAlert className="w-6 h-6" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                        {scan.result}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(scan.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium truncate text-foreground mb-1">
                      {scan.jobUrl || "Text Content Scan"}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {scan.details.reasoning}
                    </p>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <div className={cn(
                      "text-lg font-bold",
                      scan.riskScore > 70 ? "text-red-600" : scan.riskScore > 30 ? "text-orange-500" : "text-green-600"
                    )}>
                      {scan.riskScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-display">Analytics</h2>
          <Card className="h-[300px] flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
