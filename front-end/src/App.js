import React, { Component } from 'react';
import CreateTask from './components/CreateTask';
import Tasks from './components/Tasks';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  state ={
    tasks: [
      {
        id : 0,
        title : "Park Legend",
        description: "Narysować stropy",
        deadline : "2020-11-09T20:00",
        done : true,
      },
      {
        id : 1,
        title : "Bazy danych",
        description: "Połączyć aplikację z bazą Neo4j + kilka prostych zapytań",
        deadline : "2020-11-11T18:00",
        done : false,
      },
      {
        id : 2,
        title : "Java",
        description: "Wzorzec projektowy",
        deadline : "2020-11-08T10:00",
        done : true,
      },
      {
        id : 3,
        title : "React",
        description: "prosta aplikacja - toDoApp + Bootstrap",
        deadline : "2020-11-12T10:00",
        done : false,
      }
    ]
  }

  handleAddTaskClick = (title,description,deadline) =>{
    const task={
      id : this.state.tasks.length,
      title,
      description,
      deadline,
      done : false,
    }

    console.log(this.state.tasks);
    console.log(task);

    this.setState(prevState =>({
      tasks : [...prevState.tasks,task]
    }))
  }

  handleDoneTaskClick = (id) =>{
    console.log(`Wykonano ${id}`);
    const tasks=Array.from(this.state.tasks);

    tasks.forEach(task => {
      if(task.id===id){
        task.done=true;
      }
    });

    this.setState({
      tasks
    })
  }

  handleRemoveTaskClick = id => {
    console.log(`Usunięto ${id}`);
    const tasks=this.state.tasks
            .filter(task => task.id!==id);
    
    this.setState({
      tasks
    })
  }

  componentDidMount(){
    console.log("Mounting component...");
  }

  componentDidUpdate(){
    console.log("Updating component...");
  }

  componentWillUnmount(){
    console.log("Unmounting component...");
  }

  render() {
    return (
      <div className="container">
        <CreateTask addTask={this.handleAddTaskClick}/>
        <hr/>
        <Tasks  title="Zadania do wykonania" 
                tasks={this.state.tasks}
                isTaskDone={false}
                doneBtn={this.handleDoneTaskClick} 
                removeBtn={this.handleRemoveTaskClick}
        />
        <hr/>
        <Tasks  title="Zadania wykonane"
                tasks={this.state.tasks}
                isTaskDone={true} 
                removeBtn={this.handleRemoveTaskClick}
        />
      </div>
    );
  }
}

export default App;