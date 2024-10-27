import { createSlice, current } from '@reduxjs/toolkit'

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {
  },
  reducers: {
    signin: (state,action) => {
      return {
        ...state,
        signedIn:action.payload.signedIn,
        userSignedIn:action.payload.teacherName
      }
    },
    signOut: (state,action) => {
      return {
        ...state,
       currentUser:{
        signedIn:false,
        userSignedIn:''
       }
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { signin, signOut} = currentUserSlice.actions
export const userSignedIn =  (state) => state.currentUser.userSignedIn;
export const students = (state)=> state.employeeList.employees.filter(emp=>emp.type == 'student');
export default currentUserSlice.reducer