import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeCalenderShiftType, getCalendarShifts, saveCalenderShifts } from '../store/actions/shiftActions';
import { listShiftTypes } from '../store/actions/shifttypeActions';
import { listContractTypes } from '../store/actions/contracttypeActions';
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

import Stap1Beta from '../components/calendar/Stap1Beta';
import Stap2Beta from '../components/calendar/Stap2Beta';
import Stap3Beta from '../components/calendar/Stap3Beta';
import Stap5Beta from '../components/calendar/Stap5Beta';
import Stap6Beta from '../components/calendar/Stap6Beta';
import BetaBezettingsgraad from "../components/calendar/BetaBezettingsgraad";
import Stap6WeekPlanning from '../components/calendar/control_components/Stap6WeekPlanning';



const BetaScreen = (props) => {



    const dispatch = useDispatch();

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { datum, currentShift, calendar, loading, error, difference } = currentCalendar;

    const [Loading, setLoading] = useState(false)

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;

    const employeesList = useSelector((state) => state.employeesList);
    const { employees } = employeesList;

    const contracttypeList = useSelector((state) => state.contracttypeList);
    const { contracttypes } = contracttypeList;

    const [Stap6Week, setStap6Week] = useState();

    const [Finished, setFinished] = useState(false)

    const cssWidthDay = (90 / (MOMENT_OPERATIONS.getTotalDaysInCalendarMonth_Int(moment(datum, "MM-YYYY")) + 3)) + "%";

    const saveCalendarHandler = () => {
        dispatch(saveCalenderShifts('03-2021', calendar));
    }

    const [ExtraInfoEmployees, setExtraInfoEmployees] = useState([])
    let extraInfo = [];

    const progressText = [
        "STAP 1: Geef alle ONAANPASBARE VASTE SHIFTEN in ( vb verlof, uitzondering, opleidingen,....)",
        "STAP 2: Geef de planning in van werknemers zonder operator of 4/5'en contract",
        "STAP 3: Geef het aantal operatorshiften in voor deze mensen",
        "STAP 4: Geef de planning in van werknemers met operator of 4/5'en contract",
        "STAP 5: Geef het aantal operatorshiften in voor deze mensen",
        "STAP 6: lets try this shit!"
    ]

    const [Progress, setProgress] = useState(0)


    useEffect(() => {
        if (Finished) {
            props.history.push("/Historie");
        }

        dispatch(listContractTypes());
        dispatch(listEmployees());
        dispatch(listShiftTypes());
        dispatch(getCalendarShifts('03-2021'));

        calendar.forEach(cal => extraInfo[cal.employeeId] = false);
        setExtraInfoEmployees(extraInfo);
        return () => {

        }
    }, [Finished])

    return (

        <div className="content-wrapper">
            {/* OVERLAY MODAL MET SAMENVATTING NA OPSLAAN */}
            <div className="modal  fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog " role="document">
                    <div className="modal-content bg-success " role="document">
                        <div className="modal-header">
                            <h4 className="modal-title">Opslaan</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">X</span>
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

            {loading ? (<div className="overlay"><i style={{ margin: "250px" }} className="fas fa-3x fa-sync-alt fa-spin"></i></div>) :
                error ? (<div>{error}</div>) : (
                    <div className="container-fluid">

                        {/* PLANNING DIV */}
                        <div className="row">
                            <div className="col-12">
                                <div >

                                    {/*  PLANNING TITEL */}
                                    <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", marginTop: "5px" }}>
                                        <h3 className="card-title">{"Planning : " + datum} |   {currentShift ? currentShift : "geen shift geselecteerd"} </h3>
                                        <div id="myProgress" style={{ width: "70%", backgroundColor: "gray", height: "5px" }}>
                                            <div id="myBar" style={{ width: ((Progress) * 100 / 6) + '%', height: "5px", backgroundColor: "green" }}></div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <i style={{ color: "red", fontSize: "27px", border: "1px dashed black", width: "10%" }} class="fas fa-arrow-left fa-fw" onClick={() => setProgress(Progress - 1)} />
                                                <span style={{ marginRight: "10px" }} >{progressText[Progress]}</span>
                                                <i style={{ color: "red", fontSize: "27px", border: "1px dashed black", width: "10%" }} class="fas fa-arrow-right fa-fw" onClick={() => setProgress(Progress + 1)} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* PLANNING TABEL */}
                                    <div className="card-body">
                                        {Progress !== 4 &&
                                            <table className="table table-bordered table-hover">

                                                {/* BOVENSTE INFORMATIEVE TABELRIJ MET DAGEN */}
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

                                                {/* INDIVIDUELE TABELRIJEN MET PLANNING/EXTRA INFO VAN WERKNEMER */}
                                                <tbody>
                                                    {calendar.map(individueleCalendar =>
                                                        <>
                                                            {/* TABELRIJ MET EFFECTIEVE PLANNING VAN WERKNEMER */}
                                                            <tr style={{
                                                                border: (Progress === 1 || Progress === 2) &&
                                                                    employees.find(x => x.id === individueleCalendar.employeeId).contracttype !== "4-5" &&
                                                                    employees.find(x => x.id === individueleCalendar.employeeId).contracttype !== "operator" ?
                                                                    "3px solid red" : (Progress === 3 || Progress === 4) && (
                                                                        employees.find(x => x.id === individueleCalendar.employeeId).contracttype === "4-5" ||
                                                                        employees.find(x => x.id === individueleCalendar.employeeId).contracttype === "operator") ? "3px solid red" : "",

                                                                backgroundColor: (Progress === 1 || Progress === 2) && (
                                                                    employees.find(x => x.id === individueleCalendar.employeeId).contracttype === "4-5" ||
                                                                    employees.find(x => x.id === individueleCalendar.employeeId).contracttype === "operator") ?
                                                                    "darkgray" : (Progress === 3 || Progress === 4) && (
                                                                        employees.find(x => x.id === individueleCalendar.employeeId).contracttype !== "4-5" &&
                                                                        employees.find(x => x.id === individueleCalendar.employeeId).contracttype !== "operator") ? "darkgray" : "",
                                                            }} >
                                                                <td
                                                                    style={{ padding: "1px", width: { cssWidthDay } }}
                                                                    onClick={() => {
                                                                        let hulpArr = [...ExtraInfoEmployees];
                                                                        hulpArr[individueleCalendar.employeeId] = !ExtraInfoEmployees[individueleCalendar.employeeId];
                                                                        setExtraInfoEmployees(hulpArr);
                                                                    }}>
                                                                    <i className={ExtraInfoEmployees[individueleCalendar.employeeId] ? "expandable-table-caret fas fa-caret-down fa-fw" : "expandable-table-caret fas fa-caret-right fa-fw"}></i>
                                                                    {employees.find(empl => empl.id === individueleCalendar.employeeId).naam}
                                                                </td>
                                                                {individueleCalendar.employeeCalendar.map(shiftDay =>
                                                                    Progress===5&&Stap6Week?.isSame(moment(shiftDay.day, "DD-MM-YYYY"), 'day') && ["operator", "4-5"].includes(employees.find(empl => empl.id === individueleCalendar.employeeId).contracttype) ?
                                                                        <td colSpan={7} style={{ padding: "0px", margin: "0px", textAlign: "center" }}>
                                                                            <div style={{ padding: "0px", margin: "0px", border: "2px solid red" }}><Stap6WeekPlanning id={individueleCalendar.employeeId} datum={moment(datum, "MM-YYYY").format("YYYY")} /></div>
                                                                        </td>
                                                                        : !["operator", "4-5"].includes(employees.find(empl => empl.id === individueleCalendar.employeeId).contracttype) ?
                                                                            <td style={moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 6 || moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 7 ? { border: '2px solid darkgreen', padding: "1px", width: { cssWidthDay }, height: "100%" } : { padding: "1px", width: { cssWidthDay } }}>
                                                                                <ShiftDay employeeId={individueleCalendar.employeeId} shiftDay={shiftDay} />
                                                                            </td> :
                                                                            !Stap6Week?.isSame(moment(shiftDay.day, "DD-MM-YYYY"), 'isoWeek') &&
                                                                            <td style={moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 6 || moment(shiftDay.day, "DD-MM-YYYY").isoWeekday() === 7 ? { border: '2px solid darkgreen', padding: "1px", width: { cssWidthDay }, height: "100%" } : { padding: "1px", width: { cssWidthDay } }}>
                                                                                <ShiftDay employeeId={individueleCalendar.employeeId} shiftDay={shiftDay} />
                                                                            </td>
                                                                )}
                                                                <td style={{ padding: "1px", width: { cssWidthDay }, margin: "0px" }} ><AantalUrenInCalendarVoorWerknemer employeeCalendar={individueleCalendar.employeeCalendar} /></td>
                                                                <td style={{ padding: "1px", width: { cssWidthDay }, margin: "0px" }} ><AantalUreninKwartaalVoorWerknemer aantalUurInKwartaal={individueleCalendar.aantalUurInKwartaal} employeeCalendar={individueleCalendar.employeeCalendar} /></td>
                                                                <td style={{ padding: "1px", width: { cssWidthDay }, margin: "0px" }} ><AantalStandByInMaandVoorWerknemer employeeCalendar={individueleCalendar.employeeCalendar} /></td>
                                                            </tr>

                                                            {/* TABELRIJ MET HISTORIEKE PLANNING VAN WERKNEMER */}
                                                            <tr className={ExtraInfoEmployees[individueleCalendar.employeeId] ? "expandable-body" : "expandable-body d-none"}>
                                                                <HistoryEmployeeCalendar2 employeeId={individueleCalendar.employeeId} cssWidthDay={cssWidthDay} datum={datum} />
                                                            </tr>

                                                            {/* TABELRIJ MET EXTRA INFO VAN WERKNEMER */}
                                                            <tr className={ExtraInfoEmployees[individueleCalendar.employeeId] ? "expandable-body" : "expandable-body d-none"}>
                                                                <td colSpan={MOMENT_OPERATIONS.getTotalDaysInCalendarMonth_Int(moment(datum, "MM-YYYY")) + 4}>
                                                                    <div style={{ backgroundColor: "cyan", height: '50px' }}>
                                                                        hier komt extra info later
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )}

                                                </tbody>



                                            </table>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ROW ONDER KALENDER */}
                        <div className="row">


                            {Progress !== 2 && Progress !== 4 && Progress !== 5 ?
                                (<>
                                    {/* SHIFT SELECTOR */}
                                    < div className="col-md-5">
                                        <ShiftSelector2 />
                                    </div>

                                    {/* BETA KOLOM */}
                                    <div className="col-md-5">
                                        <div className="card" style={{ minHeight: '200px' }}>
                                            <div className="card-header">
                                                {progressText[Progress]}
                                            </div>
                                            {
                                                {
                                                    0:
                                                        <div className="card-body">
                                                            <Stap1Beta />
                                                        </div>,

                                                    1:
                                                        <div className="card-body">
                                                            <Stap2Beta />
                                                        </div>,
                                                    3:
                                                        <div className="card-body">
                                                            Not implemented yet!
                                                        </div>

                                                }[Progress]
                                            }


                                        </div>
                                    </div>
                                </>)
                                :
                                (






                                    <div className="col-md-10">

                                        <div className="card" style={{ minHeight: '200px' }}>
                                            <div className="card-header">
                                                {progressText[Progress]}
                                            </div>
                                            {
                                                {
                                                    2:
                                                        <div className="card-body">
                                                            <Stap3Beta />
                                                        </div>,

                                                    4:
                                                        <div className="card-body">
                                                            <Stap5Beta />
                                                        </div>,
                                                    5:
                                                        <div className="card-body">
                                                            <Stap6Beta setStap6Week={setStap6Week} />
                                                        </div>,
                                                }[Progress]
                                            }


                                        </div>


                                    </div>)

                            }


                            {/* BUTTONS OM PLANNING OP TE SLAAN */}
                            <div className="col-md-2">
                                <div className="card">
                                    <div className="card-body" style={{ display: 'flex', alignContent: "center", flexDirection: "column" }}>
                                        <div className="btn-group" style={{ margin: "5px" }}>
                                            <button onClick={() => saveCalendarHandler()} type="button" className="btn btn-success" data-toggle="modal" data-target="#exampleModal">
                                                OPSLAAN !
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
                                {Progress > 1 &&
                                    <div className="card">
                                        <BetaBezettingsgraad />
                                    </div>
                                }



                            </div>

                        </div>

                    </div>
                )
            }


        </div >

    )
}

export default BetaScreen
