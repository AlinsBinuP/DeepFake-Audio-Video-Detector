import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env file");
}

if (!apiKey) {
    console.error("No API Key found in .env");
    process.exit(1);
}

console.log("Using API Key starting with:", apiKey.substring(0, 5) + "...");

async function listModels() {
    try {
        console.log("Fetching available models from Google API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            const modelNames = data.models.map(m => m.name.replace('models/', '')).join('\n');
            console.log(modelNames);
            fs.writeFileSync('models.txt', modelNames);
            console.log("Saved to models.txt");
        } else {
            console.log("No models found. API Response:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
