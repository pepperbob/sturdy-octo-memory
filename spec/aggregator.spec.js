const { Pact, Matchers } = require('@pact-foundation/pact');
const path = require('path')
const request = require('request')
const { app } = require('../server/app')

const MOCK_SERVER_PORT = 2202;

describe('Requested stuf', () => {

    const provider = new Pact({
        consumer: "stuff",
        provider: "stuff-keeper",
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
                    state: "List of Stuff",
                    uponReceiving: "Request for that List of Stuff",
                    withRequest: {
                        method: "GET",
                        path: "/stuff",
                        headers: { Accept: "application/json" }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                        body: Matchers.like(expected)
                    }
                }))
            .then(done));

    it('will be returned', done => {

        app(['http://localhost:2202/stuff']).then(() => {

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