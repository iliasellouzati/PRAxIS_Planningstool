import React, { useState, useEffect } from 'react';

function DagControleBox({ geplandeShifts, verplichteShiften, day }) {

    const [OntbrekendeShifts, setOntbrekendeShifts] = useState([])

    const checkOntbrekendeShifts = () => {
        let hulpArr = [];

        geplandeShifts.forEach(shift => {
            if (shift[0]) {
                hulpArr.push(shift[0]);
            }
        }
        )

        let hulpArr2 = verplichteShiften.filter(shift => !hulpArr.includes(shift.naam));

        setOntbrekendeShifts(hulpArr2);
    }


    useEffect(() => {

        checkOntbrekendeShifts();
        return () => {

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geplandeShifts])

    return (
        <>
            {OntbrekendeShifts.map(shift =>
                <div style={{ backgroundColor: shift.kleurcode, fontSize:'x-small', margin:'0px', height:'15px' }}></div>
            )}
        </>
    )
}

export default DagControleBox;
