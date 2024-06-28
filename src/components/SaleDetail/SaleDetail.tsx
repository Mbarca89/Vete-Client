import { axiosWithToken } from "../../utils/axiosInstances";
import { useEffect, useState } from "react";
import { sale } from "../../types";
import { notifyError } from "../Toaster/Toaster";
import Table from 'react-bootstrap/Table';
import handleError from "../../utils/HandleErrors";
import { Spinner } from "react-bootstrap";
import Billing from "../../views/Billing/Billing";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { modalState } from '../../app/store';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface SaleDetailProps {
    saleId: string
}

const SaleDetail: React.FC<SaleDetailProps> = ({ saleId }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [sale, setSale] = useState<sale>()
    const [show, setShow] = useRecoilState(modalState)
    const getSale = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/sales/getById/${saleId}`)
            if (res.data) {
                setSale(res.data)
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleBill = () => {
        setShow(false)
        navigate(`/billing?sale=true&saleId=${saleId}`)
    }

    useEffect(() => {
        getSale()
    }, [])

    return (
        loading ? <Spinner /> : sale && <div className="text-nowrap overflow-auto flex-grow-1">
            <div className="d-flex justify-content-between">
                <div>
                    <p><b>Fecha: </b>{sale.date.split(" ")[0]}</p>
                    <p><b>Hora: </b>{sale.date.split(" ")[1]}</p>
                    <p><b>Vendedor: </b>{sale.seller}</p>
                    <p><b>Productos: </b></p>
                </div>
                <div>
                    <svg onClick={handleBill} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 48 48" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M10 6a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v38l-7-5l-7 5l-7-5l-7 5V6Zm8 16h12m-12 8h12M18 14h12" /></g></svg></svg>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sale?.saleProducts.map(product => <tr key={String(product.productId)}>
                        <td>{product.productName}</td>
                        <td>{product.productDescription}</td>
                        <td>{product.productPrice}</td>
                        <td>{product.quantity}</td>
                        <td>{(product.quantity * product.productPrice).toFixed(2)}</td>
                    </tr>
                    )}
                </tbody>
            </Table>
            <div className="d-flex flex-column justify-content-end align-items-end">
                {sale.discount && <p><b>Descuento: </b>{sale.discountAmount}%</p>}
                {sale.discount ? <p><b>Total con descuento: </b>${sale.amount.toFixed(2)}</p> : <p><b>Total: </b>${sale.amount.toFixed(2)}</p>}
            </div>
        </div>
    )
}

export default SaleDetail