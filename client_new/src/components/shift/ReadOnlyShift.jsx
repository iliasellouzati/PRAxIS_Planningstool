import React from 'react';
import moment from 'moment';

const ReadOnlyShift = ({shift, width}) => {


  let cssStyling = shift ? { backgroundColor: shift.kleurcode, color: shift.tekstkleurcode,padding:"0px", margin:'0px', textAlign: 'center', height: "100%", width: "100%",fontSize: shift.standaardtekst === "min" ?"10px":"", outline: shift.border ? "2px solid black" : "" } : { padding:"0px", margin:'0px', textAlign: 'center', height: "100%", width: "100%" };

  return (
    <div style={{
        backgroundColor: shift?.kleurcode,
        color: shift?.tekstkleurcode,
        textAlign: 'center',
        height: '100%',
        width: '100%',
        border: (shift?.border ? "2px solid black" : ""),
        padding:"0px",
         margin:'0px'
      }}>
        {shift?.standaardtekst === "uur" ? (
          moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() > 0 ?
            parseInt(moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours()) :
            parseInt(moment.duration(moment(shift.einduur, "hh:mm").add(1, "day").diff(moment(shift.beginuur, "hh:mm"))).asHours())
        ) :
          shift?.standaardtekst === "min" ?
            moment.utc(moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asMilliseconds()).format("h:mm")
            :
            shift?.standaardtekst}
      </div>

  )
}

export default ReadOnlyShift