import { auth } from "@/auth";
import { BackendRoutes } from "@/constants/routes/Backend";
import { withBaseRoute } from "@/utils/routes/withBaseRoute";

export default async function ProfilePage() {
  const session = await auth();

  const user = session?.token
    ? await fetch(withBaseRoute(BackendRoutes.AUTH_ME), {
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json() as Promise<GETMeResponse>)
        .catch(() => null)
    : null;

  return (
    <main className="mx-auto mt-16">
      <div className="mx-auto max-w-sm space-y-2 rounded-xl bg-white px-4 py-8 text-center drop-shadow-md">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p>{user?.data.name}</p>
        <p>{user?.data.email}</p>
        <p>{user?.data.tel}</p>
      </div>
    </main>
  );
}
