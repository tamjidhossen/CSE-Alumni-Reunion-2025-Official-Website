import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutDashboard } from "lucide-react"; // Add this import
import RegistrationsDashboard from "./RegistrationDashboard";
import AnnouncementsDashboard from "./AnnouncementDashboard";

export default function Dashboard() {
  // Initialize state with value from localStorage or default to "registrations"
  const [activeView, setActiveView] = useState(
    () => localStorage.getItem("dashboardView") || "registrations"
  );

  // Update localStorage when view changes
  useEffect(() => {
    localStorage.setItem("dashboardView", activeView);
  }, [activeView]);

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <Select value={activeView} onValueChange={setActiveView}>
              <SelectTrigger className="w-[160px] sm:w-[200px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registrations">Registrations</SelectItem>
                <SelectItem value="announcements">Announcements</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Admin Dashboard
              </h1>
              <LayoutDashboard className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {activeView === "registrations" ? (
        <RegistrationsDashboard />
      ) : (
        <AnnouncementsDashboard />
      )}
    </div>
  );
}
