// src/services/api.js

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

export const editPosition = async (id, data) => { // Fungsi untuk mengedit posisi
  const response = await apiClient.put(`/api/position/edit-position/${id}`, data);
  return response.data;
};

export const getAllCandidates = async () => {
  const response = await apiClient.get('/api/candidate/get-all-candidates');
  return response.data;
};

export const getCandidatesByFilters = async (filters) => {
  const response = await apiClient.post('/api/candidate/get-candidates-by-filters', filters);
  return response.data;
};

export const archivePosition = async (id) => {
  const response = await apiClient.put(`/api/position/archive-position/${id}`);
  return response.data;
};

export const fetchArchivedPositions = async () => {
  const response = await apiClient.get('/api/position/get-archived-positions');
  return response.data;
};


