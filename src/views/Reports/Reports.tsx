import Nav from 'react-bootstrap/Nav';
import { useState } from "react";
import SalesList from '../../components/SalesList/SalesList';
import OrdersList from '../../components/OrdersList/OrdersList';
import MonthlyReport from '../../components/MensualReport/MonthlyReport';
import Payments from '../../components/PaymentsList/PaymentsList';

const Reports = () => {

    const setTab = () => {
        setCurrentTab("reports")
    }

    const [currentTab, setCurrentTab] = useState("reports")

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="sales" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="reports" onClick={() => setCurrentTab("reports")}>Reporte mensual</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="sales" onClick={() => setCurrentTab("sales")}>Ventas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="orders" onClick={() => setCurrentTab("orders")}>Compras</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="payments" onClick={() => setCurrentTab("payments")}>Pagos</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab == "reports" ? <MonthlyReport /> : null}
                {currentTab == "sales" ? <SalesList /> : null}
                {currentTab == "orders" ? <OrdersList /> : null}
                {currentTab == "payments" ? <Payments /> : null}
            </div>
        </div>
    )
}

export default Reports