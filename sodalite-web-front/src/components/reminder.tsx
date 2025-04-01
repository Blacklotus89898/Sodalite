import React, { useState } from "react";
import { Container } from "./container";

interface Reminder {
    id: number;
    text: string;
    date: string;
    hour?: string; // Optional hour property
}

const ReminderCreator: React.FC = () => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [text, setText] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [hour, setHour] = useState<string>(""); // State for hour input
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleAddOrUpdateReminder = () => {
        if (text.trim() && date.trim()) {
            if (editingId !== null) {
                // Update existing reminder
                setReminders(
                    reminders.map((reminder) =>
                        reminder.id === editingId ? { ...reminder, text, date, hour } : reminder
                    )
                );
                setEditingId(null);
            } else {
                // Add new reminder
                const newReminder: Reminder = {
                    id: Date.now(),
                    text,
                    date,
                    hour: hour || undefined, // Only include hour if it's provided
                };
                setReminders([...reminders, newReminder]);
            }
            setText("");
            setDate("");
            setHour(""); // Reset hour input
        }
    };

    const handleDeleteReminder = (id: number) => {
        setReminders(reminders.filter((reminder) => reminder.id !== id));
    };

    const handleEditReminder = (id: number) => {
        const reminderToEdit = reminders.find((reminder) => reminder.id === id);
        if (reminderToEdit) {
            setText(reminderToEdit.text);
            setDate(reminderToEdit.date);
            setHour(reminderToEdit.hour || ""); // Populate hour if it exists
            setEditingId(id);
        }
    };

    return (
        <Container maxWidth={1200} maxHeight={1200}>
            <div style={{ margin: "20px" }}>
                <h2>Create or Edit a Reminder</h2>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        placeholder="Enter reminder"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{ marginRight: "10px" }}
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ marginRight: "10px" }}
                    />
                    <input
                        type="time"
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        style={{ marginRight: "10px" }}
                    />
                    <button onClick={handleAddOrUpdateReminder}>
                        {editingId !== null ? "Update Reminder" : "Add Reminder"}
                    </button>
                </div>
                <h3>My Reminders</h3>
                <ul>
                    {reminders.map((reminder) => (
                        <li key={reminder.id} style={{ marginBottom: "5px" }}>
                            <span>
                                {reminder.text} - {reminder.date}
                                {reminder.hour ? ` at ${reminder.hour}` : ""}
                            </span>
                            <button onClick={() => handleEditReminder(reminder.id)} style={{ marginLeft: "10px" }}>
                                Edit
                            </button>
                            <button onClick={() => handleDeleteReminder(reminder.id)} style={{ marginLeft: "10px" }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </Container>
    );
};

export default ReminderCreator;