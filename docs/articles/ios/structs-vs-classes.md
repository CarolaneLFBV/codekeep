# Structs vs. Classes in Swift

*Last Updated: Dec 7, 2024*

In Swift, both `struct` and `class` are blueprints to create objects. These objects can hold data (like a person's name or age) and define behavior (like calculating something or doing an action). However, how they behave when you use them in your code is different.

## TL;DR
| Aspect | Struct `struct` | Class `class` |
| --- | --- | --- |
| **Memory Management** | Value type: Structs are copied when assigned or passed | Reference type: Classes are passed by reference |
| **Inheritance** | Cannot inherit from other structs | Can inherit from other classes | 
| **Mutability** | Immutable when declared with `let` | Mutable regardless of `let` unless properties are explicitly `let` |
| **Initialization (init)** | Automatically gets a memberwise by default | Manually define unless all properties have defaults |
| **Deinitialization (deinit)** | Does not support | Supports for cleanup when the instance is deallocated |
| **Performance** | Lightweight and more efficient for small data structures | Heavier due to reference tracking |

## Value Types vs. Reference Type
Structs are **value types**, which means they are **copied when assigned to a new variable or passed to a function**. Modifying one copy does **not affect** the original. Think about photocopies: You write a note on a piece of paper and make a photocopy of it. If you change something on the photocopy, it won't affect the original note, because it is 2 separated copies.

```swift
struct Note {
    var message: String
}
var originalNote = Note(message: "Hello, World!")
var copyOfNote = originalNote // This creates a copy
copyOfNote.message = "Hi, Swift!"

print(originalNote.message) // Output: "Hello, World!" (unchanged)
print(copyOfNote.message)   // Output: "Hi, Swift!" (changed)
```

Meanwhile Classes are **reference types**, meaning they **share the same memory reference**. Thus, changing one instance will **affect all references** to that instance. Imagine a Google document that is shared to different people. If one person modifies the document, everyone will see it too, because everyone is using the same document.

```swift
class Document {
    var content: String
    init(content: String) {
        self.content = content
    }
}
var sharedDoc = Document(content: "Hello, World!")
var anotherReference = sharedDoc // This shares the same document
anotherReference.content = "Hi, Swift!"

print(sharedDoc.content)       // Output: "Hi, Swift!" (changed)
print(anotherReference.content) // Output: "Hi, Swift!" (same reference)
```

## Inheritance
Structs don’t support inheritance. They are designed to be simple and independent. You can use extensions to add functionality, but you can’t create hierarchies.

```swift
struct Animal {
    var name: String
}

struct Dog: Animal { } // Error: Cannot inherit from non-class type 'Animal'
```

Classes allow inheritance, so you can reuse functionality from a base class, and create hierarchies.

```swift
class Animal {
    var name: String
    init(name: String) {
        self.name = name
    }
}

class Dog: Animal {
    var breed: String
    init(name: String, breed: String) {
        self.breed = breed
        super.init(name: name) // Calls the parent class initializer
    }
}
let myDog = Dog(name: "Buddy", breed: "Labrador")
print(myDog.name)  // Output: "Buddy"
print(myDog.breed) // Output: "Labrador"
```

If the app needs shared functionality across related types (e.g., `Animal -> Dog -> Cat`), classes are great for it.

## Mutability
If a struct is created with `let`, its properties cannot be modified. Even with `var`, methods should be marked with `mutating`. 

```swift
struct Point {
    var x: Int
    var y: Int

    mutating func move(dx: Int, dy: Int) {
        x += dx
        y += dy
    }
}
var point = Point(x: 0, y: 0)
point.move(dx: 5, dy: 5) // Works because it's mutable
let point = Point(x: 0, y: 0) // Would not allow modification
```

With classes, properties of a class instance can be modified even if it's declared with `let`. The reference is constantm but the object is mutable.

```swift
class Point {
    var x: Int
    var y: Int

    init(x: Int, y: Int) {
        self.x = x
        self.y = y
    }
}
let point = Point(x: 0, y: 0)
point.x = 10 // Allowed, even though `point` is declared with `let`
```

Structs are ideal when you want immutability for safety, while classes allow flexibility for complex mutable objects.

## Initialization
Structs automatically create an initializer with all their properties. No need to write our own unless custom behavior is needed.

```swift
struct Point {
    var x: Int
    var y: Int
}
let point = Point(x: 10, y: 20) // Automatic initializer
print(point.x) // Output: 10
```

However, classes need a bit more work. They don't give a free initializer unless all properties have default values. If something specific is needed, we must write our own `init` method.

```swift
class Point {
    var x: Int
    var y: Int

    init(x: Int, y: Int) {
        self.x = x
        self.y = y
    }
}
let point = Point(x: 10, y: 20) // You must use the custom initializer
print(point.x) // Output: 10
```

## Deinitialization 
Struct don't clean up, because they are value types. So Swift automatically cleans them up when they're no longer needed. No need to do anything!

Classes can have a special method called `deinit` that runs when an object is about to be removed from memory. This is useful for releasing resources, like closing files.

```swift
class File {
    init() {
        print("File opened")
    }

    deinit {
        print("File closed")
    }
}
var file: File? = File() // Output: "File opened"
file = nil               // Output: "File closed"
```

## Performance
* Structs are **lightweight** because they are stock on the **stack**, which is faster and automatically cleaned up when they go out of scope.
* Classes are **heavier** since they are stored on the **heap**, which allows for shared references but requires extra work to track and manage memory.
 
## Conclusion
Understanding the differences between structs and classes in Swift is essential for writing efficient, clean, and maintainable code. Here’s the big picture:
* Structs are value types: They create independent copies and are lightweight.
* Classes are reference types: They share the same memory location and are more flexible.

By using these tools appropriately, you’ll write more effective Swift code that’s optimized for both clarity and performance. 🚀