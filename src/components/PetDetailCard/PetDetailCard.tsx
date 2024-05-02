import { Card, Button } from "react-bootstrap"
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
            <Card>
                <Card.Header>
                    <Card.Img onClick={() => {navigate(`/pets/detail/${pet.id}`); setShow(false)}} style={{ height: '150px' }} className='custom-card-img' variant="top" src={pet.photo ? `data:image/jpeg;base64,${pet.photo}` : noImage} alt={pet.name} />
                </Card.Header>
                <Card.Body>
                    <ul className="p-0">
                        <li className="d-flex align-items-center">
                            <h6 className="m-0">Raza:&nbsp;</h6>
                            {pet.race}
                        </li>
                        <li className="d-flex align-items-center">
                            <h6 className="m-0">Sexo:&nbsp;</h6>
                            {pet.gender}
                        </li>
                        <li className="d-flex align-items-center">
                            <h6 className="m-0">Especie:&nbsp;</h6>
                            {pet.species}
                        </li>
                        <li className="d-flex align-items-center">
                            <h6 className="m-0">Peso:&nbsp;</h6>
                            {pet.weight} Kg
                        </li>
                        <li className="d-flex align-items-center">
                            <h6 className="m-0">Edad:&nbsp;</h6>
                            {pet.born ? `${age} (Fecha de nacimiento: ${pet.born})` : "No disponible"}
                        </li>
                    </ul>
                </Card.Body>
            </Card>
        </div>
    )
}

export default PetDetailCard