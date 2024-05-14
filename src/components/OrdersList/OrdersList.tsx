import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import { order } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import { notifyError } from '../Toaster/Toaster';
import OrderDetail from '../OrderDetail/OrderDetail';
import CustomModal from '../Modal/CustomModal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import handleError from '../../utils/HandleErrors';
import { Spinner } from 'react-bootstrap';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const OrdersList = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [orders, setOrders] = useState<order[]>([])
    const [show, setShow] = useRecoilState(modalState)
    const [currentOrder, setCurrentOrder] = useState<string>("")

    const currentDate = new Date();
    const [dates, setDate] = useState({
        dateStart: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
        dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
    })

    const getOrders = async () => {
        setLoading(true)
        try {
            const startDate = new Date(dates.dateStart);
            const endDate = new Date(dates.dateEnd);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken.get<order[]>(`${SERVER_URL}/api/v1/orders/getByDate?dateStart=${formattedStartDate}&dateEnd=${formattedEndDate}`)
            if (res.data) {
                setOrders(res.data)
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDates = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate({
            ...dates,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        getOrders()
    }

    const handleDetail = (orderId: string) => {
        setCurrentOrder(orderId)
        setShow(true)
    }


    useEffect(() => {
        getOrders()
    }, [])

    return (
        <div className='text-nowrap'>
            <div className='mb-1'>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs="auto">
                            <Form.Control
                                type="date"
                                placeholder="Buscar"
                                name="dateStart"
                                className=""
                                onChange={handleDates}
                                value={String(dates.dateStart)}
                            />
                        </Col>
                        <Col xs="auto">
                            <Form.Control
                                type="date"
                                placeholder="Buscar"
                                name="dateEnd"
                                className=""
                                onChange={handleDates}
                                value={String(dates.dateEnd)}
                            />
                        </Col>
                        <Col xs="auto">
                            <Button type="submit">Buscar</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            {loading ? <Spinner/> : <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th className=''>Fecha y Hora</th>
                        <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => <tr role="button" onClick={() => handleDetail(order.id)} key={String(order.id)}>
                        <td>{order.id}</td>
                        <td>{order.date}</td>
                        <td>${order.amount.toFixed(2)}</td>
                    </tr>

                    )}
                    {show &&
                        <CustomModal title="Detalle de compra">
                            <OrderDetail orderId={currentOrder} />
                        </CustomModal>
                    }
                </tbody>
            </Table>}
        </div>
    )
}

export default OrdersList