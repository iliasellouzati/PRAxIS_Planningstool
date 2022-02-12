import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as MOMENT_OPERATIONS from '../../../moment_operations';
import moment from 'moment';


const CoopmanShiftControle = () => {


    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { datum, calendar } = currentCalendar;

    const [Actief, setActief] = useState(true);

    const [DagenZonderShift, setDagenZonderShift] = useState([]);

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;


    const checkCoopmanShifts = () => {
        const teControlerenDagen = MOMENT_OPERATIONS.getCalendarMonth_ArrayWithMoment(moment(datum, "MM-YYYY"));


        let hulpArrMetDeDagen = [];
        var BreakException = {};


        teControlerenDagen.map(week => {
            week.map(day => {

                if (!(day.isoWeekday() === 6 || day.isoWeekday() === 7)) {

                    hulpArrMetDeDagen.push(day);

                    try {
                        calendar.map(empl => {

                            let result = empl.employeeCalendar.find(shiftDay => shiftDay.day == day.format("DD-MM-YYYY") && shifttypes.find(shift => shift.naam === shiftDay.shift)?.categorie.trim() === "coopman");
                           
                            if (result) {
                                throw BreakException;
                            }

                        });

                    } catch (e) {
                        if (e === BreakException) {
                            hulpArrMetDeDagen.pop();
                        }
                    }
                }


            })
        })

        setDagenZonderShift(hulpArrMetDeDagen);

    }


    useEffect(() => {
        checkCoopmanShifts();
        return () => {

        }
    }, [calendar])

    return (
        <div >
            <div class="custom-control custom-checkbox">
                <input class="custom-control-input custom-control-input-danger" type="checkbox" id="VERPLICHT" checked={Actief} onClick={() => setActief(!Actief)} />
                <label for="VERPLICHT" class="custom-control-label" >Coopmanshift controle</label>
            </div>

            {Actief &&
                <>

                    {DagenZonderShift.length>4? <span>{DagenZonderShift.length} dagen zonder coopman</span> :DagenZonderShift.length!==0? DagenZonderShift.map(day => <span style={{margin:"3px"}}> {day.format("DD/MM")} </span >):<span>Controle Oké</span>}

                </>


            }
        </div>
    )
}

export default CoopmanShiftControle
