import { useMemo, useState } from 'react';
import './Calendar.css';
import * as dateFns from 'date-fns';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const nextMonth = () => {
    setCurrentMonth((prevState) => dateFns.addMonths(prevState, 1));
  };

  const prevMonth = () => {
    setCurrentMonth((prevState) => dateFns.subMonths(prevState, 1));
  };

  return (
    <div className="calendar">
      <CalendarHeader
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        currentMonth={currentMonth}
      />
      <CalendarDays currentMonth={currentMonth} />

      <CalendarCells
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}

function CalendarHeader({ prevMonth, nextMonth, currentMonth }) {
  const dateFormat = 'MMMM yyyy';

  return (
    <div className="header row flex-middle">
      <div className="col col-start">
        <div className="icon" onClick={prevMonth}>
          chevron_left
        </div>
      </div>
      <div className="col col-center">
        <span>{dateFns.format(currentMonth, dateFormat)}</span>
      </div>
      <div className="col col-end" onClick={nextMonth}>
        <div className="icon">chevron_right</div>
      </div>
    </div>
  );
}

function CalendarDays({ currentMonth }) {
  const dateFormat = 'iiii';

  let startDate = dateFns.startOfWeek(currentMonth);

  return (
    <div className="days row">
      {[0, 1, 2, 3, 4, 5, 6].map((_el, idx) => (
        <div className="col col-center" key={idx}>
          {dateFns.format(dateFns.addDays(startDate, idx), dateFormat)}
        </div>
      ))}
    </div>
  );
}

function CalendarCells({ currentMonth, selectedDate, setSelectedDate }) {
  const monthStart = useMemo(
    () => dateFns.startOfMonth(currentMonth),
    [currentMonth]
  );
  const monthEnd = useMemo(() => dateFns.endOfMonth(monthStart), [monthStart]);

  // startDate: the first cell we can see at the body
  const startDate = useMemo(
    () => dateFns.startOfWeek(monthStart),
    [monthStart]
  );

  const endDate = useMemo(() => dateFns.endOfWeek(monthEnd), [monthEnd]); // the last cell we can see at the body

  const dateFormat = 'd';

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const renderCells = () => {
    const rows = [];
    let currentRowOfDays = [];
    let day = startDate;
    let dayNumber = '';

    while (day <= endDate) {
      // creating one row of 7 days
      for (let i = 0; i < 7; i++) {
        dayNumber = dateFns.format(day, dateFormat);

        const cloneDay = day;
        currentRowOfDays.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? 'disabled'
                : dateFns.isSameDay(day, selectedDate)
                ? 'selected'
                : ''
            }`}
            key={day}
            value={day}
            onClick={() =>
              onDateClick(dateFns.parseISO(new Date(cloneDay).toISOString()))
            }>
            <span className="number">{dayNumber}</span>
            {/* <span className="dayText">{dateFns.format(day, 'iii')}</span> */}
            <span className="bg">{dayNumber}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }

      // pushing it to the rows
      rows.push(
        <div className="row" key={day}>
          {currentRowOfDays}
        </div>
      );
      currentRowOfDays = [];
    }

    return <div className="body">{rows}</div>;
  };

  return <>{renderCells()}</>;
}
