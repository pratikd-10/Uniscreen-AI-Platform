
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const navbar = async () => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();
  return (
    <div className="flex item-center p-4">
        <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount}/>
        <div className="flex w-full justify-end">
            <UserButton afterSignOutUrl="/"/>
        </div>
      </div>
  )
}

export default navbar