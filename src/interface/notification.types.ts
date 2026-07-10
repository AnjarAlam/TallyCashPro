export type NotificationType =
  | "transaction_created"
  | "transaction_updated"
  | "transaction_deleted"
  | "business_updated"
  | "book_created"
  | "book_updated"
  | "book_deleted"
  | "book_transfer"
  | "member_added"
  | "member_removed"
  | string;

export interface AppNotification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  type?: NotificationType;
  data?: Record<string, unknown>;
  isRead: boolean;
  actorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsListData {
  items: AppNotification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export interface NotificationsListResponse {
  status?: number;
  message?: string;
  success?: boolean;
  data: NotificationsListData;
}

export interface UnreadCountResponse {
  status?: number;
  message?: string;
  success?: boolean;
  data: { count: number };
}

export interface NotificationsQueryParams {
  page?: number;
  limit?: number;
}
