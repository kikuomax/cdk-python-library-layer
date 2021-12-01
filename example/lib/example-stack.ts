import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { PythonFunction } from '@aws-cdk/aws-lambda-python';

import { PythonLibraryLayer } from 'cdk-python-library-layer';

export class ExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const libexample = new PythonLibraryLayer(this, 'libexample', {
      runtime: lambda.Runtime.PYTHON_3_8,
      entry: path.resolve('lambda', 'libexample'),
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
