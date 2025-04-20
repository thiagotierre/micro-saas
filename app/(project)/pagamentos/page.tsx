"use client"

import { useStripe } from "@/app/hooks/useStripe"


export default function Pagamentos() {
    const {
        createPaymentStripeCheckout,
        createSubscriptionStripeCheckout,
        handleCreateStripePortal,
    } = useStripe();

    return (
        <div className="flex h-screen flex-col items-center justify-center p-24 bg-amber-50">
            <h1 className="text-3xl font-bold">Micro Saas</h1>
            <div className="flex flex-row m-3">
                <button className="border rounded-md px-1 p-1 m-2 cursor-pointer" onClick={ () => createPaymentStripeCheckout({testeId: "123"})}>Criar Pagamento com Stripe</button>
                <button className="border rounded-md px-1 p-1 m-2 cursor-pointer" onClick={ () => createSubscriptionStripeCheckout({testeId: "123"})}>Criar Assinatura Stripe</button>
                <button className="border rounded-md px-1 p-1 m-2 cursor-pointer" onClick={ () => handleCreateStripePortal}>Criar Portal de Pagamentos</button>
            </div>
        </div>
    )
}