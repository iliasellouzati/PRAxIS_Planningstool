import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeCalenderShiftType } from '../../store/actions/shiftActions';


const ShiftSelector2 = () => {

    const dispatch = useDispatch();
    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { currentShift } = currentCalendar;

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;

    const [Categorien, setCategorien] = useState([]);
    const [Inactieve, setInactieve] = useState(false);
    const [ShowCategieren, setShowCategieren] = useState([])

    let categorien = [];




    useEffect(() => {
        shifttypes.forEach(shift => {
            if (!categorien.some(x => x.trim() === shift.categorie.trim())) {
                categorien.push(shift.categorie.trim());
            }
        });
        setCategorien(categorien);


        return () => {

        }
    }, [])

    return (<>
        
            <div class="card bg-gradient-primary collapsed-card">
                <div class="card-header border-0 ui-sortable-handle" >


                    {Categorien.map(cat => 


                        <button type="button"
                            style={{ marginRight: "5px" }}
                            class="btn btn-primary btn-sm daterange"
                            onClick={()=>{
                                let hulpArr = [...ShowCategieren];
                                if(hulpArr.indexOf(cat)===-1){
                                    hulpArr.push(cat);
                                }else{
                                    hulpArr.splice(hulpArr.indexOf(cat),1)
                                }
                                setShowCategieren(hulpArr);

                            }}
                         
                        >
                           <span style={ShowCategieren.includes(cat)?{fontWeight:'bold', color:'red'}:{}} > {cat}</span>
                        </button>
                    )}
                    <button 
                    type="button" 
                    class="btn btn-primary btn-sm daterange" 
                    onClick={()=> setInactieve(!Inactieve)}>
                       <span style={Inactieve?{fontWeight:'bold', color:'red'}:{}}> inactieve </span>
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
                                {shifttypes.map((shift) => 
                                    (ShowCategieren.includes(shift.categorie.trim()) && ( shift.actief || Inactieve ) &&


                                        <tr>
                                            <td style={{ padding: "1px" }}>{shift.naam}</td>
                                            <td style={{ padding: "1px" }}><div style={{ backgroundColor: shift.kleurcode, height: '30px', width: "65px", border:'1px solid black' }}></div></td>
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

        
    </>
    )
}

export default ShiftSelector2
