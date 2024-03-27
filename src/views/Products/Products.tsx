import Nav from 'react-bootstrap/Nav';
import { useState } from "react";
import ProductList from '../../components/ProductList/ProductList';
import CreateProduct from '../../components/CreateProduct/CreateProduct';

const Products = () => {

    const [currentTab, setCurrentTab] = useState("products")

    return (
        <div className='container flex-grow-1 p-5 m-2 rounded custom overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="products">
                <Nav.Item>
                    <Nav.Link eventKey="products" onClick={() => setCurrentTab("products")}>Productos</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="create" onClick={() => setCurrentTab("create")}>Alta producto</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab == "products" ? <ProductList /> : null}
                {currentTab == "create" ? <CreateProduct /> : null}
            </div>
        </div>
    )
}

export default Products