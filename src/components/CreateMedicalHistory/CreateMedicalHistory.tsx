import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { createMedicalHistoryFormValues, pet } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import { useEffect, useState } from "react";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateMedicalHistoryProps {
    petId: string
    updateList: () => void
}

const CreateMedicalHistory: React.FC<CreateMedicalHistoryProps> = ({ updateList, petId }) => {

    const [show, setShow] = useRecoilState(modalState)
    const [currentPet, setCurrentPet] = useState<pet>()
    const [newWeight, setNewWeight] = useState()
    const [image, setImage] = useState<File | null>(null);


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
                petId: petId
            }
            if (newWeight && currentPet) {
                try {
                    const editPet = {
                        id: currentPet.id,
                        name: currentPet.name,
                        race: currentPet.race,
                        species: currentPet.species,
                        gender: currentPet.gender,
                        weight: newWeight,
                        born: currentPet.born,
                    }
                    const formData = new FormData();
                    if (image) formData.append('file', image);
                    formData.append('pet', JSON.stringify(editPet));

                    try {
                        const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/pets/edit`, formData)
                        notifySuccess(res.data)
                        updateList()
                        setShow(false)
                    } catch (error: any) {
                        if (error.response) notifyError(error.response.data)
                        else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
                    }
                } catch (error: any) {
                    if (error.response) notifyError(error.response.data)
                    else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
                }
            }
            let res
            try {
                res = await axiosWithToken.post(`${SERVER_URL}/api/v1/medicalHistory/create`, CreateMedicalHistory)
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
    }

    const getPetDetails = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/pets/getPetById?petId=${petId}`)
            if (res.data) {
                setCurrentPet(res.data)
            }
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
        }
    }

    const handleWeight = (event: any) => {
        setNewWeight(event.target.value)
    }

    useEffect(() => {
        getPetDetails()
    }, [])

    return (
        currentPet && <Form onSubmit={formik.handleSubmit} noValidate>
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select
                        id="type"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Cirugía">Cirugía</option>
                        <option value="Consulta">Consulta</option>
                        <option value="Control">Control</option>
                        <option value="Medicación">Medicación</option>
                        <option value="Vacuna">Vacuna</option>
                    </Form.Select>
                    {formik.touched.type && formik.errors.type ? <div>{formik.errors.type}</div> : null}
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6}>
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
            {formik.values.type == "Control" && <Row>
                <Form.Group as={Col} xs={12} md={12}>
                    <Form.Label>Control de peso</Form.Label>
                    <Form.Control type="text" placeholder={`Peso actual: ${currentPet.weight} kg`}
                        id="medicine"
                        name="medicine"
                        value={newWeight}
                        onChange={handleWeight}
                    />
                </Form.Group>
            </Row>}
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} md={12}>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control placeholder="Descripción"
                        as="textarea"
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} xs={12} md={12}>
                    <Form.Label>Medicación</Form.Label>
                    <Form.Control type="text" placeholder="Medicación"
                        id="medicine"
                        name="medicine"
                        value={formik.values.medicine}
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

export default CreateMedicalHistory