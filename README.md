# Node Generate Auto Mock

Este proyecto es una herramienta sencilla para generar datos de prueba (mocks) automáticamente a partir de interfaces de TypeScript utilizando `@faker-js/faker`.

## Requisitos

- Node.js
- pnpm (o npm/yarn)

## Instalación

1. Clona el repositorio o descarga los archivos.
2. Instala las dependencias:

```bash
pnpm install
```

## Uso

Para generar un archivo de mock, ejecuta el siguiente comando:

```bash
pnpm generate <ruta_al_archivo_interface> <nombre_de_la_interfaz>
```

### Ejemplo

Si tienes una interfaz en `src/example.interface.ts`:

```typescript
export interface UserAccount {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
}
```

Puedes generar sus mocks ejecutando:

```bash
pnpm generate src/example.interface.ts UserAccount
```

El resultado se guardará en una carpeta llamada `mock-data/` con el nombre `UserAccount.mock.js`.

## Cómo funciona

El script lee el contenido del archivo proporcionado, busca la definición de la interfaz mediante regex y genera un objeto con valores aleatorios basados en los nombres de las propiedades y sus tipos.

### Personalización

Puedes añadir más reglas de generación en el objeto `fieldGuesser` dentro de [src/generate-mock-data.ts](src/generate-mock-data.ts).

## Estructura del Proyecto

- `src/generate-mock-data.ts`: Script principal de generación.
- `src/example.interface.ts`: Ejemplo de interfaz para pruebas.
- `tsconfig.json`: Configuración de TypeScript.
- `package.json`: Definición de scripts y dependencias.
