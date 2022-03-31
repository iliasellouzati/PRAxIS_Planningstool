/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import BadRequest400Error from '../../components/general/BadRequest400Error';
import ReadOnlyShift from '../../components/shift/ReadOnlyShift';

const EditWeeklyStructure = ({ setShowSuccesModal, setShowDangerModal }) => {


  const { id } = useParams();
  const history = useHistory();

  const [Http4XXAnd5XX, setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([false, ""])
  const [Finished, setFinished] = useState(false);
  const [Loading, setLoading] = useState(0);

  const [ShiftTypes, setShiftTypes] = useState([])

  const [Id, setId] = useState("");
  const [Maandag, setMaandag] = useState("");
  const [Dinsdag, setDinsdag] = useState("");
  const [Woensdag, setWoensdag] = useState("");
  const [Donderdag, setDonderdag] = useState("");
  const [Vrijdag, setVrijdag] = useState("");
  const [Zaterdag, setZaterdag] = useState("");
  const [Zondag, setZondag] = useState("");
  const [Score, setScore] = useState(0);

  let verplichteShiften = ["0618", "0719", "1806", "1907"];
  let hulpValAllShifts = id;


  const [AllShifts, setAllShifts] = useState(false);

  const [SelectedShift, setSelectedShift] = useState("");

  const submitHandler = async (e) => {

    e.preventDefault();

    id !== 'new' ?

      await axios.put('http://127.0.0.1:3001/api/weeklystructure/' + id, {
        "id": Id,
        "maandag": Maandag,
        "dinsdag": Dinsdag,
        "woensdag": Woensdag,
        "donderdag": Donderdag,
        "vrijdag": Vrijdag,
        "zaterdag": Zaterdag,
        "zondag": Zondag,
        "score": Score
      }).then(() => {
        setShowSuccesModal([true, ["Toegevoegd!", `ID:${Id}`, `Weekstructuur ${Id} werd toegevoegd!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))

      :
      AllShifts ?

        verplichteShiften.forEach(async (dag) => {
          await axios.post('http://127.0.0.1:3001/api/weeklystructure', {
            "id": hulpValAllShifts++,
            "maandag": Maandag !== "" ? dag : "",
            "dinsdag": Dinsdag !== "" ? dag : "",
            "woensdag": Woensdag !== "" ? dag : "",
            "donderdag": Donderdag !== "" ? dag : "",
            "vrijdag": Vrijdag !== "" ? dag : "",
            "zaterdag": Zaterdag !== "" ? dag : "",
            "zondag": Zondag !== "" ? dag : "",
            "score": Score
          }).then(() => {
            setShowSuccesModal([true, ["Toegevoegd!", `ID:${Id - 3}-${Id}`, `Weekstructuren ${Id - 3} tot ${Id} werden toegevoegd!`]])
            setFinished(true);

          }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))

        })

        :

        await axios.post('http://127.0.0.1:3001/api/weeklystructure', {
          "id": Id,
          "maandag": Maandag,
          "dinsdag": Dinsdag,
          "woensdag": Woensdag,
          "donderdag": Donderdag,
          "vrijdag": Vrijdag,
          "zaterdag": Zaterdag,
          "zondag": Zondag,
          "score": Score
        }).then(() => {
          setShowSuccesModal([true, ["Toegevoegd!", `ID:${Id}`, `Weekstructuur ${Id} werd toegevoegd!`]])
          setFinished(true);
        }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
  };


  const deleteHandler = () => {
    let answer = window.confirm("Weekstructuur " + Id + " verwijderen?");
    if (answer) {
      axios.delete('http://127.0.0.1:3001/api/weeklystructure/' + id)
        .then(response => {
          setShowDangerModal([true, ["Verwijderd!", `ID:${Id}`, `Weekstructuur ${Id} werd verwijderd!`]])
          setFinished(true);
        }).catch(error => setHttp4XXAnd5XX([true, error.response.data]));
    }
  }

  const fetchWeeklyStructure = useCallback(async () => {
    await axios.get('http://127.0.0.1:3001/api/weeklystructure/' + id)
      .then(response => {
        setId(response.data[0].id);
        setMaandag(response.data[0].maandag);
        setDinsdag(response.data[0].dinsdag);
        setWoensdag(response.data[0].woensdag);
        setDonderdag(response.data[0].donderdag);
        setVrijdag(response.data[0].vrijdag);
        setZaterdag(response.data[0].zaterdag);
        setZondag(response.data[0].zondag);
        setScore(response.data[0].score);
        setLoading(prev => prev + 1);
      })
      .catch(error => {
        setHttp4XXAnd5XX([true, error]);
        setLoading(prev => prev + 1);
      })
  }, []);

  const fetchShifttypes = useCallback(async () => {
    await axios.get('http://127.0.0.1:3001/api/shifttype')
      .then(response => {
        setShiftTypes(response.data);
        setLoading(prev => prev + 1);
      })
      .catch(error => {
        setHttp4XXAnd5XX([true, error]);
        setLoading(prev => prev + 1);
      })
  }, []);

  useEffect(() => {

    if (Finished)
      history.push("/weekstructuren");

    id !== "new" && fetchWeeklyStructure().catch(console.error);
    fetchShifttypes().catch(console.error);


  }, [Finished])



  return (
    <div className="content-wrapper">
      {(id !== "new" & Loading !== 2) | (id === "new" & Loading !== 1) ? <LoadingSpinner />
        : Http4XXAnd5XX[0] ? <Http4XXAnd5XXError error={Http4XXAnd5XX[1]} setHttp4XXAnd5XX={setHttp4XXAnd5XX} /> :
          (
            <div className="col-md">
              <div className="card card-info">
                <div className="card-header">
                  <h3 className="card-title">Weektype {id !== "new" ? "aanpassen" : "toevoegen"}</h3>
                </div>
                {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}
                <form onSubmit={submitHandler}>
                  <div className="card-body">

                    {/* ID */}
                    <div className="form-group">
                      <label htmlFor="ID">ID</label>
                      <input type="number" class="form-control" id="ID" onChange={(e) => setId(e.target.value)} value={Id} />
                    </div>


                    {/* CONFIGURATIESCHERM */}
                    {id === "new" &&
                      <div className="form-group" >
                        <div class="custom-control custom-checkbox">
                          <input class="custom-control-input custom-control-input-danger" type="checkbox" id="STANDBY" checked={AllShifts} onClick={() => setAllShifts(!AllShifts)} />
                          <label for="STANDBY" class="custom-control-label" >Weektype aanmaken voor de 4 operatorshiften </label>
                        </div>
                      </div>
                    }

                    <div className='row' >
                      <div style={{ display: "inline-block", textAlign: "center" }}>
                        <b>Geselecteerde shift:</b>
                        <p>{SelectedShift === "" ? "Geen" : AllShifts ? "4X" : SelectedShift}</p>
                      </div>
                      {!AllShifts &&
                        verplichteShiften.map(dag =>
                          <div onClick={() => setSelectedShift(dag)} style={{ display: "inline-block", padding: "10px", margin: "10px", border: "1px dashed black" }}>
                            <ReadOnlyShift shift={ShiftTypes.find(x => x.naam === dag)} shiftDay={false} />
                          </div>
                        )
                      }
                      {AllShifts &&
                        <div onClick={() => setSelectedShift("4X")} style={{ display: "inline-block", padding: "10px", margin: "10px", textAlign: "center", border: "1px dashed black" }}>
                          4X
                        </div>}

                      <div onClick={() => setSelectedShift("")} style={{ display: "inline-block", padding: "10px", margin: "10px", textAlign: "center", border: "1px dashed black" }}>
                        <i style={{ color: 'red' }} class="fas fa-times" />
                      </div>
                    </div>



                    {/* WEEKPLANNING */}
                    <div className='row' >

                      <div onClick={() => SelectedShift === "" ? setMaandag("") : AllShifts ? setMaandag("4X") : setMaandag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                        <p>Maandag</p>
                        {Maandag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Maandag}
                      </div>

                      <div onClick={() => SelectedShift === "" ? setDinsdag("") : AllShifts ? setDinsdag("4X") : setDinsdag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                        <p>Dinsdag</p>
                        {Dinsdag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Dinsdag}

                      </div>
                      <div onClick={() => SelectedShift === "" ? setWoensdag("") : AllShifts ? setWoensdag("4X") : setWoensdag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                        <p>Woensdag</p>
                        {Woensdag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Woensdag}

                      </div>
                      <div onClick={() => SelectedShift === "" ? setDonderdag("") : AllShifts ? setDonderdag("4X") : setDonderdag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                        <p>Donderdag</p>
                        {Donderdag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Donderdag}

                      </div>
                      <div onClick={() => SelectedShift === "" ? setVrijdag("") : AllShifts ? setVrijdag("4X") : setVrijdag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                        <p>Vrijdag</p>
                        {Vrijdag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Vrijdag}

                      </div>
                      <div onClick={() => SelectedShift === "" ? setZaterdag("") : AllShifts ? setZaterdag("4X") : setZaterdag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                        <p>Zaterdag</p>
                        {Zaterdag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Zaterdag}

                      </div>
                      <div onClick={() => SelectedShift === "" ? setZondag("") : AllShifts ? setZondag("4X") : setZondag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                        <p>Zondag</p>
                        {Zondag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Zondag}

                      </div>
                    </div>

                    <div className="form-group">
                      <label class="htmlForm-check-label" for="SCORE">Score op 10 ( 0 : mogelijk maar te vermijden - 10 : ideaal ) </label>
                      <input type="number" min={0} max={10} class="form-control" id="SCORE" value={Score} onChange={(e) => setScore(e.target.value)} />
                    </div>

                  </div>

                  <div className="card-footer">
                    <button type="submit" style={{ width: "125px" }} className="btn btn-success">{id !== "new" ? "Aanpassen" : "Toevoegen"}</button>
                    {id !== "new" &&
                      <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-danger " onClick={(() => deleteHandler())}     >Verwijderen</button>}
                    <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-warning " onClick={() => setFinished(!Finished)}>Annuleren</button>

                  </div>
                </form>
              </div>

            </div>
          )
      }
    </div>
  )
}

export default EditWeeklyStructure