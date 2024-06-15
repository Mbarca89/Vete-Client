import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { billFormValues, billProduct, product } from '../../types';
import { notifyError, notifySuccess } from '../../components/Toaster/Toaster';
import handleError from '../../utils/HandleErrors';
import ListGroup from 'react-bootstrap/ListGroup';
import { Spinner } from 'react-bootstrap';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Billing = () => {
    const [loading, setLoading] = useState(false)
    const [searching, setSearching] = useState<boolean>(false)
    const [products, setProducts] = useState<product[]>([])
    const [billProducts, setBillProducts] = useState<billProduct[]>([])
    const searchRef = useRef<HTMLInputElement>(null)
    const [optionSelected, setOptionSelected] = useState(false);

    const handleDelete = (index: number) => {
        const newbillProducts = [...billProducts.slice(0, index), ...billProducts.slice(index + 1)];
        setBillProducts(newbillProducts)
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

        setBillProducts([
            ...billProducts,
            {
                id: product.id,
                barCode: product.barCode,
                description: product.name,
                unitCode: 1,
                price: product.price,
                quantity: 1,
                iva: 1,
                total: 1
            },
        ]);
        setOptionSelected(true);
        if (searchRef.current) {
            searchRef.current.value = "";
        }
        clearList();
    }

    const validate = (values: billFormValues): billFormValues => {
        const errors: any = {};

        if (!values.id.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            type: "",
            number: 0,
            cuit: 0
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const createBill = {
                id: values.id,
            }

            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/pets/create`, createBill)
                notifySuccess(res.data)
                setLoading(false)
            } catch (error: any) {
                handleError(error)
                setLoading(false)
            }
        },
    });

    const handleClearBill = () => {
        setBillProducts([])
        formik.resetForm();
    }

    const resetForm = () => {
        formik.resetForm();
    }

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <h1>Generar factura</h1>
            <Form onSubmit={formik.handleSubmit} noValidate>
                <Row className="mb-2">
                    <Form.Group as={Col} xs={12} md={6}>
                        <Form.Label>Tipo de factura</Form.Label>
                        <Form.Select
                            id="type"
                            name="type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.type && formik.errors.type)}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="1">A</option>
                            <option value="6">B</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{formik.errors.type}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                {formik.values.type == "1" && <Row>
                    <Form.Group as={Col} xs={12} md={6}>
                        <Form.Label>Número de CUIT</Form.Label>
                        <Form.Control type="cuit" placeholder="Número de CUIT"
                            id="cuit"
                            name="cuit"
                            value={formik.values.cuit}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.cuit && formik.errors.cuit)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.cuit}</Form.Control.Feedback>
                    </Form.Group>
                </Row>}
                <Row>
                    <Form.Group as={Col} xs={12} md={6}>
                        <Form.Label>Número de comprobante</Form.Label>
                        <Form.Control type="number" placeholder="Número"
                            id="number"
                            name="number"
                            value={formik.values.number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.number && formik.errors.number)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.number}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
            </Form>
            <Form onSubmit={handleSearch}>
                <Row className='mt-5'>
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
            <div className="flex-grow-1 text-nowrap">
                <Container className='p-1 print-table d-flex flex-column flex-grow-1'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="col-3">Código</th>
                                <th className="col-4">Descripcion</th>
                                <th className="col-1">Cantidad</th>
                                <th className="col-1">Precio</th>
                                {formik.values.type == "1" && <th className="col-1">Iva</th>}
                                <th className="col-1">Total</th>
                                <th className='exclude-print col-1'>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billProducts.map((product, index) => <tr key={String(product.barCode)}>
                                <td>{product.barCode}</td>
                                <td>{product.description}</td>
                                <td>{product.quantity}</td>
                                <td>{product.price}</td>
                                {formik.values.type == "1" && <td>{product.iva}</td>}
                                <td>{product.quantity * product.price}</td>
                                <td><svg role="button" onClick={() => handleDelete(index)} width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" fillRule="evenodd" d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" /></g></svg></svg></td>
                            </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className='container d-flex justify-content-end'>
                        <h5>{`Total: ${billProducts.reduce((total, product) => total + (product.quantity * product.price), 0)}`}</h5>
                    </div>
                </Container>
            </div>
            <Container className='d-flex gap-2 justify-content-center p-1'>
                <div className='d-flex align-items-center justify-content-center w-25'>
                    <Button className="" variant="danger" onClick={handleClearBill}>
                        Limpiar
                    </Button>
                </div>
                {!loading ?
                    <div className='d-flex align-items-center justify-content-center w-25'>
                        <Button className="" variant="primary">
                            Confirmar
                        </Button>
                    </div> :
                    <div className='d-flex align-items-center justify-content-center w-25'>
                        <Spinner />
                    </div>}
            </Container>
        </div >
    )
}

export default Billing