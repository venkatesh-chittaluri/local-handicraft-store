import React from 'react';
import './Cart.css';
import { useSelector } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { AiFillCaretLeft } from 'react-icons/ai';
import { AiFillCaretRight } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { removeProductFromCart } from '../../slices/userSlice.js';
import { incrementQuantityOfProduct } from '../../slices/userSlice.js';
import { decrementQuantityOfProduct } from '../../slices/userSlice.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../footer/Footer';
import { useNavigate } from 'react-router-dom';

function Cart() {

    let productsList = useSelector(state => state.users)

    let dispatch = useDispatch()

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }

    let navigate = useNavigate();

    const navigate12 = () => {
        navigate('/invoice')
    }

    const displayRazorpay = async () => {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?')
            return
        }

        let data;
        try {


            var body = {
                key: "rzp_test_pBr97twzdijv1J",
                secret: "OvOCDUDLguYCOOvlvaYqr2EF",
                amount: 40000

            };
            console.log(body);
            await axios.post("https://payment-gateway-02.herokuapp.com/order", body, {
                headers: { 'Access-Control-Allow-Origin': '*' }
            }
            ).then((response) => {
                // console.log(response);
                data = response.data;

            })
        } catch (err) {
            console.log(err)
        }

        const options = {
            key: 'rzp_test_pBr97twzdijv1J',
            amount: 40000,
            order_id: data,
            name: 'Donation',
            description: 'Thank you for nothing. Please give us some money',
            image: 'https://cdn.discordapp.com/attachments/989473099386847237/990293373803958282/rr.png',
            handler: async function (response) {
                // await setPayId(response.razorpay_payment_id);
                alert("Payment Successful! Thank You")
                console.log(response.razorpay_payment_id)
                console.log(response.razorpay_order_id)
                console.log(response.razorpay_signature)
                // await getPayment(response.razorpay_payment_id); 
            },
            prefill: {
                name: 'Srijan Majumdar',
                email: 'srjnmajumdar8@gmail.com',
                contact: '9330427421'
            },
            timeout: 240,
            theme: { 'color': '#6bc7eb', 'backdrop_color': '#bde4eb' }
        }
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()

        navigate12()
    }

    const removeItem = (indexvalue) => {
        let actionObj = removeProductFromCart(indexvalue);
        dispatch(actionObj)
    }

    const incrementQuantity = (indexvalue) => {
        let actionObj = incrementQuantityOfProduct(indexvalue)

        dispatch(actionObj)
    }

    const decrementQuantity = (indexvalue) => {

        if (productsList[indexvalue].quantitySelected === 1) {
            let actionObj = removeProductFromCart(indexvalue);
            dispatch(actionObj)
        }
        else {
            let actionObj = decrementQuantityOfProduct(indexvalue)
            dispatch(actionObj)
        }
    }

    let [total, setTotal] = useState(0)

    useEffect(() => {
        let obj = productsList.reduce((sum, userObj) => sum + Number(userObj.subTotalCost), 0);
        console.log(obj)
        setTotal(obj)
    })


    return (
        <div>
            <div className='container mx-auto container mb-5 pb-5'>


                <h1 className='temp text-center'>Cart</h1>

                {
                    productsList.length == 0 && (
                        <h2 className='text-center'>Sorry There are no products to show</h2>
                    )

                }

                {
                    productsList.map((userObj, index) => <div className='col-12 bg-dark p-2 m-2'>
                        <div className=' row m-2 p-2 border bg-white'>
                            <div className='col-2'>
                                <img src={userObj.ProductImage1} className="img-fluid border"></img>
                            </div>

                            <div className='col-3'>
                                <h4 className="pt-2 fs-xs-6" >{userObj.model}</h4>

                                <p className='fs-6' >text one line</p>
                                <div className='pb-2'>
                                    <i className="bi bi-star-fill" style={{ color: "#FFA41C" }}></i>
                                    <i className="bi bi-star-fill" style={{ color: "#FFA41C" }}></i>
                                    <i className="bi bi-star-fill" style={{ color: "#FFA41C" }}></i>
                                    <i className="bi bi-star-fill" style={{ color: "#FFA41C" }}></i>
                                    <i className="bi bi-star-half" style={{ color: "#FFA41C" }}></i>
                                    <span> 4.5</span>
                                </div>

                                <span className='fw-bold fs-5' style={{ "color": "#c66" }} > Rs.{userObj.discountcost}</span>

                            </div>

                            <div className='col-3 text-center mt-5 mt-5'>
                                <br />
                                <div>
                                    <span onClick={() => decrementQuantity(index)}>
                                        <button className='btn border'><AiFillCaretLeft /></button>
                                    </span>
                                    <span className=' p-3 ps-3 pe-3'>
                                        {userObj.quantitySelected}
                                    </span>
                                    <span>
                                        <button className='btn border' onClick={() => incrementQuantity(index)}><AiFillCaretRight /></button>
                                    </span>
                                </div>


                            </div>

                            <div className='col-4 border text-center mt-5 mt-5'>
                                <br />
                                <p>{userObj.subTotalCost}</p>

                            </div>


                        </div>
                        <div className='text-end pe-2'>
                            <button className='btn btn-sm btn-danger fs-6' onClick={() => removeItem(index)}>Remove</button>
                        </div>
                    </div>
                    )}

                <h1 className='text-end'>Total : {total}</h1>


                <div className='text-end'>
                    <button className='btn btn-danger' type="button" onClick={displayRazorpay}>Buy Now</button>
                </div>







            </div>
            <Footer />
        </div>
    );
}

export default Cart