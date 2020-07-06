<a name="top"></a>
# strider v1.0.0

Strider API

- [Account](#account)
	- [Change Email](#change-email)
	- [Change Password](#change-password)
	- [Delete Provider Account](#delete-provider-account)
	- [Update Provider Account](#update-provider-account)
	
- [Admin](#admin)
	- [Get All Users](#get-all-users)
	- [Revoke Invite](#revoke-invite)
	- [Send Invite](#send-invite)
	
- [Branch](#branch)
	- [Add Branch](#add-branch)
	- [Delete Branch](#delete-branch)
	- [Reorder Branches](#reorder-branches)
	
- [Collaborators](#collaborators)
	- [Add Collaborator](#add-collaborator)
	- [Delete Collaborator](#delete-collaborator)
	- [Get Collaborators](#get-collaborators)
	
- [Job](#job)
	- [Get Latest Jobs](#get-latest-jobs)
	- [Start Job](#start-job)
	
- [Provider](#provider)
	- [Get Project Provider](#get-project-provider)
	- [Update Project Provider](#update-project-provider)
	
- [Repo](#repo)
	- [Clear Cache](#clear-cache)
	- [Create Repo](#create-repo)
	- [Delete Repo](#delete-repo)
	
- [Session](#session)
	- [Create New Session](#create-new-session)
	- [Get Session](#get-session)
	


# Account

## Change Email
[Back to top](#top)

<p>Changes the email address for the <em>active</em> user (the API user).</p>

	POST /account/email



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| email | String | <p>The new email address. This must be a VALID email address.</p>|



## Change Password
[Back to top](#top)

<p>Changes the password for the <em>active</em> user (the API user).</p>

	POST /account/password



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| password | String | <p>The new password, which must be at least 6 characters long.</p>_Size range: 6.._<br>|



## Delete Provider Account
[Back to top](#top)

<p>Deletes a provider account for the <em>active</em> user (the API user).</p>

	DELETE /account/:provider/:id



### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| provider | String | <p>Type of provider, e.g. github</p>|
| id | Number | <p>Unique provider identification</p>|



## Update Provider Account
[Back to top](#top)

<p>Updates a provider account for the <em>active</em> user (the API user).</p>

	PUT /account/:provider/:id



### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| provider | String | <p>Type of provider, e.g. github</p>|
| id | Number | <p>Unique provider identification</p>|



# Admin

## Get All Users
[Back to top](#top)

<p>Retrieves a list of all Strider users.</p>

	GET /admin/users

### Examples

CURL Example:

```
curl -X GET http://localhost/admin/users
```



## Revoke Invite
[Back to top](#top)

<p>Revokes a previously sent Strider invitation.</p>

	POST /admin/invite/revoke



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| invite_code | String | <p>The invite code/token of the invite being revoked.</p>|
### Examples

CURL Example:

```
curl -X POST -d invite_code=xoxox http://localhost/invite/revoke
```



## Send Invite
[Back to top](#top)

<p>Create &amp; email a new Strider invite.</p>

	POST /admin/invite/new



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| invite_code | String | <p>The invite code/token to use in the invitation</p>|
| email | String | <p>The email address of the new user being invited</p>|
### Examples

CURL Example:

```
curl -X POST -d invite_code=xoxox -d email=new_guy@strider-cd.com http://localhost/invite/new
```



# Branch

## Add Branch
[Back to top](#top)

<p>Add a new branch for a project.</p>

	POST /:org/:repo/branches



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| name | String | <p>The name of the new branch</p>|
| cloneName | String | <p>The name of the cloned branch</p>|

### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X POST -d name=newbranch http://localhost/api/strider-cd/strider/branches
```



## Delete Branch
[Back to top](#top)

<p>Deletes a branch from a project</p>

	DELETE /:org/:repo/branches



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| name | String | <p>The name of the branch to delete</p>|

### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X DELETE -d name=mybranch http://localhost/api/strider-cd/strider/branches
```



## Reorder Branches
[Back to top](#top)

<p>Updates the branch order for a project.</p>

	PUT /:org/:repo/branches



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| branches | String | <p>The new branch order, comma delimited</p>|

### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X PUT -d branches=master,testing http://localhost/api/strider-cd/strider/branches
```



# Collaborators

## Add Collaborator
[Back to top](#top)

<p>Add a new collaborator to a repository/project.</p>

	POST /:org/:repo/collaborators



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| email | String | <p>Email address to add. If the user is not registered with Strider, we will send them an invite. If they are already registered, they will receive a notification of access.</p>|
| access | Number | <p>Access level to grant to the new collaborator. This can be <code>0</code>, for read only access, or <code>2</code> for admin access.</p>_Default value: 0_<br>|

### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X GET -d '{"email":"new_guy@strider-cd.com", "access":2}' http://localhost/api/strider-cd/strider/collaborators
```



## Delete Collaborator
[Back to top](#top)

<p>Remove a collaborator from a repository/project.</p>

	DELETE /:org/:repo/collaborators



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| email | String | <p>Email address to remove from the repo/project.</p>|

### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X DELETE -d '{"email":"old_guy@strider-cd.com"}' http://localhost/api/strider-cd/strider/collaborators
```



## Get Collaborators
[Back to top](#top)

<p>Gets a list of collaborators for a project</p>

	GET /:org/:repo/collaborators



### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X GET http://localhost/api/strider-cd/strider/collaborators
```



# Job

## Get Latest Jobs
[Back to top](#top)

<p>Return JSON object containing the most recent build status for each configured repo This function is used to build the main dashboard status page. The result is separated into <code>{public: [], yours: []}</code>.</p> <p>Note: the private ones are just ones that the current user is a collaborator on and are not necessarily private</p>

	GET /api/jobs

### Examples

CURL Example:

```
curl -X GET http://localhost/api/jobs
```



## Start Job
[Back to top](#top)

<p>Executes a strider test and, optionally, deployment.</p>

	POST /:org/:repo/start



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| type | String | <p>Denotes the type of job to run. This can be &quot;TEST_ONLY&quot;, which indicates that only the test stages of the job should be executed or &quot;TEST_AND_DEPLOY&quot;, which indicates that all stages should be executed.</p>_Default value: TEST_ONLY_<br>|
| branch | String | <p>Indicates which branch configuration should be executed.</p>_Default value: master_<br>|
| message | String | <p>An optional message to include as the title of the execution.</p>_Default value: Manually Retesting/Redeploying_<br>|

### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X POST http://localhost/api/strider-cd/strider/start
```



# Provider

## Get Project Provider
[Back to top](#top)

<p>Get the provider config for the specified project</p>

	GET /:org/:repo/provider



### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X GET http://localhost:3000/strider-cd/strider/provider
```



## Update Project Provider
[Back to top](#top)

<p>Update a project's provider</p>

	POST /:org/:repo/provider



### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X POST http://localhost:3000/strider-cd/strider/provider
```



# Repo

## Clear Cache
[Back to top](#top)

<p>Clears/invalidates the cache for a project.</p>

	DELETE /:org/:repo/cache



### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X DELETE http://localhost/api/strider-cd/strider/cache
```



## Create Repo
[Back to top](#top)

<p>Create a new project for a repo.</p>

	PUT /:org



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| name | String | <p>The name of the new branch</p>|
| display_name | String | <p>Human-readable project name</p>|
| display_url | String | <p>The URL for the repo (e.g. Github homepage)</p>|
| public | Boolean | <p>Whether this project is public or not.</p>_Default value: false_<br>|
| prefetch_config | Boolean | <p>Whether the strider.json should be fetched in advance.</p>_Default value: true_<br>|
| account | String | <p>The ID of provider account</p>|
| repo_id | String | <p>The ID of the repo</p>|
| provider | Object | <p>A json object with 'id' and 'config' properties.</p>|



## Delete Repo
[Back to top](#top)

<p>Deletes a repository/project. Also archives all jobs (marks as archived in DB which makes them hidden).</p>

	DELETE /:org/:repo



### Request URL Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| org | String | <p>The organization name for the project.  This is usually a GitHub user or organization name (e.g. &quot;strider&quot; in &quot;strider-cd/strider&quot;) but may vary from one project provider to another. (as another example, in GitLab this refers to the repository's &quot;group&quot;).</p>|
| repo | String | <p>The project's repository name.</p>|
### Examples

CURL Example:

```
curl -X DELETE http://localhost/api/strider-cd/strider
```



# Session

## Create New Session
[Back to top](#top)

<p>Creates a new user session after validating an email address and password pair.</p>

	POST /api/session



### Request Body Parameters Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
| email | String | <p>The email address to login as (which is used as the username).</p>|
| password | String | <p>The user's password.</p>|
### Examples

CURL Example:

```
curl -X POST -d email=me@me.com -d password=mypass http://localhost/api/session
```



## Get Session
[Back to top](#top)

<p>Gets the current session information</p>

	GET /api/session

### Examples

CURL Example:

```
curl -X GET http://localhost/api/session
```




