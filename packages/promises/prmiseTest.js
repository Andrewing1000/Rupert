
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
  {
    name: '15. MyPromise.resolve (plain value)',
    test: function () {
      if (typeof MyPromise.resolve !== 'function') {
        throw new Error('MyPromise.resolve is not implemented');
      }
      return MyPromise.resolve('resolved-value').then((val) => {
        if (val !== 'resolved-value') {
          throw new Error(`Expected 'resolved-value', got '${val}'`);
        }
      });
    },
  },
  // 16. MyPromise.resolve (thenable)
  {
    name: '16. MyPromise.resolve (thenable)',
    test: function () {
      if (typeof MyPromise.resolve !== 'function') {
        throw new Error('MyPromise.resolve is not implemented');
      }
      const thenable = {
        then: (resolveFn) => {
          setTimeout(() => resolveFn('thenable-fulfilled'), 50);
        },
      };
      return MyPromise.resolve(thenable).then((val) => {
        if (val !== 'thenable-fulfilled') {
          throw new Error(`Expected 'thenable-fulfilled', got '${val}'`);
        }
      });
    },
  },
  // 17. MyPromise.reject
  {
    name: '17. MyPromise.reject',
    test: function () {
      if (typeof MyPromise.reject !== 'function') {
        throw new Error('MyPromise.reject is not implemented');
      }
      return MyPromise.reject('my-reject-reason').then(
        () => {
          throw new Error('Expected promise to be rejected');
        },
        (reason) => {
          if (reason !== 'my-reject-reason') {
            throw new Error(
              `Expected 'my-reject-reason', got '${reason}'`
            );
          }
        }
      );
    },
  },
  // 18. MyPromise.all - all fulfilled
  {
    name: '18. MyPromise.all (all fulfilled)',
    test: function () {
      if (typeof MyPromise.all !== 'function') {
        throw new Error('MyPromise.all is not implemented');
      }
      const arr = [
        MyPromise.resolve('p1'),
        new MyPromise((res) => setTimeout(() => res('p2'), 50)),
        'p3', // non-promise
      ];
      return MyPromise.all(arr).then((values) => {
        if (values.length !== 3) {
          console.log("CACACACACA", values)
          throw new Error(`Expected 3 results, got ${values.length}`);
        }
        if (values[0] !== 'p1' || values[1] !== 'p2' || values[2] !== 'p3') {
          throw new Error(`Array mismatch: got [${values.join(', ')}]`);
        }
      });
    },
  },
  // 19. MyPromise.all - one rejects
  {
    name: '19. MyPromise.all (one rejects)',
    test: function () {
      if (typeof MyPromise.all !== 'function') {
        throw new Error('MyPromise.all is not implemented');
      }
      const arr = [
        MyPromise.resolve('ok'),
        new MyPromise((_, rej) => setTimeout(() => rej('failed'), 30)),
        MyPromise.resolve('not-used'),
      ];
      return MyPromise.all(arr).then(
        () => {
          throw new Error('Expected MyPromise.all to reject');
        },
        (reason) => {
          if (reason !== 'failed') {
            throw new Error(`Expected 'failed', got '${reason}'`);
          }
        }
      );
    },
  },
  // 20. MyPromise.all - empty
  {
    name: '20. MyPromise.all (empty array)',
    test: function () {
      if (typeof MyPromise.all !== 'function') {
        throw new Error('MyPromise.all is not implemented');
      }
      return MyPromise.all([]).then((results) => {
        if (!Array.isArray(results)) {
          throw new Error('Expected an array, got something else');
        }
        if (results.length !== 0) {
          throw new Error(`Expected empty array, got length ${results.length}`);
        }
      });
    },
  },
  // 21. MyPromise.race - first fulfilled
  {
    name: '21. MyPromise.race (first fulfilled)',
    test: function () {
      if (typeof MyPromise.race !== 'function') {
        throw new Error('MyPromise.race is not implemented');
      }
      const arr = [
        new MyPromise((res) => setTimeout(() => res('slow'), 50)),
        MyPromise.resolve('fast'),
      ];
      return MyPromise.race(arr).then((val) => {
        if (val !== 'fast') {
          throw new Error(`Expected 'fast', got '${val}'`);
        }
      });
    },
  },
  // 22. MyPromise.race - first rejected
  {
    name: '22. MyPromise.race (first rejected)',
    test: function () {
      if (typeof MyPromise.race !== 'function') {
        throw new Error('MyPromise.race is not implemented');
      }
      const arr = [
        new MyPromise((_, rej) => setTimeout(() => rej('reject-fast'), 10)),
        new MyPromise((res) => setTimeout(() => res('resolve-slower'), 30)),
      ];
      return MyPromise.race(arr).then(
        () => {
          throw new Error('Expected race to reject first');
        },
        (reason) => {
          if (reason !== 'reject-fast') {
            throw new Error(`Expected 'reject-fast', got '${reason}'`);
          }
        }
      );
    },
  },
  // 23. MyPromise.race - empty
  {
    name: '23. MyPromise.race (empty)',
    test: function () {
      if (typeof MyPromise.race !== 'function') {
        throw new Error('MyPromise.race is not implemented');
      }
      // By spec, .race([]) never settles, but we'll do a quick sanity check:
      const p = MyPromise.race([]);
      return new Promise((resolve, reject) => {
        let settled = false;
        p.then(
          () => {
            settled = true;
          },
          () => {
            settled = true;
          }
        );
        setTimeout(() => {
          if (settled) {
            reject(
              new Error('Expected .race([]) to remain pending, but it settled')
            );
          } else {
            // It didn't settle, so we pass
            resolve();
          }
        }, 100);
      });
    },
  },

  {
    name: '24. MyPromise.any (first fulfill)',
    test: function () {
      if (typeof MyPromise.any !== 'function') {
        throw new Error('MyPromise.any is not implemented');
      }
      const arr = [
        new MyPromise((_, rej) => setTimeout(() => rej('nope1'), 30)),
        new MyPromise((res) => setTimeout(() => res('yes'), 40)),
        new MyPromise((_, rej) => setTimeout(() => rej('nope2'), 10)),
      ];
      return MyPromise.any(arr).then(
        (val) => {
          if (val !== 'yes') {
            throw new Error(`Expected 'yes', got '${val}'`);
          }
        },
        () => {
          throw new Error('Should not reject if one promise fulfills');
        }
      );
    },
  },
  // 25. MyPromise.any - all reject
  {
    name: '25. MyPromise.any (all reject)',
    test: function () {
      if (typeof MyPromise.any !== 'function') {
        throw new Error('MyPromise.any is not implemented');
      }
      const arr = [
        MyPromise.reject('err1'),
        new MyPromise((_, rej) => setTimeout(() => rej('err2'), 10)),
      ];
      return MyPromise.any(arr).then(
        () => {
          throw new Error('Expected any() to reject if all promises reject');
        },
        (error) => {
          // By spec, it's an AggregateError w/ .errors = [ 'err1', 'err2' ]
          // We'll just check for some sign of multiple errors
          if (!error || !error.errors || error.errors.length !== 2) {
            throw new Error(
              `Expected an error with 2 sub-errors, got: ${JSON.stringify(error)}`
            );
          }
        }
      );
    },
  },
  // 26. MyPromise.any - non-promise value
  {
    name: '26. MyPromise.any (non-promise value)',
    test: function () {
      if (typeof MyPromise.any !== 'function') {
        throw new Error('MyPromise.any is not implemented');
      }
      const arr = [
        'instant-value',
        MyPromise.reject('too-late'),
      ];
      return MyPromise.any(arr).then((val) => {
        if (val !== 'instant-value') {
          throw new Error(`Expected 'instant-value', got '${val}'`);
        }
      });
    },
  },
  // 27. MyPromise.any - empty
  {
    name: '27. MyPromise.any (empty)',
    test: function () {
      if (typeof MyPromise.any !== 'function') {
        throw new Error('MyPromise.any is not implemented');
      }
      // By spec, Promise.any([]) rejects immediately w/ AggregateError
      return MyPromise.any([]).then(
        () => {
          throw new Error('Expected any([]) to reject immediately');
        },
        (err) => {
          if (!err || !err.errors || err.errors.length !== 0) {
            throw new Error(
              `Expected an AggregateError with an empty errors array, got: ${JSON.stringify(err)}`
            );
          }
        }
      );
    },
  },
  // 28. MyPromise.allSettled - mixed
  {
    name: '28. MyPromise.allSettled (mixed)',
    test: function () {
      if (typeof MyPromise.allSettled !== 'function') {
        throw new Error('MyPromise.allSettled is not implemented');
      }
      const arr = [
        MyPromise.resolve('fulfill-1'),
        MyPromise.reject('reject-2'),
        'plain-value',
      ];
      return MyPromise.allSettled(arr).then((results) => {
        if (!Array.isArray(results) || results.length !== 3) {
          throw new Error(`Expected 3 results, got ${JSON.stringify(results)}`);
        }
        // Check statuses
        const [r1, r2, r3] = results;
        if (r1.status !== 'fulfilled' || r1.value !== 'fulfill-1') {
          throw new Error(`Incorrect result for #1: ${JSON.stringify(r1)}`);
        }
        if (r2.status !== 'rejected' || r2.reason !== 'reject-2') {
          throw new Error(`Incorrect result for #2: ${JSON.stringify(r2)}`);
        }
        if (r3.status !== 'fulfilled' || r3.value !== 'plain-value') {
          throw new Error(`Incorrect result for #3: ${JSON.stringify(r3)}`);
        }
      });
    },
  },
  // 29. MyPromise.allSettled - empty
  {
    name: '29. MyPromise.allSettled (empty)',
    test: function () {
      if (typeof MyPromise.allSettled !== 'function') {
        throw new Error('MyPromise.allSettled is not implemented');
      }
      return MyPromise.allSettled([]).then((results) => {
        if (!Array.isArray(results) || results.length !== 0) {
          throw new Error(`Expected an empty array, got ${JSON.stringify(results)}`);
        }
      });
    },
  },
  // 30. MyPromise.withResolvers (basic usage)
  {
    name: '30. MyPromise.withResolvers (basic usage)',
    test: function () {
      if (typeof MyPromise.withResolvers !== 'function') {
        throw new Error('MyPromise.withResolvers is not implemented');
      }
      const { promise, resolve, reject } = MyPromise.withResolvers();
      const check = promise.then((val) => {
        if (val !== 'foo') {
          throw new Error(`Expected 'foo', got '${val}'`);
        }
      });
      resolve('foo');
      return check;
    },
  },
  // 31. MyPromise.withResolvers (reject usage)
  {
    name: '31. MyPromise.withResolvers (reject usage)',
    test: function () {
      if (typeof MyPromise.withResolvers !== 'function') {
        throw new Error('MyPromise.withResolvers is not implemented');
      }
      const { promise, resolve, reject } = MyPromise.withResolvers();
      const check = promise.then(
        () => {
          throw new Error('Expected to reject');
        },
        (reason) => {
          if (reason !== 'bar') {
            throw new Error(`Expected 'bar', got '${reason}'`);
          }
        }
      );
      reject('bar');
      return check;
    },
  },
  // 32. MyPromise.withResolvers (multiple calls)
  {
    name: '32. MyPromise.withResolvers (multiple calls)',
    test: function () {
      if (typeof MyPromise.withResolvers !== 'function') {
        throw new Error('MyPromise.withResolvers is not implemented');
      }
      const { promise, resolve, reject } = MyPromise.withResolvers();
      const check = promise.then((val) => {
        if (val !== 'first-call') {
          throw new Error(`Expected 'first-call', got '${val}'`);
        }
      });
      resolve('first-call');
      // This second call should have no effect
      reject('ignored');
      return check;
    },
  },
  // 33. MyPromise.prototype.finally (after fulfillment)
  {
    name: '33. MyPromise.prototype.finally (after fulfillment)',
    test: function () {
      if (typeof MyPromise.prototype.finally !== 'function') {
        throw new Error('MyPromise.prototype.finally is not implemented');
      }
      return MyPromise.resolve('final-fulfill')
        .finally(() => {
          // no return => doesn't change the chain value
        })
        .then((val) => {
          if (val !== 'final-fulfill') {
            throw new Error(
              `Expected 'final-fulfill', got '${val}' after finally()`
            );
          }
        });
    },
  },
  // 34. MyPromise.prototype.finally (after rejection)
  {
    name: '34. MyPromise.prototype.finally (after rejection)',
    test: function () {
      if (typeof MyPromise.prototype.finally !== 'function') {
        throw new Error('MyPromise.prototype.finally is not implemented');
      }
      return MyPromise.reject('final-reject')
        .finally(() => {
          // no return => doesn't change chain reason
        })
        .then(
          () => {
            throw new Error('Should not fulfill if originally rejected');
          },
          (reason) => {
            if (reason !== 'final-reject') {
              throw new Error(
                `Expected 'final-reject', got '${reason}' after finally()`
              );
            }
          }
        );
    },
  },
  // 35. MyPromise.prototype.finally (callback returns rejecting promise)
  {
    name: '35. MyPromise.prototype.finally (callback returns rejecting promise)',
    test: function () {
      if (typeof MyPromise.prototype.finally !== 'function') {
        throw new Error('MyPromise.prototype.finally is not implemented');
      }
      return MyPromise.resolve('original')
        .finally(() => {
          return new MyPromise((_, reject) => reject('rejected-in-finally'));
        })
        .then(
          () => {
            throw new Error('Expected to reject due to finally callback');
          },
          (reason) => {
            if (reason !== 'rejected-in-finally') {
              throw new Error(
                `Expected 'rejected-in-finally', got '${reason}'`
              );
            }
          }
        );
    },
  },
  // 36. MyPromise.prototype.finally (callback throws error)
  {
    name: '36. MyPromise.prototype.finally (callback throws error)',
    test: function () {
      if (typeof MyPromise.prototype.finally !== 'function') {
        throw new Error('MyPromise.prototype.finally is not implemented');
      }
      return MyPromise.resolve('ignored')
        .finally(() => {
          throw new Error('finally-crash');
        })
        .then(
          () => {
            throw new Error('Expected to reject because of finally throw');
          },
          (err) => {
            if (!err || err.message !== 'finally-crash') {
              throw new Error(
                `Expected 'finally-crash', got '${err && err.message}'`
              );
            }
          }
        );
    },
  },

  {
    name: '37. MyPromise.try (basic success)',
    test: function () {
      if (typeof MyPromise.try !== 'function') {
        throw new Error('MyPromise.try is not implemented');
      }
      return MyPromise.try(() => 42).then((val) => {
        if (val !== 42) {
          throw new Error(`Expected 42, got ${val}`);
        }
      });
    },
  },
  {
    name: '38. MyPromise.try (sync throw error)',
    test: function () {
      if (typeof MyPromise.try !== 'function') {
        throw new Error('MyPromise.try is not implemented');
      }
      return MyPromise.try(() => {
        throw new Error('Boom!');
      })
        .then(
          () => {
            throw new Error('Expected promise to reject, but it resolved');
          },
          (err) => {
            if (!err || err.message !== 'Boom!') {
              throw new Error(`Expected 'Boom!', got '${err && err.message}'`);
            }
          }
        );
    },
  },
  {
    name: '39. MyPromise.try (return promise - fulfill)',
    test: function () {
      if (typeof MyPromise.try !== 'function') {
        throw new Error('MyPromise.try is not implemented');
      }
      return MyPromise.try(() => {
        // Return a promise that resolves
        return new MyPromise((resolve) => setTimeout(() => resolve('async-yes'), 50));
      }).then((val) => {
        if (val !== 'async-yes') {
          throw new Error(`Expected 'async-yes', got '${val}'`);
        }
      });
    },
  },
  {
    name: '40. MyPromise.try (return promise - reject)',
    test: function () {
      if (typeof MyPromise.try !== 'function') {
        throw new Error('MyPromise.try is not implemented');
      }
      return MyPromise.try(() => {
        // Return a promise that rejects
        return new MyPromise((_, reject) => setTimeout(() => reject('async-no'), 50));
      })
        .then(
          () => {
            throw new Error('Expected promise to reject, but it resolved');
          },
          (reason) => {
            if (reason !== 'async-no') {
              throw new Error(`Expected 'async-no', got '${reason}'`);
            }
          }
        );
    },
  },
  {
    name: '41. MyPromise.try (return thenable)',
    test: function () {
      if (typeof MyPromise.try !== 'function') {
        throw new Error('MyPromise.try is not implemented');
      }
      const thenable = {
        then(onFulfilled, onRejected) {
          setTimeout(() => onFulfilled('thenable-value'), 30);
        },
      };
      return MyPromise.try(() => thenable).then((val) => {
        if (val !== 'thenable-value') {
          throw new Error(`Expected 'thenable-value', got '${val}'`);
        }
      });
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

