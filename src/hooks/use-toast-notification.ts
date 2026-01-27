import { toast } from "sonner";
import { useNotifications } from "@/contexts/notifications-context";

export const useToastNotification = () => {
    const { addNotification } = useNotifications();

    const showSuccess = (message: string) => {
        toast.success(message, { duration: 0 });   
        addNotification(message, "success");
    };

    const showError = (message: string) => {
        toast.error(message, { duration: 0 });  // Add { duration: 0 } to prevent auto-dismiss
        addNotification(message, "error");
    };

    const showInfo = (message: string) => {
        toast.info(message, { duration: 0 });  // Add { duration: 0 } to prevent auto-dismiss
        addNotification(message, "info");
    };

    return { showSuccess, showError, showInfo };
};