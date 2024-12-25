import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";


const allOkList = [
    "checkout.session.completed",
    "charge.updated",
    "charge.succeeded",
]



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
    
    if(allOkList.includes(event.type)){
        if(!userId || !courseId){
            return new NextResponse(`Webhook error: Missing metadata`, {status:400});
        }
        const purchase = await db.purchase.create({
            data:{
                userId,
                courseId
            }
        });
    }else{
        return new NextResponse(`Webhook error: Unhanded event type`, {status:200});
    }
    
    return new NextResponse(null, {status:200});
}