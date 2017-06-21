'use strict';

console.log('Loading function');
const aws = require('aws-sdk');

const getOpsWorks = () => {
    return new aws.OpsWorks();
}

const getPipeline = () => {
    return new aws.CodePipeline();
}


exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log(event["CodePipeline.job"]["data"]["inputArtifacts"]);
    
    const opsWorks = getOpsWorks();
    const pipeline = getPipeline();
    
    const deployParams = {
        Command: {
            Name: "deploy",
            Args: {}
        },
        CustomJson: JSON.stringify({
            id: event["CodePipeline.job"]["id"],
            artifacts: event["CodePipeline.job"]["data"]["inputArtifacts"]
        }),
        StackId: process.env.STACK_ID,
        AppId: process.env.APP_ID,
        LayerIds: [process.env.LAYER_ID]
    };
    
    opsWorks.createDeployment(deployParams, (err, data) => {
        if (err) {
            console.log(err, err.stack); // an error occurred
            const failureResult = {
                jobId: event["CodePipeline.job"]["id"],
                failureDetails: {
                    message: "fixme",
                    type: "JobFailed"
                }
            };
            pipeline.putJobFailureResult(failureResult, callback);
        } else {
            console.log(data);           // successful response
            const successResult = {
                jobId: event["CodePipeline.job"]["id"]
            };
            pipeline.putJobSuccessResult(successResult, callback);
        }
    });
};


