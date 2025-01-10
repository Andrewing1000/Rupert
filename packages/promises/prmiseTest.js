
import {MyPromise} from './MyPromise.js';

async function runTests(tests) {
  let passedCount = 0;
  for (let i = 0; i < tests.length; i++) {
    const { name, test } = tests[i];
    try {
      // Await the MyPromise returned by test()
      await test();
      console.log(`✔️  [PASS] ${name}`);
      passedCount++;
    } catch (err) {
      console.log("El error", err)
      console.error(`❌ [FAIL] ${name}\n   → ${err && err.message ? err.message : err}`);
    }
  }
  console.log(`\n=== TEST COMPLETE: ${passedCount}/${tests.length} passed ===`);
}

/**********************************************************************
 * Define the tests
 **********************************************************************/

const tests = [
  {
    name: 'Basic synchronous resolve',
    test: function () {
      return new MyPromise((resolve, reject) => {
        resolve(42);
      }).then((value) => {
        if (value !== 42) {
          throw new Error(`Expected 42, got ${value}`);
        }
      });
    },
  },
  {
    name: 'Basic synchronous reject',
    test: function () {
      return new MyPromise((_, reject) => {
        reject(new Error('Error occurred!'));
      })
        .then(
          () => {
            throw new Error('Expected to reject, but it resolved instead');
          },
          (err) => {
            if (!(err instanceof Error)) {
              throw new Error('Rejection did not receive an Error instance');
            }
          }
        );
    },
  },
  {
    name: 'Asynchronous resolve',
    test: function () {
      return new MyPromise(
        (resolve) => {
        setTimeout(() => resolve('async success'), 50);
      }).then((value) => {
        if (value !== 'async success') {
          throw new Error(`Expected 'async success', got ${value}`);
        }
      });
    },
  },
  {
    name: 'Asynchronous reject',
    test: function () {
      return new MyPromise((_, reject) => {
        setTimeout(() => reject(new Error('async failure')), 50);
      })
        .then(
          () => {
            throw new Error('Expected promise to reject, but it resolved');
          },
          (err) => {
            if (!/async failure/i.test(err.message)) {
              throw new Error(`Expected 'async failure', got '${err.message}'`);
            }
          }
        );
    },
  },
  {
    name: 'Chaining resolves correctly',
    test: function () {
      return new MyPromise((resolve) => {
        resolve(5);
      })
        .then((val) => val * 2)
        .then((val) => val + 1)
        .then((val) => {
          if (val !== 11) {
            throw new Error(`Expected 11, got ${val}`);
          }
        });
    },
  },
  {
    name: 'Catch an error thrown in executor',
    test: function () {
      return new MyPromise(() => {
        throw new Error('Executor crash');
      })
        .then(
          () => {
            throw new Error('Should not be resolved when the executor throws');
          },
          (err) => {
            if (err.message !== 'Executor crash') {
              throw new Error(`Expected 'Executor crash', got '${err.message}'`);
            }
          }
        );
    },
  },
  {
    name: 'Catch an error thrown in onFulfilled',
    test: function () {
      return new MyPromise((resolve) => {
        resolve('ok');
      })
        .then(() => {
          throw new Error('Crash in onFulfilled');
        })
        .then(
          () => {
            throw new Error('Should not reach here if error was thrown');
          },
          (err) => {
            if (err.message !== 'Crash in onFulfilled') {
              throw new Error(`Expected 'Crash in onFulfilled', got '${err.message}'`);
            }
          }
        );
    },
  },
  {
    name: 'Thenable unwrapping (resolve with native Promise)',
    test: function () {
      // This test checks if your MyPromise can handle thenable objects properly.
      // We use a native Promise as the thenable.
      const nativePromise = new Promise((resolve) => resolve('wrapped value'));

      return new MyPromise((resolve) => resolve(nativePromise)).then((val) => {
        if (val !== 'wrapped value') {
          throw new Error(`Expected 'wrapped value', got '${val}'`);
        }
      });
    },
  },
  {
    name: 'Thenable unwrapping (resolve with custom thenable)',
    test: function () {
      // A minimal thenable object
      const thenable = {
        then(onFulfilled) {
          setTimeout(() => {
            onFulfilled('custom thenable resolved');
          }, 50);
        },
      };

      return new MyPromise((resolve) => resolve(thenable)).then((val) => {
        if (val !== 'custom thenable resolved') {
          throw new Error(`Expected 'custom thenable resolved', got '${val}'`);
        }
      });
    },
  },
  {
    name: 'Multiple then handlers on the same promise',
    test: function () {
      const p = new MyPromise((resolve) => resolve('multiple'));
      let resultA, resultB;

      const testA = p.then((val) => {
        resultA = val;
      });
      const testB = p.then((val) => {
        resultB = val;
      });

      return new MyPromise((resolve, reject) => {
        // Wait for both chains to complete
        setTimeout(() => {
          if (resultA !== 'multiple') {
            return reject(`Handler A got '${resultA}' instead of 'multiple'`);
          }
          if (resultB !== 'multiple') {
            return reject(`Handler B got '${resultB}' instead of 'multiple'`);
          }
          resolve();
        }, 50);
      }).then(() => Promise.all([testA, testB]));
    },
  },
  {
    name: 'Ignore calls to resolve after reject',
    test: function () {
      let attemptCount = 0;
      return new MyPromise((resolve, reject) => {
        reject('first');
        resolve('second');
        attemptCount++;
      })
        .then(
          () => {
            throw new Error('Should have been rejected with "first"');
          },
          (val) => {
            if (val !== 'first') {
              throw new Error(`Expected "first", got ${val}`);
            }
            if (attemptCount !== 1) {
              throw new Error(`Executor ran an unexpected number of times (expected 1, got ${attemptCount})`);
            }
          }
        );
    },
  },
  {
    name: 'Ignore calls to reject after resolve',
    test: function () {
      let attemptCount = 0;
      return new MyPromise((resolve, reject) => {
        resolve('initial');
        reject('ignored');
        attemptCount++;
      })
        .then(
          (val) => {
            if (val !== 'initial') {
              throw new Error(`Expected "initial", got ${val}`);
            }
            if (attemptCount !== 1) {
              throw new Error(`Executor ran an unexpected number of times (expected 1, got ${attemptCount})`);
            }
          },
          () => {
            throw new Error('Should have been resolved with "initial"');
          }
        );
    },
  },
  {
    name: 'Resolution is asynchronous (microtask / next tick test)',
    test: function () {
      // We check that `then` callbacks don't fire immediately,
      // but at least after the current JS tick. This is a rough check.
      let syncFlag = true;
      const p = new MyPromise((resolve) => {
        resolve('async check');
      }).then((val) => {
        if (syncFlag) {
          throw new Error('onFulfilled was called synchronously, expected async');
        }
        if (val !== 'async check') {
          throw new Error(`Expected 'async check', got ${val}`);
        }
      });

      syncFlag = false;
      return p;
    },
  },

  {
    name: 'Error prop in chaining of Promises',
    test: function () {
      // We check that `then` callbacks don't fire immediately,
      // but at least after the current JS tick. This is a rough check.
      let syncFlag = true;
      const p = new Promise((resolve, reject) => {
        reject('flagsito');
      }).then(
        (val) => {console.log("OnFulfill", val)},
        (val) => {console.log("OnReject", val); return val}
    ).then(
      (val) => console.log("Second OnFulfill", val),
      (val) => console.log("Second on Reject", val),
    );

      syncFlag = false;
      return p;
    },
  },
];

/**********************************************************************
 * Run the tests
 **********************************************************************/

runTests(tests).catch((err) => {
  // If something goes really wrong and we can't even run the tests
  console.error('Unhandled error while running tests:', err);
});

