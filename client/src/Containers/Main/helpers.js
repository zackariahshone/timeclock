import AddClients from "../../Components/AddClients/script.js";
import TimeClock from "../../Components/TimeClock/script.js";
import DashBoard from "../../Components/Dashboard/script.js";

export const DisplayMenuOptions = (menuOption) => {
    switch (menuOption) {
        case "DashBoard":
            return <DashBoard />
        case "Add Clients":
            return <AddClients />
        case "Time Clock":
            return <TimeClock />
        default:
            return <DashBoard />
    }
}

export const menuConfig = {
    "optionsSet1": [
        'DashBoard'
    ],
    "optionsSet2": [
        'Add Clients',
        'Time Clock'
    ]
}
