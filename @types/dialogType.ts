import { MessageType } from "./messageType.ts";

export type DialogType = {
  id: string;
  messages: MessageType[];
  user_id: string;
  user2_id: string;
};
