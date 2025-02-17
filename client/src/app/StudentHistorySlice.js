import { createSlice, current } from '@reduxjs/toolkit'
export const studentHistorySlice = createSlice({
  name: 'studentHistory',
  initialState: {
  },
  reducers: {
    addStudentHistory: (state, action) => {
      let historyIndex;
      Object.values(current(state)).find((doc, x) => {
        if (doc.id === action.payload.data.id)
          historyIndex = x;
        return x
      })
    },
    editStudentHistory: (state, action) => {
    },
    setHistoryBulk: (state, action) => {
      return {
        ...state,
        ...action.payload.data
      }
    },
    updateBulkHistory: (state, action) => {
      const historyToUpdate = Object.keys(action.payload.data.reduxUpdate)
      const status = action.payload.data.reduxUpdate
      const program = action.payload.data.program
      const inTimeStamp = action.payload.data.inTimeStamp
      const outTimeStamp = action.payload.data.outTimeStamp
      
      historyToUpdate.forEach((id) => {
        let editIndex = null
        const histKeys = Object.values(current(state))
        histKeys.find((e, x) => {
          editIndex = x;
          return e.id === id
        })
        
        if(!status[id][program]){
          state[editIndex][program] = [{...inTimeStamp}]
        }
        else if (status[id] === 'in') {
          state[editIndex][program].push({ ...inTimeStamp })
        } else {
          state[editIndex][program].push({ ...outTimeStamp })
        }
      })
    }
  },
})

export const { addStudentHistory, editStudentHistory, setHistoryBulk, updateBulkHistory } = studentHistorySlice.actions
export const studentHistory = (state) => state.studentHistory
export default studentHistorySlice.reducer