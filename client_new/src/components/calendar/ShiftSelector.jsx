import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';



const ShiftSelector = () => {


    const dispatch = useDispatch();
    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { currentShift } = currentCalendar;

    const [ShiftTypes, setShiftTypes] = useState([])
    const [Categorien, setCategorien] = useState([]);
    const [Inactieve, setInactieve] = useState(false);
    const [ShowCategieren, setShowCategieren] = useState([]);

    const [Loading, setLoading] = useState(true);

    const [Http500, setHttp500] = useState([false, ""]);

    const getAndSetCategories = shifttypes => {
        let cats = [];

        shifttypes.forEach(shift => {
            if (!cats.some(x => x.trim() === shift.categorie.trim())) {
                cats.push(shift.categorie.trim());
            }
        });

        setCategorien(cats);
    }

    const fetchData = useCallback(async () => {

        await axios.get('http://127.0.0.1:3001/api/shifttype')
            .then(response => {
                setShiftTypes(response.data);
                getAndSetCategories(response.data);
            })
            .catch(error => setHttp500([true, error]));

        setLoading(false);

    }, [])

    useEffect(() => {
        fetchData().catch(console.error);

        return () => {

        }
    }, [])


    return (

        <div class="card bg-gradient-primary collapsed-card">
            <div class="card-header border-0 ui-sortable-handle" >


                {Categorien.map(cat =>


                    <button type="button"
                        key={cat}
                        style={{ marginRight: "5px" }}
                        class="btn btn-primary btn-sm daterange"
                        onClick={() => {
                            let hulpArr = [...ShowCategieren];
                            if (hulpArr.indexOf(cat) === -1) {
                                hulpArr.push(cat);
                            } else {
                                hulpArr.splice(hulpArr.indexOf(cat), 1)
                            }
                            setShowCategieren(hulpArr);

                        }}

                    >
                        <span style={ShowCategieren.includes(cat) ? { fontWeight: 'bold', color: 'red' } : {}} > {cat}</span>
                    </button>
                )}
                <button
                    type="button"
                    class="btn btn-primary btn-sm daterange"
                    onClick={() => setInactieve(!Inactieve)}>
                    <span style={Inactieve ? { fontWeight: 'bold', color: 'red' } : {}}> inactieve </span>
                </button>

                <div class="card-tools">
                    <button type="button" class="btn btn-primary btn-sm" data-card-widget="collapse" title="Collapse">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>

            <div class="card-footer bg-transparent" style={{ display: "none" }}>
                <div class="row">
                    <table style={{ backgroundColor: 'white', textAlign: "center", color: 'black' }} className="table">

                        <tbody>
                            {ShiftTypes.map((shift) =>
                            (ShowCategieren.includes(shift.categorie.trim()) && (shift.actief || Inactieve) &&


                                <tr>
                                    <td style={{ padding: "1px" }}>{shift.naam}</td>
                                    <td style={{ padding: "1px" }}><div style={{ backgroundColor: shift.kleurcode, height: '30px', width: "65px", border: '1px solid black' }}></div></td>
                                    <td style={{ padding: "1px" }}>
                                        {/* <button onClick={() => shift.naam === currentShift ? "" : dispatch(changeCalenderShiftType(shift.naam))}><i className={shift.naam === currentShift ? "fas fa-check-circle" : "far fa-check-circle"}></i></button> */}
                                    </td>
                                </tr>
                            )

                            )
                            }




                        </tbody>
                    </table>
                </div>
            </div>

        </div>


    )
}

export default ShiftSelector