import { createSlice, current } from '@reduxjs/toolkit'

export const employeeListSlice = createSlice({
  name: 'employeelist',
  initialState: {
    employees: [
    ]
  },
  reducers: {
    addEmployeeBulk: (state, action) => {
      console.log(action);
      return {
        ...state,
        employees: [
          ...state.employees,
          ...action.payload.data,
        ]
      }
    },
    addEmployee: (state, action) => {
      console.log(action);
      return {
        ...state,
        employees: [
          ...state.employees,
          action.payload.data,
        ]
      }
    },
    removeEmployee: (state, action) => {
      console.log(action);
      const currentState = current(state).employees.filter((employee) => employee.id !== action.payload.data.id)
      console.log(currentState);

      return {
        ...state,
        employees: [
          ...currentState,
        ]
      }
    },
    timeClock: (state, action) => {
      console.log(action);
      console.log(current(state));
      
      const studentHistoryToUpDate = Object?.values(current(state)?.studentHistory)?.find(doc=>doc.id==action.payload.data.student.id)
      console.log(studentHistoryToUpDate);
      
      switch (action.payload.data.student.status) {
        case 'out':
          let outstamp = new Date().getTime();
          state.employees.forEach(student => {
            if (student.name == action.payload.data.student.name) {
              student.status = 'in';
              student.timeIn = action.payload.data.time
              student.timeOut = '';
            }
          });
          outstamp = null
          break
        case 'in':
          let instamp = new Date().getTime()
          state.employees.forEach(student => {
            if (student.name == action.payload.data.student.name) {
              student.status = 'out'
              student.timeOut = action.payload.data.time
            }
          })
          instamp = null;
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