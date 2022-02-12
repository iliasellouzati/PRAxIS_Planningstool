import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateEmployee, addEmployee, deleteEmployee } from '../store/actions/employeesActions';

const EditEmployeeScreen = (props) => {

    const dispatch = useDispatch();
    const employeesList = useSelector((state) => state.employeesList);
    const { employees, loading, error } = employeesList;

    const contracttypeList = useSelector((state) => state.contracttypeList);
    const { contracttypes } = contracttypeList;

    const [Employee] = useState(props.match.params.id !== "new" ? employees.find(o => o.id.toString() === props.match.params.id) : [])
    const [Id, setId] = useState("");
    const [Naam, setNaam] = useState("");
    const [Email, setEmail] = useState("");
    const [Contracttype, setContracttype] = useState("");
    const [Finished, setFinished] = useState(false);
    const [BestaandeEmployee, setBestaandeEmployee] = useState(true);

    const [MogelijkeContracttypes, setMogelijkeContracttypes] = useState([])

    let categorien = [];

    const submitHandler = (e) => {
        e.preventDefault();
        if (BestaandeEmployee) {
            dispatch(updateEmployee(
                {
                    "naam": Naam,
                    "id": Id,
                    "email": Email,
                    "contracttype": Contracttype
                }));

            setFinished(true);

        } else {
            dispatch(addEmployee(
                {
                    "naam": Naam,
                    "id": Id,
                    "email": Email,
                    "contracttype": Contracttype
                }
            ));
            setFinished(true);
        }
    };

    const deleteHandler = () => {
        let answer = window.confirm("Werknemer " + Naam + " verwijderen?");
        if (answer) {
            dispatch(deleteEmployee(Id));
            setFinished(true);
        }
    }




    
    useEffect(() => {
        if (Finished) {
            props.history.push("/Werknemers");
        }

        contracttypes.forEach(contract => {
            if (!categorien.some(x => x.trim() === contract.naam.trim())) {
                categorien.push(contract.naam.trim());
            }
        });
        setMogelijkeContracttypes(categorien);


        if (props.match.params.id !== "new") {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setId(Employee.id);
            setNaam(Employee.naam);
            setEmail(Employee.email);
            setContracttype(Employee.contracttype)


        } else {
            let i = 1;
            for (let index = 0; index < employees.length; index++) {
                if (employees[index].id === i) {
                    i++;
                    continue;
                }
                break;
            }
            setId(i);
            setBestaandeEmployee(false);

        }


        return () => {
            //cleanup
        }
    }, [Finished])

    return (
        <div className="content-wrapper">



            <div className="card card-primary">
                <div className="card-header">
                    <h3 className="card-title">Werknemer aanpassen</h3>
                </div>

                <form onSubmit={submitHandler}>
                    <div className="card-body">

                        {/* ID */}
                        <div className="form-group">
                            <label htmlFor="ID">ID</label>
                            <input type="number" class="form-control" id="ID" onChange={(e) => setId(e.target.value)} value={Id} />
                        </div>

                        {/* NAAM */}
                        <div className="form-group" >
                            <label for="EMPL_NAME" >Naam </label>
                            <input type="text" class="form-control" id="EMPL_NAME" onChange={(e) => setNaam(e.target.value)} value={Naam} />
                        </div>

                        {/* EMAIL */}
                        <div className="form-group" >
                            <label for="EMPL_MAIL"  >Email</label>
                            <input type="email" class="form-control" id="EMPL_MAIL" onChange={(e) => setEmail(e.target.value)} value={Email} />
                        </div>
                        {/* CONTRACTTYPE */}
                        <div className="form-group" >
                            <div className="row">
                                <div className="col-3">
                                    <label for="EMPL_CONTRACT"  >Contracttype</label>
                                    <input type="text" class="form-control" list="CATEGORIE" id="EMPL_CONTRACT" onChange={(e) => setContracttype(e.target.value)} value={Contracttype} />
                                    <datalist id="CATEGORIE">
                                        {MogelijkeContracttypes.map(cat => (
                                            <option value={cat} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>



                        </div>

                        <div className="card-footer">
                            <button type="submit" style={{ width: "125px" }} className="btn btn-success">{BestaandeEmployee ? "Aanpassen" : "Toevoegen"}</button>
                            {BestaandeEmployee &&
                                <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-danger " onClick={(() => deleteHandler())}     >Verwijderen</button>}
                            <button type="button" style={{ marginLeft: "50px", width: "125px" }} className="btn btn-warning " onClick={() => setFinished(!Finished)}>Annuleren</button>

                        </div>
                    </div>
                </form>
            </div>





        </div>
    )
}

export default EditEmployeeScreen
