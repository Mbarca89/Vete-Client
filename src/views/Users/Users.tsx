import "./Users.css"
import Nav from 'react-bootstrap/Nav';
import UserList from "../../components/UserList/UserList";
import CreateUser from "../../components/CreateUser/CreateUser";
import { useState } from "react";

const Users = () => {

    const [currentTab, setCurrentTab] = useState("users")

    return (
        <div className='container flex-grow-1 p-5 m-2 rounded custom'>
            <Nav variant="tabs" defaultActiveKey="users">
                <Nav.Item>
                    <Nav.Link eventKey="users" onClick={() => setCurrentTab("users")}>Usuarios</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="create" onClick={() => setCurrentTab("create")}>Crear usuario</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab == "users" ? <UserList /> : null}
                {currentTab == "create" ? <CreateUser /> : null}
            </div>
        </div>
    )
}

export default Users