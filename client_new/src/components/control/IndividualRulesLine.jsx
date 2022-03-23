import React, { useEffect, useState } from 'react'

const IndividualRulesLine = ({ setHighlightCustom, ResetView, name, data }) => {


    const [Show, setShow] = useState(true);
    const [ForcedShow, setForcedShow] = useState(true);

    useEffect(() => {

        setForcedShow(true);

        return () => {

        }
    }, [ResetView])


    useEffect(() => {
        console.log(name);
        console.log(data);
        if (ForcedShow) {
            if (typeof data === 'undefined' || data?.length === 0) {
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
                {data.length > 3 ?
                    <span>{`${data.length} situaties`}</span>
                    :
                    data.map(serie =>
                        <span
                        onMouseOver={() => setHighlightCustom([true,serie ])}
                        onMouseOut={() => setHighlightCustom([false, []])}
                            style={{
                                border: '1px dashed black',
                                marginLeft: '3px',
                                paddingLeft: '3px',
                                paddingRight: '3px'
                            }}>
                            {`ID:${serie.employeeId} van ${serie.start.clone().format('DD-MM')} tot ${serie.end.clone().format('DD-MM')}`}
                        </span>)}
                <button type="button" class="ml-2 mb-1 close" onClick={() => { setForcedShow(false) }} >
                    <span>X</span>
                </button>
            </div>}

        </React.Fragment>)
}

export default IndividualRulesLine