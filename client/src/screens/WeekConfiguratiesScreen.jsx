import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listWeekStructuren } from '../store/actions/betaActions';
import { Link } from 'react-router-dom';

const WeekConfiguratiesScreen = () => {

    const dispatch = useDispatch();

    const beta = useSelector((state) => state.beta);
    const { weekStructuren } = beta;

    useEffect(() => {
        dispatch(listWeekStructuren());
        return () => {

        }
    }, [])

    return (
        <div className="content-wrapper">
           
           <div className="col-md">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <h3 className="card-title">Mogelijke weekstructuren</h3>

                                </div>
                            </div>

                            <div className="card-body p-0">
                                <table className="table table-striped">


                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>SCORE</th>
                                            <th>MA</th>
                                            <th>DI</th>
                                            <th>WO</th>
                                            <th>DO</th>
                                            <th>VR</th>
                                            <th>ZA</th>
                                            <th>ZO</th>
                                            <th>AANPASSEN</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {weekStructuren.sort(function(a,b){return a.id-b.id}).map((weekstructuur) => (

                                            <tr>
                                                <td>{weekstructuur.id}</td>
                                                <td>{weekstructuur.score}</td>
                                                <td>
                                                    {weekstructuur.maandag !=="" ?
                                                        weekstructuur.maandag
                                                        :
                                                        <i style={{ color: 'red' }} class="fas fa-times" />}
                                                </td>
                                                <td>
                                                    {weekstructuur.dinsdag !=="" ?
                                                        weekstructuur.dinsdag
                                                        :
                                                        <i style={{ color: 'red' }} class="fas fa-times" />}
                                                </td>
                                                <td>
                                                    {weekstructuur.woensdag !=="" ?
                                                        weekstructuur.woensdag
                                                        :
                                                        <i style={{ color: 'red' }} class="fas fa-times" />}
                                                </td>
                                                <td>
                                                    {weekstructuur.donderdag !=="" ?
                                                        weekstructuur.donderdag
                                                        :
                                                        <i style={{ color: 'red' }} class="fas fa-times" />}
                                                </td>
                                                <td>
                                                    {weekstructuur.vrijdag !=="" ?
                                                        weekstructuur.vrijdag
                                                        :
                                                        <i style={{ color: 'red' }} class="fas fa-times" />}
                                                </td>
                                                <td>
                                                    {weekstructuur.zaterdag !=="" ?
                                                        weekstructuur.zaterdag
                                                        :
                                                        <i style={{ color: 'red' }} class="fas fa-times" />}
                                                </td>
                                                <td>
                                                    {weekstructuur.zondag !=="" ?
                                                        weekstructuur.zondag
                                                        :
                                                        <i style={{ color: 'red' }} class="fas fa-times" />}
                                                </td>


                                                <td>
                                                    <Link to={"/instellingen/week/" + weekstructuur.id}>
                                                        <i class="fas fa-edit"></i>
                                                    </Link>

                                                </td>
                                            </tr>
                                        )
                                        )}
                                    </tbody>


                                    <tfoot>
                                        <tr>
                                            <td colSpan="10" >
                                                <Link to={"/instellingen/week/new"}>
                                                    <button type="button" class="btn btn-block bg-gradient-primary btn-xs">Weekstructuur toevoegen</button>
                                                </Link>
                                            </td>

                                        </tr>
                                    </tfoot>

                                </table>
                            </div>
                        </div>
                    </div>









        </div>
    )
}

export default WeekConfiguratiesScreen
