// Tipos para o serviço MercadoPago

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

export const mercadoPagoService: {
    createPreference(packageDetails: { diamonds: number; price: number }): Promise<PreferenceResponse>;
    finalizeTransaction(
        packageDetails: { diamonds: number; price: number },
        paymentMethod: 'transfer' | 'card'
    ): Promise<TransactionResponse>;
    checkPaymentStatus(paymentId: string): Promise<{ status: string; approved: boolean }>;
};
