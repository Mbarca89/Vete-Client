import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../../components/Toaster/Toaster";
import { useState, useEffect } from "react";
import { provider, product } from '../../types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Order = () => {

    const [providers, setProviders] = useState<provider[]>([{
        id: "",
        name: "",
        contactName: "",
        phone: ""
    }]);

    const [products, setProducts] = useState<product[]>([])
    const [selectedProducts, setSelectedProducts] = useState<product[]>([])

    const [selectedProvider, setSelectedProvider] = useState<provider>({
        id: "",
        name: "",
        contactName: "",
        phone: ""
    })

    const getProviders = async () => {
        try {
            const res = await axiosWithToken(`${SERVER_URL}/api/v1/providers/getProviders`)
            if (res.data) {
                setProviders(res.data)
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    const getProducts = async (providerId: String) => {
        try {
            const res = await axiosWithToken(`${SERVER_URL}/api/v1/products/getFromProvider?providerId=${providerId}`)
            if (res.data) {
                setProducts(res.data)
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    const handleSelectProvider = (provider: provider) => {
        setSelectedProvider(provider)
        getProducts(provider.id)
    }

    const handleAddProduct = (product:product) => {
        setSelectedProducts([...selectedProducts, product])
    }

    useEffect(() => {
        getProviders()
    }, [])

    return (
        <div className='container flex-grow-1 p-5 m-2 rounded custom' style={{height: "800px"}}>
            <Form>
                <Row>
                    <Col>
                        <DropdownButton id="dropdown-basic-button" title={providers[0].name ? "Seleccionar proveedor" : "No hay proveedores"}>
                            {providers.map(provider =>
                                <Dropdown.Item className='d-flex justify-content-between align-items-center' onClick={() => (handleSelectProvider(provider))} key={provider.id}>
                                    {provider.name}
                                </Dropdown.Item>
                            )}
                        </DropdownButton>
                    </Col>
                </Row>
            </Form>
            <div className="mt-1 h-50 overflow-auto">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Costo</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => <tr role="button" key={String(product.id)} onClick={() => handleAddProduct(product)}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.cost}</td>
                            <td>{product.price}</td>
                        </tr>

                        )}
                    </tbody>
                </Table>
            </div>
            <div className="mt-1 bg-light h-50 overflow-auto">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Costo</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProducts.map(product => <tr role="button" key={String(product.id)}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>
                                <Form.Control
                                type="number"
                                defaultValue={product.cost}
                                />                                
                            </td>
                            <td>
                            <Form.Control
                                type="number"
                                defaultValue={product.price}
                                />  
                            </td>
                        </tr>

                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default Order