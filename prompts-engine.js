/**
 * AWS Lab Maker AI Prompt Builder - Project Generation Engine
 * 
 * Generates 5 diverse, realistic AWS hands-on project prompts based on
 * selected services and experience level. Each prompt is capped at 950 characters.
 */

const PromptEngine = (() => {

    // Project templates organized by scenario category
    const SCENARIO_CATEGORIES = [
        'serverless',
        'application-deployment',
        'event-driven',
        'security-auth',
        'monitoring-observability',
        'data-processing',
        'high-availability',
        'api-architecture',
        'automation-orchestration',
        'cost-performance'
    ];

    // Service metadata for intelligent prompt generation
    const SERVICE_META = {
        'Amazon API Gateway': { category: 'networking', keywords: ['REST API', 'HTTP API', 'WebSocket', 'API endpoint', 'throttling', 'stages'] },
        'Amazon Bedrock': { category: 'ai', keywords: ['foundation model', 'generative AI', 'model invocation', 'prompt engineering', 'inference'] },
        'Amazon CloudWatch': { category: 'monitoring', keywords: ['metrics', 'alarms', 'logs', 'dashboards', 'monitoring', 'log groups'] },
        'Amazon Cognito': { category: 'security', keywords: ['user pool', 'identity pool', 'authentication', 'authorization', 'OAuth', 'sign-up'] },
        'Amazon DynamoDB': { category: 'database', keywords: ['table', 'partition key', 'sort key', 'GSI', 'streams', 'on-demand capacity'] },
        'Amazon EBS': { category: 'storage', keywords: ['volume', 'snapshot', 'IOPS', 'throughput', 'gp3', 'io2'] },
        'Amazon EC2': { category: 'compute', keywords: ['instance', 'AMI', 'security group', 'key pair', 'instance type', 'user data'] },
        'Amazon ELB': { category: 'networking', keywords: ['load balancer', 'target group', 'health check', 'ALB', 'listener rules'] },
        'Amazon EventBridge': { category: 'integration', keywords: ['event bus', 'rules', 'targets', 'event pattern', 'schedule', 'custom events'] },
        'Amazon RDS': { category: 'database', keywords: ['database instance', 'Multi-AZ', 'read replica', 'parameter group', 'subnet group'] },
        'Amazon S3': { category: 'storage', keywords: ['bucket', 'objects', 'bucket policy', 'versioning', 'lifecycle rules', 'static hosting'] },
        'Amazon SNS': { category: 'messaging', keywords: ['topic', 'subscription', 'notification', 'fan-out', 'message filtering'] },
        'Amazon SQS': { category: 'messaging', keywords: ['queue', 'messages', 'dead-letter queue', 'visibility timeout', 'FIFO queue'] },
        'Amazon VPC': { category: 'networking', keywords: ['subnets', 'route tables', 'internet gateway', 'NAT gateway', 'security groups', 'NACLs'] },
        'AWS AppSync': { category: 'api', keywords: ['GraphQL API', 'resolvers', 'schema', 'data sources', 'real-time subscriptions'] },
        'AWS IAM': { category: 'security', keywords: ['roles', 'policies', 'users', 'groups', 'permissions', 'least privilege'] },
        'AWS Lambda': { category: 'compute', keywords: ['function', 'trigger', 'runtime', 'handler', 'layers', 'concurrency'] },
        'AWS Step Functions': { category: 'orchestration', keywords: ['state machine', 'workflow', 'states', 'parallel execution', 'error handling', 'retry'] }
    };

    // Level-specific configuration
    const LEVEL_CONFIG = {
        'Beginner': {
            complexity: 'simple',
            focus: ['fundamentals', 'basic configuration', 'AWS Console walkthrough', 'simple testing'],
            avoidTerms: ['enterprise', 'multi-region', 'advanced', 'complex', 'production-grade'],
            includeTerms: ['create', 'configure', 'set up', 'basic', 'simple', 'test', 'verify']
        },
        'Intermediate': {
            complexity: 'moderate',
            focus: ['service integration', 'security basics', 'health checks', 'troubleshooting', 'realistic scenarios'],
            avoidTerms: ['enterprise-grade', 'multi-region failover', 'advanced governance'],
            includeTerms: ['integrate', 'configure', 'implement', 'validate', 'monitor', 'secure']
        },
        'Advanced': {
            complexity: 'complex',
            focus: ['high availability', 'scalability', 'resilience', 'security best practices', 'performance', 'observability'],
            avoidTerms: ['basic', 'simple', 'beginner'],
            includeTerms: ['production', 'scalable', 'resilient', 'optimize', 'secure', 'monitor', 'automate']
        },
        'Experienced Builder': {
            complexity: 'enterprise',
            focus: ['enterprise architecture', 'advanced patterns', 'failure scenarios', 'governance', 'automation', 'architectural decisions'],
            avoidTerms: ['basic', 'simple', 'beginner', 'getting started'],
            includeTerms: ['enterprise', 'architect', 'design', 'optimize', 'governance', 'resilience', 'failure recovery']
        }
    };

    // --- Project Template Definitions ---
    // Each template is a function that takes services and level to produce a project

    function generateProjects(selectedServices, level) {
        const serviceNames = selectedServices;
        const levelConfig = LEVEL_CONFIG[level];
        const isSingle = serviceNames.length === 1;

        // Select 5 diverse scenarios based on the services
        const scenarios = selectScenarios(serviceNames, level);

        const projects = scenarios.map((scenario, index) => {
            return generateProjectForScenario(scenario, serviceNames, level, levelConfig, index);
        });

        return projects;
    }

    function selectScenarios(services, level) {
        const categories = [];
        const serviceCategories = services.map(s => SERVICE_META[s]?.category);

        // Build a pool of relevant scenarios
        const pool = [];

        if (services.some(s => ['AWS Lambda', 'Amazon API Gateway', 'Amazon DynamoDB', 'AWS Step Functions'].includes(s))) {
            pool.push('serverless');
        }
        if (services.some(s => ['Amazon EC2', 'Amazon ELB', 'Amazon RDS', 'Amazon EBS'].includes(s))) {
            pool.push('application-deployment');
        }
        if (services.some(s => ['Amazon EventBridge', 'Amazon SNS', 'Amazon SQS', 'AWS Lambda'].includes(s))) {
            pool.push('event-driven');
        }
        if (services.some(s => ['Amazon Cognito', 'AWS IAM', 'Amazon VPC'].includes(s))) {
            pool.push('security-auth');
        }
        if (services.some(s => ['Amazon CloudWatch', 'Amazon SNS'].includes(s))) {
            pool.push('monitoring-observability');
        }
        if (services.some(s => ['Amazon S3', 'Amazon DynamoDB', 'Amazon RDS', 'AWS Lambda'].includes(s))) {
            pool.push('data-processing');
        }
        if (services.some(s => ['Amazon ELB', 'Amazon EC2', 'Amazon RDS', 'Amazon VPC'].includes(s))) {
            pool.push('high-availability');
        }
        if (services.some(s => ['Amazon API Gateway', 'AWS AppSync', 'AWS Lambda', 'Amazon DynamoDB'].includes(s))) {
            pool.push('api-architecture');
        }
        if (services.some(s => ['AWS Step Functions', 'AWS Lambda', 'Amazon EventBridge'].includes(s))) {
            pool.push('automation-orchestration');
        }
        if (services.some(s => ['Amazon CloudWatch', 'Amazon S3', 'Amazon DynamoDB', 'AWS Lambda'].includes(s))) {
            pool.push('cost-performance');
        }

        // If pool is too small, pad with generic scenarios
        const allScenarios = [...new Set(pool)];
        while (allScenarios.length < 5) {
            for (const cat of SCENARIO_CATEGORIES) {
                if (!allScenarios.includes(cat)) {
                    allScenarios.push(cat);
                    break;
                }
            }
        }

        // Return the first 5 unique scenarios
        return allScenarios.slice(0, 5);
    }

    function generateProjectForScenario(scenario, services, level, levelConfig, index) {
        const templates = getTemplatesForScenario(scenario, services, level);
        const template = templates[index % templates.length] || templates[0];

        let prompt = template.generate(services, level, levelConfig);

        // Enforce 950 character limit
        prompt = enforceCharLimit(prompt, 950);

        return {
            title: template.title,
            prompt: prompt,
            charCount: prompt.length
        };
    }

    function getTemplatesForScenario(scenario, services, level) {
        const isSingle = services.length === 1;
        const service = services[0];

        const templates = {
            'serverless': [
                {
                    title: 'Serverless REST API',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Create a serverless REST API using ${listServices(svcs)}. Set up a basic CRUD API that stores and retrieves data. Configure the API endpoint, create the backend function with a simple runtime, connect to a data store, and test each operation using the AWS Console. Verify responses return correct data and status codes. Clean up all resources after testing.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a serverless REST API using ${listServices(svcs)}. Implement CRUD operations with input validation, error handling, and proper HTTP status codes. Configure API request/response models, enable CORS, set up stage variables, and implement basic authorization. Add CloudWatch logging, test all endpoints, verify error scenarios, and document the API structure. Clean up all resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a production-ready serverless REST API using ${listServices(svcs)}. Implement CRUD with input validation, custom authorizers, request throttling, and caching. Configure deployment stages with stage-specific variables, enable detailed CloudWatch metrics, set up alarms for error rates, and implement structured logging. Test load handling, verify security controls, validate failover behavior, and clean up resources.`);
                        } else {
                            return buildPrompt(svcs, `Architect an enterprise serverless API platform using ${listServices(svcs)}. Design multi-stage deployments with canary releases, implement custom authorizers with token validation, configure per-client throttling, and enable API caching with invalidation strategies. Set up comprehensive observability with custom metrics, distributed tracing, and alerting. Implement circuit breaker patterns, validate failure recovery, test under load, and clean up.`);
                        }
                    }
                },
                {
                    title: 'Serverless Data Processor',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Set up a simple serverless data processing workflow using ${listServices(svcs)}. Create a function that processes incoming data and stores results. Configure the trigger, write basic processing logic, test with sample data, and verify the output is stored correctly. Use the AWS Console for all configuration. Clean up resources after testing.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a serverless data processing pipeline using ${listServices(svcs)}. Configure event-driven triggers to process incoming data, implement transformation logic with error handling, store processed results, and set up dead-letter handling for failures. Add logging, create test scenarios for success and failure paths, validate data integrity, and clean up all resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a scalable serverless data processing system using ${listServices(svcs)}. Implement parallel processing with concurrency controls, configure batch processing for high-volume data, add retry logic with exponential backoff, and set up comprehensive error handling with dead-letter queues. Monitor processing metrics, set alarms for failures, test at scale, validate data consistency, and clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect an enterprise data processing platform using ${listServices(svcs)}. Design for high throughput with parallel execution, implement exactly-once processing semantics, configure adaptive concurrency, and build multi-stage transformation pipelines. Add data validation, quality checks, comprehensive observability, and automated failure recovery. Test with production-scale data volumes and clean up.`);
                        }
                    }
                }
            ],
            'application-deployment': [
                {
                    title: 'Web Application Deployment',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Deploy a simple web application using ${listServices(svcs)}. Launch a compute instance, configure networking to allow web traffic, install a web server, and deploy a sample web page. Test that the application is accessible from a browser. Verify the security group rules and instance status. Clean up all resources after testing.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Deploy a web application with ${listServices(svcs)}. Set up networking with public and private subnets, launch instances with user data scripts for automated setup, configure a load balancer with health checks, and attach persistent storage. Test application availability, verify health check behavior, simulate an instance failure, and validate recovery. Clean up all resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Deploy a highly available web application using ${listServices(svcs)}. Create a multi-AZ architecture with auto-scaling, configure load balancing with path-based routing, set up a managed database with failover, and implement comprehensive monitoring with alarms. Test scaling behavior, validate failover scenarios, verify security configurations, and ensure zero-downtime deployment capability. Clean up all resources.`);
                        } else {
                            return buildPrompt(svcs, `Architect an enterprise web platform using ${listServices(svcs)}. Design multi-tier architecture across AZs with auto-scaling at each tier, implement blue-green deployment readiness, configure advanced load balancing with WAF considerations, and set up database replication. Build comprehensive observability, test failure injection scenarios, validate recovery procedures, and document architectural decisions. Clean up.`);
                        }
                    }
                },
                {
                    title: 'Database-Backed Application',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Create a database-backed application using ${listServices(svcs)}. Set up a managed database, configure connectivity, create a simple table schema, and connect an application layer to read and write data. Test basic operations through the AWS Console, verify data persistence, and clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a database-backed application using ${listServices(svcs)}. Design a schema for a realistic use case, configure a managed database with proper networking and security, set up backup policies, and implement application connectivity. Test CRUD operations, verify backup functionality, monitor database metrics, and implement basic performance tuning. Clean up all resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a resilient database-backed system using ${listServices(svcs)}. Implement Multi-AZ deployment with automated failover, configure read replicas for read scaling, set up parameter groups for optimization, and implement comprehensive backup strategies. Monitor replication lag, test failover scenarios, validate recovery point objectives, and verify security controls. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect an enterprise database platform using ${listServices(svcs)}. Design for high availability with Multi-AZ and cross-region read replicas, implement connection pooling strategies, configure advanced parameter tuning, and build automated maintenance windows. Test failover under load, validate point-in-time recovery, implement encryption and audit logging, and document capacity planning decisions. Clean up.`);
                        }
                    }
                }
            ],
            'event-driven': [
                {
                    title: 'Event-Driven Architecture',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Build a simple event-driven system using ${listServices(svcs)}. Create an event source that triggers an action when something happens. Configure the event rule, set up the target to process events, and test by sending a sample event. Verify the target received and processed the event. Clean up all resources after testing.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Implement an event-driven architecture using ${listServices(svcs)}. Configure event rules with pattern matching to route events to multiple targets. Set up dead-letter queues for failed deliveries, implement retry policies, and add logging for event processing. Test with various event patterns, verify routing accuracy, simulate failures, and validate error handling. Clean up.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a production event-driven system using ${listServices(svcs)}. Implement event routing with complex pattern matching, configure fan-out to multiple consumers, add event replay capabilities, and set up comprehensive monitoring. Build dead-letter handling with automated retry, test event ordering guarantees, validate at-least-once delivery, and monitor end-to-end latency. Clean up resources.`);
                        } else {
                            return buildPrompt(svcs, `Architect an enterprise event-driven platform using ${listServices(svcs)}. Design event mesh topology with multiple buses, implement event versioning and schema evolution strategies, configure cross-account event routing, and build saga patterns for distributed transactions. Test failure cascades, validate event ordering, implement compensating transactions, and monitor system-wide event flow. Clean up.`);
                        }
                    }
                },
                {
                    title: 'Notification System',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Create a basic notification system using ${listServices(svcs)}. Set up a messaging topic, subscribe an endpoint to receive notifications, and publish a test message. Verify the message was delivered successfully. Understand the pub/sub pattern through this hands-on exercise. Clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a notification system using ${listServices(svcs)}. Configure a messaging topic with multiple subscribers and message filtering policies. Implement event-triggered notifications, add message attributes for routing, and set up error handling for failed deliveries. Test filtering logic, verify delivery to correct subscribers, and validate message format. Clean up all resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a scalable notification platform using ${listServices(svcs)}. Implement fan-out patterns with filtered subscriptions, configure message deduplication, add delivery status tracking, and set up retry mechanisms. Build monitoring for delivery rates and latency, test high-volume scenarios, validate message ordering, and implement backpressure handling. Clean up resources.`);
                        } else {
                            return buildPrompt(svcs, `Architect an enterprise notification hub using ${listServices(svcs)}. Design multi-channel delivery with priority routing, implement rate limiting per subscriber, configure cross-region message replication, and build delivery guarantee tracking. Test cascade failures, validate exactly-once processing, implement circuit breakers for downstream services, and monitor end-to-end delivery SLAs. Clean up.`);
                        }
                    }
                }
            ],
            'security-auth': [
                {
                    title: 'Secure Access Control',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Set up basic access control using ${listServices(svcs)}. Create IAM roles and policies that follow least privilege principles. Configure permissions for a specific use case, test access by attempting allowed and denied operations, and verify the security boundaries work as expected. Clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Implement access control using ${listServices(svcs)}. Design role-based access with custom policies, configure resource-based policies, set up cross-service permissions, and implement policy conditions. Test by assuming roles and verifying access boundaries, audit effective permissions, validate deny rules override allows, and clean up all resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a comprehensive security architecture using ${listServices(svcs)}. Implement layered access control with service control policies, resource policies, and identity policies. Configure VPC security layers, set up encryption in transit and at rest, implement audit logging, and test security boundaries. Validate least-privilege effectiveness and clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise security controls using ${listServices(svcs)}. Design defense-in-depth with multiple policy layers, implement attribute-based access control, configure cross-account access patterns, and build automated compliance checking. Test privilege escalation scenarios, validate break-glass procedures, implement security event correlation, and document trust boundaries. Clean up.`);
                        }
                    }
                },
                {
                    title: 'User Authentication System',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Create a user authentication system using ${listServices(svcs)}. Set up a user directory, configure sign-up and sign-in flows, create a test user, and verify the authentication works by signing in. Understand how user pools and identity management work through hands-on configuration. Clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a user authentication system using ${listServices(svcs)}. Configure user pools with custom attributes, set up password policies, implement email verification, and create app client settings. Add multi-factor authentication, configure hosted UI, test sign-up and sign-in flows, verify token contents, and validate session management. Clean up.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a production authentication system using ${listServices(svcs)}. Implement user pools with advanced security features, configure adaptive authentication, set up custom auth flows with pre/post triggers, and integrate with API authorization. Test token refresh, validate session revocation, implement account recovery, and monitor authentication metrics. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise identity management using ${listServices(svcs)}. Design federated authentication with multiple identity providers, implement custom authentication challenges, configure advanced security with compromised credentials detection, and build token customization with claims mapping. Test federation flows, validate token exchange, implement risk-based access, and audit authentication events. Clean up.`);
                        }
                    }
                }
            ],
            'monitoring-observability': [
                {
                    title: 'Monitoring Dashboard',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Set up basic monitoring using ${listServices(svcs)}. Create a CloudWatch dashboard to visualize key metrics, configure a simple alarm that triggers when a threshold is breached, and set up a notification for the alarm. Test by triggering the alarm condition and verifying the notification arrives. Clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a monitoring solution using ${listServices(svcs)}. Create dashboards with widgets for multiple services, configure composite alarms with multiple conditions, set up log groups with metric filters, and implement alerting workflows. Test alarm transitions, verify notification delivery, create log-based insights, and validate dashboard accuracy. Clean up all resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a comprehensive observability platform using ${listServices(svcs)}. Implement custom metrics with dimensions, configure anomaly detection alarms, set up cross-account monitoring, and build automated remediation workflows triggered by alarms. Create operational dashboards, test incident response procedures, validate alert routing, and measure detection-to-response time. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise observability using ${listServices(svcs)}. Design multi-layer monitoring covering infrastructure, application, and business metrics. Implement SLI/SLO tracking with error budgets, configure intelligent alarming with suppression rules, and build automated runbooks. Test cascading failure detection, validate alert fatigue reduction, implement chaos engineering triggers, and document operational procedures. Clean up.`);
                        }
                    }
                },
                {
                    title: 'Log Analytics System',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Set up log monitoring using ${listServices(svcs)}. Create log groups, configure a service to send logs, and use log insights to search and filter log data. Create a simple metric filter to track specific log patterns and verify it captures the correct events. Clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a log analytics system using ${listServices(svcs)}. Configure centralized logging from multiple sources, create metric filters for error patterns, set up alarms based on log metrics, and implement log retention policies. Use Logs Insights to query across log groups, build dashboard widgets from queries, and validate alerting works correctly. Clean up.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a scalable log analytics platform using ${listServices(svcs)}. Implement structured logging standards, configure cross-account log aggregation, create advanced Logs Insights queries for correlation analysis, and build automated anomaly detection from log patterns. Set up log-based alerting, test log volume scaling, validate retention compliance, and clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise log intelligence using ${listServices(svcs)}. Design centralized log architecture with multiple accounts, implement log enrichment pipelines, configure advanced pattern detection and correlation, and build operational intelligence dashboards. Test log processing at scale, validate compliance retention requirements, implement automated incident correlation, and document log taxonomy standards. Clean up.`);
                        }
                    }
                }
            ],
            'data-processing': [
                {
                    title: 'Data Storage Solution',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Create a data storage solution using ${listServices(svcs)}. Set up a storage resource, configure basic access permissions, upload sample data, and verify you can retrieve it. Understand storage options, access patterns, and basic security through this hands-on exercise. Clean up all resources after testing.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a data management system using ${listServices(svcs)}. Configure storage with versioning and lifecycle policies, set up access controls with bucket policies or resource policies, implement event notifications on data changes, and add encryption. Test data operations, verify lifecycle transitions, validate access restrictions, and monitor storage metrics. Clean up.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a scalable data platform using ${listServices(svcs)}. Implement tiered storage with automated lifecycle management, configure cross-region replication, set up event-driven processing on data arrival, and build comprehensive access auditing. Test replication lag, validate consistency models, monitor cost optimization, and verify disaster recovery capabilities. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise data management using ${listServices(svcs)}. Design multi-tier data architecture with automated classification, implement data governance policies with access logging, configure intelligent tiering for cost optimization, and build data quality validation pipelines. Test data durability guarantees, validate regulatory compliance controls, implement data cataloging, and document retention policies. Clean up.`);
                        }
                    }
                },
                {
                    title: 'Data Pipeline',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Build a simple data pipeline using ${listServices(svcs)}. Set up a data source, create processing logic that transforms the data, and store the results. Test the pipeline with sample data and verify the output matches expectations. Use the AWS Console for all steps. Clean up resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Create a data processing pipeline using ${listServices(svcs)}. Configure automated triggers for incoming data, implement transformation logic with error handling, set up output storage with proper formatting, and add monitoring. Test with valid and invalid data, verify error handling captures failures, validate output data quality, and clean up all resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a production data pipeline using ${listServices(svcs)}. Implement multi-stage processing with parallel execution, configure retry logic and dead-letter handling, set up data validation between stages, and build comprehensive monitoring. Test pipeline throughput, validate data integrity end-to-end, measure processing latency, and implement backpressure mechanisms. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise data pipelines using ${listServices(svcs)}. Design event-driven ETL with exactly-once processing guarantees, implement schema validation and evolution, configure adaptive scaling based on data volume, and build data lineage tracking. Test failure recovery mid-pipeline, validate data consistency across stages, implement quality gates, and document SLA compliance. Clean up.`);
                        }
                    }
                }
            ],
            'high-availability': [
                {
                    title: 'High Availability Architecture',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Learn high availability basics using ${listServices(svcs)}. Deploy resources across multiple availability zones, configure health checks, and understand how AWS provides redundancy. Test by verifying resources are accessible and understand what happens during a failure scenario. Clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a highly available system using ${listServices(svcs)}. Deploy across multiple AZs, configure load balancing with health checks, set up auto-recovery mechanisms, and implement basic failover. Test by simulating a component failure, verify traffic reroutes correctly, validate recovery time, and monitor availability metrics. Clean up all resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a resilient multi-AZ architecture using ${listServices(svcs)}. Implement active-active deployment, configure automated scaling with predictive policies, set up database failover with minimal downtime, and build self-healing infrastructure. Test zone failure scenarios, measure RTO and RPO, validate data consistency during failover, and clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise-grade availability using ${listServices(svcs)}. Design for 99.99% uptime with multi-AZ active-active deployment, implement chaos engineering practices, configure automated failover with zero data loss, and build comprehensive health monitoring. Test cascading failure scenarios, validate split-brain prevention, implement capacity planning models, and document DR runbooks. Clean up.`);
                        }
                    }
                },
                {
                    title: 'Fault Tolerant System',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Explore fault tolerance using ${listServices(svcs)}. Set up a basic system with redundancy, configure automatic health checking, and understand how AWS handles failures. Observe how the system recovers from simulated issues and verify continuity of service. Clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Implement fault tolerance using ${listServices(svcs)}. Configure redundant components across AZs, set up automated health checks with failover, implement circuit breaker patterns, and add monitoring for failure detection. Test component failures, verify automatic recovery, measure downtime during failover, and validate data integrity. Clean up.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a fault-tolerant architecture using ${listServices(svcs)}. Implement redundancy at every tier, configure automated failover with minimal data loss, set up comprehensive health monitoring, and build self-healing capabilities. Test simultaneous multi-component failures, validate recovery automation, measure impact radius, and verify graceful degradation. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise fault tolerance using ${listServices(svcs)}. Design bulkhead patterns to isolate failure domains, implement progressive rollouts with automated rollback, configure multi-layer health checking, and build game-day testing procedures. Test correlated failures, validate blast radius containment, implement adaptive load shedding, and document incident response procedures. Clean up.`);
                        }
                    }
                }
            ],
            'api-architecture': [
                {
                    title: 'API Backend',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Build a simple API backend using ${listServices(svcs)}. Create an API endpoint that handles requests, connect it to a backend service or data store, and test with sample requests. Verify the API returns correct responses for valid inputs. Use the AWS Console for all configuration. Clean up resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build an API backend using ${listServices(svcs)}. Design RESTful endpoints with proper HTTP methods, implement request validation, configure authorization, and connect to a data layer. Add error handling with appropriate status codes, enable CORS, set up usage plans, test all endpoints, and verify security controls. Clean up.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a production API platform using ${listServices(svcs)}. Implement versioned APIs with backward compatibility, configure custom domain with TLS, add request/response transformation, and set up caching with invalidation. Build rate limiting per client, implement comprehensive logging, test performance under load, and validate security headers. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise API management using ${listServices(svcs)}. Design API gateway patterns with request routing, implement API versioning strategy with deprecation policy, configure multi-tenant throttling, and build contract testing. Set up API analytics, implement consumer-driven contracts, test backward compatibility, and document API governance standards. Clean up.`);
                        }
                    }
                },
                {
                    title: 'GraphQL API',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Create a basic GraphQL API using ${listServices(svcs)}. Define a simple schema with types and queries, configure a data source, create resolvers to fetch data, and test queries using the built-in console. Verify that queries return expected data. Clean up all resources after testing.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a GraphQL API using ${listServices(svcs)}. Design a schema with queries, mutations, and relationships between types. Configure multiple data sources, implement resolvers with mapping templates, add authorization rules, and enable caching. Test complex queries, verify mutations persist data, validate authorization, and clean up.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a production GraphQL platform using ${listServices(svcs)}. Implement schema with subscriptions for real-time updates, configure pipeline resolvers for complex operations, add field-level authorization, and set up conflict detection. Monitor resolver performance, test subscription delivery, validate N+1 query prevention, and implement query complexity limits. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise GraphQL using ${listServices(svcs)}. Design federated schema architecture, implement custom authorization with multiple strategies, configure resolver caching with selective invalidation, and build real-time subscriptions with connection management. Test schema evolution, validate performance at scale, implement query depth limiting, and document schema governance. Clean up.`);
                        }
                    }
                }
            ],
            'automation-orchestration': [
                {
                    title: 'Workflow Orchestration',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Create a simple automated workflow using ${listServices(svcs)}. Design a basic sequence of steps that processes data or performs actions in order. Configure each step, connect them together, run the workflow with test data, and verify each step completed successfully. Clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a workflow orchestration using ${listServices(svcs)}. Design a multi-step workflow with conditional branching, implement error handling with retry logic, configure timeouts for each step, and add parallel processing where appropriate. Test happy path and error scenarios, verify retry behavior, validate state transitions, and clean up.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a production workflow system using ${listServices(svcs)}. Implement complex orchestration with parallel execution, conditional logic, error handling with catch/retry patterns, and callback patterns for human approval. Monitor execution metrics, test timeout scenarios, validate compensation logic, and implement workflow versioning. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise orchestration using ${listServices(svcs)}. Design distributed saga patterns with compensating transactions, implement nested workflows with dynamic parallelism, configure long-running workflows with heartbeat monitoring, and build deployment orchestration. Test failure at each stage, validate compensation execution, implement idempotency guarantees, and document operational patterns. Clean up.`);
                        }
                    }
                },
                {
                    title: 'Scheduled Automation',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Set up scheduled automation using ${listServices(svcs)}. Create a scheduled rule that runs on a regular interval, configure a target to execute when triggered, and test the automation works as expected. Verify the execution logs show successful runs. Clean up all resources after testing.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build scheduled automation using ${listServices(svcs)}. Configure cron-based scheduling, implement the automation logic with error handling, set up notifications for failures, and add logging for audit trails. Test schedule triggers, verify retry behavior on failure, validate notification delivery, and monitor execution history. Clean up.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a production automation platform using ${listServices(svcs)}. Implement scheduled tasks with concurrency controls, configure dead-letter handling for failed executions, add dependency tracking between tasks, and build comprehensive monitoring. Test execution under failure conditions, validate idempotency, implement maintenance windows, and verify alerting works. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise automation using ${listServices(svcs)}. Design job scheduling with priority queues and dependency graphs, implement distributed locking for coordination, configure adaptive scheduling based on system load, and build self-healing automation. Test race conditions, validate exactly-once execution, implement capacity-aware scheduling, and document operational runbooks. Clean up.`);
                        }
                    }
                }
            ],
            'cost-performance': [
                {
                    title: 'Performance Optimization',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Explore performance configuration using ${listServices(svcs)}. Set up a resource with different configuration options, compare performance characteristics, and understand how settings affect behavior. Monitor basic metrics to observe the impact of your configuration choices. Clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Optimize performance using ${listServices(svcs)}. Configure resources for a specific workload pattern, implement caching where appropriate, tune capacity settings, and set up performance monitoring. Run baseline tests, make optimizations, measure improvements with metrics, compare before and after, and clean up resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design for optimal performance using ${listServices(svcs)}. Implement right-sizing based on workload analysis, configure auto-scaling with target tracking, add caching layers with TTL strategies, and build performance testing automation. Measure latency percentiles, optimize cold start times, validate scaling responsiveness, and clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect performance engineering using ${listServices(svcs)}. Design capacity models based on workload forecasting, implement adaptive configuration with performance feedback loops, configure multi-dimensional auto-scaling, and build continuous performance testing. Analyze cost-performance tradeoffs, validate SLA compliance under load, implement performance budgets, and document optimization decisions. Clean up.`);
                        }
                    }
                },
                {
                    title: 'Cost-Efficient Architecture',
                    generate: (svcs, lvl, cfg) => {
                        if (lvl === 'Beginner') {
                            return buildPrompt(svcs, `Learn cost-aware configuration using ${listServices(svcs)}. Set up resources using cost-effective options, understand pricing models, configure basic resource tagging for cost tracking, and identify opportunities to reduce costs. Review cost explorer to understand charges. Clean up all resources.`);
                        } else if (lvl === 'Intermediate') {
                            return buildPrompt(svcs, `Build a cost-efficient solution using ${listServices(svcs)}. Choose appropriate service tiers for the workload, implement auto-scaling to match demand, configure lifecycle policies to manage storage costs, and set up billing alarms. Compare cost of different configurations, validate scaling reduces idle spend, and clean up all resources.`);
                        } else if (lvl === 'Advanced') {
                            return buildPrompt(svcs, `Design a cost-optimized architecture using ${listServices(svcs)}. Implement right-sizing with utilization analysis, configure spot/on-demand mixing strategies, set up automated resource scheduling, and build cost allocation with detailed tagging. Monitor cost anomalies, validate savings from optimizations, implement cleanup automation, and document cost-efficiency decisions. Clean up.`);
                        } else {
                            return buildPrompt(svcs, `Architect enterprise cost governance using ${listServices(svcs)}. Design FinOps practices with showback/chargeback models, implement automated right-sizing recommendations, configure proactive cost controls with budget actions, and build unit economics tracking. Test cost forecasting accuracy, validate budget enforcement, implement waste detection automation, and document cost optimization framework. Clean up.`);
                        }
                    }
                }
            ]
        };

        return templates[scenario] || templates['serverless'];
    }

    function buildPrompt(services, baseText) {
        return baseText;
    }

    function listServices(services) {
        if (services.length === 1) return services[0];
        if (services.length === 2) return `${services[0]} and ${services[1]}`;
        return services.slice(0, -1).join(', ') + ', and ' + services[services.length - 1];
    }

    function enforceCharLimit(text, limit) {
        if (text.length <= limit) return text;

        // Trim to limit while preserving sentence structure
        let trimmed = text.substring(0, limit);
        const lastPeriod = trimmed.lastIndexOf('.');
        if (lastPeriod > limit * 0.7) {
            trimmed = trimmed.substring(0, lastPeriod + 1);
        } else {
            // Remove the last partial word
            const lastSpace = trimmed.lastIndexOf(' ');
            trimmed = trimmed.substring(0, lastSpace) + '.';
        }

        return trimmed;
    }

    // Public API
    return {
        generateProjects
    };
})();
