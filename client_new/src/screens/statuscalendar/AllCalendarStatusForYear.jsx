/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import BadRequest400Error from '../../components/general/BadRequest400Error';

import moment from '../../helpers/moment';

const AllCalendarStatusForYear = () => {

    const [Http500, setHttp500] = useState([false, ""]);
    const [Http400Error, setHttp400Error] = useState([false, ""])


    const { year } = useParams();
    const history = useHistory();

    const [Loading, setLoading] = useState(true);
    const [CalendarStatus, setCalendarStatus] = useState([]);
    const [GroupedCalendarStatus, setGroupedCalendarStatus] = useState([]);
    const [MonthsForCurrentYear, setMonthsForCurrentYear] = useState([]);


    const addCalendarMonth = async (month) => {
        setLoading(true);
        console.log(year);
        await axios.post(`http://127.0.0.1:3001/api/statuscalendar/${year}/${moment(month, "MM-YYYY").format("MM")}`, { "timestamp": moment().format("DD/MM/YYYY HH:MM") })
            .then(() => {
                fetchData();
            })
            .catch(error => setHttp500([true, error]));
    };

    const orderCalendarStatusByMonth = (CalendarStatusList) => {

        const list = CalendarStatusList.map(i => i.month);
        const uniqueList = Array.from(new Set(list));
        const groups = uniqueList.map(c => {
            return { month: c, versions: [] };
        });

        CalendarStatusList.forEach(d => {
            groups.find(g => g.month === d.month).versions.push(d.version);
        });
        setGroupedCalendarStatus(groups);
    }

    const makeMonthsForCurrentYear = () => {
        let list = [];
        let monthMoment = moment(year, "YYYY").startOf('year');
        while (monthMoment.isSame(moment(year, "YYYY"), 'year')) {
            list.push(monthMoment.format("MM-YYYY"));
            monthMoment.add(1, "month");
        }
        setMonthsForCurrentYear(list);
    }

    const fetchData = async () => {
        await axios.get(`http://127.0.0.1:3001/api/statuscalendar/${year}`)
            .then(response => {
                if (response.status === 204) {
                    setHttp400Error([true, ["Foutmelding", "Er zijn geen status voor calenders in " + year + " te weergeven!"]]);
                    setCalendarStatus([]);
                    setGroupedCalendarStatus([]);
                    makeMonthsForCurrentYear();
                } else {
                    setHttp400Error([false, []]);
                    makeMonthsForCurrentYear();
                    orderCalendarStatusByMonth(response.data)
                    setCalendarStatus(response.data);
                }
            })
            .finally(setLoading(false))
            .catch(error => setHttp500([true, error]));
    }

    useEffect(() => {
        setHttp400Error([false, ""]);
        fetchData();
    }, [year])

    return (
        <div className='content-wrapper'>


            {Loading ? <LoadingSpinner />
                : Http500[0] ? <Http4XXAnd5XXError error={Http500[1]} setHttp4XXAnd5XX={setHttp500} />
                    : (

                        <div className="col-md">
                            {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}

                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Planning historie</h3>

                                    <div className="card-tools">
                                        <ul className="pagination pagination-sm float-right">
                                            <li className="page-item page-link" onClick={() => history.push(`/planningen/${moment(year, "YYYY").subtract(1, 'year').format("YYYY")}`)}>«</li>
                                            <li className="page-item page-link">{year}</li>
                                            <li className="page-item page-link" onClick={() => history.push(`/planningen/${moment(year, "YYYY").add(1, "year").format("YYYY")}`)}>»</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <table className="table table-hover ">
                                        <thead>
                                            <tr>
                                                <th>Maand</th>
                                                <th>#Versies</th>
                                                <th>Status laatste versie</th>
                                                <th>Laatste update</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {MonthsForCurrentYear.length !== 0 &&
                                                MonthsForCurrentYear.map((month) =>
                                                    <React.Fragment key={`${month} + ${GroupedCalendarStatus.find(x => x.month === month)?.versions.length}`}>
                                                        <tr data-widget="expandable-table" aria-expanded="false">

                                                            <td>  <div>  <i className="expandable-table-caret fas fa-caret-right fa-fw"></i>{month}</div></td>

                                                            <td>{GroupedCalendarStatus.find(x => x.month === month)?.versions.length || "N.V.T."}</td>

                                                            {
                                                                {
                                                                    undefined: <td><span className="badge bg-primary">leeg</span></td>,
                                                                    0: <td><span className="badge bg-primary">leeg</span></td>,
                                                                    1: <td><span className="badge bg-warning">bezig</span></td>,
                                                                    2: <td><span className="badge bg-success">klaar</span></td>
                                                                }[CalendarStatus.find(x => x.month === month && x.version === GroupedCalendarStatus.find(x => x.month === month)?.versions.length)?.progress]
                                                            }

                                                            <td>{CalendarStatus.find(x => x.month === month && x.version === GroupedCalendarStatus.find(x => x.month === month)?.versions.length)?.time_saved || "N.V.T."}</td>

                                                        </tr>

                                                        <tr className="expandable-body">
                                                            <td colSpan={4}>
                                                                <div className="p-0" style={{ display: "none" }} >
                                                                    <table className=" table text-center" style={{ border: "1px solid black" }} >
                                                                        <thead style={{ backgroundColor: 'lightgrey' }}>
                                                                            <tr >
                                                                                <th>Maand</th>
                                                                                <th>Versie</th>
                                                                                <th>Status</th>
                                                                                <th>Laatste update</th>
                                                                                <th>Commentaar</th>
                                                                                <th>Aangepaste operatoren</th>

                                                                                <th style={{ color: 'green' }}>+</th>
                                                                                <th style={{ color: 'red' }}>-</th>
                                                                                <th style={{ color: 'orange' }}>§</th>
                                                                                <th style={{ color: 'gray' }}>o</th>
                                                                                <th>Bekijk/Aanpassen</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {CalendarStatus.filter(x => x.month === month).map(status =>
                                                                                <tr>
                                                                                    <td>{status.month}</td>
                                                                                    <td>{status.version}</td>
                                                                                    {
                                                                                        {
                                                                                            undefined: <td><span className="badge bg-primary">leeg</span></td>,
                                                                                            0: <td><span className="badge bg-primary">leeg</span></td>,
                                                                                            1: <td><span className="badge bg-warning">bezig</span></td>,
                                                                                            2: <td><span className="badge bg-success">klaar</span></td>
                                                                                        }[status.progress]
                                                                                    }
                                                                                    <td>{status.time_saved || "N.V.T."}</td>
                                                                                    <td>{status.comment?.substring(0, 15) || "N.V.T."}</td>
                                                                                    <td>{status.affected_employees || "N.V.T."}</td>
                                                                                    {status.added_shifts ? <td style={{ color: 'green' }}>{status.added_shifts || "x"}</td> : <td colSpan={4}>N.V.T.</td>}
                                                                                    {status.added_shifts && <td style={{ color: 'red' }}>{status.deleted_shifts || "x"}</td>}
                                                                                    {status.added_shifts && <td style={{ color: 'orange' }}>{status.changed_shifts || "x"}</td>}
                                                                                    {status.added_shifts && <td style={{ color: 'gray' }}>{status.same_shifts || "x"}</td>}

                                                                                    {
                                                                                        {
                                                                                            0:
                                                                                                <td>
                                                                                                    <Link to={`/planningen/${year}/${status.month.substring(0, 2)}/${status.version}`}>
                                                                                                        <i class="fas fa-edit"></i>
                                                                                                    </Link>
                                                                                                </td>,
                                                                                            1:
                                                                                                <td>
                                                                                                    <Link to={`/planningen/${year}/${status.month.substring(0, 2)}/${status.version}`}>
                                                                                                        <i class="fas fa-edit"></i>
                                                                                                    </Link>
                                                                                                </td>,
                                                                                            2:

                                                                                                <td>
                                                                                                    <Link to={`/planningen/${year}/historie/${status.month.substring(0, 2)}/${status.version}`}>
                                                                                                        <i className="fas fa-thin fa-glasses"></i>
                                                                                                    </Link>

                                                                                                </td>

                                                                                        }[status.progress]
                                                                                    }



                                                                                </tr>
                                                                            )}

                                                                            {!CalendarStatus.some(x => x.month === month) &&
                                                                                <td colSpan="11" >

                                                                                    <button type="button" class="btn btn-block bg-gradient-primary btn-xs" onClick={() => { addCalendarMonth(month); console.log(month); }} >Planning toevoegen</button>

                                                                                </td>}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
        </div>
    )
}

export default AllCalendarStatusForYear