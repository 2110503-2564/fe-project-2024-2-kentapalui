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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const editSessionFormSchema = z.object({
  company: z.string().nonempty(),
  date: z.date(),
});

export type EditSessionFormSchema = z.infer<typeof editSessionFormSchema>;

interface EditDialogProps {
  session: Session;
  companies?: Array<Company>;
  isOpen: boolean;
  isPending: boolean;
  isLoading: boolean;
  onUpdate: (data: { _id: string } & EditSessionFormSchema) => void;
  onClose: () => void;
}

export function EditSessionDialog({
  session,
  companies,
  isOpen,
  isPending,
  isLoading,
  onUpdate,
  onClose,
}: EditDialogProps) {
  const form = useForm<z.infer<typeof editSessionFormSchema>>({
    resolver: zodResolver(editSessionFormSchema),
    defaultValues: {
      company: session.company.id,
      date: new Date(session.date),
    },
  });

  return (
    <Form {...form}>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <form
            onSubmit={form.handleSubmit((data) => {
              onUpdate({ _id: session._id, ...data });
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
                              {companies?.map((company) => (
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
