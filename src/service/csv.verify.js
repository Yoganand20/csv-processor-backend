import fs from "fs";
import path from "path";
import { URL } from "url";

export default function validateCSVFile(fileName, folderPath) {
    try {
        // Validate file extension
        if (!fileName.toLowerCase().endsWith(".csv")) {
            return {
                valid: false,
                message: "Invalid file type. Only CSV files are allowed.",
            };
        }

        // Read file contents
        const filePath = path.join(folderPath, fileName);
        const fileContent = fs.readFileSync(filePath, "utf-8").trim();

        // Parse CSV content
        const lines = fileContent
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line);

        if (lines.length < 1) {
            return { valid: false, message: "CSV file is empty" };
        }

        // Validate headers
        const headers = parseCSVLine(lines[0]);
        const expectedHeaders = ["S. No", "Product Name", "Input Image URL"];

        if (!arraysEqual(headers, expectedHeaders)) {
            return {
                valid: false,
                message: `Invalid headers. Expected: ${expectedHeaders.join(
                    ", "
                )}`,
            };
        }

        const totalRecords = lines.length - 1;
        let expectedSNo = 1;

        // Validate data rows
        for (let i = 1; i < lines.length; i++) {
            const fields = parseCSVLine(lines[i]);

            // Check column count
            if (fields.length !== 3) {
                return {
                    valid: false,
                    message: `Row ${i}: Invalid number of columns (${fields.length} instead of 3)`,
                };
            }

            const [sNo, productName, imageUrls] = fields;

            // Validate S. No sequence
            const currentSNo = parseInt(sNo.trim(), 10);
            if (isNaN(currentSNo)) {
                return {
                    valid: false,
                    message: `Row ${i}: Invalid S. No format`,
                };
            }
            if (currentSNo !== expectedSNo) {
                return {
                    valid: false,
                    message: `Row ${i}: Invalid S. No sequence. Expected ${expectedSNo} but found ${currentSNo}`,
                };
            }
            expectedSNo++;

            // Validate Product Name
            if (!productName.trim()) {
                return {
                    valid: false,
                    message: `Row ${i}: Product Name cannot be empty`,
                };
            }

            // Validate Image URLs
            const urls = imageUrls
                .split(",")
                .map((url) => url.trim())
                .filter((url) => url);
            if (urls.length === 0) {
                return {
                    valid: false,
                    message: `Row ${i}: At least one image URL is required`,
                };
            }

            for (const url of urls) {
                try {
                    const parsedUrl = new URL(url);
                    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                        return {
                            valid: false,
                            message: `Row ${i}: Invalid URL protocol in ${url}. Only HTTP/HTTPS are allowed.`,
                        };
                    }
                } catch (e) {
                    return {
                        valid: false,
                        message: `Row ${i}: Invalid URL format - ${url}`,
                    };
                }
            }
        }

        return {
            valid: true,
            message: `CSV validation successful: ${totalRecords} valid records found`,
            metadata: {
                fileName,
                folderPath,
                totalRecords,
                validatedAt: new Date().toISOString(),
            },
        };
    } catch (error) {
        if (error.code === "ENOENT") {
            return {
                valid: false,
                message: `File not found: ${path.join(folderPath, fileName)}`,
            };
        }
        return {
            valid: false,
            message: `Error processing file: ${error.message}`,
        };
    }
}

// Helper functions
function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === "," && !inQuotes) {
            result.push(current);
            current = "";
        } else {
            current += line[i];
        }
    }
    result.push(current);
    return result;
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}
