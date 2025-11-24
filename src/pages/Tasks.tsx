import { Plus, Trash2, Clock, Calendar, Edit2, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { subscribeToTasks, addTask as addTaskToDb, updateTask, deleteTask as deleteTaskFromDb, type Task } from '../lib/db';

const DAYS = [
    { id: 'Mon', label: 'M' },
    { id: 'Tue', label: 'T' },
    { id: 'Wed', label: 'W' },
    { id: 'Thu', label: 'T' },
    { id: 'Fri', label: 'F' },
    { id: 'Sat', label: 'S' },
    { id: 'Sun', label: 'S' },
];

export function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskText, setTaskText] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [reminderTime, setReminderTime] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;

        // Subscribe to real-time updates
        const unsubscribe = subscribeToTasks(user.uid, (updatedTasks) => {
            setTasks(updatedTasks);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSaveTask = async () => {
        if (taskText.trim() && user) {
            try {
                if (editingTask) {
                    // Update existing task
                    await updateTask(editingTask.id, {
                        text: taskText,
                        recurrence: selectedDays,
                        reminderTime: reminderTime
                    });
                    setEditingTask(null);
                } else {
                    // Add new task
                    await addTaskToDb(user.uid, taskText, selectedDays, reminderTime);
                }
                // Reset form
                setTaskText('');
                setSelectedDays([]);
                setReminderTime('');
            } catch (error) {
                console.error('Error saving task:', error);
            }
        }
    };

    const startEditing = (task: Task) => {
        setEditingTask(task);
        setTaskText(task.text);
        setSelectedDays(task.recurrence || []);
        setReminderTime(task.reminderTime || '');
    };

    const cancelEditing = () => {
        setEditingTask(null);
        setTaskText('');
        setSelectedDays([]);
        setReminderTime('');
    };

    const toggleDay = (dayId: string) => {
        setSelectedDays(prev =>
            prev.includes(dayId)
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId]
        );
    };

    const toggleTask = async (task: Task) => {
        try {
            await updateTask(task.id, { completed: !task.completed });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTaskFromDb(id);
                if (editingTask?.id === id) {
                    cancelEditing();
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em'
                }}>
                    Tasks
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Manage your daily recurring tasks
                </p>
            </div>

            {/* Task Form (Add/Edit) */}
            <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                background: 'rgba(20, 20, 20, 0.6)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${editingTask ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'border-color 0.3s'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: editingTask ? '#38bdf8' : 'white' }}>
                        {editingTask ? 'Edit Task' : 'Add New Task'}
                    </h3>
                    {editingTask && (
                        <button
                            onClick={cancelEditing}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                        >
                            <X size={16} /> Cancel
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveTask()}
                        placeholder={editingTask ? "Update task description..." : "Add a new task..."}
                        style={{
                            flex: '1 1 200px',
                            minWidth: '200px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '0.875rem 1rem',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSaveTask}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 1.5rem',
                            background: editingTask
                                ? 'linear-gradient(to right, #38bdf8, #818cf8)'
                                : 'linear-gradient(to right, #38bdf8, #818cf8)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {editingTask ? <Check size={18} /> : <Plus size={18} />}
                        {editingTask ? 'Update' : 'Add'}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Day Selector */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                            <Calendar size={16} /> Days:
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {DAYS.map(day => (
                                <button
                                    key={day.id}
                                    onClick={() => toggleDay(day.id)}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        border: selectedDays.includes(day.id)
                                            ? '1px solid #38bdf8'
                                            : '1px solid rgba(255,255,255,0.1)',
                                        background: selectedDays.includes(day.id)
                                            ? 'rgba(56, 189, 248, 0.2)'
                                            : 'transparent',
                                        color: selectedDays.includes(day.id) ? '#38bdf8' : 'var(--text-secondary)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Selector */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                            <Clock size={16} /> Time:
                        </span>
                        <input
                            type="time"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '6px',
                                padding: '0.25rem 0.5rem',
                                color: 'white',
                                fontSize: '0.9rem',
                                outline: 'none',
                                colorScheme: 'dark'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div style={{
                background: 'rgba(20, 20, 20, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.5rem'
            }}>
                {tasks.length === 0 ? (
                    <p style={{
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        padding: '2rem'
                    }}>
                        No tasks yet. Add one to get started!
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: editingTask?.id === task.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                    border: editingTask?.id === task.id ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                                    borderRadius: '12px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    if (editingTask?.id !== task.id) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (editingTask?.id !== task.id) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                    }
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        cursor: 'pointer',
                                        accentColor: '#38bdf8'
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <span style={{
                                        display: 'block',
                                        color: task.completed ? 'var(--text-secondary)' : 'white',
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        fontSize: '1rem',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {task.text}
                                    </span>
                                    {(task.recurrence?.length || task.reminderTime) && (
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {task.recurrence && task.recurrence.length > 0 && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Calendar size={12} /> {task.recurrence.join(', ')}
                                                </span>
                                            )}
                                            {task.reminderTime && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Clock size={12} /> {task.reminderTime}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => startEditing(task)}
                                        style={{
                                            padding: '0.5rem',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Edit Task"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        style={{
                                            padding: '0.5rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            borderRadius: '8px',
                                            color: '#fca5a5',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Delete Task"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}
