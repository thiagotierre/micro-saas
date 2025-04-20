import { auth } from '@/app/lib/auth';
import { db } from '@/app/lib/firebase';
import { stripe } from '@/app/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return  new NextResponse("User not found", { status: 404 });
        }
        
        const customerId = userDoc.data()?.stripeCustomerId;

        if (!customerId) {
            return new NextResponse("Customer ID not found", { status: 404 });
        }

       const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${request.headers.get("origin")}/dashboard`,
        }); 

        return NextResponse.json({ url: portalSession.url }, { status: 200 });

    } catch (error) {
        console.error("Error creating Stripe Checkout session:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
        
    }

}