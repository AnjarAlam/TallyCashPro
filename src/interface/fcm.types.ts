export interface FcmTokenPayload {
  token: string;
}

export interface SendFcmNotificationPayload {
  title: string;
  body: string;
  userId?: string;
  topic?: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface FcmActionResponse {
  status?: number;
  message: string;
  data?: unknown;
}
