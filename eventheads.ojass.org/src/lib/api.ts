// API base URL - defaults to localhost, should be set via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for cookies
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiRequest<{ success: boolean; message: string }>('/api/admin/auth/logout', {
      method: 'POST',
    });
  },
};

// Event API Types
export interface EventPrizes {
  total: string;
  winner: string;
  first_runner_up: string;
  second_runner_up: string;
}

export interface EventHead {
  name: string;
  Phone: string;
}

export interface Event {
  _id: string;
  name: string;
  teamSizeMin: number;
  teamSizeMax: number;
  isTeamEvent: boolean;
  img: string;
  rulebookurl: string;
  redirect: string;
  organizer?: string;
  description: string;
  prizes: EventPrizes;
  details: string[];
  rules: string[];
  event_head: EventHead;
  winners: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventData {
  name: string;
  teamSizeMin: number;
  teamSizeMax: number;
  isTeamEvent: boolean;
  img: string;
  rulebookurl: string;
  redirect: string;
  organizer?: string;
  description: string;
  prizes: EventPrizes;
  details: string[];
  rules: string[];
  event_head: EventHead;
  winners?: string[];
}

// Event API
export const eventAPI = {
  getAll: async (): Promise<Event[]> => {
    return apiRequest<Event[]>('/api/admin/events');
  },

  getById: async (eventId: string): Promise<Event> => {
    return apiRequest<Event>(`/api/admin/events/${eventId}`);
  },

  create: async (eventData: CreateEventData): Promise<Event> => {
    return apiRequest<Event>('/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  update: async (eventId: string, eventData: Partial<CreateEventData>): Promise<Event> => {
    return apiRequest<Event>(`/api/admin/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  delete: async (eventId: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/api/admin/events/${eventId}`, {
      method: 'DELETE',
    });
  },
};

// Media API
export interface UploadFileResponse {
  message: string;
  files: Array<{
    fileId: string;
    url: string;
    cloudinaryId: string;
    imageUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    resourceType: string;
    isIdCard: boolean;
    createdAt: string;
  }>;
}

export const mediaAPI = {
  upload: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// User API Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  ojassId: string;
  gender: string;
  collegeName: string;
  city: string;
  state: string;
  isPaid: boolean;
  isEmailVerified: boolean;
  isNitJsrStudent: boolean;
  referralCount: number;
  eventCount?: number;
  paymentAmount?: number;
  paymentDate?: string;
  idCardImageUrl?: string;
  idCardCloudinaryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// User API
export const userAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    paymentStatus?: 'all' | 'paid' | 'unpaid';
    emailVerified?: string;
  }): Promise<{ users: User[]; pagination: UserPagination }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    if (params?.emailVerified) queryParams.append('emailVerified', params.emailVerified);

    const query = queryParams.toString();
    return apiRequest<{ users: User[]; pagination: UserPagination }>(
      `/api/admin/users${query ? `?${query}` : ''}`
    );
  },

  getById: async (userId: string): Promise<User> => {
    return apiRequest<User>(`/api/admin/users/${userId}`);
  },

  update: async (userId: string, userData: Partial<User>): Promise<User> => {
    return apiRequest<User>(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (userId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  getRegistrations: async (userId: string): Promise<Team[]> => {
    return apiRequest<Team[]>(`/api/admin/users/${userId}/registrations`);
  },

  getReferrals: async (userId: string): Promise<{ referrer: { _id: string; ojassId: string }; referredUsers: Array<{ _id: string; name: string; email: string; phone: string; ojassId: string; college: string; isPaid: boolean; registeredAt: string }> }> => {
    return apiRequest<{ referrer: { _id: string; ojassId: string }; referredUsers: Array<{ _id: string; name: string; email: string; phone: string; ojassId: string; college: string; isPaid: boolean; registeredAt: string }> }>(`/api/admin/users/${userId}/referrals`);
  },
};

// Team API Types
export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  phone: string;
  ojassId: string;
  isPaid?: boolean;
  collegeName?: string;
}

export interface TeamEvent {
  _id: string;
  name: string;
  teamSizeMin: number;
  teamSizeMax: number;
  isTeamEvent: boolean;
  img?: string;
}

export interface Team {
  _id: string;
  eventId: TeamEvent | string;
  isIndividual: boolean;
  teamName?: string;
  teamLeader: TeamMember | string;
  teamMembers: TeamMember[] | string[];
  joinToken?: string;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Team API
export const teamAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    eventId?: string;
    isIndividual?: string;
  }): Promise<{ teams: Team[]; pagination: TeamPagination }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.eventId) queryParams.append('eventId', params.eventId);
    if (params?.isIndividual) queryParams.append('isIndividual', params.isIndividual);

    const query = queryParams.toString();
    return apiRequest<{ teams: Team[]; pagination: TeamPagination }>(
      `/api/admin/teams${query ? `?${query}` : ''}`
    );
  },

  getById: async (teamId: string): Promise<Team> => {
    return apiRequest<Team>(`/api/admin/teams/${teamId}`);
  },

  update: async (teamId: string, data: { isVerified?: boolean }): Promise<{ success: boolean; team: Team }> => {
    return apiRequest<{ success: boolean; team: Team }>(`/api/admin/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (teamId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(`/api/admin/teams/${teamId}`, {
      method: 'DELETE',
    });
  },
};

// Registration API
export const registrationAPI = {
  getByEvent: async (eventId: string): Promise<Team[]> => {
    return apiRequest<Team[]>(`/api/admin/events/${eventId}/registrations`);
  },

  getById: async (eventId: string, registrationId: string): Promise<Team> => {
    return apiRequest<Team>(`/api/admin/events/${eventId}/registrations/${registrationId}`);
  },

  verify: async (eventId: string, registrationId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(
      `/api/admin/events/${eventId}/registrations/${registrationId}/verify`,
      { method: 'POST' }
    );
  },

  reject: async (eventId: string, registrationId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(
      `/api/admin/events/${eventId}/registrations/${registrationId}/reject`,
      { method: 'POST' }
    );
  },

  getVerified: async (eventId: string): Promise<Team[]> => {
    return apiRequest<Team[]>(`/api/admin/events/${eventId}/registrations/verified`);
  },

  getRejected: async (eventId: string): Promise<Team[]> => {
    return apiRequest<Team[]>(`/api/admin/events/${eventId}/registrations/rejected`);
  },
};

// Stats API Types
export interface Stats {
  users: {
    total: number;
    paid: number;
    unpaid: number;
    emailVerified: number;
    nitJsr: number;
  };
  teams: {
    total: number;
    individual: number;
    team: number;
  };
  events: {
    total: number;
    teamEvents: number;
    individualEvents: number;
  };
  registrationsByEvent: Array<{
    eventId: string;
    eventName: string;
    registrations: number;
  }>;
  payments: {
    totalAmount: number;
    averageAmount: number;
  };
  referrals: {
    totalReferrals: number;
    usersWithReferrals: number;
  };
}

// Stats API
export const statsAPI = {
  getAll: async (): Promise<Stats> => {
    return apiRequest<Stats>('/api/admin/stats');
  },
};

// Notification API Types
export interface Notification {
  _id: string;
  title: string;
  description: string;
  recipients?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationData {
  title: string;
  description: string;
  recipientIds?: string[]; // Optional: specific user IDs, or omit to send to all
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    notification: Notification;
    recipients: number;
    pushNotifications: {
      sent: number;
      failed: number;
    };
  };
}

// Notification API
export const notificationAPI = {
  getAll: async (): Promise<{ success: boolean; data: Notification[] }> => {
    return apiRequest<{ success: boolean; data: Notification[] }>('/api/admin/notification');
  },

  create: async (notificationData: CreateNotificationData): Promise<NotificationResponse> => {
    return apiRequest<NotificationResponse>('/api/admin/notification', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },
};

