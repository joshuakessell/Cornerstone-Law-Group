import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, FileText, Calendar, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load submissions from local storage on mount if auth
    if (isAuthenticated) {
      const stored = JSON.parse(localStorage.getItem("intake_submissions") || "[]");
      // Sort by date desc
      setSubmissions(stored.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast({ title: "Logged in successfully" });
    } else {
      toast({ title: "Invalid password", variant: "destructive" });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      const updated = submissions.filter(s => s.id !== id);
      setSubmissions(updated);
      localStorage.setItem("intake_submissions", JSON.stringify(updated));
      toast({ title: "Record deleted" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md p-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                type="password" 
                placeholder="Enter password (admin123)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <Section container>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">Intake Submissions</h1>
            <p className="text-gray-500">Manage client intake forms</p>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Sign Out</Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    No submissions found.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">New</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{sub.data.fullName}</TableCell>
                    <TableCell>{sub.data.primaryIssue}</TableCell>
                    <TableCell className="text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Intake Details: {sub.data.fullName}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                              <div className="space-y-2">
                                <h3 className="font-bold border-b pb-1">Personal Info</h3>
                                <div className="grid grid-cols-2 text-sm gap-2">
                                  <p><span className="font-semibold">DOB:</span> {sub.data.dateOfBirth}</p>
                                  <p><span className="font-semibold">Phone:</span> {sub.data.phone}</p>
                                  <p><span className="font-semibold">Email:</span> {sub.data.email}</p>
                                  <p><span className="font-semibold">Address:</span> {sub.data.address}</p>
                                  <p><span className="font-semibold">Occupation:</span> {sub.data.occupation || "N/A"}</p>
                                  <p><span className="font-semibold">Employer:</span> {sub.data.employer || "N/A"}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h3 className="font-bold border-b pb-1">Opposing Party</h3>
                                <div className="grid grid-cols-2 text-sm gap-2">
                                  <p><span className="font-semibold">Name:</span> {sub.data.opposingName}</p>
                                  <p><span className="font-semibold">Relation:</span> {sub.data.relationship}</p>
                                  <p><span className="font-semibold">Marriage:</span> {sub.data.dateOfMarriage || "N/A"}</p>
                                  <p><span className="font-semibold">Separation:</span> {sub.data.dateOfSeparation || "N/A"}</p>
                                  <p><span className="font-semibold">Attorney:</span> {sub.data.opposingAttorney || "N/A"}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h3 className="font-bold border-b pb-1">Case Details</h3>
                                <div className="text-sm space-y-2">
                                  <p><span className="font-semibold">Children:</span> {sub.data.hasChildren} {sub.data.childrenDetails && `(${sub.data.childrenDetails})`}</p>
                                  <p><span className="font-semibold">Primary Issue:</span> {sub.data.primaryIssue}</p>
                                  <div className="bg-gray-50 p-3 rounded">
                                    <p className="font-semibold mb-1">Description:</p>
                                    <p>{sub.data.description}</p>
                                  </div>
                                   <div className="bg-gray-50 p-3 rounded">
                                    <p className="font-semibold mb-1">Goals:</p>
                                    <p>{sub.data.goals}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(sub.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </Section>
    </div>
  );
}
