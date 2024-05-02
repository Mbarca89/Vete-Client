import './Home.css'
import logo from "../../assets/logook.png"
import { useRecoilState } from "recoil"
import { userState, logState } from "../../app/store"

const Home = () => {

    const [user, setUser] = useRecoilState(userState)

    return (
        <div className='container flex-grow-1 d-flex align-items-center justify-content-center'>
                <img className='w-50 custom-img' src={logo} alt="" />
        </div>

    )
}

export default Home



