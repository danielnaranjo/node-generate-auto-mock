import { faker } from "@faker-js/faker";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

/** Mapeo de claves a generadores de Faker */
const fieldGuesser: Record<string, () => any> = {
    id: () => faker.string.uuid(),
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
    label: () => faker.commerce.productName(),
    status: () => faker.helpers.arrayElement(["active", "inactive", "pending"]),
    service: () => faker.commerce.department(),
    columns: () => Array.from({ length: 3 }, () => ({ definition: faker.lorem.word(), label: faker.word.words(2) })),
    values: () => Array.from({ length: 3 }, () => ({ id: faker.string.uuid(), name: faker.person.fullName() })),
    url: () => faker.internet.url(),
    route: () => faker.internet.url(),
};

export const guessValue = (key: string, type: string) => {
    const k = key.toLowerCase();
    const match = Object.entries(fieldGuesser).find(([p]) => k.includes(p));
    if (match) return match[1]();
    if (type.includes("boolean")) return faker.datatype.boolean();
    if (type.includes("number")) return faker.number.int({ min: 1, max: 100 });
    return type.includes("[]") ? [] : faker.word.sample();
};

export const parseInterface = (content: string, interfaceName: string) => {
    const match = content.match(new RegExp(`interface ${interfaceName}\\s*{([\\s\\S]*?)}`, "m"));

    if (!match) return null;

    return match[1].split("\n")
        .map(l => l.trim())
        .filter(l => l && l.includes(":"))
        .reduce((acc, line) => {
            const [p, t] = line.split(":");
            const key = p.replace("?", "").trim();
            acc[key] = guessValue(key, t.split(";")[0].trim());
            return acc;
        }, {} as any);
};

export const generateMockFile = (filePath: string, interfaceName: string) => {
    if (!filePath || !interfaceName || !existsSync(filePath)) {
        throw new Error("Error: Usage: pnpm generate <path> <interface>");
    }

    const content = readFileSync(filePath, "utf-8");
    const mockData = parseInterface(content, interfaceName);

    if (!mockData) {
        throw new Error(`Error: Interface "${interfaceName}" not found in ${filePath}`);
    }

    const out = join(process.cwd(), "mock-data");
    if (!existsSync(out)) mkdirSync(out);

    writeFileSync(join(out, `${interfaceName}.mock.js`), `/** Mock: ${interfaceName} */\nmodule.exports = ${JSON.stringify(mockData, null, 2)};\n`);
    return join(out, `${interfaceName}.mock.js`);
};

const main = () => {
    if (require.main === module) {
        let args = process.argv.slice(2);
        // Filtramos '--' que pnpm o ts-node pueden inyectar
        args = args.filter(arg => arg !== '--');
        
        const [filePath, name] = args;
        try {
            const result = generateMockFile(filePath, name);
            console.log(`✅ Created: ${result}`);
        } catch (error: any) {
            console.error(error.message);
            process.exit(1);
        }
    }
};

main();
