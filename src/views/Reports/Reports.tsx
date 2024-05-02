import Nav from 'react-bootstrap/Nav';
import { useState } from "react";
import SalesList from '../../components/SaleReports/SalesList';
import Graphs from '../../components/Graphs/Graphs';

const Reports = () => {

    const setTab = () => {
        setCurrentTab("sales")
    }

    const [currentTab, setCurrentTab] = useState("sales")

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="sales" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="sales" onClick={() => setCurrentTab("sales")}>Ventas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="orders" onClick={() => setCurrentTab("orders")}>Compras</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="stock" onClick={() => setCurrentTab("stock")}>Stock</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="graphs" onClick={() => setCurrentTab("graphs")}>Gráficos</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab == "sales" ? <SalesList /> : null}
                {currentTab == "graphs" ? <Graphs /> : null}
            </div>
        </div>
    )
}

export default Reports