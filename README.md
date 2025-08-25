# AWS Pipeline Cross-Account Deployment

A complete solution for deploying applications across multiple AWS accounts using AWS CDK pipelines, featuring an Angular frontend and automated CI/CD workflows.

## Architecture

This project demonstrates a multi-account AWS deployment strategy with:

- **Tooling Account**: Hosts the CI/CD pipeline
- **Development Account**: Development environment
- **Staging Account**: Pre-production environment  
- **Production Account**: Production environment

## Project Structure

```
├── aws-cdk/                    # CDK infrastructure code
│   ├── bin/                    # CDK app entry points and configurations
│   ├── lib/                    # Stack definitions
│   │   ├── backend/            # Backend API infrastructure
│   │   ├── cdk-pipeline-stack.ts
│   │   ├── cross-account-support-stack.ts
│   │   └── frontend-stack.ts
│   └── test/                   # Infrastructure tests
└── angular-static-webapp/      # Angular frontend application
    ├── src/                    # Angular source code
    └── public/                 # Static assets
```

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js 18+ and npm
- AWS CDK CLI (`npm install -g aws-cdk`)
- GitHub token stored in AWS Secrets Manager as `github-token`

## Quick Start

### 1. Deploy Infrastructure

```bash
cd aws-cdk
npm install
npm run build
cdk bootstrap --profile tooling-account
cdk deploy --profile tooling-account
```

### 2. Run Frontend Locally

```bash
cd angular-static-webapp
npm install
npm start
```

## Configuration

Update account IDs and regions in `aws-cdk/bin/configs.ts`:

```typescript
export const AwsEnv = {
    tooling: { account: 'YOUR-TOOLING-ACCOUNT', region: 'ap-southeast-1' },
    develop: { account: 'YOUR-DEV-ACCOUNT', region: 'ap-southeast-1' },
    staging: { account: 'YOUR-STAGING-ACCOUNT', region: 'ap-southeast-1' },
    product: { account: 'YOUR-PROD-ACCOUNT', region: 'ap-southeast-1' }
};
```

## Pipeline Workflow

1. **Source**: GitHub repository trigger
2. **Build**: CDK synthesis and compilation
3. **Deploy Dev**: Automatic deployment to development
4. **Deploy Staging**: Manual approval required
5. **Deploy Production**: Manual approval required

## Security Features

- KMS encryption for pipeline artifacts
- Cross-account IAM roles with least privilege
- SSL enforcement on S3 buckets
- Secrets Manager integration for GitHub token

## Available Scripts

### CDK Commands
```bash
npm run build    # Compile TypeScript
npm run test     # Run tests
npm run cdk      # CDK CLI commands
```

### Angular Commands
```bash
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
```

## Deployment Environments

- **Development**: Automatic deployment on main branch
- **Staging**: Manual approval + deployment
- **Production**: Manual approval + deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

This project is licensed under the MIT License.