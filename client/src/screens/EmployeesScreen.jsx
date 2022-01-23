import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { listEmployees } from '../store/actions/employeesActions';

function EmployeesScreen(props) {

    const employeesList = useSelector((state) => state.employeesList);
    const { employees, loading, error } = employeesList;


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listEmployees());
        return () => {
            //cleanup
        }
    }, [dispatch])

    return (


        <div className="content-wrapper">


            {loading ? (
                <div class="overlay"><i style={{ margin: "250px" }} className="fas fa-3x fa-sync-alt fa-spin"></i></div>
            ) : error ? (<div>{error}</div>) : (

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Werknemers</h3>
                    </div>

                    <div className="card-body p-0">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th style={{ width: "10px" }}>ID</th>
                                    <th>NAAM</th>
                                    <th>EMAIL</th>
                                    <th>CONTRACTTYPE</th>
                                    <th>AANPASSEN</th>

                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (

                                    <tr>
                                        <td>{employee.id}</td>
                                        <td>{employee.naam}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.contracttype}</td>
                                        <td>
                                            <Link to={"/Werknemers/" + employee.id}>
                                                <i class="fas fa-edit"></i>
                                            </Link>

                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="5" >
                                        <Link to={"/Werknemers/new"}>
                                            <button type="button" class="btn btn-block bg-gradient-primary btn-xs">Werknemer toevoegen</button>
                                        </Link>
                                    </td>

                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </div>
            )}
        </div>
    )


}

export default EmployeesScreen
