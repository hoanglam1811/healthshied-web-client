import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllAllergies() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/allergy`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch allergy:", error);
        throw error;
    }
}

export async function getAllergyById(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/allergy/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch allergy with ID ${id}:", error);
        throw error;
    }
}

export async function getAllergyByChildId(childId: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/allergy/by-child/${childId}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch allergy with ID ${id}:", error);
        throw error;
    }
}

export async function createAllergy(allergy: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/allergy`,
            allergy,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to create allergy:", error);
        throw error;
    }
}

export async function updateAllergy(id: any, allergy: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/allergy/${id}`,
            allergy,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to update allergy with ID ${id}:", error);
        throw error;
    }
}

export async function deleteAllergy(id: number) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/allergy/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to delete allergy with ID ${id}:", error);
        throw error;
    }
}
