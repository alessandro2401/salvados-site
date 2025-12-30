import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

export function NotificationBell() {
  const utils = trpc.useUtils();
  const { data: unreadNotifications, isLoading } = trpc.notifications.unread.useQuery();
  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.unread.invalidate();
      utils.notifications.list.invalidate();
    },
  });
  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.unread.invalidate();
      utils.notifications.list.invalidate();
      toast.success("Todas as notificações foram marcadas como lidas");
    },
  });

  const unreadCount = unreadNotifications?.length || 0;

  const handleMarkAsRead = (id: number) => {
    markAsRead.mutate({ id });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return "Agora";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : unreadNotifications && unreadNotifications.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto">
            {unreadNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <span className="font-medium text-sm">{notification.titulo}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notification.mensagem}
                </p>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação nova
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
