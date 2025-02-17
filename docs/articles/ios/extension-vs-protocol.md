# Understanding Extensions and Protocols in Swift

*Last Updated: Dec 7, 2024*

Swift’s **extensions** and **protocols** are two foundational features that empower developers to write modular, reusable, and expressive code; and we are going to see them both in this article.

## TL;DR

- **`Extensions`**: Add new functionality (methods, computed properties, subscripts, etc.) to existing types. Cannot add stored properties or override methods.
- **`Protocols`**: Define blueprints for properties, methods, initializers, subscripts, and more. Support inheritance and associated types.
- **`Together`**: Protocols define the "what," and extensions provide the "how" via default implementations, enabling protocol-oriented programming.

## Extensions: Expanding Functionality
`Extensions` allow us to **add new capabilities to an existing class, struct, enum or protocol**. 

### Extensions Can
- Add computed properties.
- Define instance methods and type methods.
- Add subscripts.
- Provide initializers.
- Add nested types.
- Conform an existing type to a protocol.

### Extensions Cannot
- Add stored properties.
- Override existing methods or properties.

### Examples of Extensions
#### Adding Computed Properties
```swift
extension Int {
	var squared: Int {
		return self * self
	}
	
	var isEven: Bool {
		return self * 2 == 0
	}
}

let number = 4
print(number.squared) // 16
print(number.isEven)  // true
```

#### Adding Methods
```swift
extension Double {
	func toString(decimalPlaces: Int) -> String {
		return String(format: "%.\(decimalPlaces)f", self)
	}
}

let pi = 3.14159
print(pi.toString(decimalPlaces: 2)) // "3.14"
```

#### Adding subscripts
::: info
Classes, structs, and enumerations can define `subscripts`, which are **shortcuts for accessing the member elements of a collection, list, or sequence.** We use subscripts to set and retrieve values by index without needing separate methods for setting and retrieval.
:::

```swift
extension Array {
	subscript(optional index: Int) -> Element? {
		return index >= 0 && index < count ? self[index] : nil 
	}
}

let numbers = [10, 20, 30]
print(numbers[optional: 1]) // Optional(20)
print(numbers[optional: 5]) // nil
```

#### Adding Nested Types
```swift
extension String {
	enum CaseType {
		case upper, lower, mixed
	}
	
	var caseType: CaseType {
		if self == self.uppercased() {
			return .upper
		} else if self = self.lowercased() {
			return .lower
		} else {
			return .mixed
		}
	}
}

let text = "Paul H"
print(text.caseType) // mixed
```

#### Conforming an Existing Type to a Protocol
```swift
protocol Describable {
	func describe() -> String
}

extension Int: Describable {
	func describe() -> String {
		return "Number is \(self)"
	}
}

let number = 2014
print(number.describe) // "The number is 2014"
```

## Protocols: Defining Contracts
`Protocols` define a **blueprint of methods, properties, and behaviors** that a conforming type must implement. 

### Protocols Can
- Define properties (read-only ro read-write).
- Define methods.
- Define initializers.
- Define subscripts.
- Use associated types.
- Support protocol inheritance.
- Define static/class requirements.

### Examples of Protocols
#### Properties
```swift
// Protocols can require both read-only and read-write properties.
protocl Vehicle {
	var name: String { get }
	var currendSpeed: Double { get set }
}

struct Car: Vehicle {
	let name: String
	var currentSpeed: Double
}

let car = Car(name: "Mercedes Benz", currentSpeed: 120.0)
print(car.name) // "Mercedes Benz"
```

#### Methods
```swift
protocol Drawable {
	func draw()
}

struct Tree: Drawable {
	func draw() {
		print("Drawing a tree")
	}
}

let tree = Tree()
tree.draw() // "Drawing a tree"
```

#### Initializers
```swift
// Protocols can require conforming types to provide specific initializers
protocol Initializable {
	init(value: Int)
}

struct Example: Initializable {
	var value: Int
	init(value: Int) {
		self.value = value
	}
}

let example = Example(value: 10)
print(example.value)  // 10
```

#### Subscripts
```swift
protocol Reversible {
	subscript(index: Int) -> String { get }
}

struct ReversedArray: Reversible {
	private let items: [String]
	
	init(items: [String]) {
		self.items = items
	}
	
	subscript(index: Int) -> String {
		return items.reversed()[index]
	}
}
let reversed = ReversedArray(items: ["a", "b", "c"])
print(reversed[0])  // "c"
```

#### Associated Types
```swift
// Protocols can define placeholder types using associatedtype
protocol Container {
	associatedtype Item
	var items: [Item] { get }
	func count() -> Int
}

struct IntContainer: Container {
	typealias Item = Int
	var items: [Int]
	func count() -> Int {
		return items.count
	}
}

let container = IntContainer(items: [1, 2, 3])
print(container.count())  // 3
```

#### Protocol Inheritance
```swift
protocol Movable {
	func move()
}

protocol Flyable: Movable {
	func fly()
}

struct Airplane: Flyable {
    func move() {
        print("Moving on the ground")
    }
    
    func fly() {
        print("Flying in the sky")
    }
}

let airplane = Airplane()
airplane.move()  // "Moving on the ground"
airplane.fly()   // "Flying in the sky"
```

#### Static/Class Requirements
```swift
// Protocols can define static methods or properties
protocol Identifiable {
	static var id: String { get }
}

struct Product: Identifiable {
	static var id: String = "Product-001"
}

print(Product.id) // "Product-001"
```

## And now, all together!
Combining protocols and extensions unlocks the full power of Swift. Extensions can provide **default implementations** for protocol methods or properties.

#### Default Implementation 
```swift
protocol Greeter {
    func greet()
}

extension Greeter {
    func greet() {
        print("Hello, Swift!")
    }
}

struct Person: Greeter {}
Person().greet()  // "Hello, Swift!"
```

#### Conforming Types Can Override Default Behavior
```swift
struct Robot: Greeter {
    func greet() {
        print("Beep! I am a robot.")
    }
}

Robot().greet()  // "Beep! I am a robot."
```

## Good Practices
- Use `extensions` for adding functionality and `protocols` for abstraction
- Avoid cramming too many unrelated functionalities into a single extension
- Use `associatedtype` for flexible generic behavior

## Conclusion
**Protocols** act as blueprints for behavior, ensuring consistency and enabling abstraction, while **extensions** add functionality to existing types without altering their original definition. When combined, they form the backbone of protocol-oriented programming, empowering developers to create modular and scalable systems. By leveraging their full potential, we can write cleaner, and more expressive code.