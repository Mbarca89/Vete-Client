import './Home.css'
import logo from "../../assets/logook.png"
import Reminders from '../../components/Reminders/Reminders'
import StockAlerts from '../../components/StockAlerts/StockAlerts'

const Home = () => {

    return (
        <div className='h-75 container flex-grow-1 d-flex flex-column flex-md-row align-items-center justify-content-center p-lg-3 p-sm-0 m-2'>
            <div className='w-100 w-md-25 h-75 custom rounded z-2 p-1 overflow-auto'>
                <Reminders />
            </div>
            <img className='w-25 custom-img' src={logo} alt="" />
            <div className='w-100 w-md-25 h-75 custom rounded z-2 p-1 overflow-auto'>
                <StockAlerts />
            </div>
        </div>
    )
}

export default Home



