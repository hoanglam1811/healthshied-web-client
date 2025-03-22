import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllChildren() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/child`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function getChildById(id: any) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/child/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function updateChild(id: any, child: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/child/${id}`,
            child,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function getChildrenByCustomerId(id: any) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/child/by-customer-id/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function createChild(child: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/child`,
            child,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export async function deleteChild(id: any) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/child/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}
