import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/authConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Trash2, ExternalLink, PlusCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/toaster";

export default function AnnouncementsDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });
  const { toast } = useToast();

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/announcement/get-announcement`
      );
      const sortedAnnouncements = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAnnouncements(sortedAnnouncements);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch announcements",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/announcement/add`,
        formData
      );

      // Create a new announcement object with the correct structure
      const newAnnouncement = {
        ...response.data.announcement, // Use response.data.announcement instead of response.data
        createdAt: new Date().toISOString(), // Add the current timestamp
      };

      // Update state with the new announcement
      setAnnouncements([newAnnouncement, ...announcements]);
      setIsDialogOpen(false);
      setFormData({ title: "", description: "", link: "" });

      toast({
        title: "Success",
        description: "Announcement added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "Failed to add announcement",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/announcement/delete/${id}`);
      setAnnouncements(
        announcements.filter((announcement) => announcement._id !== id)
      );

      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete announcement",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">
            Announcements Management
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Announcement
            </Button>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Announcement</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Link (optional)"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                />
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <Card key={announcement._id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">
                    {announcement.title}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[90vw] sm:max-w-[425px] p-4 sm:p-6">
                        <AlertDialogHeader className="space-y-2 text-center">
                          <AlertDialogTitle className="text-xl">
                            Are you sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-sm">
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4">
                          <AlertDialogCancel className="w-full sm:w-auto">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(announcement._id)}
                            className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {formatDate(announcement.createdAt)}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">
                  {announcement.description}
                </p>
                {announcement.link && (
                  <a
                    href={announcement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-4 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View More
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {announcements.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground">No announcements found</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </>
  );
}
