import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateData, updateMetrics } from "../todos/todos";
import { updatePagination } from "../pagination/paginationSlice";

export function useTodo(){
    const filters = useSelector((state)=> state.todos.filters);
    const sort = useSelector((state)=> state.todos.sort);
    const page = useSelector((state)=> state.pagination.requestPage.page);
    //const sortDateTest = useSelector((state) => state.todos.sortDateTest);
    const dispatch = useDispatch();

    //Only runs one time for initial rendering, gets all todos with no filters
    useEffect(()=>{
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
          } 
        fetch(`http://localhost:9090/api/todos`, requestOptions)
        .then(response=>response.json())
        .then(data=> {
            console.log("Got data from the useEffect!");
          console.log(data);
          dispatch(updateData(data.data));
          dispatch(updateMetrics(data.metrics));
          dispatch(updatePagination(data.pagination));
        })
    }, [0]);

    const onGetFilteredData = (filters, sort, requestPage)=>{
        //Filters, sort, and page should come from invocation

        console.log("**************************")
        console.log("From inside useTodo:")
        console.log(filters);
        console.log(sort);
        console.log("Page: " + requestPage);

        if(requestPage === undefined){
          requestPage = 1;
        }


        let requestString = `page=${requestPage}&priority=${filters.priority}&state=${filters.state}&text=${filters.text}`;
        if(sort.sortByPriority != null){
        requestString += `&sortByPriority=${sort.sortByPriority}`;
        }

        if(sort.sortByDate != null){
        requestString += `&sortByDate=${sort.sortByDate}`;
        }

        console.log("RequestString: " + requestString);

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
          }
        fetch(`http://localhost:9090/api/todos?${requestString}`, requestOptions)
        .then(response=>response.json())
        .then(data=> {
          console.log(data);
          dispatch(updateData(data.data));
          dispatch(updateMetrics(data.metrics));
          dispatch(updatePagination(data.pagination));
        })
    }

    //Post todo to API
    const onAddTodo = ((text, dueDate, priority) =>{
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({text: text, dueDate: dueDate, doneState: false, priority: priority})
          };
          fetch('http://localhost:9090/api/todos', requestOptions)
              .then(response => response.json())
              .then(data => {
                console.log(data)
                if(data.id<=-1){
                  alert(data.text);
                }
              });

              setTimeout(
                () => onGetFilteredData(filters, sort, page), 
                100
              );
    })

    const onUpdateTodo = ((text, dueDate, priority, id) =>{
      console.log("dueDate from hook: " + dueDate)
      const requestOptions = {
          method: 'PUT',
          headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
          body: JSON.stringify({text: text, dueDate: dueDate, priority: priority})
        };
        fetch(`http://localhost:9090/api/todos/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log(data)
              if(data.id<=-1){
                alert(data.text);
              }
              setTimeout(
                () => onGetFilteredData(filters, sort, page), 
                100
              );
            });
           
    })

    const onMarkTodo = ((id) =>{

      console.log("Setting todo as DONE from inside hook!")
      const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
          body: JSON.stringify({})
        };
        fetch(`http://localhost:9090/api/todos/${id}/done`, requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log(data)
              if(data.id<=-1){
                alert(data.text);
              }
              setTimeout(
                () => onGetFilteredData(filters, sort, page), 
                100
              );
            });
           
    })

    const onUnmarkTodo = ((id) =>{

      console.log("Setting todo as undone from inside hook!")
      const requestOptions = {
          method: 'PUT',
          headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
          body: JSON.stringify({})
        };
        fetch(`http://localhost:9090/api/todos/${id}/undone`, requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log(data)
              if(data.id<=-1){
                alert(data.text);
              }
              setTimeout(
                () => onGetFilteredData(filters, sort, page), 
                100
              );
            });
           
    })



    const onDeleteTodo = ((id)=>{
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
          };
          fetch(`http://localhost:9090/api/todos/${id}`, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            if(data.id<=-1){
              alert(data.text);
            }
          });

          //setTimeout( onGetFilteredData(filters, sort, page), 5000);
          setTimeout(
            () => onGetFilteredData(filters, sort, page), 
            100
          );
    })

    return { onGetFilteredData, onAddTodo, onDeleteTodo, onUpdateTodo, onUnmarkTodo, onMarkTodo }

    //const 
        
}