import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllVaccinePackages() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/vaccination-package`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in getAllVaccinePackages:", error);
        throw error;
    }
}

export async function getVaccinePackageById(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/vaccination-package/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in getVaccinePackageById:", error);
        throw error;
    }
}

export async function createVaccinePackage(vaccinePackage: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/vaccination-package`,
            vaccinePackage,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in createVaccinePackage:", error);
        throw error;
    }
}

export async function updateVaccinePackage(id: any, vaccinePackage: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/vaccination-package/${id}`,
            vaccinePackage,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in updateVaccinePackage:", error);
        throw error;
    }
}

export async function deleteVaccinePackage(id: number) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/vaccination-package/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("API error in deleteVaccinePackage:", error);
        throw error;
    }
}
