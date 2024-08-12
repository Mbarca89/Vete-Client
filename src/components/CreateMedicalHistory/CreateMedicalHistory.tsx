import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import type { createMedicalHistoryFormValues, pet } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifySuccess } from "../Toaster/Toaster";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateMedicalHistoryProps {
    petId: string
    updateList: () => void
}

const CreateMedicalHistory: React.FC<CreateMedicalHistoryProps> = ({ updateList, petId }) => {

    const [show, setShow] = useRecoilState(modalState)
    const [currentPet, setCurrentPet] = useState<pet>()
    const [newWeight, setNewWeight] = useState<number>()
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const validate = (values: createMedicalHistoryFormValues): createMedicalHistoryFormValues => {
        const errors: any = {};

        if (!values.type) {
            errors.type = 'Ingrese el tipo de registro';
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
            setLoading(true)
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
                    formData.append('pet', JSON.stringify(editPet));

                    try {
                        const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/pets/edit`, formData)
                        notifySuccess(res.data)
                        updateList()
                        setShow(false)
                    } catch (error: any) {
                        handleError(error)
                    }
                } catch (error: any) {
                    handleError(error)
                }
            }
            let res
            const formData = new FormData();
            if (file) formData.append('file', file);
            formData.append('medicalHistoryRequestDto', JSON.stringify(CreateMedicalHistory));
            try {
                res = await axiosWithToken.post(`${SERVER_URL}/api/v1/medicalHistory/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
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

    const getPetDetails = async () => {
        try {
            const res = await axiosWithToken.get<pet>(`${SERVER_URL}/api/v1/pets/getPetById?petId=${petId}`)
            if (res.data) {
                setCurrentPet(res.data)
            }
        } catch (error: any) {
            handleError(error)
        }
    }

    const handleWeight = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewWeight(Number(event.target.value))
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

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
                        isInvalid={!!(formik.touched.type && formik.errors.type)}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Cirugía">Cirugía</option>
                        <option value="Consulta">Consulta</option>
                        <option value="Control">Control</option>
                        <option value="Estudio">Estudio</option>
                        <option value="Medicación">Medicación</option>
                        <option value="Vacuna">Vacuna</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{formik.errors.type}</Form.Control.Feedback>
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
            {formik.values.type === "Control" && <Row>
                <Form.Group as={Col} xs={12} md={12}>
                    <Form.Label>Control de peso</Form.Label>
                    <Form.Control type="number" placeholder={`Peso actual: ${currentPet.weight} kg`}
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
            <Row className="mb-2">
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
            {formik.values.type === "Estudio" && <Row>
                <Form.Group as={Col} xs={12} md={12}>
                        <Form.Label className="">Seleccionar archivo</Form.Label>
                        <Form.Control
                            type="file"
                            id="file"
                            name="file"
                            onChange={handleFileChange}
                            accept="image/*,.pdf"
                            ref={inputRef}
                        />
                    </Form.Group>
            </Row>}
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

export default CreateMedicalHistory