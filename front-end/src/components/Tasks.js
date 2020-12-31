import React from 'react';
import Task from './Task';

const Tasks= (props) => {

  const tasks= props.tasks
    .filter(task => task.done===props.isTaskDone)
    .map( task =>
        <Task   key={task.id} 
                id={task.id}
                title={task.title}
                description={task.description}
                deadline={task.deadline}
                doneBtn={props.doneBtn}
                removeBtn={props.removeBtn}
        />
    );

  return (  
    <div className="justify-content-center">
      <h2>{props.title}</h2>
      <div className="row justify-content-left">
        {tasks}
      </div>
    </div>
  );
}
 
export default Tasks;