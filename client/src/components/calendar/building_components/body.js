import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Moment_Operations from '../../../moment_operations';
import { listEmployees } from '../../../store/actions/employeesActions';
import dayStyles from '../building_components/styles';
import AantalstandbyWerknemer from '../control_components/aantalStandbyWerknemer';
import KwartaalUrenWerknemer from '../control_components/kwartaalUrenWerknemer';
import MaandUrenWerknemer from '../control_components/maandUrenWerknemer';
import ShiftBox from '../control_components/shiftbox';
import DagControlebox from '../control_components/dagControleBox';
import moment from 'moment';



export default function Body({ value, setValue, calendar, possibleShifts, currentShift }) {

    const dispatch = useDispatch();

    const employeesList = useSelector((state) => state.employeesList);
    const { employees } = employeesList;

    const calendarList = useSelector((state) => state.calendarList);
    const { shiftcalendar, loading, error } = calendarList;


    const [TotaleUrenWerknemers, setTotaleUrenWerknemers] = useState([]);

    let headerDays = Moment_Operations.getCalendarHeaderDays_ArrayWithString(value);

    //hulpindex voor keys list ( foutmelding chrome)
    let i = 0;


    const berekenenUren = () => {
        let hulpItterator = 1;
        let totalUrenWerknemers = [];

        shiftcalendar.forEach((emplo) => {
            let counter = 0;
            if (emplo!==[""]) {
                emplo.forEach((obj) => {
                    // console.log(obj);
                    if (obj.shift !== '') {
                        switch (obj.shift) {
                            case "standby":
                                break;

                            default:
                                counter += 12;
                                break;
                        }

                    }
                }, 0);

                totalUrenWerknemers[hulpItterator++] = counter;
            }
        })
            
        return totalUrenWerknemers;
    }





    const saveCalendar = () => {

    }

    useEffect(() => {

        dispatch(listEmployees());

    




        return () => {

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])


    return (
        <>
            <div className="calendar-body">
                {loading ? (<div>Loading...</div>) : error ? (<div>{error}</div>) : (
                    <table className="table">
                        {/*----------TABLE HEADER---------*/}
                        <thead >

                            <tr>
                                <th className="calendar-name-employee" rowSpan="2" >employees</th>
                                {/*----------M - D - W - D - V - Z - Z ---------*/}
                                {
                                    [...headerDays].map((element, index) =>
                                        <th key={index} style={element === "Z" ? { border: '2px solid darkgreen' } : {}} className={calendar.length === 42 ? "calendar-day42" : "calendar-day35"}  > {element} </th>

                                    )
                                }
                                <th className="calendar-name-employee" rowSpan="2" >Extra</th>
                            </tr>

                            <tr>
                                {/*----------1 - 2 - 3 - 4 - 5 - 6 - 7 ... ---------*/}
                                {calendar.map(week =>
                                    week.map(day =>
                                        <th key={i++} className={calendar.length === 42 ? "calendar-day42" : "calendar-day35"} onClick={() => setValue(day)}>
                                            <div style={day.isoWeekday() === 6 || day.isoWeekday() === 7 ? { border: '2px solid darkgreen' } : {}} className={dayStyles(day, value)}> {day.format("D").toString()}</div>
                                        </th>)
                                )
                                }
                            </tr>

                        </thead>

                        <tbody >
                            {/*----------TABLE ROWS MET EMPLOYEE EN DAYS EN CONTROLEBOXEN---------*/}
                            {employees.map((employee) => (
                                <tr key={i++}>
                                    {/*----------EMPLOYEE NAME ---------*/}
                                    <td className="calendar-name-employee">
                                        {employee.naam}
                                    </td>
                                    {/*----------CALENDAT SHIFTS ---------*/}
                                    {calendar.map(week =>
                                        week.map(day =>
                                            <td key={i++} style={day.isoWeekday() === 6 || day.isoWeekday() === 7 ? { border: '2px solid darkgreen' } : {}} className={calendar.length === 42 ? "calendar-day42" : "calendar-day35"}  >
                                                <ShiftBox
                                                    employeeId={employee.id}
                                                    day={day.format("DD-MM-YYYY")}
                                                    TotaleUrenWerknemers={TotaleUrenWerknemers}
                                                    setTotaleUrenWerknemers={setTotaleUrenWerknemers}
                                                    dispatch={dispatch}
                                                    CalendarShifts={shiftcalendar}
                                                    currentShift={currentShift}
                                                    possibleShifts={possibleShifts} />
                                            </td>)
                                    )
                                    }
                                    {/*----------CONTROLE BOX ---------*/}
                                    <td className='calendar-name-employee-extra' >
                                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <MaandUrenWerknemer totaleUren={TotaleUrenWerknemers[employee.id]} />
                                            <KwartaalUrenWerknemer totaleUren={TotaleUrenWerknemers[employee.id]} />
                                            <AantalstandbyWerknemer werknemershiften={shiftcalendar[employee.id]} />

                                        </div>
                                    </td>
                                </tr>
                            ))}

                            <tr style={{ height: '80px' }}>
                                <td>


                                </td>
                                {calendar.map(week =>
                                    week.map(day =>
                                        <th key={i++} className={calendar.length === 42 ? "calendar-day42" : "calendar-day35"} >
                                            <DagControlebox geplandeShifts={shiftcalendar[1] ? shiftcalendar.map(empl => empl.reduce(function (filtered, option) { if (option.shift !== '' && option.day === day.format("DD-MM-YYYY")) { filtered.push(option.shift) } return filtered; }, [])) : []} day={calendar[0]} verplichteShiften={possibleShifts.slice(0, 5)} />
                                        </th>
                                    )
                                )
                                }

                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                        <button onClick={() => {
                                            setValue(moment());
                                        }}>reset</button>
                                        <button onClick={() => saveCalendar()}>Save!</button>
                                    </div>

                                </td>


                            </tr>
                        </tbody>
                    </table>

                )}
            </div>


        </>
    )
}
