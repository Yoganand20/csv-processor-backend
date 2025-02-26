import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import processImages from "./imageProcessor.js";
import { createObjectCsvWriter } from "csv-writer";
import CSVJOB from "../model/csvJob.model.js";

if (!fs.existsSync("output")) {
    fs.mkdirSync("output", { recursive: true });
}
const parseUrls = (urlColumn) => {
    return urlColumn
        .split(/,/)
        .map((url) => url.trim())
        .filter((url) => url !== "");
};

function createCSVStreamWriter(outputFilePath) {
    const csvWriter = createObjectCsvWriter({
        path: outputFilePath + ".csv",
        header: [
            { id: "s__no", title: "S. No." },
            { id: "product_name", title: "Product Name" },
            { id: "input_image_url", title: "Input Image Urls" },
            { id: "output_image_url", title: "Output Image Urls" },
        ],
        append: false,
    });
    return csvWriter;
}

export default async function processCSV(filedir, filename) {
    const inputFilePath = path.join(filedir, filename);
    const outputFilePath = path.join("output", filename);

    const csvWriter = createCSVStreamWriter(outputFilePath);

    console.log("Processing CSV file:", inputFilePath);

    //  Parse the CSV file and extract URLs
    fs.createReadStream(inputFilePath)
        .pipe(
            csvParser({
                mapHeaders: ({ header }) =>
                    header.toLowerCase().replace(/[\s.]/g, "_"),
            })
        )
        .on("headers", (headers) => {
            console.log(headers);
        })
        .on("data", async function (row) {
            this.pause();
            try {
                const url_list = parseUrls(row.input_image_url);
                console.log("Input Image URLs:", url_list);
                processImages(url_list).then((outputImageURIs) => {
                    console.log("Output Image URLs:", outputImageURIs);
                    const outputImageURLsString = outputImageURIs.join(", ");
                    const newRow = [];
                    newRow.push({
                        s__no: row.s__no,
                        product_name: row.product_name,
                        input_image_url: row.input_image_url,
                        output_image_url: outputImageURLsString,
                    });
                    csvWriter.writeRecords(newRow);
                    console.log("Row Processed", newRow);
                });
            } catch (error) {
                console.log(error);
                CSVJOB.findOne({ jobId: row.s__no }, (err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        doc.status = "Failed";
                        doc.save();
                    }
                });
            } finally {
                this.resume();
            }
        })
        .on("end", () => {
            console.log("CSV Processed");
            fs.unlinkSync(inputFilePath);
        })
        .on("error", (error) => {
            fs.unlinkSync(inputFilePath);
            res.status(500).send("Error reading the CSV file.");
        });
}
