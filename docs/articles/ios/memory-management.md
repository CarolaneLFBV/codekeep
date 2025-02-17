# Understanding Memory Mangement in Swift

*Last Updated: Jan 31, 2025*

Managing memory effienctly is crucial to avoid performance issues and unexpected crashed in any application. Swift handles memory management using `ARC (Automatic Reference Counting)`, which tracks and manages the lifecycle of objects in memory. In this article, we will explore ARC, common pitfalls like retain cycles, and how different types of references—**strong**, **weak**, and **unowned**—help manage object references effectively.

## TL;DR

| **Reference Type** | **Increases Reference Count?** | **Optional?** | **Prevents Retain Cycle?** | **Use Case**
| --- | --- | --- | --- | --- |
| **Strong** | Yes | No | No | Standard object relationships |
| **Weak** | No | Yes | Yes | Closures, delegates |
| **Unowned** | No | No | Yes | Parent-child relationships |


## But first, what's ARC ?
**ARC (Automatic Reference Counting)** keeps track of how many active references point to an object. When an object's reference count reaches 0, it is deallocated.
You have 3 types of references: `strong`, `weak`, and `unowned`. Depending on the reference type, ARC handles memory management differently.

## Types of References

### Strong References
A `strong reference` is the **default reference type in Swift**. It ensures that the object it points to remains in memory until the reference itself is released. While essential for managing object lifecycles, strong references can lead to retain cycles if two or more objects hold strong references to each other.

When using a strong reference:
- It increases the reference count of the object.
- When the reference count falls to 0, the object is deallocated.
- The object cannot be deallocated as long as a strong reference exists.
- It can cause retain cycles if objects reference each other mutually with strong references.

Here's an example:
```swift
class A {
    var b: B?
}

class B {
    var a: A?
}

func createCycle() {
    let a = A()
    let b = B()
    a.b = b
    b.a = a
}
```
In this example, A holds a strong reference to B and vice versa, preventing both objects from being deallocated. This results in a memory leak.

### Weak References
A `weak reference` **does not increase the reference count of the object it points to**. This allows the object to be deallocated even if a weak reference to it still exists. Weak references are always optional (?) because the referenced object can become nil.

When using a weak reference::
- It does not increase the reference count.
- However, it must be optional (?), as the referenced object may be deallocated.
- It's commonly used to avoid retain cycles, particularly in closures and asynchronous operations!

For Example:
```swift
class MyViewController: UIViewController {
    var tableView: UITableView?

    func fetchData() {
        apiCall { [weak self] data in
            guard let self = self else { return }
            self.tableView?.reloadData()
        }
    }
}
```
Here’s what happens:
- The closure retains a weak reference to self.
- If the ViewController is deallocated before the API call finishes, the closure will not cause a crash since self becomes nil.
Without the weak reference, the closure would create a retain cycle and prevent the ViewController from being deallocated.

### Unowned References
An `unowned reference` is similar to a weak reference but is **not optional**. It assumes that the referenced object will always exist for the lifetime of the reference. However, if the referenced object is deallocated and an unowned reference is accessed, the program will crash.

When using an unwoned reference:
- It does not increase the reference count, like the weak reference.
- It isn't optional – the object must exist when accessed.
- It's more efficient than weak references, as there’s no need for optional unwrapping.

Here's an example:
```swift
class Parent {
    var child: Child?
}

class Child {
    unowned var parent: Parent
    init(parent: Parent) {
        self.parent = parent
    }
}

func createRelationship() {
    let parent = Parent()
    let child = Child(parent: parent)
    parent.child = child
}
```
In this example:
- Child holds an unowned reference to Parent.
- If Parent is deallocated, accessing parent in Child would cause a crash.

## Retain Cycle Prevention Strategies

Retain cycles occur when two objects hold strong references to each other. To prevent retain cycles:
- Use weak references when the referenced object may be deallocated during the lifecycle of the referencing object.
- Use unowned references when the referenced object is guaranteed to exist as long as the referencing object.
By properly managing these references, Swift’s ARC can effectively deallocate objects and prevent memory leaks.

## Conclusion
Swift’s memory management is both powerful and efficient, but it requires a solid understanding of strong, weak, and unowned references. By learning how and when to use each type, you can write safer, more optimized code that avoids common pitfalls like retain cycles and crashes!