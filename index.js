"use strict";

const fs = require('fs')
const uuid = require('uuid/v4')

Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
}

const logIntervalInMs = process.env.LOG_INTERVAL_IN_MS
const errRate = parseFloat(process.env.ERROR_RATE)

const readFile = (filePath) => (
    new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if(err) reject(err);

            resolve(JSON.parse(data))
        })
    })
)

Promise.all([
    // Success
    readFile('data/success/driver-found.json'),
    readFile('data/success/payment-submitted.json'),
    readFile('data/success/payment-accepted.json'),
    readFile('data/success/ride-created.json'),

    // Error
    readFile('data/error/no-driver-available.json'),
    readFile('data/error/payment-failed.json')
]).then(bodies => {
    const [
        driverFound, paymentSubmitted, paymentAccepted, rideCreated,
        noDriverAvailable, paymentFailed
     ] = bodies

    const successStrategies = [
        [driverFound, paymentSubmitted, paymentAccepted, rideCreated],
    ]

    const errorStrategies = [
        [driverFound, paymentSubmitted, paymentFailed],
        [noDriverAvailable],
    ]

    setInterval(() => {
        const isError = (Math.random() < errRate)
        const strategy = isError ? errorStrategies.random() : successStrategies.random()

        generateLogChain(strategy)
    }, logIntervalInMs);
})

const generateLogChain = (strategy) => {
    const contextIdBody = { context_id: uuid() }

    strategy.forEach(bodyCategory => {
        const body = Object.assign(
            contextIdBody,
            bodyCategory.random()
        )

        console.log(
            JSON.stringify(body)
        )
    })
}
