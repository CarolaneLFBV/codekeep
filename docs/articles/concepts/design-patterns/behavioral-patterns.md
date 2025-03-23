# Behavioral Patterns

*Last Updated: March 22, 2025*

Behavioral patterns focus on communication and responsibilities between objects, making interactions more flexible and organized.

:::warning
I am only sharing the patterns I have interacted with!
:::

## TL;DR
* `Observer`: Notifies multiple objects of state changes in a central object, great for event-driven systems.
* `State`: An object changes its behavior dynamically by delegating actions to its current state object. 


## Observer Pattern
### Definition
The `Observer Pattern` is a behavioral design pattern that defines a subscription mechanism to notify one or multiple objects about any events that happen to the object they’re observing. 

Think of YouTube:
* A **YouTube channel** is the **Subject**
* The **subscribers** are the **Observers**
* When the channel uploads a new video, all subscribers get notified!

<div class="center">
<img src="/concepts/design-patterns/dp-obsv.png" alt="Diagram representing how the observer pattern works"  />
</div>

### Flow
* `State Change`: The `Subject`'s state changes (e.g., data is updated).
* `Notification`: The `Subject` automatically notifies all registered `Observers`.
* `Observer Reaction`: Each `Observer` receives the update and reacts accordingly (e.g., refresh UI, show message, update model).

## State Pattern
### Definition
The `State Pattern` allows an object to change its behavior when its internal state changes — it’s like the object is switching between different “modes”.

Imagine your pattern as a traffic light:
* It can be red, yellow, or green state.
* The behavior (what it allows cars to do) changes depending on its current state.
* Thus, if the light is red, cars cannot move. When it goes green, they move!

### Flow
* `Context Set Up`: The object is in an initial state.
* `Action Performed`: The `Subject` notifies all registered `Observers` of the change.
* `State Change`: The current state object handles it and may change the context’s state.
* `Behavior Switch`: The object now behaves differently because it’s in a new state.

<div class="center">
<img src="/concepts/design-patterns/dp-state.png" alt="Diagram representing how the MVC design pattern works"  />
</div>