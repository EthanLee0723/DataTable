'use client';

import { Table,Button,Modal } from 'react-bootstrap';
import { useEffect, useState } from "react"
// import bootstrap from 'bootstrap';


const tblColName = [
    "Full Name",
    "Date of Birth",
    "Email",
    "Created Date",
    "Edit"
]

const createUserInput = [
    {name: "full_name" ,text: "Full Name" },
    {name: "email" ,text: "Email" },
    {name: "password" ,text: "Password" },
    {name: "date_of_birth" ,text: "Date of Birth" },
]

let tblColHeader =  tblColName.map(col => <th>{col}{col === "Edit"?<i className="fa-solid fa-sort-down"></i>:null}</th>);

const listOptSearchByCol = tblColName.map(col => <option>{col}</option>)

const createUserInputElements = createUserInput.map(input => {
    let inputType = "text";
    if(input.name === "password")
    {
        inputType = "password";
    }
    else if(input.name === "date_of_birth")
    {
        inputType = "date";
    }
    return (<div className='mb-3'>
                <label>{input.text}:</label>
                <input name={input.name} type={inputType} className='form-control'/>
            </div>)
})


export default function Home() {
    const [listUserTblRows, setListUserTblRows] = useState();


    const [mdlEditUserInputVal, setMdlEditUserInputVal] = useState({
        id:"",
        full_name:"",
        email:"",
        date_of_birth:""
    });

    const [isCreateUserMdlShow, setCreateUserMdlShowState] = useState(false);

    const [delUserMdlShowStatus, setDelUserMdlShowStatus] = useState(false);

    const [editUserMdlShowStatus,setEditUserMdlShowStatus] = useState(false);

    const [isLoading, setLoading] = useState("none");

    const [idBtnDisabled, setDisabledStatus] = useState(true);

    const showLoading = () => setLoading("flex");
    const stopLoading = () => setLoading("none");

    const enableDelBtn = () => setDisabledStatus(false);
    const disableDelBtn = () => setDisabledStatus(true);

    const closeCreateUserMdl = () => setCreateUserMdlShowState(false);
    const showCreateUserMdl = () => setCreateUserMdlShowState(true);

    const showDelUserMdl = () => setDelUserMdlShowStatus(true);
    const closeDelUserMdl = () => setDelUserMdlShowStatus(false);

    let editUserInputElements = createUserInput.map((input,ind) => {
        let inputType = "text";
        if(input.name === "password")
        {
            inputType = "password";
        }
        else if(input.name === "date_of_birth")
        {
            inputType = "date";
        }
        return (<div className='mb-3'>
                    <label>{input.text}:</label>
                    <input name={input.name} type={inputType} className='form-control' onChange={inEditUserOnChange} defaultValue={mdlEditUserInputVal[input.name]}/>
                </div>)
    })

    editUserInputElements = editUserInputElements.filter((element)=>{
        return element.props.children[1].props.name !== "password"
    })

    const showEditUserMdl = (ev) => {
        setMdlEditUserInputVal(JSON.parse(ev.target.getAttribute("data-user-data")))
        setEditUserMdlShowStatus(true)
    };
    const closeEditUserMdl = () => setEditUserMdlShowStatus(false);

    function createNewUser(){
        showLoading();
        let newUser = {};
        document.querySelectorAll(".modal-body input").forEach((val,ind)=>{
            newUser[val.getAttribute("name")] = val.value;
        })

        fetch('http://localhost:3000/user/createUser',{
            method:"post",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(newUser)
        })
        .then(response => response)
        .then(data => {
            closeCreateUserMdl();
            stopLoading();
            getUserRecords();
            disableAllCbxSelection();
        })
    }

    function delSelectedUser()
    {
        showLoading();
        let listUserIdToDel = [];
        document.querySelectorAll("#divTblContainer tbody input[type='checkbox']:checked").forEach((val,ind)=>{
            listUserIdToDel.push(val.getAttribute("data-user-id"))
        })

        fetch('http://localhost:3000/user/delUserById',{
            method:"post",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(listUserIdToDel)
        })
        .then(response => response)
        .then(data => {
            closeDelUserMdl();
            stopLoading();
            getUserRecords();
            disableAllCbxSelection();
        })
    }

    function updatedUserBydId()
    {
        showLoading();
        fetch('http://localhost:3000/user/updateUserById',{
            method:"post",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(mdlEditUserInputVal)
        })
        .then(response => response)
        .then(data => {
            closeEditUserMdl();
            stopLoading();
            getUserRecords();
            disableAllCbxSelection();
        })
    }

    function inSelectAllTooggle(ev)
    {
        document.querySelectorAll("#divTblContainer tbody input[type='checkbox']").forEach((val)=>{
            val.checked = ev.target.checked?true:false;
            val.checked?enableDelBtn():disableDelBtn();
        })
    }

    function disableAllCbxSelection()
    {
        document.querySelectorAll("#divTblContainer tbody input[type='checkbox']").forEach((val)=>{
            val.checked = false;
            disableDelBtn();
        })
    }
    

    function inTblDataRowsOnChange()
    {
        if(document.querySelectorAll("#divTblContainer tbody input[type='checkbox']:checked").length)
        {
            enableDelBtn();
        }
        else
        {
            disableDelBtn();
        }
    }

    function getUserRecords()
    {
        showLoading();
        fetch('http://localhost:3000/user/getUserByFilter')
        .then(response => response.json())
        .then(data => {
            stopLoading();
            if(data)
            {
                setListUserTblRows(data.map((user) => {
                    let splitDateOfBirth = user.date_of_birth.split("-");
                    splitDateOfBirth.reverse();
                    splitDateOfBirth =  splitDateOfBirth.map(dob =>{
                        if(dob.length === 1)
                        {
                            return "0"+dob;
                        }
                        return dob;
                    })
                    const date_of_birth = `${splitDateOfBirth[0]}-${splitDateOfBirth[1]}-${splitDateOfBirth[2]}`
                    const editUserData = {
                        id: user.id,
                        full_name: user.full_name,
                        email: user.email,
                        date_of_birth: date_of_birth
                    }
                    return(
                    <tr>
                        <td><input data-user-id={user.id} onChange={inTblDataRowsOnChange} type='checkbox'/></td>
                        <td data-col-name="full_name">{user.full_name}</td>
                        <td data-col-name="date_of_birth">{user.date_of_birth}</td>
                        <td data-col-name="email">{user.email}</td>
                        <td data-col-name="created_at">{user.created_at}</td>
                        <td><i className="fa-solid fa-pen-to-square" data-user-id={user.id} data-user-data={JSON.stringify(editUserData)} onClick={showEditUserMdl}></i></td>
                    </tr>);
                }));
            }
        })
    }

    function inEditUserOnChange(ev)
    {
        let newInputVal = mdlEditUserInputVal;
        newInputVal[ev.target.getAttribute("name")] = ev.target.value;
        setMdlEditUserInputVal(newInputVal);
    }

    useEffect(() => {
        getUserRecords();
    }, []);

    return (
        <>
            <div id="loadingContainer" style={{display:isLoading}}>
                <div className='loadingScreen'>
                    <div className='loadingWheel'></div>
                    <div className='loadingText'></div>
                </div>
            </div>

            
            <div id='divContainer'>
                <h2>Users</h2>
                <div className='row my-3'>
                    <div className='col'>
                        <div className='row'>
                            <div className='col-auto'>
                                <Button variant='primary' onClick={showCreateUserMdl}>Create user</Button>
                            </div>
                            <div className='col-auto'>
                                <Button variant='danger' onClick={showDelUserMdl} disabled={idBtnDisabled}>Delete user</Button>
                            </div>
                        </div>
                    </div>


                    <div className='col-auto'>
                        <div className='row'>
                            <div className='col-auto'>
                            <select className='form-control'>
                                <option>All columns</option>
                                {listOptSearchByCol}
                            </select>
                            </div>
                            <div className='col-auto'>
                                <input placeholder='Search' className='form-control'/>
                            </div>
                            <div className='col-auto'>
                                <Button className="fa-solid fa-filter h-100" variant='outline-primary'></Button>
                            </div>
                            <div className='col-auto'>
                                <Button className="fa-solid fa-magnifying-glass h-100" variant='outline-primary'></Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="divTblContainer" className='table-responsive'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th><input onChange={inSelectAllTooggle} type='checkbox'/></th>
                                {tblColHeader}
                            </tr>
                        </thead>
                        <tbody>
                            {listUserTblRows}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal id="mdlCreateUser" centered show={isCreateUserMdlShow} onHide={closeCreateUserMdl}>
                <Modal.Header closeButton>
                    <Modal.Title>Create user</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        {createUserInputElements}
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeCreateUserMdl}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={createNewUser}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal id="mdlDelUser" centered show={delUserMdlShowStatus} onHide={closeDelUserMdl}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete user</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        Are you sure you wish to delete selected user?
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDelUserMdl}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={delSelectedUser}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal id="mdlEditUser" centered show={editUserMdlShowStatus} onHide={closeEditUserMdl}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editUserInputElements}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditUserMdl}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updatedUserBydId}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

