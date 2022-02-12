import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import BadRequest400Error from '../../components/general/BadRequest400Error';

const EditEmployee = ({ setShowSuccesModal, setShowDangerModal }) => {

  const { id } = useParams();
  const history = useHistory();

  const [Http4XXAnd5XX, setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([false, ""])
  const [Finished, setFinished] = useState(false);
  const [Loading, setLoading] = useState(true);

  const [Id, setId] = useState("");
  const [Naam, setNaam] = useState("");
  const [Email, setEmail] = useState("");
  const [Contracttype, setContracttype] = useState("");

  const fetchData = useCallback(async () => {
    await axios.get('http://127.0.0.1:3001/api/employee/' + id)
      .then(response => {
        console.log(response);
        setId(response.data[0].id);
        setNaam(response.data[0].naam);
        setEmail(response.data[0].email);
        setContracttype(response.data[0].contracttype)
      })
      .catch(error => setHttp4XXAnd5XX([true, error]));
  }, []);

  const deleteHandler = async () => {
    let answer = window.confirm("Werknemer " + Naam + " verwijderen?");
    if (answer) {
      axios.delete('http://127.0.0.1:3001/api/employee/' + id)
        .then(response => {
          setShowDangerModal([true, ["Verwijderd!", `ID:${Id}`, `Werknemer ${Naam} werd verwijderd!`]])
          setFinished(true);
        }).catch(error => setHttp4XXAnd5XX([true, error.response.data]));
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    id === 'new' ?

      await axios.post('http://127.0.0.1:3001/api/employee/', {
        "name": Naam,
        "id": Id,
        "email": Email,
        "contracttype": Contracttype
      }).then(() => {
        setShowSuccesModal([true, ["Toegevoegd!", `ID:${Id}`, `Werknemer ${Naam} werd toegevoegd!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
      :
      await axios.put('http://127.0.0.1:3001/api/employee/' + id, {
        "name": Naam,
        "id": Id,
        "email": Email,
        "contracttype": Contracttype
      }).then(() => {
        setShowSuccesModal([true, ["Aangepast!", `ID:${Id}`, `Werknemer ${Naam} werd aangepast!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
  }

  useEffect(() => {

    if (Finished) {
      history.push("/werknemers");
    }
    id !== "new" && fetchData().catch(console.error);
    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Finished, fetchData])

  return (
    <div className="content-wrapper">
      {Loading ? <LoadingSpinner />
        : Http4XXAnd5XX[0] ? <Http4XXAnd5XXError error={Http4XXAnd5XX[1]} setHttp4XXAnd5XX={setHttp4XXAnd5XX} /> :
          (
            <div className="card card-info">
              <div className="card-header">
                <h3 className="card-title">Werknemer {id !== "new" ? "aanpassen" : "toevoegen"}</h3>
              </div>
              {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}

              <form onSubmit={submitHandler}>
                <div className="card-body">

                  {/* ID */}
                  <div className="form-group">
                    <label htmlFor="ID">ID</label>
                    <input type="number" class="form-control" id="ID" onChange={(e) => setId(e.target.value)} value={Id} />
                  </div>

                  {/* NAAM */}
                  <div className="form-group" >
                    <label for="EMPL_NAME" >Naam </label>
                    <input type="text" class="form-control" id="EMPL_NAME" onChange={(e) => setNaam(e.target.value)} value={Naam} />
                  </div>

                  {/* EMAIL */}
                  <div className="form-group" >
                    <label for="EMPL_MAIL"  >Email</label>
                    <input type="email" class="form-control" id="EMPL_MAIL" onChange={(e) => setEmail(e.target.value)} value={Email} />
                  </div>
                  {/* CONTRACTTYPE */}
                  <div className="form-group" >
                    <div className="row">
                      <div className="col-3">
                        <label for="EMPL_CONTRACT"  >Contracttype</label>
                        <input type="text" class="form-control" list="CATEGORIE" id="EMPL_CONTRACT" onChange={(e) => setContracttype(e.target.value)} value={Contracttype} />
                      </div>
                    </div>
                 </div>

                  <div className="card-footer">
                    <button type="submit" style={{ width: "125px" }} className="btn btn-success">{id !== "new" ? "Aanpassen" : "Toevoegen"}</button>
                    {id !== "new" &&
                      <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-danger " onClick={(() => deleteHandler())}     >Verwijderen</button>}
                    <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-warning " onClick={() => setFinished(!Finished)}>Annuleren</button>

                  </div>
                </div>
              </form>
            </div>
          )}
   </div>
  )
}

export default EditEmployee