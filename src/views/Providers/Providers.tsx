import Nav from 'react-bootstrap/Nav';
import ProviderList from '../../components/ProviderList/ProviderList';
import CreateProvider from '../../components/CreateProvider/CreateProvider';
import { useState } from "react";

const Providers = () => {

    const setTab = () => {
        setCurrentTab("providers")
    }

    const [currentTab, setCurrentTab] = useState("providers")

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="providers" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="providers" onClick={() => setCurrentTab("providers")}>Proveedores</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="create" onClick={() => setCurrentTab("create")}>Alta proveedor</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab == "providers" ? <ProviderList /> : null}
                {currentTab == "create" ? <CreateProvider updateList={setTab}/> : null}
            </div>
        </div>
    )
}

export default Providers