import apiClient from './apiClient';

export const login = async (credentials) => {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
};

export const register = async (data) => {
  const response = await apiClient.post('/api/auth/register', data);
  return response.data;
};

export const getAllCompanies = async () => {
  const response = await apiClient.get('/api/company/get-all-company');
  return response.data;
};

export const createDepartment = async (data) => {
  const response = await apiClient.post('/api/department/create-department', data);
  return response.data;
};

export const getAllDepartmens = async () => {
  const response = await apiClient.get('/api/department/get-all-departments');
  return response.data;
};

export const editDepartment = async (data) => {
  const response = await apiClient.put(`/api/department/edit-department/${data.id}`, data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await apiClient.delete(`/api/department/delete-department/${id}`);
  return response.data;
};

export const createPosition = async (data) => {
  const response = await apiClient.post('/api/position/create-position', data);
  return response.data;
};

export const getAllPositions = async () => {
  const response = await apiClient.get('/api/position/get-all-positions');
  return response.data;
};

export const getPositionDetails = async (id) => {
  const response = await apiClient.get(`/api/position/get-one-position/${id}`);
  return response.data;
};

export const getCandidatesByPositionId = async (positionId) => {
  const response = await apiClient.get(`/api/candidate/get-candidates-by-position/${positionId}`);
  return response.data;
};

export const editPosition = async (id, data) => {
  const response = await apiClient.put(`/api/position/edit-position/${id}`, data);
  return response.data;
};

export const getAllCandidates = async () => {
  const response = await apiClient.get('/api/candidate/get-all-candidates');
  return response.data;
};

export const editCandidate = async (id, data) => {
  const response = await apiClient.put(`/api/candidate/edit-candidate/${id}`, data);
  return response.data;
};

export const qualifyCandidate = async (id) => {
  const response = await apiClient.put(`/api/candidate/qualify-candidate/${id}`);
  return response.data;
};


export const deleteCandidate = async (id) => {
  const response = await apiClient.delete(`/api/candidate/delete-candidate/${id}`);
  return response.data;
};

export const getCandidatesByFilters = async (filters) => {
  const response = await apiClient.post('/api/candidate/get-candidates-by-filters', filters);
  return response.data;
};

export const getArchivedCandidatesByFilters = async (filters) => {
  const response = await apiClient.post('/api/candidate/get-archived-candidates-by-filters', filters);
  return response.data;
};

export const archivePosition = async (id) => {
  const response = await apiClient.put(`/api/position/archive-position/${id}`);
  return response.data;
};

export const trashPosition = async (id) => {
  const response = await apiClient.put(`/api/position/trash-position/${id}`);
  return response.data;
};

export const fetchArchivedPositions = async () => {
  const response = await apiClient.get('/api/position/get-archived-positions');
  return response.data;
};

export const getUserData = async () => {
  const response = await apiClient.get('/api/user/get-user');
  return response.data;
};

export const createCandidate = async (data) => {
  const response = await apiClient.post('/api/candidate/create-candidate', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getCandidateDetails = async (id) => {
  const response = await apiClient.get(`/api/candidate/get-one-candidate/${id}`)
  return response.data;
}

export const updateUserProfile = async (profileData) => {
  const response = await apiClient.put('/api/user/edit-user', profileData);
  return response.data;
};

export const changeUserPassword = async (passwordData) => {
  const response = await apiClient.put('/api/user/change-password', passwordData);
  return response.data;
};
