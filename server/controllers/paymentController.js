import { STRIPE_SECRET_KEY } from "../config/env.config.js";
import Stripe from "stripe";
import User from "../models/User.js";
import wrapAsync from "../utilities/wrapAsync.js";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const createCheckoutSession = wrapAsync(async (req, res) => {
  const userId = req.user.id;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Pro Creator Pack (50 Credits)",
            description: "Unlock 50 AI Presentations & High-Res Exports",
          },
          unit_amount: 500,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CORS_ORIGIN}/billing?success=true`,
    cancel_url: `${process.env.CORS_ORIGIN}/billing?canceled=true`,
    metadata: {
      userId,
      creditsToAdd: "50",
    },
  });

  res.status(200).json({ url: session.url });
});

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const { userId, creditsToAdd } = event.data.object.metadata;

    try {
      const user = await User.findById(userId);
      if (user) {
        user.credits += parseInt(creditsToAdd);
        await user.save();
      }
    } catch (err) {
      console.error("Database Update Error:", err);
    }
  }

  res.status(200).send();
};
