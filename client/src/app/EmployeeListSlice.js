import { createSlice, current } from '@reduxjs/toolkit'

export const employeeListSlice = createSlice({
  name: 'employeelist',
  initialState: {
    employees: [
    ]
  },
  reducers: {
    addEmployeeBulk: (state, action) => {
      // console.log(action);
      return {
        ...state,
        employees: [
          ...state.employees,
          ...action.payload.data,
        ]
      }
    },
    addEmployee: (state, action) => {
      // console.log(action);
      return {
        ...state,
        employees: [
          ...state.employees,
          action.payload.data,
        ]
      }
    },
    removeEmployee: (state, action) => {
      // console.log(action);
      const currentState = current(state).employees.filter((employee) => employee.id !== action.payload.data.id)
      // console.log(currentState);

      return {
        ...state,
        employees: [
          ...currentState,
        ]
      }
    },
    timeClock: (state, action) => {        
      let student = state.employees.find(student => student.id === action.payload.student.id);
      switch (student.status) {
        case 'out':
              student.status = 'in';
              student.timeIn = new Date().getTime;
              student.timeOut = '';
          break
        case 'in':
              student.status = 'out'
              student.timeOut = new Date().getTime;
          break
        default:
          break
      }
    },
  },
})

// Action creators are generated for each case reducer function
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