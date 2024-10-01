import { createSlice, current } from '@reduxjs/toolkit'

export const employeeListSlice = createSlice({
  name: 'employeelist',
  initialState: {
    employees: [
      {
        name: 'Bob',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "house1",
        history:[]
      },
      {
        name: 'Sally',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "house2",
        history:[]
      },
      {
        name: 'Jeff',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "house1",
        history:[]
      },
      {
        name: 'Theo',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "house2",
        history:[]
      },
    ]
  },
  reducers: {
    addEmployee: (state,action) => {
      return {
        ...state,
        employees: [
          ...state.employees,
          action.payload,
        ]
      }
    },
    timeClock: (state,action) => {
      switch(action.payload.employee.status){
        case 'out':
          state.employees.forEach(employee => {
            if(employee.name == action.payload.employee.name){
               employee.status = 'in';
               employee.timeIn = action.payload.time
               employee.timeOut = '';
               employee.history.push(
               { [new Date().toDateString()]:{"in":action.payload.timeMilli}}
              )
               
            }
          });
          break
        case 'in':
          state.employees.forEach(employee => {
            if(employee.name == action.payload.employee.name){
              employee.status = 'out' 
              employee.timeOut = action.payload.time 
              const lastTimeHistory = employee.history.length - 1
              employee.history[lastTimeHistory][new Date().toDateString()].in =! undefined ?  employee.history[lastTimeHistory][new Date().toDateString()].out = action.payload.timeMilli:'';
            } 
          } 
        )
          break
        default:
          break
      }
      // return {
      //   ...state,
      //   employees: [
      //     ...state.employees,
      //     action.payload,
      //   ]
      // }
      
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addEmployee, timeClock, incrementByAmount } = employeeListSlice.actions

export default employeeListSlice.reducer