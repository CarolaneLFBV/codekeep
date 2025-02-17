# SOLID Principles

*Last Updated: Dec 7, 2024*

The SOLID Principles are a set of five design guidelines that help developers create more maintainable, and good code. 

## TL;DR

### S - Single Responsibility Principle (SRP)
Each class or module should have `one responsibility only`. This means that a class or module should only have one reason to change.

### O - Open/Closed Principle (OCP)
Classes, modules and functions should be `open for extension but closed for modification`. This means you should be able to add a new functionality without changing existing code.

### L - Liskov Substitution Principle (LSP)
Subtypes should be `substituable for their base type without altering the correctness of the program`. This means we should be able to use a derived class wherever we expect the base class without unexpected behavior.

### I - Interface Segregation Principle (ISP)
Clients should `not be forced to depend on interfaces they do not use`. Instead of having large interfaces, it’s better to create smaller, more specific ones so that classes only implement what they need.

### D - Dependency Inversion Principle (DIP)
`High-level modules should not depend on low-level modules`. Instead, both should depend on abstractions. This means relying on interfaces or abstract classes rather than concrete implementations.

## S - Single Responsibility Principle (SRP)
The Single Responsibility Principle is a software design principle where `each class should have a single responsibility or task` and should not be responsible for multiple unrelated tasks.

### Example
```swift
class User {
    var name: String
    var email: String
    
    init(name: String, email: String) {
        self.name = name
        self.email = email
    }
    
    func saveToDatabase() {
        // Code to save user to database
    }
    
    func sendEmailVerification() {
        // Code to send email verification
    }
}

```
In this example, the `User` class violates the SRP because it has multiple responsibilities. It not only stores user information but also perform database saving and email verification! This can make the class harder to maintain and modify in the future. If there are any changes regarding to the database saving or email verification, we would need to modify this class.

In order to fit with the principle, we need to separate the different functionalities from one to another:
```swift
class User {
    var name: String
    var email: String
    
    init(name: String, email: String) {
        self.name = name
        self.email = email
    }
}

class UserRepository {
    func save(user: User) {
        // Code to save user to database
    }
}

class EmailService {
    func sendVerificationEmail(to user: User) {
        // Code to send email verification
    }
}

```
Here, the code fits the SRP principles: the responsibilities are separated into distinct classes, and the `User` class now only handles the responsibility of storing user information. The `UserRepository` class is responsible for saving the user into the database, and the `EmailService` now handles the verification email method. 
Each class can be modified independently without affecting the others. 

By separating the responsibilities, we now have a better code organization, maintainability and flexibility. Any modifications in the Repository or Service we’ve made class won’t impact the User class.

## O - Open/Closed Principe
The Open/Closed Principle is a design principle based on `software entities` (such as classes, modules, functions, etc.) should be `open for extension, but closed for modification`. This means that you should be able to add a new functionality or behavior to a class without modifying the existing code.

### Example
Suppose we have our class `UserRepository`. Inside of this class, we have our save method, just like before:

```swift
class UserRepository {
    func save(user: User) {
        // Code to save user to database
    }
}
```

Now, suppose we want to add the `saveToFile` method for saving a user to a file. Without following the OCP, we might be tempted to modify the existing class and add a new method as such.

```swift
class UserRepository {
    func save(user: User) {
        // Code to save user to database
    }
    
    func saveToFile(user: User) {
        // Code to save user to a file
    }
}
```
The issue here is that we have introduced new code to the existing class, which can lead to potential bugs, and impact the existing code that relied on the `UserRepository` class.

Let’s apply the OPC principle on this one:

```swift
protocol Storage {
    func save(user: User)
}

class DatabaseStorage: Storage {
    func save(user: User) {
        // Code to save user to database
    }
}

class FileStorage: Storage {
    func save(user: User) {
        // Code to save user to a file
    }
}

class UserRepository {
    let storage: Storage
    
    init(storage: Storage) {
        self.storage = storage
    }
    
    func save(user: User) {
        storage.save(user: user)
    }
}

```
With this approach, the `Storage` protocol defines the common behavior of all storages and each concrete class, for example here, `DatabaseStorage` and `FileStorage` implements the save method according to their specific needs. If we need to add another type of storage, you will just need to create a new class.

By coding these classes that implement the protocol we've just made, we make sure that we are adding brand new functionality without touching existing code, which would cause unexpected behavior or bugs.

## L - Liskov Substitution Principle (LSP)
The Liskov Substituion Principle is a principle in object-oriented programming. The principle states that we should be able to `use a derived class wherever we expect the base class and everything should still work correctly` (easier to understand that way 🙂).

### Example
Let’s take our `User` class, which is now a superclass 🦸🏻. We have a method here called `sendEmailVerification` that sends an email. We also have a subclass called `GuestUser`. 

```swift
class User {
    var name: String
    var email: String
    
    func sendEmailVerification() {
        // Code to send email verification
    }
}

class GuestUser: User {
    override func sendEmailVerification() {
        // Guest users don’t have emails, so this function does nothing
    }
}

```
Do you see the problem here? `GuestUser` doesn’t support email verification, so it breaks the substitution rule if used where a `User` is expected!

No worries, we got this, let’s fix this:
```swift
class User {
    var name: String
    var email: String
}

class RegisteredUser: User {
    func sendEmailVerification() {
        // Code to send email verification
    }
}

class GuestUser {
    var name: String
    // No email verification needed for GuestUser
}

```
Instead of making `GuestUser` a subclass, we use composition to avoid forcing the class to conform to behaviors it doesn’t need.

By properly separating methods and needs of each class, we ensure that these classes won't get heavy with unnecessary methods or data.

## I - Interface Segregation Principle (ISP)
The Interface Segregation Principle is a design principle that suggests `breaking down large, monolithic interfaces into smaller, more specialized interfaces.` It encourages the creation of focused and specific interfaces tailored to the needs of each client.

### Example

Let’s consider again, our `User` class:

```swift
protocol UserProtocol {
    func save()
    func sendEmailVerification()
}

class RegisteredUser: UserProtocol {
    func save() {
        // Save to database
    }
    
    func sendEmailVerification() {
        // Send email verification
    }
}

class GuestUser: UserProtocol {
    func save() {
        // Save to database
    }
    
    func sendEmailVerification() {
        // This is irrelevant for GuestUser
    }
}

```
In this case, both `RegisteredUser` and `GuestUser` implement `UserProtocol`, even though `GuestUser` doesn’t need the `sendEmailVerification` method.

To fix this, let’s split the protocols so that each class only implements what it needs:
```swift
protocol Savable {
    func save()
}

protocol Verifiable {
    func sendEmailVerification()
}

class RegisteredUser: Savable, Verifiable {
    func save() {
        // Save to database
    }
    
    func sendEmailVerification() {
        // Send email verification
    }
}

class GuestUser: Savable {
    func save() {
        // Save to database
    }
    // No need for email verification here
}

```
By applying this principle, we have segregated the functionalities into separate protocols: `Savable` and `Verifiable`. Now, both `RegisterUser` and `GuestUser` implement only the protocols they need. As you can see, `GuestUser` only needs the `Savable` protocol, so it doesn’t need to implement the unnecessary `Verifiable` protocol.

This segregation allows each class to be focused on its specific responsibilities, leading to a cleaner and more maintainable code.

## D - Dependency Inversion Principle (DIP)
The Dependency Inversion Principle is a software design principle that suggests `high-level modules should not depend on low-level modules`. Instead, they should depend on `abstractions` (interfaces or protocols), and the low-level modules should implement those abstractions.

### Example

```swift
class DatabaseStorage {
    func save(user: User) {
        // Code to save user to database
    }
}

class UserRepository {
    let databaseStorage = DatabaseStorage()
    
    func save(user: User) {
        databaseStorage.save(user: user)
    }
}

```
In the example above, the `UserRepository` depends directly on `DatabaseStorage`, a concrete class, making it difficult to change the storage method if we need to modify it, and making it harder to maintain and test the code.

Let’s apply our principle now. The high-level module must depend on an abstraction (we will be using a protocol here), which is implemented by the low-level module. This way, the high-level one becomes independent of the specific implementation details of the low-level module.

```swift
protocol Storage {
    func save(user: User)
}

class DatabaseStorage: Storage {
    func save(user: User) {
        // Code to save user to database
    }
}

class FileStorage: Storage {
    func save(user: User) {
        // Code to save user to file
    }
}

class UserRepository {
    let storage: Storage
    
    init(storage: Storage) {
        self.storage = storage
    }
    
    func save(user: User) {
        storage.save(user: user)
    }
}

```
What happened here? We have introduced the `Storage` protocol, which defines the saving method. The `UserRepository` class now depends on the `abstraction` (our protocol) instead of a concrete implementation. We can now create different type of `Storage` (Database, File, etc.) that conform to the `Storage` protocol and pass them to the `UserRepository` at runtime.

With this principle, we can easily swap or extend our storage without modifying the UserRepository class.

## Conclusion
We now have seen the 5 keys of the SOLID principles. If you need a shorter version of the note, don’t hesitate to check the TD:LR that I have written at the top of the page :) !