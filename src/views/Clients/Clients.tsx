
import Nav from 'react-bootstrap/Nav';
import ClientList from '../../components/ClientList/ClientList';
import CreateClient from '../../components/CreateClient/CreateClient';
import { useState } from "react";

const Clients = () => {

    const setTab = () => {
        setCurrentTab("clients")
    }

    const [currentTab, setCurrentTab] = useState("clients")
    const [modal, setModal] = useState<string>("")

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="clients" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="clients" onClick={() => setCurrentTab("clients")}>Clientes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="create" onClick={() => setCurrentTab("create")}>Crear cliente</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab == "clients" ? <ClientList /> : null}
                {currentTab == "create" ? <CreateClient updateList={setTab}/> : null}
            </div>
        </div>
    )
}

export default Clients