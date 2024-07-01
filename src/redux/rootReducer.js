// src/redux/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companyReducer from './slices/companySlice';
import departmentsReducer from './slices/departmentSlice'
import positionReducer from './slices/positionSlice';
import candidateReducer from './slices/candidateSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  companies: companyReducer,
  departments: departmentsReducer,
  positions: positionReducer,
  candidates: candidateReducer
});

export default rootReducer;
