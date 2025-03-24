import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/shadcn/dropdown-menu";
import { Calendar, Phone, UserIcon } from "lucide-react";
import { InterviewSessionCardInfo } from "./InterviewSessionCardInfo";
import { InterviewSessionCardWithDropdown } from "./InterviewSessionCardWithDropdown";

interface AdminSessionCardProps {
  interviewSession: InterviewSession;

  onEdit?: () => void;
  onDelete?: () => void;
}

export const AdminSessionCard: React.FC<AdminSessionCardProps> = ({
  interviewSession,
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
    <InterviewSessionCardWithDropdown
      title={interviewSession.company.name}
      description={interviewSession.company.description}
      dropdownContent={dropdownContent}
    >
      <InterviewSessionCardInfo
        icon={UserIcon}
        text={interviewSession.user.name}
      />
      <InterviewSessionCardInfo icon={Phone} text={interviewSession.user.tel} />
      <InterviewSessionCardInfo
        icon={Calendar}
        text={new Date(interviewSession.date).toLocaleString()}
      />
    </InterviewSessionCardWithDropdown>
  );
};
