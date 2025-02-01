import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrationApi } from "@/api/registration";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useForm, useFieldArray } from "react-hook-form";
import NumberInput from "./NumberInput";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  School,
  CheckCircle2,
  ChevronDown,
  Building2,
  CreditCard,
  Banknote,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Upload, ChevronsUpDown, Plus, X, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ADULT_FEE,
  CHILD_FEE,
  STUDENT_FEE,
  MAX_FILE_SIZE,
} from "@/lib/authConfig";

const formSchema = (isCurrentStudent) =>
  z.object({
    personalInfo: z.object({
      name: z.string().min(1, "Name is required"),
      roll: z.coerce.number().min(1, "Roll is required"),
      registrationNo: z.coerce
        .number()
        .min(1, "Registration number is required"),
      session: z.string().min(1, "Session is required"),
      passingYear: isCurrentStudent
        ? z.string().optional()
        : z.string().min(1, "Year of Certificate Awarded is required"),
    }),
    contactInfo: z.object({
      mobile: z.string().min(1, "Mobile number is required"),
      email: z.string().email("Invalid email address"),
      currentAddress: z.string().optional(),
    }),
    professionalInfo: isCurrentStudent
      ? z.object({}).optional()
      : z.object({
          currentDesignation: z.string().optional(),
          currentOrganization: z.string().optional(),
          from: z.date().optional(),
          to: z.string().optional(),
        }),
    prevProfessionalInfo: isCurrentStudent
      ? z.array(z.object({})).optional()
      : z
          .array(
            z.object({
              designation: z.string().optional(),
              organization: z.string().optional(),
              from: z.date().optional(),
              to: z.date().optional(),
            })
          )
          .optional(),
    numberOfParticipantInfo: isCurrentStudent
      ? z.object({
          adult: z.literal(1),
          child: z.literal(0),
          total: z.literal(1),
        })
      : z.object({
          adult: z.coerce.number().min(1, "At least one adult required"),
          child: z.coerce.number().min(0).optional(),
          total: z.coerce.number().optional(),
        }),
    paymentInfo: isCurrentStudent
      ? z.object({
          totalAmount: z.coerce.number(),
          mobileBankingName: z.string().optional(),
          status: z.coerce.number().default(1),
          transactionId: z.string().optional(),
        })
      : z.object({
          totalAmount: z.coerce.number(),
          mobileBankingName: z.string().min(1, "Payment method is required"),
          status: z.coerce.number().default(1),
          transactionId: z.string().min(1, "Transaction ID is required"),
        }),
    profilePictureInfo: z.object({
      image: z.instanceof(File, { message: "Profile picture is required" }),
    }),
  });

const RegistrationGuidelines = () => (
  <Card className="mb-8">
    <CardHeader className="text-center">
      <CardTitle>Registration Guidelines</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-semibold">Before You Begin:</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Keep a formal passport size photograph ready (max 2MB)</li>
          <li>All fields marked with * are mandatory</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Payment Instructions:</h3>
        <div className="space-y-4">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-3 bg-muted/50">
              <p className="font-medium">For Alumni:</p>
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pt-2">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  Check total payment amount in the form&apos;s payment section
                </li>
                <li className="!list-none">
                  <Card className="border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Bank Account Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 text-sm">
                        <div className="grid grid-cols-[100px,1fr] items-center">
                          <span className="font-medium">Bank:</span>
                          <span>Sonali Bank PLC</span>
                        </div>
                        <div className="grid grid-cols-[100px,1fr] items-center">
                          <span className="font-medium">Branch:</span>
                          <span>JKKNIU Branch, Mymensingh</span>
                        </div>
                        <div className="grid grid-cols-[100px,1fr] items-center">
                          <span className="font-medium">Account:</span>
                          <span>CSE Alumni, JKKNIU</span>
                        </div>
                        <div className="grid grid-cols-[100px,1fr] items-center">
                          <span className="font-medium">A/C No:</span>
                          <span className="font-mono">3328202000127</span>
                        </div>
                        <div className="grid grid-cols-[100px,1fr] items-center">
                          <span className="font-medium">Routing No:</span>
                          <span className="font-mono">200610140</span>
                        </div>
                        <div className="grid grid-cols-[100px,1fr] items-center">
                          <span className="font-medium">Branch Code:</span>
                          <span className="font-mono">014</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
                <li>
                  Payment Methods:
                  <ul className="mt-2 space-y-2 pl-4">
                    <li className="flex gap-2 items-start">
                      <CreditCard className="h-4 w-4 mt-1 shrink-0" />
                      <span>
                        Bank Transfer: Provide your bank account number in the
                        form
                      </span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <Banknote className="h-4 w-4 mt-1 shrink-0" />
                      <span>
                        Cash Deposit: Use your phone number as deposit reference
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-3 bg-muted/50">
              <p className="font-medium">For Current Students:</p>
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pt-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Submit registration fee (cash) to your Class Representative
                </li>
                <li>Complete registration form before payment</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div className="rounded-lg border border-red-200 p-3">
        <p className="text-sm text-red-800 dark:text-red-200">
          Note: Your registration will be confirmed via email after verification
          of your payment and details. Please ensure all information provided is
          accurate.
        </p>
      </div>
    </CardContent>
  </Card>
);

const RegistrationSuccess = ({ onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <Card className="max-w-lg w-full mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Submission Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm md:text-base">
          <div className="space-y-3">
            <p className="text-muted-foreground">Thank you!</p>
            <p className="text-muted-foreground">
              We have sent a confirmation email with your registration details.
              You will receive another email once your registration is reviewed
              and confirmed by our team.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const TODAY = new Date();

export default function Registration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCurrentStudent, setIsCurrentStudent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Add loading state for transaction id checking
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessions = [
    {
      label: "2024-2025",
      value: "2024-2025",
    },
    {
      label: "2023-2024",
      value: "2023-2024",
    },
    {
      label: "2022-2023",
      value: "2022-2023",
    },
    {
      label: "2021-2022",
      value: "2021-2022",
    },
    {
      label: "2020-2021",
      value: "2020-2021",
    },
    {
      label: "2019-2020",
      value: "2019-2020",
    },
    {
      label: "2018-2019",
      value: "2018-2019",
    },
    {
      label: "2017-2018",
      value: "2017-2018",
    },
    {
      label: "2016-2017",
      value: "2016-2017",
    },
    {
      label: "2015-2016",
      value: "2015-2016",
    },
    {
      label: "2014-2015",
      value: "2014-2015",
    },
    {
      label: "2013-2014",
      value: "2013-2014",
    },
    {
      label: "2012-2013",
      value: "2012-2013",
    },
    {
      label: "2011-2012",
      value: "2011-2012",
    },
    {
      label: "2010-2011",
      value: "2010-2011",
    },
    {
      label: "2009-2010",
      value: "2009-2010",
    },
    {
      label: "2008-2009",
      value: "2008-2009",
    },
    {
      label: "2007-2008",
      value: "2007-2008",
    },
    {
      label: "2006-2007",
      value: "2006-2007",
    },
  ];
  const passingYears = [
    {
      label: "2028",
      value: "2028",
    },
    {
      label: "2027",
      value: "2027",
    },
    {
      label: "2026",
      value: "2026",
    },
    {
      label: "2025",
      value: "2025",
    },
    {
      label: "2024",
      value: "2024",
    },
    {
      label: "2023",
      value: "2023",
    },
    {
      label: "2022",
      value: "2022",
    },
    {
      label: "2021",
      value: "2021",
    },
    {
      label: "2020",
      value: "2020",
    },
    {
      label: "2019",
      value: "2019",
    },
    {
      label: "2018",
      value: "2018",
    },
    {
      label: "2017",
      value: "2017",
    },
    {
      label: "2016",
      value: "2016",
    },
    {
      label: "2015",
      value: "2015",
    },
    {
      label: "2014",
      value: "2014",
    },
    {
      label: "2013",
      value: "2013",
    },
    {
      label: "2012",
      value: "2012",
    },
    {
      label: "2011",
      value: "2011",
    },
    {
      label: "2010",
      value: "2010",
    },
  ];

  const RequiredField = ({ value }) => {
    return !value ? (
      <span
        className="text-red-500 cursor-help"
        title="This is a mandatory field"
      >
        {" "}
        *
      </span>
    ) : null;
  };

  const validImageTypes = ["image/jpeg", "image/png"];

  const validateFile = (file) => {
    if (!validImageTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG, PNG)",
      });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
      });
      return false;
    }
    return true;
  };

  // default values for the form
  const form = useForm({
    resolver: zodResolver(formSchema(isCurrentStudent)),
    defaultValues: {
      personalInfo: {
        name: "",
        roll: "",
        registrationNo: "",
        session: "",
        passingYear: "",
      },
      contactInfo: {
        mobile: "",
        email: "",
        currentAddress: "",
      },
      professionalInfo: {
        currentDesignation: "",
        currentOrganization: "",
        from: undefined,
        to: "Present",
      },
      numberOfParticipantInfo: {
        adult: 1,
        child: 0,
        total: 1,
      },
      paymentInfo: {
        totalAmount: isCurrentStudent ? STUDENT_FEE : ADULT_FEE,
        mobileBankingName: "",
        status: 1,
        transactionId: "",
      },
      profilePictureInfo: {
        image: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prevProfessionalInfo",
  });

  const addPreviousJob = () => {
    append({
      designation: "",
      organization: "",
      from: undefined,
      to: undefined,
    });
  };

  // Watch for changes in adult and child numbers
  const adultCount = form.watch("numberOfParticipantInfo.adult");
  const childCount = form.watch("numberOfParticipantInfo.child") || 0;

  useEffect(() => {
    // Reset form errors when switching status
    form.clearErrors();

    if (isCurrentStudent) {
      // Set student-specific values and clear alumni fields
      form.reset({
        ...form.getValues(),
        professionalInfo: {
          currentDesignation: "",
          currentOrganization: "",
          from: undefined,
          to: undefined,
        },
        prevProfessionalInfo: [],
        numberOfParticipantInfo: {
          adult: 1,
          child: 0,
          total: 1,
        },
        paymentInfo: {
          ...form.getValues().paymentInfo,
          totalAmount: STUDENT_FEE,
          mobileBankingName: "",
          status: 1,
          transactionId: "",
        },
        profilePictureInfo: {
          image: "",
        },
      });
    } else {
      // Handle alumni calculations
      const numAdults = parseInt(adultCount) || 0;
      const numChildren = parseInt(childCount) || 0;
      const totalAmount = numAdults * ADULT_FEE + numChildren * CHILD_FEE;
      const totalCount = numAdults + numChildren;

      form.setValue("numberOfParticipantInfo.total", totalCount);
      form.setValue("paymentInfo.totalAmount", totalAmount);
    }
  }, [isCurrentStudent, adultCount, childCount, form]);

  async function onSubmit(values) {
    try {
      setIsSubmitting(true);

      // Submit form based on user type
      const response = await (isCurrentStudent
        ? registrationApi.submitStudentForm(values)
        : registrationApi.submitAlumniForm(values));

      if (response.success) {
        toast({
          title: "Registration Complete",
          description: "Your registration has been submitted successfully.",
        });

        form.reset();
        setShowSuccess(true);
        // Redirect to home page after 3 seconds
        // setTimeout(() => {
        //   navigate("/");
        // }, 3000);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Transaction ID",
          description:
            "The provided transaction ID has already been used or is invalid.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description:
          error.message ||
          "There was a problem submitting your registration. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen mt-20">
      {/* Show success modal when registration is complete */}
      {showSuccess && <RegistrationSuccess onClose={() => navigate("/")} />}
      {/* Academis Status */}
      <div className="container mx-auto px-8 sm:px-4 max-w-4xl">
        <RegistrationGuidelines />
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
          Select Your Academic Status
        </h2>
        <RadioGroup
          defaultValue={isCurrentStudent ? "student" : "alumni"}
          onValueChange={(value) => setIsCurrentStudent(value === "student")}
          className="grid grid-cols-2 gap-3"
        >
          <div className="relative">
            <RadioGroupItem
              value="alumni"
              id="alumni"
              className="peer sr-only"
            />
            <label
              htmlFor="alumni"
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 p-3 sm:p-4",
                "cursor-pointer transition-all duration-200",
                "hover:border-primary hover:bg-primary/5",
                "peer-checked:border-primary/70 peer-checked:bg-primary/20",
                !isCurrentStudent && "border-primary/70 bg-primary/20",
                "border-muted"
              )}
            >
              <GraduationCap
                className={cn(
                  "mb-1 h-5 w-5",
                  !isCurrentStudent && "text-primary"
                )}
              />
              <p
                className={cn(
                  "text-sm font-medium",
                  !isCurrentStudent && "text-primary"
                )}
              >
                Alumni
              </p>
            </label>
          </div>

          <div className="relative">
            <RadioGroupItem
              value="student"
              id="student"
              className="peer sr-only"
            />
            <label
              htmlFor="student"
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 p-3 sm:p-4",
                "cursor-pointer transition-all duration-200",
                "hover:border-primary hover:bg-primary/5",
                "peer-checked:border-primary/70 peer-checked:bg-primary/20",
                isCurrentStudent && "border-primary/70 bg-primary/20",
                "border-muted"
              )}
            >
              <School
                className={cn(
                  "mb-1 h-5 w-5",
                  isCurrentStudent && "text-primary"
                )}
              />
              <p
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  isCurrentStudent && "text-primary"
                )}
              >
                Current Student
              </p>
            </label>
          </div>
        </RadioGroup>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="container mx-auto px-8 sm:px-4 max-w-4xl space-y-8 py-8 sm:py-12"
        >
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Personal Information
            </h2>
            <div className="space-y-6">
              {/* Input Name */}
              <FormField
                control={form.control}
                name="personalInfo.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name
                      <RequiredField value={field.value} />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="text"
                        pattern="[A-Za-z\s.]+"
                        onKeyPress={(e) => {
                          if (!/[A-Za-z\s.]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Input Roll */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="personalInfo.roll"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Roll Number
                          <RequiredField value={field.value} />
                        </FormLabel>
                        <FormControl>
                          <NumberInput
                            placeholder=""
                            type="text"
                            pattern="[0-9]+"
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Input Registration Number */}
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="personalInfo.registrationNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Registration Number
                          <RequiredField value={field.value} />
                        </FormLabel>
                        <FormControl>
                          <NumberInput
                            placeholder=""
                            type="text"
                            pattern="[0-9]+"
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Input Session */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="personalInfo.session"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          Session
                          <RequiredField value={field.value} />
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between text-xs sm:text-sm",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? sessions.find(
                                      (session) => session.value === field.value
                                    )?.label
                                  : "Select session"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto justify-between p-0">
                            <Command>
                              <CommandInput placeholder="Search session..." />
                              <CommandList>
                                <CommandEmpty>No session found.</CommandEmpty>
                                <CommandGroup>
                                  {sessions.map((session) => (
                                    <CommandItem
                                      value={session.label}
                                      key={session.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "personalInfo.session",
                                          session.value
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          session.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {session.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Input Year of Certificate Awarded */}
                {!isCurrentStudent && (
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="personalInfo.passingYear"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            Year of Certificate Awarded
                            <RequiredField value={field.value} />
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between text-xs sm:text-sm",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? passingYears.find(
                                        (passingYear) =>
                                          passingYear.value === field.value
                                      )?.label
                                    : "Select year"}
                                  <ChevronsUpDown className=" h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Command>
                                <CommandInput placeholder="Search passing year..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No passing year found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {passingYears.map((passingYear) => (
                                      <CommandItem
                                        value={passingYear.label}
                                        key={passingYear.value}
                                        onSelect={() => {
                                          form.setValue(
                                            "personalInfo.passingYear",
                                            passingYear.value
                                          );
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            passingYear.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {passingYear.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4 pt-10">
            <h2 className="text-xl font-semibold border-b pb-2">
              Contact Information
            </h2>
            <div className="space-y-6">
              {/* Input Mobile Number */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="contactInfo.mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Mobile
                          <RequiredField value={field.value} />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            type="text"
                            pattern="[0-9]+"
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Input Email */}
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="contactInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email
                          <RequiredField value={field.value} />
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="" type="email" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Input Address */}
              <FormField
                control={form.control}
                name="contactInfo.currentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder=""
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {!isCurrentStudent && (
            <div className="space-y-4 pt-10">
              <h2 className="text-xl font-semibold border-b pb-2">
                Professional Information
              </h2>
              <div className="space-y-6">
                {/* Input Current Designation */}
                <FormField
                  control={form.control}
                  name="professionalInfo.currentDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="text" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Input Current Organization */}
                <FormField
                  control={form.control}
                  name="professionalInfo.currentOrganization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="text" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Current Jobs Starting Date */}
                <div className="grid grid-cols-12 gap-4 justify-center items-center">
                  <div className="mt-2.5 col-span-6">
                    <FormField
                      control={form.control}
                      name="professionalInfo.from"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>From</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    " pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > TODAY}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Current Jobs Ending Date (Present) */}
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="professionalInfo.to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Present"
                              disabled
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* Previous Professional Information */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-medium">
                      Previous Professional Info
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPreviousJob}
                      className="w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="whitespace-nowrap">
                        Add Previous Job
                      </span>
                    </Button>
                  </div>

                  {fields &&
                    fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="relative space-y-4 p-4 border rounded-lg"
                      >
                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>

                        {/* Designation */}
                        <FormField
                          control={form.control}
                          name={`prevProfessionalInfo.${index}.designation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Designation</FormLabel>
                              <FormControl>
                                <Input placeholder="" type="text" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Organization */}
                        <FormField
                          control={form.control}
                          name={`prevProfessionalInfo.${index}.organization`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organization</FormLabel>
                              <FormControl>
                                <Input placeholder="" type="text" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Date Range */}
                        <div className="grid grid-cols-12 gap-4 justify-center items-center">
                          {/* From Date */}
                          <div className="col-span-6">
                            <FormField
                              control={form.control}
                              name={`prevProfessionalInfo.${index}.from`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>From</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "pl-3 text-left font-normal",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > TODAY}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* To Date */}
                          <div className="col-span-6">
                            <FormField
                              control={form.control}
                              name={`prevProfessionalInfo.${index}.to`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>To</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "pl-3 text-left font-normal",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > TODAY}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {!isCurrentStudent && (
            <div className="space-y-4 pt-10">
              <h2 className="text-xl font-semibold border-b pb-2">
                Participant Information
              </h2>
              <div className="space-y-6">
                {/* Adult Participants  */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="numberOfParticipantInfo.adult"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Adult
                            <RequiredField value={field.value} />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              type="number"
                              min={1}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Child Participants  */}
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="numberOfParticipantInfo.child"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              type="number"
                              min={0}
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4 pt-10">
            <h2 className="text-xl font-semibold border-b pb-2">
              Payment Information
            </h2>
            <div className="space-y-6">
              {/* Total Amount */}
              <FormField
                control={form.control}
                name="paymentInfo.totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <NumberInput
                        placeholder=""
                        disabled
                        {...field}
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isCurrentStudent ? (
                <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Please submit the registration fee (hand cash) to your
                    respective batch&apos;s Class Representative after competing
                    the registration.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-4">
                  {/* Payment Method */}
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="paymentInfo.mobileBankingName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Payment Method
                            <RequiredField value={field.value} />
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bankTransfer">
                                Bank Transfer
                              </SelectItem>
                              <SelectItem value="cashDeposit">
                                Cash Deposit
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Transaction Id */}
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="paymentInfo.transactionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Transaction Id
                            <RequiredField value={field.value} />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Picture */}
          <div className="space-y-4 pt-10">
            <h2 className="text-2xl font-semibold border-b pb-2"></h2>
            <FormField
              control={form.control}
              name="profilePictureInfo.image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>
                    {isCurrentStudent
                      ? "Student's Profile Picture"
                      : "Alumnus Profile Picture"}
                    <span
                      className="text-red-500 cursor-help"
                      title="This is a mandatory field"
                    >
                      {" "}
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-lg p-4",
                          "w-auto h-auto sm:w-[200px] sm:h-[150px] md:w-[200px] md:h-[150px]",
                          "flex flex-col items-center justify-center gap-2",
                          "cursor-pointer hover:border-primary transition-colors",
                          value && "border-primary"
                        )}
                        onClick={() =>
                          document.getElementById("picture-upload").click()
                        }
                      >
                        {value ? (
                          <div className="relative w-full h-full">
                            <img
                              src={
                                typeof value === "string"
                                  ? value
                                  : URL.createObjectURL(value)
                              }
                              alt="Profile preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                onChange(null);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                            <p className="text-xs sm:text-sm text-muted-foreground text-center">
                              Click to upload
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        id="picture-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (validateFile(file)) {
                              onChange(file);
                            } else {
                              e.target.value = ""; // Clear the input
                            }
                          }
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm text-muted-foreground">
                    Upload a recent formal passport size photo (max 2MB). Photo
                    should be:
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Clear, front-facing with formal attire</li>
                      <li>Latest photo preferable</li>
                    </ul>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Update submit button for transaction id checking */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full sm:w-auto px-8 py-2 mt-8 text-sm sm:text-base font-medium",
              isSubmitting && "cursor-not-allowed opacity-50"
            )}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
