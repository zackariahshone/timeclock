import React, { useState, useEffect } from 'react';
import { teachers, addEmployeeBulk } from '../../app/EmployeeListSlice';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { useSelector,useDispatch } from 'react-redux';
import { signin } from '../../app/CurrentUserSlice';
import { getData } from '../../globalUtils/requests';
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        &#x25bc;
    </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    },
);

export const TeacherSignIn = ({signedIn, setSignedIn,teacherList,setSignInName}) => {
    const teachersList = useSelector(teachers);
    const dispatch = useDispatch() 
    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                Select From Teacher List: 
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                {teachersList.map((teacher,key)=>(
                <Dropdown.Item 
                onClick={()=>{
                    setSignedIn(true);
                    setSignInName(teacher.name);
                    dispatch(signin({
                        signedIn:true,
                        teacherName:teacher.name
                    }))
                }}
                eventKey={key}>{teacher.name}</Dropdown.Item>
                    
                ))}
            </Dropdown.Menu>
        </Dropdown>
    )
}
