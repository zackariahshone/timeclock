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
    activateStudent:(state,action) =>{
      const id = action.payload.data[0].id
      let student = state.employees.find(student => student.id === id);
      student.active = action.payload.data[0].active
    },
    updateBulkTime:(state, action) =>{
    //   {
    //     "program": "Aspire",
    //     "inTimeStamp": {
    //         "status": "in",
    //         "timeMilli": 1736025908058,
    //         "time": "15:25",
    //         "setBy": "new guy admin"
    //     },
    //     "reduxUpdate": [
    //         "erc-123456",
    //         "erc-24542345"
    //     ]
    // }
    console.log(current(state));
    
    const studentIDs = action.payload.data.reduxUpdate
    const program = action.payload.data.program
    studentIDs.forEach((id)=>{
        let student = state.employees.find(student => student.id === id);
        student.programs[program] = 'in'
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