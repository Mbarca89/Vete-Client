import React, { useState, useEffect } from 'react';
import PetDetailCard from '../../components/PetDetailCard/PetDetailCard';
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
import Spinner from 'react-bootstrap/Spinner';
import handleError from '../../utils/HandleErrors';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const Pets = () => {
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
        thumbnail: "",
        ownerName: ""
    })
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 12;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const fetchPets = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/pets/getPets?page=${currentPage}&size=${pageSize}`)
            if (res.data) {
                setTotalPages(Math.ceil(res.data.totalCount / pageSize));
                setPets(res.data.data);
            }
            setLoading(false)
        } catch (error: any) {
            handleError(error)
            setLoading(false)
        }
    };

    const handleDetail = (pet: pet) => {
        setSelectedPet(pet)
        setShow(!show)
    }

    const handleSearch = async (event: any) => {
        setLoading(true)
        let searchTerm
        event.preventDefault()
        if (event.type == "submit") searchTerm = event.target[0].value
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/pets/getPetsByName?name=${searchTerm}&page=1&size=${pageSize}`)
            if (res.data) {
                setPets(res.data);
            }
            setLoading(false)
        } catch (error: any) {
            handleError(error)
            setLoading(false)
        }
    }

    const handleResetSearch = (event: any) => {
        if (event.target.value == "") fetchPets()
    }

    useEffect(() => {
        fetchPets();
    }, [currentPage]);

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <Container>
                <Navbar className="justify-content-between">
                    <Form onSubmit={handleSearch}>
                        <Row>
                            <Col xs="auto">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar"
                                    className=" mr-sm-2"
                                    onChange={handleResetSearch}
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
                {!loading ? <Row xs={2} md={3} lg={6} className="g-4">
                    {pets.map(pet => (
                        <Col key={pet.id}>
                            <Card className='' style={{ height: '100%' }} onClick={() => handleDetail(pet)}>
                                <Card.Img style={{ height: '150px', width: "auto", objectFit: "contain" }} className='rounded p-1' variant="top" src={pet.thumbnail ? `data:image/jpeg;base64,${pet.thumbnail}` : noImage} alt={pet.name} />
                                <Card.Body className='d-flex flex-column justify-content-end'>
                                    <Card.Title className=''>{pet.name}</Card.Title>
                                    <Card.Text>{pet.ownerName}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row> : <div className='mt-5'>
                    <Spinner />
                </div>}
                <div className='d-flex m-auto justify-content-center mt-5 w-50'>
                    <Pagination className='mt-5'>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {currentPage > 2 && <Pagination.Item
                            key={currentPage - 2}
                            onClick={() => handlePageChange(currentPage - 2)}
                        >
                            {currentPage - 2}
                        </Pagination.Item>}
                        {currentPage > 1 && <Pagination.Item
                            key={currentPage - 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            {currentPage - 1}
                        </Pagination.Item>}
                        <Pagination.Item
                            key={currentPage}
                            active
                            onClick={() => handlePageChange(currentPage)}
                        >
                            {currentPage}
                        </Pagination.Item>
                        {currentPage <= totalPages - 1 && <Pagination.Item
                            key={currentPage + 1}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            {currentPage + 1}
                        </Pagination.Item>}
                        {currentPage <= totalPages - 2 && <Pagination.Item
                            key={currentPage + 2}
                            onClick={() => handlePageChange(currentPage + 2)}
                        >
                            {currentPage + 2}
                        </Pagination.Item>}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            </Container>
            {show &&
                <CustomModal title={selectedPet.name}>
                    <PetDetailCard petId={selectedPet.id} updateList={fetchPets} />
                </CustomModal>
            }
        </div>
    )
}

export default Pets;