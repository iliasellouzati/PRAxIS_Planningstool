/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getCalendarMoments_ArrayWithMoments } from '../../components/calendar/helpers';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import WeeklyConfigs from '../../components/calendar/WeeklyConfigs';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { mapShiftsFromDbToAutomatisation } from '../../mappers/calendar/DatabaseToReduxMapper';

const AutomatisatieV1 = ({ INIT_StartUpMainWorkerForAutomatisation }) => {

    const { month, year } = useParams();

    const [Http500, setHttp500] = useState([false, ""]);

    const [Loading, setLoading] = useState(true);
    const [Employees, setEmployees] = useState([]);

    const [WeeklyStructures, setWeeklyStructures] = useState([]);

    const [Config, setConfig] = useState({})
    const calendarMonthHelper = getCalendarMoments_ArrayWithMoments(month);

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;

    const [Option, setOption] = useState(0);



    const startAutomatisation = async () => {

        let previousWeeks = await axios.get(`http://127.0.0.1:3001/api/calendar/global/custom/${moment(`${month}-${year}`, "MM-YYYY").startOf('month').startOf('isoWeek').subtract(1, 'week').format("DD-MM-YYYY")}/${moment(`${month}-${year}`, "MM-YYYY").startOf('month').startOf('isoWeek').subtract(1, 'day').format("DD-MM-YYYY")}`);

        previousWeeks = mapShiftsFromDbToAutomatisation(month, previousWeeks.data, Employees);
        const missingShiftsWeek = checkOntbrekendeShiften();

        INIT_StartUpMainWorkerForAutomatisation(["INIT", {
            "weeklyStructures": WeeklyStructures,
            "employees": Employees,
            "config": Config,
            "previousWeeks": previousWeeks,
            "missingShiftsWeek": missingShiftsWeek,
            "WeekNumber": "1",
            "numberOfWeeks": calendarMonthHelper.length / 7
        }]);

    }
    const checkOntbrekendeShiften = () => {
        let hulpCalenderMetOntbrekendeShiften = [];
        let verplichteShiften = ["0618", "0719", "1806", "1907"];

        for (let index = 0; index < calendarMonthHelper.length / 7; index++) {
            hulpCalenderMetOntbrekendeShiften.push(Array(7).fill(0).map(() => verplichteShiften));
        }

        calendar.forEach(empl => {
            empl.calendar.forEach((shiftDay, index) => {

                if (verplichteShiften.includes(shiftDay.shift)) {
                    let hulpVal = hulpCalenderMetOntbrekendeShiften[Math.floor(index / 7)][index % 7];
                    hulpVal = hulpVal.filter(x => x !== shiftDay.shift);
                    hulpCalenderMetOntbrekendeShiften[Math.floor(index / 7)][index % 7] = hulpVal;
                }
            })
        })
        return hulpCalenderMetOntbrekendeShiften;
    }


    const init = (employees) => {
        let config = [];
        employees.forEach(empl => {
            config.push({
                "employeeId": empl.id,
                "totalShifts": empl.contracttype.trim() === "operator" ? 14 : 11,
                "1": {
                    "night": false,
                    "weekend": false
                },
                "2": {
                    "night": false,
                    "weekend": false
                },
                "3": {
                    "night": false,
                    "weekend": false
                },
                "4": {
                    "night": false,
                    "weekend": false
                },

                "5": {
                    "night": false,
                    "weekend": false
                }
                ,
                "6": {
                    "night": false,
                    "weekend": false
                }
            })
        })
        setConfig(config);
    }

    const TEMP_INIT_VALUES = () => {
        let config = [...Config];
        for (let index1 = 0; index1 < config.length; index1++) {

            for (let index2 = 1; index2 <= 6; index2++) {
                switch (index1) {
                    case 1:
                        switch (index2) {
                            case 1:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": true
                                }
                                break;
                            case 2:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": false
                                }
                                break;
                            case 3:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": true
                                }
                                break;
                            case 4:
                            case 5:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": true
                                }
                                break;
                            default:
                                break;
                        }
                        break;


                    case 2:
                        switch (index2) {
                            case 1:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": true
                                }
                                break;
                            case 2:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": true
                                }
                                break;
                            case 3:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": false
                                }
                                break;
                            case 4:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": true
                                }
                                break;
                            case 5:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": false
                                }
                                break;
                            default:
                                break;
                        }
                        break;

                    case 4:
                        switch (index2) {
                            case 1:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": true
                                }
                                break;
                            case 2:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": false
                                }
                                break;
                            case 3:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": true
                                }
                                break;
                            case 4:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": false
                                }
                                break;
                            case 5:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": true
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                    case 5:
                        switch (index2) {
                            case 1:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": false
                                }
                                break;
                            case 2:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": true
                                }
                                break;
                            case 3:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": false
                                }
                                break;
                            case 4:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": false
                                }
                                break;
                            case 5:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": true
                                }
                                break;
                            default:
                                break;
                        }
                        break;

                    case 6:
                        switch (index2) {
                            case 1:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": false
                                }
                                break;
                            case 2:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": true
                                }
                                break;
                            case 3:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": true
                                }
                                break;
                            case 4:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": true
                                }
                                break;
                            case 5:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": true
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                    case 7:
                        switch (index2) {
                            case 1:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": true
                                }
                                break;
                            case 2:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": false
                                }
                                break;
                            case 3:
                                config[index1][`${index2}`] = {
                                    "night": false,
                                    "weekend": true
                                }
                                break;
                            case 4:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": false
                                }
                                break;
                            case 5:
                                config[index1][`${index2}`] = {
                                    "night": true,
                                    "weekend": false
                                }
                                break;
                            default:
                                break;
                        }
                        break;

                    default:
                        break;
                }

            }
        }
        setConfig(config);

    }
    const fetchData = useCallback(async () => {
        const employees = await axios.get('http://127.0.0.1:3001/api/employee')
            .then(response => {
                setEmployees(response.data.filter(empl => ["operator", "4-5"].includes(empl.contracttype.trim())));
                return response.data.filter(empl => ["operator", "4-5"].includes(empl.contracttype.trim()));
            })
            .catch(error => setHttp500([true, error]));
        await axios.get('http://127.0.0.1:3001/api/weeklystructure')
            .then(response =>
                setWeeklyStructures(response.data)
            )
            .catch(error => setHttp500([true, error]));

        init(employees);

        setLoading(false);


    }, [])


    useEffect(() => {
        fetchData().catch(console.error);
        return () => {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <React.Fragment>
            {Loading ? <LoadingSpinner /> : Http500[0] ? <Http4XXAnd5XXError error={Http500[1]} setHttp4XXAnd5XX={setHttp500} /> : (



                <div >


                    <div className=" d-flex p-0" style={{hover:'pointer'}}>
                        <h3 className="card-title p-3">Automatisatie</h3>
                        <ul className="nav nav-pills ml-auto p-2">
                            <li className="nav-item" style={{cursor:'pointer'}}  onClick={() => { setOption(0) }}><a className={Option === 0 ? "nav-link active" : "nav-link"}>Optie A</a></li>
                            <li className="nav-item" style={{cursor:'not-allowed'}} onClick={() => { setOption(1) }}><a className={Option === 1 ? "nav-link active" : "nav-link"}>Optie B</a></li>
                            <li className="nav-item" style={{cursor:'not-allowed'}} onClick={() => { setOption(2) }}><a className={Option === 2 ? "nav-link active" : "nav-link"}>Optie C</a></li>

                        </ul>
                    </div>





                    {
                        {
                            0:
                                <table className=" table text-center" >
                                    <thead style={{ backgroundColor: 'lightgray' }}>
                                        <tr>
                                            <th style={{ padding: "1px" }}>Naam</th>
                                            <th style={{ padding: "1px" }}>{calendarMonthHelper[0].format('DD-MM')} tot {calendarMonthHelper[6].format('DD-MM')}</th>
                                            <th style={{ padding: "1px" }}>{calendarMonthHelper[7].format('DD-MM')} tot {calendarMonthHelper[13].format('DD-MM')}</th>
                                            <th style={{ padding: "1px" }}>{calendarMonthHelper[14].format('DD-MM')} tot {calendarMonthHelper[20].format('DD-MM')}</th>
                                            <th style={{ padding: "1px" }}>{calendarMonthHelper[21].format('DD-MM')} tot {calendarMonthHelper[27].format('DD-MM')}</th>
                                            {calendarMonthHelper.length > 28 && <th style={{ padding: "1px" }}>{calendarMonthHelper[28].format('DD-MM')} tot {calendarMonthHelper[34].format('DD-MM')}</th>}
                                            {calendarMonthHelper.length > 35 && <th style={{ padding: "1px" }}>{calendarMonthHelper[35].format('DD-MM')} tot {calendarMonthHelper[41].format('DD-MM')}</th>}
                                            {/* <th>#Shifts</th> */}
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {Employees.map((empl, index) =>
                                            <tr>
                                                <td style={{ padding: "1px" }}>{empl.naam.substring(0, 8)}</td>
                                                <td style={{ padding: "1px" }}>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs config={Config} index={index} setConfig={setConfig} employeeId={empl.id} weekNumber={"1"} /> : "N.V.T."}</td>
                                                <td style={{ padding: "1px" }}>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs config={Config} index={index} setConfig={setConfig} employeeId={empl.id} weekNumber={"2"} /> : "N.V.T."}</td>
                                                <td style={{ padding: "1px" }}>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs config={Config} index={index} setConfig={setConfig} employeeId={empl.id} weekNumber={"3"} /> : "N.V.T."}</td>
                                                <td style={{ padding: "1px" }}>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs config={Config} index={index} setConfig={setConfig} employeeId={empl.id} weekNumber={"4"} /> : "N.V.T."}</td>
                                                {calendarMonthHelper.length > 28 && <td style={{ padding: "1px" }}>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs index={index} config={Config} setConfig={setConfig} employeeId={empl.id} weekNumber={"5"} /> : "N.V.T."}</td>}
                                                {calendarMonthHelper.length > 35 && <td style={{ padding: "1px" }}>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs index={index} config={Config} setConfig={setConfig} employeeId={empl.id} weekNumber={"6"} /> : "N.V.T."}</td>}
                                                {/* <td style={{ width: "30px" }}>
                                                                    <input type="number" id="BEGIN_UREN" value={Config[index].totalShifts} onChange={(e) => { }} />
                                                                </td> */}
                                            </tr>
                                        )}
                                        <td colSpan="7" >

                                            <button type="button" className="btn btn-block bg-gradient-danger btn-xs" onClick={() => { TEMP_INIT_VALUES() }}>TEMP_INIT_VALUES ONLY FOR !!!<b><u>03-2021</u></b>!!!</button>

                                            <button type="button" className="btn btn-block bg-gradient-primary btn-xs" onClick={() => { startAutomatisation() }}>start</button>

                                        </td>
                                    </tbody>
                                </table>,

                            1:
                                <div className="card">
                                    NOT IMPLEMENTED YET
                                </div>,
                            2:
                                <div className="card">
                                    NOT IMPLEMENTED YET
                                </div>

                        }[Option]
                    }

                </div>
            )
            }
        </React.Fragment>
    )
}

export default AutomatisatieV1