import React, { useEffect } from 'react'






const Step6 = ({Config,INIT_StartUpMainWorkerForAutomatisation}) => {



    useEffect(() => {
  
        INIT_StartUpMainWorkerForAutomatisation(["INIT",Config]);
        
        return () => {
          
        }
      }, [])
      

    return (
        <div className="row">
            <div className="col-3">
                <div className="card">
                    <div className="card-header">
                        Week 1:
                    </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>

                        ...
                    </div>
                </div>
            </div>
            <div className="col-3">
                <div className="card">
                    <div className="card-header">
                        Week 2:
                    </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>

                        ...
                    </div>
                </div>
            </div>
            <div className="col-3">
                <div className="card">
                    <div className="card-header">
                        Week 3
                    </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>

                        ...
                    </div>
                </div>
            </div>
            <div className="col-3">
                <div className="card">
                    <div className="card-header">
                        Week 4:
                    </div>
                    <div className="card-body" style={{ textAlign: 'center' }}>

                        ...
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Step6