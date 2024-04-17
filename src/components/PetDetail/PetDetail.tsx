import React from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { modalState } from "../../app/store";
import Table from 'react-bootstrap/Table';
import { pet, medicalHistory } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useRecoilState } from "recoil";
import CustomModal from '../Modal/CustomModal';
import noImage from "../../assets/noImage.png"
import CreateMedicalHistory from "../CreateMedicalHistory/CreateMedicalHistory";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const PetDetail = () => {

    const navigate = useNavigate()
    const { petId } = useParams()
    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState<string>("")

    const [pets, setPets] = useState<pet[]>([])

    const [currentPet, setCurrentPet] = useState<pet>({
        id: "",
        name: "",
        race: "",
        weight: 0,
        born: "",
        photo: ""
    })

    const [currentMedicalHistory, setCurrentMedicalHistory] = useState<medicalHistory[]>([])

    const getPetDetails = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/pets/getPetById?petId=${petId}`)
            if (res.data) {
                setCurrentPet(res.data)
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    const getMedicalHistory = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/medicalHistory/getMedicalHistoryForPet?petId=${petId}`)
            if (res.data) {
                setCurrentMedicalHistory(res.data)
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    const handleCreateMedicalHistory = () => {
        setModal("createMedicalHistory")
        setShow(true)
    }

    useEffect(() => {
        getPetDetails()
        getMedicalHistory()
    }, [])

    return (
        <div className='container flex-grow-1 p-3 m-2 rounded custom'>
            <div className="d-flex align-items-center justify-content-between">
                <h2>{`${currentPet.name}`}</h2>
                <svg onClick={() => navigate(-1)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#a9a9a9" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" fillRule="evenodd" d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" /></g></svg></svg>
            </div>
            <img src={currentPet.photo ? `data:image/jpeg;base64,${currentPet.photo}` : noImage} alt="" />
            <div className="container border rounded mb-2 d-flex flex-column align-items-start">
                <h4 className="">Historia clínica</h4>
                <h6 role="button" onClick={handleCreateMedicalHistory}>Agregar registro <svg width="15" height="15" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></h6>
                <Table>
                    <thead>
                        <tr className="d-flex">
                            <th className="col-2">Fecha</th>
                            <th className="col-2 d-flex justify-content-center">Tipo</th>
                            <th className="col-6 d-flex justify-content-center">Notas</th>
                            <th className="col-2 d-flex justify-content-center">Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="d-flex" >
                            <td className="col-2"></td>
                            <td className="col-2"></td>
                            <td className="col-6"></td>
                            <td className="col-2 d-flex justify-content-center"><svg role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" /></g></svg></svg></td>
                        </tr>

                    </tbody>
                </Table>
            </div>
            {show && modal == "createMedicalHistory" &&
                <CustomModal title="Crear registro">
                    <CreateMedicalHistory updateList={getMedicalHistory} petId={currentPet.id}/>
                </CustomModal>
            }
        </div>
    )
}

export default PetDetail