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
import DeleteProduct from "../DeleteProduct/DeleteProduct";
import DeactivateProduct from "../DeactivateProduct/DeactivateProduct";
import CustomModal from "../Modal/CustomModal";
import RestoreProduct from "../RestoreProduct/RestoreProduct";
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
    const [modal, setModal] = useState<string>("")

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
        active: false,
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
        setModal("delete")
    }

    const handleDeactivate = () => {
        setModal("deactivate")
    }

    const handleRestore = () => {
        setModal("restore")
    }

    const deleteProductHandler = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/products/delete?productId=${product.id}`)
            if (res.data) {
                notifySuccess(res.data)
                setModal("")
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
        product.id && fetching ? <Spinner /> : <div>
            <Row>
                <Col lg={6}>
                    <Image className="custom-detail-img" src={product.image ? `data:image/jpeg;base64,${product.image}` : noImage}></Image>
                </Col>
                <Col>
                    <div className="d-flex justify-content-end">
                        <svg onClick={handleEdit} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer mx-3"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                        {product.active ?
                            <svg onClick={handleDeactivate} role="button" width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer me-3"><path fillRule="evenodd" clipRule="evenodd" d="M12 2.00098C6.47715 2.00098 2 6.47813 2 12.001C2 17.5238 6.47715 22.001 12 22.001C17.5228 22.001 22 17.5238 22 12.001C22 6.47813 17.5228 2.00098 12 2.00098ZM3.5 12.001C3.5 7.30656 7.30558 3.50098 12 3.50098C14.0774 3.50098 15.9808 4.24624 17.4573 5.48398L5.48301 17.4583C4.24526 15.9818 3.5 14.0784 3.5 12.001ZM6.54375 18.5189C8.02013 19.7561 9.92307 20.501 12 20.501C16.6944 20.501 20.5 16.6954 20.5 12.001C20.5 9.92405 19.7551 8.02111 18.5179 6.54473L6.54375 18.5189Z" fill="#632f6b" /></svg>
                            :
                            <svg onClick={handleRestore} role="button" width="25" height="25" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer me-3" transform="rotate(0 0 0)"><path d="M3.13644 9.54175C3.02923 9.94185 3.26667 10.3531 3.66676 10.4603C4.06687 10.5675 4.47812 10.3301 4.58533 9.92998C5.04109 8.22904 6.04538 6.72602 7.44243 5.65403C8.83948 4.58203 10.5512 4.00098 12.3122 4.00098C14.0731 4.00098 15.7848 4.58203 17.1819 5.65403C18.3999 6.58866 19.3194 7.85095 19.8371 9.28639L18.162 8.34314C17.801 8.1399 17.3437 8.26774 17.1405 8.62867C16.9372 8.98959 17.0651 9.44694 17.426 9.65017L20.5067 11.3849C20.68 11.4825 20.885 11.5072 21.0766 11.4537C21.2682 11.4001 21.4306 11.2727 21.5282 11.0993L23.2629 8.01828C23.4661 7.65734 23.3382 7.2 22.9773 6.99679C22.6163 6.79358 22.159 6.92145 21.9558 7.28239L21.195 8.63372C20.5715 6.98861 19.5007 5.54258 18.095 4.464C16.436 3.19099 14.4033 2.50098 12.3122 2.50098C10.221 2.50098 8.1883 3.19099 6.52928 4.464C4.87027 5.737 3.67766 7.52186 3.13644 9.54175Z" fill="#632f6b" /><path d="M21.4906 14.4582C21.5978 14.0581 21.3604 13.6469 20.9603 13.5397C20.5602 13.4325 20.1489 13.6699 20.0417 14.07C19.5859 15.7709 18.5816 17.274 17.1846 18.346C15.7875 19.418 14.0758 19.999 12.3149 19.999C10.5539 19.999 8.84219 19.418 7.44514 18.346C6.2292 17.4129 5.31079 16.1534 4.79261 14.721L6.45529 15.6573C6.81622 15.8605 7.27356 15.7327 7.47679 15.3718C7.68003 15.0108 7.55219 14.5535 7.19127 14.3502L4.11056 12.6155C3.93723 12.5179 3.73222 12.4932 3.54065 12.5467C3.34907 12.6003 3.18662 12.7278 3.08903 12.9011L1.3544 15.9821C1.15119 16.3431 1.27906 16.8004 1.64 17.0036C2.00094 17.2068 2.45828 17.079 2.66149 16.718L3.42822 15.3562C4.05115 17.0054 5.12348 18.4552 6.532 19.536C8.19102 20.809 10.2237 21.499 12.3149 21.499C14.406 21.499 16.4387 20.809 18.0977 19.536C19.7568 18.263 20.9494 16.4781 21.4906 14.4582Z" fill="#632f6b" /></svg>

                        }
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
            {show && modal === "delete" && <CustomModal>
                <DeleteProduct productId={product.id} onUpdateProduct={deleteProductHandler} setModal={setModal} />
            </CustomModal>}
            {show && modal === "deactivate" && <CustomModal>
                <DeactivateProduct productId={product.id} onUpdateProduct={updateList} setModal={setModal} />
            </CustomModal>}
            {show && modal === "restore" && <CustomModal>
                <RestoreProduct productId={product.id} onUpdateProduct={updateList} setModal={setModal} />
            </CustomModal>}
        </div>
    )
}

export default ProductDetail