import { createSlice, current } from '@reduxjs/toolkit'

export const employeeListSlice = createSlice({
  name: 'employeelist',
  initialState: {
    employees: [
      {
        name: 'Bob',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "house1"
      },
      {
        name: 'Sally',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "house2"
      },
      {
        name: 'Jeff',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "house1"
      },
      {
        name: 'Theo',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "house2"
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
            }
          });

          
          /**
           * reomve timeOut if populated
           */
          break
        case 'in':
          state.employees.forEach(employee => employee.name == action.payload.employee.name ? employee.status = 'out' : '' );
          state.employees.forEach(employee => employee.name == action.payload.employee.name ? employee.timeOut = action.payload.time : '' );
          /**
           * set time worked
           */
          
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