import { useEffect, useRef, useState } from 'react';
import { subscribeToTasks, updateTask, type Task } from '../lib/db';
import { auth } from '../lib/firebase';
import { isReminderDue, snoozedReminderTime, toReminderTime } from '../lib/reminders';
import { onAuthStateChanged, type User } from 'firebase/auth';

// Gentle chime sound
const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export function useTaskNotifications() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [activeNotification, setActiveNotification] = useState<Task | null>(null);
    const lastCheckedMinute = useRef<string>('');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [permission, setPermission] = useState(Notification.permission);

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

        const playNotificationSound = () => {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log('Audio play failed', e));
            }
        };

        const checkReminders = () => {
            const now = new Date();
            const currentTime = toReminderTime(now);

            // Only check once per minute
            if (currentTime === lastCheckedMinute.current) return;
            lastCheckedMinute.current = currentTime;

            tasks.forEach(task => {
                if (!isReminderDue(task, now)) return;

                // Trigger notification
                setActiveNotification(task);
                playNotificationSound();
                sendSystemNotification(task.text);
            });
        };

        // Check every 5 seconds to ensure we catch the minute change promptly
        const intervalId = setInterval(checkReminders, 5000);

        return () => clearInterval(intervalId);
    }, [user, tasks]);

    const snoozeTask = async (task: Task, minutes: number = 10) => {
        if (!task.reminderTime) return;

        const newTime = snoozedReminderTime(task.reminderTime, minutes);

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

    const requestPermission = async () => {
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    };

    return {
        activeNotification,
        snoozeTask,
        dismissNotification,
        permission,
        requestPermission
    };
}

function sendSystemNotification(taskText: string) {
    const options = {
        body: `It's time for: ${taskText}`,
        icon: '/vite.svg',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        tag: 'lifeai-reminder',
        renotify: true
    } as NotificationOptions;

    if (Notification.permission === 'granted') {
        new Notification('LifeAI Task Reminder', options);
    }
}
