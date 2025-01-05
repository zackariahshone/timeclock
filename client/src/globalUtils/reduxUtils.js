import store from '../app/store';

export const directReducer =(action, data,type)=>{    
    if(action){
        store.dispatch(action(
            {
                type:type || null, 
                data
            }
        ))
    }
}