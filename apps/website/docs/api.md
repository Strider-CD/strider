<a name="top"></a>
# strider v1.0.0

Strider API

# Table of contents

- [Account](#Account)
  - [Change Email](#Change-Email)
  - [Change jobs quantity on page](#Change-jobs-quantity-on-page)
  - [Change Password](#Change-Password)
  - [Delete Provider Account](#Delete-Provider-Account)
  - [Update Provider Account](#Update-Provider-Account)
- [Admin](#Admin)
  - [Get All Users](#Get-All-Users)
  - [Revoke Invite](#Revoke-Invite)
  - [Send Invite](#Send-Invite)
- [Branch](#Branch)
  - [Add Branch](#Add-Branch)
  - [Delete Branch](#Delete-Branch)
  - [Reorder Branches](#Reorder-Branches)
- [Collaborators](#Collaborators)
  - [Add Collaborator](#Add-Collaborator)
  - [Delete Collaborator](#Delete-Collaborator)
  - [Get Collaborators](#Get-Collaborators)
- [Job](#Job)
  - [Get Latest Jobs](#Get-Latest-Jobs)
  - [Start Job](#Start-Job)
- [Provider](#Provider)
  - [Get Project Provider](#Get-Project-Provider)
  - [Update Project Provider](#Update-Project-Provider)
- [Repo](#Repo)
  - [Clear Cache](#Clear-Cache)
  - [Create Repo](#Create-Repo)
  - [Delete Repo](#Delete-Repo)
- [Session](#Session)
  - [Create New Session](#Create-New-Session)
  - [Get Session](#Get-Session)

___


# <a name='Account'></a> Account

## <a name='Change-Email'></a> Change Email
[Back to top](#top)

<p>Changes the email address for the <em>active</em> user (the API user).</p>

```
POST /account/email
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `String` | <p>The new email address. This must be a VALID email address.</p> |

## <a name='Change-jobs-quantity-on-page'></a> Change jobs quantity on page
[Back to top](#top)

<p>Changes the jobs quantity on page for the <em>active</em> user (the API user).</p>

```
POST /account/jobsQuantityOnPage
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| quantity | `Number` | <p>The new value.</p> |

## <a name='Change-Password'></a> Change Password
[Back to top](#top)

<p>Changes the password for the <em>active</em> user (the API user).</p>

```
POST /account/password
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| password | `String` | <p>The new password, which must be at least 6 characters long.</p>_Size range: 6.._<br> |

## <a name='Delete-Provider-Account'></a> Delete Provider Account
[Back to top](#top)

<p>Deletes a provider account for the <em>active</em> user (the API user).</p>

```
DELETE /account/:provider/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| provider | `String` | <p>Type of provider, e.g. github</p> |
| id | `Number` | <p>Unique provider identification</p> |

## <a name='Update-Provider-Account'></a> Update Provider Account
[Back to top](#top)

<p>Updates a provider account for the <em>active</em> user (the API user).</p>

```
PUT /account/:provider/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| provider | `String` | <p>Type of provider, e.g. github</p> |
| id | `Number` | <p>Unique provider identification</p> |

# <a name='Admin'></a> Admin

## <a name='Get-All-Users'></a> Get All Users
[Back to top](#top)

<p>Retrieves a list of all Strider users.</p>

```
GET /admin/users
```

### Examples
CURL Example:

```curl
curl -X GET http://localhost/admin/users
```

## <a name='Revoke-Invite'></a> Revoke Invite
[Back to top](#top)

<p>Revokes a previously sent Strider invitation.</p>

```
POST /admin/invite/revoke
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| invite_code | `String` | <p>The invite code/token of the invite being revoked.</p> |

### Examples
CURL Example:

```curl
curl -X POST -d invite_code=xoxox http://localhost/invite/revoke
```

## <a name='Send-Invite'></a> Send Invite
[Back to top](#top)

<p>Create &amp; email a new Strider invite.</p>

```
POST /admin/invite/new
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| invite_code | `String` | <p>The invite code/token to use in the invitation</p> |
| email | `String` | <p>The email address of the new user being invited</p> |

### Examples
CURL Example:

```curl
curl -X POST -d invite_code=xoxox -d email=new_guy@strider-cd.com http://localhost/invite/new
```

# <a name='Branch'></a> Branch

## <a name='Add-Branch'></a> Add Branch
[Back to top](#top)

<p>Add a new branch for a project.</p>

```
POST /:org/:repo/branches
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `String` | <p>The name of the new branch</p> |
| cloneName | `String` | <p>The name of the cloned branch</p> |

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X POST -d name=newbranch http://localhost/api/strider-cd/strider/branches
```

## <a name='Delete-Branch'></a> Delete Branch
[Back to top](#top)

<p>Deletes a branch from a project</p>

```
DELETE /:org/:repo/branches
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `String` | <p>The name of the branch to delete</p> |

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X DELETE -d name=mybranch http://localhost/api/strider-cd/strider/branches
```

## <a name='Reorder-Branches'></a> Reorder Branches
[Back to top](#top)

<p>Updates the branch order for a project.</p>

```
PUT /:org/:repo/branches
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| branches | `String` | <p>The new branch order, comma delimited</p> |

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X PUT -d branches=master,testing http://localhost/api/strider-cd/strider/branches
```

# <a name='Collaborators'></a> Collaborators

## <a name='Add-Collaborator'></a> Add Collaborator
[Back to top](#top)

<p>Add a new collaborator to a repository/project.</p>

```
POST /:org/:repo/collaborators
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `String` | <p>Email address to add. If the user is not registered with Strider, we will send them an invite. If they are already registered, they will receive a notification of access.</p> |
| access | `Number` | <p>Access level to grant to the new collaborator. This can be <code>0</code>, for read only access, or <code>2</code> for admin access.</p>_Default value: 0_<br> |

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X GET -d '{"email":"new_guy@strider-cd.com", "access":2}' http://localhost/api/strider-cd/strider/collaborators
```

## <a name='Delete-Collaborator'></a> Delete Collaborator
[Back to top](#top)

<p>Remove a collaborator from a repository/project.</p>

```
DELETE /:org/:repo/collaborators
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `String` | <p>Email address to remove from the repo/project.</p> |

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X DELETE -d '{"email":"old_guy@strider-cd.com"}' http://localhost/api/strider-cd/strider/collaborators
```

## <a name='Get-Collaborators'></a> Get Collaborators
[Back to top](#top)

<p>Gets a list of collaborators for a project</p>

```
GET /:org/:repo/collaborators
```

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X GET http://localhost/api/strider-cd/strider/collaborators
```

# <a name='Job'></a> Job

## <a name='Get-Latest-Jobs'></a> Get Latest Jobs
[Back to top](#top)

<p>Return JSON object containing the most recent build status for each configured repo This function is used to build the main dashboard status page. The result is separated into <code>{public: [], yours: []}</code>.</p> <p>Note: the private ones are just ones that the current user is a collaborator on and are not necessarily private</p>

```
GET /api/jobs
```

### Examples
CURL Example:

```curl
curl -X GET http://localhost/api/jobs
```

## <a name='Start-Job'></a> Start Job
[Back to top](#top)

<p>Executes a strider test and, optionally, deployment.</p>

```
POST /:org/:repo/start
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| type | `String` | <p>Denotes the type of job to run. This can be &quot;TEST_ONLY&quot;, which indicates that only the test stages of the job should be executed or &quot;TEST_AND_DEPLOY&quot;, which indicates that all stages should be executed.</p>_Default value: TEST_ONLY_<br> |
| branch | `String` | <p>Indicates which branch configuration should be executed.</p>_Default value: master_<br> |
| message | `String` | <p>An optional message to include as the title of the execution.</p>_Default value: Manually Retesting/Redeploying_<br> |

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X POST http://localhost/api/strider-cd/strider/start
```

# <a name='Provider'></a> Provider

## <a name='Get-Project-Provider'></a> Get Project Provider
[Back to top](#top)

<p>Get the provider config for the specified project</p>

```
GET /:org/:repo/provider
```

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X GET http://localhost:3000/strider-cd/strider/provider
```

## <a name='Update-Project-Provider'></a> Update Project Provider
[Back to top](#top)

<p>Update a project's provider</p>

```
POST /:org/:repo/provider
```

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X POST http://localhost:3000/strider-cd/strider/provider
```

# <a name='Repo'></a> Repo

## <a name='Clear-Cache'></a> Clear Cache
[Back to top](#top)

<p>Clears/invalidates the cache for a project.</p>

```
DELETE /:org/:repo/cache
```

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X DELETE http://localhost/api/strider-cd/strider/cache
```

## <a name='Create-Repo'></a> Create Repo
[Back to top](#top)

<p>Create a new project for a repo.</p>

```
PUT /:org
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| name | `String` | <p>The name of the new branch</p> |
| display_name | `String` | <p>Human-readable project name</p> |
| display_url | `String` | <p>The URL for the repo (e.g. Github homepage)</p> |
| public | `Boolean` | <p>Whether this project is public or not.</p>_Default value: false_<br> |
| prefetch_config | `Boolean` | <p>Whether the strider.json should be fetched in advance.</p>_Default value: true_<br> |
| account | `String` | <p>The ID of provider account</p> |
| repo_id | `String` | <p>The ID of the repo</p> |
| provider | `Object` | <p>A json object with 'id' and 'config' properties.</p> |

## <a name='Delete-Repo'></a> Delete Repo
[Back to top](#top)

<p>Deletes a repository/project. Also archives all jobs (marks as archived in DB which makes them hidden).</p>

```
DELETE /:org/:repo
```

### Parameters - `Request URL Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| org | `String` | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p> |
| repo | `String` | <p>The project's repository name.</p> |

### Examples
CURL Example:

```curl
curl -X DELETE http://localhost/api/strider-cd/strider
```

# <a name='Session'></a> Session

## <a name='Create-New-Session'></a> Create New Session
[Back to top](#top)

<p>Creates a new user session after validating an email address and password pair.</p>

```
POST /api/session
```

### Parameters - `Request Body Parameters`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| email | `String` | <p>The email address to login as (which is used as the username).</p> |
| password | `String` | <p>The user's password.</p> |

### Examples
CURL Example:

```curl
curl -X POST -d email=me@me.com -d password=mypass http://localhost/api/session
```

## <a name='Get-Session'></a> Get Session
[Back to top](#top)

<p>Gets the current session information</p>

```
GET /api/session
```

### Examples
CURL Example:

```curl
curl -X GET http://localhost/api/session
```

