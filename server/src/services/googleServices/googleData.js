
import config from "config";
import axios from "axios";
import { getNewGoogleAccessToken } from "./googleAuth";

export const fetchGoogleFitData = async (startTime, endTime, groupTimeBy, dataType, googleFitCredential) => {
    try {
        const data =  await fetchGoogleFitDataCall(startTime, endTime, groupTimeBy, dataType, googleFitCredential.accessToken);
        return data;
    } catch (error) {
        console.log(error.cause.code)
        if (error.cause.code == "401"){
            googleFitCredential = await getNewGoogleAccessToken(googleFitCredential);
            console.log(googleFitCredential);
            if (!googleFitCredential){
                throw new Error("Invalid Token, You should reconnect with google account.");
            }

            const data =  await fetchGoogleFitDataCall(startTime, endTime, groupTimeBy, dataType, googleFitCredential.accessToken);    
            return data;
        }
        throw new Error(error.message, {cause: error.cause});
    }
}

const fetchGoogleFitDataCall = async (startTime, endTime, groupTimeBy, dataType, accessToken) => {
    const dataTypeName = Object(JSON.parse(config.get("GOOGLE_DATA_TYPE_NAME")))[dataType];      
        startTime = new Date(startTime).getTime();
        endTime = new Date(endTime).getTime();
        groupTimeBy = Number(groupTimeBy);

    try {
        const dataBucketResponse = await axios({
            method: 'post',
            url: config.get("GOOGLE_AGGGREGATE_URL"),
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                "aggregateBy": [{
                    "dataTypeName": dataTypeName,
                }],
                "bucketByTime": { "durationMillis": groupTimeBy },
                "startTimeMillis": startTime,
                "endTimeMillis": endTime
            }
        });
        
        return mapGoogleFitData(dataBucketResponse.data.bucket, dataType);
    } catch (error) {
        
        if (error.response.data.error.code === 400){
            return null;
        }

        throw new Error(error.response.data.error.message, {cause: error.response.data.error});
    }
}

export const mapGoogleFitData = (data, dataTypeName) => {
    const mapedData = [];
    const formatedData = {};

    for (const dataItem of data) {
        let dataValue = null;
        let dateString = new Date(parseInt(dataItem.startTimeMillis));
        dateString = dateString.toISOString().split('T')[0];
        
        if (dataItem.dataset[0].point[0] == undefined){
            // formatedData[dataTypeName] = "-1";
            // return [{
            //     date: dateString,
            //     data: formatedData
            // }];
            return null;
        }

        if (dataItem.dataset[0].point[0].value[0].intVal !== undefined){
            dataValue = dataItem.dataset[0].point[0].value[0].intVal.toFixed(2).toString();
        }
        else if (dataItem.dataset[0].point[0].value[0].fpVal !== undefined){
            dataValue = dataItem.dataset[0].point[0].value[0].fpVal.toFixed(2).toString();
        }
        else {
            dataValue = "-1";
        }

        formatedData[dataTypeName] = dataValue;

        mapedData.push({
            date: dateString,
            data: formatedData
        });
    }

    return mapedData;   
}