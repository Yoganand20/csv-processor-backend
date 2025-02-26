import Bull from "bullmq";
import IORedis from 'ioredis';
import processCSV from "./csvProcessor.js";
import CSVJOB from "../model/csvJob.model.js";

const connection = new IORedis({ maxRetriesPerRequest: null });

const csvQueue = new Bull.Queue('csv-queue', { connection });

async function addCSVToQueue(filename) {
    console.log('Adding CSV file to queue:', filename);
    const csv_job = new CSVJOB({
        inputFile: filename,
        outputFile: '',
        status: 'Queued',
    });
    try {
        const file_request_id = (await csv_job.save())._id.toString();
        await csvQueue.add(file_request_id, { filename }, { jobId: file_request_id });
        return file_request_id;
    } catch(err) {
        console.log(err);
    };
}

const csvQueueWorker = new Bull.Worker('csv-queue', async (job) => {
    const { filename } = job.data;
    console.log('Processing CSV file:', filename);
    CSVJOB.findById(job.name)
    .then(async (doc) => {
            doc.status = 'Processing';
            doc.save();
    })
    .catch(err => console.log(err));

    processCSV('uploads/', filename);

    CSVJOB.findById(job.name)
    .then((doc) => {
            doc.status = 'Processed';
            doc.save();
    })
    .catch((err) => console.log(err));

}, { connection });


export default addCSVToQueue;