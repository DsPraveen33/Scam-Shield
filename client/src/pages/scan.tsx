import { useState } from "react";
import Layout from "@/components/layout";
import { useCreateScan } from "@/hooks/use-scans";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield, FileText, Globe, AlertTriangle, CheckCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ScanPage() {
  const { mutate: createScan, isPending, data: result } = useCreateScan();
  const [activeTab, setActiveTab] = useState("url");
  const [jobUrl, setJobUrl] = useState("");
  const [offerText, setOfferText] = useState("");

  const handleSubmit = () => {
    if (activeTab === "url" && !jobUrl) return;
    if (activeTab === "text" && !offerText) return;

    createScan({
      jobUrl: activeTab === "url" ? jobUrl : undefined,
      offerText: activeTab === "text" ? offerText : undefined,
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-display mb-4">Scan Job Offer</h1>
          <p className="text-lg text-muted-foreground">
            Paste a link or offer letter text to analyze for potential fraud markers.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-primary/5 p-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-transparent">
                    <TabsTrigger value="url" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Globe className="w-4 h-4 mr-2" /> URL Scan
                    </TabsTrigger>
                    <TabsTrigger value="text" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <FileText className="w-4 h-4 mr-2" /> Text Analysis
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="p-6 bg-white">
                    <TabsContent value="url" className="mt-0 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Job Post URL</label>
                        <Input 
                          placeholder="https://company.com/careers/job..." 
                          className="h-12 bg-slate-50 border-slate-200"
                          value={jobUrl}
                          onChange={(e) => setJobUrl(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="w-3 h-3" /> We check domain age, reputation, and blacklists.
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="text" className="mt-0 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Offer Letter / Email Content</label>
                        <Textarea 
                          placeholder="Paste the email content or offer letter text here..." 
                          className="min-h-[200px] bg-slate-50 border-slate-200 resize-none p-4"
                          value={offerText}
                          onChange={(e) => setOfferText(e.target.value)}
                        />
                      </div>
                    </TabsContent>

                    <Button 
                      className="w-full h-12 mt-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                      onClick={handleSubmit}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Analyze Risk
                        </>
                      )}
                    </Button>
                  </div>
                </Tabs>
              </div>
            </Card>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full"
                >
                  <Card className={cn(
                    "h-full border-t-4 shadow-lg",
                    result.result === 'SAFE' && "border-t-green-500",
                    result.result === 'SUSPICIOUS' && "border-t-orange-500",
                    result.result === 'FAKE' && "border-t-red-500",
                  )}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Analysis Result
                        {result.result === 'SAFE' && <CheckCircle className="text-green-500 ml-auto" />}
                        {result.result === 'SUSPICIOUS' && <AlertTriangle className="text-orange-500 ml-auto" />}
                        {result.result === 'FAKE' && <Shield className="text-red-500 ml-auto" />}
                      </CardTitle>
                      <CardDescription>Scan ID: #{result.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center py-6 bg-slate-50 rounded-xl">
                        <div className={cn(
                          "text-5xl font-black mb-2",
                          result.result === 'SAFE' && "text-green-600",
                          result.result === 'SUSPICIOUS' && "text-orange-500",
                          result.result === 'FAKE' && "text-red-600",
                        )}>
                          {result.riskScore}%
                        </div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Risk Score</div>
                        <div className={cn(
                          "mt-2 inline-flex px-3 py-1 rounded-full text-xs font-bold",
                          result.result === 'SAFE' && "bg-green-100 text-green-700",
                          result.result === 'SUSPICIOUS' && "bg-orange-100 text-orange-700",
                          result.result === 'FAKE' && "bg-red-100 text-red-700",
                        )}>
                          {result.result}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Search className="w-4 h-4 text-primary" /> Key Findings
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {result.details.reasoning}
                        </p>
                      </div>

                      {result.details.flags.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" /> Red Flags
                          </h4>
                          <ul className="space-y-2">
                            {result.details.flags.map((flag, i) => (
                              <li key={i} className="text-sm bg-red-50 text-red-700 px-3 py-2 rounded-lg flex items-start gap-2">
                                <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-slate-50/50">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 opacity-20" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Ready to Scan</h3>
                  <p className="text-sm max-w-[200px]">Results will appear here after analysis is complete.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
