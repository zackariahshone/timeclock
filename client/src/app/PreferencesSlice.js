import { createSlice } from '@reduxjs/toolkit'

export const customPrefSlice = createSlice({
  name: 'customPrefs',
  initialState: {
   
  },
  reducers: {
    setPrefs: (state,action) =>{
        return [
            ...action.payload.data.prefs
        ]
    },
    setPrefs_V2:(state,action) =>{
      return [
        ...action.payload.data.prefs
      ]
    }
  }
})

// Action creators are generated for each case reducer function
export const { setPrefs,setPrefs_V2 } = customPrefSlice.actions;
export const customPrefs =  (state) => state.customprefs;
export const cutsomPrefs_V2 = (state) => state.cutsomprefs_V2;
export default customPrefSlice.reducer