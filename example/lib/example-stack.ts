import * as path from 'path';
import { aws_lambda as lambda, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';

import { PythonLibraryLayer } from 'cdk2-python-library-layer';

export class ExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const libexample = new PythonLibraryLayer(this, 'libexample', {
      description: 'Example Lambda layer',
      runtime: lambda.Runtime.PYTHON_3_8,
      entry: path.resolve('lambda', 'libexample'),
      compatibleArchitectures: [
        lambda.Architecture.ARM_64,
        lambda.Architecture.X86_64,
      ],
    });
    const exampleLambda = new PythonFunction(this, 'ExampleLambda', {
      description: 'Example Lambda function',
      runtime: lambda.Runtime.PYTHON_3_8,
      entry: path.resolve('lambda', 'example'),
      index: 'index.py',
      handler: 'lambda_handler',
      layers: [libexample],
    });
  }
}
