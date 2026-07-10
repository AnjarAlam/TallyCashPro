#!/usr/bin/env bash
# Build and push tally-cash-flow to ECR (me-central-1, tallycashpro/tallycashpro-web).
#
# Prerequisites: AWS CLI with profile "tallycash" (or set AWS_PROFILE).
#
# Usage:
#   ./scripts/build-and-push-ecr.sh

set -e

AWS_PROFILE="${AWS_PROFILE:-tallycash}"
export AWS_PROFILE

AWS_REGION="${AWS_REGION:-me-central-1}"
ECR_ACCOUNT_ID="${ECR_ACCOUNT_ID:-668567158221}"
ECR_REPO_NAME="${ECR_REPO_NAME:-tallycashpro/tallycashpro-web}"
IMAGE_NAME="${IMAGE_NAME:-tallycashpro/tallycashpro-web}"
NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL:-https://api-v1.tallycashpro.com/v1/api}"
NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL:-https://api-v1.tallycashpro.com/v1/api}"

ECR_URI="${ECR_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo "=== ECR login (region: $AWS_REGION) ==="
aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin "${ECR_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo ""
echo "=== Docker build (linux/amd64 for ECS) ==="
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_BASE_URL="$NEXT_PUBLIC_BASE_URL" \
  --build-arg NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL" \
  -t "$IMAGE_NAME:latest" .

echo ""
echo "=== Tag for ECR ==="
docker tag "$IMAGE_NAME:latest" "${ECR_URI}:latest"

echo ""
echo "=== Push to ECR ==="
docker push "${ECR_URI}:latest"

echo ""
echo "Done. Image: ${ECR_URI}:latest"
