import React from "react"
import { useRecoilState } from "recoil"
import { clientState } from "../../app/store"
import Table from 'react-bootstrap/Table';

const ClientDetail = () => {

    const [client, setClient] = useRecoilState(clientState)

    return (
        <div className='container flex-grow-1 p-3 m-2 rounded custom'>
            <div className="d-flex align-items-center justify-content-between">
                <h2>{`${client.name} ${client.surname}`}</h2>
                <svg role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#a9a9a9" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" fillRule="evenodd" d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" /></g></svg></svg>
            </div>
            <div className="d-flex">
                <h5>Teléfono: {client.phone}</h5>
            </div>
            <div className="container border rounded mb-2">
                <h4>Mascotas:</h4>
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
                        <tr className="d-flex">
                            <td className="col-6">mascota</td>
                            <td className="col-2 d-flex justify-content-center"><svg role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" /></g></svg></svg></td>
                            <td className="col-2 d-flex justify-content-center"><svg role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg></td>
                            <td className="col-2 d-flex justify-content-center"><svg role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M11.168 11.154c-.71.31-1.184 1.107-2 2.593c-.942 1.703-2.846 1.845-3.321 3.291c-.097.265-.145.677-.143.962c0 1.176.787 2 1.8 2c1.259 0 3-1 4.5-1s3.241 1 4.5 1c.927 0 1.664-.689 1.783-1.708m1.901-10.21A1.039 1.039 0 0 0 19.782 8h-.015c-.735.012-1.56.75-1.993 1.866c-.519 1.335-.28 2.7.538 3.052c.129.055.267.082.406.082c.739 0 1.575-.742 2.011-1.866c.516-1.335.273-2.7-.54-3.052h0zM11 6.992a3.608 3.608 0 0 0-.04-.725C10.757 4.97 9.913 4 9.028 4a1.237 1.237 0 0 0-.758.265m8.186 2.468c.214-1.376-.375-2.594-1.32-2.722A1.164 1.164 0 0 0 14.974 4c-.885 0-1.728.97-1.93 2.267c-.214 1.376.375 2.594 1.32 2.722c.054.007.108.011.162.011c.885 0 1.73-.974 1.93-2.267zM5.69 12.918c.816-.352 1.054-1.719.536-3.052C5.79 8.742 4.955 8 4.217 8c-.14 0-.277.027-.407.082c-.816.352-1.054 1.719-.536 3.052C3.71 12.258 4.545 13 5.283 13c.14 0 .277-.027.407-.082zM3 3l18 18" /></g></svg></svg></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default ClientDetail