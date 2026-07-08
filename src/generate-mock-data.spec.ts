import { guessValue, parseInterface } from './generate-mock-data';

describe('Generate Mock Data', () => {
    describe('guessValue', () => {
        it('should return a UUID for "id" key', () => {
            const val = guessValue('id', 'string');
            expect(val).toMatch(/^[0-9a-f-]{36}$/i);
        });

        it('should return a boolean for boolean type', () => {
            const val = guessValue('isActive', 'boolean');
            expect(typeof val).toBe('boolean');
        });

        it('should return a number for number type', () => {
            const val = guessValue('age', 'number');
            expect(typeof val).toBe('number');
        });

        it('should return an email for email key', () => {
            const val = guessValue('email', 'string');
            expect(val).toContain('@');
        });
    });

    describe('parseInterface', () => {
        it('should parse a simple interface', () => {
            const content = `
                export interface TestUser {
                    id: string;
                    name: string;
                    age: number;
                }
            `;
            const result = parseInterface(content, 'TestUser');
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('age');
        });

        it('should return null if interface not found', () => {
            const content = `interface Other {}`;
            const result = parseInterface(content, 'Missing');
            expect(result).toBeNull();
        });
    });
});
