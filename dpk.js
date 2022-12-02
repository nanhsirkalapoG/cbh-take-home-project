const crypto = require("crypto");

// Return encrypted key for the given data
const getEncryptedDigestKey = (data) => {
  let digestKey;
  if (data) {
    digestKey = crypto.createHash("sha3-512").update(data).digest("hex");
  }

  return digestKey;
}

// Extract the candidate key from the input
const getCandidateKey = (event) => {
  let candidateKey;

  if (event) {
    if (event.partitionKey) {
      candidateKey = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidateKey = getEncryptedDigestKey(data);
    }
  }

  return candidateKey;
};

// Validate and provide the formatted key
const getFormattedCanidateKey = (candidateKey) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  let formattedCandidateKey = candidateKey;
  if (formattedCandidateKey) {
    if (typeof formattedCandidateKey !== "string") {
      formattedCandidateKey = JSON.stringify(formattedCandidateKey);
    }
  } else {
    formattedCandidateKey = TRIVIAL_PARTITION_KEY;
  }
  if (formattedCandidateKey.length > MAX_PARTITION_KEY_LENGTH) {
    formattedCandidateKey = getEncryptedDigestKey(formattedCandidateKey);
  }

  return formattedCandidateKey;
};

exports.deterministicPartitionKey = (event) => {
  let partitionKey;

  partitionKey = getCandidateKey(event);
  partitionKey = getFormattedCanidateKey(partitionKey);

  return partitionKey;
};