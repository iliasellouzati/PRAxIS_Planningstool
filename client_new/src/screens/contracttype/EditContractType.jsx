import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import BadRequest400Error from '../../components/general/BadRequest400Error';

const EditContractType = ({ setShowSuccesModal, setShowDangerModal }) => {

  let { name } = useParams();
  if(name!=="new")
    name=name.trim();
  const history = useHistory();

  const [Http4XXAnd5XX, setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([false, ""])
  const [Finished, setFinished] = useState(false);
  const [Loading, setLoading] = useState(true);

  const [Name, setName] = useState("")
  const [WeeklyContractHours, setWeeklyContractHours] = useState(0);
  const [MonthlyContractHours, setMonthlyContractHours] = useState(0);
  const [MaxFollowingShifts, setMaxFollowingShifts] = useState(0);
  const [MaxShiftsAWeek, setMaxShiftsAWeek] = useState(0);
  const [MaxHoursAWeek, setMaxHoursAWeek] = useState(0);
  const [NightShiftsAllowed, setNightShiftsAllowed] = useState(false);
  const [StandbyAllowed, setStandbyAllowed] = useState(false);
  const [MaxHoursAMonth, setMaxHoursAMonth] = useState(0);
  const [MaxWeekendsAYear, setMaxWeekendsAYear] = useState(0);
  const [IdeaalShiftsAWeek, setIdeaalShiftsAWeek] = useState(0);



  const fetchData = useCallback(async () => {
    await axios.get('http://127.0.0.1:3001/api/contracttype/' + name)
      .then(response => {
        setName(response.data[0].naam.trim());
        setWeeklyContractHours(response.data[0].wekelijkse_contract_uren);
        setMonthlyContractHours(response.data[0].maandelijke_contract_uren);
        setMaxFollowingShifts(response.data[0].max_opeenvolgende_shifts);
        setMaxShiftsAWeek(response.data[0].max_shifts_per_week);
        setMaxHoursAWeek(response.data[0].max_uur_per_week);
        setNightShiftsAllowed(response.data[0].nachtshiften_toegelaten);
        setStandbyAllowed(response.data[0].standby_toegelaten);
        setMaxHoursAMonth(response.data[0].max_uur_per_maand);
        setMaxWeekendsAYear(response.data[0].max_weekends_per_jaar);
        setIdeaalShiftsAWeek(response.data[0].ideaal_shifts_per_week);
      })
      .catch(error => setHttp4XXAnd5XX([true, error]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteHandler = async () => {
    let answer = window.confirm("Contracttype " + Name + " verwijderen?");
    if (answer) {
      axios.delete('http://127.0.0.1:3001/api/contracttype/' + name)
        .then(response => {
          setShowDangerModal([true, ["Verwijderd!", `ID:${name}`, `Contracttype ${Name} werd verwijderd!`]])
          setFinished(true);
        }).catch(error => setHttp4XXAnd5XX([true, error.response.data]));
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    name === 'new' ?

      await axios.post('http://127.0.0.1:3001/api/contracttype', {
        "name": Name,
        "weeklyContractHours":parseInt(WeeklyContractHours),
        "monthlyContractHours":parseInt( MonthlyContractHours),
        "maxFollowingShifts":parseInt( MaxFollowingShifts),
        "maxShiftsAWeek": parseInt(MaxShiftsAWeek),
        "nightShiftsAllowed": NightShiftsAllowed,
        "standbyAllowed": StandbyAllowed,
        "maxHoursAWeek":parseInt( MaxHoursAWeek),
        "maxHoursAMonth":parseInt( MaxHoursAMonth),
        "maxWeekendsAYear":parseInt( MaxWeekendsAYear),
        "ideaalShiftsAWeek":parseInt( IdeaalShiftsAWeek)
      }).then(() => {
        setShowSuccesModal([true, ["Toegevoegd!", `ID:${Name}`, `Contracttype ${Name} werd toegevoegd!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
      :
      await axios.put('http://127.0.0.1:3001/api/contracttype/' + name, {
        "name": Name.trim(),
        "weeklyContractHours":parseInt(WeeklyContractHours),
        "monthlyContractHours":parseInt( MonthlyContractHours),
        "maxFollowingShifts":parseInt( MaxFollowingShifts),
        "maxShiftsAWeek": parseInt(MaxShiftsAWeek),
        "nightShiftsAllowed": NightShiftsAllowed,
        "standbyAllowed": StandbyAllowed,
        "maxHoursAWeek":parseInt( MaxHoursAWeek),
        "maxHoursAMonth":parseInt( MaxHoursAMonth),
        "maxWeekendsAYear":parseInt( MaxWeekendsAYear),
        "ideaalShiftsAWeek":parseInt( IdeaalShiftsAWeek)
      }).then(() => {
        setShowSuccesModal([true, ["Aangepast!", `ID:${Name}`, `Contracttype ${Name} werd aangepast!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
  }

  useEffect(() => {

    if (Finished) {
      history.push("/contracttypes");
    }
    name !== "new" && fetchData().catch(console.error);
    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Finished, fetchData])






  return (
    <div className="content-wrapper">
      {Loading ? <LoadingSpinner />
        : Http4XXAnd5XX[0] ? <Http4XXAnd5XXError error={Http4XXAnd5XX[1]} setHttp4XXAnd5XX={setHttp4XXAnd5XX} /> :
          (
            <div className="col-md">
              <div className="card card-info">
                <div className="card-header">
                  <h3 className="card-title">Contracttype {name !== "new" ? "aanpassen" : "toevoegen"}</h3>
                </div>
                {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}

                <form onSubmit={submitHandler}>
                  <div className="card-body">

                    <div className="form-group">
                      <label htmlFor="NAME_SHIFT">Naam</label>
                      <input type="text" class="form-control" id="NAME_SHIFT" onChange={(e) => setName(e.target.value)} value={Name} />
                    </div>


                    <div className="form-group" >
                      <div class="custom-control custom-checkbox">
                        <input class="custom-control-input custom-control-input-danger" type="checkbox" id="VERPLICHT" checked={StandbyAllowed} onClick={() => setStandbyAllowed(!StandbyAllowed)} />
                        <label for="VERPLICHT" class="custom-control-label" >Standby shiften toegelaten </label>
                      </div>
                    </div>


                    <div className="form-group">
                      <label class="htmlForm-check-label" for="BEGIN_UREN">Wekelijkse contract uren</label>
                      <input type="number" class="form-control" id="BEGIN_UREN" value={WeeklyContractHours} onChange={(e) => setWeeklyContractHours(e.target.value)} />
                    </div>


                    <div className="form-group">
                      <label class="htmlForm-check-label" for="EIND_UREN">Kwartaal contract uren</label>
                      <input type="number" class="form-control" id="EIND_UREN" value={MonthlyContractHours} onChange={(e) => setMonthlyContractHours(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label class="htmlForm-check-label" for="BEGIN_UREN">Ideaal aantal shifts per week</label>
                      <input type="number" class="form-control" id="BEGIN_UREN" value={IdeaalShiftsAWeek} onChange={(e) => setIdeaalShiftsAWeek(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label class="htmlForm-check-label" for="EIND_UREN">Maximum opeenvolgende shiften</label>
                      <input type="number" class="form-control" id="EIND_UREN" value={MaxFollowingShifts} onChange={(e) => setMaxFollowingShifts(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label class="htmlForm-check-label" for="EIND_UREN">Maximum aantal shiften per week</label>
                      <input type="number" class="form-control" id="EIND_UREN" value={MaxShiftsAWeek} onChange={(e) => setMaxShiftsAWeek(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label class="htmlForm-check-label" for="EIND_UREN">Maximum aantal uur per week</label>
                      <input type="number" class="form-control" id="EIND_UREN" value={MaxHoursAWeek} onChange={(e) => setMaxHoursAWeek(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label class="htmlForm-check-label" for="BEGIN_UREN">Maximum aantal uren per maand</label>
                      <input type="number" class="form-control" id="BEGIN_UREN" value={MaxHoursAMonth} onChange={(e) => setMaxHoursAMonth(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label class="htmlForm-check-label" for="BEGIN_UREN">Maximum aanstal weekends per jaar</label>
                      <input type="number" class="form-control" id="BEGIN_UREN" value={MaxWeekendsAYear} onChange={(e) => setMaxWeekendsAYear(e.target.value)} />
                    </div>





                    <div className="card-footer">
                      <button type="submit" style={{ width: "125px" }} className="btn btn-success">{name!=="new" ? "Aanpassen" : "Toevoegen"}</button>
                      {name!=="new" &&
                        <button type="button" style={{ marginLeft: "50px", width: "125px" }} class="btn btn-danger " onClick={(() => (deleteHandler()))}>Verwijderen</button>}
                      <button type="button" style={{ marginLeft: "50px", width: "125px" }} class="btn btn-warning " onClick={(() => (setFinished(!Finished)))}>Annuleren</button>

                    </div>
                  </div>

                </form>


              </div>
            </div>)}

    </div>


  )
}

export default EditContractType