import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";


export async function POST(
    req: Request,
    {params}:{params: {courseId: string}},
){
    try {
        const user = await currentUser();

        if(!user || !user.id || !user.emailAddresses?.[0]?.emailAddress){
            return new NextResponse("Unauthrized", {status: 401});
        }

        const course = await db.course.findUnique({
            where:{
                id: params.courseId,
                isPublished: true,
            }
        })

        const purchase = await db.purchase.findUnique({
            where:{
                userId_courseId:{
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        })

        if(purchase){
            return new NextResponse("Course already purchased", {status: 400});
        }

        if(!course){
            return new NextResponse("Course not found or not published", {status: 404});
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity:1,
                price_data:{
                    currency:"USD",
                    product_data: {
                        name: course.title,
                        description: course.description!,
                    },
                    unit_amount: Math.round(course.price! * 100)
                }
            }
        ];

        let stripeCustomer = await db.stripeCustomer.findFirst({
            where:{
                userId: user.id as string
            },
            orderBy:{
                id:"desc"
            },
            select:{
                stripeCustomerId: true
            }
        });

        if(!stripeCustomer){
            const customer = await stripe.customers.create({
                email:user.emailAddresses[0].emailAddress,
            });

            stripeCustomer = await db.stripeCustomer.create({
                data:{
                    userId: user.id,
                    stripeCustomerId: customer.id
                }
            });
        }

        console.log("Meta data: ",{
            courseId: course.id,
            userId: user.id,
        });

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode:"payment",
            metadata:{
                courseId: course.id,
                userId: user.id,
            },
            payment_intent_data:{
                metadata:{
                    courseId: course.id,
                    userId: user.id,
                }
            },
            success_url:`${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url:`${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`
        });

        return NextResponse.json({url: session.url})

    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Internal Error", {status:500});
    }
}





