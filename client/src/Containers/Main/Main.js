import React, { Fragment, useState } from "react";
import { Col, Container, Row } from 'react-bootstrap'
import { DisplayMenuOptions,menuConfig } from "./helpers.js";
import './style.css'

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
                            <Fragment>

                            {menuConfig[menuKey].map((menuItem) => (
                                <p
                                    className="menuItem"
                                    onClick={() => { setPageId(menuItem) }}
                                >{menuItem}</p>
                            ))}
                            ___________________________
                            </Fragment>
                            
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