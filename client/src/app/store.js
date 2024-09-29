import { configureStore } from '@reduxjs/toolkit'
import EmployeeListSlice from './EmployeeListSlice';

export default configureStore({
  reducer: {
    employeeList: EmployeeListSlice,
  },
})
