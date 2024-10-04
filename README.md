**Software Frameworks Assignment Phase 2 - ChatSphere**

**Git Repository Organisation**

- The file structure of the repository is as follows:

client/

  └── server/

    ├── Data/

    ├── Models/

    ├── routes/
    
    ├── uplodas/

    ├── profilePictures/

    ├── db.js 

    ├── server.js

    ├── socket.js

    ├── peer.js

  └── src/

    ├── app/

    │ └── { Angular components }

    │ └── { Interfaces }
    
    │ └── { Services }

    └── assets/

      └── Icons/
**Branching Strategy**

- **Main Branch:** My main branch was always kept as a running and fully functional version of the site, as such all features were tested before being merged into this branch.
- **Feature Branches:** The feature branches was where the new additions and functionality were developed and tested, this could be small things like a simple UI, or a large update like refactoring the backend of the site.

**Update Frequency**

- **Commit Frequency:** Commits were done often, usually when a core feature of part of code was created in a branch. This ensured that I had a constant flow of up-to-date backup versions I could go back to if need be.
- **Merge Strategy:** As mentioned earlier, my feature branches were for core updates and functionality, once these branches had been ‘completed’, they were merged. An example of a completed branch was the login page, once the UI and backend had successfully been generated, the branch would be tested and merged.

**Server/Frontend Structure**

- **Server Code:** The server code was located in the root directory (same level as the src). This server folder contained the main server.js file, alongside all the backend routes, models, and services. In addition this also contains the db.js file for connecting the the database, alongside the socket and peer js files for handling messages and calls respectively.
Under the server route was also folders that contained the uploads of profile pictures and chat image uploads.
- **Frontend Code:** The angular frontend falls under the src>app directory, where all the components, services and interfaces were located and utilised. Further any images or icons were located under the assets folder.

**Data Structures**

**Client-Side Models**

- **Groups:** The Group interface was one of the more utilised frontend interfaces, this consisted of the (GroupID: Number, memberIDs: number\[\], name: string, adminIDs: number\[\], and blacklistedIDs: number\[\]).
- **Channels:** Similar to the Group interface, the Channel interface was a common return type in the frontend typescript files. This data structure consisted of (ChannelID: number, GroupID: number, name: string, members: number\[\]).
- **Reports** The reports data structure was generated near the end of the project to help with managing the reporting of the user, the idea is this might be updated in the future to include some form of attachment of a report reason, and possible messages the user may have sent to be reported. Their data structure is as follows: (reportID: number, userID: number, name: string).
- **Chats** The chats data structure was created in phase 2 of the assignment to serve as a frontend-friendly management of the chat data. As such it follows a similar data strucute to the chat model in the backend, however all relative data to a message is mapped from the foreign keys into the chat model e.g. grabs username, role, profile picture from the userID and maps it to frontend chat model as to not store redudant data. This interface follows as such: (chatID: string, channelID: string, userID: string, username: string, role: string, profilePicture: string, message: string, timestamp: date)

**Server-Side Models**

- **User.js:** Used for describing the user database file; (userID: str, username : str, email: str, password: str, role: str, profilePicture: str)
- **Groups.js:** Used for describing the group database file; (groupID: str, memberIDs: array, name: str, adminIDs: array, blacklistedIDs: array)
- **Channels.js:** Used for describing the channel database file; (channelID: str, groupID: str, name: str, members: array)
- **Report.js:** Used for describing the report database file;  (reportID: str, userID: str)
- **Requests.js:** Used for describing the requests database file;  (requestID: str, groupID: str, userID: str)
- **ChannelRequests.js:** Used for describing the channelRequests database file; (channelRequestID: str, groupID: str, channelID: str, userID: str)
- **Chat.js:** Used for describing the chat database file; (chatID: str, channelID: str, userID: str, message: str, timestamp: str)

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
- **MessageContainerComponent:** The message component handles all images and messages sent by users in a channel. This entails using socket.io to emit messages to other users in real time which is achieved by having a socket service that can emit the messages, and a backend socket.js which will handle these emits and return back the appropriate chat message data.
- **ChannelExploreComponent:** The channel explore component is very similar to the group explore component, having an identical UI. However, this component handles the displaying and joining of channels, passing the userID and relative data to the backend, awaiting a successful response of joining before updating the page.
- **ReportsComponent:** This component handles the rendering of all reported users, it displays all user in the reports.json file, from here a super admin and only super admin, can decide to ignore the report or delete the user from the platform, where all instances of the userID are removed and the reports page is updated.
- **SettingsComponent:** The settings component is by far the largest component as it was designed to be a dynamic overlay for the message container. It has 24 functions, numerous making calls to the backend to do various different things. Some quick examples are creating channels, leaving the group, viewing group members, accepting/declining join requests and many other critical features of the site. The dynamic updating of the html is made achievable through an ngIf statement and a function that virtually ‘changes the route’ by having a currentView variable that decides which ‘page’ to render.
- **VideoCallComponent:** The video call component was created to handle and display both the local and remote video feed of users when creating or joining a channel call. This functions using a peer service and sockets that broadcast join messages to other uses, which in turn tells the peerjs to call each other and auto pickup. From here their video feed is added to an array and loaded onto the screen.

**Services**

**Client-Side Services**

- **RoleService:** The role service is a short quick hand to grab the user’s data from session storage, parse it to JSON and return the users role. This is useful for a few components that check permissions.
- **ChannelService:** The channel service is used to connect the group-container component to the message-container component by using an observer to check for updates on the group-container. One selection of a channel in the group-container, it will trigger the observer and send the selected channelID to the messageComponent that then loads the corresponding data.
- **SettingsService:** The settings service, similar to the channel service, is used to communicate between components, this service in particular uses an observer to communicate when the settings component is toggle on or off.
- **SocketService:** The socket service handles emitting messages and recieving the repsective data from the backend, this is done for both the messaging system and the peer js video call system. Its primary functions are the sendMessage(), joinChannel(), joinroom().
- **PeerService:** The peer service handles a lot more of the video specific connection. This includes dealing with creating a call, answer the call and creating the respective peer connections through peer ids. Further, it handles returning video and screen streams.

**Server-Side Services**

- **UserService:** The user service has six functions, these are:
  - readUser(), returns all users from mongoDB
  - findUser(), returns a user based on a email and password combo
  - findUserByID(), returns a user based on a userID
  - userExists(), returns a user if there exists an account containing a email or username
  - createUser(), adds a new user to the mongoDB
  - updateUserProfilePicture(), uploads/updates a profile picture to a users document
- **GroupService:** the group service has eight main functions, these are:
  - getAllGroups(), returns all groups in mongoDB
  - getGroupsByUserID(), returns all groups a user is in
  - createGroup(), creates a new group in the databse with a name and default member/admin
  - findGroupByID(), returns a specific group model based on a groupID
  - deleteGroup(), delete a group based on its id
  - addMember(), add a users id to a groups member list
  - removeMember(), remove a users id from a groups member list
  - getMembers(), return all members in a specific group
- **ChannelService:** the channel service has six main functions, these are:
  - getAllChannels(), returns an array of a channels
  - getUserChannels(), gets all channels a user is in
  - getChanelById(), returns a single channel from an id
  - getChannelsByGroupID(), returns all channels that have a specific groupID
  - addChannel(), adds a new channel to a group
  - deleteChannel(), removes a channel from a specific group
- **RequestService:** the request service has five main functions, these are:
  - getRequestsByUserID(), returns all requests made by a user
  - findRequest(), find a specific request from a user made to a group
  - createRequest(), creates a new request to a group
  - deleteRequest(), removes a request to a group
  - deleteRequestsByGroupID(), deletes all requests for a specific group
- **ChannelRequestsService:** the channelRequest service has four main functions, these are:
  - readRequests(), returns all channelRequests
  - createRequest(), creates a new channel request for a speciifc channel in a group
  - deleteRequest(), deletes a channel request
  - deleteChannelRequestsByChannelID(), used to delete all channel requests for a channel
- **ReportService:** the report service has two main functions, these are:
  - readReports(), returns all reports
  - deleteReport(), deletes a single specific report

**Routes**

- **App Routes:** The angular frontend has numerous routes to navigate between the different components. The default route ‘’, redirects to the login page. Any other route besides the login and signup page require the authGuard service, which checks if the user has a valid session state.
- **authGuard routes:**
  - **dashboard:** /dashboard, uses dashboardComponent
  - **homepage:** /homepage, uses homepageComponent, navbarComponent, messageContainerComponent, settingsComponent and groupContainerComponent
  - **explore:** /explore, uses the exploreComponent and navbarComponent
  - **channel-explore:** /channel-explore, uses the channelExploreComponent and navbarComponent
  - **group-creation:** /group-creation, uses the groupCreationComponent and the navbarComponent
  - **video-call:** /video-call, uses the videoCallComponent
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

- **server.js:** The server.js file is the main file in the backend, it holds all the routes and their directories. Further it handles the cors and ports (3000).
- **socket.js:** The socket.js file is a backend server file that handles data and connection of websocekts through socket.io.
- **peer.js:** This is a relatively small file that simply handles creating the peer backend server on port 3001.
- **db.js:** The db.js file handles creating the connection to the projects mongo database using an atlas connection URL and the enivroment key.
- **routes folder:** The routes folder contains all the different backend routes that are called in the angular component frontend.
- **models folder:** The models folder contains all the data classes and services needed in the different backend routes.
- **Data folder:** The data folder is responsible for holding all the json data files that contain the storage of local data without a database. **(Deprecated in Phase 2)**
- **Uploads folder:** The upload folder is used to hold images sent in the message system.
- **ProfilePicture folder:** The profilePicture folder is used to hold the images of uploaded profile pictures.

**Global Variables**

- **upload:** The upload variable was a global path directory used in a couple routes when handling sending images in the chat system.
- **profilePicture:** The profile variable once again is a global path directory used when uploading the users profile picture, and once again used when accessing it through the mongo database.

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
- **Socket Handling:** The backend of sockets is handled in one file (socket.js) but can include the peerjs file as well. The main use for this is logging the connections of the backend and frontend with a wss route. A user will connect to a socket when they join a channel, from here a unique socketID is generated and this is used when handling message output from the frontend. A peerID is also used using websockets again for handling video calls and identiying what peers to call and display.

**Component Updates**

- **Channel visualisation:** the message-container is an example of a component that reacts to certain updates in other components alongside the session storage and backend response. When a group and channel combination are selected, the active group the user is in is saved to session storage, from here the backend is called to get member lists, channel names and other appropriate data. 
- **Request Status Update:** Another example of front-end component updating is the requests, as with numerous interactions to the request backend, the front end will update. This can be seen in a user requesting to join a group, where the page will update, and the requested group will be removed from the list. Further, something like accepting a user into a group or channel will also cause an update to the settings component to correctly display the up-to-date requests.
- **Chat Message Updates:** The message-container is also responsible for displaying a live feed of chat messages from users and join/leave messaged automated from the backend. This is done using the socket service which emits phrases on the /socket.io route which is then read by all other users in a timely manner. From here the component will read this data and dynamically display it using the chat interface structure.
