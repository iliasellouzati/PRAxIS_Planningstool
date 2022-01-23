import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listShiftTypes } from '../store/actions/shifttypeActions';
import moment from 'moment';

function ShiftTypesScreen(props) {


    const dispatch = useDispatch();

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes, error } = shifttypeList;
    const [Categorien, setCategorien] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [ToonInactieveShifts, setToonInactieveShifts] = useState(true);
    const [ToonSimpleLijst, setToonSimpleLijst] = useState(true);

    let categorien = [];

    useEffect(() => {

        dispatch(listShiftTypes());
        shifttypes.forEach(shift => {
            if (!categorien.some(x => x.trim() === shift.categorie.trim())) {
                categorien.push(shift.categorie.trim());
            }
        });
        setCategorien(categorien);
        setLoading(false);

        return () => {
            //cleanup
        }
    }, [dispatch])


    return (

        <div className="content-wrapper">


            {Loading ? (

                <div class="overlay"><i style={{ margin: "250px" }} className="fas fa-3x fa-sync-alt fa-spin"></i></div>

            ) : error ? (<div>{error}</div>) :
                (
                    <div className="col-md">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <h3 className="card-title">Shift types</h3>

                                    <div class="custom-control custom-checkbox" style={{ paddingLeft: "50px", opacity: ToonInactieveShifts ? "1" : "0.2" }}>
                                        <input class="custom-control-input custom-control-input-danger" type="checkbox" id="TOONINACTIEVESHIFTS" checked={ToonInactieveShifts} onClick={() => setToonInactieveShifts(!ToonInactieveShifts)} />
                                        <label for="TOONINACTIEVESHIFTS" class="custom-control-label" > Toon inactieve shifttypes </label>
                                    </div>
                                    <div class="custom-control custom-checkbox" style={{ paddingLeft: "50px", opacity: ToonSimpleLijst ? "1" : "0.2" }}>
                                        <input class="custom-control-input custom-control-input-danger" type="checkbox" id="TOONSIMPELELIJST" checked={ToonSimpleLijst} onClick={() => setToonSimpleLijst(!ToonSimpleLijst)} />
                                        <label for="TOONSIMPELELIJST" class="custom-control-label" > Toon alle details </label>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-0">
                                <table className="table table-striped">

                                    {ToonSimpleLijst ?
                                        <>
                                            <thead>
                                                <tr>
                                                    <th>NAAM</th>
                                                    <th>BEGINUUR</th>
                                                    <th>EINDUUR</th>

                                                    <th>VERPLICHT</th>
                                                    <th>TELEWERK</th>
                                                    <th>AANPASBARE UREN</th>
                                                    <th>STANDBY</th>
                                                    <th>CATEGORIE</th>
                                                    <th>ACHTERGRONDKLEUR</th>
                                                    <th>TEKSTKLEUR</th>
                                                    <th>BORDUUR</th>
                                                    <th>STANDAARDTEKST</th>
                                                    <th>AANPASSEN</th>
                                                    {ToonInactieveShifts &&
                                                        <th>ACTIEF</th>}

                                                </tr>
                                            </thead>
                                            <tbody>

                                                {shifttypes.filter(x => (ToonInactieveShifts ? true : x.actief === true)).map((shift) => (

                                                    <tr>
                                                        <td>{shift.naam}</td>
                                                        <td>{shift.beginuur ? shift.beginuur : "N.V.T."}</td>
                                                        <td>{shift.einduur ? shift.einduur : "N.V.T."}</td>
                                                        <td>
                                                            {shift.verplicht ?
                                                                <i style={{ color: 'green' }} class="fas fa-check" />
                                                                :
                                                                <i style={{ color: 'red' }} class="fas fa-times" />}
                                                        </td>
                                                        <td>
                                                            {shift.thuiswerk ?
                                                                <i style={{ color: 'green' }} class="fas fa-check" />
                                                                :
                                                                <i style={{ color: 'red' }} class="fas fa-times" />}
                                                        </td>
                                                        <td>
                                                            {shift.aanpasbare_uren ?
                                                                <i style={{ color: 'green' }} class="fas fa-check" />
                                                                :
                                                                <i style={{ color: 'red' }} class="fas fa-times" />}
                                                        </td>
                                                        <td>
                                                            {shift.standby ?
                                                                <i style={{ color: 'green' }} class="fas fa-check" />
                                                                :
                                                                <i style={{ color: 'red' }} class="fas fa-times" />}
                                                        </td>
                                                        <td>{shift.categorie}</td>
                                                        <td>
                                                            <div style={{
                                                                backgroundColor: shift.kleurcode,
                                                                color: shift.kleurcode,
                                                                textAlign: 'center',
                                                                height: '100%',
                                                                width: "40px",
                                                                border: "1px solid black"

                                                            }}>
                                                                -
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div style={{
                                                                backgroundColor: shift.tekstkleurcode,
                                                                color: shift.tekstkleurcode,
                                                                textAlign: 'center',
                                                                height: '100%',
                                                                width: "40px",
                                                                border: "1px solid black"

                                                            }}>
                                                                -
                                                            </div>


                                                        </td>
                                                        <td>
                                                            {shift.border ?
                                                                <i style={{ color: 'green' }} class="fas fa-check" />
                                                                :
                                                                <i style={{ color: 'red' }} class="fas fa-times" />}


                                                        </td>
                                                        <td>
                                                            {shift.standaardtekst}
                                                        </td>


                                                        <td>
                                                            <Link to={"/Shifttypes/" + shift.naam}>
                                                                <i class="fas fa-edit"></i>
                                                            </Link>

                                                        </td>
                                                        {ToonInactieveShifts &&
                                                            <td>
                                                                {shift.actief ?
                                                                    <i style={{ color: 'green' }} class="fas fa-check" />
                                                                    :
                                                                    <i style={{ color: 'red' }} class="fas fa-times" />}
                                                            </td>}

                                                    </tr>

                                                )
                                                )}
                                            </tbody>
                                        </>

                                        :

                                        <tbody >
                                            {/* --- CATEGORIENAAM --- */}
                                            {Categorien.map(cat => (
                                                <>
                                                    <tr data-widget="expandable-table" aria-expanded="false"  >
                                                        <td >
                                                            <div>
                                                                <i className="expandable-table-caret fas fa-caret-right fa-fw"></i>
                                                                {cat}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {/* --- onderste TR --- */}
                                                    <tr className="expandable-body">
                                                        <td>
                                                            <div className="p-0" style={{ display: "none" }}>
                                                                <table className=" table" >
                                                                    <thead style={{ backgroundColor: 'lightgray' }}>


                                                                        <tr>
                                                                            <th>NAAM</th>
                                                                            <th>BEGINUUR</th>
                                                                            <th>EINDUUR</th>
                                                                            <th>VOORBEELD</th>
                                                                            <th>AANPASSEN</th>
                                                                            {ToonInactieveShifts &&
                                                                                <th>ACTIEF</th>}
                                                                        </tr>

                                                                    </thead>
                                                                    <tbody>
                                                                        {shifttypes.filter(x => x.categorie.trim() === cat && (ToonInactieveShifts ? true : x.actief === true)).map((shift) => (

                                                                            <tr>
                                                                                <td>{shift.naam}</td>
                                                                                <td>{shift.beginuur ? shift.beginuur : "N.V.T."}</td>
                                                                                <td>{shift.einduur ? shift.einduur : "N.V.T."}</td>
                                                                                <td>
                                                                                    <div style={{
                                                                                        backgroundColor: shift.kleurcode,
                                                                                        color: shift.tekstkleurcode,
                                                                                        textAlign: 'center',
                                                                                        height: '100%',
                                                                                        width: "65px",
                                                                                        border: (shift.border ? "2px solid black" : ""),
                                                                                    }}>
                                                                                        {shift.standaardtekst === "uur" ? (
                                                                                            moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() > 0 ?
                                                                                                moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asHours() :
                                                                                                moment.duration(moment(shift.einduur, "hh:mm").add(1, "day").diff(moment(shift.beginuur, "hh:mm"))).asHours()
                                                                                        ) :
                                                                                            shift.standaardtekst === "min" ?
                                                                                                moment.utc(moment.duration(moment(shift.einduur, "hh:mm").diff(moment(shift.beginuur, "hh:mm"))).asMilliseconds()).format("hh:mm")
                                                                                                :
                                                                                                shift.standaardtekst}
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <Link to={"/Shifttypes/" + shift.naam}>
                                                                                        <i class="fas fa-edit"></i>
                                                                                    </Link>

                                                                                </td>
                                                                                {ToonInactieveShifts &&
                                                                                    <td>
                                                                                        {shift.actief ?
                                                                                            <i style={{ color: 'green' }} class="fas fa-check" />
                                                                                            :
                                                                                            <i style={{ color: 'red' }} class="fas fa-times" />}
                                                                                    </td>}

                                                                            </tr>

                                                                        ))}



                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </>
                                            ))}

                                            <tr>
                                            </tr>
                                        </tbody>

                                    }


                                    <tfoot>
                                        <tr>
                                            <td colSpan="13" >
                                                <Link to={"/Shifttypes/new"}>
                                                    <button type="button" class="btn btn-block bg-gradient-primary btn-xs">Shifttype toevoegen</button>
                                                </Link>
                                            </td>

                                        </tr>
                                    </tfoot>
                                </table>
                            </div>








                        </div>
                    </div>
                )
            }
        </div >

    )
}

export default ShiftTypesScreen;