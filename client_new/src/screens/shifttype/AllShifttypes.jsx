import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import axios from 'axios';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import ReadOnlyShift from '../../components/shift/ReadOnlyShift';

const AllShifttypes = () => {


  const [Http500, setHttp500] = useState([false, ""]);

  const [Loading, setLoading] = useState(true);
  const [Shifttypes, setShifttypes] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [ShowInactive, setShowInactive] = useState(false);
  const [ShowAllDetails, setShowAllDetails] = useState(false);

  const calculateCategories = (AllShifts) => {
    let cat = [];
    AllShifts.forEach(shift => {
      if (!cat.some(x => x.trim() === shift.categorie.trim())) {
        cat.push(shift.categorie.trim());
      }
    });
    setCategories(cat);
  }

  const fetchData = useCallback(async () => {
    await axios.get('http://127.0.0.1:3001/api/shifttype')
      .then(response => {
        setShifttypes(response.data);
        calculateCategories(response.data);
      })
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
              <div className="row">
                <h3 className="card-title">Shift types</h3>

                <div class="custom-control custom-checkbox" style={{ paddingLeft: "50px", opacity: ShowInactive ? "1" : "0.75" }}>
                  <input class="custom-control-input custom-control-input-danger" type="checkbox" id="TOONINACTIEVESHIFTS" checked={ShowInactive} onClick={() => setShowInactive(!ShowInactive)} />
                  <label for="TOONINACTIEVESHIFTS" class="custom-control-label" > Toon inactieve shifttypes </label>
                </div>
                <div class="custom-control custom-checkbox" style={{ paddingLeft: "50px", opacity: ShowAllDetails ? "1" : "0.75" }}>
                  <input class="custom-control-input custom-control-input-danger" type="checkbox" id="TOONSIMPELELIJST" checked={ShowAllDetails} onClick={() => setShowAllDetails(!ShowAllDetails)} />
                  <label for="TOONSIMPELELIJST" class="custom-control-label" > Toon alle details </label>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              <table className="table table-striped">

                {ShowAllDetails ?
                  <React.Fragment>
                    <thead>
                      <tr>
                        <th>NAAM</th>
                        <th>BEGINUUR</th>
                        <th>EINDUUR</th>

                        <th>VERPLICHT</th>
                        <th>TELEWERK</th>
                        <th>AANPASBARE UREN</th>
                        <th>STANDBY</th>
                        <th>CATEGORIE</th>
                        <th>ACHTERGRONDKLEUR</th>
                        <th>TEKSTKLEUR</th>
                        <th>BORDUUR</th>
                        <th>STANDAARDTEKST</th>
                        <th>AANPASSEN</th>
                        {ShowInactive &&
                          <th>ACTIEF</th>}

                      </tr>
                    </thead>
                    <tbody>

                      {Shifttypes.filter(x => (ShowInactive ? true : x.actief === true)).map((shift) => (

                        <tr>
                          <td>{shift.naam}</td>
                          <td>{shift.beginuur ? shift.beginuur : "N.V.T."}</td>
                          <td>{shift.einduur ? shift.einduur : "N.V.T."}</td>
                          <td>
                            {shift.verplicht ?
                              <i style={{ color: 'green' }} class="fas fa-check" />
                              :
                              <i style={{ color: 'red' }} class="fas fa-times" />}
                          </td>
                          <td>
                            {shift.thuiswerk ?
                              <i style={{ color: 'green' }} class="fas fa-check" />
                              :
                              <i style={{ color: 'red' }} class="fas fa-times" />}
                          </td>
                          <td>
                            {shift.aanpasbare_uren ?
                              <i style={{ color: 'green' }} class="fas fa-check" />
                              :
                              <i style={{ color: 'red' }} class="fas fa-times" />}
                          </td>
                          <td>
                            {shift.standby ?
                              <i style={{ color: 'green' }} class="fas fa-check" />
                              :
                              <i style={{ color: 'red' }} class="fas fa-times" />}
                          </td>
                          <td>{shift.categorie}</td>
                          <td>
                            <div style={{
                              backgroundColor: shift.kleurcode,
                              color: shift.kleurcode,
                              textAlign: 'center',
                              height: '100%',
                              width: "40px",
                              border: "1px solid black"

                            }}>
                              -
                            </div>
                          </td>
                          <td>
                            <div style={{
                              backgroundColor: shift.tekstkleurcode,
                              color: shift.tekstkleurcode,
                              textAlign: 'center',
                              height: '100%',
                              width: "40px",
                              border: "1px solid black"

                            }}>
                              -
                            </div>


                          </td>
                          <td>
                            {shift.border ?
                              <i style={{ color: 'green' }} class="fas fa-check" />
                              :
                              <i style={{ color: 'red' }} class="fas fa-times" />}


                          </td>
                          <td>
                            {shift.standaardtekst}
                          </td>


                          <td>
                            <Link to={"/shifttypes/" + shift.naam}>
                              <i class="fas fa-edit"></i>
                            </Link>

                          </td>
                          {ShowInactive &&
                            <td>
                              {shift.actief ?
                                <i style={{ color: 'green' }} class="fas fa-check" />
                                :
                                <i style={{ color: 'red' }} class="fas fa-times" />}
                            </td>}

                        </tr>

                      )
                      )}
                    </tbody>
                 </React.Fragment>

                  :

                  <tbody >
                    {/* --- CATEGORIENAAM --- */}
                    {Categories.map(cat => (
                      <React.Fragment>
                        <tr data-widget="expandable-table" aria-expanded="false"  >
                          <td >
                            <div>
                              <i className="expandable-table-caret fas fa-caret-right fa-fw"></i>
                              {cat}
                            </div>
                          </td>
                        </tr>
                        {/* --- onderste TR --- */}
                        <tr className="expandable-body">
                          <td>
                            <div className="p-0" style={{ display: "none" }}>
                              <table className=" table" >
                                <thead style={{ backgroundColor: 'lightgray' }}>


                                  <tr>
                                    <th>NAAM</th>
                                    <th>BEGINUUR</th>
                                    <th>EINDUUR</th>
                                    <th>VOORBEELD</th>
                                    <th>AANPASSEN</th>
                                    {ShowInactive &&
                                      <th>ACTIEF</th>}
                                  </tr>

                                </thead>
                                <tbody>
                                  {Shifttypes.filter(x => x.categorie.trim() === cat && (ShowInactive ? true : x.actief === true)).map((shift) => (

                                    <tr>
                                      <td>{shift.naam}</td>
                                      <td>{shift.beginuur ? shift.beginuur : "N.V.T."}</td>
                                      <td>{shift.einduur ? shift.einduur : "N.V.T."}</td>
                                      <td>
                                       <ReadOnlyShift shiftDay={false} shift={shift}  />
                                      </td>
                                      <td>
                                        <Link to={"/Shifttypes/" + shift.naam}>
                                          <i class="fas fa-edit"></i>
                                        </Link>

                                      </td>
                                      {ShowInactive &&
                                        <td>
                                          {shift.actief ?
                                            <i style={{ color: 'green' }} class="fas fa-check" />
                                            :
                                            <i style={{ color: 'red' }} class="fas fa-times" />}
                                        </td>}

                                    </tr>

                                  ))}



                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>

                      </React.Fragment>
                    ))}

                    <tr>
                    </tr>
                  </tbody>

                }


                <tfoot>
                  <tr>
                    <td colSpan="13" >
                      <Link to={"/shifttypes/new"}>
                        <button type="button" class="btn btn-block bg-gradient-primary btn-xs">Shifttype toevoegen</button>
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

export default AllShifttypes