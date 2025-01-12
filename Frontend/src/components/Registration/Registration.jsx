import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useForm, useFieldArray } from "react-hook-form";
import NumberInput from "./NumberInput";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Check, Upload, ChevronsUpDown, Plus, X } from "lucide-react";
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

const ADULT_FEE = 200;
const CHILD_FEE = 100;

const formSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    roll: z.coerce
      .number({ invalid_type_error: "Must be a valid number" })
      .min(0),
    registrationNo: z.coerce
      .number({ invalid_type_error: "Must be a valid number" })
      .min(0),
    session: z.string().min(1, "Session is required"),
    passingYear: z.string().min(1, "Passing Year is required"),
  }),
  contactInfo: z.object({
    mobile: z.string().min(1, "Mobile number is required"),
    email: z.string().email("Invalid email address"),
    currentAddress: z.string().min(1, "Address is required"),
  }),
  professionalInfo: z.object({
    currentDesignation: z.string().optional(),
    currentOrganization: z.string().optional(),
    from: z.date().optional(),
    to: z.string().optional(),
  }),
  prevProfessionalInfo: z
    .array(
      z.object({
        designation: z.string().optional(),
        organization: z.string().optional(),
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .optional(),
  numberOfParticipantInfo: z.object({
    adult: z.coerce.number().min(1, "At least one adult required"),
    child: z.coerce.number().min(0).optional(),
    total: z.coerce.number().optional(),
  }),
  paymentInfo: z.object({
    totalAmount: z.coerce.number().optional(),
    mobileBankingName: z.string().min(1, "Payment method is required"),
    status: z.coerce.number().default(1),
    transactionId: z.string().min(1, "Transaction ID is required"),
  }),
  profilePictureInfo: z.object({
    image: z.instanceof(File).optional().or(z.string()),
  }),
});

const TODAY = new Date();

export default function Registration() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Add loading state for transaction id checking
  // const [isChecking, setIsChecking] = useState(false);
  // Add check function
  // const checkTransactionId = async (transactionId) => {
  //   try {
  //     const response = await axios.get(
  //       `/api/registration/check-transaction/${transactionId}`
  //     );
  //     return response.data.isUnique;
  //   } catch (error) {
  //     console.error("Transaction check failed:", error);
  //     return false;
  //   }
  // };

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

  // default values for the form
  const form = useForm({
    resolver: zodResolver(formSchema),
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
        totalAmount: ADULT_FEE,
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
    // Parse string values to numbers
    const numAdults = parseInt(adultCount) || 0;
    const numChildren = parseInt(childCount) || 0;

    // Calculate totals using numeric values
    const totalAmount = numAdults * ADULT_FEE + numChildren * CHILD_FEE;
    const totalCount = numAdults + numChildren;

    // Update form values
    form.setValue("paymentInfo.totalAmount", totalAmount);
    form.setValue("numberOfParticipantInfo.total", totalCount);
  }, [adultCount, childCount, form]);

  // Modify onSubmit function to check transaction id
  // async function onSubmit(values) {
  //   try {
  //     setIsChecking(true);
  //     const isUnique = await checkTransactionId(
  //       values.paymentInfo.transactionId
  //     );

  //     if (!isUnique) {
  //       toast({
  //         variant: "destructive",
  //         title: "Error",
  //         description: "This Transaction ID has already been used",
  //       });
  //       setIsChecking(false);
  //       return;
  //     }

  //     // Continue with existing submission logic
  //     console.log(values);
  //     toast({
  //       title: "Registration Complete",
  //       description:
  //         "Your data has been submitted. We will notify you once it's been verified. Thank You.",
  //     });

  //     form.reset();
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 2000);
  //   } catch (error) {
  //     console.error("Form submission error", error);
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: "Registration failed. Please try again.",
  //     });
  //   } finally {
  //     setIsChecking(false);
  //   }
  // }

  function onSubmit(values) {
    try {
      console.log(values);
      toast({
        title: "Registration Complete",
        description:
          "Your data has been submitted. We will notify you once it's been verified. Thank You.",
      });

      // Reset form
      form.reset();

      // Use the navigate hook directly
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  return (
    <div className="relative min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="container mx-auto px-8 sm:px-6 max-w-3xl space-y-8 py-8 sm:py-12"
        >
          {/* Input Name */}
          <FormField
            control={form.control}
            name="personalInfo.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
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
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <NumberInput placeholder="" {...field} />
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
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <NumberInput placeholder="" {...field} />
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
                    <FormLabel>Session</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-auto justify-between",
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
                      <PopoverContent className="w-auto p-0">
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

            {/* Input Passing Year */}
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="personalInfo.passingYear"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Passing Year</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-auto justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? passingYears.find(
                                  (passingYear) =>
                                    passingYear.value === field.value
                                )?.label
                              : "Select passing year"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Command>
                          <CommandInput placeholder="Search passing year..." />
                          <CommandList>
                            <CommandEmpty>No passing year found.</CommandEmpty>
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
          </div>
          {/* Input Mobile Number */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="contactInfo.mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
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
                    <FormLabel>Email</FormLabel>
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
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
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
                      <PopoverContent className="w-auto p-0" align="start">
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Previous Professional Information
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPreviousJob}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Previous Job
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
                  </div>
                </div>
              ))}
          </div>
          {/* Adult Participants  */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="numberOfParticipantInfo.adult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adult</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="number" min={1} {...field} />
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
                      <Input placeholder="" type="number" min={0} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Total Amount  */}
          <FormField
            control={form.control}
            name="paymentInfo.totalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total</FormLabel>
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
          {/* Payment Method  */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="paymentInfo.mobileBankingName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
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
                        <SelectItem value="Bkash">Bkash</SelectItem>
                        <SelectItem value="Rocket">Rocket</SelectItem>
                        <SelectItem value="Nagad">Nagad</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Transation Id */}
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="paymentInfo.transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Id</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Profile Picture */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="profilePictureInfo.image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
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
                            if (file.size > 5 * 1024 * 1024) {
                              // 5MB limit
                              toast({
                                variant: "destructive",
                                title: "File too large",
                                description:
                                  "Please upload an image smaller than 5MB",
                              });
                              return;
                            }
                            onChange(file);
                          }
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm text-center sm:text-left">
                    Upload a profile picture (max 5MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto px-8 py-2 mt-8 text-sm sm:text-base font-medium"
          >
            Submit
          </Button>

          {/* Update submit button for transaction id checking */}
          {/* <Button
            type="submit"
            disabled={isChecking}
            className="w-full sm:w-auto px-8 py-2 mt-8 text-sm sm:text-base font-medium"
          >
            {isChecking ? "Checking..." : "Submit"}
          </Button>  */}
        </form>
      </Form>
    </div>
  );
}
