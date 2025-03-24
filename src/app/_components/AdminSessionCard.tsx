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
  session: Session;

  onEdit?: () => void;
  onDelete?: () => void;
}

export const AdminSessionCard: React.FC<AdminSessionCardProps> = ({
  session,
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
      title={session.company.name}
      description={session.company.description}
      dropdownContent={dropdownContent}
    >
      <SessionCardInfo icon={<UserIcon />} text={session.user.name} />
      <SessionCardInfo icon={<Phone />} text={session.user.tel} />
      <SessionCardInfo
        icon={<Calendar />}
        text={new Date(session.date).toLocaleString()}
      />
    </SessionCardWithDropdown>
  );
};
