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
        program:"Aspire",
        history:[],
        type:'employee',
        id:'1'
      },
      {
        name: 'Sally',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "Aspire",
        program:"Aspire",
        history:[],
        type:'contractor',
        id:'2'
      },
      {
        name: 'Jeff',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "richardson industries",
        program:"Richardson Industries",
        history:[],
        type:'employee',
        id:'3'
      },
      {
        name: 'Theo',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "richardson industries",
        program:"Richardson Industries",
        history:[],
        type:'contractor',
        id:'4'
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
          let outstamp = new Date().getTime();
          state.employees.forEach(employee => {
            if(employee.name == action.payload.employee.name){
               employee.status = 'in';
               employee.timeIn = action.payload.time
               employee.timeOut = '';
               employee.history.push({[new Date().toDateString()]:{"in":outstamp}})
            }
          });
          outstamp = null
          break
        case 'in':
          let instamp = new Date().getTime() 
          state.employees.forEach(employee => {
            if(employee.name == action.payload.employee.name){
              employee.status = 'out' 
              employee.timeOut = action.payload.time 
              const lastTimeHistory = employee.history.length - 1
              employee.history[lastTimeHistory][new Date().toDateString()].out = instamp;
            } 
          } 
        )
        instamp = null;
          break
        default:
          break
      }
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addEmployee, timeClock, incrementByAmount } = employeeListSlice.actions
export const contractors =  (state) => state.employeeList.employees.filter(emp=>emp.type.toLowerCase() == 'contractor');
export const employees = (state)=> state.employeeList.employees.filter(emp=>emp.type == 'employee');
export default employeeListSlice.reducer