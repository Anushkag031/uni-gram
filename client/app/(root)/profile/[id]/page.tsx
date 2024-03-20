import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


async function Page({params} : {params : {id:string}}) {

    const user= await currentUser();

    if(!user) return null;

    //if have user, redirect to multiple user accounts i.e params
    const userInfo = await fetchUser(params.id);

    if(!userInfo?.onboarded) redirect('/onboarding');
    return (
        <section>
            <ProfileHeader
            accountId={userInfo.id}
            authUserId={userInfo.id}
            name={userInfo.name}
            username={userInfo.username}
            imgUrl={userInfo.image}
            bio={userInfo.bio}
            />
        </section>
    )
}
export default Page;