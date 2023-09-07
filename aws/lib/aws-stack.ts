import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function, FunctionUrlAuthType, HttpMethod, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path = require('path');

export class MaaaashiImageGenerator extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const generatePromptLambda = new Function(this, 'ImageGeneratorGeneratePrompt', {
      functionName: 'ImageGeneratorGeneratePrompt',
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(path.join(__dirname, '../lambda/generate-prompt/')),
      handler: 'index.handler',
      environment: {
        CHATGPT_APIKEY: process.env.CHATGPT_APIKEY!
      },
      timeout: Duration.minutes(15)
    });

    const generatePromptFunctionURL = generatePromptLambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedMethods: [HttpMethod.POST],
        allowedOrigins: ["*"],
      },
    });

    const generateImageLambda = new Function(this, 'ImageGeneratorGenerateImage', {
      functionName: 'ImageGeneratorGenerateImage',
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(path.join(__dirname, '../lambda/generate-image/')),
      handler: 'index.handler',
      environment: {
        DREAM_STUDIO_APIKEY: process.env.DREAM_STUDIO_APIKEY!
      },
      timeout: Duration.minutes(15)
    });

    const generateImageFunctionURL = generateImageLambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedMethods: [HttpMethod.POST],
        allowedOrigins: ["*"],
      },
    });

    new CfnOutput(this, 'GeneratePromptURL', {
      value: generatePromptFunctionURL.url
    })

    new CfnOutput(this, 'GenerateImageURL', {
      value: generateImageFunctionURL.url
    })
  }
}
