import { Mail, Globe } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaFacebookF } from "react-icons/fa6"; // Add this import

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DeveloperInfo() {
  const developers = [
    {
      name: "Md. Tamjid Hossen",
      // title: "Full Stack Developer",
      image: "/tamjidhossenProfile.png",
      bio: "Final year student at CSE, JKKNIU. Passionate about building scalable web applications and solving complex problems.",
      links: {
        github: "https://github.com/tamjidhossen",
        linkedin: "https://www.linkedin.com/in/tamjidhossen/",
        email: "tamjidhossen0x@gmail.com",
        facebook: "https://www.facebook.com/tamjidhossen0x/",
        portfolio: "https://github.com/tamjidhossen",
      },
    },
    {
      name: "Nabeel Ahsan ",
      // title: "Full Stack Developer",
      image: "/nabeelahsanProfile.jpg",
      bio: "Final year student at CSE, JKKNIU. Passionate about building scalable web applications and solving complex problems.",
      links: {
        github: "https://github.com/Nabeel-Ahsan7",
        linkedin: "https://www.linkedin.com/in/nabeel-ahsan-229475252",
        email: "nabeelahsanofficial@gmail.com",
        facebook: "https://www.facebook.com/NA11.n",
        portfolio: "https://github.com/Nabeel-Ahsan7",
      },
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Meet the{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Developers
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The creative minds behind the CSE Alumni Reunion 2025 platform
          </p>
        </div>

        {/* Developer Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {developers.map((dev, index) => (
            <Card
              key={index}
              className="backdrop-blur-sm bg-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-12"
            >
              <CardHeader className="text-center pb-0">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-2xl font-bold">{dev.name}</CardTitle>
                {/* <CardDescription className="text-primary font-medium">
                  {dev.title}
                </CardDescription> */}
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <p className="text-muted-foreground text-center">{dev.bio}</p>

                {/* Social Links */}
                <div className="flex justify-center gap-4 pt-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="hover:text-primary"
                  >
                    <a
                      href={dev.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="hover:text-primary"
                  >
                    <a
                      href={dev.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedinIn className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="hover:text-primary"
                  >
                    <a href={`mailto:${dev.links.email}`}>
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="hover:text-primary"
                  >
                    <a
                      href={dev.links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebookF className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    className="hover:text-primary"
                  >
                    <a
                      href={dev.links.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
