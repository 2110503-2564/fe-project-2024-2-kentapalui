"use client";

import { Button } from "@/components/ui/shadcn/button";
import { DateTimePicker24h } from "@/components/ui/shadcn/custom/datetime-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useMutation, useQueries } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createSessionFormSchema = z.object({
  company: z.string().nonempty(),
  user: z.string().nonempty(),
  date: z.date(),
});

export default function CreateSessionPage() {
  const { status } = useSession();

  const formDefaultValues = () => ({
    company: "",
    user: "",
    date: new Date(),
  });

  const form = useForm<z.infer<typeof createSessionFormSchema>>({
    resolver: zodResolver(createSessionFormSchema),
    defaultValues: formDefaultValues(),
  });

  const queries = useQueries({
    queries: [
      {
        queryKey: [BackendRoutes.AUTH_ME],
        queryFn: async () => {
          const result = await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME);

          form.reset({
            ...formDefaultValues(),
            user: result.data.data._id,
          });

          return result.data.data;
        },
        enabled: status == "authenticated",
      },
      {
        queryKey: [BackendRoutes.COMPANIES],
        queryFn: () =>
          axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES),
      },
    ],
  });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  const me = queries[0].data;
  const companies = queries[1].data?.data.data;

  const { mutate: createSession } = useMutation({
    mutationFn: async (data: z.infer<typeof createSessionFormSchema>) => {
      return await axios.post(BackendRoutes.SESSIONS, data);
    },
    onMutate: () => {
      toast.dismiss();
      toast.loading("Creating Session", { id: "create-session" });
    },
    onSuccess: () => {
      toast.success("Create Session successfully", { id: "create-session" });
    },
    onError: (error) => {
      toast.error("Failed to create your session", {
        id: "create-session",
        description: isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong",
      });
    },
  });

  if (isError) {
    return <p>There is Something wrong, but i do not know what that is.</p>;
  }

  return (
    <Form {...form}>
      <main className="mx-auto mt-16">
        <form
          className="mx-auto max-w-sm space-y-6 rounded-xl bg-white px-4 py-8 drop-shadow-md"
          onSubmit={form.handleSubmit((data) => createSession(data))}
        >
          <h1 className="text-center text-3xl font-bold">Book Session</h1>
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="user"
            render={() => (
              <FormItem>
                <FormLabel className="text-right">Your Name</FormLabel>
                <Input value={me?.name ?? ""} disabled />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
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
          <Button type="submit" className="w-full" size="lg">
            Create
          </Button>
        </form>
      </main>
    </Form>
  );
}
