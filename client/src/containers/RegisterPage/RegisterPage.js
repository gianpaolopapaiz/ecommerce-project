export const RegisterPage = () => {
    return (
        <div className='login-page'>
           
            <form className='login-form'>
                <h2>Register</h2>
                <label className="form-label" for='user-first-name'>First Name:* </label>
                <input type="text" name="user-first-name" required />
                <p></p>
                <label className="form-label" for='user-last-name'>Last Name:* </label>
                <input type="text" name="user-last-name" required/>
                <p></p>
                <label className="form-label" for='user-email'>E-mail:* </label>
                <input type="text" name="user-email" required/>
                <p></p> 
                <label className="form-label" for='user-username'>Username (max 20 chars):* </label>
                <input type="text" name="user-username" maxLength="20" required/>
                <p></p>
                <label className="form-label" for='user-password'>Password (min 8 and max 20 chars):*  </label>
                <input type="text" name="user-password" minLength="8" maxLength="20" required/>
                <p></p>
                <label className="form-label" for='user-confirm-password'>Confirm Password:*  </label>
                <input type="text" name="user-confirm-password" minLength="8" maxLength="20" required/>
                <p></p>
                <input className='form-submit' type="submit" value="Register"></input>
                <p></p>
                <a className='link' href='/login'>Login</a>
            </form>
        </div>
    )
};