for dir in aws/lambda/*; do
  (cd "$dir" && npm ci && npx tsc ./index.ts)  
done
