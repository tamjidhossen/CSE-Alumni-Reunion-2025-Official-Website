import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/lib/authConfig";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";

const dummyAlumni = [
  {
    _id: { $oid: "678f3ed7bde558432094b571" },
    personalInfo: {
      name: "Md. Rakib Hasan",
      roll: 1801001,
      registrationNo: 18001,
      session: "2018-2019",
      passingYear: "2022",
    },
    contactInfo: {
      mobile: "01711234567",
      email: "rakib.hasan@gmail.com",
      currentAddress: "Banani, Dhaka",
    },
    professionalInfo: {
      currentDesignation: "Software Engineer",
      currentOrganization: "Brain Station 23",
      from: "2023-12-31T18:00:00.000Z",
      to: "Present",
    },
    prevProfessionalInfo: [
      {
        designation: "Junior Developer",
        organization: "TigerIT Bangladesh",
        from: "2021-12-31T18:00:00.000Z",
        to: "2022-10-31T18:00:00.000Z",
        _id: { $oid: "678f3ed7bde558432094b572" },
      },
    ],
    numberOfParticipantInfo: { adult: 2, child: 1, total: 3 },
    paymentInfo: {
      totalAmount: 500,
      mobileBankingName: "Bkash",
      status: 1,
      transactionId: "BKS123456789",
    },
    profilePictureInfo: {
      image: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
    },
    createdAt: { $date: "2025-01-21T06:29:43.473Z" },
    updatedAt: { $date: "2025-01-21T06:29:43.484Z" },
    __v: 0,
  },
  {
    _id: { $oid: "678f3ed7bde558432094b573" },
    personalInfo: {
      name: "Fatima Akter",
      roll: 1701015,
      registrationNo: 17015,
      session: "2017-2018",
      passingYear: "2021",
    },
    contactInfo: {
      mobile: "01819876543",
      email: "fatima.akter@outlook.com",
      currentAddress: "Uttara, Dhaka",
    },
    professionalInfo: {
      currentDesignation: "Product Manager",
      currentOrganization: "Pathao",
      from: "2021-12-31T18:00:00.000Z",
      to: "Present",
    },
    prevProfessionalInfo: [],
    numberOfParticipantInfo: { adult: 1, child: 0, total: 1 },
    paymentInfo: {
      totalAmount: 200,
      mobileBankingName: "Nagad",
      status: 0,
      transactionId: "NGD987654321",
    },
    profilePictureInfo: {
      image:
        "https://images.pexels.com/photos/4069063/pexels-photo-4069063.jpeg",
    },
    createdAt: { $date: "2025-01-21T06:30:43.473Z" },
    updatedAt: { $date: "2025-01-21T06:30:43.484Z" },
    __v: 0,
  },
  {
    _id: { $oid: "678f3ed7bde558432094b574" },
    personalInfo: {
      name: "Mohammad Ali",
      roll: 1601025,
      registrationNo: 16025,
      session: "2016-2017",
      passingYear: "2020",
    },
    contactInfo: {
      mobile: "01912345678",
      email: "mohammad.ali@gmail.com",
      currentAddress: "Gulshan, Dhaka",
    },
    professionalInfo: {
      currentDesignation: "Senior Software Engineer",
      currentOrganization: "Cefalo",
      from: "2022-01-01T18:00:00.000Z",
      to: "Present",
    },
    prevProfessionalInfo: [],
    numberOfParticipantInfo: { adult: 2, child: 2, total: 4 },
    paymentInfo: {
      totalAmount: 700,
      mobileBankingName: "Bkash",
      status: 2,
      transactionId: "BKS987612345",
    },
    profilePictureInfo: {
      image: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
    },
    createdAt: { $date: "2025-01-21T06:31:43.473Z" },
    updatedAt: { $date: "2025-01-21T06:31:43.484Z" },
    __v: 0,
  },
  {
    _id: { $oid: "678f3ed7bde558432094b575" },
    personalInfo: {
      name: "Nusrat Jahan",
      roll: 1901034,
      registrationNo: 19034,
      session: "2019-2020",
      passingYear: "2023",
    },
    contactInfo: {
      mobile: "01756789012",
      email: "nusrat.jahan@yahoo.com",
      currentAddress: "Mohammadpur, Dhaka",
    },
    professionalInfo: {
      currentDesignation: "Frontend Developer",
      currentOrganization: "Selise",
      from: "2023-06-01T18:00:00.000Z",
      to: "Present",
    },
    prevProfessionalInfo: [],
    numberOfParticipantInfo: { adult: 1, child: 0, total: 1 },
    paymentInfo: {
      totalAmount: 200,
      mobileBankingName: "Rocket",
      status: 1,
      transactionId: "RKT123789456",
    },
    profilePictureInfo: {
      image:
        "https://images.pexels.com/photos/4069063/pexels-photo-4069063.jpeg",
    },
    createdAt: { $date: "2025-01-21T06:32:43.473Z" },
    updatedAt: { $date: "2025-01-21T06:32:43.484Z" },
    __v: 0,
  },
  {
    _id: { $oid: "678f3ed7bde558432094b576" },
    personalInfo: {
      name: "Ashikur Rahman",
      roll: 1501012,
      registrationNo: 15012,
      session: "2015-2016",
      passingYear: "2019",
    },
    contactInfo: {
      mobile: "01634567890",
      email: "ashik.rahman@gmail.com",
      currentAddress: "Bashundhara, Dhaka",
    },
    professionalInfo: {
      currentDesignation: "Tech Lead",
      currentOrganization: "Datasoft",
      from: "2022-01-01T18:00:00.000Z",
      to: "Present",
    },
    prevProfessionalInfo: [],
    numberOfParticipantInfo: { adult: 3, child: 1, total: 4 },
    paymentInfo: {
      totalAmount: 700,
      mobileBankingName: "Bkash",
      status: 0,
      transactionId: "BKS567891234",
    },
    profilePictureInfo: {
      image: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
    },
    createdAt: { $date: "2025-01-21T06:33:43.473Z" },
    updatedAt: { $date: "2025-01-21T06:33:43.484Z" },
    __v: 0,
  },
];

const dummyStudents = [
  {
    _id: { $oid: "678f3ed7bde558432094b577" },
    personalInfo: {
      name: "Sakib Hassan",
      roll: 2201034,
      registrationNo: 22034,
      session: "2022-2023",
    },
    contactInfo: {
      mobile: "01672345678",
      email: "sakib.hassan@gmail.com",
      currentAddress: "Trishal, Mymensingh",
    },
    paymentInfo: {
      totalAmount: 150,
      mobileBankingName: "Rocket",
      status: 1,
      transactionId: "RKT456789123",
    },
    profilePictureInfo: {
      image: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
    },
    createdAt: { $date: "2025-01-21T06:34:43.473Z" },
    updatedAt: { $date: "2025-01-21T06:34:43.484Z" },
    __v: 0,
  },
  {
    _id: { $oid: "678f3ed7bde558432094b578" },
    personalInfo: {
      name: "Tasnim Rahman",
      roll: 2201056,
      registrationNo: 22056,
      session: "2022-2023",
    },
    contactInfo: {
      mobile: "01723456789",
      email: "tasnim.r@gmail.com",
      currentAddress: "Trishal, Mymensingh",
    },
    paymentInfo: {
      totalAmount: 150,
      mobileBankingName: "Bkash",
      status: 2,
      transactionId: "BKS567891234",
    },
    profilePictureInfo: {
      image:
        "https://images.pexels.com/photos/4069063/pexels-photo-4069063.jpeg",
    },
    createdAt: { $date: "2025-01-21T06:35:43.473Z" },
    updatedAt: { $date: "2025-01-21T06:35:43.484Z" },
    __v: 0,
  },
  {
    _id: { $oid: "678f3ed7bde558432094b579" },
    personalInfo: {
      name: "Rahat Khan",
      roll: 2101023,
      registrationNo: 21023,
      session: "2021-2022",
    },
    contactInfo: {
      mobile: "01834567890",
      email: "rahat.khan@gmail.com",
      currentAddress: "Fulbaria, Mymensingh",
    },
    paymentInfo: {
      totalAmount: 150,
      mobileBankingName: "Nagad",
      status: 0,
      transactionId: "NGD345678912",
    },
    profilePictureInfo: {
      image: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
    },
    createdAt: { $date: "2025-01-21T06:36:43.473Z" },
    updatedAt: { $date: "2025-01-21T06:36:43.484Z" },
    __v: 0,
  },
  {
    _id: { $oid: "678f3ed7bde558432094b580" },
    personalInfo: {
      name: "Sabina Yasmin",
      roll: 2201078,
      registrationNo: 22078,
      session: "2022-2023",
    },
    contactInfo: {
      mobile: "01945678901",
      email: "sabina.y@gmail.com",
      currentAddress: "Bhaluka, Mymensingh",
    },
    paymentInfo: {
      totalAmount: 150,
      mobileBankingName: "Bkash",
      status: 1,
      transactionId: "BKS789123456",
    },
    profilePictureInfo: {
      image:
        "https://images.pexels.com/photos/4069063/pexels-photo-4069063.jpeg",
    },
    createdAt: { $date: "2025-01-21T06:37:43.473Z" },
    updatedAt: { $date: "2025-01-21T06:37:43.484Z" },
    __v: 0,
  },
  {
    _id: { $oid: "678f3ed7bde558432094b581" },
    personalInfo: {
      name: "Minhaz Uddin",
      roll: 2201089,
      registrationNo: 22089,
      session: "2022-2023",
    },
    contactInfo: {
      mobile: "01856789012",
      email: "minhaz.u@gmail.com",
      currentAddress: "Gafargaon, Mymensingh",
    },
    paymentInfo: {
      totalAmount: 150,
      mobileBankingName: "Nagad",
      status: 0,
      transactionId: "NGD891234567",
    },
    profilePictureInfo: {
      image: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
    },
    createdAt: { $date: "2025-01-21T06:38:43.473Z" },
    updatedAt: { $date: "2025-01-21T06:38:43.484Z" },
    __v: 0,
  },
];

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

const Dashboard = () => {
  const handleDelete = async (id, type) => {
    try {
      const endpoint =
        type === "alumni"
          ? `${API_URL}/api/alumni/delete/${id}`
          : `${API_URL}/api/student/delete/${id}`;

      await axios.delete(endpoint);
      window.location.reload();
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
          handleDelete(
            reg._id.$oid,
            reg.professionalInfo ? "alumni" : "student"
          )
        )
      );

      window.location.reload();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete all rejected registrations",
      });
    }
  };

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

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch dashboard stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          const allRegistrations = [...dummyAlumni, ...dummyStudents];

          // Separate approved and pending
          const approvedAlumni = dummyAlumni.filter(
            (a) => a.paymentInfo.status === 1
          );
          const pendingAlumni = dummyAlumni.filter(
            (a) => a.paymentInfo.status === 0
          );
          const approvedStudents = dummyStudents.filter(
            (s) => s.paymentInfo.status === 1
          );
          const pendingStudents = dummyStudents.filter(
            (s) => s.paymentInfo.status === 0
          );

          // Calculate children counts
          const approvedChildren = approvedAlumni.reduce(
            (acc, a) => acc + (a.numberOfParticipantInfo?.child || 0),
            0
          );
          const pendingChildren = pendingAlumni.reduce(
            (acc, a) => acc + (a.numberOfParticipantInfo?.child || 0),
            0
          );

          // Calculate total approved participants (including children)
          const totalApproved =
            approvedAlumni.length + approvedStudents.length + approvedChildren;
          const totalPending =
            pendingAlumni.length + pendingStudents.length + pendingChildren;

          // Calculate success rate
          const successRate = Math.round(
            (totalApproved / (totalApproved + totalPending)) * 100
          );

          setStats({
            approvedAlumni: approvedAlumni.length,
            pendingAlumni: pendingAlumni.length,
            approvedStudents: approvedStudents.length,
            pendingStudents: pendingStudents.length,
            approvedChildren: approvedChildren,
            pendingChildren: pendingChildren,
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
          setLoading(false);
        }, 1000);
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch dashboard data",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleStatusUpdate = async (id, type, status) => {
    try {
      const endpoint =
        type === "alumni"
          ? `${API_URL}/api/alumni/paymentUpdate/${id}/${status}`
          : `${API_URL}/api/student/paymentUpdate/${id}/${status}`;

      await axios.put(endpoint);

      // Refresh data
      window.location.reload();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
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
    <div className="container mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
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
            registrations={registrations.filter(
              (reg) => reg.paymentInfo.status === 0
            )}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
            tabType="pending"
          />
        </TabsContent>

        <TabsContent value="approved">
          <RegistrationTable
            registrations={registrations.filter(
              (reg) => reg.paymentInfo.status === 1
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
            registrations={registrations.filter(
              (reg) => reg.paymentInfo.status === 2
            )}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
            tabType="rejected"
          />
        </TabsContent>
      </Tabs>
    </div>
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
    (a, b) => new Date(b.createdAt.$date) - new Date(a.createdAt.$date)
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
                handleButtonClick(e, () =>
                  onStatusUpdate(reg._id.$oid, type, 1)
                )
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
                handleButtonClick(e, () =>
                  onStatusUpdate(reg._id.$oid, type, 2)
                )
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
              handleButtonClick(e, () => onStatusUpdate(reg._id.$oid, type, 2))
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
                handleButtonClick(e, () =>
                  onStatusUpdate(reg._id.$oid, type, 1)
                )
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
                      handleButtonClick(e, () => onDelete(reg._id.$oid, type))
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
            <Accordion type="single" collapsible key={reg._id.$oid}>
              <AccordionItem value={reg._id.$oid} className="border-0">
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
                      {formatDate(reg.createdAt.$date)}
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
                                  src={reg.profilePictureInfo.image}
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
                            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Transaction ID
                              </span>
                              <span className="text-sm font-mono">
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
    </div>
  );
};

export default Dashboard;
