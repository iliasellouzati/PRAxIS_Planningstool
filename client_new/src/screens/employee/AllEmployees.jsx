import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import axios from 'axios';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';

const AllEmployees = () => {

  const [Http500, setHttp500] = useState([false, ""]);

  const [Loading, setLoading] = useState(true);
  const [Employees, setEmployees] = useState([])


  const fetchData = useCallback(async () => {
    await axios.get('http://127.0.0.1:3001/api/employee')
      .then(response => setEmployees(response.data))
      .catch(error => setHttp500([true, error]));
  }, [])




  useEffect(() => {

    fetchData().catch(console.error);
    setLoading(false);

    return () => {

    }
  }, [fetchData])

  return (

    <div className="content-wrapper">



      {Loading ? <LoadingSpinner /> : Http500[0] ? <Http4XXAnd5XXError error={Http500[1]} setHttp4XXAnd5XX={setHttp500} /> : (
        <div className="col-md">
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
                  {Employees.map((employee) => (

                    <tr>
                      <td>{employee.id}</td>
                      <td>{employee.naam}</td>
                      <td>{employee.email}</td>
                      <td>{employee.contracttype}</td>
                      <td>
                        <Link to={"/werknemers/" + employee.id}>
                          <i class="fas fa-edit"></i>
                        </Link>

                      </td>
                    </tr>

                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" >
                      <Link to={"/werknemers/new"}>
                        <button type="button" class="btn btn-block bg-gradient-primary btn-xs">Werknemer toevoegen</button>
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

export default AllEmployees