import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllStaffSchedule() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/staff-schedule`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in getAllStaffSchedule:", error);
        throw error;
    }
}

export async function getStaffScheduleById(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/staff-schedule/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in getStaffScheduleById:", error);
        throw error;
    }
}

export async function getStaffScheduleByStaffId(staffId: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/staff-schedule/staff/${staffId}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in getStaffScheduleById:", error);
        throw error;
    }
}

export async function createStaffSchedule(vaccinePackage: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/staff-schedule`,
            vaccinePackage,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in createStaffSchedule:", error);
        throw error;
    }
}

export async function updateStaffSchedule(id: any, vaccinePackage: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/staff-schedule/${id}`,
            vaccinePackage,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in updateStaffSchedule:", error);
        throw error;
    }
}

export async function deleteStaffSchedule(id: number) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/staff-schedule/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in deleteStaffSchedule:", error);
        throw error;
    }
}
