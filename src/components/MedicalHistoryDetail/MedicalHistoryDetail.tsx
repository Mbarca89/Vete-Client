import React from "react"
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { medicalHistory } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError } from "../Toaster/Toaster";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface MedicalHistoryDetailProps {
    medicalHistoryId: string
}

const MedicalHistoryDetail: React.FC<MedicalHistoryDetailProps> = ({ medicalHistoryId }) => {

    const [medicalHistory, setMedicalHistory] = useState<medicalHistory>()

    const getMedicalHistoryDetails = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/medicalHistory/getMedicalHistoryById?medicalHistoryId=${medicalHistoryId}`)
            if (res.data) {
                setMedicalHistory(res.data)
            }
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
        }
    }

    useEffect(() => {
        getMedicalHistoryDetails()
    }, [])

    return (
        <div>
            <ul className="">
                <li className="list-group-item">
                    <h5>Fecha</h5>
                    <Form.Control size="lg" type="text" placeholder={medicalHistory?.date} />
                </li>
                <li className="list-group-item">
                    <h5>Tipo</h5>
                    <Form.Control size="lg" type="text" placeholder={medicalHistory?.type} />
                </li>
                <li className="list-group-item">
                    <h5>Notas</h5>
                    <Form.Control size="lg" type="text" placeholder={medicalHistory?.notes} />
                </li>
                <li className="list-group-item">
                    <h5>Descripción</h5>
                    <Form.Control as="textarea" size="lg" type="text" placeholder={medicalHistory?.description} />
                </li>
                <li className="list-group-item">
                    <h5>Medicación</h5>
                    <Form.Control size="lg" type="text" placeholder={medicalHistory?.medicine} />
                </li>
            </ul>
        </div>
    )
}

export default MedicalHistoryDetail