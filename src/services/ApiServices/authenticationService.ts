import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function login(email: any, password: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/auth/login`,
            { email, password },
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function register(fullName: string, email: string, phone: string, password: string) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/auth/register`,
            { fullName, email, phone, password },
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Register failed:", error);
        throw error;
    }
}