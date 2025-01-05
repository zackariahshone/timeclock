import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { Card, Row, Modal, Button } from 'react-bootstrap'
import { DisplayMenuOptions, menuConfig } from "./helpers.js";
import { signOut, userSignedIn,signedInStatus, isAdmin } from "../../app/CurrentUserSlice.js";
import { TeacherSignIn } from "../../Components/SignIn/script.js";
import logo from '../../img/web-app-manifest-192x192.png'
import './style.css'

export default () => {
    const [pageId, setPageId] = useState('DashBoard');
    const [signedIn, setSignedIn] = useState(false);
    const loggedInName = useSelector(userSignedIn)
    const loggedInStatus = useSelector(signedInStatus);
    const admin = useSelector(isAdmin);
    const dispatch = useDispatch();

    return (
        <Fragment>
            <div id='mainConatiner'>
                <Row className = 'mainRow'>
                    <div id="sideNav">
                        <img id='erclogo' src={logo} alt="ERC logo" />
                        {Object.keys(menuConfig).map(menuKey => {
                            if(menuKey == 'admin' && !admin){
                               return(<></>)
                            } else{
                                return(
                                    <Fragment>
                                {menuConfig[menuKey].map((menuItem) => (
                                    <h6
                                    className={`menuItem ${menuItem == pageId ? 'selected' : ''} `}
                                    onClick={() => { setPageId(menuItem) }}
                                    >{menuItem}</h6>
                                ))}
                                <div className="sideNavMenu"></div>
                            </Fragment>
                            )
                        }
                        })}
                    </div>
                    <div id="main">
                        {!loggedInStatus ?
                            <>
                                <div
                                    className="modal show"
                                    style={{ display: 'block', position: 'initial' }}
                                >

                                    <Modal.Dialog>
                                        <Modal.Header>
                                            <Modal.Title>Sign In</Modal.Title>
                                        </Modal.Header>

                                        <Modal.Body>
                                            <Card>
                                                <Card.Title>Teacher Sign In</Card.Title>
                                                <Card.Body>
                                                    {<TeacherSignIn  signedIn={signedIn} />}
                                                </Card.Body>
                                            </Card>
                                        </Modal.Body>
                                    </Modal.Dialog>
                                </div>

                            </>

                            :
                            <Fragment>
                                <div className="signinName">Signed in as {loggedInName}
                                <Button
                                    onClick={()=>{dispatch(signOut())}}
                                 className="switchUserButton"> Switch User</Button></div>
                                {DisplayMenuOptions(pageId, setSignedIn)}
                            </Fragment>
                        }
                    </div>
                </Row>
            </div>
        </Fragment>
    )
}