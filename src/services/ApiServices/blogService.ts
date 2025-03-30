import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getAllBlogs() {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/blog`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        throw error;
    }
}

export async function getBlogById(id: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/api/blog/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch blog with ID ${id}:", error);
        throw error;
    }
}

export async function createBlog(blog: any) {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/blog`,
            blog,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to create blog:", error);
        throw error;
    }
}

export async function updateBlog(id: any, blog: any) {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/blog/${id}`,
            blog,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to update blog with ID ${id}:", error);
        throw error;
    }
}

export async function deleteBlog(id: number) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/api/blog/${id}`,
            ngrokSkipWarning
        );
        return response.data;
    } catch (error) {
        console.error("Failed to delete blog with ID ${id}:", error);
        throw error;
    }
}
