# Deplopy an application in Kubernetes with minikube + Cloud Storage

## 1 Try new app version in docker-compose
This time ther's a modified version of the chat under the ``/server`` folder. This app supports user avatars, this means that every user can upload a profile photo and it has to be stored anywhere inside the container. 

### 1.1 Try new app version in docker-compose
For this, the best approach when you are developing in a local enviroment is to mount a ``volume``into our host.
This is defined inside the ``docker-compose.yml``like this:
```
...
volumes:
      - ./app/public/uploads:/server/public/uploads
...
environment:
      - UPLOAD_PATH=./public/uploads
      - MEDIA_PROXY_PATH=/uploads
```

Let´s try the last version with docker-compose

```
docker-compose up
```

Then, check that the uploaded appear inside the ``./app/public/uploads`` folder

### 1.2 Try new app version in docker-compose with Cloud Storage
First of all yu have to create a [Cloud Storage] bucket inside your google clud plattform console.
After you have to download the [Google application default credentials] in order to download your credentials.json to be able to use the bucket outside Google Cloud Plattform.

More information about mounting Cloud storage buckets [here].

The new container that mounts the bucket is the under ``/bucket`` directory, there have to be your credentials and the new Dockerfile.
Let´s compose:

```
docker-compose -f docker-compose.bucket.yml up
```

[Google application default credentials]:https://developers.google.com/identity/protocols/application-default-credentials#howtheywork
[Cloud Storage]:https://cloud.google.com/storage/
[here]:https://github.com/ageapps/k8s-storage-buckets

## 2 Deploying in Kubernetes



### 2.1 Creating Secrets
In order to maintain the credentials safe we are going to create a [secret](https://kubernetes.io/docs/concepts/configuration/secret/) with all credentials related to the database.

```
$ kubectl create -f ./k8s/db-secrets.yml
secret "mongo" created
$ kubectl describe secret mongo
Name:           mongo
Namespace:      default
Labels:         <none>
Annotations:    <none>

Type:   Opaque

Data
====
database:       5 bytes
password:       3 bytes
username:       3 bytes
```

Now we create another [secret](https://kubernetes.io/docs/concepts/configuration/secret/) with all credentials related to the [Cloud Storage] bucket.

```
kubectl create secret generic storage-auth-credentials --from-file=credentials=path/to/json
```

### 2.2 Creating deployments and services

This doployment is going to be in a local enviroment using [minikube].

Now it´s time to create the [deployments] an [services] from our application using the ``.yaml`` files under the ``/k8s`` folder.

```
$ kubectl create -f k8s-mongo.yaml
service "mongo" created
deployment "mongo" created
$ kubectl create -f k8s-app.yaml
service "app" created
deployment "app" created
$ kubectl get pods
NAME                     READY     STATUS              RESTARTS   AGE
app-1343682521-225wh     0/1       ContainerCreating   0          3s
mongo-4010256831-hhc86   1/1       Running             0          2m
$ kubectl get svc
NAME         CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
app          10.0.0.33    <nodes>       80:30317/TCP   1m
kubernetes   10.0.0.1     <none>        443/TCP        11d
mongo        10.0.0.240   <none>        27017/TCP      3m
```

## 2. Adding a distributed filesystem (Could Storage)

### 2.1Authenticate with Google API credentials JSON

You can use your [Google application default credentials] to authenticate and start using Google Cloud Storage.
After downloading your JSON credentials file, create a secret object inside your Kubernetes cluster.

[Google application default credentials]:https://developers.google.com/identity/protocols/application-default-credentials#howtheywork


```
kubectl create secret generic storage-auth-credentials --from-file=credentials=path/to/json
```

```


$ kubectl create -f k8s-mongo.yaml
service "mongo" created
deployment "mongo" created
$ kubectl create -f k8s-app.yaml
service "app" created
deployment "app" created
$ kubectl get pods
NAME                     READY     STATUS              RESTARTS   AGE
app-1343682521-225wh     0/1       ContainerCreating   0          3s
mongo-4010256831-hhc86   1/1       Running             0          2m
$ kubectl get svc
NAME         CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
app          10.0.0.33    <nodes>       80:30317/TCP   1m
kubernetes   10.0.0.1     <none>        443/TCP        11d
mongo        10.0.0.240   <none>        27017/TCP      3m
```
