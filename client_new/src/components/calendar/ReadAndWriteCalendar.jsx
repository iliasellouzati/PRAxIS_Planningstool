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
import TableRowHistoryEmployee from '../calendar/TableRowHistoryEmployee';
import moment from 'moment';
import { makeObjectForAutomatisation, makeObjectForIndividualStats } from '../../mappers/statistics/DatabaseToStatisticsMapper';
import LastMonthHours from './LastMonthHours';
import CurrentMonthHours from './CurrentMonthHours';
import { mapShiftsFromDbToTotalHours } from '../../mappers/calendar/DatabaseToReduxMapper';
import ExtraInfoTableRow from './ExtraInfoEmployee/ExtraInfoTableRow';

const ReadAndWriteCalendar = ({ HighlightDay, HighlightCustom }) => {

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;
    const { month, year } = useParams();

    const [Http500, setHttp500] = useState([false, ""]);
    const [ContextMenu, setContextMenu] = useState([false, []]);
    const [Loading, setLoading] = useState(true);
    const [Employees, setEmployees] = useState([]);
    const [ShowExtraInforEmployees, setShowExtraInforEmployees] = useState([])
    const [ShiftTypes, setShiftTypes] = useState([]);
    const [ExtraHistoryCurrentYearEmployees, setExtraHistoryCurrentYearEmployees] = useState([]);
    const [ExtraHistoryLastMonth, setExtraHistoryLastMonth] = useState([]);
    const [ContractTypes, setContractTypes] = useState([]);

    const calendarMonthHelper = getCalendarMoments_ArrayWithMoments(`${month}-${year}`);
    const cssWidthDay = (90 / (calendarMonthHelper.length)) + "%";

    const fetchData = async () => {
        let shifttypes = [];

        await axios.get('http://127.0.0.1:3001/api/employee')
            .then(response => { setEmployees(response.data); setShowExtraInforEmployees(response.data.map((x) => ({ 'id': x.id, 'show': false }))) })
            .catch(error => setHttp500([true, error]));

        await axios.get('http://127.0.0.1:3001/api/shifttype')
            .then(response => {
                setShiftTypes(response.data);
                shifttypes = response.data;
            })
            .catch(error => setHttp500([true, error]));

        await axios.get(`http://localhost:3001/api/calendar/global/custom/${moment(`${year}`, 'YYYY').startOf('year').subtract(1,'day').format("DD-MM-YYYY")}/${moment(`${month}-${year}`, "MM-YYYY").endOf('year').format('DD-MM-YYYY')}`)
            .then(response => setExtraHistoryCurrentYearEmployees(makeObjectForIndividualStats(response.data, shifttypes,year)))
            .catch(error => setHttp500([true, error]));

        await axios.get(`http://localhost:3001/api/calendar/global/custom/${moment(`${month}-${year}`, 'MM-YYYY').subtract(1, 'month').startOf('month').startOf('isoWeek').subtract(1, 'day').format("DD-MM-YYYY")}/${moment(`${month}-${year}`, "MM-YYYY").startOf('month').startOf('isoWeek').subtract(1, 'day').format('DD-MM-YYYY')}`)
            .then(response => setExtraHistoryLastMonth(mapShiftsFromDbToTotalHours(moment(`${month}-${year}`, "MM-YYYY").subtract(1, 'month').format("MM-YYYY"), response.data, shifttypes)))
            .catch(error => setHttp500([true, error]));

        await axios.get('http://127.0.0.1:3001/api/contracttype')
            .then(response => setContractTypes(response.data))
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
                    {ContextMenu[0] && <ReadAndWriteShiftContextMenu employees={Employees} setContextMenu={setContextMenu} content={ContextMenu[1]} />}
                    <table className="table table-bordered table-hover ">

                        {/* BOVENSTE INFORMATIEVE TABELRIJ MET DAGEN */}
                        <thead style={{ textAlign: 'center' }}>
                            <tr >
                                <th rowSpan="2" style={{ padding: "1px", width: "10%" }}>Werknemers</th>
                                {calendarMonthHelper.map((element, index) =>
                                    <th key={index} style={HighlightDay[0] && HighlightDay[1].isSame(element, 'day') ? { outline: "2px solid red", padding: "1px", width: { cssWidthDay } } : (element.isoWeekday() === 6 || element.isoWeekday() === 7) ? { outline: '1px solid darkgreen', padding: "1px", width: { cssWidthDay } } : { padding: "1px", width: { cssWidthDay } }}> {element.format('dd')} </th>
                                )}
                                <th rowSpan="2" style={{ padding: "1px", minWidth: "38px" }}>{moment(month, "MM").subtract(1, 'month').format("MM")}<p style={{ padding: "0px", margin: "0px" }}>&#x027EA;</p></th>
                                <th rowSpan="2" style={{ padding: "1px", minWidth: "38px", }}>{month}<p style={{ padding: "0px", margin: "0px" }}>&#x021D3;</p></th>


                            </tr>
                            <tr>
                                {calendarMonthHelper.map((day, index) =>

                                    <th
                                        key={index}
                                        style={
                                            HighlightDay[0] && HighlightDay[1].isSame(day, 'day') ?
                                                { outline: "2px solid red", padding: "1px", width: { cssWidthDay } }
                                                :
                                                day.isoWeekday() === 6 || day.isoWeekday() === 7 ?
                                                    { outline: '1px solid darkgreen', padding: "1px", width: { cssWidthDay } }
                                                    : { padding: "1px", width: { cssWidthDay } }}
                                    >
                                        {day.format("DD").toString()}
                                    </th>
                                )}



                            </tr>
                        </thead>



                        {/* INDIVIDUELE TABELRIJEN MET PLANNING/EXTRA INFO VAN WERKNEMER */}
                        <tbody>
                            {calendar.map(individueleCalendar =>
                                <React.Fragment>
                                    <tr>
                                        <td style={{ padding: "1px", width: '10%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                            onClick={() => {
                                                let index = ShowExtraInforEmployees.findIndex(x => x.id === individueleCalendar.employeeId);
                                                let object = [...ShowExtraInforEmployees];
                                                object[index].show = !object[index].show;
                                                setShowExtraInforEmployees(object);
                                            }}

                                        >
                                            <i className={ShowExtraInforEmployees.find(x => x.id === individueleCalendar.employeeId).show ? "expandable-table-caret fas fa-caret-down fa-fw" : "expandable-table-caret fas fa-caret-right fa-fw"}></i>

                                            {[Employees.find(empl => empl.id === individueleCalendar.employeeId)].map(em => `${em.voornaam[0].toUpperCase()}${em.voornaam.slice(1)} ${em.familienaam.substring(0, 1).toUpperCase()}. id:${individueleCalendar.employeeId}`)}
                                        </td>
                                        {individueleCalendar.calendar.map(shiftDay =>
                                            shiftDay.shift === false ?
                                                <td style={{ backgroundColor: 'black' }}>

                                                </td> :
                                                <td
                                                    style={
                                                        (HighlightDay[0] || HighlightCustom[0]) &&
                                                            (
                                                                (HighlightDay[0] && HighlightDay[1].isSame(moment(shiftDay.day, "DD-MM-YYYY"), 'day'))
                                                                ||
                                                                (HighlightCustom[0] && HighlightCustom[1].employeeId === individueleCalendar.employeeId && HighlightCustom[1].start.clone().subtract(1, 'day').isBefore(moment(shiftDay.day, 'DD-MM-YYYY'), 'day') && HighlightCustom[1].end.clone().add(1, 'day').isAfter(moment(shiftDay.day, 'DD-MM-YYYY'), 'day'))
                                                            )
                                                            ? { outline: "2px solid red", padding: "0px", margin: "0px" }
                                                            : (moment(shiftDay.day, "DD/MM/YYYY").isoWeekday() === 6 || moment(shiftDay.day, "DD/MM/YYYY").isoWeekday() === 7) ? { outline: '1px solid darkgreen', padding: "0px", margin: "0px" } :
                                                                { padding: "0px", margin: "0px" }}>
                                                    <ReadAndWriteShift setContextMenu={setContextMenu} shiftDay={shiftDay} shifttypes={ShiftTypes} employeeId={individueleCalendar.employeeId} />
                                                </td>
                                        )}
                                        <td style={{ padding: "1px", minWidth: "38px",maxWidth:'45px', textAlign: 'center' }}><LastMonthHours employeeId={individueleCalendar.employeeId} employees={Employees} contracttypes={ContractTypes} extrahistory={ExtraHistoryLastMonth[`${individueleCalendar.employeeId}`]} shifttypes={ShiftTypes} /></td>
                                        <td style={{ padding: "1px", minWidth: "38px", maxWidth:'45px',textAlign: 'center' }}><CurrentMonthHours employeeId={individueleCalendar.employeeId} employees={Employees} contracttypes={ContractTypes} shifttypes={ShiftTypes} /></td>
                                    </tr>
                                    {/* TABELRIJ MET HISTORIEKE PLANNING VAN WERKNEMER */}
                                    <tr className={ShowExtraInforEmployees.find(x => x.id === individueleCalendar.employeeId).show ? "expandable-body" : "expandable-body d-none"}>
                                        <TableRowHistoryEmployee shifttypes={ShiftTypes} employeeId={individueleCalendar.employeeId} length={calendarMonthHelper.length} />
                                    </tr>

                                    {/* TABELRIJ MET EXTRA INFO VAN WERKNEMER */}
                                    <tr className={ShowExtraInforEmployees.find(x => x.id === individueleCalendar.employeeId).show ? "expandable-body" : "expandable-body d-none"}>
                                        <td colSpan={calendarMonthHelper.length + 3}>
                                            <ExtraInfoTableRow stats={ExtraHistoryCurrentYearEmployees[`${individueleCalendar.employeeId}`]}  />
                                        </td>
                                    </tr>


                                </React.Fragment>
                            )}
                            {false &&
                                <tr>
                                    <td colSpan={calendarMonthHelper.length + 1} style={{ textAlign: "center", color: 'red', fontWeight: 'bold', padding: "0px", margin: "0px" }}>
                                        !Onderstaande operatoren hebben shiften op de planning zonder contract, GET YOUR SHIT TOGHETER!
                                    </td>
                                </tr>
                            }
                        </tbody>



                    </table>


                </React.Fragment>
            )}

        </React.Fragment>
    )
}

export default ReadAndWriteCalendar