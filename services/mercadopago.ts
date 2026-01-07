import { api, storage } from './api';

interface PreferenceResponse {
    preferenceId: string;
    init_point?: string;
    sandbox_init_point?: string;
}

interface TransactionResponse {
    success: boolean;
    message?: string;
    transactionId?: string;
}

// Função auxiliar para fazer requisições HTTP
async function makeRequest(method: string, endpoint: string, data?: any) {
    const response = await fetch(`${process.env.REACT_APP_API_URL || ''}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storage.getToken()}`
        },
        body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Erro na requisição');
    }

    return response.json();
}

export const mercadoPagoService = {
    async createPreference(packageDetails: { diamonds: number; price: number }): Promise<PreferenceResponse> {
        try {
            const data = {
                title: `${packageDetails.diamonds} Diamantes`,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: packageDetails.price,
                description: `Compra de ${packageDetails.diamonds} diamantes`
            };
            
            const response = await makeRequest('POST', '/mercadopago/create-preference', data);

            return {
                preferenceId: response.id || response.preferenceId,
                init_point: response.init_point,
                sandbox_init_point: response.sandbox_init_point
            };
        } catch (error) {
            console.error('Erro ao criar preferência de pagamento:', error);
            throw new Error('Não foi possível criar a preferência de pagamento. Tente novamente.');
        }
    },

    async finalizeTransaction(
        packageDetails: { diamonds: number; price: number },
        paymentMethod: 'transfer' | 'card'
    ): Promise<TransactionResponse> {
        try {
            const data = {
                diamonds: packageDetails.diamonds,
                amount: packageDetails.price,
                paymentMethod
            };
            
            const response = await makeRequest('POST', '/mercadopago/process-payment', data);

            return {
                success: true,
                transactionId: response.payment_id
            };
        } catch (error: any) {
            console.error('Erro ao processar pagamento:', error);
            throw new Error(
                error.message || 
                'Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.'
            );
        }
    },

    async checkPaymentStatus(paymentId: string): Promise<{ status: string; approved: boolean }> {
        try {
            const response = await makeRequest('GET', `/mercadopago/payment/${paymentId}`);
                
            return {
                status: response.status,
                approved: response.status === 'approved'
            };
        } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
            throw new Error('Não foi possível verificar o status do pagamento.');
        }
    }
};
