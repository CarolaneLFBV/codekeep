# @Bindable vs. @Binding in SwiftUI: What’s the difference?

*Last Updated: Dec 7, 2024*

SwiftUI offers powerful tools to manage data flow between views, and two key players in this system are **@Binding** and **@Bindable**. While both serve to connect data across views, they address slightly different use cases.

## TL;DR

| **Feature** | **`@Binding`** | **`@Bindable`** |
| --- | --- | --- |
| **Purpose** | Connects a simple property between views. | Binds specific properties in complex objects. |
| **Scope** | Limited to parent-child view relationships. | Often used with Observable. |
| **Use Case** | Toggles, sliders, or other direct interactions. | View models, shared states, or complex data. |
| **Complexity** | Simple and straightforward. | Handles more advanced binding scenarios. |

## **@Binding**

The `@Binding` property wrapper creates a **two-way connection** between a child view and a property owned by a parent view. Behind the scenes, it is essentially a lightweight wrapper for a reference to a value. It doesn’t own the value itself but serves as a “link” to the value owned by another view. 

### Key Features

- **Two-way data flow**: When the child modifies the property, those changes are reflected in the parent view, and vice versa.
- **Scoped to views**: Often used when a parent view needs to pass a value to its child while retaining control over the property.
- **Use case**: When you pass data between views in SwiftUI.

### **Example**

```swift
struct ParentView: View {
	@State private var isOn: Bool = false

	var body: some View {
		ChildView(isOn: $isOn) // Passing the state as a binding
	}
}
```

```swift
struct ChildView: View {
	@Binding var isOn: Bool

	var body: some View {
		Toggle("Toggle Switch", isOn: $isOn)
	}
}
```

1. The ParentView owns the `isOn` state.
2. It passes the state down to ChildView using `$isOn`.
3. Changes in the toggle automatically update the `isOn` property in **ParentView.**

## **@Bindable**

The `@Bindable` property wrapper was introduced with the **Observableobject** pattern, and provides a way to bind specific properties of an Observable model directly to a view. Behind the scenes, it relies on SwiftUI's **Observable** and **@State** ecosystem. It ensures views automatically refresh when the state changes in a more complex object, such as a view model.

### Key Features

- **Observable binding**: Automatically updates views when changes occur in complex object.
- **Model-driven**: Useful when binding a specific property of a model object.
- **Use case**: When managing more complex data structures, such as view models or shared app state.

### **Example**

```swift
// First Step: Declare an Observable Object
@Observable
class ViewModel: ObservableObject {
	var name: String = "John"
}
```

```swift
// In the parent view, create an instance and pass it to the child
struct ParentView: View {
	@State var viewModel = ViewModel()

	var body: some View {
		ChildView(viewModel: viewModel)
	}
}
```

```swift
// Here, use @Bindable to access the ViewModel and bind directly to its properties
struct ChildView: View {
	@Bindable var viewModel: ViewModel

	var body: some View {
		TextField("Enter your name", text: $viewModel.name)
	}
}
```

1. The **ViewModel** automatically conforms to the `@ObservableObject` pattern.
2. We add the `@State` property wrapper to the ViewModel in the **ParentView.**
3. The **ChildView** can access and directly bind to properties of the **ViewModel.** Any change in the `TextField` updates the name property, which immediately reflects in the `Text` view.

## **Conclusion**

Understanding when to use `@Binding` or `@Bindable` in SwiftUI boils down to your app’s data structure and the complexity of your views. Use `@Binding` for simple, two-way value passing between views and `@Bindable` for managing properties within an Observable object.