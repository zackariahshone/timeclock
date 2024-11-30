import React, { Fragment, useEffect, useState } from "react";
import { prefs } from "./helpers";
import './style.css'
import { Button } from "react-bootstrap";

export const AdminPrefrences = () => {
    return (
        <Fragment>
            <h1>Admin Preferences</h1>
            {prefs.map(pref => (
                <div className="adminPrefs">
                    <label>
                        {pref.id}: <input defaultValue = {pref.default} name={pref.id} type={pref.type} />
                    </label>
                    <hr />
                </div>
            ))}
            <Button className="savePrefsButton">Save Changes</Button>
        </Fragment>
    )
}