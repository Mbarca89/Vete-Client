import "./Sale.css"
import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import Pagination from 'react-bootstrap/Pagination';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { product, saleProduct } from '../../types';
import ListGroup from 'react-bootstrap/ListGroup';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../../components/Toaster/Toaster";
import { useRecoilState } from "recoil"
import { userState } from "../../app/store"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const Sale = () => {

    const [products, setProducts] = useState<product[]>([])
    const [saleProducts, setSaleProducts] = useState<saleProduct[]>([])
    const searchRef = useRef<HTMLInputElement>(null)
    const [optionSelected, setOptionSelected] = useState(false);
    const [quantity, setQuantity] = useState<number>(1)
    const [user, setUser] = useRecoilState(userState)

    const handleDelete = (index: number) => {
        const newSaleProducts = [...saleProducts.slice(0, index), ...saleProducts.slice(index + 1)];
        setSaleProducts(newSaleProducts)
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
                    setProducts(res.data);
                }
            }
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
        }
    }

    const handleEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            clearList()
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

    const addProduct = (product: product) => {
        const existingProductIndex = saleProducts.findIndex(
            (p) => p.productId === product.id
        )
        if (existingProductIndex !== -1) {
            const updatedSaleProducts = [...saleProducts];
            const updatedQuantity: number =
                updatedSaleProducts[existingProductIndex].quantity + quantity;
            if (updatedQuantity > product.stock) {
                notifyError(
                    `No hay stock suficiente de ${product.name}`
                )
                return
            }

            updatedSaleProducts[existingProductIndex].quantity = updatedQuantity;
            setSaleProducts(updatedSaleProducts)
        } else {
            if (product.stock < quantity) {
                notifyError(`No hay stock suficiente de ${product.name}`)
                return
            }
            setSaleProducts([
                ...saleProducts,
                {
                    saleId: "",
                    productId: product.id,
                    productName: product.name,
                    productDescription: product.description,
                    productPrice: product.price,
                    productCost: product.cost,
                    quantity: quantity !== 0 ? quantity : 1,
                },
            ]);
        }
        setOptionSelected(true);
        if (searchRef.current) {
            searchRef.current.value = "";
        }
        clearList();
        setQuantity(1);
    };


    const handlePrint = () => {
        window.print()
    }

    const handleQuantity = (event: any) => {
        const newValue = parseInt(event.target.value, 10)
        setQuantity(newValue)
    }

    const handleClearSale = () => {
        setSaleProducts([])
    }

    const handleSale = async () => {
        const saleRequestDto = {
            seller: user.name + " " + user.surname,
            amount: saleProducts.reduce((total, product) => total + (product.quantity * product.productPrice), 0),
            cost: saleProducts.reduce((total, product) => total + (product.productCost), 0),
            saleProducts: saleProducts
        }
        try {
            const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/sales/create`, saleRequestDto)
            if (res.data) {
                notifySuccess(res.data)
                handleClearSale()
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    return (
        <div className='container d-flex flex-column flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <Container className='p-1'>
                <Form onSubmit={handleSearch}>
                    <Row>
                        <Col lg={6} xs={10}>
                            <Form.Control
                                onKeyDown={handleEsc}
                                onBlur={clearList}
                                type="text"
                                placeholder="Buscar producto"
                                className="mr-sm-2"
                                onChange={handleSearch}
                                ref={searchRef}
                            />
                        </Col>
                        <Col lg={1} xs={2}>
                            <Form.Control
                                type="number"
                                defaultValue={1}
                                value={quantity}
                                onChange={handleQuantity}
                            />
                        </Col>
                    </Row>
                    <Row className='position-relative'>
                        <Col xs="auto" lg={6} className='position-absolute'>
                            <ListGroup>
                                {products.map((product, index) => <ListGroup.Item
                                    key={product.id}
                                    action
                                    onClick={() => addProduct(product)}
                                >{product.name}</ListGroup.Item>)}
                            </ListGroup>
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
                                <th className="col-4">Descripcion</th>
                                <th className="col-1">Precio</th>
                                <th className="col-1">Cantidad</th>
                                <th className="col-1">Total</th>
                                <th className='exclude-print col-1'>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {saleProducts.map((product, index) => <tr key={String(product.productId)}>
                                <td className=''>{product.productName}</td>
                                <td>{product.productDescription}</td>
                                <td>{product.productPrice}</td>
                                <td>{product.quantity}</td>
                                <td>{product.quantity * product.productPrice}</td>
                                <td className='exclude-print'><svg onClick={() => handleDelete(index)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><g id="evaPersonDeleteOutline0"><g id="evaPersonDeleteOutline1"><path id="evaPersonDeleteOutline2" fill="currentColor" d="m20.47 7.5l.73-.73a1 1 0 0 0-1.47-1.47L19 6l-.73-.73a1 1 0 0 0-1.47 1.5l.73.73l-.73.73a1 1 0 0 0 1.47 1.47L19 9l.73.73a1 1 0 0 0 1.47-1.5ZM10 11a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0-6a2 2 0 1 1-2 2a2 2 0 0 1 2-2Zm0 8a7 7 0 0 0-7 7a1 1 0 0 0 2 0a5 5 0 0 1 10 0a1 1 0 0 0 2 0a7 7 0 0 0-7-7Z" /></g></g></g></svg></svg></td>
                            </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className='container d-flex justify-content-end'>
                        <h5>{`Total: ${saleProducts.reduce((total, product) => total + (product.quantity * product.productPrice), 0)}`}</h5>
                    </div>
                </Container>
            </div>
            <Container className='d-flex gap-2 justify-content-center p-1'>
                <Button variant="danger" onClick={handleClearSale}>Limpiar</Button>
                <Button onClick={handleSale} >Confirmar</Button>
            </Container>
        </div>
    )
}

export default Sale