# Creational Patterns

*Last Updated: March 23, 2025*

Creational patterns help manage and streamline object creation, making it more flexible, efficient, and suitable for various situations.

:::warning
I am only sharing the patterns I have interacted with!
:::

## TL;DR
* `Singleton`: Ensures only one instance of a class exists and provides a global access point to it. Great for managing shared resources, like logging or configuration settings.
* `Factory Method`: Defines an interface for creating objects, letting subclasses decide the object type. Useful when you need to delegate creation to subclasses based on runtime conditions.
* `Abstract Factory`: Creates families of related objects without specifying concrete classes. Ideal for systems supporting multiple themes, platforms, or configurations.

## Singleton Pattern
### Definition
The `Singleton Pattern` ensures that a **class has only one instance** in the whole application, and provides a **global access point** to that instance.

Think of a president of a country for example:
* There can be only one at a time.
* And everyone refers to the same person, no matter where you are: you only have one president!

### Flow
* `Instance Creation`: When the application requests an instance of the Singleton, it checks if one already exists.
* `Global Access`: If an instance does not exist, it creates one. Subsequent requests return the same instance.
* `Usage`: Any part of the application can access the Singleton instance and interact with its methods or properties.

### Example - In Code
```swift
extension App {
    class Config {
        static let shared = Config() // The Singleton Instance

        var sharedModelContainer: ModelContainer = {
            let schema = Schema([
                ProjectResponseEntity.self,
            ])
            let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

            do {
                return try ModelContainer(for: schema, configurations: [modelConfiguration])
            } catch {
                fatalError("Could not create ModelContainer: \(error)")
            }
        }()
    }
}
```

#### Usage
```swift
struct App: SwiftUI.App {
    var body: some Scene {
        WindowGroup {
            App.Views.NavigationTab()
        }
        .modelContainer(App.Config.shared.sharedModelContainer)
    }
}
```

## Factory Method Pattern
### Definition
The `Factory Method Pattern` defines an inteface for creating objects, but lets subclasses decide which class to instantiate.

You’re building a cross-platform app where the UI needs to look native on macOS and Windows.
The app has a Dialog window, and each platform uses a different style of Button.
Using the Factory Method Pattern, you:
* Create a base class Dialog that defines the UI structure
* Let each platform-specific subclass (e.g. MacDialog, WindowsDialog) decide what kind of button to use

### Flow
* `Method Definition`: A factory method is defined in a base class to create objects of a specific type.
* `Subclass Implementation`: Sublasses implement the factory method to produce different object types.
* `Usage`: The client calls the factory method without knowing the specific class of object it will recevive.

<div class="center">
<img src="/concepts/design-patterns/dp-fac.png" alt="Diagram representing how the Factory Method works" class="small-image" />
</div>

### Example - In Code
```swift
// Product Protocol
protocol Button {
    func render()
}
```

```swift
// Concrete Products
struct MacButton: Button {
    func render() {
        print("🖥️ macOS Button: Rounded corners, flat design")
    }
}

struct WindowsButton: Button {
    func render() {
        print("🪟 Windows Button: Rectangular with shadow")
    }
}
```

```swift
// Creator (Base Dialog)
class Dialog {
    func createButton() -> Button {
        fatalError("Subclasses must override createButton()")
    }

    func showDialog() {
        print("Showing dialog window...")
        let button = createButton()
        button.render()
    }
}
```

```swift
// Concrete Creators
class MacDialog: Dialog {
    override func createButton() -> Button {
        return MacButton()
    }
}

class WindowsDialog: Dialog {
    override func createButton() -> Button {
        return WindowsButton()
    }
}
```

```swift
// Client Code
func launchApp(on platform: String) {
    let dialog: Dialog
    
    switch platform.lowercased() {
    case "mac":
        dialog = MacDialog()
    case "windows":
        dialog = WindowsDialog()
    default:
        print("❌ Unsupported platform")
        return
    }
    
    dialog.showDialog()
}
```

## Abstract Factory Pattern
### Definition
The `Abstract Factory Pattern` provides an interface to create **families of related objects** without specifying their **concrete class**.

For this pattern, imagine you are designing furniture for different styles:
* You can choose between Modern and Classic style.
* Each style produces a chair, a sofa, a table, etc. that match.
* You don't create individual furniture pieces directly — you ask the factory for a coordinated set.

### Flow
* `Client Requests Factory`: Choose which factory to use (e.g., ModernFactory).
* `Factory Creates Product Family`: The factory provides all related products (e.g., Chair + Sofa in the same style).
* `Client Uses Products`: The client uses the abstract interfaces (Chair, Sofa) and doesn’t care how they were made.

<div class="center">
<img src="/concepts/design-patterns/dp-abfac.png" alt="Diagram representing how the MVC design pattern works" class="small-image" />
</div>

### Exemple - In Code
```swift
// Abstract Product Protocols
protocol Chair {
    func sitOn()
}

protocol Sofa {
    func lieOn()
}
```

```swift
// Concrete Products
class ModernChair: Chair {
    func sitOn() { print("Sitting on a modern chair.") }
}

class ClassicChair: Chair {
    func sitOn() { print("Sitting on a classic chair.") }
}

class ModernSofa: Sofa {
    func lieOn() { print("Lying on a modern sofa.") }
}

class ClassicSofa: Sofa {
    func lieOn() { print("Lying on a classic sofa.") }
}
```

```swift
// Abstract Factory

protocol FurnitureFactory {
    func createChair() -> Chair
    func createSofa() -> Sofa
}
```

```swift
// Concrete Factories
class ModernFurnitureFactory: FurnitureFactory {
    func createChair() -> Chair { ModernChair() }
    func createSofa() -> Sofa { ModernSofa() }
}

class ClassicFurnitureFactory: FurnitureFactory {
    func createChair() -> Chair { ClassicChair() }
    func createSofa() -> Sofa { ClassicSofa() }
}
```

#### Usage
```swift
class Room {
    private let chair: Chair
    private let sofa: Sofa
    
    init(factory: FurnitureFactory) {
        self.chair = factory.createChair()
        self.sofa = factory.createSofa()
    }
    
    func setup() {
        chair.sitOn()
        sofa.lieOn()
    }
}
```