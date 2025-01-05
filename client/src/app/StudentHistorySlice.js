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
    },
    updateBulkHistory:(state, action)=>{
      console.log(action.payload.data);
      const historyToUpdate = action.payload.data.reduxUpdate
      const program = action.payload.data.program
      const timeStamp = action.payload.data.inTimeStamp
      // const
          //   {
    //     "program": "Aspire",
    //     "inTimeStamp": {
    //         "status": "in",
    //         "timeMilli": 1736025908058,
    //         "time": "15:25",
    //         "setBy": "new guy admin"
    //     },
    //     "reduxUpdate": [
    //         "erc-123456",
    //         "erc-24542345"
    //     ]
    // }
    console.log(historyToUpdate);
    
    historyToUpdate.forEach((id)=>{
      let editIndex = null
      console.log(id);
      console.log('studnet history',current(state));
      const histKeys = Object.values(current(state))
      console.log(histKeys);
      
      const history = histKeys.find((e,x)=>{
        editIndex = x;
        return e.id == id
      })
      console.log(history);
      state[editIndex][program].push({...timeStamp})
    
      })
    }
  },
})

export const { addStudentHistory, editStudentHistory, setHistoryBulk,updateBulkHistory } = studentHistorySlice.actions
export const studentHistory = (state)=> state.studentHistory
export default studentHistorySlice.reducer