import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { CreateReminderformValues } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateReminderProps {
    updateList: () => void
}

const CreateReminder: React.FC<CreateReminderProps> = ({ updateList }) => {

    const [show, setShow] = useRecoilState(modalState)

    const validate = (values: CreateReminderformValues): CreateReminderformValues => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        if (!values.date) {
            errors.date = "Ingrese la fecha"
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            date: "",
            notes: "",
            id: "",
        },
        validate,
        onSubmit: async values => {
            const [year, month, day] = values.date.split('-').map(Number);
            const createReminder = {
                name: values.name,
                date: new Date(year, month - 1, day),
                notes: values.notes,
            }
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/reminders/create`, createReminder)
                notifySuccess(res.data)
                updateList()
                setShow(false)
            } catch (error: any) {
                if (error.response) notifyError(error.response.data)
                else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
        setShow(false)
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
                    />
                    {formik.touched.name && formik.errors.name ? <div>{formik.errors.name}</div> : null}
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control type="date"
                        id="date"
                        name="date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.date && formik.errors.date ? <div>{formik.errors.date}</div> : null}
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
                <Form.Group as={Col} className="d-flex justify-content-center">
                    <Button className="custom-border m-3" variant="danger" onClick={resetForm}>
                        Cancelar
                    </Button>
                    <Button className="custom-border m-3" variant="primary" type="submit">
                        Crear
                    </Button>
                </Form.Group>
            </Row>
        </Form>
    )
}

export default CreateReminder