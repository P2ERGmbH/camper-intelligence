# Main Project Context: Camper Intelligence Next.js Project with Docker Setup

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
- Use Link from import { Link } from '@/i18n/routing'; for all internal links. Do not use next/link or a-Tags directly. Configure Link href not as string, use object notation with pathname and params instead. 
- After an implementation is complete, clear the log.txt file. Instruct the user to try the feature and tell you once he is done. Then check the log.txt file to ensure no errors are being thrown during build or runtime.

### Generic High-Quality Prompt for Figma-to-Code Conversion
Please adhere to the following requirements:
1.  **Styling:** Use Tailwind CSS. The final output should be responsive and match the design's layout and spacing precisely.
2.  **Fonts:** Ensure all necessary fonts, such as "Plus jakarta sans", are imported (e.g., from Google Fonts) and applied correctly to the corresponding text elements.
3.  **Asset Handling:** All image and icon assets should be downloaded to a local 'public/assets/img' folder and update paths. If the file type is SVG, move the file to 'public/assets/svg' and make sure to use .svg as format.
4.  **Layout Implementation :** For complex layouts like the navigation bar, please use CSS Grid to ensure accurate alignment.
5.  **Code Quality:** The final code should be clean, semantic, and well-formatted.
- After the implementation is complete: remove all data-node-id and data-name attributes from the new markup. 
- Next: check that no absolute positioning was used and fixed if so dimensions where implemented. 
- Last: Implement a mobile design if the imported design is not responsive.