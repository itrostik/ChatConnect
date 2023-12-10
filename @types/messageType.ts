export type MessageType = {
  created: number;
  id: string;
  messageText: string;
  sender_id: string;
  updated: boolean;
  imageUrl: string | null;
  read: boolean;
  isLoading?: boolean;
};
