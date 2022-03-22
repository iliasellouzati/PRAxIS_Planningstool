import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import { getCalendarMoments_ArrayWithMoments } from './helpers';
import ReadOnlyShift from '../shift/ReadOnlyShift';
import ReadAndWriteShift from '../shift/ReadAndWriteShift';
import ReadAndWriteShiftContextMenu from '../contextmenu/ReadAndWriteShiftContextMenu';
import moment from 'moment';

const ReadAndWriteCalendar = ({HighlightDay, HighlightCustom}) => {

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;
    const { month, year } = useParams();

    const [Http500, setHttp500] = useState([false, ""]);
    const [ContextMenu, setContextMenu] = useState([false, []]);
    const [Loading, setLoading] = useState(true);
    const [Employees, setEmployees] = useState([]);
    const [ShiftTypes, setShiftTypes] = useState([])

    const calendarMonthHelper = getCalendarMoments_ArrayWithMoments(`${month}-${year}`);
    const cssWidthDay = (90 / (calendarMonthHelper.length)) + "%";


    const fetchData = async () => {
        await axios.get('http://127.0.0.1:3001/api/employee')
            .then(response => setEmployees(response.data))
            .catch(error => setHttp500([true, error]));

        await axios.get('http://127.0.0.1:3001/api/shifttype')
            .then(response => setShiftTypes(response.data))
            .catch(error => setHttp500([true, error]));

        setLoading(false);

    }


    useEffect(() => {

        fetchData();

    }, [])


    return (
        <React.Fragment>
            {Loading ? <LoadingSpinner /> : Http500[0] ? <Http4XXAnd5XXError error={Http500[1]} setHttp4XXAnd5XX={setHttp500} /> : (
                <React.Fragment>
                    {ContextMenu[0] && <ReadAndWriteShiftContextMenu  employees={Employees} setContextMenu={setContextMenu} content={ContextMenu[1]} />}
                    <table className="table table-bordered table-hover">

                        {/* BOVENSTE INFORMATIEVE TABELRIJ MET DAGEN */}
                        <thead>
                            <tr>
                                <th rowSpan="2" style={{ padding: "1px", width: "10%", textAlign: 'center' }}>Werknemers</th>
                                {calendarMonthHelper.map((element, index) =>
                                    <th key={index}  style={ HighlightDay[0]&& HighlightDay[1].isSame(element,'day')?{border:"3px solid gold", padding: "1px", width: { cssWidthDay } } : element === "Z" ? { border: '2px solid green', padding: "1px", width: { cssWidthDay }  } : { padding: "1px", width: { cssWidthDay } }}> {element.format('dd')} </th>
                                )}

                            </tr>
                            <tr>
                                {calendarMonthHelper.map((day, index) =>

                                    <th key={index} style={HighlightDay[0]&& HighlightDay[1].isSame(day,'day')?{border:"3px solid gold", padding: "1px", width: { cssWidthDay }} : day.isoWeekday() === 6 || day.isoWeekday() === 7 ? { border: '2px solid darkgreen', padding: "1px", width: { cssWidthDay } } : { padding: "1px", width: { cssWidthDay } }}   >
                                        {day.format("DD").toString()}
                                    </th>
                                )}

                            </tr>
                        </thead>

                        {/* INDIVIDUELE TABELRIJEN MET PLANNING/EXTRA INFO VAN WERKNEMER */}
                        <tbody>
                            {calendar.map(individueleCalendar =>
                                <tr>
                                    <td style={{ padding: "1px", textAlign: 'center', width: { cssWidthDay } }}    >
                                        {Employees.find(empl => empl.id === individueleCalendar.employeeId).naam.substring(0, 10)}
                                    </td>
                                    {individueleCalendar.calendar.map(shiftDay =>
                                        <td style={HighlightDay[0]&& HighlightDay[1].isSame(moment(shiftDay.day,"DD-MM-YYYY"),'day')?{border:"3px solid gold", padding: "0px",margin:"0px", width: { cssWidthDay }} :{ padding: "0px", width: { cssWidthDay }, margin: "0px" }}>
                                            <ReadAndWriteShift setContextMenu={setContextMenu} shiftDay={shiftDay} shifttypes={ShiftTypes} employeeId={individueleCalendar.employeeId} />
                                        </td>
                                    )}
                                </tr>

                            )}

                        </tbody>



                    </table>


                </React.Fragment>
            )}

        </React.Fragment>
    )
}

export default ReadAndWriteCalendar