import { createSlice } from '@reduxjs/toolkit'

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {
  },
  reducers: {
    signin: (state,action) => {      
      return {
        ...state,
        signedIn:action.payload.signedIn,
        userSignedIn:action.payload.teacherName,
        admin: action.payload.admin
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
export const { signin, signOut} = currentUserSlice.actions
export const userSignedIn =  (state) => state.currentUser.userSignedIn;
export const signedInStatus = (state)=>state.currentUser.signedIn
export const isAdmin = (state)=>state.currentUser.admin
export default currentUserSlice.reducer