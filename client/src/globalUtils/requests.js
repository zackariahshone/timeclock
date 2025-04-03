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

export const updateItem = (route, body, action, cleanup, type) => {
    fetch(route, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body) || '',
    }).then(response => response.json()).then(data => {
        if(typeof action == "function"){
            directReducer(action, data, type)
        }
        else if(action == undefined || !action){
            return;
        }
        else if(action.length > 0){
            action.forEach((act)=>{
                directReducer(act,data,type)
            })
        } 
    }).then(data=>{
        console.log('here');
        
        if(cleanup && cleanup.method == 'GET'){
            
            getData(cleanup.route, cleanup.method, cleanup.action)
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