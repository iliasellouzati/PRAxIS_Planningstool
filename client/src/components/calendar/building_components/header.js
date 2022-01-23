import React from "react";
import * as Moment_Operations from '../../../moment_operations';

export default function CalendarHeader({ value, setValue }) {

    return (


        <div className="calendar-header">
            <div className="previous" onClick={() =>  setValue(Moment_Operations.getLastMonth_Moment(value))}>
                {String.fromCharCode(171)}Vorige maand

            </div>
            <div className="current">
                {Moment_Operations.getMonthName_String(value)} {Moment_Operations.getYear_Int(value)}
            </div>
            <div className="next" onClick={() =>  setValue(Moment_Operations.getNextMonth_Moment(value))}>
               Volgende maand{String.fromCharCode(187)}
            </div>


        </div>


    )

}