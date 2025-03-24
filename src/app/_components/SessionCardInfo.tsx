import { Slot } from "@radix-ui/react-slot";

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
