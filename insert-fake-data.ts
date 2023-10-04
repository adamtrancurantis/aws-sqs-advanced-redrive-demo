import {
  GetQueueUrlCommand,
  SQSClient,
  SendMessageBatchCommand,
} from "@aws-sdk/client-sqs";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const client = new SQSClient({});
const region = "us-west-2";

type MessageTypes = "SHOULD_MODIFY" | "SHOULD_SKIP" | "SHOULD_DELETE";

interface FakeMessage {
  messageType: MessageTypes;
  email: string;
  description: string;
}

function createFakeMessage(): FakeMessage {
  return {
    messageType: faker.helpers.arrayElement<MessageTypes>([
      "SHOULD_MODIFY",
      "SHOULD_SKIP",
      "SHOULD_DELETE",
    ]),
    email: faker.internet.email(),
    description: faker.lorem.sentence(),
  };
}

async function script() {
  for (const queueNumber of [1, 2, 3]) {
    const queueName = `advanced-redrive-demo-${queueNumber}-dlq`;
    const queueUrl = (
      await client.send(
        new GetQueueUrlCommand({
          QueueName: queueName,
        }),
      )
    ).QueueUrl;
    for (const _ of Array.from(Array(10).keys())) {
      await client.send(
        new SendMessageBatchCommand({
          QueueUrl: queueUrl,
          Entries: Array.from(Array(10).keys()).map((_) => {
            return {
              Id: uuidv4(),
              MessageBody: JSON.stringify(createFakeMessage()),
            };
          }),
        }),
      );
      console.log(`Inserted 10 fake records into ${queueName}.`);
    }
  }
}

script();
