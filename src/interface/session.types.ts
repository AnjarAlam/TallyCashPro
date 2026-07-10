export interface UserSession {
  sessionId: string;
  deviceName: string;
  nickname?: string;
  platform: string;
  loginAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export interface SessionsListResponse {
  status?: number;
  message: string;
  source?: string;
  data: UserSession[];
}

export interface SessionActionResponse {
  status?: number;
  message: string;
  source?: string;
  data?: { message: string };
}

export interface UpdateSessionNicknamePayload {
  sessionId: string;
  nickname: string;
}
