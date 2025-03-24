import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllUsers() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/user`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function createUser(user: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/user`,
            user,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function getUserById(id: any) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/user/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function updateUser(id:any, user: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/user/${id}`,
            user,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function deleteUser(id: number) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/user/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}
