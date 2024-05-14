import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { createUserformValues } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { Spinner } from "react-bootstrap";
import { useState } from "react";
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateUserProps {
    updateList: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ updateList }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const validate = (values: createUserformValues): createUserformValues => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }

        if (!values.surname.trim()) {
            errors.surname = 'Ingrese el apellido';
        }

        if (!values.userName.trim()) {
            errors.userName = 'Ingrese el nombre de usuario';
        }

        if (!values.password.trim()) {
            errors.password = 'Ingrese la contraseña';
        }

        if (!values.repeatPassword.trim()) {
            errors.repeatPassword = 'Ingrese nuevamente la contraseña';
        } else if (values.repeatPassword !== values.password) {
            errors.repeatPassword = "Las contraseñas no coinciden";
        }
        if (!values.role) {
            errors.role = 'Elija un rol';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            name: "",
            surname: "",
            userName: "",
            password: "",
            repeatPassword: "",
            role: ""
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const createUser = {
                name: values.name,
                surname: values.surname,
                userName: values.userName,
                password: values.password,
                role: values.role
            }
            let res
            try {
                res = await axiosWithToken.post(`${SERVER_URL}/api/v1/users/create`, createUser)
                notifySuccess(res.data)
                updateList()
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
    }

    return (
        <Form onSubmit={formik.handleSubmit} noValidate>
            <h2 className="mb-5">Crear Usuario</h2>
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} lg={6}>
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
                <Form.Group as={Col} xs={12} lg={6}>
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control type="text" placeholder="Apellido"
                        id="surname"
                        name="surname"
                        value={formik.values.surname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.surname && formik.errors.surname)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.surname}</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} lg={6}>
                    <Form.Label>Nombre de usuario</Form.Label>
                    <Form.Control placeholder="Nombre de usuario"
                        id="userName"
                        name="userName"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.userName && formik.errors.userName)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.userName}</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} lg={6}>
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Contraseña"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
                <Form.Group as={Col} xs={12} lg={6}>
                    <Form.Label>Repetir contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Repetir contraseña"
                        id="repeatPassword"
                        name="repeatPassword"
                        value={formik.values.repeatPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.repeatPassword && formik.errors.repeatPassword)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.repeatPassword}</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-5">
                <Form.Group as={Col} xs={12} lg={6}>
                    <Form.Label>Rol</Form.Label>
                    <Form.Select
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.role && formik.errors.role)}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Usuario">Estandar</option>
                        <option value="Administrador">Administrador</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{formik.errors.role}</Form.Control.Feedback>
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

export default CreateUser