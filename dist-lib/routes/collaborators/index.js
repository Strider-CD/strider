const _ = require('lodash');
const express = require('express');
const middleware = require('../../middleware');
const auth = require('../../auth');
const models = require('../../models');
const utils = require('../../utils');
const api = require('./api');
const router = new express.Router();
const User = models.User;
router
    .route('/:org/:repo/collaborators/')
    .all(auth.requireUserOr401, middleware.project, auth.requireProjectAdmin)
    /**
     * @api {get} /:org/:repo/collaborators Get Collaborators
     * @apiUse ProjectReference
     * @apiDescription Gets a list of collaborators for a project
     * @apiName GetCollaborators
     * @apiGroup Collaborators
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} CURL Example:
     *    curl -X GET http://localhost/api/strider-cd/strider/collaborators
     */
    .get(function getCollab(req, res) {
    const project = `${req.params.org}/${req.params.repo}`;
    User.collaborators(project, 0, function (err, users) {
        if (err)
            return res.status(500).send(`Failed to get users: ${err.message}`);
        const results = [];
        for (let i = 0; i < users.length; i++) {
            const p = _.find(users[i].projects, function (p) {
                return p.name === project.toLowerCase();
            });
            results.push({
                type: 'user',
                id: users[i]._id,
                email: users[i].email,
                access_level: p.access_level,
                gravatar: utils.gravatar(users[i].email),
            });
        }
        res.send(results);
    });
})
    /**
     * @api {post} /:org/:repo/collaborators Add Collaborator
     * @apiUse ProjectReference
     * @apiPermission ProjectAdmin
     * @apiDescription Add a new collaborator to a repository/project.
     * @apiName AddCollaborator
     * @apiGroup Collaborators
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} CURL Example:
     *  curl -X GET -d '{"email":"new_guy@strider-cd.com", "access":2}' http://localhost/api/strider-cd/strider/collaborators
     *
     * @apiParam (RequestBody) {String} email Email address to add. If the user is
     *  not registered with Strider, we will send them an invite. If they are already
     *  registered, they will receive a notification of access.
     * @apiParam (RequestBody) {Number} access=0 Access level to grant to the
     *  new collaborator. This can be `0`, for read only access, or `2` for admin access.
     */
    .post(middleware.requireBody(['email']), function addCollab(req, res) {
    const project = `${req.params.org}/${req.params.repo}`;
    const accessLevel = req.body.access || 0;
    const email = req.body.email;
    api.add(project, email, accessLevel, req.user, function (err, existed, alreadyInvited) {
        if (err)
            return res
                .status(500)
                .send(`Failed to add collaborator: ${err.message}`);
        if (existed)
            return res.send({ created: true, message: 'Collaborator added' });
        if (!alreadyInvited)
            return res.send({
                created: false,
                message: `An invite was sent to ${email}. They will become a collaborator when they create an account.`,
            });
        res.send({
            created: false,
            message: `An invitation email has already been sent to ${email}. They will become a collaborator when they create an account.`,
        });
    });
})
    /**
     * @api {delete} /:org/:repo/collaborators Delete Collaborator
     * @apiUse ProjectReference
     * @apiPermission ProjectAdmin
     * @apiDescription Remove a collaborator from a repository/project.
     * @apiName DeleteCollaborator
     * @apiGroup Collaborators
     * @apiVersion 1.0.0
     *
     * @apiExample {curl} CURL Example:
     *    curl -X DELETE -d '{"email":"old_guy@strider-cd.com"}' http://localhost/api/strider-cd/strider/collaborators
     *
     * @apiParam (RequestBody) {String} email Email address to remove from the repo/project.
     */
    .delete(middleware.requireBody(['email']), function delCollab(req, res) {
    const project = `${req.params.org}/${req.params.repo}`;
    const email = req.body.email;
    if (req.project.creator.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).send('Cannot remove the project creator');
    }
    if (req.user.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).send('Cannot remove yourself');
    }
    api.del(project, email, function (err) {
        if (err)
            return res.status(500).send(err.message);
        res.send({ status: 'removed' });
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map