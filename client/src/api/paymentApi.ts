import axiosInstance from "./axiosInstance";

export interface PaymentResponse {
   order_id: number;
   payment_url: string;
   payment_id: string;
}

export const paymentApi = {
   createPayment: async (): Promise<PaymentResponse> => {
      const response = await axiosInstance.post("/payments");
      return response.data;
   },

   getPaymentStatus: async (
      orderId: number,
   ): Promise<{ status: string; payment_url: string | null }> => {
      const response = await axiosInstance.get(`/payments/status/${orderId}`);
      return response.data;
   },
};
