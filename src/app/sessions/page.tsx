"use client";

import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { UserSessionCard } from "../_components/UserSessionCard";
import { DeleteSessionDialog } from "./_components/DeleteSessionDialog";
import {
  EditSessionDialog,
  EditSessionFormSchema,
} from "./_components/EditSessionDialog";

export default function AdminSessionsPage() {
  const queryClient = useQueryClient();
  const { status } = useSession();
  const [SessionToDelete, setSessionToDelete] =
    useState<Nullable<Session>>(null);
  const [SessionToUpdate, setSessionToUpdate] =
    useState<Nullable<Session>>(null);

  // Get current user data
  const {
    data: me,
    isLoading: isMeLoading,
    error: meError,
  } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () =>
      (await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME)).data,
    enabled: status == "authenticated",
  });

  const userId = me?.data?._id || "";
  const isUserDataReady = !isMeLoading && !meError && !!userId;

  // Data fetching
  const queries = useQueries({
    queries: [
      {
        queryKey: [BackendRoutes.USERS_ID_SESSIONS({ id: userId })],
        queryFn: async () =>
          (
            await axios.get<GETAllSessionsResponse>(
              BackendRoutes.USERS_ID_SESSIONS({ id: userId }),
            )
          ).data,
        enabled: isUserDataReady,
      },
      {
        queryKey: [BackendRoutes.COMPANIES],
        queryFn: async () =>
          (await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES))
            .data,
        enabled: !SessionToUpdate,
      },
    ],
  });

  const [sessionsQuery, companiesQuery] = queries;

  const interviewSessions = sessionsQuery?.data?.data;
  const companies = companiesQuery?.data?.data;
  const isSessionLoading = sessionsQuery?.isLoading;
  const isCompaniesLoading = companiesQuery?.isLoading;

  // Refresh data helper function
  const refreshSessionData = () => {
    queryClient.invalidateQueries({
      queryKey: [BackendRoutes.USERS_ID_SESSIONS({ id: userId })],
    });
  };

  // Update session mutation
  const { mutate: updateSession, isPending: isUpdating } = useMutation({
    mutationFn: async (data: { _id: string } & EditSessionFormSchema) => {
      await axios.put(BackendRoutes.SESSIONS_ID({ id: data._id }), data);
    },
    onMutate: () => {
      toast.dismiss();
      toast.loading("Updating session...", { id: "update-session" });
    },
    onSuccess: () => {
      toast.success("Session updated successfully", { id: "update-session" });
      setSessionToUpdate(null);
      refreshSessionData();
    },
    onError: (error) => {
      toast.error("Failed to update session", {
        id: "update-session",
        description: isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong",
      });
    },
  });

  // Delete session mutation
  const { mutate: deleteSession, isPending: isDeleting } = useMutation({
    mutationFn: (data: { _id: string }) =>
      axios.delete(BackendRoutes.SESSIONS_ID({ id: data._id })),
    onSuccess: () => {
      toast.success("Session delete successfully", { id: "delete-session" });
      setSessionToDelete(null);
      refreshSessionData();
    },
    onError: (error) => {
      toast.error("Failed to delete session", {
        id: "delete-session",
        description: isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong",
      });
    },
  });

  // Handle various error states
  if (status === "unauthenticated") {
    return (
      <div className="mt-16 text-center">
        Please sign in to view your sessions
      </div>
    );
  }

  if (meError) {
    return (
      <div className="mt-16 text-center">
        Failed to load user data. Please try again later.
      </div>
    );
  }

  return (
    <main className="mx-auto mt-16 space-y-8">
      <h1 className="text-center text-4xl font-bold">My Scheduled Sessions</h1>

      <div className="mx-auto max-h-[70vh] max-w-2xl space-y-2 overflow-y-auto pr-4">
        {isSessionLoading ? (
          <p className="text-center">Loading sessions...</p>
        ) : interviewSessions?.length ? (
          interviewSessions.map((session) => (
            <UserSessionCard
              key={session._id}
              session={session}
              onDelete={() => setSessionToDelete(session)}
              onEdit={() => setSessionToUpdate(session)}
            />
          ))
        ) : (
          <p className="text-center">There&apos;s nothing here.</p>
        )}
      </div>

      {SessionToDelete ? (
        <DeleteSessionDialog
          session={SessionToDelete}
          isOpen={!!SessionToDelete}
          isPending={isDeleting}
          onClose={() => setSessionToDelete(null)}
          onDelete={(data) => deleteSession(data)}
        />
      ) : null}

      {SessionToUpdate ? (
        <EditSessionDialog
          session={SessionToUpdate}
          companies={companies}
          isOpen={!!SessionToUpdate}
          isPending={isUpdating}
          isLoading={isCompaniesLoading}
          onClose={() => setSessionToUpdate(null)}
          onUpdate={(data) => updateSession(data)}
        />
      ) : null}
    </main>
  );
}
