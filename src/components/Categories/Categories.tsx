import React, { useState, useEffect } from 'react';
import ProductDetail from '../ProductDetail/ProductDetail';
import CreateCategory from '../CreateCategory/CreateCategory';
import DeleteCategory from '../DeleteCategory/DeteleCategory';
import { Container, Row, Col, DropdownButton, Dropdown, Pagination, Spinner, Card } from 'react-bootstrap';
import { product } from '../../types';
import { axiosWithToken } from "../../utils/axiosInstances";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import CustomModal from '../Modal/CustomModal';
import noImage from '../../assets/noImage.png'
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Categories = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const [products, setProducts] = useState<product[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string>("")
    const [categories, setCategories] = useState<string[]>([])
    const [deleteCategory, setDeleteCategory] = useState<string>("")
    const [modal, setModal] = useState<string>("")
    const [selectedProduct, setSelectedProduct] = useState<product>({
        id: 0,
        name: "",
        description: "",
        barCode: 0,
        cost: 0,
        price: 0,
        stock: 0,
        categoryId: 0,
        categoryName: "",
        providerName: "",
        stockAlert: false,
        published: false,
        image: "",
        thumbnail: "",
    })
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const pageSize = 12;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const getCategory = async () => {
        try {
            const categoriesResponse = await axiosWithToken.get<string[]>(`${SERVER_URL}/api/v1/category/getCategoriesNames`)
            if (categoriesResponse.data) {
                setCategories(categoriesResponse.data.sort())
                setCurrentCategory(categoriesResponse.data[0])
            }
        } catch (error: any) {
            handleError(error)
        }
    }

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/products/getByCategory?categoryName=${currentCategory}&page=${currentPage}&size=${pageSize}`)
            if (res.data) {
                setTotalPages(Math.ceil(res.data.totalCount / pageSize));
                setProducts(res.data.data);
            }
            setLoading(false)
        } catch (error: any) {
            handleError(error)
            setLoading(false)
        }
    };

    const handleDetail = (product: product) => {
        setSelectedProduct(product)
        setModal("productDetail")
        setShow(!show)
    }

    const deleteCategoryHandler = (category: string) => {
        setDeleteCategory(category)
        setModal("deleteCategory")
        setShow(!show)
    }

    const createCategoryHandler = () => {
        setShow(!show)
        setModal("createCategory")
    }

    useEffect(() => {
        fetchProducts()
    }, [currentPage])

    useEffect(() => {
        if (currentCategory) {
            fetchProducts()
        }
    }, [currentCategory])

    useEffect(() => {
        getCategory()
    }, [])

    return (
        <div>
            <Container>
                {!loading ? <div>

                    <Row>
                        <DropdownButton id="dropdown-basic-button" title={currentCategory ? currentCategory : "No hay categorías"}>
                            <Dropdown.Item onClick={createCategoryHandler} className='d-flex justify-content-between align-items-center px-2'>
                                <svg width="15" height="15" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg>
                                <span>Nueva categoria</span>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            {categories.map(category =>
                                <Dropdown.Item className='d-flex justify-content-between align-items-center' onClick={() => (setCurrentCategory(category))} key={category}>
                                    {category}
                                    <svg onClick={() => deleteCategoryHandler(category)} width="15" height="15" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" fillRule="evenodd" d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" /></g></svg></svg>
                                </Dropdown.Item>
                            )}
                        </DropdownButton>
                    </Row>
                    <Row xs={2} md={3} lg={6} className="g-4 mt-1">
                        {products.map(product => (
                            <Col key={product.id}>
                                <Card style={{ height: '100%' }} onClick={() => handleDetail(product)}>
                                    <Card.Img style={{ height: '150px', width: "auto", objectFit: "contain" }} className='custom-card-img p-1' variant="top" src={product.thumbnail ? `data:image/jpeg;base64,${product.thumbnail}` : noImage} alt={product.name} />
                                    <Card.Body className='d-flex flex-column justify-content-end'>
                                        <Card.Title className=''>{product.name}</Card.Title>
                                        <Card.Text>{product.categoryName}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div> : <div className='mt-5'>
                    <Spinner />
                </div>}
                <div className='d-flex m-auto justify-content-center'>
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
            {show && modal == "productDetail" &&
                <CustomModal title={selectedProduct.name}>
                    <ProductDetail productId={selectedProduct.id} updateList={fetchProducts} />
                </CustomModal>
            }
            {show && modal == "createCategory" &&
                <CustomModal title={"Crear categoría"}>
                    <CreateCategory getCategory={getCategory} />
                </CustomModal>
            }
            {show && modal == "deleteCategory" &&
                <CustomModal title={"Eliminar categoría"}>
                    <DeleteCategory category={deleteCategory} getCategory={getCategory} />
                </CustomModal>
            }
        </div>
    )
}

export default Categories