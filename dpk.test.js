const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");
const MAX_PARTITION_KEY_LENGTH = 256;

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
});

describe("deterministicPartitionKey", () => {
  describe("when input is given", () => {
    describe("when partitionKey is not available in the input", () => {
      const event = { action: 'view_product', user_id: 1 };
      const expectedTrivialKey = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");

      it("Returns the digest of the entire input as candidate", () => {
        const trivialKey = deterministicPartitionKey(event);
        expect(trivialKey).toBe(expectedTrivialKey);
      });
    });

    describe("when partitionKey is available in the input", () => {
      describe("when partitionKey length is within the threshold", () => {
        describe("when the partitionKey is a string", () => {
          const event = { action: 'view_product', user_id: 1, partitionKey: 'test-partition-key-1' };

          it("Returns the partitionKey as the candidate", () => {
            const trivialKey = deterministicPartitionKey(event);
            expect(trivialKey).toBe(event.partitionKey);
          });
        });

        describe("when the partitionKey is not a string", () => {
          const event = { action: 'view_product', user_id: 1, partitionKey: { key: 'test-partition-key-1', value: 'value1' } };

          it("Returns the stringify partitionKey as the candidate", () => {
            const trivialKey = deterministicPartitionKey(event);
            expect(trivialKey).toBe(JSON.stringify(event.partitionKey));
          });
        });
      });

      describe("when candidate length is over the threshold", () => {
        const event = { action: 'view_product', user_id: 1, partitionKey: new Array(MAX_PARTITION_KEY_LENGTH + 1).fill('0').join('') };
        const expectedTrivialKey = crypto.createHash("sha3-512").update(event.partitionKey).digest("hex");

        it("Returns the digest of partitionKey as the candidate", () => {
          const trivialKey = deterministicPartitionKey(event);
          expect(trivialKey).toBe(expectedTrivialKey);
        });
      });
    });
  });
});