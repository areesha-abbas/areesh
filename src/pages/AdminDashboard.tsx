import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Package,
  Clock,
  CheckCircle,
  Trash2,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  Building,
  FileText,
  Loader2,
  RefreshCw,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  business_name: string;
  niche: string;
  website_goal: string;
  website_goal_other: string | null;
  key_features: string | null;
  special_requests: string | null;
  reference_style: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Review {
  id: string;
  client_name: string;
  client_email: string | null;
  overall_experience: string;
  project_type: string;
  delivery: string;
  communication: string;
  optional_comment: string | null;
  would_recommend: string;
  generated_review: string;
  rating: number;
  created_at: string;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  { value: "in-progress", label: "In Progress", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { value: "preview-sent", label: "Preview Sent", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { value: "completed", label: "Completed", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500/10 text-red-500 border-red-500/20" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/admin/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin/login");
      } else {
        fetchOrders();
        fetchReviews();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error loading orders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error loading reviews",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setSavingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      toast({
        title: "Status updated",
        description: `Order marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const saveNotes = async (orderId: string) => {
    setSavingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ admin_notes: notesValue })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, admin_notes: notesValue } : order
        )
      );

      setEditingNotes(null);
      toast({
        title: "Notes saved",
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      toast({
        title: "Order deleted",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      toast({
        title: "Review deleted",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find((o) => o.value === status) || statusOptions[0];
    return (
      <Badge variant="outline" className={option.color}>
        {option.label}
      </Badge>
    );
  };

  const getGoalText = (order: Order) => {
    if (order.website_goal === "other" && order.website_goal_other) {
      return order.website_goal_other;
    }
    const goalMap: Record<string, string> = {
      personal: "Personal Website / Landing Page",
      ecommerce: "Ecommerce / Online Store",
      "ai-tool": "AI Automation Tool",
    };
    return goalMap[order.website_goal] || order.website_goal;
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    inProgressOrders: orders.filter((o) => o.status === "in-progress").length,
    completedOrders: orders.filter((o) => o.status === "completed").length,
    totalReviews: reviews.length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-glass-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage orders & reviews</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchOrders();
                fetchReviews();
              }}
              disabled={isLoading || isLoadingReviews}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading || isLoadingReviews ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
                <p className="text-xs text-muted-foreground">Pending Orders</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalReviews}</p>
                <p className="text-xs text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completedOrders}</p>
                <p className="text-xs text-muted-foreground">Completed Orders</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Orders ({stats.totalOrders})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Reviews ({stats.totalReviews})
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground">No orders yet</h3>
                <p className="text-muted-foreground">Orders will appear here when submitted</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card rounded-xl p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Order Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {order.business_name}
                                </h3>
                                {getStatusBadge(order.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">{order.full_name}</span>
                              </div>
                              <a
                                href={`mailto:${order.email}`}
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                              >
                                {order.email}
                              </a>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">{order.whatsapp}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Building className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">Niche: {order.niche}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">Goal: {getGoalText(order)}</span>
                              </div>
                            </div>
                          </div>

                          {order.key_features && (
                            <div className="bg-secondary/30 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground mb-1">Key Features</p>
                              <p className="text-sm text-foreground">{order.key_features}</p>
                            </div>
                          )}

                          {order.special_requests && (
                            <div className="bg-secondary/30 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                              <p className="text-sm text-foreground">{order.special_requests}</p>
                            </div>
                          )}

                          {order.reference_style && (
                            <div className="bg-secondary/30 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground mb-1">Reference Style</p>
                              <p className="text-sm text-foreground">{order.reference_style}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="lg:w-64 space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Status</label>
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                              disabled={savingId === order.id}
                            >
                              <SelectTrigger className="bg-secondary/30 border-glass-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-glass-border z-50">
                                {statusOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs text-muted-foreground">Admin Notes</label>
                              {editingNotes === order.id ? (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2"
                                    onClick={() => saveNotes(order.id)}
                                    disabled={savingId === order.id}
                                  >
                                    <Save className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2"
                                    onClick={() => setEditingNotes(null)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2"
                                  onClick={() => {
                                    setEditingNotes(order.id);
                                    setNotesValue(order.admin_notes || "");
                                  }}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            {editingNotes === order.id ? (
                              <Textarea
                                value={notesValue}
                                onChange={(e) => setNotesValue(e.target.value)}
                                placeholder="Add private notes..."
                                className="bg-secondary/30 border-glass-border resize-none text-sm"
                                rows={3}
                              />
                            ) : (
                              <div className="bg-secondary/30 rounded-lg p-2 min-h-[60px]">
                                <p className="text-sm text-foreground">
                                  {order.admin_notes || (
                                    <span className="text-muted-foreground italic">No notes</span>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Order
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this order?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the order from {order.business_name}. 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteOrder(order.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            {isLoadingReviews ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground">No reviews yet</h3>
                <p className="text-muted-foreground">Client reviews will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card rounded-xl p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Review Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {review.client_name}
                                </h3>
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "fill-primary text-primary"
                                          : "text-muted-foreground/30"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-secondary/30 rounded-lg p-2 text-center">
                              <p className="text-xs text-muted-foreground">Experience</p>
                              <p className="text-sm font-medium text-foreground">{review.overall_experience}</p>
                            </div>
                            <div className="bg-secondary/30 rounded-lg p-2 text-center">
                              <p className="text-xs text-muted-foreground">Project</p>
                              <p className="text-sm font-medium text-foreground">{review.project_type}</p>
                            </div>
                            <div className="bg-secondary/30 rounded-lg p-2 text-center">
                              <p className="text-xs text-muted-foreground">Delivery</p>
                              <p className="text-sm font-medium text-foreground">{review.delivery}</p>
                            </div>
                            <div className="bg-secondary/30 rounded-lg p-2 text-center">
                              <p className="text-xs text-muted-foreground">Recommend</p>
                              <p className="text-sm font-medium text-foreground">{review.would_recommend}</p>
                            </div>
                          </div>

                          <div className="bg-secondary/30 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground mb-2">Generated Review</p>
                            <p className="text-sm text-foreground italic">"{review.generated_review}"</p>
                          </div>

                          {review.optional_comment && (
                            <div className="bg-secondary/30 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground mb-1">Client Comment</p>
                              <p className="text-sm text-foreground">{review.optional_comment}</p>
                            </div>
                          )}

                          {review.client_email && (
                            <a
                              href={`mailto:${review.client_email}`}
                              className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <Mail className="w-4 h-4" />
                              {review.client_email}
                            </a>
                          )}
                        </div>

                        {/* Delete Action */}
                        <div className="lg:w-36">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the review from {review.client_name}. 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteReview(review.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
