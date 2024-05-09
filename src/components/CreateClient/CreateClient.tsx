import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { client } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateClientProps {
    updateList: () => void;
}

const CreateClient: React.FC<CreateClientProps> = ({ updateList }) => {
    const [loading, setloading] = useState(false)
    
    const validate = (values: client): client => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        if (values.email) {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Ingrese un Email válido';
            }
        }
        if(!/^\d+$/i.test(values.phone)) {
            errors.phone = "Ingrese solo números sin espacios ni guiones"
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            name: "",
            surname: "",
            phone: "",
            email: "",
            social: "",
            userName: ""
        },
        validate,
        onSubmit: async values => {
            setloading(true)
            const createClient = {
                name: values.name,
                surname: values.surname,
                phone: "+549" + values.phone,
                email: values.email,
                social: values.social,
                userName: values.userName
            }
            let res
            try {
                res = await axiosWithToken.post(`${SERVER_URL}/api/v1/clients/create`, createClient)
                notifySuccess(res.data)
                setloading(false)
                updateList()
            } catch (error: any) {
                if (error.response) {
                    notifyError(error.response.data)
                }
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
    }

    return (
        <Form onSubmit={formik.handleSubmit} noValidate>
            <h2 className="mb-5">Alta Cliente</h2>
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} md={6}>
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
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Teléfono (+54 9)</Form.Label>
                    <Form.Control placeholder="Teléfono"
                        id="phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone ? <div>{formik.errors.phone}</div> : null}
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control placeholder="Email"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
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

export default CreateClient