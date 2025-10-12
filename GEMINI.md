# Main Project Context: Camper Intelligence Next.js Project with Docker Setiup

## General Instructions
- **Never** replace code with comments like `// TODO: implement this` or `# TODO: implement this` or `// ... (do something) ` or `// ... (rest of the function)`.
- **Never** use any as a type unless absolutely necessary. If so make sure to include a eslint comment to disable the rule for that line.
- **Always** Run `npm run lint` after file changes and fix resulting errors. If "> eslint" is not followed by errors, you are good to go. Once all errors are fixed, ask the user if he would like you to fix the warnings.
- **Always** Before presenting a solution, double check that your response did not in fact remove code to simplify with comments. Restore the deleted code if that is the case.
- Try to prevent any linting errors from appearing in the first place.
- Do not decline variables that are not used. Instead, remove them. Do not define imports that are not used. Instead, remove them.
- After editing a .json file always run it through a json validator to ensure proper formatting. Insert new attributes before the last attribute of the target object depth.
- Pages should always be server components unless interactivity is required. In that case, use "use client" directive at the top of the file. Every page should provide metadata for the tile and description at the minimum.
- If page.tsy uses an async function to pass a params object the interface should expect params to be a Promise and awaited before use.