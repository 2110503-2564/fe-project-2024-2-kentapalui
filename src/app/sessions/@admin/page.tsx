"use client";

import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminSessionCard } from "../../_components/AdminSessionCard";
import { DeleteSessionDialog } from "./_components/DeleteSessionDialog";
import { EditSessionDialog } from "./_components/EditSessionDialog";

export default function AdminSessionsPage() {
  const queryClient = useQueryClient();
  const [deleteSession, setDeleteSession] = useState<Nullable<Session>>(null);
  const [editSession, setEditSession] = useState<Nullable<Session>>(null);

  // Fetch sessions data
  const { data: interviewSessions, isLoading } = useQuery({
    queryKey: [BackendRoutes.SESSIONS],
    queryFn: async () =>
      (await axios.get<GETAllSessionsResponse>(BackendRoutes.SESSIONS)).data,
  });

  const refreshSessionData = () => {
    queryClient.invalidateQueries({ queryKey: [BackendRoutes.SESSIONS] });
  };

  // Loading state
  if (isLoading)
    return <p className="mt-16 text-center">Loading sessions...</p>;

  return (
    <main className="mx-auto mt-16 space-y-8">
      <h1 className="text-center text-4xl font-bold">All Scheduled Sessions</h1>

      <div className="mx-auto max-h-[70vh] max-w-2xl space-y-2 overflow-y-auto pr-4">
        {interviewSessions ? (
          interviewSessions?.data.map((session) => (
            <AdminSessionCard
              key={session._id}
              title={session.company.name}
              description={session.company.description}
              name={session.user.name}
              tel={session.user.tel}
              date={new Date(session.date)}
              onDelete={() => setDeleteSession(session)}
              onEdit={() => setEditSession(session)}
            />
          ))
        ) : (
          <p>Theres nothing here.</p>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteSession ? (
        <DeleteSessionDialog
          session={deleteSession}
          isOpen={!!deleteSession}
          onClose={() => setDeleteSession(null)}
          onSuccess={refreshSessionData}
        />
      ) : null}

      {/* Edit Session Dialog */}
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
