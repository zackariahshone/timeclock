import React, { Fragment, useEffect, useState } from "react";
import { prefs, Renderinputs } from "./helpers";
import { Button, Row, Col } from "react-bootstrap";
import { updateItem } from "../../globalUtils/requests";
import './style.css'

export const AdminPrefrences = () => {
    const [prefUpdate, setPrefUpdate] = useState()
    return (
        <Fragment>
            <h1>Admin Preferences</h1>
            {
                prefs.map((pref) => (
                    <Row>
                        <Col>
                            <div className="adminPrefs">
                                <Renderinputs prefUpdate={prefUpdate} setPrefUpdate={setPrefUpdate} pref={pref} />
                            </div>
                        </Col>
                        <hr />
                    </Row>
                ))
            }
            <Col xs={{ span: 10, offset: 4 }}>
                <Button 
                    onClick={()=>{
                        updateItem('/setpreferences',prefUpdate)
                    }}
                    className="savePrefsButton">Save Changes</Button>
            </Col>
        </Fragment>
    )
}
