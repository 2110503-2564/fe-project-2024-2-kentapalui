import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Slot } from "@radix-ui/react-slot";
import { Ellipsis } from "lucide-react";

interface UserSessionCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const SessionCard: React.FC<UserSessionCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="border-input flex w-full flex-col gap-3 rounded-sm border-1 p-4">
      <div className="flex flex-col">
        <h1 className="text-md font-bold">{title}</h1>
        <p className="text-sm">{description}</p>
      </div>

      {children ? <div className="flex flex-col">{children}</div> : null}
    </div>
  );
};

interface UserSessionCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  dropdownContent?: React.ReactElement<typeof DropdownMenuContent>;
}

export const SessionCardWithDropdown: React.FC<UserSessionCardProps> = ({
  title,
  description,
  children,
  dropdownContent,
}) => {
  return (
    <div className="border-input flex w-full justify-between rounded-sm border-1 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <h1 className="text-md font-bold">{title}</h1>
          <p className="text-sm">{description}</p>
        </div>

        {children ? (
          <div className="flex flex-col gap-1">{children}</div>
        ) : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-fit w-fit rounded-full p-2 transition-colors hover:bg-slate-100 focus:outline-none">
            <Ellipsis />
          </button>
        </DropdownMenuTrigger>
        {dropdownContent || <DropdownMenuContent />}
      </DropdownMenu>
    </div>
  );
};

interface SessionCardInfoProps {
  icon: React.ReactNode;
  text: string;
}

export const SessionCardInfo: React.FC<SessionCardInfoProps> = ({
  icon,
  text,
}) => {
  return (
    <div className="flex gap-1">
      <Slot className="h-4 w-4 text-slate-500">{icon}</Slot>
      <p className="text-xs text-slate-500">{text}</p>
    </div>
  );
};
