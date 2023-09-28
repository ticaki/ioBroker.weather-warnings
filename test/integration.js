const path=require("path");
const { tests }=require("@iobroker/testing");
const wait=ms => new Promise(resolve => setTimeout(resolve,ms));
// Run tests
tests.integration(path.join(__dirname,".."),{
    //            ~~~~~~~~~~~~~~~~~~~~~~~~~
    // This should be the adapter's root directory

    // If the adapter may call process.exit during startup, define here which exit codes are allowed.
    // By default, termination during startup is not allowed.
    //allowedExitCodes: [11],

    // To test against a different version of JS-Controller, you can change the version or dist-tag here.
    // Make sure to remove this setting when you're done testing.
    controllerVersion: "latest", // or a specific version like "4.0.1"

    // Define your own tests inside defineAdditionalTests
    defineAdditionalTests({ suite }) {
        // All tests (it, describe) must be grouped in one or more suites. Each suite sets up a fresh environment for the adapter tests.
        // At the beginning of each suite, the databases will be reset and the adapter will be started.
        // The adapter will run until the end of each suite.

        // Since the tests are heavily instrumented, each suite gives access to a so called "harness" to control the tests.
        suite("Test: Test Online",(getHarness) => {
            // For convenience, get the current suite's harness before all tests
            let harness;
            before(() => {
                harness=getHarness();
            });
            // eslint-disable-next-line no-undef
            it('Start online',() => new Promise(async (resolve) => {
                harness.objects.getObject('system.adapter.weather-warnings.0',async (err,obj) => {
                    obj.native.useTestWarnings=false;
                    obj.native.dwdEnabled=true;
                    obj.native.dwdSelectId='805111000';
                    obj.native.uwzEnabled=true;
                    obj.native.uwzSelectID='DE55606';
                    obj.native.zamgEnabled=true;
                    obj.native.zamgSelectID='48.333444483766975#14.6258983209036';
                    harness.objects.setObject(obj._id,obj)
                    // Start the adapter and wait until it has started
                    await harness.startAdapterAndWait();
                    harness.sendTo('weather-warnings.0','test','message',resp => {
                        resolve();
                    });
                }).timeout(30000);
            }))
            it('Test: Connection to server work',() => new Promise(async (resolve,reject) => {

                // change the adapter config
                await harness.startAdapterAndWait();
                await wait(7000);
                harness.sendTo('weather-warnings.0','test-connection','message',resp => {

                    console.log(resp);
                    if (resp=='true') resolve();
                    else reject();
                });
            })).timeout(30000);
        });
        suite("Test: Test with testdata",(getHarness) => {
            // For convenience, get the current suite's harness before all tests
            let harness;
            before(() => {
                harness=getHarness();
            });
            // eslint-disable-next-line no-undef
            it('Start with testdata',() => new Promise(async (resolve) => {
                harness.objects.getObject('system.adapter.weather-warnings.0',async (err,obj) => {
                    obj.native.useTestWarnings=true;
                    obj.native.dwdEnabled=true;
                    obj.native.dwdSelectId='805111000';
                    obj.native.uwzEnabled=true;
                    obj.native.uwzSelectID='DE55606';
                    obj.native.zamgEnabled=true;
                    obj.native.zamgSelectID='48.333444483766975#14.6258983209036';
                    obj.native.refreshTime=1;
                    harness.objects.setObject(obj._id,obj)
                    // Start the adapter and wait until it has started
                    await harness.startAdapterAndWait();
                    harness.sendTo('weather-warnings.0','test','message',resp => {
                        resolve();
                    });
                });
            })).timeout(20000);
            it('Test: Adapter works with testdata',() => new Promise(async (resolve, reject) => {

                // change the adapter config
                await harness.startAdapterAndWait();
                await wait(30000);
                harness.sendTo('weather-warnings.0','test-data','message',resp => {
                    if (resp == 'true') resolve();
                    else reject('message indicate and error!');
                });
            })).timeout(60000);
            it('Test: Adapter works more than 2 Minute!',() => new Promise(async (resolve, reject) => {
                // change the adapter config
                await harness.startAdapterAndWait();
                await wait(110000);
                if (harness.isAdapterRunning()) resolve();
                else reject('Adapter stops');
            })).timeout(240000);
        });
    }
});