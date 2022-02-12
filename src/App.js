import './App.css';
import {useState, useEffect} from "react";
import Axios from "axios";
import {AiOutlineEdit} from 'react-icons/ai';
import {AiOutlineDelete} from 'react-icons/ai';


function App() {

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("N/A");
  const [listOfTasks, setListOfTasks] = useState([]);


  const addTask = () =>  {
    Axios.post('http://localhost:3001/createtask', {
      subject: subject, 
      description: description, 
      dueDate: dueDate,
    }).then((response) => {
      setListOfTasks([...listOfTasks, { _id: response.data._id, subject: subject, description: description, dueDate: dueDate}])
      let inputs = document.querySelectorAll("input");
      inputs.forEach((input) => (input.value = ""));
    })
  };

  const updateTask = (id) => {
    const newDueDate = prompt("Enter new deadline: ");
    Axios.put('http://localhost:3001/update', {
      newDueDate: newDueDate,
      id: id
    }).then(() => {
      setListOfTasks(listOfTasks.map((value) => {
        return value._id == id 
          ? {_id: id, subject: value.subject, description: value.description, dueDate: newDueDate}  
          : value;
      }))
    })
  };

  const deleteTask = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      setListOfTasks(listOfTasks.filter((value) => {
        return value._id != id;
      })
      );
    });
  };

  useEffect(() => {
    Axios.get('http://localhost:3001/read')
    .then((response) => {
      setListOfTasks(response.data);
    }).catch(() => {
      console.log("ERROR");
    });
  }, 
  []);


  return (
    <div className="App">
      <h1>What do you need to do?</h1>
      <div className = "inputs">
        <input type="text" placeholder="Task Subject..." onChange={(event) => {
          setSubject(event.target.value);
        }}
        />
        <input type="text" placeholder="Task Description..." onChange={(event) => {
          setDescription(event.target.value);
        }}
        />
        <input type="text" placeholder = "Task Deadline..." onChange={(event) => {
          setDueDate(event.target.value);
        }}
        />

        <button onClick={addTask}>Add Task</button>
      </div>
      <h1 id="title">To Do List</h1>
      <table>
        <div className="taskContainer">
        <tr>
        <th>Subject</th>
        <th>Description</th>
        <th>Deadline</th>
        <th>Update</th>
        <th>Delete</th>
        </tr>
        <div>
        {listOfTasks.map((value) => {
          return (
            <>
              
                <div> 
                    <tr>
                    <td >{value.subject}</td>
                    <td >{value.description} </td>
                    <td >{value.dueDate}</td>
                
                <td><button onClick={() => {
                  updateTask(value._id);
                  }}>
                    <AiOutlineEdit/></button> </td>
                <td><button onClick={() => {
                  deleteTask(value._id);
                }}> 
                  <AiOutlineDelete/>
                </button></td>
                </tr>
                </div>
              
            </>
        
        );
        })}
        </div>
        </div>
      </table>
      

    </div>
  );
}

export default App;
