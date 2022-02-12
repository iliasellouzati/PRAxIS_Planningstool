import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { addWeekStructuur, updateWeekStructuur, deleteWeekStructuur } from '../store/actions/betaActions';

const EditWeekStructuurScreen = (props) => {

    const dispatch = useDispatch();

    const beta = useSelector((state) => state.beta);
    const { weekStructuren } = beta;


    const [WeekStructuur, setWeekStructuur] = useState(props.match.params.id !== "new" ? weekStructuren.find(o => o.id.toString() === props.match.params.id) : [])
    const [Id, setId] = useState("");
    const [Maandag, setMaandag] = useState("");
    const [Dinsdag, setDinsdag] = useState("");
    const [Woensdag, setWoensdag] = useState("");
    const [Donderdag, setDonderdag] = useState("");
    const [Vrijdag, setVrijdag] = useState("");
    const [Zaterdag, setZaterdag] = useState("");
    const [Zondag, setZondag] = useState("");
    const [Score, setScore] = useState("");
    const [Finished, setFinished] = useState(false);

    const [AlleShifts, setAlleShifts] = useState(false);

    const [SelectedShift, setSelectedShift] = useState("")

    const [BestaandeWeekStructuur, setBestaandeWeekStructuur] = useState(true);

    const submitHandler = (e) => {
        e.preventDefault();
        if (BestaandeWeekStructuur) {
            dispatch(updateWeekStructuur(
                {
                    "id": Id,
                    "maandag": Maandag,
                    "dinsdag": Dinsdag,
                    "woensdag": Woensdag,
                    "donderdag": Donderdag,
                    "vrijdag": Vrijdag,
                    "zaterdag": Zaterdag,
                    "zondag": Zondag,
                    "score": Score
                }));

            setFinished(true);

        } else {

            if (!AlleShifts) {

                dispatch(addWeekStructuur(
                    {
                        "id": Id,
                        "maandag": Maandag,
                        "dinsdag": Dinsdag,
                        "woensdag": Woensdag,
                        "donderdag": Donderdag,
                        "vrijdag": Vrijdag,
                        "zaterdag": Zaterdag,
                        "zondag": Zondag,
                        "score": Score
                    }
                ));
                setFinished(true);
            }
            else {

                let hulpArr = ["0618","0719","1806","1907"];
                let i = Id;

                for (let index = 0; index < hulpArr.length; index++) {
                    dispatch(addWeekStructuur(
                        {
                            "id": i+index,
                            "maandag": Maandag!==""?hulpArr[index]:"",
                            "dinsdag": Dinsdag!==""?hulpArr[index]:"",
                            "woensdag": Woensdag!==""?hulpArr[index]:"",
                            "donderdag": Donderdag!==""?hulpArr[index]:"",
                            "vrijdag": Vrijdag!==""?hulpArr[index]:"",
                            "zaterdag": Zaterdag!==""?hulpArr[index]:"",
                            "zondag": Zondag!==""?hulpArr[index]:"",
                            "score": Score
                        }

                    ));

                    
                }

                setFinished(true);

            }
        }
    };

    const deleteHandler = () => {
        let answer = window.confirm("Weekstructuur " + Id + " verwijderen?");
        if (answer) {
            dispatch(deleteWeekStructuur(Id));
            setFinished(true);
        }
    }

    useEffect(() => {

        if (Finished) {
            props.history.push("/instellingen/week");
        }


        if (props.match.params.id !== "new") {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setId(WeekStructuur.id);
            setMaandag(WeekStructuur.maandag);
            setDinsdag(WeekStructuur.dinsdag);
            setWoensdag(WeekStructuur.woensdag);
            setDonderdag(WeekStructuur.donderdag);
            setVrijdag(WeekStructuur.vrijdag);
            setZaterdag(WeekStructuur.zaterdag);
            setZondag(WeekStructuur.zondag);
            setScore(WeekStructuur.score);

        } else {
            let i = 1;
            for (let index = 0; index < weekStructuren.length; index++) {
                if (weekStructuren[index].id > i) {
                    i=weekStructuren[index].id+1;
                    continue;
                }
                
            }
            setId(i);
            setBestaandeWeekStructuur(false);

        }

        return () => {


        }
    }, [Finished])


    return (
        <div className="content-wrapper">
            <div className="card card-primary">
                <div className="card-header">
                    <h3 className="card-title">Weektype aanpassen</h3>
                </div>

                <form onSubmit={submitHandler}>
                    <div className="card-body">

                        {/* ID */}
                        <div className="form-group">
                            <label htmlFor="ID">ID</label>
                            <input type="number" class="form-control" id="ID" onChange={(e) => setId(e.target.value)} value={Id} />
                        </div>


                        {/* CONFIGURATIESCHERM */}
                        {!BestaandeWeekStructuur &&
                            <div className="form-group" >
                                <div class="custom-control custom-checkbox">
                                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id="STANDBY" checked={AlleShifts} onClick={() => setAlleShifts(!AlleShifts)} />
                                    <label for="STANDBY" class="custom-control-label" >Weektype aanmaken voor de 4 operatorshiften </label>
                                </div>
                            </div>
                        }

                        <div className='row' >
                            <div style={{ display: "inline-block", textAlign: "center" }}>
                                <b>Geselecteerde shift:</b>
                                <p>{SelectedShift === "" ? "Geen" : AlleShifts ? "4X" : SelectedShift}</p>
                            </div>
                            {!AlleShifts &&
                                <>
                                    <div onClick={() => setSelectedShift("0618")} style={{ display: "inline-block", padding: "10px", margin: "10px", textAlign: "center", border: "1px dashed black", backgroundColor: "#4f81bd" }}>
                                        06-18
                                    </div>
                                    <div onClick={() => setSelectedShift("0719")} style={{ display: "inline-block", margin: "10px", padding: "10px", textAlign: "center", border: "1px dashed black", backgroundColor: "#fabf8f" }}>
                                        07-19
                                    </div>

                                    <div onClick={() => setSelectedShift("1806")} style={{ display: "inline-block", padding: "10px", margin: "10px", textAlign: "center", border: "1px dashed black", backgroundColor: "#58f30b" }}>
                                        18-06
                                    </div>
                                    <div onClick={() => setSelectedShift("1907")} style={{ display: "inline-block", padding: "10px", margin: "10px", textAlign: "center", border: "1px dashed black", backgroundColor: "#ffff00" }}>
                                        19-07
                                    </div>
                                </>}
                            {AlleShifts &&
                                <div onClick={() => setSelectedShift("4X")} style={{ display: "inline-block", padding: "10px", margin: "10px", textAlign: "center", border: "1px dashed black" }}>
                                    4X
                                </div>}

                            <div onClick={() => setSelectedShift("")} style={{ display: "inline-block", padding: "10px", margin: "10px", textAlign: "center", border: "1px dashed black" }}>
                                <i style={{ color: 'red' }} class="fas fa-times" />
                            </div>
                        </div>



                        {/* WEEKPLANNING */}
                        <div className='row' >

                            <div onClick={() => SelectedShift === "" ? setMaandag("") : AlleShifts ? setMaandag("4X") : setMaandag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                                <p>Maandag</p>
                                {Maandag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Maandag}
                            </div>

                            <div onClick={() => SelectedShift === "" ? setDinsdag("") : AlleShifts ? setDinsdag("4X") : setDinsdag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                                <p>Dinsdag</p>
                                {Dinsdag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Dinsdag}

                            </div>
                            <div onClick={() => SelectedShift === "" ? setWoensdag("") : AlleShifts ? setWoensdag("4X") : setWoensdag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                                <p>Woensdag</p>
                                {Woensdag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Woensdag}

                            </div>
                            <div onClick={() => SelectedShift === "" ? setDonderdag("") : AlleShifts ? setDonderdag("4X") : setDonderdag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                                <p>Donderdag</p>
                                {Donderdag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Donderdag}

                            </div>
                            <div onClick={() => SelectedShift === "" ? setVrijdag("") : AlleShifts ? setVrijdag("4X") : setVrijdag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                                <p>Vrijdag</p>
                                {Vrijdag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Vrijdag}

                            </div>
                            <div onClick={() => SelectedShift === "" ? setZaterdag("") : AlleShifts ? setZaterdag("4X") : setZaterdag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
                                <p>Zaterdag</p>
                                {Zaterdag === "" ? <i style={{ color: 'red' }} class="fas fa-times" /> : Zaterdag}

                            </div>
                            <div onClick={() => SelectedShift === "" ? setZondag("") : AlleShifts ? setZondag("4X") : setZondag(SelectedShift)} style={{ display: "inline-block", textAlign: "center", width: '14.28%', border: "1px solid black", height: "100px" }}>
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
                        <button type="submit" style={{ width: "125px" }} className="btn btn-success">{BestaandeWeekStructuur ? "Aanpassen" : "Toevoegen"}</button>
                        {BestaandeWeekStructuur &&
                            <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-danger " onClick={(() => deleteHandler())}     >Verwijderen</button>}
                        <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-warning " onClick={() => setFinished(!Finished)}>Annuleren</button>

                    </div>
                </form>
            </div>

        </div>
    )
}

export default EditWeekStructuurScreen
