import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifySuccess } from "../Toaster/Toaster";
import { useFormik } from "formik";
import type { CreateVaccineformValues, reminderDetailFormValues } from "../../types";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface VaccineDetailProps {
    event: any;
    updateList: () => void
    petId: string
}

const VaccineDetail: React.FC<VaccineDetailProps> = ({ event, updateList, petId }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [deleteVaccine, setDeleteVaccine] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)

    const date = new Date(event.startStr);
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate() + 1;

    const newDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const validate = (values: reminderDetailFormValues): reminderDetailFormValues => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }
        if (!values.date) {
            errors.date = "Ingrese una fecha"
        }
        if (!values.phone) {
            errors.phone = "Ingrese el número de teléfono"
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            name: event.title,
            date: newDateString,
            notes: event.extendedProps.notes,
            id: event.id,
            petId: petId,
            phone: event.extendedProps.phone
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
            setLoading(true)
            const [year, month, day] = values.date.split('-').map(Number);
            const editVaccine = {
                name: values.name,
                date: new Date(year, month - 1, day),
                notes: values.notes,
                id: event.id,
            }
            const editReminder = {
                name: values.name,
                date: new Date(year, month - 1, day),
                notes: values.notes,
                id: event.id,
                phone: values.phone
            }

            try {
                let res
                if (event.extendedProps.eventType === "reminder") {
                    res = await axiosWithToken.put(`${SERVER_URL}/api/v1/reminders/editReminder`, editReminder)
                } else {
                    res = await axiosWithToken.put(`${SERVER_URL}/api/v1/vaccines/editVaccine`, editVaccine)
                }
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
        setEdit(false)
    }

    const handleEdit = () => {
        setEdit(!edit)
    }

    const handleDelete = () => {
        setDeleteVaccine(!deleteVaccine)
    }

    const deleteVaccineHandler = async () => {
        try {
            let res
            if (event.extendedProps.eventType === "vaccine") {
                res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/vaccines/delete/${event.id}`)
            } else {
                res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/reminders/delete/${event.id}`)
            }
            notifySuccess(res.data)
            updateList()
            setShow(false)
        } catch (error: any) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        !deleteVaccine ? <div>
            <div className="d-flex justify-content-end">
                {!(event.extendedProps.eventType === "vaccine") && <svg onClick={handleEdit} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer mx-3"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>}
                <svg onClick={handleDelete} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M14.12 10.47L12 12.59l-2.13-2.12l-1.41 1.41L10.59 14l-2.12 2.12l1.41 1.41L12 15.41l2.12 2.12l1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" /></g></svg></svg>
            </div>
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
                            disabled={!edit}
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
                            disabled={!edit}
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
                            disabled={!edit}
                            onBlur={formik.handleBlur}
                        />
                    </Form.Group>
                </Row>
                <Row>
                {event.extendedProps.phone?.length > 3 && <Form.Group as={Col} xs={12} md={6}>
                    <Form.Label>Teléfono (54 9)</Form.Label>
                    <Form.Control type="text" placeholder="266 xxxxxxx"
                        id="phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!edit}
                        isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
                </Form.Group>}
                </Row>
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
        </div> :
            <div className="d-flex flex-column align-items-center">
                <span>¿Esta seguro que quiere eliminar el recordatorio?</span>
                <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                    {!loading ?
                        <div className="w-25 d-flex align-items-center justify-content-center">
                            <Button className="" variant="danger" onClick={deleteVaccineHandler}>Si</Button>
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

export default VaccineDetail