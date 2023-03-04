// @ts-check
const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
        "plugin:jest/style",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:react-redux/recommended",
        "plugin:react/jsx-runtime"
    ],
    overrides: [],
    plugins: [
        "@typescript-eslint",
        "import",
        "regexp",
        "jest",
        "react-redux",
        "react",
        "react-hooks"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        project: ["./tsconfig.json"],
        tsconfigRootDir: "./",
        ecmaFeatures: {
            jsx: true,
            modules: true
        }
    },
    root: true,
    rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
        "jest/no-standalone-expect": [
            "error",
            { additionalTestBlockFunctions: ["then"] }
        ],
        "no-restricted-imports": "off",
        "import/named": 2,
        "@typescript-eslint/no-restricted-imports": [
            "warn",
            {
                name: "react-redux",
                importNames: ["useSelector", "useDispatch"],
                message:
                    "Use typed hooks `useAppDispatch` and `useAppSelector` instead."
            }
        ]
    },
    ignorePatterns: ["src/**/*.test.ts"],
    settings: {
        react: {
            createClass: "createReactClass", // Regex for Component Factory to use,
            // default to "createReactClass"
            pragma: "React", // Pragma to use, default to "React"
            fragment: "Fragment", // Fragment to use (may be a property of <pragma>), default to "Fragment"
            version: "detect", // React version. "detect" automatically picks the version you have installed.
            // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
            // It will default to "latest" and warn if missing, and to "detect" in the future
            flowVersion: "0.53" // Flow version
        },
        propWrapperFunctions: [
            // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
            "forbidExtraProps",
            { property: "freeze", object: "Object" },
            { property: "myFavoriteWrapper" },
            // for rules that check exact prop wrappers
            { property: "forbidExtraProps", exact: true }
        ],
        componentWrapperFunctions: [
            // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
            "observer", // `property`
            { property: "styled" }, // `object` is optional
            { property: "observer", object: "Mobx" },
            { property: "observer", object: "<pragma>" } // sets `object` to whatever value `settings.react.pragma` is set to
        ],
        formComponents: [
            // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
            "CustomForm",
            { name: "Form", formAttribute: "endpoint" }
        ],
        linkComponents: [
            // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
            "Hyperlink",
            { name: "Link", linkAttribute: "to" }
        ]
    }
});
