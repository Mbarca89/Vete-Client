import "./Sale.css"
import React, { useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { product, saleProduct } from '../../types';
import ListGroup from 'react-bootstrap/ListGroup';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../../components/Toaster/Toaster";
import { useRecoilState } from "recoil"
import { userState } from "../../app/store"
import { Spinner } from "react-bootstrap";
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const Sale = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [searching, setSearching] = useState<boolean>(false)
    const [products, setProducts] = useState<product[]>([])
    const [saleProducts, setSaleProducts] = useState<saleProduct[]>([])
    const searchRef = useRef<HTMLInputElement>(null)
    const [optionSelected, setOptionSelected] = useState(false);
    const [quantity, setQuantity] = useState<number>(1)
    const [user, setUser] = useRecoilState(userState)
    const [discountApplied, setDiscountApplied] = useState<boolean>(false)
    const [discountAmount, setDiscountAmount] = useState<number>(0)

    const handleDelete = (index: number) => {
        const newSaleProducts = [...saleProducts.slice(0, index), ...saleProducts.slice(index + 1)];
        setSaleProducts(newSaleProducts)
    }

    const handleSearch = async (event: any) => {
        event.preventDefault()
        setSearching(true)
        try {
            let searchTerm
            if (event.type == "submit") searchTerm = event.target[0].value
            else searchTerm = event.target.value
            if (searchTerm.length > 1) {
                const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/products/searchProductForSale?searchTerm=${searchTerm}`)
                if (res.data) {
                    if (res.data.length == 1) {
                        addProduct(res.data[0])
                    } else {
                        setProducts(res.data);
                    }
                }
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setSearching(false)
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

    const handleClearList = (event: any) => {
        if (event.target.value == "") clearList()
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
                    barCode: product.barCode
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

    const handleQuantity = (event: any) => {
        // const newValue = parseInt(event.target.value, 10)
        setQuantity(event.target.value)
    }

    const handleDiscount = () => {
        setDiscountApplied(!discountApplied)
    }

    const handleClearSale = () => {
        setSaleProducts([])
    }

    const handleSale = async () => {
        setLoading(true)
        const saleRequestDto = {
            seller: user.name + " " + user.surname,
            amount: discountApplied ? (saleProducts.reduce((total, product) => total + (product.quantity * product.productPrice), 0) * (1 - discountAmount / 100)) : saleProducts.reduce((total, product) => total + (product.quantity * product.productPrice), 0),
            cost: saleProducts.reduce((total, product) => total + (product.quantity * product.productCost), 0),
            saleProducts: discountApplied ? saleProducts.map((product) => (
                {
                ...product,
                productPrice: product.productPrice * (1 - discountAmount / 100)
            })) : saleProducts,
            discount: discountApplied,
            discountAmount: discountAmount
        }
        try {
            const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/sales/create`, saleRequestDto)
            if (res.data) {
                notifySuccess(res.data)
                handleClearSale()
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='container d-flex flex-column flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <div className="d-flex justify-content-start">
                <h5>Nueva venta</h5>
            </div>
            <Container className='p-1'>
                <Form onSubmit={handleSearch}>
                    <Row>
                        <Col lg={6} xs={10}>
                            <Form.Control
                                onBlur={clearList}
                                type="search"
                                placeholder="Buscar producto"
                                className="mr-sm-2"
                                onChange={handleClearList}
                                ref={searchRef}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleSearch(event);
                                    } else handleEsc(event as React.KeyboardEvent<HTMLInputElement>)
                                }}
                            />
                        </Col>
                        <Col lg={1} xs={2}>
                            <Form.Control
                                type="number"
                                value={quantity}
                                onChange={handleQuantity}
                            />
                        </Col>
                    </Row>
                    <Row className='position-relative'>
                        <Col xs="auto" lg={6} className='position-absolute'>
                            {!searching ? <ListGroup>
                                {products.map((product, index) => <ListGroup.Item
                                    key={product.id}
                                    action
                                    onClick={() => addProduct(product)}
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
                                <td>{discountApplied ? <p><del>{product.productPrice}</del> {product.productPrice * (1 - discountAmount / 100)}</p> : product.productPrice}</td>
                                <td>{product.quantity}</td>
                                <td>{discountApplied ? (product.quantity * product.productPrice) * (1 - discountAmount / 100) : product.quantity * product.productPrice}</td>
                                <td><svg role="button" onClick={() => handleDelete(index)} width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" fillRule="evenodd" d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" /></g></svg></svg></td>
                            </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className='container d-flex flex-column align-items-end justify-content-end'>
                        <h5>{`Total: $${saleProducts.reduce((total, product) => total + (product.quantity * product.productPrice), 0)}`}</h5>
                        {discountApplied && <h5>{`Total con descuento: $${(saleProducts.reduce((total, product) => total + (product.quantity * product.productPrice), 0) * (1 - discountAmount / 100))}`}</h5>}
                    </div>
                </Container>
            </div>
            <Container className="mb-3 d-flex align-items-center justify-content-center">
                <Row>
                    <Col xs={9} md={8} className="d-flex align-items-center">
                        <Form.Check
                            type="checkbox"
                            name="published"
                            id="custom-switch"
                            label="Aplicar descuento"
                            checked={discountApplied}
                            onChange={handleDiscount}
                        />
                    </Col>
                    <Col xs={3} md={4} className="d-flex align-items-center">
                        <Form.Control
                            type="number"
                            onChange={(event: any) => { setDiscountAmount(event.target.value) }}
                            value={discountAmount}
                        />
                        <p className="m-auto ms-3">%</p>
                    </Col>
                </Row>
            </Container>
            <Container className='d-flex gap-2 justify-content-center p-1'>
                <div className='d-flex align-items-center justify-content-center w-25'>
                    <Button className="" variant="danger" onClick={handleClearSale}>
                        Limpiar
                    </Button>
                </div>
                {!loading ?
                    <div className='d-flex align-items-center justify-content-center w-25'>
                        <Button onClick={handleSale} className="" variant="primary">
                            Confirmar
                        </Button>
                    </div> :
                    <div className='d-flex align-items-center justify-content-center w-25'>
                        <Spinner />
                    </div>}
            </Container>
        </div>
    )
}

export default Sale