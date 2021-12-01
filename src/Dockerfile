# reference: https://github.com/aws/aws-cdk/blob/f0ca40f863b399ba0c51fd4274c7f4b30b024376/packages/@aws-cdk/aws-lambda-python/lib/Dockerfile.dependencies
ARG IMAGE=public.ecr.aws/sam/build-python3.7
FROM $IMAGE

# ensures rsync is installed
RUN yum -q list installed rsync &>/dev/null || yum install -y rsync

# installs the library
WORKDIR /var/wheels
COPY pyproject.toml pyproject.toml
COPY setup.cfg setup.cfg
COPY src/ src/
RUN pip wheel .
RUN pip install -t /var/packaged *.whl

CMD [ "python" ]
