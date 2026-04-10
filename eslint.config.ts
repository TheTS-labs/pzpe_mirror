import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import unicorn from "eslint-plugin-unicorn";

export default defineConfig([
    { 
        ignores: ["dist", "build", ".react-router"] 
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            "react-hooks": reactHooks as object,
            "react-refresh": reactRefresh,
            "unicorn": unicorn,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { 
                    allowConstantExport: true,
                    allowExportNames: [
                        "loader",
                        "action",
                        "links"
                    ]
                },
            ],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { 
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_"
                }
            ],

            "quotes": ["error", "double"],

            "indent": ["error", 4, { SwitchCase: 1 }],

            "eol-last": ["error", "always"],

            "unicorn/filename-case": [
                "error",
                {
                    cases: {
                        kebabCase: true,
                        pascalCase: true, 
                    },
                    ignore: [
                        "vite\\.config\\.ts",
                        "eslint\\.config\\.ts"
                    ]
                },
            ],

            "@typescript-eslint/naming-convention": [
                "error",
                { selector: "default", format: ["camelCase"] },
                { selector: "import", format: ["camelCase", "PascalCase"] },
                { selector: "variable", format: ["camelCase", "PascalCase", "UPPER_CASE"] },
                { selector: "function", format: ["camelCase", "PascalCase"] },
                { selector: "typeLike", format: ["PascalCase"] },
                { selector: "parameter", format: ["camelCase"], leadingUnderscore: "allow" },
                { selector: "objectLiteralProperty", format: null },
            ],
        },
    }
]);
