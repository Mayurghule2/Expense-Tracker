import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }
        try {
            const url = `${APIUrl}/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <div className='container text-gray-300'>
            <div className=''>
            <h1 className='text-2xl lg:text-4xl font-semibold text-center p-4 text-gray-400 w-screen'>Login</h1>
            </div>
            <div className='flex items-start justify-center w-screen'>
            <form
             onSubmit={handleLogin}
             className=' pt-5 w-1/3'>
                <div className='text-start mb-2'>
                    <label
                     htmlFor='email' 
                     className=' font-medium text-xl block'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                        className='border border-gray-300 caret-slate-50 bg-gray-800 text-gray-300 text-sm rounded-lg p-2 w-full'
                    />
                </div>
                <div className='text-start mb-2'>
                    <label
                     htmlFor='password'
                     className='font-medium text-xl block'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                        className='border border-gray-300 caret-slate-50 bg-gray-800 text-gray-300 text-sm rounded-lg p-2 w-full'
                    />
                </div>
                <button
                 type='submit'
                 className='w-full bg-purple-600 rounded-lg px-2 py-2 text-white font-semibold hover:bg-purple-800'>Login</button>
                <span className='flex justify-between p-2'>Does't have an account ?  
                    <Link to="/signup" className='px-3 font-semibold hover:underline hover:text-blue-400 '>SignUp</Link>
                </span>
            </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login