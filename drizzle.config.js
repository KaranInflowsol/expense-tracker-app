import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    dialect: "postgresql",
    schema: "./utils/schema.jsx",

    driver: "pglite",
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_URL,
    },

    extensionsFilters: ["postgis"],
    schemaFilter: "public",
    tablesFilter: "*",

    introspect: {
        casing: "camel",
    },

    migrations: {
        prefix: "timestamp",
        table: "__drizzle_migrations__",
        schema: "public",
    },

    entities: {
        roles: {
            provider: '',
            exclude: [],
            include: []
        }
    },

    breakpoints: true,
    strict: true,
    verbose: true,
});
