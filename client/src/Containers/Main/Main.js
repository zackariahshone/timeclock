import React, { Fragment, useState } from "react";
import { Col, Container, Row } from 'react-bootstrap'
import { DisplayMenuOptions,menuConfig } from "./helpers.js";
import './style.css'

export default (props) => {
    const [pageId, setPageId] = useState('DashBoard');
    return (
        <Fragment>
            <div id='mainConatiner'>
                <Row>
                    <div id="sideNav">
                        <h1>ERC</h1>
                        {/* list of components */}
                        {Object.keys(menuConfig).map(menuKey => (
                            <Fragment>

                            {menuConfig[menuKey].map((menuItem) => (
                                <p
                                    className= {`menuItem ${menuItem == pageId ? 'selected': ''} `}
                                    onClick={() => { setPageId(menuItem) }}
                                >{menuItem}</p>
                            ))}
                            ___________________________
                            </Fragment>
                            
                        ))}
                    </div>
                    <div id="main">
                        {DisplayMenuOptions(pageId)}
                    </div>
                </Row>
            </div>
        </Fragment>
    )
}