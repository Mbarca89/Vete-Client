import Nav from 'react-bootstrap/Nav';
import { useEffect, useState } from "react";
import { axiosWithToken } from '../../utils/axiosInstances';
import { product } from '../../types';
import { notifyError, notifySuccess } from "../../components/Toaster/Toaster";
import ProductList from '../../components/ProductList/ProductList';
import CreateProduct from '../../components/CreateProduct/CreateProduct';
import Categories from '../../components/Categories/Categories';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Products = () => {

    const setTab = () => {
        setCurrentTab("products")
    }

    const [currentTab, setCurrentTab] = useState("products")

    return (
        <div className='container flex-grow-1 p-5 m-2 rounded custom overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="products" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="products" onClick={() => setCurrentTab("products")}>Productos</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="categories" onClick={() => setCurrentTab("categories")}>Categorias</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="create" onClick={() => setCurrentTab("create")}>Alta producto</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab == "products" ? <ProductList /> : null}
                {currentTab == "create" ? <CreateProduct updateList={setTab}/> : null}
                {currentTab == "categories" ? <Categories /> : null}
            </div>
        </div>
    )
}

export default Products