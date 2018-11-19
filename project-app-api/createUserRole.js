import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure} from "./libs/response-lib";


export async function main(event, context) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: "userRole",

        Item: {
            // userId: event.requestContext.identity.cognitoIdentityId,
            // projectId: uuid.v1(),
            userID: data.userID,
            userRole: data.userRole

        }
    };

    try {
        await dynamoDbLib.call("put", params);
        return success(params.Item);
    } catch (e) {
        console.log(e);
        return failure({ status : false});
    }
}