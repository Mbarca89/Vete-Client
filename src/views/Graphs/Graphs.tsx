import Nav from 'react-bootstrap/Nav';
import { useState } from "react";
import DailySalesGraph from '../../components/DailySalesGraph/DailySalesGraph'
import CategorySalesGraph from '../../components/CategorySalesGraph/CategorySalesGraph';
import MonthlyGraph from '../../components/MonthlyGraph/MonthlyGraph';

const Graphs = () => {
    const setTab = () => {
        setCurrentTab("daily")
    }

    const [currentTab, setCurrentTab] = useState("daily")

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="sales" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="daily" onClick={() => setCurrentTab("daily")}>Gráfico por día</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="categories" onClick={() => setCurrentTab("categories")}>Gráfico por categorías</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="monthly" onClick={() => setCurrentTab("monthly")}>Gráfico mensual</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3 h-100 w-100">
                {currentTab == "daily" ? <DailySalesGraph /> : null}
                {currentTab == "categories" ? <CategorySalesGraph /> : null}
                {currentTab == "monthly" ? <MonthlyGraph /> : null}
            </div>
        </div>
    )
}

export default Graphs