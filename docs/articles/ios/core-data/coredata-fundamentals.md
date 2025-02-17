# Managing Data with Core Data: Fundamentals

*Last Updated: Dec 13, 2024*

:::info
Resources:
* Wikipedia - Core Data: https://en.wikipedia.org/wiki/Core_Data
* Apple's documentation - Core Data: https://developer.apple.com/documentation/coredata/
* Wikipedia - Object Graph: https://en.wikipedia.org/wiki/Object_graph
:::

In our previous article, we explored why Core Data remains a powerful tool for managing data in iOS apps. Before we dive in, I think it's important to understand the building blocks of Core Data. In this we'll demystify Core Data, and prepare you to set up Core Data in your own project.

## What is Core Data?
`Core Data` is an object graph and Apple's framework for managing and persisting data in iOS and macOS applications. Introduced in `iOS 3.0`, it simplifies storing data using relational entity-attribute model, while handling the complexity of SQL behind the scenes.

Core Data lets you:
- Model your app's data as objects (entities and attributes) while managing their relationships.
- Persist and query data in formats like `SQLite`, `XML`, or `binary` with minimal setup.
- Abstract database management, allowing you to work with data in an object-oriented way without needing to write SQL.

Unlike working directly with your databases, Core Data provides a higher-level, object-oriented API, allowing you to focus on your app's logic without worrying about SQL.

**Why is it important?** Whether you're saving user preferences or managing complex datasets, Core Data is a reliable way to keep your data organized, efficient, and ready to scale.

## The Core Data Stack: Key Components
Core Data relies on a stack of components that work together to handle data persistence and object graph management. Understanding these components is essential to effectively use Core Data in your apps. Let's break them down step by step.

### Persistent Container
The `NSPersistentContainer` is the backbone of Core Data. It simplifies the setup of the Core Data stack, handling everything from initializing the data model to managing the connection to the database. With the `NSPersistentContainer`, you don’t need to manually configure the `NSManagedObjectModel`, `NSPersistentStoreCoordinator`, or persistent stores—they’re all handled for you.

*Example:*
```swift
struct PersistenceController {
    // A shared instance of the PersistenceController
    static let shared = PersistenceController()

	// The Core Data container that sets up the stack
    let container: NSPersistentContainer
    
    // Initializes the container and loads the peristent store
    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "MyAppModel")

        // Use an in-memory store, typically for testing
        if inMemory {
            container.persistentStoreDescriptions.first!.url = URL(fileURLWithPath: "/dev/null")
        }
        container.loadPersistentStores(completionHandler: { (description, error) in
            if let error = error {
                fatalError("Failed to load Core Data stack: \(error)")
            }
        })
    }
    
    // Access the main view context
    var viewContext: NSManagedObjectContext {
        return container.viewContext
    }
}
```
Let's break it down:
1. **Singleton Instance**
The `static let shared` property allows you to access the `DataController` from anywhere in your app, ensuring that only one instance exists.
2. **Persistent Controller**
The `container` initializes the Core Data stack. The `name` parameter refers to the **name of your Core Datas model file** (`MyAppModel.xcdatamodeld`). Always validate that your Core Data model file name matches the one provided to the `NSPersistentContainer`. A mismatch will cause the app to crash during initialization.
3. **In-Memory Option**
If `inMemory` is set up to true, the persistent store is configured to use memory instead of disk. This is helpful for testing or temporary data storage.
4. **Loading Persistent Stores**
The `loadPersistentStores` method connects the Core Data stack to the database. If an error occurs, the app stops running with `fatalError`.
5. **Accessing the Context**
The `viewContext` property provides a convenient way to access the main context for creating, reading, and data.

#### **How `NSPersistentContainer` Fits Into the Core Data Workflow**
Let’s map this code to Core Data’s workflow:
1. **Load the Data Model:** You use the context to create new objects based on your Core Data model.
2. **Connect to the Persistent Store:** The container loads the persistent store (e.g., SQLite database) where your app’s data is stored.
3. **Provide Access to the Context:** Once initialized, the container gives you access to the `viewContext`, the main workspace for interacting with data.

### Managed Object Context
The `NSManagedObjectContext` is the workspace for all data-related operations in Core Data. It's where you create, fetch, update, and delete objects. Think of it as a draft workspace: changes made in the context aren't saved to the database until you explicitly save them.

*Example:*
```swift
extension App.Repository {
    struct Crud {
        private let moc: NSManagedObjectContext

        // 1 - Initializes the class with a Managed Object Context
        init(context: NSManagedObjectContext = DataController.shared.viewContext) {
            self.moc = context
        }
        
        // 2 - Enum to represent possible CRUD operation errors
        enum Failed: Error {
            case fetch(reason: String)
        }
        
        // 3 - Fetches User objects based on the given predicate and sort descriptors
        func fetch(
            predicate: NSPredicate? = nil,
            sortDescriptors: [NSSortDescriptor] = []
        ) throws -> [User] {
            let request: NSFetchRequest<User> = User.fetchRequest()
            request.predicate = predicate
            request.sortDescriptors = sortDescriptors
            
            do {
                return try moc.fetch(request)
            } catch {
                throw Failed.fetch(reason: error.localizedDescription)
            }
        }
    }
}
```

Let's break it down:
1. **Initializing the Context**
* The `Crud` struct is initialized with a `NSManagedObjectContext`. By default, it uses the shared `viewContext` provided by `DataController`. This context is thread-bound (main thread) and that creating background contexts can improve performance for non-UI tasks.
* The context acts as the bridge between your app and the Core Data stack, enabling you to work with Core Data objects.
2. **Enum for Error Handling**
* The `Failed` enum defines possible errors for the CRUD operations. Each case can include additional information, such as the reason for the error.
* It provides a clear way to handle and communicate errors during Core Data operations, which is crucial for debugging and user feedback.
3. **Fetching Data**
* A `NSFetchREquest` is created to retrieve an `Object` such as `User` from Core Data.
* If provided, the `predicate` filters the results (e.g. fetch users whose name contains "Steve").
* If provided, `sortDescriptors` define how the results should be ordered (e.g. by name)
* The `fetch` method of the context is called to execute the query.
* If the fetch fails, an error is thrown with the reason.

::: tip
When working with large datasets, use `fetchLimit` to reduce memory usage and improve performance: `request.fetchLimit = 50`, for example.
:::

#### **How `NSManagedObjectContext` Fits Into the Core Data Workflow**
Let’s map this code to Core Data’s workflow:
1. **Create a Fetch Request:** A fetch request defines the query—what data you want to retrieve and any filters or sorting.
2. **Execute the Fetch Request:** The `NSManagedObjectContext` executes the fetch, interacting with the persistent store to retrieve the requested objects.
3. **Work with Fetched Objects:** The objects returned by the context are fully managed by Core Data, meaning changes to them are tracked.
4. **Handle Errors:** Errors can occur if the query is invalid or if the persistent store is unavailable.

### Entities and Attributes
In Core Data, **Entities** and **Attributes** form the blueprint of your app's data. They define the structure and relationships of the objects you will store and manage.

`Entities` represent data models or objects in your app (e.g. `User` ). Think of entities as tables in relational database. Each entity describes the kind of data your app will store.

Meanwhile, `attributes` represent the properties of an entity, like the columns of a database table. Each attribute has a type such as `String` , `Int` , and so on. They can also have constraints (e.g. a required value, default value, maximum length…).

#### **How `Entities` and `Attributes` Fits Into the Core Data Workflow**
1. **Define Data Structure:** Each entity specifies what kind of data your app will store, whereas attributes describe the properties of that data.
2. **Dynamic Object Representation:** Core Data automatically generates `NSManagedObject` subclasses for your entities, which you can use in your code to represent individual records. For example, if you define a `Task` entity, Core Data generates a `Task` class with properties you assigned, for example `title`, `isCompleted`, and `dueDate`.
3. **Query and Manipulate Data:** Attributes can be used to filter and sort objects when fetching data from Core Data. For example: Fetch tasks where `isCompleted` is `false` or sort tasks by `dueDate`.

#### **What are relationships in Core Data?**
Entities in Core Data can have relationships with one another, just like tables in a relational database. Relationships allow you to model complex data structures by linking entities together.

Core Data offers different kind of relationships:
- `One-to-One`: A single object of one entity is linked to a single object of another entity (e.g. A `User` has a `Profile`).
- `One-to-Many`: A single object of one entity is linked to multiple objects of another entity (e.g. A `Category` contains different `Tasks`).
- `Many-to-Many`: Multiple objects of one entity are linked to multiple objects of another entity y (e.g. A `User` can belong to many `Groups`, and each `Group` can have many `Users`).

#### **How Relationships Work**
1. **Navigation:** Relationships create connections between objects, allowing you to navigate from one entity to another. For example: From a `Task`, you can access its related `Category` object, and vice versa.
2. **Inverse Relationships:** Core Data automatically maintains consistency between related entities. For example: If a `Task` is linked to a `Category`, the `Category` will also have a reference back to the `Task`.
3. **Cascading Changes:** Relationships can be configured to cascade changes. For example, deleting a `Category` might also delete all its associated `Tasks`.

#### **Why Entities, Attributes, and Relationships Matter**
1. **Organized Data Storage:**
    Entities and attributes let you define structured data that’s easy to manage and query.
    
2. **Flexible Data Models:**
    Relationships allow you to model complex real-world scenarios, such as tasks belonging to categories or users belonging to multiple groups.
    
3. **Efficient Queries:**
    Core Data lets you query data across relationships, like fetching all tasks for a specific category or all users in a group.
    
## **Conclusion**
Core Data is a powerful tool for managing and persisting data in iOS apps. By understanding key components like the `Persistent Container`, `Managed Object Context`, `Entities`, and `Relationships`, you’re now equipped with the foundational knowledge to build robust data models.

In the next article, we’ll put this knowledge into action by setting up a Core Data model and defining entities, attributes, and relationships.