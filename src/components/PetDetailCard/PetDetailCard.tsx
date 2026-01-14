import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import type { createPetformValues, pet } from "../../types"
import noImage from "../../assets/noImage.png"
import { useNavigate } from "react-router-dom"
import { modalState, confirmModalState } from "../../app/store"
import { useRecoilState } from "recoil"
import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import handleError from '../../utils/HandleErrors';
import { notifySuccess } from '../Toaster/Toaster';
import { axiosWithToken } from '../../utils/axiosInstances';
import { Button, Spinner } from 'react-bootstrap';
import ConfirmModal from '../Modal/ConfirmModal';
import ConfirmPetProfileShare from '../ConfirmPetProfileShare/ConfirmPetProfileShare';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface PetDetailProps {
    petId: string
    updateList: () => void;
}

const PetDetailCard: React.FC<PetDetailProps> = ({ petId, updateList }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [fetching, setFetching] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const [showConfirm, setShowConfirm] = useRecoilState(confirmModalState)
    const [edit, setEdit] = useState<boolean>(false)
    const [deletePet, setDeletePet] = useState<boolean>(false)

    const [pet, setPet] = useState<pet>({
        id: "",
        publicId: "",
        name: "",
        race: "",
        gender: "",
        species: "",
        weight: 0,
        born: "",
        photo: "",
        ownerName: "",
        ownerPhone: "",
        thumbnail: ""
    })

    const inputRef = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<File | null>(null);

    const navigate = useNavigate()
    const today = new Date();
    const bornDate = new Date(pet.born);

    let age = today.getFullYear() - bornDate.getFullYear();

    if (today.getMonth() < bornDate.getMonth() ||
        (today.getMonth() === bornDate.getMonth() && today.getDate() < bornDate.getDate())) {
        age--;
    }

    const getPet = async () => {
        setFetching(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/pets/getPetById?petId=${petId}`)
            if (res.data) {
                setPet(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setFetching(false)
        }
    }

    const handleEdit = () => {
        setEdit(true)
    }

    const validate = (values: createPetformValues): createPetformValues => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: pet.name,
            race: pet.race,
            species: pet.species,
            gender: pet.gender,
            weight: pet.weight,
            born: pet.born
        },
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            setLoading(true)
            const [year, month, day] = values.born.split('-').map(Number);
            const editPet = {
                id: pet.id,
                name: values.name,
                race: values.race,
                species: values.species,
                gender: values.gender,
                weight: values.weight,
                born: new Date(year, month - 1, day)
            }
            const formData = new FormData();
            if (image) formData.append('file', image);
            formData.append('pet', JSON.stringify(editPet));

            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/pets/edit`, formData)
                notifySuccess(res.data)
                setLoading(false)
                setEdit(false)
                setShow(false)
                updateList()
            } catch (error: any) {
                handleError(error)
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
        setEdit(false)
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    };

    const handleDelete = () => {
        setDeletePet(!deletePet)
    }

    const handleShare = () => {
        setShowConfirm(true)
    }

    const deletePetHandler = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/pets/delete?petId=${pet.id}`)
            if (res.data) {
                notifySuccess(res.data)
                setShow(false)
            }
            setLoading(false)
            setDeletePet(false)
            updateList()
        } catch (error: any) {
            handleError(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getPet()
    }, [petId])

    return (
        !deletePet ? fetching ? <Spinner /> :
            <>
                <div>
                    <Form noValidate onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <img role="button" onClick={() => { navigate(`/pets/detail/${pet.id}`); setShow(false) }} className="w-100 custom-detail-img" src={pet.photo ? `data:image/jpeg;base64,${pet.photo}` : noImage} alt="" />
                            </Col>
                            <Col>
                                <div className="d-flex justify-content-end">
                                    <svg onClick={handleShare} role="button" width="25" height="25" viewBox="0 0 25 25" style={{ color: "#632f6b" }} fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)"><path fillRule="evenodd" clipRule="evenodd" d="M14.2755 2.28563C14.5558 2.16954 14.8783 2.23371 15.0928 2.44821L22.0929 9.44821C22.2335 9.58886 22.3125 9.77963 22.3125 9.97854C22.3125 10.1775 22.2335 10.3682 22.0929 10.5089L15.0928 17.5089C14.8783 17.7234 14.5558 17.7875 14.2755 17.6715C13.9952 17.5554 13.8125 17.2819 13.8125 16.9785V13.1805C8.99081 13.5129 5.04239 17.0253 4.05219 21.636C3.97796 21.9817 3.67244 22.2285 3.31891 22.2285C2.96538 22.2285 2.65986 21.9817 2.58563 21.636C2.4066 20.8024 2.3125 19.9379 2.3125 19.0523C2.3125 12.5386 7.39629 7.21238 13.8125 6.82486V2.97854C13.8125 2.67519 13.9952 2.40171 14.2755 2.28563ZM15.3125 4.7892V7.55227C15.3125 7.96649 14.9767 8.30227 14.5625 8.30227C9.00767 8.30227 4.43687 12.5155 3.87136 17.9206C5.96857 14.1816 9.96993 11.6548 14.5625 11.6548C14.9767 11.6548 15.3125 11.9906 15.3125 12.4048V15.1679L20.5019 9.97854L15.3125 4.7892Z" fill="#632f6b" /></svg>
                                    <svg onClick={handleEdit} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer mx-3"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                                    <svg onClick={handleDelete} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></g></svg></svg>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Form.Group as={Col}>
                                <Form.Label>Dueño</Form.Label>
                                <Form.Control type="text"
                                    value={pet.ownerName}
                                    disabled
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-2">
                            <Form.Group as={Col}>
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control type="text"
                                    value={pet.ownerPhone}
                                    disabled
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-2">
                            <Form.Group as={Col}>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text"
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!(formik.touched.name && formik.errors.name)}
                                    disabled={!edit}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Raza</Form.Label>
                                <Form.Control type="text" placeholder="Raza"
                                    id="race"
                                    name="race"
                                    value={formik.values.race}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Especie</Form.Label>
                                <Form.Select
                                    id="species"
                                    name="species"
                                    value={formik.values.species}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
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
                                    disabled={!edit}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Masculino">Masculino</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-2">
                            <Form.Group as={Col}>
                                <Form.Label>Peso (kg)</Form.Label>
                                <Form.Control type="number"
                                    id="weight"
                                    name="weight"
                                    value={formik.values.weight}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!edit}
                                />
                            </Form.Group>
                            {edit ?
                                <Form.Group as={Col} xs={12} md={6}>
                                    <Form.Label>Fecha de Nacimiento</Form.Label>
                                    <Form.Control type="date"
                                        id="born"
                                        name="born"
                                        value={formik.values.born}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </Form.Group> :
                                <Form.Group as={Col}>
                                    <Form.Label>Edad</Form.Label>
                                    <Form.Control type="text"
                                        value={`${age} años`}
                                        disabled={!edit}
                                    />
                                </Form.Group>}
                        </Row>

                        {edit && <Row>
                            <Form.Group className="mb-3 m-auto" as={Col} xs={12} md={6}>
                                <Form.Label>Imagen</Form.Label>
                                <Form.Control type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    ref={inputRef}
                                    disabled={!edit}
                                />
                            </Form.Group>
                        </Row>}
                        {edit && <Row>
                            <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                                <div className='d-flex align-items-center justify-content-center w-25'>
                                    <Button className="" variant="danger" onClick={resetForm}>
                                        Cancelar
                                    </Button>
                                </div>
                                {!loading ?
                                    <div className='d-flex align-items-center justify-content-center w-25'>
                                        <Button className="" variant="primary" type="submit">
                                            Guardar
                                        </Button>
                                    </div> :
                                    <div className='d-flex align-items-center justify-content-center w-25'>
                                        <Spinner />
                                    </div>}
                            </Form.Group>
                        </Row>}
                    </Form>
                </div>
                {showConfirm && <ConfirmModal>
                    <ConfirmPetProfileShare publicId={pet.publicId} petName={pet.name} phoneNumber={pet.ownerPhone}></ConfirmPetProfileShare>
                </ConfirmModal>}
            </> :
            <div className="d-flex flex-column align-items-center">
                <span>¿Esta seguro que quiere eliminar la mascota "{pet.name}?</span>
                <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                    {!loading ?
                        <div className="w-25 d-flex align-items-center justify-content-center">
                            <Button className="" variant="danger" onClick={deletePetHandler}>Si</Button>
                        </div>
                        :
                        <div className="w-25 d-flex align-items-center justify-content-center">
                            <Spinner />
                        </div>
                    }
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Button className="" variant="primary" onClick={handleDelete}>No</Button>
                    </div>
                </div>
            </div>
    )
}

export default PetDetailCard