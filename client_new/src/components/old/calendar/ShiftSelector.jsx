import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeCalenderShiftType } from '../../store/actions/shiftActions';


const ShiftSelector = () => {

    const dispatch = useDispatch();
    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { currentShift } = currentCalendar;

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;

    return (
        <div className="card-body p-0">
        <table className="table">
            <thead>
                <tr>
                    <th>Naam</th>
                    <th>Kleur</th>
                    <th>Selecteer</th>
                </tr>
            </thead>
            <tbody>
                {shifttypes.map((shift) =>

                    <tr>
                        <td style={{ padding: "1px" }}>{shift.naam}</td>
                        <td style={{ padding: "1px" }}><div style={{ backgroundColor: shift.kleurcode, height: '30px', width: "65px" }}></div></td>
                        <td style={{ padding: "1px" }}>
                            <button onClick={() => shift.naam === currentShift ? "" : dispatch(changeCalenderShiftType(shift.naam))}><i className={shift.naam === currentShift ? "fas fa-check-circle" : "far fa-check-circle"}></i></button>
                        </td>
                    </tr>
                )}

            </tbody>
        </table>
    </div>
    )
}

export default ShiftSelector
