import { Button } from "@/components/ui/shadcn/button";
import { DateTimePicker24h } from "@/components/ui/shadcn/custom/datetime-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface EditDialogProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const editSessionFormSchema = z.object({
  company: z.string().nonempty(),
  date: z.date(),
});

export function EditSessionDialog({
  session,
  isOpen,
  onClose,
  onSuccess,
}: EditDialogProps) {
  const form = useForm<z.infer<typeof editSessionFormSchema>>({
    resolver: zodResolver(editSessionFormSchema),
    defaultValues: {
      company: session.company.id,
      date: new Date(session.date),
    },
  });

  // Fetch companies for dropdown
  const { data: companies, isLoading } = useQuery({
    queryKey: [BackendRoutes.COMPANIES],
    queryFn: () => axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES),
    enabled: isOpen, // Only fetch when dialog is open
  });

  // Update session mutation
  const { mutate: updateSession, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof editSessionFormSchema>) => {
      await axios.put(BackendRoutes.SESSIONS_ID({ id: session._id }), {
        company: data.company,
        date: data.date,
      });
    },
    onMutate: () => {
      toast.dismiss();
      toast.loading("Updating session...", { id: "update-session" });
    },
    onSuccess: () => {
      toast.success("Session updated successfully", { id: "update-session" });
      onClose();
      onSuccess();
    },
    onError: (error) => {
      toast.error("Failed to update session", {
        id: "update-session",
        description: isAxiosError(error)
          ? error.response?.data.error
          : "Something went wrong",
      });
    },
  });

  return (
    <Form {...form}>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log("Button clicked");
              updateSession(data);
            })}
          >
            <DialogHeader>
              <DialogTitle>Edit Session</DialogTitle>
              <DialogDescription>
                Update the company information and session date
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Company</FormLabel>
                    <FormControl>
                      <div className="col-span-3">
                        {isLoading ? (
                          <Input
                            value={session.company.name}
                            disabled
                            className="w-full"
                          />
                        ) : (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                            <SelectContent>
                              {companies?.data.data.map((company) => (
                                <SelectItem
                                  key={company.id}
                                  value={company.id.toString()}
                                >
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">User</FormLabel>
                <Input
                  value={session.user.name}
                  disabled
                  className="col-span-3"
                />
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Date</FormLabel>
                    <div className="col-span-3">
                      <DateTimePicker24h
                        value={field.value}
                        onChange={field.onChange}
                        format="d MMM yyyy HH:mm"
                      />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
