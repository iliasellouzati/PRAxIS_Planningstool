import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listContractTypes, addContracttype, deleteContracttype, updateContracttype } from '../store/actions/contracttypeActions';



const EditContracttypeScreen = (props) => {

    const dispatch = useDispatch();

    const contracttypeList = useSelector((state) => state.contracttypeList);
    const { contracttypes, loading, error } = contracttypeList;

    const [Contracttype] = useState(props.match.params.id !== "new" ? contracttypes.find(o => o.naam === props.match.params.id) : []);

    const [Naam, setNaam] = useState();
    const [Wekelijkse_contract_uren, setWekelijkse_contract_uren] = useState();
    const [Maandelijke_contract_uren, setMaandelijke_contract_uren] = useState();
    const [Max_opeenvolgende_shifts, setMax_opeenvolgende_shifts] = useState();
    const [Max_shifts_per_week, setMax_shifts_per_week] = useState();
    const [Nachtshiften_toegelaten, setNachtshiften_toegelaten] = useState();
    const [Standby_toegelaten, setStandby_toegelaten] = useState();
    const [Max_uur_per_week, setMax_uur_per_week] = useState();
    const [Max_uur_per_maand, setMax_uur_per_maand] = useState()
    const [Max_weekends_per_jaar, setMax_weekends_per_jaar] = useState()
    const [Ideaal_shifts_per_week, setIdeaal_shifts_per_week] = useState()

    const [finished, setfinished] = useState(false);
    const [bestaandeContract, setbestaandeContract] = useState(true);

    const submitHandler = (e) => {
        e.preventDefault();
        if (bestaandeContract) {
            dispatch(updateContracttype(props.match.params.id,
                {
                    "naam": Naam,
                    "wekelijkse_contract_uren": Wekelijkse_contract_uren,
                    "maandelijke_contract_uren": Maandelijke_contract_uren,
                    "max_opeenvolgende_shifts": Max_opeenvolgende_shifts,
                    "max_shifts_per_week": Max_shifts_per_week,
                    "nachtshiften_toegelaten": Nachtshiften_toegelaten,
                    "standby_toegelaten": Standby_toegelaten,
                    "max_uur_per_week": Max_uur_per_week,
                    "max_uur_per_maand": Max_uur_per_maand,
                    "max_weekends_per_jaar": Max_weekends_per_jaar,
                    "ideaal_shifts_per_week" : Ideaal_shifts_per_week

                }));

            setfinished(true);

        } else {
            dispatch(addContracttype(
                {
                    "naam": Naam,
                    "wekelijkse_contract_uren": Wekelijkse_contract_uren,
                    "maandelijke_contract_uren": Maandelijke_contract_uren,
                    "max_opeenvolgende_shifts": Max_opeenvolgende_shifts,
                    "max_shifts_per_week": Max_shifts_per_week,
                    "nachtshiften_toegelaten": Nachtshiften_toegelaten,
                    "standby_toegelaten": Standby_toegelaten,
                    "max_uur_per_week": Max_uur_per_week,
                    "max_uur_per_maand": Max_uur_per_maand,
                    "max_weekends_per_jaar": Max_weekends_per_jaar,
                    "ideaal_shifts_per_week" : Ideaal_shifts_per_week
                }
            ));
            setfinished(true);
        }
    };


    const deleteHandler = () => {
        let answer = window.confirm("Contract " + Naam + " verwijderen?");
        if (answer) {
            dispatch(deleteContracttype(props.match.params.id));
            setfinished(true);
        }
    }

    useEffect(() => {

        if (finished) {
            props.history.push("/contract");
        }

        if (props.match.params.id !== "new") {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setNaam(Contracttype.naam);
            setWekelijkse_contract_uren(Contracttype.wekelijkse_contract_uren);
            setMaandelijke_contract_uren(Contracttype.maandelijke_contract_uren);
            setMax_opeenvolgende_shifts(Contracttype.max_opeenvolgende_shifts);
            setMax_shifts_per_week(Contracttype.max_shifts_per_week);
            setNachtshiften_toegelaten(Contracttype.nachtshiften_toegelaten);
            setStandby_toegelaten(Contracttype.standby_toegelaten);
            setMax_uur_per_week(Contracttype.max_uur_per_week);
            setIdeaal_shifts_per_week(Contracttype.ideaal_shifts_per_week);
            setMax_weekends_per_jaar(Contracttype.max_weekends_per_jaar);
            setMax_uur_per_maand(Contracttype.max_uur_per_maand)

        } else {
            setbestaandeContract(false);
            setNachtshiften_toegelaten(false);
            setStandby_toegelaten(false);
        }


        return () => {

        }
    }, [finished])



    return (
        <div className="content-wrapper">

            {loading ? (

                <div class="overlay"><i style={{ margin: "250px" }} className="fas fa-3x fa-sync-alt fa-spin"></i></div>

            ) : error ? (<div>{error}</div>) : (
                <div className="col-md">

                    <div className="card card-primary">
                        <div className="card-header">
                            <h3 className="card-title">Contracttype aanpassen</h3>
                        </div>
                        <form onSubmit={submitHandler}>
                            <div className="card-body">

                                <div className="form-group">
                                    <label htmlFor="NAME_SHIFT">Naam</label>
                                    <input type="text" class="form-control" id="NAME_SHIFT" onChange={(e) => setNaam(e.target.value)} value={Naam} />
                                </div>


                                <div className="form-group" >
                                    <div class="custom-control custom-checkbox">
                                        <input class="custom-control-input custom-control-input-danger" type="checkbox" id="VERPLICHT" checked={Standby_toegelaten} onClick={() => setStandby_toegelaten(!Standby_toegelaten)} />
                                        <label for="VERPLICHT" class="custom-control-label" >Standby shiften toegelaten </label>
                                    </div>
                                </div>


                                <div className="form-group">
                                    <label class="htmlForm-check-label" for="BEGIN_UREN">Wekelijkse contract uren</label>
                                    <input type="number" class="form-control" id="BEGIN_UREN" value={Wekelijkse_contract_uren} onChange={(e) => setWekelijkse_contract_uren(e.target.value)} />
                                </div>


                                <div className="form-group">
                                    <label class="htmlForm-check-label" for="EIND_UREN">Kwartaal contract uren</label>
                                    <input type="number" class="form-control" id="EIND_UREN" value={Maandelijke_contract_uren} onChange={(e) => setMaandelijke_contract_uren(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label class="htmlForm-check-label" for="BEGIN_UREN">Ideaal aantal shifts per week</label>
                                    <input type="number" class="form-control" id="BEGIN_UREN" value={Ideaal_shifts_per_week} onChange={(e) => setIdeaal_shifts_per_week(e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <label class="htmlForm-check-label" for="EIND_UREN">Maximum opeenvolgende shiften</label>
                                    <input type="number" class="form-control" id="EIND_UREN" value={Max_opeenvolgende_shifts} onChange={(e) => setMax_opeenvolgende_shifts(e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <label class="htmlForm-check-label" for="EIND_UREN">Maximum aantal shiften per week</label>
                                    <input type="number" class="form-control" id="EIND_UREN" value={Max_shifts_per_week} onChange={(e) => setMax_shifts_per_week(e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <label class="htmlForm-check-label" for="EIND_UREN">Maximum aantal uur per week</label>
                                    <input type="number" class="form-control" id="EIND_UREN" value={Max_uur_per_week} onChange={(e) => setMax_uur_per_week(e.target.value)} />
                                </div>
                                
                                <div className="form-group">
                                    <label class="htmlForm-check-label" for="BEGIN_UREN">Maximum aantal uren per maand</label>
                                    <input type="number" class="form-control" id="BEGIN_UREN" value={Max_uur_per_maand} onChange={(e) => setMax_uur_per_maand(e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <label class="htmlForm-check-label" for="BEGIN_UREN">Maximum aanstal weekends per jaar</label>
                                    <input type="number" class="form-control" id="BEGIN_UREN" value={Max_weekends_per_jaar} onChange={(e) => setMax_weekends_per_jaar(e.target.value)} />
                                </div>





                                <div className="card-footer">
                                    <button type="submit" style={{ width: "125px" }} className="btn btn-success">{bestaandeContract ? "Aanpassen" : "Toevoegen"}</button>
                                    {bestaandeContract &&
                                        <button type="button" style={{ marginLeft: "50px", width: "125px" }} class="btn btn-danger " onClick={(() => (deleteHandler()))}>Verwijderen</button>}
                                    <button type="button" style={{ marginLeft: "50px", width: "125px" }} class="btn btn-warning " onClick={(() => (setfinished(!finished)))}>Annuleren</button>

                                </div>
                            </div>

                        </form>


                    </div>
                </div>)}

        </div>
    )
}

export default EditContracttypeScreen
