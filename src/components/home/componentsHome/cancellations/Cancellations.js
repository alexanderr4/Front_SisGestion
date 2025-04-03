function Cancellations(){
    return(
        <div className="cancellations">
            <h1>Cancellations</h1>
            <p>We are sorry to hear that you want to cancel your order. Please fill out the form below and we will process your cancellation as soon as possible.</p>
            <form>
                <label htmlFor="order-number">Order Number:</label>
                <input type="text" id="order-number" name="order-number" required />
                
                <label htmlFor="reason">Reason for Cancellation:</label>
                <select id="reason" name="reason" required>
                    <option value="">Select a reason</option>
                    <option value="changed-my-mind">Changed my mind</option>
                    <option value="found-a-better-price">Found a better price</option>
                    <option value="product-not-as-described">Product not as described</option>
                    <option value="other">Other</option>
                </select>

                <button type="submit">Submit Cancellation Request</button>
            </form>
        </div>
    )   
}

export default Cancellations;