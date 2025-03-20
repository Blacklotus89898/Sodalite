import React, { useState } from 'react';

// Enhanced event interface to support multi-day events
interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string; // Format: "YYYY-MM-DD"
  endDate: string;   // Format: "YYYY-MM-DD"
  startTime: string; // Format: "HH:MM"
  endTime: string;   // Format: "HH:MM"
  color?: string;    // Optional color for the event
}

interface DateEvents {
  [date: string]: Event[]; // Map date strings to events
}

const CalendarPicker: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Current viewed date
  const [selectedDate, setSelectedDate] = useState<string>(''); // Selected date (e.g., "YYYY-MM-DD")
  const [events, setEvents] = useState<Event[]>([]); // All events
  const [newEventTitle, setNewEventTitle] = useState<string>(''); // Title for a new event
  const [newEventDescription, setNewEventDescription] = useState<string>(''); // Description for a new event
  const [selectedStartTime, setSelectedStartTime] = useState<string>(''); // Start time for the event
  const [selectedEndTime, setSelectedEndTime] = useState<string>(''); // End time for the event
  const [selectedEndDate, setSelectedEndDate] = useState<string>(''); // End date for multi-day events
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null); // Event being edited
  const [newEventColor, setNewEventColor] = useState<string>('#4285f4'); // Default event color

  // Generate days of the current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Create padding for the days before the first day of the month
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarDays = [...paddingDays, ...monthDays];

  // Generate hourly schedule
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

  // Format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number): string =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Parse YYYY-MM-DD to Date object
  const parseDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Check if a date is within a range
  const isDateInRange = (date: string, startDate: string, endDate: string): boolean => {
    const d = parseDate(date);
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    return d >= start && d <= end;
  };

  // Get events for a specific date
  const getEventsForDate = (date: string): Event[] => {
    return events.filter(event => 
      isDateInRange(date, event.startDate, event.endDate)
    );
  };

  // Handle selecting a day
  const handleSelectDate = (day: number | null) => {
    if (day === null) return;
    
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateStr);
    setSelectedEndDate(dateStr); // Default end date to the selected date
    resetEventForm();
  };

  // Reset event form
  const resetEventForm = () => {
    setNewEventTitle('');
    setNewEventDescription('');
    setSelectedStartTime('09:00');
    setSelectedEndTime('10:00');
    setEventToEdit(null);
    setNewEventColor('#4285f4');
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(''); // Clear selected date
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(''); // Clear selected date
  };

  // Handle save event (add new or update existing)
  const handleSaveEvent = () => {
    if (!newEventTitle || !selectedDate || !selectedEndDate || !selectedStartTime || !selectedEndTime) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate dates
    if (parseDate(selectedEndDate) < parseDate(selectedDate)) {
      alert("End date cannot be before start date");
      return;
    }

    if (eventToEdit) {
      // Update existing event
      setEvents(prev => prev.map(event => 
        event.id === eventToEdit.id
          ? {
              ...event,
              title: newEventTitle,
              description: newEventDescription,
              startDate: selectedDate,
              endDate: selectedEndDate,
              startTime: selectedStartTime,
              endTime: selectedEndTime,
              color: newEventColor
            }
          : event
      ));
    } else {
      // Add new event
      const newEvent: Event = {
        id: Date.now(),
        title: newEventTitle,
        description: newEventDescription,
        startDate: selectedDate,
        endDate: selectedEndDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        color: newEventColor
      };
      setEvents(prev => [...prev, newEvent]);
    }

    resetEventForm();
  };

  // Delete an event
  const handleDeleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    resetEventForm();
  };

  // Edit an event
  const handleEditEvent = (event: Event) => {
    setEventToEdit(event);
    setNewEventTitle(event.title);
    setNewEventDescription(event.description || '');
    setSelectedStartTime(event.startTime);
    setSelectedEndTime(event.endTime);
    setSelectedDate(event.startDate);
    setSelectedEndDate(event.endDate);
    setNewEventColor(event.color || '#4285f4');
  };

  // Get day class based on events and selection
  const getDayClass = (day: number | null) => {
    if (day === null) return "empty-day";
    
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    const hasEvents = getEventsForDate(dateStr).length > 0;
    const isSelected = selectedDate === dateStr;
    
    return `calendar-day ${hasEvents ? 'has-events' : ''} ${isSelected ? 'selected' : ''}`;
  };

  // Day of week headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Calendar with Multi-Day Events</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Calendar Section */}
        <div style={{ flex: '1', border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: '0' }}>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div>
              <button onClick={goToPreviousMonth} style={{ padding: '5px 10px', marginRight: '8px' }}>
                Previous
              </button>
              <button onClick={goToNextMonth} style={{ padding: '5px 10px' }}>
                Next
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '8px' }}>
            {weekdays.map(day => (
              <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', padding: '5px' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {calendarDays.map((day, index) => (
              <div
                key={index}
                onClick={() => handleSelectDate(day)}
                style={{
                  padding: '10px',
                  minHeight: '80px',
                  textAlign: 'left',
                  cursor: day ? 'pointer' : 'default',
                  backgroundColor: day === null ? 'transparent' : (
                    selectedDate === formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
                      ? '#e6f2ff'
                      : 'white'
                  ),
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  position: 'relative',
                }}
              >
                {day && (
                  <>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{day}</div>
                    {/* Show event dots/indicators */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {getEventsForDate(formatDate(currentDate.getFullYear(), currentDate.getMonth(), day))
                        .slice(0, 3) // Show at most 3 events per day in the month view
                        .map(event => (
                          <div 
                            key={event.id}
                            style={{ 
                              backgroundColor: event.color || '#4285f4', 
                              color: 'white',
                              padding: '2px 4px',
                              borderRadius: '3px',
                              fontSize: '0.8rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                      {getEventsForDate(formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)).length > 3 && (
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          +{getEventsForDate(formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)).length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Event Detail Section */}
        <div style={{ flex: '1', border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
          <h2>
            {selectedDate 
              ? `Events for ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`
              : 'Select a date to view events'}
          </h2>

          {selectedDate && (
            <>
              {/* List of events for selected date */}
              <div style={{ marginBottom: '20px' }}>
                {getEventsForDate(selectedDate).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                    {getEventsForDate(selectedDate).map(event => (
                      <div 
                        key={event.id} 
                        style={{ 
                          padding: '10px',
                          borderLeft: `5px solid ${event.color || '#4285f4'}`,
                          backgroundColor: '#f8f9fa',
                          borderRadius: '4px'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                        <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                          {event.startDate === event.endDate ? (
                            `${event.startTime} - ${event.endTime}`
                          ) : (
                            <>
                              From: {new Date(event.startDate).toLocaleDateString()} {event.startTime}<br/>
                              To: {new Date(event.endDate).toLocaleDateString()} {event.endTime}
                            </>
                          )}
                        </div>
                        {event.description && <div style={{ fontSize: '0.9rem' }}>{event.description}</div>}
                        <div style={{ marginTop: '8px' }}>
                          <button 
                            onClick={() => handleEditEvent(event)}
                            style={{ marginRight: '10px', padding: '3px 8px' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            style={{ padding: '3px 8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No events for this date.</p>
                )}
              </div>

              {/* Event form */}
              <div style={{ 
                padding: '15px', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                backgroundColor: '#f8f9fa' 
              }}>
                <h3>{eventToEdit ? 'Edit Event' : 'Add New Event'}</h3>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Title *</label>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    placeholder="Event title"
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                  <textarea
                    value={newEventDescription}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '60px' }}
                    placeholder="Event description"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Start Date *</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>End Date *</label>
                    <input
                      type="date"
                      value={selectedEndDate}
                      onChange={(e) => setSelectedEndDate(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Start Time *</label>
                    <input
                      type="time"
                      value={selectedStartTime}
                      onChange={(e) => setSelectedStartTime(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>End Time *</label>
                    <input
                      type="time"
                      value={selectedEndTime}
                      onChange={(e) => setSelectedEndTime(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Event Color</label>
                  <input
                    type="color"
                    value={newEventColor}
                    onChange={(e) => setNewEventColor(e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={resetEventForm}
                    style={{ padding: '8px 15px', backgroundColor: '#f1f1f1', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEvent}
                    style={{ 
                      padding: '8px 15px', 
                      backgroundColor: '#4285f4', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {eventToEdit ? 'Update Event' : 'Add Event'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;