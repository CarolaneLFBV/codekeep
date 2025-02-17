# Software Architectures

*Last Updated: Dec 7, 2024*

Software architecture is the high-level structure of a software system, providing a blueprint that guides its design and development. It encompasses the system's major components, their relationships, and interactions, along with the principles and guidelines governing them. The role of software architecture is crucial because it shapes the foundation of the system, ensuring it meets both functional and non-functional requirements, such as performance, scalability, security, and maintainability.

Software architecture can follow different patterns, depending on the system's requirements and constraints.

:::warning
I am only listing the ones that I've been dealing with or interact with a couple of times :)
:::

## TL;DR
| Architecture | Primary Focus | Communication Style | Deployment | Best Use Case |
| --- | --- | --- | --- | --- |
| **Monolithic** | Single cohesive application | Direct function calls | Single unit | Small/simple apps, startups |
| **SOA** | Broad, coarse-grained services | ESB (SOAP/XML) | Centralized | Large enterprises, legacy integration |
| **Microservices** | Small, fine-grained services | REST/gRPC or message brokers | Independent | Cloud-native, scalable systems |

Now, if you are ready to dive in, let's do it!

## 1. Monolithic Architecture (MA)
The Monolithic Architecture is the traditional architecture type, and is used in most application. The architecture is based on `building the entire application as a single, unified codebase`. All components (UI, business logic, etc.) are integrated and deployed as one unit.

### Key Concepts
- **Single Deployable Unit**: Functionalities are bundled into a single executable or package.
- **Interdependence of Components**: Different parts of the app are interdependent since they all communicate in one single codebase.
- **Centralized Data**: Since it’s a single codebase, one single database is needed to handle all data needs for the app.

### Benefits
- **Simplicity:** Easier to develop, test, and deploy.
- **Performance:** Since components run within the same process, it makes the internal communication between components faster.
- **Consistency:** Unified set of technologies, frameworks, and libraries makes easier to understand and maintain the codebase.

### Drawbacks
- **Scalability Limits**: Scaling a Monolithic Architecture means replicating the entire system, even if only one part needs more resources.
- **Slow Development Cycles**: Changing one part of the system requires re-deployment of the entire app, which can slow down development.
- **Tight Coupling**: Dependencies between components make it harder to adopt new technologies or modify specific parts of the app without risking the whole system.

### Use Cases
- **Startups** or **small projects** with limited complexity.

## 2. Service-Oriented Architecture (SOA)
The Service-Oriented Architecture use a pattern where `different services perform distinct business functions` and communicate through a central `Enterprise Service Bus (ESB)`.

### Key Concepts

- **Coarse-Grained Services:** Each service is relatively large and serves a broad business function (e.g. Customer Management).
- **Enterprise Service Bus (ESB):** It’s a middleware that manages communication, data transformation, and protocol meditation between services.
- **Standardized Protocols:** Services often communicate using protocols like SOAP and WSDL, which provide strong typing, standardization, and compatibility with legacy systems.

### Benefits
- **Reusability and Interoperability:** Services are designed for reusability across various applications, thus it makes it easier to integrate different systems, even with legacy technology.
- **Centralized Governance:** The ESB ensures consistent security, logging, and monitoring across all services.
- **Flexibility**: By separating functions into different services, SOA allows for a degree of modularity and the ability to modify individual services independently.

### Drawbacks
- **Complex Infrastructure**: The ESB adds complexity to the architecture, and can lead to performance bottlenecks.
- **Scalability Limitations**: The ESB can become a single point of failure and a bottleneck, limiting scalability and resilience of the system.
- **Slower Development**: Protocols like SOAP and XML, and governance often make development slower.

### Use Cases
- Organizations with **multiple business domains** and **legacy systems**.

## 3. Microservices Architecture
The Microservices Architecture is build on the principles of SOA but instead of having different services performing distinct business functions, each service here is `independently deployable and handle specific, single functions`. Each microservice can be developed, deployed, and scaled independently.

### Key Concepts

- **Fine-Grained Services**: Each service is small and focused on a single task (e.g. User Auth)
- **Independent Deployability**: Each microservice can be deployable separately → rapid updates and scaling.
- **Polyglot Persistence and Development**: Different services can use different languages, databases, etc. based on what best fits the task, without any concern impacting another service.

### Benefits
- **Scalability**: Each service can be scaled independently, which can optimized resource usage.
- **Fault Isolation**: If one service fails, it doesn’t impact the rest of the system.
- **Faster Development Cycles**: Since they are all independent, it facilitates continuous delivery and rapid iteration.

### Drawbacks
- **Operational Complexity**: Managing multiple independent services increases operational overhead, requiring DevOps practices and infrastructure.
- **Data Consistency Challenges**: Ensuring data consistency across services with separate databases can be challenging.
- **Increased Debugging Complexity**: Same as Data Consistency, tracking issues across multiple services can be difficult.

### Use Cases
- **Large, scalable applications** such as E-commerce platforms, social media apps, etc.
- Well-suited for **cloud-native applications** where each service can be independently scaled and managed.
