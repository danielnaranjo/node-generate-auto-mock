import { faker } from '@faker-js/faker';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Ejemplo con tus interfaces de tabla
 npx ts-node scripts/generate-mock-data.ts src/app/core/table/table.interface.ts IFTableData

 * Ejemplo con cualquier otro archivo (el script lo parseará automáticamente)
 npx ts-node scripts/generate-mock-data.ts src/app/core/user/user.types.ts UserAccount
*/

const fieldGuesser: Record<string, () => any> = {
    id: () => faker.string.uuid(),
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
    label: () => faker.commerce.productName(),
    status: () => faker.helpers.arrayElement(['active', 'inactive', 'pending']),
    service: () => faker.commerce.department(),
    columns: () => Array.from({ length: 3 }, () => ({ definition: faker.lorem.word(), label: faker.word.words(2) })),
    values: () => Array.from({ length: 3 }, () => ({ id: faker.string.uuid(), name: faker.person.fullName() })),
    url: () => faker.internet.url(),
    route: () => faker.internet.url(),
};

const guessValue = (key: string, type: string) => {
    const k = key.toLowerCase();
    const match = Object.entries(fieldGuesser).find(([p]) => k.includes(p));
    if (match) return match[1]();
    if (type.includes('boolean')) return faker.datatype.boolean();
    if (type.includes('number')) return faker.number.int({ min: 1, max: 100 });
    return type.includes('[]') ? [] : faker.word.sample();
};

const main = () => {
    const [path, name] = process.argv.slice(2);

    if (!path || !name || !existsSync(path)) {
        process.stderr.write('Error: Usage: npx ts-node scripts/generate-mock-data.ts <path> <interface>\n');
        process.exit(1);
    }

    const content = readFileSync(path, 'utf-8');
    const match = content.match(new RegExp(`interface ${name}\\s*{([\\s\\S]*?)}`, 'm'));

    if (!match) {
        console.error(`Error: No se encontró la interfaz "${name}"`);
        process.exit(1);
    }

    const mockData = match[1].split('\n')
        .map(l => l.trim())
        .filter(l => l && l.includes(':'))
        .reduce((acc, line) => {
            const [p, t] = line.split(':');
            const key = p.replace('?', '').trim();
            acc[key] = guessValue(key, t.split(';')[0].trim());
            return acc;
        }, {} as any);

    const out = join(process.cwd(), 'mock-data');
    if (!existsSync(out)) mkdirSync(out);

    writeFileSync(join(out, `${name}.mock.js`), `/** Mock: ${name} */\nmodule.exports = ${JSON.stringify(mockData, null, 2)};\n`);
    console.log(`Created: mock-data/${name}.mock.js`);
};

main();
