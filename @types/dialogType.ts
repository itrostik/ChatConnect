export type DialogType = {
  id: string;
  messages: {
    created: number;
    id: string;
    messageText: string;
    sender_id: string;
  }[];
  user_id: string;
  user2_id: string;
};
