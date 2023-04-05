const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const Order = require("../models/Order");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  try {
    const { cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `no cart items provided` });
    }
    if (!tax || !shippingFee) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `please provide tax and shipping fee` });
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
       
       const databaseProduct = await Product.findOne({ _id: item.product });
      if (!databaseProduct) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `No product with id : ${item.product}` });
      }
      const { name, price, image, _id } = databaseProduct;
      const singleOrderItem = {
        amount: item.amount,
        name,
        price,
        image,
        product: _id,
      };
      // add item to order
      orderItems = [...orderItems, singleOrderItem];
      // calculate subtotal
      subtotal += item.amount * price; 
    }

    // calculate total
    const total = tax + shippingFee + subtotal;

    // get client secret
    const paymentIntent = await fakeStripeAPI({
      amount: total,
      currency: "usd",
    });

    const order = await Order.create({
      orderItems,
      total,
      subtotal,
      tax,
      shippingFee,
      clientSecret: paymentIntent.client_secret,
      user: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      order,
      clientSecret: order.clientSecret,
    }); 
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` });
  }
};

const getSingleOrder = async (req, res) => {
 try {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg:`No order with id:${orderId}`
      })
    }
    res.status(StatusCodes.OK).json({ success:true,order });
 } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` }); 
 }
};

const getCurrentUserOrders = async (req, res) => {
 try {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({success:true, orders, count: orders.length });
 } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `something wrong happened try again later` }); 
 }
};

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({msg:`No order with id : ${orderId}`});
    }

    //checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();
  
    res.status(StatusCodes.OK).json({ success:true ,order });

};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
