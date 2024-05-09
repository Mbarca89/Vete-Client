import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { createPetformValues } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import Spinner from 'react-bootstrap/Spinner';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreatePetProps {
    clientId: string
    updateList: () => void;
}

const CreatePet: React.FC<CreatePetProps> = ({ updateList, clientId }) => {
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<File | null>(null);
    const [show, setShow] = useRecoilState(modalState)

    const validate = (values: createPetformValues): createPetformValues => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            race: "",
            gender: "",
            species: "",
            weight: 0,
            born: ""
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const createPet = {
                name: values.name,
                race: values.race,
                gender: values.gender,
                species: values.species,
                weight: values.weight,
                born: values.born,
            }
            const formData = new FormData();
            if (image) formData.append('file', image);
            formData.append('pet', JSON.stringify(createPet));
            formData.append("clientId", clientId)

            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/pets/create`, formData)
                notifySuccess(res.data)
                updateList()
                setLoading(false)
                setShow(false)
            } catch (error: any) {
                if (error.response) {
                    notifyError(error.response.data)
                }
                setLoading(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
        setImage(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    };

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
                    <Form.Label>Raza</Form.Label>
                    <Form.Control type="text" placeholder="Raza"
                        id="race"
                        name="race"
                        value={formik.values.race}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
            </Row>
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Especie</Form.Label>
                    <Form.Select
                        id="species"
                        name="species"
                        value={formik.values.species}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Canino">Canino</option>
                        <option value="Felino">Felino</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Género</Form.Label>
                    <Form.Select
                        id="gender"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                    </Form.Select>
                </Form.Group>
            </Row>
            <Row className="mb-2">
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Peso (kg)</Form.Label>
                    <Form.Control type="number"
                        id="weight"
                        name="weight"
                        value={formik.values.weight}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control type="date"
                        id="born"
                        name="born"
                        value={formik.values.born}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
            </Row>
            <Row>
                <Form.Group className="mb-5 m-auto" as={Col} xs={12} md={6}>
                    <Form.Label>Imagen</Form.Label>
                    <Form.Control type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        ref={inputRef}
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

export default CreatePet