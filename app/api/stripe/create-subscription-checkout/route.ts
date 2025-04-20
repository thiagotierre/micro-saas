import { auth } from '@/app/lib/auth';
import { stripe } from '@/app/lib/stripe';
import { getOrCreateCustomerId } from '@/app/server/stripe/get-customer-id';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { testeId } = await request.json();

    const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;
    if(!price) {
        return new NextResponse("Price ID not found", { status: 500 });
    }

    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if(!userId||!userEmail) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const customerId = await getOrCreateCustomerId(userId, userEmail);
    if(!customerId) {
        return new NextResponse("Customer ID not found", { status: 404 });
    }

    const metadata = {
        testeId,
        price,
        userId,
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
                {
                    price: price,
                    quantity: 1,
                },
            ],
            payment_method_types: ["card"],
            success_url: `${request.headers.get("origin")}/success`,
            cancel_url: `${request.headers.get("origin")}/cancel`,
            metadata,
            customer: customerId
        });

        if(!session.url) {
            return new NextResponse("Session URL not found", { status: 500 });    
        }
        return NextResponse.json({id: session.id}, { status: 200 });

    } catch (error) {
        console.error("Error creating Stripe Checkout session:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
        
    }

}