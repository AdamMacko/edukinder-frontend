export type Child = {
    id: number;
    name: string;
};

export type AttendanceState = "PRESENT" | "ABSENT" | "SICK";

export type AttendanceLog = {
    id: number;
    timestamp: string;
    childName: string;
    from: AttendanceState;
    to: AttendanceState;
    userEmail: string;
};

export type AttendanceResponse = {
    date: string;
    groupName: string | null;
    children: Child[];
    attendance: Record<string, AttendanceState>;
    logs: AttendanceLog[];
};

export type MonthlyRow = {
    childId: number;
    name: string;
    present: number;
    absent: number;
    sick: number;
};

export type MonthlyReport = {
    month: string;
    groupName: string | null;
    rows: MonthlyRow[];
};