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
      console.log('get hit first at all?');
        
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
  },
})

export const {
  addEmployee,
  removeEmployee,
  timeClock,
  incrementByAmount,
  addEmployeeBulk
} = employeeListSlice.actions
export const teachers = (state) => state.employeeList.employees.filter(emp => emp.type?.toLowerCase() == 'teacher');
export const students = (state) => state.employeeList.employees.filter(emp => emp.type == 'student');
export default employeeListSlice.reducer