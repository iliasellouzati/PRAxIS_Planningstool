import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const LastMonthHours = ({ employeeId, extrahistory, shifttypes }) => {

  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { calendar } = currentCalendar;
  const { month, year } = useParams();
  const [CurrentCalendarHours, setCurrentCalendarHours] = useState(0);

  const calcHours = () => {

    let total = 0;
    let lastDayOfPrevMonth = moment(`${month}-${year}`, "MM-YYYY").startOf('month').subtract(1, 'day');

    calendar.find(x => x.employeeId === employeeId).calendar.forEach(shiftDay => {

      if (moment(shiftDay.day, 'DD-MM-YYYY').isAfter(lastDayOfPrevMonth) || shiftDay.shift === '' || shiftDay.shift === false) {
        return;
      }

      let shift = shifttypes.find(x => x.naam === shiftDay.shift)

      if (moment(shiftDay.day, 'DD-MM-YYYY').isBefore(lastDayOfPrevMonth)) {
        total += moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() >= 0 ?
          moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() :
          moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").add(1, "day").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours()
      } else {
        total += moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() >= 0 ?
          moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() :
          moment.duration(moment(shiftDay.day, "DD-MM-YYYY").endOf("day").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours()
      }


    })

    setCurrentCalendarHours(total);
  }

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  useEffect(() => {
    calcHours();

    return () => {

    }
  }, [calendar])


  return (
    <React.Fragment>
      <div style={{ margin: '0px', padding: '0px' }} title={roundToTwo(extrahistory ? extrahistory + CurrentCalendarHours : CurrentCalendarHours)}>
        {Math.round(extrahistory ? extrahistory + CurrentCalendarHours : CurrentCalendarHours)}

      </div>
    </React.Fragment>
  )
}

export default LastMonthHours