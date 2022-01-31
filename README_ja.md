[English](README.md) / 日本語

# CDK Python Library Layer for CDK v2

`cdk2-python-library-layer`はプライベートなPythonパッケージをLambdaレイヤーに変えます。
このライブラリはCDKスクリプトに組み込むことのできる[CDK Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_core.Construct.html)を提供します。

## このライブラリが解決すること

このライブラリは`pip`で解決することのできないプライベートなPythonパッケージを[AWS Lambdaレイヤー](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html)に変えます。

## ライブラリをインストールする

以下のコマンドを実行してください。

```sh
npm install https://github.com/kikuomax/cdk-python-library-layer.git#v0.1.0-v2
```

## ライブラリを使う

`PythonLibraryLayer`をインポートして`new`するだけです。
`PythonLibraryLayer`は[`ILayerVersion`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda.ILayerVersion.html)を実装します。

以下は`lambda/libexample`フォルダに定義されたパッケージからLambdaレイヤーを作る例です。

```js
import * as path from 'path';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { PythonLibraryLayer } from 'cdk2-python-library-layer';

class YourCdkConstruct extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.layer = new PythonLibraryLayer(this, 'libexample', {
            runtime: lambda.Runtime.PYTHON_3_8,
            entry: path.resolve('lambda', 'libexample'),
        });
    }
}
```

今のところ、パッケージは[`setuptools`](https://setuptools.pypa.io/en/latest/index.html)用に設定され、以下のような構造(`src/`レイアウト)を持っていなけれななりません。

```
your_package/
  pyproject.toml
  setup.cfg
  src/
    your_package/
```

動くサンプルが[`example`](./example)フォルダにあります。

## 背景

あるプロジェクトで私はPythonのLambda関数をたくさん使っており、その関数の間でコードが被っていました。
共通部分のコードを複製しないように、それらをPythonパッケージにしLambdaレイヤーとして再利用することを考えました。
パッケージはプロジェクト特有のものなので、パッケージレポジトリには公開したくありませんでした。

最初、[`PythonLayerVersion`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda-python.PythonLayerVersion.html)を試しましたが、思ったように動きませんでした。というより、これでやりたいことをどう実現してよいか分かりませんでした。
[ソースコード](https://github.com/aws/aws-cdk/tree/v1.134.0/packages/%40aws-cdk/aws-lambda-python/lib)を見た限りでは、ただ`requirements.txt`にリストされたパッケージをダウンロードして`python`フォルダ以下にコピーしているだけに見えました。
`entry`フォルダ内のスクリプトを何かしているようには見えませんでした。

ということで、プライベートなパッケージから何とかしてLambdaレイヤーを作る必要がありました。