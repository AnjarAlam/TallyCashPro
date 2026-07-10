# Pushing the image to ECR (different AWS account)

If your default AWS CLI is configured for another account, use a **named profile** for the account where ECR lives.

## 1. Add a profile for the ECR account

```bash
aws configure --profile my-ecr-account
```

Enter:
- **AWS Access Key ID** and **Secret** for the account that has ECR
- **Default region** (e.g. `us-east-1`)

Your `~/.aws/credentials` will look like:

```ini
[default]
aws_access_key_id = AKIA...
aws_secret_access_key = ...

[my-ecr-account]
aws_access_key_id = AKIA...
aws_secret_access_key = ...
```

## 2. Build the image

```bash
docker compose build
```

## 3. Push to ECR using that profile

```bash
chmod +x scripts/push-to-ecr.sh
AWS_PROFILE=my-ecr-account ./scripts/push-to-ecr.sh
```

Or with custom region/repo:

```bash
AWS_PROFILE=my-ecr-account AWS_REGION=ap-south-1 ECR_REPO_NAME=tally-cash-flow ./scripts/push-to-ecr.sh
```

Or pass profile as first argument:

```bash
./scripts/push-to-ecr.sh my-ecr-account
./scripts/push-to-ecr.sh my-ecr-account ap-south-1 my-repo-name
```

The script will:
- Use the given profile (no impact on your default account)
- Create the ECR repository if it doesn’t exist
- Log Docker into ECR and push `tally-cash-flow:latest`

## One-off without a named profile

If you only need to push once and don’t want a profile:

```bash
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=us-east-1
AWS_PROFILE=  # clear so default creds aren’t used
./scripts/push-to-ecr.sh
```

Or use the profile and leave your default credentials unchanged (recommended).
