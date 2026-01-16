import { toast } from "sonner";
import { useNotifications } from "@/contexts/notifications-context";

export const useToastNotification = () => {
    const { addNotification } = useNotifications();

    const showSuccess = (message: string) => {
        toast.success(message);
        addNotification(message, "success");
    };

    const showError = (message: string) => {
        toast.error(message);
        addNotification(message, "error");
    };

    const showInfo = (message: string) => {
        toast.info(message);
        addNotification(message, "info");
    };

    return { showSuccess, showError, showInfo };
};