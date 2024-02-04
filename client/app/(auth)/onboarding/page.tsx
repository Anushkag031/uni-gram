import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";


async function Page()
{


    const user = await currentUser();

    return (
        <main className="max-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile to get started.
            </p>
            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile />
            </section>
        </main>
    )
}
export default Page;