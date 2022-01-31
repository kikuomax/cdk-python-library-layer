import * as fsx from 'fs-extra';
import * as path from 'path';

import {
  aws_lambda as lambda,
  AssetStaging,
  FileSystem,
  DockerImage,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

/** Properties for `PythonLibraryLayer`. */
export type PythonLibraryLayerProps = {
  /** Runtime to use. */
  readonly runtime: lambda.Runtime;
  /** Path to the module root directory where `pyproject.toml` is saved. */
  readonly entry: string;
};

/**
 * CDK Construct that packages a Python library as a Lambda layer.
 *
 * #### Usage
 *
 * A library is supposed to have the following structure,
 *
 * ```
 * pyproject.toml
 * setup.cfg
 * src/
 *   <your-module-here>/
 * ```
 *
 * Other files are ignored.
 *
 * Reference: https://github.com/aws/aws-cdk/blob/f0ca40f863b399ba0c51fd4274c7f4b30b024376/packages/@aws-cdk/aws-lambda-python/lib/layer.ts
 */
export class PythonLibraryLayer extends lambda.LayerVersion {
  constructor(
    scope: Construct,
    id: string,
    props: PythonLibraryLayerProps,
  ) {
    const { runtime } = props;
    const entry = path.resolve(props.entry);

    // duplicates the library in a working directory
    // a Docker image is built inside this directory
    const stageDir = FileSystem.mkdtemp('python-library-');
    fsx.copySync(entry, stageDir);

    // builds a Docker image with the library installed in /var/packaged
    fsx.copySync(
      path.join(__dirname, 'Dockerfile'),
      path.join(stageDir, 'Dockerfile'),
    );
    const image = DockerImage.fromBuild(stageDir, {
      buildArgs: {
        IMAGE: runtime.bundlingImage.image,
      },
    });

    // script to run during bundling
    // outputs the installed library
    const outputPath = `${AssetStaging.BUNDLING_OUTPUT_DIR}/python`;
    const script = `rsync -r /var/packaged/. ${outputPath}`;

    super(scope, id, {
      ...props,
      compatibleRuntimes: [runtime],
      code: lambda.Code.fromAsset(entry, {
        exclude: ['*.pyc'],
        bundling: {
          image,
          command: ['bash', '-c', script],
        },
      }),
    });
  }
}
