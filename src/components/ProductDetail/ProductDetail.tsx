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

    const [editProduct, setEditProduct] = useState<createProductformValues>({
        name: "",
        description: "",
        barCode: 0,
        cost: 0,
        price: 0,
        stock: 0,
        categoryName: "",
        provider: ""
    });

    const [image, setImage] = useState<File | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditProduct({ ...product, [event.target.name]: event.target.value });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    };


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
                categoryName: "test",
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
                console.log(error.response.data);

            }
        },
    });

    const resetForm = () => {
        formik.resetForm()
        setImage(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <div>
            <Row>
                <Col>
                    <Image className="custom-detail-img" src={product.image ? `data:image/jpeg;base64,${product.image}` : noImage}></Image>
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
                                <Button className="custom-bg custom-border custom-font m-3" variant="primary" onClick={resetForm}>
                                    Reiniciar
                                </Button>
                                <Button className="custom-bg custom-border custom-font m-3" variant="primary" type="submit">
                                    Crear
                                </Button>
                            </Form.Group>
                        </Row>}
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ProductDetail