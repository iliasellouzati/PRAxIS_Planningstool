import React from 'react'

const BadRequest400Error = ({setHttp400Error,error}) => {
    return (
        <div class="alert alert-warning alert-dismissible">
            <button type="button" class="close" onClick={()=>{setHttp400Error([false,[]])}}>X</button>
            <h5><i class="icon fas fa-exclamation-triangle"></i>{error[0]}</h5>
           {error[1]}
        </div>
    )
    
}

export default BadRequest400Error