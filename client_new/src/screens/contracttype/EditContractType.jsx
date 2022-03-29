import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import BadRequest400Error from '../../components/general/BadRequest400Error';

const EditContractType = ({ setShowSuccesModal, setShowDangerModal }) => {

  let { id } = useParams();

  const history = useHistory();

  const [Http4XXAnd5XX, setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([false, ""])
  const [Finished, setFinished] = useState(false);
  const [Loading, setLoading] = useState(true);

  const [Name, setName] = useState("")
  const [WeeklyContractHours, setWeeklyContractHours] = useState(0);
  const [NightShiftsAllowed, setNightShiftsAllowed] = useState(false);
  const [StandbyAllowed, setStandbyAllowed] = useState(false);
  const [MaxWeekendsAYear, setMaxWeekendsAYear] = useState(0);



  const fetchData = async () => {
    await axios.get('http://127.0.0.1:3001/api/contracttype/' + id)
      .then(response => {
        setName(response.data[0].naam.trim());
        setWeeklyContractHours(response.data[0].wekelijkse_contract_uren);
        setNightShiftsAllowed(response.data[0].nachtshiften_toegelaten);
        setStandbyAllowed(response.data[0].standby_toegelaten);
        setMaxWeekendsAYear(response.data[0].max_weekends_per_jaar);
      })
      .catch(error => {Http400Error([true, error.data]);setLoading(false);});

    };

  const deleteHandler = async () => {
    let answer = window.confirm("Contracttype " + Name + " verwijderen?");
    if (answer) {
      axios.delete('http://127.0.0.1:3001/api/contracttype/' + id)
        .then(response => {
          setShowDangerModal([true, ["Verwijderd!", `ID:${id}`, `Contracttype ${Name} werd verwijderd!`]])
          setFinished(true);
        }).catch(error => setHttp4XXAnd5XX([true, error.data]));
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    id === 'new' ?

      await axios.post('http://127.0.0.1:3001/api/contracttype', {
        "name": Name,
        "weeklyContractHours": parseInt(WeeklyContractHours),
        "nightShiftsAllowed": NightShiftsAllowed,
        "standbyAllowed": StandbyAllowed,
        "maxWeekendsAYear": parseInt(MaxWeekendsAYear)
      }).then(() => {
        setShowSuccesModal([true, ["Toegevoegd!", `ID:${Name}`, `Contracttype ${Name} werd toegevoegd!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
      :
      await axios.put('http://127.0.0.1:3001/api/contracttype/' + id, {
        "name": Name,
        "weeklyContractHours": parseInt(WeeklyContractHours),
        "nightShiftsAllowed": NightShiftsAllowed,
        "standbyAllowed": StandbyAllowed,
        "maxWeekendsAYear": parseInt(MaxWeekendsAYear)
      }).then(() => {
        setShowSuccesModal([true, ["Aangepast!", `ID:${Name}`, `Contracttype ${Name} werd aangepast!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
  }

  useEffect(() => {

    if (Finished) {
      history.push("/contracttypes");
    }
    id !== "new" && fetchData().catch(console.error);
    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Finished])






  return (
    <div className="content-wrapper">
      {Loading ? <LoadingSpinner />
        : Http4XXAnd5XX[0] ? <Http4XXAnd5XXError error={Http4XXAnd5XX[1]} setHttp4XXAnd5XX={setHttp4XXAnd5XX} /> :
          (
            <div className="col-md">
              <div className="card card-info">
                <div className="card-header">
                  <h3 className="card-title">Contracttype {id !== "new" ? "aanpassen" : "toevoegen"}</h3>
                </div>
                {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}

                <form onSubmit={submitHandler}>
                  <div className="card-body">

                    <div className="form-group">
                      <label htmlFor="NAME_SHIFT">Naam</label>
                      <input type="text" class="form-control" id="NAME_SHIFT" onChange={(e) => setName(e.target.value)} value={Name} />
                    </div>

                    <div className="form-group" style={{width:'300px'}}>
                      <label class="htmlForm-check-label" for="WeeklyContractHours">Wekelijkse contract uren</label>
                      <input type="number" class="form-control" id="WeeklyContractHours" value={WeeklyContractHours} onChange={(e) => setWeeklyContractHours(e.target.value)} />
                    </div>

                    <div className="form-group" style={{width:'300px'}}>
                      <label class="htmlForm-check-label" for="MaxWeekendsAYear">Maximum aanstal weekends per jaar</label>
                      <input type="number" class="form-control" id="MaxWeekendsAYear" value={MaxWeekendsAYear} onChange={(e) => setMaxWeekendsAYear(e.target.value)} />
                    </div>

                    <div className="form-group"  >
                      <div class="custom-control custom-checkbox">
                        <input class="custom-control-input custom-control-input-danger" type="checkbox" id="StandbyAllowed" checked={StandbyAllowed} onClick={() => setStandbyAllowed(!StandbyAllowed)} />
                        <label for="StandbyAllowed" class="custom-control-label" >Standby shiften toegelaten </label>
                      </div>
                    </div>

                    <div className="form-group" >
                      <div class="custom-control custom-checkbox">
                        <input class="custom-control-input custom-control-input-danger" type="checkbox" id="VERPLICHT" checked={NightShiftsAllowed} onClick={() => setNightShiftsAllowed(!NightShiftsAllowed)} />
                        <label for="VERPLICHT" class="custom-control-label" >Nacht shiften toegelaten </label>
                      </div>
                    </div>

                    <div className="card-footer">
                      <button type="submit" style={{ width: "125px" }} className="btn btn-success">{id !== "new" ? "Aanpassen" : "Toevoegen"}</button>
                      {id !== "new" &&
                        <button type="button" style={{ marginLeft: "50px", width: "125px" }} class="btn btn-danger " onClick={(() => (deleteHandler()))}>Verwijderen</button>}
                      <button type="button" style={{ marginLeft: "50px", width: "125px" }} class="btn btn-warning " onClick={(() => (setFinished(!Finished)))}>Annuleren</button>

                    </div>

                  </div>

                </form>


              </div>
            </div >)}

    </div >


  )
}

export default EditContractType