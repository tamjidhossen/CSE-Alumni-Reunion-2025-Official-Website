import { forwardRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PrintableTable = forwardRef(({ registrations, tabType, filterType, filterSession }, ref) => {
  const currentDateTime = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  // Generate title based on filters
  const getTitle = () => {
    const statusText = tabType.charAt(0).toUpperCase() + tabType.slice(1);
    const typeText = filterType === "all" 
      ? "Registrations" 
      : filterType === "student" 
        ? "Student Registrations" 
        : "Alumni Registrations";
    const sessionText = filterSession === "all" 
      ? "All Sessions" 
      : `Session: ${filterSession}`;

    return `${statusText} ${typeText} - ${sessionText}`;
  };

  return (
    <div className="print-only p-6" ref={ref}>
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold">CSE Reunion 2025</h1>
        <h2 className="text-xl font-semibold text-muted-foreground">{getTitle()}</h2>
        <p className="text-sm text-muted-foreground">Generated: {currentDateTime}</p>
        <p className="text-sm">Total Entries: {registrations.length}</p>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">Type</TableHead>
            <TableHead className="font-bold">Roll</TableHead>
            <TableHead className="font-bold">Session</TableHead>
            <TableHead className="font-bold">Mobile</TableHead>
            <TableHead className="font-bold text-center">Adults</TableHead>
            <TableHead className="font-bold text-center">Children</TableHead>
            <TableHead className="font-bold text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((reg) => (
            <TableRow key={reg._id}>
              <TableCell>{reg.personalInfo.name}</TableCell>
              <TableCell>
                {!reg.professionalInfo ? "Student" : "Alumni"}
              </TableCell>
              <TableCell>{reg.personalInfo.roll}</TableCell>
              <TableCell>{reg.personalInfo.session}</TableCell>
              <TableCell>{reg.contactInfo.mobile}</TableCell>
              <TableCell className="text-center">
                {reg.numberOfParticipantInfo?.adult || 1}
              </TableCell>
              <TableCell className="text-center">
                {reg.numberOfParticipantInfo?.child || 0}
              </TableCell>
              <TableCell className="text-center">
                {reg.numberOfParticipantInfo?.total || 1}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

PrintableTable.displayName = "PrintableTable";
export default PrintableTable;
