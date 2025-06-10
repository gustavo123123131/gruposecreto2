
const API_KEY = '33167|tUJdsOZftZbNpRK1oGjp9OZAKv5Mp9TNDw0BNrcWde3b6e56';
const BASE_URL = 'https://api.pushinpay.com.br/api';

export interface PixResponse {
  id: string;
  qr_code: string;
  qr_code_base64: string;
  value: number;
  status: string;
  created_at: string;
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'paid' | 'expired' | 'cancelled';
  value: number;
  created_at: string;
  updated_at: string;
}

export class PushinPayService {
  private static async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  static async gerarPix(valorReais: number): Promise<PixResponse> {
    const valorCentavos = Math.round(valorReais * 100);
    
    console.log(`Gerando PIX para R$ ${valorReais.toFixed(2)} (${valorCentavos} centavos)`);
    
    return this.makeRequest<PixResponse>('/pix/cashIn', {
      method: 'POST',
      body: JSON.stringify({
        value: valorCentavos,
        webhook_url: "",
        split_rules: []
      }),
    });
  }

  static async verificarPagamento(paymentId: string): Promise<PaymentStatus> {
    console.log(`Verificando status do pagamento: ${paymentId}`);
    
    return this.makeRequest<PaymentStatus>(`/transactions/${paymentId}`);
  }
}
