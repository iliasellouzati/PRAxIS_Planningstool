import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Http4XXAnd5XXError from '../../components/general/Http4XXAnd5XXError';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import BadRequest400Error from '../../components/general/BadRequest400Error';
import moment from 'moment';

const EditEmployee = ({ setShowSuccesModal, setShowDangerModal }) => {

  const { id } = useParams();
  const history = useHistory();

  const [Http4XXAnd5XX, setHttp4XXAnd5XX] = useState([false, ""]);
  const [Http400Error, setHttp400Error] = useState([false, ""])
  const [Finished, setFinished] = useState(false);
  const [Loading, setLoading] = useState(true);

  const [Id, setId] = useState("");
  const [VoorNaam, setVoorNaam] = useState("");
  const [FamilieNaam, setFamilieNaam] = useState("");
  const [ContractType, setContractType] = useState(1);
  const [Email, setEmail] = useState("");
  const [Franstalig, setFranstalig] = useState("");
  const [Opleiding, setOpleiding] = useState("");
  const [Contracts, setContracts] = useState([]);
  const [ContractToevoegbaar, setContractToevoegbaar] = useState("");
  const [Geboortedatum, setGeboortedatum] = useState("");
  const [GeboortedatumPartner, setGeboortedatumPartner] = useState("");

  const [AlleContractTypes, setAlleContractTypes] = useState("");

  const [LaatsteContract, setLaatsteContract] = useState("");

  const [NieuwContract, setNieuwContract] = useState({
    'begindatum': null,
    'einddatum': null
  })


  const [ShowContractToevoegen, setShowContractToevoegen] = useState(false);
  const [ShowLaatsteContractAanpassen, setShowLaatsteContractAanpassen] = useState(false);
  const [LaatsteContractTotNaderOrder, setLaatsteContractTotNaderOrder] = useState(false);

  const [VerjaardagPartnerActief, setVerjaardagPartnerActief] = useState(false);

  const fetchData = async () => {
    if (id !== "new") {
      await axios.get('http://127.0.0.1:3001/api/employee/' + id)
        .then(response => {
          console.log(response);
          setId(response.data[0].id);
          setVoorNaam(response.data[0].voornaam);
          setFamilieNaam(response.data[0].familienaam);
          setContractType(response.data[0].contracttype_id);
          setEmail(response.data[0].email);
          setFranstalig(response.data[0].franstalig);
          setOpleiding(response.data[0].opleiding);
          setGeboortedatum(response.data[0].geboortedatum);
          if (response.data[0].geboortedatum_partner) {
            setGeboortedatumPartner(response.data[0].geboortedatum_partner);
            setVerjaardagPartnerActief(true);
          } else {
            setVerjaardagPartnerActief(false);
          }
        })
        .catch(error => setHttp4XXAnd5XX([true, error]));
      await axios.get(`http://127.0.0.1:3001/api/employee/${id}/contract`)
        .then(response => {
          if (response.status === '204'||response.data.length===0) {
            setContracts(null);
            setLaatsteContract(null);
            setContractToevoegbaar(true);

          } else {
          console.log('contracts:');
          console.log(response.data);
          setContracts(response.data);
          let laatsteContract = response.data.reduce((prev, curr) => moment(prev.begindatum, "DD/MM/YYYY").isBefore(moment(curr.begindatum, "DD/MM/YYYY")) ? curr : prev);
          setLaatsteContract(laatsteContract);
          if (laatsteContract.einddatum) {
            setContractToevoegbaar(true);
            setLaatsteContractTotNaderOrder(false);
          } else {
            setContractToevoegbaar(false);
            setLaatsteContractTotNaderOrder(true);
          }
          }
        })
        .catch(error => setHttp4XXAnd5XX([true, error]));


    }

    await axios.get('http://127.0.0.1:3001/api/contracttype')
      .then(response => setAlleContractTypes(response.data))
      .catch(error => setHttp4XXAnd5XX([true, error]));

  };



  const resetLaatsteContract = () => {
    let laatsteContract = Contracts.reduce((prev, curr) => moment(prev.begindatum, "DD/MM/YYYY").isBefore(moment(curr.begindatum, "DD/MM/YYYY")) ? curr : prev);
    setLaatsteContract(laatsteContract);
  }


  const laatsteContractAanpassen = async () => {
    await axios.put(`http://127.0.0.1:3001/api/employee/${id}/contract/${LaatsteContract.Id}`, {
      ...LaatsteContract,
      'einddatum': LaatsteContractTotNaderOrder ? null : LaatsteContract['einddatum']
    }).catch(error => setHttp4XXAnd5XX([true, error]));
    await axios.get(`http://127.0.0.1:3001/api/employee/${id}/contract`)
      .then(response => {
        if (response.status === '204') {
          setContracts(null);
        } else {
        console.log(response.data);
        setContracts(response.data);
        let laatsteContract = response.data.reduce((prev, curr) => moment(prev.begindatum, "DD/MM/YYYY").isBefore(moment(curr.begindatum, "DD/MM/YYYY")) ? curr : prev);
        setLaatsteContract(laatsteContract);
        if (laatsteContract.einddatum) {
          setContractToevoegbaar(true);
          setLaatsteContractTotNaderOrder(false);
        } else {
          setContractToevoegbaar(false);
          setLaatsteContractTotNaderOrder(true);
        }
        setShowContractToevoegen(false);
        setShowLaatsteContractAanpassen(false);
      }
      })
      .catch(error => setHttp4XXAnd5XX([true, error]));


  };

  const nieuwContractToevoegen = async () => {

    await axios.post(`http://127.0.0.1:3001/api/employee/${id}/contract`, {
      'begindatum': NieuwContract['begindatum'],
      'einddatum': LaatsteContractTotNaderOrder ? null : NieuwContract['einddatum']
    }).catch(error => setHttp4XXAnd5XX([true, error]));

    await axios.get(`http://127.0.0.1:3001/api/employee/${id}/contract`)
      .then(response => {
        if (response.status === '204') {
          setContracts(null);
        } else {

          console.log(response.data);
          setContracts(response.data);
          let laatsteContract = response.data.reduce((prev, curr) => moment(prev.begindatum, "DD/MM/YYYY").isBefore(moment(curr.begindatum, "DD/MM/YYYY")) ? curr : prev);
          setLaatsteContract(laatsteContract);
          if (laatsteContract.einddatum) {
            setContractToevoegbaar(true);
            setLaatsteContractTotNaderOrder(false);
          } else {
            setContractToevoegbaar(false);
            setLaatsteContractTotNaderOrder(true);
          }
          setShowContractToevoegen(false);
          setShowLaatsteContractAanpassen(false);
        }
      })
      .catch(error => setHttp4XXAnd5XX([true, error]));
  }
  const deleteHandler = async () => {
    let answer = window.confirm("Werknemer " + VoorNaam + " " + " verwijderen?");
    if (answer) {
      axios.delete('http://127.0.0.1:3001/api/employee/' + id)
        .then(response => {
          setShowDangerModal([true, ["Verwijderd!", `ID:${Id}`, `Werknemer ${VoorNaam} werd verwijderd!`]])
          setFinished(true);
        }).catch(error => setHttp4XXAnd5XX([true, error.response.data]));
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    id === 'new' ?

      await axios.post('http://127.0.0.1:3001/api/employee/', {
        "voornaam": VoorNaam,
        "familienaam": FamilieNaam,
        "contracttype_id": ContractType,
        "email": Email,
        "franstalig": Franstalig,
        "opleiding": Opleiding,
        "geboortedatum": Geboortedatum,
        "geboortedatum_partner": VerjaardagPartnerActief ? GeboortedatumPartner : null,

      }).then((response) => {
        setShowSuccesModal([true, ["Toegevoegd!", `ID:${Id}`, `Werknemer ${VoorNaam} werd toegevoegd!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
      :
      await axios.put('http://127.0.0.1:3001/api/employee/' + id, {

        "id": Id,
        "voornaam": VoorNaam,
        "familienaam": FamilieNaam,
        "contracttype_id": ContractType,
        "email": Email,
        "franstalig": Franstalig,
        "opleiding": Opleiding,
        "geboortedatum": Geboortedatum,
        "geboortedatum_partner": VerjaardagPartnerActief ? GeboortedatumPartner : null
      }).then(() => {
        setShowSuccesModal([true, ["Aangepast!", `ID:${Id}`, `Werknemer ${VoorNaam} werd aangepast!`]])
        setFinished(true);
      }).catch(error => error.response.status === 400 ? setHttp400Error([true, ["Foutmelding", error.response.data]]) : setHttp4XXAnd5XX([true, error]))
  }

  useEffect(() => {

    if (Finished) {
      history.push("/werknemers");
    }
    fetchData().catch(console.error);
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
                  <h3 className="card-title">Werknemer {id !== "new" ? "aanpassen" : "toevoegen"}</h3>
                </div>
                {Http400Error[0] && <BadRequest400Error error={Http400Error[1]} setHttp400Error={setHttp400Error} />}

                <form onSubmit={submitHandler}>
                  <div className="card-body">

                    {/* VOORNAAM */}
                    <div className="form-group" >
                      <label for="EMPL_NAME" >Voornaam</label>
                      <input type="text" class="form-control" id="EMPL_NAME" onChange={(e) => setVoorNaam(e.target.value)} value={VoorNaam} />
                    </div>


                    {/* FAMILIENAAM */}
                    <div className="form-group" >
                      <label for="EMPL_NAME" >Familienaam </label>
                      <input type="text" class="form-control" id="EMPL_NAME" onChange={(e) => setFamilieNaam(e.target.value)} value={FamilieNaam} />
                    </div>


                    {/* EMAIL */}
                    <div className="form-group" >
                      <label for="EMPL_MAIL"  >Email</label>
                      <input type="email" class="form-control" id="EMPL_MAIL" onChange={(e) => setEmail(e.target.value)} value={Email} />
                    </div>

                    <div className="row">
                      <div className="col-6">

                        <div class="card">
                          <div class="card-header">
                            <h3 class="card-title">Planningsgegevens</h3>
                          </div>

                          <div class="card-body ">

                            {/* CONTRACTTYPE */}
                            <div className="form-group" >

                              <label for="EMPL_CONTRACT"  >Contracttype : </label>
                              <select id="EMPL_CONTRACT" style={{ marginLeft: "5px" }}   onChange={(e) => setContractType(e.target.value)} value={ContractType}>
                                {AlleContractTypes !== "" && AlleContractTypes.map(type =>
                                  <option value={type.id}  > {type.naam}</option>
                                )}
                              </select>

                            </div>

                            {/* KENNIS FRANS */}
                            <div className="form-group" >
                              <div class="custom-control custom-checkbox">
                                <input class="custom-control-input custom-control-input-danger" type="checkbox" id="FRANS" checked={Franstalig} onClick={() => setFranstalig(!Franstalig)} />
                                <label for="FRANS" class="custom-control-label" >Kennis frans ok? </label>
                              </div>
                            </div>

                            {/* OPLEIDING */}
                            <div className="form-group" >
                              <div class="custom-control custom-checkbox">
                                <input class="custom-control-input custom-control-input-danger" type="checkbox" id="OPLEIDING" checked={Opleiding} onClick={() => setOpleiding(!Opleiding)} />
                                <label for="OPLEIDING" class="custom-control-label" >Operator nog in opleiding </label>
                              </div>
                            </div>

                            <div class="form-group" style={{ width: "300px" }}>

                              {/* VERJAARDAG */}
                              <label>Verjaardag Operator: </label>
                              <div class="input-group">
                                <div class="input-group-prepend">
                                  <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
                                </div>
                                <input type="date" class="form-control" value={moment(Geboortedatum, "DD/MM/YYYY").format("YYYY-MM-DD")} onChange={(e) => setGeboortedatum(moment(e.target.value, "YYYY-MM-DD").format("DD/MM/YYYY"))} />
                              </div>

                              {/* VERJAARDAG PARTNER */}
                              <div class="custom-control custom-checkbox">
                                <input class='custom-control-input custom-control-input-danger' type="checkbox" id="VERJAARDAG_PARTNER" checked={VerjaardagPartnerActief} onClick={() => setVerjaardagPartnerActief(!VerjaardagPartnerActief)} />
                                <label for="VERJAARDAG_PARTNER" class="custom-control-label" >Verjaardag Partner Operator: </label>
                              </div>
                              {VerjaardagPartnerActief && <div class="input-group">
                                <div class="input-group-prepend">
                                  <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
                                </div>
                                <input type="date" class="form-control" value={moment(GeboortedatumPartner, "DD/MM/YYYY").format("YYYY-MM-DD")} onChange={(e) => setGeboortedatumPartner(moment(e.target.value, "YYYY-MM-DD").format("DD/MM/YYYY"))} />
                              </div>}
                            </div>
                          </div>

                        </div>

                      </div>

                      <div className="col-6 " >
                        {id === 'new' ?

                          <div class="card">
                            <div class="card-header">
                              <h3 class="card-title">Contracten</h3>
                            </div>
                            <div className="card-body">
                              <p>Gelieve eerst de nieuwe werknemer op te slaan in de database!</p>
                            </div>
                          </div> :

                          <div class="card">
                            <div class="card-header">
                              <h3 class="card-title">Contracten</h3>
                            </div>

                            <div class="card-body p-0">
                              <table class="table table-sm">
                                <thead>
                                  <tr>
                                    <th style={{ width: "10px" }}>ID</th>
                                    <th>Startdatum</th>
                                    <th>Einddatum</th>
                                    <th style={{ width: "40px" }}>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Contracts  && Contracts.map(contract =>
                                    <tr>
                                      <td>{contract.Id}</td>
                                      <td>{contract.begindatum}</td>
                                      <td>{contract.einddatum ? contract.einddatum : "N.V.T"}</td>
                                      <td>
                                        {!contract.einddatum ?( moment(contract.begindatum,"DD/MM/YYYY").isAfter(moment(),'day')? <span class="badge bg-warning">TOEKOMST!</span>:
                                          <span class="badge bg-success">ACTIEF</span> ):
                                          moment(contract.einddatum, "DD/MM/YYYY").isBefore(moment(), 'day') ?
                                            <span class="badge bg-danger">NIET-ACTIEF</span> :( moment(contract.begindatum,"DD/MM/YYYY").isAfter(moment(),'day')?<span class="badge bg-warning">TOEKOMST!</span>:
                                            <span class="badge bg-warning">ACTIEF + WORDT STOPGEZET</span>)
                                        }
                                      </td>

                                    </tr>


                                  )}

                                  {Contracts && !ShowLaatsteContractAanpassen && !ShowContractToevoegen && <tr>
                                    <td colSpan="4" >

                                      <button type="button" class="btn btn-block bg-gradient-warning btn-xs" onClick={() => setShowLaatsteContractAanpassen(true)}>Laatste contract wijzigen</button>

                                    </td>
                                  </tr>}

                                  {ContractToevoegbaar && !ShowContractToevoegen && !ShowLaatsteContractAanpassen &&

                                    <tr>
                                      <td colSpan="4" >

                                        <button type="button" class="btn btn-block bg-gradient-success btn-xs" onClick={() => setShowContractToevoegen(true)}>Contract toevoegen</button>

                                      </td>
                                    </tr>

                                  }


                                </tbody>
                              </table>
                            </div>
                            <div className="card-body">

                              {ShowContractToevoegen &&
                                <div class="form-group" style={{ display: 'inline-flex', alignContent: 'space-around' }}>

                                  <div>
                                    <label>Begindatum: </label>
                                    <div class="input-group">
                                      <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
                                      </div>
                                      <input type="date" class="form-control" value={moment(NieuwContract.begindatum, "DD/MM/YYYY").format("YYYY-MM-DD")} onChange={(e) => setNieuwContract({ ...NieuwContract, 'begindatum': moment(e.target.value, "YYYY-MM-DD").format("DD/MM/YYYY") })} />
                                    </div>
                                  </div>

                                  <div style={{ marginLeft: "15px" }}>
                                    <label>Einddatum: </label>
                                    {!LaatsteContractTotNaderOrder &&
                                      <div class="input-group">
                                        <div class="input-group-prepend">
                                          <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
                                        </div>
                                        <input type="date" class="form-control" value={moment(NieuwContract.einddatum, "DD/MM/YYYY").format("YYYY-MM-DD")} onChange={(e) => setNieuwContract({ ...NieuwContract, 'einddatum': moment(e.target.value, "YYYY-MM-DD").format("DD/MM/YYYY") })} />
                                      </div>}

                                    <div className="form-group" >
                                      <div class="custom-control custom-checkbox">
                                        <input class="custom-control-input custom-control-input-danger" type="checkbox" id="LaatsteContractTotNaderOrder" checked={LaatsteContractTotNaderOrder} onClick={() => setLaatsteContractTotNaderOrder(!LaatsteContractTotNaderOrder)} />
                                        <label for="LaatsteContractTotNaderOrder" class="custom-control-label" > Zonder einddatum? </label>
                                      </div>
                                    </div>


                                  </div>

                                  <div style={{ paddingTop: "35px" }}>
                                    <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-danger btn-xs " onClick={() => { setShowContractToevoegen(false); setNieuwContract({ 'begindatum': null, 'einddatum': null }); }}>Annuleren</button>
                                  </div>

                                  <div style={{ paddingTop: "35px" }}>
                                    <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-success btn-xs " onClick={() => { nieuwContractToevoegen(); }} >
                                      Toevoegen</button>
                                  </div>

                                </div>}

                              {ShowLaatsteContractAanpassen &&
                                <div class="form-group" style={{ display: 'inline-flex', alignContent: 'space-around' }}>

                                  <div>
                                    <label>Begindatum: </label>
                                    <div class="input-group">
                                      <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
                                      </div>
                                      <input type="date" class="form-control" value={moment(LaatsteContract.begindatum, "DD/MM/YYYY").format("YYYY-MM-DD")} onChange={(e) => setLaatsteContract({ ...LaatsteContract, 'begindatum': moment(e.target.value, "YYYY-MM-DD").format("DD/MM/YYYY") })} />
                                    </div>
                                  </div>

                                  <div style={{ marginLeft: "15px" }}>
                                    <label>Einddatum: </label>
                                    {!LaatsteContractTotNaderOrder &&
                                      <div class="input-group">
                                        <div class="input-group-prepend">
                                          <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
                                        </div>
                                        <input type="date" class="form-control" value={moment(LaatsteContract.einddatum, "DD/MM/YYYY").format("YYYY-MM-DD")} onChange={(e) => setLaatsteContract({ ...LaatsteContract, 'einddatum': moment(e.target.value, "YYYY-MM-DD").format("DD/MM/YYYY") })} />
                                      </div>}

                                    <div className="form-group" >
                                      <div class="custom-control custom-checkbox">
                                        <input class="custom-control-input custom-control-input-danger" type="checkbox" id="LaatsteContractTotNaderOrder" checked={LaatsteContractTotNaderOrder} onClick={() => setLaatsteContractTotNaderOrder(!LaatsteContractTotNaderOrder)} />
                                        <label for="LaatsteContractTotNaderOrder" class="custom-control-label" > Zonder einddatum? </label>
                                      </div>
                                    </div>


                                  </div>

                                  <div style={{ paddingTop: "35px" }}>
                                    <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-danger btn-xs " onClick={() => { setShowLaatsteContractAanpassen(false); resetLaatsteContract(); }}>Annuleren</button>
                                  </div>

                                  <div style={{ paddingTop: "35px" }}>
                                    <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-success btn-xs " onClick={() => { laatsteContractAanpassen(); }} >
                                      Aanpassen</button>
                                  </div>

                                </div>
                              }

                            </div>
                          </div>

                        }
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
            </div>
          )}
    </div>
  )
}

export default EditEmployee