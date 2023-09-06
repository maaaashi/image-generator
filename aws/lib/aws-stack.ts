import * as cdk from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

export class MaaaashiImageGenerator extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    console.log(process.env)

    new Function(this, 'ImageGeneratorGeneratePrompt', {
      functionName: 'ImageGeneratorGeneratePrompt',
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(path.join(__dirname, '../lambda/generate-prompt/')),
      handler: 'index.handler',
      environment: {
        DREAM_STUDIO_APIKEY: process.env.NEXT_PUBLIC_API_KEY!
      }
    });
  }
}
