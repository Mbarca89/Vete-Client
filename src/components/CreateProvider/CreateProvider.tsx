import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { provider } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateProviderProps {
    updateList: () => void;
}

const CreateProvider: React.FC<CreateProviderProps> = ({ updateList }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const validate = (values: provider): provider => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        if (!values.contactName.trim()) {
            errors.contactName = 'Ingrese el nombre de contacto';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            name: "",
            contactName: "",
            phone: ""
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
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
            <h2 className="mb-5">Alta Proveedor</h2>
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
                    <Form.Label>Nombre de contacto</Form.Label>
                    <Form.Control type="text" placeholder="Nombre de contacto"
                        id="contactName"
                        name="contactName"
                        value={formik.values.contactName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.contactName && formik.errors.contactName)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.contactName}</Form.Control.Feedback>
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

export default CreateProvider