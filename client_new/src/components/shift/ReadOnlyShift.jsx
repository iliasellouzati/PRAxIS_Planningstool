import React from 'react';
import moment from 'moment';

const ReadOnlyShift = ({shift, width}) => {

  return (
    <div style={{
        backgroundColor: shift.kleurcode,
        color: shift.tekstkleurcode,
        textAlign: 'center',
        height: '100%',
        width: width,
        border: (shift.border ? "2px solid black" : ""),
      }}>
        {shift.standaardtekst === "uur" ? (
          moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() > 0 ?
            moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() :
            moment.duration(moment(shift.einduur, "hh:mm").add(1, "day").diff(moment(shift.beginuur, "hh:mm"))).asHours()
        ) :
          shift.standaardtekst === "min" ?
            moment.utc(moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asMilliseconds()).format("hh:mm")
            :
            shift.standaardtekst}
      </div>

  )
}

export default ReadOnlyShift