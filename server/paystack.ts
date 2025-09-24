// Paystack integration for Nigerian payment processing
import axios from 'axios';

if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error('Missing required Paystack secret: PAYSTACK_SECRET_KEY');
}

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const paystackAPI = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface PaystackInitializePaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackCustomer {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export class PaystackService {
  // Initialize a payment transaction
  async initializePayment(data: {
    email: string;
    amount: number; // in kobo (1 NGN = 100 kobo)
    reference?: string;
    currency?: string;
    callback_url?: string;
    metadata?: object;
    channels?: string[];
  }): Promise<PaystackInitializePaymentResponse> {
    try {
      const response = await paystackAPI.post('/transaction/initialize', {
        ...data,
        currency: data.currency || 'NGN',
        amount: Math.round(data.amount), // Ensure amount is an integer
      });

      if (response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to initialize payment');
    } catch (error: any) {
      throw new Error(`Paystack initialization error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Verify a payment transaction
  async verifyPayment(reference: string): Promise<any> {
    try {
      const response = await paystackAPI.get(`/transaction/verify/${reference}`);
      
      if (response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Payment verification failed');
    } catch (error: any) {
      throw new Error(`Paystack verification error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Create a customer
  async createCustomer(customer: PaystackCustomer): Promise<any> {
    try {
      const response = await paystackAPI.post('/customer', customer);
      
      if (response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create customer');
    } catch (error: any) {
      throw new Error(`Paystack customer creation error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Create a transfer recipient (for paying lawyers)
  async createTransferRecipient(data: {
    type: 'nuban'; // Nigerian bank account
    name: string;
    account_number: string;
    bank_code: string;
    currency?: string;
  }): Promise<any> {
    try {
      const response = await paystackAPI.post('/transferrecipient', {
        ...data,
        currency: data.currency || 'NGN',
      });

      if (response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create transfer recipient');
    } catch (error: any) {
      throw new Error(`Paystack recipient creation error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Initiate a transfer (pay lawyer)
  async initiateTransfer(data: {
    source: string;
    amount: number; // in kobo
    recipient: string;
    reason?: string;
    reference?: string;
  }): Promise<any> {
    try {
      const response = await paystackAPI.post('/transfer', {
        ...data,
        amount: Math.round(data.amount),
      });

      if (response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to initiate transfer');
    } catch (error: any) {
      throw new Error(`Paystack transfer error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get Nigerian banks list
  async getBanks(): Promise<any[]> {
    try {
      const response = await paystackAPI.get('/bank?country=nigeria');
      
      if (response.data.status) {
        return response.data.data;
      }
      throw new Error('Failed to fetch banks list');
    } catch (error: any) {
      throw new Error(`Paystack banks fetch error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Resolve bank account
  async resolveAccount(accountNumber: string, bankCode: string): Promise<any> {
    try {
      const response = await paystackAPI.get(
        `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
      );
      
      if (response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to resolve account');
    } catch (error: any) {
      throw new Error(`Paystack account resolution error: ${error.response?.data?.message || error.message}`);
    }
  }
}

export const paystackService = new PaystackService();