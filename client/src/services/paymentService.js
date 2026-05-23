import api from "./api";

export const createCheckoutSession = async (planId) => {
  const response = await api.post("/payments/checkout", { planId });
  return response.data;
};

export const verifyPayment = async (sessionId) => {
  const response = await api.post("/payments/verify", { sessionId });
  return response.data;
};

const paymentService = {
  createCheckoutSession,
  verifyPayment,
};

export default paymentService;
