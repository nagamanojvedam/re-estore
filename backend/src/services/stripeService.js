const Stripe = require("stripe");
const config = require("../config/config");

const stripe = new Stripe(config.stripe.secretKey);

/**
 * Create a Stripe Checkout Session for an order
 * @param {Object} order - Order object
 * @param {Array} products - Map of products in the order
 * @returns {Promise<Object>} Stripe Session object
 */
const createCheckoutSession = async (order, products) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: order.items.map((item) => {
      const product = products[item.product.toString()];
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.images,
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      };
    }),
    success_url: `${config.frontendUrl}/orders/${order._id}?status=success`,
    cancel_url: `${config.frontendUrl}/checkout?status=cancel`,
    client_reference_id: order._id.toString(),
    metadata: {
      orderId: order._id.toString(),
      userId: order.user.toString(),
    },
  });
};

/**
 * Construct Stripe event from webhook body and signature
 * @param {Buffer} body - Request body
 * @param {string} signature - Stripe signature header
 * @returns {Object} Stripe Event object
 */
const constructEvent = (body, signature) => {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    config.stripe.webhookSecret
  );
};

module.exports = {
  createCheckoutSession,
  constructEvent,
};
