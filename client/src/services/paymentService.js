import api from "./api";

export const createCheckoutSession = async (planId) => {
  const response = await api.post("/payments/checkout", { planId });
  return response.data;
};

const paymentService = {
  createCheckoutSession,
};

export default paymentService;
