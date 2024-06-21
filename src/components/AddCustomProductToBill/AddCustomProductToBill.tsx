import { Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { billProduct, customBillProduct, product } from "../../types"
import { useState } from "react"
import { useFormik } from 'formik';
import { useRecoilState } from 'recoil';
import { modalState } from '../../app/store';

interface AddCustomProductToBillProps {
    addProduct: (product: product) => void
}

const AddCustomProductToBill: React.FC<AddCustomProductToBillProps> = ({ addProduct }) => {
    const [show, setShow] = useRecoilState(modalState)
    const [loading, setLoading] = useState(false)

    const validate = (values: customBillProduct): customBillProduct => {
        const errors: any = {};

        if (!values.barCode) {
            errors.barCode = 'Ingrese el código';
        }
        if (!values.description) {
            errors.description = 'Ingrese la descripción';
        }
        if (!values.price) {
            errors.price = 'Ingrese el precio';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: 1,
            barCode: undefined,
            description: "",
            price: undefined,
            quantity: 1,
        },
        validate,
        onSubmit: async values => {
            const product = {
                id: 1,
                name: values.description,
                description: "",
                barCode: values.barCode? values.barCode : 0,
                cost: 0,
                price: values.price? values.price : 0,
                stock: 0,
                categoryId: 0,
                categoryName: "",
                providerName: "",
                stockAlert: false,
                published: false,
                image: "",
                thumbnail: ""
            }
            setLoading(true)
            addProduct(product)
            setShow(false)
        },
    });

    const resetForm = () => {
        formik.resetForm();
        setShow(false)
    }

    return (
        <div>
            <Form onSubmit={formik.handleSubmit} noValidate>
                <Row className="mb-2">
                    <Form.Group as={Col} xs={12} md={6}>
                        <Form.Label>Código</Form.Label>
                        <Form.Control type="number" placeholder="Código"
                            id="barCode"
                            name="barCode"
                            value={formik.values.barCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.barCode && formik.errors.barCode)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.barCode}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} xs={12} md={6}>
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control type="text" placeholder="Descripción"
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.description && formik.errors.description)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Precio</Form.Label>
                    <Form.Control type="number" placeholder="Precio"
                        id="price"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.price && formik.errors.price)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.price}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                    <div className='d-flex align-items-center justify-content-center w-25'>
                        <Button className="" variant="danger" onClick={resetForm}>
                            Cancelar
                        </Button>
                    </div>
                    {!loading ?
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="primary" type="submit">
                                Agregar
                            </Button>
                        </div> :
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Spinner />
                        </div>}
                </Form.Group>
            </Form>
        </div>
    )
}

export default AddCustomProductToBill