import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeCalenderShiftType } from '../../redux/actions/calendarActions';
import Http4XXAnd5XXError from '../general/Http4XXAnd5XXError';
import LoadingSpinner from '../general/LoadingSpinner';
import ReadOnlyShift from '../shift/ReadOnlyShift';

const ShiftSelector = () => {


    const dispatch = useDispatch();
    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { currentShift } = currentCalendar;
    const [Http500, setHttp500] = useState([false, ""]);


    const [Loading, setLoading] = useState(true);

    const [ShiftTypes, setShiftTypes] = useState([])
    const [Categories, setCategories] = useState([]);
    const [Inactive, setInactive] = useState(false);
    const [ActiveCategieres, setActiveCategieres] = useState([])

    const fetchData = async () => {
        await axios.get('http://127.0.0.1:3001/api/shifttype')
            .then(response => {
                setShiftTypes(response.data);
                let cats = [];
                response.data.forEach(shift => {
                    if (!cats.some(x => x.trim() === shift.categorie.trim())) {
                        cats.push(shift.categorie.trim());
                    }
                });
                setCategories(cats);

            })
            .catch(error => setHttp500([true, error]));



        setLoading(false);

    }



    useEffect(() => {


        fetchData();

    }, [])

    return (
        <React.Fragment>
            {Loading ? <LoadingSpinner /> : Http500[0] ? <Http4XXAnd5XXError error={Http500[1]} setHttp4XXAnd5XX={setHttp500} /> : (
                <div class="card bg-gradient-primary collapsed-card" >
                    <div class="card-header border-0 ui-sortable-handle" >
                        {Categories.map(cat =>


                            <button type="button"
                                style={{ marginRight: "2px", fontSize: '10px' }}
                                class="btn btn-primary btn-sm daterange"
                                onClick={() => {
                                    let hulpArr = [...ActiveCategieres];
                                    if (hulpArr.indexOf(cat) === -1) {
                                        hulpArr.push(cat);
                                    } else {
                                        hulpArr.splice(hulpArr.indexOf(cat), 1)
                                    }
                                    setActiveCategieres(hulpArr);

                                }}

                            >
                                <span style={ActiveCategieres.includes(cat) ? { fontWeight: 'bold', color: 'red' } : {}} > {cat}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            class="btn btn-primary btn-sm daterange"
                            style={{ fontSize: '10px', margin: "0px" }}
                            onClick={() => setInactive(!Inactive)}>
                            <span style={Inactive ? { fontWeight: 'bold', color: 'red' } : {}}> inactieve </span>
                        </button>

                        <div class="card-tools">
                            <button type="button" class="btn btn-primary btn-sm" data-card-widget="collapse" title="Collapse">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="card-footer bg-transparent" style={{ display: "none" }}>
                        <div class="row">
                            <div className="col-6">
                                <table style={{ backgroundColor: 'white', textAlign: "center", color: 'black' }} className="table">

                                    <tbody>
                                        {ShiftTypes.map((shift) =>
                                        (ActiveCategieres.filter((obj, index) => index % 2 === 0).includes(shift.categorie.trim()) && (shift.actief || Inactive) &&


                                            <tr style={shift.naam === currentShift ? { backgroundColor: 'lightgray', outline: '2px solid black' } : {}}>
                                                <td style={{ padding: "1px" }}>{shift.naam}</td>
                                                <td style={{ width: "70px", margin: '0px', padding: '1px' }} ><ReadOnlyShift shift={shift} shiftDay={false} /></td>
                                                {/* <td style={{ padding: "1px" }}><div style={{ backgroundColor: shift.kleurcode, height: '30px', width: "65px", border: '1px solid black' }}></div></td> */}
                                                <td style={{ padding: "1px" }}>
                                                    <button onClick={() => shift.naam === currentShift ? "" : dispatch(changeCalenderShiftType(shift.naam))}><i className={shift.naam === currentShift ? "fas fa-check-circle" : "far fa-check-circle"}></i></button>
                                                </td>
                                            </tr>
                                        )
                                        )
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-6">
                                <table style={{ backgroundColor: 'white', textAlign: "center", color: 'black' }} className="table">

                                    <tbody>
                                        {ShiftTypes.map((shift) =>
                                        (ActiveCategieres.filter((obj, index) => index % 2 === 1).includes(shift.categorie.trim()) && (shift.actief || Inactive) &&


                                            <tr style={shift.naam === currentShift ? { backgroundColor: 'lightgray', outline: '2px solid black' } : {}}>
                                                <td style={{ padding: "1px" }}>{shift.naam}</td>
                                                <td style={{ width: "70px", margin: '0px', padding: '1px' }} ><ReadOnlyShift shift={shift} shiftDay={false} /></td>
                                                {/* <td style={{ padding: "1px" }}><div style={{ backgroundColor: shift.kleurcode, height: '30px', width: "65px", border: '1px solid black' }}></div></td> */}
                                                <td style={{ padding: "1px" }}>
                                                    <button onClick={() => shift.naam === currentShift ? "" : dispatch(changeCalenderShiftType(shift.naam))}><i className={shift.naam === currentShift ? "fas fa-check-circle" : "far fa-check-circle"}></i></button>
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

                </div>
            )

            }
        </React.Fragment>
    )
}

export default ShiftSelector