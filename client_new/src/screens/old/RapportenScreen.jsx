import React from 'react';

const RapportenScreen = (props) => {

    const individueleRapporten = () =>{
        props.history.push("/Rapporten/individueel");
    }



    return (


        <div className="content-wrapper">

            <div  className="row" style={{ padding: "10px" }}>
            
                <div onClick={()=>individueleRapporten()} className="col-lg-3 col-6">
                    <div className="small-box bg-danger">
                        <div className="inner">
                            <h3>Individuel</h3>

                            <p>Maand &amp; historie</p>
                        </div>
                        <div className="icon">
                            <i className="fas fa-chalkboard-teacher"></i>
                        </div>

                    </div>
                </div>

                <div onClick={()=>individueleRapporten()} className="col-lg-3 col-6">
                    <div className="small-box bg-danger">
                        <div className="inner">
                            <h3>Planningen</h3>

                            <p>Maand in pdf</p>
                        </div>
                        <div className="icon">
                        <i className="far fa-calendar-alt"></i>

                        </div>

                    </div>
                </div>


                <div onClick={()=>individueleRapporten()} className="col-lg-3 col-6">
                    <div className="small-box bg-danger">
                        <div className="inner">
                            <h3>Statistieken</h3>

                            <p>Overige</p>
                        </div>
                        <div className="icon">
                        <i className="ion ion-stats-bars"></i>
                        </div>
                    </div>
                </div>







            </div>










        </div>
    )
}

export default RapportenScreen
