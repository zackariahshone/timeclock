import { configureStore } from '@reduxjs/toolkit'
import EmployeeListSlice from './EmployeeListSlice';
import CurrentUserSlice from './CurrentUserSlice';
import StudentHistorySlice from './StudentHistorySlice';
import ExportData from './ExportData';
import DashboardSlice from './DashboardSlice';
export default configureStore({
  reducer: {
    currentUser: CurrentUserSlice,
    employeeList: EmployeeListSlice,
    studentHistory: StudentHistorySlice,
    exportData: ExportData,
    dashboard: DashboardSlice
  },
})
