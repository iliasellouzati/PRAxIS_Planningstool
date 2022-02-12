import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addShifttype, deleteShifttype, listShiftTypes, updateShifttype } from '../store/actions/shifttypeActions';


const EditShifttypeScreen = (props) => {
    const dispatch = useDispatch();

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes, loading, error } = shifttypeList;

    const [Shift] = useState(props.match.params.id !== "new" ? shifttypes.find(o => o.naam === props.match.params.id) : []);
    const [Naam, setNaam] = useState("");
    const [BeginUur, setBeginUur] = useState("");
    const [EindUur, setEindUur] = useState("");
    const [KleurCode, setKleurCode] = useState("");
    const [Verplicht, setVerplicht] = useState("");
    const [Thuiswerk, setThuiswerk] = useState("");
    const [AanpasbareUren, setAanpasbareUren] = useState("");
    const [Categorie, setCategorie] = useState("");
    const [Tekstkleurcode, setTekstkleurcode] = useState("");
    const [Border, setBorder] = useState("");
    const [StandaardTekst, setStandaardTekst] = useState("");
    const [Standbyvergoeding, setStandbyvergoeding] = useState("");
    const [Actief, setActief] = useState("");

    const [finished, setfinished] = useState(false);
    const [bestaandeShift, setbestaandeShift] = useState(true);

    const [Categorien, setCategorien] = useState([]);

    let categorien = [];

    const submitHandler = (e) => {
        e.preventDefault();
        if (bestaandeShift) {
            dispatch(updateShifttype(props.match.params.id,
                {
                    "naam": Naam,
                    "beginuur": BeginUur,
                    "einduur": EindUur,
                    "kleurcode": KleurCode,
                    "verplicht": Verplicht,
                    "thuiswerk": Thuiswerk,
                    "aanpasbare_uren": AanpasbareUren,
                    "categorie": Categorie,
                    "tekstkleurcode": Tekstkleurcode,
                    "border": Border,
                    "standaardtekst": StandaardTekst,
                    "standby": Standbyvergoeding,
                    "actief": Actief
                }));

            setfinished(true);

        } else {
            dispatch(addShifttype(
                {
                    "naam": Naam,
                    "beginuur": BeginUur,
                    "einduur": EindUur,
                    "kleurcode": KleurCode,
                    "verplicht": Verplicht,
                    "thuiswerk": Thuiswerk,
                    "aanpasbare_uren": AanpasbareUren,
                    "categorie": Categorie,
                    "tekstkleurcode": Tekstkleurcode,
                    "border": Border,
                    "standaardtekst": StandaardTekst,
                    "standby": Standbyvergoeding,
                    "actief": Actief

                }
            ));
            setfinished(true);
        }
    };


    const deleteHandler = () => {
        let answer = window.confirm("Shift " + Naam + " verwijderen?");
        if (answer) {
            dispatch(deleteShifttype(props.match.params.id));
            setfinished(true);
        }
    }

    useEffect(() => {

        dispatch(listShiftTypes());
        shifttypes.forEach(shift => {
            if (!categorien.some(x => x.trim() === shift.categorie.trim())) {
                categorien.push(shift.categorie.trim());
            }
        });
        setCategorien(categorien);

        if (finished) {
            props.history.push("/Shifttypes");
        }
        if (props.match.params.id !== "new") {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setNaam(Shift.naam);
            setBeginUur(Shift.beginuur);
            setEindUur(Shift.einduur);
            setKleurCode(Shift.kleurcode);
            setVerplicht(Shift.verplicht);
            setThuiswerk(Shift.thuiswerk);
            setAanpasbareUren(Shift.aanpasbare_uren);
            setCategorie(Shift.categorie);
            setTekstkleurcode(Shift.tekstkleurcode);
            setBorder(Shift.border);
            setStandaardTekst(Shift.standaardtekst);
            setStandbyvergoeding(Shift.standby);
            setActief(Shift.actief);

        } else {
            setbestaandeShift(false);

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
                            <h3 className="card-title">Shifttype aanpassen</h3>
                        </div>

                        <form onSubmit={submitHandler}>
                            <div className="card-body">

                                {/* NAAM SHIFT */}
                                <div className="form-group">
                                    <label htmlFor="NAME_SHIFT">Naam</label>
                                    <input type="text" class="form-control" id="NAME_SHIFT" onChange={(e) => setNaam(e.target.value)} value={Naam} />
                                </div>
                                <div className="row">
                                    <div className="col-3">

                                        {/* VERPLICHT */}
                                        <div className="form-group" >
                                            <div class="custom-control custom-checkbox">
                                                <input class="custom-control-input custom-control-input-danger" type="checkbox" id="VERPLICHT" checked={Verplicht} onClick={() => setVerplicht(!Verplicht)} />
                                                <label for="VERPLICHT" class="custom-control-label" >Verplicht op planning </label>
                                            </div>
                                        </div>

                                        {/* THUISWERK */}
                                        <div className="form-group" >
                                            <div class="custom-control custom-checkbox">
                                                <input class="custom-control-input custom-control-input-danger" type="checkbox" id="THUISWERK" checked={Thuiswerk} onClick={() => setThuiswerk(!Thuiswerk)} />
                                                <label for="THUISWERK" class="custom-control-label" >Thuiswerk </label>
                                            </div>
                                        </div>

                                        {/* AANPASBARE UREN */}
                                        <div className="form-group" >
                                            <div class="custom-control custom-checkbox">
                                                <input class="custom-control-input custom-control-input-danger" type="checkbox" id="AANPASBARE_UREN" checked={AanpasbareUren} onClick={() => setAanpasbareUren(!AanpasbareUren)} />
                                                <label for="AANPASBARE_UREN" class="custom-control-label" >De uren kunnen later aangepast worden  </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-3">

                                        {/* STANDBY */}
                                        <div className="form-group" >
                                            <div class="custom-control custom-checkbox">
                                                <input class="custom-control-input custom-control-input-danger" type="checkbox" id="STANDBY" checked={Standbyvergoeding} onClick={() => setStandbyvergoeding(!Standbyvergoeding)} />
                                                <label for="STANDBY" class="custom-control-label" >Standby vergoeding </label>
                                            </div>
                                        </div>

                                        {/* ACTIEF */}
                                        <div className="form-group" >
                                            <div class="custom-control custom-checkbox">
                                                <input class="custom-control-input custom-control-input-danger" type="checkbox" id="ACTIEF" checked={Actief} onClick={() => setActief(!Actief)} />
                                                <label for="ACTIEF" class="custom-control-label" >Actief </label>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* BEGINUUR */}
                                <div className="form-group">
                                    <label class="htmlForm-check-label" for="BEGIN_UREN">Beginuur</label>
                                    <input type="time" class="form-control" id="BEGIN_UREN" value={BeginUur} onChange={(e) => setBeginUur(e.target.value)} />
                                </div>

                                {/* EINDUUR */}
                                <div className="form-group">
                                    <label class="htmlForm-check-label" for="EIND_UREN">Einduur</label>
                                    <input type="time" class="form-control" id="EIND_UREN" value={EindUur} onChange={(e) => setEindUur(e.target.value)} />
                                </div>

                                {/* CATEGORIE */}
                                <div className="form-group">
                                    <label htmlFor="CATEGORIE">Categorie</label>
                                    <input type="text" class="form-control" list="CATEGORIE" onChange={(e) => setCategorie(e.target.value)} value={Categorie} />
                                    <datalist id="CATEGORIE">
                                        {Categorien.map(cat => (
                                            <option value={cat} />
                                        ))}
                                    </datalist>
                                </div>

                                <div style={{ border: "1px dashed black", borderRadius: "15px", padding: "10px" }} >

                                    {/* KLEURCODE */}
                                    <div className="form-group">
                                        <label for="KLEURCODE" >Kleurcode</label>
                                        <input type="color" id="KLEURCODE" class="form-control my-colorpicker1 colorpicker-element" value={KleurCode} onChange={(e) => setKleurCode(e.target.value)} />
                                    </div>

                                    {/* TEKSTKLEURCODE */}
                                    <div className="form-group">
                                        <label for="TEKSTKLEURCODE" >Tekstkleurcode</label>
                                        <input type="color" id="TEKSTKLEURCODE" class="form-control my-colorpicker1 colorpicker-element" value={Tekstkleurcode} onChange={(e) => setTekstkleurcode(e.target.value)} />
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
                                        <input type="text" class="form-control" id="STANDAARDTEKST" maxLength="3" onChange={(e) => setStandaardTekst(e.target.value)} value={StandaardTekst} />
                                    </div>

                                </div>

                                <div className="card-footer">
                                    <button type="submit" style={{ width: "125px" }} className="btn btn-success">{bestaandeShift ? "Aanpassen" : "Toevoegen"}</button>
                                    {bestaandeShift &&
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

export default EditShifttypeScreen
