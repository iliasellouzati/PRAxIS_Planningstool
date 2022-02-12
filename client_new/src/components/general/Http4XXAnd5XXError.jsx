import React from 'react';
import moment from 'moment';
import '../../helpers/moment_prototype';

const Http4XXAnd5XXError = ({ error, setHttp4XXAnd5XX }) => {
    console.log(error);
    return (

        <div className='d-flex  justify-content-center'>

            <div className='card' style={{ marginTop: "100px", maxWidth:'75%' }} >


                <div class="card-header text-center mt-10">
                    <h1 style={{ color: 'red' }}><i className="fas fa-exclamation-triangle " />Opgetreden fout</h1>
                </div>
                <div class="card-body">
                    <h5 class="card-title">URL :</h5>
                    <p class="card-text">{error.config.url}</p>
                    <h5 class="card-title">METHOD :</h5>
                    <p class="card-text">{error.config.method}</p>
                    <h5 class="card-title">Tijd :</h5>
                    <p class="card-text">{moment().format('LLLL')}</p>
                    <h5 class="card-title">Foutcode :</h5>
                    <p class="card-text">{error.response.status}</p>
                    <h5 class="card-title">Foutmelding :</h5>
                    <p class="card-text">{error.response.data}</p>
                    <button type="button" class="btn btn-block bg-gradient-danger btn-lg" onClick={() => { setHttp4XXAnd5XX([0, ""]) }}>Keer terug naar vorig scherm</button>

                </div>

            </div>

        </div>





    )
}

export default Http4XXAnd5XXError