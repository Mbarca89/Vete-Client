import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../../components/Toaster/Toaster";
import { useState, useEffect, useRef } from "react";
import { provider, product, orderProduct } from '../../types';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import AddProductOrder from "../../components/AddProductOrder/AddProductOrder";
import { useRecoilState } from "recoil";
import CustomModal from "../../components/Modal/CustomModal";
import { modalState } from "../../app/store";
import { Spinner } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Order = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [searching, setSearching] = useState<boolean>(false)
    const [products, setProducts] = useState<product[]>([])
    const [selectedProducts, setSelectedProducts] = useState<orderProduct[]>([])
    const [currentProduct, setCurrentProduct] = useState<orderProduct>({
        orderId: "",
        productId: 0,
        productName: "",
        productDescription: "",
        productPrice: 0,
        productCost: 0,
        quantity: 0
    })
    const searchRef = useRef<HTMLInputElement>(null)
    const [optionSelected, setOptionSelected] = useState(false);
    const [show, setShow] = useRecoilState(modalState)

    const handleDelete = (index: number) => {
        const newSaleProducts = [...selectedProducts.slice(0, index), ...selectedProducts.slice(index + 1)];
        setSelectedProducts(newSaleProducts)
    }

    const handleSearch = async (event: any) => {
        event.preventDefault()
        try {
            let searchTerm
            if (event.type == "submit") searchTerm = event.target[0].value
            else searchTerm = event.target.value
            if (searchTerm.length > 1) {
                const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/products/searchProduct?searchTerm=${searchTerm}`)
                if (res.data) {
                    if (res.data.length == 1) {
                        console.log(res.data[0])
                        handleAddProduct({
                            orderId: "",
                            productId: res.data[0].id,
                            productName: res.data[0].name,
                            productDescription: res.data[0].description,
                            productPrice: res.data[0].price,
                            productCost: res.data[0].cost,
                            quantity: res.data[0].stock
                        })
                    } else {
                        setProducts(res.data);
                    }
                }
            }
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
        }
    }

    const clearList = () => {
        setTimeout(() => {
            if (!optionSelected) {
                setProducts([])
                if (searchRef.current) {
                    searchRef.current.value = '';
                }
            }
            setOptionSelected(false)
        }, 100)
    }

    const handleClearList = (event: any) => {
        if (event.target.value == "") clearList()
    }

    const handleEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            clearList()
        }
    }

    const handleAddProduct = (product: orderProduct) => {
        setCurrentProduct(product)
        setShow(true)
    }

    const addProduct = (product: orderProduct) => {
        setSelectedProducts([...selectedProducts, product])
        setOptionSelected(true);
        if (searchRef.current) {
            searchRef.current.value = "";
        }
        clearList();
        setShow(false)
    };

    const handleClearOrder = () => {
        setSelectedProducts([])
    }

    const handleOrder = async () => {
        const orderRequestDto = {
            amount: selectedProducts.reduce((total, product) => total + (product.quantity * product.productCost), 0),
            orderProducts: selectedProducts
        }
        try {
            const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/orders/create`, orderRequestDto)
            if (res.data) {
                notifySuccess(res.data)
                handleClearOrder()
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    useEffect(() => {

    }, [])

    return (
        <div className='container d-flex flex-column flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <div className="d-flex justify-content-start">
                <h5>Nueva compra</h5>
            </div>
            <Container className='p-1'>
                <Form onSubmit={handleSearch}>
                    <Row>
                        <Col lg={6} xs={10}>
                            <Form.Control
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleSearch(event);
                                    } else handleEsc(event as React.KeyboardEvent<HTMLInputElement>)
                                }}
                                onBlur={clearList}
                                type="text"
                                placeholder="Buscar producto"
                                className="mr-sm-2"
                                onChange={handleClearList}
                                ref={searchRef}
                            />
                        </Col>
                    </Row>
                    <Row className='position-relative'>
                        <Col xs="auto" lg={6} className='position-absolute'>
                            {!searching ? <ListGroup>
                                {products.map((product, index) => <ListGroup.Item
                                    key={product.id}
                                    action
                                    onClick={() => handleAddProduct({
                                        orderId: "",
                                        productId: product.id,
                                        productName: product.name,
                                        productDescription: product.description,
                                        productPrice: product.price,
                                        productCost: product.cost,
                                        quantity: product.stock
                                    })}
                                >{product.name}</ListGroup.Item>)}
                            </ListGroup> :
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Spinner />
                                    </ListGroup.Item>
                                </ListGroup>
                            }
                        </Col>
                    </Row>
                </Form>
            </Container>
            <div className="flex-grow-1 text-nowrap">
                <Container className='p-1 print-table d-flex flex-column flex-grow-1'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="col-4">Producto</th>
                                <th className="col-2">Costo</th>
                                <th className="col-2">Precio</th>
                                <th className="col-2">Cantidad</th>
                                <th className='col-2'>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map((product, index) => <tr key={String(product.productName)}>
                                <td className=''>{product.productName}</td>
                                <td>{product.productCost}</td>
                                <td>{product.productPrice}</td>
                                <td>{product.quantity}</td>
                                <td className='exclude-print'><svg onClick={() => handleDelete(index)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><g id="evaPersonDeleteOutline0"><g id="evaPersonDeleteOutline1"><path id="evaPersonDeleteOutline2" fill="currentColor" d="m20.47 7.5l.73-.73a1 1 0 0 0-1.47-1.47L19 6l-.73-.73a1 1 0 0 0-1.47 1.5l.73.73l-.73.73a1 1 0 0 0 1.47 1.47L19 9l.73.73a1 1 0 0 0 1.47-1.5ZM10 11a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0-6a2 2 0 1 1-2 2a2 2 0 0 1 2-2Zm0 8a7 7 0 0 0-7 7a1 1 0 0 0 2 0a5 5 0 0 1 10 0a1 1 0 0 0 2 0a7 7 0 0 0-7-7Z" /></g></g></g></svg></svg></td>
                            </tr>
                            )}
                        </tbody>
                    </Table>
                </Container>
            </div>
            <Container className='d-flex gap-2 justify-content-center p-1'>
            <div className='d-flex align-items-center justify-content-center w-25'>
                    <Button className="" variant="danger" onClick={handleClearOrder}>
                        Limpiar
                    </Button>
                </div>
                {!loading ?
                    <div className='d-flex align-items-center justify-content-center w-25'>
                        <Button onClick={handleOrder} className="" variant="primary">
                            Confirmar
                        </Button>
                    </div> :
                    <div className='d-flex align-items-center justify-content-center w-25'>
                        <Spinner />
                    </div>}
            </Container>
            {show &&
                <CustomModal title={"Agregar producto"}>
                    <AddProductOrder product={currentProduct} addProduct={addProduct} />
                </CustomModal>}
        </div>
    )
}

export default Order