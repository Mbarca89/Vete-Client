import { useState } from "react"
import { Nav } from "react-bootstrap"
import CreateBill from "../../components/CreateBill/CreateBill"
import BillsList from "../../components/BillsList/BillsList"
import { saleProduct } from "../../types"
import { useLocation } from "react-router-dom"
import queryString from 'query-string';

const Billing = () => {

    const setTab = () => {
        setCurrentTab("bills")
    }

    const location = useLocation();
    const { sale, saleId } = queryString.parse(location.search);

    const [currentTab, setCurrentTab] = useState(sale ? "create" : "bills")
    
    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="bills" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="bills" onClick={() => setCurrentTab("bills")}>Facturas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="create" onClick={() => setCurrentTab("create")}>Generar Factura</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab == "bills" ? <BillsList /> : null}
                {currentTab == "create" ? <CreateBill updateList={setTab} saleId={saleId} /> : null}
            </div>
        </div>
    )
}

export default Billing