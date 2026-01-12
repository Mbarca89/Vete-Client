import { useEffect, useState } from "react";
import { axiosWithToken } from "../../utils/axiosInstances";
import type { webOrder } from "../../types";
import handleError from "../../utils/HandleErrors";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import { Spinner } from "react-bootstrap";
import CustomModal from "../../components/Modal/CustomModal";
import ShipWebOrder from "../../components/ShipWebOrder/ShipWebOrder";

const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const formatDateAr = (value: string | Date) => {
    const d = value instanceof Date ? value : new Date(value)

    // si la fecha es inválida, devolvé algo safe
    if (Number.isNaN(d.getTime())) return "-"

    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d)
}


const WebStore = () => {
    const [show, setShow] = useRecoilState(modalState)
    const [loading, setLoading] = useState<boolean>(false)
    const currentDate = new Date();
    const [dates, setDate] = useState({
        year: `${currentDate.getFullYear()}`,
        month: `${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
    })
    const [orders, setOrders] = useState<webOrder[]>([])
    const [currentOrder, setCurrentOrder] = useState<number>(0)

    const getOrders = async () => {
        setLoading(true)
        try {
            const startDate = new Date(Number(dates.year), Number(dates.month) - 1, 1)
            const endDate = new Date(Number(dates.year), Number(dates.month), 0)
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/webOrder/getOrdersByDate?dateStart=${formattedStartDate}&dateEnd=${formattedEndDate}`)
            if (res.data) {
                setOrders(res.data)
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDates = (event: any) => {
        setDate({
            ...dates,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        getOrders()
    }

    const handleShipOrder = (orderId: number) => {
        setCurrentOrder(orderId)
        setShow(true)
    }

    useEffect(() => {
        getOrders()
    }, [])

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto text-nowrap'>
            <div className='mt-3'>
                <Form onSubmit={handleSubmit}>
                    <Row className='d-flex flex-lg-row flex-column justify-content-center'>
                        <Col xs={10} lg={4}>
                            <Form.Group className="mb-3" as={Row} xs={12} lg={12}>
                                <Form.Label column>Año</Form.Label>
                                <Col>
                                    <Form.Control
                                        type='number'
                                        id="year"
                                        name="year"
                                        value={dates.year}
                                        onChange={(handleDates)}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col xs={10} lg={4}>
                            <Form.Group className="mb-3" as={Row} xs={12}>
                                <Form.Label column >Mes</Form.Label>
                                <Col>
                                    <Form.Select
                                        id="month"
                                        name="month"
                                        onChange={(handleDates)}
                                        value={dates.month}
                                    >
                                        <option value="01">01 - Enero</option>
                                        <option value="02">02 - Febrero</option>
                                        <option value="03">03 - Marzo</option>
                                        <option value="04">04 - Abril</option>
                                        <option value="05">05 - Mayo</option>
                                        <option value="06">06 - Junio</option>
                                        <option value="07">07 - Julio</option>
                                        <option value="08">08 - Agosto</option>
                                        <option value="09">09 - Septiembre</option>
                                        <option value="10">10 - Octubre</option>
                                        <option value="11">11 - Noviembre</option>
                                        <option value="12">12 - Diciembre</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            <Button type="submit">Buscar</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            {loading ? <Spinner /> : <Table striped bordered hover size="md" className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th className=''>Fecha</th>
                        <th>Nombre</th>
                        <th>Mail</th>
                        <th>Telefono</th>
                        <th>Monto</th>
                        <th>Pago</th>
                        <th>Entregada</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order =>
                        <tr>
                            <td>{order.id}</td>
                            <td>{formatDateAr(order.createdAt)}</td>
                            <td>{order.customerName}</td>
                            <td>{order.customerEmail}</td>
                            <td>{order.customerPhone}</td>
                            <td>{order.totalAmount}</td>
                            <td>{order.status === "APPROVED" ? "Aprobado" : order.status === "PENDING" ? "Pendiente" : "Cancelado"}</td>
                            <td>{order.shipped ?
                                <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#7CC504" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 16 16" fill="#7CC504" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#7CC504"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m2.75 8.75l3.5 3.5l7-7.5" /></g></svg></svg> :
                                <svg role="button" onClick={()=>handleShipOrder(order.id)} width="25" height="25" viewBox="0 0 512 512" style={{ color: "#E8403E" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#E8403E" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#E8403E"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M17 17L7 7m10 0L7 17" /></g></svg></svg>
                            }</td>
                        </tr>

                    )}
                    {show &&
                        <CustomModal title="Enviar/Entregar pedido">
                            <ShipWebOrder orderId={currentOrder} updateList={getOrders} />
                        </CustomModal>
                    }
                </tbody>
            </Table>}
        </div>
    )
}

export default WebStore