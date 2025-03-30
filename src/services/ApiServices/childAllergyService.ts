import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllChildAllergies() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/child-allergy`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch chill-allergy:", error);
        throw error;
    }
}

export async function getChildAllergyById(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/child-allergy/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch chill-allergy with ID ${id}:", error);
        throw error;
    }
}

export async function createChildAllergy(childAllergy: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/child-allergy`,
            childAllergy,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to create chill-allergy:", error);
        throw error;
    }
}

export async function updateChildAllergy(id: any, childAllergy: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/child-allergy/${id}`,
            childAllergy,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to update chill-allergy with ID ${id}:", error);
        throw error;
    }
}

export async function deleteChildAllergy(id: number) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/child-allergy/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to delete chill-allergy with ID ${id}:", error);
        throw error;
    }
}
