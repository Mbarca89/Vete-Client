import "./NavBar.css"
import { useRecoilState } from "recoil"
import { userState } from "../../app/store"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavBar = () => {

    const [user, setUser] = useRecoilState(userState)

    return (
        <Container fluid className="p-0">
            <Navbar expand="lg" className="bg-body-tertiary nav_bar custom">
                <Container>
                    <Navbar.Brand>Veterinaria Del Parque</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/home">Inicio</Nav.Link>
                            <NavDropdown title="Administrar" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/users">Usuarios</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Reportes</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Facturacion</NavDropdown.Item>
                                {/* <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item> */}
                            </NavDropdown>
                            <Nav.Link href="#link">Proveedores</Nav.Link>
                            <Nav.Link href="#link">Productos</Nav.Link>
                            <Nav.Link href="#link">Clientes</Nav.Link>
                            <Nav.Link href="#link">Mascotas</Nav.Link>
                        </Nav>
                        <Navbar.Text>
                            Bienvenido {user.userName}!
                        </Navbar.Text>
                        <Nav.Link className="m-2" href="#link"> Salir</Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
    )
}

export default NavBar