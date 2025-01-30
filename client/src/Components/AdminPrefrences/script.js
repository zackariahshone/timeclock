import React, { Fragment, useEffect, useState } from "react";
import { prefs, Renderinputs } from "./helpers";
import { Button, Row, Col } from "react-bootstrap";
import { updateItem } from "../../globalUtils/requests";
import './style.css'
import { setPrefs,customPrefs } from "../../app/PreferencesSlice";
import { useSelector } from "react-redux";
export const AdminPrefrences = () => {
    const custPrefs = useSelector(customPrefs)
    const [prefUpdate, setPrefUpdate] = useState()
    const priorityPrefs = custPrefs ? custPrefs : prefs
    console.log(priorityPrefs);
    console.log(custPrefs);
    
    return (
        <Fragment>
            <h1>Admin Preferences</h1>
            {
                priorityPrefs.map((pref) => (
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
                        updateItem('/setpreferences',prefUpdate,setPrefs)
                    }}
                    className="savePrefsButton">Save Changes</Button>
            </Col>
        </Fragment>
    )
}
