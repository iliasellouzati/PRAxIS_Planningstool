import React from 'react'

const SuccesModal = ({ setShowSuccesModal, data }) => {

console.log(data);
//[0] is de linker boven titel: vb WERKNEMER TOEGEVOEGD!
//[1] is de rechter subtitel: vb id:1
//[2] is de info zin : vb Werknemer ${naam} werd toegevoegd
    return (
        <div class="toast bg-success fade show " role="alert">
            <div class="toast-header">
                <strong class="mr-auto">{data[0]}</strong>
                <small style={{marginLeft:"5px"}}>{data[1]}</small>
                <button style={{marginLeft:"5px"}} type="button" class="ml-2 mb-1 close" onClick={()=>{setShowSuccesModal([false,[]])}} >
                    <span>X</span>
                </button>
            </div>
            <div class="toast-body">{typeof data[2]==='string'?data[2]:data[2].map(line=><p style={{margin:"2px",padding:'1px'}}>{line}</p>) }</div>
        </div>
    )
}

export default SuccesModal