// lib/api/company.ts
import { CompanyListOneProp } from "@/interface";

export async function getUserCompanies(): Promise<Array<CompanyListOneProp>> {
    try {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

        // Get the token from cookies or your auth provider
        const token = await getToken(); // You'll need to implement this

        const response = await fetch(`${baseURL}/company-members/user-company`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch companies: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user companies:', error);
        return [];
    }
}

// Example token getter function - implement based on your auth system
async function getToken(): Promise<string> {
    // Implementation depends on your auth setup. Examples:

    // 1. If using cookies:
    const cookies = await import('next/headers');
    return (await cookies.cookies()).get('accessToken')?.value || '';

}