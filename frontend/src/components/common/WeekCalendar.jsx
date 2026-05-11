import React from 'react';
import './WeekCalendar.css';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

const WeekCalendar = ({ events }) => {
  return (
    <div className="calendar-container glass-effect">
      <div className="calendar-grid">
        <div className="time-col">
          <div className="calendar-cell header-cell">Heures</div>
          {hours.map(h => <div key={h} className="calendar-cell time-cell">{h}</div>)}
        </div>
        {days.map((day, dayIndex) => (
          <div key={day} className="day-col">
            <div className="calendar-cell header-cell">{day}</div>
            {hours.map((h, hIndex) => {
              // Cherche s'il y a un événement pour cette case précise
              const slotEvent = events.find(e => e.day === dayIndex && e.start === hIndex);
              return (
                <div key={h} className="calendar-cell slot-cell">
                  {slotEvent && (
                    <div className={`event-card ${slotEvent.color}`}>
                      <strong>{slotEvent.title}</strong>
                      <span className="event-detail">{slotEvent.room}</span>
                      <span className="event-detail">{slotEvent.prof}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;
