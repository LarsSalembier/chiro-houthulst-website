import * as fs from "fs";
import * as path from "path";

/**
 * @param {string} directoryPath
 * @param {string} outputFilePath
 */
function generateTextToFile(directoryPath, outputFilePath) {
  let output = "Import statements removed for brevity.\n\n";

  /**
   * Check if an item (file or directory) should be ignored
   * @param {string} itemName
   * @returns {boolean}
   */
  function shouldIgnoreItem(itemName) {
    const ignoreList = [
      ".env",
      "node_modules",
      ".next",
      "output.txt",
      "next-env.d.ts",
      ".git", // Ignore .git directory
      ".github", // Ignore .github directory
      ".gitignore",
      "generate_structure.js",
    ];
    return ignoreList.includes(itemName);
  }

  /**
   * @param {string} currentPath
   */
  function traverseDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      // Check for ignored items early
      if (shouldIgnoreItem(item)) {
        return;
      }

      const itemPath = path.join(currentPath, item);
      const relativePath = path.relative(directoryPath, itemPath);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        traverseDirectory(itemPath);
      } else if (stats.isFile()) {
        const fileContent = fs
          .readFileSync(itemPath, "utf-8")
          .replace(
            /import\s*(?:(?:.|\r|\n)*?)\s*from\s*(?:(?:.|\r|\n)*?)\s*;\r?\n/g,
            "",
          )
          .replace(/(\r?\n){3,}/g, "\n\n");

        output += `${directoryPath}/${relativePath}:\n${fileContent}\n\n`;
      }
    });
  }

  fs.writeFileSync(outputFilePath, "");
  traverseDirectory(directoryPath);
  fs.writeFileSync(outputFilePath, output);
  console.log(`Generated text written to: ${outputFilePath}`);
}

// Get target directory from command arguments
const targetDirectory = process.argv[2] ?? ".";
const outputFile = "output.txt";

generateTextToFile(targetDirectory, outputFile);
