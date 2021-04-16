//import './LoginPage.css';

export const RegisterPage = () => {
    return (
        <div className='login-page'>
           
            <form className='login-form'>
                <h2>Register</h2> 
                <label className="form-label" for='user-username'>Username:* </label>
                <input type="text" name="user-username" />
                <p></p>
                <label className="form-label" for='user-password'>Password:*  </label>
                <input type="text" name="user-password" />
                <p></p>
                <input className='form-submit' type="submit" value="Register"></input>
                <p></p>
                <a className='link' href='/login'>Login</a>
            </form>
        </div>
    )
};