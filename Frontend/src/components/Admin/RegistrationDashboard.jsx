import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/lib/authConfig";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  UserCheck,
  X,
  Phone,
  Mail,
  MapPin,
  Building,
  Briefcase,
  Calendar,
  CreditCard,
  Users2,
  CheckCircle2,
  Wallet,
  GraduationCap,
  School,
  Loader2,
  Baby,
  Trash2,
  Users as UsersGroup,
  Search,
} from "lucide-react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const RegistrationDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    type: "all", // all, student, alumni
    session: "all",
  });

  const [stats, setStats] = useState({
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    totalMoney: 0,
    pendingMoney: 0,
    alumniCount: 0,
    studentCount: 0,
    childrenCount: 0,
  });

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [alumniResponse, studentResponse] = await Promise.all([
        axios.get(`${API_URL}/api/alumni`),
        axios.get(`${API_URL}/api/student`),
      ]);

      const allRegistrations = [
        ...(alumniResponse.data.data || []),
        ...(studentResponse.data.data || []),
      ];

      // Calculate stats
      const approvedAlumni = alumniResponse.data.data.filter(
        (a) => a.paymentInfo.status === 1
      );
      const pendingAlumni = alumniResponse.data.data.filter(
        (a) => a.paymentInfo.status === 0
      );
      const approvedStudents = studentResponse.data.data.filter(
        (s) => s.paymentInfo.status === 1
      );
      const pendingStudents = studentResponse.data.data.filter(
        (s) => s.paymentInfo.status === 0
      );

      const approvedChildren = approvedAlumni.reduce(
        (acc, a) => acc + (a.numberOfParticipantInfo?.child || 0),
        0
      );
      const pendingChildren = pendingAlumni.reduce(
        (acc, a) => acc + (a.numberOfParticipantInfo?.child || 0),
        0
      );

      const totalApproved =
        approvedAlumni.length + approvedStudents.length + approvedChildren;
      const totalPending =
        pendingAlumni.length + pendingStudents.length + pendingChildren;
      const successRate = Math.round(
        (totalApproved / (totalApproved + totalPending)) * 100
      );

      setStats({
        approvedAlumni: approvedAlumni.length,
        pendingAlumni: pendingAlumni.length,
        approvedStudents: approvedStudents.length,
        pendingStudents: pendingStudents.length,
        approvedChildren,
        pendingChildren,
        totalApproved,
        totalPending,
        totalMoney: approvedAlumni
          .concat(approvedStudents)
          .reduce((acc, reg) => acc + reg.paymentInfo.totalAmount, 0),
        pendingMoney: pendingAlumni
          .concat(pendingStudents)
          .reduce((acc, reg) => acc + reg.paymentInfo.totalAmount, 0),
        successRate,
      });

      setRegistrations(allRegistrations);
    } catch (error) {
      // Check for unauthorized status (session expired)
      if (error.response?.status === 401) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again to continue",
        });
        // Clear auth token and redirect to login
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch dashboard data",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUniqueSessions = (registrations) => {
    const sessions = new Set(
      registrations.map((reg) => reg.personalInfo.session)
    );
    return Array.from(sessions).sort().reverse();
  };

  const filterRegistrations = (registrations) => {
    return registrations.filter((reg) => {
      // Search by transaction ID
      if (
        searchQuery &&
        !reg.paymentInfo.transactionId
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Filter by type
      if (filters.type !== "all") {
        const isAlumni = !!reg.professionalInfo;
        if (filters.type === "student" && isAlumni) return false;
        if (filters.type === "alumni" && !isAlumni) return false;
      }

      // Filter by session
      if (
        filters.session !== "all" &&
        reg.personalInfo.session !== filters.session
      ) {
        return false;
      }

      return true;
    });
  };

  const handleStatusUpdate = async (id, type, status) => {
    try {
      const endpoint = `${API_URL}/api/${type}/paymentUpdate/${id}/${status}`;
      await axios.put(endpoint);
      await fetchData(); // Refetch data after update

      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const endpoint = `${API_URL}/api/${type}/delete/${id}`;
      await axios.delete(endpoint);
      await fetchData(); // Refetch data after delete

      toast({
        title: "Success",
        description: "Registration deleted successfully",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete registration",
      });
    }
  };

  const handleDeleteAllRejected = async () => {
    try {
      const rejectedRegistrations = registrations.filter(
        (reg) => reg.paymentInfo.status === 2
      );

      await Promise.all(
        rejectedRegistrations.map((reg) =>
          handleDelete(reg._id, reg.professionalInfo ? "alumni" : "student")
        )
      );

      await fetchData(); // Refetch data after bulk delete
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete all rejected registrations",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-8 py-8">
        <div className="flex flex-col justify-between items-center mb-8 lg:flex-row">
          <h1 className="text-xl font-bold">Registration Management</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Alumni Registered"
            value={stats.approvedAlumni}
            pending={stats.pendingAlumni}
            icon={GraduationCap}
            className="bg-purple-500/10"
          />
          <StatsCard
            title="Students Registered"
            value={stats.approvedStudents}
            pending={stats.pendingStudents}
            icon={School}
            className="bg-indigo-500/10"
          />
          <StatsCard
            title="Children Coming"
            value={stats.approvedChildren}
            pending={stats.pendingChildren}
            icon={Baby}
            className="bg-pink-500/10"
          />
          <StatsCard
            title="Total Participants"
            value={stats.totalApproved}
            pending={stats.totalPending}
            icon={UsersGroup}
            className="bg-green-500/10"
          />
          <StatsCard
            title="Money Collected"
            value={`৳${stats.totalMoney}`}
            pending={`৳${stats.pendingMoney}`}
            icon={Wallet}
            className="col-span-2 bg-blue-500/10"
          />
          <StatsCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={UserCheck}
            className="col-span-2 bg-emerald-500/10"
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="student">Students Only</SelectItem>
                <SelectItem value="alumni">Alumni Only</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.session}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, session: value }))
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {getUniqueSessions(registrations).map((session) => (
                  <SelectItem key={session} value={session}>
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Registration Tabs */}
        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="w-full flex justify-between items-center">
            <div className="flex">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="pending">
            <RegistrationTable
              registrations={filterRegistrations(
                registrations.filter((reg) => reg.paymentInfo.status === 0)
              )}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
              tabType="pending"
            />
          </TabsContent>

          <TabsContent value="approved">
            <RegistrationTable
              registrations={filterRegistrations(
                registrations.filter((reg) => reg.paymentInfo.status === 1)
              )}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
              tabType="approved"
            />
          </TabsContent>

          <TabsContent value="rejected">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rejected Registrations</h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete All Rejected Records?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      all rejected registrations.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllRejected}>
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <RegistrationTable
              registrations={filterRegistrations(
                registrations.filter((reg) => reg.paymentInfo.status === 2)
              )}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
              tabType="rejected"
            />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </>
  );
};

const StatsCard = ({ title, value, pending, icon: Icon, className }) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {pending !== undefined && (
          <div className="text-sm text-muted-foreground">
            (+{pending} pending)
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const RegistrationTable = ({
  registrations,
  onStatusUpdate,
  onDelete,
  tabType,
}) => {
  // Sort registrations by date descending
  const sortedRegistrations = [...registrations].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const renderActions = (reg) => {
    const type = reg.professionalInfo ? "alumni" : "student";

    // Handler to prevent event propagation
    const handleButtonClick = (e, action) => {
      e.preventDefault();
      e.stopPropagation();
      action();
    };

    switch (tabType) {
      case "pending":
        return (
          <div className="flex flex-col lg:flex-row items-end sm:items-center gap-2">
            <Button
              size="sm"
              onClick={(e) =>
                handleButtonClick(e, () => onStatusUpdate(reg._id, type, 1))
              }
              className="bg-green-500 hover:bg-green-600 w-auto sm:w-auto"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              <span className="whitespace-nowrap hidden md:inline">
                Approve
              </span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) =>
                handleButtonClick(e, () => onStatusUpdate(reg._id, type, 2))
              }
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-1" />
              <span className="whitespace-nowrap hidden md:inline">Reject</span>
            </Button>
          </div>
        );

      case "approved":
        return (
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) =>
              handleButtonClick(e, () => onStatusUpdate(reg._id, type, 2))
            }
            className="w-auto sm:w-auto whitespace-nowrap"
          >
            <X className="h-4 w-4 mr-1" />
            <span className="whitespace-nowrap hidden md:inline">Reject</span>
          </Button>
        );

      case "rejected":
        return (
          <div className="flex flex-col lg:flex-row items-end sm:items-center gap-2">
            <Button
              size="sm"
              onClick={(e) =>
                handleButtonClick(e, () => onStatusUpdate(reg._id, type, 1))
              }
              className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              <span className="whitespace-nowrap hidden md:inline">
                Approve
              </span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="whitespace-nowrap hidden md:inline">
                    Delete
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Registration?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the registration.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) =>
                      handleButtonClick(e, () => onDelete(reg._id, type))
                    }
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background">
      {/* Table Container */}
      <div className="min-w-full">
        {/* Table Header */}
        <div className="hidden sticky top-0 z-10 md:grid grid-cols-6 gap-4 px-6 py-4 border-b bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/50">
          <div className="text-sm font-semibold">Name</div>
          <div className="text-sm font-semibold">Type</div>
          <div className="text-sm font-semibold">Transaction ID</div>
          <div className="text-sm font-semibold">Amount</div>
          <div className="text-sm font-semibold">Registered On</div>
          <div className="text-sm font-semibold text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {sortedRegistrations.map((reg) => (
            <Accordion type="single" collapsible key={reg._id}>
              <AccordionItem value={reg._id} className="border-0">
                {/* Accordion Header/Trigger */}
                <AccordionTrigger className="hover:no-underline w-full transition-colors hover:bg-muted/50 [&>svg]:hidden">
                  <div className="flex flex-col lg:grid lg:grid-cols-6 lg:gap-4 w-full px-6 py-4">
                    <div className="font-medium truncate">
                      {reg.personalInfo.name}
                    </div>

                    <div className="items-center">
                      {reg.professionalInfo ? (
                        <Badge variant="secondary" className="font-normal">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          <span className="hidden lg:inline">Alumni</span>
                        </Badge>
                      ) : (
                        <Badge className="font-normal">
                          <School className="h-4 w-4 mr-1" />
                          <span className="hidden lg:inline">Student</span>
                        </Badge>
                      )}
                    </div>

                    <div className="lg:hidden py-2 text-sm font-extrabold">
                      ৳{reg.paymentInfo.totalAmount}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {reg.paymentInfo.transactionId}
                    </div>

                    <div className="hidden lg:block text-sm font-medium">
                      ৳{reg.paymentInfo.totalAmount}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {formatDate(reg.createdAt)}
                    </div>
                    <div className="hidden lg:flex justify-end col-span-2 sm:col-span-1">
                      {renderActions(reg)}
                    </div>
                  </div>
                  <div className="lg:hidden px-6 py-4">
                    {renderActions(reg)}
                  </div>
                </AccordionTrigger>

                {/* Accordion Content */}
                <AccordionContent>
                  <div className="px-6 py-4 bg-muted/30">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Profile & Contact Section */}
                      <div className="lg:col-span-4 space-y-4">
                        {/* Profile Card */}
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex flex-col items-center text-center">
                              <Avatar className="h-24 w-24 border-2 mb-4">
                                <AvatarImage
                                  src={`${API_URL}/uploads/images/${reg.profilePictureInfo.image
                                    .split("/")
                                    .pop()}`}
                                />
                                <AvatarFallback className="text-xl">
                                  {reg.personalInfo.name
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div className="space-y-4">
                                <CardTitle className="text-xl">
                                  {reg.personalInfo.name}
                                </CardTitle>

                                <div className="grid gap-3">
                                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{reg.personalInfo.session}</span>
                                  </div>
                                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <CreditCard className="h-4 w-4" />
                                    <span>Roll: {reg.personalInfo.roll}</span>
                                  </div>
                                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Users2 className="h-4 w-4" />
                                    <span>
                                      Reg: {reg.personalInfo.registrationNo}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>

                        {/* Contact Info Card */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium tracking-wide uppercase">
                              Contact Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {reg.contactInfo.mobile}
                              </span>
                            </div>
                            <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm break-all">
                                {reg.contactInfo.email}
                              </span>
                            </div>
                            <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {reg.contactInfo.currentAddress}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Professional Info Section */}
                      <div className="lg:col-span-5">
                        {reg.professionalInfo && (
                          <Card className="h-full">
                            <CardHeader>
                              <CardTitle className="text-sm font-medium tracking-wide uppercase">
                                Professional Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div className="p-4 bg-muted rounded-lg space-y-3">
                                <h4 className="font-medium text-sm">
                                  Current Position
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    {reg.professionalInfo.currentDesignation}
                                  </div>
                                  <div className="flex items-center text-sm gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    {reg.professionalInfo.currentOrganization}
                                  </div>
                                </div>
                              </div>

                              {reg.prevProfessionalInfo?.length > 0 && (
                                <div className="p-4 bg-muted rounded-lg space-y-3">
                                  <h4 className="font-medium text-sm">
                                    Previous Experience
                                  </h4>
                                  {reg.prevProfessionalInfo.map((prev, idx) => (
                                    <div key={idx} className="space-y-2">
                                      <div className="flex items-center text-sm gap-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        {prev.designation}
                                      </div>
                                      <div className="flex items-center text-sm gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        {prev.organization}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Participants & Payment Section */}
                      <div className="lg:col-span-3 space-y-4">
                        {/* Participants Card */}
                        {reg.numberOfParticipantInfo && (
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium tracking-wide uppercase">
                                Participants
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">
                                    Adults
                                  </span>
                                  <span className="font-semibold">
                                    {reg.numberOfParticipantInfo.adult}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">
                                    Children
                                  </span>
                                  <span className="font-semibold">
                                    {reg.numberOfParticipantInfo.child}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between border-t pt-2 mt-2">
                                  <span className="text-sm font-medium">
                                    Total
                                  </span>
                                  <span className="font-semibold">
                                    {reg.numberOfParticipantInfo.total}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Payment Details Card */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium tracking-wide uppercase">
                              Payment Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Method
                              </span>
                              <Badge variant="outline">
                                {reg.paymentInfo.mobileBankingName}
                              </Badge>
                            </div>
                            <div className="p-2 sm:p-3 bg-muted rounded-lg grid grid-cols-[auto,1fr] gap-4">
                              <span className="text-sm text-muted-foreground whitespace-nowrap">
                                Transaction ID
                              </span>
                              <span className="text-sm font-mono text-right break-all overflow-hidden">
                                {reg.paymentInfo.transactionId}
                              </span>
                            </div>
                            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Amount
                              </span>
                              <span className="text-sm font-semibold">
                                ৳{reg.paymentInfo.totalAmount}
                              </span>
                            </div>
                            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Status
                              </span>
                              <Badge
                                variant={
                                  reg.paymentInfo.status === 0
                                    ? "default"
                                    : reg.paymentInfo.status === 1
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                {reg.paymentInfo.status === 0
                                  ? "Pending"
                                  : reg.paymentInfo.status === 1
                                  ? "Approved"
                                  : "Rejected"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
      {registrations.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">No announcements found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RegistrationDashboard;
