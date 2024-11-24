import { configureStore } from '@reduxjs/toolkit'
import EmployeeListSlice from './EmployeeListSlice';
import CurrentUserSlice from './CurrentUserSlice';
import StudentHistorySlice from './StudentHistorySlice';
import ExportData from './ExportData';
export default configureStore({
  reducer: {
    currentUser: CurrentUserSlice,
    employeeList: EmployeeListSlice,
    studentHistory: StudentHistorySlice,
    exportData: ExportData
  },
})
