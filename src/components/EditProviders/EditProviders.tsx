import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { provider } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface EditProviderProps {
    provider: provider
    updateList: () => void;
}

const EditProvider: React.FC<EditProviderProps> = ({ provider, updateList }) => {

    const [show, setShow] = useRecoilState(modalState)

    const validate = (values: provider): provider => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: provider.id,
            name: provider.name,
            contactName: provider.contactName,
            phone: provider.phone
        },
        validate,
        onSubmit: async values => {
            const EditProvider = {
                id: provider.id,
                name: values.name,
                contactName: values.contactName,
                phone: values.phone
            }
            let res
            try {
                res = await axiosWithToken.post(`${SERVER_URL}/api/v1/providers/edit`, EditProvider)
                notifySuccess(res.data)
                updateList()
                setShow(false)
            } catch (error: any) {
                if (error.response) {
                    notifyError(error.response.data)
                }
            }
        },
    });

    const resetForm = () => {
        formik.resetForm()
        setShow(false)
    }

    return (
        <Form onSubmit={formik.handleSubmit} noValidate>
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} lg={6}>
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
                <Form.Group as={Col} xs={12} lg={6}>
                    <Form.Label>Nombre de contacto</Form.Label>
                    <Form.Control type="text" placeholder="Nombre de contacto"
                        id="contactName"
                        name="contactName"
                        value={formik.values.contactName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
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
                        Cancelar
                    </Button>
                    <Button className="custom-bg custom-border custom-font m-3" variant="primary" type="submit">
                        Guardar
                    </Button>
                </Form.Group>
            </Row>
        </Form>
    )
}

export default EditProvider