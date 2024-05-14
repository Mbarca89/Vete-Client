import React, { useState } from "react"
import { axiosWithToken } from "../../utils/axiosInstances"
import { notifyError, notifySuccess } from "../Toaster/Toaster"
import { useFormik } from 'formik';
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateCategoryPropos {
    getCategory: () => void
}

const CreateCategory: React.FC<CreateCategoryPropos> = ({ getCategory }: CreateCategoryPropos) => {
    const [show, setShow] = useRecoilState(modalState)
    const [loading, setLoading] = useState(false)

    const validate = (values: any) => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: "",
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/category/create`, values)
                if (res.data) {
                    notifySuccess(res.data)
                    setShow(false)
                    getCategory()
                }
                setLoading(false)
            } catch (error: any) {
                handleError(error)
                setLoading(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
        setShow(false)
    }

    return (
        <div>
            <Form onSubmit={formik.handleSubmit} noValidate>
                <Row className="mb-5">
                    <Form.Group as={Col}>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nombre de nueva categoría"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.name && formik.errors.name)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
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
                                Crear
                            </Button>
                        </div> :
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Spinner />
                        </div>}
                </Form.Group>
                </Row>
            </Form>
        </div>
    )
}

export default CreateCategory