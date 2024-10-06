import { configureStore } from '@reduxjs/toolkit'
import EmployeeListSlice from './EmployeeListSlice';
import pageData from './pageDataSlice';
export default configureStore({
  reducer: {
    employeeList: EmployeeListSlice,
    pageData
  },
})
