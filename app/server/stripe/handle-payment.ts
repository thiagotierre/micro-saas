import { db } from "@/app/lib/firebase";
import"server-only";
import { Stripe } from "stripe";

export async function handleStripePayment(event: Stripe.CheckoutSessionCompletedEvent) {
    if(event.data.object.payment_status === "paid") {
        console.log("Payment succeeded");
        const metadata = event.data.object.metadata;

        const userId = metadata?.userId;

        if (!userId) {
            console.error("No userId found in metadata");
            return;
        }
        
        await db.collection("users").doc(userId).update({
            stripeSubscriptionId: event.data.object.subscription,
            subscriptionStatus: "active",
        });
    }
}