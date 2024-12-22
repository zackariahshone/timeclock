import { createSlice } from '@reduxjs/toolkit'

export const dashboardSlice = createSlice({
  name: 'currentUser',
  initialState: {
  },
  reducers: {
    oneDaySnapshot: (state,action) => {    
        console.log(action)  
      return {
        ...state,
        ...action.payload.data,
      }
    },
    signOut: (state,action) => {      
      return {
        ...state,
        signedIn:false,
        userSignedIn:''
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { oneDaySnapshot} = dashboardSlice.actions
export const dashBoardSnapShot =  (state) => state.dashboard;
// export const signedInStatus = (state)=>state.currentUser.signedIn
// export const isAdmin = (state)=>state.currentUser.admin
export default dashboardSlice.reducer