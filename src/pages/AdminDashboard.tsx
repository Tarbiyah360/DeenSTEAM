import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Application {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  motivation: string;
  experience: string | null;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if user has admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    const isAdmin = roles?.some((r) => r.role === "admin");
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchApplications();
  };

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("ambassador_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const handleAction = async () => {
    if (!selectedApp || !actionType) return;

    setProcessing(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Update application status
    const { error: updateError } = await supabase
      .from("ambassador_applications")
      .update({
        status: actionType === "approve" ? "approved" : "rejected",
        reviewed_by: session.user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", selectedApp.id);

    if (updateError) {
      toast({
        title: "Error",
        description: updateError.message,
        variant: "destructive",
      });
      setProcessing(false);
      return;
    }

    // If approved, assign ambassador role
    if (actionType === "approve") {
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: selectedApp.user_id,
          role: "ambassador",
        });

      if (roleError) {
        toast({
          title: "Error",
          description: "Failed to assign ambassador role",
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }
    }

    toast({
      title: actionType === "approve" ? "Application Approved" : "Application Rejected",
      description: `${selectedApp.display_name}'s application has been ${actionType}d.`,
    });

    // Refresh applications
    fetchApplications();
    setSelectedApp(null);
    setActionType(null);
    setProcessing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const filterApplications = (status: string) => {
    return applications.filter((app) => app.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage ambassador applications</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({filterApplications("pending").length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({filterApplications("approved").length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({filterApplications("rejected").length})
            </TabsTrigger>
          </TabsList>

          {["pending", "approved", "rejected"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filterApplications(status).length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No {status} applications
                  </CardContent>
                </Card>
              ) : (
                filterApplications(status).map((app) => (
                  <Card key={app.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {getStatusIcon(app.status)}
                            {app.display_name}
                          </CardTitle>
                          <CardDescription>{app.email}</CardDescription>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-1">Motivation:</p>
                        <p className="text-sm text-muted-foreground">{app.motivation}</p>
                      </div>
                      {app.experience && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Experience:</p>
                          <p className="text-sm text-muted-foreground">{app.experience}</p>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        Applied: {new Date(app.created_at).toLocaleDateString()}
                      </div>
                      {app.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedApp(app);
                              setActionType("approve");
                            }}
                            variant="default"
                            className="flex-1"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedApp(app);
                              setActionType("reject");
                            }}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <AlertDialog open={!!selectedApp && !!actionType} onOpenChange={() => {
        setSelectedApp(null);
        setActionType(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Approve Application" : "Reject Application"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve"
                ? `Are you sure you want to approve ${selectedApp?.display_name}'s application? They will be granted the ambassador role.`
                : `Are you sure you want to reject ${selectedApp?.display_name}'s application?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={processing}
              className={actionType === "reject" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                actionType === "approve" ? "Approve" : "Reject"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
