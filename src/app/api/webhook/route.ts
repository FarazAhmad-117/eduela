import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { string } from "zod";




export async function POST(req:Request){
    const body =await req.text();
    const signature = headers().get("Stripe-Signature") as string;
    let event :Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error:any) {
        return new NextResponse(`Webhook Error: ${error.message}`,{ status: 400});
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId as string;
    const courseId = session?.metadata?.courseId as string;
    console.log('Here is metadata', courseId, userId);
    console.log("Event is", event.type);
    if(event.type === "checkout.session.completed" || event.type === "charge.updated" ){
        console.log("Here I am purchasing")
        if(!userId || !courseId){
            return new NextResponse(`Webhook error: Missing metadata`, {status:400});
        }
        const purchase = await db.purchase.create({
            data:{
                userId,
                courseId
            }
        });
        console.log('purchase completed successfully', purchase);
    }else{
        return new NextResponse(`Webhook error: Unhanded event type`, {status:200});
    }
    
    return new NextResponse(null, {status:200});
}