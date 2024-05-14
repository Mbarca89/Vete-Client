import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { CreateVaccineformValues } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import { Spinner } from "react-bootstrap";
import { useState } from "react";
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateVaccineProps {
    petId: string
    updateList: () => void
}

const CreateVaccine: React.FC<CreateVaccineProps> = ({ petId, updateList }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)

    const validate = (values: CreateVaccineformValues): CreateVaccineformValues => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        if(!values.date) {
            errors.date = "Ingrese una fecha"
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            date: "",
            notes: "",
            id: "",
            petId: ""
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const [year, month, day] = values.date.split('-').map(Number);
            const createVaccine = {
                name: values.name,
                date: new Date(year, month - 1, day),
                notes: values.notes,
                petId: petId,
            }

            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/vaccines/create`, createVaccine)
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
            </Row>
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Notas</Form.Label>
                    <Form.Control type="text"
                        id="notes"
                        name="notes"
                        value={formik.values.notes}
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

export default CreateVaccine