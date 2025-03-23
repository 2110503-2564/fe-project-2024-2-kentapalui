import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface DeleteDialogProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteSessionDialog({
  session,
  isOpen,
  onClose,
  onSuccess,
}: DeleteDialogProps) {
  const { mutate: deleteSession, isPending: isDeleting } = useMutation({
    mutationFn: () =>
      axios.delete(BackendRoutes.SESSIONS_ID({ id: session._id })),
    onSuccess: () => {
      onSuccess();
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            session.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteSession()}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
