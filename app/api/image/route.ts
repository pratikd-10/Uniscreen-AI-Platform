import {auth} from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {Configuration,OpenAIApi} from "openai";
import {increaseApiLimit, checkApiLimit} from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const configuration = new Configuration({
    apiKey:process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);
 
export async function POST(
    req:Request
){
    try{
        const {userId} = auth();
        const body = await req.json();
        const {prompt,amount=1,resolution="512×512"} =body;

        if(!userId){
            return new NextResponse("Unauthorized",{status:401}); 
        }

        if(!configuration.apiKey){
            return new NextResponse("OpenAI API key not configured",{status:500});
        }

        if(!prompt){
            return new NextResponse("Prompt is required", {status:400});
        }

        if(!amount){
            return new NextResponse("Amount is required", {status:400});
        }

        if(!resolution){
            return new NextResponse("Resolution is required", {status:400});
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();
        
        if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expired.",{status:403});
        }
        if(!isPro){
            await increaseApiLimit();
        }
        
        


        const response = await openai.createImage({
           prompt,
           n:parseInt(amount,10),
           size:resolution,
        });

        return NextResponse.json(response.data.data);
          
    }catch(error){
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal error",{status:500});
    }
}