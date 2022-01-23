import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listContractTypes } from '../store/actions/contracttypeActions';




const ContractTypesScreen = () => {

    const dispatch = useDispatch();

    const contracttypeList = useSelector((state) => state.contracttypeList);
    const { contracttypes, loading, error } = contracttypeList;



    useEffect(() => {
        dispatch(listContractTypes())
        return () => {

        }
    }, [])






    return (
        <div className="content-wrapper">




            {loading ? (

                <div class="overlay"><i style={{ margin: "250px" }} className="fas fa-3x fa-sync-alt fa-spin"></i></div>

            ) : error ? (<div>{error}</div>) :
                (

                    <div className="col-md">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <h3 className="card-title">Contract types</h3>

                                </div>
                            </div>

                            <div className="card-body p-0">
                                <table className="table table-striped">


                                    <thead>
                                        <tr>
                                            <th>NAAM</th>
                                            <th>UREN / WEEK</th>
                                            <th>UREN / KWARTAAL</th>
                                            <th>IDEAAL AANTAL SHIFTS / WEEK</th>

                                            <th>MAX SHIFTS / WEEK</th>
                                            <th>MAX OPEENVOLG. SHIFTS</th>

                                            <th>MAX UREN / WEEK</th>
                                            <th>MAX UREN / MAAND</th>
                                            <th>MAX WEEKENDS / JAAR</th>
                                            <th>NACHTSHIFTEN</th>
                                            <th>STANDBY'S</th>
                                            <th>AANPASSEN</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {contracttypes.map((contract) => (

                                            <tr>
                                                <td>{contract.naam}</td>
                                                <td>{contract.wekelijkse_contract_uren}</td>
                                                <td>{contract.maandelijke_contract_uren}</td>
                                                <td>{contract.ideaal_shifts_per_week}</td>

                                                <td>{contract.max_shifts_per_week}</td>
                                                <td>{contract.max_opeenvolgende_shifts}</td>

                                                <td>{contract.max_uur_per_week}</td>
                                                <td>{contract.max_uur_per_maand}</td>
                                                <td>{contract.max_weekends_per_jaar}</td>
                                                <td>
                                                    {contract.nachtshiften_toegelaten ?
                                                        <i style={{ color: 'green' }} class="fas fa-check" />
                                                        :
                                                        <i style={{ color: 'red' }} class="fas fa-times" />}
                                                </td>
                                                <td>
                                                    {contract.standby_toegelaten ?
                                                        <i style={{ color: 'green' }} class="fas fa-check" />
                                                        :
                                                        <i style={{ color: 'red' }} class="fas fa-times" />}
                                                </td>


                                                <td>
                                                    <Link to={"/contract/" + contract.naam}>
                                                        <i class="fas fa-edit"></i>
                                                    </Link>

                                                </td>
                                            </tr>
                                        )
                                        )}
                                    </tbody>


                                    <tfoot>
                                        <tr>
                                            <td colSpan="12" >
                                                <Link to={"/contract/new"}>
                                                    <button type="button" class="btn btn-block bg-gradient-primary btn-xs">Contracttype toevoegen</button>
                                                </Link>
                                            </td>

                                        </tr>
                                    </tfoot>

                                </table>
                            </div>
                        </div>
                    </div>

                )}
        </div>



    )
}

export default ContractTypesScreen
