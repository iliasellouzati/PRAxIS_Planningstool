
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeCalenderShiftType, getCalendarShifts, saveCalenderShifts } from '../store/actions/shiftActions';
import { listShiftTypes } from '../store/actions/shifttypeActions';
import * as MOMENT_OPERATIONS from '../moment_operations';
import moment from 'moment';
import { listEmployees } from '../store/actions/employeesActions';
import ShiftDay from '../components/calendar/ShiftDay';
import AantalUrenInCalendarVoorWerknemer from '../components/calendar/control_components/AantalUrenInCalendarVoorWerknemer';
import AantalUreninKwartaalVoorWerknemer from '../components/calendar/control_components/AantalUreninKwartaalVoorWerknemer';
import AantalStandByInMaandVoorWerknemer from '../components/calendar/control_components/AantalStandByInMaandVoorWerknemer';
import VerplichteShiftenControle from '../components/calendar/control_components/VerplichteShiftenControle';
import ShiftSelector from '../components/calendar/ShiftSelector';
import ShiftSelector2 from '../components/calendar/ShiftSelector2';
import axios from 'axios';
import HistoryEmployeeCalendar from '../components/calendar/HistoryEmployeeCalendar';
import HistoryEmployeeCalendar2 from '../components/calendar/HistoryEmployeeCalendar2';




function ScheduleScreen2(props) {

    const dispatch = useDispatch();
    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { datum, currentShift, calendar, loading, error, difference } = currentCalendar;

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;

    const employeesList = useSelector((state) => state.employeesList);
    const { employees } = employeesList;


    const [Finished, setFinished] = useState(false)

    const cssWidthDay = (90 / (MOMENT_OPERATIONS.getTotalDaysInCalendarMonth_Int(moment(datum, "MM-YYYY")) + 3)) + "%";

    const saveCalendarHandler = () => {
        dispatch(saveCalenderShifts(props.match.params.id, calendar));
    }

    const [Categorien, setCategorien] = useState([]);
    let categorien = [];

    const [ExtraInfoEmployees, setExtraInfoEmployees] = useState([])
    let extraInfo = [];
    const [ExtraHistorieEmployee, setExtraHistorieEmployee] = useState();

    const getHistorie = async (id) => {

        const { data } = await axios.get("/api/planning/" + id + "/" + datum);
        setExtraHistorieEmployee(data);
    }


    useEffect(() => {
        if (Finished) {
            props.history.push("/Historie");
        }
        dispatch(listEmployees());
        dispatch(listShiftTypes());
        dispatch(getCalendarShifts(props.match.params.id));
        shifttypes.forEach(shift => {
            if (!categorien.some(x => x.trim() === shift.categorie.trim())) {
                categorien.push(shift.categorie.trim());
            }
        });

        calendar.forEach(cal => extraInfo[cal.employeeId] = false);
        setExtraInfoEmployees(extraInfo);
        setExtraHistorieEmployee(false);


        setCategorien(categorien);
        return () => {

        }
    }, [Finished])

    return (
        <>
            <div className="content-wrapper">

                <div className="modal  fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog " role="document">
                        <div className="modal-content bg-success " role="document">
                            <div className="modal-header">
                                <h4 className="modal-title">Opslaan</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>{difference.new} new shifts </p>
                                <p>{difference.updated} updated shifts </p>
                                <p>{difference.same} same shifts </p>
                                <p>{difference.deleted} deleted shifts </p>

                            </div>
                            <div className="modal-footer justify-content-between">
                                <button type="button" className="btn btn-outline-light" data-dismiss="modal">Doordoen</button>
                                <button type="button" className="btn btn-outline-light" data-dismiss="modal" onClick={() => setFinished(!Finished)}>Overzicht</button>
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? (

                    <div className="overlay"><i style={{ margin: "250px" }} className="fas fa-3x fa-sync-alt fa-spin"></i></div>

                ) : error ? (<div>{error}</div>) : (
                    <div className="container-fluid">
                        {/* PLANNING DIV */}
                        <div className="row">
                            <div className="col-12">
                                <div >
                                    {/*  PLANNING */}
                                    <div className="card-header">
                                        <h3 className="card-title">{"Planning : " + datum} |   {currentShift ? currentShift : "geen shift geselecteerd"} </h3>
                                    </div>
                                    <div className="card-body">
                                        {/* PLANNING TABEL */}
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th rowSpan="2" style={{ padding: "1px", width: "10%" }}>Werknemers</th>
                                                    {MOMENT_OPERATIONS.getCalendarHeaderDays_ArrayWithString(moment(datum, "MM-YYYY")).map((element, index) =>
                                                        <th key={index} style={element === "Z" ? { border: '2px solid green', padding: "1px", width: { cssWidthDay } } : { padding: "1px", width: { cssWidthDay } }}> {element} </th>

                                                    )}
                                                    <th style={{ padding: "1px", width: { cssWidthDay }, fontSize: '12px' }}>#u</th>
                                                    <th style={{ padding: "1px", width: { cssWidthDay }, fontSize: '12px' }}>#u</th>
                                                    <th style={{ padding: "1px", width: { cssWidthDay }, fontSize: '12px' }}>#SB</th>
                                                </tr>
                                                <tr>
                                                    {MOMENT_OPERATIONS.getCalendarMonth_ArrayWithMoment(moment(datum, "MM-YYYY")).map(week =>
                                                        week.map((day, index) =>
                                                            <th key={index} style={day.isoWeekday() === 6 || day.isoWeekday() === 7 ? { border: '2px solid darkgreen', padding: "1px", width: { cssWidthDay } } : { padding: "1px", width: { cssWidthDay } }}   >
                                                                {day.format("DD").toString()}
                                                            </th>
                                                        ))}

                                                    <th style={{ padding: "1px", width: { cssWidthDay }, fontSize: '12px' }}>/m</th>
                                                    <th style={{ padding: "1px", width: { cssWidthDay }, fontSize: '12px' }}>/k</th>
                                                    <th style={{ padding: "1px", width: { cssWidthDay }, fontSize: '12px' }}>/m</th>


                                                </tr>
                                            </thead>
                                            <tbody>

                                                {calendar.map(individueleCalendar =>
                                                    <>
                                                        <tr >
                                                            <td style={{ padding: "1px", width: { cssWidthDay } }}
                                                                onClick={() => {
                                                                    let hulpArr = [...ExtraInfoEmployees];
                                                                    hulpArr[individueleCalendar.employeeId] = !ExtraInfoEmployees[individueleCalendar.employeeId];
                                                                    setExtraInfoEmployees(hulpArr);
                                                                    getHistorie(individueleCalendar.employeeId);
                                                                }}                                                            >
                                                                <i className={ExtraInfoEmployees[individueleCalendar.employeeId] ? "expandable-table-caret fas fa-caret-down fa-fw" : "expandable-table-caret fas fa-caret-right fa-fw"}></i>
                                                                {employees.find(empl => empl.id === individueleCalendar.employeeId).naam}
                                                            </td>

                                                            {individueleCalendar.employeeCalendar.map(shiftDay =>

                                                                <td style={moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 6 || moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 7 ? { border: '2px solid darkgreen', padding: "1px", width: { cssWidthDay }, height: "100%" } : { padding: "1px", width: { cssWidthDay } }}>
                                                                    <ShiftDay employeeId={individueleCalendar.employeeId} shiftDay={shiftDay} />
                                                                </td>
                                                            )}
                                                            <td style={{ padding: "1px", width: { cssWidthDay }, margin: "0px" }} ><AantalUrenInCalendarVoorWerknemer employeeCalendar={individueleCalendar.employeeCalendar} /></td>
                                                            <td style={{ padding: "1px", width: { cssWidthDay }, margin: "0px" }} ><AantalUreninKwartaalVoorWerknemer aantalUurInKwartaal={individueleCalendar.aantalUurInKwartaal} employeeCalendar={individueleCalendar.employeeCalendar} /></td>
                                                            <td style={{ padding: "1px", width: { cssWidthDay }, margin: "0px" }} ><AantalStandByInMaandVoorWerknemer employeeCalendar={individueleCalendar.employeeCalendar} /></td>
                                                        </tr>




                                                        <tr className={ExtraInfoEmployees[individueleCalendar.employeeId] ? "expandable-body" : "expandable-body d-none"}>

                                                            <HistoryEmployeeCalendar2 employeeId={individueleCalendar.employeeId} cssWidthDay={cssWidthDay} datum={datum} />



                                                        </tr>
                                                        <tr className={ExtraInfoEmployees[individueleCalendar.employeeId] ? "expandable-body" : "expandable-body d-none"}>
                                                            <td colSpan={MOMENT_OPERATIONS.getTotalDaysInCalendarMonth_Int(moment(datum, "MM-YYYY"))+4}>
                                                                 <div style={{ backgroundColor: "cyan", height: '50px' }}>
                                                                hier komt extra info later
                                                            </div>
                                                                </td>
                                                           


                                                        </tr>


                                                    </>
                                                )
                                                }
                                                {/* <tr>
                                                    <td></td>
                                                    {MOMENT_OPERATIONS.getCalendarMonth_ArrayWithMoment(moment(datum, "MM-YYYY")).map(week =>
                                                        week.map((day, index) =>
                                                            <td style={{ padding: "1px", width: { cssWidthDay }, margin: "0px" }}><VerplichteShiftenControle shiftday={day.format("DD-MM-YYYY")} /></td>))}
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>

                                                </tr>*/}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="row">



                            <div className="col-md-6">

                                <ShiftSelector2 />
                            </div>


                            {/*}               <div className="col-md-3">

                                <div class="card bg-gradient-primary collapsed-card">
                                    <div class="card-header border-0 ui-sortable-handle" style={{ cursor: "move" }}>
                                        <h3 class="card-title">
                                            Shift Selector 3
                                        </h3>
                                        <div class="card-tools">
                                            <button type="button" class="btn btn-primary btn-sm daterange" title="Date range">
                                                <i class="far fa-calendar-alt"></i>
                                            </button>
                                            <button type="button" class="btn btn-primary btn-sm" data-card-widget="collapse" title="Collapse">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="card-footer bg-transparent" style={{ display: "none" }}>
                                        <div class="row">
                                            <div class="col-4 text-center">
                                                <div id="sparkline-1"><canvas width="80" height="50" style={{ width: "80px", height: "50px" }}></canvas></div>
                                                <div class="text-white">111</div>
                                            </div>
                                            <div class="col-4 text-center">
                                                <div id="sparkline-2"><canvas width="80" height="50" style={{ width: "80px", height: "50px" }}></canvas></div>
                                                <div class="text-white">222</div>
                                            </div>
                                            <div class="col-4 text-center">
                                                <div id="sparkline-3"><canvas width="80" height="50" style={{ width: "80px", height: "50px" }}></canvas></div>
                                                <div class="text-white">333</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                                            */}

                            <div className="col-md-3">
                                {/* SHIFT SELECTOR */}
                                <div className="card">

                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="card">
                                    <div className="card">

                                        <div className="card-body">
                                            <div className="margin">

                                                <div className="btn-group" style={{ marginRight: "10px" }}>
                                                    <button onClick={() => saveCalendarHandler()} type="button" className="btn btn-success" data-toggle="modal" data-target="#exampleModal">
                                                        Afgewerkt!
                                                    </button>
                                                </div>

                                                <div className="btn-group">

                                                    <button type="button" className="btn btn-warning">Bewerkingen</button>
                                                    <button type="button" className="btn btn-warning dropdown-toggle dropdown-icon" data-toggle="dropdown" aria-expanded="false">
                                                        <span className="sr-only">Toggle Dropdown</span>
                                                    </button>
                                                    <div className="dropdown-menu" role="menu" >
                                                        <a className="dropdown-item" >Tijdelijk opslaan</a>
                                                        <a className="dropdown-item" >Alles schrappen</a>
                                                        <a className="dropdown-item" >...</a>
                                                        <div className="dropdown-divider"></div>
                                                        <a className="dropdown-item" >...</a>
                                                    </div>
                                                </div>




                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>





                    </div>
                )}


            </div>
        </>
    )
}

export default ScheduleScreen2
