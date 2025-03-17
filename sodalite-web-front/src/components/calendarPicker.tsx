import React, { useState } from 'react';

// Define the event and date types
interface Event {
  id: number;
  title: string;
  description: string;
  time: string; // Format: "HH:MM"
}

interface DateEvents {
  [date: string]: Event[]; // Map date strings to events
}

const CalendarPicker: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Current viewed date
  const [selectedDate, setSelectedDate] = useState<string>(''); // Selected date (e.g., "YYYY-MM-DD")
  const [events, setEvents] = useState<DateEvents>({}); // Events state
  const [newEvent, setNewEvent] = useState<Event>({ id: 0, title: '', description: '', time: '' });

  // Generate days of the current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number): string =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Handle selecting a day
  const handleSelectDate = (day: number) => {
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateStr);
    setNewEvent({ id: 0, title: '', description: '', time: '' }); // Reset form
  };

  // Handle adding a new event
  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title || !newEvent.time) return;

    setEvents((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), { ...newEvent, id: Date.now() }],
    }));
    setNewEvent({ id: 0, title: '', description: '', time: '' }); // Clear form
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      {/* Calendar Sidebar */}
      <div style={{ width: '50%', padding: '10px', borderRight: '1px solid #ccc' }}>
        <h2>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
          {monthDays.map((day) => (
            <div
              key={day}
              onClick={() => handleSelectDate(day)}
              style={{
                padding: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: selectedDate === formatDate(currentDate.getFullYear(), currentDate.getMonth(), day) ? '#f0f0f0' : 'transparent',
                border: '1px solid #ddd',
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Event Form and Details */}
      <div style={{ width: '50%', padding: '10px' }}>
        <h2>Selected Date: {selectedDate || 'None'}</h2>
        {selectedDate && (
          <div>
            <h3>Add Event</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '100%' }}
            />
            <textarea
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '100%' }}
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', padding: '5px' }}
            />
            <button onClick={handleAddEvent} style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Add Event
            </button>
          </div>
        )}

        {/* Display Events for Selected Date */}
        {selectedDate && events[selectedDate]?.length > 0 && (
          <div>
            <h3>Events</h3>
            <ul>
              {events[selectedDate].map((event) => (
                <li key={event.id}>
                  <strong>{event.title}</strong> at {event.time}
                  <p>{event.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPicker;
