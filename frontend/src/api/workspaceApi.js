import api from './authApi';

export const getWorkspaces = () => api.get('/api/workspaces');

export const getWorkspace = (id) => api.get(`/api/workspaces/${id}`);

export const createWorkspace = (data) => api.post('/api/workspaces', data);

export const createInvite = (workspaceId, data) =>
  api.post(`/api/workspaces/${workspaceId}/invites`, data);

export const acceptInvite = (token) => api.post(`/api/invites/accept/${token}`);

export const removeMember = (workspaceId, userId) =>
  api.delete(`/api/workspaces/${workspaceId}/members/${userId}`);
