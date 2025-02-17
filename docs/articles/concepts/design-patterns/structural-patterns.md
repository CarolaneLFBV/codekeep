# Structural Patterns

*Last Updated: Dec 7, 2024*

Structural patterns help organize and manage relationships between objects to form larger structures and enhance flexibility and reusability.

:::warning
I am only listing the ones that I've been dealing with or interact with a couple of times :)
:::

## TL;DR
* `Adapter`: Makes incompatible interfaces compatible by acting as a translator.
* `Bridge`: Separates an abstraction from its implementation, letting both vary independently.
* `Decorator`: Adds extra features to an object dynamically, like layers on top of the base.
* `Model-View-Controller`: Separates data, interface, and control logic for organized structure.
* `Model-View-ViewModel`: Enhances MVC by adding a ViewModel, which acts as a bridge between Model and View, allowing data binding and cleaner separation of business logic and UI.

## Adapter Pattern
### Definition
The `Adapter Pattern` helps two pieces of code with different interfqces work together.
It’s commonly used when integrating third-party libraries or legacy code that doesn't match the expected interface.
<div style="display: flex; justify-content: center;">
<img src="/concepts/design-patterns/dp-adapter.png" alt="Diagram representing how the Adapter design pattern works" />
</div>

Think about when you are traveling: when you decide to travel to a different continent, it's complicated to use a power outlet! That's where the plug adapter comes in, and helps you to adapt your charger. Same here! 

### Flow
* `Adapter Creation`: The adapter class is created, implementing the interface and methods expected by the client.
* `Adaptation`: The adapter translates or maps requests from the client interface to the adaptee's interface.
* `Usage`: The client can now use the adapter as if it were using the original system or class.

-> So, an adapter class sits between two incompatible parts, takes requests from one part, translates it, and sends it to the other part, so it can understand.

## Bridge Pattern
### Definition 
The `Birdge Pattern` helps split an abstraction (a high-level idea) from its implementation (the details). 
Need an example? I got one for you: suppose you have a magic remote that controls a devices such as different TVs. Well, the abstraction is the remote, and the remote is used by implementations such as the TVs.

<div style="display: flex; justify-content: center;">
<img src="/concepts/design-patterns/dp-bridge.png" alt="Diagram representing how the Bridge design pattern works" />
</div>

:::info
The relation Has-A defines the bridge between the two hierarchies (Remote and TV)
:::

### Flow
* `Abstraction`: Defines a high-level interface, often extendeed by refined abstractions.
* `Implementation`: Concrete implementations are separated into their own classes.
* `Usage`: The abstraction delegates operations to the implementation, allowing both to evolve independetly.

-> We got two parts: one for general controle (the remote), and one for the specific device (the TV, the Radio). The remote sends signals, but each device responds its way.

## Decorator Pattern
### Definition 
The `Decorator Pattern` lets you add new features or "decorations" to an object ithout changing its structure.
It's like adding extra toppings on a pizza–the pizza stays the same, but you add things to it!

<div style="display: flex; justify-content: center;">
<img src="/concepts/design-patterns/dp-deco.png" alt="Diagram representing how the Decorator design pattern works" />
</div>

### Flow
* `Component Interface`: Defines the base interface for objects that can have responsibilities added.
* `Concrete Component`: The object being decorated.
* `Decorator`: Wraps the component, adding new behavior while conforming to the same interface.
* `Usage`: Multiple decorators can be stacked to add layered behaviors dynamically.

-> You have a basic object (like a plain pizza), and then you can wrap it with decorators (extra cheese, pepperoni) that add extra functionality or features. Each decorator adds something new.

## Model-View-Controller (MVC)
### Definition
The `MVC` is a fundamental design pattern in iOS development. 
It seperates the data (Model), user interface (View), and the logic that connects them (Controller).
* The `Model` represents the data and business logic of the application. It is responsible for retrieveing data, managing it, and notifying the View when data changes.
* The `View` displays the user interface and presents the data to the user.It listens for user input and forwards these actions to the Controller.
* The `Controller` acts as am intermediary between the Model and the View. Receives input from the View, processes it (often involving calls to the Model), and upadtes the View accordingly.

### Flow
<div style="display: flex; justify-content: center;">
<img src="/concepts/design-patterns/dp-mvc.png" alt="Diagram representing how the MVC design pattern works" />
</div>

* The `View` receives user input (1) and notifies the `Controller` (1🔔).
* The `Controller` interacts with the `Model` to get or update data (2). 
* Once the `Model` is updated of fetched (🔄3), the `Controller` updates the `View` (3).

## Model-View-ViewModel (MVVM)
### Definition
The `MVVM` enhances the MVC pattern with a `ViewModel` layer that separates business logic from the View.
* The `Model` is similar to MVC, which represents the data and business logic of the application.
* The `View` displays the user interface and binds to properties exposed by the ViewModel.
* The `ViewModel` acts as an intermediary between the Model and the View, and exposes data in a way that the View can easily consume. It provides properties that the View can bind to, and it may include methods that the View can invoke without needing to know the specifics of the Model.

### Flow
<div style="display: flex; justify-content: center;">
<img src="/concepts/design-patterns/dp-mvvm.png" alt="Diagram representing how the MVC design pattern works" />
</div>

* The `View` binds to properties in the `ViewModel` (1).
* When the `ViewModel` receives updates from the `Model` or processes user input, it notifies the `View` of changes (2).
* The `View` updates automatically based on the data bound to the `ViewModel` (3).
 