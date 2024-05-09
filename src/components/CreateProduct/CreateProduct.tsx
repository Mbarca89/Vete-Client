import React, { useState, useRef, useEffect } from 'react';
import { axiosWithToken } from '../../utils/axiosInstances';
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useFormik } from 'formik';
import { createProductformValues } from '../../types';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateProductProps {
    updateList: () => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({ updateList }) => {

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

    const [product, setProduct] = useState<createProductformValues>({
        name: "",
        description: "",
        barCode: undefined,
        cost: undefined,
        price: undefined,
        stock: undefined,
        categoryName: "",
        providerName: ""
    });

    const [image, setImage] = useState<File | null>(null);

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
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            barCode: undefined,
            cost: undefined,
            price: undefined,
            stock: undefined,
            categoryName: "",
            providerName: ""
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
                providerName: values.providerName ? values.providerName : "Ninguno"
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
                    updateList()
                }
            } catch (error: any) {
                notifyError(error.response.data)
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
        <Form className='' onSubmit={formik.handleSubmit} noValidate>
            <h2 className="mb-3">Alta de producto</h2>
            <Row>
                <Form.Group className="mb-3" as={Col} xs={12} md={6}>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Nombre"
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name ? <div>{formik.errors.name}</div> : null}
                </Form.Group>
                <Form.Group className="mb-3" as={Col} xs={12} md={6}>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control type="text" placeholder="Descripción"
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                    />
                    {formik.touched.stock && formik.errors.stock ? <div>{formik.errors.stock}</div> : null}
                </Form.Group>
            </Row>
            <Row>
                <Form.Group className="mb-3" as={Col} xs={12}>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                        id="categoryName"
                        name="categoryName"
                        value={formik.values.categoryName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option>Seleccionar...</option>
                        {categories.map(category =>
                            <option key={category} value={category}>{category}</option>
                        )}
                    </Form.Select>
                    {formik.touched.categoryName && formik.errors.categoryName ? <div>{formik.errors.categoryName}</div> : null}
                </Form.Group>
                <Form.Group className="mb-3" as={Col} xs={12}>
                    <Form.Label>Proveedor</Form.Label>
                    <Form.Select
                        id="providerName"
                        name="providerName"
                        value={formik.values.providerName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option>Seleccionar...</option>
                        {providers.map(provider =>
                            <option key={provider} value={provider}>{provider}</option>
                        )}
                    </Form.Select>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group className="mb-3 m-auto" as={Col} xs={12} md={6}>
                    <Form.Label>Imagen</Form.Label>
                    <Form.Control type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        ref={inputRef}
                    />
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} className="d-flex justify-content-center">
                    <Button className="custom-bg custom-border custom-font m-3" variant="primary" onClick={resetForm}>
                        Reiniciar
                    </Button>
                    <Button className="custom-bg custom-border custom-font m-3" variant="primary" type="submit">
                        Crear
                    </Button>
                </Form.Group>
            </Row>
        </Form>
    );
}

export default CreateProduct;