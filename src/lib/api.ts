// Force the API URL to explicitly point to HostGator because Netlify's build environment is sometimes read as 'development'
export const API_URL = 'https://estampakits.com/gen/api';

export interface StyleDNA {
    id: string | number;
    name: string;
    description: string;
    image: string;
    tags: string;
    style_dna: string;
}

export interface Template {
    id: string | number;
    name: string;
    description: string;
    image: string;
    rules_positive: string;
    rules_negative: string;
    die_cut_default: number;
}

export async function fetchStyles(): Promise<StyleDNA[]> {
    try {
        const res = await fetch(`${API_URL}/styles.php`);
        const json = await res.json();
        if (json.success) return json.data;
        throw new Error(json.error || 'Failed to fetch styles');
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function fetchTemplates(): Promise<Template[]> {
    try {
        const res = await fetch(`${API_URL}/templates.php`);
        const json = await res.json();
        if (json.success) return json.data;
        throw new Error(json.error || 'Failed to fetch templates');
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function generatePrompts(payload: any) {
    const res = await fetch(`${API_URL}/generate.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Server error generating prompts');
    return json.data;
}
