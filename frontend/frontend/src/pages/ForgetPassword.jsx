import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import { ClipLoader } from "react-spinners"

function ForgetPassword() {
    const [step, setStep] = useState(1)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [conPassword, setConNewPassword] = useState("")
    const [loading, setLoading] = useState(false)

    //Step 1
    const sendOtp = async (req, res) => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/sendotp", { email },
                { withCredentials: true }
            )
            console.log(result.data)
            setLoading(false)
            setStep(2)
            toast.success(result.data.message)

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
            setLoading(false)
        }
    }

    //step 2
    const VerifyOTP = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/verifyotp", { email, otp },
                { withCredentials: true }
            )
            console.log(result.data)
            setLoading(false)
            setStep(3)
            toast.success(result.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
            setLoading(false)
        }
    }

    //step 3
    const resetPassword = async () => {
        setLoading(true)
        try {
            if (newPassword !== conPassword) {
                return toast.error("Password is not matched")
            }
            const result = await axios.post(serverUrl + "/api/auth/resetpassword", { email, password: newPassword },
                { withCredentials: true }
            )
            console.log(result.data)
            setLoading(false)
            navigate("/login")
            toast.success(result.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
            {/*Step 1 */}
            {
                step == 1 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
                    <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
                        Forget Your Password
                    </h2>
                    <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
                        <div>
                            <label htmlFor="email" className='block tex-sm font-medium text-gray-700'>Enter your email address</label>
                            <input id='email' type="text"
                                className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
                    focus:ring-2 focus:ring-[black]'
                                placeholder='you@example.com'
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                        <button
                            className='w-full px-4 py-2  text-white rounded-md font-medium cursor-pointer
                     bg-[black] hover:bg-[#4b4b4b]'
                            onClick={sendOtp}
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={30} color='white' /> : "Send OTP"}</button>
                    </form>
                    <div className='text-sm text-center mt-4 cursor-pointer'
                        onClick={() => navigate("/login")}> Back to login

                    </div>

                </div>
            }
            {/*Step 2 */}
            {
                step == 2 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
                    <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
                        Enter OTP
                    </h2>
                    <form action="" className='space-y-4' onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label htmlFor="otp" className='block tex-sm font-medium text-gray-700'>Enter  the 4 digit code
                                sent to your email address</label>
                            <input id='otp' type="text"
                                className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
                    focus:ring-2 focus:ring-[black]'
                                placeholder='* * * *'
                                required
                                onChange={(e) => setOtp(e.target.value)}
                                value={otp}
                            />
                        </div>
                        <button
                            className='w-full px-4 py-2  text-white rounded-md font-medium cursor-pointer
                        bg-[black] hover:bg-[#4b4b4b]'
                            onClick={VerifyOTP} disabled={loading}>
                            {loading ? <ClipLoader size={30} color='white' /> : "Verify OTP"}</button>
                    </form>
                    <div className='text-sm text-center mt-4 cursor-pointer'
                        onClick={() => navigate("/login")}> Back to login

                    </div>

                </div>
            }
            {/*Step 3 */}
            {
                step == 3 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
                    <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
                        Reset your Password
                    </h2>
                    <p className='text-sm text-gray-500 text-center mb-6'>
                        Enter a new password below to regain access to your account.
                    </p>
                    <form onSubmit={(e)=>e.preventDefault()} className='space-y-4'>
                        <div>
                            <label htmlFor="password" className='block tex-sm font-medium text-gray-700'>New Password</label>
                            <input id='password' type="text"
                                className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
                    focus:ring-2 focus:ring-[black]'
                                placeholder='********'
                                required
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                            />
                            <label htmlFor="password" className='block tex-sm font-medium text-gray-700'>Confirm Password</label>
                            <input id='conpassword' type="text"
                                className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
                    focus:ring-2 focus:ring-[black]'
                                placeholder='********'
                                required
                                onChange={(e) => setConNewPassword(e.target.value)}
                                value={conPassword}
                            />
                        </div>
                        <button
                            className='w-full px-4 py-2  text-white rounded-md font-medium cursor-pointer
                     bg-[black] hover:bg-[#4b4b4b]'
                     onClick={resetPassword} disabled={loading} >
                           {loading ? <ClipLoader size={30} color='white' /> : "Reset Password"}</button>
                    </form>
                    <div className='text-sm text-center mt-4 cursor-pointer'
                        onClick={() => navigate("/login")}> Back to login

                    </div>

                </div>
            }




        </div>
    )
}

export default ForgetPassword