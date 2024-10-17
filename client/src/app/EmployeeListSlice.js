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
        type:'student',
        id:'1'
      },
      {
        name: 'Sally',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "Aspire",
        program:"Aspire",
        history:[],
        type:'teacher',
        id:'2'
      },
      {
        name: 'Jeff',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "richardson industries",
        program:"Richardson Industries",
        history:[],
        type:'teacher',
        id:'3'
      },
      {
        name: 'Theo',
        dateStarted: '10/10/24',
        status: "out",
        buildingName: "richardson industries",
        program:"Richardson Industries",
        history:[],
        type:'student',
        id:'4'
      },
    ]
  },
  reducers: {
    addEmployee: (state,action) => {
      console.log(action);
      return {
        ...state,
        employees: [
          ...state.employees,
          action.payload.data,
        ]
      }
    },
    timeClock: (state,action) => {
      console.log(action);
      switch(action.payload.student.status){
        case 'out':
          let outstamp = new Date().getTime();
          state.employees.forEach(student => {
            
            if(student.name == action.payload.student.name){
              student.status = 'in';
              student.timeIn = action.payload.time
              student.timeOut = '';
              student.history.push({[new Date().toDateString()]:{"in":outstamp}})
            }
          });
          outstamp = null
          break
        case 'in':
          let instamp = new Date().getTime() 
          state.employees.forEach(student => {
            if(student.name == action.payload.student.name){
              student.status = 'out' 
              student.timeOut = action.payload.time 
              const lastTimeHistory = student.history.length - 1
              student.history[lastTimeHistory][new Date().toDateString()].out = instamp;
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
export const teachers =  (state) => state.employeeList.employees.filter(emp=>emp.type.toLowerCase() == 'teacher');
export const students = (state)=> state.employeeList.employees.filter(emp=>emp.type == 'student');
export default employeeListSlice.reducer