# Getting Started

By following the instructions below you can get Strider setup on your local machine.


## Assumptions

- You have all of your [required dependencies](requirements.md) installed.
- You have mongodb running locally on the default ports.
- Port `3000` is exposed to the internet.
- You have your public IP ready to be used.


## Installation

Use `npm` to install Strider as a global npm module.

```sh
npm install -g strider
```

This will give you access to the `strider` command, which we will use to start Strider
in a bit.

## Add Initial User

Before we can run Strider, we must setup the first admin user, which will help use
continue the setup and invite more users.

Run the following command to start adding the user:

```sh
strider addUser
```

This will bring up a prompt that will ask you some basic details about
your first user. Make sure to make this first user an admin via the `isAdmin` option.

### LDAP

If you want to authorize to your ldap server you can do so by adding the `ldap.json`
config file to Strider root directory. The config file should look like so:  

```json
 {
    "url": "ldap://host:port",
    "baseDN": "dnString",
    "username": "username",
    "password": "password",
    // If you want to set a admin group -- remove this comment
    "adminDN": "dnString"
 }
```


## Starting Strider

Now that we have our administrator setup, we can start Strider.

```sh
SERVER_NAME=<yourip>:3000 strider
```
