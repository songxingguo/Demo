docker login --username=18983642737 registry.cn-shanghai.aliyuncs.com
docker build . --file Dockerfile --tag registry.cn-shanghai.aliyuncs.com/songxingguo/bigfileupload:latest
docker push registry.cn-shanghai.aliyuncs.com/songxingguo/bigfileupload:latest