import axios from 'axios';
import { ANALYZE_ENDPOINT } from '../src/config'; // adjust path if needed

const API_URL = ANALYZE_ENDPOINT;

export const createJournal = async (token, journalData) => {
    return await axios.post(API_URL, journalData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getUserJournals = async (token, userId) => {
    return await axios.get(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteJournal = async (token, journalId) => {
    return await axios.delete(`${API_URL}/${journalId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
