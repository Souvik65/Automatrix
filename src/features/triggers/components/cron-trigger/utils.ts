import cronstrue from "cronstrue";

export function parseCronExpression(expression: string): boolean {
    try {
        const parts = expression.split(" ");
        return parts.length === 5;
    } catch {
        return false;
    }
}

export function generateCronDescription(expression: string): string {
    try {
        return cronstrue.toString(expression);
    } catch {
        return "Invalid cron expression";
    }
}