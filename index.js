import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const folderPath = "./data"; // Path to your folder
const outputFile = "combined.txt";

async function combineTextFiles() {
  try {
    const files = await readdir(folderPath);
    const txtFiles = files.filter((file) => file.endsWith(".txt"));

    let combinedContent = "";

    for (const file of txtFiles) {
      const filePath = join(folderPath, file);
      let content = await readFile(filePath, "utf8");

      // Normalize line endings (replace unusual characters)
      content = content.replace(/\r/g, ""); // Remove Carriage Return (Windows CR)
      content = content.replace(/\u2028/g, "\n"); // Replace Line Separator (LS) with \n
      content = content.replace(/\u2029/g, "\n"); // Replace Paragraph Separator (PS) with \n

      combinedContent += `\n=== ${file} ===\n${content}\n`;
    }

    await writeFile(outputFile, combinedContent);
    console.log(
      `✅ All files combined into ${outputFile} (line endings normalized)`
    );
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

combineTextFiles();
