import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { pet } from "../../types"
import noImage from "../../assets/noImage.png"
import { useNavigate } from "react-router-dom"
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
interface PetDetailProps {
    pet: pet
}

const PetDetailCard: React.FC<PetDetailProps> = ({ pet }) => {
    const [show, setShow] = useRecoilState(modalState)

    const navigate = useNavigate()
    const today = new Date();
    const bornDate = new Date(pet.born);

    let age = today.getFullYear() - bornDate.getFullYear();

    if (today.getMonth() < bornDate.getMonth() ||
        (today.getMonth() === bornDate.getMonth() && today.getDate() < bornDate.getDate())) {
        age--;
    }

    return (
        <div>
            <Form noValidate>
                <Row>
                    <img role="button" onClick={() => { navigate(`/pets/detail/${pet.id}`); setShow(false) }} className="m-auto w-50" src={pet.photo ? `data:image/jpeg;base64,${pet.photo}` : noImage} alt="" />
                </Row>
                <Row className="mb-2">
                    <Form.Group as={Col}>
                        <Form.Label>Dueño</Form.Label>
                        <Form.Control type="text"
                            value={pet.ownerName}
                            disabled
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group as={Col}>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text"
                            value={pet.name}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Raza</Form.Label>
                        <Form.Control type="text"
                            value={pet.race}
                            disabled
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>Especie</Form.Label>
                        <Form.Control type="text"
                            value={pet.species}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Género</Form.Label>
                        <Form.Control type="text"
                            value={pet.gender}
                            disabled
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group as={Col}>
                        <Form.Label>Peso (kg)</Form.Label>
                        <Form.Control type="number"
                            value={pet.weight}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Edad</Form.Label>
                        <Form.Control type="text"
                            value={`${age} años`}
                            disabled
                        />
                    </Form.Group>
                </Row>
            </Form>
        </div>
    )
}

export default PetDetailCard