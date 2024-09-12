**Software Frameworks Assignment Phase 1 - ChatSphere**

**Git Repository Organisation**

- The file structure of the repository is as follows:

client/

  └── server/

    ├── Data/

    ├── Models/

    ├── routes/

  └── src/

    ├── app/

    │ └── { Angular components }

    │ └── { Interfaces }

    └── assets/

      └── Icons/
**Branching Strategy**

- **Main Branch:** My main branch was always kept as a running and fully functional version of the site, as such all features were tested before being merged into this branch.
- **Feature Branches:** The feature branches was where the new additions and functionality were developed and tested, this could be small things like a simple UI, or a large update like refactoring the backend of the site.

**Update Frequency**

- **Commit Frequency:** Commits were done often, usually when a core feature of part of code was created in a branch. This ensured that I had a constant flow of up-to-date backup versions I could go back to if need be.
- **Merge Strategy:** As mentioned earlier, my feature branches were for core updates and functionality, once these branches had been ‘completed’, they were merged. An example of a completed branch was the login page, once the UI and backend had successfully been generated, the branch would be tested and merged.

**Server/Frontend Structure**

- **Server Code:** The server code was located in the root directory (same level as the src). This server folder contained the main server.js file, alongside all the backend routes, models, services and data.json files.
- **Frontend Code:** The angular frontend had fell under the src>app directory, where all the components, services and interfaces were located and utilised. Further any images or icons were located under the assets folder.

**Data Structures**

**Client-Side Models**

- **Groups:** The Group interface was one of the more utilised frontend interfaces, this consisted of the (GroupID: Number, memberIDs: number\[\], name: string, adminIDs: number\[\], and blacklistedIDs: number\[\]).
- **Channels:** Similar to the Group interface, the Channel interface was a common return type in the frontend typescript files. This data structure consisted of (ChannelID: number, GroupID: number, name: string, members: number\[\]).
- **Reports** The reports data structure was generated near the end of the project to help with managing the reporting of the user, the idea is this might be updated in the future to include some form of attachment of a report reason, and possible messages the user may have sent to be reported. Their data structure is as follows: (reportID: number, userID: number, name: string).

**Server-Side Models**

- **User.js:** Used for manipulating the user data file; (userID: int, username : str, email: str, password: str, role: str)
- **Groups.js:** Used for manipulating the groups data file; (groupID: int, memberIDs: array, name: str, adminIDs: array, blacklistedIDs: array)
- **Channels.js:** Used for manipulating the channels data file; (channelID: int, groupID: int, name: str, members: array)
- **Report.js:** Used for manipulating the reports data file; (reportID, userID)
- **Requests.js:** Used for manipulating the requests data file; (requestID: int, groupID: int, userID: int)
- **ChannelRequests.js:** Used for manipulating the channelRequests data file; (channelRequestID: int, groupID: int, channelID: int, userID: int)

**Angular Architecture**

**Components**

- **LoginComponent:** the login component is the default component shown, it has an email and password input, this component will handle passing this data to the backend, and upon a successful response, it will log the user in, and redirect to the dashboard component.
- **SignupComponent:** Simialr to the login component, this page grabs the email and password input, alongside a username input, sends it to the backend and awaits a successful response, where it then logs the user in and redirects to the dashboard component.
- **NavbarComponent:** This component is shown on a numerous pages and acts as method to show the account you are logged in as, alongside having some site navigation and a logout/delete account method.
- **DashboardComponent:** The dashboard component acts as an intermediary between going to the homepage or the explore page.
- **ExploreComponent:** This component has two main functions, one requests the backend for all groups the user can join, the other function is called on request to join a group, where it will send some user information to the backend and update the page.
- **HomepageComponent:** The homepage component can be seen as the main page of the site, it itself has no code or functions, but rather serves as a template to hold the GroupContainerComponent, NavbarComponent, and MessageContainerComponent.
- **GroupContainerComponent:** This component handles the displaying and selection of groups and channels. It uses numerous services for handling the updating of pages across different components; this is done through observers. The group component’s main function is to load groups and channels and allow for selection. Further, it has the ability to open the SettingsComponent.
- **GroupCreationComponent:** This component is used to create a new group. It has an input for a name, this name is passed to the backend and then is handled to create a new group with the current userID as an admin.
- **MessageContainerComponent:** This component currently has very little functionality as it is simply just the UI of what will become the messaging system, in this component will display message history, and other data relating to uploading of images, and calling other users.
- **ChannelExploreComponent:** The channel explore component is very similar to the group explore component, having an identical UI. However, this component handles the displaying and joining of channels, passing the userID and relative data to the backend, awaiting a successful response of joining before updating the page.
- **ReportsComponent:** This component handles the rendering of all reported users, it displays all user in the reports.json file, from here a super admin and only super admin, can decide to ignore the report or delete the user from the platform, where all instances of the userID are removed and the reports page is updated.
- **SettingsComponent:** The settings component is by far the largest component as it was designed to be a dynamic overlay for the message container. It has 24 functions, numerous making calls to the backend to do various different things. Some quick examples are creating channels, leaving the group, viewing group members, accepting/declining join requests and many other critical features of the site. The dynamic updating of the html is made achievable through an ngIf statement and a function that virtually ‘changes the route’ by having a currentView variable that decides which ‘page’ to render.

**Services**

**Client-Side Services**

- **RoleService:** The role service is a short quick hand to grab the user’s data from session storage, parse it to JSON and return the users role. This is useful for a few components that check permissions.
- **ChannelService:** The channel service is used to connect the group-container component to the message-container component by using an observer to check for updates on the group-container. One selection of a channel in the group-container, it will trigger the observer and send the selected channelID to the messageComponent that then loads the corresponding data.
- **SettingsService:** The settings service, similar to the channel service, is used to communicate between components, this service in particular uses an observer to communicate when the settings component is toggle on or off.

**Server-Side Services**

- **UserService:** The user service has three functions, these are:
  - readUsers, which returns all users in the users.json file as an instance of the User class.
  - writeUsers, which takes in an instance or array of instances and writes them into the users.json data file.
  - createUser, which takes in 3 values, and intern will create an instance of user, then use the writeUser function to add the user to the users.json file.
- **GroupService:** the group service has two main functions, these are:
  - readGroups, which returns all the groups in the groups.json file as an instance of the Group class.
  - writeGroups, which takes a instance or array of instances of the Group class and writes them to the groups.json data file.
- **ChannelService:** the channel service has once two main functions, these are:
  - readChannels, which returns all channels in the channels.json file as an instance of the Channel class.
  - writeChannels, which takes in an instance or array of instances of the Channel class and writes them to the channels.json data file.
- **RequestService:** the request service has three main functions, these are:
  - readRequests, which returns all the requests in the requests.json file as an instance of the Request class.
  - writeRequests, which takes in an instance or array of instances of the Requests class and writes them to the requests.json data file.
  - deleteRequest, which takes in a requestID, finds the corresponding request, splices it out, and uses the writeRequests to update the requests.json data file.
- **ChannelRequestsService:** the channelRequest service has four main functions, these are:
  - readRequests, which returns all the channel requests in the channelRequests.json file as an instance of the channelRequest class.
  - writeRequests, which takes in an instance or array of instances of the channelRequests class and writes them to the channelRequests.json data file.
  - createRequest, which takes in a userID, channelID and groupID, creates a channelRequest instance, and saves it to the channelRequests.json data file.
  - deleteRequest, which takes in a channelRequestID, finds the channelRequest, splices it out of the data file, and write the channelRequest array back to the channelRequest.json data file.
- **ReportService:** the report service has two main functions, these are:
  - readReports, which returns all the report objects in the reports.json data file as an instance of the Report class.
  - writeReports, which takes a instance or array of instances of the Report class and writes them to the report.json data file.

**Routes**

- **App Routes:** The angular frontend has numerous routes to navigate between the different components. The default route ‘’, redirects to the login page. Any other route besides the login and signup page require the authGuard service, which checks if the user has a valid session state.
- **authGuard routes:**
  - **dashboard:** /dashboard, uses dashboardComponent
  - **homepage:** /homepage, uses homepageComponent, navbarComponent, messageContainerComponent, settingsComponent and groupContainerComponent
  - **explore:** /explore, uses the exploreComponent and navbarComponent
  - **channel-explore:** /channel-explore, uses the channelExploreComponent and navbarComponent
  - **group-creation:** /group-creation, uses the groupCreationComponent and the navbarComponent
- **superAdminGuard route - (**checks for super admin role**)**
  - **reports:** /reports, uses the reportComponent and the navbarComponent

**Node Server Architecture**

**Modules**

- **Express.js:** Express is used in the backend of the site to handle requests and routing.
- **File System (fs):** The fs module allows the backend routes and services to access the data.json files, enabling a non-database method of storage.
- **Path:** The path module is used throughout the backend for a more user-friendly handling of directories and paths.
- **Cors:** Cors is used for handling the interaction of resources from different domains, this is useful as the frontend is hosted on one port and the backend on another.

**Functions**

- All backend functions are named according to their route, and serve to do only their specific route e.g. createUser, deleteGroup, createRequest. This will be elaborated more in the **server-side routing content**.

**Files**

- **server.js:** The server.js file is the main file in the backend, it holds all the routes and their directories. Further it handles the cors and ports.
- **routes folder:** The routes folder contains all the different backend routes that are called in the angular component frontend.
- **models folder:** The models folder contains all the data classes and services needed in the different backend routes.
- **Data folder:** The data folder is responsible for holding all the json data files that contain the storage of local data without a database.

**Global Variables**

- **FileRoutes:** throughout the backend routes and services, there are copious amounts of global file route variables that are used within the functions read/write directories. This is used to not manually type out each directory every time, alongside making it easier to change the directories or names of said files if need be, without needing to changes every instance of it throughout every file.

**Server-Side Routes**

| **Route** | **Method** | **Parameters** | **Return Values** | **Purpose** |
| --- | --- | --- | --- | --- |
| /login | POST | Email, password | { success: boolean, message: string } | Verify valid details |
| /signup | POST | Username,<br><br>email, password | { success: boolean, message: string } | Verify unique details, add user to users.json |
| /groups | POST | userID | { filteredGroups: Group } | Get all groups the user is in |
| /groups/createGroup | POST | userID, groupName | { newGroup: Group } | Create a new group and add it to groups.json |
| /groups/leaveGroup | POST | groupID, userID | { message: string } | Remove user from groups memberIDs, and all other appropriate fields |
| /groups/deleteGroup | POST | groupID | { success: boolean, message: string } | Delete a group by groupID |
| /groups/getMembers | POST | groupID | { members\[\] } | Returns all usesIDs, usernames, and roles from a groups memberIDs array |
| /groups/kickUser | POST | userID, groupID | { success: boolean, message: string } | Splices the userID from all appropriate fields in the groups group.json file |
| /channel | GET | { } | { channels: channel\[\] } | Gets all channels |
| /channel/myChannels | POST | userID | { filteredChannels: channel\[\] } | Gets all channels the user is a member of |
| /channel/addChannel | POST | groupID, name, userID | { newChannel: channel } | Adds a new channel to the groups.json and channels.json |
| /channels/deleteChannel | POST | channelID | { message: string } | Removes a channel from groups.json and channels.json |
| /explore | POST | userID | { groups: Group\[\] } | Gets all groups that the user can join |
| /explore/join | POST | userID, groupID | { message: string, groupID: int, requestID: int, newRequestID: int, groupName: str } | Does some validation, gets relative data, creates request for said group |
| /channelExplore | POST | userID, groupID | { joinableChannels: channel\[\] } | Gets all channels a user can join |
| /channelExplore/join | POST | userID, channelID, groupID | { message: string, channelID: int, requestID: int, newRequestID: int, channelName: str } | Does some validation, gets relative data, creates request for said channel |
| /requests/getRequests | POST | groupID | { userRequests: Request\[\] } | Gets all the requests for the specific group |
| /requests/approveRequest | POST | userID, requestID, groupID | { success: Boolean } | Adds the user to the group, deletes their request. |
| /requests/delineRequest | POST | requestID | { success: boolean, message: string } | Deletes the users request |
| /channelRequests<br><br>/getRequests | POST | groupID | { userRequests: channelRequestID: int, channelID: int, channelName: str, userID: int, username: str } | Gets all the requests for the specific group and sends back relative data |
| /channelRequests<br><br>/approveRequest | POST | userID, channelRequestID, channelID | { success: Boolean } | Adds the user to the channel, deletes their request. |
| /channelRequests<br><br>/delineRequest | POST | channelRequestID | { success: Boolean } | Deletes the users channel request |
| /perms | POST | groupID, userID | { success: Boolean } | Checks if the user is in the adminIDs list for the group |
| /authCheck/verifyUser | POST | userID | { success: boolean, message: string } | Check if the userID is currently a valid ID |
| /promoteUser | POST | userID, newRole | { success: boolean, message: string } | Updates the users.role to the newRole |
| /reports | GET | { } | { reportWithUsernames: reportID: int, userID: int, name: string } | Gets all reports and attatches a username (for reports interface) |
| /reports/ignore | POST | reportID | { reportID: int } | Deletes the report from reports.json |
| /deleteUser | POST | userID | { success: boolean, message: string } | Deletes all copies of the userID and any objects that have the userID as a PK |
| /banUser | POST | userID, groupID | { success: boolean, message: string } | Removes the user from the group and adds their userID to the blacklist |

**Client-Server Interaction**

**Data Changes**

- **User Validation:** the validation of a user occurs numerous times throughout the site, whether it be through the auth guard, login, signup or even role checks – this is a key backend communication that allows certain features to be restricted to authorised individuals. An example of data change on something like a login or signup is the users data (without password) being saved into the browsers session storage for frontend usage later.
- **Group Handling:** Groups have numerous different backend routes and functions that deal with the handling of data both frontend and backend. An example of this is joining groups, creating groups, checking group members, ban users and much more. These all utilise the backend groups.json file by splicing, updating or deleting json objects, which in turn, updates the frontend.

**Component Updates**

- **Channel visualisation:** the message-container is an example of a component that reacts to certain updates in other components alongside the session storage and backend response. When a group and channel combination are selected, the active group the user is in is saved to session storage, from here the backend is called to get member lists, channel names and other appropriate data. In phase 2 of the assignment this will be greatly developed to also return data like message history and other useful information.
- **Request Status Update:** Another example of front-end component updating is the requests, as with numerous interactions to the request backend, the front end will update. This can be seen in a user requesting to join a group, where the page will update, and the requested group will be removed from the list. Further, something like accepting a user into a group or channel will also cause an update to the settings component to correctly display the up-to-date requests.
