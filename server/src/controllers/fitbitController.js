
import logger, {formateLoggerMessage} from "../middlewares/logger";
import axios from "axios";
import { getFitbitCredential } from "../services/fitbitServices/fitbitAuth";

const getCalories = async (req, res) => {
    try {
        const fitbitCredential = await getFitbitCredential(req.user.userID);

        if (!fitbitCredential){
            logger.error(formateLoggerMessage(401, "Unauthorized user."));
            return res.status(401).send("Unauthorized user.");
        }

        const url = `https://api.fitbit.com/1/user/-/activities/calories/date/${req.body.startDate}/${req.body.endDate}.json`;

        const response = await axios({
            url: url,
            headers: {
                Authorization: `Bearer ${fitbitCredential.accessToken}`
            }
        })

        console.log(response.data);
        logger.info(formateLoggerMessage(200, "Activity fetched."));
        res.status(200).send(response.data);
        
    } catch (error) {
        logger.error(formateLoggerMessage(500, error.message));
        res.status(500).send(error.message);
    }
}

export default getCalories;