import { useState } from "react"
import { Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { useRecoilState } from "recoil"
import { modalState } from "../../app/store"
import { axiosWithoutToken, axiosWithToken } from "../../utils/axiosInstances"
import handleError from "../../utils/HandleErrors"
import { notifySuccess } from "../Toaster/Toaster"
import axios from "axios"
const WASERVER_URL = import.meta.env.VITE_REACT_APP_WASERVER_URL;

interface SendPrescriptionProps {
    image: string | null
}

const SendPrescription: React.FC<SendPrescriptionProps> = ({ image }) => {

    const [phone, setPhone] = useState<string>("")
    const [show, setShow] = useRecoilState(modalState)
    const [loading, setLoading] = useState<boolean>(false)

    const sendImg = async () => {
        const body = {
            number: "549" + phone,
            file: image?.split(",")[1],
            mimeType: "image/png"
        }
        setLoading(true)
        try {
            const res = await axiosWithoutToken.post(`${WASERVER_URL}/ws/sendFile`, body, { headers: { "Content-Type": "application/json" }, withCredentials: true })
            notifySuccess("Receta enviada correctamente")
        } catch (error) {
            console.log(error)
            handleError(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div>
            <Form noValidate>
                <Row className="mb-2">
                    <Form.Group as={Col} xs={12} md={6}>
                        <Form.Label>Teléfono (+54)</Form.Label>
                        <Form.Control type="text"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Form.Group>
                </Row>
                {image && <img className="w-100" src={image} alt="" />}
                <Row>
                    <div className="d-flex justify-content-center mt-5 gap-3">
                        <Button className="" variant="danger" onClick={() => setShow(false)}>
                            Cancelar
                        </Button>
                        {!loading ?
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="primary" onClick={sendImg}>
                                    Enviar
                                </Button>
                            </div> :
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Spinner />
                            </div>}

                    </div>
                </Row>
            </Form>
        </div>
    )
}

export default SendPrescription