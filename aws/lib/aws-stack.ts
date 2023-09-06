import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

export class MaaaashiImageGenerator extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Function(this, 'ImageGeneratorGeneratePrompt', {
      functionName: 'ImageGeneratorGeneratePrompt',
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(path.join(__dirname, '../lambda/generate-prompt/')),
      handler: 'index.handler',
      environment: {
        CHATGPT_APIKEY: process.env.CHATGPT_APIKEY!
      },
      timeout: Duration.minutes(15)
    });
  }
}
