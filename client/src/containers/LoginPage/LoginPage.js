import './LoginPage.css';

export const LoginPage = () => {
    return (
        <div className='login-page'>
           
            <form className='login-form'>
                <h2>Log In</h2> 
                <label className="form-label" for='user-username'>Username:* </label>
                <input type="text" name="user-username" required />
                <p></p>
                <label className="form-label" for='user-password'>Password:*  </label>
                <input type="text" name="user-password" required />
                <p></p>
                <input className='form-submit' type="submit" value="Login"></input>
                <p></p>
                <a className='link' href='/register'>Register</a>
            </form>
        </div>
    )
};