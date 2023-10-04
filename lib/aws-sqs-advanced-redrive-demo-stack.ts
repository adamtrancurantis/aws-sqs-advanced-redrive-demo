import * as cdk from "aws-cdk-lib";
import { Queue, QueueEncryption } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class AwsSqsAdvancedRedriveDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    for (const queueNumber of [1, 2, 3]) {
      const dlq = new Queue(
        this,
        `AwsSqsAdvancedRedrive${queueNumber}DemoDLQ`,
        {
          queueName: `advanced-redrive-demo-${queueNumber}-dlq`,
          encryption: QueueEncryption.UNENCRYPTED,
        },
      );

      new Queue(this, `AwsSqsAdvancedRedriveDemo${queueNumber}Queue`, {
        queueName: `advanced-redrive-demo-${queueNumber}-queue`,
        encryption: QueueEncryption.UNENCRYPTED,
        deadLetterQueue: {
          maxReceiveCount: 3,
          queue: dlq,
        },
      });
    }
  }
}
