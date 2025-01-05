import { createSlice, current } from '@reduxjs/toolkit'

export const employeeListSlice = createSlice({
  name: 'employeelist',
  initialState: {
    employees: [
    ]
  },
  reducers: {
    addEmployeeBulk: (state, action) => {
      return {
        ...state,
        employees: [
          ...state.employees,
          ...action.payload.data,
        ]
      }
    },
    addEmployee: (state, action) => {
      return {
        ...state,
        employees: [
          ...state.employees,
          action.payload.data,
        ]
      }
    },
    removeEmployee: (state, action) => {
      const currentState = current(state).employees.filter((employee) => employee.id !== action.payload.data.id)
      return {
        ...state,
        employees: [
          ...currentState,
        ]
      }
    },
    timeClock: (state, action) => {
      let student = state.employees.find(student => student.id === action.payload.student.id);
      switch (student.programs[action.payload.program]) {
        case 'out':
          student.programs[action.payload.program] = 'in';
          break
        case 'in':
          student.programs[action.payload.program] = 'out'
          break
        default:
          break
      }
    },
    activateStudent: (state, action) => {
      const id = action.payload.data[0].id
      let student = state.employees.find(student => student.id === id);
      student.active = action.payload.data[0].active
    },
    updateBulkTime: (state, action) => {
      
      const studentIDs = Object.keys(action.payload.data.reduxUpdate)
      console.log(action.payload.data);
      
      const status = action.payload.data.reduxUpdate
      console.log('status changes', status);
      
      const program = action.payload.data.program
      console.log(studentIDs);
      studentIDs.forEach((id) => {        
        let student = state.employees.find(student => student.id == id);
        console.log(student);
        if (status[id] == 'in') {
          console.log('checkin',student.programs);
          student.programs[program] = 'in'
        } else {
          console.log('checkout',student.programs);
          student.programs[program] = 'out'
        }
      })
    }
  },
})

export const {
  addEmployee,
  removeEmployee,
  timeClock,
  incrementByAmount,
  addEmployeeBulk,
  activateStudent,
  updateBulkTime
} = employeeListSlice.actions
export const teachers = (state) => state.employeeList.employees.filter(emp => emp.type?.toLowerCase() == 'teacher');
export const students = (state) => state.employeeList.employees.filter(emp => emp.type == 'student' && emp?.active !== false);
export const inactiveStudents = (state) => state.employeeList.employees.filter(emp => emp.type == 'student' && emp?.active === false);
export default employeeListSlice.reducer