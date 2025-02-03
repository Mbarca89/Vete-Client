import "./NavBar.css"
import { useRecoilState } from "recoil"
import { userState, logState } from "../../app/store"
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavBar = () => {

    const [user, setUser] = useRecoilState(userState)
    let [isLogged, setLogged] = useRecoilState(logState)
    const [expanded, setExpanded] = useState(false);

    const handleNavLinkClick = () => {
        setExpanded(false);
    };

    const navigate = useNavigate()

    const logOut = () => {
        setUser({
            id: "",
            name: "",
            surname: "",
            userName: "",
            role: ""
        })

        localStorage.clear()
        setLogged(false)
        navigate("/")
    }

    return (
        <Container fluid className="p-0">
            <Navbar expand="lg" className="bg-body-tertiary nav_bar custom" expanded={expanded}>
                <Container>
                    <Navbar.Brand>Veterinaria Del Parque</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => { navigate("/home"); handleNavLinkClick() }}>Inicio</Nav.Link>
                            <NavDropdown title="Administrar" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => { navigate("/users"); handleNavLinkClick() }}>Usuarios</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { navigate("/reports"); handleNavLinkClick() }}>Reportes</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { navigate("/graphs"); handleNavLinkClick() }}>Gráficos</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { navigate("/payments"); handleNavLinkClick() }}>Pagos</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { navigate("/providers"); handleNavLinkClick() }}>Proveedores</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { navigate("/billing"); handleNavLinkClick() }}>Facturacion</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link onClick={() => { navigate("/products"); handleNavLinkClick() }}>Productos</Nav.Link>
                            <Nav.Link onClick={() => { navigate("/clients"); handleNavLinkClick() }}>Clientes</Nav.Link>
                            <Nav.Link onClick={() => { navigate("/pets"); handleNavLinkClick() }}>Mascotas</Nav.Link>
                            <Nav.Link onClick={() => { navigate("/petReports"); handleNavLinkClick() }}>Informes</Nav.Link>
                            <Nav.Link onClick={() => { navigate("/prescription"); handleNavLinkClick() }}>Receta</Nav.Link>
                            <Nav.Link onClick={() => { navigate("/sale"); handleNavLinkClick() }}>Venta</Nav.Link>
                            <Nav.Link onClick={() => { navigate("/order"); handleNavLinkClick() }}>Compra</Nav.Link>
                            <Nav.Link onClick={() => { navigate("/whatsapp"); handleNavLinkClick() }}>Whatsapp</Nav.Link>
                        </Nav>
                        <hr />
                        <Navbar.Text>
                            Bienvenido {user.name}!
                        </Navbar.Text>
                        <Nav.Link className="m-2" onClick={logOut}> Salir</Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
    )
}

export default NavBar