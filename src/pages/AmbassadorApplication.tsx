import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const applicationSchema = z.object({
  displayName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  motivation: z.string().trim().min(50, "Please provide at least 50 characters").max(1000, "Motivation must be less than 1000 characters"),
  experience: z.string().trim().max(1000, "Experience must be less than 1000 characters").optional(),
});

const AmbassadorApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    motivation: "",
    experience: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check for existing application
    const { data, error } = await supabase
      .from("ambassador_applications")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking application:", error);
    } else if (data) {
      setExistingApplication(data);
    }

    // Pre-fill form with user data
    setFormData({
      displayName: session.user.user_metadata?.display_name || "",
      email: session.user.email || "",
      motivation: "",
      experience: "",
    });

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validation = applicationSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { error } = await supabase
      .from("ambassador_applications")
      .insert({
        user_id: session.user.id,
        display_name: formData.displayName,
        email: formData.email,
        motivation: formData.motivation,
        experience: formData.experience || null,
      });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Application Submitted",
        description: "Your ambassador application has been submitted for review.",
      });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (existingApplication) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Ambassador Application Status</CardTitle>
              <CardDescription>You have already submitted an application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <p className="text-lg font-semibold capitalize mt-1">{existingApplication.status}</p>
              </div>
              <div>
                <Label>Submitted</Label>
                <p className="text-muted-foreground mt-1">
                  {new Date(existingApplication.created_at).toLocaleDateString()}
                </p>
              </div>
              {existingApplication.status === "rejected" && (
                <p className="text-sm text-muted-foreground">
                  If you'd like to reapply, please contact support.
                </p>
              )}
              <Button onClick={() => navigate("/")} className="w-full">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Apply to Become a STEAM Ambassador</CardTitle>
            <CardDescription>
              Share your passion for Islamic education and STEAM learning with our community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Full Name *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Your full name"
                  aria-invalid={!!errors.displayName}
                  aria-describedby={errors.displayName ? "displayName-error" : undefined}
                />
                {errors.displayName && (
                  <p id="displayName-error" className="text-sm text-destructive">
                    {errors.displayName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation">Why do you want to become an ambassador? *</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="Tell us about your passion for Islamic education and STEAM learning... (minimum 50 characters)"
                  className="min-h-[120px]"
                  aria-invalid={!!errors.motivation}
                  aria-describedby={errors.motivation ? "motivation-error" : undefined}
                />
                <p className="text-sm text-muted-foreground">
                  {formData.motivation.length} / 1000 characters
                </p>
                {errors.motivation && (
                  <p id="motivation-error" className="text-sm text-destructive">
                    {errors.motivation}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Relevant Experience (Optional)</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Share any relevant teaching, mentoring, or community involvement experience..."
                  className="min-h-[120px]"
                  aria-invalid={!!errors.experience}
                  aria-describedby={errors.experience ? "experience-error" : undefined}
                />
                <p className="text-sm text-muted-foreground">
                  {formData.experience.length} / 1000 characters
                </p>
                {errors.experience && (
                  <p id="experience-error" className="text-sm text-destructive">
                    {errors.experience}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AmbassadorApplication;
