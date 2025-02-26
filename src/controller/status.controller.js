import CSVJOB from "../model/csvJob.model.js";
const getStatus = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const job = await CSVJOB.findById(requestId);
        const status = job.status;
        return res.status(200).json(status);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default getStatus;
