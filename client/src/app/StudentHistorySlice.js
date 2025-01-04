import { createSlice, current } from '@reduxjs/toolkit'
import { getStudentHistory } from '../Components/Dashboard/helpers';
export const studentHistorySlice = createSlice({
  name: 'studentHistory',
  initialState: {
  },
  reducers: {
    addStudentHistory: (state,action) => {
      let historyIndex;
       Object.values(current(state)).find((doc,x)=>{
        if(doc.id === action.payload.data.id)
          historyIndex = x;
          return x
      })    
    },
    editStudentHistory: (state,action) => {
    },
    setHistoryBulk:(state, action)=>{
      return{
        ...state,
        ...action.payload.data        
      }
    }
  },
})

export const { addStudentHistory, editStudentHistory, setHistoryBulk } = studentHistorySlice.actions
export const studentHistory = (state)=> state.studentHistory
export default studentHistorySlice.reducer