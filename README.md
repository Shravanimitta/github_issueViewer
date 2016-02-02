#Github Issue Viewer

This app helps view github issues related to npm repository. It is built using the angularjs framework and leverages its two-way binding. Also used are :
SASS - preprocessor, 
bootstrap - CSS, 
grunt - task-runner,
yeoman - scaffolding,
jasmine - testing framework
karma - testing tool


#Components
Routes
 - AllIssuesPage
      - Issue List
      - Search
      - Issue Open/Clise Filter
      - Label Filter
      - Pagination
    - IssueDetailsPage
      - Issue Details
      - Comments
        - Time
          - Name
          - Content


#Parsing
- All user names with prefix `@` have been converted to live links, linking to the user's github link
- All code in ``` ... ``` has been enclosed in <pre><code> ... <code></pre> tags for better readability.
- All urls have been converted to live links.


# Build & development

Run `grunt build` for building and `grunt serve` for a preview locally.

## Testing

The app used karma to run unit tests. In the test folder run `karma start`.