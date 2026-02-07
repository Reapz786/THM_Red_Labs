# TryHackMe Pen Testing Path Notes

**Date:** 9/01/26

---

## Cross-Site Scripting (XSS)

### What is a Payload?

In XSS, JavaScript is the payload that is executed on a target. Two parts:
- **Intention** - what you want to accomplish
- **Modification** - how you alter the code

### Types of XSS Payloads

#### Proof of Concept (POC)
- Demo purposes to see if XSS works
- Used to verify vulnerability exists

#### Session Stealing
- Captures user session details
- Steals login tokens stored in cookies of target
- Once cookie is obtained, attacker can take over session and be logged in as the user

#### Keylogging
- Anything typed on site can be captured or forwarded to attacker's site
- Records all user input

#### Business Logic
- Calling a particular network resource or JavaScript function
- Examples: forcing a password reset by changing user element via JS function

### XSS Attack Types

#### Reflected XSS
- User-supplied data is given in an HTTP request from webpage source that doesn't validate
- Payload is reflected back to the user immediately

**Testing for Reflected XSS:**
Test every possible point of entry:
- Parameters in the URL query string
- URL file path
- Sometimes HTTP headers (although unlikely)

#### Stored XSS
- XSS payload is stored in the web app (like the database)
- Visitor/user runs it by visiting the site/web page

**Testing for Stored XSS:**
Check every entry where it seems data can be stored and then shown for other users who can access that data.

**Examples include:**
- Comments on a blog
- User profile information
- Website listings

#### DOM-based XSS
- Document Object Model is a programming interface for HTML & XML documents
- Example structure:
  - Document
    - Root element
      - Element `<title>`
      - etc.

#### Blind XSS
- Similar to stored XSS in that stored data gets seen by other users
- However, you can't see the payload or test it against yourself
- Typically requires external monitoring

### XSS Defense Bypassing

#### XSS Polyglot
- A string of text which can escape attributes, tags and bypass filters all in one
- Multi-purpose payload that works in various contexts

---

## Burp Suite

### Overview
- Web app security testing framework for web pen testers and API testing
- Java-based framework
- Captures & manipulates HTTP/HTTPS traffic between browser and web server
- Intercepts requests, allowing various parts of Burp Suite to be used
- Ability to intercept, view and modify web requests before reaching target server/browser is where it becomes invaluable

### Core Components

#### Burp Proxy
- Enables interception & modification of requests & responses while interacting with web apps
- Central hub for traffic analysis

#### Repeater
- Allows for capturing, modifying and resending the same request multiple times
- Useful when crafting payloads like SQL injection
- Testing the functionality of endpoints for vulnerabilities

#### Intruder
- Limited in community edition
- Allows for spraying endpoints with requests
- Utilized for brute force attacks and fuzzing endpoints

#### Decoder
- For data transformation
- Decode captured information or encode payloads
- Other services exist but using Burp Suite is better for efficiency

#### Comparer
- Enables comparison of two pieces of data at either word/byte level
- Other services exist however using Burp Suite is better for efficiency

#### Sequencer
- For assessing randomness of tokens like session cookies or other randomly generated data
- If algorithm used to generate the values lacks secure randomness then this can be exploited

#### Extensions
- Easy integration of extensions via the Burp Store (BApp Store)
- Extends functionality with community and commercial tools

---

## Race Conditions

### Definition
- Timing of events in computer programs
- Events influence the behavior and outcome of the program
- Typically happens when shared resources are accessed & modified by multiple threads

### Causes
- Lack of proper mechanisms and synchronization between threads
- Improper handling of concurrent access

### Key Concepts

#### Program vs Process vs Thread
- **Program** - Set of instructions executed for specific task
- **Process** - Program in execution
- **Thread** - Lightweight unit of execution

#### Where Race Conditions Occur

##### Parallel Execution
- Multiple requests in parallel to handle concurrent user interactions via web server
- Without proper synchronization, requests can access and modify shared resources, leading to race conditions

##### Database Operations
- Similar issues but for databases
- Concurrent operations on same data

##### Third-party Libraries and Frameworks
- Same issues as above
- Dependencies can introduce race condition vulnerabilities

---

## Web Application Architecture

### Multi-Tier Architecture

#### Presentation Layer
- Web browser on client side
- Renders the HTML, CSS and JavaScript code

#### Application Layer
- Consists of the business logic and functionality
- Receives client requests, processes them and interacts with data tier
- Implemented using server-side programming languages
  - Node.js
  - PHP
  - Python
  - etc.

#### Data Layer
- Responsible for storing and manipulating application data
- CRUD operations: Creating, Updating, Deleting and Searching/Reading records
- Usually achieved by a Database Management System
  - MySQL
  - PostgreSQL
  - etc.

---

## Notes
- These are working notes from TryHackMe pen testing path
- Content may contain some rough areas that need further review and expansion
