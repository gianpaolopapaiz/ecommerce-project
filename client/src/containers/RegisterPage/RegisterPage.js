import React, {useState} from 'react';

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
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        //check form input fields
        if (user.userFirstName === ''){
            setFormStatus("Enter a valid First Name!");
            return
        };
        if (user.userLastName === ''){
            setFormStatus("Enter a valid Last Name!");
            return
        };
        if (!user.userEmail.includes('@')){
            setFormStatus("Enter a valid Email Address!");
            return
        };
        if (user.userUserName === ''){
            setFormStatus("Enter a valid Username!");
            return
        };
        if (user.userUserName.length < 4){
            setFormStatus("Username too short!");
            return
        };
        if (user.userPassword.length < 8){
            setFormStatus("Password too short!");
            return
        };
        if (user.userPassword !== user.userConfirmPassword) {
            setFormStatus("Password confirmation doesn't match!");
            return
        };     
        setFormStatus("Registering...");
        console.log('register');
        registerUserOnDB();
    };  
    
    async function registerUserOnDB() {
        try {
            const response = await fetch('http://localhost:4000/register', {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                  },    
                method: 'POST',
                body: JSON.stringify({userToAdd: user})
            });
            const jsonResponse = await response.json();
            console.log(jsonResponse)
            setFormStatus(jsonResponse.message);
            //throw new Error('Resquest Failed!');
        } catch (error) {
            console.log(error);
        }   
    };

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
                <label className="form-label" for='user-username'>Username (min 4 and max 20 chars):* </label>
                <input 
                    id ='userUserName' 
                    type="text" 
                    name="user-username"
                    minLength="4" 
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