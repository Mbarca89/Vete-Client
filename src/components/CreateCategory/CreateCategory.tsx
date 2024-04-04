import React, { useState } from "react"
import { axiosWithToken } from "../../utils/axiosInstances"
import { notifyError, notifySuccess } from "../Toaster/Toaster"
import { useFormik } from 'formik';
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateCategoryPropos {
    getCategory: () => void
}

const CreateCategory = ({getCategory} : CreateCategoryPropos) => {
    const [name, setName] = useState<string>()
    const [show, setShow] = useRecoilState(modalState)

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
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/category/create`, values)
                if (res.data) {
                    notifySuccess(res.data)
                    setShow(false)
                    getCategory()
                }
            } catch (error: any) {
                notifyError(error.response.data)
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
                        <Form.Control type="text" placeholder="Nombre de nueva categoría"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name ? <div>{formik.errors.name}</div> : null}
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} className="d-flex justify-content-center">
                        <Button className="custom-bg custom-border custom-font m-3" variant="danger" onClick={resetForm}>
                            Cancelar
                        </Button>
                        <Button className="custom-bg custom-border custom-font m-3" variant="primary" type="submit">
                            Crear
                        </Button>
                    </Form.Group>
                </Row>
            </Form>
        </div>
    )
}

export default CreateCategory