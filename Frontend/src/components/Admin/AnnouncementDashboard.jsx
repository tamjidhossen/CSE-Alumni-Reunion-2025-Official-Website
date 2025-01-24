import { useState, useEffect } from "react";
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
import {
  CalendarDays,
  Pencil,
  Trash2,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
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

// Dummy data
const dummyAnnouncements = [
  {
    _id: "1",
    title: "Early Bird Registration Now Open!",
    description:
      "Register before May 1st to get 20% off on registration fees. Limited slots available.",
    link: "https://example.com/register",
    createdAt: "2024-03-20T09:00:00Z",
  },
  {
    _id: "2",
    title: "Venue Confirmed",
    description:
      "We are pleased to announce that the reunion will be held at International Convention Center.",
    createdAt: "2024-03-15T14:30:00Z",
  },
  {
    _id: "3",
    title: "Call for Memories",
    description:
      "Share your favorite memories and photos for our reunion yearbook.",
    link: "https://example.com/memories",
    createdAt: "2024-03-10T11:00:00Z",
  },
];

export default function AnnouncementsDashboard() {
  const [announcements, setAnnouncements] = useState(
    dummyAnnouncements.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnnouncement = {
      _id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setIsDialogOpen(false);
    setFormData({ title: "", description: "", link: "" });
    toast({
      title: "Success",
      description: "Announcement added successfully",
    });
  };

  const handleDelete = (id) => {
    setAnnouncements(
      announcements.filter((announcement) => announcement._id !== id)
    );
    toast({
      title: "Success",
      description: "Announcement deleted successfully",
    });
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">
          Announcements Management
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-primary">
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
  );
}
