import { auth } from "@/auth";
import { BackendRoutes } from "@/constants/routes/Backend";
import { withBaseRoute } from "@/utils/routes/withBaseRoute";
import { assert } from "node:console";

export default async function Layout({ admin }: { admin: React.ReactNode }) {
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

  assert(user);

  return user?.data.role === "admin" ? admin : <p>route not implemented</p>;
}
