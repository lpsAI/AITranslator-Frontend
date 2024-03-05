import { useState } from 'react'
import LandingIntro from '../components/LandingIntro/LandingIntro'
import InputText from '../components/InputText/InputText'
import ErrorText from '../components/ErrorText/ErrorText'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'

const LoginScreen = () => {

    const INITIAL_LOGIN_OBJ = {
        password: "",
        email: ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)
    const [toLogin, setToLogin] = useState(true);
    const navigate = useNavigate();

    const { signUp, signIn } = useAuth()

    const submitForm = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        setLoading(true);

        if (loginObj.email.trim() === "") return setErrorMessage("Email Address is required!")
        if (loginObj.password.trim() === "") return setErrorMessage("Password is required!")
        else {
            if (toLogin) {
                const { data, error } = await signIn({
                    email: loginObj.email,
                    password: loginObj.password,
                })

                if (error) {
                    toast.error(error.message)
                } else {
                    toast.info(`User ${data.user.email} is logged in`)
                    location.href = '/';
                }

            } else {
                const { error } = await signUp({
                    email: loginObj.email,
                    password: loginObj.password,
                })

                if (error) {
                    toast.error(error.message)
                } else {
                    toast.info(`Check your email for the login link ${loginObj.email}`)
                    setLoginObj({
                        email: '',
                        password: ''
                    })
                    setToLogin(prev => !prev);
                }

            }
            // setLoading(true)
            // localStorage.setItem("token", "DumyTokenHere")
            // setLoading(false)
            // window.location.href = '/app/welcome'
            setLoading(false);
        }


    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setLoginObj({ ...loginObj, [updateType]: value })
    }

    const handleSwitch = () => {
        setToLogin(prev => !prev);
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center">
            <div className="mx-auto my-3 w-full max-w-5xl shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className=''>
                        <LandingIntro />
                    </div>
                    {toLogin && <div className='py-24 px-10'>
                        <h2 className='text-2xl font-semibold mb-2 text-center'>Login</h2>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="mb-4">
                                <InputText type="email" defaultValue={loginObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email Address" updateFormValue={updateFormValue} />

                                <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />

                            </div>
                            <div className='text-right text-primary'><span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span>
                            </div>
                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full btn-primary"}>
                                {loading ? <span className="loading loading-dots loading-md"></span> : 'Login'}
                            </button>

                        </form>
                        <div className='text-center mt-4'>Don{'\''}t have an account yet? <span onClick={() => setToLogin(prev => !prev)} className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</span></div>
                    </div>}
                    {!toLogin && <div className='py-24 px-10 bg-purple-300'>
                        <h2 className='text-2xl font-semibold mb-2 text-center'>Register</h2>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="mb-4">
                                <InputText type="email" defaultValue={loginObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email Address" updateFormValue={updateFormValue} />

                                <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />

                            </div>

                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full btn-primary"}>
                               {loading ? <span className="loading loading-dots loading-md"></span> : 'Register'}
                            </button>
                        </form>
                        <div className='text-center mt-4'><span onClick={() => handleSwitch()} className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Go to Login</span></div>
                    </div>}
                </div>
            </div>
        </div>
    )

}

export default LoginScreen
