import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const CONNECTED = "connected";

/**
 * Lifecycle-aware chat subscription:
 * - Depends on selectedUser, socket, and connectionStatus.
 * - Subscribes only when socket exists, is connected, and selectedUser is set.
 * - Cleans up on unmount or when deps change.
 * - Prevents race where subscription runs before socket is ready.
 */
export function useChatSubscription() {
  const socket = useAuthStore((s) => s.socket);
  const connectionStatus = useAuthStore((s) => s.connectionStatus);
  const selectedUser = useChatStore((s) => s.selectedUser);
  const getMessages = useChatStore((s) => s.getMessages);
  const subscribeToMessages = useChatStore((s) => s.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((s) => s.unsubscribeFromMessages);

  useEffect(() => {
    if (!selectedUser?._id) return;

    // Load history for the conversation
    getMessages(selectedUser._id);

    // Only subscribe when socket exists and is connected. Track whether we
    // actually subscribed so cleanup can be a no-op if nothing was added.
    let subscribed = false;
    const ready = socket && connectionStatus === CONNECTED;
    if (ready) {
      subscribeToMessages();
      subscribed = true;
    }

    return () => {
      if (subscribed) {
        unsubscribeFromMessages();
      }
    };
  }, [selectedUser?._id, socket, connectionStatus, getMessages, subscribeToMessages, unsubscribeFromMessages]);
}
