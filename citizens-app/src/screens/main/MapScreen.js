// Option 1: Assign to a variable
const rateLimitError = {
  code: "rate-limited",
  message: "You have hit the rate limit. Please upgrade to keep chatting.",
  providerLimitHit: false,
  isRetryable: true
};

// You can log it
console.log(rateLimitError);

// Option 2: Return from a function
function getRateLimitError() {
  return {
    code: "rate-limited",
    message: "You have hit the rate limit. Please upgrade to keep chatting.",
    providerLimitHit: false,
    isRetryable: true
  };
}
