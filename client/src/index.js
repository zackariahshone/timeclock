import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import store from './app/store'
import { Provider } from 'react-redux'
import { getData } from './globalUtils/requests';
import { addEmployeeBulk } from './app/EmployeeListSlice';
import { setHistoryBulk } from './app/StudentHistorySlice';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { PrimeReactProvider } from "primereact/api"
const root = ReactDOM.createRoot(document.getElementById('root'));

getData('/getallteachers', 'GET', addEmployeeBulk);
getData('/getallstudents', 'GET', addEmployeeBulk);
getData('/getstudenthistory', 'GET', setHistoryBulk);
root.render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Provider store={store}>
      <PrimeReactProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </PrimeReactProvider>
    </Provider>
  </LocalizationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
