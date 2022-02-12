import React from 'react'

const Home = () => {
    return (




        
        
    
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Dashboard</h1>
                            </div>{/* /.col */}
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">Home</li>
                                    <li className="breadcrumb-item active">Dashboard</li>
                                </ol>
                            </div>{/* /.col */}
                        </div>{/* /.row */}
                    </div>{/* /.container-fluid */}
                </div>
                {/* /.content-header */}
                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">

                        {/* Main row */}
                        <div className="row">
                            {/* Left col */}
                            <section className="col-lg-7 connectedSortable">

                                {/* TO DO List */}
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">
                                            <i className="ion ion-clipboard mr-1" />
                                            To Do List
                                        </h3>
                                        
                                    </div>
                                    {/* /.card-header */}
                                    <div className="card-body">
                                        <ul className="todo-list" data-widget="todo-list">
                                            <li>
                                                {/* drag handle */}
                                                <span className="handle">
                                                    <i className="fas fa-ellipsis-v" />
                                                    <i className="fas fa-ellipsis-v" />
                                                </span>
                                                {/* checkbox */}
                                                <div className="icheck-primary d-inline ml-2">
                                                    <input type="checkbox" defaultValue name="todo1" id="todoCheck1" />
                                                    <label htmlFor="todoCheck1" />
                                                </div>
                                                {/* todo text */}
                                                <span className="text">Voorbeeld 1</span>
                                                {/* Emphasis label */}
                                                <small className="badge badge-danger"><i className="far fa-clock" /> 2 dagen</small>
                                                {/* General tools such as edit or delete*/}
                                                <div className="tools">
                                                    <i className="fas fa-edit" />
                                                    <i className="fas fa-trash-o" />
                                                </div>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fas fa-ellipsis-v" />
                                                    <i className="fas fa-ellipsis-v" />
                                                </span>
                                                <div className="icheck-primary d-inline ml-2">
                                                    <input type="checkbox" defaultValue name="todo2" id="todoCheck2" defaultChecked />
                                                    <label htmlFor="todoCheck2" />
                                                </div>
                                                <span className="text">voorbeeld 2</span>
                                                <small className="badge badge-info"><i className="far fa-clock" /> 4 dagen</small>
                                                <div className="tools">
                                                    <i className="fas fa-edit" />
                                                    <i className="fas fa-trash-o" />
                                                </div>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fas fa-ellipsis-v" />
                                                    <i className="fas fa-ellipsis-v" />
                                                </span>
                                                <div className="icheck-primary d-inline ml-2">
                                                    <input type="checkbox" defaultValue name="todo3" id="todoCheck3" />
                                                    <label htmlFor="todoCheck3" />
                                                </div>
                                                <span className="text">voorbeeld 3</span>
                                                <small className="badge badge-warning"><i className="far fa-clock" /> 1 maand</small>
                                                <div className="tools">
                                                    <i className="fas fa-edit" />
                                                    <i className="fas fa-trash-o" />
                                                </div>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fas fa-ellipsis-v" />
                                                    <i className="fas fa-ellipsis-v" />
                                                </span>
                                                <div className="icheck-primary d-inline ml-2">
                                                    <input type="checkbox" defaultValue name="todo4" id="todoCheck4" />
                                                    <label htmlFor="todoCheck4" />
                                                </div>
                                                <span className="text">Voorbeeld 4</span>
                                                <small className="badge badge-success"><i className="far fa-clock" /> 3 maanden</small>
                                                <div className="tools">
                                                    <i className="fas fa-edit" />
                                                    <i className="fas fa-trash-o" />
                                                </div>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fas fa-ellipsis-v" />
                                                    <i className="fas fa-ellipsis-v" />
                                                </span>
                                                <div className="icheck-primary d-inline ml-2">
                                                    <input type="checkbox" defaultValue name="todo5" id="todoCheck5" />
                                                    <label htmlFor="todoCheck5" />
                                                </div>
                                                <span className="text">Voorbeeld 5</span>
                                                <small className="badge badge-primary"><i className="far fa-clock" /> 1 jaar</small>
                                                <div className="tools">
                                                    <i className="fas fa-edit" />
                                                    <i className="fas fa-trash-o" />
                                                </div>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fas fa-ellipsis-v" />
                                                    <i className="fas fa-ellipsis-v" />
                                                </span>
                                                <div className="icheck-primary d-inline ml-2">
                                                    <input type="checkbox" defaultValue name="todo6" id="todoCheck6" />
                                                    <label htmlFor="todoCheck6" />
                                                </div>
                                                <span className="text"> Voorbeeld 6</span>
                                                <small className="badge badge-secondary"><i className="far fa-clock" /> onbepaakd</small>
                                                <div className="tools">
                                                    <i className="fas fa-edit" />
                                                    <i className="fas fa-trash-o" />
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* /.card-body */}
                                    <div className="card-footer clearfix">
                                        <button type="button" className="btn btn-primary float-right"><i className="fas fa-plus" /> Add item</button>
                                    </div>
                                </div>
                                {/* /.card */}
                            </section>
                            {/* /.Left col */}
                            {/* right col (We are only adding the ID to make the widgets sortable)*/}
                            <section className="col-lg-5 connectedSortable">

                            </section>
                            {/* right col */}
                        </div>
                        {/* /.row (main row) */}
                    </div>{/* /.container-fluid */}
                </section>
                {/* /.content */}
            </div>

        
    )
}

export default Home
