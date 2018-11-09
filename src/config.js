export default {
    s3: {
        REGION: "us-east-2",
        BUCKET: "notes-app-api-prod-serverlessdeploymentbucket-hdka6zdkqvti"
    },
    apiGateway: {
        REGION: "us-east-2",
        URL: "https://bgt1owkrkh.execute-api.us-east-2.amazonaws.com/prod"
    },
    cognito: {
        REGION: "us-east-2",
        USER_POOL_ID: "us-east-2_xTGDhYxcJ",
        APP_CLIENT_ID: "5l2iv5evh5tv9rd59jk404kot6",
        IDENTITY_POOL_ID: "us-east-2:489a0f2f-866d-4cd1-a673-b1b65e58a4d5"
    }
};
