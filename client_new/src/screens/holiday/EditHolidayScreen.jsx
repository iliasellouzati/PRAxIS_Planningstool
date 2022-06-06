import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/general/LoadingSpinner';

const EditHolidayScreen = ({ setShowSuccesModal, setShowDangerModal }) => {
  const { year, id } = useParams();
  const [Loading, setLoading] = useState(true);
  const [Name, setName] = useState("");
  const [YEAR, setYEAR] = useState(year);
  const [Date, setDate] = useState('');
  const [Finished, setFinished] = useState(false);
  const history = useHistory();


  const fetchData = async () => {
    setLoading(true);

    if (id === 'new') {
      //Do-Nothinh
      setLoading(false);
    } else {

      await axios.get(`http://127.0.0.1:3001/api/holiday/${id}`)
        .then(response => {
          setName(response.data[0].naam)
          setYEAR(response.data[0].jaar)
          setDate(moment(response.data[0].datum, "YYYY-MM-DD").format("DD-MM-YYYY"))
        })
        .finally(() => setLoading(false));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (id === 'new') {

      await axios.post('http://127.0.0.1:3001/api/holiday', {
        "naam": Name,
        "jaar": YEAR,
        "datum": Date
      }).then((response) => {
        setShowSuccesModal([true, ["Toegevoegd!", `Jaar:${YEAR}`, `Feestdag ${Name} werd toegevoegd!`]])
        setFinished(true);
      })
    } else {
      await axios.put('http://127.0.0.1:3001/api/holiday/' + id, {

        "naam": Name,
        "jaar": YEAR,
        "datum": Date

      }).then(() => {
        setShowSuccesModal([true, ["Aangepast!", `Jaar:${YEAR}`, `Feestdag ${Name}  werd aangepast!`]])
        setFinished(true);
      })
    }

  }

  const deleteHandler = async () => {
    let answer = window.confirm("Feestdag " + id + " verwijderen?");
    if (answer) {
      axios.delete('http://127.0.0.1:3001/api/holiday/' + id)
        .then(response => {
          setShowDangerModal([true, ["Verwijderd!", `ID:${id}`, `Feestdag ${Name} werd verwijderd!`]])
          setFinished(true);
        });
    }
  }


  useEffect(() => {
    if (Finished) {
      history.push(`/feestdagen/${year}`);
    }
    fetchData().catch(e => console.log(e));
    return () => {

    }
  }, [Finished])

  return (
    <div className='content-wrapper'>
      {Loading ? <LoadingSpinner />
        :
        (
          <div className="col-md">
            <div className="card card-info">
              <div className="card-header">
                <h3 className="card-title">Feestdag {id !== "new" ? "aanpassen" : "toevoegen"}</h3>
              </div>

              <form onSubmit={submitHandler}>
                <div className="card-body">

                  {/* NAAM */}
                  <div className="form-group" >
                    <label for="EMPL_NAME" >Naam</label>
                    <input type="text" class="form-control" id="EMPL_NAME" onChange={(e) => setName(e.target.value)} value={Name} />
                  </div>


                  {/* JAAR */}
                  <div className="form-group" >
                    <label for="EMPL_NAME" >Jaar </label>
                    <input type="number" class="form-control" id="EMPL_NAME" onChange={(e) => setYEAR(e.target.value)} value={YEAR} />
                  </div>



                  {/* DATUM */}
                  <label>Datum: </label>
                  <div class="input-group" style={{width:'200px'}}>
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
                    </div>
                    <input type="date" class="form-control" value={moment(Date, "DD-MM-YYYY").format("YYYY-MM-DD")} onChange={(e) => setDate(moment(e.target.value, "YYYY-MM-DD").format("DD-MM-YYYY"))} />
                  </div>

                  <div className="card-footer">
                    <button type="submit" style={{ width: "125px" }} className="btn btn-success">{id !== "new" ? "Aanpassen" : "Toevoegen"}</button>
                    {id !== "new" &&
                      <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-danger " onClick={(() => deleteHandler())}     >Verwijderen</button>}
                    <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-warning " onClick={() => setFinished(true)}>Annuleren</button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  )
}

export default EditHolidayScreen