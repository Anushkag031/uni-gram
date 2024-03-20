import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser, fetchchildItem } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({params} : {params : {id:string}}) => { 

    //getting thread details

    if(!params.id) return null;

    const user = await currentUser();

    if(!user) return null;

    //fetch data
    const userInfo= await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');


    const thread = await fetchThreadById(params.id);

    return (

    <section className="relative ">
        <div>
        <ThreadCard
              key={thread._id}
              id={thread._id}
              currentUserId={user?.id || " "} //coming from clerk
              parentId={thread.parentId}
              content={thread.text}
              author={thread.author}
              community={thread.community}
              createdAt={thread.createdAt}
              comments={thread.children}
              />
        </div>
        <div className="mt-7">
            <Comment
            threadId={thread.id}
            currentUserImg={userInfo.image} //commment image (user.imageUrl) can be changed
            currentUserId={JSON.stringify(userInfo._id)} //from db
            
            />
        </div>

        {/** render thread children */}

        <div className="mt-10">
            {thread.children.map((childItem : any)=> (
                <ThreadCard
                key={childItem._id}
                id={childItem._id}
                currentUserId={childItem?.id || " "} //coming from clerk
                parentId={childItem.parentId}
                content={childItem.text}
                author={childItem.author}
                community={childItem.community}
                createdAt={childItem.createdAt}
                comments={childItem.children}
                isComment
                />
            ))}
        </div>

    </section>
    )

}

export default Page;