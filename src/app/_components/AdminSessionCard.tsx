import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/shadcn/dropdown-menu";
import { Calendar, Phone, UserIcon } from "lucide-react";
import { SessionCardInfo } from "./SessionCardInfo";
import { SessionCardWithDropdown } from "./SessionCardWithDropdown";

interface AdminSessionCardProps {
  title: string;
  description: string;
  name: string;
  tel: string;
  date: Date;

  onEdit?: () => void;
  onDelete?: () => void;
}

export const AdminSessionCard: React.FC<AdminSessionCardProps> = ({
  title,
  description,
  name,
  tel,
  date,
  onEdit,
  onDelete,
}) => {
  const dropdownContent = (
    <DropdownMenuContent>
      <DropdownMenuLabel>Interview Session</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled={!onEdit} onClick={onEdit}>
        Edit Session
      </DropdownMenuItem>
      <DropdownMenuItem disabled={!onDelete} onClick={onDelete}>
        Delete Session
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <SessionCardWithDropdown
      title={title}
      description={description}
      dropdownContent={dropdownContent}
    >
      <SessionCardInfo icon={<UserIcon />} text={name} />
      <SessionCardInfo icon={<Phone />} text={tel} />
      <SessionCardInfo icon={<Calendar />} text={date.toLocaleString()} />
    </SessionCardWithDropdown>
  );
};
