
import { fetchGoogleFitData } from "../services/googleServices/googleData";
import { getGoogleFitCredential } from "../services/googleServices/googleAuth"; 
import config from "config";

const getGoogleFitData = async (req, res) => {
    try {
        const userID = req.user.userID;

        const googleFitCredential = await getGoogleFitCredential(userID);
        
        if (!googleFitCredential){
            console.log("Not Connected to Google accout.");
            return res.status(401).send("Not Connected to Google accout.");
        }

        const dataTypes = req.body.dataTypes;

        const groupTimeBy = new Object(JSON.parse(config.get("GROUP_TIME_BY")))[req.body.groupTimeBy];
        const fetchedData = {};

        for(const dataType of dataTypes){
            const dataList = await fetchGoogleFitData(req.body.startTime, req.body.endTime, groupTimeBy, dataType, googleFitCredential);
            
            if (dataList === null){
                continue;
            }
            
            for (const data of dataList){
                if (fetchedData[data.date] === undefined){
                    fetchedData[data.date] = [data.data];
                    continue;
                }
                fetchedData[data.date].push(data.data);
            }
        }
        
        return res.status(200).send(fetchedData);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
} 

export default getGoogleFitData;