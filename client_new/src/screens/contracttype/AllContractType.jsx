import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import axios from 'axios';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';

const AllContractType = () => {

  const [Http500, setHttp500] = useState([false, ""]);

  const [Loading, setLoading] = useState(true);
  const [ContractTypes, setContractTypes] = useState([])


  const fetchData = async () => {
    await axios.get('http://127.0.0.1:3001/api/contracttype')
      .then(response => setContractTypes(response.data))
      .catch(error => setHttp500([true, error]));
  };


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
              <div className="row">
                <h3 className="card-title">Contract types</h3>

              </div>
            </div>

            <div className="card-body p-0">
              <table className="table table-striped">


                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAAM</th>
                    <th>UREN / WEEK</th>
                    <th>MAX WKNDS/JAAR</th>
                    <th>NACHTSHIFTEN</th>
                    <th>STANDBY'S</th>
                    <th>AANPASSEN</th>

                  </tr>
                </thead>
                <tbody>

                  {ContractTypes.map((contract) => (

                    <tr>
                      <td>{contract.id}</td>
                      <td>{contract.naam}</td>
                      <td>{contract.wekelijkse_contract_uren}</td>
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
                        <Link to={"/contracttypes/" + contract.id}>
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
                      <Link to={"/contracttypes/new"}>
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

export default AllContractType