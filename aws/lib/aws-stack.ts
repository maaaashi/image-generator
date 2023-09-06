import * as cdk from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

export class MaaaashiImageGenerator extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log('apikey is ' + process.env.CHATGPT_APIKEY)

    new Function(this, 'ImageGeneratorGeneratePrompt', {
      functionName: 'ImageGeneratorGeneratePrompt',
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(path.join(__dirname, '../lambda/generate-prompt/')),
      handler: 'index.handler',
      environment: {
        CHATGPT_APIKEY: process.env.CHATGPT_APIKEY!
      }
    });
  }
}
