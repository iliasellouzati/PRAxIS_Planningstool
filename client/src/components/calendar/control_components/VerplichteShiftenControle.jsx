import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const VerplichteShiftenControle = ({ shiftday }) => {
    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;

    const verplichtShiften = shifttypes.filter(o => o.verplicht === true);

    const [EindResultaat, setEindResultaat] = useState();
    
    const [HoverTekst, setHoverTekst] = useState('');

    const controleerVerplichteShiften = () => {
        let hulpEindResultaat = verplichtShiften;
        calendar.forEach(individualEmployee => {
            let shift = individualEmployee.employeeCalendar.find(o => o.day === shiftday);
            if (shift.shift !== "") {
                let teSchrappenShift = hulpEindResultaat.find(o => o.naam === shift.shift);
                if (teSchrappenShift !== -1) {
                    hulpEindResultaat = hulpEindResultaat.filter(o => o !== teSchrappenShift);
                }
            }
        })

         let hulptekst = "";
         hulpEindResultaat.forEach(shift => {
            if (hulptekst.length === 0) {
                hulptekst+= shift.naam
            } else{
                hulptekst+= " - ";
                hulptekst+= shift.naam
            }
        })

        setHoverTekst(hulptekst);
        setEindResultaat(hulpEindResultaat);

    }

    
    function over(e) {
        
        e.target.style.border = "1px solid black";
        
    }
    function out(e) {
        e.target.style.border = '';
    }
 
    

    useEffect(() => {
        setEindResultaat(verplichtShiften);
        controleerVerplichteShiften();
        return () => {

        }
    }, [calendar])

    return (
        <div title={HoverTekst} onMouseOver={over} onMouseOut={out} style={{width:"100%",height:"100%"}} >
            {EindResultaat ? (EindResultaat.length === 0 ? <i class="far fa-thumbs-up"></i> : EindResultaat.length) : 0}
        </div>
    )
}

export default VerplichteShiftenControle
