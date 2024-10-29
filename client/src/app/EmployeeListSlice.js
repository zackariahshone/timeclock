import { createSlice, current } from '@reduxjs/toolkit'

export const employeeListSlice = createSlice({
  name: 'employeelist',
  initialState: {
    employees: [
      {
        name: 'Bob',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "Aspire",
        program: "Aspire",
        history: [],
        type: 'student',
        id: '1'
      },
      {
        name: 'Sally',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "Aspire",
        program: "Aspire",
        history: [],
        type: 'teacher',
        id: '2'
      },
      {
        name: 'Jeff',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "richardson industries",
        program: "Richardson Industries",
        history: [],
        type: 'teacher',
        id: '3'
      },
      {
        name: 'Theo',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "richardson industries",
        program: "Richardson Industries",
        history: [],
        type: 'student',
        id: '4'
      },
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
      switch (action.payload.data.student.status) {
        case 'out':
          let outstamp = new Date().getTime();
          state.employees.forEach(student => {
            if (student.name == action.payload.data.student.name) {
              student.status = 'in';
              student.timeIn = action.payload.data.time
              student.timeOut = '';
              student.history?.push({
                [new Date().toDateString()]: { "in": outstamp, setBy: action.payload.data.setBy }
              })
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
              const lastTimeHistory = student.history.length - 1
              student.history[lastTimeHistory][new Date().toDateString()].out = instamp;
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