import "./ProductDetail.css"
import React, { useState, useRef, useEffect } from "react"
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { axiosWithToken } from "../../utils/axiosInstances";
import { product } from "../../types";
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import noImage from '../../assets/noImage.png'
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import { createProductformValues } from '../../types';
import handleError from "../../utils/HandleErrors";
import { Spinner } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface ProductDetailProps {
    productId: number;
    updateList: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, updateList }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [fetching, setFetching] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const [edit, setEdit] = useState<boolean>(false)
    const [deleteProduct, setDeleteProduct] = useState<boolean>(false)

    const [product, setProduct] = useState<product>({
        id: productId,
        name: "",
        description: "",
        barCode: 0,
        cost: 0,
        price: 0,
        stock: 0,
        categoryId: 0,
        categoryName: "",
        providerName: "",
        stockAlert: false,
        published: false,
        image: "",
        thumbnail: ""

    })

    const inputRef = useRef<HTMLInputElement>(null)

    const [providers, setProviders] = useState<string[]>([])
    const [categories, setCategories] = useState<string[]>([])

    const [stockAlert, setStockAlert] = useState<boolean>(product.stockAlert)
    const [published, setPublished] = useState<boolean>(product.published)

    const [image, setImage] = useState<File | null>(null);

    const getInfo = async () => {
        try {
            const providersResponse = await axiosWithToken.get(`${SERVER_URL}/api/v1/providers/getProvidersNames`)
            const categoriesResponse = await axiosWithToken.get(`${SERVER_URL}/api/v1/category/getCategoriesNames`)
            if (providersResponse.data && categoriesResponse.data) {
                setCategories(categoriesResponse.data)
                setProviders(providersResponse.data)
            }
        } catch (error: any) {
            handleError(error)
        }
    }

    const getProduct = async () => {
        setFetching(true)
        try {
            const res = await axiosWithToken.get<product>(`${SERVER_URL}/api/v1/products/getById?productId=${productId}`)
            if (res.data) {
                console.log(res.data);
                
                setProduct(res.data)
                setPublished(res.data.published)
                setStockAlert(res.data.stockAlert)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setFetching(false)
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    };

    const handleEdit = () => {
        setEdit(true)
    }


    const validate = (values: createProductformValues): createProductformValues => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        if (!values.cost) {
            errors.cost = 'Ingrese el precio de costo';
        }

        if (!values.price) {
            errors.price = 'Ingrese el precio de venta';
        }

        if (!values.stock) {
            errors.stock = 'Ingrese el stock';
        }

        if (!values.categoryName.trim()) {
            errors.categoryName = 'Seleccione una categoria';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: product.name,
            description: product.description,
            barCode: product.barCode,
            cost: product.cost,
            price: product.price,
            stock: product.stock,
            categoryName: product.categoryName,
            providerName: product.providerName
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
            setLoading(true)
            const createProduct = {
                id: product.id,
                name: values.name,
                description: values.description,
                barCode: values.barCode,
                cost: values.cost,
                price: values.price,
                stock: values.stock,
                stockAlert: stockAlert,
                published: published,
                categoryName: values.categoryName,
                providerName: values.providerName ? values.providerName : "Ninguno"
            }
            const formData = new FormData();
            if (image) formData.append('file', image);
            formData.append('product', JSON.stringify(createProduct));
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/products/edit`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (res.data) {
                    notifySuccess(res.data)
                    setEdit(false)
                    setShow(false)
                    updateList()
                }
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm({
            values: {
                name: product.name,
                description: product.description,
                barCode: product.barCode,
                cost: product.cost,
                price: product.price,
                stock: product.stock,
                categoryName: product.categoryName,
                providerName: product.providerName
            }
        })
        setImage(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        setEdit(false)
    }

    const handleDelete = () => {
        setDeleteProduct(!deleteProduct)
    }

    const deleteProductHandler = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/products/delete?productId=${product.id}`)
            if (res.data) {
                notifySuccess(res.data)
                setDeleteProduct(false)
                setShow(false)
                updateList()
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSwitch = async (event: any) => {
        if (event.target.name == "stockAlert") {
            setStockAlert(!stockAlert)
        } else {
            setPublished(!published)
        }
        const createProduct = {
            id: product.id,
            name: product.name,
            description: product.description,
            barCode: product.barCode,
            cost: product.cost,
            price: product.price,
            stock: product.stock,
            categoryName: product.categoryName,
            providerName: product.providerName,
            stockAlert: event.target.name == "stockAlert" ? event.target.checked : product.stockAlert,
            published: event.target.name == "published" ? event.target.checked : product.published
        }
        const formData = new FormData();
        formData.append('product', JSON.stringify(createProduct));
        try {
            const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/products/edit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.data) {
                notifySuccess(res.data)
                updateList()
            }
        } catch (error: any) {
            handleError(error)
        }
    }

    useEffect(() => {
        getInfo()
        getProduct()
    }, [productId])

    return (
        product.id && !deleteProduct ? fetching ? <Spinner /> :  <div>
            <Row>
                <Col lg={6}>
                    <Image className="custom-detail-img" src={product.image ? `data:image/jpeg;base64,${product.image}` : noImage}></Image>
                </Col>
                <Col>
                    <div className="d-flex justify-content-end">
                        <svg onClick={handleEdit} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer mx-3"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                        <svg onClick={handleDelete} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></g></svg></svg>
                    </div>
                </Col>
            </Row>
            <Row>
                <div className="d-flex justify-content-around">
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            name="stockAlert"
                            id="custom-switch"
                            label="Alerta de stock"
                            checked={stockAlert}
                            onChange={handleSwitch}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            name="published"
                            id="custom-switch"
                            label="Publicar en web"
                            checked={published}
                            onChange={handleSwitch}
                        />
                    </Form.Group>
                </div>
            </Row>
            <Form className='' onSubmit={formik.handleSubmit} noValidate>
                <Row>
                    <Form.Group className="mb-3" as={Col} xs={12} md={6}>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Nombre"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!edit}
                            isInvalid={!!(formik.touched.name && formik.errors.name)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} xs={12} md={6}>
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control type="text" placeholder="No hay descripción"
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!edit}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="mb-3" as={Col} xs={12}>
                        <Form.Label>Codigo de barras</Form.Label>
                        <Form.Control type="text" placeholder="Codigo de barras"
                            id="barCode"
                            name="barCode"
                            value={formik.values.barCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!edit}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="mb-3" as={Col} xs={12} md={4}>
                        <Form.Label>precio de costo</Form.Label>
                        <Form.Control type="number" placeholder="Precio de costo"
                            id="cost"
                            name="cost"
                            value={formik.values.cost}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!edit}
                            isInvalid={!!(formik.touched.cost && formik.errors.cost)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.cost}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} xs={12} md={4}>
                        <Form.Label>Precio de venta</Form.Label>
                        <Form.Control type="number" placeholder="Precio de venta"
                            id="price"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!edit}
                            isInvalid={!!(formik.touched.price && formik.errors.price)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.price}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} xs={12} md={4}>
                        <Form.Label>Stock</Form.Label>
                        <Form.Control type="number" placeholder="Stock"
                            id="stock"
                            name="stock"
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!edit}
                            isInvalid={!!(formik.touched.stock && formik.errors.stock)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.stock}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="mb-3" as={Col} xs={12}>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Select
                            id="categoryName"
                            name="categoryName"
                            value={formik.values.categoryName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!edit}
                        >
                            {categories.map(category =>
                                <option key={category} value={category}>{category}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} xs={12}>
                        <Form.Label>Proveedor</Form.Label>
                        <Form.Select
                            id="provider"
                            name="provider"
                            value={formik.values.providerName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!edit}
                        >
                            <option value="">{product.providerName}</option>
                            {providers.map(provider =>
                                <option key={provider} value={provider}>{provider}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                </Row>
                {edit && <Row>
                    <Form.Group className="mb-3 m-auto" as={Col} xs={12} md={6}>
                        <Form.Label>Imagen</Form.Label>
                        <Form.Control type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            ref={inputRef}
                            disabled={!edit}
                        />
                    </Form.Group>
                </Row>}
                {edit && <Row>
                    <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="danger" onClick={resetForm}>
                                Cancelar
                            </Button>
                        </div>
                        {!loading ?
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="primary" type="submit">
                                    Guardar
                                </Button>
                            </div> :
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Spinner />
                            </div>}
                    </Form.Group>
                </Row>}
            </Form>
        </div>
            :
            <div className="d-flex flex-column align-items-center">
                <span>Esta seguro que quiere eliminar el producto?</span>
                <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                    {!loading ?
                        <div className="w-25 d-flex align-items-center justify-content-center">
                            <Button className="" variant="danger" onClick={deleteProductHandler}>Si</Button>
                        </div>
                        :
                        <div className="w-25 d-flex align-items-center justify-content-center">
                            <Spinner />
                        </div>
                    }
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Button className="" variant="primary" onClick={handleDelete}>No</Button>
                    </div>
                </div>
            </div>
    )
}

export default ProductDetail