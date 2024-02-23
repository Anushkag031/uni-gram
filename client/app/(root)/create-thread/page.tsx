import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


async function Page() {

    const user= await currentUser();

    if(!user) return null;

    //if have user 
    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarding');

    return (
        <>
        <h1 className="head-text">page</h1>

        <PostThread userId = {userInfo._id}/>

        </>
    )
}

export default Page;
