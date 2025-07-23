'use client';
import React, { useState } from "react";

export type AstroEvent = {
  id: number;
  title: string;
  date: string; // ISO string
  type: string;
  description: string;
  icon?: string;
  color?: string;
};

type ViewType = "month" | "week" | "day";

type AstroCalendarProps = {
  events: AstroEvent[];
  year?: number;
  month?: number; // 1-12
  viewType?: ViewType;
  selectedDate?: Date;
  onViewTypeChange?: (view: ViewType) => void;
  onDateChange?: (date: Date) => void;
};

function getEventsForDay(events: AstroEvent[], date: Date) {
  return events.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate();
  });
}

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Pazartesi: 1, Pazar: 0
  date.setDate(date.getDate() + diff);
  return date;
}

const monthNames = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export default function AstroCalendar({
  events,
  year,
  month,
  viewType = "month",
  selectedDate: selectedDateProp,
  onViewTypeChange,
  onDateChange,
}: AstroCalendarProps) {
  // Dinamik ay/yıl state
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(year || today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(month || today.getMonth() + 1); // 1-12
  const [internalView, setInternalView] = useState<ViewType>(viewType);
  const [internalDate, setInternalDate] = useState<Date>(selectedDateProp || today);

  // Modal için state
  const [showModal, setShowModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<AstroEvent[]>([]);

  const handleViewChange = (v: ViewType) => {
    setInternalView(v);
    onViewTypeChange?.(v);
  };
  const handleDateChange = (d: Date) => {
    setInternalDate(d);
    onDateChange?.(d);
  };

  // Ay/yıl ileri-geri
  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  // Modal açma fonksiyonu
  const openEventModal = (events: AstroEvent[]) => {
    setSelectedDayEvents(events);
    setShowModal(true);
  };

  // Ay görünümü
  if (internalView === "month") {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Pazartesi=0, Pazar=6
    const weeks = [];
    let day = 1 - firstDayOfWeek;
    for (let w = 0; w < 6; w++) {
      const week = [];
      for (let d = 0; d < 7; d++, day++) {
        const cellDate = new Date(currentYear, currentMonth - 1, day);
        const dayEvents = getEventsForDay(events, cellDate);
        week.push(
          <td
            key={d}
            className={`align-top min-w-[90px] min-h-[90px] border border-gray-200 dark:border-gray-700 cursor-pointer rounded-xl shadow-sm transition-all duration-200 bg-white/80 dark:bg-gray-900/80 hover:bg-purple-50 dark:hover:bg-purple-900 ${dayEvents[0]?.color ? '' : ''}`}
            style={{ background: dayEvents[0]?.color || undefined }}
            onClick={() => day > 0 && day <= daysInMonth && dayEvents.length > 0 && openEventModal(dayEvents)}
          >
            {day > 0 && day <= daysInMonth ? (
              <div className="p-2 flex flex-col items-center gap-1">
                <div className="font-bold text-lg text-purple-900 dark:text-purple-200">{day}</div>
                {dayEvents.map((event, i) => (
                  <div key={i} className="text-2xl">{event.icon}</div>
                ))}
                <div className="text-xs text-center text-gray-700 dark:text-gray-300 leading-tight">{dayEvents.map(e => e.title).join(", ")}</div>
              </div>
            ) : null}
          </td>
        );
      }
      weeks.push(<tr key={w}>{week}</tr>);
    }
    return (
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-100 via-blue-50 to-white dark:from-gray-900 dark:via-purple-950 dark:to-black rounded-3xl shadow-2xl p-8 mt-8">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={prevMonth} className="px-3 py-2 rounded-full bg-white/80 dark:bg-gray-800 shadow hover:bg-purple-200 dark:hover:bg-purple-800 text-2xl">←</button>
            <h2 className="text-4xl font-extrabold tracking-wide text-purple-900 dark:text-purple-200 uppercase drop-shadow-lg">{monthNames[currentMonth - 1]} {currentYear}</h2>
            <button onClick={nextMonth} className="px-3 py-2 rounded-full bg-white/80 dark:bg-gray-800 shadow hover:bg-purple-200 dark:hover:bg-purple-800 text-2xl">→</button>
          </div>
          <div className="mt-2">
            <button onClick={() => handleViewChange("month")} className={`mr-2 px-3 py-1 rounded-lg ${internalView === "month" ? 'bg-purple-200 dark:bg-purple-800 font-bold underline' : 'bg-white/60 dark:bg-gray-800'}`}>Ay</button>
            <button onClick={() => handleViewChange("week")} className={`mr-2 px-3 py-1 rounded-lg ${internalView === "week" ? 'bg-purple-200 dark:bg-purple-800 font-bold underline' : 'bg-white/60 dark:bg-gray-800'}`}>Hafta</button>
            <button onClick={() => handleViewChange("day")} className={`px-3 py-1 rounded-lg ${internalView === "day" ? 'bg-purple-200 dark:bg-purple-800 font-bold underline' : 'bg-white/60 dark:bg-gray-800'}`}>Gün</button>
          </div>
        </div>
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              {weekDays.map((w, i) => <th key={i} className="text-lg font-bold text-purple-700 dark:text-purple-200 text-center pb-2">{w}</th>)}
            </tr>
          </thead>
          <tbody>{weeks}</tbody>
        </table>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadein">
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-purple-600">×</button>
              <h3 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-200 text-center">Etkinlik Detayı</h3>
              {selectedDayEvents.map((event, i) => (
                <div key={i} className="mb-6 last:mb-0 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30 shadow flex gap-3 items-start">
                  <div className="text-3xl">{event.icon}</div>
                  <div>
                    <div className="font-semibold text-lg text-purple-900 dark:text-purple-100">{event.title}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">{event.type}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Hafta görünümü
  if (internalView === "week") {
    const monday = getMonday(internalDate);
    const days = Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
    return (
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-100 via-blue-50 to-white dark:from-gray-900 dark:via-purple-950 dark:to-black rounded-3xl shadow-2xl p-8 mt-8">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => handleDateChange(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - 7))} className="px-3 py-2 rounded-full bg-white/80 dark:bg-gray-800 shadow hover:bg-purple-200 dark:hover:bg-purple-800 text-2xl">←</button>
            <h2 className="text-4xl font-extrabold tracking-wide text-purple-900 dark:text-purple-200 uppercase drop-shadow-lg">Hafta: {days[0].toLocaleDateString()} - {days[6].toLocaleDateString()}</h2>
            <button onClick={() => handleDateChange(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7))} className="px-3 py-2 rounded-full bg-white/80 dark:bg-gray-800 shadow hover:bg-purple-200 dark:hover:bg-purple-800 text-2xl">→</button>
          </div>
          <div className="mt-2">
            <button onClick={() => handleViewChange("month")} className={`mr-2 px-3 py-1 rounded-lg ${internalView === "month" ? 'bg-purple-200 dark:bg-purple-800 font-bold underline' : 'bg-white/60 dark:bg-gray-800'}`}>Ay</button>
            <button onClick={() => handleViewChange("week")} className={`mr-2 px-3 py-1 rounded-lg ${internalView === "week" ? 'bg-purple-200 dark:bg-purple-800 font-bold underline' : 'bg-white/60 dark:bg-gray-800'}`}>Hafta</button>
            <button onClick={() => handleViewChange("day")} className={`px-3 py-1 rounded-lg ${internalView === "day" ? 'bg-purple-200 dark:bg-purple-800 font-bold underline' : 'bg-white/60 dark:bg-gray-800'}`}>Gün</button>
          </div>
        </div>
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              {weekDays.map((w, i) => <th key={i} className="text-lg font-bold text-purple-700 dark:text-purple-200 text-center pb-2">{w}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              {days.map((date, i) => {
                const dayEvents = getEventsForDay(events, date);
                return (
                  <td key={i} className={`align-top min-w-[90px] min-h-[90px] border border-gray-200 dark:border-gray-700 cursor-pointer rounded-xl shadow-sm transition-all duration-200 bg-white/80 dark:bg-gray-900/80 hover:bg-purple-50 dark:hover:bg-purple-900 ${dayEvents[0]?.color ? '' : ''}`}
                    style={{ background: dayEvents[0]?.color || undefined }}
                    onClick={() => handleDateChange(date)}
                  >
                    <div className="p-2 flex flex-col items-center gap-1">
                      <div className="font-bold text-lg text-purple-900 dark:text-purple-200">{date.getDate()}</div>
                      {dayEvents.map((event, j) => (
                        <div key={j} className="text-2xl">{event.icon}</div>
                      ))}
                      <div className="text-xs text-center text-gray-700 dark:text-gray-300 leading-tight">{dayEvents.map(e => e.title).join(", ")}</div>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Gün görünümü
  if (internalView === "day") {
    const date = internalDate;
    const dayEvents = getEventsForDay(events, date);
    return (
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-100 via-blue-50 to-white dark:from-gray-900 dark:via-purple-950 dark:to-black rounded-3xl shadow-2xl p-8 mt-8">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => handleDateChange(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1))} className="px-3 py-2 rounded-full bg-white/80 dark:bg-gray-800 shadow hover:bg-purple-200 dark:hover:bg-purple-800 text-2xl">←</button>
            <h2 className="text-4xl font-extrabold tracking-wide text-purple-900 dark:text-purple-200 uppercase drop-shadow-lg">{date.toLocaleDateString()}</h2>
            <button onClick={() => handleDateChange(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))} className="px-3 py-2 rounded-full bg-white/80 dark:bg-gray-800 shadow hover:bg-purple-200 dark:hover:bg-purple-800 text-2xl">→</button>
          </div>
          <div className="mt-2">
            <button onClick={() => handleViewChange("month")} className={`mr-2 px-3 py-1 rounded-lg ${internalView === "month" ? 'bg-purple-200 dark:bg-purple-800 font-bold underline' : 'bg-white/60 dark:bg-gray-800'}`}>Ay</button>
            <button onClick={() => handleViewChange("week")} className={`mr-2 px-3 py-1 rounded-lg ${internalView === "week" ? 'bg-purple-200 dark:bg-purple-800 font-bold underline' : 'bg-white/60 dark:bg-gray-800'}`}>Hafta</button>
            <button onClick={() => handleViewChange("day")} className={`px-3 py-1 rounded-lg ${internalView === "day" ? 'bg-purple-200 dark:bg-purple-800 font-bold underline' : 'bg-white/60 dark:bg-gray-800'}`}>Gün</button>
          </div>
        </div>
        <div className="w-full max-w-md mx-auto">
          {dayEvents.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 shadow-lg text-center text-gray-700 dark:text-gray-300">
              Etkinlik yok
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {dayEvents.map((event, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 shadow-lg flex items-center gap-3">
                  <div className="text-4xl text-purple-900 dark:text-purple-200">{event.icon}</div>
                  <div>
                    <div className="font-semibold text-lg text-purple-900 dark:text-purple-200">{event.title}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
} 