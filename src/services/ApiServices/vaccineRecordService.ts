import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllVaccineRecord() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/vaccination-record`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("VaccineRecord failed:", error);
        throw error;
    }
}

export async function getVaccineRecordById(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/vaccination-record/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("VaccineRecord failed:", error);
        throw error;
    }
}

export async function createVaccineRecord(vaccine: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/vaccination-record`,
            vaccine,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("VaccineRecord failed:", error);
        throw error;
    }
}

export async function updateVaccineRecord(id: any, vaccine: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/vaccination-record/${id}`,
            vaccine,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("VaccineRecord failed:", error);
        throw error;
    }
}

export async function deleteVaccineRecord(id: number) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/vaccination-record/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("VaccineRecord failed:", error);
        throw error;
    }
}
