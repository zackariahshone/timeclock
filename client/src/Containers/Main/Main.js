import React, { Fragment, useState } from "react";
import { Col, Container, Row } from 'react-bootstrap'
import './style.css'
import AddClients from "../../Components/AddClients/script.js";
import TimeClock from "../../Components/TimeClock/script.js";
const menuConfig = { "optionsSet1": ['Add Clients', 'Time Clock'] }


const DisplayMenuOptions = (menuOption) => {
    switch (menuOption) {
        case "Add Clients":
            return <AddClients />
            break;
        case "Time Clock":
            return <TimeClock />
            break;
        default:
            break;
    }
}

export default (props) => {
    const [pageId, setPageId] = useState();
    return (
        <Fragment>
            <div id='mainConatiner'>
                <Row>
                    <div id="sideNav">
                        <h1>side nav</h1>
                        {/* list of components */}
                        {Object.keys(menuConfig).map(menuKey => (
                            menuConfig[menuKey].map((menuItem) => (
                                <li
                                    onClick={() => { setPageId(menuItem) }}
                                >{menuItem}</li>
                            ))
                        ))}

                    </div>
                    <div id="main">

                        <h1>Main</h1>

                        {DisplayMenuOptions(pageId)}
                    </div>
                </Row>
            </div>
        </Fragment>
    )
}