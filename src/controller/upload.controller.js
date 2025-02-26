import validateCSVFile from "../service/csv.verify.js";
import addCSVToQueue from "../service/csvQueue.js";


async function uploadCSV(req, res){
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    if(validateCSVFile(req.file.filename,'uploads').valid){
        console.log("Valid CSV");
        console.log("uploading file");
        const fileRequestId = await addCSVToQueue(req.file.filename)
        console.log(fileRequestId)
        res.status(200).json(fileRequestId);
    }
    else{
        console.log("Invalid CSV");
        return res.status(400).send('Invalid CSV file.');
        
    }


}



export default uploadCSV;