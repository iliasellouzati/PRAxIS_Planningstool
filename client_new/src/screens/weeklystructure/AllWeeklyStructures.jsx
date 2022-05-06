/* eslint-disable eqeqeq */
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
  const [FilterMaandag, setFilterMaandag] = useState(false);
  const [FilterDinsdag, setFilterDinsdag] = useState(false);
  const [FilterWoensdag, setFilterWoensdag] = useState(false);
  const [FilterDonderdag, setFilterDonderdag] = useState(false);
  const [FilterVrijdag, setFilterVrijdag] = useState(false);
  const [FilterZaterdag, setFilterZaterdag] = useState(false);
  const [FilterZondag, setFilterZondag] = useState(false);
  const [FilterDag, setFilterDag] = useState(false);
  const [FilterNacht, setFilterNacht] = useState(false);
  const [FilterDagNaarNacht, setFilterDagNaarNacht] = useState(false);
  const [FilterNachtNaarDag, setFilterNachtNaarDag] = useState(false);


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
        console.log(response.data)
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
                <h3 className="card-title">Mogelijke weekstructuren: <b>{WeeklyStructures ?  WeeklyStructures.filter(week =>
                    (!FilterMaandag || week.maandag != "") &&
                    (!FilterDinsdag || week.dinsdag != "") &&
                    (!FilterWoensdag || week.woensdag != "") &&
                    (!FilterDonderdag || week.donderdag != "") &&
                    (!FilterVrijdag || week.vrijdag != "") &&
                    (!FilterZaterdag || week.zaterdag != "") &&
                    (!FilterZondag || week.zondag != "") &&
                    (!FilterDag || (!week.nacht_week && !week.omschakeling_dag_naar_nacht && !week.omschakeling_nacht_naar_dag)) &&
                    (!FilterNacht || (week.nacht_week && !week.omschakeling_dag_naar_nacht && !week.omschakeling_nacht_naar_dag)) &&
                    (!FilterDagNaarNacht || week.omschakeling_dag_naar_nacht) &&
                    (!FilterNachtNaarDag || week.omschakeling_nacht_naar_dag)
                  ).length : 0}</b> </h3>

              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-around", width: "100%", marginTop: "25px" }}>
                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <label  >FILTERS: </label>
                  </div>
                </div>
                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterMaandag" checked={FilterMaandag} onClick={() => setFilterMaandag(!FilterMaandag)} />
                    <label for="FilterMaandag" class="custom-control-label" >Maandag ingevuld </label>
                  </div>
                </div>
                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterDinsdag" checked={FilterDinsdag} onClick={() => setFilterDinsdag(!FilterDinsdag)} />
                    <label for="FilterDinsdag" class="custom-control-label" >Dinsdag ingevuld</label>
                  </div>
                </div>
                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterWoensdag" checked={FilterWoensdag} onClick={() => setFilterWoensdag(!FilterWoensdag)} />
                    <label for="FilterWoensdag" class="custom-control-label" >Woensdag ingevuld</label>
                  </div>
                </div>
                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterDonderdag" checked={FilterDonderdag} onClick={() => setFilterDonderdag(!FilterDonderdag)} />
                    <label for="FilterDonderdag" class="custom-control-label" >Donderdag ingevuld</label>
                  </div>
                </div>
                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterVrijdag" checked={FilterVrijdag} onClick={() => setFilterVrijdag(!FilterVrijdag)} />
                    <label for="FilterVrijdag" class="custom-control-label" >Vrijdag ingevuld</label>
                  </div>
                </div>
                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterZaterdag" checked={FilterZaterdag} onClick={() => setFilterZaterdag(!FilterZaterdag)} />
                    <label for="FilterZaterdag" class="custom-control-label" >Zaterdag ingevuld</label>
                  </div>
                </div>
                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterZondag" checked={FilterZondag} onClick={() => setFilterZondag(!FilterZondag)} />
                    <label for="FilterZondag" class="custom-control-label" >Zondag ingevuld</label>
                  </div>
                </div>

                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterDag" checked={FilterDag} onClick={() => setFilterDag(!FilterDag)} />
                    <label for="FilterDag" class="custom-control-label" >Alleen dag</label>
                  </div>
                </div>                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterNacht" checked={FilterNacht} onClick={() => setFilterNacht(!FilterNacht)} />
                    <label for="FilterNacht" class="custom-control-label" >Alleen nacht</label>
                  </div>
                </div>                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterDagNaarNacht" checked={FilterDagNaarNacht} onClick={() => setFilterDagNaarNacht(!FilterDagNaarNacht)} />
                    <label for="FilterDagNaarNacht" class="custom-control-label" >Dag naar Nacht</label>
                  </div>
                </div>                <div className="form-group" >
                  <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FilterNachtNaarDag" checked={FilterNachtNaarDag} onClick={() => setFilterNachtNaarDag(!FilterNachtNaarDag)} />
                    <label for="FilterNachtNaarDag" class="custom-control-label" >Nacht naar Dag</label>
                  </div>
                </div>
              </div>

            </div>

            <div className="card-body p-0">
              <table className="table table-striped" style={{ textAlign: "center" }}>


                <thead>
                  <tr>
                    <th>ID</th>
                    <th>SCORE</th>
                    <th>- -</th>
                    <th>MA</th>
                    <th>DI</th>
                    <th>WO</th>
                    <th>DO</th>
                    <th>VR</th>
                    <th>ZA</th>
                    <th>ZO</th>
                    <th>- -</th>
                    <th>NachtWeek</th>
                    <th>Dag naar Nacht</th>
                    <th>Nacht naar Dag</th>
                    <th>AANPASSEN</th>

                  </tr>
                </thead>
                <tbody>

                  {WeeklyStructures && WeeklyStructures.filter(week =>
                    (!FilterMaandag || week.maandag != "") &&
                    (!FilterDinsdag || week.dinsdag != "") &&
                    (!FilterWoensdag || week.woensdag != "") &&
                    (!FilterDonderdag || week.donderdag != "") &&
                    (!FilterVrijdag || week.vrijdag != "") &&
                    (!FilterZaterdag || week.zaterdag != "") &&
                    (!FilterZondag || week.zondag != "") &&
                    (!FilterDag || (!week.nacht_week && !week.omschakeling_dag_naar_nacht && !week.omschakeling_nacht_naar_dag)) &&
                    (!FilterNacht || (week.nacht_week && !week.omschakeling_dag_naar_nacht && !week.omschakeling_nacht_naar_dag)) &&
                    (!FilterDagNaarNacht || week.omschakeling_dag_naar_nacht) &&
                    (!FilterNachtNaarDag || week.omschakeling_nacht_naar_dag)
                  ).sort(function (a, b) { return a.id - b.id }).map((weekstructuur) => (

                    <tr key={weekstructuur.id}>
                      <td>{weekstructuur.id}</td>
                      <td><b>{weekstructuur.score}</b>/10</td>
                      <td>- -</td>
                      <td>
                        {weekstructuur.maandag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.id == weekstructuur.maandag)} shiftDay={false} />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.dinsdag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.id == weekstructuur.dinsdag)} shiftDay={false} />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.woensdag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.id == weekstructuur.woensdag)} shiftDay={false} />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.donderdag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.id == weekstructuur.donderdag)} shiftDay={false} />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.vrijdag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.id == weekstructuur.vrijdag)} shiftDay={false} />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.zaterdag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.id == weekstructuur.zaterdag)} shiftDay={false} />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td>
                        {weekstructuur.zondag !== "" ?
                          <ReadOnlyShift shift={Shifttypes.find(x => x.id == weekstructuur.zondag)} shiftDay={false} />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>
                      <td><p> - -</p></td>
                      <td>
                        {weekstructuur.nacht_week ?
                          <i style={{ color: 'green' }} class="fas fa-check" />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>

                      <td>
                        {weekstructuur.omschakeling_dag_naar_nacht ?
                          <i style={{ color: 'green' }} class="fas fa-check" />
                          :
                          <i style={{ color: 'red' }} class="fas fa-times" />}
                      </td>                      <td>
                        {weekstructuur.omschakeling_nacht_naar_dag ?
                          <i style={{ color: 'green' }} class="fas fa-check" />
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
                    <td colSpan="15" >
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