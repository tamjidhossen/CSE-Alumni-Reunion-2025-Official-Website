import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutDashboard, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import RegistrationsDashboard from "./RegistrationDashboard";
import AnnouncementsDashboard from "./AnnouncementDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  // Initialize state with value from localStorage or default to "registrations"
  const [activeView, setActiveView] = useState(
    () => localStorage.getItem("dashboardView") || "registrations"
  );

  // Add state for admin name
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    localStorage.setItem("dashboardView", activeView);
    // Get admin data from localStorage
    const admin = JSON.parse(localStorage.getItem("adminData"));
    if (admin?.name) {
      setAdminName(admin.name);
    }
  }, [activeView]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("dashboardView");
    navigate("/admin/login");
  };

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
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{adminName}</span>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Admin Dashboard
              </h1>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
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
