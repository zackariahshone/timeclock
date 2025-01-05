import { Fragment, useState } from "react";

export const prefs =[
    {
        id: 'Auto Clock Out',
        type: 'number',
        default: 3,
        key: 'time',
        value:0,
        options: [
            {
                type: 'dropdown',
                id: 'timeOfDay',
                options: ['AM', 'PM'],
                value:'PM',
                key: 'timeOfDay'
            }
        ]
    },
    {
        id: 'Target Hours',
        type: 'number',
        default: 5,
        key: 'time',
        value:0,
    },
    {
        id: 'Lock Editing',
        type: 'checkbox',
        default: false
    }
]

export const Checkbox = ({ pref, setPrefUpdate, prefUpdate }) => {
    return (
        <label>
            {pref.id} : <input
                onChange={(e) => {
                    setPrefUpdate({...prefUpdate,[pref.id]:{value:e.target.checked}})
                }}
                defaultValue={pref.default}
                name={pref.id}
                type={pref.type} />
        </label>
    )
}
export const InputBox = ({ pref, setPrefUpdate, prefUpdate, id, isOption }) => {
    return (
        <Fragment>
            <label>
                {pref.id} : <input
                    onChange={(e) => {
                        setPrefUpdate({ ...prefUpdate, [pref.id]: { value: e.target.value } })
                    }}
                    defaultValue={pref.default}
                    name={pref.id}
                    type={pref.type} />
            </label>
            {pref.options ?
                pref.options?.map((opt) => <Renderinputs prefUpdate={prefUpdate} setPrefUpdate={setPrefUpdate} pref={opt} id={pref.id} isOption={true} />)

                : ''}
        </Fragment>

    )
}
export const RadioButton = () => {

}
export const DropDown = ({ pref, setPrefUpdate, prefUpdate, id, isOption }) => {
    const [value, setValue] = useState('AM')
    return (
        <select value={value} onChange={(e) => {
            setValue(e.target.value)
            !isOption ?
                setPrefUpdate({ ...prefUpdate, [pref.id]: { ...prefUpdate[pref.id], 'value': e.target.value } }) :
                setPrefUpdate({ ...prefUpdate, [id]: {...prefUpdate[id], 'options':[{ [pref.id]: e.target.value }]}})
        }}>
            {pref.options.map((value) => (
                <option value={value}>{value}</option>
            ))}
        </select>
    )
}

export const Renderinputs = ({ pref, setPrefUpdate, prefUpdate, id, isOption }) => {
    switch (pref.type) {
        case 'radio':
            return <RadioButton prefUpdate={prefUpdate} setPrefUpdate={setPrefUpdate} pref={pref} />
        case 'text':
        case 'number':
            return <InputBox prefUpdate={prefUpdate} setPrefUpdate={setPrefUpdate} pref={pref} id={id} isOption={isOption} />
        case 'checkbox':
            return <Checkbox prefUpdate={prefUpdate} setPrefUpdate={setPrefUpdate} pref={pref} />
        case 'dropdown':
            return <DropDown prefUpdate={prefUpdate} setPrefUpdate={setPrefUpdate} pref={pref} id={id} isOption={isOption} />
        default:
            return;
    }
}