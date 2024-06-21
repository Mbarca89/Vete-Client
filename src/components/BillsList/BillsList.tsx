import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import { bill, sale } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import { notifyError } from '../Toaster/Toaster';
import PrintBill from '../PrintBill/PrintBill';
import CustomModal from '../Modal/CustomModal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import handleError from '../../utils/HandleErrors';
import { Spinner } from 'react-bootstrap';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const BillsList = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [bills, setBills] = useState<bill[]>([])
    const [show, setShow] = useRecoilState(modalState)
    const [currentBill, setCurrentBill] = useState("")

    const currentDate = new Date();
    const [dates, setDate] = useState({
        dateStart: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
        dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
    })

    const getBills = async () => {
        setLoading(true)
        try {
            const startDate = new Date(dates.dateStart);
            const endDate = new Date(dates.dateEnd);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken(`${SERVER_URL}/api/v1/bills/getBillByDate?dateStart=${formattedStartDate}&dateEnd=${formattedEndDate}`)
            if (res.data) {
                setBills(res.data)
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
        getBills()
    }

    const handleDetail = (billId: string) => {
        setCurrentBill(billId)
        setShow(true)
    }


    useEffect(() => {
        getBills()
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
                        <th>Fecha</th>
                        <th>Número</th>
                        <th>Tipo</th>
                        <th>Monto total</th>
                        <th>Estado</th>
                        <th>Imprimir</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map(bill => <tr role="button" onClick={() => handleDetail(bill.id)} key={String(bill.id)}>
                        <td>{bill.id}</td>
                        <td>{`${bill.fecha.split("T")[0].slice(8, 10)}/${bill.fecha.split("T")[0].slice(5, 7)}/${bill.fecha.split("T")[0].slice(0, 4)}`}</td>
                        <td>{`0006-${bill.numero.toString().padStart(8, "0")}`}</td>
                        <td>{bill.tipo == "1" ? "A" : "B"}</td>
                        <td>${bill.importeTotal}</td>
                        <td>{bill.estado}</td>
                        <td><svg width="25" height="25" viewBox="0 0 512 512" style={{color:"#632f6b"}} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 48 48" fill="#632f6b" x="0" y="0" role="img" style={{display:"inline-block;vertical-align:middle"}} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M10 6a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v38l-7-5l-7 5l-7-5l-7 5V6Zm8 16h12m-12 8h12M18 14h12"/></g></svg></svg></td>
                    </tr>

                    )}
                    {show &&
                        <CustomModal title="Reimprimir factura" fullscreen={true}>
                            <PrintBill billId={currentBill} />
                        </CustomModal>
                    }
                </tbody>
            </Table>}
        </div>
    )
}

export default BillsList