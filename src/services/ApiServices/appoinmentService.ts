import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAppointmentById(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/appointment/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch appointment with ID ${id}:", error);
        throw error;
    }
}

export async function updateAppointment(id: any, appointment: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/appointment/${id}`,
            appointment,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to update appointment with ID ${id}:", error);
        throw error;
    }
}

export async function deleteAppointment(id: number) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/appointment/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to delete appointment with ID ${id}:", error);
        throw error;
    }
}

export async function createAppointment(appointment: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/appointment`,
            appointment,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to create appointment:", error);
        throw error;
    }
}

export async function getAllAppointments() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/appointment`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch appointment:", error);
        throw error;
    }
}

export async function getAppointmentByClientId(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/appointment/by-client/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch appointment with ID ${id}:", error);
        throw error;
    }
}

export async function getAppointmentByChildId(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/appointment/by-child/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch appointment with ID ${id}:", error);
        throw error;
    }
}

export async function getAppointmentByStaffId(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/appointment/by-staff/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch appointment with ID ${id}:", error);
        throw error;
    }
}
