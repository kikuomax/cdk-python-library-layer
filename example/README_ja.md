[English](./README.md) / 日本語

# PythonLibraryLayerの使い方サンプル

`PythonLibraryLayer`を使うサンプルの[CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html)スタック。

## デプロイの仕方

### AWSプロファイルを設定する

あなたのAWSアカウントにリソースをデプロイするのに十分な権限を持つAWSプロファイルを設定しなければなりません。
以下は例です。

```sh
export AWS_PROFILE=kikuo-jp
```

### ツールキットスタック名前を設定する

ユニークな[CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)スタック名を選ばなければなりません。
以下は例です。

```sh
TOOLKIT_STACK_NAME=example-toolkit-stack
```

### ツールキットスタックを確保する

以下のコマンドを一度だけ実行する必要があります。

```sh
cdk bootstrap --toolkit-stack-name $TOOLKIT_STACK_NAME
```

### サンプルスタックをデプロイする

以下のコマンドを実行してサンプルCDKスタックをデプロイしてください。

```sh
cdk deploy --toolkit-stack-name $TOOLKIT_STACK_NAME
```

このコマンドはLambdaレイヤーと関数を確保する`ExampleStack`というCloudFormationスタックをデプロイします。