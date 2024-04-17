import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { createMedicalHistoryFormValues } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateMedicalHistoryProps {
    petId: string
    updateList: () => void
}

const CreateMedicalHistory: React.FC<CreateMedicalHistoryProps> = ({updateList, petId}) => {

    const validate = (values: createMedicalHistoryFormValues): createMedicalHistoryFormValues => {
        const errors: any = {};

        if (!values.type) {
            errors.name = 'Ingrese el tipo de registro';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            date: "",
            type: "",
            notes: "",
            description: "",
            medicine: "",
        },
        validate,
        onSubmit: async values => {
            const CreateMedicalHistory = {
                date: values.date,
                type: values.type,
                notes: values.notes,
                description: values.description,
                medicine: values.medicine,
            }
            let res
            try {
                res = await axiosWithToken.post(`${SERVER_URL}/api/v1/medicalHistory/create`, {CreateMedicalHistory, petId})
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
            <Row className="mb-5">
                <Form.Group as={Col}>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select
                        id="role"
                        name="role"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="Consulta">Consulta</option>
                        <option value="Medicación">Medicación</option>
                        <option value="Cirugía">Cirugía</option>
                    </Form.Select>
                    {formik.touched.type && formik.errors.type ? <div>{formik.errors.type}</div> : null}
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Notas</Form.Label>
                    <Form.Control type="text" placeholder="Notas"
                        id="notes"
                        name="notes"
                        value={formik.values.notes}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
            </Row>
            <Row className="mb-5">
                <Form.Group as={Col}>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control placeholder="Descripción"
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Medicación</Form.Label>
                    <Form.Control type="text" placeholder="Medicación"
                        id="medicine"
                        name="medicine"
                        value={formik.values.medicine}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
                {/* <Form.Group as={Col}>
                    <Form.Label>Rol</Form.Label>
                    <Form.Select
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="Usuario">Estandar</option>
                        <option value="Administrador">Administrador</option>
                    </Form.Select>
                    {formik.touched.role && formik.errors.role ? <div>{formik.errors.role}</div> : null}
                </Form.Group> */}
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

export default CreateMedicalHistory