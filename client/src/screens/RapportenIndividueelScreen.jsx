

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import fileDownload from 'js-file-download';
import moment from 'moment'




const RapportenIndividueelScreen = () => {
    const [Download, setDownload] = useState(false);
    const [Datum, setDatum] = useState(moment());


    const currentCalendar = useSelector((state) => state.currentCalendar);
    const { calendar } = currentCalendar;

    const shifttypeList = useSelector((state) => state.shifttypeList);
    const { shifttypes } = shifttypeList;
    const employeesList = useSelector((state) => state.employeesList);
    const { employees } = employeesList;


    async function DownloadPublicFile(id) {

        setDownload(true);
        console.log("button Clicked for" + id);
        let empCal = calendar.find(x => x.employeeId === id);
        let emp = employees.find(x => x.id === id);
        var naamArray = emp.naam.split(/(\s+)/);

        axios.post(`http://localhost:3001/api/rapporten`, ({
            calendar: {
                ...empCal, calendarMonth: "10-2021", voornaam: naamArray[0],
                familienaam: ""
            }, shifts: shifttypes
        })).then(() => {
            axios.get(`http://localhost:3001/api/rapporten/` + naamArray[0] + "_10-2021.xlsx", {
                responseType: 'blob',
            }).then(res => fileDownload(res.data, "test.xlsx"))
        });

        setDownload(false);


    }




    return (
        <div className="content-wrapper">

            {Download ? (
                <div class="overlay"><i style={{ margin: "250px" }} className="fas fa-3x fa-sync-alt fa-spin"></i></div>
            ) :  (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Individuele prestatiefiches</h3>

                        <div className="card-tools">
                            <ul className="pagination pagination-sm float-right">
                                <li className="page-item" onClick={()=> setDatum(Datum.clone().subtract(1,"month"))}><a className="page-link" >«</a></li>
                                <li className="page-item"><a className="page-link" >{Datum.format("MM-YYYY")}</a></li>
                                <li className="page-item"  onClick={()=> setDatum(Datum.clone().add(1,"month"))}><a className="page-link" >»</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th >id</th>
                                    <th>Naam</th>
                                    <th>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(empl =>
                                    <tr>
                                        <td>{empl.id}</td>
                                        <td>{empl.naam}</td>
                                        <td>
                                            <button onClick={(() => (DownloadPublicFile(empl.id)))}>
                                                <i class="fas fa-save"></i> download
                                            </button>
                                        </td>
                                    </tr>

                                )}




                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    )
}

export default RapportenIndividueelScreen
