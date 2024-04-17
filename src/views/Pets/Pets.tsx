import React, { useState, useEffect } from 'react';
import PetDetail from '../../components/PetDetailCard/PetDetailCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import Pagination from 'react-bootstrap/Pagination';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { pet } from '../../types';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../../components/Toaster/Toaster";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import CustomModal from '../../components/Modal/CustomModal';
import noImage from '../../assets/noImage.png'
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const Pets = () => {
    const [show, setShow] = useRecoilState(modalState)
    const [pets, setPets] = useState<pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<pet>({
        id: "",
        name: "",
        race: "",
        weight: 0,
        born: "",
        photo: ""
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
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    const fetchPets = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/pets/getPets?page=${currentPage}&size=${pageSize}`)
            if (res.data) {
                setPets(res.data);
            }
        } catch (error: any) {
            console.log(error.response.data)
            notifyError(error.response.data)
        }
    };

    const handleDetail = (pet: pet) => {
        setSelectedPet(pet)
        setShow(!show)
    }

    const handleSearch = async (event:any) => {
        event.preventDefault()
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/pets/getPetsByName?name=${event.target.value}&page=1&size=${pageSize}`)
            if (res.data) {
                setPets(res.data);
            }
        } catch (error:any) {
            console.log(error.response.data)
            notifyError(error.response.data)
        }
    }

    useEffect(() => {
        fetchPets();
    }, [currentPage]);

    useEffect(() => {
        getCount();
    }, []);

    return (
        <div className='container flex-grow-1 p-5 m-2 rounded custom overflow-auto'>
            <Container>
            <Navbar className="justify-content-between">
                <Form onSubmit={handleSearch}>
                    <Row>
                        <Col xs="auto">
                            <Form.Control
                                type="text"
                                placeholder="Buscar"
                                className=" mr-sm-2"
                                onChange={handleSearch}
                            />
                        </Col>
                        <Col xs="auto">
                            <Button type="submit">Buscar</Button>
                        </Col>
                    </Row>
                </Form>
            </Navbar>
            </Container>
            <Container>
                <Row xs={2} md={3} lg={6} className="g-4">
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
                </Row>
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

export default Pets;