import axios from "axios";
import crypto from "crypto";

const STORE_ID = process.env.YOOKASSA_STORE_ID!;
const API_KEY = process.env.YOOKASSA_API_KEY!;
const API_URL = "https://api.yookassa.ru/v3";

const auth = Buffer.from(`${STORE_ID}:${API_KEY}`).toString("base64");

export interface YooKassaPaymentResponse {
   id: string;
   status: string;
   confirmation: {
      type: string;
      confirmation_url: string;
   } | null;
}

export const createYooKassaPayment = async (
   amount: number,
   description: string,
   returnUrl: string,
   metadata: Record<string, string> = {},
): Promise<YooKassaPaymentResponse> => {
   const idempotenceKey = crypto.randomUUID();

   const response = await axios.post(
      `${API_URL}/payments`,
      {
         amount: {
            value: amount.toFixed(2),
            currency: "RUB",
         },
         confirmation: {
            type: "redirect",
            return_url: returnUrl,
         },
         capture: true,
         description,
         metadata,
      },
      {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
            "Idempotence-Key": idempotenceKey,
         },
      },
   );

   return response.data;
};

export const getYooKassaPaymentStatus = async (
   paymentId: string,
): Promise<{ status: string }> => {
   const response = await axios.get(`${API_URL}/payments/${paymentId}`, {
      headers: {
         Authorization: `Basic ${auth}`,
      },
   });

   return response.data;
};
