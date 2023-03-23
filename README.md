English / [日本語](./README_ja.md)

# CDK Python Library Layer for CDK v2

`cdk2-python-library-layer` turns your private Python package into a Lambda layer.
This library provides a [CDK Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_core.Construct.html) that you can incorporate into your CDK script.

**NOTE**: The branch for CDK v1 (`main`) is no longer maintained.

## What this library solves

This library turns a private Python package that `pip` cannot resolve into an [AWS Lambda layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html).

## Installing the library

Please run the following command,

```sh
npm install https://github.com/kikuomax/cdk-python-library-layer.git#v0.2.1-v2
```

## Using the library

Just import `PythonLibraryLayer` and `new` it.
`PythonLibraryLayer` implements [`ILayerVersion`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda.ILayerVersion.html).

Here is an example that makes a Lambda layer from a package defined in a `lambda/libexample` folder.

```js
import * as path from 'path';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { PythonLibraryLayer } from 'cdk2-python-library-layer';

class YourCdkConstruct extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.layer = new PythonLibraryLayer(this, 'libexample', {
            description: 'Example Lambda layer',
            runtime: lambda.Runtime.PYTHON_3_8,
            entry: path.resolve('lambda', 'libexample'),
            compatibleArchitectures: [
                lambda.Architecture.ARM_64,
                lambda.Architecture.X86_64,
            ],
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

I had a project that had a lot of Python Lambda functions that shared some code among them.
Not to duplicate the shared code, I packaged them as a Python package and planned to reuse it as a Lambda layer.
Since the package was specific to the project, I did not want to publish the package to any package repository.

First, I tried [`PythonLayerVersion`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda-python.PythonLayerVersion.html), but it did not work as I intended; more preceisely, I could not figure out how to achieve what I wanted to do with it.
As far as I looked into the [source code](https://github.com/aws/aws-cdk/tree/v1.134.0/packages/%40aws-cdk/aws-lambda-python/lib), it looked that it just downloads packages listed in `requirements.txt` and copies them under a `python` folder.
It did not look that it handles any scripts in an `entry` folder.

Thus, I had to somehow make a Lambda layer from my private package.

## Trouble shooting

### Docker failing with a cross-platform error

If the platform of your machine running Docker is different from the target platform (`compatibleArchitectures`) of the layer, you may face an error message similar to the following:
```
WARNING: The requested image's platform (linux/arm64) does not match the detected host platform (linux/amd64/v3) and no specific platform was requested
exec /usr/bin/bash: exec format error

/home/ubuntu/cdk-python-library-layer/example/node_modules/aws-cdk-lib/core/lib/asset-staging.ts:395
      throw new Error(`Failed to bundle asset ${this.node.path}, bundle output is located at ${bundleErrorDir}: ${err}`);
```

If you are building a layer compatible with multiple platforms, change the order of `compatibleArchitectures` so that the first item matches your machine's platform; e.g., suppose your machine is based on x86_64:
```ts
compatibleArchitectures: [
    lambda.Architecture.X86_64,
    lambda.Architecture.ARM_64,
]
```

Or allow Docker to build a cross-platform image.
How to do it depends on your environment, though, [this page](https://docs.docker.com/build/building/multi-platform/) would be helpful.
On Ubuntu 22.04, I was able to solve this issue by installing `qemu-user-static`.
```sh
sudo apt-get install qemu-user-static
```