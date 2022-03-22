import React, { useEffect, useState } from 'react'

const GeneralRulesLine = ({ResetView, name, data }) => {

    const [Show, setShow] = useState(true);
    const [ForcedShow, setForcedShow] = useState(true);

    useEffect(() => {
      
        setForcedShow(true);
    
      return () => {
        
      }
    }, [ResetView])
    
    useEffect(() => {
        if (ForcedShow) {
            if (Show && data.length === 0) {
                setShow(false);
            } else {
                setShow(true);
            }
        }

    }, [data])


    return (
        <React.Fragment>
            {ForcedShow && Show && <div>
                <b style={{ marginRight: '5px' }}>{name}: </b>
                {data.length > 5 ? <span>{`${data.length} dagen`}</span> : data.map(day => <span style={{ border: '1px dashed black', marginLeft: '3px', paddingLeft: '3px', paddingRight: '3px' }}> {day.substring(0, 5)} </span>)}
                <button type="button" class="ml-2 mb-1 close" onClick={() => { setForcedShow(false) }} >
                    <span>X</span>
                </button>
            </div>}
        </React.Fragment>
    )
}

export default GeneralRulesLine