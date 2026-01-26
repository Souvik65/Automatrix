"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Notification {
    id: string;
    message: string;
    type: "success" | "error" | "info";
    timestamp: number;
}

interface NotificationsContextType {
    notifications: Notification[];
    addNotification: (message: string, type: Notification["type"]) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const STORAGE_KEY = "automatrix-notifications";

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load notifications from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setNotifications(parsed);
            } catch (error) {
                console.error("Failed to parse notifications from localStorage:", error);
            }
        }
    }, []);

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (message: string, type: Notification["type"]) => {
        const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            type,
            timestamp: Date.now(),
        };
        setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep last 50
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationsContext.Provider value={{ notifications, addNotification, removeNotification, clearNotifications }}>
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