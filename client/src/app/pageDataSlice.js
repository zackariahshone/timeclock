import { createSlice, current } from '@reduxjs/toolkit'

export const employeeListSlice = createSlice({
  name: 'pageData',
  initialState: {
    signedIn:false,
    userSignedIn: ''
  },
  reducers: {
    signin: (state,action) => {
      return {
        ...state,
       pageData:{
        signedIn:action.payload.signedIn,
        userSignedIn:action.payload.teacherName
       }
      }
    },
    signOut: (state,action) => {
      return {
        ...state,
       pageData:{
        signedIn:false,
        userSignedIn:''
       }
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { signin, signOut} = employeeListSlice.actions
export const teachers =  (state) => state.employeeList.employees.filter(emp=>emp.type.toLowerCase() == 'teacher');
export const students = (state)=> state.employeeList.employees.filter(emp=>emp.type == 'student');
export default employeeListSlice.reducer