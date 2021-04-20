import './NavBar.css';

export const NavBar = () => {
    return (
        <header>
            <p className='logo'>CLOTHECOMMERCE</p>
            <div className='headerMenu'>
                <ul>
                    <li><a href='/'>HOME</a></li>
                    <li><a href='/shop'>SHOP</a></li>
                    <li><a href='/cart'>CART</a></li>
                    <li><a href='/login'>USER</a></li>
                </ul>
            </div>
            
        </header>
    )
};