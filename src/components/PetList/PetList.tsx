import React, { useState, useEffect } from 'react';
import PetDetail from '../PetDetailCard/PetDetailCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import Pagination from 'react-bootstrap/Pagination';
import { pet } from '../../types';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError } from "../Toaster/Toaster";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import CustomModal from '../Modal/CustomModal';
import noImage from '../../assets/noImage.png'
import Spinner from 'react-bootstrap/Spinner';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const PetList = () => {
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useRecoilState(modalState)
    const [pets, setPets] = useState<pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<pet>({
        id: "",
        name: "",
        race: "",
        gender: "",
        species: "",
        weight: 0,
        born: "",
        photo: "",
        ownerName: ""
    })
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 12;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const getCount = async () => {
        try {
            const count = await axiosWithToken.get(`${SERVER_URL}/api/v1/pets/getPetCount`)
            if (count.data) {
                setTotalPages(Math.ceil(count.data / pageSize));
            }
        } catch (error:any) {
            notifyError(error.response.data)
        }
    }

    const fetchPets = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/pets/getPets?page=${currentPage}&size=${pageSize}`)
            if (res.data) {
                setPets(res.data);
            }
            setLoading(false)
        } catch (error: any) {
            notifyError(error.response.data)
            setLoading(false)
        }
    };

    const handleDetail = (pet: pet) => {
        setSelectedPet(pet)
        setShow(!show)
    }

    useEffect(() => {
        fetchPets();
    }, [currentPage]);

    useEffect(() => {
        getCount();
    }, []);

    return (
        <div>
            <Container>
                {loading ? <Row xs={2} md={3} lg={6} className="g-4">
                    {pets.map(pet => (
                        <Col key={pet.id}>
                            <Card style={{ height: '100%' }} onClick={() => handleDetail(pet)}>
                                <Card.Img style={{ height: '150px' }} className='custom-card-img' variant="top" src={pet.photo ? `data:image/jpeg;base64,${pet.photo}` : noImage} alt={pet.name} />
                                <Card.Body className='d-flex flex-column justify-content-end'>
                                    <Card.Title className=''>{pet.name}</Card.Title>
                                    <Card.Text>{pet.race}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row> : <div className='mt-5'>
                    <Spinner />
                </div>}
                <div className='d-flex m-auto justify-content-center'>
                    <Pagination className='mt-5'>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        <Pagination.Item>{1}</Pagination.Item>
                        <Pagination.Ellipsis />
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Ellipsis />
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            </Container>
            {show &&
                <CustomModal title={selectedPet.name}>
                    <PetDetail pet={selectedPet} />
                </CustomModal>
            }
        </div>
    )
}

export default PetList;