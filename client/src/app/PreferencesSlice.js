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
    }
  }
})

// Action creators are generated for each case reducer function
export const { setPrefs} = customPrefSlice.actions
export const customPrefs =  (state) => state.customprefs;
export default customPrefSlice.reducer