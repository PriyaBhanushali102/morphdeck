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
    success_url: `${process.env.CORS_ORIGIN}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CORS_ORIGIN}/billing?canceled=true`,
    metadata: {
      userId,
      creditsToAdd: "50",
    },
  });

  res.status(200).json({ url: session.url });
});

// Called by the client after a successful redirect to verify payment and add credits
export const verifyPayment = wrapAsync(async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.user.id;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: "Session ID is required" });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Validate the session belongs to this user
  if (session.metadata?.userId !== userId) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  if (session.payment_status !== "paid") {
    return res.status(400).json({ success: false, message: "Payment not completed" });
  }

  // Idempotency: check if this session was already processed
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (user.lastProcessedSession === sessionId) {
    return res.status(200).json({ success: true, message: "Already processed", credits: user.credits });
  }

  const creditsToAdd = parseInt(session.metadata?.creditsToAdd || "0");
  user.credits += creditsToAdd;
  user.lastProcessedSession = sessionId;
  await user.save();

  res.status(200).json({ success: true, credits: user.credits });
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
    const session = event.data.object;
    const { userId, creditsToAdd } = session.metadata;

    try {
      const user = await User.findById(userId);
      if (user) {
        // Idempotency: skip if already processed by verifyPayment
        if (user.lastProcessedSession === session.id) {
          return res.status(200).send();
        }
        user.credits += parseInt(creditsToAdd);
        user.lastProcessedSession = session.id;
        await user.save();
      }
    } catch (err) {
      console.error("Database Update Error:", err);
    }
  }

  res.status(200).send();
};
