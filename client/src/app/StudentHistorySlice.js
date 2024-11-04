import { createSlice, current } from '@reduxjs/toolkit'
import { getStudentHistory } from '../Components/Dashboard/helpers';
export const studentHistorySlice = createSlice({
  name: 'studentHistory',
  initialState: {
  },
  reducers: {
    addStudentHistory: (state,action) => {
      // state.studentHistory
      // console.log(action);
    
      let historyIndex;
       Object.values(current(state)).find((doc,x)=>{
        if(doc.id === action.payload.data.id)
          historyIndex = x;
          return x
      })
      let currentHistory = Object.values(current(state)).find((doc)=>doc.id == action.payload.data.id)
      // console.log(historyIndex);
      // console.log(state[1].clockedInOutHistory);
      
      // console.log(StudentHistoryList);
      
      // console.log(StudentHistoryList[0].clockedInOutHistory);
      const updatedHistory = new Array()
      
        
      //  StudentHistoryList = [...StudentHistoryList[0].clockedInOutHistory,{...action.payload.data}]
      
    },
    editStudentHistory: (state,action) => {
      // console.log(action);
      // return {
      //   ...state,
      //   employees: [
      //     ...state.employees,
      //     action.payload.data,
      //   ]
      // }
    },
    setHistoryBulk:(state, action)=>{
      // console.log(action)
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