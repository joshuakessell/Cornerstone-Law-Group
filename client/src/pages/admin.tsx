import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Calendar, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IntakeSubmission } from "@shared/schema";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      return response.json();
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({ title: "Logged in successfully" });
    },
    onError: () => {
      toast({ title: "Invalid credentials", variant: "destructive" });
    },
  });

  const { data: submissions = [], isLoading } = useQuery<IntakeSubmission[]>({
    queryKey: ["intake-submissions"],
    queryFn: async () => {
      const response = await fetch("/api/intake");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/intake/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intake-submissions"] });
      toast({ title: "Record deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete record", variant: "destructive" });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteMutation.mutate(id);
    }
  };

  useEffect(() => {
    // Seed admin user on mount
    fetch("/api/admin/seed", { method: "POST" });
  }, []);

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
                type="text" 
                placeholder="Username (admin)" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="input-admin-username"
              />
              <Input 
                type="password" 
                placeholder="Password (admin123)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-admin-password"
              />
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loginMutation.isPending}
                data-testid="button-admin-login"
              >
                {loginMutation.isPending ? "Logging in..." : "Access Dashboard"}
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
          <Button variant="outline" onClick={() => setIsAuthenticated(false)} data-testid="button-admin-logout">Sign Out</Button>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    No submissions found.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub) => (
                  <TableRow key={sub.id} data-testid={`row-submission-${sub.id}`}>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">{sub.status}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{sub.fullName}</TableCell>
                    <TableCell>{sub.primaryIssue}</TableCell>
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
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" data-testid={`button-view-${sub.id}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Intake Details: {sub.fullName}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                              <div className="space-y-2">
                                <h3 className="font-bold border-b pb-1">Personal Info</h3>
                                <div className="grid grid-cols-2 text-sm gap-2">
                                  <p><span className="font-semibold">DOB:</span> {sub.dateOfBirth}</p>
                                  <p><span className="font-semibold">Phone:</span> {sub.phone}</p>
                                  <p><span className="font-semibold">Email:</span> {sub.email}</p>
                                  <p><span className="font-semibold">Address:</span> {sub.address}</p>
                                  <p><span className="font-semibold">Occupation:</span> {sub.occupation || "N/A"}</p>
                                  <p><span className="font-semibold">Employer:</span> {sub.employer || "N/A"}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h3 className="font-bold border-b pb-1">Opposing Party</h3>
                                <div className="grid grid-cols-2 text-sm gap-2">
                                  <p><span className="font-semibold">Name:</span> {sub.opposingName}</p>
                                  <p><span className="font-semibold">Relation:</span> {sub.relationship}</p>
                                  <p><span className="font-semibold">Marriage:</span> {sub.dateOfMarriage || "N/A"}</p>
                                  <p><span className="font-semibold">Separation:</span> {sub.dateOfSeparation || "N/A"}</p>
                                  <p><span className="font-semibold">Attorney:</span> {sub.opposingAttorney || "N/A"}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h3 className="font-bold border-b pb-1">Case Details</h3>
                                <div className="text-sm space-y-2">
                                  <p><span className="font-semibold">Children:</span> {sub.hasChildren} {sub.childrenDetails && `(${sub.childrenDetails})`}</p>
                                  <p><span className="font-semibold">Primary Issue:</span> {sub.primaryIssue}</p>
                                  <div className="bg-gray-50 p-3 rounded">
                                    <p className="font-semibold mb-1">Description:</p>
                                    <p>{sub.description}</p>
                                  </div>
                                   <div className="bg-gray-50 p-3 rounded">
                                    <p className="font-semibold mb-1">Goals:</p>
                                    <p>{sub.goals}</p>
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
                          data-testid={`button-delete-${sub.id}`}
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
