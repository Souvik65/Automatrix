import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();

  return (
  <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
    {/* <h1 className="text-4xl font-bold">Welcome to the Automatrix App!</h1> */}
    Welcome to the Automatrix App!
    <div>
      {JSON.stringify(data, null, 2)}
    </div>
    <LogoutButton />
  </div>
  );
};

export default Page;