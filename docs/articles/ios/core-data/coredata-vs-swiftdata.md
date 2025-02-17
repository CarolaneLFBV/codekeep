# Managing Data in iOS: Core Data vs SwiftData

*Last Updated: Dec 13, 2024*

:::info
Resources:
* Apple's documentation - SwiftData: https://developer.apple.com/xcode/swiftdata/
* iOS Data Persistence: https://bugfender.com/blog/ios-data-persistence/
:::

Managing data is a fundamental part of building iOS applications, whether it’s saving user preferences, storing offline data, or keeping track of a to-do list. Apple provides developers with two robust frameworks for handling persistent data: **Core Data** and the newly introduced **SwiftData**.

iOS developers often face a choice among multiple data persistence tools such as `UserDefaults`, `Keychain`, `FileManager` and so on. However, for apps that demand structures data storage, advanced querying, and synchronization capabilities, `Core Data` and SwiftData stand out as robust options.

## Why Core Data?
Think about the data your app needs to manage—whether it’s user-generated content, app settings, or large datasets. Managing data efficiently is a key requirement for modern app development. But which tool should you choose?

Apple offers two primary frameworks for data persistence:
- `Core Data`: A mature and feature-rich framework introduced with iOS 3. It simplifies the management of object graphs and data persistence, enabling you to save and retrieve data without directly dealing with databases.
- `SwiftData`: A modern API introduced in iOS 17, designed for simplicity and perfect synergy with SwiftUI.

### Understanding SwiftData
**SwiftData** provides an expressive and lightweight way to model and persist app data using pure Swift code. It’s ideal for SwiftUI developers and comes with built-in support for iCloud Drive and CloudKit. SwiftData is compatible with Core Data, making it a natural evolution for modern projects. However, its limited compatibility (iOS 17 and later) and the lack of some advanced features mean it may not yet replace Core Data in all scenarios.

### The Strengths of Core Data
**Core Data** has been Apple’s primary solution for data persistence for nearly two decades. It offers advanced features that SwiftData currently lacks, such as:
- `NSFetchedResultsController`: Execute and monitor complex queries.
- `MSCompoundPredicate`: for complex, multi-step predicates.
- **Derived Attributes**: Automatically calculate properties like `lastUpdated`.
- **Child Contexts**: Manage changes locally before saving them.
- **Sectioned Fetch Requests**: Organize fetched results into sections seamlessly.

Additionally, Core Data’s extensive documentation, online resources, and community support make it an excellent choice for beginners and seasoned developers alike.

### Core Data, SwiftData, or both?
Choosing between Core Data and SwiftData depends on your app’s requirements:

- If your app targets older versions of iOS or requires features like advanced querying or undo/redo, **Core Data** remains the best choice.
- If you’re building a SwiftUI app for devices running iOS 17 and later, **SwiftData** might be a great option.
- In some cases, you might even combine both frameworks, leveraging SwiftData’s simplicity for certain features while relying on Core Data’s power for advanced use cases.

## Conclusion
In the next article, we'll explore the fundamental concepts of Core Data and how they fit into your app's architecture. Whether you’re new to Core Data or looking to refresh your knowledge, this guide will provide you with a solid foundation.

Ready? Let’s dive in!