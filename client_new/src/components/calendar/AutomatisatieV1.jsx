import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getCalendarMoments_ArrayWithMoments } from './helpers';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import WeeklyConfigs from './WeeklyConfigs';
import { checkPossibleWeeklyStructures } from '../../logic/webworkers/helper';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { mapShiftsFromDbToAutomatisation } from '../../mappers/calendar/DatabaseToReduxMapper';

const AutomatisatieV1 = ({ postToMainWorker }) => {

    const { month } = useParams();

    const [Http500, setHttp500] = useState([false, ""]);

    const [Loading, setLoading] = useState(true);
    const [Employees, setEmployees] = useState([]);

    const [WeeklyStructures, setWeeklyStructures] = useState([]);

    const [Config, setConfig] = useState({})
    const calendarMonthHelper = getCalendarMoments_ArrayWithMoments(month);

    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { date, calendar } = currentCalendar;


    const startAutomatisation = async () => {

        let previousWeeks = await axios.get(`http://127.0.0.1:3001/api/calendar/global/custom/${moment(month, "MM-YYYY").startOf('month').startOf('isoWeek').subtract(1, 'week').format("DD-MM-YYYY")}/${moment(month, "MM-YYYY").startOf('month').startOf('isoWeek').subtract(1, 'day').format("DD-MM-YYYY")}`);

        previousWeeks = mapShiftsFromDbToAutomatisation(month, previousWeeks.data, Employees);
        const missingShiftsWeek = checkOntbrekendeShiften();

        postToMainWorker(["INIT", {
            "weeklyStructures": WeeklyStructures,
            "employees": Employees,
            "config": Config,
            "previousWeeks": previousWeeks,
            "missingShiftsWeek": missingShiftsWeek,
            "WeekNumber": "1"
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
    }, [])

    return (
        <React.Fragment>
            {Loading ? <LoadingSpinner /> : Http500[0] ? <Http4XXAnd5XXError error={Http500[1]} setHttp4XXAnd5XX={setHttp500} /> : (
                <div>
                    <table className=" table text-center" >
                        <thead style={{ backgroundColor: 'lightgray' }}>
                            <tr>
                                <th>Naam</th>
                                <th>{calendarMonthHelper[0].format('DD-MM')} tot {calendarMonthHelper[6].format('DD-MM')}</th>
                                <th>{calendarMonthHelper[7].format('DD-MM')} tot {calendarMonthHelper[13].format('DD-MM')}</th>
                                <th>{calendarMonthHelper[14].format('DD-MM')} tot {calendarMonthHelper[20].format('DD-MM')}</th>
                                <th>{calendarMonthHelper[21].format('DD-MM')} tot {calendarMonthHelper[27].format('DD-MM')}</th>
                                {calendarMonthHelper.length > 28 && <th>{calendarMonthHelper[28].format('DD-MM')} tot {calendarMonthHelper[34].format('DD-MM')}</th>}
                                {calendarMonthHelper.length > 35 && <th>{calendarMonthHelper[35].format('DD-MM')} tot {calendarMonthHelper[41].format('DD-MM')}</th>}
                                <th>#Shifts</th>
                            </tr>

                        </thead>
                        <tbody>
                            {Employees.map((empl, index) =>
                                <tr>
                                    <td>{empl.naam.substring(0, 8)}</td>
                                    <td>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs config={Config} index={index} setConfig={setConfig} employeeId={empl.id} weekNumber={"1"} /> : "N.V.T."}</td>
                                    <td>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs config={Config} index={index} setConfig={setConfig} employeeId={empl.id} weekNumber={"2"} /> : "N.V.T."}</td>
                                    <td>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs config={Config} index={index} setConfig={setConfig} employeeId={empl.id} weekNumber={"3"} /> : "N.V.T."}</td>
                                    <td>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs config={Config} index={index} setConfig={setConfig} employeeId={empl.id} weekNumber={"4"} /> : "N.V.T."}</td>
                                    {calendarMonthHelper.length > 28 && <td>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs index={index} config={Config} setConfig={setConfig} employeeId={empl.id} weekNumber={"5"} /> : "N.V.T."}</td>}
                                    {calendarMonthHelper.length > 35 && <td>{empl.contracttype.trim() === "operator" ? <WeeklyConfigs index={index} config={Config} setConfig={setConfig} employeeId={empl.id} weekNumber={"6"} /> : "N.V.T."}</td>}
                                    <td style={{ width: "30px" }}>
                                        <input type="number" id="BEGIN_UREN" value={Config[index].totalShifts} onChange={(e) => { }} />
                                    </td>
                                </tr>
                            )}
                            <td colSpan="7" >

                                <button type="button" class="btn btn-block bg-gradient-primary btn-xs" onClick={() => { startAutomatisation() }}>start</button>
                                <div id="myProgress" style={{ width: "100%", backgroundColor: "gray", height: "25px" }}>
                                    <div id="myBar" style={{ width: (10 * 100 / 30) + '%', height: "25px", backgroundColor: "green" }}></div>
                                </div>
                            </td>
                        </tbody>
                    </table>
                </div>
            )
            }
        </React.Fragment>
    )
}

export default AutomatisatieV1