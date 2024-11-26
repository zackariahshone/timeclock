import { createSlice } from '@reduxjs/toolkit'

export const exportDataSlice = createSlice({
  name: 'currentUser',
  initialState: {
   
  },
  reducers: {
    setExportData: (state,action) => {        
      return {
        ...state,
        data:action.payload.data,
      }
    },
    clearExportData: (state,action) => {      
      return {
        ...state,
        data:[],
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setExportData, clearExportData} = exportDataSlice.actions
export const exportData =  (state) => state.exportData.data;
export default exportDataSlice.reducer