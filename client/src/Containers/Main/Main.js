import React, { Fragment, useState, useDispatch, useSelector } from "react";
import { Card, Row } from 'react-bootstrap'
import { DisplayMenuOptions, menuConfig } from "./helpers.js";
import { signin, signOut } from "../../app/pageDataSlice.js";
import { TeacherSignIn } from "../../Components/SignIn/script.js";
import './style.css'

export default (props) => {
    const [pageId, setPageId] = useState('DashBoard');
    const [signedIn, setSignedIn] = useState(false);
    const [signInName ,setSignInName] = useState();
    // const dispatch = useDispatch;
    return (
        <Fragment>
            <div id='mainConatiner'>
                <Row>
                    <div id="sideNav">
                        <h1>ERC</h1>
                        {signInName}
                        {/* list of components */}
                        {Object.keys(menuConfig).map(menuKey => (
                            <Fragment>

                                {menuConfig[menuKey].map((menuItem) => (
                                    <p
                                        className={`menuItem ${menuItem == pageId ? 'selected' : ''} `}
                                        onClick={() => { setPageId(menuItem) }}
                                    >{menuItem}</p>
                                ))}
                                ___________________________
                            </Fragment>

                        ))}
                    </div>
                    <div id="main">
                    {!signedIn ?
                        <Card>
                            <Card.Title>SignIn</Card.Title>
                            <Card.Body>
                                {<TeacherSignIn setSignInName={setSignInName} signedIn = {signedIn} setSignedIn = {setSignedIn}/>}
                            </Card.Body>
                        </Card>:
                        <Fragment>
                            {DisplayMenuOptions(pageId,setSignedIn)}
                        </Fragment>
                    }
                    </div>
                </Row>
            </div>
        </Fragment>
    )
}