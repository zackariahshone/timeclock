import { configureStore } from '@reduxjs/toolkit'
import EmployeeListSlice from './EmployeeListSlice';
import CurrentUserSlice from './CurrentUserSlice';
export default configureStore({
  reducer: {
    currentUser: CurrentUserSlice,
    employeeList: EmployeeListSlice,
  },
})
