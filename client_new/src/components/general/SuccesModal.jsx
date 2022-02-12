import React from 'react'

const SuccesModal = ({ setShowSuccesModal, data }) => {
    return (
        <div class="toast bg-success fade show " role="alert">
            <div class="toast-header">
                <strong class="mr-auto">{data[0]}</strong>
                <small>{data[1]}</small>
                <button  type="button" class="ml-2 mb-1 close" onClick={()=>{setShowSuccesModal([false,[]])}} >
                    <span>X</span>
                </button>
            </div>
            <div class="toast-body">{data[2]}</div>
        </div>
    )
}

export default SuccesModal