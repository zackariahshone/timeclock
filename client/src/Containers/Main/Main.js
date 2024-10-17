import React, { Fragment, useState, useDispatch, useSelector } from "react";
import { Card, Row, Modal, Button } from 'react-bootstrap'
import { DisplayMenuOptions, menuConfig } from "./helpers.js";
import { signin, signOut } from "../../app/pageDataSlice.js";
import { TeacherSignIn } from "../../Components/SignIn/script.js";
import './style.css'

export default (props) => {
    const [pageId, setPageId] = useState('DashBoard');
    const [signedIn, setSignedIn] = useState(false);
    const [signInName, setSignInName] = useState();
    return (
        <Fragment>
            <div id='mainConatiner'>
                <Row>
                    <div id="sideNav">
                        <h1>ERC</h1>
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
                            <>
                                <div
                                    className="modal show"
                                    style={{ display: 'block', position: 'initial' }}
                                >

                                    <Modal.Dialog>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Sign In</Modal.Title>
                                        </Modal.Header>

                                        <Modal.Body>
                                            <Card>
                                                <Card.Title>Teacher Sign In</Card.Title>
                                                <Card.Body>
                                                    {<TeacherSignIn setSignInName={setSignInName} signedIn={signedIn} setSignedIn={setSignedIn} />}
                                                </Card.Body>
                                            </Card>
                                        </Modal.Body>
                                    </Modal.Dialog>
                                </div>

                            </>

                            :
                            <Fragment>
                                <div className="signinName">Signed in as {signInName}</div>
                                {DisplayMenuOptions(pageId, setSignedIn)}
                            </Fragment>
                        }
                    </div>
                </Row>
            </div>
        </Fragment>
    )
}