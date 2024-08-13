import type React from "react"
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import type { medicalHistory } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface MedicalHistoryDetailProps {
    medicalHistoryId: string
}

const MedicalHistoryDetail: React.FC<MedicalHistoryDetailProps> = ({ medicalHistoryId }) => {

    const [medicalHistory, setMedicalHistory] = useState<medicalHistory>()

    const getMedicalHistoryDetails = async () => {
        try {
            const res = await axiosWithToken.get<medicalHistory>(`${SERVER_URL}/api/v1/medicalHistory/getMedicalHistoryById?medicalHistoryId=${medicalHistoryId}`)
            if (res.data) {
                console.log(res.data);

                setMedicalHistory(res.data)
            }
        } catch (error: any) {
            handleError(error)
        }
    }

    const handleFileDownload = async (file: string) => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/medicalHistory/downloadFile?filePath=${encodeURI(file)}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.split('\\').slice.arguments(-1));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            handleError(error)
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
                {medicalHistory?.type === "Estudio" && <li className="list-group-item">
                    <h5>Archivos adjuntos</h5>
                    <div className="border p-1 rounded">
                        <h6 className="text-secondary" role="button" onClick={()=>handleFileDownload(medicalHistory.file)}>
                            {medicalHistory.file.split("\\").at(-1)}
                        </h6>
                    </div>
                </li>}
            </ul>
        </div>
    )
}

export default MedicalHistoryDetail