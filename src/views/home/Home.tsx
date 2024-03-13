import './Home.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from "../../assets/logook.png"

const Home = () => {

    return (
        <div className='container flex-grow-1 d-flex align-items-center justify-content-center'>
                <img className='w-50' src={logo} alt="" />
        </div>

    )
}

export default Home



