# Managing Data with Core Data: CRUD Operations

*Last Updated: Dec 19, 2024*

:::info
Resources:
* Apple's documentation - Core Data: https://developer.apple.com/documentation/coredata/
* CoreDataExample on GitHub: https://github.com/CarolaneLFBV/Tutorials
:::

In the previous article, we implemented the Core Data stack and created our first`Todo` entity with its `id`, `title`, and `isDone` attributes. Now, let's bring Core Data to life by managing data dynamically in our app. In this article, we will explore the four core operations of working with data: `Create, Read, Update and Delete`—commonly referred to as CRUD.

Using Core Data in SwiftUI, you will learn how to add new tasks, fetch and display them, toggle their completion status, and delete them when no longer needed. Ready? Let's dive in!

## Setting Up the Environment

:::info

In this article, we will follow the **MVVM design pattern** for implementing CRUD operations. The operations will be encapsulated in a **Repository**, which will handle all communication with Core Data. The **ViewModel** will act as a mediator between the **Repository** and the SwiftUI **View**, ensuring clean and modular code.

If you're unfamiliar with MVVM, I recommend checking out my `Design Pattern - Structural Patterns` article, specifically the **Model-View-ViewModel (MVVM)** section.
:::

Before we begin, make sure you have followed the previous article and that your Core Data stack is set up.

When you are done, let's start by implementing our `PersistentController` into our app. You need to go to your App file, and add your persistentController into your first view that is going to be loaded when the app is launched:

```swift
import SwiftUI

@main
struct CoreDataExampleApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.viewContext)
        }
    }
}
```

The `.environment(\.managedObjectContext)` modifier injects the Core Data `viewContext` into the SwiftUI environment. This allows all child views to access the context using `@Environment(\.managedObjectContext)`, simplifying data flow and making Core Data operations seamless across your app. By adding it in the `App` file, you ensure the context is available globally, eliminating the need to pass it manually between views.

:::warning

Little disclaimer before we continue, I use the terms `reading` and `fetching` interchangeably. Both refer to the same CRUD operation: `Read`.

:::

Now, let's create our **Repository** to communicate with Core Data. This repository will act as the middleman between Core Data and other parts of the app, such as a ViewModel for example, ensuring cleaner and more modular code. Create a new file, name it `Repository`, and add the following:

```swift
struct Crud {
    private let viewContext = PersistenceController.shared.viewContext
    
    enum Failed: Error {
        case create(reason: String), delete(reason: String), update(reason: String)
    }
    
    // more to come
}

```

:::tip

The `Failed` enum allows us to handle errors in a clear and structured way. Instead of returning generic errors, we can specify the exact type of operation that failed (e.g., `create`, `delete`, `update`). This makes debugging easier and improves code readability.

:::

Here, we're calling the **singleton** `PersistentController` we implemented in the previous article. This gives us access to the `viewContext`, which is the main workspace for interacting with Core Data. 

Next, we’ll implement the `create`, `delete`, and `update` methods in this repository to dynamically interact with the `Todo` entity.

## Creating Data

In order to add new data into Core Data, we need our `create` method. This method allows us to add a new `Todo` item to the Core Data persistent store.

```swift
struct Crud {
    private let viewContext = PersistenceController.shared.viewContext
    
    enum Failed: Error {
        case create(reason: String), delete(reason: String), update(reason: String)
    }
    
    // New Creating Method
	func create(title: String) throws {
	    let newTodo = Todo(context: viewContext)
		newTodo.id = UUID()
		newTodo.title = title
		newTodo.isDone = false
		        
		do {
			try viewContext.save()
		} catch {
		    throw Failed.create(reason: error.localizedDescription)
		}
	}
}

```
- A new `Todo` object is initialized using the Core Data `viewContext`. The `viewContext` ensures that the new object is managed by Core Data.
- We then set default values:
    - `id` is a unique `UUID` that is assigned to identify each task.
    - The method accepts a `title` parameter, which is passed when creating a task.
    - `isDone` defaults to `false` since tasks are incomplete when created.
- After the new object is added to the `viewContext`, the `save()` method persists the changes to Core Data. If an error occurs, the custom `Failed.create`error is thrown with a description of the issue.

### How to Use the Create Method
Next, we'll use this method in our `ViewModel`, which acts as the intermediate layer between the repository and the view. Here's how it looks:

```swift
import SwiftUI

@Observable
class TodoViewModel {
    private let repository: Crud
    var todos: [Todo] = []

    init(repository: Crud = Crud()) {
        self.repository = repository
    }
    
    func addTodo(title: String) {
        do {
            try repository.create(title: title)
        } catch {
            print("Error adding Todo: \(error)")
        }
    }
}
```

By injecting the `Crud` repository into the `TodoViewModel`, we make the ViewModel more flexible and testable. For example. during testing, you could provide it a mock repository, so it is easier and more manageable.

The `repository.create` method is called with the `title` passed by the view.

:::tip
Little reminder that in production, consider showing an error message to the user if creating a `Todo` fails. This improves the user experience and makes your app more robust.
:::

### Connecting the View
To allow users to add new `Todo` items through the UI, we create an `AddTodoView` that interacts with the `TodoViewModel`. Here’s the code:

```swift
import SwiftUI

struct AddTodoView: View {
    @State var viewModel: TodoViewModel
    @State private var newTodoTitle: String = ""

    var body: some View {
        HStack {
            TextField("New Todo", text: $newTodoTitle)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            Button(action: addTodo) {
                Label("Add", systemImage: "plus")
            }
        }
        .padding()
    }
    
    private func addTodo() {
        guard !newTodoTitle.isEmpty else { return }
        withAnimation {
            viewModel.addTodo(title: newTodoTitle)
            newTodoTitle = ""
        }
    }
}

```
The `TextField` is bound the `newTodoTitle` state variable, which tracks the user's input. Then, the button triggers the `addTodo` private method when pressed.
The `addTodo` method ensures first of all that it isn't empty before proceeding. Then, it passes the `newTodoTitle` to the `addTodo` method in the `TodoViewModel`, which then calls the repository's `create` method.
The `withAnimation` block allows you to add a smooth transitions in the UI when the list of Todos updates.

When the new item has been successfully added, the function clears the `TextField`.

Now, let's implement our view into our `ContentView`:

```swift
import SwiftUI

struct ContentView: View {
    @State private var viewModel = TodoViewModel()

    var body: some View {
        NavigationView {
            VStack {
                // more to come
                AddTodoView(viewModel: viewModel)
            }
        }
    }
}

```

We are initializing our ViewModel in the parent view, and then passes it to our child view so we can dynamically use the same data everywhere.

## Reading Data
To read data from Core Data, we use the `@FetchRequest` property wrapper provided by SwiftUI. It’s a powerful tool that fetches data directly from the Core Data store and keeps the UI in sync with any changes.

```swift
@FetchRequest(
	entity: Todo.entity(),
	sortDescriptors: [NSSortDescriptor(keyPath: \Todo.title, ascending: true)]
) private var todos: FetchedResults<Todo>
```

- We first specifies the Core Data entity (`Todo`) that we want to fetch. This links the `FetchRequest` to the `Todo` model we created before.
- Then, we use the `sortDescriptors` to fetch results alphabetically by the `title` attribute. We can use multiple `NSSortDescriptor`s to define complex sorting rules.
- And we store the result of the fetch into our `todos` variable. The `FetchedResults` object acts like an array, containing all the `Todo` objects retrieved from Core Data. The UI automatically updates whenever the data in Core Data changes, ensuring seamless synchronization.

The `@FetchRequest` property wrapper ensures that your view always displays the latest data from Core Data. When you create, update, or delete a `Todo`, the fetch request automatically reflects those changes in the UI without requiring manual refreshes.

## Updating Data

The `update` method allows us to modify an existing `Todo` in Core Data. In this case, it toggles the `isDone` property of the `Todo` item, marking it as complete or incomplete. Let’s see how it works.

```swift
import SwiftUI

struct Crud {
    private let viewContext = PersistenceController.shared.viewContext
    
    enum Failed: Error {
        case create(reason: String), delete(reason: String), update(reason: String)
    }
    
    func create(title: String) throws {
        let newTodo = Todo(context: viewContext)
        newTodo.id = UUID()
        newTodo.title = title
        newTodo.isDone = false
        
        do {
            try viewContext.save()
        } catch {
            throw Failed.create(reason: error.localizedDescription)
        }
    }
    
    // New Update Method
    func update(_ todo: Todo) throws {
        todo.isDone.toggle()
        do {
            try viewContext.save()
        } catch {
            throw Failed.update(reason: error.localizedDescription)
        }
    }
 }    
```

- **Togging `isDone` attribute:** The `toggle()` method flips the value of `isDone` between `true` and `false`. This lets us mark a task as completed or not with a single action.
- **Saving the Changes:** Once the `isDone` attribute is updated, the `save()` method ensures the changes are persisted to Core Data.
- **Error Handling:** If saving the changes fails, the method throws our custom `Failed.update` error with a detailed reason, ensuring errors are handled gracefully.

### How to Use the Update Method

The `toggleIsDone` method in the `TodoViewModel` calls the repository’s `update` method. Here’s how it works:

```swift
import SwiftUI

@Observable
class TodoViewModel {
    private let repository: Crud
    var todos: [Todo] = []

    init(repository: Crud = Crud()) {
        self.repository = repository
    }
    
    func addTodo(title: String) {
        do {
            try repository.create(title: title)
        } catch {
            print("Error adding Todo: \(error)")
        }
    }
    
    // Update CRUD operation
    func toggleIsDone(_ todo: Todo) {
        do {
            try repository.update(todo)
        } catch {
            print("Error toggling isDone: \(error)")
        }
    }
}
```

We need to tell that our repository takes a `todo` object in the function, since we are updating its `isDone` data in the repository.

### Updating the Update Method in SwiftUI

To display a list of `Todo` items and toggle their completion status, we use the `TodoListView`. This view fetches data from Core Data, displays it in a `List`, and updates tasks dynamically:

```swift
import SwiftUI

struct TodoListView: View {
    @State var viewModel: TodoViewModel
    @FetchRequest(
        entity: Todo.entity(),
        sortDescriptors: [NSSortDescriptor(keyPath: \Todo.title, ascending: true)]
    ) private var todos: FetchedResults<Todo>

    var body: some View {
        List {
            ForEach(todos) { todo in
                HStack {
                    Text(todo.title ?? "Untitled")
                        .strikethrough(todo.isDone, color: .red)
                        .foregroundColor(todo.isDone ? .gray : .primary)
                    Spacer()
                    Button(action: {
                        toggleIsDone(todo)
                    }) {
                        Image(systemName: todo.isDone ? "checkmark.circle.fill" : "circle")
                            .foregroundColor(todo.isDone ? .green : .gray)
                    }
                }
            }
        }
    }
    
    private func toggleIsDone(_ todo: Todo) {
        withAnimation {
            viewModel.toggleIsDone(todo)
        }
    }
}
```

- The `List` view iterates through the `todos` array provided by the `FetchRequest` and displays each `Todo`.
- We add some UI details such as:
    - **`strikethrough`**: Visually indicates completed tasks by striking through their text in red.
    - **`foregroundColor`**: Uses gray text for completed tasks and the default primary color for active tasks.
- Our button calls the `toggleIsDone` method, passing the `Todo` item as an argument. Depending on the task being completed or not, it display an icon.
- Then, the function delegates the update logic to the `toggleIsDone` method in the `TodoViewModel`, with a smooth animation.

Now, let's add our view into the `ContentView`:

```swift
import SwiftUI

struct ContentView: View {
    @State private var viewModel = TodoViewModel()

    var body: some View {
        NavigationView {
            VStack {
                TodoListView(viewModel: viewModel) // here
                AddTodoView(viewModel: viewModel)
            }
        }
    }
}
```

## Deleting Data

The final CRUD operation is deleting data. In order to remove tasks from Core Data, we use the `delete` method in our repository:

```swift
import SwiftUI

struct Crud {
    private let viewContext = PersistenceController.shared.viewContext
    
    enum Failed: Error {
        case create(reason: String), delete(reason: String), update(reason: String)
    }
    
    func create(title: String) throws {
        let newTodo = Todo(context: viewContext)
        newTodo.id = UUID()
        newTodo.title = title
        newTodo.isDone = false
        
        do {
            try viewContext.save()
        } catch {
            throw Failed.create(reason: error.localizedDescription)
        }
    }
    
    func update(_ todo: Todo) throws {
        todo.isDone.toggle()
        do {
            try viewContext.save()
        } catch {
            throw Failed.update(reason: error.localizedDescription)
        }
    }
    
    // New Delete Method
    func delete(_ todo: Todo) throws {
        viewContext.delete(todo)
        do {
            try viewContext.save()
        } catch {
            throw Failed.delete(reason: error.localizedDescription)
		}
	}
 }   
```

- This method marks the `Todo` object for deletion within the Core Data context.
- Then, the changes are persisted to the Core Data store with `save()`. If you skip this step, the object won't be removed from the database.
- To finish, if the save operation fails, an error is thrown with a our custom error.

### Connecting to the ViewModel

The `deleteTodo` method in the `TodoViewModel` calls the repository's `delete` method:

```swift
import SwiftUI

@Observable
class TodoViewModel {
    private let repository: Crud
    var todos: [Todo] = []

    init(repository: Crud = Crud()) {
        self.repository = repository
    }
    
    func addTodo(title: String) {
        do {
            try repository.create(title: title)
        } catch {
            print("Error adding Todo: \(error)")
        }
    }
    
    func toggleIsDone(_ todo: Todo) {
        do {
            try repository.update(todo)
        } catch {
            print("Error toggling isDone: \(error)")
        }
    }
    
    // Delete CRUD Operation
    func deleteTodo(_ todo: Todo) {
        do {
            try repository.delete(todo)
        } catch {
            print("Error deleting Todos: \(error)")
        }
	}
}
```

Same as the update method, we need to precise the `todo` object in the method, since we need to know which item must be removed.

### Integrating with the View

```swift
import SwiftUI

struct TodoListView: View {
    @State var viewModel: TodoViewModel

    @FetchRequest(
        entity: Todo.entity(),
        sortDescriptors: [NSSortDescriptor(keyPath: \Todo.title, ascending: true)]
    ) private var todos: FetchedResults<Todo>

    var body: some View {
        List {
            ForEach(todos) { todo in
                HStack {
                    Text(todo.title ?? "Untitled")
                        .strikethrough(todo.isDone, color: .red)
                        .foregroundColor(todo.isDone ? .gray : .primary)
                    Spacer()
                    Button(action: {
                        toggleIsDone(todo)
                    }) {
                        Image(systemName: todo.isDone ? "checkmark.circle.fill" : "circle")
                            .foregroundColor(todo.isDone ? .green : .gray)
                    }
                }
                // here
                .swipeActions {
                    Button(role: .destructive) {
                        deleteTodo(todo)
                    } label: {
                        Label("Delete", systemImage: "trash")
                    }
                }
            }
        }
    }
    
    private func toggleIsDone(_ todo: Todo) {
        withAnimation {
            viewModel.toggleIsDone(todo)
        }
    }
    
    // Delete function fron ViewModel
    private func deleteTodo(_ todo: Todo) {
        withAnimation {
            viewModel.deleteTodo(todo)
        }
    }
}
```

- With `swipeActions` we can now swipe any item in the list, and display an icon such as `trash`.
- The `role: .destructive` parameter styles the button to indicate it performs a destructive action (e.g., deleting).
- The `deleteTodo` method delegates the deletion to the `TodoViewModel`, which then interacts with the repository.

## Conclusion

In this article, we’ve covered the complete CRUD operations using Core Data in a modular and user-friendly way. From creating tasks to updating their status, reading them dynamically, and finally deleting them, you’ve learned how to interact with Core Data in SwiftUI while adhering to clean architecture principles.

Here’s a quick recap of what we achieved:

1. **Created Data**: Added new `Todo` tasks with default values.
2. **Read Data**: Fetched and displayed tasks in a dynamic SwiftUI list using `@FetchRequest`.
3. **Updated Data**: Toggled the `isDone` state of tasks to mark them as complete or incomplete.
4. **Deleted Data**: Removed tasks using swipe-to-delete gestures, with changes reflected instantly in the UI.

By separating concerns across the **Repository**, **ViewModel**, and **View**, you’ve seen how to build a scalable and testable app structure. The use of animations, intuitive UI components, and Core Data’s powerful persistence features ensures both great performance and an excellent user experience.