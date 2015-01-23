'use strict';

var assert = require('assert');
var should = require('should');
var httpMocks = require('node-mocks-http');
var auth = require('../../lib/auth');
var middleware = require('../../lib/middleware');

describe('middleware', function () {
  describe('#require_admin()', function () {
    it('should only be accessible to admin user', function () {
      var mockReq = httpMocks.createRequest();
      var mockRes = httpMocks.createResponse();

      mockReq.user = {};

      middleware.require_admin(mockReq, mockRes, function () {
        mockRes.statusCode = 200;
      });

      mockRes.statusCode.should.eql(401);
      mockReq.user = { account_level: 1 };

      middleware.require_admin(mockReq, mockRes, function () {
        mockRes.statusCode = 200;
      });

      mockRes.statusCode.should.eql(200);
    });
  });

  describe('#require_auth()', function () {
    it('should only be accessible to authenticated user', function () {
      var mockReq = httpMocks.createRequest();
      var mockRes = httpMocks.createResponse();

      middleware.require_auth(mockReq, mockRes, function () {
        mockRes.statusCode = 401;
      });

      mockRes.statusCode.should.eql(401);

      mockReq.user = { account_level: 1 };
      middleware.require_admin(mockReq, mockRes, function () {
        mockRes.statusCode = 200;
      });

      mockRes.statusCode.should.eql(200);
    });
  });

  describe('#requireParams()', function () {
    it('should fallthrough if all params are present', function () {
      var mockReq = httpMocks.createRequest({
        params: {
          org: 'beyondfog',
          repo: 'strider'
        }
      });
      var mockRes = httpMocks.createResponse();

      middleware.requireParams(['org', 'repo'])(mockReq, mockRes, function () {
        mockRes.statusCode = 200;
      });

      mockRes.statusCode.should.eql(200);
    });

    it('should error if at least one params is missing', function () {
      var mockReq = httpMocks.createRequest({
        params: {
          org: 'beyondfog',
        },
      });
      var mockRes = httpMocks.createResponse();

      middleware.requireParams(['org', 'repo'])(mockReq, mockRes, function () {
        mockRes.statusCode = 200;
      });

      mockRes.statusCode.should.eql(400);
      var data = JSON.parse(mockRes._getData());
      data.errors.length.should.eql(1);
    });

    it('should error if multiple params are missing', function () {
      var mockReq = httpMocks.createRequest();
      var mockRes = httpMocks.createResponse();

      middleware.requireParams(['org', 'repo'])(mockReq, mockRes, function () {
        mockRes.statusCode = 200;
      });

      mockRes.statusCode.should.eql(400);
      var data = JSON.parse(mockRes._getData());
      data.errors.length.should.eql(2);
    });
  });
});
