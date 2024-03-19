import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { createUserformValues } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const CreateUser = () => {

    const validate = (values: createUserformValues): createUserformValues => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        } else if (values.name.length > 15) {
            errors.name = 'El nombre es demasiado largo.';
        }

        if (!values.surname.trim()) {
            errors.surname = 'Ingrese el apellido';
        } else if (values.surname.length > 20) {
            errors.surname = 'El apellido es demasiado largo.';
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
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            userName: "",
            password: "",
            repeatPassword: "",
            role: "Elegir..."
        },
        validate,
        onSubmit: async values => {
            let res
            try {
                res = await axiosWithToken.post(`${SERVER_URL}/api/v1/users/create`, formik.values)
                notifySuccess(res.data)
            } catch (error:any) {
                if(error.response) {
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
            <h2 className="mb-5">Crear Usuario</h2>
            <Row className="mb-5">
                <Form.Group as={Col}>
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
                <Form.Group as={Col}>
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control type="text" placeholder="Apellido"
                        id="surname"
                        name="surname"
                        value={formik.values.surname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.surname && formik.errors.surname ? <div>{formik.errors.surname}</div> : null}
                </Form.Group>
            </Row>
            <Row className="mb-5">
                <Form.Group as={Col}>
                    <Form.Label>Nombre de usuario</Form.Label>
                    <Form.Control placeholder="Nombre de usuario"
                        id="userName"
                        name="userName"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.userName && formik.errors.userName ? <div>{formik.errors.userName}</div> : null}
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Contraseña"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Repetir contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Repetir contraseña"
                        id="repeatPassword"
                        name="repeatPassword"
                        value={formik.values.repeatPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.repeatPassword && formik.errors.repeatPassword ? <div>{formik.errors.repeatPassword}</div> : null}
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Rol</Form.Label>
                    <Form.Select
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option>Elegir...</option>
                        <option>Administrador</option>
                        <option>Estandar</option>
                    </Form.Select>
                    {formik.touched.role && formik.errors.role ? <div>{formik.errors.role}</div> : null}
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

export default CreateUser