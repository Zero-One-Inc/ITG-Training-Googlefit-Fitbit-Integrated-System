
import config from "config";
import { fetchGoogleFitData } from "../services/googleServices/googleData";
import { getGoogleFitCredential } from "../services/googleServices/googleAuth"; 
import logger, {formateLoggerMessage} from "../middlewares/logger";

const getGoogleFitData = async (req, res) => {
    try {
        const userID = req.user.userID;

        const googleFitCredential = await getGoogleFitCredential(userID);
        
        if (!googleFitCredential){
            const errorMessage = "Unauthorized access to Google Fit";
            logger.error(formateLoggerMessage(401, errorMessage));
            return res.status(401).send(errorMessage);
        }

        const dataTypes = req.body.dataTypes;
        const GOOGLE_FIT_DATA_TYPES = Object.keys(JSON.parse(config.get("GOOGLE_DATA_TYPE_NAME")));

        const groupByTime = new Object(JSON.parse(config.get("GROUP_TIME_BY")))[req.body.groupByTime];
        const fetchedData = {};

        for(const dataType of dataTypes){
            const dataList = await fetchGoogleFitData(req.body.startTime, req.body.endTime, groupByTime, dataType, googleFitCredential);
            
            if (dataList === null){
                const formatedData = {};
                formatedData[dataType] = "-1";
                const dates = Object.keys(fetchedData);
                for (const date of dates){
                    fetchedData[date].push(formatedData);
                }
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
        
        const message = "Data has been fetched successfully.";
        logger.info(formateLoggerMessage(200, message));
        return res.status(200).send(fetchedData);
    } catch (error) {
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
} 

export default getGoogleFitData;