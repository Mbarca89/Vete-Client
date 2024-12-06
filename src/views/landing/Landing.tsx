import './Landing.css'
import { axiosWithoutToken } from '../../utils/axiosInstances';
import { userLogin } from '../../types';
import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil"
import { userState, logState } from "../../app/store"
import { notifyError } from '../../components/Toaster/Toaster';
import handleError from '../../utils/HandleErrors';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Landing = () => {
    const navigate = useNavigate()
    const [user, setUser] = useRecoilState(userState)
    let [isLogged, setLogged] = useRecoilState(logState)

    useEffect(() => {
        if (isLogged) {
            navigate("/home")
        }
    }, [isLogged])

    const [userData, setUserData] = useState<userLogin>({
        userName: "",
        password: "",
        remember: false
    })

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setUserData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            }
        })
    }

    const loginHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const res = await axiosWithoutToken.post(`${SERVER_URL}/auth/login`, userData)
            if (res.data) {
                setUser({
                    id: res.data.id,
                    name: res.data.name,
                    surname: res.data.surname,
                    userName: res.data.userName,
                    role: res.data.role[0].authority
                })
                localStorage.setItem("token", res.data.token)
                if (userData.remember) {
                    localStorage.setItem("token", res.data.token)
                    localStorage.setItem("userName", res.data.userName)
                    localStorage.setItem("role", res.data.role[0].authority)
                    localStorage.setItem("id", res.data.id)
                    localStorage.setItem("name", res.data.name)
                    localStorage.setItem("surname", res.data.surname)
                }
                setLogged(true)
                navigate("/home")
            }

        } catch (error: any) {
            handleError(error)
        }

    }

    return (
        <div className='landing'>
            <div className="loginCard">
                <h4 className="title">Iniciar sesión</h4>
                <form onSubmit={loginHandler}>
                    <div className="field">
                        <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                        <input autoComplete="off" id="logemail" placeholder="Usuario" className="input-field" name="userName" type="text" value={userData.userName.toString()} onChange={changeHandler} />
                    </div>
                    <div className="field">
                        <svg className="input-icon" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                            <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path></svg>
                        <input autoComplete="off" id="logpass" placeholder="Contraseña" className="input-field" name="password" type="password" value={userData.password.toString()} onChange={changeHandler} />
                    </div>
                    <div className="field d-flex justify-content-start">
                        <input autoComplete="off" id="remember" name="remember" type="checkbox" checked={userData.remember} onChange={changeHandler} />
                        <span className='' style={{ color: "gray" }}>Recordarme</span>
                    </div>
                    <button className="loginbtn" type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Landing