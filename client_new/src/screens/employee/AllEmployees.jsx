import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import axios from 'axios';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import moment from 'moment';

const AllEmployees = () => {

  const [Http500, setHttp500] = useState([false, ""]);

  const [Loading, setLoading] = useState(true);
  const [Employees, setEmployees] = useState([]);
  const [AllContracts, setAllContracts] = useState([]);
  const [InactiveEmployees, setInactiveEmployees] = useState([]);
  const [ToonInactieve, setToonInactieve] = useState(false);


  const fetchData = async () => {
    await axios.get('http://127.0.0.1:3001/api/employee')
      .then(response => setEmployees(response.data))
      .catch(error => setHttp500([true, error]));

    await axios.get('http://127.0.0.1:3001/api/employee/all/contracts')
      .then(response => { setAllContracts(response.data); separateInactiveEmployees(response.data); })
      .catch(error => setHttp500([true, error]));

    console.log(AllContracts)
  }

  const separateInactiveEmployees = (allContracts) => {
    if (allContracts === undefined || allContracts === null || allContracts.length === 0) {
      setInactiveEmployees([]);
      return;
    }
    let inactiveEmpl = [];

    allContracts.forEach(contract => {

      if (contract.einddatum === null && inactiveEmpl.some(x => x === contract.werknemer_id)) {
        inactiveEmpl = inactiveEmpl.filter(x => x !== contract.werknemer_id);
        return;
      }
      if (contract.einddatum !== null && moment(contract.einddatum, "DD/MM/YYYY").isBefore(moment(), "day") && !inactiveEmpl.some(x => x === contract.werknemer_id)) {
        inactiveEmpl.push(contract.werknemer_id);
        return;
      }
      if (contract.einddatum !== null && moment(contract.einddatum, "DD/MM/YYYY").isAfter(moment(), "day") && inactiveEmpl.some(x => x === contract.werknemer_id)) {
        inactiveEmpl = inactiveEmpl.filter(x => x !== contract.werknemer_id);
        return;
      }
    })

    setInactiveEmployees(inactiveEmpl);

  }


  useEffect(() => {

    fetchData().catch(console.error);
    setLoading(false);

    return () => {

    }
  }, [])

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
                    <th>Familienaam</th>
                    <th>Voornaam</th>
                    <th>AANPASSEN</th>

                  </tr>
                </thead>
                <tbody>
                  {Employees.filter(emp => !InactiveEmployees.some(x => x === emp.id)).map((employee) => (

                    <tr>
                      <td>{employee.id}</td>
                      <td>{employee.familienaam}</td>
                      <td>{employee.voornaam}</td>
                      <td>
                        <Link to={"/werknemers/" + employee.id}>
                          <i class="fas fa-edit"></i>
                        </Link>

                      </td>
                    </tr>

                  ))}
                  <tr data-widget="expandable-table" aria-expanded="false" onClick={()=>setToonInactieve(!ToonInactieve)} >
                    <td colSpan={4}>
                      <div>
                        <i className="expandable-table-caret fas fa-caret-right fa-fw"></i>
                        Toon inactieve
                      </div>
                    </td>
                  </tr>

       
                    {ToonInactieve && Employees.filter(emp => InactiveEmployees.some(x => x === emp.id)).map((employee) =>

                      <tr  >
                        <td>{employee.id}</td>
                        <td>{employee.familienaam}</td>
                        <td>{employee.voornaam}</td>
                        <td>
                          <Link to={"/werknemers/" + employee.id}>
                            <i class="fas fa-edit"></i>
                          </Link>

                        </td>
                      </tr>

                    )}

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