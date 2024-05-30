mkdir hadoop-libs
cd hadoop-libs
echo ${PWD}
wget --no-verbose https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk/1.12.541/aws-java-sdk-1.12.541.jar
wget --no-verbose https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-bundle/1.12.541/aws-java-sdk-bundle-1.12.541.jar
wget --no-verbose https://repo1.maven.org/maven2/io/delta/delta-core_2.12/2.4.0/delta-core_2.12-2.4.0.jar
wget --no-verbose https://repo1.maven.org/maven2/io/delta/delta-storage/2.4.0/delta-storage-2.4.0.jar
wget --no-verbose https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/3.3.4/hadoop-aws-3.3.4.jar
wget --no-verbose https://repo1.maven.org/maven2/org/postgresql/postgresql/42.7.2/postgresql-42.7.2.jar
