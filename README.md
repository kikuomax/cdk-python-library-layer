English / [日本語](./README_ja.md)

# CDK Python Library Layer

`cdk-python-library-layer` turns your private Python package into a Lambda layer.
This library provides a [CDK Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_core.Construct.html) that you can incorporate into your CDK script.

Please refer to the [`v2.x`](https://github.com/kikuomax/cdk-python-library-layer/tree/v2.x) branch for CDK v2.

## What this library solves

This library turns a private Python package that `pip` cannot resolve into an [AWS Lambda layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html).

## Installing the library

Please run the following command,

```sh
npm install https://github.com/kikuomax/cdk-python-library-layer.git#v0.1.0
```

## Using the library

Just import `PythonLibraryLayer` and `new` it.
`PythonLibraryLayer` implements [`ILayerVersion`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda.ILayerVersion.html).

Here is an example that makes a Lambda layer from a package defined in a `lambda/libexample` folder.

```js
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

import { PythonLibraryLayer } from 'cdk-python-library-layer';

class YourCdkConstruct extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);
        this.layer = new PythonLibraryLayer(this, 'libexample', {
            runtime: lambda.Runtime.PYTHON_3_8,
            entry: path.resolve('lambda', 'libexample'),
        });
    }
}
```

So far, a package must be configured for [`setuptools`](https://setuptools.pypa.io/en/latest/index.html) and have a structure similar to the following (`src/` layout),

```
your_package/
  pyproject.toml
  setup.cfg
  src/
    your_package/
```

There is a working example in the [`example`](./example) folder.

## Background

I had a project that had a lot of Python Lambda functions that shared some codes among them.
Not to duplicate the shared codes, I packaged them as a Python package and planned to reuse it as a Lambda layer.
Since the package was specific to the project, I did not want to publish the package to any package repository.

First, I tried [`PythonLayerVersion`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda-python.PythonLayerVersion.html), but it did not work as I intended; more preceisely, I could not figure out how to achieve what I wanted to do with it.
As far as I looked into the [source code](https://github.com/aws/aws-cdk/tree/v1.134.0/packages/%40aws-cdk/aws-lambda-python/lib), it looked that it just downloads packages listed in `requirements.txt` and copies them under a `python` folder.
It did not look that it handles any scripts in an `entry` folder.

Thus, I had to somehow make a Lambda layer from my private package.