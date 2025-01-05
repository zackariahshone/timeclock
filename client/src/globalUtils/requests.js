//all requests stored here
import { directReducer } from "./reduxUtils"

export const createItem = (route, body, action, type) => {
    fetch(route, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body) || '',
    }).then(response => response.json()).then(data => {
        directReducer(action, data, type)
    })
}

export const updateItem = (route, body, action, type) => {
    fetch(route, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body) || '',
    }).then(response => response.json()).then(data => {
        console.log(action);
        
        if(typeof action == "function"){
            directReducer(action, data, type)
        }else if(action == 'object'){
            action.forEach((act)=>{
                directReducer(act,data,type)
            })
        } 
    })
}

export const getData = (route, method, action, type) => {
    fetch(route, {
        method: method,
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }).then(response => response.json()).then(data => {
        directReducer(action, data, type)
    })
}

export const deleteItem = (route, body, action, type) => {
    fetch(route, {
        method: 'DELETE',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body) || '',
    }).then(response => response.json()).then(data => {
        directReducer(action, data, type)
    })
}