'use client';


import { Table,Button } from 'react-bootstrap';
import { useEffect, useState } from "react"


const tblColName = [
    "Full Name",
    "Date of Birth",
    "Email",
    "Created Date"
]

let tblColHeader =  tblColName.map(col => <th>{col}<i className="fa-solid fa-sort-down"></i></th>);

const listOptSearchByCol = tblColName.map(col => <option>{col}</option>)



export default function Home() {
    const [listUserTblRows, setListUserTblRows] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/user/getAllUser',{
        method: "get",
        })
        .then(response => response.json())
        .then(data => {
            setListUserTblRows(data.map(user => {
                return(
                <tr>
                    <td><input type='checkbox'/></td>
                    <td>{user.full_name}</td>
                    <td>{user.date_of_birth}</td>
                    <td>{user.email}</td>
                    <td>{user.created_at}</td>
                </tr>);
            }));
        })
    }, []);

    return (
        <>
            <div id='divContainer'>
                <h2>Users</h2>
                <div className='row my-3'>
                    <div className='col'>
                        <div className='row'>
                            <div className='col-auto'>
                                <Button variant='primary'>Create user</Button>
                            </div>
                            <div className='col-auto'>
                                <Button variant='danger' disabled>Delete user</Button>
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
                                <th><input type='checkbox'/></th>
                                {tblColHeader}
                            </tr>
                        </thead>
                        <tbody>
                            {listUserTblRows}
                        </tbody>
                    </Table>
                </div>
            </div>
            <Modal>
                
            </Modal>
        </>
    );
}
