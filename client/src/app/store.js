import { configureStore } from '@reduxjs/toolkit'
import EmployeeListSlice from './EmployeeListSlice';
import CurrentUserSlice from './CurrentUserSlice';
import StudentHistorySlice from './StudentHistorySlice';
export default configureStore({
  reducer: {
    currentUser: CurrentUserSlice,
    employeeList: EmployeeListSlice,
    studentHistory: StudentHistorySlice
  },
})
