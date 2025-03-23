# Structural Patterns

*Last Updated: March 23, 2025*

Structural patterns help organize and manage relationships between objects to form larger structures and enhance flexibility and reusability.

:::warning
I am only sharing the patterns I have interacted with!
:::

## TL;DR
* `Adapter`: Makes incompatible interfaces compatible by acting as a translator.
* `Model-View-Controller`: Separates data, interface, and control logic for organized structure.
* `Model-View-ViewModel`: Enhances MVC by adding a ViewModel, which acts as a bridge between Model and View, allowing data binding and cleaner separation of business logic and UI.

## Adapter Pattern
### Definition
The `Adapter Pattern` allows two incompatible interfaces to work together by creating a **middleman (adapter)** that translates between them.

<div class="center">
<img src="/concepts/design-patterns/dp-adapter.png" alt="Diagram representing how the Adapter design pattern works" />
</div>

Think about when you are traveling: when you decide to travel to a different continent, it's complicated to use a power outlet! That's where the plug adapter comes in, and helps you to adapt your charger. Same here! 

### Flow
* `Adapter Creation`: The adapter class is created, implementing the interface and methods expected by the client.
* `Adaptation`: The adapter translates or maps requests from the client interface to the adaptee's interface.
* `Usage`: The client can now use the adapter as if it were using the original system or class.

### Example - In Code
```swift
// Target (What the client expects)
protocol LegacyPrinter {
    func printText(_ text: String)
}
```

```swift
// Adaptee (New incompatible class)
class ModernPrinter {
    func printModern(_ content: String) {
        print("🖨️ Modern Printer Output: \(content)")
    }
}
```

```swift
// Adpter
class PrinterAdapter: LegacyPrinter {
    private let modernPrinter = ModernPrinter()
    
    func printText(_ text: String) {
        modernPrinter.printModern(text)
    }
}
```

#### Usage
```swift
func sendToPrinter(printer: LegacyPrinter) {
    printer.printText("Hello, Adapter Pattern!")
}
```

## Model-View-Controller (MVC)
### Definition
The `MVC` is an architectural pattern that separates your code into 3 clear responsibilities:
* `Model`: Manages the data and business logic.
* `View`: Handles the UI and what the user sees.
* `Controller`: Acts as the middleman — it connects the Model and the View.
The goal here is to separate concerns so the code is easier to manage, test and update.

Think of your MVC as a restaurant:
* Model = The kitchen (prepares the food = data)
* View = The customer’s table (displays the food)
* Controller = The waiter (connects customer & kitchen)

### Flow
* The `View` receives user input and notifies the `Controller`.
* The `Controller` interacts with the `Model` to get or update data. 
* Once the `Model` is updated of fetched, the `Controller` updates the `View`.

<div class="center">
<img src="/concepts/design-patterns/dp-mvc.png" alt="Diagram representing how the MVC design pattern works" />
</div>

### Example - In Code
```swift
// Model
struct User {
    var name: String
}
```

```swift
// Controller
@Observable
class UserController {
    private(set) var user: User = User(name: "Alice")
    
    func changeUserName(to newName: String) {
        user.name = newName
    }
}
```

```swift
// View
import SwiftUI

struct UserView: View {
    @State private var controller: UserController
    
    var body: some View {
        VStack(spacing: 20) {
            Text("👤 User Name: \(controller.user.name)")
                .font(.title)
            
            Button("Change Name to Bob") {
                controller.changeUserName(to: "Bob")
            }
        }
        .padding()
    }
}
```

## Model-View-ViewModel (MVVM)
### Definition
The `MVVM`  is a modern architectural pattern designed to separate concerns in UI applications.
The goal: Keep your UI logic, business logic, and data model clean and separated.

* The `Model` is similar to MVC, which represents the data and business logic of the application.
* The `View` displays the user interface and binds to properties exposed by the ViewModel.
* The `ViewModel` acts as an intermediary between the Model and the View, and exposes data in a way that the View can easily consume.

Let's use our creativity again, and imagine a smart display screen:
* Model = The raw data (like API response or database info)
* ViewModel = The smart brain that formats, transforms, and prepares data for display
* View = The screen — shows what the ViewModel gives it and sends back user actions

### Flow
* The `View` binds to properties in the `ViewModel`.
* When the `ViewModel` receives updates from the `Model` or processes user input, it notifies the `View` of changes.
* The `View` updates automatically based on the data bound to the `ViewModel`.

<div class="center">
<img src="/concepts/design-patterns/dp-mvvm.png" alt="Diagram representing how the MVC design pattern works" />
</div>

### Example - In Code
```swift
// Model
extension App.Entities {
    struct Category: Identifiable {
        var id: UUID
        var title: String
        var color: Color
        
        init(
            id: UUID = UUID(),
            title: String,
            color: Color,
        ) {
            self.id = id
            self.title = title
            self.color = color
        }
    }
}
```

```swift
// Here in order to interact with the data (SwiftData), I 'm using a repository.
extension App.Repositories {
    struct CategoryRepository: App.Protocols.CategoryDataProviding {

        @MainActor
        static func fetch() async throws -> [CategoryEntity] {
            let categoriesFetch = FetchDescriptor<CategoryResponseEntity>()
            do {
                let data = try getContext().fetch(categoriesFetch)
                return data
                    .convert()
            } catch {
                print("Error: \(error.localizedDescription)")
                throw error
            }
        }
    }
}
```

```swift
// ViewModel
extension App.Views.CategoriesList {
    @Observable @MainActor
    final class ViewModel {
        var categories: [App.Entities.Category] = []

        func loadData() async {
            do {
                categories = try await App.Repositories.CategoryRepository.fetch()
            } catch {
                print("Error while loading data, \(error.localizedDescription)")
            }
        }
    }
}
```

```swift
// View
import SwiftUI

extension App.Views {
    struct CategoriesList: View {
        @State private var viewModel = ViewModel()
        
        var body: some View {
            content
                .task {
                    await viewModel.loadData()
                }
                .navigationTitle("categories")
        }
    }
}

private extension App.Views.CategoriesList {
    var content: some View {
      ScrollView {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: DS.Spacing.large) {
            ForEach(viewModel.categories) { category in
                Text(category.title)
            }
        }
    }
  }
}

```

