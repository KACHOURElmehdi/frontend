import api from './api';
import { StatsOverview, CategoryStat } from '../types';

export const getStats = async () => {
    const response = await api.get<StatsOverview>('/stats/overview');
    return response.data;
};

export const getCategoryStats = async () => {
    const response = await api.get<CategoryStat[]>('/stats/categories');
    return response.data;
};
