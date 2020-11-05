# Talkspace SRE Take Home Practicum

## Components
This simple project is a Node.js (node image from Docker Hub) docker container, it contains a self-signed certificate and a few Express scripts to accomplish the target.

## Test
1. Please clone this public repo: https://github.com/danielmayor/ts-api-microservice/
2. Run docker-compose up
3. Then you can perform a test with this script: https://gist.github.com/jackm-ts/700af2b1c50bf0ed10f4c77e825af428

## Notes
I generated the self-signed certificate manually and copied it to the repo. This is not the best plan (GitHub complained about it) but it was the fastest way to accomplish it. I've seen that some people generate the certs on the go but I wasn't able to implement it. 

I've not completed these topics, sorry! (but the python script works fine):
- The service should preserve state if the container crashes: I saw these topics too late, I tried to keep the data in a file but I had some trouble dealing with the json object and didn't want to overpass the 72 hours threshold. I think that a better way to accomplish this requirement would be using a NoSQL database like MongoDB or even DynamoDB.
- Capture the logs and have them rotate: I didn't have time to work with this, but I would have copied the content into a log file and then setup a cron job to rotate it.

I would like to kindly suggest that the technical requirements could be better defined, because the python test script expects some features that are not defined. I managed it and performed some modifications in order to pass the script. For example, it expects an endpoint called all-messages and the POST operation requires a 201 status to be returned.

## Extra Questions
1. How would your implementation scale if this were a high throughput service, and how could you improve that?
I would change the implementation, first a frontend-proxy, maybe a load balancer, and several backend Node.js nodes, then a NoSQL database to store the keys.

2. How would you deploy this to the cloud, using the provider of your choosing? What cloud services/tools would you use?
I've working with AWS and I'm pretty comfortable with it. I'd use ECS, ELB and DynamoDB if Docker is required. If not, I'd try to implement it in Lambda.

3. How would you monitor this service? What metrics would you collect? How would you act on these metrics?
I'd check the cpu load, disk and memory, database i/o throughput, and the state of the service. I'd setup reasonable temporary thresholds, and would check them regularly in order to make them more accurate. These metrics would trigger alarms to my email or phone.

4. What are some security concerns/improvements you could make to this system if we were to assume the message text was sensitive.
The main security risk I noticed is the requirement to store the keys in plain text.

