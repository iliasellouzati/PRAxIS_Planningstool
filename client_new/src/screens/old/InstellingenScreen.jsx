import React from 'react'

const InstellingenScreen = (props) => {




    return (


        <div className="content-wrapper">
            <div className="row" style={{ padding: "10px" }}>



                <div onClick={() => props.history.push("/instellingen/week")} className="col-lg-3 col-6">
                    <div className="small-box bg-danger">
                        <div className="inner">
                            <h3>Week</h3>

                            <p>mogelijke weekconfiguraties</p>
                        </div>
                        <div className="icon">
                            <i className="far fa-calendar-alt"></i>

                        </div>
                    </div>
                </div>



                <div onClick={() => props.history.push("/instellingen/planningstool")} className="col-lg-3 col-6">
                    <div className="small-box bg-danger">
                        <div className="inner">
                            <h3>Overige</h3>

                            <p>Overige instellingen</p>
                        </div>
                        <div className="icon">
                            <i className="fas fa-cogs"></i>
                        </div>
                    </div>
                </div>

            </div>
        </div>



    )
}

export default InstellingenScreen
