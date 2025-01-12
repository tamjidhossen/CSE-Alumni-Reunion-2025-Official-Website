import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CardSection = ({ icon: Icon, title, content }) => (
  <Card className="backdrop-blur-sm bg-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
    <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
      <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-3 sm:mb-4" />
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground">{content}</p>
    </CardContent>
  </Card>
);

export default function Home() {
  const eventDetails = [
    {
      icon: CalendarDays,
      title: "Date & Time",
      content: "February 22, 2025\n10:00 AM - 8:00 PM",
    },
    {
      icon: MapPin,
      title: "Venue",
      content: "JKKNIU Campus\nTrishal, Mymensingh",
    },
    {
      icon: Users,
      title: "Expected Attendees",
      content: "300+ Alumni Members\nFaculty Members",
    },
  ];

  const highlights = [
    {
      title: "Networking Session",
      description:
        "Connect with fellow alumni and expand your professional network",
    },
    {
      title: "Award Ceremony",
      description: "Recognizing outstanding achievements of our alumni",
    },
    {
      title: "Cultural Program",
      description: "Enjoy performances by talented alumni members",
    },
    {
      title: "Gala Dinner",
      description: "End the day with a memorable dining experience",
    },
  ];
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Background gradient with improved contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

          {/* Dot pattern with better spacing on mobile */}
          <div
            className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              CSE Alumni Reunion 2025
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join us for an unforgettable gathering of JKKNIU CSE graduates.
            Reconnect with old friends, share memories, and create new ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              asChild
              size="lg"
              className="font-semibold w-auto sm:w-auto"
            >
              <Link to="/registration">
                Register Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-auto sm:w-auto"
            >
              <Link to="/announcements">View Updates</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Event Details Cards */}
      <section className="py-12 sm:py-16 sm:px-16 px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {eventDetails.map((detail, index) => (
              <CardSection
                key={index}
                icon={detail.icon}
                title={detail.title}
                content={detail.content}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-12 sm:px-16 px-8 sm:py-16 bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Program Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {highlights.map((highlight, index) => (
              <Card
                key={index}
                className="backdrop-blur-sm bg-card/50 border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-16 sm:py-20 px-10">
        <div className="absolute inset-0 dark:via-zinc-900/90 dark:to-background bg-gradient-to-br from-primary/10 via-primary/5 to-background backdrop-blur-sm -z-10" />
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.08] -z-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 dark:from-primary/90 dark:to-primary/60">
            Be Part of This Historic Gathering
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Don't miss this opportunity to reconnect with your alma mater and
            fellow alumni. Register now to secure your spot!
          </p>
          <Button
            asChild
            size="lg"
            className="font-semibold w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link to="/registration">
              Register Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

const highlights = [
  {
    title: "Opening Ceremony",
    description:
      "Grand inauguration with distinguished guests and alumni speakers",
  },
  {
    title: "Technical Symposium",
    description:
      "Engaging discussions on latest technology trends and innovations",
  },
  {
    title: "Cultural Program",
    description: "Entertainment showcasing alumni talents and performances",
  },
  {
    title: "Gala Dinner",
    description: "Networking dinner with memorable moments and celebrations",
  },
];
