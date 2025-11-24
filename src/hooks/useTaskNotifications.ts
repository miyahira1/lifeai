import { useEffect, useRef, useState } from 'react';
import { subscribeToTasks, updateTask, type Task } from '../lib/db';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

// Gentle chime sound
const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export function useTaskNotifications() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [activeNotification, setActiveNotification] = useState<Task | null>(null);
    const lastCheckedMinute = useRef<string>('');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(NOTIFICATION_SOUND);

        const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToTasks(user.uid, (updatedTasks) => {
            setTasks(updatedTasks);
        });
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (!user || tasks.length === 0) return;

        const checkReminders = () => {
            const now = new Date();
            const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue", etc.
            const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

            // Only check once per minute
            if (currentTime === lastCheckedMinute.current) return;
            lastCheckedMinute.current = currentTime;

            tasks.forEach(task => {
                // Skip if no reminder time set
                if (!task.reminderTime) return;

                // Check if time matches
                if (task.reminderTime === currentTime) {
                    // Check recurrence
                    // If recurrence is set, today must be in the list
                    if (task.recurrence && task.recurrence.length > 0) {
                        if (!task.recurrence.includes(currentDay)) return;
                    }

                    // If task is completed, we generally don't remind
                    if (task.completed) return;

                    // Trigger notification
                    setActiveNotification(task);
                    playNotificationSound();
                    sendSystemNotification(task.text);
                }
            });
        };

        // Check every 5 seconds to ensure we catch the minute change promptly
        const intervalId = setInterval(checkReminders, 5000);

        // Request permission on mount if default
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => clearInterval(intervalId);
    }, [user, tasks]);

    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed', e));
        }
    };

    const snoozeTask = async (task: Task, minutes: number = 10) => {
        if (!task.reminderTime) return;

        const [hours, mins] = task.reminderTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, mins + minutes);

        const newTime = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        try {
            await updateTask(task.id, { reminderTime: newTime });
            setActiveNotification(null);
        } catch (error) {
            console.error('Error snoozing task:', error);
        }
    };

    const dismissNotification = () => {
        setActiveNotification(null);
    };

    return {
        activeNotification,
        snoozeTask,
        dismissNotification
    };
}

function sendSystemNotification(taskText: string) {
    if (Notification.permission === 'granted') {
        new Notification('LifeAI Task Reminder', {
            body: `It's time for: ${taskText}`,
            icon: '/vite.svg',
            requireInteraction: true
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('LifeAI Task Reminder', {
                    body: `It's time for: ${taskText}`,
                    requireInteraction: true
                });
            }
        });
    }
}
