# Project Description

Sweeten project on what it does, what to do

# LoginInfo
```
LoginInfo
├── UserName // Unique name, required
└── Password // String, required
```
Handling the user login to fetch the #Owner and #Contractor data

# Owner

```
Owner
├── ownerId // Unique id from LoginInfo _ID
├── location // with Lat, Lan
├── minBudget
├── maxBudget
├── buildServiceNeed
├── designServiceNeed
└── optContractors 
// optContractors - Array of object, with contractorId that matched the constraints and owner is interested and awarded the project to.

```

# Contractor

```
Contractor
├── contractorId // Unique id from LoginInfo _ID
├── location // with Lat, Lan
├── minBudget
├── maxBudget
├── offersBuildService
├── offersDesignService
├── projectsTaken
└── optOwners 
// projectsTaken - Array of object, with ownerId that has been undertaken, only 3 projects the contractor can take up.
// optOwners - Array of object, with ownerId that matched the constraints and contractor is interested.

```