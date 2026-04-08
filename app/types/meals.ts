export type Child = {
    id: number;
    name: string;
    color: string;
};

export type MealState = {
    breakfast: boolean;
    lunch: boolean;
    snack: boolean;
    fullDay: boolean;
};

export type DayStatus = "active" | "inactive" | "partial";

export type CalendarDay = {
    id: number;
    dayNumber: number;
    weekday: string;
    isCurrentMonth?: boolean;
    isSelected?: boolean;
    mealSelections: Record<number, MealState>;
};