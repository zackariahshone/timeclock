import { createSlice, current } from '@reduxjs/toolkit'

export const studentHistorySlice = createSlice({
  name: 'studentHistory',
  initialState: {
    history: {
        "Theo":[],
        "Bob":[]
    }
    
  },
  reducers: {
    addStudentHistory: (state,action) => {
      console.log(action);
      // return {
      //   ...state,
      //   employees: [
      //     ...state.employees,
      //     ...action.payload.data,
      //   ]
      // }
    },
    editStudentHistory: (state,action) => {
      console.log(action);
      // return {
      //   ...state,
      //   employees: [
      //     ...state.employees,
      //     action.payload.data,
      //   ]
      // }
    },
  },
})

// Action creators are generated for each case reducer function
export const { addStudentHistory, editStudentHistory } = studentHistorySlice.actions
// export const teachers =  (state) => state.employeeList.employees.filter(emp=>emp.type?.toLowerCase() == 'teacher');
// export const students = (state)=> state.employeeList.employees.filter(emp=>emp.type == 'student');
export default studentHistorySlice.reducer