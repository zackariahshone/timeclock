import React, { Fragment, useEffect, useState } from "react";
import { prefs, Renderinputs } from "./helpers";
import { Button, Row, Col } from "react-bootstrap";
import { updateItem } from "../../globalUtils/requests";
import './style.css'
import { setPrefs, customPrefs } from "../../app/PreferencesSlice";
import { useSelector } from "react-redux";
import { Calendar } from "primereact/calendar";
export const AdminPrefrences = () => {
    const custPrefs = useSelector(customPrefs)
    const [prefUpdate, setPrefUpdate] = useState()
    const priorityPrefs = custPrefs ? custPrefs : prefs

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
                    onClick={() => {
                        updateItem('/setpreferences', prefUpdate, setPrefs)
                    }}
                    className="savePrefsButton">Save Changes</Button>
            </Col>
        </Fragment>
    )
}


export const AdminPrefrences_V2 = () => {
    const [time, setTime] = useState();
    const [editingLocked, setEditingLocked] = useState(false);
    const [targetTime, setTargetTime] = useState([5, 'pm'])
    console.log(time);
    
    return (
        <>
            <div className="adminPrefs">
                <h1>Custom Preferences</h1>
                <div className="lineDivider">
                    <p className="adminPrefs"> Auto Clockout</p>
                    <div>
                    <input 
                        defaultValue={targetTime[0]}
                        type="number" />
                        <select>
                            <option>am</option>
                            <option>pm</option>
                        </select>
                    </div>
                </div>

                <div className="lineDivider">
                    <p className="adminPrefs"> Lock Editing : {`${editingLocked}`}</p>
                    <input
                        onClick={(e) => {
                            setEditingLocked(!editingLocked)
                        }}
                        type="checkbox"
                    />
                </div>
                <div className="lineDivider">

                    <p className="adminPrefs"> Target Time</p>
                    <input 
                        defaultValue={targetTime[0]}
                        type="number" />
                </div>
            </div>
            <Button
            variant="info"
            >Save Changes</Button>
        </>
    )
}