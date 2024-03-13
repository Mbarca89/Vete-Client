import "./Users.css"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { userData } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { useState, useEffect } from "react";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Users = () => {

    const [users, setUsers] = useState<userData[]>([{
        userName: "",
        password: "",
        role: ""
    }]);

    useEffect(() => {
        const getUsers = async () => {
            const res = await axiosWithToken(`${SERVER_URL}/api/v1/users/getUsers`)
            if(res.data) {
                setUsers(res.data)
                console.log(res.data)
            }
        }
        getUsers()
    },[])

    return (
        <div className='container flex-grow-1 p-5 m-2 rounded custom'>
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="users" title="Ver Usuarios">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Nombre de usuario</th>
                                <th>Rol</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map( user => <tr key={String(user.userName)}>
                                <td>1</td>
                                <td>agregar nombre</td>
                                <td>agregar apellido</td>
                                <td>{user.userName}</td>
                                <td>{user.role}</td>
                            </tr>)}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="create" title="Alta usuario">
                    Tab content for Profile
                </Tab>
                <Tab eventKey="contact" title="Contact" disabled>
                    Tab content for Contact
                </Tab>
            </Tabs>
        </div>
    )
}

export default Users