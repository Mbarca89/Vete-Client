import Nav from 'react-bootstrap/Nav';
import { useState } from "react";

const Products = () => {

    const [currentTab, setCurrentTab] = useState("users")

    return (
        <div className='container flex-grow-1 p-5 m-2 rounded custom'>
            <Nav variant="tabs" defaultActiveKey="users">
                <Nav.Item>
                    <Nav.Link eventKey="products" onClick={() => setCurrentTab("users")}>Productos</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="create" onClick={() => setCurrentTab("create")}>Alta producto</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {/* {currentTab == "users" ? <UserList /> : null}
                {currentTab == "create" ? <CreateUser /> : null} */}
            </div>
        </div>
    )
}

export default Products