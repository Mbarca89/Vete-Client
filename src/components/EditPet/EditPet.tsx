import "../../Global.css"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { createPetformValues, pet } from "../../types";
import { useFormik } from 'formik';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import noImage from "../../assets/noImage.png"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface EditPetProps {
    currentPet: pet
    updateList: () => void;
}

const EditPet: React.FC<EditPetProps> = ({ updateList, currentPet }) => {

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
            name: currentPet.name,
            race: currentPet.race,
            weight: currentPet.weight,
            born: currentPet.born
        },
        validate,
        onSubmit: async values => {
            const editPet = {
                id: currentPet.id,
                name: values.name,
                race: values.race,
                weight: values.weight,
                born: values.born,
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
                if (error.response) {
                    notifyError(error.response.data)                    
                }
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
        setImage(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        setShow(false)
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    };

    return (
        <Form onSubmit={formik.handleSubmit} noValidate>
            <Row>
            <img className="m-auto w-50" src={currentPet.photo ? `data:image/jpeg;base64,${currentPet.photo}` : noImage} alt="" />
            </Row>
            <Row className="mb-5">
                <Form.Group as={Col}>
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
                <Form.Group as={Col}>
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
            <Row className="mb-5">
                <Form.Group as={Col}>
                    <Form.Label>Peso (kg)</Form.Label>
                    <Form.Control type="number"
                        id="weight"
                        name="weight"
                        value={formik.values.weight}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </Form.Group>
                <Form.Group as={Col}>
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
                <Form.Group className="mb-3 m-auto" as={Col} xs={12} md={6}>
                    <Form.Label>Imagen</Form.Label>
                    <Form.Control type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        capture="user"
                        ref={inputRef}
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

export default EditPet