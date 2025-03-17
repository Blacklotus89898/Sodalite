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
  const [newEventTitle, setNewEventTitle] = useState<string>(''); // Title for a new event
  const [selectedTime, setSelectedTime] = useState<string>(''); // Currently selected time for the event
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null); // Event being edited

  // Generate days of the current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Generate hourly schedule
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

  // Format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number): string =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Handle selecting a day
  const handleSelectDate = (day: number) => {
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateStr);
    setNewEventTitle(''); // Reset new event title
    setSelectedTime(''); // Reset selected time
    setEventToEdit(null); // Clear editing state
  };

  // Handle adding a new event
  const handleAddEvent = () => {
    if (!selectedDate || !newEventTitle || !selectedTime) return;

    const newEvent: Event = {
      id: Date.now(),
      title: newEventTitle,
      description: '', // Add description feature if needed
      time: selectedTime,
    };

    setEvents((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEvent],
    }));

    setNewEventTitle(''); // Clear the title field
    setSelectedTime(''); // Clear the selected time
  };

  // Handle editing an event
  const handleEditEvent = () => {
    if (!eventToEdit || !newEventTitle) return;

    setEvents((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map((event) =>
        event.id === eventToEdit.id
          ? { ...event, title: newEventTitle, time: selectedTime || event.time }
          : event
      ),
    }));

    setEventToEdit(null); // Clear editing state
    setNewEventTitle(''); // Clear input
    setSelectedTime(''); // Clear selected time
  };

  // Handle deleting an event
  const handleDeleteEvent = (id: number) => {
    setEvents((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter((event) => event.id !== id),
    }));
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      {/* Calendar Sidebar */}
      <div
        style={{
          width: '40%',
          padding: '10px',
          borderRight: '1px solid #ccc',
        }}
      >
        <h2>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '5px',
          }}
        >
          {monthDays.map((day) => (
            <div
              key={day}
              onClick={() => handleSelectDate(day)}
              style={{
                padding: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor:
                  selectedDate === formatDate(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  )
                    ? '#f0f0f0'
                    : 'transparent',
                border: '1px solid #ddd',
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Schedule and Event Management */}
      <div style={{ width: '60%', padding: '10px' }}>
        <h2>Selected Date: {selectedDate || 'None'}</h2>
        {selectedDate ? (
          <div>
            <h3>Schedule for the Day</h3>
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {hours.map((hour) => (
                <div
                  key={hour}
                  onClick={() => setSelectedTime(hour)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    backgroundColor: selectedTime === hour ? '#d3d3d3' : 'transparent',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {hour}
                  {/* Display events for this time */}
                  {events[selectedDate]?.filter((event) => event.time === hour).map((event) => (
                    <div
                      key={event.id}
                      style={{
                        marginLeft: '20px',
                        fontSize: '0.9rem',
                      }}
                    >
                      <strong>{event.title}</strong>
                      <button
                        onClick={() => {
                          setEventToEdit(event);
                          setNewEventTitle(event.title);
                          setSelectedTime(event.time);
                        }}
                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Add/Edit Event */}
            <div style={{ marginTop: '20px' }}>
              <h4>
                {eventToEdit ? `Edit Event at ${selectedTime || eventToEdit.time}` : `Add Event at ${selectedTime || 'Select a Time'}`}
              </h4>
              <input
                type="text"
                placeholder="Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  padding: '5px',
                  width: '100%',
                }}
              />
              <button
                onClick={eventToEdit ? handleEditEvent : handleAddEvent}
                style={{
                  padding: '10px 20px',
                  cursor: selectedTime ? 'pointer' : 'not-allowed',
                  backgroundColor: selectedTime ? '#007bff' : '#ccc',
                  color: '#fff',
                  border: 'none',
                }}
                disabled={!selectedTime}
              >
                {eventToEdit ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </div>
        ) : (
          <p>Please select a date to view or add events.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarPicker;
