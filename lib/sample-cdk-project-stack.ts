// 参考
// https://blog.serverworks.co.jp/cdk-typescript-handson
// https://dev.classmethod.jp/articles/aws-cdk-api-gateway-lambda-rest-auth0-lambda-authorizer/

// API Reference
// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html

import {
    Stack,
    StackProps,
    aws_apigateway,
    aws_lambda_nodejs,
    Duration
} from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class SampleCdkProjectStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // HelloWorldするLambdaの作成
        const helloWorldFuncName = "hello-world";
        const registerTaskFunc = new aws_lambda_nodejs.NodejsFunction(
            this,
            helloWorldFuncName,
            {
                runtime: Runtime.NODEJS_20_X,
                functionName: helloWorldFuncName,
                entry: 'lambda/hello-world/handler.ts',
                timeout: Duration.seconds(25),
                logRetention: 30,
            },
        );

        // API Gateway RestAPIの作成
        const restApiName = "Rest-API-with-Lambda";
        const restApi = new aws_apigateway.RestApi(this, restApiName, {
            restApiName: restApiName,
            deployOptions: {
                stageName: 'v1',
            },
        });

        // API Gatewayにリクエスト先のリソースを追加
        const resourceHelloWorld = restApi.root.addResource('hello-world');

        //リソースにGETメソッド、Lambda統合プロキシを指定
        const method: aws_apigateway.Method = resourceHelloWorld.addMethod(
            'GET',
            new aws_apigateway.LambdaIntegration(registerTaskFunc)
        );
        // スロットリングの設定
        const plan = restApi.addUsagePlan('UsagePlan', {
            throttle: {
              rateLimit: 1,
              burstLimit: 2
            }
          });
    }
}
