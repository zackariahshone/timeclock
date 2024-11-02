import { createSlice, current } from '@reduxjs/toolkit'

export const studentHistorySlice = createSlice({
  name: 'studentHistory',
  initialState: {
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
    setHistoryBulk:(state, action)=>{
      console.log(action)
      return{
        ...state,
        ...action.payload.data        
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { addStudentHistory, editStudentHistory, setHistoryBulk } = studentHistorySlice.actions
// export const teachers =  (state) => state.employeeList.employees.filter(emp=>emp.type?.toLowerCase() == 'teacher');
export const studentHistory = (state)=> state.studentHistory
export default studentHistorySlice.reducer