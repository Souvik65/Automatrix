"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Notification {
    id: string;
    message: string;
    type: "success" | "error" | "info";
    timestamp: number;
}

interface NotificationsContextType {
    notifications: Notification[];
    addNotification: (message: string, type: Notification["type"]) => void;
    clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (message: string, type: Notification["type"]) => {
        const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            type,
            timestamp: Date.now(),
        };
        setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep last 50
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationsContext.Provider value={{ notifications, addNotification, clearNotifications }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationsProvider");
    }
    return context;
};