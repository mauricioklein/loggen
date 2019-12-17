# Loggen

Simple NodeJS log generator app for Datadog logs experiments.

## Dependencies

- NodeJS 11.0 or superior

## Architecture

This app generates logs based on some pre-defined templates.

Templates are divided in success templates and error templates. Both can be found in `data/` folder under the respective type.

### Success logs

A success log round selects, randomly, one log from each kind in the following order:

1. driverFound
2. paymentSubmitted
3. paymentAccepted
4. rideCreated

All the four logs are dispatched in the order above and all of them contains the same `context_id`, generated randomly by the system.

### Error logs

An error log round selects, randomly, one log from each kind in the following order:

1. driverFound
2. paymentSubmitted
3. paymentFailed

> ... or ...

1. noDriverAvailable

All the logs are dispatched in the order above and all of them contains the same `context_id`, generated randomly by the system.

## Configuration

This app requires two parameters, provided by environment variables:

- `LOG_INTERVAL_IN_MS`: the interval (in ms) between the logs production. Interval honoring isn't guaranteed, but since the log generation process is simple, the log overhead can be ignored.
- `ERROR_RATE`: the error rate (float between 0 and 1), defining the probabilistic occurrence of error logs. Setting to zero disables error logs, while setting to one generates exclusively error logs.

### Running locally

```bash
$ LOG_INTERVAL_IN_MS=100 ERROR_RATE=0.25 npm start
```

### Running with Docker

```bash
# Build the Docker image
$ docker build -t mauricioklein/loggen .
# ... or use the publicly available image: https://hub.docker.com/r/mauricioklein/loggen/

# Start the container
$ docker run \
    -e LOG_INTERVAL_IN_MS=100 \
    -e ERROR_RATE=0.25 \
    -it mauricioklein/loggen
```

### Running in K8s

A public Docker image is available on DockerHub and can be used to deploy the app on K8s:

```bash
# Creates a single pod, not managed by a deployment
$ kubectl run loggen \
    --image mauricioklein/loggen:1.0.0 \
    --env LOG_INTERVAL_IN_MS=250 \
    --env ERROR_RATE=0.25 \
    --restart=Never
```
