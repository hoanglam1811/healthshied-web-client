import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllVaccineCategories() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/vaccine-category`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("VaccineCategory failed:", error);
        throw error;
    }
}

export async function getVaccineCategoryById(id: any) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/vaccine-category/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("VaccineCategory failed:", error);
        throw error;
    }
}

export async function createVaccineCategory(vaccine: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/vaccine-category`,
            vaccine,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("VaccineCategory failed:", error);
        throw error;
    }
}

export async function updateVaccineCategory(id: any, vaccine: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/vaccine-category/${id}`,
            vaccine,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("VaccineCategory failed:", error);
        throw error;
    }
}

export async function deleteVaccineCategory(id: any) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/vaccine-category/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("VaccineCategory failed:", error);
        throw error;
    }
}
