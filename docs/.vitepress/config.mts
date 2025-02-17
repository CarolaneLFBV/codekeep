import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CodeKeep",
  description: "A Vitepress Site For Documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: { provider: 'local' },
    logo: '/okeep.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/welcome-page' },
      { text: 'Contact', link: '/contact' }
    ],

    sidebar: [
      {
        text: 'Concepts',
        items: [
          { text: 'Design Patterns', items: [
            {text: 'Creational Patterns', link: 'articles/concepts/design-patterns/creational-patterns.md'},
            {text: 'Structural Patterns', link: 'articles/concepts/design-patterns/structural-patterns.md'},
            {text: 'Behavioral Patterns', link: 'articles/concepts/design-patterns/behavioral-patterns.md'}
          ]},
          { text: 'Software Architectures', link: 'articles/concepts/software-architectures.md' },
          { text: 'SOLID Principles', link: 'articles/concepts/solid-principles.md' }
        ],
        collapsed: true
      },
      {
        text: 'Tools',
        items: [
          { text: 'CD (Continuous Deployment)', link: 'articles/tools/cd.md' },
          { text: 'CI (Continuous Implementation)', link: 'articles/tools/ci.md' },
        ],
        collapsed: true
      },
      {
        text: 'iOS',
        items: [ 
          { text: 'Structs vs Classes in Swift', link: 'articles/ios/structs-vs-classes.md' },
          { text: '@Bindable vs. @Binding in SwiftUI: What’s the difference?', link: '/articles/ios/bindable-vs-binding-swiftui.md' },
          { text: 'Understanding Extensions and Protocols in Swift', link: 'articles/ios/extension-vs-protocol.md' },
          { text: 'Core Data', items: [
            { text: 'Managing Data in iOS: Core Data vs SwiftData', link: 'articles/ios/core-data/coredata-vs-swiftdata.md' },
            { text: 'Managing Data with Core Data: Fundamentals', link: 'articles/ios/core-data/coredata-fundamentals.md' },
            { text: 'Managing Data with Core Data: Setting Up', link: 'articles/ios/core-data/coredata-setting-up.md' },   
            { text: 'Managing Data with Core Data: CRUD Operations', link: 'articles/ios/core-data/coredata-crud-operations.md' },             
          ]
          },           
          { text: 'Understanding Memory Mangement in Swift', link: 'articles/ios/memory-management.md' }, 
        ],
        collapsed: true
      },
      {
        text: 'Web',
        items: [ 
          { text: 'Types vs. Interfaces in Typescript', link: 'articles/web/types-vs-interfaces.md' },
        ],
        collapsed: true
      },
    ],

    footer: {
      message: "<a href='https://github.com/carolaneLFBV' target='_blank'>GitHub</a> <a href='#' target='_blank'>LinkedIn</a>",
      copyright: "Copyright © 2020-present Carolane Lefebvre 💻"
    }
  }
})
