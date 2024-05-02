import React from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { modalState } from "../../app/store";
import Table from 'react-bootstrap/Table';
import { Form } from "react-bootstrap";
import { pet, medicalHistory } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useRecoilState } from "recoil";
import CustomModal from '../Modal/CustomModal';
import noImage from "../../assets/noImage.png"
import CreateMedicalHistory from "../CreateMedicalHistory/CreateMedicalHistory";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface MedicalHistoryDetailProps {
    medicalHistoryId: string
}

const MedicalHistoryDetail: React.FC<MedicalHistoryDetailProps> = ({medicalHistoryId}) => {

    const [medicalHistory, setMedicalHistory] = useState<medicalHistory>()

    const getMedicalHistoryDetails = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/medicalHistory/getMedicalHistoryById?medicalHistoryId=${medicalHistoryId}`)
            if(res.data) {
                setMedicalHistory(res.data)
            }
        } catch (error:any) {
            notifyError(error.response.data)
        }
    }

    useEffect(()=>{
        getMedicalHistoryDetails()
    },[])

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