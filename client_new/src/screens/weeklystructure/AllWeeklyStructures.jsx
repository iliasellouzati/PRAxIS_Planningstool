import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import axios from 'axios';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import ReadOnlyShift from '../../components/shift/ReadOnlyShift';

const AllWeeklyStructures = () => {

  const [Http500, setHttp500] = useState([false, ""]);

  const [Loading, setLoading] = useState(0);
  const [WeeklyStructures, setWeeklyStructures] = useState([]);
  const [Shifttypes, setShifttypes] = useState([]);





  const fetchWeeklyStructures = useCallback(async () => {
    await axios.get('http://127.0.0.1:3001/api/weeklystructure')
      .then(response => {
        setWeeklyStructures(response.data);
        setLoading(prev => prev + 1);
      })
      .catch(error => setHttp500([true, error]));
  }, []);

  const fetchShifttypes = useCallback(async () => {
    await axios.get('http://127.0.0.1:3001/api/shifttype')
      .then(response => {
        setShifttypes(response.data);
        setLoading(prev => prev + 1);
      })
      .catch(error => setHttp500([true, error]));
  }, []);


  useEffect(() => {

    fetchWeeklyStructures().catch(console.error);
    fetchShifttypes().catch(console.error);


    return () => {

    }
  }, [fetchWeeklyStructures, fetchShifttypes])







  return (
    <div className="content-wrapper">
      {Loading !== 2 ? <LoadingSpinner /> : Http500[0] ? <Http4XXAnd5XXError error={Http500[1]} setHttp4XXAnd5XX={setHttp500} /> : (

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

                  {WeeklyStructures.sort(function (a, b) { return a.id - b.id }).map((weekstructuur) => (

                    <tr>
                      <td>{weekstructuur.id}</td>
                      <td><b>{weekstructuur.score}</b>/10</td>
                      <td>
                        {weekstructuur.maandag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.naam === weekstructuur.maandag)} width="60px" />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.dinsdag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.naam === weekstructuur.dinsdag)} width="60px" />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.woensdag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.naam === weekstructuur.woensdag)} width="60px" />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.donderdag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.naam === weekstructuur.donderdag)} width="60px" />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.vrijdag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.naam === weekstructuur.vrijdag)} width="60px" />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.zaterdag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.naam === weekstructuur.zaterdag)} width="60px" />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.zondag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.naam === weekstructuur.zondag)} width="60px" />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>


                      <td>
                        <Link to={"/weekstructuren/" + weekstructuur.id}>
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
                      <Link to={"/weekstructuren/new"}>
                        <button type="button" class="btn btn-block bg-gradient-primary btn-xs">Weekstructuur toevoegen</button>
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

export default AllWeeklyStructures