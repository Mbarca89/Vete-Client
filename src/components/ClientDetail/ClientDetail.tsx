import React from "react"
import { useRecoilState } from "recoil"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { modalState } from "../../app/store";
import Table from 'react-bootstrap/Table';
import { pet } from "../../types";
import CreatePet from "../CreatePet/CreatePet";
import CustomModal from "../Modal/CustomModal";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError } from "../Toaster/Toaster";
import PetDetail from "../PetDetailCard/PetDetailCard";
import DeletePet from "../DeletePet/DeletePet";
import EditPet from "../EditPet/EditPet";
import { client } from "../../types";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const ClientDetail = () => {
    const navigate = useNavigate()

    const { clientId } = useParams()

    const [pets, setPets] = useState<pet[]>([])

    const [currentClient, setCurrentClient] = useState<client>({
        id: "",
        name: "",
        surname: "",
        phone: "",
        email:"",
        social: "",
        userName: ""
    })
    const [currentPet, setCurrentPet] = useState<pet>({
        id: "",
        name: "",
        race: "",
        gender: "",
        species: "",
        weight: 0,
        born: "",
        photo: "",
        ownerName: ""
    })

    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState<string>("")

    const getPets = async () => {
        try {
            const res = await axiosWithToken(`${SERVER_URL}/api/v1/pets/getPetClient?clientId=${clientId}`)
            if (res.data) {
                setPets(res.data)
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    const handleCreatePet = () => {
        setShow(true)
        setModal("createPet")
    }

    const handlePetDetail = (pet: pet) => {
        setCurrentPet(pet)
        setModal("petDetail")
        setShow(true)
    }

    const handleDeletePet = (pet: pet) => {
        setCurrentPet(pet)
        setModal("deletePet")
        setShow(true)
    }

    const handleEditPet = (pet: pet) => {
        setCurrentPet(pet)
        setModal("editPet")
        setShow(true)
    }

    const getClientDetails = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/clients/getClientById?clientId=${clientId}`)
            if (res.data) {
                setCurrentClient(res.data)
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    useEffect(() => {
        getClientDetails()
        getPets()
    }, [])

    return (
        <div className='container flex-grow-1 p-3 m-2 rounded custom'>
            <div className="d-flex align-items-center justify-content-between">
                <h2>{`${currentClient.name} ${currentClient.surname}`}</h2>
                <svg onClick={() => navigate("/clients")} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#a9a9a9" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" fillRule="evenodd" d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" /></g></svg></svg>
            </div>
            <div className="d-flex flex-column align-items-start">
                <h5>Teléfono: {currentClient.phone}</h5>
                <h5>{currentClient.email && currentClient.email}</h5>
                <h5>{`${currentClient.social}:  ${currentClient.userName}`}</h5>
            </div>
            <div className="border rounded mt-4 d-flex flex-column align-items-start">
                <h4 className="">Mascotas:</h4>
                <h6 role="button" onClick={handleCreatePet} className="">Agregar mascota <svg width="50" height="50" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="256px" height="256px" viewBox="0 0 512 512" fill="#632f6b" x="128" y="128" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" d="M457.74 170.1a30.26 30.26 0 0 0-11.16-2.1h-.4c-20.17.3-42.79 19.19-54.66 47.76c-14.23 34.18-7.68 69.15 14.74 78.14a30.21 30.21 0 0 0 11.15 2.1c20.27 0 43.2-19 55.17-47.76c14.13-34.18 7.48-69.15-14.84-78.14ZM327.6 303.48C299.8 257.35 287.8 240 256 240s-43.9 17.46-71.7 63.48c-23.8 39.36-71.9 42.64-83.9 76.07a50.91 50.91 0 0 0-3.6 19.25c0 27.19 20.8 49.2 46.4 49.2c31.8 0 75.1-25.39 112.9-25.39S337 448 368.8 448c25.6 0 46.3-22 46.3-49.2a51 51 0 0 0-3.7-19.25c-12-33.55-60-36.71-83.8-76.07ZM192.51 196a26.53 26.53 0 0 0 4-.3c23.21-3.37 37.7-35.53 32.44-71.85C224 89.61 203.22 64 181.49 64a26.53 26.53 0 0 0-4 .3c-23.21 3.37-37.7 35.53-32.44 71.85C150 170.29 170.78 196 192.51 196Zm174.41-59.85c5.26-36.32-9.23-68.48-32.44-71.85a26.53 26.53 0 0 0-4-.3c-21.73 0-42.47 25.61-47.43 59.85c-5.26 36.32 9.23 68.48 32.44 71.85a26.53 26.53 0 0 0 4 .3c21.73 0 42.51-25.71 47.43-59.85ZM105.77 293.9c22.39-9 28.93-44 14.72-78.14C108.53 187 85.62 168 65.38 168a30.21 30.21 0 0 0-11.15 2.1c-22.39 9-28.93 44-14.72 78.14C51.47 277 74.38 296 94.62 296a30.21 30.21 0 0 0 11.15-2.1Z" /></g></svg></svg></h6>
                <Table>
                    <thead>
                        <tr className="d-flex">
                            <th className="col-6">Nombre</th>
                            <th className="col-2 d-flex justify-content-center">Detalles</th>
                            <th className="col-2 d-flex justify-content-center">Editar</th>
                            <th className="col-2 d-flex justify-content-center">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets.map(pet => <tr className="d-flex" key={String(pet.name)}>
                            <td role="button" onClick={() => handlePetDetail(pet)} className="col-6">{pet.name}</td>
                            <td className="col-2 d-flex justify-content-center"><svg onClick={() => handlePetDetail(pet)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" /></g></svg></svg></td>
                            <td className="col-2 d-flex justify-content-center"><svg onClick={() => handleEditPet(pet)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg></td>
                            <td className="col-2 d-flex justify-content-center"><svg onClick={() => handleDeletePet(pet)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.168 11.154c-.71.31-1.184 1.107-2 2.593c-.942 1.703-2.846 1.845-3.321 3.291c-.097.265-.145.677-.143.962c0 1.176.787 2 1.8 2c1.259 0 3-1 4.5-1s3.241 1 4.5 1c.927 0 1.664-.689 1.783-1.708m1.901-10.21A1.039 1.039 0 0 0 19.782 8h-.015c-.735.012-1.56.75-1.993 1.866c-.519 1.335-.28 2.7.538 3.052c.129.055.267.082.406.082c.739 0 1.575-.742 2.011-1.866c.516-1.335.273-2.7-.54-3.052h0zM11 6.992a3.608 3.608 0 0 0-.04-.725C10.757 4.97 9.913 4 9.028 4a1.237 1.237 0 0 0-.758.265m8.186 2.468c.214-1.376-.375-2.594-1.32-2.722A1.164 1.164 0 0 0 14.974 4c-.885 0-1.728.97-1.93 2.267c-.214 1.376.375 2.594 1.32 2.722c.054.007.108.011.162.011c.885 0 1.73-.974 1.93-2.267zM5.69 12.918c.816-.352 1.054-1.719.536-3.052C5.79 8.742 4.955 8 4.217 8c-.14 0-.277.027-.407.082c-.816.352-1.054 1.719-.536 3.052C3.71 12.258 4.545 13 5.283 13c.14 0 .277-.027.407-.082zM3 3l18 18" /></g></svg></svg></td>
                        </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            {show && modal == "createPet" &&
                <CustomModal title="Crear Mascota">
                    <CreatePet updateList={getPets} clientId={currentClient.id}/>
                </CustomModal>}
            {show && modal == "petDetail" &&
                <CustomModal title={currentPet.name}>
                    <PetDetail pet={currentPet}/>
                </CustomModal>}
                {show && modal == "deletePet" &&
                <CustomModal title={currentPet.name}>
                    <DeletePet currentPet={currentPet} updateList={getPets}/>
                </CustomModal>}
                {show && modal == "editPet" &&
                <CustomModal title="Editar mascota">
                    <EditPet currentPet={currentPet} updateList={getPets}/>
                </CustomModal>}
        </div>
    )
}

export default ClientDetail