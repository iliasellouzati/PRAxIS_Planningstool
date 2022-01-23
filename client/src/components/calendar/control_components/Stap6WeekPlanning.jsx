import React, { useEffect, useState } from 'react';
import axios from 'axios';



const Stap6WeekPlanning = ({ id, datum }) => {

    const [aantalDagShiften, setaantalDagShiften] = useState(0);
    const [aantalNachtShiften, setaantalNachtShiften] = useState(0);
    const [aantalWeekends, setaantalWeekends] = useState(0);
    const [NachtStructuur, setNachtStructuur] = useState(false);
    const nachtShiften = ["1806", "1907"];
    const [Weekend, setWeekend] = useState(false);


    const getData = async (id, datum) => {
        let { data } = await axios.get("/api/planning/jaaroverzicht/" + id + "/" + datum);

        setaantalDagShiften(data.aantal_dagshiften);
        setaantalNachtShiften(data.aantal_nachtshiften);
        setaantalWeekends(data.aantal_weekends);
        setNachtStructuur(nachtShiften.includes(data.laatste_shift));
    }

    const updateNacht = () => {
        
    }



    useEffect(() => {

        

        getData(id, datum);

        return () => {

        }
    }, [])
    return (
        <div class="row" style={{padding:"0px"}}>
            <div className="col-md-3" style={{ fontSize: "12px",padding:"0px" }} >
                {Math.round(aantalDagShiften / (aantalDagShiften + aantalNachtShiften) * 100)}<span style={{ fontSize: "10px" }} >% dag </span>
            </div>

            <div style={{ fontSize: "12px",padding:"0px" }} className="col-md-3">
                {aantalWeekends} Weeknds
            </div>
            <div style={{ fontSize: "12px",padding:"0px" }} className="col-md-3">
                <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id= {'NachtStructuur'+id} checked={NachtStructuur} onClick={() => setNachtStructuur(!NachtStructuur)} />
                    <label for={'NachtStructuur'+id} class="custom-control-label" >Nacht? </label>
                </div>
            </div>
            <div style={{ fontSize: "12px",padding:"0px" }} className="col-md-3">
                <div class="custom-control custom-checkbox">
                    <input class="custom-control-input custom-control-input-danger" type="checkbox" id={'WeekendStructuur'+id} checked={Weekend} onClick={() => setWeekend(!Weekend)} />
                    <label for={'WeekendStructuur'+id} class="custom-control-label" >Wknd? </label>
                </div>
            </div>

        </div>
        
    )
}

export default Stap6WeekPlanning
