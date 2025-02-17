# Creational Patterns

*Last Updated: Dec 7, 2024*

Creational patterns help manage and streamline object creation, making it more flexible, efficient, and suitable for various situations.

:::warning
I am only listing the ones that I've been dealing with or interact with a couple of times :)
:::

## TL;DR
* `Singleton`: Ensures only one instance of a class exists and provides a global access point to it. Great for managing shared resources, like logging or configuration settings.
* `Factory Method`: Defines an interface for creating objects, letting subclasses decide the object type. Useful when you need to delegate creation to subclasses based on runtime conditions.
* `Abstract Factory`: Creates families of related objects without specifying concrete classes. Ideal for systems supporting multiple themes, platforms, or configurations.
* `Builder`: Separates complex object construction from its representation, allowing flexible and step-by-step creation. Handy for creating objects with many optional parameters.

## Singleton Pattern
### Definition
The `Singleton Pattern` is designed to ensure that only one instance exists and provides a global acces point to it. It is ideal for shared resources, such as configuration settings, logging, or managing connections.

### Flow
<div style="display: flex; justify-content: center;">
<img src="/concepts/design-patterns/dp-sing.png" alt="Diagram representing how the MVC design pattern works" class="small-image" />
</div>

* `Instance Creation`: When the application requests an instance of the Singleton, it checks if one already exists.
* `Global Access`: If an instance does not exist, it creates one. Subsequent requests return the same instance.
* `Usage`: Any part of the application can access the Singleton instance and interact with its methods or properties.

## Factory Method Pattern
### Definition
The `Factory Method Pattern` defines an inteface for creating objects, allowing subclasses to alter the type of objects created. This pattern is beneficial when the exact object type isn't known until runtime.

### Flow
<div style="display: flex; justify-content: center;">
<img src="/concepts/design-patterns/dp-fac.png" alt="Diagram representing how the MVC design pattern works" class="small-image" />
</div>

* `Method Definition`: A factory method is defined in a base class to create objects of a specific type.
* `Subclass Implementation`: Sublasses implement the factory method to produce different object types.
* `Usage`: The client calls the factory method without knowing the specific class of object it will recevive.

## Abstract Factory Pattern
### Definition
The `Abstract Factory Pattern` provides an interface to create families of related objects without specifying their concrete class.

### Flow
<div style="display: flex; justify-content: center;">
<img src="/concepts/design-patterns/dp-abfac.png" alt="Diagram representing how the MVC design pattern works"/>
</div>

* `Factory Interface`: An abstract factory defines methods for creating related products
* `Concrete Factories`: Implementations of the abstract factory create specific product variants.
* `Usage`: The client uses the factory interface to obtain product families without knowing the specific product classes.

## Builder Pattern
### Definition
The `Builder Pattern` lets us construct complex objects step by step. It’s useful for objects with multiple configurable fields or complex assembly processes.

### Flow
<div style="display: flex; justify-content: center;">
<img src="/concepts/design-patterns/dp-builder.png" alt="Diagram representing how the MVC design pattern works"/>
</div>

* `Builder Class`: The builder class defines steps to create various parts of the object.
* `Director (Optional)`: A director class can control the building process to create a specific configuration.
* `Usage`: The client uses the builder to construct an object by specifying only the desired properties.



