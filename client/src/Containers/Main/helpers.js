import AddClients from "../../Components/AddClients/script.js";
import TimeClock from "../../Components/TimeClock/script.js";
import DashBoard from "../../Components/Dashboard/script.js";

export const DisplayMenuOptions = (menuOption) => {
    switch (menuOption) {
        case "DashBoard":
            return <DashBoard />
        case "Employees":
            return <AddClients type="employee" />
        case "Contractors":
            return <AddClients type="contractor"/>
        case "Time Clock":
            return <TimeClock />
        default:
            return <DashBoard />
    }
}

export const menuConfig = {
    "optionsSet1": [
        'DashBoard',
        'Fees And Invoicing'
    ],
    "optionsSet2": [
        'Employees',
        'Contractors',
        'Time Clock'
    ]
}
