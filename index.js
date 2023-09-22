const retry = (fn, { 
  maxAttemts = 0,
  delay = 1000, 
  increaseDelayBy = 1000, 
  increaseDelayAfter = 10,
  onRetry = () => {},
}) => {
  let counter = 0;
  let currentDelay = delay;

  const attempt = async (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      if (counter < maxAttemts) {
        if (counter >= increaseDelayAfter) {
          currentDelay += increaseDelayBy;
        }

        if (!delay) {
          onRetry();
          attempt(...args);

          return
        }
        
        setTimeout(() => {
          onRetry();
          attempt(...args);
        }, currentDelay);
      } else {
        throw error;
      }
    } finally {
      counter += 1;
    }
  };

  return attempt;
};
