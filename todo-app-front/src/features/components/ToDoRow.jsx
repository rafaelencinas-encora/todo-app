import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateToDoModal } from "./UpdateToDoModal";
import todos from "../todos/todos";


export function ToDoRow({ onGetFilteredData, onDeleteTodo, toDo, onUpdateTodo, onMarkTodo, onUnmarkTodo }){
    //const { onDeleteTodo } = useTodo();
    const [updateTodoModalState, setUpdateTodoModalState] = useState(false);
    const [todoState, setTodoState] = useState(toDo.doneState)
    //const filters = useSelector((state)=> state.todos.filters);
    //const sort = useSelector((state)=> state.todos.sort);
    const [priorityText, setPriorityText] = useState("Low");
      //const page = useSelector((state)=> state.pagination.requestPage.page);
    const page = 1;
    let checked = toDo.doneState?"checked":null;

    function toggleUpdateModal(){
      setUpdateTodoModalState(!updateTodoModalState);
    }

    function deleteTodo(){
      console.log("Clicked on delete todo for id: " + toDo.id);
      onDeleteTodo(toDo.id);
    }

    function updateTodo(){
      console.log("Clicked on delete todo for id: " + toDo.id);
      toggleUpdateModal()
    }

    function markDone(){
      if(!todoState){
        console.log("Changed to DONE!");
        onMarkTodo(toDo.id);
      } else {
        console.log("Changed to UNDONE");
        onUnmarkTodo(toDo.id);
      }
    }
    return(
      <tr>          
        <td className='colState'>
          <input data-testid='checkbox-test' type="checkbox" name="todoCheckbox" id={toDo.id} defaultChecked={todoState}
           onChange={()=> {
            setTodoState(!todoState);
            markDone();
           }}
          /></td> 
        <td data-testid='text-test'>{toDo.text}</td>  
        <td data-testid='priority-test'>{toDo.priority==0?"Low":toDo.priority==1?"Medium":"High"}</td> 
        <td data-testid='dueDate-test'>{toDo.dueDate!=null?toDo.dueDate:"-"}</td> 
        <td data-testid='modalLocation-test'>
          <button className='generalBtn'
            onClick={updateTodo}
            >
              Edit
          </button>
          {updateTodoModalState? <UpdateToDoModal toggleUpdateModal={toggleUpdateModal} toDo={toDo} onUpdateTodo={onUpdateTodo} /> :null}
          <button className='generalBtn'
            onClick={deleteTodo}
            >
              Delete
          </button>
        </td> 
      </tr>
    );
  }