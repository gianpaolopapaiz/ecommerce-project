
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
            <img src={imageLink} width='200' />
            <h4>{name}</h4>
            <p>{description}</p>
            <p>{price}</p>
            <p>{stock}</p>
        </div>
    )
};