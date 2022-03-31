import moment from 'moment';
import React, { useEffect, useState } from 'react'

const ReadOnlyHistoryShift = ({ shift, shiftDay }) => {
  
    let cssStyling = shift ?
      {
        backgroundColor: shift.kleurcode,
        color: shift.tekstkleurcode,
        padding: "0px",
        margin: '0px',
        textAlign: 'center',
        verticalAlign: 'middle',
        height: "27px",
        minWidth: "45px",
        fontSize: shift.standaardtekst !== "uur" ? "10px" : "",
        outline: shift.border ? "1px solid black" : ""
      }
      :
      {
        padding: "0px",
        margin: '0px',
        textAlign: 'center',
        height: "100%",
        minWidth: "45px"
      };
    function over(e) {
      if (shiftDay.shift === "") {
        e.target.style.outline = "1px solid black";
      }
    }
  
    function out(e) {
      if (shiftDay.shift === "") {
        e.target.style.outline = "";
      }
    }
  
    function roundToTwo(num) {
      return +(Math.round(num + "e+2") + "e-2");
    }
  
    const calculateShiftText = () => {
  
  
  
      let text = shift.standaardtekst === "uur" ? roundToTwo(
        moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() > 0 ?
          moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours() :
          moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shift.einduur}`), "DD-MM-YYYY-hh:mm").add(1, "day").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asHours()
      ) :
        shift.standaardtekst === "min" ?
          (moment.utc(moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shiftDay.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asMilliseconds()).format("hh:mm") > 0 ?
            moment.utc(moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shiftDay.einduur}`), "DD-MM-YYYY-hh:mm").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asMilliseconds()).format("h:mm") :
            moment.utc(moment.duration(moment((shiftDay.endmoment ? `${shiftDay.day}-${shiftDay.endmoment}` : `${shiftDay.day}-${shiftDay.einduur}`), "DD-MM-YYYY-hh:mm").add(1, "day").diff(moment((shiftDay.startmoment ? `${shiftDay.day}-${shiftDay.startmoment}` : `${shiftDay.day}-${shift.beginuur}`), "DD-MM-YYYY-hh:mm"))).asMilliseconds()).format("h:mm")
          )
          :
          shift.standaardtekst;
      return text;
    }
  
    useEffect(() => {
      if (shiftDay.shift !== '') {
        calculateShiftText();
      }
  
    }, [])
  
  
  
  
    return (
      <div style={cssStyling} onMouseOver={over} onMouseOut={out} >
  
        {shift && calculateShiftText()}
  
        <span style={{ fontSize: '0px' }}>a</span>
      </div>
  
    )
  }
  
  export default ReadOnlyHistoryShift