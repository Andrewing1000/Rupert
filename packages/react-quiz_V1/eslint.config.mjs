import globals from "globals"; //helper library to unify access to window, document, console acrros various enviroments
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */ //Some trypescript shit
export default [ //In esling flat config(this file format) 
  //the config file retuns a list of configuration objects
  //that are each applied secuentially

  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended, 
  {
    rules: {
      "no-unused-vars": ["warn", {"argsIgnorePattern": "^_"}],
      "react/prop-types": "off",
      // "no-case-declarations": "off", //The scope problem in switch-case statements
    }
  }
];


//eslint priority
//eslint.config.mjs
//eslintrc.json
//eslintConfig in package.json

// "eslintConfig": {
//   "extends": [
//       "react-app",
//       "react-app/jest"
//   ]
// }