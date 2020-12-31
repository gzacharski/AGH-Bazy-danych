import React from 'react';

const Task = (props) => {
    const {id,title, description, deadline, doneBtn, removeBtn}=props;

    return (
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 my-2">
            <div className="card">
                <div className="card-body">
                    <h3>{title}</h3>
                    <h5>{deadline}</h5>
                    <p>{description}</p>
                    {doneBtn ? <button className="btn btn-success mr-2" onClick={() => doneBtn(id)}>Wykonano</button> : null}
                    {removeBtn ? <button className="btn btn-warning" onClick={()=>removeBtn(id)}>Usuń</button> : null}
                </div>
            </div>
        </div>
    );
}
 
export default Task;