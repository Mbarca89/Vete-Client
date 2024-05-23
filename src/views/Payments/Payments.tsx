import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Container, Row, Spinner, Col } from 'react-bootstrap';
import handleError from '../../utils/HandleErrors';
import { notifySuccess } from '../../components/Toaster/Toaster';
import { axiosWithToken } from '../../utils/axiosInstances';
import { useState } from 'react';
import { payments } from '../../types';
import { useFormik } from 'formik';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Payments = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [payed, setPayed] = useState<boolean>(false)

    const validate = (values: payments): payments => {
        const errors: any = {};

        if (!values.provider.trim()) {
            errors.name = 'Ingrese el nombre o concepto';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            date: null,
            billNumber: "",
            amount: 0,
            provider: "",
            payed: false,
            paymentMethod: "",
            paymentDate: null
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const createPayment = {
                billNumber: values.billNumber,
                amount: values.amount,
                provider: values.provider,
                payed: payed,
                paymentMethod: values.paymentMethod,
            }
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/payments/create`, createPayment);
                if (res.data) {
                    notifySuccess(res.data)
                    setLoading(false)
                    setPayed(false)
                    resetForm()
                }
            } catch (error: any) {
                handleError(error)
                setLoading(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm()
    }

    return (
        <div className='container d-flex flex-column flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <div className="d-flex justify-content-start">
                <h5>Nueva venta</h5>
            </div>
            <Container className='mt-5'>
                <Form onSubmit={formik.handleSubmit} noValidate>
                    <Row>
                        <Form.Group className="mb-3" as={Col} xs={12} md={6}>
                            <Form.Label>Nombre / Concepto</Form.Label>
                            <Form.Control type="text" placeholder="Nombre / Concepto"
                                id="provider"
                                name="provider"
                                value={formik.values.provider}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!(formik.touched.provider && formik.errors.provider)}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.provider}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" as={Col} xs={12} md={6}>
                            <Form.Label>Número de factura</Form.Label>
                            <Form.Control type="text" placeholder="Numero de factura"
                                id="billNumber"
                                name="billNumber"
                                value={formik.values.billNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3" as={Col} xs={12} md={6}>
                            <Form.Label>Monto</Form.Label>
                            <Form.Control type="number"
                                id="amount"
                                name="amount"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="d-flex mt-3 gap-3">
                            <Form.Check type="checkbox"
                                id="notification"
                                name="notification"
                                checked={payed}
                                onChange={() => setPayed(!payed)}
                                onBlur={formik.handleBlur}
                            />
                            <Form.Label className="ml-3">¿Pago efectuado?</Form.Label>
                        </Form.Group>
                    </Row>
                    <Row>
                        {payed && <Form.Group as={Col} xs={12} md={6}>
                            <Form.Label>Medio de pago</Form.Label>
                            <Form.Control type="text" placeholder="Medio de pago"
                                id="paymentMethod"
                                name="paymentMethod"
                                value={formik.values.paymentMethod}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>}
                    </Row>
                    <Container className='d-flex gap-2 justify-content-center p-1 mt-5'>
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="danger" onClick={resetForm}>
                                Limpiar
                            </Button>
                        </div>
                        {!loading ?
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button type='submit' className="" variant="primary">
                                    Confirmar
                                </Button>
                            </div> :
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Spinner />
                            </div>}
                    </Container>
                </Form>
            </Container>
        </div>
    )
}

export default Payments