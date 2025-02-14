import AddClients from "../../Components/AddClients/script.js";
import TimeClock from "../../Components/TimeClock/script.js";
import DashBoard from "../../Components/Dashboard/script.js";
import { Billing } from "../../Components/Billing/script.js";
// import { AdminPrefrences } from "../../Components/AdminPrefrences/script.js";

import { AdminPrefrences_V2 } from "../../Components/AdminPrefrences/script.js"

export const DisplayMenuOptions = (menuOption) => {
    switch (menuOption) {
        case "DashBoard":
            return <DashBoard />
        case "Students":
            return <AddClients type="student" />
        case "Teachers":
            return <AddClients type="teacher"/>
        case "Time Clock":
            return <TimeClock />
        case "Billing":
            return <Billing/>
        case "Admin Preferences":
            return <AdminPrefrences_V2/>
        default:
            return <DashBoard />
    }
}

export const menuConfig = {
    "optionsSet1": [
        'DashBoard',
        'Billing'
    ],
    "optionsSet2": [
        'Students',
        'Teachers',
        'Time Clock'
    ],
    "admin":[
        'Admin Preferences'
    ]

}
