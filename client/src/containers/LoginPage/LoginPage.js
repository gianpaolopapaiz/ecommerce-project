import React, {useState} from 'react';
import { Redirect } from 'react-router';
import './LoginPage.css';

export const LoginPage = () => {

    const [cookieStatus, setCookieStatus] = useState(false);
    const [formStatus, setFormStatus] = useState('');
    const [user , setUser] = useState({
        userUserName: "",
        userPassword: "",
    });

    useState(checkCookie(),[]);

    async function checkCookie() {
        try {
            const response = await fetch('http://localhost:4000/validateCookie', {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include',   
                method: 'POST'
            });
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            if (jsonResponse.message === 'Authorized') {
                console.log('Cookie Authorized');
                setCookieStatus(true);
            } else {
                console.log('Not Authorized');
                setCookieStatus(false);
            }

        } catch (error) {
            console.log(error);
        }   
    };


    const handleChange = (e) => {
        const {id , value} = e.target   
        setUser(prevState => ({
            ...prevState,
            [id] : value
        }))
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        //check form input fields
        if (user.userUserName === ''){
            setFormStatus("Enter a valid Username!");
            return
        };
        if (user.userPassword === ''){
            setFormStatus("Enter a valid Password!");
            return
        };
        setFormStatus("Loging in...");
        console.log('Loging in...');
        logIn();
    };

    async function logIn() {
        try {
            const response = await fetch('http://localhost:4000/login', {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include',   
                method: 'POST',
                body: JSON.stringify({credential: user})
            });
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            setFormStatus(jsonResponse.message);
            console.log(formStatus);
        } catch (error) {
            console.log(error);
        }   
    };

    if (formStatus === "Logged In!" || cookieStatus === true) {
        console.log('inside');
        return <Redirect to="/user"/>
    };

    return (
        <div className='login-page'>
           
            <form className='login-form'>
                <h2>Log In</h2> 
                <label className="form-label" for='user-username'>Username:* </label>
                <input
                    id='userUserName' 
                    type="text" 
                    name="user-username" 
                    onChange={handleChange}
                    required />
                <p></p>
                <label className="form-label" for='user-password'>Password:*  </label>
                <input
                    id='userPassword' 
                    type="password" 
                    name="user-password" 
                    onChange={handleChange}
                    required />
                <p></p>
                <input 
                    className='form-submit' 
                    type="submit" 
                    value="Login"
                    onClick={handleSubmitClick}
                ></input> 
                <p>{formStatus}</p>
                <a className='link' href='/register'>Register</a>
            </form>
            <button onClick={checkCookie}>teste</button>
        </div>
    )
};