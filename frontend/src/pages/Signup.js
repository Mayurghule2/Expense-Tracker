import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';

function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('name, email and password are required')
        }
        try {
            const url = `${APIUrl}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login')
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
        <div className='container text-gray-300 '>
            <div>
            <h1 className='text-2xl lg:text-4xl font-semibold flex items-center justify-center pt-4 text-gray-400 w-screen'>SignUp</h1>
            </div>

            <div className='flex items-start justify-center w-screen'>
            <form
             onSubmit={handleSignup}
             className=' pt-5 w-1/3'>
                <div className='text-start mb-2'>
                    <label
                     htmlFor='name'
                     className=' font-medium text-xl block'>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        autoFocus
                        placeholder='Enter your name...'
                        value={signupInfo.name}
                        className='border border-gray-300 caret-slate-50 bg-gray-800 text-gray-300 text-sm rounded-lg p-2 w-full'
                    />
                </div>
                <div className='text-start mb-2'>
                    <label
                     htmlFor='email'
                     className=' font-medium text-xl block'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={signupInfo.email}
                        className='border border-gray-300 caret-slate-50 bg-gray-800 text-gray-300 text-sm rounded-lg p-2 w-full'
                    />
                </div>
                <div className='text-start mb-2'>
                    <label
                     htmlFor='password'
                     className=' font-medium text-xl block'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={signupInfo.password}
                        className='border border-gray-300 caret-slate-50 bg-gray-800 text-gray-300 text-sm rounded-lg p-2 w-full'
                    />
                </div>
                <button
                 type='submit'
                 className='w-full bg-purple-600 rounded-lg px-2 py-2 text-white font-semibold hover:bg-purple-800'>Signup</button>
                <span className='p-2 flex justify-between'>Already have an account ?
                    <Link
                     to="/login"
                     className='px-1 font-semibold text-blue-400 underline'>Login</Link>
                </span>
            </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Signup