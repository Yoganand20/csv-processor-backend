import addCSVToQueue from "../service/csvQueue.js";


async function uploadCSV(req, res){
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log("uploading file");
    const fileRequestId = await addCSVToQueue(req.file.filename)

    console.log(fileRequestId)
    res.status(200).json(fileRequestId);

}



export default uploadCSV;