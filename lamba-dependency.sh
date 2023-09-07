for dir in aws/lambda/*; do
  (npm ci && npx tsc ./index.ts)
done