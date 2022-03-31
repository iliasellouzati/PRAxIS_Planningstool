import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReadOnlyShift from '../shift/ReadOnlyShift';
import { getCalendarMoments_ArrayWithMoments } from './helpers';

const ReadOnlySavedCalendar = ({ Employees, Shifttypes }) => {

    const { month, year, version } = useParams();

    const calendarMonthHelper = getCalendarMoments_ArrayWithMoments(`${month}-${year}`);
    const cssWidthDay = (90 / (calendarMonthHelper.length)) + "%";


    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;

    return (

        <React.Fragment>
            <table className="table table-bordered table-hover">

                {/* BOVENSTE INFORMATIEVE TABELRIJ MET DAGEN */}
                <thead>
                    <tr>
                        <th rowSpan="2" style={{ padding: "1px", width: "10%" }}>Werknemers</th>
                        {calendarMonthHelper.map((element, index) =>
                            <th key={index} style={element === "Z" ? { border: '2px solid green', padding: "1px", width: "100%" } : { padding: "1px", width: { cssWidthDay } }}> {element.format('dd')} </th>
                        )}

                    </tr>
                    <tr>
                        {calendarMonthHelper.map((day, index) =>

                            <th key={index} style={day.isoWeekday() === 6 || day.isoWeekday() === 7 ? { border: '2px solid darkgreen', padding: "1px", width: { cssWidthDay } } : { padding: "1px", width: { cssWidthDay } }}   >
                                {day.format("DD").toString()}
                            </th>
                        )}

                    </tr>
                </thead>

                {/* INDIVIDUELE TABELRIJEN MET PLANNING/EXTRA INFO VAN WERKNEMER */}
                <tbody>
                    {calendar.map(individueleCalendar =>
                        <tr>
                            <td style={{ padding: "1px", width: { cssWidthDay } }}    >
                                {Employees.find(empl => empl.id === individueleCalendar.employeeId)?.voornaam}
                            </td>
                            {individueleCalendar.calendar.map(shiftDay =>
                                <td style={{ padding: "0px", maxWidth: { cssWidthDay }, height: "100%", margin: "0px" }}>
                                    <ReadOnlyShift shift={shiftDay.shift !== "" ? Shifttypes.find(x => x.naam === shiftDay.shift) : null} shiftDay={shiftDay} />
                                </td>
                            )}
                        </tr>

                    )}

                </tbody>



            </table>


        </React.Fragment>

    )
}

export default ReadOnlySavedCalendar