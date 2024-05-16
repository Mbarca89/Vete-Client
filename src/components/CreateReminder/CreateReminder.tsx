import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { CreateReminderformValues } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import { Spinner } from "react-bootstrap";
import { useState } from "react";
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateReminderProps {
    updateList: () => void
}

const CreateReminder: React.FC<CreateReminderProps> = ({ updateList }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const [notification, setNotification] = useState<boolean>(false)

    const validate = (values: CreateReminderformValues): CreateReminderformValues => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        if (!values.date) {
            errors.date = "Ingrese la fecha"
        }
        if (notification && !values.phone) {
            errors.phone = "Ingrese el número de teléfono"
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            date: "",
            notes: "",
            id: "",
            phone: ""
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const [year, month, day] = values.date.split('-').map(Number);
            const createReminder = {
                name: values.name,
                date: new Date(year, month - 1, day),
                notes: values.notes,
                phone: `549${values.phone}`
            }
            try {
            console.log(createReminder)
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/reminders/create`, createReminder)
                notifySuccess(res.data)
                updateList()
                setShow(false)
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
        setShow(false)
    }

    return (
        <Form onSubmit={formik.handleSubmit} noValidate>
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Nombre"
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.name && formik.errors.name)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control type="date"
                        id="date"
                        name="date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.date && formik.errors.date)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.date}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="d-flex mt-3">
                    <Form.Check type="checkbox"
                        id="notification"
                        name="notification"
                        checked={notification}
                        onChange={() => setNotification(!notification)}
                        onBlur={formik.handleBlur}
                    />
                    <Form.Label className="ml-3">¿Enviar notificación?</Form.Label>
                </Form.Group>
                {notification && <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Teléfono (54 9)</Form.Label>
                    <Form.Control type="text" placeholder="266 xxxxxxx"
                        id="phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                </Form.Group>}
            </Row>
            <Row>
                <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                    <div className='d-flex align-items-center justify-content-center w-25'>
                        <Button className="" variant="danger" onClick={resetForm}>
                            Reiniciar
                        </Button>
                    </div>
                    {!loading ?
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="primary" type="submit">
                                Crear
                            </Button>
                        </div> :
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Spinner />
                        </div>}
                </Form.Group>
            </Row>
        </Form>
    )
}

export default CreateReminder