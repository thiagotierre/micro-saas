 import { stripe } from "@/app/lib/stripe";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

 const secret = process.env.STRIPE_WEBHOOK_SECRET;

 export async function POST(request: Request) { 

    try {

        const body = await request.text();
        const headersList = await headers();
        const signature = headersList.get("Stripe-Signature");
        
        if(!signature || !secret) {
            // If the signature is not present, we cannot verify the webhook
            return NextResponse.json({ error: "No signature or secret" }, { status: 400 });
        }

        const event = stripe.webhooks.constructEvent(body, signature, secret);

        switch (event.type) {
            case "checkout.session.completed": //payment success if status is paid
                const metadata = event.data.object.metadata;

                if(metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
                    await handleStripePayment(event);
                }

                if(metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
                    await handleStripeSubscription(event);
                }

                break;
            case "checkout.session.expired": //payment expired timeout
                console.log("Send mail information Payment expired");
                break;
            case "checkout.session.async_payment_succeeded": //Boleto success
                console.log("Send mail information Payment secceeded");
                break;
            case "checkout.session.async_payment_failed": //Boleto fail
                console.log("Send mail information Payment boleto is fail");
                break;
            case "customer.subscription.created": //create subscription
                console.log("Send mail welcome to subscription");
                break;
            case "customer.subscription.deleted": // Cancel subscription
                await handleStripeCancelSubscription(event);
                break;
    }
    return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Error in Stripe webhook:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
    
    
    
}