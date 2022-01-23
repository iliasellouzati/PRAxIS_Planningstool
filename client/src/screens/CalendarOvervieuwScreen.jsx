import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCalendarOverview } from '../store/actions/shiftActions';

import * as Moment_Operations from '../moment_operations';
import { Link } from 'react-router-dom';

const CalendarOvervieuwScreen = () => {
    const [value, setValue] = useState(moment());
    const dispatch = useDispatch();


    const yearlyCalendarList = useSelector((state) => state.yearlyCalendarList);
    const { calendarsOvervieuw, loading, error } = yearlyCalendarList;


    useEffect(() => {

        dispatch(getCalendarOverview(value.format('YYYY')));

        return () => {

        }
    }, [value])

    return (
        <div className="content-wrapper">

            {loading ? (

                <div class="overlay"><i style={{ margin: "250px" }} className="fas fa-3x fa-sync-alt fa-spin"></i></div>


            ) : error ? (<div>{error}</div>) : (

                <div className="col-md">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Planning historie</h3>

                            <div className="card-tools">
                                <ul className="pagination pagination-sm float-right">
                                    <li className="page-item page-link" onClick={() => setValue(Moment_Operations.getLastYear_Moment(value))}>«</li>
                                    <li className="page-item page-link">{value.format('YYYY')}</li>
                                    <li className="page-item page-link" onClick={() => setValue(Moment_Operations.getNextYear_Moment(value))}>»</li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Periode</th>
                                        <th>Status</th>
                                        <th>Aanpassen</th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {calendarsOvervieuw[0] ?
                                        calendarsOvervieuw.map((maand) => (
                                            <tr>
                                                <td>{maand.datum}</td>

                                                {maand.status === 2 ?
                                                    <td><span className="badge bg-success">klaar</span></td> :
                                                    maand.status === 1 ? <td><span className="badge bg-warning">bezig</span></td> : <td><span className="badge bg-primary">leeg</span></td>}
                                                <td>
                                                    <Link to={"/Planning/" + maand.datum.trim()}>
                                                        <i class="fas fa-edit"></i>
                                                    </Link>

                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td>GEEN PLANNING GEVONDEN</td>
                                                <td>X</td>
                                                <td>X</td>
                                            </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CalendarOvervieuwScreen
