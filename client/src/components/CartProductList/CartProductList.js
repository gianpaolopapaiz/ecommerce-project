
export const CartProductList = (props) => {
    const cartTotal = props.cartTotal
    const cartProductArr = props.cartProductArr
    return (
    <div>        
        <table >
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
            {cartProductArr.map(cartProduct => {
                return (
                    <tr>
                        <td>{cartProduct.product_name}</td>
                        <td>{cartProduct.product_price}</td>
                        <td>{cartProduct.quantity}</td>
                        <td>{cartProduct.total}</td>
                    </tr>
                )     
            })}
        </table>
        <h3>TOTAL: {cartTotal}</h3>
    </div>
    )

}