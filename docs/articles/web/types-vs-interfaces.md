# Types vs. Interfaces in Typescript

*Last Updated: Dec 7, 2024*


In TypeScript, you have two options for defining type: `types` and `interfaces`. However, you might have already asked yourself: "Should I use types or interfaces?"
Like many programming languages and situations: **it depends**. In some cases, one option has cleaver advantage over the other, but they are still interchangeable.
Let's dive in!

## TL;DR
Both Types and Interfaces are essential tools in TypeScript for defining shapes of data, but they have distinct characteristics and use cases:

### Interfaces
* Best for defining structures of objects and classes.
* Extendable and can be merged, allowing the addition of properties or methods in different parts of the code.
* Useful when you want the flexibility of merging definitions or building complex structures.

### Types
* More versatile than interfaces; can represent primitive values, union types, and more complex data types.
* Cannot be merged, making them ideal for unique types that don’t require extension or alteration across different code parts.
* Preferable when needing to create union types or complex mappings.

### Key Differences
* Extension & Merging: Interfaces can be extended or merged easily, whereas types are static once defined.
* Use Cases: Interfaces are usually favored for defining object shapes (e.g., for classes), while types are ideal for more complex or combined data structures.

### Examples of Use Cases
* Function Types: Use types to define function shapes because they allow for shorthand syntax and flexibility.
* Union Types: Types are preferred since interfaces don’t support unions directly.
* Class Implementations: Interfaces work better with classes due to compatibility with implements syntax.

### When to Choose What
* Interfaces are suitable when defining objects or using classes.
* Types are preferable for unions, intersections, or cases where merging isn’t needed.

## Type and type aliases
Before we begin I think it's a great idea to remind to everyone what's a `type` and a `type alias`. 

`type` is a keyword that we can use to define the shape of data in TypeScript. The basics include `String`, `Boolean`, `Number`, `Array`, etc.
Each one has unique features and purposes, allowing us to choose the appropriate one for a particular use case. 

Meanwhile, `type aliases` are used to "put a name on any type". They create new names for existing types. Type aliases don't define new types; they provide an alternative name for existing ones. For example:
```typescript
type User = {
  id: string;
  email: string;
}
```
In this example above, we created a type alias called `User`, and can use it to represent the type definition of a user.

:::warning
It’s important to understand the distinction between `types` and `type aliases`, as this will influence when to use each.
:::

## Interfaces
`interfaces` defines a contract that an object must adhere to. For example:
```typescript
interface User {
  id: string;
  email: string;
}
```
You might have noticed, but it is the same as a type. Why? Because both of them are interchangeable. 

## So, what are the differences?
There are some scenarios in which using one instead of another makes a difference, especially for the `type` option.

### Primitive Types
Primitive types are inbuilt types in TypeScript. They include `string`, `number`, `boolean`, `null`, and `undefined` types.
Here's an example on how to use a type with primitive types:
```typescript
type Email = string;
```
We cannot use interface since it can only be used for an object type.

### Union Types
Union types are values that can be one of various types. For example
```typescript
type Role = 'member' | 'subscriber' | 'VIP';
```
They can only be defined using `type`. There is no equivalent with interface. However, it is possible to create a new union type from three interfaces:
```typescript
interface Member {
  points: number;
}

interface Subscriber {
  multiplier: number;
}

interface VIP {
  secretCode: string;
}

type Role = Member | Subscriber | VIP;
```

### Function Types 
A Function Type represents a function's type signature. Using the type alias, we must specify the parameters and the return type to define the function type:
```typescript
type AddFn = (num1: number, num2: number) => number;
```
We can also use interface to represent the function type:
```typescript
interface AddFn { 
  (num1: number, num2: number): number; 
}
```
Both define function types. The slight difference here is the syntax difference of interface using `:` instead of `=>` when using type.

Another reason to use types instead of interfaces is their additional capabilities, which interfaces lack. We can take advantage of advanced type features like conditional types, mapped types, etc. For example:
```typescript
type Role = 'member' | 'subscriber';
type MemberPoints = (points: number) => void;
type SubscriberPoints = (points: number, multiplier: number) => void;

type AddPoints<A extends Role> = A extends 'member' ? MemberPoints : A extends 'subscriber' ? SubscriberPoints : never;

const AddToMember: AddPoints<'member'> = (points) => {
  // code
}

const AddToSubscriber: AddPoints<'subscriber'> = (points, multiplier) => {
  // code
}
```
Here, we define a type `AddPoints` with conditional type and union type. It provides a unified function signature for `member` and `subscriber` handlers in a type-safe manner.

### Declarative Merging
Declarative Merging is a feature exclusive to interfaces. 
Suppose we define an interface multiple times. TypeScript compiler will automatically merged these definitions into a single interface one. For example:
```typescript
interface User { 
    name: string; 
}

interface User {
    email: number;
}

const harry: User = {
    name: 'Harry',
    email: 'harry@mail.com'
}
```
For types, they cannot be merged the same way. If you try to define the `User` type more than once, an error will be thrown
```md
Duplicate indentifier 'User'
````
That's why when used in the right situation, declaration merging can be useful.

### Extends vs Intersection
An interface can extend one or multiple interfaces. They will inherit all properties and method from the first one. We use the keyword `extends`. For example:
```typescript
interface Member {
  name: string;
}

interface Subscriber extends Member {
  benefits: [];
}
```
We can also extend interfaces from a type:
```typescript
type Member = {
    name: string;
};

interface Subscriber extends Member {
    benefits: string[]
}
```
:::warning
The exception here is when working with union types. An exception occurs ('`An interface can only extend an object type or interection of object types with statically known members.`') when attempting to extend an interface from a union type, as interfaces require statically known types at compile time.
:::

Type alises can extend interfaces using `intersection`. For example:
```typescript
interface Member {
  name: string;
}
type Subscriber = Member & { benefits: string[] };
```
Both interfaces and type aliases can be extended. An interface can extend a statically known type alias, while a type alias can extend an interface using the intersection operator `&`.

### Handling conflicts when extending
Another difference is about how conflicts are handled when we try to extend from one with the same property name. For example:
```typescript
interface Member {
  getPerms: () => string;
}

interface Subscriber extends Member {
  getPerms: () => string[]
}
```
An error is thrown:
```md 
Interface 'Subscriber' incorrectly extends interface 'Member'.
The types returned by 'getPerms()' are incompatible between these types.
Type 'string[]' is not assignable to type 'string'.
```

Type aliases allow for intersecting properties without generating errors, unlike interfaces. For example:
```typescript
type Member = {
    getPerms: (id: string) => string;
}

type Subscriber = Member & {
    getPerms: (id: string[]) => string[];
}

const VIP: Subscriber = {
    getPermission: (id: string | string[]) =>{
    return (typeof id === 'string'?  'vip' : ['vip']) as string[] & string;
  }
}
```
It is important to note that the type intersection of two properties may produce unexpected results. Here's an example:
```typescript 
type Member = {
    code: string
}

type Subscriber = Member & {
    code: number
}

const Harry: Subscriber = { code: 'HarryCode' };
```
In a nutshell, interfaces detect property or method name conflicts at compile time and generates an error. Types intersections merge without throwing erros.

## When to use types vs interfaces
Interfaces are commonly used for declaration merging: when we are extending an existing library or authoring a new one. Besides, using the `extends` keyword enables the compiler to be more performant, compared to type aliases with intersections.

However, many features in types are difficult to achieve with interface, as we have seen above with conditional types for example. 

In many cases, they can be used interchangeably depending on personal preference. But, we should use type aliases in the following use cases:
* Create new name for primitive type
* Define union type, tuple, function or complex type
* Overload function
* Use mapped types, conditional types, type guards, or other advanced type features

Compared with interfaces, types are more expressive. Many advanced type features are unavailable in interfaces, and those features continue to grow as TypeScript evolves.

## Conclusion
After comparing types and interfaces in TypeScript, it’s clear that each has its strengths and limitations. Interfaces offer flexibility with structure, merging, and extension, making them well-suited for defining objects and integrating with classes. Types, on the other hand, shine in scenarios requiring advanced features like union types, conditional types, and intersections, providing expressive, powerful type manipulation.
