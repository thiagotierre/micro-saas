import { stripe } from "@/app/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { testeId, useEmail } = await request.json();

    const price = process.env.STRIPE_PRODUCT_PRICE_ID;

    if(!price) {
        return new NextResponse("Price ID not found", { status: 500 });
    }

    const metadata = {
        testeId: testeId,
    }
    
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price: price,
                    quantity: 1,
                },
            ],
            payment_method_types: ["card", "boleto"],
            success_url: `${request.headers.get("origin")}/success`,
            cancel_url: `${request.headers.get("origin")}/cancel`,
            ...(useEmail && { customer_email: useEmail }),
            metadata
        });

        if(!session.url) {
            return new NextResponse("Session URL not found", { status: 500 });    
        }
        
        return NextResponse.json({sessionId: session.id}, { status: 200 });
        
    } catch (error) {
        console.error("Error creating Stripe Checkout session:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
  
}