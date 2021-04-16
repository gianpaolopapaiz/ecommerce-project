import React, {useState, useEffect} from 'react';

export const RegisterPage = () => {
    
    const [formStatus, setFormStatus] = useState('');
    const [user , setUser] = useState({
        userFirstName : "",
        userLastName : "",
        userEmail: "",
        userUserName: "",
        userPassword: "",
        userConfirmPassword: ""
    });

    const handleChange = (e) => {
        const {id , value} = e.target   
        setUser(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (user.userPassword === user.userConfirmPassword) {
            setFormStatus("Registering...");
            console.log('register');
            sendUserToDB();
        } else {
            setFormStatus("Password doesn't match!");
        }
    }

    const sendUserToDB = () => {
        fetch('http://localhost:4000/register', {
            
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
              },
            method: 'POST',
            body: JSON.stringify({userToAdd: user})
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Request Failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
            console.log(jsonResponse);
        })
    };    

    
    /*
    async function sendUserToDB() {
        try {
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                body: JSON.stringify(user)
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                //code
            }
            throw new Error('Resquest Failed!');
        } catch (error) {
            console.log(error);
        }   
    };*/

    return (
        <div className='login-page'>
            <form className='login-form'>
                <h2>Register</h2>
                <label className="form-label" for='user-first-name'>First Name:* </label>
                <input 
                    id='userFirstName' 
                    type="text" 
                    name="user-first-name" 
                    onChange={handleChange}
                    required />
                <p></p>
                <label className="form-label" for='user-last-name'>Last Name:* </label>
                <input 
                    id='userLastName' 
                    type="text" 
                    name="user-last-name" 
                    onChange={handleChange}
                    required/>
                <p></p>
                <label className="form-label" for='user-email'>E-mail:* </label>
                <input
                    id='userEmail'
                    type="text" 
                    name="user-email" 
                    onChange={handleChange}
                    required/>
                <p></p> 
                <label className="form-label" for='user-username'>Username (max 20 chars):* </label>
                <input 
                    id ='userUserName' 
                    type="text" 
                    name="user-username" 
                    maxLength="20" 
                    onChange={handleChange}
                    required/>
                <p></p>
                <label className="form-label" for='user-password'>Password (min 8 and max 20 chars):*  </label>
                <input 
                    id ='userPassword' 
                    type="password" 
                    name="user-password" 
                    minLength="8" 
                    maxLength="20" 
                    onChange={handleChange}
                    required/>
                <p></p>
                <label className="form-label" for='user-confirm-password'>Confirm Password:*  </label>
                <input 
                    id ='userConfirmPassword' 
                    type="password" 
                    name="user-confirm-password" 
                    minLength="8" 
                    maxLength="20" 
                    onChange={handleChange}
                    required/>
                <p></p>
                <input 
                    className='form-submit' 
                    type="submit" 
                    value="Register"
                    onClick={handleSubmitClick}  
                ></input>
                <p>{formStatus}</p>
                <a className='link' href='/login'>Login</a>
            </form>
        </div>
    )
};