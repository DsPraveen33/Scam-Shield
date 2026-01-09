import Layout from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { useBlacklist, useCreateBlacklist, useDeleteBlacklist, useKeywords, useCreateKeyword, useDeleteKeyword } from "@/hooks/use-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Ban, Type } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminPage() {
  const { user } = useAuth();
  const { data: blacklist } = useBlacklist();
  const { mutate: addBlacklist } = useCreateBlacklist();
  const { mutate: removeBlacklist } = useDeleteBlacklist();
  
  const { data: keywords } = useKeywords();
  const { mutate: addKeyword } = useCreateKeyword();
  const { mutate: removeKeyword } = useDeleteKeyword();

  const [newDomain, setNewDomain] = useState("");
  const [newReason, setNewReason] = useState("");
  
  const [newWord, setNewWord] = useState("");
  const [newCategory, setNewCategory] = useState("generic");

  const isAdmin = true; // For demo purposes, allow access

  return (
    <Layout>
      <div className="mb-8">
  const handleAddDomain = () => {
    if (newDomain && newReason) {
      addBlacklist({ domain: newDomain, reason: newReason });
      setNewDomain("");
      setNewReason("");
    }
  };

  const handleAddKeyword = () => {
    if (newWord) {
      addKeyword({ word: newWord, category: newCategory, weight: 1 });
      setNewWord("");
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Admin Panel</h1>
        <p className="text-muted-foreground mt-2">Manage security rules and blacklists.</p>
      </div>

      <Tabs defaultValue="blacklist" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="blacklist"><Ban className="w-4 h-4 mr-2" /> Blacklisted Domains</TabsTrigger>
          <TabsTrigger value="keywords"><Type className="w-4 h-4 mr-2" /> Suspicious Keywords</TabsTrigger>
        </TabsList>

        <TabsContent value="blacklist">
          <Card>
            <CardHeader>
              <CardTitle>Blacklisted Domains</CardTitle>
              <CardDescription>Domains that will automatically trigger a FAKE result.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6 p-4 bg-slate-50 rounded-lg border">
                <Input 
                  placeholder="domain.com" 
                  value={newDomain} 
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="bg-white"
                />
                <Input 
                  placeholder="Reason (e.g. Known scam site)" 
                  value={newReason} 
                  onChange={(e) => setNewReason(e.target.value)}
                  className="bg-white flex-[2]"
                />
                <Button onClick={handleAddDomain}><Plus className="w-4 h-4 mr-2" /> Add</Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blacklist?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.domain}</TableCell>
                        <TableCell className="text-muted-foreground">{item.reason}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeBlacklist(item.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!blacklist || blacklist.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No domains in blacklist.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <CardTitle>Suspicious Keywords</CardTitle>
              <CardDescription>Words that increase risk score when found in offer text.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6 p-4 bg-slate-50 rounded-lg border">
                <Input 
                  placeholder="Keyword (e.g. wire transfer)" 
                  value={newWord} 
                  onChange={(e) => setNewWord(e.target.value)}
                  className="bg-white flex-[2]"
                />
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="urgency">Urgency</SelectItem>
                    <SelectItem value="generic">Generic</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddKeyword}><Plus className="w-4 h-4 mr-2" /> Add</Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.word}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-bold uppercase",
                            item.category === 'payment' && "bg-red-100 text-red-700",
                            item.category === 'urgency' && "bg-orange-100 text-orange-700",
                            item.category === 'generic' && "bg-slate-100 text-slate-700",
                          )}>
                            {item.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeKeyword(item.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                     {(!keywords || keywords.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No keywords defined.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
