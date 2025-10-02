
#### ioBroker Integration Testing

**IMPORTANT**: Use the official `@iobroker/testing` framework for all integration tests. This is the ONLY correct way to test ioBroker adapters.

**Official Documentation**: https://github.com/ioBroker/testing

##### Framework Structure
Integration tests MUST follow this exact pattern:

```javascript
const path = require('path');
const { tests } = require('@iobroker/testing');

// Define test coordinates or configuration
const TEST_COORDINATES = '52.520008,13.404954'; // Berlin

// Use tests.integration() with defineAdditionalTests
tests.integration(path.join(__dirname, '..'), {
    defineAdditionalTests({ suite }) {
        suite('Test adapter with specific configuration', (getHarness) => {
            let harness;

            before(() => {
                harness = getHarness();
            });

            it('should configure and start adapter', () => new Promise(async (resolve) => {
                // Get adapter object and configure
                harness.objects.getObject('system.adapter.brightsky.0', async (err, obj) => {
                    if (err) {
                        console.error('Error getting adapter object:', err);
                        resolve();
                        return;
                    }

                    // Configure adapter properties
                    obj.native.position = TEST_COORDINATES;
                    obj.native.createCurrently = true;
                    obj.native.createHourly = true;
                    obj.native.createDaily = true;
                    // ... other configuration

                    // Set the updated configuration
                    harness.objects.setObject(obj._id, obj);

                    // Start adapter and wait
                    await harness.startAdapterAndWait();

                    // Wait for adapter to process data
                    setTimeout(() => {
                        // Verify states were created
                        harness.states.getState('brightsky.0.info.connection', (err, state) => {
                            if (state && state.val === true) {
                                console.log('✅ Adapter started successfully');
                            }
                            resolve();
                        });
                    }, 15000); // Allow time for API calls
                });
            })).timeout(30000);
        });
    }
});
```

##### Key Integration Testing Rules

1. **NEVER test API URLs directly** - Let the adapter handle API calls
2. **ALWAYS use the harness** - `getHarness()` provides the testing environment  
3. **Configure via objects** - Use `harness.objects.setObject()` to set adapter configuration
4. **Start properly** - Use `harness.startAdapterAndWait()` to start the adapter
5. **Check states** - Use `harness.states.getState()` to verify results
6. **Use timeouts** - Allow time for async operations with appropriate timeouts
7. **Test real workflow** - Initialize → Configure → Start → Verify States

##### Workflow Dependencies
Integration tests should run ONLY after lint and adapter tests pass:

```yaml
integration-tests:
  needs: [check-and-lint, adapter-tests]
  runs-on: ubuntu-latest
  steps:
    - name: Run integration tests
      run: npx mocha test/integration-*.js --exit
```
##### What NOT to Do
❌ Direct API testing: `axios.get('https://api.example.com')`
❌ Mock adapters: `new MockAdapter()`  
❌ Direct internet calls in tests
❌ Bypassing the harness system

##### What TO Do
✅ Use `@iobroker/testing` framework
✅ Configure via `harness.objects.setObject()`
✅ Start via `harness.startAdapterAndWait()`
✅ Test complete adapter lifecycle
✅ Verify states via `harness.states.getState()`
✅ Allow proper timeouts for async operations
