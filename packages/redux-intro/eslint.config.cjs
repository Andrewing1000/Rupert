const globals = require("globals");
const pluginJs = require("@eslint/js");
const pluginReact = require("eslint-plugin-react");
//const version = require("react").version;

/** @type {import('eslint').Linter.Config[]} */
module.exports =  [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
//  pluginJs.configs.recommended,
//  pluginReact.configs.flat.recommended,
  {
    name: "************Custom ESConfig************",
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: [],
    //languageOptions: {
    // ecmaVersion: (latest|(?<year>\d{4})|(?<version>\d{0,2})),
    // sourceType: (script|module|commonJS),
    // globals: Object,
    // parser: Object with parse() method or parseForESLint method
    // perserOptions: Object with option to pass to parser
    //}
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: true,
    },
    // processor: Obj.preprocess | Obj.preprocess | string
    // plugins: {
    // <name> : Obj
    // }
    rules: {
      "no-unused-vars": [
        "warn",
        {
          vars: "all", //local
          args: "after-used", //all, none
          varsIgnorePattern: "^_",
        },
      ],
      camelcase: "warn",
      "no-case-declarations": "error",
      "react/prop-types": "warn",
    },
    settings: {
      react: {
        version: "detect",
      }
    }
  },
  
  
  {
    name: "REACT TRANQUILITO",
    rules:{
      "react/jsx-uses-react": "off",
    }
  }
];
