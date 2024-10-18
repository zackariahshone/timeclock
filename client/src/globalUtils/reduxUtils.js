import store from '../app/store';

export const directReducer =(action, data,type)=>{
    store.dispatch(action(
        {
            type:type || null, 
            data
        }
    ))
}