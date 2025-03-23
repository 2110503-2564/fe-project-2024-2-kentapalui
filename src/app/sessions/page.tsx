"use client";

import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { UserSessionCard } from "../_components/UserSessionCard";
import { DeleteSessionDialog } from "./_components/DeleteSessionDialog";
import { EditSessionDialog } from "./_components/EditSessionDialog";

export default function AdminSessionsPage() {
  const queryClient = useQueryClient();
  const { status } = useSession();
  const [deleteSession, setDeleteSession] = useState<Nullable<Session>>(null);
  const [editSession, setEditSession] = useState<Nullable<Session>>(null);

  const { data: me, isSuccess: isMeSuccess } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () =>
      (await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME)).data,
    enabled: status == "authenticated",
  });

  const { data: interviewSessions, isLoading } = useQuery({
    queryKey: [BackendRoutes.USERS_ID_SESSIONS({ id: me?.data._id || "" })],
    queryFn: async () =>
      (
        await axios.get<GETAllSessionsResponse>(
          BackendRoutes.USERS_ID_SESSIONS({ id: me?.data._id || "" }),
        )
      ).data,
    enabled: isMeSuccess,
  });

  const refreshSessionData = () => {
    queryClient.invalidateQueries({
      queryKey: [BackendRoutes.USERS_ID_SESSIONS({ id: me?.data._id || "" })],
    });
  };

  return (
    <main className="mx-auto mt-16 space-y-8">
      <h1 className="text-center text-4xl font-bold">My Scheduled Sessions</h1>

      <div className="mx-auto max-h-[70vh] max-w-2xl space-y-2 overflow-y-auto pr-4">
        {isLoading ? (
          <p className="text-center">Loading sessions...</p>
        ) : interviewSessions?.data.length ? (
          interviewSessions.data.map((session) => (
            <UserSessionCard
              key={session._id}
              title={session.company.name}
              description={session.company.description}
              tel={session.company.tel}
              date={new Date(session.date)}
              onDelete={() => setDeleteSession(session)}
              onEdit={() => setEditSession(session)}
            />
          ))
        ) : (
          <p className="text-center">There&apos;s nothing here.</p>
        )}
      </div>

      {deleteSession ? (
        <DeleteSessionDialog
          session={deleteSession}
          isOpen={!!deleteSession}
          onClose={() => setDeleteSession(null)}
          onSuccess={refreshSessionData}
        />
      ) : null}

      {editSession ? (
        <EditSessionDialog
          session={editSession}
          isOpen={!!editSession}
          onClose={() => setEditSession(null)}
          onSuccess={refreshSessionData}
        />
      ) : null}
    </main>
  );
}
