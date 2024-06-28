import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { afipResponse, billFormValues, billProduct, product, saleProduct } from '../../types';
import { notifyError, notifySuccess } from '../Toaster/Toaster';
import handleError from '../../utils/HandleErrors';
import ListGroup from 'react-bootstrap/ListGroup';
import { Spinner } from 'react-bootstrap';
import CustomModal from '../Modal/CustomModal';
import { useRecoilState } from 'recoil';
import { logState, modalState } from '../../app/store';
import AddCustomProductToBill from '../AddCustomProductToBill/AddCustomProductToBill';
import ConfirmBill from '../ConfirmBill/ConfirmBill';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateBillProps {
    saleId: string | (string | null)[] | null
    updateList: () => void
}

const CreateBill: React.FC<CreateBillProps> = ({ updateList, saleId }) => {
    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState<string>("addProduct")
    const [loading, setLoading] = useState(false)
    const [fetchingNumber, setFetchingNumber] = useState(false)
    const [searching, setSearching] = useState<boolean>(false)
    const [products, setProducts] = useState<product[]>([])
    const [billResult, setBillResult] = useState<afipResponse>({
        errors: [{ code: "", msg: "" }],
        observations: [{ code: "", msg: "" }],
        cae: "",
        caeFchVto: "",
        status: "",
        message: ""
    })
    const [customProduct, setCustomProduct] = useState<billProduct>({
        id: 1,
        barCode: 0,
        description: "",
        price: 0,
        netPrice: 0,
        quantity: 1,
        iva: 0,
    })
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
                price: product.price,
                netPrice: Number((product.price / 1.21).toFixed(2)),
                quantity: 1,
                iva: Number((product.price - product.price / 1.21).toFixed(2)),
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

        if (!values.type) {
            errors.type = 'Ingrese el tipo.';
        }
        if (!values.cuit && values.type == "1") {
            errors.cuit = 'Ingrese el cuit.';
        } else if (values.cuit && values.type == "1" && !/^\d{11}$/.test(values.cuit.toString())) {
            errors.cuit = "Formato incorrecto."
        } else if (values.cuit && values.type == "6" && !/^\d{8}$/.test(values.cuit.toString())) {
            errors.cuit = "Formato incorrecto."
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            type: "",
            number: 0,
            cuit: null,
            name: ""
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const bill = {
                tipo: values.type,
                numero: values.number,
                tipoDocumento: values.type == "1" ? 80 : values.cuit ? "90" : "99",
                documento: values.cuit || 0,
                nombre: values.name != "" ? values.name : "Consumidor final",
                importeTotal: (billProducts.reduce((total, product) => total + (product.quantity * product.price), 0).toFixed(2)),
                importeNoGravado: values.type == "1" ? 0 : (billProducts.reduce((total, product) => total + (product.quantity * product.price), 0).toFixed(2)),
                importeGravado: values.type == "1" ? (billProducts.reduce((total, product) => total + (product.netPrice), 0).toFixed(2)) : 0,
                importeIva: values.type == "1" ? (billProducts.reduce((total, product) => total + (product.iva), 0).toFixed(2)) : 0,
                billProducts: billProducts
            }
            try {
                const res = await axiosWithToken.post<afipResponse>(`${SERVER_URL}/api/v1/afipws/generarComprobante`, bill)
                if (res.data) {
                    setBillResult(res.data)
                    if (res.data.status == "A") notifySuccess(res.data.message)
                    else notifyError(res.data.message)
                }
            } catch (error) {
                handleError(error)
            } finally {
                setModal("confirmBill")
                setShow(true)
                setLoading(false)
            }
        },
    });

    const handleQuantity = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setBillProducts((prevBillProducts) => {
            const updatedBillProducts = [...prevBillProducts];
            updatedBillProducts[index] = {
                ...updatedBillProducts[index],
                quantity: parseInt(event.target.value)
            };
            return updatedBillProducts;
        })
    }

    const handleCustomProduct = () => {
        setModal("addProduct")
        setShow(true)
    }

    const handleConfirm = () => {
        if (billProducts.length <= 0) notifyError("Agregue al menos un item")
        else formik.handleSubmit()
    }

    const handleClearBill = () => {
        setBillProducts([])
        formik.resetForm();
    }

    useEffect(() => {
        const getBillNumber = async () => {
            setFetchingNumber(true)
            try {
                const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/afipws/obtenerUltimoComprobante?type=${formik.values.type}`)
                if (typeof (res.data) == "number") {
                    formik.setValues({ ...formik.values, number: res.data + 1 }, false)
                    formik.setFieldTouched("type", true)
                } else {
                    throw new Error(res.data)
                }
            } catch (error: any) {
                handleError(error)
            } finally {
                setFetchingNumber(false)
            }
        }
        formik.values.type && getBillNumber()
    }, [formik.values.type])

    useEffect(() => {
        const getSale = async (saleId: string | (string | null)[] | null) => {
            setLoading(true)
            try {
                const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/sales/getById/${saleId}`)
                if (res.data) {
                    setBillProducts(res.data.saleProducts.map((product: saleProduct) => ({
                        id: product.productId,
                        barCode: product.barCode,
                        description: product.productDescription,
                        quantity: product.quantity,
                        price: product.productPrice,
                        netPrice: Number((product.productPrice / 1.21).toFixed(2)),
                        iva: Number((product.productPrice - product.productPrice / 1.21).toFixed(2)),
                    })))
                }
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        }
        if (saleId) {
            getSale(saleId)
        }
    }, [])

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <Form onSubmit={handleConfirm} noValidate>
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
                <Row>
                    <Form.Group as={Col} xs={12} md={6}>
                        <Form.Label>Número de comprobante</Form.Label>
                        {fetchingNumber && <Form.Label>
                            <Spinner size="sm"></Spinner>
                        </Form.Label>}
                        <Form.Control type="number" placeholder="Número"
                            id="number"
                            name="number"
                            value={formik.values.number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} xs={12} md={6}>
                        <Form.Label>{`Número de ${formik.values.type == "1" ? "CUIT" : "DNI (Opcional)"}`}</Form.Label>
                        <Form.Control type="number" placeholder="Número"
                            id="cuit"
                            name="cuit"
                            value={formik.values.cuit === null ? '' : formik.values.cuit}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.cuit && formik.errors.cuit)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.cuit}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md={6}>
                        <Form.Label>Nombre / Razón social (Opcional)</Form.Label>
                        <Form.Control type="text" placeholder="Nombre / Razón social"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
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
                                key={product.id + index}
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
            <div role='button' onClick={handleCustomProduct} className='d-flex align-items-center mt-3 mb-3'>
                <p className='m-0'>Producto personalizado</p>
                <svg width="15" height="15" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="ms-1 h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg>
            </div>
            <div className="flex-grow-1 text-nowrap">
                <Container className='p-1 print-table d-flex flex-column flex-grow-1'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="col-2">Código</th>
                                <th className="col-4">Descripcion</th>
                                <th className="col-1">Cantidad</th>
                                <th className="col-1">Precio unitario</th>
                                {formik.values.type == "1" && <th className="col-1">Subtotal</th>}
                                {formik.values.type == "1" && <th className="col-1">Iva (21%)</th>}
                                <th className="col-1">Total</th>
                                <th className='exclude-print col-1'>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billProducts.map((product, index) => <tr key={String(product.barCode)}>
                                <td>{product.barCode}</td>
                                <td>{product.description}</td>
                                <td>
                                    <input
                                        type="number"
                                        defaultValue={product.quantity}
                                        onChange={(event) => handleQuantity(event, index)}
                                    />
                                </td>
                                <td>{formik.values.type == "1" ? product.netPrice : product.price}</td>
                                {formik.values.type == "1" && <td>{(product.netPrice * product.quantity).toFixed(2)}</td>}
                                {formik.values.type == "1" && <td>{(product.iva * product.quantity).toFixed(2)}</td>}
                                <td>{formik.values.type == "1" ? ((product.netPrice + product.iva) * product.quantity).toFixed(2) : product.price * product.quantity}</td>
                                <td><svg role="button" onClick={() => handleDelete(index)} width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" fillRule="evenodd" d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" /></g></svg></svg></td>
                            </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className='container d-flex flex-column justify-content-end align-items-end'>
                        {formik.values.type == "1" && <h6>{`Subtotal: ${(billProducts.reduce((total, product) => total + (product.netPrice), 0)).toFixed(2)}`}</h6>}
                        {formik.values.type == "1" && <h6>{`Iva: ${(billProducts.reduce((total, product) => total + (product.iva), 0).toFixed(2))}`}</h6>}
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
                        <Button onClick={handleConfirm} className="" variant="primary">
                            Confirmar
                        </Button>
                    </div> :
                    <div className='d-flex align-items-center justify-content-center w-25'>
                        <Spinner />
                    </div>}
            </Container>
            {show && modal == "addProduct" && <CustomModal title={"Agregar producto"}>
                <AddCustomProductToBill addProduct={addProduct} />
            </CustomModal>
            }
            {show && modal == "confirmBill" && <CustomModal title={""} fullscreen={true}>
                <ConfirmBill submit={formik.handleSubmit} values={formik.values} products={billProducts} billResult={billResult} />
            </CustomModal>
            }

        </div >
    )
}

export default CreateBill