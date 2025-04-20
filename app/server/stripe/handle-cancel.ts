import { db } from "@/app/lib/firebase";
import "serve-only";
import { Stripe } from "stripe";

export async function handleStripeCancelSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
    console.log("Cancel subscription");
    const customerId = event.data.object.customer;
    const userRef = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .get();
    if (userRef.empty) {
        console.error("No user found with the given customer ID");
        return;
    }
    const userId = userRef.docs[0].id;

    if (!userId) {
        console.error("No userId found in metadata");
        return;
    }
    
    await db.collection("users").doc(userId).update({
        subscriptionStatus: "inactive",
    });
}