English / [日本語](./README_ja.md)

# Example usage of PythonLibraryLayer

Example [CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) stack to use `PythonLibraryLayer`.

## How to deploy

### Configuring an AWS profile

You have to configure an AWS profile with a sufficient privilege to deploy resources onto your AWS account.
Here is an example,

```sh
export AWS_PROFILE=kikuo-jp
```

### Configuring a toolkit stack name

You have to choose a unique [CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) stack name.
Here is an example,

```sh
TOOLKIT_STACK_NAME=example-toolkit-stack
```

### Provisioning a toolkit stack

You need to run the following command only once.

```sh
cdk bootstrap --toolkit-stack-name $TOOLKIT_STACK_NAME
```

### Deploying an example stack

Run the following command to deploy the example CDK stack.

```sh
cdk deploy --toolkit-stack-name $TOOLKIT_STACK_NAME
```

This command will deploy a CloudFormation stack `ExampleStack` that provisions a Lambda layer and function.