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
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface EditUserProps {
    client: client;
    onUpdateClient: (updatedClient: client) => void;
}

const EditClient: React.FC<EditUserProps> = ({ client, onUpdateClient }) => {

    const [show, setShow] = useRecoilState(modalState)

    const validate = (values: client): client => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: client.id,
            name: client.name,
            surname: client.surname,
            phone: client.phone,
        },
        validate,
        onSubmit: async (values) => {
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/clients/edit`, values)
                notifySuccess(res.data)
                onUpdateClient(values)
                setShow(false)
            } catch (error:any) {
                if (error.response) {
                    notifyError(error.response.data);
                }
            }
        },
    });

    return (
        <Form onSubmit={formik.handleSubmit} noValidate>
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
                </Form.Group>
            </Row>
            <Row className="mb-5">
                <Form.Group as={Col}>
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
                    <Button className="custom-bg custom-border custom-font m-3" variant="primary" type="submit">
                        Actualizar
                    </Button>
                </Form.Group>
            </Row>
        </Form>
    );

}

export default EditClient