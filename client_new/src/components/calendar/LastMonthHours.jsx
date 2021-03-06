import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const LastMonthHours = ({ employeeId, extrahistory, employees, shifttypes, contracttypes }) => {

  const currentCalendar = useSelector((state) => state.currentCalendar);
  const { calendar } = currentCalendar;
  const { month, year } = useParams();
  const [CurrentCalendarHours, setCurrentCalendarHours] = useState(0);
  const [Percentage, setPercentage] = useState(0);
  const [MaandurenVolgensContract, setMaandurenVolgensContract] = useState(0);

  const calcHours = () => {

    let total = 0;
    let lastDayOfPrevMonth = moment(`${month}-${year}`, "MM-YYYY").startOf('month').subtract(1, 'day');

    calendar.find(x => x.employeeId === employeeId).calendar.forEach(shiftDay => {

      if (moment(shiftDay.day, 'DD-MM-YYYY').isAfter(lastDayOfPrevMonth) || shiftDay.shift === '' || shiftDay.shift === false) {
        return;
      }

      let shift = shifttypes.find(x => x.id === shiftDay.shift)

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
    return total;
  }

  const calcPiePercentage = (total) => {
    let contracturen = Math.round(parseInt(contracttypes.find(x => x.id === employees.find(y => y.id === employeeId).contracttype_id).wekelijkse_contract_uren) * (moment(`${month}-${year}`, "MM-YYYY").daysInMonth() / 7));

    setPercentage(Math.round((extrahistory ? extrahistory + total : total) * 100 / contracturen));
    setMaandurenVolgensContract(contracturen);
  }

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  useEffect(() => {
    let total = calcHours();
    calcPiePercentage(total);

    return () => {

    }
  }, [calendar])


  return (
    <React.Fragment>
      <div style={{ margin: '0px', padding: '0px', width: '100%', height: '100%', cursor: 'default', display: 'flex', justifyContent: 'space-around' }}
        title={`${roundToTwo(extrahistory ? extrahistory + CurrentCalendarHours : CurrentCalendarHours)} / ${MaandurenVolgensContract}  (${Percentage}%)`}>

        {Percentage !== 0 && Percentage < 100 && <div id="my-pie-chart"
          style={{
            height: '25px',
            width: '25px',
            opacity: '30%',
            borderRadius: '50%',
            position: 'absolute',
            zIndex: 0,
            background: 'conic-gradient(#7CFC00 0.00% ' + Percentage + '%,  #FF0000 ' + Percentage + '%)'
            , textAlign: 'center', alignItems: 'center', alignContent: 'center'
          }}>

        </div>}
        <div style={extrahistory + CurrentCalendarHours > 180 ? {color:'red', opacity: '100%', zIndex: 1 } : { opacity: '100%', zIndex: 1 }}>
          <b>{Math.round(extrahistory ? extrahistory + CurrentCalendarHours : CurrentCalendarHours)}</b>

        </div>

      </div>
    </React.Fragment>
  )
}

export default LastMonthHours