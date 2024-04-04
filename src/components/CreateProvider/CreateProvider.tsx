import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { provider } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateProviderProps {
    updateList: () => void;
}

const createProvider: React.FC<CreateProviderProps> = ({ updateList }) => {

    const validate = (values: provider): provider => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        if (!values.contactName.trim()) {
            errors.contactName = 'Ingrese el apellido';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            contactName: "",
            phone: ""
        },
        validate,
        onSubmit: async values => {
            const createProvider = {
                name: values.name,
                contactName: values.contactName,
                phone: values.phone
            }
            let res
            try {
                res = await axiosWithToken.post(`${SERVER_URL}/api/v1/providers/create`, createProvider)
                notifySuccess(res.data)
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
            <h2 className="mb-5">Alta Proveedor</h2>
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
                    <Form.Label>Nombre de contacto</Form.Label>
                    <Form.Control type="text" placeholder="Nombre de contacto"
                        id="contactName"
                        name="contactName"
                        value={formik.values.contactName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.contactName && formik.errors.contactName ? <div>{formik.errors.contactName}</div> : null}
                </Form.Group>
            </Row>
            <Row className="mb-5">
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control placeholder="Teléfono"
                        id="phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
    )
}

export default createProvider