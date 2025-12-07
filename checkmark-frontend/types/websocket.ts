export interface PresenceUser {
  id: string;
  name: string;
  avatar: string;
  color: string; // For cursor color
  cursor?: {
    x: number;
    y: number;
  };
}

// Define specific payload types for each message type
export interface PresenceJoinPayload {
  userId: string;
  user: PresenceUser;
}

export interface PresenceLeavePayload {
  userId: string;
}

export interface CursorMovePayload {
  userId: string;
  cursor: {
    x: number;
    y: number;
  };
}

export interface ChartUpdatePayload {
  chartId: string;
  data: unknown; // We'll define this better when we add charts
}

// Union type for all possible messages
export type WebSocketMessage =
  | {
      type: 'presence_join';
      payload: PresenceJoinPayload;
      userId: string;
      workspaceId: string;
      timestamp: number;
    }
  | {
      type: 'presence_leave';
      payload: PresenceLeavePayload;
      userId: string;
      workspaceId: string;
      timestamp: number;
    }
  | {
      type: 'cursor_move';
      payload: CursorMovePayload;
      userId: string;
      workspaceId: string;
      timestamp: number;
    }
  | {
      type: 'chart_update';
      payload: ChartUpdatePayload;
      userId: string;
      workspaceId: string;
      timestamp: number;
    };

export interface PresenceState {
  users: Map<string, PresenceUser>;
  currentUser: PresenceUser | null;
}