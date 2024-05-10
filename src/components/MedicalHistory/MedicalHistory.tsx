import React from "react"
import { useEffect, useState } from "react";
import { modalState } from "../../app/store";
import Table from 'react-bootstrap/Table';
import { medicalHistory } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError } from "../Toaster/Toaster";
import { useRecoilState } from "recoil";
import CustomModal from '../Modal/CustomModal';
import CreateMedicalHistory from "../CreateMedicalHistory/CreateMedicalHistory";
import MedicalHistoryDetail from "../MedicalHistoryDetail/MedicalHistoryDetail";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface MedicalHistoryProps {
    petId: string;
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ petId }) => {

    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState<string>("")

    const [currentMedicalHistory, setCurrentMedicalHistory] = useState<medicalHistory[]>([])
    const [medicalHistoryId, setMedicalHistoryId] = useState<string>("")

    const getMedicalHistory = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/medicalHistory/getMedicalHistoryForPet?petId=${petId}`)
            if (res.data) {
                setCurrentMedicalHistory(res.data)
            }
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
        }
    }

    const handleCreateMedicalHistory = () => {
        setModal("createMedicalHistory")
        setShow(true)
    }

    const handleMedicalHistoryDetail = (medicalHistoryId: string) => {
        setMedicalHistoryId(medicalHistoryId)
        setModal("medicalHistoryDetail")
        setShow(true)
    }

    useEffect(() => {
        getMedicalHistory()
    }, [])

    return (
        <>
            <div className="d-flex flex-column align-items-start text-nowrap overflow-auto">
                <h6 role="button" onClick={handleCreateMedicalHistory}>Agregar registro <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></h6>
                <Table>
                    <thead>
                        <tr className="d-flex">
                            <th className="col-2 d-flex">Fecha</th>
                            <th className="col-2 d-flex justify-content-center">Tipo</th>
                            <th className="col-6 d-flex justify-content-center">Notas</th>
                            <th className="col-2 d-flex justify-content-center">Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMedicalHistory.map((medicalHistory) =>
                            <tr className="d-flex" key={medicalHistory.id}>
                                <td className="col-2">{medicalHistory.date}</td>
                                <td className="col-2">{medicalHistory.type}</td>
                                <td className="col-6">{medicalHistory.notes}</td>
                                <td className="col-2 d-flex justify-content-center"><svg onClick={() => handleMedicalHistoryDetail(medicalHistory.id)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" /></g></svg></svg></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            {
                show && modal == "createMedicalHistory" &&
                <CustomModal title="Crear registro">
                    <CreateMedicalHistory updateList={getMedicalHistory} petId={petId} />
                </CustomModal>
            }
            {
                show && modal == "medicalHistoryDetail" &&
                <CustomModal title="Detalle">
                    <MedicalHistoryDetail medicalHistoryId={medicalHistoryId} />
                </CustomModal>
            }
        </>
    )
}

export default MedicalHistory