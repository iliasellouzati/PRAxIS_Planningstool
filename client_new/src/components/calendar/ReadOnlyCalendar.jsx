import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import { getCalendarMoments_ArrayWithMoments } from './helpers';
import ReadOnlyShift from '../shift/ReadOnlyShift';
import moment from 'moment';

const ReadOnlyCalendar = () => {


    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;
    const { month, year } = useParams();

    const [Http500, setHttp500] = useState([false, ""]);

    const [Loading, setLoading] = useState(false);

    const [Employees, setEmployees] = useState([]);
    const [ShiftTypes, setShiftTypes] = useState([])

    const calendarMonthHelper = getCalendarMoments_ArrayWithMoments(`${month}-${year}`);
    const cssWidthDay = (90 / (calendarMonthHelper.length)) + "%";


    const fetchData = useCallback(async () => {
        await axios.get('http://127.0.0.1:3001/api/employee')
            .then(response => setEmployees(response.data))
            .catch(error => setHttp500([true, error]));

        await axios.get('http://127.0.0.1:3001/api/shifttype')
            .then(response => setShiftTypes(response.data))
            .catch(error => setHttp500([true, error]));

        setLoading(false);

    }, [])


    useEffect(() => {

        fetchData().catch(console.error);
        return () => {

        }
    }, [fetchData])


    return (
        <React.Fragment>
            {Loading ? <LoadingSpinner /> : Http500[0] ? <Http4XXAnd5XXError error={Http500[1]} setHttp4XXAnd5XX={setHttp500} /> : (
                <React.Fragment>
                    <table className="table table-bordered table-hover">

                        {/* BOVENSTE INFORMATIEVE TABELRIJ MET DAGEN */}
                        <thead  style={{ textAlign: 'center' }}>
                            <tr>
                                <th rowSpan="2" style={{ padding: "1px", width: "10%" }}>Werknemers</th>
                                {calendarMonthHelper.map((element, index) =>
                                    <th key={index} style={element === "Z" ? { outline: '1px solid green', padding: "1px", width: "100%" } : { padding: "1px", width: { cssWidthDay } }}> {element.format('dd')} </th>
                                )}

                            </tr>
                            <tr>
                                {calendarMonthHelper.map((day, index) =>

                                    <th key={index} style={day.isoWeekday() === 6 || day.isoWeekday() === 7 ? { outline: '1px solid darkgreen', padding: "1px", width: { cssWidthDay } } : { padding: "1px", width: { cssWidthDay } }}   >
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
                                        <td style={(moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 6 || moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 7) ? { outline: '2px solid darkgreen', padding: "0px", margin: "0px" } :
                                        { padding: "0px", margin: "0px" }}>
                                            <ReadOnlyShift shift={shiftDay.shift !== "" ? ShiftTypes.find(x => x.naam === shiftDay.shift) : null} shiftDay={shiftDay} />
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

export default ReadOnlyCalendar