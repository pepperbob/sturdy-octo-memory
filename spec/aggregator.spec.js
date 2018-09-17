const { Pact, Matchers } = require('@pact-foundation/pact');
const path = require('path')
const request = require('request')
const { app } = require('../server/app')

const MOCK_SERVER_PORT = 2202;

describe('Aufgaben', () => {

    const provider = new Pact({
        consumer: "aufgaben",
        provider: "administrator-aufgaben",
        port: MOCK_SERVER_PORT,
        log: path.resolve(process.cwd(), "logs", "pact.log"),
        dir: path.resolve(process.cwd(), "pacts"),
        logLevel: "DEBUG",
        spec: 2
    });

    const expected = {
        'test': 'abc'
    }

    afterAll(() => provider.finalize())

    beforeEach(done =>
        provider.setup()
            .then(() =>
                provider.addInteraction({
                    state: "Eine Liste von Aufgaben",
                    uponReceiving: "Abruf der Aufgaben für Isabell",
                    withRequest: {
                        method: "GET",
                        path: "/aufgaben",
                        headers: { Accept: "application/json" }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                        body: Matchers.like(expected)
                    }
                }))
            .then(done));

    it('werden abgerufen', done => {

        app(['http://localhost:2202/aufgaben']).then(() => {

            request({
                url: "http://localhost:9000/",
                json: true,
                headers: {
                    Accept: "application/json"
                }
            }, (err, data) => {
                expect(data.body).toEqual({ ...expected });
                expect(provider.verify()).toBeTruthy();
                done();
            })

        })

    })

})