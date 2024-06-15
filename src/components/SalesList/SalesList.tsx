import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import { sale } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import { notifyError } from '../Toaster/Toaster';
import SaleDetail from '../SaleDetail/SaleDetail';
import CustomModal from '../Modal/CustomModal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import handleError from '../../utils/HandleErrors';
import { Spinner } from 'react-bootstrap';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const SalesList = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [sales, setSales] = useState<sale[]>([])
    const [show, setShow] = useRecoilState(modalState)
    const [currentSale, setCurrentSale] = useState("")

    const currentDate = new Date();
    const [dates, setDate] = useState({
        dateStart: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
        dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
    })

    const getSales = async () => {
        setLoading(true)
        try {
            const startDate = new Date(dates.dateStart);
            const endDate = new Date(dates.dateEnd);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken(`${SERVER_URL}/api/v1/sales/getByDate?dateStart=${formattedStartDate}&dateEnd=${formattedEndDate}`)
            if (res.data) {
                setSales(res.data)
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
        });
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        getSales()
    }

    const handleDetail = (saleId: string) => {
        setCurrentSale(saleId)
        setShow(true)
    }


    useEffect(() => {
        getSales()
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
                        <th>Vendedor</th>
                        <th>Monto</th>
                        <th>Costo</th>
                        <th>Facturar</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(sale => <tr role="button" onClick={() => handleDetail(sale.id)} key={String(sale.amount)}>
                        <td>{sale.id}</td>
                        <td>{sale.date}</td>
                        <td>{sale.seller}</td>
                        <td>${sale.amount.toFixed(2)}</td>
                        <td>${sale.cost.toFixed(2)}</td>
                        <td><svg width="25" height="25" viewBox="0 0 512 512" style={{color:"#632f6b"}} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" stroke-width="0" stroke-opacity="100%" paint-order="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 48 48" fill="#632f6b" x="0" y="0" role="img" style={{display:"inline-block;vertical-align:middle"}} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M10 6a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v38l-7-5l-7 5l-7-5l-7 5V6Zm8 16h12m-12 8h12M18 14h12"/></g></svg></svg></td>
                    </tr>

                    )}
                    {show &&
                        <CustomModal title="Detalle de venta">
                            <SaleDetail saleId={currentSale} />
                        </CustomModal>
                    }
                </tbody>
            </Table>}
        </div>
    )
}

export default SalesList