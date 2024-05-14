import { useFormik } from 'formik';
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { client } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import Spinner from 'react-bootstrap/Spinner';
import { useState } from 'react';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface EditUserProps {
    client: client;
    onUpdateClient: (updatedClient: client) => void;
}

const EditClient: React.FC<EditUserProps> = ({ client, onUpdateClient }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)

    const validate = (values: client): client => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        if (!values.email) {
            errors.email = 'Ingrese un Email';
        } else {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Ingrese un Email válido';
            }
        }
        if (!/^\d+$/i.test(values.phone)) {
            errors.phone = "Ingrese solo números sin espacios ni guiones"
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: client.id,
            name: client.name,
            surname: client.surname,
            phone: client.phone,
            email: client.email,
            social: client.social,
            userName: client.userName
        },
        validate,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/clients/edit`, values)
                notifySuccess(res.data)
                onUpdateClient(values)
                setShow(false)
                setLoading(false)
            } catch (error: any) {
                if (error.response) notifyError(error.response.data)
                else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
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
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control type="text" placeholder="Apellido"
                        id="surname"
                        name="surname"
                        value={formik.values.surname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
            </Row>
            <Row className="mb-2">
                <Form.Group as={Col}>
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control placeholder="Teléfono"
                        id="phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control placeholder="Email"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.email && formik.errors.email)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-5">
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Red Social</Form.Label>
                    <Form.Select
                        id="social"
                        name="social"
                        value={formik.values.social}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="X">X (twitter)</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control placeholder="Usuario"
                        id="userName"
                        name="userName"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
            </Row>
            <Row>
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
            </Row>
        </Form>
    );

}

export default EditClient