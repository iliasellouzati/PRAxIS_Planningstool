import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/general/LoadingSpinner';

const AllHolydaysScreen = () => {

    let { year } = useParams();
    const history = useHistory();

    const [Loading, setLoading] = useState(true);
    const [HoliDays, setHoliDays] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        await axios.get(`http://127.0.0.1:3001/api/holiday/custom/year/${year}`)
            .then(response => setHoliDays(response.data))
            .finally(() => setLoading(false));
    };

    const AddDaysBasedOnLastYear = async () => {
        setLoading(true);
        let { data } = await axios.get(`http://127.0.0.1:3001/api/holiday/custom/year/${moment(year, "YYYY").subtract(1, "year").format("YYYY")}`);

        for (let index = 0; index < data.length; index++) {

            await axios.post(`http://127.0.0.1:3001/api/holiday`, {
                naam: data[index].naam,
                jaar: moment(data[index].jaar, "YYYY").add(1, 'year').format("YYYY"),
                datum: moment(data[index].datum, "YYYY-MM-DD").add(1, 'year').format("DD-MM-YYYY")
            });
        }
        fetchData().catch(e => console.log(e));

    }

    useEffect(() => {
        fetchData().catch(e => console.log(e));

        return () => {

        }
    }, [year])


    return (
        <div className="content-wrapper">



            {Loading ? <LoadingSpinner /> : (

                <div className="col-md">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Feestdagen voor {year}</h3>

                            <div className="card-tools">
                                <ul className="pagination pagination-sm float-right">
                                    <li className="page-item page-link" onClick={() => history.push(`/feestdagen/${moment(year, "YYYY").subtract(1, 'year').format("YYYY")}`)}>«</li>
                                    <li className="page-item page-link">{year}</li>
                                    <li className="page-item page-link" onClick={() => history.push(`/feestdagen/${moment(year, "YYYY").add(1, "year").format("YYYY")}`)}>»</li>
                                </ul>
                            </div>

                        </div>

                        <div className="card-body p-0">
                            <table className="table table-striped">


                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAAM</th>
                                        <th>JAAR</th>
                                        <th>DATUMS</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {!HoliDays ?
                                        <tr>
                                            <td colSpan={1}>
                                                geen feestdagen in systeem
                                            </td>
                                            <td colSpan={3}>
                                                <button type="button" class="btn btn-block bg-gradient-warning btn-xs" onClick={() => AddDaysBasedOnLastYear()}>
                                                    Copy-Paste vanuit {moment(year, "YYYY").subtract(1, "year").format("YYYY")}
                                                </button>
                                            </td>
                                        </tr>
                                        :
                                        HoliDays.map((DAY) => (

                                            <tr>
                                                <td>{DAY.id}</td>
                                                <td>{DAY.naam}</td>
                                                <td>{DAY.jaar}</td>
                                                <td>{moment(DAY.datum, "YYYY-MM-DD").format("DD-MM-YYYY")}</td>


                                                <td>
                                                    <Link to={"/feestdagen/" + year + "/" + DAY.id}>
                                                        <i class="fas fa-edit"></i>
                                                    </Link>

                                                </td>
                                            </tr>
                                        )
                                        )}
                                </tbody>


                                <tfoot>
                                    <tr>
                                        <td colSpan="5" >
                                            <Link to={"/feestdagen/" + year + "/new"}>
                                                <button type="button" class="btn btn-block bg-gradient-primary btn-xs">Feestdag toevoegen</button>
                                            </Link>
                                        </td>

                                    </tr>
                                </tfoot>

                            </table>
                        </div>
                    </div>
                </div>

            )}
        </div>
    )
}

export default AllHolydaysScreen