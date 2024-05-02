import { axiosWithToken } from "../../utils/axiosInstances";
import { useEffect, useState } from "react";
import { sale } from "../../types";
import { notifyError } from "../Toaster/Toaster";
import Table from 'react-bootstrap/Table';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface SaleDetailProps {
    saleId: string
}

const SaleDetail: React.FC<SaleDetailProps> = ({ saleId }) => {

    const [sale, setSale] = useState<sale>()

    const getSale = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/sales/getById/${saleId}`)
            if (res.data) {
                setSale(res.data)
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    useEffect(() => {
        getSale()
    }, [])

    return (
        sale && <div className="text-nowrap overflow-auto flex-grow-1">
            <div>
                <p><b>Fecha: </b>{sale.date.split(" ")[0]}</p>
                <p><b>Hora: </b>{sale.date.split(" ")[1]}</p>
                <p><b>Vendedor: </b>{sale.seller}</p>
                <p><b>Productos: </b></p>
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
            <div className="d-flex justify-content-end">
                    <p><b>Total: </b>${sale.amount.toFixed(2)}</p>
            </div>
        </div>
    )
}

export default SaleDetail