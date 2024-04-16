import "./ProductDetail.css"
import React, { useState, useRef, useEffect } from "react"
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { axiosWithToken } from "../../utils/axiosInstances";
import { product } from "../../types";
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import noImage from '../../assets/noImage.png'
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import { createProductformValues } from '../../types';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface ProductDetailProps {
    product: product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {

    const [show, setShow] = useRecoilState(modalState)

    const [edit, setEdit] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const [providers, setProviders] = useState<string[]>([])
    const [categories, setCategories] = useState<string[]>([])

    const getInfo = async () => {
        try {
            const providersResponse = await axiosWithToken.get(`${SERVER_URL}/api/v1/providers/getProvidersNames`)
            const categoriesResponse = await axiosWithToken.get(`${SERVER_URL}/api/v1/category/getCategoriesNames`)
            if (providersResponse.data && categoriesResponse.data) {
                setCategories(categoriesResponse.data)
                setProviders(providersResponse.data)
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    const [editProduct, setEditProduct] = useState<createProductformValues>(product);

    const [image, setImage] = useState<File | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditProduct({ ...product, [event.target.name]: event.target.value });
    };
    

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

        if (!values.categoryName.trim()) {
            errors.provider = 'Seleccione un proveedor';
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
            provider: product.provider
        },
        validate,
        onSubmit: async values => {
            const createProduct = {
                name: values.name,
                description: values.description,
                barCode: values.barCode,
                cost: values.cost,
                price: values.price,
                stock: values.stock,
                categoryName: values.categoryName,
                provider: values.provider
            }
            const formData = new FormData();
            if (image) formData.append('file', image);
            formData.append('product', JSON.stringify(createProduct));

            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/products/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (res.data) {
                    notifySuccess(res.data)
                }
            } catch (error: any) {
                notifyError(error.response.data)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm({values: {
            name: product.name,
            description: product.description,
            barCode: product.barCode,
            cost: product.cost,
            price: product.price,
            stock: product.stock,
            categoryName: product.categoryName,
            provider: product.provider
        }})
        setImage(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        setEdit(false)        
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <div>
            <Row>
                <Col lg={6}>
                    <Image className="custom-detail-img" src={product.image ? `data:image/jpeg;base64,${product.image}` : noImage}></Image>
                </Col>
                <Col className="d-flex justify-content-end">
                    <svg onClick={handleEdit} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer mx-3"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                    <svg role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" fillRule="evenodd" d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" /></g></svg></svg>
                </Col>
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
                        />
                        {formik.touched.name && formik.errors.name ? <div>{formik.errors.name}</div> : null}
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
                        />
                        {formik.touched.cost && formik.errors.cost ? <div>{formik.errors.cost}</div> : null}
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
                        />
                        {formik.touched.price && formik.errors.price ? <div>{formik.errors.price}</div> : null}
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
                        />
                        {formik.touched.stock && formik.errors.stock ? <div>{formik.errors.stock}</div> : null}
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
                            value={formik.values.provider}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!edit}
                        >
                            {providers.map(provider =>
                                <option key={provider} value={provider}>{provider}</option>
                            )}
                        </Form.Select>
                        {formik.touched.provider && formik.errors.provider ? <div>{formik.errors.provider}</div> : null}
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
                    <Form.Group as={Col} className="d-flex justify-content-center">
                        <Button className="custom-bg custom-border custom-font m-3" variant="danger" onClick={resetForm}>
                            Cancelar
                        </Button>
                        <Button className="custom-bg custom-border custom-font m-3" variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Form.Group>
                </Row>}
            </Form>
        </div>
    )
}

export default ProductDetail