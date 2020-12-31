import React, { Component } from 'react';


class CreateTask extends Component {
    
    min=new Date().toISOString().slice(0,16);

    state = {
        title : "",
        description : "",
        deadline : ""
    }

    handleInputChange = (e) => {
        this.setState({
            title : e.target.value
        })
    }

    handleTextAreaChange = e => {
        this.setState({
            description : e.target.value
        })
    }

    handleDateSet = e => {
        console.log(e.target.value)
        this.setState({
            deadline : e.target.value
        })
    }

    handleAddButton = () => {
        const {title, description, deadline}=this.state;
        if(title.length >2 && deadline !=null){
            this.props.addTask(title,description,deadline);
        }else{
            alert("Wpisz coś");
        }
    }

    render(){
        return (  
            <div className="row align-self-center col-sm-8">
                <h2>Stwórz nowe zadanie</h2>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Tytuł</span>
                    </div>
                    <input onChange={this.handleInputChange} type="text" className="form-control" placeholder="Tytuł zadania" aria-label="Tytuł zadania" aria-describedby="basic-addon1"/>
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Opis</span>
                    </div>
                    <textarea className="form-control" onChange={this.handleTextAreaChange} placeholder="Wpisz tutaj opis zadania..."></textarea>    
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Termin wykonania</span>
                    </div>
                    <input onChange={this.handleDateSet} min={this.min} value={this.min} className="form-control" type="datetime-local"/>
                </div>

                <button className="btn btn-info" onClick={this.handleAddButton}>Dodaj zadanie</button>
            </div>
        );
    }
}
 
export default CreateTask;