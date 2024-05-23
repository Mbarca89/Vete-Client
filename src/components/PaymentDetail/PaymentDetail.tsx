import { useEffect, useRef, useState } from "react"
import handleError from "../../utils/HandleErrors"
import { axiosWithToken } from "../../utils/axiosInstances"
import { payments } from "../../types";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Spinner, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import { notifySuccess } from "../Toaster/Toaster";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface PaymentDetailProps {
    paymentId: string
}

const PaymentDetail: React.FC<PaymentDetailProps> = ({ paymentId }) => {

    const [show, setShow] = useRecoilState(modalState)
    const [loading, setLoading] = useState<boolean>(false)
    const [payment, setPayment] = useState<payments>()
    const [payed, setPayed] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)

    useEffect(() => {
        const getPayment = async () => {
            setLoading(true)
            try {
                const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/payments/getById/${paymentId}`)
                if (res.data) {
                    setPayed(res.data.payed)
                    setPayment(res.data)
                }
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        }
        getPayment()
    }, [paymentId])

    const validate = (values: payments): payments => {
        const errors: any = {};

        if (!values.provider.trim()) {
            errors.provider = 'Ingrese el nombre o concepto';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: paymentId,
            date: payment?.date,
            billNumber: payment?.billNumber || "",
            amount: payment?.amount || 0,
            provider: payment?.provider || "",
            payed: payment?.payed || false,
            paymentMethod: payment?.paymentMethod || "",
            paymentDate: payment?.paymentDate || ""
        },
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            setLoading(true)
            const editPayment = {
                id: paymentId,
                billNumber: values.billNumber,
                amount: values.amount,
                provider: values.provider,
                payed: payed,
                paymentMethod: values.paymentMethod,
            }
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/payments/makePayment`, editPayment);
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
        setShow(false)
    }

    const handleEdit = () => {
        setEdit(!edit)
    }


    return (
        <div>
            <Container className='mt-5'>
                <div className="d-flex justify-content-end">
                    <svg onClick={handleEdit} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer mx-3"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                </div>
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
                                disabled={!edit}
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
                                disabled={!edit}
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
                                disabled={!edit}
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="d-flex mt-3">
                            <Form.Check type="checkbox"
                                id="notification"
                                name="notification"
                                checked={payed}
                                onChange={() => setPayed(!payed)}
                                onBlur={formik.handleBlur}
                                disabled={!edit}
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
                                disabled={!edit}
                            />
                        </Form.Group>}
                    </Row>
                    <Container className='d-flex gap-2 justify-content-center p-1 mt-5'>
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="danger" onClick={resetForm}>
                                Cancelar
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

export default PaymentDetail