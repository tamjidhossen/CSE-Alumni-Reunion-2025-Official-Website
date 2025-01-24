import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ExternalLink } from "lucide-react";
import { API_URL } from "@/lib/authConfig";

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

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};
const Announcements = () => {
  // const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //for dummy data testing
  const [announcements, setAnnouncements] = useState(
    dummyAnnouncements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  );

  // useEffect(() => {
  //   const fetchAnnouncements = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/api/announcement/get-announcement`);
  //       const data = response.data || [];
  //       const sortedAnnouncements = data.sort(
  //         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //       );
  //       setAnnouncements(sortedAnnouncements);
  //     } catch {
  //       setError("Failed to fetch announcements");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAnnouncements();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p className="text-muted-foreground">Loading announcements...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p className="text-red-500">{error}</p>
  //     </div>
  //   );
  // }

  return (
    <div className="relative min-h-screen p-3 sm:mb-12">
      {/* Layered Background */}
      <div className="fixed inset-0 -z-10">
        {/* Dot Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

      </div>
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Announcements</h1>
          <p className="mt-4 text-muted-foreground">
            Stay updated with the latest news and updates about the reunion
          </p>
        </div>

        {/* Cards Grid */}
        <div className="space-y-6">
          {announcements.length === 0 ? (
            <Card className="text-center p-6">
              <CardContent>
                <p className="text-muted-foreground">No announcements available</p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card
                key={announcement._id}
                className="group relative overflow-hidden border-0 backdrop-blur-sm transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
              >
                <CardHeader className="relative space-y-4">
                  {/* Date Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    <CalendarDays className="h-4 w-4" />
                    <time>{formatDate(announcement.createdAt)}</time>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                      {announcement.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {announcement.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                {announcement.link && (
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="group-hover:border-primary group-hover:text-primary transition-all duration-300"
                    >
                      <a
                        href={announcement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        Learn More
                        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
