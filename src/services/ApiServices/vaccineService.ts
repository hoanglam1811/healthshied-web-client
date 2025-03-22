import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllVaccines() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/vaccination/vaccine`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function getVaccineById(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/vaccination/vaccine/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function createVaccine(vaccine: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/vaccination/vaccine`,
            vaccine,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function updateVaccine(id:any, vaccine: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/vaccination/vaccine/${id}`,
            vaccine,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function deleteVaccine(id: number) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/vaccination/vaccine/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}
