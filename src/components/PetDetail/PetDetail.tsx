import React from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { modalState } from "../../app/store";
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import { pet, medicalHistory } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { useRecoilState } from "recoil";
import CustomModal from '../Modal/CustomModal';
import noImage from "../../assets/noImage.png"
import MedicalHistory from "../MedicalHistory/MedicalHistory";
import Vaccines from "../Vaccines/Vaccines";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const PetDetail = () => {

    const navigate = useNavigate()
    const { petId } = useParams()
    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState<string>("")

    const [currentTab, setCurrentTab] = useState("medicalHistory")

    const [currentPet, setCurrentPet] = useState<pet>({
        id: "",
        name: "",
        race: "",
        gender: "",
        species: "",
        weight: 0,
        born: "",
        photo: ""
    })

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

    useEffect(() => {
        getPetDetails()
    }, [])

    return (
        currentPet.id && <div className='container flex-grow-1 p-3 m-2 rounded custom overflow-auto'>
            <div className="d-flex align-items-center justify-content-between">
                <h2>{`${currentPet.name}`}</h2>
                <svg onClick={() => navigate(-1)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#a9a9a9" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" fillRule="evenodd" d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" /></g></svg></svg>
            </div>
            <img src={currentPet.photo ? `data:image/jpeg;base64,${currentPet.photo}` : noImage} alt="" />
            <div className='flex-grow-1 rounded custom'>
                <Nav variant="tabs" defaultActiveKey="medicalHistory" activeKey={currentTab}>
                    <Nav.Item>
                        <Nav.Link eventKey="medicalHistory" onClick={() => setCurrentTab("medicalHistory")}>Historia clínica</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="vaccionation" onClick={() => setCurrentTab("vaccionation")}>Plan sanitario</Nav.Link>
                    </Nav.Item>
                </Nav>
                <div className="mt-3">
                    {currentTab == "medicalHistory" ? <MedicalHistory petId={currentPet.id} /> : null}
                    {currentTab == "vaccionation" ? <Vaccines petId={currentPet.id}/> : null}
                </div>
            </div>
        </div>
    )
}

export default PetDetail