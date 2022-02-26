import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import BadRequest400Error from '../../components/general/BadRequest400Error';

const EditShifttype = ({ setShowSuccesModal, setShowDangerModal }) => {

  const { name } = useParams();
  const history = useHistory();

  const [Http4XXAnd5XX, setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([false, ""])
  const [Finished, setFinished] = useState(false);
  const [Loading, setLoading] = useState(false);

  const [Name, setName] = useState("")
  const [StartMoment, setStartMoment] = useState("")
  const [EndMoment, setEndMoment] = useState("")
  const [ColorCode, setColorCode] = useState("#ffffff")
  const [Obligated, setObligated] = useState(false)
  const [HomeWork, setHomeWork] = useState(false)
  const [ChangeableHours, setChangeableHours] = useState(false)
  const [Category, setCategory] = useState("")
  const [TextColorCode, setTextColorCode] = useState("#000000")
  const [Border, setBorder] = useState(false)
  const [StandardText, setStandardText] = useState("")
  const [Standby, setStandby] = useState(false)
  const [Active, setActive] = useState(false)





  const submitHandler = async (e) => {
    e.preventDefault();
    
    name === 'new' ?

      await axios.post('http://127.0.0.1:3001/api/shifttype', {
        "name": Name,
        "startmoment": StartMoment,
        "endmoment": EndMoment,
        "colorcode": ColorCode,
        "obligated": Obligated,
        "homework": HomeWork,
        "changeablehours": ChangeableHours,
        "category": Category,
        "textcolorcode": TextColorCode,
        "border": Border,
        "standardtext": StandardText,
        "standby": Standby,
        "active": Active
      }).then(() => {
        setShowSuccesModal([true, ["Toegevoegd!", `ID:${Name}`, `Shifttype ${Name} werd toegevoegd in cat. ${Category}!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
      
      :
      
      await axios.put('http://127.0.0.1:3001/api/shifttype/' + name, {
        "name": Name,
        "startmoment": StartMoment,
        "endmoment": EndMoment,
        "colorcode": ColorCode,
        "obligated": Obligated,
        "homework": HomeWork,
        "changeablehours": ChangeableHours,
        "category": Category,
        "textcolorcode": TextColorCode,
        "border": Border,
        "standardtext": StandardText,
        "standby": Standby,
        "active": Active
      }).then(() => {
        setShowSuccesModal([true, ["Aangepast!", `ID:${Name}`, `Shifttype ${Name} werd aangepast in cat. ${Category}!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
  };


  const deleteHandler = () => {
    let answer = window.confirm("Shift " + Name + " verwijderen?");

    if (answer) {
      axios.delete('http://127.0.0.1:3001/api/shifttype/' + name)
        .then(response => {
          setShowDangerModal([true, ["Verwijderd!", `ID:${Name}`, `Shift ${Name} uit cat. ${Category} werd verwijderd!`]])
          setFinished(true);
        }).catch(error => setHttp4XXAnd5XX([true, error.response.data]));

    }
  }

  const fetchData = useCallback(async () => {
    await axios.get('http://127.0.0.1:3001/api/shifttype/' + name)
      .then(response => {
        setName(response.data[0].naam);
        setStartMoment(response.data[0].beginuur);
        setEndMoment(response.data[0].einduur);
        setColorCode(response.data[0].kleurcode);
        setObligated(response.data[0].verplicht);
        setHomeWork(response.data[0].thuiswerk);
        setChangeableHours(response.data[0].aanpasbare_uren);
        setCategory(response.data[0].categorie);
        setTextColorCode(response.data[0].tekstkleurcode);
        setBorder(response.data[0].border);
        setStandardText(response.data[0].standaardtekst);
        setStandby(response.data[0].standby);
        setActive(response.data[0].actief);
      })
      .catch(error => setHttp4XXAnd5XX([true, error]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    if (Finished) {
      history.push("/shifttypes");
    }
    name !== "new" && fetchData().catch(console.error);
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
                  <h3 className="card-title">Shifttype {name !== "new" ? "aanpassen" : "toevoegen"}</h3>
                </div>
                {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}

                <form onSubmit={submitHandler}>
                  <div className="card-body">

                    {/* NAAM SHIFT */}
                    <div className="form-group">
                      <label htmlFor="NAME_SHIFT">Naam</label>
                      <input type="text" class="form-control" id="NAME_SHIFT" onChange={(e) => setName(e.target.value)} value={Name} />
                    </div>
                    <div className="row">
                      <div className="col-3">

                        {/* VERPLICHT */}
                        <div className="form-group" >
                          <div class="custom-control custom-checkbox">
                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id="VERPLICHT" checked={Obligated} onClick={() => setObligated(!Obligated)} />
                            <label for="VERPLICHT" class="custom-control-label" >Verplicht op planning </label>
                          </div>
                        </div>

                        {/* THUISWERK */}
                        <div className="form-group" >
                          <div class="custom-control custom-checkbox">
                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id="THUISWERK" checked={HomeWork} onClick={() => setHomeWork(!HomeWork)} />
                            <label for="THUISWERK" class="custom-control-label" >Thuiswerk </label>
                          </div>
                        </div>

                        {/* AANPASBARE UREN */}
                        <div className="form-group" >
                          <div class="custom-control custom-checkbox">
                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id="AANPASBARE_UREN" checked={ChangeableHours} onClick={() => setChangeableHours(!ChangeableHours)} />
                            <label for="AANPASBARE_UREN" class="custom-control-label" >De uren kunnen aangepast worden </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-3">

                        {/* STANDBY */}
                        <div className="form-group" >
                          <div class="custom-control custom-checkbox">
                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id="STANDBY" checked={Standby} onClick={() => setStandby(!Standby)} />
                            <label for="STANDBY" class="custom-control-label" >Standby vergoeding </label>
                          </div>
                        </div>

                        {/* ACTIEF */}
                        <div className="form-group" >
                          <div class="custom-control custom-checkbox">
                            <input class="custom-control-input custom-control-input-danger" type="checkbox" id="ACTIEF" checked={Active} onClick={() => setActive(!Active)} />
                            <label for="ACTIEF" class="custom-control-label" >Actief </label>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* BEGINUUR */}
                    <div className="form-group">
                      <label class="htmlForm-check-label" for="BEGIN_UREN">Beginuur</label>
                      <input type="time" class="form-control" id="BEGIN_UREN" value={StartMoment} onChange={(e) => setStartMoment(e.target.value)} />
                    </div>

                    {/* EINDUUR */}
                    <div className="form-group">
                      <label class="htmlForm-check-label" for="EIND_UREN">Einduur</label>
                      <input type="time" class="form-control" id="EIND_UREN" value={EndMoment} onChange={(e) => setEndMoment(e.target.value)} />
                    </div>

                    {/* CATEGORIE */}
                    <div className="form-group">
                      <label htmlFor="CATEGORIE">Categorie</label>
                      <input type="text" class="form-control" list="CATEGORIE" onChange={(e) => setCategory(e.target.value)} value={Category} />
                    </div>

                    <div style={{ border: "1px dashed black", borderRadius: "15px", padding: "10px" }} >

                      {/* KLEURCODE */}
                      <div className="form-group">
                        <label for="KLEURCODE" >Kleurcode</label>
                        <input type="color" id="KLEURCODE" class="form-control my-colorpicker1 colorpicker-element" value={ColorCode} onChange={(e) => setColorCode(e.target.value)} />
                      </div>

                      {/* TEKSTKLEURCODE */}
                      <div className="form-group">
                        <label for="TEKSTKLEURCODE" >Tekstkleurcode</label>
                        <input type="color" id="TEKSTKLEURCODE" class="form-control my-colorpicker1 colorpicker-element" value={TextColorCode} onChange={(e) => setTextColorCode(e.target.value)} />
                      </div>

                      {/* BORDER */}
                      <div className="form-group" >
                        <div class="custom-control custom-checkbox">
                          <input class="custom-control-input custom-control-input-danger" type="checkbox" id="BORDER" checked={Border} onClick={() => setBorder(!Border)} />
                          <label for="BORDER" class="custom-control-label" > Zwarte border </label>
                        </div>
                      </div>

                      {/* NAAM SHIFT */}
                      <div className="form-group">
                        <label htmlFor="STANDAARDTEKST">Standaardtekst: uur (toont uren, vb '12','9') / min (toont uren+min, vb '12:00','6:30') / overige (vb 'SB', 'X',...)</label>
                        <input type="text" class="form-control" id="STANDAARDTEKST" maxLength="3" onChange={(e) => setStandardText(e.target.value)} value={StandardText} />
                      </div>

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
            </div>

          )}
    </div>
  )
}

export default EditShifttype