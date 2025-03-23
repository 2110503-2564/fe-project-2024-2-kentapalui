import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/shadcn/dropdown-menu";
import { Calendar, Phone, UserIcon } from "lucide-react";
import { SessionCardInfo, SessionCardWithDropdown } from "./SessionCard";

interface AdminSessionCardProps {
  title: string;
  description: string;
  name: string;
  tel: string;
  date: Date;

  onEdit?: () => void;
  onDelete?: () => void;
}
function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`;
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
      <SessionCardInfo icon={<Calendar />} text={formatDate(date)} />
    </SessionCardWithDropdown>
  );
};
