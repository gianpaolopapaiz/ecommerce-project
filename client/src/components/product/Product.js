import './Product.css';

export const Product = (props) => {
    const product = props.product;
    const name = product.product_name;
    const description = product.product_description;
    const price = product.product_price;
    const stock = product.product_stock;
    const image = product.product_image;
    const imageLink = `/media/products/${image}`;
    return (
        <div className="product">
            <img className='product-image' src={imageLink} width='200' />
            <h4 className='product-name'>{name}</h4>
            <p className='product-description'>{description}</p>
            <p className='product-price'>{price}</p>
            <p className='product-stock'>Stock: {stock} un.</p>
            <button><a>Add to Cart</a></button>
        </div>
    )
};