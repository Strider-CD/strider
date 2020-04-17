(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";function AccountController(e,c){e.user=user,e.providers=providers,e.accounts=setupAccounts(e.user);var s=c.location.hash;s&&$('a[href="'+s+'"]').tab("show"),e.deleteAccount=function(c){if(c.unsaved){var s=e.accounts[c.provider].indexOf(c);return e.accounts[c.provider].splice(s,1),s=e.user.accounts.indexOf(c),e.user.accounts.splice(s,1),void e.success("Account removed")}$.ajax("/api/account/"+c.provider+"/"+c.id,{type:"DELETE",success:function(){var s=e.accounts[c.provider].indexOf(c);e.accounts[c.provider].splice(s,1),s=e.user.accounts.indexOf(c),e.user.accounts.splice(s,1),e.success("Account removed",!0)},error:function(c){e.error(c&&c.responseText?c.responseText:"Failed to remove account",!0)}})},e.addAccount=function(c){var s=0;e.accounts[c]||(e.accounts[c]=[]);for(var a=0;a<e.accounts[c].length;a++){var o=parseInt(e.accounts[c][a].id,10);o>=s&&(s=o+1)}var n={id:s,provider:c,title:c+" "+s,last_updated:new Date,config:{},cache:[],unsaved:!0};e.accounts[c].push(n),e.user.accounts.push(n)},e.saveAccount=function(c,s,a){$.ajax("/api/account/"+c+"/"+s.id,{type:"PUT",data:JSON.stringify(s),contentType:"application/json",error:function(){e.error("Unable to save account",!0)},success:function(){delete s.unsaved,a(),e.success("Account saved",!0)}})},e.changePassword=function(){$.ajax("/api/account/password",{data:{password:e.password},dataType:"json",error:function(){e.error("Unable to change password",!0)},success:function(){e.password="",e.confirm_password="",e.success("Password changed",!0)},type:"POST"})},e.changeEmail=function(){$.ajax("/api/account/email",{data:{email:e.user.email},dataType:"json",error:function(c){var s=$.parseJSON(c.responseText);e.error("Failed to change email: "+s.errors[0].message,!0)},success:function(){e.success("Email successfully changed",!0)},type:"POST"})},e.changeJobsQuantityOnPage=function(){$.ajax("/api/account/jobsQuantityOnPage",{type:"POST",data:{quantity:e.user.jobsQuantityOnPage},dataType:"json",error:function(c){var s=$.parseJSON(c.responseText);e.error("Failed to change jobs quantity on build page: "+s.errors[0].message,!0)},success:function(){e.success("Jobs quantity on build page successfully changed",!0)}})}}function setupAccounts(e){var c={};if(!e.accounts||!e.accounts.length)return c;for(var s=0;s<e.accounts.length;s++)c[e.accounts[s].provider]||(c[e.accounts[s].provider]=[]),c[e.accounts[s].provider].push(e.accounts[s]);return c}var $=require("jquery"),user=global.user||{},providers=global.providers||{};module.exports=AccountController;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"jquery":85}],2:[function(require,module,exports){
"use strict";function JobController(o,t,n){var r=n.id.split("-")[1];o.$watch('user.jobplugins["'+r+'"]',function(t){o.config=t})}module.exports=JobController;
},{}],3:[function(require,module,exports){
"use strict";function ProviderController(n,o,c){var t=c.id.split("-")[2];n.$watch("account.config",function(o){n.config=o}),n.save=function(){n.saving=!0,n.saveAccount(t,n.account,function(){n.saving=!1})}}module.exports=ProviderController;
},{}],4:[function(require,module,exports){
"use strict";var angular=require("angular"),AccountController=require("./controllers/account"),ProviderController=require("./controllers/provider"),JobController=require("./controllers/job"),interpolate=require("../utils/interpolate"),app=angular.module("account",["alerts"]).config(["$interpolateProvider",interpolate]).controller("AccountController",["$scope","$window",AccountController]).controller("Account.ProviderController",["$scope","$element","$attrs",ProviderController]).controller("Account.JobController",["$scope","$element","$attrs",JobController]);module.exports=app;
},{"../utils/interpolate":38,"./controllers/account":1,"./controllers/job":2,"./controllers/provider":3,"angular":50}],5:[function(require,module,exports){
"use strict";module.exports=function(e,s){e.message=null,e.error=function(t,o){e.message={text:s.trustAsHtml(t),type:"error",showing:!0},o&&e.$root.$digest()},e.info=function(t,o){e.message={text:s.trustAsHtml(t),type:"info",showing:!0},o&&e.$root.$digest()};var t=null,o=null;e.success=function(n,u,i){t&&(clearTimeout(t),t=null),o&&(clearTimeout(o),o=null),e.message={text:s.trustAsHtml("<strong>Done.</strong> "+n),type:"success",showing:!0},i||(t=setTimeout(function(){e.clearMessage(),e.$digest()},5e3)),u&&e.$root.$digest()},e.clearMessage=function(){o&&clearTimeout(o),e.message&&(e.message.showing=!1),o=setTimeout(function(){o=null,e.message=null,e.$digest()},1e3)}};
},{}],6:[function(require,module,exports){
"use strict";var angular=require("angular"),AlertsController=require("./controllers/alerts"),app=angular.module("alerts",[]).controller("AlertsController",["$scope","$sce",AlertsController]);module.exports=app;
},{"./controllers/alerts":5,"angular":50}],7:[function(require,module,exports){
"use strict";var AU=require("ansi_up"),ansi_up=new AU.default,stripAnsi=require("strip-ansi");module.exports=function(){return function(r,e){if(!r)return"";if(r.length>1e5)return r;var n=/^[^\n]*\r[^\n]/.test(r);return r=r.replace(/^[^\n\r]*\u001b\[2K/gm,"").replace(/\u001b\[K[^\n\r]*/g,"").replace(/[^\n]*\r([^\n])/g,"$1").replace(/^[^\n]*\u001b\[0G/gm,""),n&&(r="\r"+r),e?stripAnsi(r):ansi_up.ansi_to_html(r)}};
},{"ansi_up":51,"strip-ansi":106}],8:[function(require,module,exports){
"use strict";var angular=require("angular"),ansi=require("./filters/ansi");angular.module("ansi",[]).filter("ansi",ansi);
},{"./filters/ansi":7,"angular":50}],9:[function(require,module,exports){
(function (global){
"use strict";require("bootstrap");var $=require("jquery"),_=require("lodash"),angular=require("angular"),$navbar=$(".navbar");require("angular-route"),$navbar.find("li").removeClass("active"),$navbar.find('a[href="'+global.location.pathname+'"]').parent().addClass("active"),$("#layout-header").hide(),$("#invite-box").height($("#signup-box").height()),require("ui-bootstrap"),require("ui-codemirror"),require("./account"),require("./config"),require("./plugin-manager"),require("./job-status"),require("./dashboard"),require("./projects"),require("./alerts"),require("./ansi"),require("./moment");var app=angular.module("app",["config","account","plugin-manager","job-status","dashboard","projects"]);global.app=app,global.$=$,global.angular=angular,global._=_;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./account":4,"./alerts":6,"./ansi":8,"./config":19,"./dashboard":21,"./job-status":25,"./moment":30,"./plugin-manager":34,"./projects":37,"angular":50,"angular-route":48,"bootstrap":116,"jquery":85,"lodash":86,"ui-bootstrap":110,"ui-codemirror":111}],10:[function(require,module,exports){
(function (global){
"use strict";function BranchesController(r){r.branchName="",r.branches=branches,r.allBranches=allBranches,r.remove=function(e){confirm("Are you sure you want to remove "+e.name+"?")&&(e.loading=!0,r.clearMessage(),$.ajax({url:"/"+r.project.name+"/branches/",type:"DELETE",data:{name:e.name},success:function(){remove(r.branches,e),r.success(e.name+" is no longer a configured branch.",!0)},error:function(n,a,s){if(e.loading=!1,n&&n.responseText){var c=$.parseJSON(n.responseText);r.error("Error deleting branch: "+c.errors[0],!0)}else r.error("Error deleting branch: "+s,!0)}}))},r.add=function(){var e={name:r.branchName};$.ajax({url:"/"+r.project.name+"/branches/",type:"POST",data:e,dataType:"json",success:function(e){r.branchName="",e.created&&r.branches.push(e.branch),r.success(e.message,!0,!e.created)},error:function(e,n,a){if(e&&e.responseText){var s=$.parseJSON(e.responseText);r.error("Error adding branch: "+s.errors[0],!0)}else r.error("Error adding branch: "+a,!0)}})},r.changeBranchOrder=function(e){r.branches=e,$.ajax({url:"/"+r.project.name+"/branches/",type:"PUT",data:JSON.stringify({branches:e}),contentType:"application/json",dataType:"json",success:function(e){r.success(e.message,!0,!1)},error:function(e,n,a){if(e&&e.responseText){var s=$.parseJSON(e.responseText);r.error("Error changing order of branch: "+s.errors[0],!0)}else r.error("Error changing order of branch: "+a,!0)}})},r.clone=function(e){var n=prompt("Enter name of the clone",e.name);if(n){var a={name:e.name,cloneName:n};$.ajax({url:"/"+r.project.name+"/branches/",type:"POST",data:a,dataType:"json",success:function(e){r.branchName="",e.created&&r.branches.push(e.branch),r.success(e.message,!0,!e.created)},error:function(e,n,a){if(e&&e.responseText){var s=$.parseJSON(e.responseText);r.error("Error cloning branch: "+s.errors[0],!0)}else r.error("Error cloning branch: "+a,!0)}})}}}function remove(r,e){r.splice(r.indexOf(e),1)}var $=require("jquery"),branches=global.branches||[],allBranches=global.allBranches||[];module.exports=BranchesController;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"jquery":85}],11:[function(require,module,exports){
(function (global){
"use strict";function CollaboratorsController(r){r.new_email="",r.new_access=0,r.collaborators=global.collaborators||[],r.remove=function(e){confirm("Are you sure you want to remove "+e.email+"?")&&(e.loading=!0,r.clearMessage(),$.ajax({url:"/"+r.project.name+"/collaborators/",type:"DELETE",data:{email:e.email},success:function(){remove(r.collaborators,e),r.success(e.email+" is no longer a collaborator on this project.",!0)},error:function(o,a,s){if(e.loading=!1,o&&o.responseText){var l=$.parseJSON(o.responseText);r.error("Error deleting collaborator: "+l.errors[0],!0)}else r.error("Error deleting collaborator: "+s,!0)}}))},r.add=function(){var e={email:r.new_email,access:r.new_access||0,gravatar:r.gravatar(r.new_email),owner:!1};$.ajax({url:"/"+r.project.name+"/collaborators/",type:"POST",data:e,dataType:"json",success:function(o){r.new_access=0,r.new_email="",o.created&&r.collaborators.push(e),r.success(o.message,!0,!o.created)},error:function(e,o,a){if(e&&e.responseText){var s=$.parseJSON(e.responseText);r.error("Error adding collaborator: "+s.errors[0],!0)}else r.error("Error adding collaborator: "+a,!0)}})}}function remove(r,e){r.splice(r.indexOf(e),1)}var $=require("jquery");module.exports=CollaboratorsController;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"jquery":85}],12:[function(require,module,exports){
(function (global){
"use strict";function ConfigController(n){function r(r){$(".tab-pane.active, .nav-tabs > li.active").removeClass("active"),$("#"+r).addClass("active"),n.selectedTab=r}function e(r){var e=_.find(n.branches,{name:r});e&&(n.branch=e),global.sessionStorage.setItem("branchName",n.branch.name),o("tab-branch-settings",n.branch)}function o(n,e){_.isString(n)||(n=e&&"master"===e.name?"tab-project":"tab-basic"),$("#"+n+"-tab-handle").tab("show"),r(n),$("a[href='#"+n+"']").tab("show")}function a(){var r=n.branch.plugins;n.configured[n.branch.name]={};for(var e=0;e<r.length;e++)n.configured[n.branch.name][r[e].id]=!0;t()}function t(){for(var r=n.branch.plugins,e=n.branch,o=n.project,a=[],t=0;t<r.length;t++)a.push({id:r[t].id,enabled:r[t].enabled,showStatus:r[t].showStatus});saveProjectConfig({plugin_order:a},e,o,function(r){if(r)return n.error("Error saving plugin order on branch "+e.name+": "+r,!0);n.success("Plugin order on branch "+e.name+" saved.",!0)})}function i(r){var e;if(n.configured[r.name]={},n.configs[r.name]={},n.runnerConfigs[r.name]={},n.disabled_plugins[r.name]=[],!r.mirror_master){e=r.plugins;for(var o=0;o<e.length;o++)n.configured[r.name][e[o].id]=!0,n.configs[r.name][e[o].id]=e[o]}for(var a in n.plugins)n.configured[r.name][a]||(n.configs[r.name][a]={id:a,enabled:!0,config:{}},n.disabled_plugins[r.name].push(n.configs[r.name][a]));r.mirror_master||(n.runnerConfigs[r.name][r.runner.id]=r.runner.config);for(var t in n.runners)(r.mirror_master||t!==r.runner.id)&&(n.runnerConfigs[r.name][t]={})}n.project=project,n.plugins=plugins,n.runners=runners,n.userIsCreator=userIsCreator,n.userConfigs=userConfigs,n.statusBlocks=statusBlocks,n.configured={},n.branch=n.project.branches[0],n.branches=branches,n.disabled_plugins={},n.configs={},n.runnerConfigs={},n.api_root="/"+n.project.name+"/api/",n.page="config",n.finishedRepeat=function(){$("[data-toggle=tab]").on("shown",function(n){var r=$(n.target).attr("href");$(r).find("[ui-codemirror]").trigger("refresh")})},$(function(){({init:function(){var n=this;$('a[data-toggle="tab"]').on("show",function(n){var e=$(n.target).attr("href").replace("#",""),o=global.location.pathname.split("/").slice(0,4).join("/"),a=global.history.state;r(e),a&&a.tabName===e||global.history.pushState({tabName:e},global.document.title,o+"/"+e)}),global.onpopstate=function(){n.route()},this.route()},route:function(){var n=global.location.pathname.split("/");"config"===n.slice(0,4)[3]&&this.routeConfigPage(n)},routeConfigPage:function(r){var a=global.sessionStorage.getItem("branchName");a?e(a):global.sessionStorage.removeItem("branchName");var t,i=r[r.length-1];5===r.length&&i.length&&(t=i,o(t,n.branch))}}).init()}),n.switchToBranch=e,$("[data-toggle=tab]").on("shown",function(n){var r=$(n.target).attr("href");$(r).find("[ui-codemirror]").trigger("refresh")}),n.switchToTab=o,n.refreshBranches=function(){throw new Error("Not implemented")},n.setEnabled=function(r,e){n.configs[n.branch.name][r].enabled=e,t()},n.savePluginOrder=t,n.switchToMaster=function(){for(var r=0;r<n.project.branches.length;r++)if("master"===n.project.branches[r].name)return void(n.branch=n.project.branches[r])},n.clearCache=function(){n.clearingCache=!0,$.ajax("/"+n.project.name+"/cache",{type:"DELETE",success:function(){n.clearingCache=!1,n.success("Cleared the cache",!0)},error:function(){n.clearingCache=!1,n.error("Failed to clear the cache",!0)}})},n.$watch("branch.isCustomizable",function(){o("tab-branch-settings",n.branch)}),n.toggleBranch=function(){if(n.branch.mirror_master){n.branch.mirror_master=!1,n.branch.isCustomizable=!0;for(var r,e=n.branch.name,o=0;o<n.project.branches.length;o++)if("master"===n.project.branches[o].name){r=n.project.branches[o];break}n.branch=$.extend(!0,n.branch,r),n.branch.name=e,i(n.branch)}n.saveGeneralBranch(!0)},n.mirrorMaster=function(){n.branch.mirror_master=!0,n.branch.isCustomizable=!1,delete n.branch.really_mirror_master,n.saveGeneralBranch(!0)},n.setRunner=function(r){var e=n.runnerConfigs[r];n.branch.runner.id=r,n.branch.runner.config=e,n.saveRunner(r,e)},n.reorderPlugins=function(r){n.branch.plugins=r,t()},n.enablePlugin=function(r,e,o){removeDragEl(o.target),n.branch.plugins.splice(e,0,r),_.find(n.branch.plugins,{id:r.id}).enabled=!0;var t=n.disabled_plugins[n.branch.name];t.splice(_.indexOf(_.map(t,"id"),r.id),1),a()},n.disablePlugin=function(r,e,o){removeDragEl(o.target),n.disabled_plugins[n.branch.name].splice(e,0,r);var t=n.branch.plugins;t.splice(_.indexOf(_.map(t,"id"),r.id),1),a()},n.setImgStyle=function(r){var e,o=r.id,a=n.plugins,t=a[o];if(t){var i=t.icon;i&&(e="url('/ext/"+o+"/"+i+"')")}r.imgStyle={"background-image":e}},n.saveGeneralBranch=function(r){var e=n.branch,o=n.project,a={active:e.active,privkey:e.privkey,pubkey:e.pubkey,envKeys:e.envKeys,mirror_master:e.mirror_master,deploy_on_green:e.deploy_on_green,deploy_on_pull_request:e.deploy_on_pull_request,runner:e.runner};r&&(a.plugins=e.plugins),saveProjectConfig(a,e,o,function(r){if(r)return n.error("Error saving general config for branch "+e.name+": "+r,!0);n.success("General config for branch "+e.name+" saved.",!0)})},n.generateKeyPair=function(){bootbox.confirm("Really generate a new keypair? This could break things if you have plugins that use the current ones.",function(r){r&&$.ajax("/"+n.project.name+"/keygen/?branch="+encodeURIComponent(n.branch.name),{type:"POST",success:function(r){n.branch.privkey=r.privkey,n.branch.pubkey=r.pubkey,n.success("Generated new ssh keypair",!0)}})})},function(){n.project.branches.forEach(function(n){i(n)})}(),n.gravatar=function(n){return n?"https://secure.gravatar.com/avatar/"+md5(n.toLowerCase())+"?d=identicon":""},n.saveRunner=function(r,e){$.ajax({url:"/"+n.project.name+"/config/branch/runner/id/?branch="+encodeURIComponent(n.branch.name),data:JSON.stringify({id:r,config:e}),contentType:"application/json",type:"PUT",success:function(){n.success("Saved runner config.",!0)},error:function(e){e&&e.responseText&&n.error("Error setting runner id to "+r)}})},n.runnerConfig=function(r,e,o){2===arguments.length&&(o=e,e=r,r=n.branch);var a=n.branch.runner.id;if(arguments.length<2)return n.runnerConfigs[a];$.ajax({url:"/"+n.project.name+"/config/branch/runner/?branch="+encodeURIComponent(n.branch.name),type:"PUT",contentType:"application/json",data:JSON.stringify(e),success:function(r){n.success("Runner config saved."),n.runnerConfigs[a]=r.config,o(null,r.config),n.$root.$digest()},error:function(r,e,a){if(r&&r.responseText){var t=$.parseJSON(r.responseText);n.error("Error saving runner config: "+t.errors[0])}else n.error("Error saving runner config: "+a);o(),n.$root.$digest()}})},n.providerConfig=function(r,e){if(0===arguments.length)return n.project.provider.config;$.ajax({url:"/"+n.project.name+"/provider/",type:"POST",contentType:"application/json",data:JSON.stringify(r),success:function(){n.success("Provider config saved."),e&&e(),n.$root.$digest()},error:function(r,o,a){r&&r.responseText?n.error("Error saving provider config: "+r.responseText):n.error("Error saving provider config: "+a),e&&e(),n.$root.$digest()}})},n.pluginConfig=function(r,e,o,a){if(3===arguments.length&&(a=o,o=e,e=n.branch),1===arguments.length&&(e=n.branch),!e.mirror_master){var t=n.configs[e.name][r];if(arguments.length<3)return t.config;if(null===t)throw console.error("pluginConfig called for a plugin that's not configured. "+r,!0),new Error("Plugin not configured: "+r);$.ajax({url:"/"+n.project.name+"/config/branch/"+r+"/?branch="+encodeURIComponent(e.name),type:"PUT",contentType:"application/json",data:JSON.stringify(o),success:function(o){n.success("Config for "+r+" on branch "+e.name+" saved."),n.configs[e.name][r].config=o,a(null,o),n.$root.$digest()},error:function(o,t,i){if(o&&o.responseText){var c=$.parseJSON(o.responseText);n.error("Error saving "+r+" config on branch "+e.name+": "+c.errors[0])}else n.error("Error saving "+r+" config on branch "+e.name+": "+i);a(),n.$root.$digest()}})}},n.deleteProject=function(){$.ajax({url:"/"+n.project.name+"/",type:"DELETE",success:function(){global.location="/"},error:function(){n.deleting=!1,n.error("failed to remove project",!0)}})},n.startTest=function(r){$.ajax({url:"/"+n.project.name+"/start",data:{branch:n.branch.name,type:"TEST_ONLY",page:"config"},type:"POST",success:function(){global.location="/"+n.project.name+"/"},error:function(e){if(e&&e.responseText){var o=$.parseJSON(e.responseText);n.error("Error starting test job for "+r+" on branch "+n.branch.name+": "+o.errors[0])}}})},n.startDeploy=function(r){$.ajax({url:"/"+n.project.name+"/start",data:{branch:n.branch.name,type:"TEST_AND_DEPLOY",page:"config"},type:"POST",success:function(){global.location="/"+n.project.name+"/"},error:function(e){if(e&&e.responseText){var o=$.parseJSON(e.responseText);n.error("Error starting deploy job for "+r+" on branch "+n.branch.name+": "+o.errors[0])}}})},n.saveProject=function(){$.ajax({url:"/"+n.project.name+"/config",type:"PUT",data:JSON.stringify({public:n.project.public}),contentType:"application/json",success:function(){n.success("General config saved.",!0)},error:function(r,e,o){r&&r.responseText?n.error("Error saving general config: "+r.responseText,!0):n.error("Error saving general config: "+o,!0)}})},n.post=post}function removeDragEl(n){n&&n.parentNode&&n.parentNode.removeChild(n)}function saveProjectConfig(n,r,e,o){$.ajax({url:"/"+e.name+"/config/branch/?branch="+encodeURIComponent(r.name),type:"PUT",data:JSON.stringify(n),contentType:"application/json",success:function(n){o(void 0,n)},error:function(n,r,e){o(n&&n.responseText||e)}})}var $=require("jquery"),_=require("lodash"),md5=require("md5"),bootbox=require("bootbox"),post=require("../../utils/post"),branches=global.branches||[],project=global.project||{},plugins=global.plugins||{},runners=global.runners||{},userIsCreator=global.userIsCreator||!1,userConfigs=global.userConfigs||{},statusBlocks=global.statusBlocks||{};module.exports=ConfigController;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../utils/post":43,"bootbox":115,"jquery":85,"lodash":86,"md5":87}],13:[function(require,module,exports){
(function (global){
"use strict";function DeactivateController(e){e.active=e.panelData.deactivate,e.loading=!1,e.toggleActive=function(){e.active=!e.active;var r={url:e.repo.url,active:e.active};$.ajax({url:"/api/repo",type:"POST",data:r,dataType:"json",success:function(){e.success(e.active?"Activated":"Deactivated"),e.$root.$digest()},error:function(r,t,o){if(r&&r.responseText){var a=$.parseJSON(r.responseText);e.error("Error settings active state: "+a.errors[0])}else e.error("Error settings active state: "+o);e.active=!e.active,e.$root.$digest()}})},e.confirmDeleteProject=function(){bootbox.confirm("<h2>Really Delete Project Data?</h2><p>This will remove all configuration and history for this project. You can always re-add it on the /projects page</p>","Just kidding","Yes, really",function(r){r&&$.ajax({url:"/api/repo",type:"DELETE",data:{url:e.repo.url},success:function(){e.success("Project removed."),e.$root.$digest(),setTimeout(function(){global.location="/"},500)},error:function(r,t,o){if(r&&r.responseText){var a=$.parseJSON(r.responseText);e.error("Error deleting project: "+a.errors[0])}else e.error("Error deleting project: "+o);e.$root.$digest()}})})}}var $=require("jquery"),bootbox=require("bootbox");module.exports=DeactivateController;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"bootbox":115,"jquery":85}],14:[function(require,module,exports){
"use strict";function GithubController(o){o.removeWebhooks=function(){bootbox.confirm('<h2>Really remove the github webhooks?</h2> <p>If you only want to temporarily disable build on commit, go to the "Deactivate" tab',"Just kidding","Yes, really",function(e){e&&(o.info("Deleting webhooks..."),$.ajax("/api/github/webhooks/unset",{data:{url:o.repo.url},dataType:"json",error:function(){o.error("Error removing webhooks."),o.$root.$digest()},success:function(){o.success("Webhooks removed."),o.$root.$digest()},type:"POST"}))})}}var $=require("jquery"),bootbox=require("bootbox");module.exports=GithubController;
},{"bootbox":115,"jquery":85}],15:[function(require,module,exports){
"use strict";function HerokuController(e){e.heroku=e.panelData.heroku,e.deploy_on_green=!e.repo.prod_deploy_target||e.repo.prod_deploy_target.deploy_on_green,e.status=e.heroku?"configured":"unconfigured",e.heroku_apps=["@@new@@"],e.which_app="@@new@@",e.apikey="",e.goBack=function(){e.status="unconfigured"},e.checkApi=function(){e.loading=!0,$.ajax("/api/heroku/account_integration",{data:{api_key:e.apikey},dataType:"json",error:function(){e.error("Heroku API key invalid"),e.loading=!1,e.$root.$digest()},success:function(o){e.success("Heroku connected"),e.apikey=o.api_key,e.heroku_apps=o.heroku_apps,e.which_app="@@new@@",e.account_id=o.account_id,e.status="have-api",e.loading=!1,e.$root.$digest()},type:"POST"})},e.herokuSelect=function(){var o=e.which_app;"@@new@@"===o&&(o=e.new_app_name),e.loading=!0,$.ajax("/api/heroku/delivery_integration",{data:{account_id:e.account_id,gh_repo_url:e.repo.url,app_name:o},dataType:"json",error:function(o){var r=$.parseJSON(o.responseText);e.error("Error: "+r.errors[0]),e.loading=!1,e.$root.$digest()},success:function(){e.success("Heroku continuous deployment integration complete."),e.deploy_on_green=!0,e.which_app="@@new@@",e.new_app_name="",e.heroku={app:o},e.status="configured",e.loading=!1,e.$root.$digest()},type:"POST"})},e.toggleDeploy=function(){e.deploy_on_green=!e.deploy_on_green,e.loading=!0,$.ajax("/api/heroku/config",{data:{url:e.repo.url,deploy_on_green:e.deploy_on_green},error:function(){e.error("Error toggling deploy on green."),e.deploy_on_green=!e.deploy_on_green,e.loading=!1,e.$root.$digest()},success:function(){e.success("Deploy on Green "+(e.deploy_on_green?"enabled":"disabled")),e.loading=!1,e.$root.$digest()},type:"POST"})},e.removeHeroku=function(){$.ajax("/api/heroku/config",{data:{url:e.repo.url,unset_heroku:1},error:function(){e.error("Error removing Heroku config."),e.loading=!1,e.$root.$digest()},success:function(){e.success("Removed Heroku config."),e.status="unconfigured",e.loading=!1,e.$root.$digest()},type:"POST"})}}var $=require("jquery");module.exports=HerokuController;
},{"jquery":85}],16:[function(require,module,exports){
"use strict";function JobController(n,i){var o=i.attr("id").split("-").slice(1).join("-");n.saving=!1,n.$watch('userConfigs["'+o+'"]',function(i){n.userConfig=i}),n.$watch('configs[branch.name]["'+o+'"].config',function(i){n.config=i}),n.save=function(){n.saving=!0,n.pluginConfig(o,n.config,function(){n.saving=!1})}}module.exports=JobController;
},{}],17:[function(require,module,exports){
"use strict";function ProviderController(o){o.config=o.providerConfig(),o.saving=!1,o.save=function(){o.saving=!0,o.providerConfig(o.config,function(){o.saving=!1})}}module.exports=ProviderController;
},{}],18:[function(require,module,exports){
"use strict";function RunnerController(n,i){var o=i.attr("id").split("-").slice(1).join("-");n.saving=!1,n.$watch('runnerConfigs[branch.name]["'+o+'"]',function(i){n.config=i}),n.save=function(){n.saving=!0,n.runnerConfig(n.config,function(){n.saving=!1})}}module.exports=RunnerController;
},{}],19:[function(require,module,exports){
"use strict";var angular=require("angular"),RunnerController=require("./controllers/runner"),ProviderController=require("./controllers/provider"),JobController=require("./controllers/job"),ConfigController=require("./controllers/config"),BranchesController=require("./controllers/branches"),CollaboratorsController=require("./controllers/collaborators"),DeactivateController=require("./controllers/deactivate"),HerokuController=require("./controllers/heroku"),GithubController=require("./controllers/github"),interpolate=require("../utils/interpolate"),ngSortableDirective=require("../utils/ng-sortable-directive"),app=angular.module("config",["ui.bootstrap","ui.codemirror","alerts","moment"]).config(["$interpolateProvider",interpolate]).controller("Config",["$scope",ConfigController]).controller("Config.RunnerController",["$scope","$element",RunnerController]).controller("Config.ProviderController",["$scope",ProviderController]).controller("Config.JobController",["$scope","$element",JobController]).controller("BranchesCtrl",["$scope",BranchesController]).controller("CollaboratorsCtrl",["$scope",CollaboratorsController]).controller("DeactivateCtrl",["$scope",DeactivateController]).controller("HerokuController",["$scope",HerokuController]).controller("GithubCtrl",["$scope",GithubController]).directive("ngSortable",["$parse",ngSortableDirective]).directive("repeatEnd",function(){return function(r,e,o){r.$last&&r.$parent.finishedRepeat&&r.$parent.finishedRepeat(o)}});module.exports=app;
},{"../utils/interpolate":38,"../utils/ng-sortable-directive":41,"./controllers/branches":10,"./controllers/collaborators":11,"./controllers/config":12,"./controllers/deactivate":13,"./controllers/github":14,"./controllers/heroku":15,"./controllers/job":16,"./controllers/provider":17,"./controllers/runner":18,"angular":50}],20:[function(require,module,exports){
(function (global){
"use strict";function determineTargetBranch(e){return e.ref?e.ref.branch:"master"}function cleanJob(e){delete e.phases,delete e.std,delete e.stdout,delete e.stderr,delete e.stdmerged,delete e.plugin_data}function Dashboard(e,t){JobMonitor.call(this,e,t.$digest.bind(t)),this.scope=t,this.scope.loadingJobs=!1,this.scope.jobs=global.jobs}var $=require("jquery"),_=require("lodash"),io=require("socket.io-client"),JobMonitor=require("../../utils/job-monitor"),statusClasses=require("../../utils/status-classes");module.exports=function(e){var t=io.connect();new Dashboard(t,e),e.statusClasses=statusClasses,e.providers=global.providers,e.phases=["environment","prepare","test","deploy","cleanup"],$("#dashboard").show(),e.startDeploy=function(e){$(".tooltip").hide();var o=determineTargetBranch(e);t.emit("deploy",e.project.name,o)},e.startTest=function(e){$(".tooltip").hide();var o=determineTargetBranch(e);t.emit("test",e.project.name,o)},e.cancelJob=function(e){t.emit("cancel",e)}},_.extend(Dashboard.prototype,JobMonitor.prototype,{job:function(e,t){for(var o=this.scope.jobs[t],s=0;s<o.length;s++)if(o[s]._id===e)return o[s]},addJob:function(e,t){for(var o=this.scope.jobs[t],s=-1,r=0;r<o.length;r++)if(o[r].project.name===e.project.name){s=r;break}if(-1!==s){var a=o.splice(s,1)[0];e.project.prev=a.project.prev}e.phases&&cleanJob(e),e.phase="environment",o.unshift(e)}}),Dashboard.prototype.statuses["phase.done"]=function(e){this.phase=e.next};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../utils/job-monitor":40,"../../utils/status-classes":45,"jquery":85,"lodash":86,"socket.io-client":91}],21:[function(require,module,exports){
"use strict";var angular=require("angular"),interpolate=require("../utils/interpolate"),DashboardController=require("./controllers/dashboard"),app=angular.module("dashboard",["moment"]).config(["$interpolateProvider",interpolate]).controller("Dashboard",["$scope",DashboardController]);module.exports=app;
},{"../utils/interpolate":38,"./controllers/dashboard":20,"angular":50}],22:[function(require,module,exports){
"use strict";module.exports=function(t,e){var l={controller:"JobCtrl",templateUrl:"build-tpl.html"},o={"/":l,"/job/latest":l,"/job/:id":l};Object.keys(o).forEach(function(t){e.when(t,o[t])}),t.html5Mode(!0)};
},{}],23:[function(require,module,exports){
(function (global){
"use strict";function BuildPage(e,o,t,s,a,n){JobDataMonitor.call(this,e,t),this.scope=s,this.project=o,this.jobs={},this.jobs[n._id]=n}function setFavicon(e){$('link[rel*="icon"]').attr("href","/images/icons/favicon-"+e+".png")}function animateFav(){function e(){setFavicon("running"+(o?"-alt":"")),o=!o}var o=!1;return setInterval(e,500)}function updateFavicon(e){"running"===e?null===runtime&&(runtime=animateFav()):(null!==runtime&&(clearInterval(runtime),runtime=null),setFavicon(e))}function buildSwitcher(e){function o(o){var t,s={40:1,38:-1}[o.keyCode],a=e.job._id;if(s){for(var n=0;n<e.jobs.length;n++)if(e.jobs[n]._id===a){t=n;break}if(-1===t)return console.log("Failed to find job."),global.location=global.location;t+=s,t<0||t>=e.jobs.length||(o.preventDefault(),e.selectJob(e.jobs[t]._id),e.$root.$digest())}}global.document.addEventListener("keydown",o)}var _=require("lodash"),bootbox=require("bootbox"),$=require("jquery"),io=require("socket.io-client"),JobDataMonitor=require("../../utils/job-data-monitor"),PHASES=require("../../utils/phases"),SKELS=require("../../utils/skels"),statusClasses=require("../../utils/status-classes"),outputConsole,runtime=null,job=global.job;module.exports=function(e,o,t,s){function a(t){if(global.location.pathname.match(/\/config$/))return void(global.location=global.location);if(n=o.current.params,n.id||(n.id=e.jobs[0]._id),o.current=c,l!==n.id||t){l=n.id;if(!p.get(l,function(o,t,s){t.phases.environment&&(t.phases.environment.collapsed=!0),t.phases.prepare&&(t.phases.prepare.collapsed=!0),t.phases.cleanup&&(t.phases.cleanup.collapsed=!0),e.job=t,e.job.phases.test.commands.length&&(e.job.phases.environment.collapsed=!0,e.job.phases.prepare.collapsed=!0,e.job.phases.cleanup.collapsed=!0),s||e.$digest()}))for(var s=0;s<e.jobs.length;s++)if(e.jobs[s]._id===l){e.job=e.jobs[s];break}}}var n=o.current?o.current.params:{},i=global.project,l=n.id||global.job&&global.job._id,r=io.connect(),c=o.current,p=new BuildPage(r,i.name,e.$digest.bind(e),e,global.jobs,global.job);outputConsole=global.document.querySelector(".console-output"),e.statusClasses=statusClasses,e.phases=["environment","prepare","test","deploy","cleanup"],e.project=i,e.jobs=global.jobs,e.job=global.job,e.canAdminProject=global.canAdminProject,e.showStatus=global.showStatus,e.job&&e.job.phases.test.commands.length&&(job.phases.environment&&(job.phases.environment.collapsed=!0),job.phases.prepare&&(job.phases.prepare.collapsed=!0),job.phases.cleanup&&(job.phases.cleanup.collapsed=!0)),e.toggleErrorDetails=function(){e.showErrorDetails=!e.showErrorDetails},e.clearCache=function(){e.clearingCache=!0,$.ajax("/"+e.project.name+"/cache/"+e.job.ref.branch,{type:"DELETE",success:function(){e.clearingCache=!1,e.$digest()},error:function(){e.clearingCache=!1,e.$digest(),bootbox.alert("Failed to clear the cache")}})},e.$on("$locationChangeSuccess",a),a(!0),e.triggers={commit:{icon:"code-fork",title:"Commit"},manual:{icon:"hand-o-right",title:"Manual"},plugin:{icon:"puzzle-piece",title:"Plugin"},api:{icon:"cloud",title:"Cloud"}},e.page="build",e.selectJob=function(e){t.path("/job/"+e).replace()},e.$watch("job.status",function(e){updateFavicon(e)}),buildSwitcher(e),e.$watch("job.std.merged_latest",function(e){var o=s("ansi");$(".job-output").last().append(o(e)),outputConsole.scrollTop=outputConsole.scrollHeight,setTimeout(function(){outputConsole.scrollTop=outputConsole.scrollHeight},10)}),e.startDeploy=function(o){$(".tooltip").hide(),r.emit("deploy",i.name,o&&o.ref.branch),e.job={project:e.job.project,status:"submitted"}},e.startTest=function(o){$(".tooltip").hide(),r.emit("test",i.name,o&&o.ref.branch),e.job={project:e.job.project,status:"submitted"}},e.restartJob=function(e){r.emit("restart",e)},e.cancelJob=function(e){r.emit("cancel",e)}},_.extend(BuildPage.prototype,JobDataMonitor.prototype,{emits:{getUnknown:"build:job"},job:function(e){return this.jobs[e]},addJob:function(e){if((e.project.name||e.project)===this.project){this.jobs[e._id]=e;for(var o=-1,t=0;t<this.scope.jobs.length;t++)if(this.scope.jobs[t]._id===e._id){o=t;break}if(-1!==o&&this.scope.jobs.splice(o,1),e.phase||(e.phase="environment"),e.std||(e.std={out:"",err:"",merged:""}),e.phases)e.phases.test.commands.length&&(e.phases.environment&&(e.phases.environment.collapsed=!0),e.phases.prepare&&(e.phases.prepare.collapsed=!0),e.phases.cleanup&&(e.phases.cleanup.collapsed=!0));else{for(e.phases={},t=0;t<PHASES.length;t++)e.phases[PHASES[t]]=_.cloneDeep(SKELS.phase);e.phases[e.phase].started=new Date}this.scope.jobs.unshift(e),this.scope.job=e}},get:function(e,o){if(this.jobs[e])return o(null,this.jobs[e],!0),!0;var t=this;this.sock.emit("build:job",e,function(s){t.jobs[e]=s,o(null,s)})}});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../utils/job-data-monitor":39,"../../utils/phases":42,"../../utils/skels":44,"../../utils/status-classes":45,"bootbox":115,"jquery":85,"lodash":86,"socket.io-client":91}],24:[function(require,module,exports){
"use strict";module.exports=function(){return{restrict:"A",scope:{},link:function(t,n,a){t.$parent.$watch('job.plugin_data["'+a.pluginStatus+'"]',function(n){t.data=n}),t.$parent.$watch('showStatus[job.ref.branch]["'+a.pluginStatus+'"]',function(n){t.show=n}),t.$parent.$watch("job",function(n){t.job=n})}}};
},{}],25:[function(require,module,exports){
"use strict";var angular=require("angular"),routes=require("./configs/routes.js"),pluginStatus=require("./directives/plugin-status"),JobController=require("./controllers/job"),interpolate=require("../utils/interpolate"),app=angular.module("job-status",["moment","ansi","ngRoute"]).config(["$interpolateProvider",interpolate]).config(["$locationProvider","$routeProvider",routes]).controller("JobCtrl",["$scope","$route","$location","$filter",JobController]).directive("pluginStatus",pluginStatus);module.exports=app;
},{"../utils/interpolate":38,"./configs/routes.js":22,"./controllers/job":23,"./directives/plugin-status":24,"angular":50}],26:[function(require,module,exports){
"use strict";module.exports=function(){return{restrict:"A",link:function(t,n,r){var i=r.rawHtml;t.$watch(i,function(t){n[0].innerHTML=t||""})}}};
},{}],27:[function(require,module,exports){
"use strict";function since(t,e){function i(){var t=(new Date).getTime();textDuration(t-n,e,!0)}var n=new Date(t).getTime();return i(),setInterval(i,500)}var $=require("jquery"),textDuration=require("../utils/text-duration");module.exports=function(){return{restrict:"E",link:function(t,e,i){if(void 0!==i.since&&!i.duration){var n=since(i.since,e);return $(e).tooltip({title:"Started "+new Date(i.since).toLocaleString()}),i.$observe("since",function(){$(e).tooltip({title:"Started "+new Date(i.since).toLocaleString()}),clearInterval(n),n=since(i.since,e)}),t.$on("$destroy",function(){clearInterval(n)})}var o;if(void 0!==i.datetime&&(o=new Date(i.datetime),$(e).tooltip({title:o.toLocaleString()})),void 0!==i.duration)return i.$observe("duration",function(){textDuration(i.duration,e)}),textDuration(i.duration,e);i.$observe("datetime",function(){o=new Date(i.datetime),$(e).tooltip({title:o.toLocaleString()}),$(e).text($.timeago(o))}),$(e).text($.timeago(o)),setTimeout(function(){$(e).timeago()},0)}}};
},{"../utils/text-duration":31,"jquery":85}],28:[function(require,module,exports){
"use strict";var $=require("jquery");module.exports=function(){return{restrict:"A",link:function(t,o,i){"tooltip"===i.toggle&&(setTimeout(function(){$(o).tooltip()},0),i.$observe("title",function(){$(o).tooltip()}),t.$on("$destroy",function(){$(".tooltip").hide(),$(o).tooltip("hide")}))}}};
},{"jquery":85}],29:[function(require,module,exports){
"use strict";module.exports=function(){return function(r,t){if(!r&&0!==parseInt(r))return"";var e=Math.pow(10,t||1);return parseInt(parseFloat(r)*e,10)/e+"%"}};
},{}],30:[function(require,module,exports){
"use strict";var $=require("jquery"),angular=require("angular"),time=require("./directives/time"),toggle=require("./directives/toggle"),rawHtml=require("./directives/raw-html"),percentage=require("./filters/percentage");require("timeago"),$.timeago.settings.strings.hour="an hour",$.timeago.settings.strings.hours="%d hours",$.timeago.settings.localeTitle=!0;var app=angular.module("moment",[]).directive("time",time).directive("toggle",toggle).directive("rawHtml",rawHtml).filter("percentage",percentage);module.exports=app;
},{"./directives/raw-html":26,"./directives/time":27,"./directives/toggle":28,"./filters/percentage":29,"angular":50,"jquery":85,"timeago":117}],31:[function(require,module,exports){
"use strict";var $=require("jquery"),time_units=[{ms:36e5,cls:"hours",suffix:"h"},{ms:6e4,cls:"minutes",suffix:"m"},{ms:1e3,cls:"seconds",suffix:"s"},{ms:0,cls:"miliseconds",suffix:"ms"}];module.exports=function(s,i,t){if(!s)return $(i).text("");for(var e="",m=0;m<time_units.length;m++)if(!(s<time_units[m].ms)){e=time_units[m].cls;var u=""+s;time_units[m].ms&&(u=t?parseInt(s/time_units[m].ms):parseInt(s/time_units[m].ms*10)/10),u+=time_units[m].suffix;break}$(i).addClass(e).text(u)};
},{"jquery":85}],32:[function(require,module,exports){
(function (global){
"use strict";var plugins=global.plugins||[];module.exports=function(){this.busy=!1,this.hasUpgrades=function(){for(var t in plugins){if(plugins[t].outdated)return!0}return!1}(),this.upgradeAll=function(){this.busy=!0;var t=0,s=[];for(var i in plugins){var n=plugins[i];n.outdated&&s.push(n)}var u=function(i){if(i<s.length){s[i].controller.upgrade(function(n){if(n)return global.alert("Batch upgrade aborted due to error:\n"+n.message);++t,u(i+1),t===s.length&&(this.busy=!1,this.hasUpgrades=!1)}.bind(this))}}.bind(this);u(0)},this.uninstall=function(t){this.busy=!0,t.uninstall(function(s){s&&global.alert(s.message),plugins[t.id].installed=!1,delete plugins[t.id].outdated,this.busy=!1}.bind(this))},this.install=function(t){this.busy=!0,t.install(function(t){t&&global.alert(t.message),this.busy=!1}.bind(this))},this.upgrade=function(t){this.busy=!0,t.upgrade(function(t){t&&global.alert(t.message),this.busy=!1}.bind(this))}};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],33:[function(require,module,exports){
(function (global){
"use strict";var plugins=global.plugins||{};module.exports=function(i,t){function s(t){i.head("/").success(function(){t()}).error(function(){s(t)})}this.idle=!0,this.status="idle",this.loadPlugin=function(i){this.id=i,this.plugin=plugins[i],this.plugin.controller=this;for(var t in this.plugin)this[t]=this.plugin[t];this.pluginLoaded=!0},this.upgrade=function(i){this.perform("upgrade",function(t){if(t)return i(t);this.installed=!0,this.outdated=!1,this.installedVersion=this.latestVersion,i()}.bind(this))},this.install=function(i){this.perform("install",function(t){if(t)return i(t);this.installed=!0,this.installedVersion=this.latestVersion,i()}.bind(this))},this.uninstall=function(i){this.perform("uninstall",function(t){if(t)return i(t);this.installed=!1,this.installedVersion="no",i()}.bind(this))},this.perform=function(n,l){return this.status="Installing "+this.id,this.idle=!1,i.put("/admin/plugins",{action:n,id:this.id}).success(function(){this.status="Restarting",t(function(){s(function(){this.status="Done",this.idle=!0,l()}.bind(this))}.bind(this),2e3)}.bind(this)).error(function(i){this.idle=!0,l(new Error(i))}.bind(this))}};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],34:[function(require,module,exports){
"use strict";var angular=require("angular"),PluginController=require("./controllers/plugin"),PluginTableController=require("./controllers/plugin-table"),interpolate=require("../utils/interpolate"),app=angular.module("plugin-manager",[]).config(["$interpolateProvider",interpolate]).controller("PluginController",["$http","$timeout",PluginController]).controller("PluginTableController",PluginTableController);module.exports=app;
},{"../utils/interpolate":38,"./controllers/plugin":33,"./controllers/plugin-table":32,"angular":50}],35:[function(require,module,exports){
(function (global){
"use strict";function validName(e){return!!e.match(/[\w-]+\/[\w-]+/)}var $=require("jquery");module.exports=function(e,r){var a=r.id.split("-")[1];e.config={},e.projects=global.manualProjects[a]||[],e.remove=function(r){r.really_remove="removing",$.ajax("/"+r.name+"/",{type:"DELETE",success:function(){e.projects.splice(e.projects.indexOf(r),1),e.success("Project removed",!0)},error:function(){e.error("Failed to remove project",!0)}})},e.create=function(){var r=e.display_name.toLowerCase();validName(r)&&$.ajax("/"+r+"/",{type:"PUT",contentType:"application/json",data:JSON.stringify({display_name:e.display_name,display_url:e.display_url,public:e.public,provider:{id:a,config:e.config}}),success:function(){e.projects.push({display_name:e.display_name,name:e.display_name.replace(/ /g,"-").toLowerCase(),display_url:e.display_url,provider:{id:a,config:e.config}}),e.config={},e.display_name="",e.display_url="",e.success("Created project!",!0)},error:function(){e.error("failed to create project",!0)}})}};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"jquery":85}],36:[function(require,module,exports){
(function (global){
"use strict";var $=require("jquery");module.exports=function(e){setTimeout(function(){"#manual"===global.location.hash&&$('a[href="#manual-setup"]').tab("show")},200),e.accounts=global.accounts,e.repos=global.repos,e.providers=global.providers,e.projectsPage=!0,e.toggleAdd=function(e){e.adding="pick-type"},e.toggleAddCancel=function(e){e.adding=!1},e.toggleRemove=function(e){e.really_remove=!0},e.toggleRemoveCancel=function(e){e.really_remove=!1},e.removeProject=function(r,o,t){o.really_remove="removing",o.adding=!1,$.ajax("/"+o.project.name+"/",{type:"DELETE",success:function(){o.project=null,o.really_remove=!1,t.configured--,e.$digest()},error:function(r,t,n){o.really_remove=!1,r&&r.responseText?e.error("Error removing project for repo "+o.name+": "+r.responseText,!0):e.error("Error removing project for repo "+o.name+": "+n,!0)}})},e.setupProject=function(r,o,t,n){o.lastError="",$.ajax("/"+o.name+"/",{type:"PUT",contentType:"application/json",data:JSON.stringify({display_name:o.display_name||o.name,display_url:o.display_url,project_type:t,provider:{id:r.provider,account:r.id,repo_id:o.id,config:o.config}}),success:function(r){o.project=r.project,o.adding="done",n.configured++,e.$digest()},error:function(r,t,n){var a=void 0;a=r&&r.responseText?"Error creating project for repo "+o.name+": "+r.responseText:"Error creating project for repo "+o.name+": "+n,e.error(a,!0),o.lastError=a,o.adding=""}})},e.startTest=function(r){$.ajax("/"+r.project.name+"/start",{type:"POST",success:function(){r.adding=!1,e.success("Test started for "+r.project.name+'. <a href="/'+r.project.name+'/">Click to watch it run</a>',!0,!0)},error:function(o,t,n){o&&o.responseText?e.error("Error starting test for project "+r.project.name+": "+o.responseText,!0):e.error("Error starting test for project "+r.project.name+": "+n,!0)}})}};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"jquery":85}],37:[function(require,module,exports){
"use strict";var angular=require("angular"),interpolate=require("../utils/interpolate"),ManualController=require("./controllers/manual"),ProjectsController=require("./controllers/projects"),app=angular.module("projects",["alerts","moment","ui.bootstrap.buttons"]).config(["$interpolateProvider",interpolate]).controller("ManualController",["$scope","$attrs",ManualController]).controller("ProjectsController",["$scope",ProjectsController]);module.exports=app;
},{"../utils/interpolate":38,"./controllers/manual":35,"./controllers/projects":36,"angular":50}],38:[function(require,module,exports){
"use strict";module.exports=function(t){t.startSymbol("[["),t.endSymbol("]]")};
},{}],39:[function(require,module,exports){
"use strict";function JobDataMonitor(){JobMonitor.apply(this,arguments)}function ensureCommand(e){var t=e.commands[e.commands.length-1];return t&&void 0===t.finished||(t=_.extend({},SKELS.command),e.commands.push(t)),t}var _=require("lodash"),JobMonitor=require("./job-monitor"),SKELS=require("./skels");_.extend(JobDataMonitor.prototype,JobMonitor.prototype,{}),JobDataMonitor.prototype.statuses=_.extend({},JobMonitor.prototype.statuses,{"phase.done":function(e){this.phases[e.phase].finished=e.time,this.phases[e.phase].duration=e.elapsed,this.phases[e.phase].exitCode=e.code,-1!==["prepare","environment","cleanup"].indexOf(e.phase)&&(this.phases[e.phase].collapsed=!0),"test"===e.phase&&(this.test_status=e.code),"deploy"===e.phase&&(this.deploy_status=e.code),e.next&&this.phases[e.next]&&(this.phase=e.next,this.phases[e.next].started=e.time)},"command.comment":function(e){var t=this.phases[this.phase],s=_.extend({},SKELS.command);s.command=e.comment,s.comment=!0,s.plugin=e.plugin,s.finished=e.time,t.commands.push(s)},"command.start":function(e){var t=this.phases[this.phase],s=_.extend({},SKELS.command,e);s.started=e.time,t.commands.push(s)},"command.done":function(e){var t=this.phases[this.phase],s=t.commands[t.commands.length-1];s.finished=e.time,s.duration=e.elapsed,s.exitCode=e.exitCode,s.merged=s._merged},stdout:function(e){var t=ensureCommand(this.phases[this.phase]);t.out+=e,t._merged+=e,this.std.out+=e,this.std.merged+=e,this.std.merged_latest=e},stderr:function(e){var t=ensureCommand(this.phases[this.phase]);t.err+=e,t._merged+=e,this.std.err+=e,this.std.merged+=e,this.std.merged_latest=e}}),module.exports=JobDataMonitor;
},{"./job-monitor":40,"./skels":44,"lodash":86}],40:[function(require,module,exports){
"use strict";function JobMonitor(t,n){this.sock=t,this.changed=n,this.waiting={},this.listen()}var _=require("lodash"),PHASES=require("./phases");JobMonitor.prototype={emits:{getUnknown:"dashboard:unknown"},events:{"job.new":function(t,n){this.addJob(t[0],n),this.changed()},"job.done":function(t,n){this.addJob(t[0],n),this.changed()}},job:function(){throw new Error("You must override this")},addJob:function(){throw new Error("You must implement")},listen:function(){var t;for(var n in this.events)t=this.events[n],"string"==typeof t&&(t=this[t]),this.sock.on(n,t.bind(this));for(var i in this.statuses)this.sock.on("job.status."+i,this.update.bind(this,i))},update:function(t,n,i,s){var e=n.shift(),o=this.job(e,i),a=this.statuses[t];if(!o)return this.unknown(e,t,n,i);a&&("string"==typeof a?o.status=a:a.apply(o,n),s||this.changed())},unknown:function(t,n,i,s){if(i=[t].concat(i),this.waiting[t])return this.waiting[t].push([n,i,s]);this.waiting[t]=[[n,i,s]],this.sock.emit(this.emits.getUnknown,t,this.gotUnknown.bind(this))},gotUnknown:function(t){if(!this.waiting[t._id])return console.warn("Got unknownjob:response but wan't waiting for it...");var n=this.waiting[t._id][0][2];"submitted"===t.status&&(t.status="running",t.started=new Date),this.addJob(t,n);for(var i=0;i<this.waiting[t._id];i++)this.update.apply(this,this.waiting[i].concat([!0]));delete this.waiting[t._id],this.changed()},statuses:{started:function(t){this.started=t,this.phase="environment",this.status="running"},errored:function(t){this.error=t,this.status="errored"},canceled:"errored","phase.done":function(t){this.phase=PHASES.indexOf(t.phase)+1},stdout:function(){},stderr:function(){},warning:function(t){this.warnings||(this.warnings=[]),this.warnings.push(t)},"plugin-data":function(t){var n,i=t.path?[t.plugin].concat(t.path.split(".")):[t.plugin],s=i.pop(),e=t.method||"replace";n=i.reduce(function(t,n){return t[n]||(t[n]={})},this.plugin_data||(this.plugin_data={})),"replace"===e?n[s]=t.data:"push"===e?(n[s]||(n[s]=[]),n[s].push(t.data)):"extend"===e?(n[s]||(n[s]={}),_.extend(n[s],t.data)):console.error('Invalid "plugin data" method received from plugin',t.plugin,t.method,t)}}},module.exports=JobMonitor;
},{"./phases":42,"lodash":86}],41:[function(require,module,exports){
"use strict";var _=require("lodash"),$=require("jquery"),Sortable=require("sortable");module.exports=function(e){return{compile:function(r,t){var o={},n=null,a=null,l=t.ngSortableGroup,u=t.ngSortable||t.ngSortableUpdate,i=t.ngSortableSource,d=t.ngModel;if(l){if(!i)throw new Error("Use of a group requires specifying a data source via ng-sortable-source");n=t.ngSortableAdded,a=t.ngSortableRemoved}var p=t.ngSortableKey||"_id";return function(r,t){function g(t){var o=e(t)(r);return function(t){r.$apply(function(){var n="update"===t.type?d:i,a=_.cloneDeep(e(n)(r)),l=$(t.target),u=$(l).attr("ng-sortable-id"),g=null,s=l.index();if(!u)throw new Error("No ng-sortable-id on element.");var c=_.find(a,function(e,r){return g=r,e[p]===u});if(!c)throw new Error("Could not locate target element. Did you forget to set attribute data-ng-sortable-id on your repeated HTML elements?");"update"===t.type?(a.splice(g,1),a.splice(s,0,c),o(a)):"add"===t.type&&o(c,s,t)})}}u&&(o.onUpdate=g(u)),l&&(o.group=l),n&&(o.onAdd=g(n)),a&&(o.onRemove=g(a)),u&&(o.onUpdate=g(u)),r.sortable=new Sortable(t.get(0),o)}}}};
},{"jquery":85,"lodash":86,"sortable":114}],42:[function(require,module,exports){
"use strict";module.exports=["environment","prepare","test","deploy","cleanup"];
},{}],43:[function(require,module,exports){
"use strict";function post(e,r,s){$.ajax({url:e,type:"POST",data:r,dataType:"json",success:function(){s(null)},error:function(e,r,t){if(e&&e.responseText){t=$.parseJSON(e.responseText).errors[0]}s(t)}})}var $=require("jquery");module.exports=post;
},{"jquery":85}],44:[function(require,module,exports){
"use strict";var PHASES=require("./phases"),SKELS={job:{id:null,data:null,phases:{},phase:PHASES[0],queued:null,started:null,finished:null,test_status:null,deploy_status:null,plugin_data:{},warnings:[],std:{out:"",err:"",merged:"",merged_latest:""}},command:{out:"",err:"",merged:"",_merged:"",started:null,command:"",plugin:""},phase:{finished:null,exitCode:null,commands:[]}};module.exports=SKELS;
},{"./phases":42}],45:[function(require,module,exports){
"use strict";module.exports={passed:"fa-check-circle success-text",failed:"fa-exclamation-circle failure-text",running:"fa-circle-o-notch fa-spin running-text",submitted:"fa-clock-o waiting-text",errored:"fa-minus-circle error-text"};
},{}],46:[function(require,module,exports){
function after(o,n,t){function r(o,e){if(r.count<=0)throw new Error("after called too many times");--r.count,o?(u=!0,n(o),n=t):0!==r.count||u||n(null,e)}var u=!1;return t=t||noop,r.count=o,0===o?n():r}function noop(){}module.exports=after;
},{}],47:[function(require,module,exports){
!function(e,r){"use strict";function t(e,r){if(c(e)){r=r||[];for(var t=0,n=e.length;t<n;t++)r[t]=e[t]}else if(u(e)){r=r||{};for(var a in e)"$"===a.charAt(0)&&"$"===a.charAt(1)||(r[a]=e[a])}return r||e}function n(){function e(e,t){return r.extend(Object.create(e),t)}function n(e,r){var t=r.caseInsensitiveMatch,n={originalPath:e,regexp:e},a=n.keys=[];return e=e.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)(\*\?|[\?\*])?/g,function(e,r,t,n){var o="?"===n||"*?"===n?"?":null,i="*"===n||"*?"===n?"*":null;return a.push({name:t,optional:!!o}),r=r||"",(o?"":r)+"(?:"+(o?r:"")+(i&&"(.+?)"||"([^/]+)")+(o||"")+")"+(o||"")}).replace(/([\/$\*])/g,"\\$1"),n.regexp=new RegExp("^"+e+"$",t?"i":""),n}var a={};this.when=function(e,o){var i=t(o);if(r.isUndefined(i.reloadOnSearch)&&(i.reloadOnSearch=!0),r.isUndefined(i.caseInsensitiveMatch)&&(i.caseInsensitiveMatch=this.caseInsensitiveMatch),a[e]=r.extend(i,e&&n(e,i)),e){var c="/"==e[e.length-1]?e.substr(0,e.length-1):e+"/";a[c]=r.extend({redirectTo:e},n(c,i))}return this},this.caseInsensitiveMatch=!1,this.otherwise=function(e){return"string"==typeof e&&(e={redirectTo:e}),this.when(null,e),this},this.$get=["$rootScope","$location","$routeParams","$q","$injector","$templateRequest","$sce",function(t,n,o,i,c,u,l){function h(e,r){var t=r.keys,n={};if(!r.regexp)return null;var a=r.regexp.exec(e);if(!a)return null;for(var o=1,i=a.length;o<i;++o){var c=t[o-1],u=a[o];c&&u&&(n[c.name]=u)}return n}function f(e){var n=C.current;g=v(),(w=g&&n&&g.$$route===n.$$route&&r.equals(g.pathParams,n.pathParams)&&!g.reloadOnSearch&&!P)||!n&&!g||t.$broadcast("$routeChangeStart",g,n).defaultPrevented&&e&&e.preventDefault()}function $(){var e=C.current,a=g;w?(e.params=a.params,r.copy(e.params,o),t.$broadcast("$routeUpdate",e)):(a||e)&&(P=!1,C.current=a,a&&a.redirectTo&&(r.isString(a.redirectTo)?n.path(m(a.redirectTo,a.params)).search(a.params).replace():n.url(a.redirectTo(a.pathParams,n.path(),n.search())).replace()),i.when(a).then(d).then(function(n){a==C.current&&(a&&(a.locals=n,r.copy(a.params,o)),t.$broadcast("$routeChangeSuccess",a,e))},function(r){a==C.current&&t.$broadcast("$routeChangeError",a,e,r)}))}function d(e){if(e){var t=r.extend({},e.resolve);r.forEach(t,function(e,n){t[n]=r.isString(e)?c.get(e):c.invoke(e,null,null,n)});var n=p(e);return r.isDefined(n)&&(t.$template=n),i.all(t)}}function p(e){var t,n;return r.isDefined(t=e.template)?r.isFunction(t)&&(t=t(e.params)):r.isDefined(n=e.templateUrl)&&(r.isFunction(n)&&(n=n(e.params)),r.isDefined(n)&&(e.loadedTemplateUrl=l.valueOf(n),t=u(n))),t}function v(){var t,o;return r.forEach(a,function(a,i){!o&&(t=h(n.path(),a))&&(o=e(a,{params:r.extend({},n.search(),t),pathParams:t}),o.$$route=a)}),o||a[null]&&e(a[null],{params:{},pathParams:{}})}function m(e,t){var n=[];return r.forEach((e||"").split(":"),function(e,r){if(0===r)n.push(e);else{var a=e.match(/(\w+)(?:[?*])?(.*)/),o=a[1];n.push(t[o]),n.push(a[2]||""),delete t[o]}}),n.join("")}var g,w,P=!1,C={routes:a,reload:function(){P=!0;var e={defaultPrevented:!1,preventDefault:function(){this.defaultPrevented=!0,P=!1}};t.$evalAsync(function(){f(e),e.defaultPrevented||$()})},updateParams:function(e){if(!this.current||!this.current.$$route)throw s("norout","Tried updating route when with no current route");e=r.extend({},this.current.params,e),n.path(m(this.current.$$route.originalPath,e)),n.search(e)}};return t.$on("$locationChangeStart",f),t.$on("$locationChangeSuccess",$),C}]}function a(){this.$get=function(){return{}}}function o(e,t,n){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,o,i,c,u){function l(){$&&(n.cancel($),$=null),h&&(h.$destroy(),h=null),f&&($=n.leave(f),$.then(function(){$=null}),f=null)}function s(){var i=e.current&&e.current.locals,c=i&&i.$template;if(r.isDefined(c)){var s=a.$new(),$=e.current,v=u(s,function(e){n.enter(e,null,f||o).then(function(){!r.isDefined(d)||d&&!a.$eval(d)||t()}),l()});f=v,h=$.scope=s,h.$emit("$viewContentLoaded"),h.$eval(p)}else l()}var h,f,$,d=i.autoscroll,p=i.onload||"";a.$on("$routeChangeSuccess",s),s()}}}function i(e,r,t){return{restrict:"ECA",priority:-400,link:function(n,a){var o=t.current,i=o.locals;a.html(i.$template);var c=e(a.contents());if(o.controller){i.$scope=n;var u=r(o.controller,i);o.controllerAs&&(n[o.controllerAs]=u),a.data("$ngControllerController",u),a.children().data("$ngControllerController",u)}n[o.resolveAs||"$resolve"]=i,c(n)}}}var c=r.isArray,u=r.isObject,l=r.module("ngRoute",["ng"]).provider("$route",n),s=r.$$minErr("ngRoute");l.provider("$routeParams",a),l.directive("ngView",o),l.directive("ngView",i),o.$inject=["$route","$anchorScroll","$animate"],i.$inject=["$compile","$controller","$route"]}(window,window.angular);
},{}],48:[function(require,module,exports){
require("./angular-route"),module.exports="ngRoute";
},{"./angular-route":47}],49:[function(require,module,exports){
!function(e){"use strict";function t(e,t){return t=t||Error,function(){var n,r,i=arguments,o=i[0],a="["+(e?e+":":"")+o+"] ",s=i[1];for(a+=s.replace(/\{\d+\}/g,function(e){var t=+e.slice(1,-1),n=t+2;return n<i.length?me(i[n]):e}),a+="\nhttp://errors.angularjs.org/1.5.7/"+(e?e+"/":"")+o,r=2,n="?";r<i.length;r++,n="&")a+=n+"p"+(r-2)+"="+encodeURIComponent(me(i[r]));return new t(a)}}function n(e){if(null==e||A(e))return!1;if(Gr(e)||w(e)||Pr&&e instanceof Pr)return!0;var t="length"in Object(e)&&e.length;return x(t)&&(t>=0&&(t-1 in e||e instanceof Array)||"function"==typeof e.item)}function r(e,t,i){var o,a;if(e)if(C(e))for(o in e)"prototype"==o||"length"==o||"name"==o||e.hasOwnProperty&&!e.hasOwnProperty(o)||t.call(i,e[o],o,e);else if(Gr(e)||n(e)){var s="object"!=typeof e;for(o=0,a=e.length;o<a;o++)(s||o in e)&&t.call(i,e[o],o,e)}else if(e.forEach&&e.forEach!==r)e.forEach(t,i,e);else if(b(e))for(o in e)t.call(i,e[o],o,e);else if("function"==typeof e.hasOwnProperty)for(o in e)e.hasOwnProperty(o)&&t.call(i,e[o],o,e);else for(o in e)Tr.call(e,o)&&t.call(i,e[o],o,e);return e}function i(e,t,n){for(var r=Object.keys(e).sort(),i=0;i<r.length;i++)t.call(n,e[r[i]],r[i]);return r}function o(e){return function(t,n){e(n,t)}}function a(){return++Wr}function s(e,t){t?e.$$hashKey=t:delete e.$$hashKey}function u(e,t,n){for(var r=e.$$hashKey,i=0,o=t.length;i<o;++i){var a=t[i];if(y(a)||C(a))for(var c=Object.keys(a),l=0,f=c.length;l<f;l++){var h=c[l],p=a[h];n&&y(p)?S(p)?e[h]=new Date(p.valueOf()):E(p)?e[h]=new RegExp(p):p.nodeName?e[h]=p.cloneNode(!0):D(p)?e[h]=p.clone():(y(e[h])||(e[h]=Gr(p)?[]:{}),u(e[h],[p],!0)):e[h]=p}}return s(e,r),e}function c(e){return u(e,Fr.call(arguments,1),!1)}function l(e){return u(e,Fr.call(arguments,1),!0)}function f(e){return parseInt(e,10)}function h(e,t){return c(Object.create(e),t)}function p(){}function d(e){return e}function $(e){return function(){return e}}function v(e){return C(e.toString)&&e.toString!==Lr}function m(e){return void 0===e}function g(e){return void 0!==e}function y(e){return null!==e&&"object"==typeof e}function b(e){return null!==e&&"object"==typeof e&&!Hr(e)}function w(e){return"string"==typeof e}function x(e){return"number"==typeof e}function S(e){return"[object Date]"===Lr.call(e)}function C(e){return"function"==typeof e}function E(e){return"[object RegExp]"===Lr.call(e)}function A(e){return e&&e.window===e}function k(e){return e&&e.$evalAsync&&e.$watch}function O(e){return"[object File]"===Lr.call(e)}function M(e){return"[object FormData]"===Lr.call(e)}function T(e){return"[object Blob]"===Lr.call(e)}function N(e){return"boolean"==typeof e}function V(e){return e&&C(e.then)}function j(e){return e&&x(e.length)&&Zr.test(Lr.call(e))}function I(e){return"[object ArrayBuffer]"===Lr.call(e)}function D(e){return!(!e||!(e.nodeName||e.prop&&e.attr&&e.find))}function P(e){var t,n={},r=e.split(",");for(t=0;t<r.length;t++)n[r[t]]=!0;return n}function _(e){return Nr(e.nodeName||e[0]&&e[0].nodeName)}function R(e,t){var n=e.indexOf(t);return n>=0&&e.splice(n,1),n}function F(e,t){function n(e,t){var n,r=t.$$hashKey;if(Gr(e))for(var o=0,a=e.length;o<a;o++)t.push(i(e[o]));else if(b(e))for(n in e)t[n]=i(e[n]);else if(e&&"function"==typeof e.hasOwnProperty)for(n in e)e.hasOwnProperty(n)&&(t[n]=i(e[n]));else for(n in e)Tr.call(e,n)&&(t[n]=i(e[n]));return s(t,r),t}function i(e){if(!y(e))return e;var t=a.indexOf(e);if(-1!==t)return u[t];if(A(e)||k(e))throw Br("cpws","Can't copy! Making copies of Window or Scope instances is not supported.");var r=!1,i=o(e);return void 0===i&&(i=Gr(e)?[]:Object.create(Hr(e)),r=!0),a.push(e),u.push(i),r?n(e,i):i}function o(e){switch(Lr.call(e)){case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Float32Array]":case"[object Float64Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return new e.constructor(i(e.buffer));case"[object ArrayBuffer]":if(!e.slice){var t=new ArrayBuffer(e.byteLength);return new Uint8Array(t).set(new Uint8Array(e)),t}return e.slice(0);case"[object Boolean]":case"[object Number]":case"[object String]":case"[object Date]":return new e.constructor(e.valueOf());case"[object RegExp]":var n=new RegExp(e.source,e.toString().match(/[^\/]*$/)[0]);return n.lastIndex=e.lastIndex,n;case"[object Blob]":return new e.constructor([e],{type:e.type})}if(C(e.cloneNode))return e.cloneNode(!0)}var a=[],u=[];if(t){if(j(t)||I(t))throw Br("cpta","Can't copy! TypedArray destination cannot be mutated.");if(e===t)throw Br("cpi","Can't copy! Source and destination are identical.");return Gr(t)?t.length=0:r(t,function(e,n){"$$hashKey"!==n&&delete t[n]}),a.push(e),u.push(t),n(e,t)}return i(e)}function q(e,t){if(e===t)return!0;if(null===e||null===t)return!1;if(e!==e&&t!==t)return!0;var n,r,i,o=typeof e,a=typeof t;if(o==a&&"object"==o){if(!Gr(e)){if(S(e))return!!S(t)&&q(e.getTime(),t.getTime());if(E(e))return!!E(t)&&e.toString()==t.toString();if(k(e)||k(t)||A(e)||A(t)||Gr(t)||S(t)||E(t))return!1;i=pe();for(r in e)if("$"!==r.charAt(0)&&!C(e[r])){if(!q(e[r],t[r]))return!1;i[r]=!0}for(r in t)if(!(r in i)&&"$"!==r.charAt(0)&&g(t[r])&&!C(t[r]))return!1;return!0}if(!Gr(t))return!1;if((n=e.length)==t.length){for(r=0;r<n;r++)if(!q(e[r],t[r]))return!1;return!0}}return!1}function U(e,t,n){return e.concat(Fr.call(t,n))}function L(e,t){return Fr.call(e,t||0)}function H(e,t){var n=arguments.length>2?L(arguments,2):[];return!C(t)||t instanceof RegExp?t:n.length?function(){return arguments.length?t.apply(e,U(n,arguments,0)):t.apply(e,n)}:function(){return arguments.length?t.apply(e,arguments):t.call(e)}}function B(t,n){var r=n;return"string"==typeof t&&"$"===t.charAt(0)&&"$"===t.charAt(1)?r=void 0:A(n)?r="$WINDOW":n&&e.document===n?r="$DOCUMENT":k(n)&&(r="$SCOPE"),r}function z(e,t){if(!m(e))return x(t)||(t=t?2:null),JSON.stringify(e,B,t)}function W(e){return w(e)?JSON.parse(e):e}function G(e,t){e=e.replace(Qr,"");var n=Date.parse("Jan 01, 1970 00:00:00 "+e)/6e4;return isNaN(n)?t:n}function Z(e,t){return e=new Date(e.getTime()),e.setMinutes(e.getMinutes()+t),e}function J(e,t,n){n=n?-1:1;var r=e.getTimezoneOffset();return Z(e,n*(G(t,r)-r))}function Y(e){e=Pr(e).clone();try{e.empty()}catch(e){}var t=Pr("<div>").append(e).html();try{return e[0].nodeType===ii?Nr(t):t.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(e,t){return"<"+Nr(t)})}catch(e){return Nr(t)}}function K(e){try{return decodeURIComponent(e)}catch(e){}}function X(e){var t={};return r((e||"").split("&"),function(e){var n,r,i;e&&(r=e=e.replace(/\+/g,"%20"),n=e.indexOf("="),-1!==n&&(r=e.substring(0,n),i=e.substring(n+1)),r=K(r),g(r)&&(i=!g(i)||K(i),Tr.call(t,r)?Gr(t[r])?t[r].push(i):t[r]=[t[r],i]:t[r]=i))}),t}function Q(e){var t=[];return r(e,function(e,n){Gr(e)?r(e,function(e){t.push(te(n,!0)+(!0===e?"":"="+te(e,!0)))}):t.push(te(n,!0)+(!0===e?"":"="+te(e,!0)))}),t.length?t.join("&"):""}function ee(e){return te(e,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function te(e,t){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%3B/gi,";").replace(/%20/g,t?"%20":"+")}function ne(e,t){var n,r,i=ei.length;for(r=0;r<i;++r)if(n=ei[r]+t,w(n=e.getAttribute(n)))return n;return null}function re(e,t){var n,i,o={};r(ei,function(t){var r=t+"app";!n&&e.hasAttribute&&e.hasAttribute(r)&&(n=e,i=e.getAttribute(r))}),r(ei,function(t){var r,o=t+"app";!n&&(r=e.querySelector("["+o.replace(":","\\:")+"]"))&&(n=r,i=r.getAttribute(o))}),n&&(o.strictDi=null!==ne(n,"strict-di"),t(n,i?[i]:[],o))}function ie(t,n,i){y(i)||(i={}),i=c({strictDi:!1},i);var o=function(){if(t=Pr(t),t.injector()){var r=t[0]===e.document?"document":Y(t);throw Br("btstrpd","App already bootstrapped with this element '{0}'",r.replace(/</,"&lt;").replace(/>/,"&gt;"))}n=n||[],n.unshift(["$provide",function(e){e.value("$rootElement",t)}]),i.debugInfoEnabled&&n.push(["$compileProvider",function(e){e.debugInfoEnabled(!0)}]),n.unshift("ng");var o=tt(n,i.strictDi);return o.invoke(["$rootScope","$rootElement","$compile","$injector",function(e,t,n,r){e.$apply(function(){t.data("$injector",r),n(t)(e)})}]),o},a=/^NG_ENABLE_DEBUG_INFO!/,s=/^NG_DEFER_BOOTSTRAP!/;if(e&&a.test(e.name)&&(i.debugInfoEnabled=!0,e.name=e.name.replace(a,"")),e&&!s.test(e.name))return o();e.name=e.name.replace(s,""),zr.resumeBootstrap=function(e){return r(e,function(e){n.push(e)}),o()},C(zr.resumeDeferredBootstrap)&&zr.resumeDeferredBootstrap()}function oe(){e.name="NG_ENABLE_DEBUG_INFO!"+e.name,e.location.reload()}function ae(e){var t=zr.element(e).injector();if(!t)throw Br("test","no injector found for element argument to getTestability");return t.get("$$testability")}function se(e,t){return t=t||"_",e.replace(ti,function(e,n){return(n?t:"")+e.toLowerCase()})}function ue(e,t,n){if(!e)throw Br("areq","Argument '{0}' is {1}",t||"?",n||"required");return e}function ce(e,t,n){return n&&Gr(e)&&(e=e[e.length-1]),ue(C(e),t,"not a function, got "+(e&&"object"==typeof e?e.constructor.name||"Object":typeof e)),e}function le(e,t){if("hasOwnProperty"===e)throw Br("badname","hasOwnProperty is not a valid {0} name",t)}function fe(e,t,n){if(!t)return e;for(var r,i=t.split("."),o=e,a=i.length,s=0;s<a;s++)r=i[s],e&&(e=(o=e)[r]);return!n&&C(e)?H(o,e):e}function he(e){for(var t,n=e[0],r=e[e.length-1],i=1;n!==r&&(n=n.nextSibling);i++)(t||e[i]!==n)&&(t||(t=Pr(Fr.call(e,0,i))),t.push(n));return t||e}function pe(){return Object.create(null)}function de(e){function n(e,t,n){return e[t]||(e[t]=n())}var r=t("$injector"),i=t("ng"),o=n(e,"angular",Object);return o.$$minErr=o.$$minErr||t,n(o,"module",function(){var e={};return function(t,o,a){return function(e,t){if("hasOwnProperty"===e)throw i("badname","hasOwnProperty is not a valid {0} name",t)}(t,"module"),o&&e.hasOwnProperty(t)&&(e[t]=null),n(e,t,function(){function e(e,t,n,r){return r||(r=i),function(){return r[n||"push"]([e,t,arguments]),l}}function n(e,n){return function(r,o){return o&&C(o)&&(o.$$moduleName=t),i.push([e,n,arguments]),l}}if(!o)throw r("nomod","Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.",t);var i=[],s=[],u=[],c=e("$injector","invoke","push",s),l={_invokeQueue:i,_configBlocks:s,_runBlocks:u,requires:o,name:t,provider:n("$provide","provider"),factory:n("$provide","factory"),service:n("$provide","service"),value:e("$provide","value"),constant:e("$provide","constant","unshift"),decorator:n("$provide","decorator"),animation:n("$animateProvider","register"),filter:n("$filterProvider","register"),controller:n("$controllerProvider","register"),directive:n("$compileProvider","directive"),component:n("$compileProvider","component"),config:c,run:function(e){return u.push(e),this}};return a&&c(a),l})}})}function $e(e,t){if(Gr(e)){t=t||[];for(var n=0,r=e.length;n<r;n++)t[n]=e[n]}else if(y(e)){t=t||{};for(var i in e)"$"===i.charAt(0)&&"$"===i.charAt(1)||(t[i]=e[i])}return t||e}function ve(e){var t=[];return JSON.stringify(e,function(e,n){if(n=B(e,n),y(n)){if(t.indexOf(n)>=0)return"...";t.push(n)}return n})}function me(e){return"function"==typeof e?e.toString().replace(/ \{[\s\S]*$/,""):m(e)?"undefined":"string"!=typeof e?ve(e):e}function ge(){return++li}function ye(e){return e.replace(pi,function(e,t,n,r){return r?n.toUpperCase():n}).replace(di,"Moz$1")}function be(e){return!gi.test(e)}function we(e){var t=e.nodeType;return t===ri||!t||t===ai}function xe(e){for(var t in ci[e.ng339])return!0;return!1}function Se(e){for(var t=0,n=e.length;t<n;t++)Ne(e[t])}function Ce(e,t){var n,i,o,a,s=t.createDocumentFragment(),u=[];if(be(e))u.push(t.createTextNode(e));else{for(n=n||s.appendChild(t.createElement("div")),i=(yi.exec(e)||["",""])[1].toLowerCase(),o=wi[i]||wi._default,n.innerHTML=o[1]+e.replace(bi,"<$1></$2>")+o[2],a=o[0];a--;)n=n.lastChild;u=U(u,n.childNodes),n=s.firstChild,n.textContent=""}return s.textContent="",s.innerHTML="",r(u,function(e){s.appendChild(e)}),s}function Ee(t,n){n=n||e.document;var r;return(r=mi.exec(t))?[n.createElement(r[1])]:(r=Ce(t,n))?r.childNodes:[]}function Ae(e,t){var n=e.parentNode;n&&n.replaceChild(t,e),t.appendChild(e)}function ke(e){if(e instanceof ke)return e;var t;if(w(e)&&(e=Jr(e),t=!0),!(this instanceof ke)){if(t&&"<"!=e.charAt(0))throw vi("nosel","Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");return new ke(e)}t?_e(this,Ee(e)):_e(this,e)}function Oe(e){return e.cloneNode(!0)}function Me(e,t){if(t||Ne(e),e.querySelectorAll)for(var n=e.querySelectorAll("*"),r=0,i=n.length;r<i;r++)Ne(n[r])}function Te(e,t,n,i){if(g(i))throw vi("offargs","jqLite#off() does not support the `selector` argument");var o=Ve(e),a=o&&o.events,s=o&&o.handle;if(s)if(t){var u=function(t){var r=a[t];g(n)&&R(r||[],n),g(n)&&r&&r.length>0||(hi(e,t,s),delete a[t])};r(t.split(" "),function(e){u(e),$i[e]&&u($i[e])})}else for(t in a)"$destroy"!==t&&hi(e,t,s),delete a[t]}function Ne(e,t){var n=e.ng339,r=n&&ci[n];if(r){if(t)return void delete r.data[t];r.handle&&(r.events.$destroy&&r.handle({},"$destroy"),Te(e)),delete ci[n],e.ng339=void 0}}function Ve(e,t){var n=e.ng339,r=n&&ci[n];return t&&!r&&(e.ng339=n=ge(),r=ci[n]={events:{},data:{},handle:void 0}),r}function je(e,t,n){if(we(e)){var r=g(n),i=!r&&t&&!y(t),o=!t,a=Ve(e,!i),s=a&&a.data;if(r)s[t]=n;else{if(o)return s;if(i)return s&&s[t];c(s,t)}}}function Ie(e,t){return!!e.getAttribute&&(" "+(e.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+t+" ")>-1}function De(e,t){t&&e.setAttribute&&r(t.split(" "),function(t){e.setAttribute("class",Jr((" "+(e.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").replace(" "+Jr(t)+" "," ")))})}function Pe(e,t){if(t&&e.setAttribute){var n=(" "+(e.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");r(t.split(" "),function(e){e=Jr(e),-1===n.indexOf(" "+e+" ")&&(n+=e+" ")}),e.setAttribute("class",Jr(n))}}function _e(e,t){if(t)if(t.nodeType)e[e.length++]=t;else{var n=t.length;if("number"==typeof n&&t.window!==t){if(n)for(var r=0;r<n;r++)e[e.length++]=t[r]}else e[e.length++]=t}}function Re(e,t){return Fe(e,"$"+(t||"ngController")+"Controller")}function Fe(e,t,n){e.nodeType==ai&&(e=e.documentElement);for(var r=Gr(t)?t:[t];e;){for(var i=0,o=r.length;i<o;i++)if(g(n=Pr.data(e,r[i])))return n;e=e.parentNode||e.nodeType===si&&e.host}}function qe(e){for(Me(e,!0);e.firstChild;)e.removeChild(e.firstChild)}function Ue(e,t){t||Me(e);var n=e.parentNode;n&&n.removeChild(e)}function Le(t,n){n=n||e,"complete"===n.document.readyState?n.setTimeout(t):Pr(n).on("load",t)}function He(e,t){var n=Ci[t.toLowerCase()];return n&&Ei[_(e)]&&n}function Be(e){return Ai[e]}function ze(e,t){var n=function(n,r){n.isDefaultPrevented=function(){return n.defaultPrevented};var i=t[r||n.type],o=i?i.length:0;if(o){if(m(n.immediatePropagationStopped)){var a=n.stopImmediatePropagation;n.stopImmediatePropagation=function(){n.immediatePropagationStopped=!0,n.stopPropagation&&n.stopPropagation(),a&&a.call(n)}}n.isImmediatePropagationStopped=function(){return!0===n.immediatePropagationStopped};var s=i.specialHandlerWrapper||We;o>1&&(i=$e(i));for(var u=0;u<o;u++)n.isImmediatePropagationStopped()||s(e,n,i[u])}};return n.elem=e,n}function We(e,t,n){n.call(e,t)}function Ge(e,t,n){var r=t.relatedTarget;r&&(r===e||xi.call(e,r))||n.call(e,t)}function Ze(){this.$get=function(){return c(ke,{hasClass:function(e,t){return e.attr&&(e=e[0]),Ie(e,t)},addClass:function(e,t){return e.attr&&(e=e[0]),Pe(e,t)},removeClass:function(e,t){return e.attr&&(e=e[0]),De(e,t)}})}}function Je(e,t){var n=e&&e.$$hashKey;if(n)return"function"==typeof n&&(n=e.$$hashKey()),n;var r=typeof e;return n="function"==r||"object"==r&&null!==e?e.$$hashKey=r+":"+(t||a)():r+":"+e}function Ye(e,t){if(t){var n=0;this.nextUid=function(){return++n}}r(e,this.put,this)}function Ke(e){return Function.prototype.toString.call(e)+" "}function Xe(e){var t=Ke(e).replace(Vi,"");return t.match(Oi)||t.match(Mi)}function Qe(e){var t=Xe(e);return t?"function("+(t[1]||"").replace(/[\s\r\n]+/," ")+")":"fn"}function et(e,t,n){var i,o,a;if("function"==typeof e){if(!(i=e.$inject)){if(i=[],e.length){if(t)throw w(n)&&n||(n=e.name||Qe(e)),ji("strictdi","{0} is not using explicit annotation and cannot be invoked in strict mode",n);o=Xe(e),r(o[1].split(Ti),function(e){e.replace(Ni,function(e,t,n){i.push(n)})})}e.$inject=i}}else Gr(e)?(a=e.length-1,ce(e[a],"fn"),i=e.slice(0,a)):ce(e,"fn",!0);return i}function tt(e,t){function n(e){return function(t,n){if(!y(t))return e(t,n);r(t,o(e))}}function i(e,t){if(le(e,"service"),(C(t)||Gr(t))&&(t=S.instantiate(t)),!t.$get)throw ji("pget","Provider '{0}' must define $get factory method.",e);return x[e+v]=t}function a(e,t){return function(){var n=k.invoke(t,this);if(m(n))throw ji("undef","Provider '{0}' must return a value from $get factory method.",e);return n}}function s(e,t,n){return i(e,{$get:!1!==n?a(e,t):t})}function u(e,t){return s(e,["$injector",function(e){return e.instantiate(t)}])}function c(e,t){return s(e,$(t),!1)}function l(e,t){le(e,"constant"),x[e]=t,E[e]=t}function f(e,t){var n=S.get(e+v),r=n.$get;n.$get=function(){var e=k.invoke(r,n);return k.invoke(t,null,{$delegate:e})}}function h(e){ue(m(e)||Gr(e),"modulesToLoad","not an array");var t,n=[];return r(e,function(e){function r(e){var t,n;for(t=0,n=e.length;t<n;t++){var r=e[t],i=S.get(r[0]);i[r[1]].apply(i,r[2])}}if(!b.get(e)){b.put(e,!0);try{w(e)?(t=Rr(e),n=n.concat(h(t.requires)).concat(t._runBlocks),r(t._invokeQueue),r(t._configBlocks)):C(e)?n.push(S.invoke(e)):Gr(e)?n.push(S.invoke(e)):ce(e,"module")}catch(t){throw Gr(e)&&(e=e[e.length-1]),t.message&&t.stack&&-1==t.stack.indexOf(t.message)&&(t=t.message+"\n"+t.stack),ji("modulerr","Failed to instantiate module {0} due to:\n{1}",e,t.stack||t.message||t)}}}),n}function p(e,n){function r(t,r){if(e.hasOwnProperty(t)){if(e[t]===d)throw ji("cdep","Circular dependency found: {0}",t+" <- "+g.join(" <- "));return e[t]}try{return g.unshift(t),e[t]=d,e[t]=n(t,r)}catch(n){throw e[t]===d&&delete e[t],n}finally{g.shift()}}function i(e,n,i){for(var o=[],a=tt.$$annotate(e,t,i),s=0,u=a.length;s<u;s++){var c=a[s];if("string"!=typeof c)throw ji("itkn","Incorrect injection token! Expected service name as string, got {0}",c);o.push(n&&n.hasOwnProperty(c)?n[c]:r(c,i))}return o}function o(e){return!(Dr<=11)&&("function"==typeof e&&/^(?:class\s|constructor\()/.test(Ke(e)))}function a(e,t,n,r){"string"==typeof n&&(r=n,n=null);var a=i(e,n,r);return Gr(e)&&(e=e[e.length-1]),o(e)?(a.unshift(null),new(Function.prototype.bind.apply(e,a))):e.apply(t,a)}function s(e,t,n){var r=Gr(e)?e[e.length-1]:e,o=i(e,t,n);return o.unshift(null),new(Function.prototype.bind.apply(r,o))}return{invoke:a,instantiate:s,get:r,annotate:tt.$$annotate,has:function(t){return x.hasOwnProperty(t+v)||e.hasOwnProperty(t)}}}t=!0===t;var d={},v="Provider",g=[],b=new Ye([],!0),x={$provide:{provider:n(i),factory:n(s),service:n(u),value:n(c),constant:n(l),decorator:f}},S=x.$injector=p(x,function(e,t){throw zr.isString(t)&&g.push(t),ji("unpr","Unknown provider: {0}",g.join(" <- "))}),E={},A=p(E,function(e,t){var n=S.get(e+v,t);return k.invoke(n.$get,n,void 0,e)}),k=A;x["$injector"+v]={$get:$(A)};var O=h(e);return k=A.get("$injector"),k.strictDi=t,r(O,function(e){e&&k.invoke(e)}),k}function nt(){var e=!0;this.disableAutoScrolling=function(){e=!1},this.$get=["$window","$location","$rootScope",function(t,n,r){function i(e){var t=null;return Array.prototype.some.call(e,function(e){if("a"===_(e))return t=e,!0}),t}function o(){var e=s.yOffset;if(C(e))e=e();else if(D(e)){var n=e[0],r=t.getComputedStyle(n);e="fixed"!==r.position?0:n.getBoundingClientRect().bottom}else x(e)||(e=0);return e}function a(e){if(e){e.scrollIntoView();var n=o();if(n){var r=e.getBoundingClientRect().top;t.scrollBy(0,r-n)}}else t.scrollTo(0,0)}function s(e){e=w(e)?e:n.hash();var t;e?(t=u.getElementById(e))?a(t):(t=i(u.getElementsByName(e)))?a(t):"top"===e&&a(null):a(null)}var u=t.document;return e&&r.$watch(function(){return n.hash()},function(e,t){e===t&&""===e||Le(function(){r.$evalAsync(s)})}),s}]}function rt(e,t){return e||t?e?t?(Gr(e)&&(e=e.join(" ")),Gr(t)&&(t=t.join(" ")),e+" "+t):e:t:""}function it(e){for(var t=0;t<e.length;t++){var n=e[t];if(n.nodeType===Di)return n}}function ot(e){w(e)&&(e=e.split(" "));var t=pe();return r(e,function(e){e.length&&(t[e]=!0)}),t}function at(e){return y(e)?e:{}}function st(e,t,n,i){function o(e){try{e.apply(null,L(arguments,1))}finally{if(0===--g)for(;y.length;)try{y.pop()()}catch(e){n.error(e)}}}function a(e){var t=e.indexOf("#");return-1===t?"":e.substr(t)}function s(){C=null,u(),c()}function u(){b=E(),b=m(b)?null:b,q(b,O)&&(b=O),O=b}function c(){x===l.url()&&w===b||(x=l.url(),w=b,r(A,function(e){e(l.url(),b)}))}var l=this,f=e.location,h=e.history,d=e.setTimeout,$=e.clearTimeout,v={};l.isMock=!1;var g=0,y=[];l.$$completeOutstandingRequest=o,l.$$incOutstandingRequestCount=function(){g++},l.notifyWhenNoOutstandingRequests=function(e){0===g?e():y.push(e)};var b,w,x=f.href,S=t.find("base"),C=null,E=i.history?function(){try{return h.state}catch(e){}}:p;u(),w=b,l.url=function(t,n,r){if(m(r)&&(r=null),f!==e.location&&(f=e.location),h!==e.history&&(h=e.history),t){var o=w===r;if(x===t&&(!i.history||o))return l;var s=x&&Ut(x)===Ut(t);return x=t,w=r,!i.history||s&&o?(s||(C=t),n?f.replace(t):s?f.hash=a(t):f.href=t,f.href!==t&&(C=t)):(h[n?"replaceState":"pushState"](r,"",t),u(),w=b),C&&(C=t),l}return C||f.href.replace(/%27/g,"'")},l.state=function(){return b};var A=[],k=!1,O=null;l.onUrlChange=function(t){return k||(i.history&&Pr(e).on("popstate",s),Pr(e).on("hashchange",s),k=!0),A.push(t),t},l.$$applicationDestroyed=function(){Pr(e).off("hashchange popstate",s)},l.$$checkUrlChange=c,l.baseHref=function(){var e=S.attr("href");return e?e.replace(/^(https?\:)?\/\/[^\/]*/,""):""},l.defer=function(e,t){var n;return g++,n=d(function(){delete v[n],o(e)},t||0),v[n]=!0,n},l.defer.cancel=function(e){return!!v[e]&&(delete v[e],$(e),o(p),!0)}}function ut(){this.$get=["$window","$log","$sniffer","$document",function(e,t,n,r){return new st(e,r,t,n)}]}function ct(){this.$get=function(){function e(e,r){function i(e){e!=h&&(p?p==e&&(p=e.n):p=e,o(e.n,e.p),o(e,h),h=e,h.n=null)}function o(e,t){e!=t&&(e&&(e.p=t),t&&(t.n=e))}if(e in n)throw t("$cacheFactory")("iid","CacheId '{0}' is already taken!",e);var a=0,s=c({},r,{id:e}),u=pe(),l=r&&r.capacity||Number.MAX_VALUE,f=pe(),h=null,p=null;return n[e]={put:function(e,t){if(!m(t)){if(l<Number.MAX_VALUE){i(f[e]||(f[e]={key:e}))}return e in u||a++,u[e]=t,a>l&&this.remove(p.key),t}},get:function(e){if(l<Number.MAX_VALUE){var t=f[e];if(!t)return;i(t)}return u[e]},remove:function(e){if(l<Number.MAX_VALUE){var t=f[e];if(!t)return;t==h&&(h=t.p),t==p&&(p=t.n),o(t.n,t.p),delete f[e]}e in u&&(delete u[e],a--)},removeAll:function(){u=pe(),a=0,f=pe(),h=p=null},destroy:function(){u=null,s=null,f=null,delete n[e]},info:function(){return c({},s,{size:a})}}}var n={};return e.info=function(){var e={};return r(n,function(t,n){e[n]=t.info()}),e},e.get=function(e){return n[e]},e}}function lt(){this.$get=["$cacheFactory",function(e){return e("templates")}]}function ft(){}function ht(t,n){function i(e,t,n){var i=/^\s*([@&<]|=(\*?))(\??)\s*(\w*)\s*$/,o=pe();return r(e,function(e,r){if(e in A)return void(o[r]=A[e]);var a=e.match(i);if(!a)throw Li("iscp","Invalid {3} for directive '{0}'. Definition: {... {1}: '{2}' ...}",t,r,e,n?"controller bindings definition":"isolate scope definition");o[r]={mode:a[1][0],collection:"*"===a[2],optional:"?"===a[3],attrName:a[4]||r},a[4]&&(A[e]=o[r])}),o}function a(e,t){var n={isolateScope:null,bindToController:null};if(y(e.scope)&&(!0===e.bindToController?(n.bindToController=i(e.scope,t,!0),n.isolateScope={}):n.isolateScope=i(e.scope,t,!1)),y(e.bindToController)&&(n.bindToController=i(e.bindToController,t,!0)),y(n.bindToController)){var r=e.controller,o=e.controllerAs;if(!r)throw Li("noctrl","Cannot bind to controller without directive '{0}'s controller.",t);if(!mt(r,o))throw Li("noident","Cannot bind to controller without identifier for directive '{0}'.",t)}return n}function s(e){var t=e.charAt(0);if(!t||t!==Nr(t))throw Li("baddir","Directive/Component name '{0}' is invalid. The first character must be a lowercase letter",e);if(e!==e.trim())throw Li("baddir","Directive/Component name '{0}' is invalid. The name should not contain leading or trailing whitespaces",e)}function u(e){var t=e.require||e.controller&&e.name;return!Gr(t)&&y(t)&&r(t,function(e,n){var r=e.match(S);e.substring(r[0].length)||(t[n]=r[0]+n)}),t}var l={},f="Directive",v=/^\s*directive\:\s*([\w\-]+)\s+(.*)$/,b=/(([\w\-]+)(?:\:([^;]+))?;?)/,x=P("ngSrc,ngSrcset,src,srcset"),S=/^(?:(\^\^?)?(\?)?(\^\^?)?)?/,E=/^(on[a-z]+|formaction)$/,A=pe();this.directive=function e(n,i){return le(n,"directive"),w(n)?(s(n),ue(i,"directiveFactory"),l.hasOwnProperty(n)||(l[n]=[],t.factory(n+f,["$injector","$exceptionHandler",function(e,t){var i=[];return r(l[n],function(r,o){try{var a=e.invoke(r);C(a)?a={compile:$(a)}:!a.compile&&a.link&&(a.compile=$(a.link)),a.priority=a.priority||0,a.index=o,a.name=a.name||n,a.require=u(a),a.restrict=a.restrict||"EA",a.$$moduleName=r.$$moduleName,i.push(a)}catch(e){t(e)}}),i}])),l[n].push(i)):r(n,o(e)),this},this.component=function(e,t){function n(e){function n(t){return C(t)||Gr(t)?function(n,r){return e.invoke(t,this,{$element:n,$attrs:r})}:t}var o=t.template||t.templateUrl?t.template:"",a={controller:i,controllerAs:mt(t.controller)||t.controllerAs||"$ctrl",template:n(o),templateUrl:n(t.templateUrl),transclude:t.transclude,scope:{},bindToController:t.bindings||{},restrict:"E",require:t.require};return r(t,function(e,t){"$"===t.charAt(0)&&(a[t]=e)}),a}var i=t.controller||function(){};return r(t,function(e,t){"$"===t.charAt(0)&&(n[t]=e,C(i)&&(i[t]=e))}),n.$inject=["$injector"],this.directive(e,n)},this.aHrefSanitizationWhitelist=function(e){return g(e)?(n.aHrefSanitizationWhitelist(e),this):n.aHrefSanitizationWhitelist()},this.imgSrcSanitizationWhitelist=function(e){return g(e)?(n.imgSrcSanitizationWhitelist(e),this):n.imgSrcSanitizationWhitelist()};var O=!0;this.debugInfoEnabled=function(e){return g(e)?(O=e,this):O};var M=10;this.onChangesTtl=function(e){return arguments.length?(M=e,this):M},this.$get=["$injector","$interpolate","$exceptionHandler","$templateRequest","$parse","$controller","$rootScope","$sce","$animate","$$sanitizeUri",function(t,n,i,o,s,u,$,A,T,V){function j(){try{if(!--xe)throw ge=void 0,Li("infchng","{0} $onChanges() iterations reached. Aborting!\n",M);$.$apply(function(){for(var e=[],t=0,n=ge.length;t<n;++t)try{ge[t]()}catch(t){e.push(t)}if(ge=void 0,e.length)throw e})}finally{xe++}}function I(e,t){if(t){var n,r,i,o=Object.keys(t);for(n=0,r=o.length;n<r;n++)i=o[n],this[i]=t[i]}else this.$attr={};this.$$element=e}function D(e,t,n){we.innerHTML="<span "+t+">";var r=we.firstChild.attributes,i=r[0];r.removeNamedItem(i.name),i.value=n,e.attributes.setNamedItem(i)}function P(e,t){try{e.addClass(t)}catch(e){}}function F(t,n,r,i,o){t instanceof Pr||(t=Pr(t));for(var a=/\S+/,s=0,u=t.length;s<u;s++){var c=t[s];c.nodeType===ii&&c.nodeValue.match(a)&&Ae(c,t[s]=e.document.createElement("span"))}var l=B(t,n,t,r,i,o);F.$$addScopeClass(t);var f=null;return function(e,n,r){ue(e,"scope"),o&&o.needsNewScope&&(e=e.$parent.$new()),r=r||{};var i=r.parentBoundTranscludeFn,a=r.transcludeControllers,s=r.futureParentElement;i&&i.$$boundTransclude&&(i=i.$$boundTransclude),f||(f=U(s));var u;if(u="html"!==f?Pr(le(f,Pr("<div>").append(t).html())):n?Si.clone.call(t):t,a)for(var c in a)u.data("$"+c+"Controller",a[c].instance);return F.$$addScopeInfo(u,e),n&&n(u,e),l&&l(e,u,u,i),u}}function U(e){var t=e&&e[0];return t&&"foreignobject"!==_(t)&&Lr.call(t).match(/SVG/)?"svg":"html"}function B(e,t,n,r,i,o){function a(e,n,r,i){var o,a,s,u,c,l,f,h,$;if(p){var v=n.length;for($=new Array(v),c=0;c<d.length;c+=3)f=d[c],$[f]=n[f]}else $=n;for(c=0,l=d.length;c<l;)s=$[d[c++]],o=d[c++],a=d[c++],o?(o.scope?(u=e.$new(),F.$$addScopeInfo(Pr(s),u)):u=e,h=o.transcludeOnThisElement?z(e,o.transclude,i):!o.templateOnThisElement&&i?i:!i&&t?z(e,t):null,o(a,u,s,r,h)):a&&a(e,s.childNodes,void 0,i)}for(var s,u,c,l,f,h,p,d=[],$=0;$<e.length;$++)s=new I,u=W(e[$],[],s,0===$?r:void 0,i),c=u.length?K(u,e[$],s,t,n,null,[],[],o):null,c&&c.scope&&F.$$addScopeClass(s.$$element),f=c&&c.terminal||!(l=e[$].childNodes)||!l.length?null:B(l,c?(c.transcludeOnThisElement||!c.templateOnThisElement)&&c.transclude:t),(c||f)&&(d.push($,c,f),h=!0,p=p||c),o=null;return h?a:null}function z(e,t,n){function r(r,i,o,a,s){return r||(r=e.$new(!1,s),r.$$transcluded=!0),t(r,i,{parentBoundTranscludeFn:n,transcludeControllers:o,futureParentElement:a})}var i=r.$$slots=pe();for(var o in t.$$slots)t.$$slots[o]?i[o]=z(e,t.$$slots[o],n):i[o]=null;return r}function W(e,t,n,r,i){var o,a,s=e.nodeType,u=n.$attr;switch(s){case ri:te(t,dt(_(e)),"E",r,i);for(var c,l,f,h,p,d,$=e.attributes,m=0,g=$&&$.length;m<g;m++){var x=!1,S=!1;c=$[m],l=c.name,p=Jr(c.value),h=dt(l),(d=ke.test(h))&&(l=l.replace(Bi,"").substr(8).replace(/_(.)/g,function(e,t){return t.toUpperCase()}));var C=h.match(Me);C&&ne(C[1])&&(x=l,S=l.substr(0,l.length-5)+"end",l=l.substr(0,l.length-6)),f=dt(l.toLowerCase()),u[f]=l,!d&&n.hasOwnProperty(f)||(n[f]=p,He(e,f)&&(n[f]=!0)),he(e,t,p,f,d),te(t,f,"A",r,i,x,S)}if(a=e.className,y(a)&&(a=a.animVal),w(a)&&""!==a)for(;o=b.exec(a);)f=dt(o[2]),te(t,f,"C",r,i)&&(n[f]=Jr(o[3])),a=a.substr(o.index+o[0].length);break;case ii:if(11===Dr)for(;e.parentNode&&e.nextSibling&&e.nextSibling.nodeType===ii;)e.nodeValue=e.nodeValue+e.nextSibling.nodeValue,e.parentNode.removeChild(e.nextSibling);ce(t,e.nodeValue);break;case oi:try{o=v.exec(e.nodeValue),o&&(f=dt(o[1]),te(t,f,"M",r,i)&&(n[f]=Jr(o[2])))}catch(e){}}return t.sort(oe),t}function G(e,t,n){var r=[],i=0;if(t&&e.hasAttribute&&e.hasAttribute(t))do{if(!e)throw Li("uterdir","Unterminated attribute, found '{0}' but no matching '{1}' found.",t,n);e.nodeType==ri&&(e.hasAttribute(t)&&i++,e.hasAttribute(n)&&i--),r.push(e),e=e.nextSibling}while(i>0);else r.push(e);return Pr(r)}function Z(e,t,n){return function(r,i,o,a,s){return i=G(i[0],t,n),e(r,i,o,a,s)}}function J(e,t,n,r,i,o){var a;return e?F(t,n,r,i,o):function(){return a||(a=F(t,n,r,i,o),t=n=o=null),a.apply(this,arguments)}}function K(e,t,n,o,a,s,u,l,f){function h(e,t,n,r){e&&(n&&(e=Z(e,n,r)),e.require=d.require,e.directiveName=$,(E===d||d.$$isolateScope)&&(e=$e(e,{isolateScope:!0})),u.push(e)),t&&(n&&(t=Z(t,n,r)),t.require=d.require,t.directiveName=$,(E===d||d.$$isolateScope)&&(t=$e(t,{isolateScope:!0})),l.push(t))}function p(e,o,a,s,f){function h(e,t,n,r){var i;if(k(e)||(r=n,n=t,t=e,e=void 0),N&&(i=b),n||(n=N?O.parent():O),!r)return f(e,t,i,n,R);var o=f.$$slots[r];if(o)return o(e,t,i,n,R);if(m(o))throw Li("noslot",'No parent directive that requires a transclusion with slot name "{0}". Element: {1}',r,Y(O))}var p,d,$,v,g,b,w,O,M,T;t===a?(M=n,O=n.$$element):(O=Pr(a),M=new I(O,n)),g=o,E?v=o.$new(!0):x&&(g=o.$parent),f&&(w=h,w.$$boundTransclude=f,w.isSlotFilled=function(e){return!!f.$$slots[e]}),S&&(b=Q(O,M,w,S,v,o,E)),E&&(F.$$addScopeInfo(O,v,!0,!(A&&(A===E||A===E.$$originalDirective))),F.$$addScopeClass(O,!0),v.$$isolateBindings=E.$$isolateBindings,T=me(o,M,v,v.$$isolateBindings,E),T.removeWatches&&v.$on("$destroy",T.removeWatches));for(var V in b){var j=S[V],D=b[V],P=j.$$bindings.bindToController;D.identifier&&P?D.bindingInfo=me(g,M,D.instance,P,j):D.bindingInfo={};var _=D();_!==D.instance&&(D.instance=_,O.data("$"+j.name+"Controller",_),D.bindingInfo.removeWatches&&D.bindingInfo.removeWatches(),D.bindingInfo=me(g,M,D.instance,P,j))}for(r(S,function(e,t){var n=e.require;e.bindToController&&!Gr(n)&&y(n)&&c(b[t].instance,X(t,n,O,b))}),r(b,function(e){var t=e.instance;if(C(t.$onChanges))try{t.$onChanges(e.bindingInfo.initialChanges)}catch(e){i(e)}if(C(t.$onInit))try{t.$onInit()}catch(e){i(e)}C(t.$onDestroy)&&g.$on("$destroy",function(){t.$onDestroy()})}),p=0,
d=u.length;p<d;p++)$=u[p],ve($,$.isolateScope?v:o,O,M,$.require&&X($.directiveName,$.require,O,b),w);var R=o;for(E&&(E.template||null===E.templateUrl)&&(R=v),e&&e(R,a.childNodes,void 0,f),p=l.length-1;p>=0;p--)$=l[p],ve($,$.isolateScope?v:o,O,M,$.require&&X($.directiveName,$.require,O,b),w);r(b,function(e){var t=e.instance;C(t.$postLink)&&t.$postLink()})}f=f||{};for(var d,$,v,g,b,w=-Number.MAX_VALUE,x=f.newScopeDirective,S=f.controllerDirectives,E=f.newIsolateScopeDirective,A=f.templateDirective,O=f.nonTlbTranscludeDirective,M=!1,T=!1,N=f.hasElementTranscludeDirective,V=n.$$element=Pr(t),j=s,D=o,P=!1,R=!1,q=0,U=e.length;q<U;q++){d=e[q];var B=d.$$start,z=d.$$end;if(B&&(V=G(t,B,z)),v=void 0,w>d.priority)break;if((b=d.scope)&&(d.templateUrl||(y(b)?(ae("new/isolated scope",E||x,d,V),E=d):ae("new/isolated scope",E,d,V)),x=x||d),$=d.name,!P&&(d.replace&&(d.templateUrl||d.template)||d.transclude&&!d.$$tlb)){for(var K,te=q+1;K=e[te++];)if(K.transclude&&!K.$$tlb||K.replace&&(K.templateUrl||K.template)){R=!0;break}P=!0}if(!d.templateUrl&&d.controller&&(b=d.controller,S=S||pe(),ae("'"+$+"' controller",S[$],d,V),S[$]=d),b=d.transclude)if(M=!0,d.$$tlb||(ae("transclusion",O,d,V),O=d),"element"==b)N=!0,w=d.priority,v=V,V=n.$$element=Pr(F.$$createComment($,n[$])),t=V[0],de(a,L(v),t),v[0].$$parentNode=v[0].parentNode,D=J(R,v,o,w,j&&j.name,{nonTlbTranscludeDirective:O});else{var ne=pe();if(v=Pr(Oe(t)).contents(),y(b)){v=[];var oe=pe(),se=pe();r(b,function(e,t){var n="?"===e.charAt(0);e=n?e.substring(1):e,oe[e]=t,ne[t]=null,se[t]=n}),r(V.contents(),function(e){var t=oe[dt(_(e))];t?(se[t]=!0,ne[t]=ne[t]||[],ne[t].push(e)):v.push(e)}),r(se,function(e,t){if(!e)throw Li("reqslot","Required transclusion slot `{0}` was not filled.",t)});for(var ue in ne)ne[ue]&&(ne[ue]=J(R,ne[ue],o))}V.empty(),D=J(R,v,o,void 0,void 0,{needsNewScope:d.$$isolateScope||d.$$newScope}),D.$$slots=ne}if(d.template)if(T=!0,ae("template",A,d,V),A=d,b=C(d.template)?d.template(V,n):d.template,b=Ee(b),d.replace){if(j=d,v=be(b)?[]:vt(le(d.templateNamespace,Jr(b))),t=v[0],1!=v.length||t.nodeType!==ri)throw Li("tplrt","Template for directive '{0}' must have exactly one root element. {1}",$,"");de(a,V,t);var ce={$attr:{}},fe=W(t,[],ce),he=e.splice(q+1,e.length-(q+1));(E||x)&&ee(fe,E,x),e=e.concat(fe).concat(he),re(n,ce),U=e.length}else V.html(b);if(d.templateUrl)T=!0,ae("template",A,d,V),A=d,d.replace&&(j=d),p=ie(e.splice(q,e.length-q),V,n,a,M&&D,u,l,{controllerDirectives:S,newScopeDirective:x!==d&&x,newIsolateScopeDirective:E,templateDirective:A,nonTlbTranscludeDirective:O}),U=e.length;else if(d.compile)try{g=d.compile(V,n,D);var ge=d.$$originalDirective||d;C(g)?h(null,H(ge,g),B,z):g&&h(H(ge,g.pre),H(ge,g.post),B,z)}catch(e){i(e,Y(V))}d.terminal&&(p.terminal=!0,w=Math.max(w,d.priority))}return p.scope=x&&!0===x.scope,p.transcludeOnThisElement=M,p.templateOnThisElement=T,p.transclude=D,f.hasElementTranscludeDirective=N,p}function X(e,t,n,i){var o;if(w(t)){var a=t.match(S),s=t.substring(a[0].length),u=a[1]||a[3],c="?"===a[2];if("^^"===u?n=n.parent():(o=i&&i[s],o=o&&o.instance),!o){var l="$"+s+"Controller";o=u?n.inheritedData(l):n.data(l)}if(!o&&!c)throw Li("ctreq","Controller '{0}', required by directive '{1}', can't be found!",s,e)}else if(Gr(t)){o=[];for(var f=0,h=t.length;f<h;f++)o[f]=X(e,t[f],n,i)}else y(t)&&(o={},r(t,function(t,r){o[r]=X(e,t,n,i)}));return o||null}function Q(e,t,n,r,i,o,a){var s=pe();for(var c in r){var l=r[c],f={$scope:l===a||l.$$isolateScope?i:o,$element:e,$attrs:t,$transclude:n},h=l.controller;"@"==h&&(h=t[l.name]);var p=u(h,f,!0,l.controllerAs);s[l.name]=p,e.data("$"+l.name+"Controller",p.instance)}return s}function ee(e,t,n){for(var r=0,i=e.length;r<i;r++)e[r]=h(e[r],{$$isolateScope:t,$$newScope:n})}function te(e,n,r,o,s,u,c){if(n===s)return null;var p=null;if(l.hasOwnProperty(n))for(var d,$=t.get(n+f),v=0,g=$.length;v<g;v++)try{if(d=$[v],(m(o)||o>d.priority)&&-1!=d.restrict.indexOf(r)){if(u&&(d=h(d,{$$start:u,$$end:c})),!d.$$bindings){var b=d.$$bindings=a(d,d.name);y(b.isolateScope)&&(d.$$isolateBindings=b.isolateScope)}e.push(d),p=d}}catch(e){i(e)}return p}function ne(e){if(l.hasOwnProperty(e))for(var n,r=t.get(e+f),i=0,o=r.length;i<o;i++)if(n=r[i],n.multiElement)return!0;return!1}function re(e,t){var n=t.$attr,i=e.$attr;e.$$element;r(e,function(r,i){"$"!=i.charAt(0)&&(t[i]&&t[i]!==r&&(r+=("style"===i?";":" ")+t[i]),e.$set(i,r,!0,n[i]))}),r(t,function(t,r){e.hasOwnProperty(r)||"$"===r.charAt(0)||(e[r]=t,"class"!==r&&"style"!==r&&(i[r]=n[r]))})}function ie(e,t,n,i,a,s,u,c){var l,f,p=[],d=t[0],$=e.shift(),v=h($,{templateUrl:null,transclude:null,replace:null,$$originalDirective:$}),m=C($.templateUrl)?$.templateUrl(t,n):$.templateUrl,g=$.templateNamespace;return t.empty(),o(m).then(function(o){var h,b,w,x;if(o=Ee(o),$.replace){if(w=be(o)?[]:vt(le(g,Jr(o))),h=w[0],1!=w.length||h.nodeType!==ri)throw Li("tplrt","Template for directive '{0}' must have exactly one root element. {1}",$.name,m);b={$attr:{}},de(i,t,h);var S=W(h,[],b);y($.scope)&&ee(S,!0),e=S.concat(e),re(n,b)}else h=d,t.html(o);for(e.unshift(v),l=K(e,h,n,a,t,$,s,u,c),r(i,function(e,n){e==h&&(i[n]=t[0])}),f=B(t[0].childNodes,a);p.length;){var C=p.shift(),E=p.shift(),A=p.shift(),k=p.shift(),O=t[0];if(!C.$$destroyed){if(E!==d){var M=E.className;c.hasElementTranscludeDirective&&$.replace||(O=Oe(h)),de(A,Pr(E),O),P(Pr(O),M)}x=l.transcludeOnThisElement?z(C,l.transclude,k):k,l(f,C,O,i,x)}}p=null}),function(e,t,n,r,i){var o=i;t.$$destroyed||(p?p.push(t,n,r,o):(l.transcludeOnThisElement&&(o=z(t,l.transclude,i)),l(f,t,n,r,o)))}}function oe(e,t){var n=t.priority-e.priority;return 0!==n?n:e.name!==t.name?e.name<t.name?-1:1:e.index-t.index}function ae(e,t,n,r){function i(e){return e?" (module: "+e+")":""}if(t)throw Li("multidir","Multiple directives [{0}{1}, {2}{3}] asking for {4} on: {5}",t.name,i(t.$$moduleName),n.name,i(n.$$moduleName),e,Y(r))}function ce(e,t){var r=n(t,!0);r&&e.push({priority:0,compile:function(e){var t=e.parent(),n=!!t.length;return n&&F.$$addBindingClass(t),function(e,t){var i=t.parent();n||F.$$addBindingClass(i),F.$$addBindingInfo(i,r.expressions),e.$watch(r,function(e){t[0].nodeValue=e})}}})}function le(t,n){switch(t=Nr(t||"html")){case"svg":case"math":var r=e.document.createElement("div");return r.innerHTML="<"+t+">"+n+"</"+t+">",r.childNodes[0].childNodes;default:return n}}function fe(e,t){if("srcdoc"==t)return A.HTML;var n=_(e);return"xlinkHref"==t||"form"==n&&"action"==t||"img"!=n&&("src"==t||"ngSrc"==t)?A.RESOURCE_URL:void 0}function he(e,t,r,i,o){var a=fe(e,i);o=x[i]||o;var s=n(r,!0,a,o);if(s){if("multiple"===i&&"select"===_(e))throw Li("selmulti","Binding to the 'multiple' attribute is not supported. Element: {0}",Y(e));t.push({priority:100,compile:function(){return{pre:function(e,t,u){var c=u.$$observers||(u.$$observers=pe());if(E.test(i))throw Li("nodomevents","Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.");var l=u[i];l!==r&&(s=l&&n(l,!0,a,o),r=l),s&&(u[i]=s(e),(c[i]||(c[i]=[])).$$inter=!0,(u.$$observers&&u.$$observers[i].$$scope||e).$watch(s,function(e,t){"class"===i&&e!=t?u.$updateClass(e,t):u.$set(i,e)}))}}}})}}function de(t,n,r){var i,o,a=n[0],s=n.length,u=a.parentNode;if(t)for(i=0,o=t.length;i<o;i++)if(t[i]==a){t[i++]=r;for(var c=i,l=c+s-1,f=t.length;c<f;c++,l++)l<f?t[c]=t[l]:delete t[c];t.length-=s-1,t.context===a&&(t.context=r);break}u&&u.replaceChild(r,a);var h=e.document.createDocumentFragment();for(i=0;i<s;i++)h.appendChild(n[i]);for(Pr.hasData(a)&&(Pr.data(r,Pr.data(a)),Pr(a).off("$destroy")),Pr.cleanData(h.querySelectorAll("*")),i=1;i<s;i++)delete n[i];n[0]=r,n.length=1}function $e(e,t){return c(function(){return e.apply(null,arguments)},e,t)}function ve(e,t,n,r,o,a){try{e(t,n,r,o,a)}catch(e){i(e,Y(n))}}function me(e,t,i,o,a){function u(t,n,r){C(i.$onChanges)&&n!==r&&(ge||(e.$$postDigest(j),ge=[]),l||(l={},ge.push(c)),l[t]&&(r=l[t].previousValue),l[t]=new pt(r,n))}function c(){i.$onChanges(l),l=void 0}var l,f=[],h={};return r(o,function(r,o){var c,l,d,$,v,m=r.attrName,g=r.optional,y=r.mode;switch(y){case"@":g||Tr.call(t,m)||(i[o]=t[m]=void 0),t.$observe(m,function(e){if(w(e)||N(e)){var t=i[o];u(o,e,t),i[o]=e}}),t.$$observers[m].$$scope=e,c=t[m],w(c)?i[o]=n(c)(e):N(c)&&(i[o]=c),h[o]=new pt(Hi,i[o]);break;case"=":if(!Tr.call(t,m)){if(g)break;t[m]=void 0}if(g&&!t[m])break;l=s(t[m]),$=l.literal?q:function(e,t){return e===t||e!==e&&t!==t},d=l.assign||function(){throw c=i[o]=l(e),Li("nonassign","Expression '{0}' in attribute '{1}' used with directive '{2}' is non-assignable!",t[m],m,a.name)},c=i[o]=l(e);var b=function(t){return $(t,i[o])||($(t,c)?d(e,t=i[o]):i[o]=t),c=t};b.$stateful=!0,v=r.collection?e.$watchCollection(t[m],b):e.$watch(s(t[m],b),null,l.literal),f.push(v);break;case"<":if(!Tr.call(t,m)){if(g)break;t[m]=void 0}if(g&&!t[m])break;l=s(t[m]);var x=i[o]=l(e);h[o]=new pt(Hi,i[o]),v=e.$watch(l,function(e,t){if(t===e){if(t===x)return;t=x}u(o,e,t),i[o]=e},l.literal),f.push(v);break;case"&":if((l=t.hasOwnProperty(m)?s(t[m]):p)===p&&g)break;i[o]=function(t){return l(e,t)}}}),{initialChanges:h,removeWatches:f.length&&function(){for(var e=0,t=f.length;e<t;++e)f[e]()}}}var ge,ye=/^\w/,we=e.document.createElement("div"),xe=M;I.prototype={$normalize:dt,$addClass:function(e){e&&e.length>0&&T.addClass(this.$$element,e)},$removeClass:function(e){e&&e.length>0&&T.removeClass(this.$$element,e)},$updateClass:function(e,t){var n=$t(e,t);n&&n.length&&T.addClass(this.$$element,n);var r=$t(t,e);r&&r.length&&T.removeClass(this.$$element,r)},$set:function(e,t,n,o){var a,s=this.$$element[0],u=He(s,e),c=Be(e),l=e;if(u?(this.$$element.prop(e,t),o=u):c&&(this[c]=t,l=c),this[e]=t,o?this.$attr[e]=o:(o=this.$attr[e])||(this.$attr[e]=o=se(e,"-")),"a"===(a=_(this.$$element))&&("href"===e||"xlinkHref"===e)||"img"===a&&"src"===e)this[e]=t=V(t,"src"===e);else if("img"===a&&"srcset"===e&&g(t)){for(var f="",h=Jr(t),p=/(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/,d=/\s/.test(h)?p:/(,)/,$=h.split(d),v=Math.floor($.length/2),y=0;y<v;y++){var b=2*y;f+=V(Jr($[b]),!0),f+=" "+Jr($[b+1])}var w=Jr($[2*y]).split(/\s/);f+=V(Jr(w[0]),!0),2===w.length&&(f+=" "+Jr(w[1])),this[e]=t=f}!1!==n&&(null===t||m(t)?this.$$element.removeAttr(o):ye.test(o)?this.$$element.attr(o,t):D(this.$$element[0],o,t));var x=this.$$observers;x&&r(x[l],function(e){try{e(t)}catch(e){i(e)}})},$observe:function(e,t){var n=this,r=n.$$observers||(n.$$observers=pe()),i=r[e]||(r[e]=[]);return i.push(t),$.$evalAsync(function(){i.$$inter||!n.hasOwnProperty(e)||m(n[e])||t(n[e])}),function(){R(i,t)}}};var Se=n.startSymbol(),Ce=n.endSymbol(),Ee="{{"==Se&&"}}"==Ce?d:function(e){return e.replace(/\{\{/g,Se).replace(/}}/g,Ce)},ke=/^ngAttr[A-Z]/,Me=/^(.+)Start$/;return F.$$addBindingInfo=O?function(e,t){var n=e.data("$binding")||[];Gr(t)?n=n.concat(t):n.push(t),e.data("$binding",n)}:p,F.$$addBindingClass=O?function(e){P(e,"ng-binding")}:p,F.$$addScopeInfo=O?function(e,t,n,r){var i=n?r?"$isolateScopeNoTemplate":"$isolateScope":"$scope";e.data(i,t)}:p,F.$$addScopeClass=O?function(e,t){P(e,t?"ng-isolate-scope":"ng-scope")}:p,F.$$createComment=function(t,n){var r="";return O&&(r=" "+(t||"")+": ",n&&(r+=n+" ")),e.document.createComment(r)},F}]}function pt(e,t){this.previousValue=e,this.currentValue=t}function dt(e){return ye(e.replace(Bi,""))}function $t(e,t){var n="",r=e.split(/\s+/),i=t.split(/\s+/);e:for(var o=0;o<r.length;o++){for(var a=r[o],s=0;s<i.length;s++)if(a==i[s])continue e;n+=(n.length>0?" ":"")+a}return n}function vt(e){e=Pr(e);var t=e.length;if(t<=1)return e;for(;t--;){e[t].nodeType===oi&&qr.call(e,t,1)}return e}function mt(e,t){if(t&&w(t))return t;if(w(e)){var n=Wi.exec(e);if(n)return n[3]}}function gt(){var e={},n=!1;this.has=function(t){return e.hasOwnProperty(t)},this.register=function(t,n){le(t,"controller"),y(t)?c(e,t):e[t]=n},this.allowGlobals=function(){n=!0},this.$get=["$injector","$window",function(r,i){function o(e,n,r,i){if(!e||!y(e.$scope))throw t("$controller")("noscp","Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.",i,n);e.$scope[n]=r}return function(t,a,s,u){var l,f,h,p;if(s=!0===s,u&&w(u)&&(p=u),w(t)){if(!(f=t.match(Wi)))throw zi("ctrlfmt","Badly formed controller string '{0}'. Must match `__name__ as __id__` or `__name__`.",t);h=f[1],p=p||f[3],t=e.hasOwnProperty(h)?e[h]:fe(a.$scope,h,!0)||(n?fe(i,h,!0):void 0),ce(t,h,!0)}if(s){var d=(Gr(t)?t[t.length-1]:t).prototype;l=Object.create(d||null),p&&o(a,p,l,h||t.name);return c(function(){var e=r.invoke(t,l,a,h);return e!==l&&(y(e)||C(e))&&(l=e,p&&o(a,p,l,h||t.name)),l},{instance:l,identifier:p})}return l=r.instantiate(t,a,h),p&&o(a,p,l,h||t.name),l}}]}function yt(){this.$get=["$window",function(e){return Pr(e.document)}]}function bt(){this.$get=["$log",function(e){return function(t,n){e.error.apply(e,arguments)}}]}function wt(e){return y(e)?S(e)?e.toISOString():z(e):e}function xt(){this.$get=function(){return function(e){if(!e)return"";var t=[];return i(e,function(e,n){null===e||m(e)||(Gr(e)?r(e,function(e){t.push(te(n)+"="+te(wt(e)))}):t.push(te(n)+"="+te(wt(e))))}),t.join("&")}}}function St(){this.$get=function(){return function(e){function t(e,o,a){null===e||m(e)||(Gr(e)?r(e,function(e,n){t(e,o+"["+(y(e)?n:"")+"]")}):y(e)&&!S(e)?i(e,function(e,n){t(e,o+(a?"":"[")+n+(a?"":"]"))}):n.push(te(o)+"="+te(wt(e))))}if(!e)return"";var n=[];return t(e,"",!0),n.join("&")}}}function Ct(e,t){if(w(e)){var n=e.replace(Xi,"").trim();if(n){var r=t("Content-Type");(r&&0===r.indexOf(Zi)||Et(n))&&(e=W(n))}}return e}function Et(e){var t=e.match(Yi);return t&&Ki[t[0]].test(e)}function At(e){function t(e,t){e&&(i[e]=i[e]?i[e]+", "+t:t)}var n,i=pe();return w(e)?r(e.split("\n"),function(e){n=e.indexOf(":"),t(Nr(Jr(e.substr(0,n))),Jr(e.substr(n+1)))}):y(e)&&r(e,function(e,n){t(Nr(n),Jr(e))}),i}function kt(e){var t;return function(n){if(t||(t=At(e)),n){var r=t[Nr(n)];return void 0===r&&(r=null),r}return t}}function Ot(e,t,n,i){return C(i)?i(e,t,n):(r(i,function(r){e=r(e,t,n)}),e)}function Mt(e){return 200<=e&&e<300}function Tt(){var e=this.defaults={transformResponse:[Ct],transformRequest:[function(e){return!y(e)||O(e)||T(e)||M(e)?e:z(e)}],headers:{common:{Accept:"application/json, text/plain, */*"},post:$e(Ji),put:$e(Ji),patch:$e(Ji)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",paramSerializer:"$httpParamSerializer"},n=!1;this.useApplyAsync=function(e){return g(e)?(n=!!e,this):n};var i=!0;this.useLegacyPromiseExtensions=function(e){return g(e)?(i=!!e,this):i};var o=this.interceptors=[];this.$get=["$httpBackend","$$cookieReader","$cacheFactory","$rootScope","$q","$injector",function(a,s,u,l,f,h){function p(n){function o(e){var t=c({},e);return t.data=Ot(e.data,e.headers,e.status,s.transformResponse),Mt(e.status)?t:f.reject(t)}function a(e,t){var n,i={};return r(e,function(e,r){C(e)?null!=(n=e(t))&&(i[r]=n):i[r]=e}),i}if(!y(n))throw t("$http")("badreq","Http request configuration must be an object.  Received: {0}",n);if(!w(n.url))throw t("$http")("badreq","Http request configuration url must be a string.  Received: {0}",n.url);var s=c({method:"get",transformRequest:e.transformRequest,transformResponse:e.transformResponse,paramSerializer:e.paramSerializer},n);s.headers=function(t){var n,r,i,o=e.headers,s=c({},t.headers);o=c({},o.common,o[Nr(t.method)]);e:for(n in o){r=Nr(n);for(i in s)if(Nr(i)===r)continue e;s[n]=o[n]}return a(s,$e(t))}(n),s.method=Vr(s.method),s.paramSerializer=w(s.paramSerializer)?h.get(s.paramSerializer):s.paramSerializer;var u=function(t){var n=t.headers,i=Ot(t.data,kt(n),void 0,t.transformRequest);return m(i)&&r(n,function(e,t){"content-type"===Nr(t)&&delete n[t]}),m(t.withCredentials)&&!m(e.withCredentials)&&(t.withCredentials=e.withCredentials),d(t,i).then(o,o)},l=[u,void 0],p=f.when(s);for(r(b,function(e){(e.request||e.requestError)&&l.unshift(e.request,e.requestError),(e.response||e.responseError)&&l.push(e.response,e.responseError)});l.length;){var $=l.shift(),v=l.shift();p=p.then($,v)}return i?(p.success=function(e){return ce(e,"fn"),p.then(function(t){e(t.data,t.status,t.headers,s)}),p},p.error=function(e){return ce(e,"fn"),p.then(null,function(t){e(t.data,t.status,t.headers,s)}),p}):(p.success=eo("success"),p.error=eo("error")),p}function d(t,i){function o(e){if(e){var t={};return r(e,function(e,r){t[r]=function(t){function r(){e(t)}n?l.$applyAsync(r):l.$$phase?r():l.$apply(r)}}),t}}function u(e,t,r,i){function o(){c(t,e,r,i)}b&&(Mt(e)?b.put(E,[e,t,At(r),i]):b.remove(E)),n?l.$applyAsync(o):(o(),l.$$phase||l.$apply())}function c(e,n,r,i){n=n>=-1?n:0,(Mt(n)?x.resolve:x.reject)({data:e,status:n,headers:kt(r),config:t,statusText:i})}function h(e){c(e.data,e.status,$e(e.headers()),e.statusText)}function d(){var e=p.pendingRequests.indexOf(t);-1!==e&&p.pendingRequests.splice(e,1)}var b,w,x=f.defer(),S=x.promise,C=t.headers,E=$(t.url,t.paramSerializer(t.params));if(p.pendingRequests.push(t),S.then(d,d),!t.cache&&!e.cache||!1===t.cache||"GET"!==t.method&&"JSONP"!==t.method||(b=y(t.cache)?t.cache:y(e.cache)?e.cache:v),b&&(w=b.get(E),g(w)?V(w)?w.then(h,h):Gr(w)?c(w[1],w[0],$e(w[2]),w[3]):c(w,200,{},"OK"):b.put(E,S)),m(w)){var A=jn(t.url)?s()[t.xsrfCookieName||e.xsrfCookieName]:void 0;A&&(C[t.xsrfHeaderName||e.xsrfHeaderName]=A),a(t.method,E,i,u,C,t.timeout,t.withCredentials,t.responseType,o(t.eventHandlers),o(t.uploadEventHandlers))}return S}function $(e,t){return t.length>0&&(e+=(-1==e.indexOf("?")?"?":"&")+t),e}var v=u("$http");e.paramSerializer=w(e.paramSerializer)?h.get(e.paramSerializer):e.paramSerializer;var b=[];return r(o,function(e){b.unshift(w(e)?h.get(e):h.invoke(e))}),p.pendingRequests=[],function(e){r(arguments,function(e){p[e]=function(t,n){return p(c({},n||{},{method:e,url:t}))}})}("get","delete","head","jsonp"),function(e){r(arguments,function(e){p[e]=function(t,n,r){return p(c({},r||{},{method:e,url:t,data:n}))}})}("post","put","patch"),p.defaults=e,p}]}function Nt(){this.$get=function(){return function(){return new e.XMLHttpRequest}}}function Vt(){this.$get=["$browser","$window","$document","$xhrFactory",function(e,t,n,r){return jt(e,r,e.defer,t.angular.callbacks,n[0])}]}function jt(e,t,n,i,o){function a(e,t,n){var r=o.createElement("script"),a=null;return r.type="text/javascript",r.src=e,r.async=!0,a=function(e){hi(r,"load",a),hi(r,"error",a),o.body.removeChild(r),r=null;var s=-1,u="unknown";e&&("load"!==e.type||i[t].called||(e={type:"error"}),u=e.type,s="error"===e.type?404:200),n&&n(s,u)},fi(r,"load",a),fi(r,"error",a),o.body.appendChild(r),a}return function(o,s,u,c,l,f,h,d,$,v){function y(){x&&x(),S&&S.abort()}function b(t,r,i,o,a){g(E)&&n.cancel(E),x=S=null,t(r,i,o,a),e.$$completeOutstandingRequest(p)}if(e.$$incOutstandingRequestCount(),s=s||e.url(),"jsonp"==Nr(o)){var w="_"+(i.counter++).toString(36);i[w]=function(e){i[w].data=e,i[w].called=!0};var x=a(s.replace("JSON_CALLBACK","angular.callbacks."+w),w,function(e,t){b(c,e,i[w].data,"",t),i[w]=p})}else{var S=t(o,s);S.open(o,s,!0),r(l,function(e,t){g(e)&&S.setRequestHeader(t,e)}),S.onload=function(){var e=S.statusText||"",t="response"in S?S.response:S.responseText,n=1223===S.status?204:S.status;0===n&&(n=t?200:"file"==Vn(s).protocol?404:0),b(c,n,t,S.getAllResponseHeaders(),e)};var C=function(){b(c,-1,null,null,"")};if(S.onerror=C,S.onabort=C,r($,function(e,t){S.addEventListener(t,e)}),r(v,function(e,t){S.upload.addEventListener(t,e)}),h&&(S.withCredentials=!0),d)try{S.responseType=d}catch(e){if("json"!==d)throw e}S.send(m(u)?null:u)}if(f>0)var E=n(y,f);else V(f)&&f.then(y)}}function It(){var e="{{",t="}}";this.startSymbol=function(t){return t?(e=t,this):e},this.endSymbol=function(e){return e?(t=e,this):t},this.$get=["$parse","$exceptionHandler","$sce",function(n,r,i){function o(e){return"\\\\\\"+e}function a(n){return n.replace(p,e).replace(d,t)}function s(e){if(null==e)return"";switch(typeof e){case"string":break;case"number":e=""+e;break;default:e=z(e)}return e}function u(e,t,n,r){var i;return i=e.$watch(function(e){return i(),r(e)},t,n)}function l(o,l,p,d){function v(e){try{return e=N(e),d&&!g(e)?e:s(e)}catch(e){r(to.interr(o,e))}}if(!o.length||-1===o.indexOf(e)){var y;if(!l){y=$(a(o)),y.exp=o,y.expressions=[],y.$$watchDelegate=u}return y}d=!!d;for(var b,w,x,S=0,E=[],A=[],k=o.length,O=[],M=[];S<k;){if(-1==(b=o.indexOf(e,S))||-1==(w=o.indexOf(t,b+f))){S!==k&&O.push(a(o.substring(S)));break}S!==b&&O.push(a(o.substring(S,b))),x=o.substring(b+f,w),E.push(x),A.push(n(x,v)),S=w+h,M.push(O.length),O.push("")}if(p&&O.length>1&&to.throwNoconcat(o),!l||E.length){var T=function(e){for(var t=0,n=E.length;t<n;t++){if(d&&m(e[t]))return;O[M[t]]=e[t]}return O.join("")},N=function(e){return p?i.getTrusted(p,e):i.valueOf(e)};return c(function(e){var t=0,n=E.length,i=new Array(n);try{for(;t<n;t++)i[t]=A[t](e);return T(i)}catch(e){r(to.interr(o,e))}},{exp:o,expressions:E,$$watchDelegate:function(e,t){var n;return e.$watchGroup(A,function(r,i){var o=T(r);C(t)&&t.call(this,o,r!==i?n:o,e),n=o})}})}}var f=e.length,h=t.length,p=new RegExp(e.replace(/./g,o),"g"),d=new RegExp(t.replace(/./g,o),"g");return l.startSymbol=function(){return e},l.endSymbol=function(){return t},l}]}function Dt(){this.$get=["$rootScope","$window","$q","$$q","$browser",function(e,t,n,r,i){function o(o,s,u,c){function l(){f?o.apply(null,h):o($)}var f=arguments.length>4,h=f?L(arguments,4):[],p=t.setInterval,d=t.clearInterval,$=0,v=g(c)&&!c,m=(v?r:n).defer(),y=m.promise;return u=g(u)?u:0,y.$$intervalId=p(function(){v?i.defer(l):e.$evalAsync(l),m.notify($++),u>0&&$>=u&&(m.resolve($),d(y.$$intervalId),delete a[y.$$intervalId]),v||e.$apply()},s),a[y.$$intervalId]=m,y}var a={};return o.cancel=function(e){return!!(e&&e.$$intervalId in a)&&(a[e.$$intervalId].reject("canceled"),t.clearInterval(e.$$intervalId),delete a[e.$$intervalId],!0)},o}]}function Pt(e){for(var t=e.split("/"),n=t.length;n--;)t[n]=ee(t[n]);return t.join("/")}function _t(e,t){var n=Vn(e);t.$$protocol=n.protocol,t.$$host=n.hostname,t.$$port=f(n.port)||ro[n.protocol]||null}function Rt(e,t){var n="/"!==e.charAt(0);n&&(e="/"+e);var r=Vn(e);t.$$path=decodeURIComponent(n&&"/"===r.pathname.charAt(0)?r.pathname.substring(1):r.pathname),t.$$search=X(r.search),t.$$hash=decodeURIComponent(r.hash),t.$$path&&"/"!=t.$$path.charAt(0)&&(t.$$path="/"+t.$$path)}function Ft(e,t){return 0===e.lastIndexOf(t,0)}function qt(e,t){if(Ft(t,e))return t.substr(e.length)}function Ut(e){var t=e.indexOf("#");return-1==t?e:e.substr(0,t)}function Lt(e){return e.replace(/(#.+)|#$/,"$1")}function Ht(e){return e.substr(0,Ut(e).lastIndexOf("/")+1)}function Bt(e){return e.substring(0,e.indexOf("/",e.indexOf("//")+2))}function zt(e,t,n){this.$$html5=!0,n=n||"",_t(e,this),this.$$parse=function(e){var n=qt(t,e);if(!w(n))throw io("ipthprfx",'Invalid url "{0}", missing path prefix "{1}".',e,t);Rt(n,this),this.$$path||(this.$$path="/"),this.$$compose()},this.$$compose=function(){var e=Q(this.$$search),n=this.$$hash?"#"+ee(this.$$hash):"";this.$$url=Pt(this.$$path)+(e?"?"+e:"")+n,this.$$absUrl=t+this.$$url.substr(1)},this.$$parseLinkUrl=function(r,i){if(i&&"#"===i[0])return this.hash(i.slice(1)),!0;var o,a,s;return g(o=qt(e,r))?(a=o,s=g(o=qt(n,o))?t+(qt("/",o)||o):e+a):g(o=qt(t,r))?s=t+o:t==r+"/"&&(s=t),s&&this.$$parse(s),!!s}}function Wt(e,t,n){_t(e,this),this.$$parse=function(r){var i,o=qt(e,r)||qt(t,r);m(o)||"#"!==o.charAt(0)?this.$$html5?i=o:(i="",m(o)&&(e=r,this.replace())):(i=qt(n,o),m(i)&&(i=o)),Rt(i,this),this.$$path=function(e,t,n){var r,i=/^\/[A-Z]:(\/.*)/;return Ft(t,n)&&(t=t.replace(n,"")),i.exec(t)?e:(r=i.exec(e),r?r[1]:e)}(this.$$path,i,e),this.$$compose()},this.$$compose=function(){var t=Q(this.$$search),r=this.$$hash?"#"+ee(this.$$hash):"";this.$$url=Pt(this.$$path)+(t?"?"+t:"")+r,this.$$absUrl=e+(this.$$url?n+this.$$url:"")},this.$$parseLinkUrl=function(t,n){return Ut(e)==Ut(t)&&(this.$$parse(t),!0)}}function Gt(e,t,n){this.$$html5=!0,Wt.apply(this,arguments),this.$$parseLinkUrl=function(r,i){if(i&&"#"===i[0])return this.hash(i.slice(1)),!0;var o,a;return e==Ut(r)?o=r:(a=qt(t,r))?o=e+n+a:t===r+"/"&&(o=t),o&&this.$$parse(o),!!o},this.$$compose=function(){var t=Q(this.$$search),r=this.$$hash?"#"+ee(this.$$hash):"";this.$$url=Pt(this.$$path)+(t?"?"+t:"")+r,this.$$absUrl=e+n+this.$$url}}function Zt(e){return function(){return this[e]}}function Jt(e,t){return function(n){return m(n)?this[e]:(this[e]=t(n),this.$$compose(),this)}}function Yt(){var e="",t={enabled:!1,requireBase:!0,rewriteLinks:!0};this.hashPrefix=function(t){return g(t)?(e=t,this):e},this.html5Mode=function(e){return N(e)?(t.enabled=e,this):y(e)?(N(e.enabled)&&(t.enabled=e.enabled),N(e.requireBase)&&(t.requireBase=e.requireBase),N(e.rewriteLinks)&&(t.rewriteLinks=e.rewriteLinks),this):t},this.$get=["$rootScope","$browser","$sniffer","$rootElement","$window",function(n,r,i,o,a){function s(e,t,n){var i=c.url(),o=c.$$state;try{r.url(e,t,n),c.$$state=r.state()}catch(e){throw c.url(i),c.$$state=o,e}}function u(e,t){n.$broadcast("$locationChangeSuccess",c.absUrl(),e,c.$$state,t)}var c,l,f,h=r.baseHref(),p=r.url();if(t.enabled){if(!h&&t.requireBase)throw io("nobase","$location in HTML5 mode requires a <base> tag to be present!");f=Bt(p)+(h||"/"),l=i.history?zt:Gt}else f=Ut(p),l=Wt;var d=Ht(f);c=new l(f,d,"#"+e),c.$$parseLinkUrl(p,p),c.$$state=r.state();var $=/^\s*(javascript|mailto):/i;o.on("click",function(e){if(t.rewriteLinks&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&2!=e.which&&2!=e.button){for(var i=Pr(e.target);"a"!==_(i[0]);)if(i[0]===o[0]||!(i=i.parent())[0])return;var s=i.prop("href"),u=i.attr("href")||i.attr("xlink:href");y(s)&&"[object SVGAnimatedString]"===s.toString()&&(s=Vn(s.animVal).href),$.test(s)||!s||i.attr("target")||e.isDefaultPrevented()||c.$$parseLinkUrl(s,u)&&(e.preventDefault(),c.absUrl()!=r.url()&&(n.$apply(),a.angular["ff-684208-preventDefault"]=!0))}}),Lt(c.absUrl())!=Lt(p)&&r.url(c.absUrl(),!0);var v=!0;return r.onUrlChange(function(e,t){if(m(qt(d,e)))return void(a.location.href=e);n.$evalAsync(function(){var r,i=c.absUrl(),o=c.$$state;e=Lt(e),c.$$parse(e),c.$$state=t,r=n.$broadcast("$locationChangeStart",e,i,t,o).defaultPrevented,c.absUrl()===e&&(r?(c.$$parse(i),c.$$state=o,s(i,!1,o)):(v=!1,u(i,o)))}),n.$$phase||n.$digest()}),n.$watch(function(){var e=Lt(r.url()),t=Lt(c.absUrl()),o=r.state(),a=c.$$replace,l=e!==t||c.$$html5&&i.history&&o!==c.$$state;(v||l)&&(v=!1,n.$evalAsync(function(){var t=c.absUrl(),r=n.$broadcast("$locationChangeStart",t,e,c.$$state,o).defaultPrevented;c.absUrl()===t&&(r?(c.$$parse(e),c.$$state=o):(l&&s(t,a,o===c.$$state?null:c.$$state),u(e,o)))})),c.$$replace=!1}),c}]}function Kt(){var e=!0,t=this;this.debugEnabled=function(t){return g(t)?(e=t,this):e},this.$get=["$window",function(n){function i(e){return e instanceof Error&&(e.stack?e=e.message&&-1===e.stack.indexOf(e.message)?"Error: "+e.message+"\n"+e.stack:e.stack:e.sourceURL&&(e=e.message+"\n"+e.sourceURL+":"+e.line)),e}function o(e){var t=n.console||{},o=t[e]||t.log||p,a=!1;try{a=!!o.apply}catch(e){}return a?function(){var e=[];return r(arguments,function(t){e.push(i(t))}),o.apply(t,e)}:function(e,t){o(e,null==t?"":t)}}return{log:o("log"),info:o("info"),warn:o("warn"),error:o("error"),debug:function(){var n=o("debug");return function(){e&&n.apply(t,arguments)}}()}}]}function Xt(e,t){if("__defineGetter__"===e||"__defineSetter__"===e||"__lookupGetter__"===e||"__lookupSetter__"===e||"__proto__"===e)throw ao("isecfld","Attempting to access a disallowed field in Angular expressions! Expression: {0}",t);return e}function Qt(e){return e+""}function en(e,t){if(e){if(e.constructor===e)throw ao("isecfn","Referencing Function in Angular expressions is disallowed! Expression: {0}",t);if(e.window===e)throw ao("isecwindow","Referencing the Window in Angular expressions is disallowed! Expression: {0}",t);if(e.children&&(e.nodeName||e.prop&&e.attr&&e.find))throw ao("isecdom","Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}",t);if(e===Object)throw ao("isecobj","Referencing Object in Angular expressions is disallowed! Expression: {0}",t)}return e}function tn(e,t){if(e){if(e.constructor===e)throw ao("isecfn","Referencing Function in Angular expressions is disallowed! Expression: {0}",t);if(e===so||e===uo||e===co)throw ao("isecff","Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}",t)}}function nn(e,t){if(e&&(e===(0).constructor||e===(!1).constructor||e==="".constructor||e==={}.constructor||e===[].constructor||e===Function.constructor))throw ao("isecaf","Assigning to a constructor is disallowed! Expression: {0}",t)}function rn(e,t){return void 0!==e?e:t}function on(e,t){return void 0===e?t:void 0===t?e:e+t}function an(e,t){return!e(t).$stateful}function sn(e,t){var n,i;switch(e.type){case po.Program:n=!0,r(e.body,function(e){sn(e.expression,t),n=n&&e.expression.constant}),e.constant=n;break;case po.Literal:e.constant=!0,e.toWatch=[];break;case po.UnaryExpression:sn(e.argument,t),e.constant=e.argument.constant,e.toWatch=e.argument.toWatch;break;case po.BinaryExpression:sn(e.left,t),sn(e.right,t),e.constant=e.left.constant&&e.right.constant,e.toWatch=e.left.toWatch.concat(e.right.toWatch);break;case po.LogicalExpression:sn(e.left,t),sn(e.right,t),e.constant=e.left.constant&&e.right.constant,e.toWatch=e.constant?[]:[e];break;case po.ConditionalExpression:sn(e.test,t),sn(e.alternate,t),sn(e.consequent,t),e.constant=e.test.constant&&e.alternate.constant&&e.consequent.constant,e.toWatch=e.constant?[]:[e];break;case po.Identifier:e.constant=!1,e.toWatch=[e];break;case po.MemberExpression:sn(e.object,t),e.computed&&sn(e.property,t),e.constant=e.object.constant&&(!e.computed||e.property.constant),e.toWatch=[e];break;case po.CallExpression:n=!!e.filter&&an(t,e.callee.name),i=[],r(e.arguments,function(e){sn(e,t),n=n&&e.constant,e.constant||i.push.apply(i,e.toWatch)}),e.constant=n,e.toWatch=e.filter&&an(t,e.callee.name)?i:[e];break;case po.AssignmentExpression:sn(e.left,t),sn(e.right,t),e.constant=e.left.constant&&e.right.constant,e.toWatch=[e];break;case po.ArrayExpression:n=!0,i=[],r(e.elements,function(e){sn(e,t),n=n&&e.constant,e.constant||i.push.apply(i,e.toWatch)}),e.constant=n,e.toWatch=i;break;case po.ObjectExpression:n=!0,i=[],r(e.properties,function(e){sn(e.value,t),n=n&&e.value.constant&&!e.computed,e.value.constant||i.push.apply(i,e.value.toWatch)}),e.constant=n,e.toWatch=i;break;case po.ThisExpression:case po.LocalsExpression:e.constant=!1,e.toWatch=[]}}function un(e){if(1==e.length){var t=e[0].expression,n=t.toWatch;return 1!==n.length?n:n[0]!==t?n:void 0}}function cn(e){return e.type===po.Identifier||e.type===po.MemberExpression}function ln(e){if(1===e.body.length&&cn(e.body[0].expression))return{type:po.AssignmentExpression,left:e.body[0].expression,right:{type:po.NGValueParameter},operator:"="}}function fn(e){return 0===e.body.length||1===e.body.length&&(e.body[0].expression.type===po.Literal||e.body[0].expression.type===po.ArrayExpression||e.body[0].expression.type===po.ObjectExpression)}function hn(e){return e.constant}function pn(e,t){this.astBuilder=e,this.$filter=t}function dn(e,t){this.astBuilder=e,this.$filter=t}function $n(e){return"constructor"==e}function vn(e){return C(e.valueOf)?e.valueOf():vo.call(e)}function mn(){var e,t,n=pe(),i=pe(),o={true:!0,false:!1,null:null,undefined:void 0};this.addLiteral=function(e,t){o[e]=t},this.setIdentifierFns=function(n,r){return e=n,t=r,this},this.$get=["$filter",function(a){function s(e,t,r){var o,s,c;switch(r=r||b,typeof e){case"string":e=e.trim(),c=e;var v=r?i:n;if(!(o=v[c])){":"===e.charAt(0)&&":"===e.charAt(1)&&(s=!0,e=e.substring(2));var g=r?y:m,w=new ho(g);o=new $o(w,a,g).parse(e),o.constant?o.$$watchDelegate=d:s?o.$$watchDelegate=o.literal?h:f:o.inputs&&(o.$$watchDelegate=l),r&&(o=u(o)),v[c]=o}return $(o,t);case"function":return $(e,t);default:return $(p,t)}}function u(e){function t(t,n,r,i){var o=b;b=!0;try{return e(t,n,r,i)}finally{b=o}}if(!e)return e;t.$$watchDelegate=e.$$watchDelegate,t.assign=u(e.assign),t.constant=e.constant,t.literal=e.literal
;for(var n=0;e.inputs&&n<e.inputs.length;++n)e.inputs[n]=u(e.inputs[n]);return t.inputs=e.inputs,t}function c(e,t){return null==e||null==t?e===t:("object"!=typeof e||"object"!=typeof(e=vn(e)))&&(e===t||e!==e&&t!==t)}function l(e,t,n,r,i){var o,a=r.inputs;if(1===a.length){var s=c;return a=a[0],e.$watch(function(e){var t=a(e);return c(t,s)||(o=r(e,void 0,void 0,[t]),s=t&&vn(t)),o},t,n,i)}for(var u=[],l=[],f=0,h=a.length;f<h;f++)u[f]=c,l[f]=null;return e.$watch(function(e){for(var t=!1,n=0,i=a.length;n<i;n++){var s=a[n](e);(t||(t=!c(s,u[n])))&&(l[n]=s,u[n]=s&&vn(s))}return t&&(o=r(e,void 0,void 0,l)),o},t,n,i)}function f(e,t,n,r){var i,o;return i=e.$watch(function(e){return r(e)},function(e,n,r){o=e,C(t)&&t.apply(this,arguments),g(e)&&r.$$postDigest(function(){g(o)&&i()})},n)}function h(e,t,n,i){function o(e){var t=!0;return r(e,function(e){g(e)||(t=!1)}),t}var a,s;return a=e.$watch(function(e){return i(e)},function(e,n,r){s=e,C(t)&&t.call(this,e,n,r),o(e)&&r.$$postDigest(function(){o(s)&&a()})},n)}function d(e,t,n,r){var i;return i=e.$watch(function(e){return i(),r(e)},t,n)}function $(e,t){if(!t)return e;var n=e.$$watchDelegate,r=!1,i=n!==h&&n!==f,o=i?function(n,i,o,a){var s=r&&a?a[0]:e(n,i,o,a);return t(s,n,i)}:function(n,r,i,o){var a=e(n,r,i,o),s=t(a,n,r);return g(a)?s:a};return e.$$watchDelegate&&e.$$watchDelegate!==l?o.$$watchDelegate=e.$$watchDelegate:t.$stateful||(o.$$watchDelegate=l,r=!e.inputs,o.inputs=e.inputs?e.inputs:[e]),o}var v=Kr().noUnsafeEval,m={csp:v,expensiveChecks:!1,literals:F(o),isIdentifierStart:C(e)&&e,isIdentifierContinue:C(t)&&t},y={csp:v,expensiveChecks:!0,literals:F(o),isIdentifierStart:C(e)&&e,isIdentifierContinue:C(t)&&t},b=!1;return s.$$runningExpensiveChecks=function(){return b},s}]}function gn(){this.$get=["$rootScope","$exceptionHandler",function(e,t){return bn(function(t){e.$evalAsync(t)},t)}]}function yn(){this.$get=["$browser","$exceptionHandler",function(e,t){return bn(function(t){e.defer(t)},t)}]}function bn(e,n){function i(){this.$$state={status:0}}function o(e,t){return function(n){t.call(e,n)}}function a(e){var t,r,i;i=e.pending,e.processScheduled=!1,e.pending=void 0;for(var o=0,a=i.length;o<a;++o){r=i[o][0],t=i[o][e.status];try{C(t)?r.resolve(t(e.value)):1===e.status?r.resolve(e.value):r.reject(e.value)}catch(e){r.reject(e),n(e)}}}function s(t){!t.processScheduled&&t.pending&&(t.processScheduled=!0,e(function(){a(t)}))}function u(){this.promise=new i}function l(e){var t=new u,n=0,i=Gr(e)?[]:{};return r(e,function(e,r){n++,v(e).then(function(e){i.hasOwnProperty(r)||(i[r]=e,--n||t.resolve(i))},function(e){i.hasOwnProperty(r)||t.reject(e)})}),0===n&&t.resolve(i),t.promise}var f=t("$q",TypeError),h=function(){var e=new u;return e.resolve=o(e,e.resolve),e.reject=o(e,e.reject),e.notify=o(e,e.notify),e};c(i.prototype,{then:function(e,t,n){if(m(e)&&m(t)&&m(n))return this;var r=new u;return this.$$state.pending=this.$$state.pending||[],this.$$state.pending.push([r,e,t,n]),this.$$state.status>0&&s(this.$$state),r.promise},catch:function(e){return this.then(null,e)},finally:function(e,t){return this.then(function(t){return $(t,!0,e)},function(t){return $(t,!1,e)},t)}}),c(u.prototype,{resolve:function(e){this.promise.$$state.status||(e===this.promise?this.$$reject(f("qcycle","Expected promise to be resolved with value other than itself '{0}'",e)):this.$$resolve(e))},$$resolve:function(e){function t(e){u||(u=!0,a.$$resolve(e))}function r(e){u||(u=!0,a.$$reject(e))}var i,a=this,u=!1;try{(y(e)||C(e))&&(i=e&&e.then),C(i)?(this.promise.$$state.status=-1,i.call(e,t,r,o(this,this.notify))):(this.promise.$$state.value=e,this.promise.$$state.status=1,s(this.promise.$$state))}catch(e){r(e),n(e)}},reject:function(e){this.promise.$$state.status||this.$$reject(e)},$$reject:function(e){this.promise.$$state.value=e,this.promise.$$state.status=2,s(this.promise.$$state)},notify:function(t){var r=this.promise.$$state.pending;this.promise.$$state.status<=0&&r&&r.length&&e(function(){for(var e,i,o=0,a=r.length;o<a;o++){i=r[o][0],e=r[o][3];try{i.notify(C(e)?e(t):t)}catch(e){n(e)}}})}});var p=function(e){var t=new u;return t.reject(e),t.promise},d=function(e,t){var n=new u;return t?n.resolve(e):n.reject(e),n.promise},$=function(e,t,n){var r=null;try{C(n)&&(r=n())}catch(e){return d(e,!1)}return V(r)?r.then(function(){return d(e,t)},function(e){return d(e,!1)}):d(e,t)},v=function(e,t,n,r){var i=new u;return i.resolve(e),i.promise.then(t,n,r)},g=v,b=function(e){function t(e){r.resolve(e)}function n(e){r.reject(e)}if(!C(e))throw f("norslvr","Expected resolverFn, got '{0}'",e);var r=new u;return e(t,n),r.promise};return b.prototype=i.prototype,b.defer=h,b.reject=p,b.when=v,b.resolve=g,b.all=l,b}function wn(){this.$get=["$window","$timeout",function(e,t){var n=e.requestAnimationFrame||e.webkitRequestAnimationFrame,r=e.cancelAnimationFrame||e.webkitCancelAnimationFrame||e.webkitCancelRequestAnimationFrame,i=!!n,o=i?function(e){var t=n(e);return function(){r(t)}}:function(e){var n=t(e,16.66,!1);return function(){t.cancel(n)}};return o.supported=i,o}]}function xn(){function e(e){function t(){this.$$watchers=this.$$nextSibling=this.$$childHead=this.$$childTail=null,this.$$listeners={},this.$$listenerCount={},this.$$watchersCount=0,this.$id=a(),this.$$ChildScope=null}return t.prototype=e,t}var i=10,o=t("$rootScope"),s=null,u=null;this.digestTtl=function(e){return arguments.length&&(i=e),i},this.$get=["$exceptionHandler","$parse","$browser",function(t,c,l){function f(e){e.currentScope.$$destroyed=!0}function h(e){9===Dr&&(e.$$childHead&&h(e.$$childHead),e.$$nextSibling&&h(e.$$nextSibling)),e.$parent=e.$$nextSibling=e.$$prevSibling=e.$$childHead=e.$$childTail=e.$root=e.$$watchers=null}function d(){this.$id=a(),this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null,this.$root=this,this.$$destroyed=!1,this.$$listeners={},this.$$listenerCount={},this.$$watchersCount=0,this.$$isolateBindings=null}function $(e){if(E.$$phase)throw o("inprog","{0} already in progress",E.$$phase);E.$$phase=e}function v(){E.$$phase=null}function g(e,t){do{e.$$watchersCount+=t}while(e=e.$parent)}function b(e,t,n){do{e.$$listenerCount[n]-=t,0===e.$$listenerCount[n]&&delete e.$$listenerCount[n]}while(e=e.$parent)}function w(){}function x(){for(;O.length;)try{O.shift()()}catch(e){t(e)}u=null}function S(){null===u&&(u=l.defer(function(){E.$apply(x)}))}d.prototype={constructor:d,$new:function(t,n){var r;return n=n||this,t?(r=new d,r.$root=this.$root):(this.$$ChildScope||(this.$$ChildScope=e(this)),r=new this.$$ChildScope),r.$parent=n,r.$$prevSibling=n.$$childTail,n.$$childHead?(n.$$childTail.$$nextSibling=r,n.$$childTail=r):n.$$childHead=n.$$childTail=r,(t||n!=this)&&r.$on("$destroy",f),r},$watch:function(e,t,n,r){var i=c(e);if(i.$$watchDelegate)return i.$$watchDelegate(this,t,n,i,e);var o=this,a=o.$$watchers,u={fn:t,last:w,get:i,exp:r||e,eq:!!n};return s=null,C(t)||(u.fn=p),a||(a=o.$$watchers=[]),a.unshift(u),g(this,1),function(){R(a,u)>=0&&g(o,-1),s=null}},$watchGroup:function(e,t){function n(){u=!1,c?(c=!1,t(o,o,s)):t(o,i,s)}var i=new Array(e.length),o=new Array(e.length),a=[],s=this,u=!1,c=!0;if(!e.length){var l=!0;return s.$evalAsync(function(){l&&t(o,o,s)}),function(){l=!1}}return 1===e.length?this.$watch(e[0],function(e,n,r){o[0]=e,i[0]=n,t(o,e===n?o:i,r)}):(r(e,function(e,t){var r=s.$watch(e,function(e,r){o[t]=e,i[t]=r,u||(u=!0,s.$evalAsync(n))});a.push(r)}),function(){for(;a.length;)a.shift()()})},$watchCollection:function(e,t){function r(e){o=e;var t,r,i,s;if(!m(o)){if(y(o))if(n(o)){a!==p&&(a=p,v=a.length=0,f++),t=o.length,v!==t&&(f++,a.length=v=t);for(var u=0;u<t;u++)s=a[u],i=o[u],s!==s&&i!==i||s===i||(f++,a[u]=i)}else{a!==d&&(a=d={},v=0,f++),t=0;for(r in o)Tr.call(o,r)&&(t++,i=o[r],s=a[r],r in a?s!==s&&i!==i||s===i||(f++,a[r]=i):(v++,a[r]=i,f++));if(v>t){f++;for(r in a)Tr.call(o,r)||(v--,delete a[r])}}else a!==o&&(a=o,f++);return f}}function i(){if($?($=!1,t(o,o,u)):t(o,s,u),l)if(y(o))if(n(o)){s=new Array(o.length);for(var e=0;e<o.length;e++)s[e]=o[e]}else{s={};for(var r in o)Tr.call(o,r)&&(s[r]=o[r])}else s=o}r.$stateful=!0;var o,a,s,u=this,l=t.length>1,f=0,h=c(e,r),p=[],d={},$=!0,v=0;return this.$watch(h,i)},$digest:function(){var e,n,r,a,c,f,h,p,d,m,g,y,b=i,S=this,O=[];$("$digest"),l.$$checkUrlChange(),this===E&&null!==u&&(l.defer.cancel(u),x()),s=null;do{p=!1,m=S;for(var T=0;T<A.length;T++){try{y=A[T],y.scope.$eval(y.expression,y.locals)}catch(e){t(e)}s=null}A.length=0;e:do{if(f=m.$$watchers)for(h=f.length;h--;)try{if(e=f[h])if(c=e.get,(n=c(m))===(r=e.last)||(e.eq?q(n,r):"number"==typeof n&&"number"==typeof r&&isNaN(n)&&isNaN(r))){if(e===s){p=!1;break e}}else p=!0,s=e,e.last=e.eq?F(n,null):n,a=e.fn,a(n,r===w?n:r,m),b<5&&(g=4-b,O[g]||(O[g]=[]),O[g].push({msg:C(e.exp)?"fn: "+(e.exp.name||e.exp.toString()):e.exp,newVal:n,oldVal:r}))}catch(e){t(e)}if(!(d=m.$$watchersCount&&m.$$childHead||m!==S&&m.$$nextSibling))for(;m!==S&&!(d=m.$$nextSibling);)m=m.$parent}while(m=d);if((p||A.length)&&!b--)throw v(),o("infdig","{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}",i,O)}while(p||A.length);for(v();M<k.length;)try{k[M++]()}catch(e){t(e)}k.length=M=0},$destroy:function(){if(!this.$$destroyed){var e=this.$parent;this.$broadcast("$destroy"),this.$$destroyed=!0,this===E&&l.$$applicationDestroyed(),g(this,-this.$$watchersCount);for(var t in this.$$listenerCount)b(this,this.$$listenerCount[t],t);e&&e.$$childHead==this&&(e.$$childHead=this.$$nextSibling),e&&e.$$childTail==this&&(e.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$destroy=this.$digest=this.$apply=this.$evalAsync=this.$applyAsync=p,this.$on=this.$watch=this.$watchGroup=function(){return p},this.$$listeners={},this.$$nextSibling=null,h(this)}},$eval:function(e,t){return c(e)(this,t)},$evalAsync:function(e,t){E.$$phase||A.length||l.defer(function(){A.length&&E.$digest()}),A.push({scope:this,expression:c(e),locals:t})},$$postDigest:function(e){k.push(e)},$apply:function(e){try{$("$apply");try{return this.$eval(e)}finally{v()}}catch(e){t(e)}finally{try{E.$digest()}catch(e){throw t(e),e}}},$applyAsync:function(e){function t(){n.$eval(e)}var n=this;e&&O.push(t),e=c(e),S()},$on:function(e,t){var n=this.$$listeners[e];n||(this.$$listeners[e]=n=[]),n.push(t);var r=this;do{r.$$listenerCount[e]||(r.$$listenerCount[e]=0),r.$$listenerCount[e]++}while(r=r.$parent);var i=this;return function(){var r=n.indexOf(t);-1!==r&&(n[r]=null,b(i,1,e))}},$emit:function(e,n){var r,i,o,a=[],s=this,u=!1,c={name:e,targetScope:s,stopPropagation:function(){u=!0},preventDefault:function(){c.defaultPrevented=!0},defaultPrevented:!1},l=U([c],arguments,1);do{for(r=s.$$listeners[e]||a,c.currentScope=s,i=0,o=r.length;i<o;i++)if(r[i])try{r[i].apply(null,l)}catch(e){t(e)}else r.splice(i,1),i--,o--;if(u)return c.currentScope=null,c;s=s.$parent}while(s);return c.currentScope=null,c},$broadcast:function(e,n){var r=this,i=r,o=r,a={name:e,targetScope:r,preventDefault:function(){a.defaultPrevented=!0},defaultPrevented:!1};if(!r.$$listenerCount[e])return a;for(var s,u,c,l=U([a],arguments,1);i=o;){for(a.currentScope=i,s=i.$$listeners[e]||[],u=0,c=s.length;u<c;u++)if(s[u])try{s[u].apply(null,l)}catch(e){t(e)}else s.splice(u,1),u--,c--;if(!(o=i.$$listenerCount[e]&&i.$$childHead||i!==r&&i.$$nextSibling))for(;i!==r&&!(o=i.$$nextSibling);)i=i.$parent}return a.currentScope=null,a}};var E=new d,A=E.$$asyncQueue=[],k=E.$$postDigestQueue=[],O=E.$$applyAsyncQueue=[],M=0;return E}]}function Sn(){var e=/^\s*(https?|ftp|mailto|tel|file):/,t=/^\s*((https?|ftp|file|blob):|data:image\/)/;this.aHrefSanitizationWhitelist=function(t){return g(t)?(e=t,this):e},this.imgSrcSanitizationWhitelist=function(e){return g(e)?(t=e,this):t},this.$get=function(){return function(n,r){var i,o=r?t:e;return i=Vn(n).href,""===i||i.match(o)?n:"unsafe:"+i}}}function Cn(e){if("self"===e)return e;if(w(e)){if(e.indexOf("***")>-1)throw mo("iwcard","Illegal sequence *** in string matcher.  String: {0}",e);return e=Yr(e).replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*"),new RegExp("^"+e+"$")}if(E(e))return new RegExp("^"+e.source+"$");throw mo("imatcher",'Matchers may only be "self", string patterns or RegExp objects')}function En(e){var t=[];return g(e)&&r(e,function(e){t.push(Cn(e))}),t}function An(){this.SCE_CONTEXTS=go;var e=["self"],t=[];this.resourceUrlWhitelist=function(t){return arguments.length&&(e=En(t)),e},this.resourceUrlBlacklist=function(e){return arguments.length&&(t=En(e)),t},this.$get=["$injector",function(n){function r(e,t){return"self"===e?jn(t):!!e.exec(t.href)}function i(n){var i,o,a=Vn(n.toString()),s=!1;for(i=0,o=e.length;i<o;i++)if(r(e[i],a)){s=!0;break}if(s)for(i=0,o=t.length;i<o;i++)if(r(t[i],a)){s=!1;break}return s}function o(e){var t=function(e){this.$$unwrapTrustedValue=function(){return e}};return e&&(t.prototype=new e),t.prototype.valueOf=function(){return this.$$unwrapTrustedValue()},t.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()},t}function a(e,t){var n=f.hasOwnProperty(e)?f[e]:null;if(!n)throw mo("icontext","Attempted to trust a value in invalid context. Context: {0}; Value: {1}",e,t);if(null===t||m(t)||""===t)return t;if("string"!=typeof t)throw mo("itype","Attempted to trust a non-string value in a content requiring a string: Context: {0}",e);return new n(t)}function s(e){return e instanceof l?e.$$unwrapTrustedValue():e}function u(e,t){if(null===t||m(t)||""===t)return t;var n=f.hasOwnProperty(e)?f[e]:null;if(n&&t instanceof n)return t.$$unwrapTrustedValue();if(e===go.RESOURCE_URL){if(i(t))return t;throw mo("insecurl","Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}",t.toString())}if(e===go.HTML)return c(t);throw mo("unsafe","Attempting to use an unsafe value in a safe context.")}var c=function(e){throw mo("unsafe","Attempting to use an unsafe value in a safe context.")};n.has("$sanitize")&&(c=n.get("$sanitize"));var l=o(),f={};return f[go.HTML]=o(l),f[go.CSS]=o(l),f[go.URL]=o(l),f[go.JS]=o(l),f[go.RESOURCE_URL]=o(f[go.URL]),{trustAs:a,getTrusted:u,valueOf:s}}]}function kn(){var e=!0;this.enabled=function(t){return arguments.length&&(e=!!t),e},this.$get=["$parse","$sceDelegate",function(t,n){if(e&&Dr<8)throw mo("iequirks","Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");var i=$e(go);i.isEnabled=function(){return e},i.trustAs=n.trustAs,i.getTrusted=n.getTrusted,i.valueOf=n.valueOf,e||(i.trustAs=i.getTrusted=function(e,t){return t},i.valueOf=d),i.parseAs=function(e,n){var r=t(n);return r.literal&&r.constant?r:t(n,function(t){return i.getTrusted(e,t)})};var o=i.parseAs,a=i.getTrusted,s=i.trustAs;return r(go,function(e,t){var n=Nr(t);i[ye("parse_as_"+n)]=function(t){return o(e,t)},i[ye("get_trusted_"+n)]=function(t){return a(e,t)},i[ye("trust_as_"+n)]=function(t){return s(e,t)}}),i}]}function On(){this.$get=["$window","$document",function(e,t){var n,r,i={},o=e.chrome&&e.chrome.app&&e.chrome.app.runtime,a=!o&&e.history&&e.history.pushState,s=f((/android (\d+)/.exec(Nr((e.navigator||{}).userAgent))||[])[1]),u=/Boxee/i.test((e.navigator||{}).userAgent),c=t[0]||{},l=/^(Moz|webkit|ms)(?=[A-Z])/,h=c.body&&c.body.style,p=!1,d=!1;if(h){for(var $ in h)if(r=l.exec($)){n=r[0],n=n[0].toUpperCase()+n.substr(1);break}n||(n="WebkitOpacity"in h&&"webkit"),p=!!("transition"in h||n+"Transition"in h),d=!!("animation"in h||n+"Animation"in h),!s||p&&d||(p=w(h.webkitTransition),d=w(h.webkitAnimation))}return{history:!(!a||s<4||u),hasEvent:function(e){if("input"===e&&Dr<=11)return!1;if(m(i[e])){var t=c.createElement("div");i[e]="on"+e in t}return i[e]},csp:Kr(),vendorPrefix:n,transitions:p,animations:d,android:s}}]}function Mn(){var e;this.httpOptions=function(t){return t?(e=t,this):e},this.$get=["$templateCache","$http","$q","$sce",function(t,n,r,i){function o(a,s){function u(e){if(!s)throw yo("tpload","Failed to load template: {0} (HTTP status: {1} {2})",a,e.status,e.statusText);return r.reject(e)}o.totalPendingRequests++,w(a)&&!m(t.get(a))||(a=i.getTrustedResourceUrl(a));var l=n.defaults&&n.defaults.transformResponse;return Gr(l)?l=l.filter(function(e){return e!==Ct}):l===Ct&&(l=null),n.get(a,c({cache:t,transformResponse:l},e)).finally(function(){o.totalPendingRequests--}).then(function(e){return t.put(a,e.data),e.data},u)}return o.totalPendingRequests=0,o}]}function Tn(){this.$get=["$rootScope","$browser","$location",function(e,t,n){var i={};return i.findBindings=function(e,t,n){var i=e.getElementsByClassName("ng-binding"),o=[];return r(i,function(e){var i=zr.element(e).data("$binding");i&&r(i,function(r){if(n){new RegExp("(^|\\s)"+Yr(t)+"(\\s|\\||$)").test(r)&&o.push(e)}else-1!=r.indexOf(t)&&o.push(e)})}),o},i.findModels=function(e,t,n){for(var r=["ng-","data-ng-","ng\\:"],i=0;i<r.length;++i){var o=n?"=":"*=",a="["+r[i]+"model"+o+'"'+t+'"]',s=e.querySelectorAll(a);if(s.length)return s}},i.getLocation=function(){return n.url()},i.setLocation=function(t){t!==n.url()&&(n.url(t),e.$digest())},i.whenStable=function(e){t.notifyWhenNoOutstandingRequests(e)},i}]}function Nn(){this.$get=["$rootScope","$browser","$q","$$q","$exceptionHandler",function(e,t,n,r,i){function o(o,s,u){C(o)||(u=s,s=o,o=p);var c,l=L(arguments,3),f=g(u)&&!u,h=(f?r:n).defer(),d=h.promise;return c=t.defer(function(){try{h.resolve(o.apply(null,l))}catch(e){h.reject(e),i(e)}finally{delete a[d.$$timeoutId]}f||e.$apply()},s),d.$$timeoutId=c,a[c]=h,d}var a={};return o.cancel=function(e){return!!(e&&e.$$timeoutId in a)&&(a[e.$$timeoutId].reject("canceled"),delete a[e.$$timeoutId],t.defer.cancel(e.$$timeoutId))},o}]}function Vn(e){var t=e;return Dr&&(bo.setAttribute("href",t),t=bo.href),bo.setAttribute("href",t),{href:bo.href,protocol:bo.protocol?bo.protocol.replace(/:$/,""):"",host:bo.host,search:bo.search?bo.search.replace(/^\?/,""):"",hash:bo.hash?bo.hash.replace(/^#/,""):"",hostname:bo.hostname,port:bo.port,pathname:"/"===bo.pathname.charAt(0)?bo.pathname:"/"+bo.pathname}}function jn(e){var t=w(e)?Vn(e):e;return t.protocol===wo.protocol&&t.host===wo.host}function In(){this.$get=$(e)}function Dn(e){function t(e){try{return decodeURIComponent(e)}catch(t){return e}}var n=e[0]||{},r={},i="";return function(){var e,o,a,s,u,c=n.cookie||"";if(c!==i)for(i=c,e=i.split("; "),r={},a=0;a<e.length;a++)o=e[a],(s=o.indexOf("="))>0&&(u=t(o.substring(0,s)),m(r[u])&&(r[u]=t(o.substring(s+1))));return r}}function Pn(){this.$get=Dn}function _n(e){function t(i,o){if(y(i)){var a={};return r(i,function(e,n){a[n]=t(n,e)}),a}return e.factory(i+n,o)}var n="Filter";this.register=t,this.$get=["$injector",function(e){return function(t){return e.get(t+n)}}],t("currency",Ln),t("date",rr),t("filter",Rn),t("json",ir),t("limitTo",or),t("lowercase",Oo),t("number",Hn),t("orderBy",sr),t("uppercase",Mo)}function Rn(){return function(e,r,i){if(!n(e)){if(null==e)return e;throw t("filter")("notarray","Expected array but received: {0}",e)}var o,a,s=Un(r);switch(s){case"function":o=r;break;case"boolean":case"null":case"number":case"string":a=!0;case"object":o=Fn(r,i,a);break;default:return e}return Array.prototype.filter.call(e,o)}}function Fn(e,t,n){var r=y(e)&&"$"in e;return!0===t?t=q:C(t)||(t=function(e,t){return!m(e)&&(null===e||null===t?e===t:!(y(t)||y(e)&&!v(e))&&(e=Nr(""+e),t=Nr(""+t),-1!==e.indexOf(t)))}),function(i){return r&&!y(i)?qn(i,e.$,t,!1):qn(i,e,t,n)}}function qn(e,t,n,r,i){var o=Un(e),a=Un(t);if("string"===a&&"!"===t.charAt(0))return!qn(e,t.substring(1),n,r);if(Gr(e))return e.some(function(e){return qn(e,t,n,r)});switch(o){case"object":var s;if(r){for(s in e)if("$"!==s.charAt(0)&&qn(e[s],t,n,!0))return!0;return!i&&qn(e,t,n,!1)}if("object"===a){for(s in t){var u=t[s];if(!C(u)&&!m(u)){var c="$"===s;if(!qn(c?e:e[s],u,n,c,c))return!1}}return!0}return n(e,t);case"function":return!1;default:return n(e,t)}}function Un(e){return null===e?"null":typeof e}function Ln(e){var t=e.NUMBER_FORMATS;return function(e,n,r){return m(n)&&(n=t.CURRENCY_SYM),m(r)&&(r=t.PATTERNS[1].maxFrac),null==e?e:Wn(e,t.PATTERNS[1],t.GROUP_SEP,t.DECIMAL_SEP,r).replace(/\u00A4/g,n)}}function Hn(e){var t=e.NUMBER_FORMATS;return function(e,n){return null==e?e:Wn(e,t.PATTERNS[0],t.GROUP_SEP,t.DECIMAL_SEP,n)}}function Bn(e){var t,n,r,i,o,a=0;for((n=e.indexOf(So))>-1&&(e=e.replace(So,"")),(r=e.search(/e/i))>0?(n<0&&(n=r),n+=+e.slice(r+1),e=e.substring(0,r)):n<0&&(n=e.length),r=0;e.charAt(r)==Co;r++);if(r==(o=e.length))t=[0],n=1;else{for(o--;e.charAt(o)==Co;)o--;for(n-=r,t=[],i=0;r<=o;r++,i++)t[i]=+e.charAt(r)}return n>xo&&(t=t.splice(0,xo-1),a=n-1,n=1),{d:t,e:a,i:n}}function zn(e,t,n,r){var i=e.d,o=i.length-e.i;t=m(t)?Math.min(Math.max(n,o),r):+t;var a=t+e.i,s=i[a];if(a>0){i.splice(Math.max(e.i,a));for(var u=a;u<i.length;u++)i[u]=0}else{o=Math.max(0,o),e.i=1,i.length=Math.max(1,a=t+1),i[0]=0;for(var c=1;c<a;c++)i[c]=0}if(s>=5)if(a-1<0){for(var l=0;l>a;l--)i.unshift(0),e.i++;i.unshift(1),e.i++}else i[a-1]++;for(;o<Math.max(0,t);o++)i.push(0);var f=i.reduceRight(function(e,t,n,r){return t+=e,r[n]=t%10,Math.floor(t/10)},0);f&&(i.unshift(f),e.i++)}function Wn(e,t,n,r,i){if(!w(e)&&!x(e)||isNaN(e))return"";var o,a=!isFinite(e),s=!1,u=Math.abs(e)+"",c="";if(a)c="∞";else{o=Bn(u),zn(o,i,t.minFrac,t.maxFrac);var l=o.d,f=o.i,h=o.e,p=[];for(s=l.reduce(function(e,t){return e&&!t},!0);f<0;)l.unshift(0),f++;f>0?p=l.splice(f,l.length):(p=l,l=[0]);var d=[];for(l.length>=t.lgSize&&d.unshift(l.splice(-t.lgSize,l.length).join(""));l.length>t.gSize;)d.unshift(l.splice(-t.gSize,l.length).join(""));l.length&&d.unshift(l.join("")),c=d.join(n),p.length&&(c+=r+p.join("")),h&&(c+="e+"+h)}return e<0&&!s?t.negPre+c+t.negSuf:t.posPre+c+t.posSuf}function Gn(e,t,n,r){var i="";for((e<0||r&&e<=0)&&(r?e=1-e:(e=-e,i="-")),e=""+e;e.length<t;)e=Co+e;return n&&(e=e.substr(e.length-t)),i+e}function Zn(e,t,n,r,i){return n=n||0,function(o){var a=o["get"+e]();return(n>0||a>-n)&&(a+=n),0===a&&-12==n&&(a=12),Gn(a,t,r,i)}}function Jn(e,t,n){return function(r,i){var o=r["get"+e]();return i[Vr((n?"STANDALONE":"")+(t?"SHORT":"")+e)][o]}}function Yn(e,t,n){var r=-1*n,i=r>=0?"+":"";return i+=Gn(Math[r>0?"floor":"ceil"](r/60),2)+Gn(Math.abs(r%60),2)}function Kn(e){var t=new Date(e,0,1).getDay();return new Date(e,0,(t<=4?5:12)-t)}function Xn(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate()+(4-e.getDay()))}function Qn(e){return function(t){var n=Kn(t.getFullYear()),r=Xn(t),i=+r-+n;return Gn(1+Math.round(i/6048e5),e)}}function er(e,t){return e.getHours()<12?t.AMPMS[0]:t.AMPMS[1]}function tr(e,t){return e.getFullYear()<=0?t.ERAS[0]:t.ERAS[1]}function nr(e,t){return e.getFullYear()<=0?t.ERANAMES[0]:t.ERANAMES[1]}function rr(e){function t(e){var t;if(t=e.match(n)){var r=new Date(0),i=0,o=0,a=t[8]?r.setUTCFullYear:r.setFullYear,s=t[8]?r.setUTCHours:r.setHours;t[9]&&(i=f(t[9]+t[10]),o=f(t[9]+t[11])),a.call(r,f(t[1]),f(t[2])-1,f(t[3]));var u=f(t[4]||0)-i,c=f(t[5]||0)-o,l=f(t[6]||0),h=Math.round(1e3*parseFloat("0."+(t[7]||0)));return s.call(r,u,c,l,h),r}return e}var n=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(n,i,o){var a,s,u="",c=[];if(i=i||"mediumDate",i=e.DATETIME_FORMATS[i]||i,w(n)&&(n=ko.test(n)?f(n):t(n)),x(n)&&(n=new Date(n)),!S(n)||!isFinite(n.getTime()))return n;for(;i;)s=Ao.exec(i),s?(c=U(c,s,1),i=c.pop()):(c.push(i),i=null);var l=n.getTimezoneOffset();return o&&(l=G(o,l),n=J(n,o,!0)),r(c,function(t){a=Eo[t],u+=a?a(n,e.DATETIME_FORMATS,l):"''"===t?"'":t.replace(/(^'|'$)/g,"").replace(/''/g,"'")}),u}}function ir(){return function(e,t){return m(t)&&(t=2),z(e,t)}}function or(){return function(e,t,r){return t=Math.abs(Number(t))===1/0?Number(t):f(t),isNaN(t)?e:(x(e)&&(e=e.toString()),n(e)?(r=!r||isNaN(r)?0:f(r),r=r<0?Math.max(0,e.length+r):r,t>=0?ar(e,r,r+t):0===r?ar(e,t,e.length):ar(e,Math.max(0,r+t),r)):e)}}function ar(e,t,n){return w(e)?e.slice(t,n):Fr.call(e,t,n)}function sr(e){function r(t){return t.map(function(t){var n=1,r=d;if(C(t))r=t;else if(w(t)&&("+"!=t.charAt(0)&&"-"!=t.charAt(0)||(n="-"==t.charAt(0)?-1:1,t=t.substring(1)),""!==t&&(r=e(t),r.constant))){var i=r();r=function(e){return e[i]}}return{get:r,descending:n}})}function i(e){switch(typeof e){case"number":case"boolean":case"string":return!0;default:return!1}}function o(e){return C(e.valueOf)&&(e=e.valueOf(),i(e))?e:(v(e)&&(e=e.toString(),i(e)),e)}function a(e,t){var n=typeof e;return null===e?(n="string",e="null"):"object"===n&&(e=o(e)),{value:e,type:n,index:t}}function s(e,t){var n=0,r=e.type,i=t.type;if(r===i){var o=e.value,a=t.value;"string"===r?(o=o.toLowerCase(),a=a.toLowerCase()):"object"===r&&(y(o)&&(o=e.index),y(a)&&(a=t.index)),o!==a&&(n=o<a?-1:1)}else n=r<i?-1:1;return n}return function(e,i,o,u){function c(e,t){return{value:e,tieBreaker:{value:t,type:"number",index:t},predicateValues:f.map(function(n){return a(n.get(e),t)})}}function l(e,t){for(var n=0,r=f.length;n<r;n++){var i=p(e.predicateValues[n],t.predicateValues[n]);if(i)return i*f[n].descending*h}return p(e.tieBreaker,t.tieBreaker)*h}if(null==e)return e;if(!n(e))throw t("orderBy")("notarray","Expected array but received: {0}",e);Gr(i)||(i=[i]),0===i.length&&(i=["+"]);var f=r(i),h=o?-1:1,p=C(u)?u:s,d=Array.prototype.map.call(e,c);return d.sort(l),e=d.map(function(e){return e.value})}}function ur(e){return C(e)&&(e={link:e}),e.restrict=e.restrict||"AC",$(e)}function cr(e,t){e.$name=t}function lr(e,t,n,i,o){var a=this,s=[];a.$error={},a.$$success={},a.$pending=void 0,a.$name=o(t.name||t.ngForm||"")(n),a.$dirty=!1,a.$pristine=!0,a.$valid=!0,a.$invalid=!1,a.$submitted=!1,a.$$parentForm=Vo,a.$rollbackViewValue=function(){r(s,function(e){e.$rollbackViewValue()})},a.$commitViewValue=function(){r(s,function(e){e.$commitViewValue()})},a.$addControl=function(e){le(e.$name,"input"),s.push(e),e.$name&&(a[e.$name]=e),e.$$parentForm=a},a.$$renameControl=function(e,t){var n=e.$name;a[n]===e&&delete a[n],a[t]=e,e.$name=t},a.$removeControl=function(e){e.$name&&a[e.$name]===e&&delete a[e.$name],r(a.$pending,function(t,n){a.$setValidity(n,null,e)}),r(a.$error,function(t,n){a.$setValidity(n,null,e)}),r(a.$$success,function(t,n){a.$setValidity(n,null,e)}),R(s,e),e.$$parentForm=Vo},Er({ctrl:this,$element:e,set:function(e,t,n){var r=e[t];if(r){-1===r.indexOf(n)&&r.push(n)}else e[t]=[n]},unset:function(e,t,n){var r=e[t];r&&(R(r,n),0===r.length&&delete e[t])},$animate:i}),a.$setDirty=function(){i.removeClass(e,va),i.addClass(e,ma),a.$dirty=!0,a.$pristine=!1,a.$$parentForm.$setDirty()},a.$setPristine=function(){i.setClass(e,va,ma+" "+jo),a.$dirty=!1,a.$pristine=!0,a.$submitted=!1,r(s,function(e){e.$setPristine()})},a.$setUntouched=function(){r(s,function(e){e.$setUntouched()})},a.$setSubmitted=function(){i.addClass(e,jo),a.$submitted=!0,a.$$parentForm.$setSubmitted()}}function fr(e){e.$formatters.push(function(t){return e.$isEmpty(t)?t:t.toString()})}function hr(e,t,n,r,i,o){pr(e,t,n,r,i,o),fr(r)}function pr(e,t,n,r,i,o){var a=Nr(t[0].type);if(!i.android){var s=!1;t.on("compositionstart",function(){s=!0}),t.on("compositionend",function(){s=!1,c()})}var u,c=function(e){if(u&&(o.defer.cancel(u),u=null),!s){var i=t.val(),c=e&&e.type;"password"===a||n.ngTrim&&"false"===n.ngTrim||(i=Jr(i)),(r.$viewValue!==i||""===i&&r.$$hasNativeValidators)&&r.$setViewValue(i,c)}};if(i.hasEvent("input"))t.on("input",c);else{var l=function(e,t,n){u||(u=o.defer(function(){u=null,t&&t.value===n||c(e)}))};t.on("keydown",function(e){var t=e.keyCode;91===t||15<t&&t<19||37<=t&&t<=40||l(e,this,this.value)}),i.hasEvent("paste")&&t.on("paste cut",l)}t.on("change",c),Go[a]&&r.$$hasNativeValidators&&a===n.type&&t.on(Wo,function(e){if(!u){var t=this[Mr],n=t.badInput,r=t.typeMismatch;u=o.defer(function(){u=null,t.badInput===n&&t.typeMismatch===r||c(e)})}}),r.$render=function(){var e=r.$isEmpty(r.$viewValue)?"":r.$viewValue;t.val()!==e&&t.val(e)}}function dr(e,t){if(S(e))return e;if(w(e)){Ho.lastIndex=0;var n=Ho.exec(e);if(n){var r=+n[1],i=+n[2],o=0,a=0,s=0,u=0,c=Kn(r),l=7*(i-1);return t&&(o=t.getHours(),a=t.getMinutes(),s=t.getSeconds(),u=t.getMilliseconds()),new Date(r,0,c.getDate()+l,o,a,s,u)}}return NaN}function $r(e,t){return function(n,i){var o,a;if(S(n))return n;if(w(n)){if('"'==n.charAt(0)&&'"'==n.charAt(n.length-1)&&(n=n.substring(1,n.length-1)),_o.test(n))return new Date(n);if(e.lastIndex=0,o=e.exec(n))return o.shift(),a=i?{yyyy:i.getFullYear(),MM:i.getMonth()+1,dd:i.getDate(),HH:i.getHours(),mm:i.getMinutes(),ss:i.getSeconds(),sss:i.getMilliseconds()/1e3}:{yyyy:1970,MM:1,dd:1,HH:0,mm:0,ss:0,sss:0},r(o,function(e,n){n<t.length&&(a[t[n]]=+e)}),new Date(a.yyyy,a.MM-1,a.dd,a.HH,a.mm,a.ss||0,1e3*a.sss||0)}return NaN}}function vr(e,t,n,r){return function(i,o,a,s,u,c,l){function f(e){return e&&!(e.getTime&&e.getTime()!==e.getTime())}function h(e){return g(e)&&!S(e)?n(e)||void 0:e}mr(i,o,a,s),pr(i,o,a,s,u,c);var p,d=s&&s.$options&&s.$options.timezone;if(s.$$parserName=e,s.$parsers.push(function(e){if(s.$isEmpty(e))return null;if(t.test(e)){var r=n(e,p);return d&&(r=J(r,d)),r}}),s.$formatters.push(function(e){if(e&&!S(e))throw ya("datefmt","Expected `{0}` to be a date",e);return f(e)?(p=e,p&&d&&(p=J(p,d,!0)),l("date")(e,r,d)):(p=null,"")}),g(a.min)||a.ngMin){var $;s.$validators.min=function(e){return!f(e)||m($)||n(e)>=$},a.$observe("min",function(e){$=h(e),s.$validate()})}if(g(a.max)||a.ngMax){var v;s.$validators.max=function(e){return!f(e)||m(v)||n(e)<=v},a.$observe("max",function(e){v=h(e),s.$validate()})}}}function mr(e,t,n,r){var i=t[0];(r.$$hasNativeValidators=y(i.validity))&&r.$parsers.push(function(e){var n=t.prop(Mr)||{};return n.badInput||n.typeMismatch?void 0:e})}function gr(e,t,n,r,i,o){if(mr(e,t,n,r),pr(e,t,n,r,i,o),r.$$parserName="number",r.$parsers.push(function(e){return r.$isEmpty(e)?null:qo.test(e)?parseFloat(e):void 0}),r.$formatters.push(function(e){if(!r.$isEmpty(e)){if(!x(e))throw ya("numfmt","Expected `{0}` to be a number",e);e=e.toString()}return e}),g(n.min)||n.ngMin){var a;r.$validators.min=function(e){return r.$isEmpty(e)||m(a)||e>=a},n.$observe("min",function(e){g(e)&&!x(e)&&(e=parseFloat(e,10)),a=x(e)&&!isNaN(e)?e:void 0,r.$validate()})}if(g(n.max)||n.ngMax){var s;r.$validators.max=function(e){return r.$isEmpty(e)||m(s)||e<=s},n.$observe("max",function(e){g(e)&&!x(e)&&(e=parseFloat(e,10)),s=x(e)&&!isNaN(e)?e:void 0,r.$validate()})}}function yr(e,t,n,r,i,o){pr(e,t,n,r,i,o),fr(r),r.$$parserName="url",r.$validators.url=function(e,t){var n=e||t;return r.$isEmpty(n)||Ro.test(n)}}function br(e,t,n,r,i,o){pr(e,t,n,r,i,o),fr(r),r.$$parserName="email",r.$validators.email=function(e,t){var n=e||t;return r.$isEmpty(n)||Fo.test(n)}}function wr(e,t,n,r){m(n.name)&&t.attr("name",a());var i=function(e){t[0].checked&&r.$setViewValue(n.value,e&&e.type)};t.on("click",i),r.$render=function(){var e=n.value;t[0].checked=e==r.$viewValue},n.$observe("value",r.$render)}function xr(e,t,n,r,i){var o;if(g(r)){if(o=e(r),!o.constant)throw ya("constexpr","Expected constant expression for `{0}`, but saw `{1}`.",n,r);return o(t)}return i}function Sr(e,t,n,r,i,o,a,s){var u=xr(s,e,"ngTrueValue",n.ngTrueValue,!0),c=xr(s,e,"ngFalseValue",n.ngFalseValue,!1),l=function(e){r.$setViewValue(t[0].checked,e&&e.type)};t.on("click",l),r.$render=function(){t[0].checked=r.$viewValue},r.$isEmpty=function(e){return!1===e},r.$formatters.push(function(e){return q(e,u)}),r.$parsers.push(function(e){return e?u:c})}function Cr(e,t){return e="ngClass"+e,["$animate",function(n){function i(e,t){var n=[];e:for(var r=0;r<e.length;r++){for(var i=e[r],o=0;o<t.length;o++)if(i==t[o])continue e;n.push(i)}return n}function o(e){var t=[];return Gr(e)?(r(e,function(e){t=t.concat(o(e))}),t):w(e)?e.split(" "):y(e)?(r(e,function(e,n){e&&(t=t.concat(n.split(" ")))}),t):e}return{restrict:"AC",link:function(a,s,u){function c(e){var t=f(e,1);u.$addClass(t)}function l(e){var t=f(e,-1)
;u.$removeClass(t)}function f(e,t){var n=s.data("$classCounts")||pe(),i=[];return r(e,function(e){(t>0||n[e])&&(n[e]=(n[e]||0)+t,n[e]===+(t>0)&&i.push(e))}),s.data("$classCounts",n),i.join(" ")}function h(e,t){var r=i(t,e),o=i(e,t);r=f(r,1),o=f(o,-1),r&&r.length&&n.addClass(s,r),o&&o.length&&n.removeClass(s,o)}function p(e){if(!0===t||(1&a.$index)===t){var n=o(e||[]);if(d){if(!q(e,d)){var r=o(d);h(r,n)}}else c(n)}d=Gr(e)?e.map(function(e){return $e(e)}):$e(e)}var d;a.$watch(u[e],p,!0),u.$observe("class",function(t){p(a.$eval(u[e]))}),"ngClass"!==e&&a.$watch("$index",function(n,r){var i=1&n;if(i!==(1&r)){var s=o(a.$eval(u[e]));i===t?c(s):l(s)}})}}}]}function Er(e){function t(e,t,s){m(t)?n("$pending",e,s):r("$pending",e,s),N(t)?t?(l(a.$error,e,s),c(a.$$success,e,s)):(c(a.$error,e,s),l(a.$$success,e,s)):(l(a.$error,e,s),l(a.$$success,e,s)),a.$pending?(i(ga,!0),a.$valid=a.$invalid=void 0,o("",null)):(i(ga,!1),a.$valid=Ar(a.$error),a.$invalid=!a.$valid,o("",a.$valid));var u;u=a.$pending&&a.$pending[e]?void 0:!a.$error[e]&&(!!a.$$success[e]||null),o(e,u),a.$$parentForm.$setValidity(e,u,a)}function n(e,t,n){a[e]||(a[e]={}),c(a[e],t,n)}function r(e,t,n){a[e]&&l(a[e],t,n),Ar(a[e])&&(a[e]=void 0)}function i(e,t){t&&!u[e]?(f.addClass(s,e),u[e]=!0):!t&&u[e]&&(f.removeClass(s,e),u[e]=!1)}function o(e,t){e=e?"-"+se(e,"-"):"",i(da+e,!0===t),i($a+e,!1===t)}var a=e.ctrl,s=e.$element,u={},c=e.set,l=e.unset,f=e.$animate;u[$a]=!(u[da]=s.hasClass(da)),a.$setValidity=t}function Ar(e){if(e)for(var t in e)if(e.hasOwnProperty(t))return!1;return!0}function kr(e){e[0].hasAttribute("selected")&&(e[0].selected=!0)}var Or=/^\/(.+)\/([a-z]*)$/,Mr="validity",Tr=Object.prototype.hasOwnProperty,Nr=function(e){return w(e)?e.toLowerCase():e},Vr=function(e){return w(e)?e.toUpperCase():e},jr=function(e){return w(e)?e.replace(/[A-Z]/g,function(e){return String.fromCharCode(32|e.charCodeAt(0))}):e},Ir=function(e){return w(e)?e.replace(/[a-z]/g,function(e){return String.fromCharCode(-33&e.charCodeAt(0))}):e};"i"!=="I".toLowerCase()&&(Nr=jr,Vr=Ir);var Dr,Pr,_r,Rr,Fr=[].slice,qr=[].splice,Ur=[].push,Lr=Object.prototype.toString,Hr=Object.getPrototypeOf,Br=t("ng"),zr=e.angular||(e.angular={}),Wr=0;Dr=e.document.documentMode,p.$inject=[],d.$inject=[];var Gr=Array.isArray,Zr=/^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/,Jr=function(e){return w(e)?e.trim():e},Yr=function(e){return e.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")},Kr=function(){if(!g(Kr.rules)){var t=e.document.querySelector("[ng-csp]")||e.document.querySelector("[data-ng-csp]");if(t){var n=t.getAttribute("ng-csp")||t.getAttribute("data-ng-csp");Kr.rules={noUnsafeEval:!n||-1!==n.indexOf("no-unsafe-eval"),noInlineStyle:!n||-1!==n.indexOf("no-inline-style")}}else Kr.rules={noUnsafeEval:function(){try{return new Function(""),!1}catch(e){return!0}}(),noInlineStyle:!1}}return Kr.rules},Xr=function(){if(g(Xr.name_))return Xr.name_;var t,n,r,i,o=ei.length;for(n=0;n<o;++n)if(r=ei[n],t=e.document.querySelector("["+r.replace(":","\\:")+"jq]")){i=t.getAttribute(r+"jq");break}return Xr.name_=i},Qr=/:/g,ei=["ng-","data-ng-","ng:","x-ng-"],ti=/[A-Z]/g,ni=!1,ri=1,ii=3,oi=8,ai=9,si=11,ui={full:"1.5.7",major:1,minor:5,dot:7,codeName:"hexagonal-circumvolution"};ke.expando="ng339";var ci=ke.cache={},li=1,fi=function(e,t,n){e.addEventListener(t,n,!1)},hi=function(e,t,n){e.removeEventListener(t,n,!1)};ke._data=function(e){return this.cache[e[this.expando]]||{}};var pi=/([\:\-\_]+(.))/g,di=/^moz([A-Z])/,$i={mouseleave:"mouseout",mouseenter:"mouseover"},vi=t("jqLite"),mi=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,gi=/<|&#?\w+;/,yi=/<([\w:-]+)/,bi=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,wi={option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};wi.optgroup=wi.option,wi.tbody=wi.tfoot=wi.colgroup=wi.caption=wi.thead,wi.th=wi.td;var xi=e.Node.prototype.contains||function(e){return!!(16&this.compareDocumentPosition(e))},Si=ke.prototype={ready:function(t){function n(){r||(r=!0,t())}var r=!1;"complete"===e.document.readyState?e.setTimeout(n):(this.on("DOMContentLoaded",n),ke(e).on("load",n))},toString:function(){var e=[];return r(this,function(t){e.push(""+t)}),"["+e.join(", ")+"]"},eq:function(e){return Pr(e>=0?this[e]:this[this.length+e])},length:0,push:Ur,sort:[].sort,splice:[].splice},Ci={};r("multiple,selected,checked,disabled,readOnly,required,open".split(","),function(e){Ci[Nr(e)]=e});var Ei={};r("input,select,option,textarea,button,form,details".split(","),function(e){Ei[e]=!0});var Ai={ngMinlength:"minlength",ngMaxlength:"maxlength",ngMin:"min",ngMax:"max",ngPattern:"pattern"};r({data:je,removeData:Ne,hasData:xe,cleanData:Se},function(e,t){ke[t]=e}),r({data:je,inheritedData:Fe,scope:function(e){return Pr.data(e,"$scope")||Fe(e.parentNode||e,["$isolateScope","$scope"])},isolateScope:function(e){return Pr.data(e,"$isolateScope")||Pr.data(e,"$isolateScopeNoTemplate")},controller:Re,injector:function(e){return Fe(e,"$injector")},removeAttr:function(e,t){e.removeAttribute(t)},hasClass:Ie,css:function(e,t,n){if(t=ye(t),!g(n))return e.style[t];e.style[t]=n},attr:function(e,t,n){var r=e.nodeType;if(r!==ii&&2!==r&&r!==oi){var i=Nr(t);if(Ci[i]){if(!g(n))return e[t]||(e.attributes.getNamedItem(t)||p).specified?i:void 0;n?(e[t]=!0,e.setAttribute(t,i)):(e[t]=!1,e.removeAttribute(i))}else if(g(n))e.setAttribute(t,n);else if(e.getAttribute){var o=e.getAttribute(t,2);return null===o?void 0:o}}},prop:function(e,t,n){if(!g(n))return e[t];e[t]=n},text:function(){function e(e,t){if(m(t)){var n=e.nodeType;return n===ri||n===ii?e.textContent:""}e.textContent=t}return e.$dv="",e}(),val:function(e,t){if(m(t)){if(e.multiple&&"select"===_(e)){var n=[];return r(e.options,function(e){e.selected&&n.push(e.value||e.text)}),0===n.length?null:n}return e.value}e.value=t},html:function(e,t){if(m(t))return e.innerHTML;Me(e,!0),e.innerHTML=t},empty:qe},function(e,t){ke.prototype[t]=function(t,n){var r,i,o=this.length;if(e!==qe&&m(2==e.length&&e!==Ie&&e!==Re?t:n)){if(y(t)){for(r=0;r<o;r++)if(e===je)e(this[r],t);else for(i in t)e(this[r],i,t[i]);return this}for(var a=e.$dv,s=m(a)?Math.min(o,1):o,u=0;u<s;u++){var c=e(this[u],t,n);a=a?a+c:c}return a}for(r=0;r<o;r++)e(this[r],t,n);return this}}),r({removeData:Ne,on:function(e,t,n,r){if(g(r))throw vi("onargs","jqLite#on() does not support the `selector` or `eventData` parameters");if(we(e)){var i=Ve(e,!0),o=i.events,a=i.handle;a||(a=i.handle=ze(e,o));for(var s=t.indexOf(" ")>=0?t.split(" "):[t],u=s.length,c=function(t,r,i){var s=o[t];s||(s=o[t]=[],s.specialHandlerWrapper=r,"$destroy"===t||i||fi(e,t,a)),s.push(n)};u--;)t=s[u],$i[t]?(c($i[t],Ge),c(t,void 0,!0)):c(t)}},off:Te,one:function(e,t,n){e=Pr(e),e.on(t,function r(){e.off(t,n),e.off(t,r)}),e.on(t,n)},replaceWith:function(e,t){var n,i=e.parentNode;Me(e),r(new ke(t),function(t){n?i.insertBefore(t,n.nextSibling):i.replaceChild(t,e),n=t})},children:function(e){var t=[];return r(e.childNodes,function(e){e.nodeType===ri&&t.push(e)}),t},contents:function(e){return e.contentDocument||e.childNodes||[]},append:function(e,t){var n=e.nodeType;if(n===ri||n===si){t=new ke(t);for(var r=0,i=t.length;r<i;r++){var o=t[r];e.appendChild(o)}}},prepend:function(e,t){if(e.nodeType===ri){var n=e.firstChild;r(new ke(t),function(t){e.insertBefore(t,n)})}},wrap:function(e,t){Ae(e,Pr(t).eq(0).clone()[0])},remove:Ue,detach:function(e){Ue(e,!0)},after:function(e,t){var n=e,r=e.parentNode;t=new ke(t);for(var i=0,o=t.length;i<o;i++){var a=t[i];r.insertBefore(a,n.nextSibling),n=a}},addClass:Pe,removeClass:De,toggleClass:function(e,t,n){t&&r(t.split(" "),function(t){var r=n;m(r)&&(r=!Ie(e,t)),(r?Pe:De)(e,t)})},parent:function(e){var t=e.parentNode;return t&&t.nodeType!==si?t:null},next:function(e){return e.nextElementSibling},find:function(e,t){return e.getElementsByTagName?e.getElementsByTagName(t):[]},clone:Oe,triggerHandler:function(e,t,n){var i,o,a,s=t.type||t,u=Ve(e),l=u&&u.events,f=l&&l[s];f&&(i={preventDefault:function(){this.defaultPrevented=!0},isDefaultPrevented:function(){return!0===this.defaultPrevented},stopImmediatePropagation:function(){this.immediatePropagationStopped=!0},isImmediatePropagationStopped:function(){return!0===this.immediatePropagationStopped},stopPropagation:p,type:s,target:e},t.type&&(i=c(i,t)),o=$e(f),a=n?[i].concat(n):[i],r(o,function(t){i.isImmediatePropagationStopped()||t.apply(e,a)}))}},function(e,t){ke.prototype[t]=function(t,n,r){for(var i,o=0,a=this.length;o<a;o++)m(i)?(i=e(this[o],t,n,r),g(i)&&(i=Pr(i))):_e(i,e(this[o],t,n,r));return g(i)?i:this},ke.prototype.bind=ke.prototype.on,ke.prototype.unbind=ke.prototype.off}),Ye.prototype={put:function(e,t){this[Je(e,this.nextUid)]=t},get:function(e){return this[Je(e,this.nextUid)]},remove:function(e){var t=this[e=Je(e,this.nextUid)];return delete this[e],t}};var ki=[function(){this.$get=[function(){return Ye}]}],Oi=/^([^\(]+?)=>/,Mi=/^[^\(]*\(\s*([^\)]*)\)/m,Ti=/,/,Ni=/^\s*(_?)(\S+?)\1\s*$/,Vi=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,ji=t("$injector");tt.$$annotate=et;var Ii=t("$animate"),Di=1,Pi=function(){this.$get=p},_i=function(){var e=new Ye,t=[];this.$get=["$$AnimateRunner","$rootScope",function(n,i){function o(e,t,n){var i=!1;return t&&(t=w(t)?t.split(" "):Gr(t)?t:[],r(t,function(t){t&&(i=!0,e[t]=n)})),i}function a(){r(t,function(t){var n=e.get(t);if(n){var i=ot(t.attr("class")),o="",a="";r(n,function(e,t){e!==!!i[t]&&(e?o+=(o.length?" ":"")+t:a+=(a.length?" ":"")+t)}),r(t,function(e){o&&Pe(e,o),a&&De(e,a)}),e.remove(t)}}),t.length=0}function s(n,r,s){var u=e.get(n)||{},c=o(u,r,!0),l=o(u,s,!1);(c||l)&&(e.put(n,u),t.push(n),1===t.length&&i.$$postDigest(a))}return{enabled:p,on:p,off:p,pin:p,push:function(e,t,r,i){i&&i(),r=r||{},r.from&&e.css(r.from),r.to&&e.css(r.to),(r.addClass||r.removeClass)&&s(e,r.addClass,r.removeClass);var o=new n;return o.complete(),o}}}]},Ri=["$provide",function(e){var t=this;this.$$registeredAnimations=Object.create(null),this.register=function(n,r){if(n&&"."!==n.charAt(0))throw Ii("notcsel","Expecting class selector starting with '.' got '{0}'.",n);var i=n+"-animation";t.$$registeredAnimations[n.substr(1)]=i,e.factory(i,r)},this.classNameFilter=function(e){if(1===arguments.length&&(this.$$classNameFilter=e instanceof RegExp?e:null,this.$$classNameFilter)){if(new RegExp("(\\s+|\\/)ng-animate(\\s+|\\/)").test(this.$$classNameFilter.toString()))throw Ii("nongcls",'$animateProvider.classNameFilter(regex) prohibits accepting a regex value which matches/contains the "{0}" CSS class.',"ng-animate")}return this.$$classNameFilter},this.$get=["$$animateQueue",function(e){function t(e,t,n){if(n){var r=it(n);!r||r.parentNode||r.previousElementSibling||(n=null)}n?n.after(e):t.prepend(e)}return{on:e.on,off:e.off,pin:e.pin,enabled:e.enabled,cancel:function(e){e.end&&e.end()},enter:function(n,r,i,o){return r=r&&Pr(r),i=i&&Pr(i),r=r||i.parent(),t(n,r,i),e.push(n,"enter",at(o))},move:function(n,r,i,o){return r=r&&Pr(r),i=i&&Pr(i),r=r||i.parent(),t(n,r,i),e.push(n,"move",at(o))},leave:function(t,n){return e.push(t,"leave",at(n),function(){t.remove()})},addClass:function(t,n,r){return r=at(r),r.addClass=rt(r.addclass,n),e.push(t,"addClass",r)},removeClass:function(t,n,r){return r=at(r),r.removeClass=rt(r.removeClass,n),e.push(t,"removeClass",r)},setClass:function(t,n,r,i){return i=at(i),i.addClass=rt(i.addClass,n),i.removeClass=rt(i.removeClass,r),e.push(t,"setClass",i)},animate:function(t,n,r,i,o){return o=at(o),o.from=o.from?c(o.from,n):n,o.to=o.to?c(o.to,r):r,i=i||"ng-inline-animate",o.tempClasses=rt(o.tempClasses,i),e.push(t,"animate",o)}}}]}],Fi=function(){this.$get=["$$rAF",function(e){function t(t){n.push(t),n.length>1||e(function(){for(var e=0;e<n.length;e++)n[e]();n=[]})}var n=[];return function(){var e=!1;return t(function(){e=!0}),function(n){e?n():t(n)}}}]},qi=function(){this.$get=["$q","$sniffer","$$animateAsyncRun","$document","$timeout",function(e,t,n,i,o){function a(e){this.setHost(e);var t=n(),r=function(e){o(e,0,!1)};this._doneCallbacks=[],this._tick=function(e){var n=i[0];n&&n.hidden?r(e):t(e)},this._state=0}return a.chain=function(e,t){function n(){if(r===e.length)return void t(!0);e[r](function(e){if(!1===e)return void t(!1);r++,n()})}var r=0;n()},a.all=function(e,t){function n(n){o=o&&n,++i===e.length&&t(o)}var i=0,o=!0;r(e,function(e){e.done(n)})},a.prototype={setHost:function(e){this.host=e||{}},done:function(e){2===this._state?e():this._doneCallbacks.push(e)},progress:p,getPromise:function(){if(!this.promise){var t=this;this.promise=e(function(e,n){t.done(function(t){!1===t?n():e()})})}return this.promise},then:function(e,t){return this.getPromise().then(e,t)},catch:function(e){return this.getPromise().catch(e)},finally:function(e){return this.getPromise().finally(e)},pause:function(){this.host.pause&&this.host.pause()},resume:function(){this.host.resume&&this.host.resume()},end:function(){this.host.end&&this.host.end(),this._resolve(!0)},cancel:function(){this.host.cancel&&this.host.cancel(),this._resolve(!1)},complete:function(e){var t=this;0===t._state&&(t._state=1,t._tick(function(){t._resolve(e)}))},_resolve:function(e){2!==this._state&&(r(this._doneCallbacks,function(t){t(e)}),this._doneCallbacks.length=0,this._state=2)}},a}]},Ui=function(){this.$get=["$$rAF","$q","$$AnimateRunner",function(e,t,n){return function(t,r){function i(){return e(function(){o(),s||u.complete(),s=!0}),u}function o(){a.addClass&&(t.addClass(a.addClass),a.addClass=null),a.removeClass&&(t.removeClass(a.removeClass),a.removeClass=null),a.to&&(t.css(a.to),a.to=null)}var a=r||{};a.$$prepared||(a=F(a)),a.cleanupStyles&&(a.from=a.to=null),a.from&&(t.css(a.from),a.from=null);var s,u=new n;return{start:i,end:i}}}]},Li=t("$compile"),Hi=new ft;ht.$inject=["$provide","$$sanitizeUriProvider"],pt.prototype.isFirstChange=function(){return this.previousValue===Hi};var Bi=/^((?:x|data)[\:\-_])/i,zi=t("$controller"),Wi=/^(\S+)(\s+as\s+([\w$]+))?$/,Gi=function(){this.$get=["$document",function(e){return function(t){return t?!t.nodeType&&t instanceof Pr&&(t=t[0]):t=e[0].body,t.offsetWidth+1}}]},Zi="application/json",Ji={"Content-Type":Zi+";charset=utf-8"},Yi=/^\[|^\{(?!\{)/,Ki={"[":/]$/,"{":/}$/},Xi=/^\)\]\}',?\n/,Qi=t("$http"),eo=function(e){return function(){throw Qi("legacy","The method `{0}` on the promise returned from `$http` has been disabled.",e)}},to=zr.$interpolateMinErr=t("$interpolate");to.throwNoconcat=function(e){throw to("noconcat","Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce",e)},to.interr=function(e,t){return to("interr","Can't interpolate: {0}\n{1}",e,t.toString())};var no=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,ro={http:80,https:443,ftp:21},io=t("$location"),oo={$$absUrl:"",$$html5:!1,$$replace:!1,absUrl:Zt("$$absUrl"),url:function(e){if(m(e))return this.$$url;var t=no.exec(e);return(t[1]||""===e)&&this.path(decodeURIComponent(t[1])),(t[2]||t[1]||""===e)&&this.search(t[3]||""),this.hash(t[5]||""),this},protocol:Zt("$$protocol"),host:Zt("$$host"),port:Zt("$$port"),path:Jt("$$path",function(e){return e=null!==e?e.toString():"","/"==e.charAt(0)?e:"/"+e}),search:function(e,t){switch(arguments.length){case 0:return this.$$search;case 1:if(w(e)||x(e))e=e.toString(),this.$$search=X(e);else{if(!y(e))throw io("isrcharg","The first argument of the `$location#search()` call must be a string or an object.");e=F(e,{}),r(e,function(t,n){null==t&&delete e[n]}),this.$$search=e}break;default:m(t)||null===t?delete this.$$search[e]:this.$$search[e]=t}return this.$$compose(),this},hash:Jt("$$hash",function(e){return null!==e?e.toString():""}),replace:function(){return this.$$replace=!0,this}};r([Gt,Wt,zt],function(e){e.prototype=Object.create(oo),e.prototype.state=function(t){if(!arguments.length)return this.$$state;if(e!==zt||!this.$$html5)throw io("nostate","History API state support is available only in HTML5 mode and only in browsers supporting HTML5 History API");return this.$$state=m(t)?null:t,this}});var ao=t("$parse"),so=Function.prototype.call,uo=Function.prototype.apply,co=Function.prototype.bind,lo=pe();r("+ - * / % === !== == != < > <= >= && || ! = |".split(" "),function(e){lo[e]=!0});var fo={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},ho=function(e){this.options=e};ho.prototype={constructor:ho,lex:function(e){for(this.text=e,this.index=0,this.tokens=[];this.index<this.text.length;){var t=this.text.charAt(this.index);if('"'===t||"'"===t)this.readString(t);else if(this.isNumber(t)||"."===t&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdentifierStart(this.peekMultichar()))this.readIdent();else if(this.is(t,"(){}[].,;:?"))this.tokens.push({index:this.index,text:t}),this.index++;else if(this.isWhitespace(t))this.index++;else{var n=t+this.peek(),r=n+this.peek(2),i=lo[t],o=lo[n],a=lo[r];if(i||o||a){var s=a?r:o?n:t;this.tokens.push({index:this.index,text:s,operator:!0}),this.index+=s.length}else this.throwError("Unexpected next character ",this.index,this.index+1)}}return this.tokens},is:function(e,t){return-1!==t.indexOf(e)},peek:function(e){var t=e||1;return this.index+t<this.text.length&&this.text.charAt(this.index+t)},isNumber:function(e){return"0"<=e&&e<="9"&&"string"==typeof e},isWhitespace:function(e){return" "===e||"\r"===e||"\t"===e||"\n"===e||"\v"===e||" "===e},isIdentifierStart:function(e){return this.options.isIdentifierStart?this.options.isIdentifierStart(e,this.codePointAt(e)):this.isValidIdentifierStart(e)},isValidIdentifierStart:function(e){return"a"<=e&&e<="z"||"A"<=e&&e<="Z"||"_"===e||"$"===e},isIdentifierContinue:function(e){return this.options.isIdentifierContinue?this.options.isIdentifierContinue(e,this.codePointAt(e)):this.isValidIdentifierContinue(e)},isValidIdentifierContinue:function(e,t){return this.isValidIdentifierStart(e,t)||this.isNumber(e)},codePointAt:function(e){return 1===e.length?e.charCodeAt(0):(e.charCodeAt(0)<<10)+e.charCodeAt(1)-56613888},peekMultichar:function(){var e=this.text.charAt(this.index),t=this.peek();if(!t)return e;var n=e.charCodeAt(0),r=t.charCodeAt(0);return n>=55296&&n<=56319&&r>=56320&&r<=57343?e+t:e},isExpOperator:function(e){return"-"===e||"+"===e||this.isNumber(e)},throwError:function(e,t,n){n=n||this.index;var r=g(t)?"s "+t+"-"+this.index+" ["+this.text.substring(t,n)+"]":" "+n;throw ao("lexerr","Lexer Error: {0} at column{1} in expression [{2}].",e,r,this.text)},readNumber:function(){for(var e="",t=this.index;this.index<this.text.length;){var n=Nr(this.text.charAt(this.index));if("."==n||this.isNumber(n))e+=n;else{var r=this.peek();if("e"==n&&this.isExpOperator(r))e+=n;else if(this.isExpOperator(n)&&r&&this.isNumber(r)&&"e"==e.charAt(e.length-1))e+=n;else{if(!this.isExpOperator(n)||r&&this.isNumber(r)||"e"!=e.charAt(e.length-1))break;this.throwError("Invalid exponent")}}this.index++}this.tokens.push({index:t,text:e,constant:!0,value:Number(e)})},readIdent:function(){var e=this.index;for(this.index+=this.peekMultichar().length;this.index<this.text.length;){var t=this.peekMultichar();if(!this.isIdentifierContinue(t))break;this.index+=t.length}this.tokens.push({index:e,text:this.text.slice(e,this.index),identifier:!0})},readString:function(e){var t=this.index;this.index++;for(var n="",r=e,i=!1;this.index<this.text.length;){var o=this.text.charAt(this.index);if(r+=o,i){if("u"===o){var a=this.text.substring(this.index+1,this.index+5);a.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+a+"]"),this.index+=4,n+=String.fromCharCode(parseInt(a,16))}else{n+=fo[o]||o}i=!1}else if("\\"===o)i=!0;else{if(o===e)return this.index++,void this.tokens.push({index:t,text:r,constant:!0,value:n});n+=o}this.index++}this.throwError("Unterminated quote",t)}};var po=function(e,t){this.lexer=e,this.options=t};po.Program="Program",po.ExpressionStatement="ExpressionStatement",po.AssignmentExpression="AssignmentExpression",po.ConditionalExpression="ConditionalExpression",po.LogicalExpression="LogicalExpression",po.BinaryExpression="BinaryExpression",po.UnaryExpression="UnaryExpression",po.CallExpression="CallExpression",po.MemberExpression="MemberExpression",po.Identifier="Identifier",po.Literal="Literal",po.ArrayExpression="ArrayExpression",po.Property="Property",po.ObjectExpression="ObjectExpression",po.ThisExpression="ThisExpression",po.LocalsExpression="LocalsExpression",po.NGValueParameter="NGValueParameter",po.prototype={ast:function(e){this.text=e,this.tokens=this.lexer.lex(e);var t=this.program();return 0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]),t},program:function(){for(var e=[];;)if(this.tokens.length>0&&!this.peek("}",")",";","]")&&e.push(this.expressionStatement()),!this.expect(";"))return{type:po.Program,body:e}},expressionStatement:function(){return{type:po.ExpressionStatement,expression:this.filterChain()}},filterChain:function(){for(var e=this.expression();this.expect("|");)e=this.filter(e);return e},expression:function(){return this.assignment()},assignment:function(){var e=this.ternary();return this.expect("=")&&(e={type:po.AssignmentExpression,left:e,right:this.assignment(),operator:"="}),e},ternary:function(){var e,t,n=this.logicalOR();return this.expect("?")&&(e=this.expression(),this.consume(":"))?(t=this.expression(),{type:po.ConditionalExpression,test:n,alternate:e,consequent:t}):n},logicalOR:function(){for(var e=this.logicalAND();this.expect("||");)e={type:po.LogicalExpression,operator:"||",left:e,right:this.logicalAND()};return e},logicalAND:function(){for(var e=this.equality();this.expect("&&");)e={type:po.LogicalExpression,operator:"&&",left:e,right:this.equality()};return e},equality:function(){for(var e,t=this.relational();e=this.expect("==","!=","===","!==");)t={type:po.BinaryExpression,operator:e.text,left:t,right:this.relational()};return t},relational:function(){for(var e,t=this.additive();e=this.expect("<",">","<=",">=");)t={type:po.BinaryExpression,operator:e.text,left:t,right:this.additive()};return t},additive:function(){for(var e,t=this.multiplicative();e=this.expect("+","-");)t={type:po.BinaryExpression,operator:e.text,left:t,right:this.multiplicative()};return t},multiplicative:function(){for(var e,t=this.unary();e=this.expect("*","/","%");)t={type:po.BinaryExpression,operator:e.text,left:t,right:this.unary()};return t},unary:function(){var e;return(e=this.expect("+","-","!"))?{type:po.UnaryExpression,operator:e.text,prefix:!0,argument:this.unary()}:this.primary()},primary:function(){var e;this.expect("(")?(e=this.filterChain(),this.consume(")")):this.expect("[")?e=this.arrayDeclaration():this.expect("{")?e=this.object():this.selfReferential.hasOwnProperty(this.peek().text)?e=F(this.selfReferential[this.consume().text]):this.options.literals.hasOwnProperty(this.peek().text)?e={type:po.Literal,value:this.options.literals[this.consume().text]}:this.peek().identifier?e=this.identifier():this.peek().constant?e=this.constant():this.throwError("not a primary expression",this.peek());for(var t;t=this.expect("(","[",".");)"("===t.text?(e={type:po.CallExpression,callee:e,arguments:this.parseArguments()},this.consume(")")):"["===t.text?(e={type:po.MemberExpression,object:e,property:this.expression(),computed:!0},this.consume("]")):"."===t.text?e={type:po.MemberExpression,object:e,property:this.identifier(),computed:!1}:this.throwError("IMPOSSIBLE");return e},filter:function(e){for(var t=[e],n={type:po.CallExpression,callee:this.identifier(),arguments:t,filter:!0};this.expect(":");)t.push(this.expression());return n},parseArguments:function(){var e=[];if(")"!==this.peekToken().text)do{e.push(this.filterChain())}while(this.expect(","));return e},identifier:function(){var e=this.consume();return e.identifier||this.throwError("is not a valid identifier",e),{type:po.Identifier,name:e.text}},constant:function(){return{type:po.Literal,value:this.consume().value}},arrayDeclaration:function(){var e=[];if("]"!==this.peekToken().text)do{if(this.peek("]"))break;e.push(this.expression())}while(this.expect(","));return this.consume("]"),{type:po.ArrayExpression,elements:e}},object:function(){var e,t=[];if("}"!==this.peekToken().text)do{if(this.peek("}"))break;e={type:po.Property,kind:"init"},this.peek().constant?(e.key=this.constant(),e.computed=!1,this.consume(":"),e.value=this.expression()):this.peek().identifier?(e.key=this.identifier(),e.computed=!1,this.peek(":")?(this.consume(":"),e.value=this.expression()):e.value=e.key):this.peek("[")?(this.consume("["),e.key=this.expression(),this.consume("]"),e.computed=!0,this.consume(":"),e.value=this.expression()):this.throwError("invalid key",this.peek()),t.push(e)}while(this.expect(","));return this.consume("}"),{type:po.ObjectExpression,properties:t}},throwError:function(e,t){throw ao("syntax","Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].",t.text,e,t.index+1,this.text,this.text.substring(t.index))},consume:function(e){if(0===this.tokens.length)throw ao("ueoe","Unexpected end of expression: {0}",this.text);var t=this.expect(e);return t||this.throwError("is unexpected, expecting ["+e+"]",this.peek()),t},peekToken:function(){if(0===this.tokens.length)throw ao("ueoe","Unexpected end of expression: {0}",this.text);return this.tokens[0]},peek:function(e,t,n,r){return this.peekAhead(0,e,t,n,r)},peekAhead:function(e,t,n,r,i){if(this.tokens.length>e){var o=this.tokens[e],a=o.text;if(a===t||a===n||a===r||a===i||!t&&!n&&!r&&!i)return o}return!1},expect:function(e,t,n,r){var i=this.peek(e,t,n,r);return!!i&&(this.tokens.shift(),i)},selfReferential:{this:{type:po.ThisExpression},$locals:{type:po.LocalsExpression}}},pn.prototype={compile:function(e,t){var n=this,i=this.astBuilder.ast(e);this.state={nextId:0,filters:{},expensiveChecks:t,fn:{vars:[],body:[],own:{}},assign:{vars:[],body:[],own:{}},inputs:[]},sn(i,n.$filter);var o,a="";if(this.stage="assign",o=ln(i)){this.state.computing="assign";var s=this.nextId();this.recurse(o,s),this.return_(s),a="fn.assign="+this.generateFunction("assign","s,v,l")}var u=un(i.body);n.stage="inputs",r(u,function(e,t){var r="fn"+t;n.state[r]={vars:[],body:[],own:{}},n.state.computing=r;var i=n.nextId();n.recurse(e,i),n.return_(i),n.state.inputs.push(r),e.watchId=t}),this.state.computing="fn",this.stage="main",this.recurse(i);var c='"'+this.USE+" "+this.STRICT+'";\n'+this.filterPrefix()+"var fn="+this.generateFunction("fn","s,l,a,i")+a+this.watchFns()+"return fn;",l=new Function("$filter","ensureSafeMemberName","ensureSafeObject","ensureSafeFunction","getStringValue","ensureSafeAssignContext","ifDefined","plus","text",c)(this.$filter,Xt,en,tn,Qt,nn,rn,on,e);return this.state=this.stage=void 0,l.literal=fn(i),l.constant=hn(i),l},USE:"use",STRICT:"strict",watchFns:function(){var e=[],t=this.state.inputs,n=this;return r(t,function(t){e.push("var "+t+"="+n.generateFunction(t,"s"))}),t.length&&e.push("fn.inputs=["+t.join(",")+"];"),e.join("")},generateFunction:function(e,t){return"function("+t+"){"+this.varsPrefix(e)+this.body(e)+"};"},filterPrefix:function(){var e=[],t=this;return r(this.state.filters,function(n,r){e.push(n+"=$filter("+t.escape(r)+")")}),e.length?"var "+e.join(",")+";":""},varsPrefix:function(e){return this.state[e].vars.length?"var "+this.state[e].vars.join(",")+";":""},body:function(e){return this.state[e].body.join("")},recurse:function(e,t,n,i,o,a){var s,u,c,l,f,h=this;if(i=i||p,!a&&g(e.watchId))return t=t||this.nextId(),void this.if_("i",this.lazyAssign(t,this.computedMember("i",e.watchId)),this.lazyRecurse(e,t,n,i,o,!0));switch(e.type){case po.Program:r(e.body,function(t,n){h.recurse(t.expression,void 0,void 0,function(e){u=e}),n!==e.body.length-1?h.current().body.push(u,";"):h.return_(u)});break;case po.Literal:l=this.escape(e.value),this.assign(t,l),i(l);break;case po.UnaryExpression:this.recurse(e.argument,void 0,void 0,function(e){u=e}),l=e.operator+"("+this.ifDefined(u,0)+")",this.assign(t,l),i(l);break;case po.BinaryExpression:this.recurse(e.left,void 0,void 0,function(e){s=e}),this.recurse(e.right,void 0,void 0,function(e){u=e}),l="+"===e.operator?this.plus(s,u):"-"===e.operator?this.ifDefined(s,0)+e.operator+this.ifDefined(u,0):"("+s+")"+e.operator+"("+u+")",this.assign(t,l),i(l);break;case po.LogicalExpression:t=t||this.nextId(),h.recurse(e.left,t),h.if_("&&"===e.operator?t:h.not(t),h.lazyRecurse(e.right,t)),i(t);break;case po.ConditionalExpression:t=t||this.nextId(),h.recurse(e.test,t),h.if_(t,h.lazyRecurse(e.alternate,t),h.lazyRecurse(e.consequent,t)),i(t);break;case po.Identifier:t=t||this.nextId(),n&&(n.context="inputs"===h.stage?"s":this.assign(this.nextId(),this.getHasOwnProperty("l",e.name)+"?l:s"),n.computed=!1,n.name=e.name),Xt(e.name),h.if_("inputs"===h.stage||h.not(h.getHasOwnProperty("l",e.name)),function(){h.if_("inputs"===h.stage||"s",function(){o&&1!==o&&h.if_(h.not(h.nonComputedMember("s",e.name)),h.lazyAssign(h.nonComputedMember("s",e.name),"{}")),h.assign(t,h.nonComputedMember("s",e.name))})},t&&h.lazyAssign(t,h.nonComputedMember("l",e.name))),(h.state.expensiveChecks||$n(e.name))&&h.addEnsureSafeObject(t),i(t);break;case po.MemberExpression:s=n&&(n.context=this.nextId())||this.nextId(),t=t||this.nextId(),h.recurse(e.object,s,void 0,function(){h.if_(h.notNull(s),function(){o&&1!==o&&h.addEnsureSafeAssignContext(s),e.computed?(u=h.nextId(),h.recurse(e.property,u),h.getStringValue(u),h.addEnsureSafeMemberName(u),o&&1!==o&&h.if_(h.not(h.computedMember(s,u)),h.lazyAssign(h.computedMember(s,u),"{}")),l=h.ensureSafeObject(h.computedMember(s,u)),h.assign(t,l),n&&(n.computed=!0,n.name=u)):(Xt(e.property.name),o&&1!==o&&h.if_(h.not(h.nonComputedMember(s,e.property.name)),h.lazyAssign(h.nonComputedMember(s,e.property.name),"{}")),l=h.nonComputedMember(s,e.property.name),(h.state.expensiveChecks||$n(e.property.name))&&(l=h.ensureSafeObject(l)),h.assign(t,l),n&&(n.computed=!1,n.name=e.property.name))},function(){h.assign(t,"undefined")}),i(t)},!!o);break;case po.CallExpression:t=t||this.nextId(),e.filter?(u=h.filter(e.callee.name),c=[],r(e.arguments,function(e){var t=h.nextId();h.recurse(e,t),c.push(t)}),l=u+"("+c.join(",")+")",h.assign(t,l),i(t)):(u=h.nextId(),s={},c=[],h.recurse(e.callee,u,s,function(){h.if_(h.notNull(u),function(){h.addEnsureSafeFunction(u),r(e.arguments,function(e){h.recurse(e,h.nextId(),void 0,function(e){c.push(h.ensureSafeObject(e))})}),s.name?(h.state.expensiveChecks||h.addEnsureSafeObject(s.context),l=h.member(s.context,s.name,s.computed)+"("+c.join(",")+")"):l=u+"("+c.join(",")+")",l=h.ensureSafeObject(l),h.assign(t,l)},function(){h.assign(t,"undefined")}),i(t)}));break;case po.AssignmentExpression:if(u=this.nextId(),s={},!cn(e.left))throw ao("lval","Trying to assign a value to a non l-value");this.recurse(e.left,void 0,s,function(){h.if_(h.notNull(s.context),function(){h.recurse(e.right,u),h.addEnsureSafeObject(h.member(s.context,s.name,s.computed)),h.addEnsureSafeAssignContext(s.context),l=h.member(s.context,s.name,s.computed)+e.operator+u,h.assign(t,l),i(t||l)})},1);break;case po.ArrayExpression:c=[],r(e.elements,function(e){h.recurse(e,h.nextId(),void 0,function(e){c.push(e)})}),l="["+c.join(",")+"]",this.assign(t,l),i(l);break;case po.ObjectExpression:c=[],f=!1,r(e.properties,function(e){e.computed&&(f=!0)}),f?(t=t||this.nextId(),this.assign(t,"{}"),r(e.properties,function(e){e.computed?(s=h.nextId(),h.recurse(e.key,s)):s=e.key.type===po.Identifier?e.key.name:""+e.key.value,u=h.nextId(),h.recurse(e.value,u),h.assign(h.member(t,s,e.computed),u)})):(r(e.properties,function(t){h.recurse(t.value,e.constant?void 0:h.nextId(),void 0,function(e){c.push(h.escape(t.key.type===po.Identifier?t.key.name:""+t.key.value)+":"+e)})}),l="{"+c.join(",")+"}",this.assign(t,l)),i(t||l);break;case po.ThisExpression:this.assign(t,"s"),i("s");break
;case po.LocalsExpression:this.assign(t,"l"),i("l");break;case po.NGValueParameter:this.assign(t,"v"),i("v")}},getHasOwnProperty:function(e,t){var n=e+"."+t,r=this.current().own;return r.hasOwnProperty(n)||(r[n]=this.nextId(!1,e+"&&("+this.escape(t)+" in "+e+")")),r[n]},assign:function(e,t){if(e)return this.current().body.push(e,"=",t,";"),e},filter:function(e){return this.state.filters.hasOwnProperty(e)||(this.state.filters[e]=this.nextId(!0)),this.state.filters[e]},ifDefined:function(e,t){return"ifDefined("+e+","+this.escape(t)+")"},plus:function(e,t){return"plus("+e+","+t+")"},return_:function(e){this.current().body.push("return ",e,";")},if_:function(e,t,n){if(!0===e)t();else{var r=this.current().body;r.push("if(",e,"){"),t(),r.push("}"),n&&(r.push("else{"),n(),r.push("}"))}},not:function(e){return"!("+e+")"},notNull:function(e){return e+"!=null"},nonComputedMember:function(e,t){var n=/[$_a-zA-Z][$_a-zA-Z0-9]*/,r=/[^$_a-zA-Z0-9]/g;return n.test(t)?e+"."+t:e+'["'+t.replace(r,this.stringEscapeFn)+'"]'},computedMember:function(e,t){return e+"["+t+"]"},member:function(e,t,n){return n?this.computedMember(e,t):this.nonComputedMember(e,t)},addEnsureSafeObject:function(e){this.current().body.push(this.ensureSafeObject(e),";")},addEnsureSafeMemberName:function(e){this.current().body.push(this.ensureSafeMemberName(e),";")},addEnsureSafeFunction:function(e){this.current().body.push(this.ensureSafeFunction(e),";")},addEnsureSafeAssignContext:function(e){this.current().body.push(this.ensureSafeAssignContext(e),";")},ensureSafeObject:function(e){return"ensureSafeObject("+e+",text)"},ensureSafeMemberName:function(e){return"ensureSafeMemberName("+e+",text)"},ensureSafeFunction:function(e){return"ensureSafeFunction("+e+",text)"},getStringValue:function(e){this.assign(e,"getStringValue("+e+")")},ensureSafeAssignContext:function(e){return"ensureSafeAssignContext("+e+",text)"},lazyRecurse:function(e,t,n,r,i,o){var a=this;return function(){a.recurse(e,t,n,r,i,o)}},lazyAssign:function(e,t){var n=this;return function(){n.assign(e,t)}},stringEscapeRegex:/[^ a-zA-Z0-9]/g,stringEscapeFn:function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)},escape:function(e){if(w(e))return"'"+e.replace(this.stringEscapeRegex,this.stringEscapeFn)+"'";if(x(e))return e.toString();if(!0===e)return"true";if(!1===e)return"false";if(null===e)return"null";if(void 0===e)return"undefined";throw ao("esc","IMPOSSIBLE")},nextId:function(e,t){var n="v"+this.state.nextId++;return e||this.current().vars.push(n+(t?"="+t:"")),n},current:function(){return this.state[this.state.computing]}},dn.prototype={compile:function(e,t){var n=this,i=this.astBuilder.ast(e);this.expression=e,this.expensiveChecks=t,sn(i,n.$filter);var o,a;(o=ln(i))&&(a=this.recurse(o));var s,u=un(i.body);u&&(s=[],r(u,function(e,t){var r=n.recurse(e);e.input=r,s.push(r),e.watchId=t}));var c=[];r(i.body,function(e){c.push(n.recurse(e.expression))});var l=0===i.body.length?p:1===i.body.length?c[0]:function(e,t){var n;return r(c,function(r){n=r(e,t)}),n};return a&&(l.assign=function(e,t,n){return a(e,n,t)}),s&&(l.inputs=s),l.literal=fn(i),l.constant=hn(i),l},recurse:function(e,t,n){var i,o,a,s=this;if(e.input)return this.inputs(e.input,e.watchId);switch(e.type){case po.Literal:return this.value(e.value,t);case po.UnaryExpression:return o=this.recurse(e.argument),this["unary"+e.operator](o,t);case po.BinaryExpression:case po.LogicalExpression:return i=this.recurse(e.left),o=this.recurse(e.right),this["binary"+e.operator](i,o,t);case po.ConditionalExpression:return this["ternary?:"](this.recurse(e.test),this.recurse(e.alternate),this.recurse(e.consequent),t);case po.Identifier:return Xt(e.name,s.expression),s.identifier(e.name,s.expensiveChecks||$n(e.name),t,n,s.expression);case po.MemberExpression:return i=this.recurse(e.object,!1,!!n),e.computed||(Xt(e.property.name,s.expression),o=e.property.name),e.computed&&(o=this.recurse(e.property)),e.computed?this.computedMember(i,o,t,n,s.expression):this.nonComputedMember(i,o,s.expensiveChecks,t,n,s.expression);case po.CallExpression:return a=[],r(e.arguments,function(e){a.push(s.recurse(e))}),e.filter&&(o=this.$filter(e.callee.name)),e.filter||(o=this.recurse(e.callee,!0)),e.filter?function(e,n,r,i){for(var s=[],u=0;u<a.length;++u)s.push(a[u](e,n,r,i));var c=o.apply(void 0,s,i);return t?{context:void 0,name:void 0,value:c}:c}:function(e,n,r,i){var u,c=o(e,n,r,i);if(null!=c.value){en(c.context,s.expression),tn(c.value,s.expression);for(var l=[],f=0;f<a.length;++f)l.push(en(a[f](e,n,r,i),s.expression));u=en(c.value.apply(c.context,l),s.expression)}return t?{value:u}:u};case po.AssignmentExpression:return i=this.recurse(e.left,!0,1),o=this.recurse(e.right),function(e,n,r,a){var u=i(e,n,r,a),c=o(e,n,r,a);return en(u.value,s.expression),nn(u.context),u.context[u.name]=c,t?{value:c}:c};case po.ArrayExpression:return a=[],r(e.elements,function(e){a.push(s.recurse(e))}),function(e,n,r,i){for(var o=[],s=0;s<a.length;++s)o.push(a[s](e,n,r,i));return t?{value:o}:o};case po.ObjectExpression:return a=[],r(e.properties,function(e){e.computed?a.push({key:s.recurse(e.key),computed:!0,value:s.recurse(e.value)}):a.push({key:e.key.type===po.Identifier?e.key.name:""+e.key.value,computed:!1,value:s.recurse(e.value)})}),function(e,n,r,i){for(var o={},s=0;s<a.length;++s)a[s].computed?o[a[s].key(e,n,r,i)]=a[s].value(e,n,r,i):o[a[s].key]=a[s].value(e,n,r,i);return t?{value:o}:o};case po.ThisExpression:return function(e){return t?{value:e}:e};case po.LocalsExpression:return function(e,n){return t?{value:n}:n};case po.NGValueParameter:return function(e,n,r){return t?{value:r}:r}}},"unary+":function(e,t){return function(n,r,i,o){var a=e(n,r,i,o);return a=g(a)?+a:0,t?{value:a}:a}},"unary-":function(e,t){return function(n,r,i,o){var a=e(n,r,i,o);return a=g(a)?-a:0,t?{value:a}:a}},"unary!":function(e,t){return function(n,r,i,o){var a=!e(n,r,i,o);return t?{value:a}:a}},"binary+":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a),u=t(r,i,o,a),c=on(s,u);return n?{value:c}:c}},"binary-":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a),u=t(r,i,o,a),c=(g(s)?s:0)-(g(u)?u:0);return n?{value:c}:c}},"binary*":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)*t(r,i,o,a);return n?{value:s}:s}},"binary/":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)/t(r,i,o,a);return n?{value:s}:s}},"binary%":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)%t(r,i,o,a);return n?{value:s}:s}},"binary===":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)===t(r,i,o,a);return n?{value:s}:s}},"binary!==":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)!==t(r,i,o,a);return n?{value:s}:s}},"binary==":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)==t(r,i,o,a);return n?{value:s}:s}},"binary!=":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)!=t(r,i,o,a);return n?{value:s}:s}},"binary<":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)<t(r,i,o,a);return n?{value:s}:s}},"binary>":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)>t(r,i,o,a);return n?{value:s}:s}},"binary<=":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)<=t(r,i,o,a);return n?{value:s}:s}},"binary>=":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)>=t(r,i,o,a);return n?{value:s}:s}},"binary&&":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)&&t(r,i,o,a);return n?{value:s}:s}},"binary||":function(e,t,n){return function(r,i,o,a){var s=e(r,i,o,a)||t(r,i,o,a);return n?{value:s}:s}},"ternary?:":function(e,t,n,r){return function(i,o,a,s){var u=e(i,o,a,s)?t(i,o,a,s):n(i,o,a,s);return r?{value:u}:u}},value:function(e,t){return function(){return t?{context:void 0,name:void 0,value:e}:e}},identifier:function(e,t,n,r,i){return function(o,a,s,u){var c=a&&e in a?a:o;r&&1!==r&&c&&!c[e]&&(c[e]={});var l=c?c[e]:void 0;return t&&en(l,i),n?{context:c,name:e,value:l}:l}},computedMember:function(e,t,n,r,i){return function(o,a,s,u){var c,l,f=e(o,a,s,u);return null!=f&&(c=t(o,a,s,u),c=Qt(c),Xt(c,i),r&&1!==r&&(nn(f),f&&!f[c]&&(f[c]={})),l=f[c],en(l,i)),n?{context:f,name:c,value:l}:l}},nonComputedMember:function(e,t,n,r,i,o){return function(a,s,u,c){var l=e(a,s,u,c);i&&1!==i&&(nn(l),l&&!l[t]&&(l[t]={}));var f=null!=l?l[t]:void 0;return(n||$n(t))&&en(f,o),r?{context:l,name:t,value:f}:f}},inputs:function(e,t){return function(n,r,i,o){return o?o[t]:e(n,r,i)}}};var $o=function(e,t,n){this.lexer=e,this.$filter=t,this.options=n,this.ast=new po(e,n),this.astCompiler=n.csp?new dn(this.ast,t):new pn(this.ast,t)};$o.prototype={constructor:$o,parse:function(e){return this.astCompiler.compile(e,this.options.expensiveChecks)}};var vo=Object.prototype.valueOf,mo=t("$sce"),go={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},yo=t("$compile"),bo=e.document.createElement("a"),wo=Vn(e.location.href);Dn.$inject=["$document"],_n.$inject=["$provide"];var xo=22,So=".",Co="0";Ln.$inject=["$locale"],Hn.$inject=["$locale"];var Eo={yyyy:Zn("FullYear",4,0,!1,!0),yy:Zn("FullYear",2,0,!0,!0),y:Zn("FullYear",1,0,!1,!0),MMMM:Jn("Month"),MMM:Jn("Month",!0),MM:Zn("Month",2,1),M:Zn("Month",1,1),LLLL:Jn("Month",!1,!0),dd:Zn("Date",2),d:Zn("Date",1),HH:Zn("Hours",2),H:Zn("Hours",1),hh:Zn("Hours",2,-12),h:Zn("Hours",1,-12),mm:Zn("Minutes",2),m:Zn("Minutes",1),ss:Zn("Seconds",2),s:Zn("Seconds",1),sss:Zn("Milliseconds",3),EEEE:Jn("Day"),EEE:Jn("Day",!0),a:er,Z:Yn,ww:Qn(2),w:Qn(1),G:tr,GG:tr,GGG:tr,GGGG:nr},Ao=/((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,ko=/^\-?\d+$/;rr.$inject=["$locale"];var Oo=$(Nr),Mo=$(Vr);sr.$inject=["$parse"];var To=$({restrict:"E",compile:function(e,t){if(!t.href&&!t.xlinkHref)return function(e,t){if("a"===t[0].nodeName.toLowerCase()){var n="[object SVGAnimatedString]"===Lr.call(t.prop("href"))?"xlink:href":"href";t.on("click",function(e){t.attr(n)||e.preventDefault()})}}}}),No={};r(Ci,function(e,t){function n(e,n,i){e.$watch(i[r],function(e){i.$set(t,!!e)})}if("multiple"!=e){var r=dt("ng-"+t),i=n;"checked"===e&&(i=function(e,t,i){i.ngModel!==i[r]&&n(e,t,i)}),No[r]=function(){return{restrict:"A",priority:100,link:i}}}}),r(Ai,function(e,t){No[t]=function(){return{priority:100,link:function(e,n,r){if("ngPattern"===t&&"/"==r.ngPattern.charAt(0)){var i=r.ngPattern.match(Or);if(i)return void r.$set("ngPattern",new RegExp(i[1],i[2]))}e.$watch(r[t],function(e){r.$set(t,e)})}}}}),r(["src","srcset","href"],function(e){var t=dt("ng-"+e);No[t]=function(){return{priority:99,link:function(n,r,i){var o=e,a=e;"href"===e&&"[object SVGAnimatedString]"===Lr.call(r.prop("href"))&&(a="xlinkHref",i.$attr[a]="xlink:href",o=null),i.$observe(t,function(t){if(!t)return void("href"===e&&i.$set(a,null));i.$set(a,t),Dr&&o&&r.prop(o,i[a])})}}}});var Vo={$addControl:p,$$renameControl:cr,$removeControl:p,$setValidity:p,$setDirty:p,$setPristine:p,$setSubmitted:p},jo="ng-submitted";lr.$inject=["$element","$attrs","$scope","$animate","$interpolate"];var Io=function(e){return["$timeout","$parse",function(t,n){function r(e){return""===e?n('this[""]').assign:n(e).assign||p}return{name:"form",restrict:e?"EAC":"E",require:["form","^^?form"],controller:lr,compile:function(n,i){n.addClass(va).addClass(da);var o=i.name?"name":!(!e||!i.ngForm)&&"ngForm";return{pre:function(e,n,i,a){var s=a[0];if(!("action"in i)){var u=function(t){e.$apply(function(){s.$commitViewValue(),s.$setSubmitted()}),t.preventDefault()};fi(n[0],"submit",u),n.on("$destroy",function(){t(function(){hi(n[0],"submit",u)},0,!1)})}(a[1]||s.$$parentForm).$addControl(s);var l=o?r(s.$name):p;o&&(l(e,s),i.$observe(o,function(t){s.$name!==t&&(l(e,void 0),s.$$parentForm.$$renameControl(s,t),(l=r(s.$name))(e,s))})),n.on("$destroy",function(){s.$$parentForm.$removeControl(s),l(e,void 0),c(s,Vo)})}}}}}]},Do=Io(),Po=Io(!0),_o=/^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/,Ro=/^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+\])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i,Fo=/^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/,qo=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/,Uo=/^(\d{4,})-(\d{2})-(\d{2})$/,Lo=/^(\d{4,})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,Ho=/^(\d{4,})-W(\d\d)$/,Bo=/^(\d{4,})-(\d\d)$/,zo=/^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,Wo="keydown wheel mousedown",Go=pe();r("date,datetime-local,month,time,week".split(","),function(e){Go[e]=!0});var Zo={text:hr,date:vr("date",Uo,$r(Uo,["yyyy","MM","dd"]),"yyyy-MM-dd"),"datetime-local":vr("datetimelocal",Lo,$r(Lo,["yyyy","MM","dd","HH","mm","ss","sss"]),"yyyy-MM-ddTHH:mm:ss.sss"),time:vr("time",zo,$r(zo,["HH","mm","ss","sss"]),"HH:mm:ss.sss"),week:vr("week",Ho,dr,"yyyy-Www"),month:vr("month",Bo,$r(Bo,["yyyy","MM"]),"yyyy-MM"),number:gr,url:yr,email:br,radio:wr,checkbox:Sr,hidden:p,button:p,submit:p,reset:p,file:p},Jo=["$browser","$sniffer","$filter","$parse",function(e,t,n,r){return{restrict:"E",require:["?ngModel"],link:{pre:function(i,o,a,s){s[0]&&(Zo[Nr(a.type)]||Zo.text)(i,o,a,s[0],t,e,n,r)}}}}],Yo=/^(true|false|\d+)$/,Ko=function(){return{restrict:"A",priority:100,compile:function(e,t){return Yo.test(t.ngValue)?function(e,t,n){n.$set("value",e.$eval(n.ngValue))}:function(e,t,n){e.$watch(n.ngValue,function(e){n.$set("value",e)})}}}},Xo=["$compile",function(e){return{restrict:"AC",compile:function(t){return e.$$addBindingClass(t),function(t,n,r){e.$$addBindingInfo(n,r.ngBind),n=n[0],t.$watch(r.ngBind,function(e){n.textContent=m(e)?"":e})}}}}],Qo=["$interpolate","$compile",function(e,t){return{compile:function(n){return t.$$addBindingClass(n),function(n,r,i){var o=e(r.attr(i.$attr.ngBindTemplate));t.$$addBindingInfo(r,o.expressions),r=r[0],i.$observe("ngBindTemplate",function(e){r.textContent=m(e)?"":e})}}}}],ea=["$sce","$parse","$compile",function(e,t,n){return{restrict:"A",compile:function(r,i){var o=t(i.ngBindHtml),a=t(i.ngBindHtml,function(t){return e.valueOf(t)});return n.$$addBindingClass(r),function(t,r,i){n.$$addBindingInfo(r,i.ngBindHtml),t.$watch(a,function(){var n=o(t);r.html(e.getTrustedHtml(n)||"")})}}}}],ta=$({restrict:"A",require:"ngModel",link:function(e,t,n,r){r.$viewChangeListeners.push(function(){e.$eval(n.ngChange)})}}),na=Cr("",!0),ra=Cr("Odd",0),ia=Cr("Even",1),oa=ur({compile:function(e,t){t.$set("ngCloak",void 0),e.removeClass("ng-cloak")}}),aa=[function(){return{restrict:"A",scope:!0,controller:"@",priority:500}}],sa={},ua={blur:!0,focus:!0};r("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(e){var t=dt("ng-"+e);sa[t]=["$parse","$rootScope",function(n,r){return{restrict:"A",compile:function(i,o){var a=n(o[t],null,!0);return function(t,n){n.on(e,function(n){var i=function(){a(t,{$event:n})};ua[e]&&r.$$phase?t.$evalAsync(i):t.$apply(i)})}}}}]});var ca=["$animate","$compile",function(e,t){return{multiElement:!0,transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(n,r,i,o,a){var s,u,c;n.$watch(i.ngIf,function(n){n?u||a(function(n,o){u=o,n[n.length++]=t.$$createComment("end ngIf",i.ngIf),s={clone:n},e.enter(n,r.parent(),r)}):(c&&(c.remove(),c=null),u&&(u.$destroy(),u=null),s&&(c=he(s.clone),e.leave(c).then(function(){c=null}),s=null))})}}}],la=["$templateRequest","$anchorScroll","$animate",function(e,t,n){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:zr.noop,compile:function(r,i){var o=i.ngInclude||i.src,a=i.onload||"",s=i.autoscroll;return function(r,i,u,c,l){var f,h,p,d=0,$=function(){h&&(h.remove(),h=null),f&&(f.$destroy(),f=null),p&&(n.leave(p).then(function(){h=null}),h=p,p=null)};r.$watch(o,function(o){var u=function(){!g(s)||s&&!r.$eval(s)||t()},h=++d;o?(e(o,!0).then(function(e){if(!r.$$destroyed&&h===d){var t=r.$new();c.template=e;var s=l(t,function(e){$(),n.enter(e,null,i).then(u)});f=t,p=s,f.$emit("$includeContentLoaded",o),r.$eval(a)}},function(){r.$$destroyed||h===d&&($(),r.$emit("$includeContentError",o))}),r.$emit("$includeContentRequested",o)):($(),c.template=null)})}}}}],fa=["$compile",function(t){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(n,r,i,o){if(Lr.call(r[0]).match(/SVG/))return r.empty(),void t(Ce(o.template,e.document).childNodes)(n,function(e){r.append(e)},{futureParentElement:r});r.html(o.template),t(r.contents())(n)}}}],ha=ur({priority:450,compile:function(){return{pre:function(e,t,n){e.$eval(n.ngInit)}}}}),pa=function(){return{restrict:"A",priority:100,require:"ngModel",link:function(e,t,n,i){var o=t.attr(n.$attr.ngList)||", ",a="false"!==n.ngTrim,s=a?Jr(o):o,u=function(e){if(!m(e)){var t=[];return e&&r(e.split(s),function(e){e&&t.push(a?Jr(e):e)}),t}};i.$parsers.push(u),i.$formatters.push(function(e){if(Gr(e))return e.join(o)}),i.$isEmpty=function(e){return!e||!e.length}}}},da="ng-valid",$a="ng-invalid",va="ng-pristine",ma="ng-dirty",ga="ng-pending",ya=t("ngModel"),ba=["$scope","$exceptionHandler","$attrs","$element","$parse","$animate","$timeout","$rootScope","$q","$interpolate",function(e,t,n,i,o,a,s,u,c,l){this.$viewValue=Number.NaN,this.$modelValue=Number.NaN,this.$$rawModelValue=void 0,this.$validators={},this.$asyncValidators={},this.$parsers=[],this.$formatters=[],this.$viewChangeListeners=[],this.$untouched=!0,this.$touched=!1,this.$pristine=!0,this.$dirty=!1,this.$valid=!0,this.$invalid=!1,this.$error={},this.$$success={},this.$pending=void 0,this.$name=l(n.name||"",!1)(e),this.$$parentForm=Vo;var f,h=o(n.ngModel),d=h.assign,$=h,v=d,y=null,b=this;this.$$setOptions=function(e){if(b.$options=e,e&&e.getterSetter){var t=o(n.ngModel+"()"),r=o(n.ngModel+"($$$p)");$=function(e){var n=h(e);return C(n)&&(n=t(e)),n},v=function(e,t){C(h(e))?r(e,{$$$p:t}):d(e,t)}}else if(!h.assign)throw ya("nonassign","Expression '{0}' is non-assignable. Element: {1}",n.ngModel,Y(i))},this.$render=p,this.$isEmpty=function(e){return m(e)||""===e||null===e||e!==e},this.$$updateEmptyClasses=function(e){b.$isEmpty(e)?(a.removeClass(i,"ng-not-empty"),a.addClass(i,"ng-empty")):(a.removeClass(i,"ng-empty"),a.addClass(i,"ng-not-empty"))};var w=0;Er({ctrl:this,$element:i,set:function(e,t){e[t]=!0},unset:function(e,t){delete e[t]},$animate:a}),this.$setPristine=function(){b.$dirty=!1,b.$pristine=!0,a.removeClass(i,ma),a.addClass(i,va)},this.$setDirty=function(){b.$dirty=!0,b.$pristine=!1,a.removeClass(i,va),a.addClass(i,ma),b.$$parentForm.$setDirty()},this.$setUntouched=function(){b.$touched=!1,b.$untouched=!0,a.setClass(i,"ng-untouched","ng-touched")},this.$setTouched=function(){b.$touched=!0,b.$untouched=!1,a.setClass(i,"ng-touched","ng-untouched")},this.$rollbackViewValue=function(){s.cancel(y),b.$viewValue=b.$$lastCommittedViewValue,b.$render()},this.$validate=function(){if(!x(b.$modelValue)||!isNaN(b.$modelValue)){var e=b.$$lastCommittedViewValue,t=b.$$rawModelValue,n=b.$valid,r=b.$modelValue,i=b.$options&&b.$options.allowInvalid;b.$$runValidators(t,e,function(e){i||n===e||(b.$modelValue=e?t:void 0,b.$modelValue!==r&&b.$$writeModelToScope())})}},this.$$runValidators=function(e,t,n){function i(e,t){a===w&&b.$setValidity(e,t)}function o(e){a===w&&n(e)}w++;var a=w;return function(){var e=b.$$parserName||"parse";return m(f)?(i(e,null),!0):(f||(r(b.$validators,function(e,t){i(t,null)}),r(b.$asyncValidators,function(e,t){i(t,null)})),i(e,f),f)}()&&function(){var n=!0;return r(b.$validators,function(r,o){var a=r(e,t);n=n&&a,i(o,a)}),!!n||(r(b.$asyncValidators,function(e,t){i(t,null)}),!1)}()?void function(){var n=[],a=!0;r(b.$asyncValidators,function(r,o){var s=r(e,t);if(!V(s))throw ya("nopromise","Expected asynchronous validator to return a promise but got '{0}' instead.",s);i(o,void 0),n.push(s.then(function(){i(o,!0)},function(){a=!1,i(o,!1)}))}),n.length?c.all(n).then(function(){o(a)},p):o(!0)}():void o(!1)},this.$commitViewValue=function(){var e=b.$viewValue;s.cancel(y),(b.$$lastCommittedViewValue!==e||""===e&&b.$$hasNativeValidators)&&(b.$$updateEmptyClasses(e),b.$$lastCommittedViewValue=e,b.$pristine&&this.$setDirty(),this.$$parseAndValidate())},this.$$parseAndValidate=function(){function t(){b.$modelValue!==o&&b.$$writeModelToScope()}var n=b.$$lastCommittedViewValue,r=n;if(f=!m(r)||void 0)for(var i=0;i<b.$parsers.length;i++)if(r=b.$parsers[i](r),m(r)){f=!1;break}x(b.$modelValue)&&isNaN(b.$modelValue)&&(b.$modelValue=$(e));var o=b.$modelValue,a=b.$options&&b.$options.allowInvalid;b.$$rawModelValue=r,a&&(b.$modelValue=r,t()),b.$$runValidators(r,b.$$lastCommittedViewValue,function(e){a||(b.$modelValue=e?r:void 0,t())})},this.$$writeModelToScope=function(){v(e,b.$modelValue),r(b.$viewChangeListeners,function(e){try{e()}catch(e){t(e)}})},this.$setViewValue=function(e,t){b.$viewValue=e,b.$options&&!b.$options.updateOnDefault||b.$$debounceViewValueCommit(t)},this.$$debounceViewValueCommit=function(t){var n,r=0,i=b.$options;i&&g(i.debounce)&&(n=i.debounce,x(n)?r=n:x(n[t])?r=n[t]:x(n.default)&&(r=n.default)),s.cancel(y),r?y=s(function(){b.$commitViewValue()},r):u.$$phase?b.$commitViewValue():e.$apply(function(){b.$commitViewValue()})},e.$watch(function(){var t=$(e);if(t!==b.$modelValue&&(b.$modelValue===b.$modelValue||t===t)){b.$modelValue=b.$$rawModelValue=t,f=void 0;for(var n=b.$formatters,r=n.length,i=t;r--;)i=n[r](i);b.$viewValue!==i&&(b.$$updateEmptyClasses(i),b.$viewValue=b.$$lastCommittedViewValue=i,b.$render(),b.$$runValidators(t,i,p))}return t})}],wa=["$rootScope",function(e){return{restrict:"A",require:["ngModel","^?form","^?ngModelOptions"],controller:ba,priority:1,compile:function(t){return t.addClass(va).addClass("ng-untouched").addClass(da),{pre:function(e,t,n,r){var i=r[0],o=r[1]||i.$$parentForm;i.$$setOptions(r[2]&&r[2].$options),o.$addControl(i),n.$observe("name",function(e){i.$name!==e&&i.$$parentForm.$$renameControl(i,e)}),e.$on("$destroy",function(){i.$$parentForm.$removeControl(i)})},post:function(t,n,r,i){var o=i[0];o.$options&&o.$options.updateOn&&n.on(o.$options.updateOn,function(e){o.$$debounceViewValueCommit(e&&e.type)}),n.on("blur",function(){o.$touched||(e.$$phase?t.$evalAsync(o.$setTouched):t.$apply(o.$setTouched))})}}}}}],xa=/(\s+|^)default(\s+|$)/,Sa=function(){return{restrict:"A",controller:["$scope","$attrs",function(e,t){var n=this;this.$options=F(e.$eval(t.ngModelOptions)),g(this.$options.updateOn)?(this.$options.updateOnDefault=!1,this.$options.updateOn=Jr(this.$options.updateOn.replace(xa,function(){return n.$options.updateOnDefault=!0," "}))):this.$options.updateOnDefault=!0}]}},Ca=ur({terminal:!0,priority:1e3}),Ea=t("ngOptions"),Aa=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,ka=["$compile","$document","$parse",function(t,i,o){function a(e,t,r){function i(e,t,n,r,i){this.selectValue=e,this.viewValue=t,this.label=n,this.group=r,this.disabled=i}function a(e){var t;if(!c&&n(e))t=e;else{t=[];for(var r in e)e.hasOwnProperty(r)&&"$"!==r.charAt(0)&&t.push(r)}return t}var s=e.match(Aa);if(!s)throw Ea("iexp","Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}",e,Y(t));var u=s[5]||s[7],c=s[6],l=/ as /.test(s[0])&&s[1],f=s[9],h=o(s[2]?s[1]:u),p=l&&o(l),d=p||h,$=f&&o(f),v=f?function(e,t){return $(r,t)}:function(e){return Je(e)},m=function(e,t){return v(e,S(e,t))},g=o(s[2]||s[1]),y=o(s[3]||""),b=o(s[4]||""),w=o(s[8]),x={},S=c?function(e,t){return x[c]=t,x[u]=e,x}:function(e){return x[u]=e,x};return{trackBy:f,getTrackByValue:m,getWatchables:o(w,function(e){var t=[];e=e||[];for(var n=a(e),i=n.length,o=0;o<i;o++){var u=e===n?o:n[o],c=e[u],l=S(c,u),f=v(c,l);if(t.push(f),s[2]||s[1]){var h=g(r,l);t.push(h)}if(s[4]){var p=b(r,l);t.push(p)}}return t}),getOptions:function(){for(var e=[],t={},n=w(r)||[],o=a(n),s=o.length,u=0;u<s;u++){var c=n===o?u:o[u],l=n[c],h=S(l,c),p=d(r,h),$=v(p,h),x=g(r,h),C=y(r,h),E=b(r,h),A=new i($,p,x,C,E);e.push(A),t[$]=A}return{items:e,selectValueMap:t,getOptionFromViewValue:function(e){return t[m(e)]},getViewValueFromOption:function(e){return f?zr.copy(e.viewValue):e.viewValue}}}}}function s(e,n,o,s){function l(e,t){var n=u.cloneNode(!1);t.appendChild(n),f(e,n)}function f(e,t){e.element=t,t.disabled=e.disabled,e.label!==t.label&&(t.label=e.label,t.textContent=e.label),e.value!==t.value&&(t.value=e.selectValue)}function h(){var e=S&&d.readValue();if(S)for(var t=S.items.length-1;t>=0;t--){var r=S.items[t];Ue(r.group?r.element.parentNode:r.element)}S=C.getOptions();var i={};if(w&&n.prepend(p),S.items.forEach(function(e){var t;g(e.group)?(t=i[e.group],t||(t=c.cloneNode(!1),E.appendChild(t),t.label=e.group,i[e.group]=t),l(e,t)):l(e,E)}),n[0].appendChild(E),$.$render(),!$.$isEmpty(e)){var o=d.readValue();(C.trackBy||v?q(e,o):e===o)||($.$setViewValue(o),$.$render())}}for(var p,d=s[0],$=s[1],v=o.multiple,m=0,y=n.children(),b=y.length;m<b;m++)if(""===y[m].value){p=y.eq(m);break}var w=!!p,x=Pr(u.cloneNode(!1));x.val("?");var S,C=a(o.ngOptions,n,e),E=i[0].createDocumentFragment(),A=function(){w||n.prepend(p),n.val(""),p.prop("selected",!0),p.attr("selected",!0)},k=function(){w||p.remove()},O=function(){n.prepend(x),n.val("?"),x.prop("selected",!0),x.attr("selected",!0)},M=function(){x.remove()};v?($.$isEmpty=function(e){return!e||0===e.length},d.writeValue=function(e){S.items.forEach(function(e){e.element.selected=!1}),e&&e.forEach(function(e){var t=S.getOptionFromViewValue(e);t&&(t.element.selected=!0)})},d.readValue=function(){var e=n.val()||[],t=[];return r(e,function(e){var n=S.selectValueMap[e];n&&!n.disabled&&t.push(S.getViewValueFromOption(n))}),t},C.trackBy&&e.$watchCollection(function(){if(Gr($.$viewValue))return $.$viewValue.map(function(e){return C.getTrackByValue(e)})},function(){$.$render()})):(d.writeValue=function(e){var t=S.getOptionFromViewValue(e);t?(n[0].value!==t.selectValue&&(M(),k(),n[0].value=t.selectValue,t.element.selected=!0),t.element.setAttribute("selected","selected")):null===e||w?(M(),A()):(k(),O())},d.readValue=function(){var e=S.selectValueMap[n.val()];return e&&!e.disabled?(k(),M(),S.getViewValueFromOption(e)):null},C.trackBy&&e.$watch(function(){return C.getTrackByValue($.$viewValue)},function(){$.$render()})),w?(p.remove(),t(p)(e),p.removeClass("ng-scope")):p=Pr(u.cloneNode(!1)),n.empty(),h(),e.$watchCollection(C.getWatchables,h)}var u=e.document.createElement("option"),c=e.document.createElement("optgroup");return{restrict:"A",terminal:!0,require:["select","ngModel"],link:{pre:function(e,t,n,r){r[0].registerOption=p},post:s}}}],Oa=["$locale","$interpolate","$log",function(e,t,n){var i=/{}/g,o=/^when(Minus)?(.+)$/;return{link:function(a,s,u){function c(e){s.text(e||"")}var l,f=u.count,h=u.$attr.when&&s.attr(u.$attr.when),d=u.offset||0,$=a.$eval(h)||{},v={},g=t.startSymbol(),y=t.endSymbol(),b=g+f+"-"+d+y,w=zr.noop;r(u,function(e,t){var n=o.exec(t);if(n){var r=(n[1]?"-":"")+Nr(n[2]);$[r]=s.attr(u.$attr[t])}}),r($,function(e,n){v[n]=t(e.replace(i,b))}),a.$watch(f,function(t){var r=parseFloat(t),i=isNaN(r);if(i||r in $||(r=e.pluralCat(r-d)),r!==l&&!(i&&x(l)&&isNaN(l))){w();var o=v[r];m(o)?(null!=t&&n.debug("ngPluralize: no rule defined for '"+r+"' in "+h),w=p,c()):w=a.$watch(o,c),l=r}})}}}],Ma=["$parse","$animate","$compile",function(e,i,o){var a=t("ngRepeat"),s=function(e,t,n,r,i,o,a){e[n]=r,i&&(e[i]=o),e.$index=t,e.$first=0===t,e.$last=t===a-1,e.$middle=!(e.$first||e.$last),e.$odd=!(e.$even=0==(1&t))},u=function(e){return e.clone[0]},c=function(e){return e.clone[e.clone.length-1]};return{restrict:"A",multiElement:!0,transclude:"element",priority:1e3,terminal:!0,$$tlb:!0,compile:function(t,l){var f=l.ngRepeat,h=o.$$createComment("end ngRepeat",f),p=f.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);if(!p)throw a("iexp","Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",f);var d=p[1],$=p[2],v=p[3],m=p[4];if(!(p=d.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/)))throw a("iidexp","'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.",d);var g=p[3]||p[1],y=p[2];if(v&&(!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(v)||/^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(v)))throw a("badident","alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.",v);var b,w,x,S,C={$id:Je};return m?b=e(m):(x=function(e,t){return Je(t)},S=function(e){return e}),function(e,t,o,l,p){b&&(w=function(t,n,r){return y&&(C[y]=t),C[g]=n,C.$index=r,b(e,C)});var d=pe();e.$watchCollection($,function(o){var l,$,m,b,C,E,A,k,O,M,T,N,V=t[0],j=pe();if(v&&(e[v]=o),n(o))O=o,k=w||x;else{k=w||S,O=[];for(var I in o)Tr.call(o,I)&&"$"!==I.charAt(0)&&O.push(I)}for(b=O.length,T=new Array(b),l=0;l<b;l++)if(C=o===O?l:O[l],E=o[C],A=k(C,E,l),d[A])M=d[A],delete d[A],j[A]=M,T[l]=M;else{if(j[A])throw r(T,function(e){e&&e.scope&&(d[e.id]=e)}),a("dupes","Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}",f,A,E);T[l]={id:A,scope:void 0,clone:void 0},j[A]=!0}for(var D in d){if(M=d[D],N=he(M.clone),i.leave(N),N[0].parentNode)for(l=0,$=N.length;l<$;l++)N[l].$$NG_REMOVED=!0;M.scope.$destroy()}for(l=0;l<b;l++)if(C=o===O?l:O[l],E=o[C],M=T[l],M.scope){m=V;do{m=m.nextSibling}while(m&&m.$$NG_REMOVED);u(M)!=m&&i.move(he(M.clone),null,V),V=c(M),s(M.scope,l,g,E,y,C,b)}else p(function(e,t){M.scope=t;var n=h.cloneNode(!1);e[e.length++]=n,i.enter(e,null,V),V=n,M.clone=e,j[M.id]=M,s(M.scope,l,g,E,y,C,b)});d=j})}}}}],Ta=["$animate",function(e){return{restrict:"A",multiElement:!0,link:function(t,n,r){t.$watch(r.ngShow,function(t){e[t?"removeClass":"addClass"](n,"ng-hide",{tempClasses:"ng-hide-animate"})})}}}],Na=["$animate",function(e){return{restrict:"A",multiElement:!0,link:function(t,n,r){t.$watch(r.ngHide,function(t){e[t?"addClass":"removeClass"](n,"ng-hide",{tempClasses:"ng-hide-animate"})})}}}],Va=ur(function(e,t,n){e.$watch(n.ngStyle,function(e,n){n&&e!==n&&r(n,function(e,n){t.css(n,"")}),e&&t.css(e)},!0)}),ja=["$animate","$compile",function(e,t){return{require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(n,i,o,a){var s=o.ngSwitch||o.on,u=[],c=[],l=[],f=[],h=function(e,t){return function(){e.splice(t,1)}};n.$watch(s,function(n){var i,o;for(i=0,o=l.length;i<o;++i)e.cancel(l[i]);for(l.length=0,i=0,o=f.length;i<o;++i){var s=he(c[i].clone);f[i].$destroy();(l[i]=e.leave(s)).then(h(l,i))}c.length=0,f.length=0,(u=a.cases["!"+n]||a.cases["?"])&&r(u,function(n){n.transclude(function(r,i){f.push(i);var o=n.element;r[r.length++]=t.$$createComment("end ngSwitchWhen");var a={clone:r};c.push(a),e.enter(r,o.parent(),o)})})})}}}],Ia=ur({transclude:"element",priority:1200,require:"^ngSwitch",multiElement:!0,link:function(e,t,n,r,i){r.cases["!"+n.ngSwitchWhen]=r.cases["!"+n.ngSwitchWhen]||[],r.cases["!"+n.ngSwitchWhen].push({transclude:i,element:t})}}),Da=ur({transclude:"element",priority:1200,require:"^ngSwitch",multiElement:!0,link:function(e,t,n,r,i){r.cases["?"]=r.cases["?"]||[],r.cases["?"].push({transclude:i,element:t})}}),Pa=t("ngTransclude"),_a=ur({restrict:"EAC",link:function(e,t,n,r,i){function o(e){e.length&&(t.empty(),t.append(e))}if(n.ngTransclude===n.$attr.ngTransclude&&(n.ngTransclude=""),!i)throw Pa("orphan","Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}",Y(t));i(o,null,n.ngTransclude||n.ngTranscludeSlot)}}),Ra=["$templateCache",function(e){return{restrict:"E",terminal:!0,compile:function(t,n){if("text/ng-template"==n.type){var r=n.id,i=t[0].text;e.put(r,i)}}}}],Fa={$setViewValue:p,$render:p},qa=["$element","$scope",function(t,n){var r=this,i=new Ye;r.ngModelCtrl=Fa,
r.unknownOption=Pr(e.document.createElement("option")),r.renderUnknownOption=function(e){var n="? "+Je(e)+" ?";r.unknownOption.val(n),t.prepend(r.unknownOption),t.val(n)},n.$on("$destroy",function(){r.renderUnknownOption=p}),r.removeUnknownOption=function(){r.unknownOption.parent()&&r.unknownOption.remove()},r.readValue=function(){return r.removeUnknownOption(),t.val()},r.writeValue=function(e){r.hasOption(e)?(r.removeUnknownOption(),t.val(e),""===e&&r.emptyOption.prop("selected",!0)):null==e&&r.emptyOption?(r.removeUnknownOption(),t.val("")):r.renderUnknownOption(e)},r.addOption=function(e,t){if(t[0].nodeType!==oi){le(e,'"option value"'),""===e&&(r.emptyOption=t);var n=i.get(e)||0;i.put(e,n+1),r.ngModelCtrl.$render(),kr(t)}},r.removeOption=function(e){var t=i.get(e);t&&(1===t?(i.remove(e),""===e&&(r.emptyOption=void 0)):i.put(e,t-1))},r.hasOption=function(e){return!!i.get(e)},r.registerOption=function(e,t,n,i,o){if(i){var a;n.$observe("value",function(e){g(a)&&r.removeOption(a),a=e,r.addOption(e,t)})}else o?e.$watch(o,function(e,i){n.$set("value",e),i!==e&&r.removeOption(i),r.addOption(e,t)}):r.addOption(n.value,t);t.on("$destroy",function(){r.removeOption(n.value),r.ngModelCtrl.$render()})}}],Ua=function(){function e(e,t,n,i){var o=i[1];if(o){var a=i[0];if(a.ngModelCtrl=o,t.on("change",function(){e.$apply(function(){o.$setViewValue(a.readValue())})}),n.multiple){a.readValue=function(){var e=[];return r(t.find("option"),function(t){t.selected&&e.push(t.value)}),e},a.writeValue=function(e){var n=new Ye(e);r(t.find("option"),function(e){e.selected=g(n.get(e.value))})};var s,u=NaN;e.$watch(function(){u!==o.$viewValue||q(s,o.$viewValue)||(s=$e(o.$viewValue),o.$render()),u=o.$viewValue}),o.$isEmpty=function(e){return!e||0===e.length}}}}function t(e,t,n,r){var i=r[1];if(i){var o=r[0];i.$render=function(){o.writeValue(i.$viewValue)}}}return{restrict:"E",require:["select","?ngModel"],controller:qa,priority:1,link:{pre:e,post:t}}},La=["$interpolate",function(e){return{restrict:"E",priority:100,compile:function(t,n){if(g(n.value))var r=e(n.value,!0);else{var i=e(t.text(),!0);i||n.$set("value",t.text())}return function(e,t,n){var o=t.parent(),a=o.data("$selectController")||o.parent().data("$selectController");a&&a.registerOption(e,t,n,r,i)}}}}],Ha=$({restrict:"E",terminal:!1}),Ba=function(){return{restrict:"A",require:"?ngModel",link:function(e,t,n,r){r&&(n.required=!0,r.$validators.required=function(e,t){return!n.required||!r.$isEmpty(t)},n.$observe("required",function(){r.$validate()}))}}},za=function(){return{restrict:"A",require:"?ngModel",link:function(e,n,r,i){if(i){var o,a=r.ngPattern||r.pattern;r.$observe("pattern",function(e){if(w(e)&&e.length>0&&(e=new RegExp("^"+e+"$")),e&&!e.test)throw t("ngPattern")("noregexp","Expected {0} to be a RegExp but was {1}. Element: {2}",a,e,Y(n));o=e||void 0,i.$validate()}),i.$validators.pattern=function(e,t){return i.$isEmpty(t)||m(o)||o.test(t)}}}}},Wa=function(){return{restrict:"A",require:"?ngModel",link:function(e,t,n,r){if(r){var i=-1;n.$observe("maxlength",function(e){var t=f(e);i=isNaN(t)?-1:t,r.$validate()}),r.$validators.maxlength=function(e,t){return i<0||r.$isEmpty(t)||t.length<=i}}}}},Ga=function(){return{restrict:"A",require:"?ngModel",link:function(e,t,n,r){if(r){var i=0;n.$observe("minlength",function(e){i=f(e)||0,r.$validate()}),r.$validators.minlength=function(e,t){return r.$isEmpty(t)||t.length>=i}}}}};if(e.angular.bootstrap)return void(e.console&&console.log("WARNING: Tried to load angular more than once."));!function(){var t;if(!ni){var n=Xr();_r=m(n)?e.jQuery:n?e[n]:void 0,_r&&_r.fn.on?(Pr=_r,c(_r.fn,{scope:Si.scope,isolateScope:Si.isolateScope,controller:Si.controller,injector:Si.injector,inheritedData:Si.inheritedData}),t=_r.cleanData,_r.cleanData=function(e){for(var n,r,i=0;null!=(r=e[i]);i++)(n=_r._data(r,"events"))&&n.$destroy&&_r(r).triggerHandler("$destroy");t(e)}):Pr=ke,zr.element=Pr,ni=!0}}(),function(n){c(n,{bootstrap:ie,copy:F,extend:c,merge:l,equals:q,element:Pr,forEach:r,injector:tt,noop:p,bind:H,toJson:z,fromJson:W,identity:d,isUndefined:m,isDefined:g,isString:w,isFunction:C,isObject:y,isNumber:x,isElement:D,isArray:Gr,version:ui,isDate:S,lowercase:Nr,uppercase:Vr,callbacks:{counter:0},getTestability:ae,$$minErr:t,$$csp:Kr,reloadWithDebugInfo:oe}),(Rr=de(e))("ng",["ngLocale"],["$provide",function(e){e.provider({$$sanitizeUri:Sn}),e.provider("$compile",ht).directive({a:To,input:Jo,textarea:Jo,form:Do,script:Ra,select:Ua,style:Ha,option:La,ngBind:Xo,ngBindHtml:ea,ngBindTemplate:Qo,ngClass:na,ngClassEven:ia,ngClassOdd:ra,ngCloak:oa,ngController:aa,ngForm:Po,ngHide:Na,ngIf:ca,ngInclude:la,ngInit:ha,ngNonBindable:Ca,ngPluralize:Oa,ngRepeat:Ma,ngShow:Ta,ngStyle:Va,ngSwitch:ja,ngSwitchWhen:Ia,ngSwitchDefault:Da,ngOptions:ka,ngTransclude:_a,ngModel:wa,ngList:pa,ngChange:ta,pattern:za,ngPattern:za,required:Ba,ngRequired:Ba,minlength:Ga,ngMinlength:Ga,maxlength:Wa,ngMaxlength:Wa,ngValue:Ko,ngModelOptions:Sa}).directive({ngInclude:fa}).directive(No).directive(sa),e.provider({$anchorScroll:nt,$animate:Ri,$animateCss:Ui,$$animateJs:Pi,$$animateQueue:_i,$$AnimateRunner:qi,$$animateAsyncRun:Fi,$browser:ut,$cacheFactory:ct,$controller:gt,$document:yt,$exceptionHandler:bt,$filter:_n,$$forceReflow:Gi,$interpolate:It,$interval:Dt,$http:Tt,$httpParamSerializer:xt,$httpParamSerializerJQLike:St,$httpBackend:Vt,$xhrFactory:Nt,$location:Yt,$log:Kt,$parse:mn,$rootScope:xn,$q:gn,$$q:yn,$sce:kn,$sceDelegate:An,$sniffer:On,$templateCache:lt,$templateRequest:Mn,$$testability:Tn,$timeout:Nn,$window:In,$$rAF:wn,$$jqLite:Ze,$$HashMap:ki,$$cookieReader:Pn})}])}(zr),zr.module("ngLocale",[],["$provide",function(e){function t(e){e+="";var t=e.indexOf(".");return-1==t?0:e.length-t-1}function n(e,n){var r=n;void 0===r&&(r=Math.min(t(e),3));var i=Math.pow(10,r);return{v:r,f:(e*i|0)%i}}var r={ZERO:"zero",ONE:"one",TWO:"two",FEW:"few",MANY:"many",OTHER:"other"};e.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],ERANAMES:["Before Christ","Anno Domini"],ERAS:["BC","AD"],FIRSTDAYOFWEEK:6,MONTH:["January","February","March","April","May","June","July","August","September","October","November","December"],SHORTDAY:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],SHORTMONTH:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],STANDALONEMONTH:["January","February","March","April","May","June","July","August","September","October","November","December"],WEEKENDRANGE:[5,6],fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",medium:"MMM d, y h:mm:ss a",mediumDate:"MMM d, y",mediumTime:"h:mm:ss a",short:"M/d/yy h:mm a",shortDate:"M/d/yy",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"$",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-¤",negSuf:"",posPre:"¤",posSuf:""}]},id:"en-us",localeID:"en_US",pluralCat:function(e,t){var i=0|e,o=n(e,t);return 1==i&&0==o.v?r.ONE:r.OTHER}})}]),Pr(e.document).ready(function(){re(e.document,ie)})}(window),!window.angular.$$csp().noInlineStyle&&window.angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>');
},{}],50:[function(require,module,exports){
require("./angular"),module.exports=angular;
},{"./angular":49}],51:[function(require,module,exports){
!function(e,t){if("function"==typeof define&&define.amd)define(["exports"],t);else if("object"==typeof exports&&"string"!=typeof exports.nodeName)t(exports);else{var n={};t(n),e.AnsiUp=n.default}}(this,function(e){"use strict";function t(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var i=e.raw[0],s=/^\s+|\s+\n|\s*#[\s\S]*?\n|\n/gm,r=i.replace(s,"");return new RegExp(r)}function n(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var i=e.raw[0],s=/^\s+|\s+\n|\s*#[\s\S]*?\n|\n/gm,r=i.replace(s,"");return new RegExp(r,"g")}var i,s=this&&this.__makeTemplateObject||function(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e};!function(e){e[e.EOS=0]="EOS",e[e.Text=1]="Text",e[e.Incomplete=2]="Incomplete",e[e.ESC=3]="ESC",e[e.Unknown=4]="Unknown",e[e.SGR=5]="SGR",e[e.OSCURL=6]="OSCURL"}(i||(i={}));var r=function(){function e(){this.VERSION="4.0.3",this.setup_palettes(),this._use_classes=!1,this._escape_for_html=!0,this.bold=!1,this.fg=this.bg=null,this._buffer="",this._url_whitelist={http:1,https:1}}return Object.defineProperty(e.prototype,"use_classes",{get:function(){return this._use_classes},set:function(e){this._use_classes=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"escape_for_html",{get:function(){return this._escape_for_html},set:function(e){this._escape_for_html=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"url_whitelist",{get:function(){return this._url_whitelist},set:function(e){this._url_whitelist=e},enumerable:!0,configurable:!0}),e.prototype.setup_palettes=function(){var e=this;this.ansi_colors=[[{rgb:[0,0,0],class_name:"ansi-black"},{rgb:[187,0,0],class_name:"ansi-red"},{rgb:[0,187,0],class_name:"ansi-green"},{rgb:[187,187,0],class_name:"ansi-yellow"},{rgb:[0,0,187],class_name:"ansi-blue"},{rgb:[187,0,187],class_name:"ansi-magenta"},{rgb:[0,187,187],class_name:"ansi-cyan"},{rgb:[255,255,255],class_name:"ansi-white"}],[{rgb:[85,85,85],class_name:"ansi-bright-black"},{rgb:[255,85,85],class_name:"ansi-bright-red"},{rgb:[0,255,0],class_name:"ansi-bright-green"},{rgb:[255,255,85],class_name:"ansi-bright-yellow"},{rgb:[85,85,255],class_name:"ansi-bright-blue"},{rgb:[255,85,255],class_name:"ansi-bright-magenta"},{rgb:[85,255,255],class_name:"ansi-bright-cyan"},{rgb:[255,255,255],class_name:"ansi-bright-white"}]],this.palette_256=[],this.ansi_colors.forEach(function(t){t.forEach(function(t){e.palette_256.push(t)})});for(var t=[0,95,135,175,215,255],n=0;n<6;++n)for(var i=0;i<6;++i)for(var s=0;s<6;++s){var r={rgb:[t[n],t[i],t[s]],class_name:"truecolor"};this.palette_256.push(r)}for(var a=8,l=0;l<24;++l,a+=10){var f={rgb:[a,a,a],class_name:"truecolor"};this.palette_256.push(f)}},e.prototype.escape_txt_for_html=function(e){return e.replace(/[&<>]/gm,function(e){return"&"===e?"&amp;":"<"===e?"&lt;":">"===e?"&gt;":void 0})},e.prototype.append_buffer=function(e){var t=this._buffer+e;this._buffer=t},e.prototype.get_next_packet=function(){var e={kind:i.EOS,text:"",url:""},r=this._buffer.length;if(0==r)return e;var a=this._buffer.indexOf("");if(-1==a)return e.kind=i.Text,e.text=this._buffer,this._buffer="",e;if(a>0)return e.kind=i.Text,e.text=this._buffer.slice(0,a),this._buffer=this._buffer.slice(a),e;if(0==a){if(1==r)return e.kind=i.Incomplete,e;var l=this._buffer.charAt(1);if("["!=l&&"]"!=l)return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;if("["==l){this._csi_regex||(this._csi_regex=t(s(["\n                        ^                           # beginning of line\n                                                    #\n                                                    # First attempt\n                        (?:                         # legal sequence\n                          [                      # CSI\n                          ([<-?]?)              # private-mode char\n                          ([d;]*)                    # any digits or semicolons\n                          ([ -/]?               # an intermediate modifier\n                          [@-~])                # the command\n                        )\n                        |                           # alternate (second attempt)\n                        (?:                         # illegal sequence\n                          [                      # CSI\n                          [ -~]*                # anything legal\n                          ([\0-:])              # anything illegal\n                        )\n                    "],["\n                        ^                           # beginning of line\n                                                    #\n                                                    # First attempt\n                        (?:                         # legal sequence\n                          \\x1b\\[                      # CSI\n                          ([\\x3c-\\x3f]?)              # private-mode char\n                          ([\\d;]*)                    # any digits or semicolons\n                          ([\\x20-\\x2f]?               # an intermediate modifier\n                          [\\x40-\\x7e])                # the command\n                        )\n                        |                           # alternate (second attempt)\n                        (?:                         # illegal sequence\n                          \\x1b\\[                      # CSI\n                          [\\x20-\\x7e]*                # anything legal\n                          ([\\x00-\\x1f:])              # anything illegal\n                        )\n                    "])));var f=this._buffer.match(this._csi_regex);if(null===f)return e.kind=i.Incomplete,e;if(f[4])return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;""!=f[1]||"m"!=f[3]?e.kind=i.Unknown:e.kind=i.SGR,e.text=f[2];var h=f[0].length;return this._buffer=this._buffer.slice(h),e}if("]"==l){if(r<4)return e.kind=i.Incomplete,e;if("8"!=this._buffer.charAt(2)||";"!=this._buffer.charAt(3))return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;this._osc_st||(this._osc_st=n(s(["\n                        (?:                         # legal sequence\n                          (\\)                    # ESC                           |                           # alternate\n                          ()                      # BEL (what xterm did)\n                        )\n                        |                           # alternate (second attempt)\n                        (                           # illegal sequence\n                          [\0-]                 # anything illegal\n                          |                           # alternate\n                          [\b-]                 # anything illegal\n                          |                           # alternate\n                          [-]                 # anything illegal\n                        )\n                    "],["\n                        (?:                         # legal sequence\n                          (\\x1b\\\\)                    # ESC \\\n                          |                           # alternate\n                          (\\x07)                      # BEL (what xterm did)\n                        )\n                        |                           # alternate (second attempt)\n                        (                           # illegal sequence\n                          [\\x00-\\x06]                 # anything illegal\n                          |                           # alternate\n                          [\\x08-\\x1a]                 # anything illegal\n                          |                           # alternate\n                          [\\x1c-\\x1f]                 # anything illegal\n                        )\n                    "]))),this._osc_st.lastIndex=0;var o=this._osc_st.exec(this._buffer);if(null===o)return e.kind=i.Incomplete,e;if(o[3])return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;var c=this._osc_st.exec(this._buffer);if(null===c)return e.kind=i.Incomplete,e;if(c[3])return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;this._osc_regex||(this._osc_regex=t(s(["\n                        ^                           # beginning of line\n                                                    #\n                        ]8;                    # OSC Hyperlink\n                        [ -:<-~]*       # params (excluding ;)\n                        ;                           # end of params\n                        ([!-~]{0,512})        # URL capture\n                        (?:                         # ST\n                          (?:\\)                  # ESC                           |                           # alternate\n                          (?:)                    # BEL (what xterm did)\n                        )\n                        ([!-~]+)              # TEXT capture\n                        ]8;;                   # OSC Hyperlink End\n                        (?:                         # ST\n                          (?:\\)                  # ESC                           |                           # alternate\n                          (?:)                    # BEL (what xterm did)\n                        )\n                    "],["\n                        ^                           # beginning of line\n                                                    #\n                        \\x1b\\]8;                    # OSC Hyperlink\n                        [\\x20-\\x3a\\x3c-\\x7e]*       # params (excluding ;)\n                        ;                           # end of params\n                        ([\\x21-\\x7e]{0,512})        # URL capture\n                        (?:                         # ST\n                          (?:\\x1b\\\\)                  # ESC \\\n                          |                           # alternate\n                          (?:\\x07)                    # BEL (what xterm did)\n                        )\n                        ([\\x21-\\x7e]+)              # TEXT capture\n                        \\x1b\\]8;;                   # OSC Hyperlink End\n                        (?:                         # ST\n                          (?:\\x1b\\\\)                  # ESC \\\n                          |                           # alternate\n                          (?:\\x07)                    # BEL (what xterm did)\n                        )\n                    "])));var f=this._buffer.match(this._osc_regex);if(null===f)return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;e.kind=i.OSCURL,e.url=f[1],e.text=f[2];var h=f[0].length;return this._buffer=this._buffer.slice(h),e}}},e.prototype.ansi_to_html=function(e){this.append_buffer(e);for(var t=[];;){var n=this.get_next_packet();if(n.kind==i.EOS||n.kind==i.Incomplete)break;n.kind!=i.ESC&&n.kind!=i.Unknown&&(n.kind==i.Text?t.push(this.transform_to_html(this.with_state(n))):n.kind==i.SGR?this.process_ansi(n):n.kind==i.OSCURL&&t.push(this.process_hyperlink(n)))}return t.join("")},e.prototype.with_state=function(e){return{bold:this.bold,fg:this.fg,bg:this.bg,text:e.text}},e.prototype.process_ansi=function(e){for(var t=e.text.split(";");t.length>0;){var n=t.shift(),i=parseInt(n,10);if(isNaN(i)||0===i)this.fg=this.bg=null,this.bold=!1;else if(1===i)this.bold=!0;else if(22===i)this.bold=!1;else if(39===i)this.fg=null;else if(49===i)this.bg=null;else if(i>=30&&i<38)this.fg=this.ansi_colors[0][i-30];else if(i>=40&&i<48)this.bg=this.ansi_colors[0][i-40];else if(i>=90&&i<98)this.fg=this.ansi_colors[1][i-90];else if(i>=100&&i<108)this.bg=this.ansi_colors[1][i-100];else if((38===i||48===i)&&t.length>0){var s=38===i,r=t.shift();if("5"===r&&t.length>0){var a=parseInt(t.shift(),10);a>=0&&a<=255&&(s?this.fg=this.palette_256[a]:this.bg=this.palette_256[a])}if("2"===r&&t.length>2){var l=parseInt(t.shift(),10),f=parseInt(t.shift(),10),h=parseInt(t.shift(),10);if(l>=0&&l<=255&&f>=0&&f<=255&&h>=0&&h<=255){var o={rgb:[l,f,h],class_name:"truecolor"};s?this.fg=o:this.bg=o}}}}},e.prototype.transform_to_html=function(e){var t=e.text;if(0===t.length)return t;if(this._escape_for_html&&(t=this.escape_txt_for_html(t)),!e.bold&&null===e.fg&&null===e.bg)return t;var n=[],i=[],s=e.fg,r=e.bg;e.bold&&n.push("font-weight:bold"),this._use_classes?(s&&("truecolor"!==s.class_name?i.push(s.class_name+"-fg"):n.push("color:rgb("+s.rgb.join(",")+")")),r&&("truecolor"!==r.class_name?i.push(r.class_name+"-bg"):n.push("background-color:rgb("+r.rgb.join(",")+")"))):(s&&n.push("color:rgb("+s.rgb.join(",")+")"),r&&n.push("background-color:rgb("+r.rgb+")"));var a="",l="";return i.length&&(a=' class="'+i.join(" ")+'"'),n.length&&(l=' style="'+n.join(";")+'"'),"<span"+l+a+">"+t+"</span>"},e.prototype.process_hyperlink=function(e){var t=e.url.split(":");return t.length<1?"":this._url_whitelist[t[0]]?'<a href="'+this.escape_txt_for_html(e.url)+'">'+this.escape_txt_for_html(e.text)+"</a>":""},e}();Object.defineProperty(e,"__esModule",{value:!0}),e.default=r});
},{}],52:[function(require,module,exports){
module.exports=function(r,e,n){var t=r.byteLength;if(e=e||0,n=n||t,r.slice)return r.slice(e,n);if(e<0&&(e+=t),n<0&&(n+=t),n>t&&(n=t),e>=t||e>=n||0===t)return new ArrayBuffer(0);for(var f=new Uint8Array(r),i=new Uint8Array(n-e),u=e,a=0;u<n;u++,a++)i[a]=f[u];return i.buffer};
},{}],53:[function(require,module,exports){
function Backoff(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}module.exports=Backoff,Backoff.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var o=Math.random(),i=Math.floor(o*this.jitter*t);t=0==(1&Math.floor(10*o))?t-i:t+i}return 0|Math.min(t,this.max)},Backoff.prototype.reset=function(){this.attempts=0},Backoff.prototype.setMin=function(t){this.ms=t},Backoff.prototype.setMax=function(t){this.max=t},Backoff.prototype.setJitter=function(t){this.jitter=t};
},{}],54:[function(require,module,exports){
!function(){"use strict";for(var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e=new Uint8Array(256),t=0;t<r.length;t++)e[r.charCodeAt(t)]=t;exports.encode=function(e){var t,n=new Uint8Array(e),o=n.length,a="";for(t=0;t<o;t+=3)a+=r[n[t]>>2],a+=r[(3&n[t])<<4|n[t+1]>>4],a+=r[(15&n[t+1])<<2|n[t+2]>>6],a+=r[63&n[t+2]];return o%3==2?a=a.substring(0,a.length-1)+"=":o%3==1&&(a=a.substring(0,a.length-2)+"=="),a},exports.decode=function(r){var t,n,o,a,h,c=.75*r.length,g=r.length,i=0;"="===r[r.length-1]&&(c--,"="===r[r.length-2]&&c--);var u=new ArrayBuffer(c),A=new Uint8Array(u);for(t=0;t<g;t+=4)n=e[r.charCodeAt(t)],o=e[r.charCodeAt(t+1)],a=e[r.charCodeAt(t+2)],h=e[r.charCodeAt(t+3)],A[i++]=n<<2|o>>4,A[i++]=(15&o)<<4|a>>2,A[i++]=(3&a)<<6|63&h;return u}}();
},{}],55:[function(require,module,exports){
"use strict";function getLens(o){var r=o.length;if(r%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var e=o.indexOf("=");return-1===e&&(e=r),[e,e===r?0:4-e%4]}function byteLength(o){var r=getLens(o),e=r[0],t=r[1];return 3*(e+t)/4-t}function _byteLength(o,r,e){return 3*(r+e)/4-e}function toByteArray(o){for(var r,e=getLens(o),t=e[0],n=e[1],u=new Arr(_byteLength(o,t,n)),p=0,a=n>0?t-4:t,h=0;h<a;h+=4)r=revLookup[o.charCodeAt(h)]<<18|revLookup[o.charCodeAt(h+1)]<<12|revLookup[o.charCodeAt(h+2)]<<6|revLookup[o.charCodeAt(h+3)],u[p++]=r>>16&255,u[p++]=r>>8&255,u[p++]=255&r;return 2===n&&(r=revLookup[o.charCodeAt(h)]<<2|revLookup[o.charCodeAt(h+1)]>>4,u[p++]=255&r),1===n&&(r=revLookup[o.charCodeAt(h)]<<10|revLookup[o.charCodeAt(h+1)]<<4|revLookup[o.charCodeAt(h+2)]>>2,u[p++]=r>>8&255,u[p++]=255&r),u}function tripletToBase64(o){return lookup[o>>18&63]+lookup[o>>12&63]+lookup[o>>6&63]+lookup[63&o]}function encodeChunk(o,r,e){for(var t,n=[],u=r;u<e;u+=3)t=(o[u]<<16&16711680)+(o[u+1]<<8&65280)+(255&o[u+2]),n.push(tripletToBase64(t));return n.join("")}function fromByteArray(o){for(var r,e=o.length,t=e%3,n=[],u=0,p=e-t;u<p;u+=16383)n.push(encodeChunk(o,u,u+16383>p?p:u+16383));return 1===t?(r=o[e-1],n.push(lookup[r>>2]+lookup[r<<4&63]+"==")):2===t&&(r=(o[e-2]<<8)+o[e-1],n.push(lookup[r>>10]+lookup[r>>4&63]+lookup[r<<2&63]+"=")),n.join("")}exports.byteLength=byteLength,exports.toByteArray=toByteArray,exports.fromByteArray=fromByteArray;for(var lookup=[],revLookup=[],Arr="undefined"!=typeof Uint8Array?Uint8Array:Array,code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,len=code.length;i<len;++i)lookup[i]=code[i],revLookup[code.charCodeAt(i)]=i;revLookup["-".charCodeAt(0)]=62,revLookup["_".charCodeAt(0)]=63;
},{}],56:[function(require,module,exports){
function mapArrayBufferViews(r){return r.map(function(r){if(r.buffer instanceof ArrayBuffer){var e=r.buffer;if(r.byteLength!==e.byteLength){var o=new Uint8Array(r.byteLength);o.set(new Uint8Array(e,r.byteOffset,r.byteLength)),e=o.buffer}return e}return r})}function BlobBuilderConstructor(r,e){e=e||{};var o=new BlobBuilder;return mapArrayBufferViews(r).forEach(function(r){o.append(r)}),e.type?o.getBlob(e.type):o.getBlob()}function BlobConstructor(r,e){return new Blob(mapArrayBufferViews(r),e||{})}var BlobBuilder=void 0!==BlobBuilder?BlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder&&MozBlobBuilder,blobSupported=function(){try{return 2===new Blob(["hi"]).size}catch(r){return!1}}(),blobSupportsArrayBufferView=blobSupported&&function(){try{return 2===new Blob([new Uint8Array([1,2])]).size}catch(r){return!1}}(),blobBuilderSupported=BlobBuilder&&BlobBuilder.prototype.append&&BlobBuilder.prototype.getBlob;"undefined"!=typeof Blob&&(BlobBuilderConstructor.prototype=Blob.prototype,BlobConstructor.prototype=Blob.prototype),module.exports=function(){return blobSupported?blobSupportsArrayBufferView?Blob:BlobConstructor:blobBuilderSupported?BlobBuilderConstructor:void 0}();
},{}],57:[function(require,module,exports){

},{}],58:[function(require,module,exports){
(function (Buffer){
"use strict";function typedArraySupport(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()}catch(e){return!1}}function createBuffer(e){if(e>K_MAX_LENGTH)throw new RangeError('The value "'+e+'" is invalid for option "size"');var t=new Uint8Array(e);return t.__proto__=Buffer.prototype,t}function Buffer(e,t,r){if("number"==typeof e){if("string"==typeof t)throw new TypeError('The "string" argument must be of type string. Received type number');return allocUnsafe(e)}return from(e,t,r)}function from(e,t,r){if("string"==typeof e)return fromString(e,t);if(ArrayBuffer.isView(e))return fromArrayLike(e);if(null==e)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(isInstance(e,ArrayBuffer)||e&&isInstance(e.buffer,ArrayBuffer))return fromArrayBuffer(e,t,r);if("number"==typeof e)throw new TypeError('The "value" argument must not be of type number. Received type number');var n=e.valueOf&&e.valueOf();if(null!=n&&n!==e)return Buffer.from(n,t,r);var f=fromObject(e);if(f)return f;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return Buffer.from(e[Symbol.toPrimitive]("string"),t,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function assertSize(e){if("number"!=typeof e)throw new TypeError('"size" argument must be of type number');if(e<0)throw new RangeError('The value "'+e+'" is invalid for option "size"')}function alloc(e,t,r){return assertSize(e),e<=0?createBuffer(e):void 0!==t?"string"==typeof r?createBuffer(e).fill(t,r):createBuffer(e).fill(t):createBuffer(e)}function allocUnsafe(e){return assertSize(e),createBuffer(e<0?0:0|checked(e))}function fromString(e,t){if("string"==typeof t&&""!==t||(t="utf8"),!Buffer.isEncoding(t))throw new TypeError("Unknown encoding: "+t);var r=0|byteLength(e,t),n=createBuffer(r),f=n.write(e,t);return f!==r&&(n=n.slice(0,f)),n}function fromArrayLike(e){for(var t=e.length<0?0:0|checked(e.length),r=createBuffer(t),n=0;n<t;n+=1)r[n]=255&e[n];return r}function fromArrayBuffer(e,t,r){if(t<0||e.byteLength<t)throw new RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw new RangeError('"length" is outside of buffer bounds');var n;return n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),n.__proto__=Buffer.prototype,n}function fromObject(e){if(Buffer.isBuffer(e)){var t=0|checked(e.length),r=createBuffer(t);return 0===r.length?r:(e.copy(r,0,0,t),r)}return void 0!==e.length?"number"!=typeof e.length||numberIsNaN(e.length)?createBuffer(0):fromArrayLike(e):"Buffer"===e.type&&Array.isArray(e.data)?fromArrayLike(e.data):void 0}function checked(e){if(e>=K_MAX_LENGTH)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+K_MAX_LENGTH.toString(16)+" bytes");return 0|e}function SlowBuffer(e){return+e!=e&&(e=0),Buffer.alloc(+e)}function byteLength(e,t){if(Buffer.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||isInstance(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);var r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;for(var f=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return utf8ToBytes(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return base64ToBytes(e).length;default:if(f)return n?-1:utf8ToBytes(e).length;t=(""+t).toLowerCase(),f=!0}}function slowToString(e,t,r){var n=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if(r>>>=0,t>>>=0,r<=t)return"";for(e||(e="utf8");;)switch(e){case"hex":return hexSlice(this,t,r);case"utf8":case"utf-8":return utf8Slice(this,t,r);case"ascii":return asciiSlice(this,t,r);case"latin1":case"binary":return latin1Slice(this,t,r);case"base64":return base64Slice(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,t,r);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}function swap(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}function bidirectionalIndexOf(e,t,r,n,f){if(0===e.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,numberIsNaN(r)&&(r=f?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(f)return-1;r=e.length-1}else if(r<0){if(!f)return-1;r=0}if("string"==typeof t&&(t=Buffer.from(t,n)),Buffer.isBuffer(t))return 0===t.length?-1:arrayIndexOf(e,t,r,n,f);if("number"==typeof t)return t&=255,"function"==typeof Uint8Array.prototype.indexOf?f?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):arrayIndexOf(e,[t],r,n,f);throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(e,t,r,n,f){function i(e,t){return 1===o?e[t]:e.readUInt16BE(t*o)}var o=1,u=e.length,s=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return-1;o=2,u/=2,s/=2,r/=2}var a;if(f){var h=-1;for(a=r;a<u;a++)if(i(e,a)===i(t,-1===h?0:a-h)){if(-1===h&&(h=a),a-h+1===s)return h*o}else-1!==h&&(a-=a-h),h=-1}else for(r+s>u&&(r=u-s),a=r;a>=0;a--){for(var c=!0,l=0;l<s;l++)if(i(e,a+l)!==i(t,l)){c=!1;break}if(c)return a}return-1}function hexWrite(e,t,r,n){r=Number(r)||0;var f=e.length-r;n?(n=Number(n))>f&&(n=f):n=f;var i=t.length;n>i/2&&(n=i/2);for(var o=0;o<n;++o){var u=parseInt(t.substr(2*o,2),16);if(numberIsNaN(u))return o;e[r+o]=u}return o}function utf8Write(e,t,r,n){return blitBuffer(utf8ToBytes(t,e.length-r),e,r,n)}function asciiWrite(e,t,r,n){return blitBuffer(asciiToBytes(t),e,r,n)}function latin1Write(e,t,r,n){return asciiWrite(e,t,r,n)}function base64Write(e,t,r,n){return blitBuffer(base64ToBytes(t),e,r,n)}function ucs2Write(e,t,r,n){return blitBuffer(utf16leToBytes(t,e.length-r),e,r,n)}function base64Slice(e,t,r){return 0===t&&r===e.length?base64.fromByteArray(e):base64.fromByteArray(e.slice(t,r))}function utf8Slice(e,t,r){r=Math.min(e.length,r);for(var n=[],f=t;f<r;){var i=e[f],o=null,u=i>239?4:i>223?3:i>191?2:1;if(f+u<=r){var s,a,h,c;switch(u){case 1:i<128&&(o=i);break;case 2:s=e[f+1],128==(192&s)&&(c=(31&i)<<6|63&s)>127&&(o=c);break;case 3:s=e[f+1],a=e[f+2],128==(192&s)&&128==(192&a)&&(c=(15&i)<<12|(63&s)<<6|63&a)>2047&&(c<55296||c>57343)&&(o=c);break;case 4:s=e[f+1],a=e[f+2],h=e[f+3],128==(192&s)&&128==(192&a)&&128==(192&h)&&(c=(15&i)<<18|(63&s)<<12|(63&a)<<6|63&h)>65535&&c<1114112&&(o=c)}}null===o?(o=65533,u=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),f+=u}return decodeCodePointsArray(n)}function decodeCodePointsArray(e){var t=e.length;if(t<=MAX_ARGUMENTS_LENGTH)return String.fromCharCode.apply(String,e);for(var r="",n=0;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=MAX_ARGUMENTS_LENGTH));return r}function asciiSlice(e,t,r){var n="";r=Math.min(e.length,r);for(var f=t;f<r;++f)n+=String.fromCharCode(127&e[f]);return n}function latin1Slice(e,t,r){var n="";r=Math.min(e.length,r);for(var f=t;f<r;++f)n+=String.fromCharCode(e[f]);return n}function hexSlice(e,t,r){var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var f="",i=t;i<r;++i)f+=toHex(e[i]);return f}function utf16leSlice(e,t,r){for(var n=e.slice(t,r),f="",i=0;i<n.length;i+=2)f+=String.fromCharCode(n[i]+256*n[i+1]);return f}function checkOffset(e,t,r){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function checkInt(e,t,r,n,f,i){if(!Buffer.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>f||t<i)throw new RangeError('"value" argument is out of bounds');if(r+n>e.length)throw new RangeError("Index out of range")}function checkIEEE754(e,t,r,n,f,i){if(r+n>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function writeFloat(e,t,r,n,f){return t=+t,r>>>=0,f||checkIEEE754(e,t,r,4,3.4028234663852886e38,-3.4028234663852886e38),ieee754.write(e,t,r,n,23,4),r+4}function writeDouble(e,t,r,n,f){return t=+t,r>>>=0,f||checkIEEE754(e,t,r,8,1.7976931348623157e308,-1.7976931348623157e308),ieee754.write(e,t,r,n,52,8),r+8}function base64clean(e){if(e=e.split("=")[0],e=e.trim().replace(INVALID_BASE64_RE,""),e.length<2)return"";for(;e.length%4!=0;)e+="=";return e}function toHex(e){return e<16?"0"+e.toString(16):e.toString(16)}function utf8ToBytes(e,t){t=t||1/0;for(var r,n=e.length,f=null,i=[],o=0;o<n;++o){if((r=e.charCodeAt(o))>55295&&r<57344){if(!f){if(r>56319){(t-=3)>-1&&i.push(239,191,189);continue}if(o+1===n){(t-=3)>-1&&i.push(239,191,189);continue}f=r;continue}if(r<56320){(t-=3)>-1&&i.push(239,191,189),f=r;continue}r=65536+(f-55296<<10|r-56320)}else f&&(t-=3)>-1&&i.push(239,191,189);if(f=null,r<128){if((t-=1)<0)break;i.push(r)}else if(r<2048){if((t-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return i}function asciiToBytes(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}function utf16leToBytes(e,t){for(var r,n,f,i=[],o=0;o<e.length&&!((t-=2)<0);++o)r=e.charCodeAt(o),n=r>>8,f=r%256,i.push(f),i.push(n);return i}function base64ToBytes(e){return base64.toByteArray(base64clean(e))}function blitBuffer(e,t,r,n){for(var f=0;f<n&&!(f+r>=t.length||f>=e.length);++f)t[f+r]=e[f];return f}function isInstance(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}function numberIsNaN(e){return e!==e}var base64=require("base64-js"),ieee754=require("ieee754");exports.Buffer=Buffer,exports.SlowBuffer=SlowBuffer,exports.INSPECT_MAX_BYTES=50;var K_MAX_LENGTH=2147483647;exports.kMaxLength=K_MAX_LENGTH,Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport(),Buffer.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(Buffer.prototype,"parent",{enumerable:!0,get:function(){if(Buffer.isBuffer(this))return this.buffer}}),Object.defineProperty(Buffer.prototype,"offset",{enumerable:!0,get:function(){if(Buffer.isBuffer(this))return this.byteOffset}}),"undefined"!=typeof Symbol&&null!=Symbol.species&&Buffer[Symbol.species]===Buffer&&Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0,enumerable:!1,writable:!1}),Buffer.poolSize=8192,Buffer.from=function(e,t,r){return from(e,t,r)},Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array,Buffer.alloc=function(e,t,r){return alloc(e,t,r)},Buffer.allocUnsafe=function(e){return allocUnsafe(e)},Buffer.allocUnsafeSlow=function(e){return allocUnsafe(e)},Buffer.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==Buffer.prototype},Buffer.compare=function(e,t){if(isInstance(e,Uint8Array)&&(e=Buffer.from(e,e.offset,e.byteLength)),isInstance(t,Uint8Array)&&(t=Buffer.from(t,t.offset,t.byteLength)),!Buffer.isBuffer(e)||!Buffer.isBuffer(t))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;for(var r=e.length,n=t.length,f=0,i=Math.min(r,n);f<i;++f)if(e[f]!==t[f]){r=e[f],n=t[f];break}return r<n?-1:n<r?1:0},Buffer.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},Buffer.concat=function(e,t){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return Buffer.alloc(0);var r;if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;var n=Buffer.allocUnsafe(t),f=0;for(r=0;r<e.length;++r){var i=e[r];if(isInstance(i,Uint8Array)&&(i=Buffer.from(i)),!Buffer.isBuffer(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(n,f),f+=i.length}return n},Buffer.byteLength=byteLength,Buffer.prototype._isBuffer=!0,Buffer.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)swap(this,t,t+1);return this},Buffer.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)swap(this,t,t+3),swap(this,t+1,t+2);return this},Buffer.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)swap(this,t,t+7),swap(this,t+1,t+6),swap(this,t+2,t+5),swap(this,t+3,t+4);return this},Buffer.prototype.toString=function(){var e=this.length;return 0===e?"":0===arguments.length?utf8Slice(this,0,e):slowToString.apply(this,arguments)},Buffer.prototype.toLocaleString=Buffer.prototype.toString,Buffer.prototype.equals=function(e){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===Buffer.compare(this,e)},Buffer.prototype.inspect=function(){var e="",t=exports.INSPECT_MAX_BYTES;return e=this.toString("hex",0,t).replace(/(.{2})/g,"$1 ").trim(),this.length>t&&(e+=" ... "),"<Buffer "+e+">"},Buffer.prototype.compare=function(e,t,r,n,f){if(isInstance(e,Uint8Array)&&(e=Buffer.from(e,e.offset,e.byteLength)),!Buffer.isBuffer(e))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===f&&(f=this.length),t<0||r>e.length||n<0||f>this.length)throw new RangeError("out of range index");if(n>=f&&t>=r)return 0;if(n>=f)return-1;if(t>=r)return 1;if(t>>>=0,r>>>=0,n>>>=0,f>>>=0,this===e)return 0;for(var i=f-n,o=r-t,u=Math.min(i,o),s=this.slice(n,f),a=e.slice(t,r),h=0;h<u;++h)if(s[h]!==a[h]){i=s[h],o=a[h];break}return i<o?-1:o<i?1:0},Buffer.prototype.includes=function(e,t,r){return-1!==this.indexOf(e,t,r)},Buffer.prototype.indexOf=function(e,t,r){return bidirectionalIndexOf(this,e,t,r,!0)},Buffer.prototype.lastIndexOf=function(e,t,r){return bidirectionalIndexOf(this,e,t,r,!1)},Buffer.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var f=this.length-t;if((void 0===r||r>f)&&(r=f),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var i=!1;;)switch(n){case"hex":return hexWrite(this,e,t,r);case"utf8":case"utf-8":return utf8Write(this,e,t,r);case"ascii":return asciiWrite(this,e,t,r);case"latin1":case"binary":return latin1Write(this,e,t,r);case"base64":return base64Write(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,e,t,r);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),i=!0}},Buffer.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var MAX_ARGUMENTS_LENGTH=4096;Buffer.prototype.slice=function(e,t){var r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var n=this.subarray(e,t);return n.__proto__=Buffer.prototype,n},Buffer.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e],f=1,i=0;++i<t&&(f*=256);)n+=this[e+i]*f;return n},Buffer.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e+--t],f=1;t>0&&(f*=256);)n+=this[e+--t]*f;return n},Buffer.prototype.readUInt8=function(e,t){return e>>>=0,t||checkOffset(e,1,this.length),this[e]},Buffer.prototype.readUInt16LE=function(e,t){return e>>>=0,t||checkOffset(e,2,this.length),this[e]|this[e+1]<<8},Buffer.prototype.readUInt16BE=function(e,t){return e>>>=0,t||checkOffset(e,2,this.length),this[e]<<8|this[e+1]},Buffer.prototype.readUInt32LE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},Buffer.prototype.readUInt32BE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},Buffer.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e],f=1,i=0;++i<t&&(f*=256);)n+=this[e+i]*f;return f*=128,n>=f&&(n-=Math.pow(2,8*t)),n},Buffer.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=t,f=1,i=this[e+--n];n>0&&(f*=256);)i+=this[e+--n]*f;return f*=128,i>=f&&(i-=Math.pow(2,8*t)),i},Buffer.prototype.readInt8=function(e,t){return e>>>=0,t||checkOffset(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},Buffer.prototype.readInt16LE=function(e,t){e>>>=0,t||checkOffset(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt16BE=function(e,t){e>>>=0,t||checkOffset(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt32LE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},Buffer.prototype.readInt32BE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},Buffer.prototype.readFloatLE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),ieee754.read(this,e,!0,23,4)},Buffer.prototype.readFloatBE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),ieee754.read(this,e,!1,23,4)},Buffer.prototype.readDoubleLE=function(e,t){return e>>>=0,t||checkOffset(e,8,this.length),ieee754.read(this,e,!0,52,8)},Buffer.prototype.readDoubleBE=function(e,t){return e>>>=0,t||checkOffset(e,8,this.length),ieee754.read(this,e,!1,52,8)},Buffer.prototype.writeUIntLE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){checkInt(this,e,t,r,Math.pow(2,8*r)-1,0)}var f=1,i=0;for(this[t]=255&e;++i<r&&(f*=256);)this[t+i]=e/f&255;return t+r},Buffer.prototype.writeUIntBE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){checkInt(this,e,t,r,Math.pow(2,8*r)-1,0)}var f=r-1,i=1;for(this[t+f]=255&e;--f>=0&&(i*=256);)this[t+f]=e/i&255;return t+r},Buffer.prototype.writeUInt8=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,1,255,0),this[t]=255&e,t+1},Buffer.prototype.writeUInt16LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},Buffer.prototype.writeUInt16BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},Buffer.prototype.writeUInt32LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},Buffer.prototype.writeUInt32BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},Buffer.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t>>>=0,!n){var f=Math.pow(2,8*r-1);checkInt(this,e,t,r,f-1,-f)}var i=0,o=1,u=0;for(this[t]=255&e;++i<r&&(o*=256);)e<0&&0===u&&0!==this[t+i-1]&&(u=1),this[t+i]=(e/o>>0)-u&255;return t+r},Buffer.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t>>>=0,!n){var f=Math.pow(2,8*r-1);checkInt(this,e,t,r,f-1,-f)}var i=r-1,o=1,u=0;for(this[t+i]=255&e;--i>=0&&(o*=256);)e<0&&0===u&&0!==this[t+i+1]&&(u=1),this[t+i]=(e/o>>0)-u&255;return t+r},Buffer.prototype.writeInt8=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},Buffer.prototype.writeInt16LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},Buffer.prototype.writeInt16BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},Buffer.prototype.writeInt32LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},Buffer.prototype.writeInt32BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},Buffer.prototype.writeFloatLE=function(e,t,r){return writeFloat(this,e,t,!0,r)},Buffer.prototype.writeFloatBE=function(e,t,r){return writeFloat(this,e,t,!1,r)},Buffer.prototype.writeDoubleLE=function(e,t,r){return writeDouble(this,e,t,!0,r)},Buffer.prototype.writeDoubleBE=function(e,t,r){return writeDouble(this,e,t,!1,r)},Buffer.prototype.copy=function(e,t,r,n){if(!Buffer.isBuffer(e))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var f=n-r;if(this===e&&"function"==typeof Uint8Array.prototype.copyWithin)this.copyWithin(t,r,n);else if(this===e&&r<t&&t<n)for(var i=f-1;i>=0;--i)e[i+t]=this[i+r];else Uint8Array.prototype.set.call(e,this.subarray(r,n),t);return f},Buffer.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!Buffer.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===e.length){var f=e.charCodeAt(0);("utf8"===n&&f<128||"latin1"===n)&&(e=f)}}else"number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<r)throw new RangeError("Out of range index");if(r<=t)return this;t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0);var i;if("number"==typeof e)for(i=t;i<r;++i)this[i]=e;else{var o=Buffer.isBuffer(e)?e:Buffer.from(e,n),u=o.length;if(0===u)throw new TypeError('The value "'+e+'" is invalid for argument "value"');for(i=0;i<r-t;++i)this[i+t]=o[i%u]}return this};var INVALID_BASE64_RE=/[^+/0-9A-Za-z-_]/g;
}).call(this,require("buffer").Buffer)

},{"base64-js":55,"buffer":58,"ieee754":82}],59:[function(require,module,exports){
var charenc={utf8:{stringToBytes:function(n){return charenc.bin.stringToBytes(unescape(encodeURIComponent(n)))},bytesToString:function(n){return decodeURIComponent(escape(charenc.bin.bytesToString(n)))}},bin:{stringToBytes:function(n){for(var e=[],r=0;r<n.length;r++)e.push(255&n.charCodeAt(r));return e},bytesToString:function(n){for(var e=[],r=0;r<n.length;r++)e.push(String.fromCharCode(n[r]));return e.join("")}}};module.exports=charenc;
},{}],60:[function(require,module,exports){
var slice=[].slice;module.exports=function(n,r){if("string"==typeof r&&(r=n[r]),"function"!=typeof r)throw new Error("bind() requires a function");var e=slice.call(arguments,2);return function(){return r.apply(n,e.concat(slice.call(arguments)))}};
},{}],61:[function(require,module,exports){
function Emitter(t){if(t)return mixin(t)}function mixin(t){for(var e in Emitter.prototype)t[e]=Emitter.prototype[e];return t}"undefined"!=typeof module&&(module.exports=Emitter),Emitter.prototype.on=Emitter.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},Emitter.prototype.once=function(t,e){function i(){this.off(t,i),e.apply(this,arguments)}return i.fn=e,this.on(t,i),this},Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var i=this._callbacks["$"+t];if(!i)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var r,s=0;s<i.length;s++)if((r=i[s])===e||r.fn===e){i.splice(s,1);break}return this},Emitter.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),i=this._callbacks["$"+t];if(i){i=i.slice(0);for(var r=0,s=i.length;r<s;++r)i[r].apply(this,e)}return this},Emitter.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},Emitter.prototype.hasListeners=function(t){return!!this.listeners(t).length};
},{}],62:[function(require,module,exports){
module.exports=function(o,t){var p=function(){};p.prototype=t.prototype,o.prototype=new p,o.prototype.constructor=o};
},{}],63:[function(require,module,exports){
!function(){var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t={rotl:function(r,t){return r<<t|r>>>32-t},rotr:function(r,t){return r<<32-t|r>>>t},endian:function(r){if(r.constructor==Number)return 16711935&t.rotl(r,8)|4278255360&t.rotl(r,24);for(var n=0;n<r.length;n++)r[n]=t.endian(r[n]);return r},randomBytes:function(r){for(var t=[];r>0;r--)t.push(Math.floor(256*Math.random()));return t},bytesToWords:function(r){for(var t=[],n=0,o=0;n<r.length;n++,o+=8)t[o>>>5]|=r[n]<<24-o%32;return t},wordsToBytes:function(r){for(var t=[],n=0;n<32*r.length;n+=8)t.push(r[n>>>5]>>>24-n%32&255);return t},bytesToHex:function(r){for(var t=[],n=0;n<r.length;n++)t.push((r[n]>>>4).toString(16)),t.push((15&r[n]).toString(16));return t.join("")},hexToBytes:function(r){for(var t=[],n=0;n<r.length;n+=2)t.push(parseInt(r.substr(n,2),16));return t},bytesToBase64:function(t){for(var n=[],o=0;o<t.length;o+=3)for(var e=t[o]<<16|t[o+1]<<8|t[o+2],u=0;u<4;u++)8*o+6*u<=8*t.length?n.push(r.charAt(e>>>6*(3-u)&63)):n.push("=");return n.join("")},base64ToBytes:function(t){t=t.replace(/[^A-Z0-9+\/]/gi,"");for(var n=[],o=0,e=0;o<t.length;e=++o%4)0!=e&&n.push((r.indexOf(t.charAt(o-1))&Math.pow(2,-2*e+8)-1)<<2*e|r.indexOf(t.charAt(o))>>>6-2*e);return n}};module.exports=t}();
},{}],64:[function(require,module,exports){
module.exports=require("./socket"),module.exports.parser=require("engine.io-parser");
},{"./socket":65,"engine.io-parser":76}],65:[function(require,module,exports){
function Socket(e,t){if(!(this instanceof Socket))return new Socket(e,t);t=t||{},e&&"object"==typeof e&&(t=e,e=null),e?(e=parseuri(e),t.hostname=e.host,t.secure="https"===e.protocol||"wss"===e.protocol,t.port=e.port,e.query&&(t.query=e.query)):t.host&&(t.hostname=parseuri(t.host).host),this.secure=null!=t.secure?t.secure:"undefined"!=typeof location&&"https:"===location.protocol,t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.agent=t.agent||!1,this.hostname=t.hostname||("undefined"!=typeof location?location.hostname:"localhost"),this.port=t.port||("undefined"!=typeof location&&location.port?location.port:this.secure?443:80),this.query=t.query||{},"string"==typeof this.query&&(this.query=parseqs.decode(this.query)),this.upgrade=!1!==t.upgrade,this.path=(t.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!t.forceJSONP,this.jsonp=!1!==t.jsonp,this.forceBase64=!!t.forceBase64,this.enablesXDR=!!t.enablesXDR,this.timestampParam=t.timestampParam||"t",this.timestampRequests=t.timestampRequests,this.transports=t.transports||["polling","websocket"],this.transportOptions=t.transportOptions||{},this.readyState="",this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=t.policyPort||843,this.rememberUpgrade=t.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=t.onlyBinaryUpgrades,this.perMessageDeflate=!1!==t.perMessageDeflate&&(t.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=t.pfx||null,this.key=t.key||null,this.passphrase=t.passphrase||null,this.cert=t.cert||null,this.ca=t.ca||null,this.ciphers=t.ciphers||null,this.rejectUnauthorized=void 0===t.rejectUnauthorized||t.rejectUnauthorized,this.forceNode=!!t.forceNode,this.isReactNative="undefined"!=typeof navigator&&"string"==typeof navigator.product&&"reactnative"===navigator.product.toLowerCase(),("undefined"==typeof self||this.isReactNative)&&(t.extraHeaders&&Object.keys(t.extraHeaders).length>0&&(this.extraHeaders=t.extraHeaders),t.localAddress&&(this.localAddress=t.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,this.open()}function clone(e){var t={};for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t}var transports=require("./transports/index"),Emitter=require("component-emitter"),debug=require("debug")("engine.io-client:socket"),index=require("indexof"),parser=require("engine.io-parser"),parseuri=require("parseuri"),parseqs=require("parseqs");module.exports=Socket,Socket.priorWebsocketSuccess=!1,Emitter(Socket.prototype),Socket.protocol=parser.protocol,Socket.Socket=Socket,Socket.Transport=require("./transport"),Socket.transports=require("./transports/index"),Socket.parser=require("engine.io-parser"),Socket.prototype.createTransport=function(e){debug('creating transport "%s"',e);var t=clone(this.query);t.EIO=parser.protocol,t.transport=e;var r=this.transportOptions[e]||{};return this.id&&(t.sid=this.id),new transports[e]({query:t,socket:this,agent:r.agent||this.agent,hostname:r.hostname||this.hostname,port:r.port||this.port,secure:r.secure||this.secure,path:r.path||this.path,forceJSONP:r.forceJSONP||this.forceJSONP,jsonp:r.jsonp||this.jsonp,forceBase64:r.forceBase64||this.forceBase64,enablesXDR:r.enablesXDR||this.enablesXDR,timestampRequests:r.timestampRequests||this.timestampRequests,timestampParam:r.timestampParam||this.timestampParam,policyPort:r.policyPort||this.policyPort,pfx:r.pfx||this.pfx,key:r.key||this.key,passphrase:r.passphrase||this.passphrase,cert:r.cert||this.cert,ca:r.ca||this.ca,ciphers:r.ciphers||this.ciphers,rejectUnauthorized:r.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:r.perMessageDeflate||this.perMessageDeflate,extraHeaders:r.extraHeaders||this.extraHeaders,forceNode:r.forceNode||this.forceNode,localAddress:r.localAddress||this.localAddress,requestTimeout:r.requestTimeout||this.requestTimeout,protocols:r.protocols||void 0,isReactNative:this.isReactNative})},Socket.prototype.open=function(){var e;if(this.rememberUpgrade&&Socket.priorWebsocketSuccess&&-1!==this.transports.indexOf("websocket"))e="websocket";else{if(0===this.transports.length){var t=this;return void setTimeout(function(){t.emit("error","No transports available")},0)}e=this.transports[0]}this.readyState="opening";try{e=this.createTransport(e)}catch(e){return this.transports.shift(),void this.open()}e.open(),this.setTransport(e)},Socket.prototype.setTransport=function(e){debug("setting transport %s",e.name);var t=this;this.transport&&(debug("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=e,e.on("drain",function(){t.onDrain()}).on("packet",function(e){t.onPacket(e)}).on("error",function(e){t.onError(e)}).on("close",function(){t.onClose("transport close")})},Socket.prototype.probe=function(e){function t(){if(h.onlyBinaryUpgrades){var t=!this.supportsBinary&&h.transport.supportsBinary;c=c||t}c||(debug('probe transport "%s" opened',e),p.send([{type:"ping",data:"probe"}]),p.once("packet",function(t){if(!c)if("pong"===t.type&&"probe"===t.data){if(debug('probe transport "%s" pong',e),h.upgrading=!0,h.emit("upgrading",p),!p)return;Socket.priorWebsocketSuccess="websocket"===p.name,debug('pausing current transport "%s"',h.transport.name),h.transport.pause(function(){c||"closed"!==h.readyState&&(debug("changing transport and sending upgrade packet"),a(),h.setTransport(p),p.send([{type:"upgrade"}]),h.emit("upgrade",p),p=null,h.upgrading=!1,h.flush())})}else{debug('probe transport "%s" failed',e);var r=new Error("probe error");r.transport=p.name,h.emit("upgradeError",r)}}))}function r(){c||(c=!0,a(),p.close(),p=null)}function s(t){var s=new Error("probe error: "+t);s.transport=p.name,r(),debug('probe transport "%s" failed because of error: %s',e,t),h.emit("upgradeError",s)}function o(){s("transport closed")}function i(){s("socket closed")}function n(e){p&&e.name!==p.name&&(debug('"%s" works - aborting "%s"',e.name,p.name),r())}function a(){p.removeListener("open",t),p.removeListener("error",s),p.removeListener("close",o),h.removeListener("close",i),h.removeListener("upgrading",n)}debug('probing transport "%s"',e);var p=this.createTransport(e,{probe:1}),c=!1,h=this;Socket.priorWebsocketSuccess=!1,p.once("open",t),p.once("error",s),p.once("close",o),this.once("close",i),this.once("upgrading",n),p.open()},Socket.prototype.onOpen=function(){if(debug("socket open"),this.readyState="open",Socket.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.upgrade&&this.transport.pause){debug("starting upgrade probes");for(var e=0,t=this.upgrades.length;e<t;e++)this.probe(this.upgrades[e])}},Socket.prototype.onPacket=function(e){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(debug('socket receive: type "%s", data "%s"',e.type,e.data),this.emit("packet",e),this.emit("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var t=new Error("server error");t.code=e.data,this.onError(t);break;case"message":this.emit("data",e.data),this.emit("message",e.data)}else debug('packet received with socket readyState "%s"',this.readyState)},Socket.prototype.onHandshake=function(e){this.emit("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this.upgrades=this.filterUpgrades(e.upgrades),this.pingInterval=e.pingInterval,this.pingTimeout=e.pingTimeout,this.onOpen(),"closed"!==this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},Socket.prototype.onHeartbeat=function(e){clearTimeout(this.pingTimeoutTimer);var t=this;t.pingTimeoutTimer=setTimeout(function(){"closed"!==t.readyState&&t.onClose("ping timeout")},e||t.pingInterval+t.pingTimeout)},Socket.prototype.setPing=function(){var e=this;clearTimeout(e.pingIntervalTimer),e.pingIntervalTimer=setTimeout(function(){debug("writing ping packet - expecting pong within %sms",e.pingTimeout),e.ping(),e.onHeartbeat(e.pingTimeout)},e.pingInterval)},Socket.prototype.ping=function(){var e=this;this.sendPacket("ping",function(){e.emit("ping")})},Socket.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()},Socket.prototype.flush=function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(debug("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},Socket.prototype.write=Socket.prototype.send=function(e,t,r){return this.sendPacket("message",e,t,r),this},Socket.prototype.sendPacket=function(e,t,r,s){if("function"==typeof t&&(s=t,t=void 0),"function"==typeof r&&(s=r,r=null),"closing"!==this.readyState&&"closed"!==this.readyState){r=r||{},r.compress=!1!==r.compress;var o={type:e,data:t,options:r};this.emit("packetCreate",o),this.writeBuffer.push(o),s&&this.once("flush",s),this.flush()}},Socket.prototype.close=function(){function e(){s.onClose("forced close"),debug("socket closing - telling transport to close"),s.transport.close()}function t(){s.removeListener("upgrade",t),s.removeListener("upgradeError",t),e()}function r(){s.once("upgrade",t),s.once("upgradeError",t)}if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";var s=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?r():e()}):this.upgrading?r():e()}return this},Socket.prototype.onError=function(e){debug("socket error %j",e),Socket.priorWebsocketSuccess=!1,this.emit("error",e),this.onClose("transport error",e)},Socket.prototype.onClose=function(e,t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){debug('socket close with reason: "%s"',e);var r=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",e,t),r.writeBuffer=[],r.prevBufferLen=0}},Socket.prototype.filterUpgrades=function(e){for(var t=[],r=0,s=e.length;r<s;r++)~index(this.transports,e[r])&&t.push(e[r]);return t};
},{"./transport":66,"./transports/index":67,"component-emitter":61,"debug":73,"engine.io-parser":76,"indexof":83,"parseqs":88,"parseuri":89}],66:[function(require,module,exports){
function Transport(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.isReactNative=t.isReactNative,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress}var parser=require("engine.io-parser"),Emitter=require("component-emitter");module.exports=Transport,Emitter(Transport.prototype),Transport.prototype.onError=function(t,e){var r=new Error(t);return r.type="TransportError",r.description=e,this.emit("error",r),this},Transport.prototype.open=function(){return"closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this},Transport.prototype.close=function(){return"opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this},Transport.prototype.send=function(t){if("open"!==this.readyState)throw new Error("Transport not open");this.write(t)},Transport.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},Transport.prototype.onData=function(t){var e=parser.decodePacket(t,this.socket.binaryType);this.onPacket(e)},Transport.prototype.onPacket=function(t){this.emit("packet",t)},Transport.prototype.onClose=function(){this.readyState="closed",this.emit("close")};
},{"component-emitter":61,"engine.io-parser":76}],67:[function(require,module,exports){
function polling(e){var o=!1,t=!1,r=!1!==e.jsonp;if("undefined"!=typeof location){var n="https:"===location.protocol,i=location.port;i||(i=n?443:80),o=e.hostname!==location.hostname||i!==e.port,t=e.secure!==n}if(e.xdomain=o,e.xscheme=t,"open"in new XMLHttpRequest(e)&&!e.forceJSONP)return new XHR(e);if(!r)throw new Error("JSONP disabled");return new JSONP(e)}var XMLHttpRequest=require("xmlhttprequest-ssl"),XHR=require("./polling-xhr"),JSONP=require("./polling-jsonp"),websocket=require("./websocket");exports.polling=polling,exports.websocket=websocket;
},{"./polling-jsonp":68,"./polling-xhr":69,"./websocket":71,"xmlhttprequest-ssl":72}],68:[function(require,module,exports){
(function (global){
function empty(){}function glob(){return"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}}function JSONPPolling(e){if(Polling.call(this,e),this.query=this.query||{},!callbacks){var t=glob();callbacks=t.___eio=t.___eio||[]}this.index=callbacks.length;var i=this;callbacks.push(function(e){i.onData(e)}),this.query.j=this.index,"function"==typeof addEventListener&&addEventListener("beforeunload",function(){i.script&&(i.script.onerror=empty)},!1)}var Polling=require("./polling"),inherit=require("component-inherit");module.exports=JSONPPolling;var rNewline=/\n/g,rEscapedNewline=/\\n/g,callbacks;inherit(JSONPPolling,Polling),JSONPPolling.prototype.supportsBinary=!1,JSONPPolling.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),Polling.prototype.doClose.call(this)},JSONPPolling.prototype.doPoll=function(){var e=this,t=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),t.async=!0,t.src=this.uri(),t.onerror=function(t){e.onError("jsonp poll error",t)};var i=document.getElementsByTagName("script")[0];i?i.parentNode.insertBefore(t,i):(document.head||document.body).appendChild(t),this.script=t,"undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent)&&setTimeout(function(){var e=document.createElement("iframe");document.body.appendChild(e),document.body.removeChild(e)},100)},JSONPPolling.prototype.doWrite=function(e,t){function i(){r(),t()}function r(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(e){o.onError("jsonp polling iframe removal error",e)}try{var e='<iframe src="javascript:0" name="'+o.iframeId+'">';n=document.createElement(e)}catch(e){n=document.createElement("iframe"),n.name=o.iframeId,n.src="javascript:0"}n.id=o.iframeId,o.form.appendChild(n),o.iframe=n}var o=this;if(!this.form){var n,a=document.createElement("form"),l=document.createElement("textarea"),s=this.iframeId="eio_iframe_"+this.index;a.className="socketio",a.style.position="absolute",a.style.top="-1000px",a.style.left="-1000px",a.target=s,a.method="POST",a.setAttribute("accept-charset","utf-8"),l.name="d",a.appendChild(l),document.body.appendChild(a),this.form=a,this.area=l}this.form.action=this.uri(),r(),e=e.replace(rEscapedNewline,"\\\n"),this.area.value=e.replace(rNewline,"\\n");try{this.form.submit()}catch(e){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===o.iframe.readyState&&i()}:this.iframe.onload=i};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./polling":70,"component-inherit":62}],69:[function(require,module,exports){
function empty(){}function XHR(t){if(Polling.call(this,t),this.requestTimeout=t.requestTimeout,this.extraHeaders=t.extraHeaders,"undefined"!=typeof location){var e="https:"===location.protocol,s=location.port;s||(s=e?443:80),this.xd="undefined"!=typeof location&&t.hostname!==location.hostname||s!==t.port,this.xs=t.secure!==e}}function Request(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create()}function unloadHandler(){for(var t in Request.requests)Request.requests.hasOwnProperty(t)&&Request.requests[t].abort()}var XMLHttpRequest=require("xmlhttprequest-ssl"),Polling=require("./polling"),Emitter=require("component-emitter"),inherit=require("component-inherit"),debug=require("debug")("engine.io-client:polling-xhr");if(module.exports=XHR,module.exports.Request=Request,inherit(XHR,Polling),XHR.prototype.supportsBinary=!0,XHR.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new Request(t)},XHR.prototype.doWrite=function(t,e){var s="string"!=typeof t&&void 0!==t,r=this.request({method:"POST",data:t,isBinary:s}),i=this;r.on("success",e),r.on("error",function(t){i.onError("xhr post error",t)}),this.sendXhr=r},XHR.prototype.doPoll=function(){debug("xhr poll");var t=this.request(),e=this;t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},Emitter(Request.prototype),Request.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var e=this.xhr=new XMLHttpRequest(t),s=this;try{debug("xhr open %s: %s",this.method,this.uri),e.open(this.method,this.uri,this.async);try{if(this.extraHeaders){e.setDisableHeaderCheck&&e.setDisableHeaderCheck(!0);for(var r in this.extraHeaders)this.extraHeaders.hasOwnProperty(r)&&e.setRequestHeader(r,this.extraHeaders[r])}}catch(t){}if("POST"===this.method)try{this.isBinary?e.setRequestHeader("Content-type","application/octet-stream"):e.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(t){}try{e.setRequestHeader("Accept","*/*")}catch(t){}"withCredentials"in e&&(e.withCredentials=!0),this.requestTimeout&&(e.timeout=this.requestTimeout),this.hasXDR()?(e.onload=function(){s.onLoad()},e.onerror=function(){s.onError(e.responseText)}):e.onreadystatechange=function(){if(2===e.readyState)try{var t=e.getResponseHeader("Content-Type");s.supportsBinary&&"application/octet-stream"===t&&(e.responseType="arraybuffer")}catch(t){}4===e.readyState&&(200===e.status||1223===e.status?s.onLoad():setTimeout(function(){s.onError(e.status)},0))},debug("xhr data %s",this.data),e.send(this.data)}catch(t){return void setTimeout(function(){s.onError(t)},0)}"undefined"!=typeof document&&(this.index=Request.requestsCount++,Request.requests[this.index]=this)},Request.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},Request.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},Request.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0)},Request.prototype.cleanup=function(t){if(void 0!==this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=empty:this.xhr.onreadystatechange=empty,t)try{this.xhr.abort()}catch(t){}"undefined"!=typeof document&&delete Request.requests[this.index],this.xhr=null}},Request.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type")}catch(t){}t="application/octet-stream"===e?this.xhr.response||this.xhr.responseText:this.xhr.responseText}catch(t){this.onError(t)}null!=t&&this.onData(t)},Request.prototype.hasXDR=function(){return"undefined"!=typeof XDomainRequest&&!this.xs&&this.enablesXDR},Request.prototype.abort=function(){this.cleanup()},Request.requestsCount=0,Request.requests={},"undefined"!=typeof document)if("function"==typeof attachEvent)attachEvent("onunload",unloadHandler);else if("function"==typeof addEventListener){var terminationEvent="onpagehide"in self?"pagehide":"unload";addEventListener(terminationEvent,unloadHandler,!1)}
},{"./polling":70,"component-emitter":61,"component-inherit":62,"debug":73,"xmlhttprequest-ssl":72}],70:[function(require,module,exports){
function Polling(t){var e=t&&t.forceBase64;hasXHR2&&!e||(this.supportsBinary=!1),Transport.call(this,t)}var Transport=require("../transport"),parseqs=require("parseqs"),parser=require("engine.io-parser"),inherit=require("component-inherit"),yeast=require("yeast"),debug=require("debug")("engine.io-client:polling");module.exports=Polling;var hasXHR2=function(){return null!=new(require("xmlhttprequest-ssl"))({xdomain:!1}).responseType}();inherit(Polling,Transport),Polling.prototype.name="polling",Polling.prototype.doOpen=function(){this.poll()},Polling.prototype.pause=function(t){function e(){debug("paused"),i.readyState="paused",t()}var i=this;if(this.readyState="pausing",this.polling||!this.writable){var o=0;this.polling&&(debug("we are currently polling - waiting to pause"),o++,this.once("pollComplete",function(){debug("pre-pause polling complete"),--o||e()})),this.writable||(debug("we are currently writing - waiting to pause"),o++,this.once("drain",function(){debug("pre-pause writing complete"),--o||e()}))}else e()},Polling.prototype.poll=function(){debug("polling"),this.polling=!0,this.doPoll(),this.emit("poll")},Polling.prototype.onData=function(t){var e=this;debug("polling got data %s",t);var i=function(t,i,o){if("opening"===e.readyState&&e.onOpen(),"close"===t.type)return e.onClose(),!1;e.onPacket(t)};parser.decodePayload(t,this.socket.binaryType,i),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState?this.poll():debug('ignoring poll - transport state "%s"',this.readyState))},Polling.prototype.doClose=function(){function t(){debug("writing close packet"),e.write([{type:"close"}])}var e=this;"open"===this.readyState?(debug("transport open - closing"),t()):(debug("transport not open - deferring close"),this.once("open",t))},Polling.prototype.write=function(t){var e=this;this.writable=!1;var i=function(){e.writable=!0,e.emit("drain")};parser.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,i)})},Polling.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",i="";return!1!==this.timestampRequests&&(t[this.timestampParam]=yeast()),this.supportsBinary||t.sid||(t.b64=1),t=parseqs.encode(t),this.port&&("https"===e&&443!==Number(this.port)||"http"===e&&80!==Number(this.port))&&(i=":"+this.port),t.length&&(t="?"+t),e+"://"+(-1!==this.hostname.indexOf(":")?"["+this.hostname+"]":this.hostname)+i+this.path+t};
},{"../transport":66,"component-inherit":62,"debug":73,"engine.io-parser":76,"parseqs":88,"xmlhttprequest-ssl":72,"yeast":109}],71:[function(require,module,exports){
(function (Buffer){
function WS(e){e&&e.forceBase64&&(this.supportsBinary=!1),this.perMessageDeflate=e.perMessageDeflate,this.usingBrowserWebSocket=BrowserWebSocket&&!e.forceNode,this.protocols=e.protocols,this.usingBrowserWebSocket||(WebSocketImpl=NodeWebSocket),Transport.call(this,e)}var Transport=require("../transport"),parser=require("engine.io-parser"),parseqs=require("parseqs"),inherit=require("component-inherit"),yeast=require("yeast"),debug=require("debug")("engine.io-client:websocket"),BrowserWebSocket,NodeWebSocket;if("undefined"!=typeof WebSocket)BrowserWebSocket=WebSocket;else if("undefined"!=typeof self)BrowserWebSocket=self.WebSocket||self.MozWebSocket;else try{NodeWebSocket=require("ws")}catch(e){}var WebSocketImpl=BrowserWebSocket||NodeWebSocket;module.exports=WS,inherit(WS,Transport),WS.prototype.name="websocket",WS.prototype.supportsBinary=!0,WS.prototype.doOpen=function(){if(this.check()){var e=this.uri(),t=this.protocols,s={agent:this.agent,perMessageDeflate:this.perMessageDeflate};s.pfx=this.pfx,s.key=this.key,s.passphrase=this.passphrase,s.cert=this.cert,s.ca=this.ca,s.ciphers=this.ciphers,s.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(s.headers=this.extraHeaders),this.localAddress&&(s.localAddress=this.localAddress);try{this.ws=this.usingBrowserWebSocket&&!this.isReactNative?t?new WebSocketImpl(e,t):new WebSocketImpl(e):new WebSocketImpl(e,t,s)}catch(e){return this.emit("error",e)}void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="nodebuffer"):this.ws.binaryType="arraybuffer",this.addEventListeners()}},WS.prototype.addEventListeners=function(){var e=this;this.ws.onopen=function(){e.onOpen()},this.ws.onclose=function(){e.onClose()},this.ws.onmessage=function(t){e.onData(t.data)},this.ws.onerror=function(t){e.onError("websocket error",t)}},WS.prototype.write=function(e){function t(){s.emit("flush"),setTimeout(function(){s.writable=!0,s.emit("drain")},0)}var s=this;this.writable=!1;for(var r=e.length,o=0,i=r;o<i;o++)!function(e){parser.encodePacket(e,s.supportsBinary,function(o){if(!s.usingBrowserWebSocket){var i={};if(e.options&&(i.compress=e.options.compress),s.perMessageDeflate){("string"==typeof o?Buffer.byteLength(o):o.length)<s.perMessageDeflate.threshold&&(i.compress=!1)}}try{s.usingBrowserWebSocket?s.ws.send(o):s.ws.send(o,i)}catch(e){debug("websocket closed before onclose event")}--r||t()})}(e[o])},WS.prototype.onClose=function(){Transport.prototype.onClose.call(this)},WS.prototype.doClose=function(){void 0!==this.ws&&this.ws.close()},WS.prototype.uri=function(){var e=this.query||{},t=this.secure?"wss":"ws",s="";return this.port&&("wss"===t&&443!==Number(this.port)||"ws"===t&&80!==Number(this.port))&&(s=":"+this.port),this.timestampRequests&&(e[this.timestampParam]=yeast()),this.supportsBinary||(e.b64=1),e=parseqs.encode(e),e.length&&(e="?"+e),t+"://"+(-1!==this.hostname.indexOf(":")?"["+this.hostname+"]":this.hostname)+s+this.path+e},WS.prototype.check=function(){return!(!WebSocketImpl||"__initialize"in WebSocketImpl&&this.name===WS.prototype.name)};
}).call(this,require("buffer").Buffer)

},{"../transport":66,"buffer":58,"component-inherit":62,"debug":73,"engine.io-parser":76,"parseqs":88,"ws":57,"yeast":109}],72:[function(require,module,exports){
var hasCORS=require("has-cors");module.exports=function(e){var t=e.xdomain,n=e.xscheme,r=e.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!t||hasCORS))return new XMLHttpRequest}catch(e){}try{if("undefined"!=typeof XDomainRequest&&!n&&r)return new XDomainRequest}catch(e){}if(!t)try{return new(self[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(e){}};
},{"has-cors":81}],73:[function(require,module,exports){
(function (process){
function useColors(){return!("undefined"==typeof window||!window.process||"renderer"!==window.process.type)||("undefined"==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))}function formatArgs(e){var o=this.useColors;if(e[0]=(o?"%c":"")+this.namespace+(o?" %c":" ")+e[0]+(o?"%c ":" ")+"+"+exports.humanize(this.diff),o){var C="color: "+this.color;e.splice(1,0,C,"color: inherit");var t=0,r=0;e[0].replace(/%[a-zA-Z%]/g,function(e){"%%"!==e&&(t++,"%c"===e&&(r=t))}),e.splice(r,0,C)}}function log(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function save(e){try{null==e?exports.storage.removeItem("debug"):exports.storage.debug=e}catch(e){}}function load(){var e;try{e=exports.storage.debug}catch(e){}return!e&&"undefined"!=typeof process&&"env"in process&&(e=process.env.DEBUG),e}function localstorage(){try{return window.localStorage}catch(e){}}exports=module.exports=require("./debug"),exports.log=log,exports.formatArgs=formatArgs,exports.save=save,exports.load=load,exports.useColors=useColors,exports.storage="undefined"!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:localstorage(),exports.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],exports.formatters.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}},exports.enable(load());
}).call(this,require('_process'))

},{"./debug":74,"_process":90}],74:[function(require,module,exports){
function selectColor(e){var r,t=0;for(r in e)t=(t<<5)-t+e.charCodeAt(r),t|=0;return exports.colors[Math.abs(t)%exports.colors.length]}function createDebug(e){function r(){if(r.enabled){var e=r,s=+new Date,o=s-(t||s);e.diff=o,e.prev=t,e.curr=s,t=s;for(var n=new Array(arguments.length),a=0;a<n.length;a++)n[a]=arguments[a];n[0]=exports.coerce(n[0]),"string"!=typeof n[0]&&n.unshift("%O");var p=0;n[0]=n[0].replace(/%([a-zA-Z%])/g,function(r,t){if("%%"===r)return r;p++;var s=exports.formatters[t];if("function"==typeof s){var o=n[p];r=s.call(e,o),n.splice(p,1),p--}return r}),exports.formatArgs.call(e,n);(r.log||exports.log||console.log.bind(console)).apply(e,n)}}var t;return r.namespace=e,r.enabled=exports.enabled(e),r.useColors=exports.useColors(),r.color=selectColor(e),r.destroy=destroy,"function"==typeof exports.init&&exports.init(r),exports.instances.push(r),r}function destroy(){var e=exports.instances.indexOf(this);return-1!==e&&(exports.instances.splice(e,1),!0)}function enable(e){exports.save(e),exports.names=[],exports.skips=[];var r,t=("string"==typeof e?e:"").split(/[\s,]+/),s=t.length;for(r=0;r<s;r++)t[r]&&(e=t[r].replace(/\*/g,".*?"),"-"===e[0]?exports.skips.push(new RegExp("^"+e.substr(1)+"$")):exports.names.push(new RegExp("^"+e+"$")));for(r=0;r<exports.instances.length;r++){var o=exports.instances[r];o.enabled=exports.enabled(o.namespace)}}function disable(){exports.enable("")}function enabled(e){if("*"===e[e.length-1])return!0;var r,t;for(r=0,t=exports.skips.length;r<t;r++)if(exports.skips[r].test(e))return!1;for(r=0,t=exports.names.length;r<t;r++)if(exports.names[r].test(e))return!0;return!1}function coerce(e){return e instanceof Error?e.stack||e.message:e}exports=module.exports=createDebug.debug=createDebug.default=createDebug,exports.coerce=coerce,exports.disable=disable,exports.enable=enable,exports.enabled=enabled,exports.humanize=require("ms"),exports.instances=[],exports.names=[],exports.skips=[],exports.formatters={};
},{"ms":75}],75:[function(require,module,exports){
function parse(e){if(e=String(e),!(e.length>100)){var r=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(r){var a=parseFloat(r[1]);switch((r[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return a*y;case"days":case"day":case"d":return a*d;case"hours":case"hour":case"hrs":case"hr":case"h":return a*h;case"minutes":case"minute":case"mins":case"min":case"m":return a*m;case"seconds":case"second":case"secs":case"sec":case"s":return a*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return a;default:return}}}}function fmtShort(e){return e>=d?Math.round(e/d)+"d":e>=h?Math.round(e/h)+"h":e>=m?Math.round(e/m)+"m":e>=s?Math.round(e/s)+"s":e+"ms"}function fmtLong(e){return plural(e,d,"day")||plural(e,h,"hour")||plural(e,m,"minute")||plural(e,s,"second")||e+" ms"}function plural(s,e,r){if(!(s<e))return s<1.5*e?Math.floor(s/e)+" "+r:Math.ceil(s/e)+" "+r+"s"}var s=1e3,m=60*s,h=60*m,d=24*h,y=365.25*d;module.exports=function(s,e){e=e||{};var r=typeof s;if("string"===r&&s.length>0)return parse(s);if("number"===r&&!1===isNaN(s))return e.long?fmtLong(s):fmtShort(s);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(s))};
},{}],76:[function(require,module,exports){
function encodeBase64Object(e,r){return r("b"+exports.packets[e.type]+e.data.data)}function encodeArrayBuffer(e,r,t){if(!r)return exports.encodeBase64Packet(e,t);var n=e.data,a=new Uint8Array(n),o=new Uint8Array(1+n.byteLength);o[0]=packets[e.type];for(var f=0;f<a.length;f++)o[f+1]=a[f];return t(o.buffer)}function encodeBlobAsArrayBuffer(e,r,t){if(!r)return exports.encodeBase64Packet(e,t);var n=new FileReader;return n.onload=function(){exports.encodePacket({type:e.type,data:n.result},r,!0,t)},n.readAsArrayBuffer(e.data)}function encodeBlob(e,r,t){if(!r)return exports.encodeBase64Packet(e,t);if(dontSendBlobs)return encodeBlobAsArrayBuffer(e,r,t);var n=new Uint8Array(1);return n[0]=packets[e.type],t(new Blob([n.buffer,e.data]))}function tryDecode(e){try{e=utf8.decode(e,{strict:!1})}catch(e){return!1}return e}function map(e,r,t){for(var n=new Array(e.length),a=after(e.length,t),o=0;o<e.length;o++)!function(e,t,a){r(t,function(r,t){n[e]=t,a(r,n)})}(o,e[o],a)}var keys=require("./keys"),hasBinary=require("has-binary2"),sliceBuffer=require("arraybuffer.slice"),after=require("after"),utf8=require("./utf8"),base64encoder;"undefined"!=typeof ArrayBuffer&&(base64encoder=require("base64-arraybuffer"));var isAndroid="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),isPhantomJS="undefined"!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),dontSendBlobs=isAndroid||isPhantomJS;exports.protocol=3;var packets=exports.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},packetslist=keys(packets),err={type:"error",data:"parser error"},Blob=require("blob");exports.encodePacket=function(e,r,t,n){"function"==typeof r&&(n=r,r=!1),"function"==typeof t&&(n=t,t=null);var a=void 0===e.data?void 0:e.data.buffer||e.data;if("undefined"!=typeof ArrayBuffer&&a instanceof ArrayBuffer)return encodeArrayBuffer(e,r,n);if(void 0!==Blob&&a instanceof Blob)return encodeBlob(e,r,n);if(a&&a.base64)return encodeBase64Object(e,n);var o=packets[e.type];return void 0!==e.data&&(o+=t?utf8.encode(String(e.data),{strict:!1}):String(e.data)),n(""+o)},exports.encodeBase64Packet=function(e,r){var t="b"+exports.packets[e.type];if(void 0!==Blob&&e.data instanceof Blob){var n=new FileReader;return n.onload=function(){var e=n.result.split(",")[1];r(t+e)},n.readAsDataURL(e.data)}var a;try{a=String.fromCharCode.apply(null,new Uint8Array(e.data))}catch(r){for(var o=new Uint8Array(e.data),f=new Array(o.length),i=0;i<o.length;i++)f[i]=o[i];a=String.fromCharCode.apply(null,f)}return t+=btoa(a),r(t)},exports.decodePacket=function(e,r,t){if(void 0===e)return err;if("string"==typeof e){if("b"===e.charAt(0))return exports.decodeBase64Packet(e.substr(1),r);if(t&&!1===(e=tryDecode(e)))return err;var n=e.charAt(0);return Number(n)==n&&packetslist[n]?e.length>1?{type:packetslist[n],data:e.substring(1)}:{type:packetslist[n]}:err}var a=new Uint8Array(e),n=a[0],o=sliceBuffer(e,1);return Blob&&"blob"===r&&(o=new Blob([o])),{type:packetslist[n],data:o}},exports.decodeBase64Packet=function(e,r){var t=packetslist[e.charAt(0)];if(!base64encoder)return{type:t,data:{base64:!0,data:e.substr(1)}};var n=base64encoder.decode(e.substr(1));return"blob"===r&&Blob&&(n=new Blob([n])),{type:t,data:n}},exports.encodePayload=function(e,r,t){function n(e){return e.length+":"+e}function a(e,t){exports.encodePacket(e,!!o&&r,!1,function(e){t(null,n(e))})}"function"==typeof r&&(t=r,r=null);var o=hasBinary(e);return r&&o?Blob&&!dontSendBlobs?exports.encodePayloadAsBlob(e,t):exports.encodePayloadAsArrayBuffer(e,t):e.length?void map(e,a,function(e,r){return t(r.join(""))}):t("0:")},exports.decodePayload=function(e,r,t){if("string"!=typeof e)return exports.decodePayloadAsBinary(e,r,t);"function"==typeof r&&(t=r,r=null);var n;if(""===e)return t(err,0,1);for(var a,o,f="",i=0,u=e.length;i<u;i++){var c=e.charAt(i);if(":"===c){if(""===f||f!=(a=Number(f)))return t(err,0,1);if(o=e.substr(i+1,a),f!=o.length)return t(err,0,1);if(o.length){if(n=exports.decodePacket(o,r,!1),err.type===n.type&&err.data===n.data)return t(err,0,1);if(!1===t(n,i+a,u))return}i+=a,f=""}else f+=c}return""!==f?t(err,0,1):void 0},exports.encodePayloadAsArrayBuffer=function(e,r){function t(e,r){exports.encodePacket(e,!0,!0,function(e){return r(null,e)})}if(!e.length)return r(new ArrayBuffer(0));map(e,t,function(e,t){var n=t.reduce(function(e,r){var t;return t="string"==typeof r?r.length:r.byteLength,e+t.toString().length+t+2},0),a=new Uint8Array(n),o=0;return t.forEach(function(e){var r="string"==typeof e,t=e;if(r){for(var n=new Uint8Array(e.length),f=0;f<e.length;f++)n[f]=e.charCodeAt(f);t=n.buffer}a[o++]=r?0:1;for(var i=t.byteLength.toString(),f=0;f<i.length;f++)a[o++]=parseInt(i[f]);a[o++]=255;for(var n=new Uint8Array(t),f=0;f<n.length;f++)a[o++]=n[f]}),r(a.buffer)})},exports.encodePayloadAsBlob=function(e,r){function t(e,r){exports.encodePacket(e,!0,!0,function(e){var t=new Uint8Array(1);if(t[0]=1,"string"==typeof e){for(var n=new Uint8Array(e.length),a=0;a<e.length;a++)n[a]=e.charCodeAt(a);e=n.buffer,t[0]=0}for(var o=e instanceof ArrayBuffer?e.byteLength:e.size,f=o.toString(),i=new Uint8Array(f.length+1),a=0;a<f.length;a++)i[a]=parseInt(f[a]);if(i[f.length]=255,Blob){var u=new Blob([t.buffer,i.buffer,e]);r(null,u)}})}map(e,t,function(e,t){return r(new Blob(t))})},exports.decodePayloadAsBinary=function(e,r,t){"function"==typeof r&&(t=r,r=null);for(var n=e,a=[];n.byteLength>0;){for(var o=new Uint8Array(n),f=0===o[0],i="",u=1;255!==o[u];u++){if(i.length>310)return t(err,0,1);i+=o[u]}n=sliceBuffer(n,2+i.length),i=parseInt(i);var c=sliceBuffer(n,0,i);if(f)try{c=String.fromCharCode.apply(null,new Uint8Array(c))}catch(e){var s=new Uint8Array(c);c="";for(var u=0;u<s.length;u++)c+=String.fromCharCode(s[u])}a.push(c),n=sliceBuffer(n,i)}var d=a.length;a.forEach(function(e,n){t(exports.decodePacket(e,r,!0),n,d)})};
},{"./keys":77,"./utf8":78,"after":46,"arraybuffer.slice":52,"base64-arraybuffer":54,"blob":56,"has-binary2":79}],77:[function(require,module,exports){
module.exports=Object.keys||function(r){var e=[],t=Object.prototype.hasOwnProperty;for(var o in r)t.call(r,o)&&e.push(o);return e};
},{}],78:[function(require,module,exports){
function ucs2decode(e){for(var r,t,n=[],o=0,a=e.length;o<a;)r=e.charCodeAt(o++),r>=55296&&r<=56319&&o<a?(t=e.charCodeAt(o++),56320==(64512&t)?n.push(((1023&r)<<10)+(1023&t)+65536):(n.push(r),o--)):n.push(r);return n}function ucs2encode(e){for(var r,t=e.length,n=-1,o="";++n<t;)r=e[n],r>65535&&(r-=65536,o+=stringFromCharCode(r>>>10&1023|55296),r=56320|1023&r),o+=stringFromCharCode(r);return o}function checkScalarValue(e,r){if(e>=55296&&e<=57343){if(r)throw Error("Lone surrogate U+"+e.toString(16).toUpperCase()+" is not a scalar value");return!1}return!0}function createByte(e,r){return stringFromCharCode(e>>r&63|128)}function encodeCodePoint(e,r){if(0==(4294967168&e))return stringFromCharCode(e);var t="";return 0==(4294965248&e)?t=stringFromCharCode(e>>6&31|192):0==(4294901760&e)?(checkScalarValue(e,r)||(e=65533),t=stringFromCharCode(e>>12&15|224),t+=createByte(e,6)):0==(4292870144&e)&&(t=stringFromCharCode(e>>18&7|240),t+=createByte(e,12),t+=createByte(e,6)),t+=stringFromCharCode(63&e|128)}function utf8encode(e,r){r=r||{};for(var t,n=!1!==r.strict,o=ucs2decode(e),a=o.length,i=-1,d="";++i<a;)t=o[i],d+=encodeCodePoint(t,n);return d}function readContinuationByte(){if(byteIndex>=byteCount)throw Error("Invalid byte index");var e=255&byteArray[byteIndex];if(byteIndex++,128==(192&e))return 63&e;throw Error("Invalid continuation byte")}function decodeSymbol(e){var r,t,n,o,a;if(byteIndex>byteCount)throw Error("Invalid byte index");if(byteIndex==byteCount)return!1;if(r=255&byteArray[byteIndex],byteIndex++,0==(128&r))return r;if(192==(224&r)){if(t=readContinuationByte(),(a=(31&r)<<6|t)>=128)return a;throw Error("Invalid continuation byte")}if(224==(240&r)){if(t=readContinuationByte(),n=readContinuationByte(),(a=(15&r)<<12|t<<6|n)>=2048)return checkScalarValue(a,e)?a:65533;throw Error("Invalid continuation byte")}if(240==(248&r)&&(t=readContinuationByte(),n=readContinuationByte(),o=readContinuationByte(),(a=(7&r)<<18|t<<12|n<<6|o)>=65536&&a<=1114111))return a;throw Error("Invalid UTF-8 detected")}function utf8decode(e,r){r=r||{};var t=!1!==r.strict;byteArray=ucs2decode(e),byteCount=byteArray.length,byteIndex=0;for(var n,o=[];!1!==(n=decodeSymbol(t));)o.push(n);return ucs2encode(o)}var stringFromCharCode=String.fromCharCode,byteArray,byteCount,byteIndex;module.exports={version:"2.1.2",encode:utf8encode,decode:utf8decode};
},{}],79:[function(require,module,exports){
(function (Buffer){
function hasBinary(t){if(!t||"object"!=typeof t)return!1;if(isArray(t)){for(var r=0,e=t.length;r<e;r++)if(hasBinary(t[r]))return!0;return!1}if("function"==typeof Buffer&&Buffer.isBuffer&&Buffer.isBuffer(t)||"function"==typeof ArrayBuffer&&t instanceof ArrayBuffer||withNativeBlob&&t instanceof Blob||withNativeFile&&t instanceof File)return!0;if(t.toJSON&&"function"==typeof t.toJSON&&1===arguments.length)return hasBinary(t.toJSON(),!0);for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)&&hasBinary(t[i]))return!0;return!1}var isArray=require("isarray"),toString=Object.prototype.toString,withNativeBlob="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===toString.call(Blob),withNativeFile="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===toString.call(File);module.exports=hasBinary;
}).call(this,require("buffer").Buffer)

},{"buffer":58,"isarray":80}],80:[function(require,module,exports){
var toString={}.toString;module.exports=Array.isArray||function(r){return"[object Array]"==toString.call(r)};
},{}],81:[function(require,module,exports){
try{module.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(e){module.exports=!1}
},{}],82:[function(require,module,exports){
exports.read=function(a,o,t,r,h){var M,p,w=8*h-r-1,f=(1<<w)-1,e=f>>1,i=-7,N=t?h-1:0,n=t?-1:1,s=a[o+N];for(N+=n,M=s&(1<<-i)-1,s>>=-i,i+=w;i>0;M=256*M+a[o+N],N+=n,i-=8);for(p=M&(1<<-i)-1,M>>=-i,i+=r;i>0;p=256*p+a[o+N],N+=n,i-=8);if(0===M)M=1-e;else{if(M===f)return p?NaN:1/0*(s?-1:1);p+=Math.pow(2,r),M-=e}return(s?-1:1)*p*Math.pow(2,M-r)},exports.write=function(a,o,t,r,h,M){var p,w,f,e=8*M-h-1,i=(1<<e)-1,N=i>>1,n=23===h?Math.pow(2,-24)-Math.pow(2,-77):0,s=r?0:M-1,u=r?1:-1,l=o<0||0===o&&1/o<0?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(w=isNaN(o)?1:0,p=i):(p=Math.floor(Math.log(o)/Math.LN2),o*(f=Math.pow(2,-p))<1&&(p--,f*=2),o+=p+N>=1?n/f:n*Math.pow(2,1-N),o*f>=2&&(p++,f/=2),p+N>=i?(w=0,p=i):p+N>=1?(w=(o*f-1)*Math.pow(2,h),p+=N):(w=o*Math.pow(2,N-1)*Math.pow(2,h),p=0));h>=8;a[t+s]=255&w,s+=u,w/=256,h-=8);for(p=p<<h|w,e+=h;e>0;a[t+s]=255&p,s+=u,p/=256,e-=8);a[t+s-u]|=128*l};
},{}],83:[function(require,module,exports){
var indexOf=[].indexOf;module.exports=function(e,n){if(indexOf)return e.indexOf(n);for(var r=0;r<e.length;++r)if(e[r]===n)return r;return-1};
},{}],84:[function(require,module,exports){
function isBuffer(f){return!!f.constructor&&"function"==typeof f.constructor.isBuffer&&f.constructor.isBuffer(f)}function isSlowBuffer(f){return"function"==typeof f.readFloatLE&&"function"==typeof f.slice&&isBuffer(f.slice(0,0))}module.exports=function(f){return null!=f&&(isBuffer(f)||isSlowBuffer(f)||!!f._isBuffer)};
},{}],85:[function(require,module,exports){
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){"use strict";function n(e,t,n){n=n||ue;var r,i,o=n.createElement("script");if(o.text=e,t)for(r in Te)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o)}function r(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?he[ge.call(e)]||"object":typeof e}function i(e){var t=!!e&&"length"in e&&e.length,n=r(e);return!be(e)&&!we(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}function o(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}function a(e,t,n){return be(t)?Ce.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?Ce.grep(e,function(e){return e===t!==n}):"string"!=typeof t?Ce.grep(e,function(e){return de.call(t,e)>-1!==n}):Ce.filter(t,e,n)}function s(e,t){for(;(e=e[t])&&1!==e.nodeType;);return e}function u(e){var t={};return Ce.each(e.match(Oe)||[],function(e,n){t[n]=!0}),t}function l(e){return e}function c(e){throw e}function f(e,t,n,r){var i;try{e&&be(i=e.promise)?i.call(e).done(t).fail(n):e&&be(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}function p(){ue.removeEventListener("DOMContentLoaded",p),e.removeEventListener("load",p),Ce.ready()}function d(e,t){return t.toUpperCase()}function h(e){return e.replace(Ie,"ms-").replace(We,d)}function g(){this.expando=Ce.expando+g.uid++}function v(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:_e.test(e)?JSON.parse(e):e)}function y(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ze,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=v(n)}catch(e){}Be.set(e,t,n)}else n=void 0;return n}function m(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return Ce.css(e,t,"")},u=s(),l=n&&n[3]||(Ce.cssNumber[t]?"":"px"),c=e.nodeType&&(Ce.cssNumber[t]||"px"!==l&&+u)&&Xe.exec(Ce.css(e,t));if(c&&c[3]!==l){for(u/=2,l=l||c[3],c=+u||1;a--;)Ce.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,Ce.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}function x(e){var t,n=e.ownerDocument,r=e.nodeName,i=Ze[r];return i||(t=n.body.appendChild(n.createElement(r)),i=Ce.css(t,"display"),t.parentNode.removeChild(t),"none"===i&&(i="block"),Ze[r]=i,i)}function b(e,t){for(var n,r,i=[],o=0,a=e.length;o<a;o++)r=e[o],r.style&&(n=r.style.display,t?("none"===n&&(i[o]=Fe.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&Je(r)&&(i[o]=x(r))):"none"!==n&&(i[o]="none",Fe.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(e[o].style.display=i[o]);return e}function w(e,t){var n;return n=void 0!==e.getElementsByTagName?e.getElementsByTagName(t||"*"):void 0!==e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&o(e,t)?Ce.merge([e],n):n}function T(e,t){for(var n=0,r=e.length;n<r;n++)Fe.set(e[n],"globalEval",!t||Fe.get(t[n],"globalEval"))}function C(e,t,n,i,o){for(var a,s,u,l,c,f,p=t.createDocumentFragment(),d=[],h=0,g=e.length;h<g;h++)if((a=e[h])||0===a)if("object"===r(a))Ce.merge(d,a.nodeType?[a]:a);else if(it.test(a)){for(s=s||p.appendChild(t.createElement("div")),u=(tt.exec(a)||["",""])[1].toLowerCase(),l=rt[u]||rt._default,s.innerHTML=l[1]+Ce.htmlPrefilter(a)+l[2],f=l[0];f--;)s=s.lastChild;Ce.merge(d,s.childNodes),s=p.firstChild,s.textContent=""}else d.push(t.createTextNode(a));for(p.textContent="",h=0;a=d[h++];)if(i&&Ce.inArray(a,i)>-1)o&&o.push(a);else if(c=Ye(a),s=w(p.appendChild(a),"script"),c&&T(s),n)for(f=0;a=s[f++];)nt.test(a.type||"")&&n.push(a);return p}function E(){return!0}function k(){return!1}function S(e,t){return e===N()==("focus"===t)}function N(){try{return ue.activeElement}catch(e){}}function A(e,t,n,r,i,o){var a,s;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(s in t)A(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=k;else if(!i)return e;return 1===o&&(a=i,i=function(e){return Ce().off(e),a.apply(this,arguments)},i.guid=a.guid||(a.guid=Ce.guid++)),e.each(function(){Ce.event.add(this,t,i,r,n)})}function D(e,t,n){if(!n)return void(void 0===Fe.get(e,t)&&Ce.event.add(e,t,E));Fe.set(e,t,!1),Ce.event.add(e,t,{namespace:!1,handler:function(e){var r,i,o=Fe.get(this,t);if(1&e.isTrigger&&this[t]){if(o.length)(Ce.event.special[t]||{}).delegateType&&e.stopPropagation();else if(o=ce.call(arguments),Fe.set(this,t,o),r=n(this,t),this[t](),i=Fe.get(this,t),o!==i||r?Fe.set(this,t,!1):i={},o!==i)return e.stopImmediatePropagation(),e.preventDefault(),i.value}else o.length&&(Fe.set(this,t,{value:Ce.event.trigger(Ce.extend(o[0],Ce.Event.prototype),o.slice(1),this)}),e.stopImmediatePropagation())}})}function j(e,t){return o(e,"table")&&o(11!==t.nodeType?t:t.firstChild,"tr")?Ce(e).children("tbody")[0]||e:e}function q(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function L(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function H(e,t){var n,r,i,o,a,s,u,l;if(1===t.nodeType){if(Fe.hasData(e)&&(o=Fe.access(e),a=Fe.set(t,o),l=o.events)){delete a.handle,a.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)Ce.event.add(t,i,l[i][n])}Be.hasData(e)&&(s=Be.access(e),u=Ce.extend({},s),Be.set(t,u))}}function O(e,t){var n=t.nodeName.toLowerCase();"input"===n&&et.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function P(e,t,r,i){t=fe.apply([],t);var o,a,s,u,l,c,f=0,p=e.length,d=p-1,h=t[0],g=be(h);if(g||p>1&&"string"==typeof h&&!xe.checkClone&&ct.test(h))return e.each(function(n){var o=e.eq(n);g&&(t[0]=h.call(this,n,o.html())),P(o,t,r,i)});if(p&&(o=C(t,e[0].ownerDocument,!1,e,i),a=o.firstChild,1===o.childNodes.length&&(o=a),a||i)){for(s=Ce.map(w(o,"script"),q),u=s.length;f<p;f++)l=o,f!==d&&(l=Ce.clone(l,!0,!0),u&&Ce.merge(s,w(l,"script"))),r.call(e[f],l,f);if(u)for(c=s[s.length-1].ownerDocument,Ce.map(s,L),f=0;f<u;f++)l=s[f],nt.test(l.type||"")&&!Fe.access(l,"globalEval")&&Ce.contains(c,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?Ce._evalUrl&&!l.noModule&&Ce._evalUrl(l.src,{nonce:l.nonce||l.getAttribute("nonce")}):n(l.textContent.replace(ft,""),l,c))}return e}function R(e,t,n){for(var r,i=t?Ce.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||Ce.cleanData(w(r)),r.parentNode&&(n&&Ye(r)&&T(w(r,"script")),r.parentNode.removeChild(r));return e}function M(e,t,n){var r,i,o,a,s=e.style;return n=n||dt(e),n&&(a=n.getPropertyValue(t)||n[t],""!==a||Ye(e)||(a=Ce.style(e,t)),!xe.pixelBoxStyles()&&pt.test(a)&&ht.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function I(e,t){return{get:function(){return e()?void delete this.get:(this.get=t).apply(this,arguments)}}}function W(e){for(var t=e[0].toUpperCase()+e.slice(1),n=gt.length;n--;)if((e=gt[n]+t)in vt)return e}function $(e){var t=Ce.cssProps[e]||yt[e];return t||(e in vt?e:yt[e]=W(e)||e)}function F(e,t,n){var r=Xe.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function B(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=Ce.css(e,n+Ve[a],!0,i)),r?("content"===n&&(u-=Ce.css(e,"padding"+Ve[a],!0,i)),"margin"!==n&&(u-=Ce.css(e,"border"+Ve[a]+"Width",!0,i))):(u+=Ce.css(e,"padding"+Ve[a],!0,i),"padding"!==n?u+=Ce.css(e,"border"+Ve[a]+"Width",!0,i):s+=Ce.css(e,"border"+Ve[a]+"Width",!0,i));return!r&&o>=0&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))||0),u}function _(e,t,n){var r=dt(e),i=!xe.boxSizingReliable()||n,o=i&&"border-box"===Ce.css(e,"boxSizing",!1,r),a=o,s=M(e,t,r),u="offset"+t[0].toUpperCase()+t.slice(1);if(pt.test(s)){if(!n)return s;s="auto"}return(!xe.boxSizingReliable()&&o||"auto"===s||!parseFloat(s)&&"inline"===Ce.css(e,"display",!1,r))&&e.getClientRects().length&&(o="border-box"===Ce.css(e,"boxSizing",!1,r),(a=u in e)&&(s=e[u])),(s=parseFloat(s)||0)+B(e,t,n||(o?"border":"content"),a,r,s)+"px"}function z(e,t,n,r,i){return new z.prototype.init(e,t,n,r,i)}function U(){Ct&&(!1===ue.hidden&&e.requestAnimationFrame?e.requestAnimationFrame(U):e.setTimeout(U,Ce.fx.interval),Ce.fx.tick())}function X(){return e.setTimeout(function(){Tt=void 0}),Tt=Date.now()}function V(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)n=Ve[r],i["margin"+n]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function G(e,t,n){for(var r,i=(J.tweeners[t]||[]).concat(J.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function Y(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&Je(e),v=Fe.get(e,"fxshow");n.queue||(a=Ce._queueHooks(e,"fx"),null==a.unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,Ce.queue(e,"fx").length||a.empty.fire()})}));for(r in t)if(i=t[r],Et.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0}d[r]=v&&v[r]||Ce.style(e,r)}if((u=!Ce.isEmptyObject(t))||!Ce.isEmptyObject(d)){f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],l=v&&v.display,null==l&&(l=Fe.get(e,"display")),c=Ce.css(e,"display"),"none"===c&&(l?c=l:(b([e],!0),l=e.style.display||l,c=Ce.css(e,"display"),b([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===Ce.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1;for(r in d)u||(v?"hidden"in v&&(g=v.hidden):v=Fe.access(e,"fxshow",{display:l}),o&&(v.hidden=!g),g&&b([e],!0),p.done(function(){g||b([e]),Fe.remove(e,"fxshow");for(r in d)Ce.style(e,r,d[r])})),u=G(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0))}}function Q(e,t){var n,r,i,o,a;for(n in e)if(r=h(n),i=t[r],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=Ce.cssHooks[r])&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function J(e,t,n){var r,i,o=0,a=J.prefilters.length,s=Ce.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=Tt||X(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,a=0,u=l.tweens.length;a<u;a++)l.tweens[a].run(o);return s.notifyWith(e,[l,o,n]),o<1&&u?n:(u||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:Ce.extend({},t),opts:Ce.extend(!0,{specialEasing:{},easing:Ce.easing._default},n),originalProperties:t,originalOptions:n,startTime:Tt||X(),duration:n.duration,tweens:[],createTween:function(t,n){var r=Ce.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),c=l.props;for(Q(c,l.opts.specialEasing);o<a;o++)if(r=J.prefilters[o].call(l,e,c,l.opts))return be(r.stop)&&(Ce._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return Ce.map(c,G,l),be(l.opts.start)&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),Ce.fx.timer(Ce.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l}function K(e){return(e.match(Oe)||[]).join(" ")}function Z(e){return e.getAttribute&&e.getAttribute("class")||""}function ee(e){return Array.isArray(e)?e:"string"==typeof e?e.match(Oe)||[]:[]}function te(e,t,n,i){var o;if(Array.isArray(t))Ce.each(t,function(t,r){n||Rt.test(e)?i(e,r):te(e+"["+("object"==typeof r&&null!=r?t:"")+"]",r,n,i)});else if(n||"object"!==r(t))i(e,t);else for(o in t)te(e+"["+o+"]",t[o],n,i)}function ne(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(Oe)||[];if(be(n))for(;r=o[i++];)"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function re(e,t,n,r){function i(s){var u;return o[s]=!0,Ce.each(e[s]||[],function(e,s){var l=s(t,n,r);return"string"!=typeof l||a||o[l]?a?!(u=l):void 0:(t.dataTypes.unshift(l),i(l),!1)}),u}var o={},a=e===Gt;return i(t.dataTypes[0])||!o["*"]&&i("*")}function ie(e,t){var n,r,i=Ce.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&Ce.extend(!0,e,r),e}function oe(e,t,n){for(var r,i,o,a,s=e.contents,u=e.dataTypes;"*"===u[0];)u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}function ae(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];for(o=c.shift();o;)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if(s=i.split(" "),s[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e.throws)t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}var se=[],ue=e.document,le=Object.getPrototypeOf,ce=se.slice,fe=se.concat,pe=se.push,de=se.indexOf,he={},ge=he.toString,ve=he.hasOwnProperty,ye=ve.toString,me=ye.call(Object),xe={},be=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType},we=function(e){return null!=e&&e===e.window},Te={type:!0,src:!0,nonce:!0,noModule:!0},Ce=function(e,t){return new Ce.fn.init(e,t)},Ee=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;Ce.fn=Ce.prototype={jquery:"3.4.1",constructor:Ce,length:0,toArray:function(){return ce.call(this)},get:function(e){return null==e?ce.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=Ce.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return Ce.each(this,e)},map:function(e){return this.pushStack(Ce.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(ce.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:pe,sort:se.sort,splice:se.splice},Ce.extend=Ce.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||be(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(Ce.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||Ce.isPlainObject(n)?n:{},i=!1,a[t]=Ce.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},Ce.extend({expando:"jQuery"+("3.4.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==ge.call(e))&&(!(t=le(e))||"function"==typeof(n=ve.call(t,"constructor")&&t.constructor)&&ye.call(n)===me)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t){n(e,{nonce:t&&t.nonce})},each:function(e,t){var n,r=0;if(i(e))for(n=e.length;r<n&&!1!==t.call(e[r],r,e[r]);r++);else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(Ee,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(i(Object(e))?Ce.merge(n,"string"==typeof e?[e]:e):pe.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:de.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,o,a=0,s=[];if(i(e))for(r=e.length;a<r;a++)null!=(o=t(e[a],a,n))&&s.push(o);else for(a in e)null!=(o=t(e[a],a,n))&&s.push(o);return fe.apply([],s)},guid:1,support:xe}),"function"==typeof Symbol&&(Ce.fn[Symbol.iterator]=se[Symbol.iterator]),Ce.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){he["[object "+t+"]"]=t.toLowerCase()});var ke=function(e){function t(e,t,n,r){var i,o,a,s,u,c,p,d=t&&t.ownerDocument,h=t?t.nodeType:9;if(n=n||[],"string"!=typeof e||!e||1!==h&&9!==h&&11!==h)return n;if(!r&&((t?t.ownerDocument||t:W)!==q&&j(t),t=t||q,H)){if(11!==h&&(u=ye.exec(e)))if(i=u[1]){if(9===h){if(!(a=t.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(d&&(a=d.getElementById(i))&&M(t,a)&&a.id===i)return n.push(a),n}else{if(u[2])return J.apply(n,t.getElementsByTagName(e)),n;if((i=u[3])&&b.getElementsByClassName&&t.getElementsByClassName)return J.apply(n,t.getElementsByClassName(i)),n}if(b.qsa&&!U[e+" "]&&(!O||!O.test(e))&&(1!==h||"object"!==t.nodeName.toLowerCase())){if(p=e,d=t,1===h&&le.test(e)){for((s=t.getAttribute("id"))?s=s.replace(we,Te):t.setAttribute("id",s=I),c=E(e),o=c.length;o--;)c[o]="#"+s+" "+f(c[o]);p=c.join(","),d=me.test(e)&&l(t.parentNode)||t}try{return J.apply(n,d.querySelectorAll(p)),n}catch(t){U(e,!0)}finally{s===I&&t.removeAttribute("id")}}}return S(e.replace(ae,"$1"),t,n,r)}function n(){function e(n,r){return t.push(n+" ")>w.cacheLength&&delete e[t.shift()],e[n+" "]=r}var t=[];return e}function r(e){return e[I]=!0,e}function i(e){var t=q.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function o(e,t){for(var n=e.split("|"),r=n.length;r--;)w.attrHandle[n[r]]=t}function a(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function s(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&Ee(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function u(e){return r(function(t){return t=+t,r(function(n,r){for(var i,o=e([],n.length,t),a=o.length;a--;)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function l(e){return e&&void 0!==e.getElementsByTagName&&e}function c(){}function f(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function p(e,t,n){var r=t.dir,i=t.next,o=i||r,a=n&&"parentNode"===o,s=F++;return t.first?function(t,n,i){for(;t=t[r];)if(1===t.nodeType||a)return e(t,n,i);return!1}:function(t,n,u){var l,c,f,p=[$,s];if(u){for(;t=t[r];)if((1===t.nodeType||a)&&e(t,n,u))return!0}else for(;t=t[r];)if(1===t.nodeType||a)if(f=t[I]||(t[I]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{if((l=c[o])&&l[0]===$&&l[1]===s)return p[2]=l[2];if(c[o]=p,p[2]=e(t,n,u))return!0}return!1}}function d(e){return e.length>1?function(t,n,r){for(var i=e.length;i--;)if(!e[i](t,n,r))return!1;return!0}:e[0]}function h(e,n,r){for(var i=0,o=n.length;i<o;i++)t(e,n[i],r);return r}function g(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function v(e,t,n,i,o,a){return i&&!i[I]&&(i=v(i)),o&&!o[I]&&(o=v(o,a)),r(function(r,a,s,u){var l,c,f,p=[],d=[],v=a.length,y=r||h(t||"*",s.nodeType?[s]:s,[]),m=!e||!r&&t?y:g(y,p,e,s,u),x=n?o||(r?e:v||i)?[]:a:m;if(n&&n(m,x,s,u),i)for(l=g(x,d),i(l,[],s,u),c=l.length;c--;)(f=l[c])&&(x[d[c]]=!(m[d[c]]=f));if(r){if(o||e){if(o){for(l=[],c=x.length;c--;)(f=x[c])&&l.push(m[c]=f);o(null,x=[],l,u)}for(c=x.length;c--;)(f=x[c])&&(l=o?Z(r,f):p[c])>-1&&(r[l]=!(a[l]=f))}}else x=g(x===a?x.splice(v,x.length):x),o?o(null,a,x,u):J.apply(a,x)})}function y(e){for(var t,n,r,i=e.length,o=w.relative[e[0].type],a=o||w.relative[" "],s=o?1:0,u=p(function(e){return e===t},a,!0),l=p(function(e){return Z(t,e)>-1},a,!0),c=[function(e,n,r){var i=!o&&(r||n!==N)||((t=n).nodeType?u(e,n,r):l(e,n,r));return t=null,i}];s<i;s++)if(n=w.relative[e[s].type])c=[p(d(c),n)];else{if(n=w.filter[e[s].type].apply(null,e[s].matches),n[I]){for(r=++s;r<i&&!w.relative[e[r].type];r++);return v(s>1&&d(c),s>1&&f(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace(ae,"$1"),n,s<r&&y(e.slice(s,r)),r<i&&y(e=e.slice(r)),r<i&&f(e))}c.push(n)}return d(c)}function m(e,n){var i=n.length>0,o=e.length>0,a=function(r,a,s,u,l){var c,f,p,d=0,h="0",v=r&&[],y=[],m=N,x=r||o&&w.find.TAG("*",l),b=$+=null==m?1:Math.random()||.1,T=x.length;for(l&&(N=a===q||a||l);h!==T&&null!=(c=x[h]);h++){if(o&&c){for(f=0,a||c.ownerDocument===q||(j(c),s=!H);p=e[f++];)if(p(c,a||q,s)){u.push(c);break}l&&($=b)}i&&((c=!p&&c)&&d--,r&&v.push(c))}if(d+=h,i&&h!==d){for(f=0;p=n[f++];)p(v,y,a,s);if(r){if(d>0)for(;h--;)v[h]||y[h]||(y[h]=Y.call(u));y=g(y)}J.apply(u,y),l&&!r&&y.length>0&&d+n.length>1&&t.uniqueSort(u)}return l&&($=b,N=m),v};return i?r(a):a}var x,b,w,T,C,E,k,S,N,A,D,j,q,L,H,O,P,R,M,I="sizzle"+1*new Date,W=e.document,$=0,F=0,B=n(),_=n(),z=n(),U=n(),X=function(e,t){return e===t&&(D=!0),0},V={}.hasOwnProperty,G=[],Y=G.pop,Q=G.push,J=G.push,K=G.slice,Z=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},ee="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",te="[\\x20\\t\\r\\n\\f]",ne="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",re="\\["+te+"*("+ne+")(?:"+te+"*([*^$|!~]?=)"+te+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+ne+"))|)"+te+"*\\]",ie=":("+ne+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+re+")*)|.*)\\)|)",oe=new RegExp(te+"+","g"),ae=new RegExp("^"+te+"+|((?:^|[^\\\\])(?:\\\\.)*)"+te+"+$","g"),se=new RegExp("^"+te+"*,"+te+"*"),ue=new RegExp("^"+te+"*([>+~]|"+te+")"+te+"*"),le=new RegExp(te+"|>"),ce=new RegExp(ie),fe=new RegExp("^"+ne+"$"),pe={ID:new RegExp("^#("+ne+")"),CLASS:new RegExp("^\\.("+ne+")"),TAG:new RegExp("^("+ne+"|[*])"),ATTR:new RegExp("^"+re),PSEUDO:new RegExp("^"+ie),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+te+"*(even|odd|(([+-]|)(\\d*)n|)"+te+"*(?:([+-]|)"+te+"*(\\d+)|))"+te+"*\\)|)","i"),bool:new RegExp("^(?:"+ee+")$","i"),needsContext:new RegExp("^"+te+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+te+"*((?:-\\d)?\\d*)"+te+"*\\)|)(?=[^-]|$)","i")},de=/HTML$/i,he=/^(?:input|select|textarea|button)$/i,ge=/^h\d$/i,ve=/^[^{]+\{\s*\[native \w/,ye=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,me=/[+~]/,xe=new RegExp("\\\\([\\da-f]{1,6}"+te+"?|("+te+")|.)","ig"),be=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},we=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,Te=function(e,t){return t?"\0"===e?"�":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},Ce=function(){j()},Ee=p(function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{J.apply(G=K.call(W.childNodes),W.childNodes),G[W.childNodes.length].nodeType}catch(e){J={apply:G.length?function(e,t){Q.apply(e,K.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}b=t.support={},C=t.isXML=function(e){var t=e.namespaceURI,n=(e.ownerDocument||e).documentElement;return!de.test(t||n&&n.nodeName||"HTML")},j=t.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:W;return r!==q&&9===r.nodeType&&r.documentElement?(q=r,L=q.documentElement,H=!C(q),W!==q&&(n=q.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",Ce,!1):n.attachEvent&&n.attachEvent("onunload",Ce)),b.attributes=i(function(e){return e.className="i",!e.getAttribute("className")}),b.getElementsByTagName=i(function(e){return e.appendChild(q.createComment("")),!e.getElementsByTagName("*").length}),b.getElementsByClassName=ve.test(q.getElementsByClassName),b.getById=i(function(e){return L.appendChild(e).id=I,!q.getElementsByName||!q.getElementsByName(I).length}),b.getById?(w.filter.ID=function(e){var t=e.replace(xe,be);return function(e){return e.getAttribute("id")===t}},w.find.ID=function(e,t){if(void 0!==t.getElementById&&H){var n=t.getElementById(e);return n?[n]:[]}}):(w.filter.ID=function(e){var t=e.replace(xe,be);return function(e){var n=void 0!==e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},w.find.ID=function(e,t){if(void 0!==t.getElementById&&H){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];for(i=t.getElementsByName(e),r=0;o=i[r++];)if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),w.find.TAG=b.getElementsByTagName?function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):b.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){for(;n=o[i++];)1===n.nodeType&&r.push(n);return r}return o},w.find.CLASS=b.getElementsByClassName&&function(e,t){if(void 0!==t.getElementsByClassName&&H)return t.getElementsByClassName(e)},P=[],O=[],(b.qsa=ve.test(q.querySelectorAll))&&(i(function(e){L.appendChild(e).innerHTML="<a id='"+I+"'></a><select id='"+I+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&O.push("[*^$]="+te+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||O.push("\\["+te+"*(?:value|"+ee+")"),e.querySelectorAll("[id~="+I+"-]").length||O.push("~="),e.querySelectorAll(":checked").length||O.push(":checked"),e.querySelectorAll("a#"+I+"+*").length||O.push(".#.+[+~]")}),i(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=q.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&O.push("name"+te+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&O.push(":enabled",":disabled"),L.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&O.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),O.push(",.*:")})),(b.matchesSelector=ve.test(R=L.matches||L.webkitMatchesSelector||L.mozMatchesSelector||L.oMatchesSelector||L.msMatchesSelector))&&i(function(e){b.disconnectedMatch=R.call(e,"*"),R.call(e,"[s!='']:x"),P.push("!=",ie)}),O=O.length&&new RegExp(O.join("|")),P=P.length&&new RegExp(P.join("|")),t=ve.test(L.compareDocumentPosition),M=t||ve.test(L.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},X=t?function(e,t){if(e===t)return D=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(n=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1,1&n||!b.sortDetached&&t.compareDocumentPosition(e)===n?e===q||e.ownerDocument===W&&M(W,e)?-1:t===q||t.ownerDocument===W&&M(W,t)?1:A?Z(A,e)-Z(A,t):0:4&n?-1:1)}:function(e,t){if(e===t)return D=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,s=[e],u=[t];if(!i||!o)return e===q?-1:t===q?1:i?-1:o?1:A?Z(A,e)-Z(A,t):0;if(i===o)return a(e,t);for(n=e;n=n.parentNode;)s.unshift(n);for(n=t;n=n.parentNode;)u.unshift(n);for(;s[r]===u[r];)r++;return r?a(s[r],u[r]):s[r]===W?-1:u[r]===W?1:0},q):q},t.matches=function(e,n){return t(e,null,null,n)},t.matchesSelector=function(e,n){if((e.ownerDocument||e)!==q&&j(e),b.matchesSelector&&H&&!U[n+" "]&&(!P||!P.test(n))&&(!O||!O.test(n)))try{var r=R.call(e,n);if(r||b.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){U(n,!0)}return t(n,q,null,[e]).length>0},t.contains=function(e,t){return(e.ownerDocument||e)!==q&&j(e),M(e,t)},t.attr=function(e,t){(e.ownerDocument||e)!==q&&j(e);var n=w.attrHandle[t.toLowerCase()],r=n&&V.call(w.attrHandle,t.toLowerCase())?n(e,t,!H):void 0;return void 0!==r?r:b.attributes||!H?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},t.escape=function(e){return(e+"").replace(we,Te)},t.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},t.uniqueSort=function(e){var t,n=[],r=0,i=0;if(D=!b.detectDuplicates,A=!b.sortStable&&e.slice(0),e.sort(X),D){for(;t=e[i++];)t===e[i]&&(r=n.push(i));for(;r--;)e.splice(n[r],1)}return A=null,e},T=t.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=T(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r++];)n+=T(t);return n},w=t.selectors={cacheLength:50,createPseudo:r,match:pe,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(xe,be),e[3]=(e[3]||e[4]||e[5]||"").replace(xe,be),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||t.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&t.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return pe.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&ce.test(n)&&(t=E(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(xe,be).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=B[e+" "];return t||(t=new RegExp("(^|"+te+")"+e+"("+te+"|$)"))&&B(e,function(e){return t.test("string"==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,n,r){return function(i){var o=t.attr(i,e);return null==o?"!="===n:!n||(o+="","="===n?o===r:"!="===n?o!==r:"^="===n?r&&0===o.indexOf(r):"*="===n?r&&o.indexOf(r)>-1:"$="===n?r&&o.slice(-r.length)===r:"~="===n?(" "+o.replace(oe," ")+" ").indexOf(r)>-1:"|="===n&&(o===r||o.slice(0,r.length+1)===r+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",v=t.parentNode,y=s&&t.nodeName.toLowerCase(),m=!u&&!s,x=!1;if(v){if(o){for(;g;){for(p=t;p=p[g];)if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?v.firstChild:v.lastChild],a&&m){for(p=v,f=p[I]||(p[I]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),l=c[e]||[],d=l[0]===$&&l[1],x=d&&l[2],p=d&&v.childNodes[d];p=++d&&p&&p[g]||(x=d=0)||h.pop();)if(1===p.nodeType&&++x&&p===t){c[e]=[$,d,x];break}}else if(m&&(p=t,f=p[I]||(p[I]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),l=c[e]||[],d=l[0]===$&&l[1],x=d),!1===x)for(;(p=++d&&p&&p[g]||(x=d=0)||h.pop())&&((s?p.nodeName.toLowerCase()!==y:1!==p.nodeType)||!++x||(m&&(f=p[I]||(p[I]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),c[e]=[$,x]),p!==t)););return(x-=i)===r||x%r==0&&x/r>=0}}},PSEUDO:function(e,n){var i,o=w.pseudos[e]||w.setFilters[e.toLowerCase()]||t.error("unsupported pseudo: "+e);return o[I]?o(n):o.length>1?(i=[e,e,"",n],w.setFilters.hasOwnProperty(e.toLowerCase())?r(function(e,t){for(var r,i=o(e,n),a=i.length;a--;)r=Z(e,i[a]),e[r]=!(t[r]=i[a])}):function(e){return o(e,0,i)}):o}},pseudos:{not:r(function(e){var t=[],n=[],i=k(e.replace(ae,"$1"));return i[I]?r(function(e,t,n,r){for(var o,a=i(e,null,r,[]),s=e.length;s--;)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,r,o){return t[0]=e,i(t,null,o,n),t[0]=null,!n.pop()}}),has:r(function(e){return function(n){return t(e,n).length>0}}),contains:r(function(e){
return e=e.replace(xe,be),function(t){return(t.textContent||T(t)).indexOf(e)>-1}}),lang:r(function(e){return fe.test(e||"")||t.error("unsupported lang: "+e),e=e.replace(xe,be).toLowerCase(),function(t){var n;do{if(n=H?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===L},focus:function(e){return e===q.activeElement&&(!q.hasFocus||q.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:s(!1),disabled:s(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!w.pseudos.empty(e)},header:function(e){return ge.test(e.nodeName)},input:function(e){return he.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:u(function(){return[0]}),last:u(function(e,t){return[t-1]}),eq:u(function(e,t,n){return[n<0?n+t:n]}),even:u(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:u(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:u(function(e,t,n){for(var r=n<0?n+t:n>t?t:n;--r>=0;)e.push(r);return e}),gt:u(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},w.pseudos.nth=w.pseudos.eq;for(x in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})w.pseudos[x]=function(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}(x);for(x in{submit:!0,reset:!0})w.pseudos[x]=function(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}(x);return c.prototype=w.filters=w.pseudos,w.setFilters=new c,E=t.tokenize=function(e,n){var r,i,o,a,s,u,l,c=_[e+" "];if(c)return n?0:c.slice(0);for(s=e,u=[],l=w.preFilter;s;){r&&!(i=se.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),r=!1,(i=ue.exec(s))&&(r=i.shift(),o.push({value:r,type:i[0].replace(ae," ")}),s=s.slice(r.length));for(a in w.filter)!(i=pe[a].exec(s))||l[a]&&!(i=l[a](i))||(r=i.shift(),o.push({value:r,type:a,matches:i}),s=s.slice(r.length));if(!r)break}return n?s.length:s?t.error(e):_(e,u).slice(0)},k=t.compile=function(e,t){var n,r=[],i=[],o=z[e+" "];if(!o){for(t||(t=E(e)),n=t.length;n--;)o=y(t[n]),o[I]?r.push(o):i.push(o);o=z(e,m(i,r)),o.selector=e}return o},S=t.select=function(e,t,n,r){var i,o,a,s,u,c="function"==typeof e&&e,p=!r&&E(e=c.selector||e);if(n=n||[],1===p.length){if(o=p[0]=p[0].slice(0),o.length>2&&"ID"===(a=o[0]).type&&9===t.nodeType&&H&&w.relative[o[1].type]){if(!(t=(w.find.ID(a.matches[0].replace(xe,be),t)||[])[0]))return n;c&&(t=t.parentNode),e=e.slice(o.shift().value.length)}for(i=pe.needsContext.test(e)?0:o.length;i--&&(a=o[i],!w.relative[s=a.type]);)if((u=w.find[s])&&(r=u(a.matches[0].replace(xe,be),me.test(o[0].type)&&l(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&f(o)))return J.apply(n,r),n;break}}return(c||k(e,p))(r,t,!H,n,!t||me.test(e)&&l(t.parentNode)||t),n},b.sortStable=I.split("").sort(X).join("")===I,b.detectDuplicates=!!D,j(),b.sortDetached=i(function(e){return 1&e.compareDocumentPosition(q.createElement("fieldset"))}),i(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||o("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),b.attributes&&i(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||o("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),i(function(e){return null==e.getAttribute("disabled")})||o(ee,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),t}(e);Ce.find=ke,Ce.expr=ke.selectors,Ce.expr[":"]=Ce.expr.pseudos,Ce.uniqueSort=Ce.unique=ke.uniqueSort,Ce.text=ke.getText,Ce.isXMLDoc=ke.isXML,Ce.contains=ke.contains,Ce.escapeSelector=ke.escape;var Se=function(e,t,n){for(var r=[],i=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){if(i&&Ce(e).is(n))break;r.push(e)}return r},Ne=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},Ae=Ce.expr.match.needsContext,De=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;Ce.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?Ce.find.matchesSelector(r,e)?[r]:[]:Ce.find.matches(e,Ce.grep(t,function(e){return 1===e.nodeType}))},Ce.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(Ce(e).filter(function(){for(t=0;t<r;t++)if(Ce.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)Ce.find(e,i[t],n);return r>1?Ce.uniqueSort(n):n},filter:function(e){return this.pushStack(a(this,e||[],!1))},not:function(e){return this.pushStack(a(this,e||[],!0))},is:function(e){return!!a(this,"string"==typeof e&&Ae.test(e)?Ce(e):e||[],!1).length}});var je,qe=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(Ce.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||je,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:qe.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof Ce?t[0]:t,Ce.merge(this,Ce.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:ue,!0)),De.test(r[1])&&Ce.isPlainObject(t))for(r in t)be(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return i=ue.getElementById(r[2]),i&&(this[0]=i,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):be(e)?void 0!==n.ready?n.ready(e):e(Ce):Ce.makeArray(e,this)}).prototype=Ce.fn,je=Ce(ue);var Le=/^(?:parents|prev(?:Until|All))/,He={children:!0,contents:!0,next:!0,prev:!0};Ce.fn.extend({has:function(e){var t=Ce(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(Ce.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&Ce(e);if(!Ae.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&Ce.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?Ce.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?de.call(Ce(e),this[0]):de.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(Ce.uniqueSort(Ce.merge(this.get(),Ce(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),Ce.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return Se(e,"parentNode")},parentsUntil:function(e,t,n){return Se(e,"parentNode",n)},next:function(e){return s(e,"nextSibling")},prev:function(e){return s(e,"previousSibling")},nextAll:function(e){return Se(e,"nextSibling")},prevAll:function(e){return Se(e,"previousSibling")},nextUntil:function(e,t,n){return Se(e,"nextSibling",n)},prevUntil:function(e,t,n){return Se(e,"previousSibling",n)},siblings:function(e){return Ne((e.parentNode||{}).firstChild,e)},children:function(e){return Ne(e.firstChild)},contents:function(e){return void 0!==e.contentDocument?e.contentDocument:(o(e,"template")&&(e=e.content||e),Ce.merge([],e.childNodes))}},function(e,t){Ce.fn[e]=function(n,r){var i=Ce.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=Ce.filter(r,i)),this.length>1&&(He[e]||Ce.uniqueSort(i),Le.test(e)&&i.reverse()),this.pushStack(i)}});var Oe=/[^\x20\t\r\n\f]+/g;Ce.Callbacks=function(e){e="string"==typeof e?u(e):Ce.extend({},e);var t,n,i,o,a=[],s=[],l=-1,c=function(){for(o=o||e.once,i=t=!0;s.length;l=-1)for(n=s.shift();++l<a.length;)!1===a[l].apply(n[0],n[1])&&e.stopOnFalse&&(l=a.length,n=!1);e.memory||(n=!1),t=!1,o&&(a=n?[]:"")},f={add:function(){return a&&(n&&!t&&(l=a.length-1,s.push(n)),function t(n){Ce.each(n,function(n,i){be(i)?e.unique&&f.has(i)||a.push(i):i&&i.length&&"string"!==r(i)&&t(i)})}(arguments),n&&!t&&c()),this},remove:function(){return Ce.each(arguments,function(e,t){for(var n;(n=Ce.inArray(t,a,n))>-1;)a.splice(n,1),n<=l&&l--}),this},has:function(e){return e?Ce.inArray(e,a)>-1:a.length>0},empty:function(){return a&&(a=[]),this},disable:function(){return o=s=[],a=n="",this},disabled:function(){return!a},lock:function(){return o=s=[],n||t||(a=n=""),this},locked:function(){return!!o},fireWith:function(e,n){return o||(n=n||[],n=[e,n.slice?n.slice():n],s.push(n),t||c()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!i}};return f},Ce.extend({Deferred:function(t){var n=[["notify","progress",Ce.Callbacks("memory"),Ce.Callbacks("memory"),2],["resolve","done",Ce.Callbacks("once memory"),Ce.Callbacks("once memory"),0,"resolved"],["reject","fail",Ce.Callbacks("once memory"),Ce.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},catch:function(e){return i.then(null,e)},pipe:function(){var e=arguments;return Ce.Deferred(function(t){Ce.each(n,function(n,r){var i=be(e[r[4]])&&e[r[4]];o[r[1]](function(){var e=i&&i.apply(this,arguments);e&&be(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[r[0]+"With"](this,i?[e]:arguments)})}),e=null}).promise()},then:function(t,r,i){function o(t,n,r,i){return function(){var s=this,u=arguments,f=function(){var e,f;if(!(t<a)){if((e=r.apply(s,u))===n.promise())throw new TypeError("Thenable self-resolution");f=e&&("object"==typeof e||"function"==typeof e)&&e.then,be(f)?i?f.call(e,o(a,n,l,i),o(a,n,c,i)):(a++,f.call(e,o(a,n,l,i),o(a,n,c,i),o(a,n,l,n.notifyWith))):(r!==l&&(s=void 0,u=[e]),(i||n.resolveWith)(s,u))}},p=i?f:function(){try{f()}catch(e){Ce.Deferred.exceptionHook&&Ce.Deferred.exceptionHook(e,p.stackTrace),t+1>=a&&(r!==c&&(s=void 0,u=[e]),n.rejectWith(s,u))}};t?p():(Ce.Deferred.getStackHook&&(p.stackTrace=Ce.Deferred.getStackHook()),e.setTimeout(p))}}var a=0;return Ce.Deferred(function(e){n[0][3].add(o(0,e,be(i)?i:l,e.notifyWith)),n[1][3].add(o(0,e,be(t)?t:l)),n[2][3].add(o(0,e,be(r)?r:c))}).promise()},promise:function(e){return null!=e?Ce.extend(e,i):i}},o={};return Ce.each(n,function(e,t){var a=t[2],s=t[5];i[t[1]]=a.add,s&&a.add(function(){r=s},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),a.add(t[3].fire),o[t[0]]=function(){return o[t[0]+"With"](this===o?void 0:this,arguments),this},o[t[0]+"With"]=a.fireWith}),i.promise(o),t&&t.call(o,o),o},when:function(e){var t=arguments.length,n=t,r=Array(n),i=ce.call(arguments),o=Ce.Deferred(),a=function(e){return function(n){r[e]=this,i[e]=arguments.length>1?ce.call(arguments):n,--t||o.resolveWith(r,i)}};if(t<=1&&(f(e,o.done(a(n)).resolve,o.reject,!t),"pending"===o.state()||be(i[n]&&i[n].then)))return o.then();for(;n--;)f(i[n],a(n),o.reject);return o.promise()}});var Pe=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;Ce.Deferred.exceptionHook=function(t,n){e.console&&e.console.warn&&t&&Pe.test(t.name)&&e.console.warn("jQuery.Deferred exception: "+t.message,t.stack,n)},Ce.readyException=function(t){e.setTimeout(function(){throw t})};var Re=Ce.Deferred();Ce.fn.ready=function(e){return Re.then(e).catch(function(e){Ce.readyException(e)}),this},Ce.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--Ce.readyWait:Ce.isReady)||(Ce.isReady=!0,!0!==e&&--Ce.readyWait>0||Re.resolveWith(ue,[Ce]))}}),Ce.ready.then=Re.then,"complete"===ue.readyState||"loading"!==ue.readyState&&!ue.documentElement.doScroll?e.setTimeout(Ce.ready):(ue.addEventListener("DOMContentLoaded",p),e.addEventListener("load",p));var Me=function(e,t,n,i,o,a,s){var u=0,l=e.length,c=null==n;if("object"===r(n)){o=!0;for(u in n)Me(e,t,u,n[u],!0,a,s)}else if(void 0!==i&&(o=!0,be(i)||(s=!0),c&&(s?(t.call(e,i),t=null):(c=t,t=function(e,t,n){return c.call(Ce(e),n)})),t))for(;u<l;u++)t(e[u],n,s?i:i.call(e[u],u,t(e[u],n)));return o?e:c?t.call(e):l?t(e[0],n):a},Ie=/^-ms-/,We=/-([a-z])/g,$e=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};g.uid=1,g.prototype={cache:function(e){var t=e[this.expando];return t||(t={},$e(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[h(t)]=n;else for(r in t)i[h(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][h(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){Array.isArray(t)?t=t.map(h):(t=h(t),t=t in r?[t]:t.match(Oe)||[]),n=t.length;for(;n--;)delete r[t[n]]}(void 0===t||Ce.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!Ce.isEmptyObject(t)}};var Fe=new g,Be=new g,_e=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ze=/[A-Z]/g;Ce.extend({hasData:function(e){return Be.hasData(e)||Fe.hasData(e)},data:function(e,t,n){return Be.access(e,t,n)},removeData:function(e,t){Be.remove(e,t)},_data:function(e,t,n){return Fe.access(e,t,n)},_removeData:function(e,t){Fe.remove(e,t)}}),Ce.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=Be.get(o),1===o.nodeType&&!Fe.get(o,"hasDataAttrs"))){for(n=a.length;n--;)a[n]&&(r=a[n].name,0===r.indexOf("data-")&&(r=h(r.slice(5)),y(o,r,i[r])));Fe.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){Be.set(this,e)}):Me(this,function(t){var n;if(o&&void 0===t){if(void 0!==(n=Be.get(o,e)))return n;if(void 0!==(n=y(o,e)))return n}else this.each(function(){Be.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){Be.remove(this,e)})}}),Ce.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Fe.get(e,t),n&&(!r||Array.isArray(n)?r=Fe.access(e,t,Ce.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=Ce.queue(e,t),r=n.length,i=n.shift(),o=Ce._queueHooks(e,t),a=function(){Ce.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return Fe.get(e,n)||Fe.access(e,n,{empty:Ce.Callbacks("once memory").add(function(){Fe.remove(e,[t+"queue",n])})})}}),Ce.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?Ce.queue(this[0],e):void 0===t?this:this.each(function(){var n=Ce.queue(this,e,t);Ce._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&Ce.dequeue(this,e)})},dequeue:function(e){return this.each(function(){Ce.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=Ce.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";a--;)(n=Fe.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var Ue=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,Xe=new RegExp("^(?:([+-])=|)("+Ue+")([a-z%]*)$","i"),Ve=["Top","Right","Bottom","Left"],Ge=ue.documentElement,Ye=function(e){return Ce.contains(e.ownerDocument,e)},Qe={composed:!0};Ge.getRootNode&&(Ye=function(e){return Ce.contains(e.ownerDocument,e)||e.getRootNode(Qe)===e.ownerDocument});var Je=function(e,t){return e=t||e,"none"===e.style.display||""===e.style.display&&Ye(e)&&"none"===Ce.css(e,"display")},Ke=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i},Ze={};Ce.fn.extend({show:function(){return b(this,!0)},hide:function(){return b(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){Je(this)?Ce(this).show():Ce(this).hide()})}});var et=/^(?:checkbox|radio)$/i,tt=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,nt=/^$|^module$|\/(?:java|ecma)script/i,rt={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};rt.optgroup=rt.option,rt.tbody=rt.tfoot=rt.colgroup=rt.caption=rt.thead,rt.th=rt.td;var it=/<|&#?\w+;/;!function(){var e=ue.createDocumentFragment(),t=e.appendChild(ue.createElement("div")),n=ue.createElement("input");n.setAttribute("type","radio"),n.setAttribute("checked","checked"),n.setAttribute("name","t"),t.appendChild(n),xe.checkClone=t.cloneNode(!0).cloneNode(!0).lastChild.checked,t.innerHTML="<textarea>x</textarea>",xe.noCloneChecked=!!t.cloneNode(!0).lastChild.defaultValue}();var ot=/^key/,at=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,st=/^([^.]*)(?:\.(.+)|)/;Ce.event={global:{},add:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Fe.get(e);if(v)for(n.handler&&(o=n,n=o.handler,i=o.selector),i&&Ce.find.matchesSelector(Ge,i),n.guid||(n.guid=Ce.guid++),(u=v.events)||(u=v.events={}),(a=v.handle)||(a=v.handle=function(t){return void 0!==Ce&&Ce.event.triggered!==t.type?Ce.event.dispatch.apply(e,arguments):void 0}),t=(t||"").match(Oe)||[""],l=t.length;l--;)s=st.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d&&(f=Ce.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=Ce.event.special[d]||{},c=Ce.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&Ce.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||(p=u[d]=[],p.delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),Ce.event.global[d]=!0)},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Fe.hasData(e)&&Fe.get(e);if(v&&(u=v.events)){for(t=(t||"").match(Oe)||[""],l=t.length;l--;)if(s=st.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){for(f=Ce.event.special[d]||{},d=(r?f.delegateType:f.bindType)||d,p=u[d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;o--;)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||Ce.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)Ce.event.remove(e,d+t[l],n,r,!0);Ce.isEmptyObject(u)&&Fe.remove(e,"handle events")}},dispatch:function(e){var t,n,r,i,o,a,s=Ce.event.fix(e),u=new Array(arguments.length),l=(Fe.get(this,"events")||{})[s.type]||[],c=Ce.event.special[s.type]||{};for(u[0]=s,t=1;t<arguments.length;t++)u[t]=arguments[t];if(s.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,s)){for(a=Ce.event.handlers.call(this,s,l),t=0;(i=a[t++])&&!s.isPropagationStopped();)for(s.currentTarget=i.elem,n=0;(o=i.handlers[n++])&&!s.isImmediatePropagationStopped();)s.rnamespace&&!1!==o.namespace&&!s.rnamespace.test(o.namespace)||(s.handleObj=o,s.data=o.data,void 0!==(r=((Ce.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,u))&&!1===(s.result=r)&&(s.preventDefault(),s.stopPropagation()));return c.postDispatch&&c.postDispatch.call(this,s),s.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)r=t[n],i=r.selector+" ",void 0===a[i]&&(a[i]=r.needsContext?Ce(i,this).index(l)>-1:Ce.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(e,t){Object.defineProperty(Ce.Event.prototype,e,{enumerable:!0,configurable:!0,get:be(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[Ce.expando]?e:new Ce.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return et.test(t.type)&&t.click&&o(t,"input")&&D(t,"click",E),!1},trigger:function(e){var t=this||e;return et.test(t.type)&&t.click&&o(t,"input")&&D(t,"click"),!0},_default:function(e){var t=e.target;return et.test(t.type)&&t.click&&o(t,"input")&&Fe.get(t,"click")||o(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},Ce.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},Ce.Event=function(e,t){if(!(this instanceof Ce.Event))return new Ce.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?E:k,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&Ce.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[Ce.expando]=!0},Ce.Event.prototype={constructor:Ce.Event,isDefaultPrevented:k,isPropagationStopped:k,isImmediatePropagationStopped:k,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=E,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=E,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=E,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},Ce.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&ot.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&at.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},Ce.event.addProp),Ce.each({focus:"focusin",blur:"focusout"},function(e,t){Ce.event.special[e]={setup:function(){return D(this,e,S),!1},trigger:function(){return D(this,e),!0},delegateType:t}}),Ce.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){Ce.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||Ce.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),Ce.fn.extend({on:function(e,t,n,r){return A(this,e,t,n,r)},one:function(e,t,n,r){return A(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,Ce(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=k),this.each(function(){Ce.event.remove(this,e,n,t)})}});var ut=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,lt=/<script|<style|<link/i,ct=/checked\s*(?:[^=]|=\s*.checked.)/i,ft=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;Ce.extend({htmlPrefilter:function(e){return e.replace(ut,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,s=e.cloneNode(!0),u=Ye(e);if(!(xe.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||Ce.isXMLDoc(e)))for(a=w(s),o=w(e),r=0,i=o.length;r<i;r++)O(o[r],a[r]);if(t)if(n)for(o=o||w(e),a=a||w(s),r=0,i=o.length;r<i;r++)H(o[r],a[r]);else H(e,s);return a=w(s,"script"),a.length>0&&T(a,!u&&w(e,"script")),s},cleanData:function(e){for(var t,n,r,i=Ce.event.special,o=0;void 0!==(n=e[o]);o++)if($e(n)){if(t=n[Fe.expando]){if(t.events)for(r in t.events)i[r]?Ce.event.remove(n,r):Ce.removeEvent(n,r,t.handle);n[Fe.expando]=void 0}n[Be.expando]&&(n[Be.expando]=void 0)}}}),Ce.fn.extend({detach:function(e){return R(this,e,!0)},remove:function(e){return R(this,e)},text:function(e){return Me(this,function(e){return void 0===e?Ce.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return P(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){j(this,e).appendChild(e)}})},prepend:function(){return P(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=j(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return P(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return P(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(Ce.cleanData(w(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return Ce.clone(this,e,t)})},html:function(e){return Me(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!lt.test(e)&&!rt[(tt.exec(e)||["",""])[1].toLowerCase()]){e=Ce.htmlPrefilter(e);try{for(;n<r;n++)t=this[n]||{},1===t.nodeType&&(Ce.cleanData(w(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return P(this,arguments,function(t){var n=this.parentNode;Ce.inArray(this,e)<0&&(Ce.cleanData(w(this)),n&&n.replaceChild(t,this))},e)}}),Ce.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){Ce.fn[e]=function(e){for(var n,r=[],i=Ce(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),Ce(i[a])[t](n),pe.apply(r,n.get());return this.pushStack(r)}});var pt=new RegExp("^("+Ue+")(?!px)[a-z%]+$","i"),dt=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},ht=new RegExp(Ve.join("|"),"i");!function(){function t(){if(l){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",l.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",Ge.appendChild(u).appendChild(l);var t=e.getComputedStyle(l);r="1%"!==t.top,s=12===n(t.marginLeft),l.style.right="60%",a=36===n(t.right),i=36===n(t.width),l.style.position="absolute",o=12===n(l.offsetWidth/3),Ge.removeChild(u),l=null}}function n(e){return Math.round(parseFloat(e))}var r,i,o,a,s,u=ue.createElement("div"),l=ue.createElement("div");l.style&&(l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",xe.clearCloneStyle="content-box"===l.style.backgroundClip,Ce.extend(xe,{boxSizingReliable:function(){return t(),i},pixelBoxStyles:function(){return t(),a},pixelPosition:function(){return t(),r},reliableMarginLeft:function(){return t(),s},scrollboxSize:function(){return t(),o}}))}();var gt=["Webkit","Moz","ms"],vt=ue.createElement("div").style,yt={},mt=/^(none|table(?!-c[ea]).+)/,xt=/^--/,bt={position:"absolute",visibility:"hidden",display:"block"},wt={letterSpacing:"0",fontWeight:"400"};Ce.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=M(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=h(t),u=xt.test(t),l=e.style;if(u||(t=$(s)),a=Ce.cssHooks[t]||Ce.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];o=typeof n,"string"===o&&(i=Xe.exec(n))&&i[1]&&(n=m(e,t,i),o="number"),null!=n&&n===n&&("number"!==o||u||(n+=i&&i[3]||(Ce.cssNumber[s]?"":"px")),xe.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=h(t);return xt.test(t)||(t=$(s)),a=Ce.cssHooks[t]||Ce.cssHooks[s],a&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=M(e,t,r)),"normal"===i&&t in wt&&(i=wt[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),Ce.each(["height","width"],function(e,t){Ce.cssHooks[t]={get:function(e,n,r){if(n)return!mt.test(Ce.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?_(e,t,r):Ke(e,bt,function(){return _(e,t,r)})},set:function(e,n,r){var i,o=dt(e),a=!xe.scrollboxSize()&&"absolute"===o.position,s=a||r,u=s&&"border-box"===Ce.css(e,"boxSizing",!1,o),l=r?B(e,t,r,u,o):0;return u&&a&&(l-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(o[t])-B(e,t,"border",!1,o)-.5)),l&&(i=Xe.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=Ce.css(e,t)),F(e,n,l)}}}),Ce.cssHooks.marginLeft=I(xe.reliableMarginLeft,function(e,t){if(t)return(parseFloat(M(e,"marginLeft"))||e.getBoundingClientRect().left-Ke(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),Ce.each({margin:"",padding:"",border:"Width"},function(e,t){Ce.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+Ve[r]+t]=o[r]||o[r-2]||o[0];return i}},"margin"!==e&&(Ce.cssHooks[e+t].set=F)}),Ce.fn.extend({css:function(e,t){return Me(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=dt(e),i=t.length;a<i;a++)o[t[a]]=Ce.css(e,t[a],!1,r);return o}return void 0!==n?Ce.style(e,t,n):Ce.css(e,t)},e,t,arguments.length>1)}}),Ce.Tween=z,z.prototype={constructor:z,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||Ce.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(Ce.cssNumber[n]?"":"px")},cur:function(){var e=z.propHooks[this.prop];return e&&e.get?e.get(this):z.propHooks._default.get(this)},run:function(e){var t,n=z.propHooks[this.prop];return this.options.duration?this.pos=t=Ce.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):z.propHooks._default.set(this),this}},z.prototype.init.prototype=z.prototype,z.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=Ce.css(e.elem,e.prop,""),t&&"auto"!==t?t:0)},set:function(e){Ce.fx.step[e.prop]?Ce.fx.step[e.prop](e):1!==e.elem.nodeType||!Ce.cssHooks[e.prop]&&null==e.elem.style[$(e.prop)]?e.elem[e.prop]=e.now:Ce.style(e.elem,e.prop,e.now+e.unit)}}},z.propHooks.scrollTop=z.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},Ce.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},Ce.fx=z.prototype.init,Ce.fx.step={};var Tt,Ct,Et=/^(?:toggle|show|hide)$/,kt=/queueHooks$/;Ce.Animation=Ce.extend(J,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return m(n.elem,e,Xe.exec(t),n),n}]},tweener:function(e,t){be(e)?(t=e,e=["*"]):e=e.match(Oe);for(var n,r=0,i=e.length;r<i;r++)n=e[r],J.tweeners[n]=J.tweeners[n]||[],J.tweeners[n].unshift(t)},prefilters:[Y],prefilter:function(e,t){t?J.prefilters.unshift(e):J.prefilters.push(e)}}),Ce.speed=function(e,t,n){
var r=e&&"object"==typeof e?Ce.extend({},e):{complete:n||!n&&t||be(e)&&e,duration:e,easing:n&&t||t&&!be(t)&&t};return Ce.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in Ce.fx.speeds?r.duration=Ce.fx.speeds[r.duration]:r.duration=Ce.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){be(r.old)&&r.old.call(this),r.queue&&Ce.dequeue(this,r.queue)},r},Ce.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Je).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=Ce.isEmptyObject(e),o=Ce.speed(t,n,r),a=function(){var t=J(this,Ce.extend({},e),o);(i||Fe.get(this,"finish"))&&t.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=Ce.timers,a=Fe.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&kt.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||Ce.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=Fe.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=Ce.timers,a=r?r.length:0;for(n.finish=!0,Ce.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),Ce.each(["toggle","show","hide"],function(e,t){var n=Ce.fn[t];Ce.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(V(t,!0),e,r,i)}}),Ce.each({slideDown:V("show"),slideUp:V("hide"),slideToggle:V("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){Ce.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),Ce.timers=[],Ce.fx.tick=function(){var e,t=0,n=Ce.timers;for(Tt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||Ce.fx.stop(),Tt=void 0},Ce.fx.timer=function(e){Ce.timers.push(e),Ce.fx.start()},Ce.fx.interval=13,Ce.fx.start=function(){Ct||(Ct=!0,U())},Ce.fx.stop=function(){Ct=null},Ce.fx.speeds={slow:600,fast:200,_default:400},Ce.fn.delay=function(t,n){return t=Ce.fx?Ce.fx.speeds[t]||t:t,n=n||"fx",this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})},function(){var e=ue.createElement("input"),t=ue.createElement("select"),n=t.appendChild(ue.createElement("option"));e.type="checkbox",xe.checkOn=""!==e.value,xe.optSelected=n.selected,e=ue.createElement("input"),e.value="t",e.type="radio",xe.radioValue="t"===e.value}();var St,Nt=Ce.expr.attrHandle;Ce.fn.extend({attr:function(e,t){return Me(this,Ce.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){Ce.removeAttr(this,e)})}}),Ce.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return void 0===e.getAttribute?Ce.prop(e,t,n):(1===o&&Ce.isXMLDoc(e)||(i=Ce.attrHooks[t.toLowerCase()]||(Ce.expr.match.bool.test(t)?St:void 0)),void 0!==n?null===n?void Ce.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:(r=Ce.find.attr(e,t),null==r?void 0:r))},attrHooks:{type:{set:function(e,t){if(!xe.radioValue&&"radio"===t&&o(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(Oe);if(i&&1===e.nodeType)for(;n=i[r++];)e.removeAttribute(n)}}),St={set:function(e,t,n){return!1===t?Ce.removeAttr(e,n):e.setAttribute(n,n),n}},Ce.each(Ce.expr.match.bool.source.match(/\w+/g),function(e,t){var n=Nt[t]||Ce.find.attr;Nt[t]=function(e,t,r){var i,o,a=t.toLowerCase();return r||(o=Nt[a],Nt[a]=i,i=null!=n(e,t,r)?a:null,Nt[a]=o),i}});var At=/^(?:input|select|textarea|button)$/i,Dt=/^(?:a|area)$/i;Ce.fn.extend({prop:function(e,t){return Me(this,Ce.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[Ce.propFix[e]||e]})}}),Ce.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&Ce.isXMLDoc(e)||(t=Ce.propFix[t]||t,i=Ce.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=Ce.find.attr(e,"tabindex");return t?parseInt(t,10):At.test(e.nodeName)||Dt.test(e.nodeName)&&e.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),xe.optSelected||(Ce.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),Ce.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){Ce.propFix[this.toLowerCase()]=this}),Ce.fn.extend({addClass:function(e){var t,n,r,i,o,a,s,u=0;if(be(e))return this.each(function(t){Ce(this).addClass(e.call(this,t,Z(this)))});if(t=ee(e),t.length)for(;n=this[u++];)if(i=Z(n),r=1===n.nodeType&&" "+K(i)+" "){for(a=0;o=t[a++];)r.indexOf(" "+o+" ")<0&&(r+=o+" ");s=K(r),i!==s&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,i,o,a,s,u=0;if(be(e))return this.each(function(t){Ce(this).removeClass(e.call(this,t,Z(this)))});if(!arguments.length)return this.attr("class","");if(t=ee(e),t.length)for(;n=this[u++];)if(i=Z(n),r=1===n.nodeType&&" "+K(i)+" "){for(a=0;o=t[a++];)for(;r.indexOf(" "+o+" ")>-1;)r=r.replace(" "+o+" "," ");s=K(r),i!==s&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):be(e)?this.each(function(n){Ce(this).toggleClass(e.call(this,n,Z(this),t),t)}):this.each(function(){var t,i,o,a;if(r)for(i=0,o=Ce(this),a=ee(e);t=a[i++];)o.hasClass(t)?o.removeClass(t):o.addClass(t);else void 0!==e&&"boolean"!==n||(t=Z(this),t&&Fe.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":Fe.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;for(t=" "+e+" ";n=this[r++];)if(1===n.nodeType&&(" "+K(Z(n))+" ").indexOf(t)>-1)return!0;return!1}});var jt=/\r/g;Ce.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=be(e),this.each(function(n){var i;1===this.nodeType&&(i=r?e.call(this,n,Ce(this).val()):e,null==i?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=Ce.map(i,function(e){return null==e?"":e+""})),(t=Ce.valHooks[this.type]||Ce.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return(t=Ce.valHooks[i.type]||Ce.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:(n=i.value,"string"==typeof n?n.replace(jt,""):null==n?"":n)}}}),Ce.extend({valHooks:{option:{get:function(e){var t=Ce.find.attr(e,"value");return null!=t?t:K(Ce.text(e))}},select:{get:function(e){var t,n,r,i=e.options,a=e.selectedIndex,s="select-one"===e.type,u=s?null:[],l=s?a+1:i.length;for(r=a<0?l:s?a:0;r<l;r++)if(n=i[r],(n.selected||r===a)&&!n.disabled&&(!n.parentNode.disabled||!o(n.parentNode,"optgroup"))){if(t=Ce(n).val(),s)return t;u.push(t)}return u},set:function(e,t){for(var n,r,i=e.options,o=Ce.makeArray(t),a=i.length;a--;)r=i[a],(r.selected=Ce.inArray(Ce.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),Ce.each(["radio","checkbox"],function(){Ce.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=Ce.inArray(Ce(e).val(),t)>-1}},xe.checkOn||(Ce.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),xe.focusin="onfocusin"in e;var qt=/^(?:focusinfocus|focusoutblur)$/,Lt=function(e){e.stopPropagation()};Ce.extend(Ce.event,{trigger:function(t,n,r,i){var o,a,s,u,l,c,f,p,d=[r||ue],h=ve.call(t,"type")?t.type:t,g=ve.call(t,"namespace")?t.namespace.split("."):[];if(a=p=s=r=r||ue,3!==r.nodeType&&8!==r.nodeType&&!qt.test(h+Ce.event.triggered)&&(h.indexOf(".")>-1&&(g=h.split("."),h=g.shift(),g.sort()),l=h.indexOf(":")<0&&"on"+h,t=t[Ce.expando]?t:new Ce.Event(h,"object"==typeof t&&t),t.isTrigger=i?2:3,t.namespace=g.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=r),n=null==n?[t]:Ce.makeArray(n,[t]),f=Ce.event.special[h]||{},i||!f.trigger||!1!==f.trigger.apply(r,n))){if(!i&&!f.noBubble&&!we(r)){for(u=f.delegateType||h,qt.test(u+h)||(a=a.parentNode);a;a=a.parentNode)d.push(a),s=a;s===(r.ownerDocument||ue)&&d.push(s.defaultView||s.parentWindow||e)}for(o=0;(a=d[o++])&&!t.isPropagationStopped();)p=a,t.type=o>1?u:f.bindType||h,c=(Fe.get(a,"events")||{})[t.type]&&Fe.get(a,"handle"),c&&c.apply(a,n),(c=l&&a[l])&&c.apply&&$e(a)&&(t.result=c.apply(a,n),!1===t.result&&t.preventDefault());return t.type=h,i||t.isDefaultPrevented()||f._default&&!1!==f._default.apply(d.pop(),n)||!$e(r)||l&&be(r[h])&&!we(r)&&(s=r[l],s&&(r[l]=null),Ce.event.triggered=h,t.isPropagationStopped()&&p.addEventListener(h,Lt),r[h](),t.isPropagationStopped()&&p.removeEventListener(h,Lt),Ce.event.triggered=void 0,s&&(r[l]=s)),t.result}},simulate:function(e,t,n){var r=Ce.extend(new Ce.Event,n,{type:e,isSimulated:!0});Ce.event.trigger(r,null,t)}}),Ce.fn.extend({trigger:function(e,t){return this.each(function(){Ce.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return Ce.event.trigger(e,t,n,!0)}}),xe.focusin||Ce.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){Ce.event.simulate(t,e.target,Ce.event.fix(e))};Ce.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=Fe.access(r,t);i||r.addEventListener(e,n,!0),Fe.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=Fe.access(r,t)-1;i?Fe.access(r,t,i):(r.removeEventListener(e,n,!0),Fe.remove(r,t))}}});var Ht=e.location,Ot=Date.now(),Pt=/\?/;Ce.parseXML=function(t){var n;if(!t||"string"!=typeof t)return null;try{n=(new e.DOMParser).parseFromString(t,"text/xml")}catch(e){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||Ce.error("Invalid XML: "+t),n};var Rt=/\[\]$/,Mt=/\r?\n/g,It=/^(?:submit|button|image|reset|file)$/i,Wt=/^(?:input|select|textarea|keygen)/i;Ce.param=function(e,t){var n,r=[],i=function(e,t){var n=be(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!Ce.isPlainObject(e))Ce.each(e,function(){i(this.name,this.value)});else for(n in e)te(n,e[n],t,i);return r.join("&")},Ce.fn.extend({serialize:function(){return Ce.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=Ce.prop(this,"elements");return e?Ce.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!Ce(this).is(":disabled")&&Wt.test(this.nodeName)&&!It.test(e)&&(this.checked||!et.test(e))}).map(function(e,t){var n=Ce(this).val();return null==n?null:Array.isArray(n)?Ce.map(n,function(e){return{name:t.name,value:e.replace(Mt,"\r\n")}}):{name:t.name,value:n.replace(Mt,"\r\n")}}).get()}});var $t=/%20/g,Ft=/#.*$/,Bt=/([?&])_=[^&]*/,_t=/^(.*?):[ \t]*([^\r\n]*)$/gm,zt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Ut=/^(?:GET|HEAD)$/,Xt=/^\/\//,Vt={},Gt={},Yt="*/".concat("*"),Qt=ue.createElement("a");Qt.href=Ht.href,Ce.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ht.href,type:"GET",isLocal:zt.test(Ht.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Yt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":Ce.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?ie(ie(e,Ce.ajaxSettings),t):ie(Ce.ajaxSettings,e)},ajaxPrefilter:ne(Vt),ajaxTransport:ne(Gt),ajax:function(t,n){function r(t,n,r,s){var l,p,d,b,w,T=n;c||(c=!0,u&&e.clearTimeout(u),i=void 0,a=s||"",C.readyState=t>0?4:0,l=t>=200&&t<300||304===t,r&&(b=oe(h,C,r)),b=ae(h,b,C,l),l?(h.ifModified&&(w=C.getResponseHeader("Last-Modified"),w&&(Ce.lastModified[o]=w),(w=C.getResponseHeader("etag"))&&(Ce.etag[o]=w)),204===t||"HEAD"===h.type?T="nocontent":304===t?T="notmodified":(T=b.state,p=b.data,d=b.error,l=!d)):(d=T,!t&&T||(T="error",t<0&&(t=0))),C.status=t,C.statusText=(n||T)+"",l?y.resolveWith(g,[p,T,C]):y.rejectWith(g,[C,T,d]),C.statusCode(x),x=void 0,f&&v.trigger(l?"ajaxSuccess":"ajaxError",[C,h,l?p:d]),m.fireWith(g,[C,T]),f&&(v.trigger("ajaxComplete",[C,h]),--Ce.active||Ce.event.trigger("ajaxStop")))}"object"==typeof t&&(n=t,t=void 0),n=n||{};var i,o,a,s,u,l,c,f,p,d,h=Ce.ajaxSetup({},n),g=h.context||h,v=h.context&&(g.nodeType||g.jquery)?Ce(g):Ce.event,y=Ce.Deferred(),m=Ce.Callbacks("once memory"),x=h.statusCode||{},b={},w={},T="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(c){if(!s)for(s={};t=_t.exec(a);)s[t[1].toLowerCase()+" "]=(s[t[1].toLowerCase()+" "]||[]).concat(t[2]);t=s[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return c?a:null},setRequestHeader:function(e,t){return null==c&&(e=w[e.toLowerCase()]=w[e.toLowerCase()]||e,b[e]=t),this},overrideMimeType:function(e){return null==c&&(h.mimeType=e),this},statusCode:function(e){var t;if(e)if(c)C.always(e[C.status]);else for(t in e)x[t]=[x[t],e[t]];return this},abort:function(e){var t=e||T;return i&&i.abort(t),r(0,t),this}};if(y.promise(C),h.url=((t||h.url||Ht.href)+"").replace(Xt,Ht.protocol+"//"),h.type=n.method||n.type||h.method||h.type,h.dataTypes=(h.dataType||"*").toLowerCase().match(Oe)||[""],null==h.crossDomain){l=ue.createElement("a");try{l.href=h.url,l.href=l.href,h.crossDomain=Qt.protocol+"//"+Qt.host!=l.protocol+"//"+l.host}catch(e){h.crossDomain=!0}}if(h.data&&h.processData&&"string"!=typeof h.data&&(h.data=Ce.param(h.data,h.traditional)),re(Vt,h,n,C),c)return C;f=Ce.event&&h.global,f&&0==Ce.active++&&Ce.event.trigger("ajaxStart"),h.type=h.type.toUpperCase(),h.hasContent=!Ut.test(h.type),o=h.url.replace(Ft,""),h.hasContent?h.data&&h.processData&&0===(h.contentType||"").indexOf("application/x-www-form-urlencoded")&&(h.data=h.data.replace($t,"+")):(d=h.url.slice(o.length),h.data&&(h.processData||"string"==typeof h.data)&&(o+=(Pt.test(o)?"&":"?")+h.data,delete h.data),!1===h.cache&&(o=o.replace(Bt,"$1"),d=(Pt.test(o)?"&":"?")+"_="+Ot+++d),h.url=o+d),h.ifModified&&(Ce.lastModified[o]&&C.setRequestHeader("If-Modified-Since",Ce.lastModified[o]),Ce.etag[o]&&C.setRequestHeader("If-None-Match",Ce.etag[o])),(h.data&&h.hasContent&&!1!==h.contentType||n.contentType)&&C.setRequestHeader("Content-Type",h.contentType),C.setRequestHeader("Accept",h.dataTypes[0]&&h.accepts[h.dataTypes[0]]?h.accepts[h.dataTypes[0]]+("*"!==h.dataTypes[0]?", "+Yt+"; q=0.01":""):h.accepts["*"]);for(p in h.headers)C.setRequestHeader(p,h.headers[p]);if(h.beforeSend&&(!1===h.beforeSend.call(g,C,h)||c))return C.abort();if(T="abort",m.add(h.complete),C.done(h.success),C.fail(h.error),i=re(Gt,h,n,C)){if(C.readyState=1,f&&v.trigger("ajaxSend",[C,h]),c)return C;h.async&&h.timeout>0&&(u=e.setTimeout(function(){C.abort("timeout")},h.timeout));try{c=!1,i.send(b,r)}catch(e){if(c)throw e;r(-1,e)}}else r(-1,"No Transport");return C},getJSON:function(e,t,n){return Ce.get(e,t,n,"json")},getScript:function(e,t){return Ce.get(e,void 0,t,"script")}}),Ce.each(["get","post"],function(e,t){Ce[t]=function(e,n,r,i){return be(n)&&(i=i||r,r=n,n=void 0),Ce.ajax(Ce.extend({url:e,type:t,dataType:i,data:n,success:r},Ce.isPlainObject(e)&&e))}}),Ce._evalUrl=function(e,t){return Ce.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){Ce.globalEval(e,t)}})},Ce.fn.extend({wrapAll:function(e){var t;return this[0]&&(be(e)&&(e=e.call(this[0])),t=Ce(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstElementChild;)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return be(e)?this.each(function(t){Ce(this).wrapInner(e.call(this,t))}):this.each(function(){var t=Ce(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=be(e);return this.each(function(n){Ce(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){Ce(this).replaceWith(this.childNodes)}),this}}),Ce.expr.pseudos.hidden=function(e){return!Ce.expr.pseudos.visible(e)},Ce.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},Ce.ajaxSettings.xhr=function(){try{return new e.XMLHttpRequest}catch(e){}};var Jt={0:200,1223:204},Kt=Ce.ajaxSettings.xhr();xe.cors=!!Kt&&"withCredentials"in Kt,xe.ajax=Kt=!!Kt,Ce.ajaxTransport(function(t){var n,r;if(xe.cors||Kt&&!t.crossDomain)return{send:function(i,o){var a,s=t.xhr();if(s.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(a in t.xhrFields)s[a]=t.xhrFields[a];t.mimeType&&s.overrideMimeType&&s.overrideMimeType(t.mimeType),t.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(a in i)s.setRequestHeader(a,i[a]);n=function(e){return function(){n&&(n=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(Jt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=n(),r=s.onerror=s.ontimeout=n("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&e.setTimeout(function(){n&&r()})},n=n("abort");try{s.send(t.hasContent&&t.data||null)}catch(e){if(n)throw e}},abort:function(){n&&n()}}}),Ce.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),Ce.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return Ce.globalEval(e),e}}}),Ce.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),Ce.ajaxTransport("script",function(e){if(e.crossDomain||e.scriptAttrs){var t,n;return{send:function(r,i){t=Ce("<script>").attr(e.scriptAttrs||{}).prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&i("error"===e.type?404:200,e.type)}),ue.head.appendChild(t[0])},abort:function(){n&&n()}}}});var Zt=[],en=/(=)\?(?=&|$)|\?\?/;Ce.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Zt.pop()||Ce.expando+"_"+Ot++;return this[e]=!0,e}}),Ce.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,a,s=!1!==t.jsonp&&(en.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&en.test(t.data)&&"data");if(s||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=be(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(en,"$1"+i):!1!==t.jsonp&&(t.url+=(Pt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return a||Ce.error(i+" was not called"),a[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){a=arguments},r.always(function(){void 0===o?Ce(e).removeProp(i):e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,Zt.push(i)),a&&be(o)&&o(a[0]),a=o=void 0}),"script"}),xe.createHTMLDocument=function(){var e=ue.implementation.createHTMLDocument("").body;return e.innerHTML="<form></form><form></form>",2===e.childNodes.length}(),Ce.parseHTML=function(e,t,n){if("string"!=typeof e)return[];"boolean"==typeof t&&(n=t,t=!1);var r,i,o;return t||(xe.createHTMLDocument?(t=ue.implementation.createHTMLDocument(""),r=t.createElement("base"),r.href=ue.location.href,t.head.appendChild(r)):t=ue),i=De.exec(e),o=!n&&[],i?[t.createElement(i[1])]:(i=C([e],t,o),o&&o.length&&Ce(o).remove(),Ce.merge([],i.childNodes))},Ce.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return s>-1&&(r=K(e.slice(s)),e=e.slice(0,s)),be(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),a.length>0&&Ce.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?Ce("<div>").append(Ce.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},Ce.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){Ce.fn[t]=function(e){return this.on(t,e)}}),Ce.expr.pseudos.animated=function(e){return Ce.grep(Ce.timers,function(t){return e===t.elem}).length},Ce.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l,c=Ce.css(e,"position"),f=Ce(e),p={};"static"===c&&(e.style.position="relative"),s=f.offset(),o=Ce.css(e,"top"),u=Ce.css(e,"left"),l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1,l?(r=f.position(),a=r.top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),be(t)&&(t=t.call(e,n,Ce.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),"using"in t?t.using.call(e,p):f.css(p)}},Ce.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){Ce.offset.setOffset(this,e,t)});var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===Ce.css(r,"position"))t=r.getBoundingClientRect();else{for(t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;e&&(e===n.body||e===n.documentElement)&&"static"===Ce.css(e,"position");)e=e.parentNode;e&&e!==r&&1===e.nodeType&&(i=Ce(e).offset(),i.top+=Ce.css(e,"borderTopWidth",!0),i.left+=Ce.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-Ce.css(r,"marginTop",!0),left:t.left-i.left-Ce.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent;e&&"static"===Ce.css(e,"position");)e=e.offsetParent;return e||Ge})}}),Ce.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;Ce.fn[e]=function(r){return Me(this,function(e,r,i){var o;if(we(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i},e,r,arguments.length)}}),Ce.each(["top","left"],function(e,t){Ce.cssHooks[t]=I(xe.pixelPosition,function(e,n){if(n)return n=M(e,t),pt.test(n)?Ce(e).position()[t]+"px":n})}),Ce.each({Height:"height",Width:"width"},function(e,t){Ce.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){Ce.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(!0===i||!0===o?"margin":"border");return Me(this,function(t,n,i){var o;return we(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):void 0===i?Ce.css(t,n,s):Ce.style(t,n,i,s)},t,a?i:void 0,a)}})}),Ce.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){Ce.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),Ce.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),Ce.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),Ce.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),be(e))return r=ce.call(arguments,2),i=function(){return e.apply(t||this,r.concat(ce.call(arguments)))},i.guid=e.guid=e.guid||Ce.guid++,i},Ce.holdReady=function(e){e?Ce.readyWait++:Ce.ready(!0)},Ce.isArray=Array.isArray,Ce.parseJSON=JSON.parse,Ce.nodeName=o,Ce.isFunction=be,Ce.isWindow=we,Ce.camelCase=h,Ce.type=r,Ce.now=Date.now,Ce.isNumeric=function(e){var t=Ce.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return Ce});var tn=e.jQuery,nn=e.$;return Ce.noConflict=function(t){return e.$===Ce&&(e.$=nn),t&&e.jQuery===Ce&&(e.jQuery=tn),Ce},t||(e.jQuery=e.$=Ce),Ce});
},{}],86:[function(require,module,exports){
(function (global){
(function(){function n(n,t,r){switch(r.length){case 0:return n.call(t);case 1:return n.call(t,r[0]);case 2:return n.call(t,r[0],r[1]);case 3:return n.call(t,r[0],r[1],r[2])}return n.apply(t,r)}function t(n,t,r,e){for(var u=-1,i=null==n?0:n.length;++u<i;){var o=n[u];t(e,o,r(o),n)}return e}function r(n,t){for(var r=-1,e=null==n?0:n.length;++r<e&&!1!==t(n[r],r,n););return n}function e(n,t){for(var r=null==n?0:n.length;r--&&!1!==t(n[r],r,n););return n}function u(n,t){for(var r=-1,e=null==n?0:n.length;++r<e;)if(!t(n[r],r,n))return!1;return!0}function i(n,t){for(var r=-1,e=null==n?0:n.length,u=0,i=[];++r<e;){var o=n[r];t(o,r,n)&&(i[u++]=o)}return i}function o(n,t){return!!(null==n?0:n.length)&&y(n,t,0)>-1}function f(n,t,r){for(var e=-1,u=null==n?0:n.length;++e<u;)if(r(t,n[e]))return!0;return!1}function c(n,t){for(var r=-1,e=null==n?0:n.length,u=Array(e);++r<e;)u[r]=t(n[r],r,n);return u}function a(n,t){for(var r=-1,e=t.length,u=n.length;++r<e;)n[u+r]=t[r];return n}function l(n,t,r,e){var u=-1,i=null==n?0:n.length;for(e&&i&&(r=n[++u]);++u<i;)r=t(r,n[u],u,n);return r}function s(n,t,r,e){var u=null==n?0:n.length;for(e&&u&&(r=n[--u]);u--;)r=t(r,n[u],u,n);return r}function h(n,t){for(var r=-1,e=null==n?0:n.length;++r<e;)if(t(n[r],r,n))return!0;return!1}function p(n){return n.split("")}function _(n){return n.match(Wt)||[]}function v(n,t,r){var e;return r(n,function(n,r,u){if(t(n,r,u))return e=r,!1}),e}function g(n,t,r,e){for(var u=n.length,i=r+(e?1:-1);e?i--:++i<u;)if(t(n[i],i,n))return i;return-1}function y(n,t,r){return t===t?q(n,t,r):g(n,b,r)}function d(n,t,r,e){for(var u=r-1,i=n.length;++u<i;)if(e(n[u],t))return u;return-1}function b(n){return n!==n}function w(n,t){var r=null==n?0:n.length;return r?k(n,t)/r:zn}function m(n){return function(t){return null==t?Y:t[n]}}function x(n){return function(t){return null==n?Y:n[t]}}function j(n,t,r,e,u){return u(n,function(n,u,i){r=e?(e=!1,n):t(r,n,u,i)}),r}function A(n,t){var r=n.length;for(n.sort(t);r--;)n[r]=n[r].value;return n}function k(n,t){for(var r,e=-1,u=n.length;++e<u;){var i=t(n[e]);i!==Y&&(r=r===Y?i:r+i)}return r}function O(n,t){for(var r=-1,e=Array(n);++r<n;)e[r]=t(r);return e}function I(n,t){return c(t,function(t){return[t,n[t]]})}function R(n){return function(t){return n(t)}}function z(n,t){return c(t,function(t){return n[t]})}function E(n,t){return n.has(t)}function S(n,t){for(var r=-1,e=n.length;++r<e&&y(t,n[r],0)>-1;);return r}function L(n,t){for(var r=n.length;r--&&y(t,n[r],0)>-1;);return r}function W(n,t){for(var r=n.length,e=0;r--;)n[r]===t&&++e;return e}function C(n){return"\\"+wr[n]}function U(n,t){return null==n?Y:n[t]}function B(n){return sr.test(n)}function T(n){return hr.test(n)}function $(n){for(var t,r=[];!(t=n.next()).done;)r.push(t.value);return r}function D(n){var t=-1,r=Array(n.size);return n.forEach(function(n,e){r[++t]=[e,n]}),r}function M(n,t){return function(r){return n(t(r))}}function F(n,t){for(var r=-1,e=n.length,u=0,i=[];++r<e;){var o=n[r];o!==t&&o!==en||(n[r]=en,i[u++]=r)}return i}function N(n){var t=-1,r=Array(n.size);return n.forEach(function(n){r[++t]=n}),r}function P(n){var t=-1,r=Array(n.size);return n.forEach(function(n){r[++t]=[n,n]}),r}function q(n,t,r){for(var e=r-1,u=n.length;++e<u;)if(n[e]===t)return e;return-1}function Z(n,t,r){for(var e=r+1;e--;)if(n[e]===t)return e;return e}function K(n){return B(n)?G(n):Tr(n)}function V(n){return B(n)?H(n):p(n)}function G(n){for(var t=ar.lastIndex=0;ar.test(n);)++t;return t}function H(n){return n.match(ar)||[]}function J(n){return n.match(lr)||[]}var Y,Q=200,X="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",nn="Expected a function",tn="__lodash_hash_undefined__",rn=500,en="__lodash_placeholder__",un=1,on=2,fn=4,cn=1,an=2,ln=1,sn=2,hn=4,pn=8,_n=16,vn=32,gn=64,yn=128,dn=256,bn=512,wn=30,mn="...",xn=800,jn=16,An=1,kn=2,On=1/0,In=9007199254740991,Rn=1.7976931348623157e308,zn=NaN,En=4294967295,Sn=En-1,Ln=En>>>1,Wn=[["ary",yn],["bind",ln],["bindKey",sn],["curry",pn],["curryRight",_n],["flip",bn],["partial",vn],["partialRight",gn],["rearg",dn]],Cn="[object Arguments]",Un="[object Array]",Bn="[object AsyncFunction]",Tn="[object Boolean]",$n="[object Date]",Dn="[object DOMException]",Mn="[object Error]",Fn="[object Function]",Nn="[object GeneratorFunction]",Pn="[object Map]",qn="[object Number]",Zn="[object Null]",Kn="[object Object]",Vn="[object Proxy]",Gn="[object RegExp]",Hn="[object Set]",Jn="[object String]",Yn="[object Symbol]",Qn="[object Undefined]",Xn="[object WeakMap]",nt="[object WeakSet]",tt="[object ArrayBuffer]",rt="[object DataView]",et="[object Float32Array]",ut="[object Float64Array]",it="[object Int8Array]",ot="[object Int16Array]",ft="[object Int32Array]",ct="[object Uint8Array]",at="[object Uint8ClampedArray]",lt="[object Uint16Array]",st="[object Uint32Array]",ht=/\b__p \+= '';/g,pt=/\b(__p \+=) '' \+/g,_t=/(__e\(.*?\)|\b__t\)) \+\n'';/g,vt=/&(?:amp|lt|gt|quot|#39);/g,gt=/[&<>"']/g,yt=RegExp(vt.source),dt=RegExp(gt.source),bt=/<%-([\s\S]+?)%>/g,wt=/<%([\s\S]+?)%>/g,mt=/<%=([\s\S]+?)%>/g,xt=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,jt=/^\w*$/,At=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,kt=/[\\^$.*+?()[\]{}|]/g,Ot=RegExp(kt.source),It=/^\s+|\s+$/g,Rt=/^\s+/,zt=/\s+$/,Et=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,St=/\{\n\/\* \[wrapped with (.+)\] \*/,Lt=/,? & /,Wt=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,Ct=/\\(\\)?/g,Ut=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Bt=/\w*$/,Tt=/^[-+]0x[0-9a-f]+$/i,$t=/^0b[01]+$/i,Dt=/^\[object .+?Constructor\]$/,Mt=/^0o[0-7]+$/i,Ft=/^(?:0|[1-9]\d*)$/,Nt=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Pt=/($^)/,qt=/['\n\r\u2028\u2029\\]/g,Zt="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",Kt="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",Vt="["+Kt+"]",Gt="["+Zt+"]",Ht="[a-z\\xdf-\\xf6\\xf8-\\xff]",Jt="[^\\ud800-\\udfff"+Kt+"\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",Yt="\\ud83c[\\udffb-\\udfff]",Qt="(?:\\ud83c[\\udde6-\\uddff]){2}",Xt="[\\ud800-\\udbff][\\udc00-\\udfff]",nr="[A-Z\\xc0-\\xd6\\xd8-\\xde]",tr="(?:"+Ht+"|"+Jt+")",rr="(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?",er="(?:\\u200d(?:"+["[^\\ud800-\\udfff]",Qt,Xt].join("|")+")[\\ufe0e\\ufe0f]?"+rr+")*",ur="[\\ufe0e\\ufe0f]?"+rr+er,ir="(?:"+["[\\u2700-\\u27bf]",Qt,Xt].join("|")+")"+ur,or="(?:"+["[^\\ud800-\\udfff]"+Gt+"?",Gt,Qt,Xt,"[\\ud800-\\udfff]"].join("|")+")",fr=RegExp("['’]","g"),cr=RegExp(Gt,"g"),ar=RegExp(Yt+"(?="+Yt+")|"+or+ur,"g"),lr=RegExp([nr+"?"+Ht+"+(?:['’](?:d|ll|m|re|s|t|ve))?(?="+[Vt,nr,"$"].join("|")+")","(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?="+[Vt,nr+tr,"$"].join("|")+")",nr+"?"+tr+"+(?:['’](?:d|ll|m|re|s|t|ve))?",nr+"+(?:['’](?:D|LL|M|RE|S|T|VE))?","\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])","\\d+",ir].join("|"),"g"),sr=RegExp("[\\u200d\\ud800-\\udfff"+Zt+"\\ufe0e\\ufe0f]"),hr=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,pr=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],_r=-1,vr={};vr[et]=vr[ut]=vr[it]=vr[ot]=vr[ft]=vr[ct]=vr[at]=vr[lt]=vr[st]=!0,vr[Cn]=vr[Un]=vr[tt]=vr[Tn]=vr[rt]=vr[$n]=vr[Mn]=vr[Fn]=vr[Pn]=vr[qn]=vr[Kn]=vr[Gn]=vr[Hn]=vr[Jn]=vr[Xn]=!1;var gr={};gr[Cn]=gr[Un]=gr[tt]=gr[rt]=gr[Tn]=gr[$n]=gr[et]=gr[ut]=gr[it]=gr[ot]=gr[ft]=gr[Pn]=gr[qn]=gr[Kn]=gr[Gn]=gr[Hn]=gr[Jn]=gr[Yn]=gr[ct]=gr[at]=gr[lt]=gr[st]=!0,gr[Mn]=gr[Fn]=gr[Xn]=!1;var yr={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"},dr={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},br={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},wr={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},mr=parseFloat,xr=parseInt,jr="object"==typeof global&&global&&global.Object===Object&&global,Ar="object"==typeof self&&self&&self.Object===Object&&self,kr=jr||Ar||Function("return this")(),Or="object"==typeof exports&&exports&&!exports.nodeType&&exports,Ir=Or&&"object"==typeof module&&module&&!module.nodeType&&module,Rr=Ir&&Ir.exports===Or,zr=Rr&&jr.process,Er=function(){try{var n=Ir&&Ir.require&&Ir.require("util").types;return n||zr&&zr.binding&&zr.binding("util")}catch(n){}}(),Sr=Er&&Er.isArrayBuffer,Lr=Er&&Er.isDate,Wr=Er&&Er.isMap,Cr=Er&&Er.isRegExp,Ur=Er&&Er.isSet,Br=Er&&Er.isTypedArray,Tr=m("length"),$r=x(yr),Dr=x(dr),Mr=x(br),Fr=function p(x){function q(n){if(rc(n)&&!ph(n)&&!(n instanceof Wt)){if(n instanceof H)return n;if(pl.call(n,"__wrapped__"))return Yi(n)}return new H(n)}function G(){}function H(n,t){this.__wrapped__=n,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=Y}function Wt(n){this.__wrapped__=n,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=En,this.__views__=[]}function Zt(){var n=new Wt(this.__wrapped__);return n.__actions__=Lu(this.__actions__),n.__dir__=this.__dir__,n.__filtered__=this.__filtered__,n.__iteratees__=Lu(this.__iteratees__),n.__takeCount__=this.__takeCount__,n.__views__=Lu(this.__views__),n}function Kt(){if(this.__filtered__){var n=new Wt(this);n.__dir__=-1,n.__filtered__=!0}else n=this.clone(),n.__dir__*=-1;return n}function Vt(){var n=this.__wrapped__.value(),t=this.__dir__,r=ph(n),e=t<0,u=r?n.length:0,i=mi(0,u,this.__views__),o=i.start,f=i.end,c=f-o,a=e?f:o-1,l=this.__iteratees__,s=l.length,h=0,p=Pl(c,this.__takeCount__);if(!r||!e&&u==c&&p==c)return vu(n,this.__actions__);var _=[];n:for(;c--&&h<p;){a+=t;for(var v=-1,g=n[a];++v<s;){var y=l[v],d=y.iteratee,b=y.type,w=d(g);if(b==kn)g=w;else if(!w){if(b==An)continue n;break n}}_[h++]=g}return _}function Gt(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function Ht(){this.__data__=Xl?Xl(null):{},this.size=0}function Jt(n){var t=this.has(n)&&delete this.__data__[n];return this.size-=t?1:0,t}function Yt(n){var t=this.__data__;if(Xl){var r=t[n];return r===tn?Y:r}return pl.call(t,n)?t[n]:Y}function Qt(n){var t=this.__data__;return Xl?t[n]!==Y:pl.call(t,n)}function Xt(n,t){var r=this.__data__;return this.size+=this.has(n)?0:1,r[n]=Xl&&t===Y?tn:t,this}function nr(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function tr(){this.__data__=[],this.size=0}function rr(n){var t=this.__data__,r=Vr(t,n);return!(r<0)&&(r==t.length-1?t.pop():Il.call(t,r,1),--this.size,!0)}function er(n){var t=this.__data__,r=Vr(t,n);return r<0?Y:t[r][1]}function ur(n){return Vr(this.__data__,n)>-1}function ir(n,t){var r=this.__data__,e=Vr(r,n);return e<0?(++this.size,r.push([n,t])):r[e][1]=t,this}function or(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function ar(){this.size=0,this.__data__={hash:new Gt,map:new(Hl||nr),string:new Gt}}function lr(n){var t=yi(this,n).delete(n);return this.size-=t?1:0,t}function sr(n){return yi(this,n).get(n)}function hr(n){return yi(this,n).has(n)}function yr(n,t){var r=yi(this,n),e=r.size;return r.set(n,t),this.size+=r.size==e?0:1,this}function dr(n){var t=-1,r=null==n?0:n.length;for(this.__data__=new or;++t<r;)this.add(n[t])}function br(n){return this.__data__.set(n,tn),this}function wr(n){return this.__data__.has(n)}function jr(n){var t=this.__data__=new nr(n);this.size=t.size}function Ar(){this.__data__=new nr,this.size=0}function Or(n){var t=this.__data__,r=t.delete(n);return this.size=t.size,r}function Ir(n){return this.__data__.get(n)}function zr(n){return this.__data__.has(n)}function Er(n,t){var r=this.__data__;if(r instanceof nr){var e=r.__data__;if(!Hl||e.length<Q-1)return e.push([n,t]),this.size=++r.size,this;r=this.__data__=new or(e)}return r.set(n,t),this.size=r.size,this}function Tr(n,t){var r=ph(n),e=!r&&hh(n),u=!r&&!e&&vh(n),i=!r&&!e&&!u&&wh(n),o=r||e||u||i,f=o?O(n.length,ol):[],c=f.length;for(var a in n)!t&&!pl.call(n,a)||o&&("length"==a||u&&("offset"==a||"parent"==a)||i&&("buffer"==a||"byteLength"==a||"byteOffset"==a)||zi(a,c))||f.push(a);return f}function Nr(n){var t=n.length;return t?n[Je(0,t-1)]:Y}function Pr(n,t){return Vi(Lu(n),Xr(t,0,n.length))}function qr(n){return Vi(Lu(n))}function Zr(n,t,r){(r===Y||Nf(n[t],r))&&(r!==Y||t in n)||Yr(n,t,r)}function Kr(n,t,r){var e=n[t];pl.call(n,t)&&Nf(e,r)&&(r!==Y||t in n)||Yr(n,t,r)}function Vr(n,t){for(var r=n.length;r--;)if(Nf(n[r][0],t))return r;return-1}function Gr(n,t,r,e){return ss(n,function(n,u,i){t(e,n,r(n),i)}),e}function Hr(n,t){return n&&Wu(t,Tc(t),n)}function Jr(n,t){return n&&Wu(t,$c(t),n)}function Yr(n,t,r){"__proto__"==t&&Sl?Sl(n,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):n[t]=r}function Qr(n,t){for(var r=-1,e=t.length,u=Xa(e),i=null==n;++r<e;)u[r]=i?Y:Cc(n,t[r]);return u}function Xr(n,t,r){return n===n&&(r!==Y&&(n=n<=r?n:r),t!==Y&&(n=n>=t?n:t)),n}function ne(n,t,e,u,i,o){var f,c=t&un,a=t&on,l=t&fn;if(e&&(f=i?e(n,u,i,o):e(n)),f!==Y)return f;if(!tc(n))return n;var s=ph(n);if(s){if(f=Ai(n),!c)return Lu(n,f)}else{var h=js(n),p=h==Fn||h==Nn;if(vh(n))return xu(n,c);if(h==Kn||h==Cn||p&&!i){if(f=a||p?{}:ki(n),!c)return a?Uu(n,Jr(f,n)):Cu(n,Hr(f,n))}else{if(!gr[h])return i?n:{};f=Oi(n,h,c)}}o||(o=new jr);var _=o.get(n);if(_)return _;o.set(n,f),bh(n)?n.forEach(function(r){f.add(ne(r,t,e,r,n,o))}):yh(n)&&n.forEach(function(r,u){f.set(u,ne(r,t,e,u,n,o))});var v=l?a?pi:hi:a?$c:Tc,g=s?Y:v(n);return r(g||n,function(r,u){g&&(u=r,r=n[u]),Kr(f,u,ne(r,t,e,u,n,o))}),f}function te(n){var t=Tc(n);return function(r){return re(r,n,t)}}function re(n,t,r){var e=r.length;if(null==n)return!e;for(n=ul(n);e--;){var u=r[e],i=t[u],o=n[u];if(o===Y&&!(u in n)||!i(o))return!1}return!0}function ee(n,t,r){if("function"!=typeof n)throw new fl(nn);return Os(function(){n.apply(Y,r)},t)}function ue(n,t,r,e){var u=-1,i=o,a=!0,l=n.length,s=[],h=t.length;if(!l)return s;r&&(t=c(t,R(r))),e?(i=f,a=!1):t.length>=Q&&(i=E,a=!1,t=new dr(t));n:for(;++u<l;){var p=n[u],_=null==r?p:r(p);if(p=e||0!==p?p:0,a&&_===_){for(var v=h;v--;)if(t[v]===_)continue n;s.push(p)}else i(t,_,e)||s.push(p)}return s}function ie(n,t){var r=!0;return ss(n,function(n,e,u){return r=!!t(n,e,u)}),r}function oe(n,t,r){for(var e=-1,u=n.length;++e<u;){var i=n[e],o=t(i);if(null!=o&&(f===Y?o===o&&!pc(o):r(o,f)))var f=o,c=i}return c}function fe(n,t,r,e){var u=n.length;for(r=bc(r),r<0&&(r=-r>u?0:u+r),e=e===Y||e>u?u:bc(e),e<0&&(e+=u),e=r>e?0:wc(e);r<e;)n[r++]=t;return n}function ce(n,t){var r=[];return ss(n,function(n,e,u){t(n,e,u)&&r.push(n)}),r}function ae(n,t,r,e,u){var i=-1,o=n.length;for(r||(r=Ri),u||(u=[]);++i<o;){var f=n[i];t>0&&r(f)?t>1?ae(f,t-1,r,e,u):a(u,f):e||(u[u.length]=f)}return u}function le(n,t){return n&&ps(n,t,Tc)}function se(n,t){return n&&_s(n,t,Tc)}function he(n,t){return i(t,function(t){return Qf(n[t])})}function pe(n,t){t=wu(t,n);for(var r=0,e=t.length;null!=n&&r<e;)n=n[Gi(t[r++])];return r&&r==e?n:Y}function _e(n,t,r){var e=t(n);return ph(n)?e:a(e,r(n))}function ve(n){return null==n?n===Y?Qn:Zn:El&&El in ul(n)?wi(n):Mi(n)}function ge(n,t){return n>t}function ye(n,t){return null!=n&&pl.call(n,t)}function de(n,t){return null!=n&&t in ul(n)}function be(n,t,r){return n>=Pl(t,r)&&n<Nl(t,r)}function we(n,t,r){for(var e=r?f:o,u=n[0].length,i=n.length,a=i,l=Xa(i),s=1/0,h=[];a--;){var p=n[a];a&&t&&(p=c(p,R(t))),s=Pl(p.length,s),l[a]=!r&&(t||u>=120&&p.length>=120)?new dr(a&&p):Y}p=n[0];var _=-1,v=l[0];n:for(;++_<u&&h.length<s;){var g=p[_],y=t?t(g):g;if(g=r||0!==g?g:0,!(v?E(v,y):e(h,y,r))){for(a=i;--a;){var d=l[a];if(!(d?E(d,y):e(n[a],y,r)))continue n}v&&v.push(y),h.push(g)}}return h}function me(n,t,r,e){return le(n,function(n,u,i){t(e,r(n),u,i)}),e}function xe(t,r,e){r=wu(r,t),t=Ni(t,r);var u=null==t?t:t[Gi(go(r))];return null==u?Y:n(u,t,e)}function je(n){return rc(n)&&ve(n)==Cn}function Ae(n){return rc(n)&&ve(n)==tt}function ke(n){return rc(n)&&ve(n)==$n}function Oe(n,t,r,e,u){return n===t||(null==n||null==t||!rc(n)&&!rc(t)?n!==n&&t!==t:Ie(n,t,r,e,Oe,u))}function Ie(n,t,r,e,u,i){var o=ph(n),f=ph(t),c=o?Un:js(n),a=f?Un:js(t);c=c==Cn?Kn:c,a=a==Cn?Kn:a;var l=c==Kn,s=a==Kn,h=c==a;if(h&&vh(n)){if(!vh(t))return!1;o=!0,l=!1}if(h&&!l)return i||(i=new jr),o||wh(n)?ci(n,t,r,e,u,i):ai(n,t,c,r,e,u,i);if(!(r&cn)){var p=l&&pl.call(n,"__wrapped__"),_=s&&pl.call(t,"__wrapped__");if(p||_){var v=p?n.value():n,g=_?t.value():t;return i||(i=new jr),u(v,g,r,e,i)}}return!!h&&(i||(i=new jr),li(n,t,r,e,u,i))}function Re(n){return rc(n)&&js(n)==Pn}function ze(n,t,r,e){var u=r.length,i=u,o=!e;if(null==n)return!i;for(n=ul(n);u--;){var f=r[u];if(o&&f[2]?f[1]!==n[f[0]]:!(f[0]in n))return!1}for(;++u<i;){f=r[u];var c=f[0],a=n[c],l=f[1];if(o&&f[2]){if(a===Y&&!(c in n))return!1}else{var s=new jr;if(e)var h=e(a,l,c,n,t,s);if(!(h===Y?Oe(l,a,cn|an,e,s):h))return!1}}return!0}function Ee(n){return!(!tc(n)||Ci(n))&&(Qf(n)?bl:Dt).test(Hi(n))}function Se(n){return rc(n)&&ve(n)==Gn}function Le(n){return rc(n)&&js(n)==Hn}function We(n){return rc(n)&&nc(n.length)&&!!vr[ve(n)]}function Ce(n){return"function"==typeof n?n:null==n?Ia:"object"==typeof n?ph(n)?Me(n[0],n[1]):De(n):Ua(n)}function Ue(n){if(!Ui(n))return Fl(n);var t=[];for(var r in ul(n))pl.call(n,r)&&"constructor"!=r&&t.push(r);return t}function Be(n){if(!tc(n))return Di(n);var t=Ui(n),r=[];for(var e in n)("constructor"!=e||!t&&pl.call(n,e))&&r.push(e);return r}function Te(n,t){return n<t}function $e(n,t){var r=-1,e=Pf(n)?Xa(n.length):[];return ss(n,function(n,u,i){e[++r]=t(n,u,i)}),e}function De(n){var t=di(n);return 1==t.length&&t[0][2]?Ti(t[0][0],t[0][1]):function(r){return r===n||ze(r,n,t)}}function Me(n,t){return Si(n)&&Bi(t)?Ti(Gi(n),t):function(r){var e=Cc(r,n);return e===Y&&e===t?Bc(r,n):Oe(t,e,cn|an)}}function Fe(n,t,r,e,u){n!==t&&ps(t,function(i,o){if(u||(u=new jr),tc(i))Ne(n,t,o,r,Fe,e,u);else{var f=e?e(qi(n,o),i,o+"",n,t,u):Y;f===Y&&(f=i),Zr(n,o,f)}},$c)}function Ne(n,t,r,e,u,i,o){var f=qi(n,r),c=qi(t,r),a=o.get(c);if(a)return void Zr(n,r,a);var l=i?i(f,c,r+"",n,t,o):Y,s=l===Y;if(s){var h=ph(c),p=!h&&vh(c),_=!h&&!p&&wh(c);l=c,h||p||_?ph(f)?l=f:qf(f)?l=Lu(f):p?(s=!1,l=xu(c,!0)):_?(s=!1,l=Iu(c,!0)):l=[]:lc(c)||hh(c)?(l=f,hh(f)?l=xc(f):tc(f)&&!Qf(f)||(l=ki(c))):s=!1}s&&(o.set(c,l),u(l,c,e,i,o),o.delete(c)),Zr(n,r,l)}function Pe(n,t){var r=n.length;if(r)return t+=t<0?r:0,zi(t,r)?n[t]:Y}function qe(n,t,r){var e=-1;return t=c(t.length?t:[Ia],R(gi())),A($e(n,function(n,r,u){return{criteria:c(t,function(t){return t(n)}),index:++e,value:n}}),function(n,t){return zu(n,t,r)})}function Ze(n,t){return Ke(n,t,function(t,r){return Bc(n,r)})}function Ke(n,t,r){for(var e=-1,u=t.length,i={};++e<u;){var o=t[e],f=pe(n,o);r(f,o)&&ru(i,wu(o,n),f)}return i}function Ve(n){return function(t){return pe(t,n)}}function Ge(n,t,r,e){var u=e?d:y,i=-1,o=t.length,f=n;for(n===t&&(t=Lu(t)),r&&(f=c(n,R(r)));++i<o;)for(var a=0,l=t[i],s=r?r(l):l;(a=u(f,s,a,e))>-1;)f!==n&&Il.call(f,a,1),Il.call(n,a,1);return n}function He(n,t){for(var r=n?t.length:0,e=r-1;r--;){var u=t[r];if(r==e||u!==i){var i=u;zi(u)?Il.call(n,u,1):hu(n,u)}}return n}function Je(n,t){return n+Bl(Kl()*(t-n+1))}function Ye(n,t,r,e){for(var u=-1,i=Nl(Ul((t-n)/(r||1)),0),o=Xa(i);i--;)o[e?i:++u]=n,n+=r;return o}function Qe(n,t){var r="";if(!n||t<1||t>In)return r;do{t%2&&(r+=n),(t=Bl(t/2))&&(n+=n)}while(t);return r}function Xe(n,t){return Is(Fi(n,t,Ia),n+"")}function nu(n){return Nr(Jc(n))}function tu(n,t){var r=Jc(n);return Vi(r,Xr(t,0,r.length))}function ru(n,t,r,e){if(!tc(n))return n;t=wu(t,n);for(var u=-1,i=t.length,o=i-1,f=n;null!=f&&++u<i;){var c=Gi(t[u]),a=r;if(u!=o){var l=f[c];a=e?e(l,c,f):Y,a===Y&&(a=tc(l)?l:zi(t[u+1])?[]:{})}Kr(f,c,a),f=f[c]}return n}function eu(n){return Vi(Jc(n))}function uu(n,t,r){var e=-1,u=n.length;t<0&&(t=-t>u?0:u+t),r=r>u?u:r,r<0&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0;for(var i=Xa(u);++e<u;)i[e]=n[e+t];return i}function iu(n,t){var r;return ss(n,function(n,e,u){return!(r=t(n,e,u))}),!!r}function ou(n,t,r){var e=0,u=null==n?e:n.length;if("number"==typeof t&&t===t&&u<=Ln){for(;e<u;){var i=e+u>>>1,o=n[i];null!==o&&!pc(o)&&(r?o<=t:o<t)?e=i+1:u=i}return u}return fu(n,t,Ia,r)}function fu(n,t,r,e){t=r(t);for(var u=0,i=null==n?0:n.length,o=t!==t,f=null===t,c=pc(t),a=t===Y;u<i;){var l=Bl((u+i)/2),s=r(n[l]),h=s!==Y,p=null===s,_=s===s,v=pc(s);if(o)var g=e||_;else g=a?_&&(e||h):f?_&&h&&(e||!p):c?_&&h&&!p&&(e||!v):!p&&!v&&(e?s<=t:s<t);g?u=l+1:i=l}return Pl(i,Sn)}function cu(n,t){for(var r=-1,e=n.length,u=0,i=[];++r<e;){var o=n[r],f=t?t(o):o;if(!r||!Nf(f,c)){var c=f;i[u++]=0===o?0:o}}return i}function au(n){return"number"==typeof n?n:pc(n)?zn:+n}function lu(n){if("string"==typeof n)return n;if(ph(n))return c(n,lu)+"";if(pc(n))return as?as.call(n):"";var t=n+"";return"0"==t&&1/n==-On?"-0":t}function su(n,t,r){var e=-1,u=o,i=n.length,c=!0,a=[],l=a;if(r)c=!1,u=f;else if(i>=Q){var s=t?null:bs(n);if(s)return N(s);c=!1,u=E,l=new dr}else l=t?[]:a;n:for(;++e<i;){var h=n[e],p=t?t(h):h;if(h=r||0!==h?h:0,c&&p===p){for(var _=l.length;_--;)if(l[_]===p)continue n;t&&l.push(p),a.push(h)}else u(l,p,r)||(l!==a&&l.push(p),a.push(h))}return a}function hu(n,t){return t=wu(t,n),null==(n=Ni(n,t))||delete n[Gi(go(t))]}function pu(n,t,r,e){return ru(n,t,r(pe(n,t)),e)}function _u(n,t,r,e){for(var u=n.length,i=e?u:-1;(e?i--:++i<u)&&t(n[i],i,n););return r?uu(n,e?0:i,e?i+1:u):uu(n,e?i+1:0,e?u:i)}function vu(n,t){var r=n;return r instanceof Wt&&(r=r.value()),l(t,function(n,t){return t.func.apply(t.thisArg,a([n],t.args))},r)}function gu(n,t,r){var e=n.length;if(e<2)return e?su(n[0]):[];for(var u=-1,i=Xa(e);++u<e;)for(var o=n[u],f=-1;++f<e;)f!=u&&(i[u]=ue(i[u]||o,n[f],t,r));return su(ae(i,1),t,r)}function yu(n,t,r){for(var e=-1,u=n.length,i=t.length,o={};++e<u;){var f=e<i?t[e]:Y;r(o,n[e],f)}return o}function du(n){return qf(n)?n:[]}function bu(n){return"function"==typeof n?n:Ia}function wu(n,t){return ph(n)?n:Si(n,t)?[n]:Rs(Ac(n))}function mu(n,t,r){var e=n.length;return r=r===Y?e:r,!t&&r>=e?n:uu(n,t,r)}function xu(n,t){if(t)return n.slice();var r=n.length,e=jl?jl(r):new n.constructor(r);return n.copy(e),e}function ju(n){var t=new n.constructor(n.byteLength);return new xl(t).set(new xl(n)),t}function Au(n,t){var r=t?ju(n.buffer):n.buffer;return new n.constructor(r,n.byteOffset,n.byteLength)}function ku(n){var t=new n.constructor(n.source,Bt.exec(n));return t.lastIndex=n.lastIndex,t}function Ou(n){return cs?ul(cs.call(n)):{}}function Iu(n,t){var r=t?ju(n.buffer):n.buffer;return new n.constructor(r,n.byteOffset,n.length)}function Ru(n,t){if(n!==t){var r=n!==Y,e=null===n,u=n===n,i=pc(n),o=t!==Y,f=null===t,c=t===t,a=pc(t);if(!f&&!a&&!i&&n>t||i&&o&&c&&!f&&!a||e&&o&&c||!r&&c||!u)return 1;if(!e&&!i&&!a&&n<t||a&&r&&u&&!e&&!i||f&&r&&u||!o&&u||!c)return-1}return 0}function zu(n,t,r){for(var e=-1,u=n.criteria,i=t.criteria,o=u.length,f=r.length;++e<o;){var c=Ru(u[e],i[e]);if(c){if(e>=f)return c;return c*("desc"==r[e]?-1:1)}}return n.index-t.index}function Eu(n,t,r,e){for(var u=-1,i=n.length,o=r.length,f=-1,c=t.length,a=Nl(i-o,0),l=Xa(c+a),s=!e;++f<c;)l[f]=t[f];for(;++u<o;)(s||u<i)&&(l[r[u]]=n[u]);for(;a--;)l[f++]=n[u++];return l}function Su(n,t,r,e){for(var u=-1,i=n.length,o=-1,f=r.length,c=-1,a=t.length,l=Nl(i-f,0),s=Xa(l+a),h=!e;++u<l;)s[u]=n[u];for(var p=u;++c<a;)s[p+c]=t[c];for(;++o<f;)(h||u<i)&&(s[p+r[o]]=n[u++]);return s}function Lu(n,t){var r=-1,e=n.length;for(t||(t=Xa(e));++r<e;)t[r]=n[r];return t}function Wu(n,t,r,e){var u=!r;r||(r={});for(var i=-1,o=t.length;++i<o;){var f=t[i],c=e?e(r[f],n[f],f,r,n):Y;c===Y&&(c=n[f]),u?Yr(r,f,c):Kr(r,f,c)}return r}function Cu(n,t){return Wu(n,ms(n),t)}function Uu(n,t){return Wu(n,xs(n),t)}function Bu(n,r){return function(e,u){var i=ph(e)?t:Gr,o=r?r():{};return i(e,n,gi(u,2),o)}}function Tu(n){return Xe(function(t,r){var e=-1,u=r.length,i=u>1?r[u-1]:Y,o=u>2?r[2]:Y;for(i=n.length>3&&"function"==typeof i?(u--,i):Y,o&&Ei(r[0],r[1],o)&&(i=u<3?Y:i,u=1),t=ul(t);++e<u;){var f=r[e];f&&n(t,f,e,i)}return t})}function $u(n,t){return function(r,e){if(null==r)return r;if(!Pf(r))return n(r,e);for(var u=r.length,i=t?u:-1,o=ul(r);(t?i--:++i<u)&&!1!==e(o[i],i,o););return r}}function Du(n){return function(t,r,e){for(var u=-1,i=ul(t),o=e(t),f=o.length;f--;){var c=o[n?f:++u];if(!1===r(i[c],c,i))break}return t}}function Mu(n,t,r){function e(){return(this&&this!==kr&&this instanceof e?i:n).apply(u?r:this,arguments)}var u=t&ln,i=Pu(n);return e}function Fu(n){return function(t){t=Ac(t);var r=B(t)?V(t):Y,e=r?r[0]:t.charAt(0),u=r?mu(r,1).join(""):t.slice(1);return e[n]()+u}}function Nu(n){return function(t){return l(xa(ra(t).replace(fr,"")),n,"")}}function Pu(n){return function(){var t=arguments;switch(t.length){case 0:return new n;case 1:return new n(t[0]);case 2:return new n(t[0],t[1]);case 3:return new n(t[0],t[1],t[2]);case 4:return new n(t[0],t[1],t[2],t[3]);case 5:return new n(t[0],t[1],t[2],t[3],t[4]);case 6:return new n(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new n(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var r=ls(n.prototype),e=n.apply(r,t);return tc(e)?e:r}}function qu(t,r,e){function u(){for(var o=arguments.length,f=Xa(o),c=o,a=vi(u);c--;)f[c]=arguments[c];var l=o<3&&f[0]!==a&&f[o-1]!==a?[]:F(f,a);return(o-=l.length)<e?ti(t,r,Vu,u.placeholder,Y,f,l,Y,Y,e-o):n(this&&this!==kr&&this instanceof u?i:t,this,f)}var i=Pu(t);return u}function Zu(n){return function(t,r,e){var u=ul(t);if(!Pf(t)){var i=gi(r,3);t=Tc(t),r=function(n){return i(u[n],n,u)}}var o=n(t,r,e);return o>-1?u[i?t[o]:o]:Y}}function Ku(n){return si(function(t){var r=t.length,e=r,u=H.prototype.thru;for(n&&t.reverse();e--;){var i=t[e];if("function"!=typeof i)throw new fl(nn);if(u&&!o&&"wrapper"==_i(i))var o=new H([],!0)}for(e=o?e:r;++e<r;){i=t[e];var f=_i(i),c="wrapper"==f?ws(i):Y;o=c&&Wi(c[0])&&c[1]==(yn|pn|vn|dn)&&!c[4].length&&1==c[9]?o[_i(c[0])].apply(o,c[3]):1==i.length&&Wi(i)?o[f]():o.thru(i)}return function(){var n=arguments,e=n[0];if(o&&1==n.length&&ph(e))return o.plant(e).value();for(var u=0,i=r?t[u].apply(this,n):e;++u<r;)i=t[u].call(this,i);return i}})}function Vu(n,t,r,e,u,i,o,f,c,a){function l(){for(var y=arguments.length,d=Xa(y),b=y;b--;)d[b]=arguments[b];if(_)var w=vi(l),m=W(d,w);if(e&&(d=Eu(d,e,u,_)),i&&(d=Su(d,i,o,_)),y-=m,_&&y<a){var x=F(d,w);return ti(n,t,Vu,l.placeholder,r,d,x,f,c,a-y)}var j=h?r:this,A=p?j[n]:n;return y=d.length,f?d=Pi(d,f):v&&y>1&&d.reverse(),s&&c<y&&(d.length=c),this&&this!==kr&&this instanceof l&&(A=g||Pu(A)),A.apply(j,d)}var s=t&yn,h=t&ln,p=t&sn,_=t&(pn|_n),v=t&bn,g=p?Y:Pu(n);return l}function Gu(n,t){return function(r,e){return me(r,n,t(e),{})}}function Hu(n,t){return function(r,e){var u;if(r===Y&&e===Y)return t;if(r!==Y&&(u=r),e!==Y){if(u===Y)return e;"string"==typeof r||"string"==typeof e?(r=lu(r),e=lu(e)):(r=au(r),e=au(e)),u=n(r,e)}return u}}function Ju(t){return si(function(r){return r=c(r,R(gi())),Xe(function(e){var u=this;return t(r,function(t){return n(t,u,e)})})})}function Yu(n,t){t=t===Y?" ":lu(t);var r=t.length;if(r<2)return r?Qe(t,n):t;var e=Qe(t,Ul(n/K(t)));return B(t)?mu(V(e),0,n).join(""):e.slice(0,n)}function Qu(t,r,e,u){function i(){for(var r=-1,c=arguments.length,a=-1,l=u.length,s=Xa(l+c),h=this&&this!==kr&&this instanceof i?f:t;++a<l;)s[a]=u[a];for(;c--;)s[a++]=arguments[++r];return n(h,o?e:this,s)}var o=r&ln,f=Pu(t);return i}function Xu(n){return function(t,r,e){return e&&"number"!=typeof e&&Ei(t,r,e)&&(r=e=Y),t=dc(t),r===Y?(r=t,t=0):r=dc(r),e=e===Y?t<r?1:-1:dc(e),Ye(t,r,e,n)}}function ni(n){return function(t,r){return"string"==typeof t&&"string"==typeof r||(t=mc(t),r=mc(r)),n(t,r)}}function ti(n,t,r,e,u,i,o,f,c,a){var l=t&pn,s=l?o:Y,h=l?Y:o,p=l?i:Y,_=l?Y:i;t|=l?vn:gn,(t&=~(l?gn:vn))&hn||(t&=~(ln|sn));var v=[n,t,u,p,s,_,h,f,c,a],g=r.apply(Y,v);return Wi(n)&&ks(g,v),g.placeholder=e,Zi(g,n,t)}function ri(n){var t=el[n];return function(n,r){if(n=mc(n),(r=null==r?0:Pl(bc(r),292))&&Dl(n)){var e=(Ac(n)+"e").split("e");return e=(Ac(t(e[0]+"e"+(+e[1]+r)))+"e").split("e"),+(e[0]+"e"+(+e[1]-r))}return t(n)}}function ei(n){return function(t){var r=js(t);return r==Pn?D(t):r==Hn?P(t):I(t,n(t))}}function ui(n,t,r,e,u,i,o,f){var c=t&sn;if(!c&&"function"!=typeof n)throw new fl(nn);var a=e?e.length:0;if(a||(t&=~(vn|gn),e=u=Y),o=o===Y?o:Nl(bc(o),0),f=f===Y?f:bc(f),a-=u?u.length:0,t&gn){var l=e,s=u;e=u=Y}var h=c?Y:ws(n),p=[n,t,r,e,u,l,s,i,o,f];if(h&&$i(p,h),n=p[0],t=p[1],r=p[2],e=p[3],u=p[4],f=p[9]=p[9]===Y?c?0:n.length:Nl(p[9]-a,0),!f&&t&(pn|_n)&&(t&=~(pn|_n)),t&&t!=ln)_=t==pn||t==_n?qu(n,t,f):t!=vn&&t!=(ln|vn)||u.length?Vu.apply(Y,p):Qu(n,t,r,e);else var _=Mu(n,t,r);return Zi((h?vs:ks)(_,p),n,t)}function ii(n,t,r,e){return n===Y||Nf(n,ll[r])&&!pl.call(e,r)?t:n}function oi(n,t,r,e,u,i){return tc(n)&&tc(t)&&(i.set(t,n),Fe(n,t,Y,oi,i),i.delete(t)),n}function fi(n){return lc(n)?Y:n}function ci(n,t,r,e,u,i){var o=r&cn,f=n.length,c=t.length;if(f!=c&&!(o&&c>f))return!1;var a=i.get(n);if(a&&i.get(t))return a==t;var l=-1,s=!0,p=r&an?new dr:Y;for(i.set(n,t),i.set(t,n);++l<f;){var _=n[l],v=t[l];if(e)var g=o?e(v,_,l,t,n,i):e(_,v,l,n,t,i);if(g!==Y){if(g)continue;s=!1;break}if(p){if(!h(t,function(n,t){if(!E(p,t)&&(_===n||u(_,n,r,e,i)))return p.push(t)})){s=!1;break}}else if(_!==v&&!u(_,v,r,e,i)){s=!1;break}}return i.delete(n),i.delete(t),s}function ai(n,t,r,e,u,i,o){switch(r){case rt:if(n.byteLength!=t.byteLength||n.byteOffset!=t.byteOffset)return!1;n=n.buffer,t=t.buffer;case tt:return!(n.byteLength!=t.byteLength||!i(new xl(n),new xl(t)));case Tn:case $n:case qn:return Nf(+n,+t);case Mn:return n.name==t.name&&n.message==t.message;case Gn:case Jn:return n==t+"";case Pn:var f=D;case Hn:var c=e&cn;if(f||(f=N),n.size!=t.size&&!c)return!1;var a=o.get(n);if(a)return a==t;e|=an,o.set(n,t);var l=ci(f(n),f(t),e,u,i,o);return o.delete(n),l;case Yn:if(cs)return cs.call(n)==cs.call(t)}return!1}function li(n,t,r,e,u,i){var o=r&cn,f=hi(n),c=f.length;if(c!=hi(t).length&&!o)return!1;for(var a=c;a--;){var l=f[a];if(!(o?l in t:pl.call(t,l)))return!1}var s=i.get(n);if(s&&i.get(t))return s==t;var h=!0;i.set(n,t),i.set(t,n);for(var p=o;++a<c;){l=f[a]
;var _=n[l],v=t[l];if(e)var g=o?e(v,_,l,t,n,i):e(_,v,l,n,t,i);if(!(g===Y?_===v||u(_,v,r,e,i):g)){h=!1;break}p||(p="constructor"==l)}if(h&&!p){var y=n.constructor,d=t.constructor;y!=d&&"constructor"in n&&"constructor"in t&&!("function"==typeof y&&y instanceof y&&"function"==typeof d&&d instanceof d)&&(h=!1)}return i.delete(n),i.delete(t),h}function si(n){return Is(Fi(n,Y,co),n+"")}function hi(n){return _e(n,Tc,ms)}function pi(n){return _e(n,$c,xs)}function _i(n){for(var t=n.name+"",r=ts[t],e=pl.call(ts,t)?r.length:0;e--;){var u=r[e],i=u.func;if(null==i||i==n)return u.name}return t}function vi(n){return(pl.call(q,"placeholder")?q:n).placeholder}function gi(){var n=q.iteratee||Ra;return n=n===Ra?Ce:n,arguments.length?n(arguments[0],arguments[1]):n}function yi(n,t){var r=n.__data__;return Li(t)?r["string"==typeof t?"string":"hash"]:r.map}function di(n){for(var t=Tc(n),r=t.length;r--;){var e=t[r],u=n[e];t[r]=[e,u,Bi(u)]}return t}function bi(n,t){var r=U(n,t);return Ee(r)?r:Y}function wi(n){var t=pl.call(n,El),r=n[El];try{n[El]=Y;var e=!0}catch(n){}var u=gl.call(n);return e&&(t?n[El]=r:delete n[El]),u}function mi(n,t,r){for(var e=-1,u=r.length;++e<u;){var i=r[e],o=i.size;switch(i.type){case"drop":n+=o;break;case"dropRight":t-=o;break;case"take":t=Pl(t,n+o);break;case"takeRight":n=Nl(n,t-o)}}return{start:n,end:t}}function xi(n){var t=n.match(St);return t?t[1].split(Lt):[]}function ji(n,t,r){t=wu(t,n);for(var e=-1,u=t.length,i=!1;++e<u;){var o=Gi(t[e]);if(!(i=null!=n&&r(n,o)))break;n=n[o]}return i||++e!=u?i:!!(u=null==n?0:n.length)&&nc(u)&&zi(o,u)&&(ph(n)||hh(n))}function Ai(n){var t=n.length,r=new n.constructor(t);return t&&"string"==typeof n[0]&&pl.call(n,"index")&&(r.index=n.index,r.input=n.input),r}function ki(n){return"function"!=typeof n.constructor||Ui(n)?{}:ls(Al(n))}function Oi(n,t,r){var e=n.constructor;switch(t){case tt:return ju(n);case Tn:case $n:return new e(+n);case rt:return Au(n,r);case et:case ut:case it:case ot:case ft:case ct:case at:case lt:case st:return Iu(n,r);case Pn:return new e;case qn:case Jn:return new e(n);case Gn:return ku(n);case Hn:return new e;case Yn:return Ou(n)}}function Ii(n,t){var r=t.length;if(!r)return n;var e=r-1;return t[e]=(r>1?"& ":"")+t[e],t=t.join(r>2?", ":" "),n.replace(Et,"{\n/* [wrapped with "+t+"] */\n")}function Ri(n){return ph(n)||hh(n)||!!(Rl&&n&&n[Rl])}function zi(n,t){var r=typeof n;return!!(t=null==t?In:t)&&("number"==r||"symbol"!=r&&Ft.test(n))&&n>-1&&n%1==0&&n<t}function Ei(n,t,r){if(!tc(r))return!1;var e=typeof t;return!!("number"==e?Pf(r)&&zi(t,r.length):"string"==e&&t in r)&&Nf(r[t],n)}function Si(n,t){if(ph(n))return!1;var r=typeof n;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=n&&!pc(n))||(jt.test(n)||!xt.test(n)||null!=t&&n in ul(t))}function Li(n){var t=typeof n;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==n:null===n}function Wi(n){var t=_i(n),r=q[t];if("function"!=typeof r||!(t in Wt.prototype))return!1;if(n===r)return!0;var e=ws(r);return!!e&&n===e[0]}function Ci(n){return!!vl&&vl in n}function Ui(n){var t=n&&n.constructor;return n===("function"==typeof t&&t.prototype||ll)}function Bi(n){return n===n&&!tc(n)}function Ti(n,t){return function(r){return null!=r&&(r[n]===t&&(t!==Y||n in ul(r)))}}function $i(n,t){var r=n[1],e=t[1],u=r|e,i=u<(ln|sn|yn),o=e==yn&&r==pn||e==yn&&r==dn&&n[7].length<=t[8]||e==(yn|dn)&&t[7].length<=t[8]&&r==pn;if(!i&&!o)return n;e&ln&&(n[2]=t[2],u|=r&ln?0:hn);var f=t[3];if(f){var c=n[3];n[3]=c?Eu(c,f,t[4]):f,n[4]=c?F(n[3],en):t[4]}return f=t[5],f&&(c=n[5],n[5]=c?Su(c,f,t[6]):f,n[6]=c?F(n[5],en):t[6]),f=t[7],f&&(n[7]=f),e&yn&&(n[8]=null==n[8]?t[8]:Pl(n[8],t[8])),null==n[9]&&(n[9]=t[9]),n[0]=t[0],n[1]=u,n}function Di(n){var t=[];if(null!=n)for(var r in ul(n))t.push(r);return t}function Mi(n){return gl.call(n)}function Fi(t,r,e){return r=Nl(r===Y?t.length-1:r,0),function(){for(var u=arguments,i=-1,o=Nl(u.length-r,0),f=Xa(o);++i<o;)f[i]=u[r+i];i=-1;for(var c=Xa(r+1);++i<r;)c[i]=u[i];return c[r]=e(f),n(t,this,c)}}function Ni(n,t){return t.length<2?n:pe(n,uu(t,0,-1))}function Pi(n,t){for(var r=n.length,e=Pl(t.length,r),u=Lu(n);e--;){var i=t[e];n[e]=zi(i,r)?u[i]:Y}return n}function qi(n,t){if(("constructor"!==t||"function"!=typeof n[t])&&"__proto__"!=t)return n[t]}function Zi(n,t,r){var e=t+"";return Is(n,Ii(e,Ji(xi(e),r)))}function Ki(n){var t=0,r=0;return function(){var e=ql(),u=jn-(e-r);if(r=e,u>0){if(++t>=xn)return arguments[0]}else t=0;return n.apply(Y,arguments)}}function Vi(n,t){var r=-1,e=n.length,u=e-1;for(t=t===Y?e:t;++r<t;){var i=Je(r,u),o=n[i];n[i]=n[r],n[r]=o}return n.length=t,n}function Gi(n){if("string"==typeof n||pc(n))return n;var t=n+"";return"0"==t&&1/n==-On?"-0":t}function Hi(n){if(null!=n){try{return hl.call(n)}catch(n){}try{return n+""}catch(n){}}return""}function Ji(n,t){return r(Wn,function(r){var e="_."+r[0];t&r[1]&&!o(n,e)&&n.push(e)}),n.sort()}function Yi(n){if(n instanceof Wt)return n.clone();var t=new H(n.__wrapped__,n.__chain__);return t.__actions__=Lu(n.__actions__),t.__index__=n.__index__,t.__values__=n.__values__,t}function Qi(n,t,r){t=(r?Ei(n,t,r):t===Y)?1:Nl(bc(t),0);var e=null==n?0:n.length;if(!e||t<1)return[];for(var u=0,i=0,o=Xa(Ul(e/t));u<e;)o[i++]=uu(n,u,u+=t);return o}function Xi(n){for(var t=-1,r=null==n?0:n.length,e=0,u=[];++t<r;){var i=n[t];i&&(u[e++]=i)}return u}function no(){var n=arguments.length;if(!n)return[];for(var t=Xa(n-1),r=arguments[0],e=n;e--;)t[e-1]=arguments[e];return a(ph(r)?Lu(r):[r],ae(t,1))}function to(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===Y?1:bc(t),uu(n,t<0?0:t,e)):[]}function ro(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===Y?1:bc(t),t=e-t,uu(n,0,t<0?0:t)):[]}function eo(n,t){return n&&n.length?_u(n,gi(t,3),!0,!0):[]}function uo(n,t){return n&&n.length?_u(n,gi(t,3),!0):[]}function io(n,t,r,e){var u=null==n?0:n.length;return u?(r&&"number"!=typeof r&&Ei(n,t,r)&&(r=0,e=u),fe(n,t,r,e)):[]}function oo(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=null==r?0:bc(r);return u<0&&(u=Nl(e+u,0)),g(n,gi(t,3),u)}function fo(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=e-1;return r!==Y&&(u=bc(r),u=r<0?Nl(e+u,0):Pl(u,e-1)),g(n,gi(t,3),u,!0)}function co(n){return(null==n?0:n.length)?ae(n,1):[]}function ao(n){return(null==n?0:n.length)?ae(n,On):[]}function lo(n,t){return(null==n?0:n.length)?(t=t===Y?1:bc(t),ae(n,t)):[]}function so(n){for(var t=-1,r=null==n?0:n.length,e={};++t<r;){var u=n[t];e[u[0]]=u[1]}return e}function ho(n){return n&&n.length?n[0]:Y}function po(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=null==r?0:bc(r);return u<0&&(u=Nl(e+u,0)),y(n,t,u)}function _o(n){return(null==n?0:n.length)?uu(n,0,-1):[]}function vo(n,t){return null==n?"":Ml.call(n,t)}function go(n){var t=null==n?0:n.length;return t?n[t-1]:Y}function yo(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=e;return r!==Y&&(u=bc(r),u=u<0?Nl(e+u,0):Pl(u,e-1)),t===t?Z(n,t,u):g(n,b,u,!0)}function bo(n,t){return n&&n.length?Pe(n,bc(t)):Y}function wo(n,t){return n&&n.length&&t&&t.length?Ge(n,t):n}function mo(n,t,r){return n&&n.length&&t&&t.length?Ge(n,t,gi(r,2)):n}function xo(n,t,r){return n&&n.length&&t&&t.length?Ge(n,t,Y,r):n}function jo(n,t){var r=[];if(!n||!n.length)return r;var e=-1,u=[],i=n.length;for(t=gi(t,3);++e<i;){var o=n[e];t(o,e,n)&&(r.push(o),u.push(e))}return He(n,u),r}function Ao(n){return null==n?n:Vl.call(n)}function ko(n,t,r){var e=null==n?0:n.length;return e?(r&&"number"!=typeof r&&Ei(n,t,r)?(t=0,r=e):(t=null==t?0:bc(t),r=r===Y?e:bc(r)),uu(n,t,r)):[]}function Oo(n,t){return ou(n,t)}function Io(n,t,r){return fu(n,t,gi(r,2))}function Ro(n,t){var r=null==n?0:n.length;if(r){var e=ou(n,t);if(e<r&&Nf(n[e],t))return e}return-1}function zo(n,t){return ou(n,t,!0)}function Eo(n,t,r){return fu(n,t,gi(r,2),!0)}function So(n,t){if(null==n?0:n.length){var r=ou(n,t,!0)-1;if(Nf(n[r],t))return r}return-1}function Lo(n){return n&&n.length?cu(n):[]}function Wo(n,t){return n&&n.length?cu(n,gi(t,2)):[]}function Co(n){var t=null==n?0:n.length;return t?uu(n,1,t):[]}function Uo(n,t,r){return n&&n.length?(t=r||t===Y?1:bc(t),uu(n,0,t<0?0:t)):[]}function Bo(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===Y?1:bc(t),t=e-t,uu(n,t<0?0:t,e)):[]}function To(n,t){return n&&n.length?_u(n,gi(t,3),!1,!0):[]}function $o(n,t){return n&&n.length?_u(n,gi(t,3)):[]}function Do(n){return n&&n.length?su(n):[]}function Mo(n,t){return n&&n.length?su(n,gi(t,2)):[]}function Fo(n,t){return t="function"==typeof t?t:Y,n&&n.length?su(n,Y,t):[]}function No(n){if(!n||!n.length)return[];var t=0;return n=i(n,function(n){if(qf(n))return t=Nl(n.length,t),!0}),O(t,function(t){return c(n,m(t))})}function Po(t,r){if(!t||!t.length)return[];var e=No(t);return null==r?e:c(e,function(t){return n(r,Y,t)})}function qo(n,t){return yu(n||[],t||[],Kr)}function Zo(n,t){return yu(n||[],t||[],ru)}function Ko(n){var t=q(n);return t.__chain__=!0,t}function Vo(n,t){return t(n),n}function Go(n,t){return t(n)}function Ho(){return Ko(this)}function Jo(){return new H(this.value(),this.__chain__)}function Yo(){this.__values__===Y&&(this.__values__=yc(this.value()));var n=this.__index__>=this.__values__.length;return{done:n,value:n?Y:this.__values__[this.__index__++]}}function Qo(){return this}function Xo(n){for(var t,r=this;r instanceof G;){var e=Yi(r);e.__index__=0,e.__values__=Y,t?u.__wrapped__=e:t=e;var u=e;r=r.__wrapped__}return u.__wrapped__=n,t}function nf(){var n=this.__wrapped__;if(n instanceof Wt){var t=n;return this.__actions__.length&&(t=new Wt(this)),t=t.reverse(),t.__actions__.push({func:Go,args:[Ao],thisArg:Y}),new H(t,this.__chain__)}return this.thru(Ao)}function tf(){return vu(this.__wrapped__,this.__actions__)}function rf(n,t,r){var e=ph(n)?u:ie;return r&&Ei(n,t,r)&&(t=Y),e(n,gi(t,3))}function ef(n,t){return(ph(n)?i:ce)(n,gi(t,3))}function uf(n,t){return ae(sf(n,t),1)}function of(n,t){return ae(sf(n,t),On)}function ff(n,t,r){return r=r===Y?1:bc(r),ae(sf(n,t),r)}function cf(n,t){return(ph(n)?r:ss)(n,gi(t,3))}function af(n,t){return(ph(n)?e:hs)(n,gi(t,3))}function lf(n,t,r,e){n=Pf(n)?n:Jc(n),r=r&&!e?bc(r):0;var u=n.length;return r<0&&(r=Nl(u+r,0)),hc(n)?r<=u&&n.indexOf(t,r)>-1:!!u&&y(n,t,r)>-1}function sf(n,t){return(ph(n)?c:$e)(n,gi(t,3))}function hf(n,t,r,e){return null==n?[]:(ph(t)||(t=null==t?[]:[t]),r=e?Y:r,ph(r)||(r=null==r?[]:[r]),qe(n,t,r))}function pf(n,t,r){var e=ph(n)?l:j,u=arguments.length<3;return e(n,gi(t,4),r,u,ss)}function _f(n,t,r){var e=ph(n)?s:j,u=arguments.length<3;return e(n,gi(t,4),r,u,hs)}function vf(n,t){return(ph(n)?i:ce)(n,zf(gi(t,3)))}function gf(n){return(ph(n)?Nr:nu)(n)}function yf(n,t,r){return t=(r?Ei(n,t,r):t===Y)?1:bc(t),(ph(n)?Pr:tu)(n,t)}function df(n){return(ph(n)?qr:eu)(n)}function bf(n){if(null==n)return 0;if(Pf(n))return hc(n)?K(n):n.length;var t=js(n);return t==Pn||t==Hn?n.size:Ue(n).length}function wf(n,t,r){var e=ph(n)?h:iu;return r&&Ei(n,t,r)&&(t=Y),e(n,gi(t,3))}function mf(n,t){if("function"!=typeof t)throw new fl(nn);return n=bc(n),function(){if(--n<1)return t.apply(this,arguments)}}function xf(n,t,r){return t=r?Y:t,t=n&&null==t?n.length:t,ui(n,yn,Y,Y,Y,Y,t)}function jf(n,t){var r;if("function"!=typeof t)throw new fl(nn);return n=bc(n),function(){return--n>0&&(r=t.apply(this,arguments)),n<=1&&(t=Y),r}}function Af(n,t,r){t=r?Y:t;var e=ui(n,pn,Y,Y,Y,Y,Y,t);return e.placeholder=Af.placeholder,e}function kf(n,t,r){t=r?Y:t;var e=ui(n,_n,Y,Y,Y,Y,Y,t);return e.placeholder=kf.placeholder,e}function Of(n,t,r){function e(t){var r=h,e=p;return h=p=Y,d=t,v=n.apply(e,r)}function u(n){return d=n,g=Os(f,t),b?e(n):v}function i(n){var r=n-y,e=n-d,u=t-r;return w?Pl(u,_-e):u}function o(n){var r=n-y,e=n-d;return y===Y||r>=t||r<0||w&&e>=_}function f(){var n=th();if(o(n))return c(n);g=Os(f,i(n))}function c(n){return g=Y,m&&h?e(n):(h=p=Y,v)}function a(){g!==Y&&ds(g),d=0,h=y=p=g=Y}function l(){return g===Y?v:c(th())}function s(){var n=th(),r=o(n);if(h=arguments,p=this,y=n,r){if(g===Y)return u(y);if(w)return ds(g),g=Os(f,t),e(y)}return g===Y&&(g=Os(f,t)),v}var h,p,_,v,g,y,d=0,b=!1,w=!1,m=!0;if("function"!=typeof n)throw new fl(nn);return t=mc(t)||0,tc(r)&&(b=!!r.leading,w="maxWait"in r,_=w?Nl(mc(r.maxWait)||0,t):_,m="trailing"in r?!!r.trailing:m),s.cancel=a,s.flush=l,s}function If(n){return ui(n,bn)}function Rf(n,t){if("function"!=typeof n||null!=t&&"function"!=typeof t)throw new fl(nn);var r=function(){var e=arguments,u=t?t.apply(this,e):e[0],i=r.cache;if(i.has(u))return i.get(u);var o=n.apply(this,e);return r.cache=i.set(u,o)||i,o};return r.cache=new(Rf.Cache||or),r}function zf(n){if("function"!=typeof n)throw new fl(nn);return function(){var t=arguments;switch(t.length){case 0:return!n.call(this);case 1:return!n.call(this,t[0]);case 2:return!n.call(this,t[0],t[1]);case 3:return!n.call(this,t[0],t[1],t[2])}return!n.apply(this,t)}}function Ef(n){return jf(2,n)}function Sf(n,t){if("function"!=typeof n)throw new fl(nn);return t=t===Y?t:bc(t),Xe(n,t)}function Lf(t,r){if("function"!=typeof t)throw new fl(nn);return r=null==r?0:Nl(bc(r),0),Xe(function(e){var u=e[r],i=mu(e,0,r);return u&&a(i,u),n(t,this,i)})}function Wf(n,t,r){var e=!0,u=!0;if("function"!=typeof n)throw new fl(nn);return tc(r)&&(e="leading"in r?!!r.leading:e,u="trailing"in r?!!r.trailing:u),Of(n,t,{leading:e,maxWait:t,trailing:u})}function Cf(n){return xf(n,1)}function Uf(n,t){return fh(bu(t),n)}function Bf(){if(!arguments.length)return[];var n=arguments[0];return ph(n)?n:[n]}function Tf(n){return ne(n,fn)}function $f(n,t){return t="function"==typeof t?t:Y,ne(n,fn,t)}function Df(n){return ne(n,un|fn)}function Mf(n,t){return t="function"==typeof t?t:Y,ne(n,un|fn,t)}function Ff(n,t){return null==t||re(n,t,Tc(t))}function Nf(n,t){return n===t||n!==n&&t!==t}function Pf(n){return null!=n&&nc(n.length)&&!Qf(n)}function qf(n){return rc(n)&&Pf(n)}function Zf(n){return!0===n||!1===n||rc(n)&&ve(n)==Tn}function Kf(n){return rc(n)&&1===n.nodeType&&!lc(n)}function Vf(n){if(null==n)return!0;if(Pf(n)&&(ph(n)||"string"==typeof n||"function"==typeof n.splice||vh(n)||wh(n)||hh(n)))return!n.length;var t=js(n);if(t==Pn||t==Hn)return!n.size;if(Ui(n))return!Ue(n).length;for(var r in n)if(pl.call(n,r))return!1;return!0}function Gf(n,t){return Oe(n,t)}function Hf(n,t,r){r="function"==typeof r?r:Y;var e=r?r(n,t):Y;return e===Y?Oe(n,t,Y,r):!!e}function Jf(n){if(!rc(n))return!1;var t=ve(n);return t==Mn||t==Dn||"string"==typeof n.message&&"string"==typeof n.name&&!lc(n)}function Yf(n){return"number"==typeof n&&Dl(n)}function Qf(n){if(!tc(n))return!1;var t=ve(n);return t==Fn||t==Nn||t==Bn||t==Vn}function Xf(n){return"number"==typeof n&&n==bc(n)}function nc(n){return"number"==typeof n&&n>-1&&n%1==0&&n<=In}function tc(n){var t=typeof n;return null!=n&&("object"==t||"function"==t)}function rc(n){return null!=n&&"object"==typeof n}function ec(n,t){return n===t||ze(n,t,di(t))}function uc(n,t,r){return r="function"==typeof r?r:Y,ze(n,t,di(t),r)}function ic(n){return ac(n)&&n!=+n}function oc(n){if(As(n))throw new tl(X);return Ee(n)}function fc(n){return null===n}function cc(n){return null==n}function ac(n){return"number"==typeof n||rc(n)&&ve(n)==qn}function lc(n){if(!rc(n)||ve(n)!=Kn)return!1;var t=Al(n);if(null===t)return!0;var r=pl.call(t,"constructor")&&t.constructor;return"function"==typeof r&&r instanceof r&&hl.call(r)==yl}function sc(n){return Xf(n)&&n>=-In&&n<=In}function hc(n){return"string"==typeof n||!ph(n)&&rc(n)&&ve(n)==Jn}function pc(n){return"symbol"==typeof n||rc(n)&&ve(n)==Yn}function _c(n){return n===Y}function vc(n){return rc(n)&&js(n)==Xn}function gc(n){return rc(n)&&ve(n)==nt}function yc(n){if(!n)return[];if(Pf(n))return hc(n)?V(n):Lu(n);if(zl&&n[zl])return $(n[zl]());var t=js(n);return(t==Pn?D:t==Hn?N:Jc)(n)}function dc(n){if(!n)return 0===n?n:0;if((n=mc(n))===On||n===-On){return(n<0?-1:1)*Rn}return n===n?n:0}function bc(n){var t=dc(n),r=t%1;return t===t?r?t-r:t:0}function wc(n){return n?Xr(bc(n),0,En):0}function mc(n){if("number"==typeof n)return n;if(pc(n))return zn;if(tc(n)){var t="function"==typeof n.valueOf?n.valueOf():n;n=tc(t)?t+"":t}if("string"!=typeof n)return 0===n?n:+n;n=n.replace(It,"");var r=$t.test(n);return r||Mt.test(n)?xr(n.slice(2),r?2:8):Tt.test(n)?zn:+n}function xc(n){return Wu(n,$c(n))}function jc(n){return n?Xr(bc(n),-In,In):0===n?n:0}function Ac(n){return null==n?"":lu(n)}function kc(n,t){var r=ls(n);return null==t?r:Hr(r,t)}function Oc(n,t){return v(n,gi(t,3),le)}function Ic(n,t){return v(n,gi(t,3),se)}function Rc(n,t){return null==n?n:ps(n,gi(t,3),$c)}function zc(n,t){return null==n?n:_s(n,gi(t,3),$c)}function Ec(n,t){return n&&le(n,gi(t,3))}function Sc(n,t){return n&&se(n,gi(t,3))}function Lc(n){return null==n?[]:he(n,Tc(n))}function Wc(n){return null==n?[]:he(n,$c(n))}function Cc(n,t,r){var e=null==n?Y:pe(n,t);return e===Y?r:e}function Uc(n,t){return null!=n&&ji(n,t,ye)}function Bc(n,t){return null!=n&&ji(n,t,de)}function Tc(n){return Pf(n)?Tr(n):Ue(n)}function $c(n){return Pf(n)?Tr(n,!0):Be(n)}function Dc(n,t){var r={};return t=gi(t,3),le(n,function(n,e,u){Yr(r,t(n,e,u),n)}),r}function Mc(n,t){var r={};return t=gi(t,3),le(n,function(n,e,u){Yr(r,e,t(n,e,u))}),r}function Fc(n,t){return Nc(n,zf(gi(t)))}function Nc(n,t){if(null==n)return{};var r=c(pi(n),function(n){return[n]});return t=gi(t),Ke(n,r,function(n,r){return t(n,r[0])})}function Pc(n,t,r){t=wu(t,n);var e=-1,u=t.length;for(u||(u=1,n=Y);++e<u;){var i=null==n?Y:n[Gi(t[e])];i===Y&&(e=u,i=r),n=Qf(i)?i.call(n):i}return n}function qc(n,t,r){return null==n?n:ru(n,t,r)}function Zc(n,t,r,e){return e="function"==typeof e?e:Y,null==n?n:ru(n,t,r,e)}function Kc(n,t,e){var u=ph(n),i=u||vh(n)||wh(n);if(t=gi(t,4),null==e){var o=n&&n.constructor;e=i?u?new o:[]:tc(n)&&Qf(o)?ls(Al(n)):{}}return(i?r:le)(n,function(n,r,u){return t(e,n,r,u)}),e}function Vc(n,t){return null==n||hu(n,t)}function Gc(n,t,r){return null==n?n:pu(n,t,bu(r))}function Hc(n,t,r,e){return e="function"==typeof e?e:Y,null==n?n:pu(n,t,bu(r),e)}function Jc(n){return null==n?[]:z(n,Tc(n))}function Yc(n){return null==n?[]:z(n,$c(n))}function Qc(n,t,r){return r===Y&&(r=t,t=Y),r!==Y&&(r=mc(r),r=r===r?r:0),t!==Y&&(t=mc(t),t=t===t?t:0),Xr(mc(n),t,r)}function Xc(n,t,r){return t=dc(t),r===Y?(r=t,t=0):r=dc(r),n=mc(n),be(n,t,r)}function na(n,t,r){if(r&&"boolean"!=typeof r&&Ei(n,t,r)&&(t=r=Y),r===Y&&("boolean"==typeof t?(r=t,t=Y):"boolean"==typeof n&&(r=n,n=Y)),n===Y&&t===Y?(n=0,t=1):(n=dc(n),t===Y?(t=n,n=0):t=dc(t)),n>t){var e=n;n=t,t=e}if(r||n%1||t%1){var u=Kl();return Pl(n+u*(t-n+mr("1e-"+((u+"").length-1))),t)}return Je(n,t)}function ta(n){return Kh(Ac(n).toLowerCase())}function ra(n){return(n=Ac(n))&&n.replace(Nt,$r).replace(cr,"")}function ea(n,t,r){n=Ac(n),t=lu(t);var e=n.length;r=r===Y?e:Xr(bc(r),0,e);var u=r;return(r-=t.length)>=0&&n.slice(r,u)==t}function ua(n){return n=Ac(n),n&&dt.test(n)?n.replace(gt,Dr):n}function ia(n){return n=Ac(n),n&&Ot.test(n)?n.replace(kt,"\\$&"):n}function oa(n,t,r){n=Ac(n),t=bc(t);var e=t?K(n):0;if(!t||e>=t)return n;var u=(t-e)/2;return Yu(Bl(u),r)+n+Yu(Ul(u),r)}function fa(n,t,r){n=Ac(n),t=bc(t);var e=t?K(n):0;return t&&e<t?n+Yu(t-e,r):n}function ca(n,t,r){n=Ac(n),t=bc(t);var e=t?K(n):0;return t&&e<t?Yu(t-e,r)+n:n}function aa(n,t,r){return r||null==t?t=0:t&&(t=+t),Zl(Ac(n).replace(Rt,""),t||0)}function la(n,t,r){return t=(r?Ei(n,t,r):t===Y)?1:bc(t),Qe(Ac(n),t)}function sa(){var n=arguments,t=Ac(n[0]);return n.length<3?t:t.replace(n[1],n[2])}function ha(n,t,r){return r&&"number"!=typeof r&&Ei(n,t,r)&&(t=r=Y),(r=r===Y?En:r>>>0)?(n=Ac(n),n&&("string"==typeof t||null!=t&&!dh(t))&&!(t=lu(t))&&B(n)?mu(V(n),0,r):n.split(t,r)):[]}function pa(n,t,r){return n=Ac(n),r=null==r?0:Xr(bc(r),0,n.length),t=lu(t),n.slice(r,r+t.length)==t}function _a(n,t,r){var e=q.templateSettings;r&&Ei(n,t,r)&&(t=Y),n=Ac(n),t=kh({},t,e,ii);var u,i,o=kh({},t.imports,e.imports,ii),f=Tc(o),c=z(o,f),a=0,l=t.interpolate||Pt,s="__p += '",h=il((t.escape||Pt).source+"|"+l.source+"|"+(l===mt?Ut:Pt).source+"|"+(t.evaluate||Pt).source+"|$","g"),p="//# sourceURL="+(pl.call(t,"sourceURL")?(t.sourceURL+"").replace(/[\r\n]/g," "):"lodash.templateSources["+ ++_r+"]")+"\n";n.replace(h,function(t,r,e,o,f,c){return e||(e=o),s+=n.slice(a,c).replace(qt,C),r&&(u=!0,s+="' +\n__e("+r+") +\n'"),f&&(i=!0,s+="';\n"+f+";\n__p += '"),e&&(s+="' +\n((__t = ("+e+")) == null ? '' : __t) +\n'"),a=c+t.length,t}),s+="';\n";var _=pl.call(t,"variable")&&t.variable;_||(s="with (obj) {\n"+s+"\n}\n"),s=(i?s.replace(ht,""):s).replace(pt,"$1").replace(_t,"$1;"),s="function("+(_||"obj")+") {\n"+(_?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(u?", __e = _.escape":"")+(i?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+s+"return __p\n}";var v=Vh(function(){return rl(f,p+"return "+s).apply(Y,c)});if(v.source=s,Jf(v))throw v;return v}function va(n){return Ac(n).toLowerCase()}function ga(n){return Ac(n).toUpperCase()}function ya(n,t,r){if((n=Ac(n))&&(r||t===Y))return n.replace(It,"");if(!n||!(t=lu(t)))return n;var e=V(n),u=V(t);return mu(e,S(e,u),L(e,u)+1).join("")}function da(n,t,r){if((n=Ac(n))&&(r||t===Y))return n.replace(zt,"");if(!n||!(t=lu(t)))return n;var e=V(n);return mu(e,0,L(e,V(t))+1).join("")}function ba(n,t,r){if((n=Ac(n))&&(r||t===Y))return n.replace(Rt,"");if(!n||!(t=lu(t)))return n;var e=V(n);return mu(e,S(e,V(t))).join("")}function wa(n,t){var r=wn,e=mn;if(tc(t)){var u="separator"in t?t.separator:u;r="length"in t?bc(t.length):r,e="omission"in t?lu(t.omission):e}n=Ac(n);var i=n.length;if(B(n)){var o=V(n);i=o.length}if(r>=i)return n;var f=r-K(e);if(f<1)return e;var c=o?mu(o,0,f).join(""):n.slice(0,f);if(u===Y)return c+e;if(o&&(f+=c.length-f),dh(u)){if(n.slice(f).search(u)){var a,l=c;for(u.global||(u=il(u.source,Ac(Bt.exec(u))+"g")),u.lastIndex=0;a=u.exec(l);)var s=a.index;c=c.slice(0,s===Y?f:s)}}else if(n.indexOf(lu(u),f)!=f){var h=c.lastIndexOf(u);h>-1&&(c=c.slice(0,h))}return c+e}function ma(n){return n=Ac(n),n&&yt.test(n)?n.replace(vt,Mr):n}function xa(n,t,r){return n=Ac(n),t=r?Y:t,t===Y?T(n)?J(n):_(n):n.match(t)||[]}function ja(t){var r=null==t?0:t.length,e=gi();return t=r?c(t,function(n){if("function"!=typeof n[1])throw new fl(nn);return[e(n[0]),n[1]]}):[],Xe(function(e){for(var u=-1;++u<r;){var i=t[u];if(n(i[0],this,e))return n(i[1],this,e)}})}function Aa(n){return te(ne(n,un))}function ka(n){return function(){return n}}function Oa(n,t){return null==n||n!==n?t:n}function Ia(n){return n}function Ra(n){return Ce("function"==typeof n?n:ne(n,un))}function za(n){return De(ne(n,un))}function Ea(n,t){return Me(n,ne(t,un))}function Sa(n,t,e){var u=Tc(t),i=he(t,u);null!=e||tc(t)&&(i.length||!u.length)||(e=t,t=n,n=this,i=he(t,Tc(t)));var o=!(tc(e)&&"chain"in e&&!e.chain),f=Qf(n);return r(i,function(r){var e=t[r];n[r]=e,f&&(n.prototype[r]=function(){var t=this.__chain__;if(o||t){var r=n(this.__wrapped__);return(r.__actions__=Lu(this.__actions__)).push({func:e,args:arguments,thisArg:n}),r.__chain__=t,r}return e.apply(n,a([this.value()],arguments))})}),n}function La(){return kr._===this&&(kr._=dl),this}function Wa(){}function Ca(n){return n=bc(n),Xe(function(t){return Pe(t,n)})}function Ua(n){return Si(n)?m(Gi(n)):Ve(n)}function Ba(n){return function(t){return null==n?Y:pe(n,t)}}function Ta(){return[]}function $a(){return!1}function Da(){return{}}function Ma(){return""}function Fa(){return!0}function Na(n,t){if((n=bc(n))<1||n>In)return[];var r=En,e=Pl(n,En);t=gi(t),n-=En;for(var u=O(e,t);++r<n;)t(r);return u}function Pa(n){return ph(n)?c(n,Gi):pc(n)?[n]:Lu(Rs(Ac(n)))}function qa(n){var t=++_l;return Ac(n)+t}function Za(n){return n&&n.length?oe(n,Ia,ge):Y}function Ka(n,t){return n&&n.length?oe(n,gi(t,2),ge):Y}function Va(n){return w(n,Ia)}function Ga(n,t){return w(n,gi(t,2))}function Ha(n){return n&&n.length?oe(n,Ia,Te):Y}function Ja(n,t){return n&&n.length?oe(n,gi(t,2),Te):Y}function Ya(n){return n&&n.length?k(n,Ia):0}function Qa(n,t){return n&&n.length?k(n,gi(t,2)):0}x=null==x?kr:Fr.defaults(kr.Object(),x,Fr.pick(kr,pr));var Xa=x.Array,nl=x.Date,tl=x.Error,rl=x.Function,el=x.Math,ul=x.Object,il=x.RegExp,ol=x.String,fl=x.TypeError,cl=Xa.prototype,al=rl.prototype,ll=ul.prototype,sl=x["__core-js_shared__"],hl=al.toString,pl=ll.hasOwnProperty,_l=0,vl=function(){var n=/[^.]+$/.exec(sl&&sl.keys&&sl.keys.IE_PROTO||"");return n?"Symbol(src)_1."+n:""}(),gl=ll.toString,yl=hl.call(ul),dl=kr._,bl=il("^"+hl.call(pl).replace(kt,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),wl=Rr?x.Buffer:Y,ml=x.Symbol,xl=x.Uint8Array,jl=wl?wl.allocUnsafe:Y,Al=M(ul.getPrototypeOf,ul),kl=ul.create,Ol=ll.propertyIsEnumerable,Il=cl.splice,Rl=ml?ml.isConcatSpreadable:Y,zl=ml?ml.iterator:Y,El=ml?ml.toStringTag:Y,Sl=function(){try{var n=bi(ul,"defineProperty");return n({},"",{}),n}catch(n){}}(),Ll=x.clearTimeout!==kr.clearTimeout&&x.clearTimeout,Wl=nl&&nl.now!==kr.Date.now&&nl.now,Cl=x.setTimeout!==kr.setTimeout&&x.setTimeout,Ul=el.ceil,Bl=el.floor,Tl=ul.getOwnPropertySymbols,$l=wl?wl.isBuffer:Y,Dl=x.isFinite,Ml=cl.join,Fl=M(ul.keys,ul),Nl=el.max,Pl=el.min,ql=nl.now,Zl=x.parseInt,Kl=el.random,Vl=cl.reverse,Gl=bi(x,"DataView"),Hl=bi(x,"Map"),Jl=bi(x,"Promise"),Yl=bi(x,"Set"),Ql=bi(x,"WeakMap"),Xl=bi(ul,"create"),ns=Ql&&new Ql,ts={},rs=Hi(Gl),es=Hi(Hl),us=Hi(Jl),is=Hi(Yl),os=Hi(Ql),fs=ml?ml.prototype:Y,cs=fs?fs.valueOf:Y,as=fs?fs.toString:Y,ls=function(){function n(){}return function(t){if(!tc(t))return{};if(kl)return kl(t);n.prototype=t;var r=new n;return n.prototype=Y,r}}();q.templateSettings={escape:bt,evaluate:wt,interpolate:mt,variable:"",imports:{_:q}},q.prototype=G.prototype,q.prototype.constructor=q,H.prototype=ls(G.prototype),H.prototype.constructor=H,Wt.prototype=ls(G.prototype),Wt.prototype.constructor=Wt,Gt.prototype.clear=Ht,Gt.prototype.delete=Jt,Gt.prototype.get=Yt,Gt.prototype.has=Qt,Gt.prototype.set=Xt,nr.prototype.clear=tr,nr.prototype.delete=rr,nr.prototype.get=er,nr.prototype.has=ur,nr.prototype.set=ir,or.prototype.clear=ar,or.prototype.delete=lr,or.prototype.get=sr,or.prototype.has=hr,or.prototype.set=yr,dr.prototype.add=dr.prototype.push=br,dr.prototype.has=wr,jr.prototype.clear=Ar,jr.prototype.delete=Or,jr.prototype.get=Ir,jr.prototype.has=zr,jr.prototype.set=Er;var ss=$u(le),hs=$u(se,!0),ps=Du(),_s=Du(!0),vs=ns?function(n,t){return ns.set(n,t),n}:Ia,gs=Sl?function(n,t){return Sl(n,"toString",{configurable:!0,enumerable:!1,value:ka(t),writable:!0})}:Ia,ys=Xe,ds=Ll||function(n){return kr.clearTimeout(n)},bs=Yl&&1/N(new Yl([,-0]))[1]==On?function(n){return new Yl(n)}:Wa,ws=ns?function(n){return ns.get(n)}:Wa,ms=Tl?function(n){return null==n?[]:(n=ul(n),i(Tl(n),function(t){return Ol.call(n,t)}))}:Ta,xs=Tl?function(n){for(var t=[];n;)a(t,ms(n)),n=Al(n);return t}:Ta,js=ve;(Gl&&js(new Gl(new ArrayBuffer(1)))!=rt||Hl&&js(new Hl)!=Pn||Jl&&"[object Promise]"!=js(Jl.resolve())||Yl&&js(new Yl)!=Hn||Ql&&js(new Ql)!=Xn)&&(js=function(n){var t=ve(n),r=t==Kn?n.constructor:Y,e=r?Hi(r):"";if(e)switch(e){case rs:return rt;case es:return Pn;case us:return"[object Promise]";case is:return Hn;case os:return Xn}return t});var As=sl?Qf:$a,ks=Ki(vs),Os=Cl||function(n,t){return kr.setTimeout(n,t)},Is=Ki(gs),Rs=function(n){var t=Rf(n,function(n){return r.size===rn&&r.clear(),n}),r=t.cache;return t}(function(n){var t=[];return 46===n.charCodeAt(0)&&t.push(""),n.replace(At,function(n,r,e,u){t.push(e?u.replace(Ct,"$1"):r||n)}),t}),zs=Xe(function(n,t){return qf(n)?ue(n,ae(t,1,qf,!0)):[]}),Es=Xe(function(n,t){var r=go(t);return qf(r)&&(r=Y),qf(n)?ue(n,ae(t,1,qf,!0),gi(r,2)):[]}),Ss=Xe(function(n,t){var r=go(t);return qf(r)&&(r=Y),qf(n)?ue(n,ae(t,1,qf,!0),Y,r):[]}),Ls=Xe(function(n){var t=c(n,du);return t.length&&t[0]===n[0]?we(t):[]}),Ws=Xe(function(n){var t=go(n),r=c(n,du);return t===go(r)?t=Y:r.pop(),r.length&&r[0]===n[0]?we(r,gi(t,2)):[]}),Cs=Xe(function(n){var t=go(n),r=c(n,du);return t="function"==typeof t?t:Y,t&&r.pop(),r.length&&r[0]===n[0]?we(r,Y,t):[]}),Us=Xe(wo),Bs=si(function(n,t){var r=null==n?0:n.length,e=Qr(n,t);return He(n,c(t,function(n){return zi(n,r)?+n:n}).sort(Ru)),e}),Ts=Xe(function(n){return su(ae(n,1,qf,!0))}),$s=Xe(function(n){var t=go(n);return qf(t)&&(t=Y),su(ae(n,1,qf,!0),gi(t,2))}),Ds=Xe(function(n){var t=go(n);return t="function"==typeof t?t:Y,su(ae(n,1,qf,!0),Y,t)}),Ms=Xe(function(n,t){return qf(n)?ue(n,t):[]}),Fs=Xe(function(n){return gu(i(n,qf))}),Ns=Xe(function(n){var t=go(n);return qf(t)&&(t=Y),gu(i(n,qf),gi(t,2))}),Ps=Xe(function(n){var t=go(n);return t="function"==typeof t?t:Y,gu(i(n,qf),Y,t)}),qs=Xe(No),Zs=Xe(function(n){var t=n.length,r=t>1?n[t-1]:Y;return r="function"==typeof r?(n.pop(),r):Y,Po(n,r)}),Ks=si(function(n){var t=n.length,r=t?n[0]:0,e=this.__wrapped__,u=function(t){return Qr(t,n)};return!(t>1||this.__actions__.length)&&e instanceof Wt&&zi(r)?(e=e.slice(r,+r+(t?1:0)),e.__actions__.push({func:Go,args:[u],thisArg:Y}),new H(e,this.__chain__).thru(function(n){return t&&!n.length&&n.push(Y),n})):this.thru(u)}),Vs=Bu(function(n,t,r){pl.call(n,r)?++n[r]:Yr(n,r,1)}),Gs=Zu(oo),Hs=Zu(fo),Js=Bu(function(n,t,r){pl.call(n,r)?n[r].push(t):Yr(n,r,[t])}),Ys=Xe(function(t,r,e){var u=-1,i="function"==typeof r,o=Pf(t)?Xa(t.length):[];return ss(t,function(t){o[++u]=i?n(r,t,e):xe(t,r,e)}),o}),Qs=Bu(function(n,t,r){Yr(n,r,t)}),Xs=Bu(function(n,t,r){n[r?0:1].push(t)},function(){return[[],[]]}),nh=Xe(function(n,t){if(null==n)return[];var r=t.length;return r>1&&Ei(n,t[0],t[1])?t=[]:r>2&&Ei(t[0],t[1],t[2])&&(t=[t[0]]),qe(n,ae(t,1),[])}),th=Wl||function(){return kr.Date.now()},rh=Xe(function(n,t,r){var e=ln;if(r.length){var u=F(r,vi(rh));e|=vn}return ui(n,e,t,r,u)}),eh=Xe(function(n,t,r){var e=ln|sn;if(r.length){var u=F(r,vi(eh));e|=vn}return ui(t,e,n,r,u)}),uh=Xe(function(n,t){return ee(n,1,t)}),ih=Xe(function(n,t,r){return ee(n,mc(t)||0,r)});Rf.Cache=or;var oh=ys(function(t,r){r=1==r.length&&ph(r[0])?c(r[0],R(gi())):c(ae(r,1),R(gi()));var e=r.length;return Xe(function(u){for(var i=-1,o=Pl(u.length,e);++i<o;)u[i]=r[i].call(this,u[i]);return n(t,this,u)})}),fh=Xe(function(n,t){var r=F(t,vi(fh));return ui(n,vn,Y,t,r)}),ch=Xe(function(n,t){var r=F(t,vi(ch));return ui(n,gn,Y,t,r)}),ah=si(function(n,t){return ui(n,dn,Y,Y,Y,t)}),lh=ni(ge),sh=ni(function(n,t){return n>=t}),hh=je(function(){return arguments}())?je:function(n){return rc(n)&&pl.call(n,"callee")&&!Ol.call(n,"callee")},ph=Xa.isArray,_h=Sr?R(Sr):Ae,vh=$l||$a,gh=Lr?R(Lr):ke,yh=Wr?R(Wr):Re,dh=Cr?R(Cr):Se,bh=Ur?R(Ur):Le,wh=Br?R(Br):We,mh=ni(Te),xh=ni(function(n,t){return n<=t}),jh=Tu(function(n,t){if(Ui(t)||Pf(t))return void Wu(t,Tc(t),n);for(var r in t)pl.call(t,r)&&Kr(n,r,t[r])}),Ah=Tu(function(n,t){Wu(t,$c(t),n)}),kh=Tu(function(n,t,r,e){Wu(t,$c(t),n,e)}),Oh=Tu(function(n,t,r,e){Wu(t,Tc(t),n,e)}),Ih=si(Qr),Rh=Xe(function(n,t){n=ul(n);var r=-1,e=t.length,u=e>2?t[2]:Y;for(u&&Ei(t[0],t[1],u)&&(e=1);++r<e;)for(var i=t[r],o=$c(i),f=-1,c=o.length;++f<c;){var a=o[f],l=n[a];(l===Y||Nf(l,ll[a])&&!pl.call(n,a))&&(n[a]=i[a])}return n}),zh=Xe(function(t){return t.push(Y,oi),n(Ch,Y,t)}),Eh=Gu(function(n,t,r){null!=t&&"function"!=typeof t.toString&&(t=gl.call(t)),n[t]=r},ka(Ia)),Sh=Gu(function(n,t,r){null!=t&&"function"!=typeof t.toString&&(t=gl.call(t)),pl.call(n,t)?n[t].push(r):n[t]=[r]},gi),Lh=Xe(xe),Wh=Tu(function(n,t,r){Fe(n,t,r)}),Ch=Tu(function(n,t,r,e){Fe(n,t,r,e)}),Uh=si(function(n,t){var r={};if(null==n)return r;var e=!1;t=c(t,function(t){return t=wu(t,n),e||(e=t.length>1),t}),Wu(n,pi(n),r),e&&(r=ne(r,un|on|fn,fi));for(var u=t.length;u--;)hu(r,t[u]);return r}),Bh=si(function(n,t){return null==n?{}:Ze(n,t)}),Th=ei(Tc),$h=ei($c),Dh=Nu(function(n,t,r){return t=t.toLowerCase(),n+(r?ta(t):t)}),Mh=Nu(function(n,t,r){return n+(r?"-":"")+t.toLowerCase()}),Fh=Nu(function(n,t,r){return n+(r?" ":"")+t.toLowerCase()}),Nh=Fu("toLowerCase"),Ph=Nu(function(n,t,r){return n+(r?"_":"")+t.toLowerCase()}),qh=Nu(function(n,t,r){return n+(r?" ":"")+Kh(t)}),Zh=Nu(function(n,t,r){return n+(r?" ":"")+t.toUpperCase()}),Kh=Fu("toUpperCase"),Vh=Xe(function(t,r){try{return n(t,Y,r)}catch(n){return Jf(n)?n:new tl(n)}}),Gh=si(function(n,t){return r(t,function(t){t=Gi(t),Yr(n,t,rh(n[t],n))}),n}),Hh=Ku(),Jh=Ku(!0),Yh=Xe(function(n,t){return function(r){return xe(r,n,t)}}),Qh=Xe(function(n,t){return function(r){
return xe(n,r,t)}}),Xh=Ju(c),np=Ju(u),tp=Ju(h),rp=Xu(),ep=Xu(!0),up=Hu(function(n,t){return n+t},0),ip=ri("ceil"),op=Hu(function(n,t){return n/t},1),fp=ri("floor"),cp=Hu(function(n,t){return n*t},1),ap=ri("round"),lp=Hu(function(n,t){return n-t},0);return q.after=mf,q.ary=xf,q.assign=jh,q.assignIn=Ah,q.assignInWith=kh,q.assignWith=Oh,q.at=Ih,q.before=jf,q.bind=rh,q.bindAll=Gh,q.bindKey=eh,q.castArray=Bf,q.chain=Ko,q.chunk=Qi,q.compact=Xi,q.concat=no,q.cond=ja,q.conforms=Aa,q.constant=ka,q.countBy=Vs,q.create=kc,q.curry=Af,q.curryRight=kf,q.debounce=Of,q.defaults=Rh,q.defaultsDeep=zh,q.defer=uh,q.delay=ih,q.difference=zs,q.differenceBy=Es,q.differenceWith=Ss,q.drop=to,q.dropRight=ro,q.dropRightWhile=eo,q.dropWhile=uo,q.fill=io,q.filter=ef,q.flatMap=uf,q.flatMapDeep=of,q.flatMapDepth=ff,q.flatten=co,q.flattenDeep=ao,q.flattenDepth=lo,q.flip=If,q.flow=Hh,q.flowRight=Jh,q.fromPairs=so,q.functions=Lc,q.functionsIn=Wc,q.groupBy=Js,q.initial=_o,q.intersection=Ls,q.intersectionBy=Ws,q.intersectionWith=Cs,q.invert=Eh,q.invertBy=Sh,q.invokeMap=Ys,q.iteratee=Ra,q.keyBy=Qs,q.keys=Tc,q.keysIn=$c,q.map=sf,q.mapKeys=Dc,q.mapValues=Mc,q.matches=za,q.matchesProperty=Ea,q.memoize=Rf,q.merge=Wh,q.mergeWith=Ch,q.method=Yh,q.methodOf=Qh,q.mixin=Sa,q.negate=zf,q.nthArg=Ca,q.omit=Uh,q.omitBy=Fc,q.once=Ef,q.orderBy=hf,q.over=Xh,q.overArgs=oh,q.overEvery=np,q.overSome=tp,q.partial=fh,q.partialRight=ch,q.partition=Xs,q.pick=Bh,q.pickBy=Nc,q.property=Ua,q.propertyOf=Ba,q.pull=Us,q.pullAll=wo,q.pullAllBy=mo,q.pullAllWith=xo,q.pullAt=Bs,q.range=rp,q.rangeRight=ep,q.rearg=ah,q.reject=vf,q.remove=jo,q.rest=Sf,q.reverse=Ao,q.sampleSize=yf,q.set=qc,q.setWith=Zc,q.shuffle=df,q.slice=ko,q.sortBy=nh,q.sortedUniq=Lo,q.sortedUniqBy=Wo,q.split=ha,q.spread=Lf,q.tail=Co,q.take=Uo,q.takeRight=Bo,q.takeRightWhile=To,q.takeWhile=$o,q.tap=Vo,q.throttle=Wf,q.thru=Go,q.toArray=yc,q.toPairs=Th,q.toPairsIn=$h,q.toPath=Pa,q.toPlainObject=xc,q.transform=Kc,q.unary=Cf,q.union=Ts,q.unionBy=$s,q.unionWith=Ds,q.uniq=Do,q.uniqBy=Mo,q.uniqWith=Fo,q.unset=Vc,q.unzip=No,q.unzipWith=Po,q.update=Gc,q.updateWith=Hc,q.values=Jc,q.valuesIn=Yc,q.without=Ms,q.words=xa,q.wrap=Uf,q.xor=Fs,q.xorBy=Ns,q.xorWith=Ps,q.zip=qs,q.zipObject=qo,q.zipObjectDeep=Zo,q.zipWith=Zs,q.entries=Th,q.entriesIn=$h,q.extend=Ah,q.extendWith=kh,Sa(q,q),q.add=up,q.attempt=Vh,q.camelCase=Dh,q.capitalize=ta,q.ceil=ip,q.clamp=Qc,q.clone=Tf,q.cloneDeep=Df,q.cloneDeepWith=Mf,q.cloneWith=$f,q.conformsTo=Ff,q.deburr=ra,q.defaultTo=Oa,q.divide=op,q.endsWith=ea,q.eq=Nf,q.escape=ua,q.escapeRegExp=ia,q.every=rf,q.find=Gs,q.findIndex=oo,q.findKey=Oc,q.findLast=Hs,q.findLastIndex=fo,q.findLastKey=Ic,q.floor=fp,q.forEach=cf,q.forEachRight=af,q.forIn=Rc,q.forInRight=zc,q.forOwn=Ec,q.forOwnRight=Sc,q.get=Cc,q.gt=lh,q.gte=sh,q.has=Uc,q.hasIn=Bc,q.head=ho,q.identity=Ia,q.includes=lf,q.indexOf=po,q.inRange=Xc,q.invoke=Lh,q.isArguments=hh,q.isArray=ph,q.isArrayBuffer=_h,q.isArrayLike=Pf,q.isArrayLikeObject=qf,q.isBoolean=Zf,q.isBuffer=vh,q.isDate=gh,q.isElement=Kf,q.isEmpty=Vf,q.isEqual=Gf,q.isEqualWith=Hf,q.isError=Jf,q.isFinite=Yf,q.isFunction=Qf,q.isInteger=Xf,q.isLength=nc,q.isMap=yh,q.isMatch=ec,q.isMatchWith=uc,q.isNaN=ic,q.isNative=oc,q.isNil=cc,q.isNull=fc,q.isNumber=ac,q.isObject=tc,q.isObjectLike=rc,q.isPlainObject=lc,q.isRegExp=dh,q.isSafeInteger=sc,q.isSet=bh,q.isString=hc,q.isSymbol=pc,q.isTypedArray=wh,q.isUndefined=_c,q.isWeakMap=vc,q.isWeakSet=gc,q.join=vo,q.kebabCase=Mh,q.last=go,q.lastIndexOf=yo,q.lowerCase=Fh,q.lowerFirst=Nh,q.lt=mh,q.lte=xh,q.max=Za,q.maxBy=Ka,q.mean=Va,q.meanBy=Ga,q.min=Ha,q.minBy=Ja,q.stubArray=Ta,q.stubFalse=$a,q.stubObject=Da,q.stubString=Ma,q.stubTrue=Fa,q.multiply=cp,q.nth=bo,q.noConflict=La,q.noop=Wa,q.now=th,q.pad=oa,q.padEnd=fa,q.padStart=ca,q.parseInt=aa,q.random=na,q.reduce=pf,q.reduceRight=_f,q.repeat=la,q.replace=sa,q.result=Pc,q.round=ap,q.runInContext=p,q.sample=gf,q.size=bf,q.snakeCase=Ph,q.some=wf,q.sortedIndex=Oo,q.sortedIndexBy=Io,q.sortedIndexOf=Ro,q.sortedLastIndex=zo,q.sortedLastIndexBy=Eo,q.sortedLastIndexOf=So,q.startCase=qh,q.startsWith=pa,q.subtract=lp,q.sum=Ya,q.sumBy=Qa,q.template=_a,q.times=Na,q.toFinite=dc,q.toInteger=bc,q.toLength=wc,q.toLower=va,q.toNumber=mc,q.toSafeInteger=jc,q.toString=Ac,q.toUpper=ga,q.trim=ya,q.trimEnd=da,q.trimStart=ba,q.truncate=wa,q.unescape=ma,q.uniqueId=qa,q.upperCase=Zh,q.upperFirst=Kh,q.each=cf,q.eachRight=af,q.first=ho,Sa(q,function(){var n={};return le(q,function(t,r){pl.call(q.prototype,r)||(n[r]=t)}),n}(),{chain:!1}),q.VERSION="4.17.14",r(["bind","bindKey","curry","curryRight","partial","partialRight"],function(n){q[n].placeholder=q}),r(["drop","take"],function(n,t){Wt.prototype[n]=function(r){r=r===Y?1:Nl(bc(r),0);var e=this.__filtered__&&!t?new Wt(this):this.clone();return e.__filtered__?e.__takeCount__=Pl(r,e.__takeCount__):e.__views__.push({size:Pl(r,En),type:n+(e.__dir__<0?"Right":"")}),e},Wt.prototype[n+"Right"]=function(t){return this.reverse()[n](t).reverse()}}),r(["filter","map","takeWhile"],function(n,t){var r=t+1,e=r==An||3==r;Wt.prototype[n]=function(n){var t=this.clone();return t.__iteratees__.push({iteratee:gi(n,3),type:r}),t.__filtered__=t.__filtered__||e,t}}),r(["head","last"],function(n,t){var r="take"+(t?"Right":"");Wt.prototype[n]=function(){return this[r](1).value()[0]}}),r(["initial","tail"],function(n,t){var r="drop"+(t?"":"Right");Wt.prototype[n]=function(){return this.__filtered__?new Wt(this):this[r](1)}}),Wt.prototype.compact=function(){return this.filter(Ia)},Wt.prototype.find=function(n){return this.filter(n).head()},Wt.prototype.findLast=function(n){return this.reverse().find(n)},Wt.prototype.invokeMap=Xe(function(n,t){return"function"==typeof n?new Wt(this):this.map(function(r){return xe(r,n,t)})}),Wt.prototype.reject=function(n){return this.filter(zf(gi(n)))},Wt.prototype.slice=function(n,t){n=bc(n);var r=this;return r.__filtered__&&(n>0||t<0)?new Wt(r):(n<0?r=r.takeRight(-n):n&&(r=r.drop(n)),t!==Y&&(t=bc(t),r=t<0?r.dropRight(-t):r.take(t-n)),r)},Wt.prototype.takeRightWhile=function(n){return this.reverse().takeWhile(n).reverse()},Wt.prototype.toArray=function(){return this.take(En)},le(Wt.prototype,function(n,t){var r=/^(?:filter|find|map|reject)|While$/.test(t),e=/^(?:head|last)$/.test(t),u=q[e?"take"+("last"==t?"Right":""):t],i=e||/^find/.test(t);u&&(q.prototype[t]=function(){var t=this.__wrapped__,o=e?[1]:arguments,f=t instanceof Wt,c=o[0],l=f||ph(t),s=function(n){var t=u.apply(q,a([n],o));return e&&h?t[0]:t};l&&r&&"function"==typeof c&&1!=c.length&&(f=l=!1);var h=this.__chain__,p=!!this.__actions__.length,_=i&&!h,v=f&&!p;if(!i&&l){t=v?t:new Wt(this);var g=n.apply(t,o);return g.__actions__.push({func:Go,args:[s],thisArg:Y}),new H(g,h)}return _&&v?n.apply(this,o):(g=this.thru(s),_?e?g.value()[0]:g.value():g)})}),r(["pop","push","shift","sort","splice","unshift"],function(n){var t=cl[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:pop|shift)$/.test(n);q.prototype[n]=function(){var n=arguments;if(e&&!this.__chain__){var u=this.value();return t.apply(ph(u)?u:[],n)}return this[r](function(r){return t.apply(ph(r)?r:[],n)})}}),le(Wt.prototype,function(n,t){var r=q[t];if(r){var e=r.name+"";pl.call(ts,e)||(ts[e]=[]),ts[e].push({name:t,func:r})}}),ts[Vu(Y,sn).name]=[{name:"wrapper",func:Y}],Wt.prototype.clone=Zt,Wt.prototype.reverse=Kt,Wt.prototype.value=Vt,q.prototype.at=Ks,q.prototype.chain=Ho,q.prototype.commit=Jo,q.prototype.next=Yo,q.prototype.plant=Xo,q.prototype.reverse=nf,q.prototype.toJSON=q.prototype.valueOf=q.prototype.value=tf,q.prototype.first=q.prototype.head,zl&&(q.prototype[zl]=Qo),q}();"function"==typeof define&&"object"==typeof define.amd&&define.amd?(kr._=Fr,define(function(){return Fr})):Ir?((Ir.exports=Fr)._=Fr,Or._=Fr):kr._=Fr}).call(this);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],87:[function(require,module,exports){
!function(){var r=require("crypt"),n=require("charenc").utf8,e=require("is-buffer"),t=require("charenc").bin,i=function(o,u){o.constructor==String?o=u&&"binary"===u.encoding?t.stringToBytes(o):n.stringToBytes(o):e(o)?o=Array.prototype.slice.call(o,0):Array.isArray(o)||(o=o.toString());for(var a=r.bytesToWords(o),s=8*o.length,c=1732584193,f=-271733879,g=-1732584194,l=271733878,y=0;y<a.length;y++)a[y]=16711935&(a[y]<<8|a[y]>>>24)|4278255360&(a[y]<<24|a[y]>>>8);a[s>>>5]|=128<<s%32,a[14+(s+64>>>9<<4)]=s;for(var h=i._ff,v=i._gg,_=i._hh,b=i._ii,y=0;y<a.length;y+=16){var d=c,T=f,p=g,q=l;c=h(c,f,g,l,a[y+0],7,-680876936),l=h(l,c,f,g,a[y+1],12,-389564586),g=h(g,l,c,f,a[y+2],17,606105819),f=h(f,g,l,c,a[y+3],22,-1044525330),c=h(c,f,g,l,a[y+4],7,-176418897),l=h(l,c,f,g,a[y+5],12,1200080426),g=h(g,l,c,f,a[y+6],17,-1473231341),f=h(f,g,l,c,a[y+7],22,-45705983),c=h(c,f,g,l,a[y+8],7,1770035416),l=h(l,c,f,g,a[y+9],12,-1958414417),g=h(g,l,c,f,a[y+10],17,-42063),f=h(f,g,l,c,a[y+11],22,-1990404162),c=h(c,f,g,l,a[y+12],7,1804603682),l=h(l,c,f,g,a[y+13],12,-40341101),g=h(g,l,c,f,a[y+14],17,-1502002290),f=h(f,g,l,c,a[y+15],22,1236535329),c=v(c,f,g,l,a[y+1],5,-165796510),l=v(l,c,f,g,a[y+6],9,-1069501632),g=v(g,l,c,f,a[y+11],14,643717713),f=v(f,g,l,c,a[y+0],20,-373897302),c=v(c,f,g,l,a[y+5],5,-701558691),l=v(l,c,f,g,a[y+10],9,38016083),g=v(g,l,c,f,a[y+15],14,-660478335),f=v(f,g,l,c,a[y+4],20,-405537848),c=v(c,f,g,l,a[y+9],5,568446438),l=v(l,c,f,g,a[y+14],9,-1019803690),g=v(g,l,c,f,a[y+3],14,-187363961),f=v(f,g,l,c,a[y+8],20,1163531501),c=v(c,f,g,l,a[y+13],5,-1444681467),l=v(l,c,f,g,a[y+2],9,-51403784),g=v(g,l,c,f,a[y+7],14,1735328473),f=v(f,g,l,c,a[y+12],20,-1926607734),c=_(c,f,g,l,a[y+5],4,-378558),l=_(l,c,f,g,a[y+8],11,-2022574463),g=_(g,l,c,f,a[y+11],16,1839030562),f=_(f,g,l,c,a[y+14],23,-35309556),c=_(c,f,g,l,a[y+1],4,-1530992060),l=_(l,c,f,g,a[y+4],11,1272893353),g=_(g,l,c,f,a[y+7],16,-155497632),f=_(f,g,l,c,a[y+10],23,-1094730640),c=_(c,f,g,l,a[y+13],4,681279174),l=_(l,c,f,g,a[y+0],11,-358537222),g=_(g,l,c,f,a[y+3],16,-722521979),f=_(f,g,l,c,a[y+6],23,76029189),c=_(c,f,g,l,a[y+9],4,-640364487),l=_(l,c,f,g,a[y+12],11,-421815835),g=_(g,l,c,f,a[y+15],16,530742520),f=_(f,g,l,c,a[y+2],23,-995338651),c=b(c,f,g,l,a[y+0],6,-198630844),l=b(l,c,f,g,a[y+7],10,1126891415),g=b(g,l,c,f,a[y+14],15,-1416354905),f=b(f,g,l,c,a[y+5],21,-57434055),c=b(c,f,g,l,a[y+12],6,1700485571),l=b(l,c,f,g,a[y+3],10,-1894986606),g=b(g,l,c,f,a[y+10],15,-1051523),f=b(f,g,l,c,a[y+1],21,-2054922799),c=b(c,f,g,l,a[y+8],6,1873313359),l=b(l,c,f,g,a[y+15],10,-30611744),g=b(g,l,c,f,a[y+6],15,-1560198380),f=b(f,g,l,c,a[y+13],21,1309151649),c=b(c,f,g,l,a[y+4],6,-145523070),l=b(l,c,f,g,a[y+11],10,-1120210379),g=b(g,l,c,f,a[y+2],15,718787259),f=b(f,g,l,c,a[y+9],21,-343485551),c=c+d>>>0,f=f+T>>>0,g=g+p>>>0,l=l+q>>>0}return r.endian([c,f,g,l])};i._ff=function(r,n,e,t,i,o,u){var a=r+(n&e|~n&t)+(i>>>0)+u;return(a<<o|a>>>32-o)+n},i._gg=function(r,n,e,t,i,o,u){var a=r+(n&t|e&~t)+(i>>>0)+u;return(a<<o|a>>>32-o)+n},i._hh=function(r,n,e,t,i,o,u){var a=r+(n^e^t)+(i>>>0)+u;return(a<<o|a>>>32-o)+n},i._ii=function(r,n,e,t,i,o,u){var a=r+(e^(n|~t))+(i>>>0)+u;return(a<<o|a>>>32-o)+n},i._blocksize=16,i._digestsize=16,module.exports=function(n,e){if(void 0===n||null===n)throw new Error("Illegal argument "+n);var o=r.wordsToBytes(i(n,e));return e&&e.asBytes?o:e&&e.asString?t.bytesToString(o):r.bytesToHex(o)}}();
},{"charenc":59,"crypt":63,"is-buffer":84}],88:[function(require,module,exports){
exports.encode=function(e){var n="";for(var o in e)e.hasOwnProperty(o)&&(n.length&&(n+="&"),n+=encodeURIComponent(o)+"="+encodeURIComponent(e[o]));return n},exports.decode=function(e){for(var n={},o=e.split("&"),t=0,r=o.length;t<r;t++){var d=o[t].split("=");n[decodeURIComponent(d[0])]=decodeURIComponent(d[1])}return n};
},{}],89:[function(require,module,exports){
var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,parts=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];module.exports=function(r){var e=r,t=r.indexOf("["),s=r.indexOf("]");-1!=t&&-1!=s&&(r=r.substring(0,t)+r.substring(t,s).replace(/:/g,";")+r.substring(s,r.length));for(var o=re.exec(r||""),a={},u=14;u--;)a[parts[u]]=o[u]||"";return-1!=t&&-1!=s&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a};
},{}],90:[function(require,module,exports){
function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}function runTimeout(e){if(cachedSetTimeout===setTimeout)return setTimeout(e,0);if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout)return cachedSetTimeout=setTimeout,setTimeout(e,0);try{return cachedSetTimeout(e,0)}catch(t){try{return cachedSetTimeout.call(null,e,0)}catch(t){return cachedSetTimeout.call(this,e,0)}}}function runClearTimeout(e){if(cachedClearTimeout===clearTimeout)return clearTimeout(e);if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout)return cachedClearTimeout=clearTimeout,clearTimeout(e);try{return cachedClearTimeout(e)}catch(t){try{return cachedClearTimeout.call(null,e)}catch(t){return cachedClearTimeout.call(this,e)}}}function cleanUpNextTick(){draining&&currentQueue&&(draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue())}function drainQueue(){if(!draining){var e=runTimeout(cleanUpNextTick);draining=!0;for(var t=queue.length;t;){for(currentQueue=queue,queue=[];++queueIndex<t;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,t=queue.length}currentQueue=null,draining=!1,runClearTimeout(e)}}function Item(e,t){this.fun=e,this.array=t}function noop(){}var process=module.exports={},cachedSetTimeout,cachedClearTimeout;!function(){try{cachedSetTimeout="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){cachedSetTimeout=defaultSetTimout}try{cachedClearTimeout="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){cachedClearTimeout=defaultClearTimeout}}();var queue=[],draining=!1,currentQueue,queueIndex=-1;process.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];queue.push(new Item(e,t)),1!==queue.length||draining||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.prependListener=noop,process.prependOnceListener=noop,process.listeners=function(e){return[]},process.binding=function(e){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(e){throw new Error("process.chdir is not supported")},process.umask=function(){return 0};
},{}],91:[function(require,module,exports){
function lookup(e,r){"object"==typeof e&&(r=e,e=void 0),r=r||{};var o,c=url(e),a=c.source,t=c.id,u=c.path,n=cache[t]&&u in cache[t].nsps,s=r.forceNew||r["force new connection"]||!1===r.multiplex||n;return s?(debug("ignoring socket cache for %s",a),o=Manager(a,r)):(cache[t]||(debug("new io instance for %s",a),cache[t]=Manager(a,r)),o=cache[t]),c.query&&!r.query&&(r.query=c.query),o.socket(c.path,r)}var url=require("./url"),parser=require("socket.io-parser"),Manager=require("./manager"),debug=require("debug")("socket.io-client");module.exports=exports=lookup;var cache=exports.managers={};exports.protocol=parser.protocol,exports.connect=lookup,exports.Manager=require("./manager"),exports.Socket=require("./socket");
},{"./manager":92,"./socket":94,"./url":95,"debug":96,"socket.io-parser":100}],92:[function(require,module,exports){
function Manager(t,e){if(!(this instanceof Manager))return new Manager(t,e);t&&"object"==typeof t&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(!1!==e.reconnection),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new Backoff({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[];var n=e.parser||parser;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this.autoConnect=!1!==e.autoConnect,this.autoConnect&&this.open()}var eio=require("engine.io-client"),Socket=require("./socket"),Emitter=require("component-emitter"),parser=require("socket.io-parser"),on=require("./on"),bind=require("component-bind"),debug=require("debug")("socket.io-client:manager"),indexOf=require("indexof"),Backoff=require("backo2"),has=Object.prototype.hasOwnProperty;module.exports=Manager,Manager.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)has.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments)},Manager.prototype.updateSocketIds=function(){for(var t in this.nsps)has.call(this.nsps,t)&&(this.nsps[t].id=this.generateId(t))},Manager.prototype.generateId=function(t){return("/"===t?"":t+"#")+this.engine.id},Emitter(Manager.prototype),Manager.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},Manager.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},Manager.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},Manager.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},Manager.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},Manager.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},Manager.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()},Manager.prototype.open=Manager.prototype.connect=function(t,e){if(debug("readyState %s",this.readyState),~this.readyState.indexOf("open"))return this;debug("opening %s",this.uri),this.engine=eio(this.uri,this.opts);var n=this.engine,o=this;this.readyState="opening",this.skipReconnect=!1;var i=on(n,"open",function(){o.onopen(),t&&t()}),s=on(n,"error",function(e){if(debug("connect_error"),o.cleanup(),o.readyState="closed",o.emitAll("connect_error",e),t){var n=new Error("Connection error");n.data=e,t(n)}else o.maybeReconnectOnOpen()});if(!1!==this._timeout){var r=this._timeout;debug("connect attempt will timeout after %d",r);var c=setTimeout(function(){debug("connect attempt timed out after %d",r),i.destroy(),n.close(),n.emit("error","timeout"),o.emitAll("connect_timeout",r)},r);this.subs.push({destroy:function(){clearTimeout(c)}})}return this.subs.push(i),this.subs.push(s),this},Manager.prototype.onopen=function(){debug("open"),this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(on(t,"data",bind(this,"ondata"))),this.subs.push(on(t,"ping",bind(this,"onping"))),this.subs.push(on(t,"pong",bind(this,"onpong"))),this.subs.push(on(t,"error",bind(this,"onerror"))),this.subs.push(on(t,"close",bind(this,"onclose"))),this.subs.push(on(this.decoder,"decoded",bind(this,"ondecoded")))},Manager.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},Manager.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},Manager.prototype.ondata=function(t){this.decoder.add(t)},Manager.prototype.ondecoded=function(t){this.emit("packet",t)},Manager.prototype.onerror=function(t){debug("error",t),this.emitAll("error",t)},Manager.prototype.socket=function(t,e){function n(){~indexOf(i.connecting,o)||i.connecting.push(o)}var o=this.nsps[t];if(!o){o=new Socket(this,t,e),this.nsps[t]=o;var i=this;o.on("connecting",n),o.on("connect",function(){o.id=i.generateId(t)}),this.autoConnect&&n()}return o},Manager.prototype.destroy=function(t){var e=indexOf(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},Manager.prototype.packet=function(t){debug("writing packet %j",t);var e=this;t.query&&0===t.type&&(t.nsp+="?"+t.query),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(n){for(var o=0;o<n.length;o++)e.engine.write(n[o],t.options);e.encoding=!1,e.processPacketQueue()}))},Manager.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},Manager.prototype.cleanup=function(){debug("cleanup");for(var t=this.subs.length,e=0;e<t;e++){this.subs.shift().destroy()}this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy()},Manager.prototype.close=Manager.prototype.disconnect=function(){debug("disconnect"),this.skipReconnect=!0,this.reconnecting=!1,"opening"===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close()},Manager.prototype.onclose=function(t){debug("onclose"),this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},Manager.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)debug("reconnect failed"),this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();debug("will wait %dms before reconnect attempt",e),this.reconnecting=!0;var n=setTimeout(function(){t.skipReconnect||(debug("attempting reconnect"),t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(debug("reconnect attempt error"),t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):(debug("reconnect success"),t.onreconnect())}))},e);this.subs.push({destroy:function(){clearTimeout(n)}})}},Manager.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)};
},{"./on":93,"./socket":94,"backo2":53,"component-bind":60,"component-emitter":61,"debug":96,"engine.io-client":64,"indexof":83,"socket.io-parser":100}],93:[function(require,module,exports){
function on(n,o,e){return n.on(o,e),{destroy:function(){n.removeListener(o,e)}}}module.exports=on;
},{}],94:[function(require,module,exports){
function Socket(t,e,s){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,this.flags={},s&&s.query&&(this.query=s.query),this.io.autoConnect&&this.open()}var parser=require("socket.io-parser"),Emitter=require("component-emitter"),toArray=require("to-array"),on=require("./on"),bind=require("component-bind"),debug=require("debug")("socket.io-client:socket"),parseqs=require("parseqs"),hasBin=require("has-binary2");module.exports=exports=Socket;var events={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},emit=Emitter.prototype.emit;Emitter(Socket.prototype),Socket.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[on(t,"open",bind(this,"onopen")),on(t,"packet",bind(this,"onpacket")),on(t,"close",bind(this,"onclose"))]}},Socket.prototype.open=Socket.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"===this.io.readyState&&this.onopen(),this.emit("connecting"),this)},Socket.prototype.send=function(){var t=toArray(arguments);return t.unshift("message"),this.emit.apply(this,t),this},Socket.prototype.emit=function(t){if(events.hasOwnProperty(t))return emit.apply(this,arguments),this;var e=toArray(arguments),s={type:(void 0!==this.flags.binary?this.flags.binary:hasBin(e))?parser.BINARY_EVENT:parser.EVENT,data:e};return s.options={},s.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(debug("emitting packet with ack id %d",this.ids),this.acks[this.ids]=e.pop(),s.id=this.ids++),this.connected?this.packet(s):this.sendBuffer.push(s),this.flags={},this},Socket.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},Socket.prototype.onopen=function(){if(debug("transport is open - connecting"),"/"!==this.nsp)if(this.query){var t="object"==typeof this.query?parseqs.encode(this.query):this.query;debug("sending connect packet with query %s",t),this.packet({type:parser.CONNECT,query:t})}else this.packet({type:parser.CONNECT})},Socket.prototype.onclose=function(t){debug("close (%s)",t),this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},Socket.prototype.onpacket=function(t){var e=t.nsp===this.nsp,s=t.type===parser.ERROR&&"/"===t.nsp;if(e||s)switch(t.type){case parser.CONNECT:this.onconnect();break;case parser.EVENT:case parser.BINARY_EVENT:this.onevent(t);break;case parser.ACK:case parser.BINARY_ACK:this.onack(t);break;case parser.DISCONNECT:this.ondisconnect();break;case parser.ERROR:this.emit("error",t.data)}},Socket.prototype.onevent=function(t){var e=t.data||[];debug("emitting event %j",e),null!=t.id&&(debug("attaching ack callback to event"),e.push(this.ack(t.id))),this.connected?emit.apply(this,e):this.receiveBuffer.push(e)},Socket.prototype.ack=function(t){var e=this,s=!1;return function(){if(!s){s=!0;var i=toArray(arguments);debug("sending ack %j",i),e.packet({type:hasBin(i)?parser.BINARY_ACK:parser.ACK,id:t,data:i})}}},Socket.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e?(debug("calling ack %s with %j",t.id,t.data),e.apply(this,t.data),delete this.acks[t.id]):debug("bad ack %s",t.id)},Socket.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},Socket.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)emit.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},Socket.prototype.ondisconnect=function(){debug("server disconnect (%s)",this.nsp),this.destroy(),this.onclose("io server disconnect")},Socket.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},Socket.prototype.close=Socket.prototype.disconnect=function(){return this.connected&&(debug("performing disconnect (%s)",this.nsp),this.packet({type:parser.DISCONNECT})),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},Socket.prototype.compress=function(t){return this.flags.compress=t,this},Socket.prototype.binary=function(t){return this.flags.binary=t,this};
},{"./on":93,"component-bind":60,"component-emitter":61,"debug":96,"has-binary2":79,"parseqs":88,"socket.io-parser":100,"to-array":108}],95:[function(require,module,exports){
function url(o,t){var r=o;t=t||"undefined"!=typeof location&&location,null==o&&(o=t.protocol+"//"+t.host),"string"==typeof o&&("/"===o.charAt(0)&&(o="/"===o.charAt(1)?t.protocol+o:t.host+o),/^(https?|wss?):\/\//.test(o)||(debug("protocol-less url %s",o),o=void 0!==t?t.protocol+"//"+o:"https://"+o),debug("parse %s",o),r=parseuri(o)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";var p=-1!==r.host.indexOf(":"),e=p?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+e+":"+r.port,r.href=r.protocol+"://"+e+(t&&t.port===r.port?"":":"+r.port),r}var parseuri=require("parseuri"),debug=require("debug")("socket.io-client:url");module.exports=url;
},{"debug":96,"parseuri":89}],96:[function(require,module,exports){
(function (process){
function useColors(){return!("undefined"==typeof window||!window.process||"renderer"!==window.process.type)||("undefined"==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))}function formatArgs(e){var o=this.useColors;if(e[0]=(o?"%c":"")+this.namespace+(o?" %c":" ")+e[0]+(o?"%c ":" ")+"+"+exports.humanize(this.diff),o){var C="color: "+this.color;e.splice(1,0,C,"color: inherit");var t=0,r=0;e[0].replace(/%[a-zA-Z%]/g,function(e){"%%"!==e&&(t++,"%c"===e&&(r=t))}),e.splice(r,0,C)}}function log(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function save(e){try{null==e?exports.storage.removeItem("debug"):exports.storage.debug=e}catch(e){}}function load(){var e;try{e=exports.storage.debug}catch(e){}return!e&&"undefined"!=typeof process&&"env"in process&&(e=process.env.DEBUG),e}function localstorage(){try{return window.localStorage}catch(e){}}exports=module.exports=require("./debug"),exports.log=log,exports.formatArgs=formatArgs,exports.save=save,exports.load=load,exports.useColors=useColors,exports.storage="undefined"!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:localstorage(),exports.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],exports.formatters.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}},exports.enable(load());
}).call(this,require('_process'))

},{"./debug":97,"_process":90}],97:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74,"ms":98}],98:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75}],99:[function(require,module,exports){
function _deconstructPacket(t,e){if(!t)return t;if(isBuf(t)){var r={_placeholder:!0,num:e.length};return e.push(t),r}if(isArray(t)){for(var n=new Array(t.length),o=0;o<t.length;o++)n[o]=_deconstructPacket(t[o],e);return n}if("object"==typeof t&&!(t instanceof Date)){var n={};for(var i in t)n[i]=_deconstructPacket(t[i],e);return n}return t}function _reconstructPacket(t,e){if(!t)return t;if(t&&t._placeholder)return e[t.num];if(isArray(t))for(var r=0;r<t.length;r++)t[r]=_reconstructPacket(t[r],e);else if("object"==typeof t)for(var n in t)t[n]=_reconstructPacket(t[n],e);return t}var isArray=require("isarray"),isBuf=require("./is-buffer"),toString=Object.prototype.toString,withNativeBlob="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===toString.call(Blob),withNativeFile="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===toString.call(File);exports.deconstructPacket=function(t){var e=[],r=t.data,n=t;return n.data=_deconstructPacket(r,e),n.attachments=e.length,{packet:n,buffers:e}},exports.reconstructPacket=function(t,e){return t.data=_reconstructPacket(t.data,e),t.attachments=void 0,t},exports.removeBlobs=function(t,e){function r(t,i,a){if(!t)return t;if(withNativeBlob&&t instanceof Blob||withNativeFile&&t instanceof File){n++;var c=new FileReader;c.onload=function(){a?a[i]=this.result:o=this.result,--n||e(o)},c.readAsArrayBuffer(t)}else if(isArray(t))for(var f=0;f<t.length;f++)r(t[f],f,t);else if("object"==typeof t&&!isBuf(t))for(var u in t)r(t[u],u,t)}var n=0,o=t;r(o),n||e(o)};
},{"./is-buffer":101,"isarray":104}],100:[function(require,module,exports){
function Encoder(){}function encodeAsString(r){var t=""+r.type;if(exports.BINARY_EVENT!==r.type&&exports.BINARY_ACK!==r.type||(t+=r.attachments+"-"),r.nsp&&"/"!==r.nsp&&(t+=r.nsp+","),null!=r.id&&(t+=r.id),null!=r.data){var e=tryStringify(r.data);if(!1===e)return ERROR_PACKET;t+=e}return debug("encoded %j as %s",r,t),t}function tryStringify(r){try{return JSON.stringify(r)}catch(r){return!1}}function encodeAsBinary(r,t){function e(r){var e=binary.deconstructPacket(r),n=encodeAsString(e.packet),o=e.buffers;o.unshift(n),t(o)}binary.removeBlobs(r,e)}function Decoder(){this.reconstructor=null}function decodeString(r){var t=0,e={type:Number(r.charAt(0))};if(null==exports.types[e.type])return error("unknown packet type "+e.type);if(exports.BINARY_EVENT===e.type||exports.BINARY_ACK===e.type){for(var n="";"-"!==r.charAt(++t)&&(n+=r.charAt(t),t!=r.length););if(n!=Number(n)||"-"!==r.charAt(t))throw new Error("Illegal attachments");e.attachments=Number(n)}if("/"===r.charAt(t+1))for(e.nsp="";++t;){var o=r.charAt(t);if(","===o)break;if(e.nsp+=o,t===r.length)break}else e.nsp="/";var i=r.charAt(t+1);if(""!==i&&Number(i)==i){for(e.id="";++t;){var o=r.charAt(t);if(null==o||Number(o)!=o){--t;break}if(e.id+=r.charAt(t),t===r.length)break}e.id=Number(e.id)}if(r.charAt(++t)){var s=tryParse(r.substr(t));if(!(!1!==s&&(e.type===exports.ERROR||isArray(s))))return error("invalid payload");e.data=s}return debug("decoded %s as %j",r,e),e}function tryParse(r){try{return JSON.parse(r)}catch(r){return!1}}function BinaryReconstructor(r){this.reconPack=r,this.buffers=[]}function error(r){return{type:exports.ERROR,data:"parser error: "+r}}var debug=require("debug")("socket.io-parser"),Emitter=require("component-emitter"),binary=require("./binary"),isArray=require("isarray"),isBuf=require("./is-buffer");exports.protocol=4,exports.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"],exports.CONNECT=0,exports.DISCONNECT=1,exports.EVENT=2,exports.ACK=3,exports.ERROR=4,exports.BINARY_EVENT=5,exports.BINARY_ACK=6,exports.Encoder=Encoder,exports.Decoder=Decoder;var ERROR_PACKET=exports.ERROR+'"encode error"';Encoder.prototype.encode=function(r,t){if(debug("encoding packet %j",r),exports.BINARY_EVENT===r.type||exports.BINARY_ACK===r.type)encodeAsBinary(r,t);else{t([encodeAsString(r)])}},Emitter(Decoder.prototype),Decoder.prototype.add=function(r){var t;if("string"==typeof r)t=decodeString(r),exports.BINARY_EVENT===t.type||exports.BINARY_ACK===t.type?(this.reconstructor=new BinaryReconstructor(t),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",t)):this.emit("decoded",t);else{if(!isBuf(r)&&!r.base64)throw new Error("Unknown type: "+r);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");(t=this.reconstructor.takeBinaryData(r))&&(this.reconstructor=null,this.emit("decoded",t))}},Decoder.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},BinaryReconstructor.prototype.takeBinaryData=function(r){if(this.buffers.push(r),this.buffers.length===this.reconPack.attachments){var t=binary.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null},BinaryReconstructor.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]};
},{"./binary":99,"./is-buffer":101,"component-emitter":61,"debug":102,"isarray":104}],101:[function(require,module,exports){
(function (Buffer){
function isBuf(f){return withNativeBuffer&&Buffer.isBuffer(f)||withNativeArrayBuffer&&(f instanceof ArrayBuffer||isView(f))}module.exports=isBuf;var withNativeBuffer="function"==typeof Buffer&&"function"==typeof Buffer.isBuffer,withNativeArrayBuffer="function"==typeof ArrayBuffer,isView=function(f){return"function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(f):f.buffer instanceof ArrayBuffer};
}).call(this,require("buffer").Buffer)

},{"buffer":58}],102:[function(require,module,exports){
(function (process){
function useColors(){return!("undefined"==typeof window||!window.process||"renderer"!==window.process.type)||("undefined"==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))}function formatArgs(e){var o=this.useColors;if(e[0]=(o?"%c":"")+this.namespace+(o?" %c":" ")+e[0]+(o?"%c ":" ")+"+"+exports.humanize(this.diff),o){var C="color: "+this.color;e.splice(1,0,C,"color: inherit");var t=0,r=0;e[0].replace(/%[a-zA-Z%]/g,function(e){"%%"!==e&&(t++,"%c"===e&&(r=t))}),e.splice(r,0,C)}}function log(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function save(e){try{null==e?exports.storage.removeItem("debug"):exports.storage.debug=e}catch(e){}}function load(){var e;try{e=exports.storage.debug}catch(e){}return!e&&"undefined"!=typeof process&&"env"in process&&(e=process.env.DEBUG),e}function localstorage(){try{return window.localStorage}catch(e){}}exports=module.exports=require("./debug"),exports.log=log,exports.formatArgs=formatArgs,exports.save=save,exports.load=load,exports.useColors=useColors,exports.storage="undefined"!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:localstorage(),exports.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],exports.formatters.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}},exports.enable(load());
}).call(this,require('_process'))

},{"./debug":103,"_process":90}],103:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74,"ms":105}],104:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"dup":80}],105:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75}],106:[function(require,module,exports){
'use strict';
const ansiRegex = require('ansi-regex');

const stripAnsi = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;

module.exports = stripAnsi;
module.exports.default = stripAnsi;

},{"ansi-regex":107}],107:[function(require,module,exports){
'use strict';

module.exports = options => {
	options = Object.assign({
		onlyFirst: false
	}, options);

	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, options.onlyFirst ? undefined : 'g');
};

},{}],108:[function(require,module,exports){
function toArray(r,o){var t=[];o=o||0;for(var a=o||0;a<r.length;a++)t[a-o]=r[a];return t}module.exports=toArray;
},{}],109:[function(require,module,exports){
"use strict";function encode(e){var t="";do{t=alphabet[e%length]+t,e=Math.floor(e/length)}while(e>0);return t}function decode(e){var t=0;for(i=0;i<e.length;i++)t=t*length+map[e.charAt(i)];return t}function yeast(){var e=encode(+new Date);return e!==prev?(seed=0,prev=e):e+"."+encode(seed++)}for(var alphabet="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),length=64,map={},seed=0,i=0,prev;i<length;i++)map[alphabet[i]]=i;yeast.encode=encode,yeast.decode=decode,module.exports=yeast;
},{}],110:[function(require,module,exports){
(function (global){

; angular = global.angular = require("angular");
; var __browserify_shim_require__=require;(function browserifyShim(module, define, require) {
angular.module('ui.bootstrap', ['ui.bootstrap.buttons','ui.bootstrap.position','ui.bootstrap.datepicker','ui.bootstrap.pagination','ui.bootstrap.rating','ui.bootstrap.timepicker','ui.bootstrap.bindHtml','ui.bootstrap.typeahead']);
angular.module('ui.bootstrap.buttons', [])

  .constant('buttonConfig', {
    activeClass:'active',
    toggleEvent:'click'
  })

  .directive('btnRadio', ['buttonConfig', function (buttonConfig) {
    var activeClass = buttonConfig.activeClass || 'active';
    var toggleEvent = buttonConfig.toggleEvent || 'click';

    return {

      require:'ngModel',
      link:function (scope, element, attrs, ngModelCtrl) {

      //model -> UI
        ngModelCtrl.$render = function () {
          element.toggleClass(activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
        };

        //ui->model
        element.bind(toggleEvent, function () {
          if (!element.hasClass(activeClass)) {
            scope.$apply(function () {
              ngModelCtrl.$setViewValue(scope.$eval(attrs.btnRadio));
              ngModelCtrl.$render();
            });
          }
        });
      }
    };
  }])

  .directive('btnCheckbox', ['buttonConfig', function (buttonConfig) {

    var activeClass = buttonConfig.activeClass || 'active';
    var toggleEvent = buttonConfig.toggleEvent || 'click';

    return {
      require:'ngModel',
      link:function (scope, element, attrs, ngModelCtrl) {

        function getTrueValue() {
          var trueValue = scope.$eval(attrs.btnCheckboxTrue);
          return angular.isDefined(trueValue) ? trueValue : true;
        }

        function getFalseValue() {
          var falseValue = scope.$eval(attrs.btnCheckboxFalse);
          return angular.isDefined(falseValue) ? falseValue : false;
        }

        //model -> UI
        ngModelCtrl.$render = function () {
          element.toggleClass(activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
        };

        //ui->model
        element.bind(toggleEvent, function () {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(element.hasClass(activeClass) ? getFalseValue() : getTrueValue());
            ngModelCtrl.$render();
          });
        });
      }
    };
  }]);
angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        return {
          width: element.prop('offsetWidth'),
          height: element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: element.prop('offsetWidth'),
          height: element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft  || $document[0].documentElement.scrollLeft)
        };
      }
    };
  }]);

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.position'])

  .constant('datepickerConfig', {
    dayFormat: 'dd',
    monthFormat: 'MMMM',
    yearFormat: 'yyyy',
    dayHeaderFormat: 'EEE',
    dayTitleFormat: 'MMMM yyyy',
    monthTitleFormat: 'yyyy',
    showWeeks: true,
    startingDay: 0,
    yearRange: 20,
    minDate: null,
    maxDate: null
  })

  .controller('DatepickerController', ['$scope', '$attrs', 'dateFilter', 'datepickerConfig', function ($scope, $attrs, dateFilter, dtConfig) {
    var format = {
        day:        getValue($attrs.dayFormat,        dtConfig.dayFormat),
        month:      getValue($attrs.monthFormat,      dtConfig.monthFormat),
        year:       getValue($attrs.yearFormat,       dtConfig.yearFormat),
        dayHeader:  getValue($attrs.dayHeaderFormat,  dtConfig.dayHeaderFormat),
        dayTitle:   getValue($attrs.dayTitleFormat,   dtConfig.dayTitleFormat),
        monthTitle: getValue($attrs.monthTitleFormat, dtConfig.monthTitleFormat)
      },
      startingDay = getValue($attrs.startingDay,      dtConfig.startingDay),
      yearRange =   getValue($attrs.yearRange,        dtConfig.yearRange);

    this.minDate = dtConfig.minDate ? new Date(dtConfig.minDate) : null;
    this.maxDate = dtConfig.maxDate ? new Date(dtConfig.maxDate) : null;

    function getValue(value, defaultValue) {
      return angular.isDefined(value) ? $scope.$parent.$eval(value) : defaultValue;
    }

    function getDaysInMonth( year, month ) {
      return new Date(year, month, 0).getDate();
    }

    function getDates(startDate, n) {
      var dates = new Array(n);
      var current = startDate, i = 0;
      while (i < n) {
        dates[i++] = new Date(current);
        current.setDate( current.getDate() + 1 );
      }
      return dates;
    }

    function makeDate(date, format, isSelected, isSecondary) {
      return { date: date, label: dateFilter(date, format), selected: !!isSelected, secondary: !!isSecondary };
    }

    this.modes = [
      {
        name: 'day',
        getVisibleDates: function (date, selected) {
          var year = date.getFullYear(), month = date.getMonth(), firstDayOfMonth = new Date(year, month, 1);
          var difference = startingDay - firstDayOfMonth.getDay(),
            numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
            firstDate = new Date(firstDayOfMonth), numDates = 0;

          if ( numDisplayedFromPreviousMonth > 0 ) {
            firstDate.setDate( - numDisplayedFromPreviousMonth + 1 );
            numDates += numDisplayedFromPreviousMonth; // Previous
          }
          numDates += getDaysInMonth(year, month + 1); // Current
          numDates += (7 - numDates % 7) % 7; // Next

          var days = getDates(firstDate, numDates), labels = new Array(7);
          for (var i = 0; i < numDates; i ++) {
            var dt = new Date(days[i]);
            days[i] = makeDate(dt, format.day, (selected && selected.getDate() === dt.getDate() && selected.getMonth() === dt.getMonth() && selected.getFullYear() === dt.getFullYear()), dt.getMonth() !== month);
          }
          for (var j = 0; j < 7; j++) {
            labels[j] = dateFilter(days[j].date, format.dayHeader);
          }
          return { objects: days, title: dateFilter(date, format.dayTitle), labels: labels };
        },
        compare: function (date1, date2) {
          return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
        },
        split: 7,
        step: { months: 1 }
      },
      {
        name: 'month',
        getVisibleDates: function (date, selected) {
          var months = new Array(12), year = date.getFullYear();
          for ( var i = 0; i < 12; i++ ) {
            var dt = new Date(year, i, 1);
            months[i] = makeDate(dt, format.month, (selected && selected.getMonth() === i && selected.getFullYear() === year));
          }
          return { objects: months, title: dateFilter(date, format.monthTitle) };
        },
        compare: function (date1, date2) {
          return new Date( date1.getFullYear(), date1.getMonth() ) - new Date( date2.getFullYear(), date2.getMonth() );
        },
        split: 3,
        step: { years: 1 }
      },
      {
        name: 'year',
        getVisibleDates: function (date, selected) {
          var years = new Array(yearRange), year = date.getFullYear(), startYear = parseInt((year - 1) / yearRange, 10) * yearRange + 1;
          for ( var i = 0; i < yearRange; i++ ) {
            var dt = new Date(startYear + i, 0, 1);
            years[i] = makeDate(dt, format.year, (selected && selected.getFullYear() === dt.getFullYear()));
          }
          return { objects: years, title: [years[0].label, years[yearRange - 1].label].join(' - ') };
        },
        compare: function (date1, date2) {
          return date1.getFullYear() - date2.getFullYear();
        },
        split: 5,
        step: { years: yearRange }
      }
    ];

    this.isDisabled = function (date, mode) {
      var currentMode = this.modes[mode || 0];
      return ((this.minDate && currentMode.compare(date, this.minDate) < 0) || (this.maxDate && currentMode.compare(date, this.maxDate) > 0) || ($scope.dateDisabled && $scope.dateDisabled({date: date, mode: currentMode.name})));
    };
  }])

  .directive( 'datepicker', ['dateFilter', '$parse', 'datepickerConfig', '$log', function (dateFilter, $parse, datepickerConfig, $log) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/datepicker/datepicker.html',
      scope: {
        dateDisabled: '&'
      },
      require: ['datepicker', '?^ngModel'],
      controller: 'DatepickerController',
      link: function (scope, element, attrs, ctrls) {
        var datepickerCtrl = ctrls[0], ngModel = ctrls[1];

        if (!ngModel) {
          return; // do nothing if no ng-model
        }

        // Configuration parameters
        var mode = 0, selected = new Date(), showWeeks = datepickerConfig.showWeeks;

        if (attrs.showWeeks) {
          scope.$parent.$watch($parse(attrs.showWeeks), function (value) {
            showWeeks = !! value;
            updateShowWeekNumbers();
          });
        } else {
          updateShowWeekNumbers();
        }

        if (attrs.min) {
          scope.$parent.$watch($parse(attrs.min), function (value) {
            datepickerCtrl.minDate = value ? new Date(value) : null;
            refill();
          });
        }
        if (attrs.max) {
          scope.$parent.$watch($parse(attrs.max), function (value) {
            datepickerCtrl.maxDate = value ? new Date(value) : null;
            refill();
          });
        }

        function updateShowWeekNumbers() {
          scope.showWeekNumbers = mode === 0 && showWeeks;
        }

        // Split array into smaller arrays
        function split(arr, size) {
          var arrays = [];
          while (arr.length > 0) {
            arrays.push(arr.splice(0, size));
          }
          return arrays;
        }

        function refill( updateSelected ) {
          var date = null, valid = true;

          if ( ngModel.$modelValue ) {
            date = new Date( ngModel.$modelValue );

            if ( isNaN(date) ) {
              valid = false;
              $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
            } else if ( updateSelected ) {
              selected = date;
            }
          }
          ngModel.$setValidity('date', valid);

          var currentMode = datepickerCtrl.modes[mode], data = currentMode.getVisibleDates(selected, date);
          angular.forEach(data.objects, function (obj) {
            obj.disabled = datepickerCtrl.isDisabled(obj.date, mode);
          });

          ngModel.$setValidity('date-disabled', (!date || !datepickerCtrl.isDisabled(date)));

          scope.rows = split(data.objects, currentMode.split);
          scope.labels = data.labels || [];
          scope.title = data.title;
        }

        function setMode(value) {
          mode = value;
          updateShowWeekNumbers();
          refill();
        }

        ngModel.$render = function () {
          refill( true );
        };

        scope.select = function ( date ) {
          if ( mode === 0 ) {
            var dt = new Date( ngModel.$modelValue );
            dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
            ngModel.$setViewValue( dt );
            refill( true );
          } else {
            selected = date;
            setMode( mode - 1 );
          }
        };
        scope.move = function (direction) {
          var step = datepickerCtrl.modes[mode].step;
          selected.setMonth( selected.getMonth() + direction * (step.months || 0) );
          selected.setFullYear( selected.getFullYear() + direction * (step.years || 0) );
          refill();
        };
        scope.toggleMode = function () {
          setMode( (mode + 1) % datepickerCtrl.modes.length );
        };
        scope.getWeekNumber = function (row) {
          return ( mode === 0 && scope.showWeekNumbers && row.length === 7 ) ? getISO8601WeekNumber(row[0].date) : null;
        };

        function getISO8601WeekNumber(date) {
          var checkDate = new Date(date);
          checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
          var time = checkDate.getTime();
          checkDate.setMonth(0); // Compare with Jan 1
          checkDate.setDate(1);
          return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        }
      }
    };
  }])

  .constant('datepickerPopupConfig', {
    dateFormat: 'yyyy-MM-dd',
    closeOnDateSelection: true
  })

  .directive('datepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'datepickerPopupConfig',
    function ($compile, $parse, $document, $position, dateFilter, datepickerPopupConfig) {
      return {
        restrict: 'EA',
        require: 'ngModel',
        link: function (originalScope, element, attrs, ngModel) {

          var closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection;
          var dateFormat = attrs.datepickerPopup || datepickerPopupConfig.dateFormat;

          // create a child scope for the datepicker directive so we are not polluting original scope
          var scope = originalScope.$new();
          originalScope.$on('$destroy', function () {
            scope.$destroy();
          });

          var getIsOpen, setIsOpen;
          if ( attrs.isOpen ) {
            getIsOpen = $parse(attrs.isOpen);
            setIsOpen = getIsOpen.assign;

            originalScope.$watch(getIsOpen, function updateOpen(value) {
              scope.isOpen = !! value;
            });
          }
          scope.isOpen = getIsOpen ? getIsOpen(originalScope) : false; // Initial state

          function setOpen( value ) {
            if (setIsOpen) {
              setIsOpen(originalScope, !!value);
            } else {
              scope.isOpen = !!value;
            }
          }

          var documentClickBind = function (event) {
            if (scope.isOpen && event.target !== element[0]) {
              scope.$apply(function () {
                setOpen(false);
              });
            }
          };

          var elementFocusBind = function () {
            scope.$apply(function () {
              setOpen( true );
            });
          };

          // popup element used to display calendar
          var popupEl = angular.element('<datepicker-popup-wrap><datepicker></datepicker></datepicker-popup-wrap>');
          popupEl.attr({
            'ng-model': 'date',
            'ng-change': 'dateSelection()'
          });
          var datepickerEl = popupEl.find('datepicker');
          if (attrs.datepickerOptions) {
            datepickerEl.attr(angular.extend({}, originalScope.$eval(attrs.datepickerOptions)));
          }

          // TODO: reverse from dateFilter string to Date object
          function parseDate(viewValue) {
            if (!viewValue) {
              ngModel.$setValidity('date', true);
              return null;
            } else if (angular.isDate(viewValue)) {
              ngModel.$setValidity('date', true);
              return viewValue;
            } else if (angular.isString(viewValue)) {
              var date = new Date(viewValue);
              if (isNaN(date)) {
                ngModel.$setValidity('date', false);
                return undefined;
              } else {
                ngModel.$setValidity('date', true);
                return date;
              }
            } else {
              ngModel.$setValidity('date', false);
              return undefined;
            }
          }
          ngModel.$parsers.unshift(parseDate);

          // Inner change
          scope.dateSelection = function () {
            ngModel.$setViewValue(scope.date);
            ngModel.$render();

            if (closeOnDateSelection) {
              setOpen( false );
            }
          };

          element.bind('input change keyup', function () {
            scope.$apply(function () {
              updateCalendar();
            });
          });

          // Outter change
          ngModel.$render = function () {
            var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
            element.val(date);

            updateCalendar();
          };

          function updateCalendar() {
            scope.date = ngModel.$modelValue;
            updatePosition();
          }

          function addWatchableAttribute(attribute, scopeProperty, datepickerAttribute) {
            if (attribute) {
              originalScope.$watch($parse(attribute), function (value){
                scope[scopeProperty] = value;
              });
              datepickerEl.attr(datepickerAttribute || scopeProperty, scopeProperty);
            }
          }
          addWatchableAttribute(attrs.min, 'min');
          addWatchableAttribute(attrs.max, 'max');
          if (attrs.showWeeks) {
            addWatchableAttribute(attrs.showWeeks, 'showWeeks', 'show-weeks');
          } else {
            scope.showWeeks = true;
            datepickerEl.attr('show-weeks', 'showWeeks');
          }
          if (attrs.dateDisabled) {
            datepickerEl.attr('date-disabled', attrs.dateDisabled);
          }

          function updatePosition() {
            scope.position = $position.position(element);
            scope.position.top = scope.position.top + element.prop('offsetHeight');
          }

          var documentBindingInitialized = false, elementFocusInitialized = false;
          scope.$watch('isOpen', function (value) {
            if (value) {
              updatePosition();
              $document.bind('click', documentClickBind);
              if(elementFocusInitialized) {
                element.unbind('focus', elementFocusBind);
              }
              element[0].focus();
              documentBindingInitialized = true;
            } else {
              if(documentBindingInitialized) {
                $document.unbind('click', documentClickBind);
              }
              element.bind('focus', elementFocusBind);
              elementFocusInitialized = true;
            }

            if ( setIsOpen ) {
              setIsOpen(originalScope, value);
            }
          });

          var $setModelValue = $parse(attrs.ngModel).assign;

          scope.today = function () {
            $setModelValue(originalScope, new Date());
          };
          scope.clear = function () {
            $setModelValue(originalScope, null);
          };

          element.after($compile(popupEl)(scope));
        }
      };
    }])

  .directive('datepickerPopupWrap', [function () {
    return {
      restrict:'E',
      replace: true,
      transclude: true,
      templateUrl: 'template/datepicker/popup.html',
      link:function (scope, element, attrs) {
        element.bind('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
        });
      }
    };
  }]);

angular.module('ui.bootstrap.pagination', [])

  .controller('PaginationController', ['$scope', '$attrs', '$parse', '$interpolate', function ($scope, $attrs, $parse, $interpolate) {
    var self = this;

    this.init = function (defaultItemsPerPage) {
      if ($attrs.itemsPerPage) {
        $scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
          self.itemsPerPage = parseInt(value, 10);
          $scope.totalPages = self.calculateTotalPages();
        });
      } else {
        this.itemsPerPage = defaultItemsPerPage;
      }
    };

    this.noPrevious = function () {
      return this.page === 1;
    };
    this.noNext = function () {
      return this.page === $scope.totalPages;
    };

    this.isActive = function (page) {
      return this.page === page;
    };

    this.calculateTotalPages = function () {
      return this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    };

    this.getAttributeValue = function (attribute, defaultValue, interpolate) {
      return angular.isDefined(attribute) ? (interpolate ? $interpolate(attribute)($scope.$parent) : $scope.$parent.$eval(attribute)) : defaultValue;
    };

    this.render = function () {
      this.page = parseInt($scope.page, 10) || 1;
      $scope.pages = this.getPages(this.page, $scope.totalPages);
    };

    $scope.selectPage = function (page) {
      if ( ! self.isActive(page) && page > 0 && page <= $scope.totalPages) {
        $scope.page = page;
        $scope.onSelectPage({ page: page });
      }
    };

    $scope.$watch('totalItems', function () {
      $scope.totalPages = self.calculateTotalPages();
    });

    $scope.$watch('totalPages', function (value) {
      if ( $attrs.numPages ) {
        $scope.numPages = value; // Readonly variable
      }

      if ( self.page > value ) {
        $scope.selectPage(value);
      } else {
        self.render();
      }
    });

    $scope.$watch('page', function () {
      self.render();
    });
  }])

  .constant('paginationConfig', {
    itemsPerPage: 10,
    boundaryLinks: false,
    directionLinks: true,
    firstText: 'First',
    previousText: 'Previous',
    nextText: 'Next',
    lastText: 'Last',
    rotate: true
  })

  .directive('pagination', ['$parse', 'paginationConfig', function ($parse, config) {
    return {
      restrict: 'EA',
      scope: {
        page: '=',
        totalItems: '=',
        onSelectPage:' &',
        numPages: '='
      },
      controller: 'PaginationController',
      templateUrl: 'template/pagination/pagination.html',
      replace: true,
      link: function (scope, element, attrs, paginationCtrl) {

      // Setup configuration parameters
        var maxSize,
          boundaryLinks  = paginationCtrl.getAttributeValue(attrs.boundaryLinks,  config.boundaryLinks      ),
          directionLinks = paginationCtrl.getAttributeValue(attrs.directionLinks, config.directionLinks     ),
          firstText      = paginationCtrl.getAttributeValue(attrs.firstText,      config.firstText,     true),
          previousText   = paginationCtrl.getAttributeValue(attrs.previousText,   config.previousText,  true),
          nextText       = paginationCtrl.getAttributeValue(attrs.nextText,       config.nextText,      true),
          lastText       = paginationCtrl.getAttributeValue(attrs.lastText,       config.lastText,      true),
          rotate         = paginationCtrl.getAttributeValue(attrs.rotate,         config.rotate);

        paginationCtrl.init(config.itemsPerPage);

        if (attrs.maxSize) {
          scope.$parent.$watch($parse(attrs.maxSize), function (value) {
            maxSize = parseInt(value, 10);
            paginationCtrl.render();
          });
        }

        // Create page object used in template
        function makePage(number, text, isActive, isDisabled) {
          return {
            number: number,
            text: text,
            active: isActive,
            disabled: isDisabled
          };
        }

        paginationCtrl.getPages = function (currentPage, totalPages) {
          var pages = [];

          // Default page limits
          var startPage = 1, endPage = totalPages;
          var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

          // recompute if maxSize
          if ( isMaxSized ) {
            if ( rotate ) {
            // Current page is displayed in the middle of the visible ones
              startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
              endPage   = startPage + maxSize - 1;

              // Adjust if limit is exceeded
              if (endPage > totalPages) {
                endPage   = totalPages;
                startPage = endPage - maxSize + 1;
              }
            } else {
            // Visible pages are paginated with maxSize
              startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

              // Adjust last page if limit is exceeded
              endPage = Math.min(startPage + maxSize - 1, totalPages);
            }
          }

          // Add page number links
          for (var number = startPage; number <= endPage; number++) {
            var page = makePage(number, number, paginationCtrl.isActive(number), false);
            pages.push(page);
          }

          // Add links to move between page sets
          if ( isMaxSized && ! rotate ) {
            if ( startPage > 1 ) {
              var previousPageSet = makePage(startPage - 1, '...', false, false);
              pages.unshift(previousPageSet);
            }

            if ( endPage < totalPages ) {
              var nextPageSet = makePage(endPage + 1, '...', false, false);
              pages.push(nextPageSet);
            }
          }

          // Add previous & next links
          if (directionLinks) {
            var previousPage = makePage(currentPage - 1, previousText, false, paginationCtrl.noPrevious());
            pages.unshift(previousPage);

            var nextPage = makePage(currentPage + 1, nextText, false, paginationCtrl.noNext());
            pages.push(nextPage);
          }

          // Add first & last links
          if (boundaryLinks) {
            var firstPage = makePage(1, firstText, false, paginationCtrl.noPrevious());
            pages.unshift(firstPage);

            var lastPage = makePage(totalPages, lastText, false, paginationCtrl.noNext());
            pages.push(lastPage);
          }

          return pages;
        };
      }
    };
  }])

  .constant('pagerConfig', {
    itemsPerPage: 10,
    previousText: '« Previous',
    nextText: 'Next »',
    align: true
  })

  .directive('pager', ['pagerConfig', function (config) {
    return {
      restrict: 'EA',
      scope: {
        page: '=',
        totalItems: '=',
        onSelectPage:' &',
        numPages: '='
      },
      controller: 'PaginationController',
      templateUrl: 'template/pagination/pager.html',
      replace: true,
      link: function (scope, element, attrs, paginationCtrl) {

      // Setup configuration parameters
        var previousText = paginationCtrl.getAttributeValue(attrs.previousText, config.previousText, true),
          nextText         = paginationCtrl.getAttributeValue(attrs.nextText,     config.nextText,     true),
          align            = paginationCtrl.getAttributeValue(attrs.align,        config.align);

        paginationCtrl.init(config.itemsPerPage);

        // Create page object used in template
        function makePage(number, text, isDisabled, isPrevious, isNext) {
          return {
            number: number,
            text: text,
            disabled: isDisabled,
            previous: ( align && isPrevious ),
            next: ( align && isNext )
          };
        }

        paginationCtrl.getPages = function (currentPage) {
          return [
            makePage(currentPage - 1, previousText, paginationCtrl.noPrevious(), true, false),
            makePage(currentPage + 1, nextText, paginationCtrl.noNext(), false, true)
          ];
        };
      }
    };
  }]);

angular.module('ui.bootstrap.rating', [])

  .constant('ratingConfig', {
    max: 5,
    stateOn: null,
    stateOff: null
  })

  .controller('RatingController', ['$scope', '$attrs', '$parse', 'ratingConfig', function ($scope, $attrs, $parse, ratingConfig) {

    this.maxRange = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max;
    this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
    this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;

    this.createDefaultRange = function (len) {
      var defaultStateObject = {
        stateOn: this.stateOn,
        stateOff: this.stateOff
      };

      var states = new Array(len);
      for (var i = 0; i < len; i++) {
        states[i] = defaultStateObject;
      }
      return states;
    };

    this.normalizeRange = function (states) {
      for (var i = 0, n = states.length; i < n; i++) {
        states[i].stateOn = states[i].stateOn || this.stateOn;
        states[i].stateOff = states[i].stateOff || this.stateOff;
      }
      return states;
    };

    // Get objects used in template
    $scope.range = angular.isDefined($attrs.ratingStates) ?  this.normalizeRange(angular.copy($scope.$parent.$eval($attrs.ratingStates))): this.createDefaultRange(this.maxRange);

    $scope.rate = function (value) {
      if ( $scope.readonly || $scope.value === value) {
        return;
      }

      $scope.value = value;
    };

    $scope.enter = function (value) {
      if ( ! $scope.readonly ) {
        $scope.val = value;
      }
      $scope.onHover({value: value});
    };

    $scope.reset = function () {
      $scope.val = angular.copy($scope.value);
      $scope.onLeave();
    };

    $scope.$watch('value', function (value) {
      $scope.val = value;
    });

    $scope.readonly = false;
    if ($attrs.readonly) {
      $scope.$parent.$watch($parse($attrs.readonly), function (value) {
        $scope.readonly = !!value;
      });
    }
  }])

  .directive('rating', function () {
    return {
      restrict: 'EA',
      scope: {
        value: '=',
        onHover: '&',
        onLeave: '&'
      },
      controller: 'RatingController',
      templateUrl: 'template/rating/rating.html',
      replace: true
    };
  });
angular.module('ui.bootstrap.timepicker', [])

  .constant('timepickerConfig', {
    hourStep: 1,
    minuteStep: 1,
    showMeridian: true,
    meridians: ['AM', 'PM'],
    readonlyInput: false,
    mousewheel: true
  })

  .directive('timepicker', ['$parse', '$log', 'timepickerConfig', function ($parse, $log, timepickerConfig) {
    return {
      restrict: 'EA',
      require:'?^ngModel',
      replace: true,
      scope: {},
      templateUrl: 'template/timepicker/timepicker.html',
      link: function (scope, element, attrs, ngModel) {
        if ( !ngModel ) {
          return; // do nothing if no ng-model
        }

        var selected = new Date(), meridians = timepickerConfig.meridians;

        var hourStep = timepickerConfig.hourStep;
        if (attrs.hourStep) {
          scope.$parent.$watch($parse(attrs.hourStep), function (value) {
            hourStep = parseInt(value, 10);
          });
        }

        var minuteStep = timepickerConfig.minuteStep;
        if (attrs.minuteStep) {
          scope.$parent.$watch($parse(attrs.minuteStep), function (value) {
            minuteStep = parseInt(value, 10);
          });
        }

        // 12H / 24H mode
        scope.showMeridian = timepickerConfig.showMeridian;
        if (attrs.showMeridian) {
          scope.$parent.$watch($parse(attrs.showMeridian), function (value) {
            scope.showMeridian = !!value;

            if ( ngModel.$error.time ) {
            // Evaluate from template
              var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
              if (angular.isDefined( hours ) && angular.isDefined( minutes )) {
                selected.setHours( hours );
                refresh();
              }
            } else {
              updateTemplate();
            }
          });
        }

        // Get scope.hours in 24H mode if valid
        function getHoursFromTemplate( ) {
          var hours = parseInt( scope.hours, 10 );
          var valid = ( scope.showMeridian ) ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
          if ( !valid ) {
            return undefined;
          }

          if ( scope.showMeridian ) {
            if ( hours === 12 ) {
              hours = 0;
            }
            if ( scope.meridian === meridians[1] ) {
              hours = hours + 12;
            }
          }
          return hours;
        }

        function getMinutesFromTemplate() {
          var minutes = parseInt(scope.minutes, 10);
          return ( minutes >= 0 && minutes < 60 ) ? minutes : undefined;
        }

        function pad( value ) {
          return ( angular.isDefined(value) && value.toString().length < 2 ) ? `0${  value}` : value;
        }

        // Input elements
        var inputs = element.find('input'), hoursInputEl = inputs.eq(0), minutesInputEl = inputs.eq(1);

        // Respond on mousewheel spin
        var mousewheel = (angular.isDefined(attrs.mousewheel)) ? scope.$eval(attrs.mousewheel) : timepickerConfig.mousewheel;
        if ( mousewheel ) {

          var isScrollingUp = function (e) {
            if (e.originalEvent) {
              e = e.originalEvent;
            }
            //pick correct delta variable depending on event
            var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
            return (e.detail || delta > 0);
          };

          hoursInputEl.bind('mousewheel wheel', function (e) {
            scope.$apply( (isScrollingUp(e)) ? scope.incrementHours() : scope.decrementHours() );
            e.preventDefault();
          });

          minutesInputEl.bind('mousewheel wheel', function (e) {
            scope.$apply( (isScrollingUp(e)) ? scope.incrementMinutes() : scope.decrementMinutes() );
            e.preventDefault();
          });
        }

        scope.readonlyInput = (angular.isDefined(attrs.readonlyInput)) ? scope.$eval(attrs.readonlyInput) : timepickerConfig.readonlyInput;
        if ( ! scope.readonlyInput ) {

          var invalidate = function (invalidHours, invalidMinutes) {
            ngModel.$setViewValue( null );
            ngModel.$setValidity('time', false);
            if (angular.isDefined(invalidHours)) {
              scope.invalidHours = invalidHours;
            }
            if (angular.isDefined(invalidMinutes)) {
              scope.invalidMinutes = invalidMinutes;
            }
          };

          scope.updateHours = function () {
            var hours = getHoursFromTemplate();

            if ( angular.isDefined(hours) ) {
              selected.setHours( hours );
              refresh( 'h' );
            } else {
              invalidate(true);
            }
          };

          hoursInputEl.bind('blur', function (e) {
            if ( !scope.validHours && scope.hours < 10) {
              scope.$apply( function () {
                scope.hours = pad( scope.hours );
              });
            }
          });

          scope.updateMinutes = function () {
            var minutes = getMinutesFromTemplate();

            if ( angular.isDefined(minutes) ) {
              selected.setMinutes( minutes );
              refresh( 'm' );
            } else {
              invalidate(undefined, true);
            }
          };

          minutesInputEl.bind('blur', function (e) {
            if ( !scope.invalidMinutes && scope.minutes < 10 ) {
              scope.$apply( function () {
                scope.minutes = pad( scope.minutes );
              });
            }
          });
        } else {
          scope.updateHours = angular.noop;
          scope.updateMinutes = angular.noop;
        }

        ngModel.$render = function () {
          var date = ngModel.$modelValue ? new Date( ngModel.$modelValue ) : null;

          if ( isNaN(date) ) {
            ngModel.$setValidity('time', false);
            $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
          } else {
            if ( date ) {
              selected = date;
            }
            makeValid();
            updateTemplate();
          }
        };

        // Call internally when we know that model is valid.
        function refresh( keyboardChange ) {
          makeValid();
          ngModel.$setViewValue( new Date(selected) );
          updateTemplate( keyboardChange );
        }

        function makeValid() {
          ngModel.$setValidity('time', true);
          scope.invalidHours = false;
          scope.invalidMinutes = false;
        }

        function updateTemplate( keyboardChange ) {
          var hours = selected.getHours(), minutes = selected.getMinutes();

          if ( scope.showMeridian ) {
            hours = ( hours === 0 || hours === 12 ) ? 12 : hours % 12; // Convert 24 to 12 hour system
          }
          scope.hours =  keyboardChange === 'h' ? hours : pad(hours);
          scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
          scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
        }

        function addMinutes( minutes ) {
          var dt = new Date( selected.getTime() + minutes * 60000 );
          selected.setHours( dt.getHours(), dt.getMinutes() );
          refresh();
        }

        scope.incrementHours = function () {
          addMinutes( hourStep * 60 );
        };
        scope.decrementHours = function () {
          addMinutes( - hourStep * 60 );
        };
        scope.incrementMinutes = function () {
          addMinutes( minuteStep );
        };
        scope.decrementMinutes = function () {
          addMinutes( - minuteStep );
        };
        scope.toggleMeridian = function () {
          addMinutes( 12 * 60 * (( selected.getHours() < 12 ) ? 1 : -1) );
        };
      }
    };
  }]);

angular.module('ui.bootstrap.bindHtml', [])

  .directive('bindHtmlUnsafe', function () {
    return function (scope, element, attr) {
      element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
      scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
        element.html(value || '');
      });
    };
  });
angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position', 'ui.bootstrap.bindHtml'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('typeaheadParser', ['$parse', function ($parse) {

  //                      00000111000000000000022200000000000000003333333333333330000000000044000
    var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

    return {
      parse:function (input) {

        var match = input.match(TYPEAHEAD_REGEXP), modelMapper, viewMapper, source;
        if (!match) {
          throw new Error(
            `${'Expected typeahead specification in form of \'_modelValue_ (as _label_)? for _item_ in _collection_\'' +
            ' but got \''}${  input  }'.`);
        }

        return {
          itemName:match[3],
          source:$parse(match[4]),
          viewMapper:$parse(match[2] || match[1]),
          modelMapper:$parse(match[1])
        };
      }
    };
  }])

  .directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$position', 'typeaheadParser',
    function ($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {

      var HOT_KEYS = [9, 13, 27, 38, 40];

      return {
        require:'ngModel',
        link:function (originalScope, element, attrs, modelCtrl) {

          //SUPPORTED ATTRIBUTES (OPTIONS)

          //minimal no of characters that needs to be entered before typeahead kicks-in
          var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

          //minimal wait time after last character typed before typehead kicks-in
          var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

          //should it restrict model values to the ones selected from the popup only?
          var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

          //binding to a variable that indicates if matches are being retrieved asynchronously
          var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

          //a callback executed when a match is selected
          var onSelectCallback = $parse(attrs.typeaheadOnSelect);

          var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

          //INTERNAL VARIABLES

          //model setter executed upon match selection
          var $setModelValue = $parse(attrs.ngModel).assign;

          //expressions used by typeahead
          var parserResult = typeaheadParser.parse(attrs.typeahead);


          //pop-up element used to display matches
          var popUpEl = angular.element('<typeahead-popup></typeahead-popup>');
          popUpEl.attr({
            matches: 'matches',
            active: 'activeIdx',
            select: 'select(activeIdx)',
            query: 'query',
            position: 'position'
          });
          //custom item template
          if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
            popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
          }

          //create a child scope for the typeahead directive so we are not polluting original scope
          //with typeahead-specific data (matches, query etc.)
          var scope = originalScope.$new();
          originalScope.$on('$destroy', function (){
            scope.$destroy();
          });

          var resetMatches = function () {
            scope.matches = [];
            scope.activeIdx = -1;
          };

          var getMatchesAsync = function (inputValue) {

            var locals = {$viewValue: inputValue};
            isLoadingSetter(originalScope, true);
            $q.when(parserResult.source(scope, locals)).then(function (matches) {

              //it might happen that several async queries were in progress if a user were typing fast
              //but we are interested only in responses that correspond to the current view value
              if (inputValue === modelCtrl.$viewValue) {
                if (matches.length > 0) {

                  scope.activeIdx = 0;
                  scope.matches.length = 0;

                  //transform labels
                  for(var i=0; i<matches.length; i++) {
                    locals[parserResult.itemName] = matches[i];
                    scope.matches.push({
                      label: parserResult.viewMapper(scope, locals),
                      model: matches[i]
                    });
                  }

                  scope.query = inputValue;
                  //position pop-up with matches - we need to re-calculate its position each time we are opening a window
                  //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
                  //due to other elements being rendered
                  scope.position = $position.position(element);
                  scope.position.top = scope.position.top + element.prop('offsetHeight');

                } else {
                  resetMatches();
                }
                isLoadingSetter(originalScope, false);
              }
            }, function (){
              resetMatches();
              isLoadingSetter(originalScope, false);
            });
          };

          resetMatches();

          //we need to propagate user's query so we can higlight matches
          scope.query = undefined;

          //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later 
          var timeoutPromise;

          //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
          //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
          modelCtrl.$parsers.unshift(function (inputValue) {

            resetMatches();
            if (inputValue && inputValue.length >= minSearch) {
              if (waitTime > 0) {
                if (timeoutPromise) {
                  $timeout.cancel(timeoutPromise);//cancel previous timeout
                }
                timeoutPromise = $timeout(function () {
                  getMatchesAsync(inputValue);
                }, waitTime);
              } else {
                getMatchesAsync(inputValue);
              }
            }

            if (isEditable) {
              return inputValue;
            } else {
              modelCtrl.$setValidity('editable', false);
              return undefined;
            }
          });

          modelCtrl.$formatters.push(function (modelValue) {

            var candidateViewValue, emptyViewValue;
            var locals = {};

            if (inputFormatter) {

              locals['$model'] = modelValue;
              return inputFormatter(originalScope, locals);

            } else {

              //it might happen that we don't have enough info to properly render input value
              //we need to check for this situation and simply return model value if we can't apply custom formatting
              locals[parserResult.itemName] = modelValue;
              candidateViewValue = parserResult.viewMapper(originalScope, locals);
              locals[parserResult.itemName] = undefined;
              emptyViewValue = parserResult.viewMapper(originalScope, locals);

              return candidateViewValue!== emptyViewValue ? candidateViewValue : modelValue;
            }
          });

          scope.select = function (activeIdx) {
            //called from within the $digest() cycle
            var locals = {};
            var model, item;

            locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
            model = parserResult.modelMapper(originalScope, locals);
            $setModelValue(originalScope, model);
            modelCtrl.$setValidity('editable', true);

            onSelectCallback(originalScope, {
              $item: item,
              $model: model,
              $label: parserResult.viewMapper(originalScope, locals)
            });

            resetMatches();

            //return focus to the input element if a mach was selected via a mouse click event
            element[0].focus();
          };

          //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
          element.bind('keydown', function (evt) {

            //typeahead is open and an "interesting" key was pressed
            if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
              return;
            }

            evt.preventDefault();

            if (evt.which === 40) {
              scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
              scope.$digest();

            } else if (evt.which === 38) {
              scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1;
              scope.$digest();

            } else if (evt.which === 13 || evt.which === 9) {
              scope.$apply(function () {
                scope.select(scope.activeIdx);
              });

            } else if (evt.which === 27) {
              evt.stopPropagation();

              resetMatches();
              scope.$digest();
            }
          });

          // Keep reference to click handler to unbind it.
          var dismissClickHandler = function (evt) {
            if (element[0] !== evt.target) {
              resetMatches();
              scope.$digest();
            }
          };

          $document.bind('click', dismissClickHandler);

          originalScope.$on('$destroy', function (){
            $document.unbind('click', dismissClickHandler);
          });

          element.after($compile(popUpEl)(scope));
        }
      };

    }])

  .directive('typeaheadPopup', function () {
    return {
      restrict:'E',
      scope:{
        matches:'=',
        query:'=',
        active:'=',
        position:'=',
        select:'&'
      },
      replace:true,
      // Hardcode this path until this is fixed: https://github.com/decipherinc/angular-tags/issues/16#issuecomment-26614629
      templateUrl:'/ui-bootstrap/template/typeahead/typeahead-popup.html',
      link:function (scope, element, attrs) {

        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function () {
          return scope.matches.length > 0;
        };

        scope.isActive = function (matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function (matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function (activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  })

  .directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
    return {
      restrict:'E',
      scope:{
        index:'=',
        match:'=',
        query:'='
      },
      link:function (scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
        $http.get(tplUrl, {cache: $templateCache}).success(function (tplContent){
          element.replaceWith($compile(tplContent.trim())(scope));
        });
      }
    };
  }])

  .filter('typeaheadHighlight', function () {

    function escapeRegexp(queryToEscape) {
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function (matchItem, query) {
      return query ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
    };
  });
}).call(global, module, undefined, undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"angular":50}],111:[function(require,module,exports){
(function (global){

; angular = global.angular = require("angular");
CodeMirror = global.CodeMirror = require("/Users/ilya/maintained/strider/vendor/CodeMirror/js/codemirror.js");
require("/Users/ilya/maintained/strider/vendor/CodeMirror/js/shell.js");
; var __browserify_shim_require__=require;(function browserifyShim(module, define, require) {
/*global angular, CodeMirror, Error*/
/**
 * Binds a CodeMirror widget to a <textarea> element.
 */
angular.module('ui.codemirror', [])
  .constant('uiCodemirrorConfig', {})
  .directive('uiCodemirror', ['uiCodemirrorConfig', '$timeout', function (uiCodemirrorConfig, $timeout) {
    'use strict';

    var events = ['cursorActivity', 'viewportChange', 'gutterClick', 'focus', 'blur', 'scroll', 'update'];
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var options, opts, onChange, deferCodeMirror, codeMirror;

        if (elm[0].type !== 'textarea') {
          throw new Error('uiCodemirror3 can only be applied to a textarea element');
        }

        options = uiCodemirrorConfig.codemirror || {};
        opts = angular.extend({}, options, scope.$eval(attrs.uiCodemirror));

        onChange = function (aEvent) {
          return function (instance, changeObj) {
            var newValue = instance.getValue();
            if (newValue !== ngModel.$viewValue) {
              ngModel.$setViewValue(newValue);
            }
            if (typeof aEvent === 'function') {
              aEvent(instance, changeObj);
            }
            if (!scope.$$phase) {
              scope.$apply();
            }
          };
        };

        deferCodeMirror = function () {
          codeMirror = CodeMirror.fromTextArea(elm[0], opts);

          // Refresh codemirror externally this way...
          //$('[ui-codemirror]').trigger('refresh')
          elm.on('refresh', function () {
            codeMirror.refresh();
          });

          if (angular.isDefined(scope[attrs.uiCodemirror])) {
            scope.$watch(attrs.uiCodemirror, function (newValues) {
              for (var key in newValues) {
                if (newValues.hasOwnProperty(key)) {
                  codeMirror.setOption(key, newValues[key]);
                }
              }
            }, true);
          }

          codeMirror.on('change', onChange(opts.onChange));

          for (var i = 0, n = events.length, aEvent; i < n; ++i) {
            aEvent = opts[`on${  events[i].charAt(0).toUpperCase()  }${events[i].slice(1)}`];
            if (aEvent === void 0) {
              continue;
            }
            if (typeof aEvent !== 'function') {
              continue;
            }
            codeMirror.on(events[i], aEvent);
          }

          // CodeMirror expects a string, so make sure it gets one.
          // This does not change the model.
          ngModel.$formatters.push(function (value) {
            if (angular.isUndefined(value) || value === null) {
              return '';
            } else if (angular.isObject(value) || angular.isArray(value)) {
              throw new Error('ui-codemirror cannot use an object or an array as a model');
            }
            return value;
          });

          // Override the ngModelController $render method, which is what gets called when the model is updated.
          // This takes care of the synchronizing the codeMirror element with the underlying model, in the case that it is changed by something else.
          ngModel.$render = function () {
            codeMirror.setValue(ngModel.$viewValue);
          };

          if (!ngModel.$viewValue){
            ngModel.$setViewValue(elm.text());
            ngModel.$render();
          }

          // Watch ui-refresh and refresh the directive
          if (attrs.uiRefresh) {
            scope.$watch(attrs.uiRefresh, function (newVal, oldVal) {
              // Skip the initial watch firing
              if (newVal !== oldVal) {
                $timeout(function () {
                  codeMirror.refresh();
                });
              }
            });
          }

          // onLoad callback
          if (angular.isFunction(opts.onLoad)) {
            opts.onLoad(codeMirror);
          }
        };

        $timeout(deferCodeMirror);

      }
    };
  }]);

}).call(global, module, undefined, undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"/Users/ilya/maintained/strider/vendor/CodeMirror/js/codemirror.js":112,"/Users/ilya/maintained/strider/vendor/CodeMirror/js/shell.js":113,"angular":50}],112:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
// CodeMirror is the only global var we claim
window.CodeMirror = (function () {
  'use strict';

  // BROWSER SNIFFING

  // Crude, but necessary to handle a number of hard-to-feature-detect
  // bugs and behavior differences.
  var gecko = /gecko\/\d/i.test(navigator.userAgent);
  var ie = /MSIE \d/.test(navigator.userAgent);
  var ie_lt8 = ie && (document.documentMode == null || document.documentMode < 8);
  var ie_lt9 = ie && (document.documentMode == null || document.documentMode < 9);
  var webkit = /WebKit\//.test(navigator.userAgent);
  var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(navigator.userAgent);
  var chrome = /Chrome\//.test(navigator.userAgent);
  var opera = /Opera\//.test(navigator.userAgent);
  var safari = /Apple Computer/.test(navigator.vendor);
  var khtml = /KHTML\//.test(navigator.userAgent);
  var mac_geLion = /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent);
  var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent);
  var phantom = /PhantomJS/.test(navigator.userAgent);

  var ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
  // This is woefully incomplete. Suggestions for alternative methods welcome.
  var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent);
  var mac = ios || /Mac/.test(navigator.platform);
  var windows = /win/i.test(navigator.platform);

  var opera_version = opera && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
  if (opera_version) opera_version = Number(opera_version[1]);
  if (opera_version && opera_version >= 15) {
    opera = false; webkit = true; 
  }
  // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
  var flipCtrlCmd = mac && (qtwebkit || opera && (opera_version == null || opera_version < 12.11));
  var captureMiddleClick = gecko || (ie && !ie_lt9);

  // Optimize some code when these features are not used
  var sawReadOnlySpans = false, sawCollapsedSpans = false;

  // CONSTRUCTOR

  function CodeMirror(place, options) {
    if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);

    this.options = options = options || {};
    // Determine effective options based on given values and defaults.
    for (var opt in defaults) if (!options.hasOwnProperty(opt) && defaults.hasOwnProperty(opt))
      options[opt] = defaults[opt];
    setGuttersForLineNumbers(options);

    var docStart = typeof options.value == 'string' ? 0 : options.value.first;
    var display = this.display = makeDisplay(place, docStart);
    display.wrapper.CodeMirror = this;
    updateGutters(this);
    if (options.autofocus && !mobile) focusInput(this);

    this.state = {keyMaps: [],
      overlays: [],
      modeGen: 0,
      overwrite: false, focused: false,
      suppressEdits: false, pasteIncoming: false,
      draggingText: false,
      highlight: new Delayed()};

    themeChanged(this);
    if (options.lineWrapping)
      this.display.wrapper.className += ' CodeMirror-wrap';

    var doc = options.value;
    if (typeof doc == 'string') doc = new Doc(options.value, options.mode);
    operation(this, attachDoc)(this, doc);

    // Override magic textarea content restore that IE sometimes does
    // on our hidden textarea on reload
    if (ie) setTimeout(bind(resetInput, this, true), 20);

    registerEventHandlers(this);
    // IE throws unspecified error in certain cases, when
    // trying to access activeElement before onload
    var hasFocus; try {
      hasFocus = (document.activeElement == display.input); 
    } catch(e) { }
    if (hasFocus || (options.autofocus && !mobile)) setTimeout(bind(onFocus, this), 20);
    else onBlur(this);

    operation(this, function () {
      for (var opt in optionHandlers)
        if (optionHandlers.propertyIsEnumerable(opt))
          optionHandlers[opt](this, options[opt], Init);
      for (var i = 0; i < initHooks.length; ++i) initHooks[i](this);
    })();
  }

  // DISPLAY CONSTRUCTOR

  function makeDisplay(place, docStart) {
    var d = {};

    var input = d.input = elt('textarea', null, null, 'position: absolute; padding: 0; width: 1px; height: 1em; outline: none; font-size: 4px;');
    if (webkit) input.style.width = '1000px';
    else input.setAttribute('wrap', 'off');
    // if border: 0; -- iOS fails to open keyboard (issue #1287)
    if (ios) input.style.border = '1px solid black';
    input.setAttribute('autocorrect', 'off'); input.setAttribute('autocapitalize', 'off'); input.setAttribute('spellcheck', 'false');

    // Wraps and hides input textarea
    d.inputDiv = elt('div', [input], null, 'overflow: hidden; position: relative; width: 3px; height: 0px;');
    // The actual fake scrollbars.
    d.scrollbarH = elt('div', [elt('div', null, null, 'height: 1px')], 'CodeMirror-hscrollbar');
    d.scrollbarV = elt('div', [elt('div', null, null, 'width: 1px')], 'CodeMirror-vscrollbar');
    d.scrollbarFiller = elt('div', null, 'CodeMirror-scrollbar-filler');
    d.gutterFiller = elt('div', null, 'CodeMirror-gutter-filler');
    // DIVs containing the selection and the actual code
    d.lineDiv = elt('div', null, 'CodeMirror-code');
    d.selectionDiv = elt('div', null, null, 'position: relative; z-index: 1');
    // Blinky cursor, and element used to ensure cursor fits at the end of a line
    d.cursor = elt('div', '\u00a0', 'CodeMirror-cursor');
    // Secondary cursor, shown when on a 'jump' in bi-directional text
    d.otherCursor = elt('div', '\u00a0', 'CodeMirror-cursor CodeMirror-secondarycursor');
    // Used to measure text size
    d.measure = elt('div', null, 'CodeMirror-measure');
    // Wraps everything that needs to exist inside the vertically-padded coordinate system
    d.lineSpace = elt('div', [d.measure, d.selectionDiv, d.lineDiv, d.cursor, d.otherCursor],
      null, 'position: relative; outline: none');
    // Moved around its parent to cover visible view
    d.mover = elt('div', [elt('div', [d.lineSpace], 'CodeMirror-lines')], null, 'position: relative');
    // Set to the height of the text, causes scrolling
    d.sizer = elt('div', [d.mover], 'CodeMirror-sizer');
    // D is needed because behavior of elts with overflow: auto and padding is inconsistent across browsers
    d.heightForcer = elt('div', null, null, `position: absolute; height: ${  scrollerCutOff  }px; width: 1px;`);
    // Will contain the gutters, if any
    d.gutters = elt('div', null, 'CodeMirror-gutters');
    d.lineGutter = null;
    // Provides scrolling
    d.scroller = elt('div', [d.sizer, d.heightForcer, d.gutters], 'CodeMirror-scroll');
    d.scroller.setAttribute('tabIndex', '-1');
    // The element in which the editor lives.
    d.wrapper = elt('div', [d.inputDiv, d.scrollbarH, d.scrollbarV,
      d.scrollbarFiller, d.gutterFiller, d.scroller], 'CodeMirror');
    // Work around IE7 z-index bug
    if (ie_lt8) {
      d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; 
    }
    if (place.appendChild) place.appendChild(d.wrapper); else place(d.wrapper);

    // Needed to hide big blue blinking cursor on Mobile Safari
    if (ios) input.style.width = '0px';
    if (!webkit) d.scroller.draggable = true;
    // Needed to handle Tab key in KHTML
    if (khtml) {
      d.inputDiv.style.height = '1px'; d.inputDiv.style.position = 'absolute'; 
    }
    // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
    else if (ie_lt8) d.scrollbarH.style.minWidth = d.scrollbarV.style.minWidth = '18px';

    // Current visible range (may be bigger than the view window).
    d.viewOffset = d.lastSizeC = 0;
    d.showingFrom = d.showingTo = docStart;

    // Used to only resize the line number gutter when necessary (when
    // the amount of lines crosses a boundary that makes its width change)
    d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
    // See readInput and resetInput
    d.prevInput = '';
    // Set to true when a non-horizontal-scrolling widget is added. As
    // an optimization, widget aligning is skipped when d is false.
    d.alignWidgets = false;
    // Flag that indicates whether we currently expect input to appear
    // (after some event like 'keypress' or 'input') and are polling
    // intensively.
    d.pollingFast = false;
    // Self-resetting timeout for the poller
    d.poll = new Delayed();

    d.cachedCharWidth = d.cachedTextHeight = null;
    d.measureLineCache = [];
    d.measureLineCachePos = 0;

    // Tracks when resetInput has punted to just putting a short
    // string instead of the (large) selection.
    d.inaccurateSelection = false;

    // Tracks the maximum line length so that the horizontal scrollbar
    // can be kept static when scrolling.
    d.maxLine = null;
    d.maxLineLength = 0;
    d.maxLineChanged = false;

    // Used for measuring wheel scrolling granularity
    d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;

    return d;
  }

  // STATE UPDATES

  // Used to get the editor into a consistent state again when options change.

  function loadMode(cm) {
    cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption);
    cm.doc.iter(function (line) {
      if (line.stateAfter) line.stateAfter = null;
      if (line.styles) line.styles = null;
    });
    cm.doc.frontier = cm.doc.first;
    startWorker(cm, 100);
    cm.state.modeGen++;
    if (cm.curOp) regChange(cm);
  }

  function wrappingChanged(cm) {
    if (cm.options.lineWrapping) {
      cm.display.wrapper.className += ' CodeMirror-wrap';
      cm.display.sizer.style.minWidth = '';
    } else {
      cm.display.wrapper.className = cm.display.wrapper.className.replace(' CodeMirror-wrap', '');
      computeMaxLength(cm);
    }
    estimateLineHeights(cm);
    regChange(cm);
    clearCaches(cm);
    setTimeout(function (){
      updateScrollbars(cm);
    }, 100);
  }

  function estimateHeight(cm) {
    var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
    var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
    return function (line) {
      if (lineIsHidden(cm.doc, line))
        return 0;
      else if (wrapping)
        return (Math.ceil(line.text.length / perLine) || 1) * th;
      else
        return th;
    };
  }

  function estimateLineHeights(cm) {
    var doc = cm.doc, est = estimateHeight(cm);
    doc.iter(function (line) {
      var estHeight = est(line);
      if (estHeight != line.height) updateLineHeight(line, estHeight);
    });
  }

  function keyMapChanged(cm) {
    var map = keyMap[cm.options.keyMap], style = map.style;
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-keymap-\S+/g, '') +
      (style ? ` cm-keymap-${  style}` : '');
    cm.state.disableInput = map.disableInput;
  }

  function themeChanged(cm) {
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, '') +
      cm.options.theme.replace(/(^|\s)\s*/g, ' cm-s-');
    clearCaches(cm);
  }

  function guttersChanged(cm) {
    updateGutters(cm);
    regChange(cm);
    setTimeout(function (){
      alignHorizontally(cm);
    }, 20);
  }

  function updateGutters(cm) {
    var gutters = cm.display.gutters, specs = cm.options.gutters;
    removeChildren(gutters);
    for (var i = 0; i < specs.length; ++i) {
      var gutterClass = specs[i];
      var gElt = gutters.appendChild(elt('div', null, `CodeMirror-gutter ${  gutterClass}`));
      if (gutterClass == 'CodeMirror-linenumbers') {
        cm.display.lineGutter = gElt;
        gElt.style.width = `${cm.display.lineNumWidth || 1  }px`;
      }
    }
    gutters.style.display = i ? '' : 'none';
  }

  function lineLength(doc, line) {
    if (line.height == 0) return 0;
    var len = line.text.length, merged, cur = line;
    while (merged = collapsedSpanAtStart(cur)) {
      var found = merged.find();
      cur = getLine(doc, found.from.line);
      len += found.from.ch - found.to.ch;
    }
    cur = line;
    while (merged = collapsedSpanAtEnd(cur)) {
      var found = merged.find();
      len -= cur.text.length - found.from.ch;
      cur = getLine(doc, found.to.line);
      len += cur.text.length - found.to.ch;
    }
    return len;
  }

  function computeMaxLength(cm) {
    var d = cm.display, doc = cm.doc;
    d.maxLine = getLine(doc, doc.first);
    d.maxLineLength = lineLength(doc, d.maxLine);
    d.maxLineChanged = true;
    doc.iter(function (line) {
      var len = lineLength(doc, line);
      if (len > d.maxLineLength) {
        d.maxLineLength = len;
        d.maxLine = line;
      }
    });
  }

  // Make sure the gutters options contains the element
  // "CodeMirror-linenumbers" when the lineNumbers option is true.
  function setGuttersForLineNumbers(options) {
    var found = indexOf(options.gutters, 'CodeMirror-linenumbers');
    if (found == -1 && options.lineNumbers) {
      options.gutters = options.gutters.concat(['CodeMirror-linenumbers']);
    } else if (found > -1 && !options.lineNumbers) {
      options.gutters = options.gutters.slice(0);
      options.gutters.splice(found, 1);
    }
  }

  // SCROLLBARS

  // Re-synchronize the fake scrollbars with the actual size of the
  // content. Optionally force a scrollTop.
  function updateScrollbars(cm) {
    var d = cm.display, docHeight = cm.doc.height;
    var totalHeight = docHeight + paddingVert(d);
    d.sizer.style.minHeight = d.heightForcer.style.top = `${totalHeight  }px`;
    d.gutters.style.height = `${Math.max(totalHeight, d.scroller.clientHeight - scrollerCutOff)  }px`;
    var scrollHeight = Math.max(totalHeight, d.scroller.scrollHeight);
    var needsH = d.scroller.scrollWidth > (d.scroller.clientWidth + 1);
    var needsV = scrollHeight > (d.scroller.clientHeight + 1);
    if (needsV) {
      d.scrollbarV.style.display = 'block';
      d.scrollbarV.style.bottom = needsH ? `${scrollbarWidth(d.measure)  }px` : '0';
      d.scrollbarV.firstChild.style.height =
        `${scrollHeight - d.scroller.clientHeight + d.scrollbarV.clientHeight  }px`;
    } else {
      d.scrollbarV.style.display = '';
      d.scrollbarV.firstChild.style.height = '0';
    }
    if (needsH) {
      d.scrollbarH.style.display = 'block';
      d.scrollbarH.style.right = needsV ? `${scrollbarWidth(d.measure)  }px` : '0';
      d.scrollbarH.firstChild.style.width =
        `${d.scroller.scrollWidth - d.scroller.clientWidth + d.scrollbarH.clientWidth  }px`;
    } else {
      d.scrollbarH.style.display = '';
      d.scrollbarH.firstChild.style.width = '0';
    }
    if (needsH && needsV) {
      d.scrollbarFiller.style.display = 'block';
      d.scrollbarFiller.style.height = d.scrollbarFiller.style.width = `${scrollbarWidth(d.measure)  }px`;
    } else d.scrollbarFiller.style.display = '';
    if (needsH && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
      d.gutterFiller.style.display = 'block';
      d.gutterFiller.style.height = `${scrollbarWidth(d.measure)  }px`;
      d.gutterFiller.style.width = `${d.gutters.offsetWidth  }px`;
    } else d.gutterFiller.style.display = '';

    if (mac_geLion && scrollbarWidth(d.measure) === 0)
      d.scrollbarV.style.minWidth = d.scrollbarH.style.minHeight = mac_geMountainLion ? '18px' : '12px';
  }

  function visibleLines(display, doc, viewPort) {
    var top = display.scroller.scrollTop, height = display.wrapper.clientHeight;
    if (typeof viewPort == 'number') top = viewPort;
    else if (viewPort) {
      top = viewPort.top; height = viewPort.bottom - viewPort.top;
    }
    top = Math.floor(top - paddingTop(display));
    var bottom = Math.ceil(top + height);
    return {from: lineAtHeight(doc, top), to: lineAtHeight(doc, bottom)};
  }

  // LINE NUMBERS

  function alignHorizontally(cm) {
    var display = cm.display;
    if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
    var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
    var gutterW = display.gutters.offsetWidth, l = `${comp  }px`;
    for (var n = display.lineDiv.firstChild; n; n = n.nextSibling) if (n.alignable) {
      for (var i = 0, a = n.alignable; i < a.length; ++i) a[i].style.left = l;
    }
    if (cm.options.fixedGutter)
      display.gutters.style.left = `${comp + gutterW  }px`;
  }

  function maybeUpdateLineNumberWidth(cm) {
    if (!cm.options.lineNumbers) return false;
    var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
    if (last.length != display.lineNumChars) {
      var test = display.measure.appendChild(elt('div', [elt('div', last)],
        'CodeMirror-linenumber CodeMirror-gutter-elt'));
      var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
      display.lineGutter.style.width = '';
      display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding);
      display.lineNumWidth = display.lineNumInnerWidth + padding;
      display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
      display.lineGutter.style.width = `${display.lineNumWidth  }px`;
      return true;
    }
    return false;
  }

  function lineNumberFor(options, i) {
    return String(options.lineNumberFormatter(i + options.firstLineNumber));
  }
  function compensateForHScroll(display) {
    return getRect(display.scroller).left - getRect(display.sizer).left;
  }

  // DISPLAY DRAWING

  function updateDisplay(cm, changes, viewPort, forced) {
    var oldFrom = cm.display.showingFrom, oldTo = cm.display.showingTo, updated;
    var visible = visibleLines(cm.display, cm.doc, viewPort);
    for (var first = true;; first = false) {
      var oldWidth = cm.display.scroller.clientWidth;
      if (!updateDisplayInner(cm, changes, visible, forced)) break;
      updated = true;
      changes = [];
      updateSelection(cm);
      updateScrollbars(cm);
      if (first && cm.options.lineWrapping && oldWidth != cm.display.scroller.clientWidth) {
        forced = true;
        continue;
      }
      forced = false;

      // Clip forced viewport to actual scrollable area
      if (viewPort)
        viewPort = Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight,
          typeof viewPort == 'number' ? viewPort : viewPort.top);
      visible = visibleLines(cm.display, cm.doc, viewPort);
      if (visible.from >= cm.display.showingFrom && visible.to <= cm.display.showingTo)
        break;
    }

    if (updated) {
      signalLater(cm, 'update', cm);
      if (cm.display.showingFrom != oldFrom || cm.display.showingTo != oldTo)
        signalLater(cm, 'viewportChange', cm, cm.display.showingFrom, cm.display.showingTo);
    }
    return updated;
  }

  // Uses a set of changes plus the current scroll position to
  // determine which DOM updates have to be made, and makes the
  // updates.
  function updateDisplayInner(cm, changes, visible, forced) {
    var display = cm.display, doc = cm.doc;
    if (!display.wrapper.clientWidth) {
      display.showingFrom = display.showingTo = doc.first;
      display.viewOffset = 0;
      return;
    }

    // Bail out if the visible area is already rendered and nothing changed.
    if (!forced && changes.length == 0 &&
        visible.from > display.showingFrom && visible.to < display.showingTo)
      return;

    if (maybeUpdateLineNumberWidth(cm))
      changes = [{from: doc.first, to: doc.first + doc.size}];
    var gutterW = display.sizer.style.marginLeft = `${display.gutters.offsetWidth  }px`;
    display.scrollbarH.style.left = cm.options.fixedGutter ? gutterW : '0';

    // Used to determine which lines need their line numbers updated
    var positionsChangedFrom = Infinity;
    if (cm.options.lineNumbers)
      for (var i = 0; i < changes.length; ++i)
        if (changes[i].diff && changes[i].from < positionsChangedFrom) {
          positionsChangedFrom = changes[i].from; 
        }

    var end = doc.first + doc.size;
    var from = Math.max(visible.from - cm.options.viewportMargin, doc.first);
    var to = Math.min(end, visible.to + cm.options.viewportMargin);
    if (display.showingFrom < from && from - display.showingFrom < 20) from = Math.max(doc.first, display.showingFrom);
    if (display.showingTo > to && display.showingTo - to < 20) to = Math.min(end, display.showingTo);
    if (sawCollapsedSpans) {
      from = lineNo(visualLine(doc, getLine(doc, from)));
      while (to < end && lineIsHidden(doc, getLine(doc, to))) ++to;
    }

    // Create a range of theoretically intact lines, and punch holes
    // in that using the change info.
    var intact = [{from: Math.max(display.showingFrom, doc.first),
      to: Math.min(display.showingTo, end)}];
    if (intact[0].from >= intact[0].to) intact = [];
    else intact = computeIntact(intact, changes);
    // When merged lines are present, we might have to reduce the
    // intact ranges because changes in continued fragments of the
    // intact lines do require the lines to be redrawn.
    if (sawCollapsedSpans)
      for (var i = 0; i < intact.length; ++i) {
        var range = intact[i], merged;
        while (merged = collapsedSpanAtEnd(getLine(doc, range.to - 1))) {
          var newTo = merged.find().from.line;
          if (newTo > range.from) range.to = newTo;
          else {
            intact.splice(i--, 1); break; 
          }
        }
      }

    // Clip off the parts that won't be visible
    var intactLines = 0;
    for (var i = 0; i < intact.length; ++i) {
      var range = intact[i];
      if (range.from < from) range.from = from;
      if (range.to > to) range.to = to;
      if (range.from >= range.to) intact.splice(i--, 1);
      else intactLines += range.to - range.from;
    }
    if (!forced && intactLines == to - from && from == display.showingFrom && to == display.showingTo) {
      updateViewOffset(cm);
      return;
    }
    intact.sort(function (a, b) {
      return a.from - b.from;
    });

    // Avoid crashing on IE's "unspecified error" when in iframes
    try {
      var focused = document.activeElement;
    } catch(e) {}
    if (intactLines < (to - from) * .7) display.lineDiv.style.display = 'none';
    patchDisplay(cm, from, to, intact, positionsChangedFrom);
    display.lineDiv.style.display = '';
    if (focused && document.activeElement != focused && focused.offsetHeight) focused.focus();

    var different = from != display.showingFrom || to != display.showingTo ||
      display.lastSizeC != display.wrapper.clientHeight;
    // This is just a bogus formula that detects when the editor is
    // resized or the font size changes.
    if (different) {
      display.lastSizeC = display.wrapper.clientHeight;
      startWorker(cm, 400);
    }
    display.showingFrom = from; display.showingTo = to;

    updateHeightsInViewport(cm);
    updateViewOffset(cm);

    return true;
  }

  function updateHeightsInViewport(cm) {
    var display = cm.display;
    var prevBottom = display.lineDiv.offsetTop;
    for (var node = display.lineDiv.firstChild, height; node; node = node.nextSibling) if (node.lineObj) {
      if (ie_lt8) {
        var bot = node.offsetTop + node.offsetHeight;
        height = bot - prevBottom;
        prevBottom = bot;
      } else {
        var box = getRect(node);
        height = box.bottom - box.top;
      }
      var diff = node.lineObj.height - height;
      if (height < 2) height = textHeight(display);
      if (diff > .001 || diff < -.001) {
        updateLineHeight(node.lineObj, height);
        var widgets = node.lineObj.widgets;
        if (widgets) for (var i = 0; i < widgets.length; ++i)
          widgets[i].height = widgets[i].node.offsetHeight;
      }
    }
  }

  function updateViewOffset(cm) {
    var off = cm.display.viewOffset = heightAtLine(cm, getLine(cm.doc, cm.display.showingFrom));
    // Position the mover div to align with the current virtual scroll position
    cm.display.mover.style.top = `${off  }px`;
  }

  function computeIntact(intact, changes) {
    for (var i = 0, l = changes.length || 0; i < l; ++i) {
      var change = changes[i], intact2 = [], diff = change.diff || 0;
      for (var j = 0, l2 = intact.length; j < l2; ++j) {
        var range = intact[j];
        if (change.to <= range.from && change.diff) {
          intact2.push({from: range.from + diff, to: range.to + diff});
        } else if (change.to <= range.from || change.from >= range.to) {
          intact2.push(range);
        } else {
          if (change.from > range.from)
            intact2.push({from: range.from, to: change.from});
          if (change.to < range.to)
            intact2.push({from: change.to + diff, to: range.to + diff});
        }
      }
      intact = intact2;
    }
    return intact;
  }

  function getDimensions(cm) {
    var d = cm.display, left = {}, width = {};
    for (var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
      left[cm.options.gutters[i]] = n.offsetLeft;
      width[cm.options.gutters[i]] = n.offsetWidth;
    }
    return {fixedPos: compensateForHScroll(d),
      gutterTotalWidth: d.gutters.offsetWidth,
      gutterLeft: left,
      gutterWidth: width,
      wrapperWidth: d.wrapper.clientWidth};
  }

  function patchDisplay(cm, from, to, intact, updateNumbersFrom) {
    var dims = getDimensions(cm);
    var display = cm.display, lineNumbers = cm.options.lineNumbers;
    if (!intact.length && (!webkit || !cm.display.currentWheelTarget))
      removeChildren(display.lineDiv);
    var container = display.lineDiv, cur = container.firstChild;

    function rm(node) {
      var next = node.nextSibling;
      if (webkit && mac && cm.display.currentWheelTarget == node) {
        node.style.display = 'none';
        node.lineObj = null;
      } else {
        node.parentNode.removeChild(node);
      }
      return next;
    }

    var nextIntact = intact.shift(), lineN = from;
    cm.doc.iter(from, to, function (line) {
      if (nextIntact && nextIntact.to == lineN) nextIntact = intact.shift();
      if (lineIsHidden(cm.doc, line)) {
        if (line.height != 0) updateLineHeight(line, 0);
        if (line.widgets && cur && cur.previousSibling) for (var i = 0; i < line.widgets.length; ++i) {
          var w = line.widgets[i];
          if (w.showIfHidden) {
            var prev = cur.previousSibling;
            if (/pre/i.test(prev.nodeName)) {
              var wrap = elt('div', null, null, 'position: relative');
              prev.parentNode.replaceChild(wrap, prev);
              wrap.appendChild(prev);
              prev = wrap;
            }
            var wnode = prev.appendChild(elt('div', [w.node], 'CodeMirror-linewidget'));
            if (!w.handleMouseEvents) wnode.ignoreEvents = true;
            positionLineWidget(w, wnode, prev, dims);
          }
        }
      } else if (nextIntact && nextIntact.from <= lineN && nextIntact.to > lineN) {
        // This line is intact. Skip to the actual node. Update its
        // line number if needed.
        while (cur.lineObj != line) cur = rm(cur);
        if (lineNumbers && updateNumbersFrom <= lineN && cur.lineNumber)
          setTextContent(cur.lineNumber, lineNumberFor(cm.options, lineN));
        cur = cur.nextSibling;
      } else {
        // For lines with widgets, make an attempt to find and reuse
        // the existing element, so that widgets aren't needlessly
        // removed and re-inserted into the dom
        if (line.widgets) for (var j = 0, search = cur, reuse; search && j < 20; ++j, search = search.nextSibling)
          if (search.lineObj == line && /div/i.test(search.nodeName)) {
            reuse = search; break; 
          }
        // This line needs to be generated.
        var lineNode = buildLineElement(cm, line, lineN, dims, reuse);
        if (lineNode != reuse) {
          container.insertBefore(lineNode, cur);
        } else {
          while (cur != reuse) cur = rm(cur);
          cur = cur.nextSibling;
        }

        lineNode.lineObj = line;
      }
      ++lineN;
    });
    while (cur) cur = rm(cur);
  }

  function buildLineElement(cm, line, lineNo, dims, reuse) {
    var built = buildLineContent(cm, line), lineElement = built.pre;
    var markers = line.gutterMarkers, display = cm.display, wrap;

    var bgClass = built.bgClass ? `${built.bgClass  } ${  line.bgClass || ''}` : line.bgClass;
    if (!cm.options.lineNumbers && !markers && !bgClass && !line.wrapClass && !line.widgets)
      return lineElement;

    // Lines with gutter elements, widgets or a background class need
    // to be wrapped again, and have the extra elements added to the
    // wrapper div

    if (reuse) {
      reuse.alignable = null;
      var isOk = true, widgetsSeen = 0, insertBefore = null;
      for (var n = reuse.firstChild, next; n; n = next) {
        next = n.nextSibling;
        if (!/\bCodeMirror-linewidget\b/.test(n.className)) {
          reuse.removeChild(n);
        } else {
          for (var i = 0; i < line.widgets.length; ++i) {
            var widget = line.widgets[i];
            if (widget.node == n.firstChild) {
              if (!widget.above && !insertBefore) insertBefore = n;
              positionLineWidget(widget, n, reuse, dims);
              ++widgetsSeen;
              break;
            }
          }
          if (i == line.widgets.length) {
            isOk = false; break; 
          }
        }
      }
      reuse.insertBefore(lineElement, insertBefore);
      if (isOk && widgetsSeen == line.widgets.length) {
        wrap = reuse;
        reuse.className = line.wrapClass || '';
      }
    }
    if (!wrap) {
      wrap = elt('div', null, line.wrapClass, 'position: relative');
      wrap.appendChild(lineElement);
    }
    // Kludge to make sure the styled element lies behind the selection (by z-index)
    if (bgClass)
      wrap.insertBefore(elt('div', null, `${bgClass  } CodeMirror-linebackground`), wrap.firstChild);
    if (cm.options.lineNumbers || markers) {
      var gutterWrap = wrap.insertBefore(elt('div', null, null, `position: absolute; left: ${ 
        cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth  }px`),
      wrap.firstChild);
      if (cm.options.fixedGutter) (wrap.alignable || (wrap.alignable = [])).push(gutterWrap);
      if (cm.options.lineNumbers && (!markers || !markers['CodeMirror-linenumbers']))
        wrap.lineNumber = gutterWrap.appendChild(
          elt('div', lineNumberFor(cm.options, lineNo),
            'CodeMirror-linenumber CodeMirror-gutter-elt',
            `left: ${  dims.gutterLeft['CodeMirror-linenumbers']  }px; width: ${
              display.lineNumInnerWidth  }px`));
      if (markers)
        for (var k = 0; k < cm.options.gutters.length; ++k) {
          var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
          if (found)
            gutterWrap.appendChild(elt('div', [found], 'CodeMirror-gutter-elt', `left: ${ 
              dims.gutterLeft[id]  }px; width: ${  dims.gutterWidth[id]  }px`));
        }
    }
    if (ie_lt8) wrap.style.zIndex = 2;
    if (line.widgets && wrap != reuse) for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
      var widget = ws[i], node = elt('div', [widget.node], 'CodeMirror-linewidget');
      if (!widget.handleMouseEvents) node.ignoreEvents = true;
      positionLineWidget(widget, node, wrap, dims);
      if (widget.above)
        wrap.insertBefore(node, cm.options.lineNumbers && line.height != 0 ? gutterWrap : lineElement);
      else
        wrap.appendChild(node);
      signalLater(widget, 'redraw');
    }
    return wrap;
  }

  function positionLineWidget(widget, node, wrap, dims) {
    if (widget.noHScroll) {
      (wrap.alignable || (wrap.alignable = [])).push(node);
      var width = dims.wrapperWidth;
      node.style.left = `${dims.fixedPos  }px`;
      if (!widget.coverGutter) {
        width -= dims.gutterTotalWidth;
        node.style.paddingLeft = `${dims.gutterTotalWidth  }px`;
      }
      node.style.width = `${width  }px`;
    }
    if (widget.coverGutter) {
      node.style.zIndex = 5;
      node.style.position = 'relative';
      if (!widget.noHScroll) node.style.marginLeft = `${-dims.gutterTotalWidth  }px`;
    }
  }

  // SELECTION / CURSOR

  function updateSelection(cm) {
    var display = cm.display;
    var collapsed = posEq(cm.doc.sel.from, cm.doc.sel.to);
    if (collapsed || cm.options.showCursorWhenSelecting)
      updateSelectionCursor(cm);
    else
      display.cursor.style.display = display.otherCursor.style.display = 'none';
    if (!collapsed)
      updateSelectionRange(cm);
    else
      display.selectionDiv.style.display = 'none';

    // Move the hidden textarea near the cursor to prevent scrolling artifacts
    if (cm.options.moveInputWithCursor) {
      var headPos = cursorCoords(cm, cm.doc.sel.head, 'div');
      var wrapOff = getRect(display.wrapper), lineOff = getRect(display.lineDiv);
      display.inputDiv.style.top = `${Math.max(0, Math.min(display.wrapper.clientHeight - 10,
        headPos.top + lineOff.top - wrapOff.top))  }px`;
      display.inputDiv.style.left = `${Math.max(0, Math.min(display.wrapper.clientWidth - 10,
        headPos.left + lineOff.left - wrapOff.left))  }px`;
    }
  }

  // No selection, plain cursor
  function updateSelectionCursor(cm) {
    var display = cm.display, pos = cursorCoords(cm, cm.doc.sel.head, 'div');
    display.cursor.style.left = `${pos.left  }px`;
    display.cursor.style.top = `${pos.top  }px`;
    display.cursor.style.height = `${Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight  }px`;
    display.cursor.style.display = '';

    if (pos.other) {
      display.otherCursor.style.display = '';
      display.otherCursor.style.left = `${pos.other.left  }px`;
      display.otherCursor.style.top = `${pos.other.top  }px`;
      display.otherCursor.style.height = `${(pos.other.bottom - pos.other.top) * .85  }px`;
    } else {
      display.otherCursor.style.display = 'none'; 
    }
  }

  // Highlight selection
  function updateSelectionRange(cm) {
    var display = cm.display, doc = cm.doc, sel = cm.doc.sel;
    var fragment = document.createDocumentFragment();
    var clientWidth = display.lineSpace.offsetWidth, pl = paddingLeft(cm.display);

    function add(left, top, width, bottom) {
      if (top < 0) top = 0;
      fragment.appendChild(elt('div', null, 'CodeMirror-selected', `position: absolute; left: ${  left 
      }px; top: ${  top  }px; width: ${  width == null ? clientWidth - left : width 
      }px; height: ${  bottom - top  }px`));
    }

    function drawForLine(line, fromArg, toArg) {
      var lineObj = getLine(doc, line);
      var lineLen = lineObj.text.length;
      var start, end;
      function coords(ch, bias) {
        return charCoords(cm, Pos(line, ch), 'div', lineObj, bias);
      }

      iterateBidiSections(getOrder(lineObj), fromArg || 0, toArg == null ? lineLen : toArg, function (from, to, dir) {
        var leftPos = coords(from, 'left'), rightPos, left, right;
        if (from == to) {
          rightPos = leftPos;
          left = right = leftPos.left;
        } else {
          rightPos = coords(to - 1, 'right');
          if (dir == 'rtl') {
            var tmp = leftPos; leftPos = rightPos; rightPos = tmp; 
          }
          left = leftPos.left;
          right = rightPos.right;
        }
        if (fromArg == null && from == 0) left = pl;
        if (rightPos.top - leftPos.top > 3) { // Different lines, draw top part
          add(left, leftPos.top, null, leftPos.bottom);
          left = pl;
          if (leftPos.bottom < rightPos.top) add(left, leftPos.bottom, null, rightPos.top);
        }
        if (toArg == null && to == lineLen) right = clientWidth;
        if (!start || leftPos.top < start.top || leftPos.top == start.top && leftPos.left < start.left)
          start = leftPos;
        if (!end || rightPos.bottom > end.bottom || rightPos.bottom == end.bottom && rightPos.right > end.right)
          end = rightPos;
        if (left < pl + 1) left = pl;
        add(left, rightPos.top, right - left, rightPos.bottom);
      });
      return {start: start, end: end};
    }

    if (sel.from.line == sel.to.line) {
      drawForLine(sel.from.line, sel.from.ch, sel.to.ch);
    } else {
      var fromLine = getLine(doc, sel.from.line), toLine = getLine(doc, sel.to.line);
      var singleVLine = visualLine(doc, fromLine) == visualLine(doc, toLine);
      var leftEnd = drawForLine(sel.from.line, sel.from.ch, singleVLine ? fromLine.text.length : null).end;
      var rightStart = drawForLine(sel.to.line, singleVLine ? 0 : null, sel.to.ch).start;
      if (singleVLine) {
        if (leftEnd.top < rightStart.top - 2) {
          add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
          add(pl, rightStart.top, rightStart.left, rightStart.bottom);
        } else {
          add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
        }
      }
      if (leftEnd.bottom < rightStart.top)
        add(pl, leftEnd.bottom, null, rightStart.top);
    }

    removeChildrenAndAdd(display.selectionDiv, fragment);
    display.selectionDiv.style.display = '';
  }

  // Cursor-blinking
  function restartBlink(cm) {
    if (!cm.state.focused) return;
    var display = cm.display;
    clearInterval(display.blinker);
    var on = true;
    display.cursor.style.visibility = display.otherCursor.style.visibility = '';
    if (cm.options.cursorBlinkRate > 0)
      display.blinker = setInterval(function () {
        display.cursor.style.visibility = display.otherCursor.style.visibility = (on = !on) ? '' : 'hidden';
      }, cm.options.cursorBlinkRate);
  }

  // HIGHLIGHT WORKER

  function startWorker(cm, time) {
    if (cm.doc.mode.startState && cm.doc.frontier < cm.display.showingTo)
      cm.state.highlight.set(time, bind(highlightWorker, cm));
  }

  function highlightWorker(cm) {
    var doc = cm.doc;
    if (doc.frontier < doc.first) doc.frontier = doc.first;
    if (doc.frontier >= cm.display.showingTo) return;
    var end = +new Date + cm.options.workTime;
    var state = copyState(doc.mode, getStateBefore(cm, doc.frontier));
    var changed = [], prevChange;
    doc.iter(doc.frontier, Math.min(doc.first + doc.size, cm.display.showingTo + 500), function (line) {
      if (doc.frontier >= cm.display.showingFrom) { // Visible
        var oldStyles = line.styles;
        line.styles = highlightLine(cm, line, state);
        var ischange = !oldStyles || oldStyles.length != line.styles.length;
        for (var i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];
        if (ischange) {
          if (prevChange && prevChange.end == doc.frontier) prevChange.end++;
          else changed.push(prevChange = {start: doc.frontier, end: doc.frontier + 1});
        }
        line.stateAfter = copyState(doc.mode, state);
      } else {
        processLine(cm, line, state);
        line.stateAfter = doc.frontier % 5 == 0 ? copyState(doc.mode, state) : null;
      }
      ++doc.frontier;
      if (+new Date > end) {
        startWorker(cm, cm.options.workDelay);
        return true;
      }
    });
    if (changed.length)
      operation(cm, function () {
        for (var i = 0; i < changed.length; ++i)
          regChange(this, changed[i].start, changed[i].end);
      })();
  }

  // Finds the line to start with when starting a parse. Tries to
  // find a line with a stateAfter, so that it can start with a
  // valid state. If that fails, it returns the line with the
  // smallest indentation, which tends to need the least context to
  // parse correctly.
  function findStartLine(cm, n, precise) {
    var minindent, minline, doc = cm.doc, maxScan = cm.doc.mode.innerMode ? 1000 : 100;
    for (var search = n, lim = n - maxScan; search > lim; --search) {
      if (search <= doc.first) return doc.first;
      var line = getLine(doc, search - 1);
      if (line.stateAfter && (!precise || search <= doc.frontier)) return search;
      var indented = countColumn(line.text, null, cm.options.tabSize);
      if (minline == null || minindent > indented) {
        minline = search - 1;
        minindent = indented;
      }
    }
    return minline;
  }

  function getStateBefore(cm, n, precise) {
    var doc = cm.doc, display = cm.display;
    if (!doc.mode.startState) return true;
    var pos = findStartLine(cm, n, precise), state = pos > doc.first && getLine(doc, pos-1).stateAfter;
    if (!state) state = startState(doc.mode);
    else state = copyState(doc.mode, state);
    doc.iter(pos, n, function (line) {
      processLine(cm, line, state);
      var save = pos == n - 1 || pos % 5 == 0 || pos >= display.showingFrom && pos < display.showingTo;
      line.stateAfter = save ? copyState(doc.mode, state) : null;
      ++pos;
    });
    return state;
  }

  // POSITION MEASUREMENT

  function paddingTop(display) {
    return display.lineSpace.offsetTop;
  }
  function paddingVert(display) {
    return display.mover.offsetHeight - display.lineSpace.offsetHeight;
  }
  function paddingLeft(display) {
    var e = removeChildrenAndAdd(display.measure, elt('pre', null, null, 'text-align: left')).appendChild(elt('span', 'x'));
    return e.offsetLeft;
  }

  function measureChar(cm, line, ch, data, bias) {
    var dir = -1;
    data = data || measureLine(cm, line);
    if (data.crude) {
      var left = data.left + ch * data.width;
      return {left: left, right: left + data.width, top: data.top, bottom: data.bottom};
    }

    for (var pos = ch;; pos += dir) {
      var r = data[pos];
      if (r) break;
      if (dir < 0 && pos == 0) dir = 1;
    }
    bias = pos > ch ? 'left' : pos < ch ? 'right' : bias;
    if (bias == 'left' && r.leftSide) r = r.leftSide;
    else if (bias == 'right' && r.rightSide) r = r.rightSide;
    return {left: pos < ch ? r.right : r.left,
      right: pos > ch ? r.left : r.right,
      top: r.top,
      bottom: r.bottom};
  }

  function findCachedMeasurement(cm, line) {
    var cache = cm.display.measureLineCache;
    for (var i = 0; i < cache.length; ++i) {
      var memo = cache[i];
      if (memo.text == line.text && memo.markedSpans == line.markedSpans &&
          cm.display.scroller.clientWidth == memo.width &&
          memo.classes == `${line.textClass  }|${  line.wrapClass}`)
        return memo;
    }
  }

  function clearCachedMeasurement(cm, line) {
    var exists = findCachedMeasurement(cm, line);
    if (exists) exists.text = exists.measure = exists.markedSpans = null;
  }

  function measureLine(cm, line) {
    // First look in the cache
    var cached = findCachedMeasurement(cm, line);
    if (cached) return cached.measure;

    // Failing that, recompute and store result in cache
    var measure = measureLineInner(cm, line);
    var cache = cm.display.measureLineCache;
    var memo = {text: line.text, width: cm.display.scroller.clientWidth,
      markedSpans: line.markedSpans, measure: measure,
      classes: `${line.textClass  }|${  line.wrapClass}`};
    if (cache.length == 16) cache[++cm.display.measureLineCachePos % 16] = memo;
    else cache.push(memo);
    return measure;
  }

  function measureLineInner(cm, line) {
    if (!cm.options.lineWrapping && line.text.length >= cm.options.crudeMeasuringFrom)
      return crudelyMeasureLine(cm, line);

    var display = cm.display, measure = emptyArray(line.text.length);
    var pre = buildLineContent(cm, line, measure, true).pre;

    // IE does not cache element positions of inline elements between
    // calls to getBoundingClientRect. This makes the loop below,
    // which gathers the positions of all the characters on the line,
    // do an amount of layout work quadratic to the number of
    // characters. When line wrapping is off, we try to improve things
    // by first subdividing the line into a bunch of inline blocks, so
    // that IE can reuse most of the layout information from caches
    // for those blocks. This does interfere with line wrapping, so it
    // doesn't work when wrapping is on, but in that case the
    // situation is slightly better, since IE does cache line-wrapping
    // information and only recomputes per-line.
    if (ie && !ie_lt8 && !cm.options.lineWrapping && pre.childNodes.length > 100) {
      var fragment = document.createDocumentFragment();
      var chunk = 10, n = pre.childNodes.length;
      for (var i = 0, chunks = Math.ceil(n / chunk); i < chunks; ++i) {
        var wrap = elt('div', null, null, 'display: inline-block');
        for (var j = 0; j < chunk && n; ++j) {
          wrap.appendChild(pre.firstChild);
          --n;
        }
        fragment.appendChild(wrap);
      }
      pre.appendChild(fragment);
    }

    removeChildrenAndAdd(display.measure, pre);

    var outer = getRect(display.lineDiv);
    var vranges = [], data = emptyArray(line.text.length), maxBot = pre.offsetHeight;
    // Work around an IE7/8 bug where it will sometimes have randomly
    // replaced our pre with a clone at this point.
    if (ie_lt9 && display.measure.first != pre)
      removeChildrenAndAdd(display.measure, pre);

    function measureRect(rect) {
      var top = rect.top - outer.top, bot = rect.bottom - outer.top;
      if (bot > maxBot) bot = maxBot;
      if (top < 0) top = 0;
      for (var i = vranges.length - 2; i >= 0; i -= 2) {
        var rtop = vranges[i], rbot = vranges[i+1];
        if (rtop > bot || rbot < top) continue;
        if (rtop <= top && rbot >= bot ||
            top <= rtop && bot >= rbot ||
            Math.min(bot, rbot) - Math.max(top, rtop) >= (bot - top) >> 1) {
          vranges[i] = Math.min(top, rtop);
          vranges[i+1] = Math.max(bot, rbot);
          break;
        }
      }
      if (i < 0) {
        i = vranges.length; vranges.push(top, bot); 
      }
      return {left: rect.left - outer.left,
        right: rect.right - outer.left,
        top: i, bottom: null};
    }
    function finishRect(rect) {
      rect.bottom = vranges[rect.top+1];
      rect.top = vranges[rect.top];
    }

    for (var i = 0, cur; i < measure.length; ++i) if (cur = measure[i]) {
      var node = cur, rect = null;
      // A widget might wrap, needs special care
      if (/\bCodeMirror-widget\b/.test(cur.className) && cur.getClientRects) {
        if (cur.firstChild.nodeType == 1) node = cur.firstChild;
        var rects = node.getClientRects();
        if (rects.length > 1) {
          rect = data[i] = measureRect(rects[0]);
          rect.rightSide = measureRect(rects[rects.length - 1]);
        }
      }
      if (!rect) rect = data[i] = measureRect(getRect(node));
      if (cur.measureRight) rect.right = getRect(cur.measureRight).left;
      if (cur.leftSide) rect.leftSide = measureRect(getRect(cur.leftSide));
    }
    removeChildren(cm.display.measure);
    for (var i = 0, cur; i < data.length; ++i) if (cur = data[i]) {
      finishRect(cur);
      if (cur.leftSide) finishRect(cur.leftSide);
      if (cur.rightSide) finishRect(cur.rightSide);
    }
    return data;
  }

  function crudelyMeasureLine(cm, line) {
    var copy = new Line(line.text.slice(0, 100), null);
    if (line.textClass) copy.textClass = line.textClass;
    var measure = measureLineInner(cm, copy);
    var left = measureChar(cm, copy, 0, measure, 'left');
    var right = measureChar(cm, copy, 99, measure, 'right');
    return {crude: true, top: left.top, left: left.left, bottom: left.bottom, width: (right.right - left.left) / 100};
  }

  function measureLineWidth(cm, line) {
    var hasBadSpan = false;
    if (line.markedSpans) for (var i = 0; i < line.markedSpans; ++i) {
      var sp = line.markedSpans[i];
      if (sp.collapsed && (sp.to == null || sp.to == line.text.length)) hasBadSpan = true;
    }
    var cached = !hasBadSpan && findCachedMeasurement(cm, line);
    if (cached || line.text.length >= cm.options.crudeMeasuringFrom)
      return measureChar(cm, line, line.text.length, cached && cached.measure, 'right').right;

    var pre = buildLineContent(cm, line, null, true).pre;
    var end = pre.appendChild(zeroWidthElement(cm.display.measure));
    removeChildrenAndAdd(cm.display.measure, pre);
    return getRect(end).right - getRect(cm.display.lineDiv).left;
  }

  function clearCaches(cm) {
    cm.display.measureLineCache.length = cm.display.measureLineCachePos = 0;
    cm.display.cachedCharWidth = cm.display.cachedTextHeight = null;
    if (!cm.options.lineWrapping) cm.display.maxLineChanged = true;
    cm.display.lineNumChars = null;
  }

  function pageScrollX() {
    return window.pageXOffset || (document.documentElement || document.body).scrollLeft; 
  }
  function pageScrollY() {
    return window.pageYOffset || (document.documentElement || document.body).scrollTop; 
  }

  // Context is one of "line", "div" (display.lineDiv), "local"/null (editor), or "page"
  function intoCoordSystem(cm, lineObj, rect, context) {
    if (lineObj.widgets) for (var i = 0; i < lineObj.widgets.length; ++i) if (lineObj.widgets[i].above) {
      var size = widgetHeight(lineObj.widgets[i]);
      rect.top += size; rect.bottom += size;
    }
    if (context == 'line') return rect;
    if (!context) context = 'local';
    var yOff = heightAtLine(cm, lineObj);
    if (context == 'local') yOff += paddingTop(cm.display);
    else yOff -= cm.display.viewOffset;
    if (context == 'page' || context == 'window') {
      var lOff = getRect(cm.display.lineSpace);
      yOff += lOff.top + (context == 'window' ? 0 : pageScrollY());
      var xOff = lOff.left + (context == 'window' ? 0 : pageScrollX());
      rect.left += xOff; rect.right += xOff;
    }
    rect.top += yOff; rect.bottom += yOff;
    return rect;
  }

  // Context may be "window", "page", "div", or "local"/null
  // Result is in "div" coords
  function fromCoordSystem(cm, coords, context) {
    if (context == 'div') return coords;
    var left = coords.left, top = coords.top;
    // First move into "page" coordinate system
    if (context == 'page') {
      left -= pageScrollX();
      top -= pageScrollY();
    } else if (context == 'local' || !context) {
      var localBox = getRect(cm.display.sizer);
      left += localBox.left;
      top += localBox.top;
    }

    var lineSpaceBox = getRect(cm.display.lineSpace);
    return {left: left - lineSpaceBox.left, top: top - lineSpaceBox.top};
  }

  function charCoords(cm, pos, context, lineObj, bias) {
    if (!lineObj) lineObj = getLine(cm.doc, pos.line);
    return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, null, bias), context);
  }

  function cursorCoords(cm, pos, context, lineObj, measurement) {
    lineObj = lineObj || getLine(cm.doc, pos.line);
    if (!measurement) measurement = measureLine(cm, lineObj);
    function get(ch, right) {
      var m = measureChar(cm, lineObj, ch, measurement, right ? 'right' : 'left');
      if (right) m.left = m.right; else m.right = m.left;
      return intoCoordSystem(cm, lineObj, m, context);
    }
    function getBidi(ch, partPos) {
      var part = order[partPos], right = part.level % 2;
      if (ch == bidiLeft(part) && partPos && part.level < order[partPos - 1].level) {
        part = order[--partPos];
        ch = bidiRight(part) - (part.level % 2 ? 0 : 1);
        right = true;
      } else if (ch == bidiRight(part) && partPos < order.length - 1 && part.level < order[partPos + 1].level) {
        part = order[++partPos];
        ch = bidiLeft(part) - part.level % 2;
        right = false;
      }
      if (right && ch == part.to && ch > part.from) return get(ch - 1);
      return get(ch, right);
    }
    var order = getOrder(lineObj), ch = pos.ch;
    if (!order) return get(ch);
    var partPos = getBidiPartAt(order, ch);
    var val = getBidi(ch, partPos);
    if (bidiOther != null) val.other = getBidi(ch, bidiOther);
    return val;
  }

  function PosWithInfo(line, ch, outside, xRel) {
    var pos = new Pos(line, ch);
    pos.xRel = xRel;
    if (outside) pos.outside = true;
    return pos;
  }

  // Coords must be lineSpace-local
  function coordsChar(cm, x, y) {
    var doc = cm.doc;
    y += cm.display.viewOffset;
    if (y < 0) return PosWithInfo(doc.first, 0, true, -1);
    var lineNo = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
    if (lineNo > last)
      return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, true, 1);
    if (x < 0) x = 0;

    for (;;) {
      var lineObj = getLine(doc, lineNo);
      var found = coordsCharInner(cm, lineObj, lineNo, x, y);
      var merged = collapsedSpanAtEnd(lineObj);
      var mergedPos = merged && merged.find();
      if (merged && (found.ch > mergedPos.from.ch || found.ch == mergedPos.from.ch && found.xRel > 0))
        lineNo = mergedPos.to.line;
      else
        return found;
    }
  }

  function coordsCharInner(cm, lineObj, lineNo, x, y) {
    var innerOff = y - heightAtLine(cm, lineObj);
    var wrongLine = false, adjust = 2 * cm.display.wrapper.clientWidth;
    var measurement = measureLine(cm, lineObj);

    function getX(ch) {
      var sp = cursorCoords(cm, Pos(lineNo, ch), 'line',
        lineObj, measurement);
      wrongLine = true;
      if (innerOff > sp.bottom) return sp.left - adjust;
      else if (innerOff < sp.top) return sp.left + adjust;
      else wrongLine = false;
      return sp.left;
    }

    var bidi = getOrder(lineObj), dist = lineObj.text.length;
    var from = lineLeft(lineObj), to = lineRight(lineObj);
    var fromX = getX(from), fromOutside = wrongLine, toX = getX(to), toOutside = wrongLine;

    if (x > toX) return PosWithInfo(lineNo, to, toOutside, 1);
    // Do a binary search between these bounds.
    for (;;) {
      if (bidi ? to == from || to == moveVisually(lineObj, from, 1) : to - from <= 1) {
        var ch = x < fromX || x - fromX <= toX - x ? from : to;
        var xDiff = x - (ch == from ? fromX : toX);
        while (isExtendingChar.test(lineObj.text.charAt(ch))) ++ch;
        var pos = PosWithInfo(lineNo, ch, ch == from ? fromOutside : toOutside,
          xDiff < 0 ? -1 : xDiff ? 1 : 0);
        return pos;
      }
      var step = Math.ceil(dist / 2), middle = from + step;
      if (bidi) {
        middle = from;
        for (var i = 0; i < step; ++i) middle = moveVisually(lineObj, middle, 1);
      }
      var middleX = getX(middle);
      if (middleX > x) {
        to = middle; toX = middleX; if (toOutside = wrongLine) toX += 1000; dist = step;
      } else {
        from = middle; fromX = middleX; fromOutside = wrongLine; dist -= step;
      }
    }
  }

  var measureText;
  function textHeight(display) {
    if (display.cachedTextHeight != null) return display.cachedTextHeight;
    if (measureText == null) {
      measureText = elt('pre');
      // Measure a bunch of lines, for browsers that compute
      // fractional heights.
      for (var i = 0; i < 49; ++i) {
        measureText.appendChild(document.createTextNode('x'));
        measureText.appendChild(elt('br'));
      }
      measureText.appendChild(document.createTextNode('x'));
    }
    removeChildrenAndAdd(display.measure, measureText);
    var height = measureText.offsetHeight / 50;
    if (height > 3) display.cachedTextHeight = height;
    removeChildren(display.measure);
    return height || 1;
  }

  function charWidth(display) {
    if (display.cachedCharWidth != null) return display.cachedCharWidth;
    var anchor = elt('span', 'x');
    var pre = elt('pre', [anchor]);
    removeChildrenAndAdd(display.measure, pre);
    var width = anchor.offsetWidth;
    if (width > 2) display.cachedCharWidth = width;
    return width || 10;
  }

  // OPERATIONS

  // Operations are used to wrap changes in such a way that each
  // change won't have to update the cursor and display (which would
  // be awkward, slow, and error-prone), but instead updates are
  // batched and then all combined and executed at once.

  var nextOpId = 0;
  function startOperation(cm) {
    cm.curOp = {
      // An array of ranges of lines that have to be updated. See
      // updateDisplay.
      changes: [],
      forceUpdate: false,
      updateInput: null,
      userSelChange: null,
      textChanged: null,
      selectionChanged: false,
      cursorActivity: false,
      updateMaxLine: false,
      updateScrollPos: false,
      id: ++nextOpId
    };
    if (!delayedCallbackDepth++) delayedCallbacks = [];
  }

  function endOperation(cm) {
    var op = cm.curOp, doc = cm.doc, display = cm.display;
    cm.curOp = null;

    if (op.updateMaxLine) computeMaxLength(cm);
    if (display.maxLineChanged && !cm.options.lineWrapping && display.maxLine) {
      var width = measureLineWidth(cm, display.maxLine);
      display.sizer.style.minWidth = `${Math.max(0, width + 3 + scrollerCutOff)  }px`;
      display.maxLineChanged = false;
      var maxScrollLeft = Math.max(0, display.sizer.offsetLeft + display.sizer.offsetWidth - display.scroller.clientWidth);
      if (maxScrollLeft < doc.scrollLeft && !op.updateScrollPos)
        setScrollLeft(cm, Math.min(display.scroller.scrollLeft, maxScrollLeft), true);
    }
    var newScrollPos, updated;
    if (op.updateScrollPos) {
      newScrollPos = op.updateScrollPos;
    } else if (op.selectionChanged && display.scroller.clientHeight) { // don't rescroll if not visible
      var coords = cursorCoords(cm, doc.sel.head);
      newScrollPos = calculateScrollPos(cm, coords.left, coords.top, coords.left, coords.bottom);
    }
    if (op.changes.length || op.forceUpdate || newScrollPos && newScrollPos.scrollTop != null) {
      updated = updateDisplay(cm, op.changes, newScrollPos && newScrollPos.scrollTop, op.forceUpdate);
      if (cm.display.scroller.offsetHeight) cm.doc.scrollTop = cm.display.scroller.scrollTop;
    }
    if (!updated && op.selectionChanged) updateSelection(cm);
    if (op.updateScrollPos) {
      display.scroller.scrollTop = display.scrollbarV.scrollTop = doc.scrollTop = newScrollPos.scrollTop;
      display.scroller.scrollLeft = display.scrollbarH.scrollLeft = doc.scrollLeft = newScrollPos.scrollLeft;
      alignHorizontally(cm);
      if (op.scrollToPos)
        scrollPosIntoView(cm, clipPos(cm.doc, op.scrollToPos), op.scrollToPosMargin);
    } else if (newScrollPos) {
      scrollCursorIntoView(cm);
    }
    if (op.selectionChanged) restartBlink(cm);

    if (cm.state.focused && op.updateInput)
      resetInput(cm, op.userSelChange);

    var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
    if (hidden) for (var i = 0; i < hidden.length; ++i)
      if (!hidden[i].lines.length) signal(hidden[i], 'hide');
    if (unhidden) for (var i = 0; i < unhidden.length; ++i)
      if (unhidden[i].lines.length) signal(unhidden[i], 'unhide');

    var delayed;
    if (!--delayedCallbackDepth) {
      delayed = delayedCallbacks;
      delayedCallbacks = null;
    }
    if (op.textChanged)
      signal(cm, 'change', cm, op.textChanged);
    if (op.cursorActivity) signal(cm, 'cursorActivity', cm);
    if (delayed) for (var i = 0; i < delayed.length; ++i) delayed[i]();
  }

  // Wraps a function in an operation. Returns the wrapped function.
  function operation(cm1, f) {
    return function () {
      var cm = cm1 || this, withOp = !cm.curOp;
      if (withOp) startOperation(cm);
      try {
        var result = f.apply(cm, arguments); 
      } finally {
        if (withOp) endOperation(cm); 
      }
      return result;
    };
  }
  function docOperation(f) {
    return function () {
      var withOp = this.cm && !this.cm.curOp, result;
      if (withOp) startOperation(this.cm);
      try {
        result = f.apply(this, arguments); 
      } finally {
        if (withOp) endOperation(this.cm); 
      }
      return result;
    };
  }
  function runInOp(cm, f) {
    var withOp = !cm.curOp, result;
    if (withOp) startOperation(cm);
    try {
      result = f(); 
    } finally {
      if (withOp) endOperation(cm); 
    }
    return result;
  }

  function regChange(cm, from, to, lendiff) {
    if (from == null) from = cm.doc.first;
    if (to == null) to = cm.doc.first + cm.doc.size;
    cm.curOp.changes.push({from: from, to: to, diff: lendiff});
  }

  // INPUT HANDLING

  function slowPoll(cm) {
    if (cm.display.pollingFast) return;
    cm.display.poll.set(cm.options.pollInterval, function () {
      readInput(cm);
      if (cm.state.focused) slowPoll(cm);
    });
  }

  function fastPoll(cm) {
    var missed = false;
    cm.display.pollingFast = true;
    function p() {
      var changed = readInput(cm);
      if (!changed && !missed) {
        missed = true; cm.display.poll.set(60, p);
      } else {
        cm.display.pollingFast = false; slowPoll(cm);
      }
    }
    cm.display.poll.set(20, p);
  }

  // prevInput is a hack to work with IME. If we reset the textarea
  // on every change, that breaks IME. So we look for changes
  // compared to the previous content instead. (Modern browsers have
  // events that indicate IME taking place, but these are not widely
  // supported or compatible enough yet to rely on.)
  function readInput(cm) {
    var input = cm.display.input, prevInput = cm.display.prevInput, doc = cm.doc, sel = doc.sel;
    if (!cm.state.focused || hasSelection(input) || isReadOnly(cm) || cm.state.disableInput) return false;
    if (cm.state.pasteIncoming && cm.state.fakedLastChar) {
      input.value = input.value.substring(0, input.value.length - 1);
      cm.state.fakedLastChar = false;
    }
    var text = input.value;
    if (text == prevInput && posEq(sel.from, sel.to)) return false;
    if (ie && !ie_lt9 && cm.display.inputHasSelection === text) {
      resetInput(cm, true);
      return false;
    }

    var withOp = !cm.curOp;
    if (withOp) startOperation(cm);
    sel.shift = false;
    var same = 0, l = Math.min(prevInput.length, text.length);
    while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) ++same;
    var from = sel.from, to = sel.to;
    if (same < prevInput.length)
      from = Pos(from.line, from.ch - (prevInput.length - same));
    else if (cm.state.overwrite && posEq(from, to) && !cm.state.pasteIncoming)
      to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + (text.length - same)));

    var updateInput = cm.curOp.updateInput;
    var changeEvent = {from: from, to: to, text: splitLines(text.slice(same)),
      origin: cm.state.pasteIncoming ? 'paste' : '+input'};
    makeChange(cm.doc, changeEvent, 'end');
    cm.curOp.updateInput = updateInput;
    signalLater(cm, 'inputRead', cm, changeEvent);

    if (text.length > 1000 || text.indexOf('\n') > -1) input.value = cm.display.prevInput = '';
    else cm.display.prevInput = text;
    if (withOp) endOperation(cm);
    cm.state.pasteIncoming = false;
    return true;
  }

  function resetInput(cm, user) {
    var minimal, selected, doc = cm.doc;
    if (!posEq(doc.sel.from, doc.sel.to)) {
      cm.display.prevInput = '';
      minimal = hasCopyEvent &&
        (doc.sel.to.line - doc.sel.from.line > 100 || (selected = cm.getSelection()).length > 1000);
      var content = minimal ? '-' : selected || cm.getSelection();
      cm.display.input.value = content;
      if (cm.state.focused) selectInput(cm.display.input);
      if (ie && !ie_lt9) cm.display.inputHasSelection = content;
    } else if (user) {
      cm.display.prevInput = cm.display.input.value = '';
      if (ie && !ie_lt9) cm.display.inputHasSelection = null;
    }
    cm.display.inaccurateSelection = minimal;
  }

  function focusInput(cm) {
    if (cm.options.readOnly != 'nocursor' && (!mobile || document.activeElement != cm.display.input))
      cm.display.input.focus();
  }

  function isReadOnly(cm) {
    return cm.options.readOnly || cm.doc.cantEdit;
  }

  // EVENT HANDLERS

  function registerEventHandlers(cm) {
    var d = cm.display;
    on(d.scroller, 'mousedown', operation(cm, onMouseDown));
    if (ie)
      on(d.scroller, 'dblclick', operation(cm, function (e) {
        if (signalDOMEvent(cm, e)) return;
        var pos = posFromMouse(cm, e);
        if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) return;
        e_preventDefault(e);
        var word = findWordAt(getLine(cm.doc, pos.line).text, pos);
        extendSelection(cm.doc, word.from, word.to);
      }));
    else
      on(d.scroller, 'dblclick', function (e) {
        signalDOMEvent(cm, e) || e_preventDefault(e); 
      });
    on(d.lineSpace, 'selectstart', function (e) {
      if (!eventInWidget(d, e)) e_preventDefault(e);
    });
    // Gecko browsers fire contextmenu *after* opening the menu, at
    // which point we can't mess with it anymore. Context menu is
    // handled in onMouseDown for Gecko.
    if (!captureMiddleClick) on(d.scroller, 'contextmenu', function (e) {
      onContextMenu(cm, e);
    });

    on(d.scroller, 'scroll', function () {
      if (d.scroller.clientHeight) {
        setScrollTop(cm, d.scroller.scrollTop);
        setScrollLeft(cm, d.scroller.scrollLeft, true);
        signal(cm, 'scroll', cm);
      }
    });
    on(d.scrollbarV, 'scroll', function () {
      if (d.scroller.clientHeight) setScrollTop(cm, d.scrollbarV.scrollTop);
    });
    on(d.scrollbarH, 'scroll', function () {
      if (d.scroller.clientHeight) setScrollLeft(cm, d.scrollbarH.scrollLeft);
    });

    on(d.scroller, 'mousewheel', function (e){
      onScrollWheel(cm, e);
    });
    on(d.scroller, 'DOMMouseScroll', function (e){
      onScrollWheel(cm, e);
    });

    function reFocus() {
      if (cm.state.focused) setTimeout(bind(focusInput, cm), 0); 
    }
    on(d.scrollbarH, 'mousedown', reFocus);
    on(d.scrollbarV, 'mousedown', reFocus);
    // Prevent wrapper from ever scrolling
    on(d.wrapper, 'scroll', function () {
      d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; 
    });

    var resizeTimer;
    function onResize() {
      if (resizeTimer == null) resizeTimer = setTimeout(function () {
        resizeTimer = null;
        // Might be a text scaling operation, clear size caches.
        d.cachedCharWidth = d.cachedTextHeight = knownScrollbarWidth = null;
        clearCaches(cm);
        runInOp(cm, bind(regChange, cm));
      }, 100);
    }
    on(window, 'resize', onResize);
    // Above handler holds on to the editor and its data structures.
    // Here we poll to unregister it when the editor is no longer in
    // the document, so that it can be garbage-collected.
    function unregister() {
      for (var p = d.wrapper.parentNode; p && p != document.body; p = p.parentNode) {}
      if (p) setTimeout(unregister, 5000);
      else off(window, 'resize', onResize);
    }
    setTimeout(unregister, 5000);

    on(d.input, 'keyup', operation(cm, function (e) {
      if (signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;
      if (e.keyCode == 16) cm.doc.sel.shift = false;
    }));
    on(d.input, 'input', function () {
      if (ie && !ie_lt9 && cm.display.inputHasSelection) cm.display.inputHasSelection = null;
      fastPoll(cm);
    });
    on(d.input, 'keydown', operation(cm, onKeyDown));
    on(d.input, 'keypress', operation(cm, onKeyPress));
    on(d.input, 'focus', bind(onFocus, cm));
    on(d.input, 'blur', bind(onBlur, cm));

    function drag_(e) {
      if (signalDOMEvent(cm, e) || cm.options.onDragEvent && cm.options.onDragEvent(cm, addStop(e))) return;
      e_stop(e);
    }
    if (cm.options.dragDrop) {
      on(d.scroller, 'dragstart', function (e){
        onDragStart(cm, e);
      });
      on(d.scroller, 'dragenter', drag_);
      on(d.scroller, 'dragover', drag_);
      on(d.scroller, 'drop', operation(cm, onDrop));
    }
    on(d.scroller, 'paste', function (e) {
      if (eventInWidget(d, e)) return;
      focusInput(cm);
      fastPoll(cm);
    });
    on(d.input, 'paste', function () {
      // Workaround for webkit bug https://bugs.webkit.org/show_bug.cgi?id=90206
      // Add a char to the end of textarea before paste occur so that
      // selection doesn't span to the end of textarea.
      if (webkit && !cm.state.fakedLastChar && !(new Date - cm.state.lastMiddleDown < 200)) {
        var start = d.input.selectionStart, end = d.input.selectionEnd;
        d.input.value += '$';
        d.input.selectionStart = start;
        d.input.selectionEnd = end;
        cm.state.fakedLastChar = true;
      }
      cm.state.pasteIncoming = true;
      fastPoll(cm);
    });

    function prepareCopy() {
      if (d.inaccurateSelection) {
        d.prevInput = '';
        d.inaccurateSelection = false;
        d.input.value = cm.getSelection();
        selectInput(d.input);
      }
    }
    on(d.input, 'cut', prepareCopy);
    on(d.input, 'copy', prepareCopy);

    // Needed to handle Tab key in KHTML
    if (khtml) on(d.sizer, 'mouseup', function () {
      if (document.activeElement == d.input) d.input.blur();
      focusInput(cm);
    });
  }

  function eventInWidget(display, e) {
    for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
      if (!n || n.ignoreEvents || n.parentNode == display.sizer && n != display.mover) return true;
    }
  }

  function posFromMouse(cm, e, liberal) {
    var display = cm.display;
    if (!liberal) {
      var target = e_target(e);
      if (target == display.scrollbarH || target == display.scrollbarH.firstChild ||
          target == display.scrollbarV || target == display.scrollbarV.firstChild ||
          target == display.scrollbarFiller || target == display.gutterFiller) return null;
    }
    var x, y, space = getRect(display.lineSpace);
    // Fails unpredictably on IE[67] when mouse is dragged around quickly.
    try {
      x = e.clientX; y = e.clientY; 
    } catch (e) {
      return null; 
    }
    return coordsChar(cm, x - space.left, y - space.top);
  }

  var lastClick, lastDoubleClick;
  function onMouseDown(e) {
    if (signalDOMEvent(this, e)) return;
    var cm = this, display = cm.display, doc = cm.doc, sel = doc.sel;
    sel.shift = e.shiftKey;

    if (eventInWidget(display, e)) {
      if (!webkit) {
        display.scroller.draggable = false;
        setTimeout(function (){
          display.scroller.draggable = true;
        }, 100);
      }
      return;
    }
    if (clickInGutter(cm, e)) return;
    var start = posFromMouse(cm, e);

    switch (e_button(e)) {
    case 3:
      if (captureMiddleClick) onContextMenu.call(cm, cm, e);
      return;
    case 2:
      if (webkit) cm.state.lastMiddleDown = +new Date;
      if (start) extendSelection(cm.doc, start);
      setTimeout(bind(focusInput, cm), 20);
      e_preventDefault(e);
      return;
    }
    // For button 1, if it was clicked inside the editor
    // (posFromMouse returning non-null), we have to adjust the
    // selection.
    if (!start) {
      if (e_target(e) == display.scroller) e_preventDefault(e); return;
    }

    if (!cm.state.focused) onFocus(cm);

    var now = +new Date, type = 'single';
    if (lastDoubleClick && lastDoubleClick.time > now - 400 && posEq(lastDoubleClick.pos, start)) {
      type = 'triple';
      e_preventDefault(e);
      setTimeout(bind(focusInput, cm), 20);
      selectLine(cm, start.line);
    } else if (lastClick && lastClick.time > now - 400 && posEq(lastClick.pos, start)) {
      type = 'double';
      lastDoubleClick = {time: now, pos: start};
      e_preventDefault(e);
      var word = findWordAt(getLine(doc, start.line).text, start);
      extendSelection(cm.doc, word.from, word.to);
    } else {
      lastClick = {time: now, pos: start}; 
    }

    var last = start;
    if (cm.options.dragDrop && dragAndDrop && !isReadOnly(cm) && !posEq(sel.from, sel.to) &&
        !posLess(start, sel.from) && !posLess(sel.to, start) && type == 'single') {
      var dragEnd = operation(cm, function (e2) {
        if (webkit) display.scroller.draggable = false;
        cm.state.draggingText = false;
        off(document, 'mouseup', dragEnd);
        off(display.scroller, 'drop', dragEnd);
        if (Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10) {
          e_preventDefault(e2);
          extendSelection(cm.doc, start);
          focusInput(cm);
        }
      });
      // Let the drag handler handle this.
      if (webkit) display.scroller.draggable = true;
      cm.state.draggingText = dragEnd;
      // IE's approach to draggable
      if (display.scroller.dragDrop) display.scroller.dragDrop();
      on(document, 'mouseup', dragEnd);
      on(display.scroller, 'drop', dragEnd);
      return;
    }
    e_preventDefault(e);
    if (type == 'single') extendSelection(cm.doc, clipPos(doc, start));

    var startstart = sel.from, startend = sel.to, lastPos = start;

    function doSelect(cur) {
      if (posEq(lastPos, cur)) return;
      lastPos = cur;

      if (type == 'single') {
        extendSelection(cm.doc, clipPos(doc, start), cur);
        return;
      }

      startstart = clipPos(doc, startstart);
      startend = clipPos(doc, startend);
      if (type == 'double') {
        var word = findWordAt(getLine(doc, cur.line).text, cur);
        if (posLess(cur, startstart)) extendSelection(cm.doc, word.from, startend);
        else extendSelection(cm.doc, startstart, word.to);
      } else if (type == 'triple') {
        if (posLess(cur, startstart)) extendSelection(cm.doc, startend, clipPos(doc, Pos(cur.line, 0)));
        else extendSelection(cm.doc, startstart, clipPos(doc, Pos(cur.line + 1, 0)));
      }
    }

    var editorSize = getRect(display.wrapper);
    // Used to ensure timeout re-tries don't fire when another extend
    // happened in the meantime (clearTimeout isn't reliable -- at
    // least on Chrome, the timeouts still happen even when cleared,
    // if the clear happens after their scheduled firing time).
    var counter = 0;

    function extend(e) {
      var curCount = ++counter;
      var cur = posFromMouse(cm, e, true);
      if (!cur) return;
      if (!posEq(cur, last)) {
        if (!cm.state.focused) onFocus(cm);
        last = cur;
        doSelect(cur);
        var visible = visibleLines(display, doc);
        if (cur.line >= visible.to || cur.line < visible.from)
          setTimeout(operation(cm, function (){
            if (counter == curCount) extend(e);
          }), 150);
      } else {
        var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
        if (outside) setTimeout(operation(cm, function () {
          if (counter != curCount) return;
          display.scroller.scrollTop += outside;
          extend(e);
        }), 50);
      }
    }

    function done(e) {
      counter = Infinity;
      e_preventDefault(e);
      focusInput(cm);
      off(document, 'mousemove', move);
      off(document, 'mouseup', up);
    }

    var move = operation(cm, function (e) {
      if (!ie && !e_button(e)) done(e);
      else extend(e);
    });
    var up = operation(cm, done);
    on(document, 'mousemove', move);
    on(document, 'mouseup', up);
  }

  function gutterEvent(cm, e, type, prevent, signalfn) {
    try {
      var mX = e.clientX, mY = e.clientY; 
    } catch(e) {
      return false; 
    }
    if (mX >= Math.floor(getRect(cm.display.gutters).right)) return false;
    if (prevent) e_preventDefault(e);

    var display = cm.display;
    var lineBox = getRect(display.lineDiv);

    if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
    mY -= lineBox.top - display.viewOffset;

    for (var i = 0; i < cm.options.gutters.length; ++i) {
      var g = display.gutters.childNodes[i];
      if (g && getRect(g).right >= mX) {
        var line = lineAtHeight(cm.doc, mY);
        var gutter = cm.options.gutters[i];
        signalfn(cm, type, cm, line, gutter, e);
        return e_defaultPrevented(e);
      }
    }
  }

  function contextMenuInGutter(cm, e) {
    if (!hasHandler(cm, 'gutterContextMenu')) return false;
    return gutterEvent(cm, e, 'gutterContextMenu', false, signal);
  }

  function clickInGutter(cm, e) {
    return gutterEvent(cm, e, 'gutterClick', true, signalLater);
  }

  // Kludge to work around strange IE behavior where it'll sometimes
  // re-fire a series of drag-related events right after the drop (#1551)
  var lastDrop = 0;

  function onDrop(e) {
    var cm = this;
    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e) || (cm.options.onDragEvent && cm.options.onDragEvent(cm, addStop(e))))
      return;
    e_preventDefault(e);
    if (ie) lastDrop = +new Date;
    var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
    if (!pos || isReadOnly(cm)) return;
    if (files && files.length && window.FileReader && window.File) {
      var n = files.length, text = Array(n), read = 0;
      var loadFile = function (file, i) {
        var reader = new FileReader;
        reader.onload = function () {
          text[i] = reader.result;
          if (++read == n) {
            pos = clipPos(cm.doc, pos);
            makeChange(cm.doc, {from: pos, to: pos, text: splitLines(text.join('\n')), origin: 'paste'}, 'around');
          }
        };
        reader.readAsText(file);
      };
      for (var i = 0; i < n; ++i) loadFile(files[i], i);
    } else {
      // Don't do a replace if the drop happened inside of the selected text.
      if (cm.state.draggingText && !(posLess(pos, cm.doc.sel.from) || posLess(cm.doc.sel.to, pos))) {
        cm.state.draggingText(e);
        // Ensure the editor is re-focused
        setTimeout(bind(focusInput, cm), 20);
        return;
      }
      try {
        var text = e.dataTransfer.getData('Text');
        if (text) {
          var curFrom = cm.doc.sel.from, curTo = cm.doc.sel.to;
          setSelection(cm.doc, pos, pos);
          if (cm.state.draggingText) replaceRange(cm.doc, '', curFrom, curTo, 'paste');
          cm.replaceSelection(text, null, 'paste');
          focusInput(cm);
          onFocus(cm);
        }
      } catch(e){}
    }
  }

  function onDragStart(cm, e) {
    if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) {
      e_stop(e); return; 
    }
    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;

    var txt = cm.getSelection();
    e.dataTransfer.setData('Text', txt);

    // Use dummy image instead of default browsers image.
    // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.
    if (e.dataTransfer.setDragImage && !safari) {
      var img = elt('img', null, null, 'position: fixed; left: 0; top: 0;');
      img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
      if (opera) {
        img.width = img.height = 1;
        cm.display.wrapper.appendChild(img);
        // Force a relayout, or Opera won't use our image for some obscure reason
        img._top = img.offsetTop;
      }
      e.dataTransfer.setDragImage(img, 0, 0);
      if (opera) img.parentNode.removeChild(img);
    }
  }

  function setScrollTop(cm, val) {
    if (Math.abs(cm.doc.scrollTop - val) < 2) return;
    cm.doc.scrollTop = val;
    if (!gecko) updateDisplay(cm, [], val);
    if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;
    if (cm.display.scrollbarV.scrollTop != val) cm.display.scrollbarV.scrollTop = val;
    if (gecko) updateDisplay(cm, []);
    startWorker(cm, 100);
  }
  function setScrollLeft(cm, val, isScroller) {
    if (isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) return;
    val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);
    cm.doc.scrollLeft = val;
    alignHorizontally(cm);
    if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;
    if (cm.display.scrollbarH.scrollLeft != val) cm.display.scrollbarH.scrollLeft = val;
  }

  // Since the delta values reported on mouse wheel events are
  // unstandardized between browsers and even browser versions, and
  // generally horribly unpredictable, this code starts by measuring
  // the scroll effect that the first few mouse wheel events have,
  // and, from that, detects the way it can convert deltas to pixel
  // offsets afterwards.
  //
  // The reason we want to know the amount a wheel event will scroll
  // is that it gives us a chance to update the display before the
  // actual scrolling happens, reducing flickering.

  var wheelSamples = 0, wheelPixelsPerUnit = null;
  // Fill in a browser-detected starting value on browsers where we
  // know one. These don't have to be accurate -- the result of them
  // being wrong would just be a slight flicker on the first wheel
  // scroll (if it is large enough).
  if (ie) wheelPixelsPerUnit = -.53;
  else if (gecko) wheelPixelsPerUnit = 15;
  else if (chrome) wheelPixelsPerUnit = -.7;
  else if (safari) wheelPixelsPerUnit = -1/3;

  function onScrollWheel(cm, e) {
    var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
    if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;
    if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;
    else if (dy == null) dy = e.wheelDelta;

    var display = cm.display, scroll = display.scroller;
    // Quit if there's nothing to scroll here
    if (!(dx && scroll.scrollWidth > scroll.clientWidth ||
          dy && scroll.scrollHeight > scroll.clientHeight)) return;

    // Webkit browsers on OS X abort momentum scrolls when the target
    // of the scroll event is removed from the scrollable element.
    // This hack (see related code in patchDisplay) makes sure the
    // element is kept around.
    if (dy && mac && webkit) {
      for (var cur = e.target; cur != scroll; cur = cur.parentNode) {
        if (cur.lineObj) {
          cm.display.currentWheelTarget = cur;
          break;
        }
      }
    }

    // On some browsers, horizontal scrolling will cause redraws to
    // happen before the gutter has been realigned, causing it to
    // wriggle around in a most unseemly way. When we have an
    // estimated pixels/delta value, we just handle horizontal
    // scrolling entirely here. It'll be slightly off from native, but
    // better than glitching out.
    if (dx && !gecko && !opera && wheelPixelsPerUnit != null) {
      if (dy)
        setScrollTop(cm, Math.max(0, Math.min(scroll.scrollTop + dy * wheelPixelsPerUnit, scroll.scrollHeight - scroll.clientHeight)));
      setScrollLeft(cm, Math.max(0, Math.min(scroll.scrollLeft + dx * wheelPixelsPerUnit, scroll.scrollWidth - scroll.clientWidth)));
      e_preventDefault(e);
      display.wheelStartX = null; // Abort measurement, if in progress
      return;
    }

    if (dy && wheelPixelsPerUnit != null) {
      var pixels = dy * wheelPixelsPerUnit;
      var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
      if (pixels < 0) top = Math.max(0, top + pixels - 50);
      else bot = Math.min(cm.doc.height, bot + pixels + 50);
      updateDisplay(cm, [], {top: top, bottom: bot});
    }

    if (wheelSamples < 20) {
      if (display.wheelStartX == null) {
        display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;
        display.wheelDX = dx; display.wheelDY = dy;
        setTimeout(function () {
          if (display.wheelStartX == null) return;
          var movedX = scroll.scrollLeft - display.wheelStartX;
          var movedY = scroll.scrollTop - display.wheelStartY;
          var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||
            (movedX && display.wheelDX && movedX / display.wheelDX);
          display.wheelStartX = display.wheelStartY = null;
          if (!sample) return;
          wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
          ++wheelSamples;
        }, 200);
      } else {
        display.wheelDX += dx; display.wheelDY += dy;
      }
    }
  }

  function doHandleBinding(cm, bound, dropShift) {
    if (typeof bound == 'string') {
      bound = commands[bound];
      if (!bound) return false;
    }
    // Ensure previous input has been read, so that the handler sees a
    // consistent view of the document
    if (cm.display.pollingFast && readInput(cm)) cm.display.pollingFast = false;
    var doc = cm.doc, prevShift = doc.sel.shift, done = false;
    try {
      if (isReadOnly(cm)) cm.state.suppressEdits = true;
      if (dropShift) doc.sel.shift = false;
      done = bound(cm) != Pass;
    } finally {
      doc.sel.shift = prevShift;
      cm.state.suppressEdits = false;
    }
    return done;
  }

  function allKeyMaps(cm) {
    var maps = cm.state.keyMaps.slice(0);
    if (cm.options.extraKeys) maps.push(cm.options.extraKeys);
    maps.push(cm.options.keyMap);
    return maps;
  }

  var maybeTransition;
  function handleKeyBinding(cm, e) {
    // Handle auto keymap transitions
    var startMap = getKeyMap(cm.options.keyMap), next = startMap.auto;
    clearTimeout(maybeTransition);
    if (next && !isModifierKey(e)) maybeTransition = setTimeout(function () {
      if (getKeyMap(cm.options.keyMap) == startMap) {
        cm.options.keyMap = (next.call ? next.call(null, cm) : next);
        keyMapChanged(cm);
      }
    }, 50);

    var name = keyName(e, true), handled = false;
    if (!name) return false;
    var keymaps = allKeyMaps(cm);

    if (e.shiftKey) {
      // First try to resolve full name (including 'Shift-'). Failing
      // that, see if there is a cursor-motion command (starting with
      // 'go') bound to the keyname without 'Shift-'.
      handled = lookupKey(`Shift-${  name}`, keymaps, function (b) {
        return doHandleBinding(cm, b, true);
      })
             || lookupKey(name, keymaps, function (b) {
               if (typeof b == 'string' ? /^go[A-Z]/.test(b) : b.motion)
                 return doHandleBinding(cm, b);
             });
    } else {
      handled = lookupKey(name, keymaps, function (b) {
        return doHandleBinding(cm, b); 
      });
    }

    if (handled) {
      e_preventDefault(e);
      restartBlink(cm);
      if (ie_lt9) {
        e.oldKeyCode = e.keyCode; e.keyCode = 0; 
      }
      signalLater(cm, 'keyHandled', cm, name, e);
    }
    return handled;
  }

  function handleCharBinding(cm, e, ch) {
    var handled = lookupKey(`'${  ch  }'`, allKeyMaps(cm),
      function (b) {
        return doHandleBinding(cm, b, true); 
      });
    if (handled) {
      e_preventDefault(e);
      restartBlink(cm);
      signalLater(cm, 'keyHandled', cm, `'${  ch  }'`, e);
    }
    return handled;
  }

  var lastStoppedKey = null;
  function onKeyDown(e) {
    var cm = this;
    if (!cm.state.focused) onFocus(cm);
    if (signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;
    if (ie && e.keyCode == 27) e.returnValue = false;
    var code = e.keyCode;
    // IE does strange things with escape.
    cm.doc.sel.shift = code == 16 || e.shiftKey;
    // First give onKeyEvent option a chance to handle this.
    var handled = handleKeyBinding(cm, e);
    if (opera) {
      lastStoppedKey = handled ? code : null;
      // Opera has no cut event... we try to at least catch the key combo
      if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey))
        cm.replaceSelection('');
    }
  }

  function onKeyPress(e) {
    var cm = this;
    if (signalDOMEvent(cm, e) || cm.options.onKeyEvent && cm.options.onKeyEvent(cm, addStop(e))) return;
    var keyCode = e.keyCode, charCode = e.charCode;
    if (opera && keyCode == lastStoppedKey) {
      lastStoppedKey = null; e_preventDefault(e); return;
    }
    if (((opera && (!e.which || e.which < 10)) || khtml) && handleKeyBinding(cm, e)) return;
    var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
    if (this.options.electricChars && this.doc.mode.electricChars &&
        this.options.smartIndent && !isReadOnly(this) &&
        this.doc.mode.electricChars.indexOf(ch) > -1)
      setTimeout(operation(cm, function () {
        indentLine(cm, cm.doc.sel.to.line, 'smart');
      }), 75);
    if (handleCharBinding(cm, e, ch)) return;
    if (ie && !ie_lt9) cm.display.inputHasSelection = null;
    fastPoll(cm);
  }

  function onFocus(cm) {
    if (cm.options.readOnly == 'nocursor') return;
    if (!cm.state.focused) {
      signal(cm, 'focus', cm);
      cm.state.focused = true;
      if (cm.display.wrapper.className.search(/\bCodeMirror-focused\b/) == -1)
        cm.display.wrapper.className += ' CodeMirror-focused';
      if (!cm.curOp) {
        resetInput(cm, true);
        if (webkit) setTimeout(bind(resetInput, cm, true), 0); // Issue #1730
      }
    }
    slowPoll(cm);
    restartBlink(cm);
  }
  function onBlur(cm) {
    if (cm.state.focused) {
      signal(cm, 'blur', cm);
      cm.state.focused = false;
      cm.display.wrapper.className = cm.display.wrapper.className.replace(' CodeMirror-focused', '');
    }
    clearInterval(cm.display.blinker);
    setTimeout(function () {
      if (!cm.state.focused) cm.doc.sel.shift = false;
    }, 150);
  }

  var detectingSelectAll;
  function onContextMenu(cm, e) {
    if (signalDOMEvent(cm, e, 'contextmenu')) return;
    var display = cm.display, sel = cm.doc.sel;
    if (eventInWidget(display, e) || contextMenuInGutter(cm, e)) return;

    var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
    if (!pos || opera) return; // Opera is difficult.
    if (posEq(sel.from, sel.to) || posLess(pos, sel.from) || !posLess(pos, sel.to))
      operation(cm, setSelection)(cm.doc, pos, pos);

    var oldCSS = display.input.style.cssText;
    display.inputDiv.style.position = 'absolute';
    display.input.style.cssText = `position: fixed; width: 30px; height: 30px; top: ${  e.clientY - 5 
    }px; left: ${  e.clientX - 5  }px; z-index: 1000; background: white; outline: none;` +
      'border-width: 0; outline: none; overflow: hidden; opacity: .05; -ms-opacity: .05; filter: alpha(opacity=5);';
    focusInput(cm);
    resetInput(cm, true);
    // Adds "Select all" to context menu in FF
    if (posEq(sel.from, sel.to)) display.input.value = display.prevInput = ' ';

    function prepareSelectAllHack() {
      if (display.input.selectionStart != null) {
        var extval = display.input.value = `\u200b${  posEq(sel.from, sel.to) ? '' : display.input.value}`;
        display.prevInput = '\u200b';
        display.input.selectionStart = 1; display.input.selectionEnd = extval.length;
      }
    }
    function rehide() {
      display.inputDiv.style.position = 'relative';
      display.input.style.cssText = oldCSS;
      if (ie_lt9) display.scrollbarV.scrollTop = display.scroller.scrollTop = scrollPos;
      slowPoll(cm);

      // Try to detect the user choosing select-all
      if (display.input.selectionStart != null) {
        if (!ie || ie_lt9) prepareSelectAllHack();
        clearTimeout(detectingSelectAll);
        var i = 0, poll = function (){
          if (display.prevInput == ' ' && display.input.selectionStart == 0)
            operation(cm, commands.selectAll)(cm);
          else if (i++ < 10) detectingSelectAll = setTimeout(poll, 500);
          else resetInput(cm);
        };
        detectingSelectAll = setTimeout(poll, 200);
      }
    }

    if (ie && !ie_lt9) prepareSelectAllHack();
    if (captureMiddleClick) {
      e_stop(e);
      var mouseup = function () {
        off(window, 'mouseup', mouseup);
        setTimeout(rehide, 20);
      };
      on(window, 'mouseup', mouseup);
    } else {
      setTimeout(rehide, 50);
    }
  }

  // UPDATING

  var changeEnd = CodeMirror.changeEnd = function (change) {
    if (!change.text) return change.to;
    return Pos(change.from.line + change.text.length - 1,
      lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
  };

  // Make sure a position will be valid after the given change.
  function clipPostChange(doc, change, pos) {
    if (!posLess(change.from, pos)) return clipPos(doc, pos);
    var diff = (change.text.length - 1) - (change.to.line - change.from.line);
    if (pos.line > change.to.line + diff) {
      var preLine = pos.line - diff, lastLine = doc.first + doc.size - 1;
      if (preLine > lastLine) return Pos(lastLine, getLine(doc, lastLine).text.length);
      return clipToLen(pos, getLine(doc, preLine).text.length);
    }
    if (pos.line == change.to.line + diff)
      return clipToLen(pos, lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0) +
                       getLine(doc, change.to.line).text.length - change.to.ch);
    var inside = pos.line - change.from.line;
    return clipToLen(pos, change.text[inside].length + (inside ? 0 : change.from.ch));
  }

  // Hint can be null|"end"|"start"|"around"|{anchor,head}
  function computeSelAfterChange(doc, change, hint) {
    if (hint && typeof hint == 'object') // Assumed to be {anchor, head} object
      return {anchor: clipPostChange(doc, change, hint.anchor),
        head: clipPostChange(doc, change, hint.head)};

    if (hint == 'start') return {anchor: change.from, head: change.from};

    var end = changeEnd(change);
    if (hint == 'around') return {anchor: change.from, head: end};
    if (hint == 'end') return {anchor: end, head: end};

    // hint is null, leave the selection alone as much as possible
    var adjustPos = function (pos) {
      if (posLess(pos, change.from)) return pos;
      if (!posLess(change.to, pos)) return end;

      var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
      if (pos.line == change.to.line) ch += end.ch - change.to.ch;
      return Pos(line, ch);
    };
    return {anchor: adjustPos(doc.sel.anchor), head: adjustPos(doc.sel.head)};
  }

  function filterChange(doc, change, update) {
    var obj = {
      canceled: false,
      from: change.from,
      to: change.to,
      text: change.text,
      origin: change.origin,
      cancel: function () {
        this.canceled = true; 
      }
    };
    if (update) obj.update = function (from, to, text, origin) {
      if (from) this.from = clipPos(doc, from);
      if (to) this.to = clipPos(doc, to);
      if (text) this.text = text;
      if (origin !== undefined) this.origin = origin;
    };
    signal(doc, 'beforeChange', doc, obj);
    if (doc.cm) signal(doc.cm, 'beforeChange', doc.cm, obj);

    if (obj.canceled) return null;
    return {from: obj.from, to: obj.to, text: obj.text, origin: obj.origin};
  }

  // Replace the range from from to to by the strings in replacement.
  // change is a {from, to, text [, origin]} object
  function makeChange(doc, change, selUpdate, ignoreReadOnly) {
    if (doc.cm) {
      if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, selUpdate, ignoreReadOnly);
      if (doc.cm.state.suppressEdits) return;
    }

    if (hasHandler(doc, 'beforeChange') || doc.cm && hasHandler(doc.cm, 'beforeChange')) {
      change = filterChange(doc, change, true);
      if (!change) return;
    }

    // Possibly split or suppress the update based on the presence
    // of read-only spans in its range.
    var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
    if (split) {
      for (var i = split.length - 1; i >= 1; --i)
        makeChangeNoReadonly(doc, {from: split[i].from, to: split[i].to, text: ['']});
      if (split.length)
        makeChangeNoReadonly(doc, {from: split[0].from, to: split[0].to, text: change.text}, selUpdate);
    } else {
      makeChangeNoReadonly(doc, change, selUpdate);
    }
  }

  function makeChangeNoReadonly(doc, change, selUpdate) {
    if (change.text.length == 1 && change.text[0] == '' && posEq(change.from, change.to)) return;
    var selAfter = computeSelAfterChange(doc, change, selUpdate);
    addToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);

    makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
    var rebased = [];

    linkedDocs(doc, function (doc, sharedHist) {
      if (!sharedHist && indexOf(rebased, doc.history) == -1) {
        rebaseHist(doc.history, change);
        rebased.push(doc.history);
      }
      makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
    });
  }

  function makeChangeFromHistory(doc, type) {
    if (doc.cm && doc.cm.state.suppressEdits) return;

    var hist = doc.history;
    var event = (type == 'undo' ? hist.done : hist.undone).pop();
    if (!event) return;

    var anti = {changes: [], anchorBefore: event.anchorAfter, headBefore: event.headAfter,
      anchorAfter: event.anchorBefore, headAfter: event.headBefore,
      generation: hist.generation};
    (type == 'undo' ? hist.undone : hist.done).push(anti);
    hist.generation = event.generation || ++hist.maxGeneration;

    var filter = hasHandler(doc, 'beforeChange') || doc.cm && hasHandler(doc.cm, 'beforeChange');

    for (var i = event.changes.length - 1; i >= 0; --i) {
      var change = event.changes[i];
      change.origin = type;
      if (filter && !filterChange(doc, change, false)) {
        (type == 'undo' ? hist.done : hist.undone).length = 0;
        return;
      }

      anti.changes.push(historyChangeFromChange(doc, change));

      var after = i ? computeSelAfterChange(doc, change, null)
        : {anchor: event.anchorBefore, head: event.headBefore};
      makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
      var rebased = [];

      linkedDocs(doc, function (doc, sharedHist) {
        if (!sharedHist && indexOf(rebased, doc.history) == -1) {
          rebaseHist(doc.history, change);
          rebased.push(doc.history);
        }
        makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
      });
    }
  }

  function shiftDoc(doc, distance) {
    function shiftPos(pos) {
      return Pos(pos.line + distance, pos.ch);
    }
    doc.first += distance;
    if (doc.cm) regChange(doc.cm, doc.first, doc.first, distance);
    doc.sel.head = shiftPos(doc.sel.head); doc.sel.anchor = shiftPos(doc.sel.anchor);
    doc.sel.from = shiftPos(doc.sel.from); doc.sel.to = shiftPos(doc.sel.to);
  }

  function makeChangeSingleDoc(doc, change, selAfter, spans) {
    if (doc.cm && !doc.cm.curOp)
      return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);

    if (change.to.line < doc.first) {
      shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
      return;
    }
    if (change.from.line > doc.lastLine()) return;

    // Clip the change to the size of this doc
    if (change.from.line < doc.first) {
      var shift = change.text.length - 1 - (doc.first - change.from.line);
      shiftDoc(doc, shift);
      change = {from: Pos(doc.first, 0), to: Pos(change.to.line + shift, change.to.ch),
        text: [lst(change.text)], origin: change.origin};
    }
    var last = doc.lastLine();
    if (change.to.line > last) {
      change = {from: change.from, to: Pos(last, getLine(doc, last).text.length),
        text: [change.text[0]], origin: change.origin};
    }

    change.removed = getBetween(doc, change.from, change.to);

    if (!selAfter) selAfter = computeSelAfterChange(doc, change, null);
    if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans, selAfter);
    else updateDoc(doc, change, spans, selAfter);
  }

  function makeChangeSingleDocInEditor(cm, change, spans, selAfter) {
    var doc = cm.doc, display = cm.display, from = change.from, to = change.to;

    var recomputeMaxLength = false, checkWidthStart = from.line;
    if (!cm.options.lineWrapping) {
      checkWidthStart = lineNo(visualLine(doc, getLine(doc, from.line)));
      doc.iter(checkWidthStart, to.line + 1, function (line) {
        if (line == display.maxLine) {
          recomputeMaxLength = true;
          return true;
        }
      });
    }

    if (!posLess(doc.sel.head, change.from) && !posLess(change.to, doc.sel.head))
      cm.curOp.cursorActivity = true;

    updateDoc(doc, change, spans, selAfter, estimateHeight(cm));

    if (!cm.options.lineWrapping) {
      doc.iter(checkWidthStart, from.line + change.text.length, function (line) {
        var len = lineLength(doc, line);
        if (len > display.maxLineLength) {
          display.maxLine = line;
          display.maxLineLength = len;
          display.maxLineChanged = true;
          recomputeMaxLength = false;
        }
      });
      if (recomputeMaxLength) cm.curOp.updateMaxLine = true;
    }

    // Adjust frontier, schedule worker
    doc.frontier = Math.min(doc.frontier, from.line);
    startWorker(cm, 400);

    var lendiff = change.text.length - (to.line - from.line) - 1;
    // Remember that these lines changed, for updating the display
    regChange(cm, from.line, to.line + 1, lendiff);

    if (hasHandler(cm, 'change')) {
      var changeObj = {from: from, to: to,
        text: change.text,
        removed: change.removed,
        origin: change.origin};
      if (cm.curOp.textChanged) {
        for (var cur = cm.curOp.textChanged; cur.next; cur = cur.next) {}
        cur.next = changeObj;
      } else cm.curOp.textChanged = changeObj;
    }
  }

  function replaceRange(doc, code, from, to, origin) {
    if (!to) to = from;
    if (posLess(to, from)) {
      var tmp = to; to = from; from = tmp; 
    }
    if (typeof code == 'string') code = splitLines(code);
    makeChange(doc, {from: from, to: to, text: code, origin: origin}, null);
  }

  // POSITION OBJECT

  function Pos(line, ch) {
    if (!(this instanceof Pos)) return new Pos(line, ch);
    this.line = line; this.ch = ch;
  }
  CodeMirror.Pos = Pos;

  function posEq(a, b) {
    return a.line == b.line && a.ch == b.ch;
  }
  function posLess(a, b) {
    return a.line < b.line || (a.line == b.line && a.ch < b.ch);
  }
  function copyPos(x) {
    return Pos(x.line, x.ch);
  }

  // SELECTION

  function clipLine(doc, n) {
    return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));
  }
  function clipPos(doc, pos) {
    if (pos.line < doc.first) return Pos(doc.first, 0);
    var last = doc.first + doc.size - 1;
    if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
    return clipToLen(pos, getLine(doc, pos.line).text.length);
  }
  function clipToLen(pos, linelen) {
    var ch = pos.ch;
    if (ch == null || ch > linelen) return Pos(pos.line, linelen);
    else if (ch < 0) return Pos(pos.line, 0);
    else return pos;
  }
  function isLine(doc, l) {
    return l >= doc.first && l < doc.first + doc.size;
  }

  // If shift is held, this will move the selection anchor. Otherwise,
  // it'll set the whole selection.
  function extendSelection(doc, pos, other, bias) {
    if (doc.sel.shift || doc.sel.extend) {
      var anchor = doc.sel.anchor;
      if (other) {
        var posBefore = posLess(pos, anchor);
        if (posBefore != posLess(other, anchor)) {
          anchor = pos;
          pos = other;
        } else if (posBefore != posLess(pos, other)) {
          pos = other;
        }
      }
      setSelection(doc, anchor, pos, bias);
    } else {
      setSelection(doc, pos, other || pos, bias);
    }
    if (doc.cm) doc.cm.curOp.userSelChange = true;
  }

  function filterSelectionChange(doc, anchor, head) {
    var obj = {anchor: anchor, head: head};
    signal(doc, 'beforeSelectionChange', doc, obj);
    if (doc.cm) signal(doc.cm, 'beforeSelectionChange', doc.cm, obj);
    obj.anchor = clipPos(doc, obj.anchor); obj.head = clipPos(doc, obj.head);
    return obj;
  }

  // Update the selection. Last two args are only used by
  // updateDoc, since they have to be expressed in the line
  // numbers before the update.
  function setSelection(doc, anchor, head, bias, checkAtomic) {
    if (!checkAtomic && hasHandler(doc, 'beforeSelectionChange') || doc.cm && hasHandler(doc.cm, 'beforeSelectionChange')) {
      var filtered = filterSelectionChange(doc, anchor, head);
      head = filtered.head;
      anchor = filtered.anchor;
    }

    var sel = doc.sel;
    sel.goalColumn = null;
    if (bias == null) bias = posLess(head, sel.head) ? -1 : 1;
    // Skip over atomic spans.
    if (checkAtomic || !posEq(anchor, sel.anchor))
      anchor = skipAtomic(doc, anchor, bias, checkAtomic != 'push');
    if (checkAtomic || !posEq(head, sel.head))
      head = skipAtomic(doc, head, bias, checkAtomic != 'push');

    if (posEq(sel.anchor, anchor) && posEq(sel.head, head)) return;

    sel.anchor = anchor; sel.head = head;
    var inv = posLess(head, anchor);
    sel.from = inv ? head : anchor;
    sel.to = inv ? anchor : head;

    if (doc.cm)
      doc.cm.curOp.updateInput = doc.cm.curOp.selectionChanged =
        doc.cm.curOp.cursorActivity = true;

    signalLater(doc, 'cursorActivity', doc);
  }

  function reCheckSelection(cm) {
    setSelection(cm.doc, cm.doc.sel.from, cm.doc.sel.to, null, 'push');
  }

  function skipAtomic(doc, pos, bias, mayClear) {
    var flipped = false, curPos = pos;
    var dir = bias || 1;
    doc.cantEdit = false;
    search: for (;;) {
      var line = getLine(doc, curPos.line);
      if (line.markedSpans) {
        for (var i = 0; i < line.markedSpans.length; ++i) {
          var sp = line.markedSpans[i], m = sp.marker;
          if ((sp.from == null || (m.inclusiveLeft ? sp.from <= curPos.ch : sp.from < curPos.ch)) &&
              (sp.to == null || (m.inclusiveRight ? sp.to >= curPos.ch : sp.to > curPos.ch))) {
            if (mayClear) {
              signal(m, 'beforeCursorEnter');
              if (m.explicitlyCleared) {
                if (!line.markedSpans) break;
                else {
                  --i; continue;
                }
              }
            }
            if (!m.atomic) continue;
            var newPos = m.find()[dir < 0 ? 'from' : 'to'];
            if (posEq(newPos, curPos)) {
              newPos.ch += dir;
              if (newPos.ch < 0) {
                if (newPos.line > doc.first) newPos = clipPos(doc, Pos(newPos.line - 1));
                else newPos = null;
              } else if (newPos.ch > line.text.length) {
                if (newPos.line < doc.first + doc.size - 1) newPos = Pos(newPos.line + 1, 0);
                else newPos = null;
              }
              if (!newPos) {
                if (flipped) {
                  // Driven in a corner -- no valid cursor position found at all
                  // -- try again *with* clearing, if we didn't already
                  if (!mayClear) return skipAtomic(doc, pos, bias, true);
                  // Otherwise, turn off editing until further notice, and return the start of the doc
                  doc.cantEdit = true;
                  return Pos(doc.first, 0);
                }
                flipped = true; newPos = pos; dir = -dir;
              }
            }
            curPos = newPos;
            continue search;
          }
        }
      }
      return curPos;
    }
  }

  // SCROLLING

  function scrollCursorIntoView(cm) {
    var coords = scrollPosIntoView(cm, cm.doc.sel.head, cm.options.cursorScrollMargin);
    if (!cm.state.focused) return;
    var display = cm.display, box = getRect(display.sizer), doScroll = null;
    if (coords.top + box.top < 0) doScroll = true;
    else if (coords.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) doScroll = false;
    if (doScroll != null && !phantom) {
      var hidden = display.cursor.style.display == 'none';
      if (hidden) {
        display.cursor.style.display = '';
        display.cursor.style.left = `${coords.left  }px`;
        display.cursor.style.top = `${coords.top - display.viewOffset  }px`;
      }
      display.cursor.scrollIntoView(doScroll);
      if (hidden) display.cursor.style.display = 'none';
    }
  }

  function scrollPosIntoView(cm, pos, margin) {
    if (margin == null) margin = 0;
    for (;;) {
      var changed = false, coords = cursorCoords(cm, pos);
      var scrollPos = calculateScrollPos(cm, coords.left, coords.top - margin, coords.left, coords.bottom + margin);
      var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
      if (scrollPos.scrollTop != null) {
        setScrollTop(cm, scrollPos.scrollTop);
        if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;
      }
      if (scrollPos.scrollLeft != null) {
        setScrollLeft(cm, scrollPos.scrollLeft);
        if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;
      }
      if (!changed) return coords;
    }
  }

  function scrollIntoView(cm, x1, y1, x2, y2) {
    var scrollPos = calculateScrollPos(cm, x1, y1, x2, y2);
    if (scrollPos.scrollTop != null) setScrollTop(cm, scrollPos.scrollTop);
    if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);
  }

  function calculateScrollPos(cm, x1, y1, x2, y2) {
    var display = cm.display, snapMargin = textHeight(cm.display);
    if (y1 < 0) y1 = 0;
    var screen = display.scroller.clientHeight - scrollerCutOff, screentop = display.scroller.scrollTop, result = {};
    var docBottom = cm.doc.height + paddingVert(display);
    var atTop = y1 < snapMargin, atBottom = y2 > docBottom - snapMargin;
    if (y1 < screentop) {
      result.scrollTop = atTop ? 0 : y1;
    } else if (y2 > screentop + screen) {
      var newTop = Math.min(y1, (atBottom ? docBottom : y2) - screen);
      if (newTop != screentop) result.scrollTop = newTop;
    }

    var screenw = display.scroller.clientWidth - scrollerCutOff, screenleft = display.scroller.scrollLeft;
    x1 += display.gutters.offsetWidth; x2 += display.gutters.offsetWidth;
    var gutterw = display.gutters.offsetWidth;
    var atLeft = x1 < gutterw + 10;
    if (x1 < screenleft + gutterw || atLeft) {
      if (atLeft) x1 = 0;
      result.scrollLeft = Math.max(0, x1 - 10 - gutterw);
    } else if (x2 > screenw + screenleft - 3) {
      result.scrollLeft = x2 + 10 - screenw;
    }
    return result;
  }

  function updateScrollPos(cm, left, top) {
    cm.curOp.updateScrollPos = {scrollLeft: left == null ? cm.doc.scrollLeft : left,
      scrollTop: top == null ? cm.doc.scrollTop : top};
  }

  function addToScrollPos(cm, left, top) {
    var pos = cm.curOp.updateScrollPos || (cm.curOp.updateScrollPos = {scrollLeft: cm.doc.scrollLeft, scrollTop: cm.doc.scrollTop});
    var scroll = cm.display.scroller;
    pos.scrollTop = Math.max(0, Math.min(scroll.scrollHeight - scroll.clientHeight, pos.scrollTop + top));
    pos.scrollLeft = Math.max(0, Math.min(scroll.scrollWidth - scroll.clientWidth, pos.scrollLeft + left));
  }

  // API UTILITIES

  function indentLine(cm, n, how, aggressive) {
    var doc = cm.doc;
    if (how == null) how = 'add';
    if (how == 'smart') {
      if (!cm.doc.mode.indent) how = 'prev';
      else var state = getStateBefore(cm, n);
    }

    var tabSize = cm.options.tabSize;
    var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
    var curSpaceString = line.text.match(/^\s*/)[0], indentation;
    if (how == 'smart') {
      indentation = cm.doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
      if (indentation == Pass) {
        if (!aggressive) return;
        how = 'prev';
      }
    }
    if (how == 'prev') {
      if (n > doc.first) indentation = countColumn(getLine(doc, n-1).text, null, tabSize);
      else indentation = 0;
    } else if (how == 'add') {
      indentation = curSpace + cm.options.indentUnit;
    } else if (how == 'subtract') {
      indentation = curSpace - cm.options.indentUnit;
    } else if (typeof how == 'number') {
      indentation = curSpace + how;
    }
    indentation = Math.max(0, indentation);

    var indentString = '', pos = 0;
    if (cm.options.indentWithTabs)
      for (var i = Math.floor(indentation / tabSize); i; --i) {
        pos += tabSize; indentString += '\t';
      }
    if (pos < indentation) indentString += spaceStr(indentation - pos);

    if (indentString != curSpaceString)
      replaceRange(cm.doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), '+input');
    line.stateAfter = null;
  }

  function changeLine(cm, handle, op) {
    var no = handle, line = handle, doc = cm.doc;
    if (typeof handle == 'number') line = getLine(doc, clipLine(doc, handle));
    else no = lineNo(handle);
    if (no == null) return null;
    if (op(line, no)) regChange(cm, no, no + 1);
    else return null;
    return line;
  }

  function findPosH(doc, pos, dir, unit, visually) {
    var line = pos.line, ch = pos.ch, origDir = dir;
    var lineObj = getLine(doc, line);
    var possible = true;
    function findNextLine() {
      var l = line + dir;
      if (l < doc.first || l >= doc.first + doc.size) return (possible = false);
      line = l;
      return lineObj = getLine(doc, l);
    }
    function moveOnce(boundToLine) {
      var next = (visually ? moveVisually : moveLogically)(lineObj, ch, dir, true);
      if (next == null) {
        if (!boundToLine && findNextLine()) {
          if (visually) ch = (dir < 0 ? lineRight : lineLeft)(lineObj);
          else ch = dir < 0 ? lineObj.text.length : 0;
        } else return (possible = false);
      } else ch = next;
      return true;
    }

    if (unit == 'char') moveOnce();
    else if (unit == 'column') moveOnce(true);
    else if (unit == 'word' || unit == 'group') {
      var sawType = null, group = unit == 'group';
      for (var first = true;; first = false) {
        if (dir < 0 && !moveOnce(!first)) break;
        var cur = lineObj.text.charAt(ch) || '\n';
        var type = isWordChar(cur) ? 'w'
          : !group ? null
            : /\s/.test(cur) ? null
              : 'p';
        if (sawType && sawType != type) {
          if (dir < 0) {
            dir = 1; moveOnce();
          }
          break;
        }
        if (type) sawType = type;
        if (dir > 0 && !moveOnce(!first)) break;
      }
    }
    var result = skipAtomic(doc, Pos(line, ch), origDir, true);
    if (!possible) result.hitSide = true;
    return result;
  }

  function findPosV(cm, pos, dir, unit) {
    var doc = cm.doc, x = pos.left, y;
    if (unit == 'page') {
      var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
      y = pos.top + dir * (pageSize - (dir < 0 ? 1.5 : .5) * textHeight(cm.display));
    } else if (unit == 'line') {
      y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
    }
    for (;;) {
      var target = coordsChar(cm, x, y);
      if (!target.outside) break;
      if (dir < 0 ? y <= 0 : y >= doc.height) {
        target.hitSide = true; break; 
      }
      y += dir * 5;
    }
    return target;
  }

  function findWordAt(line, pos) {
    var start = pos.ch, end = pos.ch;
    if (line) {
      if ((pos.xRel < 0 || end == line.length) && start) --start; else ++end;
      var startChar = line.charAt(start);
      var check = isWordChar(startChar) ? isWordChar
        : /\s/.test(startChar) ? function (ch) {
          return /\s/.test(ch);
        }
          : function (ch) {
            return !/\s/.test(ch) && !isWordChar(ch);
          };
      while (start > 0 && check(line.charAt(start - 1))) --start;
      while (end < line.length && check(line.charAt(end))) ++end;
    }
    return {from: Pos(pos.line, start), to: Pos(pos.line, end)};
  }

  function selectLine(cm, line) {
    extendSelection(cm.doc, Pos(line, 0), clipPos(cm.doc, Pos(line + 1, 0)));
  }

  // PROTOTYPE

  // The publicly visible API. Note that operation(null, f) means
  // 'wrap f in an operation, performed on its `this` parameter'

  CodeMirror.prototype = {
    constructor: CodeMirror,
    focus: function (){
      window.focus(); focusInput(this); onFocus(this); fastPoll(this);
    },

    setOption: function (option, value) {
      var options = this.options, old = options[option];
      if (options[option] == value && option != 'mode') return;
      options[option] = value;
      if (optionHandlers.hasOwnProperty(option))
        operation(this, optionHandlers[option])(this, value, old);
    },

    getOption: function (option) {
      return this.options[option];
    },
    getDoc: function () {
      return this.doc;
    },

    addKeyMap: function (map, bottom) {
      this.state.keyMaps[bottom ? 'push' : 'unshift'](map);
    },
    removeKeyMap: function (map) {
      var maps = this.state.keyMaps;
      for (var i = 0; i < maps.length; ++i)
        if (maps[i] == map || (typeof maps[i] != 'string' && maps[i].name == map)) {
          maps.splice(i, 1);
          return true;
        }
    },

    addOverlay: operation(null, function (spec, options) {
      var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
      if (mode.startState) throw new Error('Overlays may not be stateful.');
      this.state.overlays.push({mode: mode, modeSpec: spec, opaque: options && options.opaque});
      this.state.modeGen++;
      regChange(this);
    }),
    removeOverlay: operation(null, function (spec) {
      var overlays = this.state.overlays;
      for (var i = 0; i < overlays.length; ++i) {
        var cur = overlays[i].modeSpec;
        if (cur == spec || typeof spec == 'string' && cur.name == spec) {
          overlays.splice(i, 1);
          this.state.modeGen++;
          regChange(this);
          return;
        }
      }
    }),

    indentLine: operation(null, function (n, dir, aggressive) {
      if (typeof dir != 'string' && typeof dir != 'number') {
        if (dir == null) dir = this.options.smartIndent ? 'smart' : 'prev';
        else dir = dir ? 'add' : 'subtract';
      }
      if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);
    }),
    indentSelection: operation(null, function (how) {
      var sel = this.doc.sel;
      if (posEq(sel.from, sel.to)) return indentLine(this, sel.from.line, how);
      var e = sel.to.line - (sel.to.ch ? 0 : 1);
      for (var i = sel.from.line; i <= e; ++i) indentLine(this, i, how);
    }),

    // Fetch the parser token for a given character. Useful for hacks
    // that want to inspect the mode state (say, for completion).
    getTokenAt: function (pos, precise) {
      var doc = this.doc;
      pos = clipPos(doc, pos);
      var state = getStateBefore(this, pos.line, precise), mode = this.doc.mode;
      var line = getLine(doc, pos.line);
      var stream = new StringStream(line.text, this.options.tabSize);
      while (stream.pos < pos.ch && !stream.eol()) {
        stream.start = stream.pos;
        var style = mode.token(stream, state);
      }
      return {start: stream.start,
        end: stream.pos,
        string: stream.current(),
        className: style || null, // Deprecated, use 'type' instead
        type: style || null,
        state: state};
    },

    getTokenTypeAt: function (pos) {
      pos = clipPos(this.doc, pos);
      var styles = getLineStyles(this, getLine(this.doc, pos.line));
      var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
      if (ch == 0) return styles[2];
      for (;;) {
        var mid = (before + after) >> 1;
        if ((mid ? styles[mid * 2 - 1] : 0) >= ch) after = mid;
        else if (styles[mid * 2 + 1] < ch) before = mid + 1;
        else return styles[mid * 2 + 2];
      }
    },

    getModeAt: function (pos) {
      var mode = this.doc.mode;
      if (!mode.innerMode) return mode;
      return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
    },

    getHelper: function (pos, type) {
      if (!helpers.hasOwnProperty(type)) return;
      var help = helpers[type], mode = this.getModeAt(pos);
      return mode[type] && help[mode[type]] ||
        mode.helperType && help[mode.helperType] ||
        help[mode.name];
    },

    getStateAfter: function (line, precise) {
      var doc = this.doc;
      line = clipLine(doc, line == null ? doc.first + doc.size - 1: line);
      return getStateBefore(this, line + 1, precise);
    },

    cursorCoords: function (start, mode) {
      var pos, sel = this.doc.sel;
      if (start == null) pos = sel.head;
      else if (typeof start == 'object') pos = clipPos(this.doc, start);
      else pos = start ? sel.from : sel.to;
      return cursorCoords(this, pos, mode || 'page');
    },

    charCoords: function (pos, mode) {
      return charCoords(this, clipPos(this.doc, pos), mode || 'page');
    },

    coordsChar: function (coords, mode) {
      coords = fromCoordSystem(this, coords, mode || 'page');
      return coordsChar(this, coords.left, coords.top);
    },

    lineAtHeight: function (height, mode) {
      height = fromCoordSystem(this, {top: height, left: 0}, mode || 'page').top;
      return lineAtHeight(this.doc, height + this.display.viewOffset);
    },
    heightAtLine: function (line, mode) {
      var end = false, last = this.doc.first + this.doc.size - 1;
      if (line < this.doc.first) line = this.doc.first;
      else if (line > last) {
        line = last; end = true; 
      }
      var lineObj = getLine(this.doc, line);
      return intoCoordSystem(this, getLine(this.doc, line), {top: 0, left: 0}, mode || 'page').top +
        (end ? lineObj.height : 0);
    },

    defaultTextHeight: function () {
      return textHeight(this.display); 
    },
    defaultCharWidth: function () {
      return charWidth(this.display); 
    },

    setGutterMarker: operation(null, function (line, gutterID, value) {
      return changeLine(this, line, function (line) {
        var markers = line.gutterMarkers || (line.gutterMarkers = {});
        markers[gutterID] = value;
        if (!value && isEmpty(markers)) line.gutterMarkers = null;
        return true;
      });
    }),

    clearGutter: operation(null, function (gutterID) {
      var cm = this, doc = cm.doc, i = doc.first;
      doc.iter(function (line) {
        if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
          line.gutterMarkers[gutterID] = null;
          regChange(cm, i, i + 1);
          if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;
        }
        ++i;
      });
    }),

    addLineClass: operation(null, function (handle, where, cls) {
      return changeLine(this, handle, function (line) {
        var prop = where == 'text' ? 'textClass' : where == 'background' ? 'bgClass' : 'wrapClass';
        if (!line[prop]) line[prop] = cls;
        else if (new RegExp(`(?:^|\\s)${  cls  }(?:$|\\s)`).test(line[prop])) return false;
        else line[prop] += ` ${  cls}`;
        return true;
      });
    }),

    removeLineClass: operation(null, function (handle, where, cls) {
      return changeLine(this, handle, function (line) {
        var prop = where == 'text' ? 'textClass' : where == 'background' ? 'bgClass' : 'wrapClass';
        var cur = line[prop];
        if (!cur) return false;
        else if (cls == null) line[prop] = null;
        else {
          var found = cur.match(new RegExp(`(?:^|\\s+)${  cls  }(?:$|\\s+)`));
          if (!found) return false;
          var end = found.index + found[0].length;
          line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? '' : ' ') + cur.slice(end) || null;
        }
        return true;
      });
    }),

    addLineWidget: operation(null, function (handle, node, options) {
      return addLineWidget(this, handle, node, options);
    }),

    removeLineWidget: function (widget) {
      widget.clear(); 
    },

    lineInfo: function (line) {
      if (typeof line == 'number') {
        if (!isLine(this.doc, line)) return null;
        var n = line;
        line = getLine(this.doc, line);
        if (!line) return null;
      } else {
        var n = lineNo(line);
        if (n == null) return null;
      }
      return {line: n, handle: line, text: line.text, gutterMarkers: line.gutterMarkers,
        textClass: line.textClass, bgClass: line.bgClass, wrapClass: line.wrapClass,
        widgets: line.widgets};
    },

    getViewport: function () {
      return {from: this.display.showingFrom, to: this.display.showingTo};
    },

    addWidget: function (pos, node, scroll, vert, horiz) {
      var display = this.display;
      pos = cursorCoords(this, clipPos(this.doc, pos));
      var top = pos.bottom, left = pos.left;
      node.style.position = 'absolute';
      display.sizer.appendChild(node);
      if (vert == 'over') {
        top = pos.top;
      } else if (vert == 'above' || vert == 'near') {
        var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
          hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
        // Default to positioning above (if specified and possible); otherwise default to positioning below
        if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
          top = pos.top - node.offsetHeight;
        else if (pos.bottom + node.offsetHeight <= vspace)
          top = pos.bottom;
        if (left + node.offsetWidth > hspace)
          left = hspace - node.offsetWidth;
      }
      node.style.top = `${top  }px`;
      node.style.left = node.style.right = '';
      if (horiz == 'right') {
        left = display.sizer.clientWidth - node.offsetWidth;
        node.style.right = '0px';
      } else {
        if (horiz == 'left') left = 0;
        else if (horiz == 'middle') left = (display.sizer.clientWidth - node.offsetWidth) / 2;
        node.style.left = `${left  }px`;
      }
      if (scroll)
        scrollIntoView(this, left, top, left + node.offsetWidth, top + node.offsetHeight);
    },

    triggerOnKeyDown: operation(null, onKeyDown),

    execCommand: function (cmd) {
      return commands[cmd](this);
    },

    findPosH: function (from, amount, unit, visually) {
      var dir = 1;
      if (amount < 0) {
        dir = -1; amount = -amount; 
      }
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
        cur = findPosH(this.doc, cur, dir, unit, visually);
        if (cur.hitSide) break;
      }
      return cur;
    },

    moveH: operation(null, function (dir, unit) {
      var sel = this.doc.sel, pos;
      if (sel.shift || sel.extend || posEq(sel.from, sel.to))
        pos = findPosH(this.doc, sel.head, dir, unit, this.options.rtlMoveVisually);
      else
        pos = dir < 0 ? sel.from : sel.to;
      extendSelection(this.doc, pos, pos, dir);
    }),

    deleteH: operation(null, function (dir, unit) {
      var sel = this.doc.sel;
      if (!posEq(sel.from, sel.to)) replaceRange(this.doc, '', sel.from, sel.to, '+delete');
      else replaceRange(this.doc, '', sel.from, findPosH(this.doc, sel.head, dir, unit, false), '+delete');
      this.curOp.userSelChange = true;
    }),

    findPosV: function (from, amount, unit, goalColumn) {
      var dir = 1, x = goalColumn;
      if (amount < 0) {
        dir = -1; amount = -amount; 
      }
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
        var coords = cursorCoords(this, cur, 'div');
        if (x == null) x = coords.left;
        else coords.left = x;
        cur = findPosV(this, coords, dir, unit);
        if (cur.hitSide) break;
      }
      return cur;
    },

    moveV: operation(null, function (dir, unit) {
      var sel = this.doc.sel;
      var pos = cursorCoords(this, sel.head, 'div');
      if (sel.goalColumn != null) pos.left = sel.goalColumn;
      var target = findPosV(this, pos, dir, unit);

      if (unit == 'page') addToScrollPos(this, 0, charCoords(this, target, 'div').top - pos.top);
      extendSelection(this.doc, target, target, dir);
      sel.goalColumn = pos.left;
    }),

    toggleOverwrite: function (value) {
      if (value != null && value == this.state.overwrite) return;
      if (this.state.overwrite = !this.state.overwrite)
        this.display.cursor.className += ' CodeMirror-overwrite';
      else
        this.display.cursor.className = this.display.cursor.className.replace(' CodeMirror-overwrite', '');
    },
    hasFocus: function () {
      return this.state.focused; 
    },

    scrollTo: operation(null, function (x, y) {
      updateScrollPos(this, x, y);
    }),
    getScrollInfo: function () {
      var scroller = this.display.scroller, co = scrollerCutOff;
      return {left: scroller.scrollLeft, top: scroller.scrollTop,
        height: scroller.scrollHeight - co, width: scroller.scrollWidth - co,
        clientHeight: scroller.clientHeight - co, clientWidth: scroller.clientWidth - co};
    },

    scrollIntoView: operation(null, function (pos, margin) {
      if (typeof pos == 'number') pos = Pos(pos, 0);
      if (!margin) margin = 0;
      var coords = pos;

      if (!pos || pos.line != null) {
        this.curOp.scrollToPos = pos ? clipPos(this.doc, pos) : this.doc.sel.head;
        this.curOp.scrollToPosMargin = margin;
        coords = cursorCoords(this, this.curOp.scrollToPos);
      }
      var sPos = calculateScrollPos(this, coords.left, coords.top - margin, coords.right, coords.bottom + margin);
      updateScrollPos(this, sPos.scrollLeft, sPos.scrollTop);
    }),

    setSize: operation(null, function (width, height) {
      function interpret(val) {
        return typeof val == 'number' || /^\d+$/.test(String(val)) ? `${val  }px` : val;
      }
      if (width != null) this.display.wrapper.style.width = interpret(width);
      if (height != null) this.display.wrapper.style.height = interpret(height);
      if (this.options.lineWrapping)
        this.display.measureLineCache.length = this.display.measureLineCachePos = 0;
      this.curOp.forceUpdate = true;
    }),

    operation: function (f){
      return runInOp(this, f);
    },

    refresh: operation(null, function () {
      var badHeight = this.display.cachedTextHeight == null;
      clearCaches(this);
      updateScrollPos(this, this.doc.scrollLeft, this.doc.scrollTop);
      regChange(this);
      if (badHeight) estimateLineHeights(this);
    }),

    swapDoc: operation(null, function (doc) {
      var old = this.doc;
      old.cm = null;
      attachDoc(this, doc);
      clearCaches(this);
      resetInput(this, true);
      updateScrollPos(this, doc.scrollLeft, doc.scrollTop);
      return old;
    }),

    getInputField: function (){
      return this.display.input;
    },
    getWrapperElement: function (){
      return this.display.wrapper;
    },
    getScrollerElement: function (){
      return this.display.scroller;
    },
    getGutterElement: function (){
      return this.display.gutters;
    }
  };
  eventMixin(CodeMirror);

  // OPTION DEFAULTS

  var optionHandlers = CodeMirror.optionHandlers = {};

  // The default configuration options.
  var defaults = CodeMirror.defaults = {};

  function option(name, deflt, handle, notOnInit) {
    CodeMirror.defaults[name] = deflt;
    if (handle) optionHandlers[name] =
      notOnInit ? function (cm, val, old) {
        if (old != Init) handle(cm, val, old);
      } : handle;
  }

  var Init = CodeMirror.Init = {toString: function (){
    return 'CodeMirror.Init';
  }};

  // These two are, on init, called from the constructor because they
  // have to be initialized before the editor can start at all.
  option('value', '', function (cm, val) {
    cm.setValue(val);
  }, true);
  option('mode', null, function (cm, val) {
    cm.doc.modeOption = val;
    loadMode(cm);
  }, true);

  option('indentUnit', 2, loadMode, true);
  option('indentWithTabs', false);
  option('smartIndent', true);
  option('tabSize', 4, function (cm) {
    loadMode(cm);
    clearCaches(cm);
    regChange(cm);
  }, true);
  option('electricChars', true);
  option('rtlMoveVisually', !windows);

  option('theme', 'default', function (cm) {
    themeChanged(cm);
    guttersChanged(cm);
  }, true);
  option('keyMap', 'default', keyMapChanged);
  option('extraKeys', null);

  option('onKeyEvent', null);
  option('onDragEvent', null);

  option('lineWrapping', false, wrappingChanged, true);
  option('gutters', [], function (cm) {
    setGuttersForLineNumbers(cm.options);
    guttersChanged(cm);
  }, true);
  option('fixedGutter', true, function (cm, val) {
    cm.display.gutters.style.left = val ? `${compensateForHScroll(cm.display)  }px` : '0';
    cm.refresh();
  }, true);
  option('coverGutterNextToScrollbar', false, updateScrollbars, true);
  option('lineNumbers', false, function (cm) {
    setGuttersForLineNumbers(cm.options);
    guttersChanged(cm);
  }, true);
  option('firstLineNumber', 1, guttersChanged, true);
  option('lineNumberFormatter', function (integer) {
    return integer;
  }, guttersChanged, true);
  option('showCursorWhenSelecting', false, updateSelection, true);

  option('readOnly', false, function (cm, val) {
    if (val == 'nocursor') {
      onBlur(cm); cm.display.input.blur();
    } else if (!val) resetInput(cm, true);
  });
  option('dragDrop', true);

  option('cursorBlinkRate', 530);
  option('cursorScrollMargin', 0);
  option('cursorHeight', 1);
  option('workTime', 100);
  option('workDelay', 100);
  option('flattenSpans', true);
  option('pollInterval', 100);
  option('undoDepth', 40, function (cm, val){
    cm.doc.history.undoDepth = val;
  });
  option('historyEventDelay', 500);
  option('viewportMargin', 10, function (cm){
    cm.refresh();
  }, true);
  option('maxHighlightLength', 10000, function (cm){
    loadMode(cm); cm.refresh();
  }, true);
  option('crudeMeasuringFrom', 10000);
  option('moveInputWithCursor', true, function (cm, val) {
    if (!val) cm.display.inputDiv.style.top = cm.display.inputDiv.style.left = 0;
  });

  option('tabindex', null, function (cm, val) {
    cm.display.input.tabIndex = val || '';
  });
  option('autofocus', null);

  // MODE DEFINITION AND QUERYING

  // Known modes, by name and by MIME
  var modes = CodeMirror.modes = {}, mimeModes = CodeMirror.mimeModes = {};

  CodeMirror.defineMode = function (name, mode) {
    if (!CodeMirror.defaults.mode && name != 'null') CodeMirror.defaults.mode = name;
    if (arguments.length > 2) {
      mode.dependencies = [];
      for (var i = 2; i < arguments.length; ++i) mode.dependencies.push(arguments[i]);
    }
    modes[name] = mode;
  };

  CodeMirror.defineMIME = function (mime, spec) {
    mimeModes[mime] = spec;
  };

  CodeMirror.resolveMode = function (spec) {
    if (typeof spec == 'string' && mimeModes.hasOwnProperty(spec)) {
      spec = mimeModes[spec];
    } else if (spec && typeof spec.name == 'string' && mimeModes.hasOwnProperty(spec.name)) {
      var found = mimeModes[spec.name];
      spec = createObj(found, spec);
      spec.name = found.name;
    } else if (typeof spec == 'string' && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
      return CodeMirror.resolveMode('application/xml');
    }
    if (typeof spec == 'string') return {name: spec};
    else return spec || {name: 'null'};
  };

  CodeMirror.getMode = function (options, spec) {
    var spec = CodeMirror.resolveMode(spec);
    var mfactory = modes[spec.name];
    if (!mfactory) return CodeMirror.getMode(options, 'text/plain');
    var modeObj = mfactory(options, spec);
    if (modeExtensions.hasOwnProperty(spec.name)) {
      var exts = modeExtensions[spec.name];
      for (var prop in exts) {
        if (!exts.hasOwnProperty(prop)) continue;
        if (modeObj.hasOwnProperty(prop)) modeObj[`_${  prop}`] = modeObj[prop];
        modeObj[prop] = exts[prop];
      }
    }
    modeObj.name = spec.name;

    return modeObj;
  };

  CodeMirror.defineMode('null', function () {
    return {token: function (stream) {
      stream.skipToEnd();
    }};
  });
  CodeMirror.defineMIME('text/plain', 'null');

  var modeExtensions = CodeMirror.modeExtensions = {};
  CodeMirror.extendMode = function (mode, properties) {
    var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : (modeExtensions[mode] = {});
    copyObj(properties, exts);
  };

  // EXTENSIONS

  CodeMirror.defineExtension = function (name, func) {
    CodeMirror.prototype[name] = func;
  };
  CodeMirror.defineDocExtension = function (name, func) {
    Doc.prototype[name] = func;
  };
  CodeMirror.defineOption = option;

  var initHooks = [];
  CodeMirror.defineInitHook = function (f) {
    initHooks.push(f);
  };

  var helpers = CodeMirror.helpers = {};
  CodeMirror.registerHelper = function (type, name, value) {
    if (!helpers.hasOwnProperty(type)) helpers[type] = CodeMirror[type] = {};
    helpers[type][name] = value;
  };

  // UTILITIES

  CodeMirror.isWordChar = isWordChar;

  // MODE STATE HANDLING

  // Utility functions for working with state. Exported because modes
  // sometimes need to do this.
  function copyState(mode, state) {
    if (state === true) return state;
    if (mode.copyState) return mode.copyState(state);
    var nstate = {};
    for (var n in state) {
      var val = state[n];
      if (val instanceof Array) val = val.concat([]);
      nstate[n] = val;
    }
    return nstate;
  }
  CodeMirror.copyState = copyState;

  function startState(mode, a1, a2) {
    return mode.startState ? mode.startState(a1, a2) : true;
  }
  CodeMirror.startState = startState;

  CodeMirror.innerMode = function (mode, state) {
    while (mode.innerMode) {
      var info = mode.innerMode(state);
      if (!info || info.mode == mode) break;
      state = info.state;
      mode = info.mode;
    }
    return info || {mode: mode, state: state};
  };

  // STANDARD COMMANDS

  var commands = CodeMirror.commands = {
    selectAll: function (cm) {
      cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()));
    },
    killLine: function (cm) {
      var from = cm.getCursor(true), to = cm.getCursor(false), sel = !posEq(from, to);
      if (!sel && cm.getLine(from.line).length == from.ch)
        cm.replaceRange('', from, Pos(from.line + 1, 0), '+delete');
      else cm.replaceRange('', from, sel ? to : Pos(from.line), '+delete');
    },
    deleteLine: function (cm) {
      var l = cm.getCursor().line;
      cm.replaceRange('', Pos(l, 0), Pos(l), '+delete');
    },
    delLineLeft: function (cm) {
      var cur = cm.getCursor();
      cm.replaceRange('', Pos(cur.line, 0), cur, '+delete');
    },
    undo: function (cm) {
      cm.undo();
    },
    redo: function (cm) {
      cm.redo();
    },
    goDocStart: function (cm) {
      cm.extendSelection(Pos(cm.firstLine(), 0));
    },
    goDocEnd: function (cm) {
      cm.extendSelection(Pos(cm.lastLine()));
    },
    goLineStart: function (cm) {
      cm.extendSelection(lineStart(cm, cm.getCursor().line));
    },
    goLineStartSmart: function (cm) {
      var cur = cm.getCursor(), start = lineStart(cm, cur.line);
      var line = cm.getLineHandle(start.line);
      var order = getOrder(line);
      if (!order || order[0].level == 0) {
        var firstNonWS = Math.max(0, line.text.search(/\S/));
        var inWS = cur.line == start.line && cur.ch <= firstNonWS && cur.ch;
        cm.extendSelection(Pos(start.line, inWS ? 0 : firstNonWS));
      } else cm.extendSelection(start);
    },
    goLineEnd: function (cm) {
      cm.extendSelection(lineEnd(cm, cm.getCursor().line));
    },
    goLineRight: function (cm) {
      var top = cm.charCoords(cm.getCursor(), 'div').top + 5;
      cm.extendSelection(cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, 'div'));
    },
    goLineLeft: function (cm) {
      var top = cm.charCoords(cm.getCursor(), 'div').top + 5;
      cm.extendSelection(cm.coordsChar({left: 0, top: top}, 'div'));
    },
    goLineUp: function (cm) {
      cm.moveV(-1, 'line');
    },
    goLineDown: function (cm) {
      cm.moveV(1, 'line');
    },
    goPageUp: function (cm) {
      cm.moveV(-1, 'page');
    },
    goPageDown: function (cm) {
      cm.moveV(1, 'page');
    },
    goCharLeft: function (cm) {
      cm.moveH(-1, 'char');
    },
    goCharRight: function (cm) {
      cm.moveH(1, 'char');
    },
    goColumnLeft: function (cm) {
      cm.moveH(-1, 'column');
    },
    goColumnRight: function (cm) {
      cm.moveH(1, 'column');
    },
    goWordLeft: function (cm) {
      cm.moveH(-1, 'word');
    },
    goGroupRight: function (cm) {
      cm.moveH(1, 'group');
    },
    goGroupLeft: function (cm) {
      cm.moveH(-1, 'group');
    },
    goWordRight: function (cm) {
      cm.moveH(1, 'word');
    },
    delCharBefore: function (cm) {
      cm.deleteH(-1, 'char');
    },
    delCharAfter: function (cm) {
      cm.deleteH(1, 'char');
    },
    delWordBefore: function (cm) {
      cm.deleteH(-1, 'word');
    },
    delWordAfter: function (cm) {
      cm.deleteH(1, 'word');
    },
    delGroupBefore: function (cm) {
      cm.deleteH(-1, 'group');
    },
    delGroupAfter: function (cm) {
      cm.deleteH(1, 'group');
    },
    indentAuto: function (cm) {
      cm.indentSelection('smart');
    },
    indentMore: function (cm) {
      cm.indentSelection('add');
    },
    indentLess: function (cm) {
      cm.indentSelection('subtract');
    },
    insertTab: function (cm) {
      cm.replaceSelection('\t', 'end', '+input');
    },
    defaultTab: function (cm) {
      if (cm.somethingSelected()) cm.indentSelection('add');
      else cm.replaceSelection('\t', 'end', '+input');
    },
    transposeChars: function (cm) {
      var cur = cm.getCursor(), line = cm.getLine(cur.line);
      if (cur.ch > 0 && cur.ch < line.length - 1)
        cm.replaceRange(line.charAt(cur.ch) + line.charAt(cur.ch - 1),
          Pos(cur.line, cur.ch - 1), Pos(cur.line, cur.ch + 1));
    },
    newlineAndIndent: function (cm) {
      operation(cm, function () {
        cm.replaceSelection('\n', 'end', '+input');
        cm.indentLine(cm.getCursor().line, null, true);
      })();
    },
    toggleOverwrite: function (cm) {
      cm.toggleOverwrite();
    }
  };

  // STANDARD KEYMAPS

  var keyMap = CodeMirror.keyMap = {};
  keyMap.basic = {
    'Left': 'goCharLeft', 'Right': 'goCharRight', 'Up': 'goLineUp', 'Down': 'goLineDown',
    'End': 'goLineEnd', 'Home': 'goLineStartSmart', 'PageUp': 'goPageUp', 'PageDown': 'goPageDown',
    'Delete': 'delCharAfter', 'Backspace': 'delCharBefore', 'Tab': 'defaultTab', 'Shift-Tab': 'indentAuto',
    'Enter': 'newlineAndIndent', 'Insert': 'toggleOverwrite'
  };
  // Note that the save and find-related commands aren't defined by
  // default. Unknown commands are simply ignored.
  keyMap.pcDefault = {
    'Ctrl-A': 'selectAll', 'Ctrl-D': 'deleteLine', 'Ctrl-Z': 'undo', 'Shift-Ctrl-Z': 'redo', 'Ctrl-Y': 'redo',
    'Ctrl-Home': 'goDocStart', 'Alt-Up': 'goDocStart', 'Ctrl-End': 'goDocEnd', 'Ctrl-Down': 'goDocEnd',
    'Ctrl-Left': 'goGroupLeft', 'Ctrl-Right': 'goGroupRight', 'Alt-Left': 'goLineStart', 'Alt-Right': 'goLineEnd',
    'Ctrl-Backspace': 'delGroupBefore', 'Ctrl-Delete': 'delGroupAfter', 'Ctrl-S': 'save', 'Ctrl-F': 'find',
    'Ctrl-G': 'findNext', 'Shift-Ctrl-G': 'findPrev', 'Shift-Ctrl-F': 'replace', 'Shift-Ctrl-R': 'replaceAll',
    'Ctrl-[': 'indentLess', 'Ctrl-]': 'indentMore',
    fallthrough: 'basic'
  };
  keyMap.macDefault = {
    'Cmd-A': 'selectAll', 'Cmd-D': 'deleteLine', 'Cmd-Z': 'undo', 'Shift-Cmd-Z': 'redo', 'Cmd-Y': 'redo',
    'Cmd-Up': 'goDocStart', 'Cmd-End': 'goDocEnd', 'Cmd-Down': 'goDocEnd', 'Alt-Left': 'goGroupLeft',
    'Alt-Right': 'goGroupRight', 'Cmd-Left': 'goLineStart', 'Cmd-Right': 'goLineEnd', 'Alt-Backspace': 'delGroupBefore',
    'Ctrl-Alt-Backspace': 'delGroupAfter', 'Alt-Delete': 'delGroupAfter', 'Cmd-S': 'save', 'Cmd-F': 'find',
    'Cmd-G': 'findNext', 'Shift-Cmd-G': 'findPrev', 'Cmd-Alt-F': 'replace', 'Shift-Cmd-Alt-F': 'replaceAll',
    'Cmd-[': 'indentLess', 'Cmd-]': 'indentMore', 'Cmd-Backspace': 'delLineLeft',
    fallthrough: ['basic', 'emacsy']
  };
  keyMap['default'] = mac ? keyMap.macDefault : keyMap.pcDefault;
  keyMap.emacsy = {
    'Ctrl-F': 'goCharRight', 'Ctrl-B': 'goCharLeft', 'Ctrl-P': 'goLineUp', 'Ctrl-N': 'goLineDown',
    'Alt-F': 'goWordRight', 'Alt-B': 'goWordLeft', 'Ctrl-A': 'goLineStart', 'Ctrl-E': 'goLineEnd',
    'Ctrl-V': 'goPageDown', 'Shift-Ctrl-V': 'goPageUp', 'Ctrl-D': 'delCharAfter', 'Ctrl-H': 'delCharBefore',
    'Alt-D': 'delWordAfter', 'Alt-Backspace': 'delWordBefore', 'Ctrl-K': 'killLine', 'Ctrl-T': 'transposeChars'
  };

  // KEYMAP DISPATCH

  function getKeyMap(val) {
    if (typeof val == 'string') return keyMap[val];
    else return val;
  }

  function lookupKey(name, maps, handle) {
    function lookup(map) {
      map = getKeyMap(map);
      var found = map[name];
      if (found === false) return 'stop';
      if (found != null && handle(found)) return true;
      if (map.nofallthrough) return 'stop';

      var fallthrough = map.fallthrough;
      if (fallthrough == null) return false;
      if (Object.prototype.toString.call(fallthrough) != '[object Array]')
        return lookup(fallthrough);
      for (var i = 0, e = fallthrough.length; i < e; ++i) {
        var done = lookup(fallthrough[i]);
        if (done) return done;
      }
      return false;
    }

    for (var i = 0; i < maps.length; ++i) {
      var done = lookup(maps[i]);
      if (done) return done != 'stop';
    }
  }
  function isModifierKey(event) {
    var name = keyNames[event.keyCode];
    return name == 'Ctrl' || name == 'Alt' || name == 'Shift' || name == 'Mod';
  }
  function keyName(event, noShift) {
    if (opera && event.keyCode == 34 && event['char']) return false;
    var name = keyNames[event.keyCode];
    if (name == null || event.altGraphKey) return false;
    if (event.altKey) name = `Alt-${  name}`;
    if (flipCtrlCmd ? event.metaKey : event.ctrlKey) name = `Ctrl-${  name}`;
    if (flipCtrlCmd ? event.ctrlKey : event.metaKey) name = `Cmd-${  name}`;
    if (!noShift && event.shiftKey) name = `Shift-${  name}`;
    return name;
  }
  CodeMirror.lookupKey = lookupKey;
  CodeMirror.isModifierKey = isModifierKey;
  CodeMirror.keyName = keyName;

  // FROMTEXTAREA

  CodeMirror.fromTextArea = function (textarea, options) {
    if (!options) options = {};
    options.value = textarea.value;
    if (!options.tabindex && textarea.tabindex)
      options.tabindex = textarea.tabindex;
    if (!options.placeholder && textarea.placeholder)
      options.placeholder = textarea.placeholder;
    // Set autofocus to true if this textarea is focused, or if it has
    // autofocus and no other element is focused.
    if (options.autofocus == null) {
      var hasFocus = document.body;
      // doc.activeElement occasionally throws on IE
      try {
        hasFocus = document.activeElement; 
      } catch(e) {}
      options.autofocus = hasFocus == textarea ||
        textarea.getAttribute('autofocus') != null && hasFocus == document.body;
    }

    function save() {
      textarea.value = cm.getValue();
    }
    if (textarea.form) {
      on(textarea.form, 'submit', save);
      // Deplorable hack to make the submit method do the right thing.
      if (!options.leaveSubmitMethodAlone) {
        var form = textarea.form, realSubmit = form.submit;
        try {
          var wrappedSubmit = form.submit = function () {
            save();
            form.submit = realSubmit;
            form.submit();
            form.submit = wrappedSubmit;
          };
        } catch(e) {}
      }
    }

    textarea.style.display = 'none';
    var cm = CodeMirror(function (node) {
      textarea.parentNode.insertBefore(node, textarea.nextSibling);
    }, options);
    cm.save = save;
    cm.getTextArea = function () {
      return textarea; 
    };
    cm.toTextArea = function () {
      save();
      textarea.parentNode.removeChild(cm.getWrapperElement());
      textarea.style.display = '';
      if (textarea.form) {
        off(textarea.form, 'submit', save);
        if (typeof textarea.form.submit == 'function')
          textarea.form.submit = realSubmit;
      }
    };
    return cm;
  };

  // STRING STREAM

  // Fed to the mode parsers, provides helper functions to make
  // parsers more succinct.

  // The character stream used by a mode's parser.
  function StringStream(string, tabSize) {
    this.pos = this.start = 0;
    this.string = string;
    this.tabSize = tabSize || 8;
    this.lastColumnPos = this.lastColumnValue = 0;
  }

  StringStream.prototype = {
    eol: function () {
      return this.pos >= this.string.length;
    },
    sol: function () {
      return this.pos == 0;
    },
    peek: function () {
      return this.string.charAt(this.pos) || undefined;
    },
    next: function () {
      if (this.pos < this.string.length)
        return this.string.charAt(this.pos++);
    },
    eat: function (match) {
      var ch = this.string.charAt(this.pos);
      if (typeof match == 'string') var ok = ch == match;
      else var ok = ch && (match.test ? match.test(ch) : match(ch));
      if (ok) {
        ++this.pos; return ch;
      }
    },
    eatWhile: function (match) {
      var start = this.pos;
      while (this.eat(match)){}
      return this.pos > start;
    },
    eatSpace: function () {
      var start = this.pos;
      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
      return this.pos > start;
    },
    skipToEnd: function () {
      this.pos = this.string.length;
    },
    skipTo: function (ch) {
      var found = this.string.indexOf(ch, this.pos);
      if (found > -1) {
        this.pos = found; return true;
      }
    },
    backUp: function (n) {
      this.pos -= n;
    },
    column: function () {
      if (this.lastColumnPos < this.start) {
        this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
        this.lastColumnPos = this.start;
      }
      return this.lastColumnValue;
    },
    indentation: function () {
      return countColumn(this.string, null, this.tabSize);
    },
    match: function (pattern, consume, caseInsensitive) {
      if (typeof pattern == 'string') {
        var cased = function (str) {
          return caseInsensitive ? str.toLowerCase() : str;
        };
        var substr = this.string.substr(this.pos, pattern.length);
        if (cased(substr) == cased(pattern)) {
          if (consume !== false) this.pos += pattern.length;
          return true;
        }
      } else {
        var match = this.string.slice(this.pos).match(pattern);
        if (match && match.index > 0) return null;
        if (match && consume !== false) this.pos += match[0].length;
        return match;
      }
    },
    current: function (){
      return this.string.slice(this.start, this.pos);
    }
  };
  CodeMirror.StringStream = StringStream;

  // TEXTMARKERS

  function TextMarker(doc, type) {
    this.lines = [];
    this.type = type;
    this.doc = doc;
  }
  CodeMirror.TextMarker = TextMarker;
  eventMixin(TextMarker);

  TextMarker.prototype.clear = function () {
    if (this.explicitlyCleared) return;
    var cm = this.doc.cm, withOp = cm && !cm.curOp;
    if (withOp) startOperation(cm);
    if (hasHandler(this, 'clear')) {
      var found = this.find();
      if (found) signalLater(this, 'clear', found.from, found.to);
    }
    var min = null, max = null;
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      var span = getMarkedSpanFor(line.markedSpans, this);
      if (span.to != null) max = lineNo(line);
      line.markedSpans = removeMarkedSpan(line.markedSpans, span);
      if (span.from != null)
        min = lineNo(line);
      else if (this.collapsed && !lineIsHidden(this.doc, line) && cm)
        updateLineHeight(line, textHeight(cm.display));
    }
    if (cm && this.collapsed && !cm.options.lineWrapping) for (var i = 0; i < this.lines.length; ++i) {
      var visual = visualLine(cm.doc, this.lines[i]), len = lineLength(cm.doc, visual);
      if (len > cm.display.maxLineLength) {
        cm.display.maxLine = visual;
        cm.display.maxLineLength = len;
        cm.display.maxLineChanged = true;
      }
    }

    if (min != null && cm) regChange(cm, min, max + 1);
    this.lines.length = 0;
    this.explicitlyCleared = true;
    if (this.atomic && this.doc.cantEdit) {
      this.doc.cantEdit = false;
      if (cm) reCheckSelection(cm);
    }
    if (withOp) endOperation(cm);
  };

  TextMarker.prototype.find = function () {
    var from, to;
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      var span = getMarkedSpanFor(line.markedSpans, this);
      if (span.from != null || span.to != null) {
        var found = lineNo(line);
        if (span.from != null) from = Pos(found, span.from);
        if (span.to != null) to = Pos(found, span.to);
      }
    }
    if (this.type == 'bookmark') return from;
    return from && {from: from, to: to};
  };

  TextMarker.prototype.changed = function () {
    var pos = this.find(), cm = this.doc.cm;
    if (!pos || !cm) return;
    if (this.type != 'bookmark') pos = pos.from;
    var line = getLine(this.doc, pos.line);
    clearCachedMeasurement(cm, line);
    if (pos.line >= cm.display.showingFrom && pos.line < cm.display.showingTo) {
      for (var node = cm.display.lineDiv.firstChild; node; node = node.nextSibling) if (node.lineObj == line) {
        if (node.offsetHeight != line.height) updateLineHeight(line, node.offsetHeight);
        break;
      }
      runInOp(cm, function () {
        cm.curOp.selectionChanged = cm.curOp.forceUpdate = cm.curOp.updateMaxLine = true;
      });
    }
  };

  TextMarker.prototype.attachLine = function (line) {
    if (!this.lines.length && this.doc.cm) {
      var op = this.doc.cm.curOp;
      if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1)
        (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
    }
    this.lines.push(line);
  };
  TextMarker.prototype.detachLine = function (line) {
    this.lines.splice(indexOf(this.lines, line), 1);
    if (!this.lines.length && this.doc.cm) {
      var op = this.doc.cm.curOp;
      (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
    }
  };

  function markText(doc, from, to, options, type) {
    if (options && options.shared) return markTextShared(doc, from, to, options, type);
    if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);

    var marker = new TextMarker(doc, type);
    if (type == 'range' && !posLess(from, to)) return marker;
    if (options) copyObj(options, marker);
    if (marker.replacedWith) {
      marker.collapsed = true;
      marker.replacedWith = elt('span', [marker.replacedWith], 'CodeMirror-widget');
      if (!options.handleMouseEvents) marker.replacedWith.ignoreEvents = true;
    }
    if (marker.collapsed) sawCollapsedSpans = true;

    if (marker.addToHistory)
      addToHistory(doc, {from: from, to: to, origin: 'markText'},
        {head: doc.sel.head, anchor: doc.sel.anchor}, NaN);

    var curLine = from.line, size = 0, collapsedAtStart, collapsedAtEnd, cm = doc.cm, updateMaxLine;
    doc.iter(curLine, to.line + 1, function (line) {
      if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(doc, line) == cm.display.maxLine)
        updateMaxLine = true;
      var span = {from: null, to: null, marker: marker};
      size += line.text.length;
      if (curLine == from.line) {
        span.from = from.ch; size -= from.ch;
      }
      if (curLine == to.line) {
        span.to = to.ch; size -= line.text.length - to.ch;
      }
      if (marker.collapsed) {
        if (curLine == to.line) collapsedAtEnd = collapsedSpanAt(line, to.ch);
        if (curLine == from.line) collapsedAtStart = collapsedSpanAt(line, from.ch);
        else updateLineHeight(line, 0);
      }
      addMarkedSpan(line, span);
      ++curLine;
    });
    if (marker.collapsed) doc.iter(from.line, to.line + 1, function (line) {
      if (lineIsHidden(doc, line)) updateLineHeight(line, 0);
    });

    if (marker.clearOnEnter) on(marker, 'beforeCursorEnter', function () {
      marker.clear(); 
    });

    if (marker.readOnly) {
      sawReadOnlySpans = true;
      if (doc.history.done.length || doc.history.undone.length)
        doc.clearHistory();
    }
    if (marker.collapsed) {
      if (collapsedAtStart != collapsedAtEnd)
        throw new Error('Inserting collapsed marker overlapping an existing one');
      marker.size = size;
      marker.atomic = true;
    }
    if (cm) {
      if (updateMaxLine) cm.curOp.updateMaxLine = true;
      if (marker.className || marker.title || marker.startStyle || marker.endStyle || marker.collapsed)
        regChange(cm, from.line, to.line + 1);
      if (marker.atomic) reCheckSelection(cm);
    }
    return marker;
  }

  // SHARED TEXTMARKERS

  function SharedTextMarker(markers, primary) {
    this.markers = markers;
    this.primary = primary;
    for (var i = 0, me = this; i < markers.length; ++i) {
      markers[i].parent = this;
      on(markers[i], 'clear', function (){
        me.clear();
      });
    }
  }
  CodeMirror.SharedTextMarker = SharedTextMarker;
  eventMixin(SharedTextMarker);

  SharedTextMarker.prototype.clear = function () {
    if (this.explicitlyCleared) return;
    this.explicitlyCleared = true;
    for (var i = 0; i < this.markers.length; ++i)
      this.markers[i].clear();
    signalLater(this, 'clear');
  };
  SharedTextMarker.prototype.find = function () {
    return this.primary.find();
  };

  function markTextShared(doc, from, to, options, type) {
    options = copyObj(options);
    options.shared = false;
    var markers = [markText(doc, from, to, options, type)], primary = markers[0];
    var widget = options.replacedWith;
    linkedDocs(doc, function (doc) {
      if (widget) options.replacedWith = widget.cloneNode(true);
      markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
      for (var i = 0; i < doc.linked.length; ++i)
        if (doc.linked[i].isParent) return;
      primary = lst(markers);
    });
    return new SharedTextMarker(markers, primary);
  }

  // TEXTMARKER SPANS

  function getMarkedSpanFor(spans, marker) {
    if (spans) for (var i = 0; i < spans.length; ++i) {
      var span = spans[i];
      if (span.marker == marker) return span;
    }
  }
  function removeMarkedSpan(spans, span) {
    for (var r, i = 0; i < spans.length; ++i)
      if (spans[i] != span) (r || (r = [])).push(spans[i]);
    return r;
  }
  function addMarkedSpan(line, span) {
    line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
    span.marker.attachLine(line);
  }

  function markedSpansBefore(old, startCh, isInsert) {
    if (old) for (var i = 0, nw; i < old.length; ++i) {
      var span = old[i], marker = span.marker;
      var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
      if (startsBefore || marker.type == 'bookmark' && span.from == startCh && (!isInsert || !span.marker.insertLeft)) {
        var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
        (nw || (nw = [])).push({from: span.from,
          to: endsAfter ? null : span.to,
          marker: marker});
      }
    }
    return nw;
  }

  function markedSpansAfter(old, endCh, isInsert) {
    if (old) for (var i = 0, nw; i < old.length; ++i) {
      var span = old[i], marker = span.marker;
      var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
      if (endsAfter || marker.type == 'bookmark' && span.from == endCh && (!isInsert || span.marker.insertLeft)) {
        var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
        (nw || (nw = [])).push({from: startsBefore ? null : span.from - endCh,
          to: span.to == null ? null : span.to - endCh,
          marker: marker});
      }
    }
    return nw;
  }

  function stretchSpansOverChange(doc, change) {
    var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
    var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
    if (!oldFirst && !oldLast) return null;

    var startCh = change.from.ch, endCh = change.to.ch, isInsert = posEq(change.from, change.to);
    // Get the spans that 'stick out' on both sides
    var first = markedSpansBefore(oldFirst, startCh, isInsert);
    var last = markedSpansAfter(oldLast, endCh, isInsert);

    // Next, merge those two ends
    var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
    if (first) {
      // Fix up .to properties of first
      for (var i = 0; i < first.length; ++i) {
        var span = first[i];
        if (span.to == null) {
          var found = getMarkedSpanFor(last, span.marker);
          if (!found) span.to = startCh;
          else if (sameLine) span.to = found.to == null ? null : found.to + offset;
        }
      }
    }
    if (last) {
      // Fix up .from in last (or move them into first in case of sameLine)
      for (var i = 0; i < last.length; ++i) {
        var span = last[i];
        if (span.to != null) span.to += offset;
        if (span.from == null) {
          var found = getMarkedSpanFor(first, span.marker);
          if (!found) {
            span.from = offset;
            if (sameLine) (first || (first = [])).push(span);
          }
        } else {
          span.from += offset;
          if (sameLine) (first || (first = [])).push(span);
        }
      }
    }
    if (sameLine && first) {
      // Make sure we didn't create any zero-length spans
      for (var i = 0; i < first.length; ++i)
        if (first[i].from != null && first[i].from == first[i].to && first[i].marker.type != 'bookmark')
          first.splice(i--, 1);
      if (!first.length) first = null;
    }

    var newMarkers = [first];
    if (!sameLine) {
      // Fill gap with whole-line-spans
      var gap = change.text.length - 2, gapMarkers;
      if (gap > 0 && first)
        for (var i = 0; i < first.length; ++i)
          if (first[i].to == null)
            (gapMarkers || (gapMarkers = [])).push({from: null, to: null, marker: first[i].marker});
      for (var i = 0; i < gap; ++i)
        newMarkers.push(gapMarkers);
      newMarkers.push(last);
    }
    return newMarkers;
  }

  function mergeOldSpans(doc, change) {
    var old = getOldSpans(doc, change);
    var stretched = stretchSpansOverChange(doc, change);
    if (!old) return stretched;
    if (!stretched) return old;

    for (var i = 0; i < old.length; ++i) {
      var oldCur = old[i], stretchCur = stretched[i];
      if (oldCur && stretchCur) {
        spans: for (var j = 0; j < stretchCur.length; ++j) {
          var span = stretchCur[j];
          for (var k = 0; k < oldCur.length; ++k)
            if (oldCur[k].marker == span.marker) continue spans;
          oldCur.push(span);
        }
      } else if (stretchCur) {
        old[i] = stretchCur;
      }
    }
    return old;
  }

  function removeReadOnlyRanges(doc, from, to) {
    var markers = null;
    doc.iter(from.line, to.line + 1, function (line) {
      if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {
        var mark = line.markedSpans[i].marker;
        if (mark.readOnly && (!markers || indexOf(markers, mark) == -1))
          (markers || (markers = [])).push(mark);
      }
    });
    if (!markers) return null;
    var parts = [{from: from, to: to}];
    for (var i = 0; i < markers.length; ++i) {
      var mk = markers[i], m = mk.find();
      for (var j = 0; j < parts.length; ++j) {
        var p = parts[j];
        if (posLess(p.to, m.from) || posLess(m.to, p.from)) continue;
        var newParts = [j, 1];
        if (posLess(p.from, m.from) || !mk.inclusiveLeft && posEq(p.from, m.from))
          newParts.push({from: p.from, to: m.from});
        if (posLess(m.to, p.to) || !mk.inclusiveRight && posEq(p.to, m.to))
          newParts.push({from: m.to, to: p.to});
        parts.splice.apply(parts, newParts);
        j += newParts.length - 1;
      }
    }
    return parts;
  }

  function collapsedSpanAt(line, ch) {
    var sps = sawCollapsedSpans && line.markedSpans, found;
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
      sp = sps[i];
      if (!sp.marker.collapsed) continue;
      if ((sp.from == null || sp.from < ch) &&
          (sp.to == null || sp.to > ch) &&
          (!found || found.width < sp.marker.width))
        found = sp.marker;
    }
    return found;
  }
  function collapsedSpanAtStart(line) {
    return collapsedSpanAt(line, -1); 
  }
  function collapsedSpanAtEnd(line) {
    return collapsedSpanAt(line, line.text.length + 1); 
  }

  function visualLine(doc, line) {
    var merged;
    while (merged = collapsedSpanAtStart(line))
      line = getLine(doc, merged.find().from.line);
    return line;
  }

  function lineIsHidden(doc, line) {
    var sps = sawCollapsedSpans && line.markedSpans;
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
      sp = sps[i];
      if (!sp.marker.collapsed) continue;
      if (sp.from == null) return true;
      if (sp.marker.replacedWith) continue;
      if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
        return true;
    }
  }
  function lineIsHiddenInner(doc, line, span) {
    if (span.to == null) {
      var end = span.marker.find().to, endLine = getLine(doc, end.line);
      return lineIsHiddenInner(doc, endLine, getMarkedSpanFor(endLine.markedSpans, span.marker));
    }
    if (span.marker.inclusiveRight && span.to == line.text.length)
      return true;
    for (var sp, i = 0; i < line.markedSpans.length; ++i) {
      sp = line.markedSpans[i];
      if (sp.marker.collapsed && !sp.marker.replacedWith && sp.from == span.to &&
          (sp.marker.inclusiveLeft || span.marker.inclusiveRight) &&
          lineIsHiddenInner(doc, line, sp)) return true;
    }
  }

  function detachMarkedSpans(line) {
    var spans = line.markedSpans;
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i)
      spans[i].marker.detachLine(line);
    line.markedSpans = null;
  }

  function attachMarkedSpans(line, spans) {
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i)
      spans[i].marker.attachLine(line);
    line.markedSpans = spans;
  }

  // LINE WIDGETS

  var LineWidget = CodeMirror.LineWidget = function (cm, node, options) {
    if (options) for (var opt in options) if (options.hasOwnProperty(opt))
      this[opt] = options[opt];
    this.cm = cm;
    this.node = node;
  };
  eventMixin(LineWidget);
  function widgetOperation(f) {
    return function () {
      var withOp = !this.cm.curOp;
      if (withOp) startOperation(this.cm);
      try {
        var result = f.apply(this, arguments);
      } finally {
        if (withOp) endOperation(this.cm);
      }
      return result;
    };
  }
  LineWidget.prototype.clear = widgetOperation(function () {
    var ws = this.line.widgets, no = lineNo(this.line);
    if (no == null || !ws) return;
    for (var i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);
    if (!ws.length) this.line.widgets = null;
    var aboveVisible = heightAtLine(this.cm, this.line) < this.cm.doc.scrollTop;
    updateLineHeight(this.line, Math.max(0, this.line.height - widgetHeight(this)));
    if (aboveVisible) addToScrollPos(this.cm, 0, -this.height);
    regChange(this.cm, no, no + 1);
  });
  LineWidget.prototype.changed = widgetOperation(function () {
    var oldH = this.height;
    this.height = null;
    var diff = widgetHeight(this) - oldH;
    if (!diff) return;
    updateLineHeight(this.line, this.line.height + diff);
    var no = lineNo(this.line);
    regChange(this.cm, no, no + 1);
  });

  function widgetHeight(widget) {
    if (widget.height != null) return widget.height;
    if (!widget.node.parentNode || widget.node.parentNode.nodeType != 1)
      removeChildrenAndAdd(widget.cm.display.measure, elt('div', [widget.node], null, 'position: relative'));
    return widget.height = widget.node.offsetHeight;
  }

  function addLineWidget(cm, handle, node, options) {
    var widget = new LineWidget(cm, node, options);
    if (widget.noHScroll) cm.display.alignWidgets = true;
    changeLine(cm, handle, function (line) {
      var widgets = line.widgets || (line.widgets = []);
      if (widget.insertAt == null) widgets.push(widget);
      else widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
      widget.line = line;
      if (!lineIsHidden(cm.doc, line) || widget.showIfHidden) {
        var aboveVisible = heightAtLine(cm, line) < cm.doc.scrollTop;
        updateLineHeight(line, line.height + widgetHeight(widget));
        if (aboveVisible) addToScrollPos(cm, 0, widget.height);
      }
      return true;
    });
    return widget;
  }

  // LINE DATA STRUCTURE

  // Line objects. These hold state related to a line, including
  // highlighting info (the styles array).
  var Line = CodeMirror.Line = function (text, markedSpans, estimateHeight) {
    this.text = text;
    attachMarkedSpans(this, markedSpans);
    this.height = estimateHeight ? estimateHeight(this) : 1;
  };
  eventMixin(Line);

  function updateLine(line, text, markedSpans, estimateHeight) {
    line.text = text;
    if (line.stateAfter) line.stateAfter = null;
    if (line.styles) line.styles = null;
    if (line.order != null) line.order = null;
    detachMarkedSpans(line);
    attachMarkedSpans(line, markedSpans);
    var estHeight = estimateHeight ? estimateHeight(line) : 1;
    if (estHeight != line.height) updateLineHeight(line, estHeight);
  }

  function cleanUpLine(line) {
    line.parent = null;
    detachMarkedSpans(line);
  }

  // Run the given mode's parser over a line, update the styles
  // array, which contains alternating fragments of text and CSS
  // classes.
  function runMode(cm, text, mode, state, f) {
    var flattenSpans = mode.flattenSpans;
    if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
    var curStart = 0, curStyle = null;
    var stream = new StringStream(text, cm.options.tabSize), style;
    if (text == '' && mode.blankLine) mode.blankLine(state);
    while (!stream.eol()) {
      if (stream.pos > cm.options.maxHighlightLength) {
        flattenSpans = false;
        stream.pos = text.length;
        style = null;
      } else {
        style = mode.token(stream, state);
      }
      if (!flattenSpans || curStyle != style) {
        if (curStart < stream.start) f(stream.start, curStyle);
        curStart = stream.start; curStyle = style;
      }
      stream.start = stream.pos;
    }
    while (curStart < stream.pos) {
      // Webkit seems to refuse to render text nodes longer than 57444 characters
      var pos = Math.min(stream.pos, curStart + 50000);
      f(pos, curStyle);
      curStart = pos;
    }
  }

  function highlightLine(cm, line, state) {
    // A styles array always starts with a number identifying the
    // mode/overlays that it is based on (for easy invalidation).
    var st = [cm.state.modeGen];
    // Compute the base array of styles
    runMode(cm, line.text, cm.doc.mode, state, function (end, style) {
      st.push(end, style);
    });

    // Run overlays, adjust style array.
    for (var o = 0; o < cm.state.overlays.length; ++o) {
      var overlay = cm.state.overlays[o], i = 1, at = 0;
      runMode(cm, line.text, overlay.mode, true, function (end, style) {
        var start = i;
        // Ensure there's a token end at the current position, and that i points at it
        while (at < end) {
          var i_end = st[i];
          if (i_end > end)
            st.splice(i, 1, end, st[i+1], i_end);
          i += 2;
          at = Math.min(end, i_end);
        }
        if (!style) return;
        if (overlay.opaque) {
          st.splice(start, i - start, end, style);
          i = start + 2;
        } else {
          for (; start < i; start += 2) {
            var cur = st[start+1];
            st[start+1] = cur ? `${cur  } ${  style}` : style;
          }
        }
      });
    }

    return st;
  }

  function getLineStyles(cm, line) {
    if (!line.styles || line.styles[0] != cm.state.modeGen)
      line.styles = highlightLine(cm, line, line.stateAfter = getStateBefore(cm, lineNo(line)));
    return line.styles;
  }

  // Lightweight form of highlight -- proceed over this line and
  // update state, but don't save a style array.
  function processLine(cm, line, state) {
    var mode = cm.doc.mode;
    var stream = new StringStream(line.text, cm.options.tabSize);
    if (line.text == '' && mode.blankLine) mode.blankLine(state);
    while (!stream.eol() && stream.pos <= cm.options.maxHighlightLength) {
      mode.token(stream, state);
      stream.start = stream.pos;
    }
  }

  var styleToClassCache = {};
  function interpretTokenStyle(style, builder) {
    if (!style) return null;
    for (;;) {
      var lineClass = style.match(/(?:^|\s)line-(background-)?(\S+)/);
      if (!lineClass) break;
      style = style.slice(0, lineClass.index) + style.slice(lineClass.index + lineClass[0].length);
      var prop = lineClass[1] ? 'bgClass' : 'textClass';
      if (builder[prop] == null)
        builder[prop] = lineClass[2];
      else if (!(new RegExp(`(?:^|\s)${  lineClass[2]  }(?:$|\s)`)).test(builder[prop]))
        builder[prop] += ` ${  lineClass[2]}`;
    }
    return styleToClassCache[style] ||
      (styleToClassCache[style] = `cm-${  style.replace(/ +/g, ' cm-')}`);
  }

  function buildLineContent(cm, realLine, measure, copyWidgets) {
    var merged, line = realLine, empty = true;
    while (merged = collapsedSpanAtStart(line))
      line = getLine(cm.doc, merged.find().from.line);

    var builder = {pre: elt('pre'), col: 0, pos: 0,
      measure: null, measuredSomething: false, cm: cm,
      copyWidgets: copyWidgets};

    do {
      if (line.text) empty = false;
      builder.measure = line == realLine && measure;
      builder.pos = 0;
      builder.addToken = builder.measure ? buildTokenMeasure : buildToken;
      if ((ie || webkit) && cm.getOption('lineWrapping'))
        builder.addToken = buildTokenSplitSpaces(builder.addToken);
      var next = insertLineContent(line, builder, getLineStyles(cm, line));
      if (measure && line == realLine && !builder.measuredSomething) {
        measure[0] = builder.pre.appendChild(zeroWidthElement(cm.display.measure));
        builder.measuredSomething = true;
      }
      if (next) line = getLine(cm.doc, next.to.line);
    } while (next);

    if (measure && !builder.measuredSomething && !measure[0])
      measure[0] = builder.pre.appendChild(empty ? elt('span', '\u00a0') : zeroWidthElement(cm.display.measure));
    if (!builder.pre.firstChild && !lineIsHidden(cm.doc, realLine))
      builder.pre.appendChild(document.createTextNode('\u00a0'));

    var order;
    // Work around problem with the reported dimensions of single-char
    // direction spans on IE (issue #1129). See also the comment in
    // cursorCoords.
    if (measure && ie && (order = getOrder(line))) {
      var l = order.length - 1;
      if (order[l].from == order[l].to) --l;
      var last = order[l], prev = order[l - 1];
      if (last.from + 1 == last.to && prev && last.level < prev.level) {
        var span = measure[builder.pos - 1];
        if (span) span.parentNode.insertBefore(span.measureRight = zeroWidthElement(cm.display.measure),
          span.nextSibling);
      }
    }

    var textClass = builder.textClass ? `${builder.textClass  } ${  realLine.textClass || ''}` : realLine.textClass;
    if (textClass) builder.pre.className = textClass;

    signal(cm, 'renderLine', cm, realLine, builder.pre);
    return builder;
  }

  var tokenSpecialChars = /[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\uFEFF]/g;
  function buildToken(builder, text, style, startStyle, endStyle, title) {
    if (!text) return;
    if (!tokenSpecialChars.test(text)) {
      builder.col += text.length;
      var content = document.createTextNode(text);
    } else {
      var content = document.createDocumentFragment(), pos = 0;
      while (true) {
        tokenSpecialChars.lastIndex = pos;
        var m = tokenSpecialChars.exec(text);
        var skipped = m ? m.index - pos : text.length - pos;
        if (skipped) {
          content.appendChild(document.createTextNode(text.slice(pos, pos + skipped)));
          builder.col += skipped;
        }
        if (!m) break;
        pos += skipped + 1;
        if (m[0] == '\t') {
          var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
          content.appendChild(elt('span', spaceStr(tabWidth), 'cm-tab'));
          builder.col += tabWidth;
        } else {
          var token = elt('span', '\u2022', 'cm-invalidchar');
          token.title = `\\u${  m[0].charCodeAt(0).toString(16)}`;
          content.appendChild(token);
          builder.col += 1;
        }
      }
    }
    if (style || startStyle || endStyle || builder.measure) {
      var fullStyle = style || '';
      if (startStyle) fullStyle += startStyle;
      if (endStyle) fullStyle += endStyle;
      var token = elt('span', [content], fullStyle);
      if (title) token.title = title;
      return builder.pre.appendChild(token);
    }
    builder.pre.appendChild(content);
  }

  function buildTokenMeasure(builder, text, style, startStyle, endStyle) {
    var wrapping = builder.cm.options.lineWrapping;
    for (var i = 0; i < text.length; ++i) {
      var ch = text.charAt(i), start = i == 0;
      if (ch >= '\ud800' && ch < '\udbff' && i < text.length - 1) {
        ch = text.slice(i, i + 2);
        ++i;
      } else if (i && wrapping && spanAffectsWrapping(text, i)) {
        builder.pre.appendChild(elt('wbr'));
      }
      var old = builder.measure[builder.pos];
      var span = builder.measure[builder.pos] =
        buildToken(builder, ch, style,
          start && startStyle, i == text.length - 1 && endStyle);
      if (old) span.leftSide = old.leftSide || old;
      // In IE single-space nodes wrap differently than spaces
      // embedded in larger text nodes, except when set to
      // white-space: normal (issue #1268).
      if (ie && wrapping && ch == ' ' && i && !/\s/.test(text.charAt(i - 1)) &&
          i < text.length - 1 && !/\s/.test(text.charAt(i + 1)))
        span.style.whiteSpace = 'normal';
      builder.pos += ch.length;
    }
    if (text.length) builder.measuredSomething = true;
  }

  function buildTokenSplitSpaces(inner) {
    function split(old) {
      var out = ' ';
      for (var i = 0; i < old.length - 2; ++i) out += i % 2 ? ' ' : '\u00a0';
      out += ' ';
      return out;
    }
    return function (builder, text, style, startStyle, endStyle, title) {
      return inner(builder, text.replace(/ {3,}/, split), style, startStyle, endStyle, title);
    };
  }

  function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
    var widget = !ignoreWidget && marker.replacedWith;
    if (widget) {
      if (builder.copyWidgets) widget = widget.cloneNode(true);
      builder.pre.appendChild(widget);
      if (builder.measure) {
        if (size) {
          builder.measure[builder.pos] = widget;
        } else {
          var elt = zeroWidthElement(builder.cm.display.measure);
          if (marker.type == 'bookmark' && !marker.insertLeft)
            builder.measure[builder.pos] = builder.pre.appendChild(elt);
          else if (builder.measure[builder.pos])
            return;
          else
            builder.measure[builder.pos] = builder.pre.insertBefore(elt, widget);
        }
        builder.measuredSomething = true;
      }
    }
    builder.pos += size;
  }

  // Outputs a number of spans to make up a line, taking highlighting
  // and marked text into account.
  function insertLineContent(line, builder, styles) {
    var spans = line.markedSpans, allText = line.text, at = 0;
    if (!spans) {
      for (var i = 1; i < styles.length; i+=2)
        builder.addToken(builder, allText.slice(at, at = styles[i]), interpretTokenStyle(styles[i+1], builder));
      return;
    }

    var len = allText.length, pos = 0, i = 1, text = '', style;
    var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, title, collapsed;
    for (;;) {
      if (nextChange == pos) { // Update current marker set
        spanStyle = spanEndStyle = spanStartStyle = title = '';
        collapsed = null; nextChange = Infinity;
        var foundBookmarks = [];
        for (var j = 0; j < spans.length; ++j) {
          var sp = spans[j], m = sp.marker;
          if (sp.from <= pos && (sp.to == null || sp.to > pos)) {
            if (sp.to != null && nextChange > sp.to) {
              nextChange = sp.to; spanEndStyle = ''; 
            }
            if (m.className) spanStyle += ` ${  m.className}`;
            if (m.startStyle && sp.from == pos) spanStartStyle += ` ${  m.startStyle}`;
            if (m.endStyle && sp.to == nextChange) spanEndStyle += ` ${  m.endStyle}`;
            if (m.title && !title) title = m.title;
            if (m.collapsed && (!collapsed || collapsed.marker.size < m.size))
              collapsed = sp;
          } else if (sp.from > pos && nextChange > sp.from) {
            nextChange = sp.from;
          }
          if (m.type == 'bookmark' && sp.from == pos && m.replacedWith) foundBookmarks.push(m);
        }
        if (collapsed && (collapsed.from || 0) == pos) {
          buildCollapsedSpan(builder, (collapsed.to == null ? len : collapsed.to) - pos,
            collapsed.marker, collapsed.from == null);
          if (collapsed.to == null) return collapsed.marker.find();
        }
        if (!collapsed && foundBookmarks.length) for (var j = 0; j < foundBookmarks.length; ++j)
          buildCollapsedSpan(builder, 0, foundBookmarks[j]);
      }
      if (pos >= len) break;

      var upto = Math.min(len, nextChange);
      while (true) {
        if (text) {
          var end = pos + text.length;
          if (!collapsed) {
            var tokenText = end > upto ? text.slice(0, upto - pos) : text;
            builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle,
              spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : '', title);
          }
          if (end >= upto) {
            text = text.slice(upto - pos); pos = upto; break;
          }
          pos = end;
          spanStartStyle = '';
        }
        text = allText.slice(at, at = styles[i++]);
        style = interpretTokenStyle(styles[i++], builder);
      }
    }
  }

  // DOCUMENT DATA STRUCTURE

  function updateDoc(doc, change, markedSpans, selAfter, estimateHeight) {
    function spansFor(n) {
      return markedSpans ? markedSpans[n] : null;
    }
    function update(line, text, spans) {
      updateLine(line, text, spans, estimateHeight);
      signalLater(line, 'change', line, change);
    }

    var from = change.from, to = change.to, text = change.text;
    var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
    var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;

    // First adjust the line structure
    if (from.ch == 0 && to.ch == 0 && lastText == '') {
      // This is a whole-line replace. Treated specially to make
      // sure line objects move the way they are supposed to.
      for (var i = 0, e = text.length - 1, added = []; i < e; ++i)
        added.push(new Line(text[i], spansFor(i), estimateHeight));
      update(lastLine, lastLine.text, lastSpans);
      if (nlines) doc.remove(from.line, nlines);
      if (added.length) doc.insert(from.line, added);
    } else if (firstLine == lastLine) {
      if (text.length == 1) {
        update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
      } else {
        for (var added = [], i = 1, e = text.length - 1; i < e; ++i)
          added.push(new Line(text[i], spansFor(i), estimateHeight));
        added.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
        update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
        doc.insert(from.line + 1, added);
      }
    } else if (text.length == 1) {
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
      doc.remove(from.line + 1, nlines);
    } else {
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
      update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
      for (var i = 1, e = text.length - 1, added = []; i < e; ++i)
        added.push(new Line(text[i], spansFor(i), estimateHeight));
      if (nlines > 1) doc.remove(from.line + 1, nlines - 1);
      doc.insert(from.line + 1, added);
    }

    signalLater(doc, 'change', doc, change);
    setSelection(doc, selAfter.anchor, selAfter.head, null, true);
  }

  function LeafChunk(lines) {
    this.lines = lines;
    this.parent = null;
    for (var i = 0, e = lines.length, height = 0; i < e; ++i) {
      lines[i].parent = this;
      height += lines[i].height;
    }
    this.height = height;
  }

  LeafChunk.prototype = {
    chunkSize: function () {
      return this.lines.length; 
    },
    removeInner: function (at, n) {
      for (var i = at, e = at + n; i < e; ++i) {
        var line = this.lines[i];
        this.height -= line.height;
        cleanUpLine(line);
        signalLater(line, 'delete');
      }
      this.lines.splice(at, n);
    },
    collapse: function (lines) {
      lines.splice.apply(lines, [lines.length, 0].concat(this.lines));
    },
    insertInner: function (at, lines, height) {
      this.height += height;
      this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
      for (var i = 0, e = lines.length; i < e; ++i) lines[i].parent = this;
    },
    iterN: function (at, n, op) {
      for (var e = at + n; at < e; ++at)
        if (op(this.lines[at])) return true;
    }
  };

  function BranchChunk(children) {
    this.children = children;
    var size = 0, height = 0;
    for (var i = 0, e = children.length; i < e; ++i) {
      var ch = children[i];
      size += ch.chunkSize(); height += ch.height;
      ch.parent = this;
    }
    this.size = size;
    this.height = height;
    this.parent = null;
  }

  BranchChunk.prototype = {
    chunkSize: function () {
      return this.size; 
    },
    removeInner: function (at, n) {
      this.size -= n;
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at < sz) {
          var rm = Math.min(n, sz - at), oldHeight = child.height;
          child.removeInner(at, rm);
          this.height -= oldHeight - child.height;
          if (sz == rm) {
            this.children.splice(i--, 1); child.parent = null; 
          }
          if ((n -= rm) == 0) break;
          at = 0;
        } else at -= sz;
      }
      if (this.size - n < 25) {
        var lines = [];
        this.collapse(lines);
        this.children = [new LeafChunk(lines)];
        this.children[0].parent = this;
      }
    },
    collapse: function (lines) {
      for (var i = 0, e = this.children.length; i < e; ++i) this.children[i].collapse(lines);
    },
    insertInner: function (at, lines, height) {
      this.size += lines.length;
      this.height += height;
      for (var i = 0, e = this.children.length; i < e; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at <= sz) {
          child.insertInner(at, lines, height);
          if (child.lines && child.lines.length > 50) {
            while (child.lines.length > 50) {
              var spilled = child.lines.splice(child.lines.length - 25, 25);
              var newleaf = new LeafChunk(spilled);
              child.height -= newleaf.height;
              this.children.splice(i + 1, 0, newleaf);
              newleaf.parent = this;
            }
            this.maybeSpill();
          }
          break;
        }
        at -= sz;
      }
    },
    maybeSpill: function () {
      if (this.children.length <= 10) return;
      var me = this;
      do {
        var spilled = me.children.splice(me.children.length - 5, 5);
        var sibling = new BranchChunk(spilled);
        if (!me.parent) { // Become the parent node
          var copy = new BranchChunk(me.children);
          copy.parent = me;
          me.children = [copy, sibling];
          me = copy;
        } else {
          me.size -= sibling.size;
          me.height -= sibling.height;
          var myIndex = indexOf(me.parent.children, me);
          me.parent.children.splice(myIndex + 1, 0, sibling);
        }
        sibling.parent = me.parent;
      } while (me.children.length > 10);
      me.parent.maybeSpill();
    },
    iterN: function (at, n, op) {
      for (var i = 0, e = this.children.length; i < e; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at < sz) {
          var used = Math.min(n, sz - at);
          if (child.iterN(at, used, op)) return true;
          if ((n -= used) == 0) break;
          at = 0;
        } else at -= sz;
      }
    }
  };

  var nextDocId = 0;
  var Doc = CodeMirror.Doc = function (text, mode, firstLine) {
    if (!(this instanceof Doc)) return new Doc(text, mode, firstLine);
    if (firstLine == null) firstLine = 0;

    BranchChunk.call(this, [new LeafChunk([new Line('', null)])]);
    this.first = firstLine;
    this.scrollTop = this.scrollLeft = 0;
    this.cantEdit = false;
    this.history = makeHistory();
    this.cleanGeneration = 1;
    this.frontier = firstLine;
    var start = Pos(firstLine, 0);
    this.sel = {from: start, to: start, head: start, anchor: start, shift: false, extend: false, goalColumn: null};
    this.id = ++nextDocId;
    this.modeOption = mode;

    if (typeof text == 'string') text = splitLines(text);
    updateDoc(this, {from: start, to: start, text: text}, null, {head: start, anchor: start});
  };

  Doc.prototype = createObj(BranchChunk.prototype, {
    constructor: Doc,
    iter: function (from, to, op) {
      if (op) this.iterN(from - this.first, to - from, op);
      else this.iterN(this.first, this.first + this.size, from);
    },

    insert: function (at, lines) {
      var height = 0;
      for (var i = 0, e = lines.length; i < e; ++i) height += lines[i].height;
      this.insertInner(at - this.first, lines, height);
    },
    remove: function (at, n) {
      this.removeInner(at - this.first, n); 
    },

    getValue: function (lineSep) {
      var lines = getLines(this, this.first, this.first + this.size);
      if (lineSep === false) return lines;
      return lines.join(lineSep || '\n');
    },
    setValue: function (code) {
      var top = Pos(this.first, 0), last = this.first + this.size - 1;
      makeChange(this, {from: top, to: Pos(last, getLine(this, last).text.length),
        text: splitLines(code), origin: 'setValue'},
      {head: top, anchor: top}, true);
    },
    replaceRange: function (code, from, to, origin) {
      from = clipPos(this, from);
      to = to ? clipPos(this, to) : from;
      replaceRange(this, code, from, to, origin);
    },
    getRange: function (from, to, lineSep) {
      var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
      if (lineSep === false) return lines;
      return lines.join(lineSep || '\n');
    },

    getLine: function (line) {
      var l = this.getLineHandle(line); return l && l.text;
    },
    setLine: function (line, text) {
      if (isLine(this, line))
        replaceRange(this, text, Pos(line, 0), clipPos(this, Pos(line)));
    },
    removeLine: function (line) {
      if (line) replaceRange(this, '', clipPos(this, Pos(line - 1)), clipPos(this, Pos(line)));
      else replaceRange(this, '', Pos(0, 0), clipPos(this, Pos(1, 0)));
    },

    getLineHandle: function (line) {
      if (isLine(this, line)) return getLine(this, line);
    },
    getLineNumber: function (line) {
      return lineNo(line);
    },

    getLineHandleVisualStart: function (line) {
      if (typeof line == 'number') line = getLine(this, line);
      return visualLine(this, line);
    },

    lineCount: function () {
      return this.size;
    },
    firstLine: function () {
      return this.first;
    },
    lastLine: function () {
      return this.first + this.size - 1;
    },

    clipPos: function (pos) {
      return clipPos(this, pos);
    },

    getCursor: function (start) {
      var sel = this.sel, pos;
      if (start == null || start == 'head') pos = sel.head;
      else if (start == 'anchor') pos = sel.anchor;
      else if (start == 'end' || start === false) pos = sel.to;
      else pos = sel.from;
      return copyPos(pos);
    },
    somethingSelected: function () {
      return !posEq(this.sel.head, this.sel.anchor);
    },

    setCursor: docOperation(function (line, ch, extend) {
      var pos = clipPos(this, typeof line == 'number' ? Pos(line, ch || 0) : line);
      if (extend) extendSelection(this, pos);
      else setSelection(this, pos, pos);
    }),
    setSelection: docOperation(function (anchor, head, bias) {
      setSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), bias);
    }),
    extendSelection: docOperation(function (from, to, bias) {
      extendSelection(this, clipPos(this, from), to && clipPos(this, to), bias);
    }),

    getSelection: function (lineSep) {
      return this.getRange(this.sel.from, this.sel.to, lineSep);
    },
    replaceSelection: function (code, collapse, origin) {
      makeChange(this, {from: this.sel.from, to: this.sel.to, text: splitLines(code), origin: origin}, collapse || 'around');
    },
    undo: docOperation(function () {
      makeChangeFromHistory(this, 'undo');
    }),
    redo: docOperation(function () {
      makeChangeFromHistory(this, 'redo');
    }),

    setExtending: function (val) {
      this.sel.extend = val;
    },

    historySize: function () {
      var hist = this.history;
      return {undo: hist.done.length, redo: hist.undone.length};
    },
    clearHistory: function () {
      this.history = makeHistory(this.history.maxGeneration);
    },

    markClean: function () {
      this.cleanGeneration = this.changeGeneration();
    },
    changeGeneration: function () {
      this.history.lastOp = this.history.lastOrigin = null;
      return this.history.generation;
    },
    isClean: function (gen) {
      return this.history.generation == (gen || this.cleanGeneration);
    },

    getHistory: function () {
      return {done: copyHistoryArray(this.history.done),
        undone: copyHistoryArray(this.history.undone)};
    },
    setHistory: function (histData) {
      var hist = this.history = makeHistory(this.history.maxGeneration);
      hist.done = histData.done.slice(0);
      hist.undone = histData.undone.slice(0);
    },

    markText: function (from, to, options) {
      return markText(this, clipPos(this, from), clipPos(this, to), options, 'range');
    },
    setBookmark: function (pos, options) {
      var realOpts = {replacedWith: options && (options.nodeType == null ? options.widget : options),
        insertLeft: options && options.insertLeft};
      pos = clipPos(this, pos);
      return markText(this, pos, pos, realOpts, 'bookmark');
    },
    findMarksAt: function (pos) {
      pos = clipPos(this, pos);
      var markers = [], spans = getLine(this, pos.line).markedSpans;
      if (spans) for (var i = 0; i < spans.length; ++i) {
        var span = spans[i];
        if ((span.from == null || span.from <= pos.ch) &&
            (span.to == null || span.to >= pos.ch))
          markers.push(span.marker.parent || span.marker);
      }
      return markers;
    },
    getAllMarks: function () {
      var markers = [];
      this.iter(function (line) {
        var sps = line.markedSpans;
        if (sps) for (var i = 0; i < sps.length; ++i)
          if (sps[i].from != null) markers.push(sps[i].marker);
      });
      return markers;
    },

    posFromIndex: function (off) {
      var ch, lineNo = this.first;
      this.iter(function (line) {
        var sz = line.text.length + 1;
        if (sz > off) {
          ch = off; return true; 
        }
        off -= sz;
        ++lineNo;
      });
      return clipPos(this, Pos(lineNo, ch));
    },
    indexFromPos: function (coords) {
      coords = clipPos(this, coords);
      var index = coords.ch;
      if (coords.line < this.first || coords.ch < 0) return 0;
      this.iter(this.first, coords.line, function (line) {
        index += line.text.length + 1;
      });
      return index;
    },

    copy: function (copyHistory) {
      var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first);
      doc.scrollTop = this.scrollTop; doc.scrollLeft = this.scrollLeft;
      doc.sel = {from: this.sel.from, to: this.sel.to, head: this.sel.head, anchor: this.sel.anchor,
        shift: this.sel.shift, extend: false, goalColumn: this.sel.goalColumn};
      if (copyHistory) {
        doc.history.undoDepth = this.history.undoDepth;
        doc.setHistory(this.getHistory());
      }
      return doc;
    },

    linkedDoc: function (options) {
      if (!options) options = {};
      var from = this.first, to = this.first + this.size;
      if (options.from != null && options.from > from) from = options.from;
      if (options.to != null && options.to < to) to = options.to;
      var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from);
      if (options.sharedHist) copy.history = this.history;
      (this.linked || (this.linked = [])).push({doc: copy, sharedHist: options.sharedHist});
      copy.linked = [{doc: this, isParent: true, sharedHist: options.sharedHist}];
      return copy;
    },
    unlinkDoc: function (other) {
      if (other instanceof CodeMirror) other = other.doc;
      if (this.linked) for (var i = 0; i < this.linked.length; ++i) {
        var link = this.linked[i];
        if (link.doc != other) continue;
        this.linked.splice(i, 1);
        other.unlinkDoc(this);
        break;
      }
      // If the histories were shared, split them again
      if (other.history == this.history) {
        var splitIds = [other.id];
        linkedDocs(other, function (doc) {
          splitIds.push(doc.id);
        }, true);
        other.history = makeHistory();
        other.history.done = copyHistoryArray(this.history.done, splitIds);
        other.history.undone = copyHistoryArray(this.history.undone, splitIds);
      }
    },
    iterLinkedDocs: function (f) {
      linkedDocs(this, f);
    },

    getMode: function () {
      return this.mode;
    },
    getEditor: function () {
      return this.cm;
    }
  });

  Doc.prototype.eachLine = Doc.prototype.iter;

  // The Doc methods that should be available on CodeMirror instances
  var dontDelegate = 'iter insert remove copy getEditor'.split(' ');
  for (var prop in Doc.prototype) if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)
    CodeMirror.prototype[prop] = (function (method) {
      return function () {
        return method.apply(this.doc, arguments);
      };
    })(Doc.prototype[prop]);

  eventMixin(Doc);

  function linkedDocs(doc, f, sharedHistOnly) {
    function propagate(doc, skip, sharedHist) {
      if (doc.linked) for (var i = 0; i < doc.linked.length; ++i) {
        var rel = doc.linked[i];
        if (rel.doc == skip) continue;
        var shared = sharedHist && rel.sharedHist;
        if (sharedHistOnly && !shared) continue;
        f(rel.doc, shared);
        propagate(rel.doc, doc, shared);
      }
    }
    propagate(doc, null, true);
  }

  function attachDoc(cm, doc) {
    if (doc.cm) throw new Error('This document is already in use.');
    cm.doc = doc;
    doc.cm = cm;
    estimateLineHeights(cm);
    loadMode(cm);
    if (!cm.options.lineWrapping) computeMaxLength(cm);
    cm.options.mode = doc.modeOption;
    regChange(cm);
  }

  // LINE UTILITIES

  function getLine(chunk, n) {
    n -= chunk.first;
    while (!chunk.lines) {
      for (var i = 0;; ++i) {
        var child = chunk.children[i], sz = child.chunkSize();
        if (n < sz) {
          chunk = child; break; 
        }
        n -= sz;
      }
    }
    return chunk.lines[n];
  }

  function getBetween(doc, start, end) {
    var out = [], n = start.line;
    doc.iter(start.line, end.line + 1, function (line) {
      var text = line.text;
      if (n == end.line) text = text.slice(0, end.ch);
      if (n == start.line) text = text.slice(start.ch);
      out.push(text);
      ++n;
    });
    return out;
  }
  function getLines(doc, from, to) {
    var out = [];
    doc.iter(from, to, function (line) {
      out.push(line.text); 
    });
    return out;
  }

  function updateLineHeight(line, height) {
    var diff = height - line.height;
    for (var n = line; n; n = n.parent) n.height += diff;
  }

  function lineNo(line) {
    if (line.parent == null) return null;
    var cur = line.parent, no = indexOf(cur.lines, line);
    for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
      for (var i = 0;; ++i) {
        if (chunk.children[i] == cur) break;
        no += chunk.children[i].chunkSize();
      }
    }
    return no + cur.first;
  }

  function lineAtHeight(chunk, h) {
    var n = chunk.first;
    outer: do {
      for (var i = 0, e = chunk.children.length; i < e; ++i) {
        var child = chunk.children[i], ch = child.height;
        if (h < ch) {
          chunk = child; continue outer; 
        }
        h -= ch;
        n += child.chunkSize();
      }
      return n;
    } while (!chunk.lines);
    for (var i = 0, e = chunk.lines.length; i < e; ++i) {
      var line = chunk.lines[i], lh = line.height;
      if (h < lh) break;
      h -= lh;
    }
    return n + i;
  }

  function heightAtLine(cm, lineObj) {
    lineObj = visualLine(cm.doc, lineObj);

    var h = 0, chunk = lineObj.parent;
    for (var i = 0; i < chunk.lines.length; ++i) {
      var line = chunk.lines[i];
      if (line == lineObj) break;
      else h += line.height;
    }
    for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
      for (var i = 0; i < p.children.length; ++i) {
        var cur = p.children[i];
        if (cur == chunk) break;
        else h += cur.height;
      }
    }
    return h;
  }

  function getOrder(line) {
    var order = line.order;
    if (order == null) order = line.order = bidiOrdering(line.text);
    return order;
  }

  // HISTORY

  function makeHistory(startGen) {
    return {
      // Arrays of history events. Doing something adds an event to
      // done and clears undo. Undoing moves events from done to
      // undone, redoing moves them in the other direction.
      done: [], undone: [], undoDepth: Infinity,
      // Used to track when changes can be merged into a single undo
      // event
      lastTime: 0, lastOp: null, lastOrigin: null,
      // Used by the isClean() method
      generation: startGen || 1, maxGeneration: startGen || 1
    };
  }

  function attachLocalSpans(doc, change, from, to) {
    var existing = change[`spans_${  doc.id}`], n = 0;
    doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function (line) {
      if (line.markedSpans)
        (existing || (existing = change[`spans_${  doc.id}`] = {}))[n] = line.markedSpans;
      ++n;
    });
  }

  function historyChangeFromChange(doc, change) {
    var from = { line: change.from.line, ch: change.from.ch };
    var histChange = {from: from, to: changeEnd(change), text: getBetween(doc, change.from, change.to)};
    attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
    linkedDocs(doc, function (doc) {
      attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
    }, true);
    return histChange;
  }

  function addToHistory(doc, change, selAfter, opId) {
    var hist = doc.history;
    hist.undone.length = 0;
    var time = +new Date, cur = lst(hist.done);

    if (cur &&
        (hist.lastOp == opId ||
         hist.lastOrigin == change.origin && change.origin &&
         ((change.origin.charAt(0) == '+' && doc.cm && hist.lastTime > time - doc.cm.options.historyEventDelay) ||
          change.origin.charAt(0) == '*'))) {
      // Merge this change into the last event
      var last = lst(cur.changes);
      if (posEq(change.from, change.to) && posEq(change.from, last.to)) {
        // Optimized case for simple insertion -- don't want to add
        // new changesets for every character typed
        last.to = changeEnd(change);
      } else {
        // Add new sub-event
        cur.changes.push(historyChangeFromChange(doc, change));
      }
      cur.anchorAfter = selAfter.anchor; cur.headAfter = selAfter.head;
    } else {
      // Can not be merged, start a new event.
      cur = {changes: [historyChangeFromChange(doc, change)],
        generation: hist.generation,
        anchorBefore: doc.sel.anchor, headBefore: doc.sel.head,
        anchorAfter: selAfter.anchor, headAfter: selAfter.head};
      hist.done.push(cur);
      hist.generation = ++hist.maxGeneration;
      while (hist.done.length > hist.undoDepth)
        hist.done.shift();
    }
    hist.lastTime = time;
    hist.lastOp = opId;
    hist.lastOrigin = change.origin;
  }

  function removeClearedSpans(spans) {
    if (!spans) return null;
    for (var i = 0, out; i < spans.length; ++i) {
      if (spans[i].marker.explicitlyCleared) {
        if (!out) out = spans.slice(0, i); 
      } else if (out) out.push(spans[i]);
    }
    return !out ? spans : out.length ? out : null;
  }

  function getOldSpans(doc, change) {
    var found = change[`spans_${  doc.id}`];
    if (!found) return null;
    for (var i = 0, nw = []; i < change.text.length; ++i)
      nw.push(removeClearedSpans(found[i]));
    return nw;
  }

  // Used both to provide a JSON-safe object in .getHistory, and, when
  // detaching a document, to split the history in two
  function copyHistoryArray(events, newGroup) {
    for (var i = 0, copy = []; i < events.length; ++i) {
      var event = events[i], changes = event.changes, newChanges = [];
      copy.push({changes: newChanges, anchorBefore: event.anchorBefore, headBefore: event.headBefore,
        anchorAfter: event.anchorAfter, headAfter: event.headAfter});
      for (var j = 0; j < changes.length; ++j) {
        var change = changes[j], m;
        newChanges.push({from: change.from, to: change.to, text: change.text});
        if (newGroup) for (var prop in change) if (m = prop.match(/^spans_(\d+)$/)) {
          if (indexOf(newGroup, Number(m[1])) > -1) {
            lst(newChanges)[prop] = change[prop];
            delete change[prop];
          }
        }
      }
    }
    return copy;
  }

  // Rebasing/resetting history to deal with externally-sourced changes

  function rebaseHistSel(pos, from, to, diff) {
    if (to < pos.line) {
      pos.line += diff;
    } else if (from < pos.line) {
      pos.line = from;
      pos.ch = 0;
    }
  }

  // Tries to rebase an array of history events given a change in the
  // document. If the change touches the same lines as the event, the
  // event, and everything 'behind' it, is discarded. If the change is
  // before the event, the event's positions are updated. Uses a
  // copy-on-write scheme for the positions, to avoid having to
  // reallocate them all on every rebase, but also avoid problems with
  // shared position objects being unsafely updated.
  function rebaseHistArray(array, from, to, diff) {
    for (var i = 0; i < array.length; ++i) {
      var sub = array[i], ok = true;
      for (var j = 0; j < sub.changes.length; ++j) {
        var cur = sub.changes[j];
        if (!sub.copied) {
          cur.from = copyPos(cur.from); cur.to = copyPos(cur.to); 
        }
        if (to < cur.from.line) {
          cur.from.line += diff;
          cur.to.line += diff;
        } else if (from <= cur.to.line) {
          ok = false;
          break;
        }
      }
      if (!sub.copied) {
        sub.anchorBefore = copyPos(sub.anchorBefore); sub.headBefore = copyPos(sub.headBefore);
        sub.anchorAfter = copyPos(sub.anchorAfter); sub.readAfter = copyPos(sub.headAfter);
        sub.copied = true;
      }
      if (!ok) {
        array.splice(0, i + 1);
        i = 0;
      } else {
        rebaseHistSel(sub.anchorBefore); rebaseHistSel(sub.headBefore);
        rebaseHistSel(sub.anchorAfter); rebaseHistSel(sub.headAfter);
      }
    }
  }

  function rebaseHist(hist, change) {
    var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
    rebaseHistArray(hist.done, from, to, diff);
    rebaseHistArray(hist.undone, from, to, diff);
  }

  // EVENT OPERATORS

  function stopMethod() {
    e_stop(this);
  }
  // Ensure an event has a stop method.
  function addStop(event) {
    if (!event.stop) event.stop = stopMethod;
    return event;
  }

  function e_preventDefault(e) {
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
  }
  function e_stopPropagation(e) {
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  }
  function e_defaultPrevented(e) {
    return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
  }
  function e_stop(e) {
    e_preventDefault(e); e_stopPropagation(e);
  }
  CodeMirror.e_stop = e_stop;
  CodeMirror.e_preventDefault = e_preventDefault;
  CodeMirror.e_stopPropagation = e_stopPropagation;

  function e_target(e) {
    return e.target || e.srcElement;
  }
  function e_button(e) {
    var b = e.which;
    if (b == null) {
      if (e.button & 1) b = 1;
      else if (e.button & 2) b = 3;
      else if (e.button & 4) b = 2;
    }
    if (mac && e.ctrlKey && b == 1) b = 3;
    return b;
  }

  // EVENT HANDLING

  function on(emitter, type, f) {
    if (emitter.addEventListener)
      emitter.addEventListener(type, f, false);
    else if (emitter.attachEvent)
      emitter.attachEvent(`on${  type}`, f);
    else {
      var map = emitter._handlers || (emitter._handlers = {});
      var arr = map[type] || (map[type] = []);
      arr.push(f);
    }
  }

  function off(emitter, type, f) {
    if (emitter.removeEventListener)
      emitter.removeEventListener(type, f, false);
    else if (emitter.detachEvent)
      emitter.detachEvent(`on${  type}`, f);
    else {
      var arr = emitter._handlers && emitter._handlers[type];
      if (!arr) return;
      for (var i = 0; i < arr.length; ++i)
        if (arr[i] == f) {
          arr.splice(i, 1); break; 
        }
    }
  }

  function signal(emitter, type /*, values...*/) {
    var arr = emitter._handlers && emitter._handlers[type];
    if (!arr) return;
    var args = Array.prototype.slice.call(arguments, 2);
    for (var i = 0; i < arr.length; ++i) arr[i].apply(null, args);
  }

  var delayedCallbacks, delayedCallbackDepth = 0;
  function signalLater(emitter, type /*, values...*/) {
    var arr = emitter._handlers && emitter._handlers[type];
    if (!arr) return;
    var args = Array.prototype.slice.call(arguments, 2);
    if (!delayedCallbacks) {
      ++delayedCallbackDepth;
      delayedCallbacks = [];
      setTimeout(fireDelayed, 0);
    }
    function bnd(f) {
      return function (){
        f.apply(null, args);
      };
    }
    for (var i = 0; i < arr.length; ++i)
      delayedCallbacks.push(bnd(arr[i]));
  }

  function signalDOMEvent(cm, e, override) {
    signal(cm, override || e.type, cm, e);
    return e_defaultPrevented(e) || e.codemirrorIgnore;
  }

  function fireDelayed() {
    --delayedCallbackDepth;
    var delayed = delayedCallbacks;
    delayedCallbacks = null;
    for (var i = 0; i < delayed.length; ++i) delayed[i]();
  }

  function hasHandler(emitter, type) {
    var arr = emitter._handlers && emitter._handlers[type];
    return arr && arr.length > 0;
  }

  CodeMirror.on = on; CodeMirror.off = off; CodeMirror.signal = signal;

  function eventMixin(ctor) {
    ctor.prototype.on = function (type, f) {
      on(this, type, f);
    };
    ctor.prototype.off = function (type, f) {
      off(this, type, f);
    };
  }

  // MISC UTILITIES

  // Number of pixels added to scroller and sizer to hide scrollbar
  var scrollerCutOff = 30;

  // Returned or thrown by various protocols to signal 'I'm not
  // handling this'.
  var Pass = CodeMirror.Pass = {toString: function (){
    return 'CodeMirror.Pass';
  }};

  function Delayed() {
    this.id = null;
  }
  Delayed.prototype = {set: function (ms, f) {
    clearTimeout(this.id); this.id = setTimeout(f, ms);
  }};

  // Counts the column offset in a string, taking tabs into account.
  // Used mostly to find indentation.
  function countColumn(string, end, tabSize, startIndex, startValue) {
    if (end == null) {
      end = string.search(/[^\s\u00a0]/);
      if (end == -1) end = string.length;
    }
    for (var i = startIndex || 0, n = startValue || 0; i < end; ++i) {
      if (string.charAt(i) == '\t') n += tabSize - (n % tabSize);
      else ++n;
    }
    return n;
  }
  CodeMirror.countColumn = countColumn;

  var spaceStrs = [''];
  function spaceStr(n) {
    while (spaceStrs.length <= n)
      spaceStrs.push(`${lst(spaceStrs)  } `);
    return spaceStrs[n];
  }

  function lst(arr) {
    return arr[arr.length-1]; 
  }

  function selectInput(node) {
    if (ios) { // Mobile Safari apparently has a bug where select() is broken.
      node.selectionStart = 0;
      node.selectionEnd = node.value.length;
    } else {
      // Suppress mysterious IE10 errors
      try {
        node.select(); 
      } catch(_e) {}
    }
  }

  function indexOf(collection, elt) {
    if (collection.indexOf) return collection.indexOf(elt);
    for (var i = 0, e = collection.length; i < e; ++i)
      if (collection[i] == elt) return i;
    return -1;
  }

  function createObj(base, props) {
    function Obj() {}
    Obj.prototype = base;
    var inst = new Obj();
    if (props) copyObj(props, inst);
    return inst;
  }

  function copyObj(obj, target) {
    if (!target) target = {};
    for (var prop in obj) if (obj.hasOwnProperty(prop)) target[prop] = obj[prop];
    return target;
  }

  function emptyArray(size) {
    for (var a = [], i = 0; i < size; ++i) a.push(undefined);
    return a;
  }

  function bind(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function (){
      return f.apply(null, args);
    };
  }

  var nonASCIISingleCaseWordChar = /[\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
  function isWordChar(ch) {
    return /\w/.test(ch) || ch > '\x80' &&
      (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
  }

  function isEmpty(obj) {
    for (var n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false;
    return true;
  }

  var isExtendingChar = /[\u0300-\u036F\u0483-\u0487\u0488-\u0489\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\uA66F\uA670-\uA672\uA674-\uA67D\uA69F\udc00-\udfff]/;

  // DOM UTILITIES

  function elt(tag, content, className, style) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (style) e.style.cssText = style;
    if (typeof content == 'string') setTextContent(e, content);
    else if (content) for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);
    return e;
  }

  function removeChildren(e) {
    for (var count = e.childNodes.length; count > 0; --count)
      e.removeChild(e.firstChild);
    return e;
  }

  function removeChildrenAndAdd(parent, e) {
    return removeChildren(parent).appendChild(e);
  }

  function setTextContent(e, str) {
    if (ie_lt9) {
      e.innerHTML = '';
      e.appendChild(document.createTextNode(str));
    } else e.textContent = str;
  }

  function getRect(node) {
    return node.getBoundingClientRect();
  }
  CodeMirror.replaceGetRect = function (f) {
    getRect = f; 
  };

  // FEATURE DETECTION

  // Detect drag-and-drop
  var dragAndDrop = function () {
    // There is *some* kind of drag-and-drop support in IE6-8, but I
    // couldn't get it to work yet.
    if (ie_lt9) return false;
    var div = elt('div');
    return 'draggable' in div || 'dragDrop' in div;
  }();

  // For a reason I have yet to figure out, some browsers disallow
  // word wrapping between certain characters *only* if a new inline
  // element is started between them. This makes it hard to reliably
  // measure the position of things, since that requires inserting an
  // extra span. This terribly fragile set of tests matches the
  // character combinations that suffer from this phenomenon on the
  // various browsers.
  function spanAffectsWrapping() {
    return false; 
  }
  if (gecko) // Only for "$'"
    spanAffectsWrapping = function (str, i) {
      return str.charCodeAt(i - 1) == 36 && str.charCodeAt(i) == 39;
    };
  else if (safari && !/Version\/([6-9]|\d\d)\b/.test(navigator.userAgent))
    spanAffectsWrapping = function (str, i) {
      return /\-[^ \-?]|\?[^ !\'\"\),.\-\/:;\?\]\}]/.test(str.slice(i - 1, i + 1));
    };
  else if (webkit && /Chrome\/(?:29|[3-9]\d|\d\d\d)\./.test(navigator.userAgent))
    spanAffectsWrapping = function (str, i) {
      var code = str.charCodeAt(i - 1);
      return code >= 8208 && code <= 8212;
    };
  else if (webkit)
    spanAffectsWrapping = function (str, i) {
      if (i > 1 && str.charCodeAt(i - 1) == 45) {
        if (/\w/.test(str.charAt(i - 2)) && /[^\-?\.]/.test(str.charAt(i))) return true;
        if (i > 2 && /[\d\.,]/.test(str.charAt(i - 2)) && /[\d\.,]/.test(str.charAt(i))) return false;
      }
      return /[~!#%&*)=+}\]\\|\"\.>,:;][({[<]|-[^\-?\.\u2010-\u201f\u2026]|\?[\w~`@#$%\^&*(_=+{[|><]|…[\w~`@#$%\^&*(_=+{[><]/.test(str.slice(i - 1, i + 1));
    };

  var knownScrollbarWidth;
  function scrollbarWidth(measure) {
    if (knownScrollbarWidth != null) return knownScrollbarWidth;
    var test = elt('div', null, null, 'width: 50px; height: 50px; overflow-x: scroll');
    removeChildrenAndAdd(measure, test);
    if (test.offsetWidth)
      knownScrollbarWidth = test.offsetHeight - test.clientHeight;
    return knownScrollbarWidth || 0;
  }

  var zwspSupported;
  function zeroWidthElement(measure) {
    if (zwspSupported == null) {
      var test = elt('span', '\u200b');
      removeChildrenAndAdd(measure, elt('span', [test, document.createTextNode('x')]));
      if (measure.firstChild.offsetHeight != 0)
        zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !ie_lt8;
    }
    if (zwspSupported) return elt('span', '\u200b');
    else return elt('span', '\u00a0', null, 'display: inline-block; width: 1px; margin-right: -1px');
  }

  // See if "".split is the broken IE version, if so, provide an
  // alternative way to split lines.
  var splitLines = '\n\nb'.split(/\n/).length != 3 ? function (string) {
    var pos = 0, result = [], l = string.length;
    while (pos <= l) {
      var nl = string.indexOf('\n', pos);
      if (nl == -1) nl = string.length;
      var line = string.slice(pos, string.charAt(nl - 1) == '\r' ? nl - 1 : nl);
      var rt = line.indexOf('\r');
      if (rt != -1) {
        result.push(line.slice(0, rt));
        pos += rt + 1;
      } else {
        result.push(line);
        pos = nl + 1;
      }
    }
    return result;
  } : function (string){
    return string.split(/\r\n?|\n/);
  };
  CodeMirror.splitLines = splitLines;

  var hasSelection = window.getSelection ? function (te) {
    try {
      return te.selectionStart != te.selectionEnd; 
    } catch(e) {
      return false; 
    }
  } : function (te) {
    try {
      var range = te.ownerDocument.selection.createRange();
    } catch(e) {}
    if (!range || range.parentElement() != te) return false;
    return range.compareEndPoints('StartToEnd', range) != 0;
  };

  var hasCopyEvent = (function () {
    var e = elt('div');
    if ('oncopy' in e) return true;
    e.setAttribute('oncopy', 'return;');
    return typeof e.oncopy == 'function';
  })();

  // KEY NAMING

  var keyNames = {3: 'Enter', 8: 'Backspace', 9: 'Tab', 13: 'Enter', 16: 'Shift', 17: 'Ctrl', 18: 'Alt',
    19: 'Pause', 20: 'CapsLock', 27: 'Esc', 32: 'Space', 33: 'PageUp', 34: 'PageDown', 35: 'End',
    36: 'Home', 37: 'Left', 38: 'Up', 39: 'Right', 40: 'Down', 44: 'PrintScrn', 45: 'Insert',
    46: 'Delete', 59: ';', 91: 'Mod', 92: 'Mod', 93: 'Mod', 109: '-', 107: '=', 127: 'Delete',
    186: ';', 187: '=', 188: ',', 189: '-', 190: '.', 191: '/', 192: '`', 219: '[', 220: '\\',
    221: ']', 222: '\'', 63276: 'PageUp', 63277: 'PageDown', 63275: 'End', 63273: 'Home',
    63234: 'Left', 63232: 'Up', 63235: 'Right', 63233: 'Down', 63302: 'Insert', 63272: 'Delete'};
  CodeMirror.keyNames = keyNames;
  (function () {
    // Number keys
    for (var i = 0; i < 10; i++) keyNames[i + 48] = String(i);
    // Alphabetic keys
    for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);
    // Function keys
    for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = `F${  i}`;
  })();

  // BIDI HELPERS

  function iterateBidiSections(order, from, to, f) {
    if (!order) return f(from, to, 'ltr');
    var found = false;
    for (var i = 0; i < order.length; ++i) {
      var part = order[i];
      if (part.from < to && part.to > from || from == to && part.to == from) {
        f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? 'rtl' : 'ltr');
        found = true;
      }
    }
    if (!found) f(from, to, 'ltr');
  }

  function bidiLeft(part) {
    return part.level % 2 ? part.to : part.from; 
  }
  function bidiRight(part) {
    return part.level % 2 ? part.from : part.to; 
  }

  function lineLeft(line) {
    var order = getOrder(line); return order ? bidiLeft(order[0]) : 0; 
  }
  function lineRight(line) {
    var order = getOrder(line);
    if (!order) return line.text.length;
    return bidiRight(lst(order));
  }

  function lineStart(cm, lineN) {
    var line = getLine(cm.doc, lineN);
    var visual = visualLine(cm.doc, line);
    if (visual != line) lineN = lineNo(visual);
    var order = getOrder(visual);
    var ch = !order ? 0 : order[0].level % 2 ? lineRight(visual) : lineLeft(visual);
    return Pos(lineN, ch);
  }
  function lineEnd(cm, lineN) {
    var merged, line;
    while (merged = collapsedSpanAtEnd(line = getLine(cm.doc, lineN)))
      lineN = merged.find().to.line;
    var order = getOrder(line);
    var ch = !order ? line.text.length : order[0].level % 2 ? lineLeft(line) : lineRight(line);
    return Pos(lineN, ch);
  }

  function compareBidiLevel(order, a, b) {
    var linedir = order[0].level;
    if (a == linedir) return true;
    if (b == linedir) return false;
    return a < b;
  }
  var bidiOther;
  function getBidiPartAt(order, pos) {
    for (var i = 0, found; i < order.length; ++i) {
      var cur = order[i];
      if (cur.from < pos && cur.to > pos) {
        bidiOther = null; return i; 
      }
      if (cur.from == pos || cur.to == pos) {
        if (found == null) {
          found = i;
        } else if (compareBidiLevel(order, cur.level, order[found].level)) {
          bidiOther = found;
          return i;
        } else {
          bidiOther = i;
          return found;
        }
      }
    }
    bidiOther = null;
    return found;
  }

  function moveInLine(line, pos, dir, byUnit) {
    if (!byUnit) return pos + dir;
    do pos += dir;
    while (pos > 0 && isExtendingChar.test(line.text.charAt(pos)));
    return pos;
  }

  // This is somewhat involved. It is needed in order to move
  // 'visually' through bi-directional text -- i.e., pressing left
  // should make the cursor go left, even when in RTL text. The
  // tricky part is the 'jumps', where RTL and LTR text touch each
  // other. This often requires the cursor offset to move more than
  // one unit, in order to visually move one unit.
  function moveVisually(line, start, dir, byUnit) {
    var bidi = getOrder(line);
    if (!bidi) return moveLogically(line, start, dir, byUnit);
    var pos = getBidiPartAt(bidi, start), part = bidi[pos];
    var target = moveInLine(line, start, part.level % 2 ? -dir : dir, byUnit);

    for (;;) {
      if (target > part.from && target < part.to) return target;
      if (target == part.from || target == part.to) {
        if (getBidiPartAt(bidi, target) == pos) return target;
        part = bidi[pos += dir];
        return (dir > 0) == part.level % 2 ? part.to : part.from;
      } else {
        part = bidi[pos += dir];
        if (!part) return null;
        if ((dir > 0) == part.level % 2)
          target = moveInLine(line, part.to, -1, byUnit);
        else
          target = moveInLine(line, part.from, 1, byUnit);
      }
    }
  }

  function moveLogically(line, start, dir, byUnit) {
    var target = start + dir;
    if (byUnit) while (target > 0 && isExtendingChar.test(line.text.charAt(target))) target += dir;
    return target < 0 || target > line.text.length ? null : target;
  }

  // Bidirectional ordering algorithm
  // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
  // that this (partially) implements.

  // One-char codes used for character types:
  // L (L):   Left-to-Right
  // R (R):   Right-to-Left
  // r (AL):  Right-to-Left Arabic
  // 1 (EN):  European Number
  // + (ES):  European Number Separator
  // % (ET):  European Number Terminator
  // n (AN):  Arabic Number
  // , (CS):  Common Number Separator
  // m (NSM): Non-Spacing Mark
  // b (BN):  Boundary Neutral
  // s (B):   Paragraph Separator
  // t (S):   Segment Separator
  // w (WS):  Whitespace
  // N (ON):  Other Neutrals

  // Returns null if characters are ordered as they appear
  // (left-to-right), or an array of sections ({from, to, level}
  // objects) in the order in which they occur visually.
  var bidiOrdering = (function () {
    // Character types for codepoints 0 to 0xff
    var lowTypes = 'bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLL';
    // Character types for codepoints 0x600 to 0x6ff
    var arabicTypes = 'rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmmrrrrrrrrrrrrrrrrrr';
    function charType(code) {
      if (code <= 0xff) return lowTypes.charAt(code);
      else if (0x590 <= code && code <= 0x5f4) return 'R';
      else if (0x600 <= code && code <= 0x6ff) return arabicTypes.charAt(code - 0x600);
      else if (0x700 <= code && code <= 0x8ac) return 'r';
      else return 'L';
    }

    var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
    var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
    // Browsers seem to always treat the boundaries of block elements as being L.
    var outerType = 'L';

    return function (str) {
      if (!bidiRE.test(str)) return false;
      var len = str.length, types = [];
      for (var i = 0, type; i < len; ++i)
        types.push(type = charType(str.charCodeAt(i)));

      // W1. Examine each non-spacing mark (NSM) in the level run, and
      // change the type of the NSM to the type of the previous
      // character. If the NSM is at the start of the level run, it will
      // get the type of sor.
      for (var i = 0, prev = outerType; i < len; ++i) {
        var type = types[i];
        if (type == 'm') types[i] = prev;
        else prev = type;
      }

      // W2. Search backwards from each instance of a European number
      // until the first strong type (R, L, AL, or sor) is found. If an
      // AL is found, change the type of the European number to Arabic
      // number.
      // W3. Change all ALs to R.
      for (var i = 0, cur = outerType; i < len; ++i) {
        var type = types[i];
        if (type == '1' && cur == 'r') types[i] = 'n';
        else if (isStrong.test(type)) {
          cur = type; if (type == 'r') types[i] = 'R'; 
        }
      }

      // W4. A single European separator between two European numbers
      // changes to a European number. A single common separator between
      // two numbers of the same type changes to that type.
      for (var i = 1, prev = types[0]; i < len - 1; ++i) {
        var type = types[i];
        if (type == '+' && prev == '1' && types[i+1] == '1') types[i] = '1';
        else if (type == ',' && prev == types[i+1] &&
                 (prev == '1' || prev == 'n')) types[i] = prev;
        prev = type;
      }

      // W5. A sequence of European terminators adjacent to European
      // numbers changes to all European numbers.
      // W6. Otherwise, separators and terminators change to Other
      // Neutral.
      for (var i = 0; i < len; ++i) {
        var type = types[i];
        if (type == ',') types[i] = 'N';
        else if (type == '%') {
          for (var end = i + 1; end < len && types[end] == '%'; ++end) {}
          var replace = (i && types[i-1] == '!') || (end < len - 1 && types[end] == '1') ? '1' : 'N';
          for (var j = i; j < end; ++j) types[j] = replace;
          i = end - 1;
        }
      }

      // W7. Search backwards from each instance of a European number
      // until the first strong type (R, L, or sor) is found. If an L is
      // found, then change the type of the European number to L.
      for (var i = 0, cur = outerType; i < len; ++i) {
        var type = types[i];
        if (cur == 'L' && type == '1') types[i] = 'L';
        else if (isStrong.test(type)) cur = type;
      }

      // N1. A sequence of neutrals takes the direction of the
      // surrounding strong text if the text on both sides has the same
      // direction. European and Arabic numbers act as if they were R in
      // terms of their influence on neutrals. Start-of-level-run (sor)
      // and end-of-level-run (eor) are used at level run boundaries.
      // N2. Any remaining neutrals take the embedding direction.
      for (var i = 0; i < len; ++i) {
        if (isNeutral.test(types[i])) {
          for (var end = i + 1; end < len && isNeutral.test(types[end]); ++end) {}
          var before = (i ? types[i-1] : outerType) == 'L';
          var after = (end < len - 1 ? types[end] : outerType) == 'L';
          var replace = before || after ? 'L' : 'R';
          for (var j = i; j < end; ++j) types[j] = replace;
          i = end - 1;
        }
      }

      // Here we depart from the documented algorithm, in order to avoid
      // building up an actual levels array. Since there are only three
      // levels (0, 1, 2) in an implementation that doesn't take
      // explicit embedding into account, we can build up the order on
      // the fly, without following the level-based algorithm.
      var order = [], m;
      for (var i = 0; i < len;) {
        if (countsAsLeft.test(types[i])) {
          var start = i;
          for (++i; i < len && countsAsLeft.test(types[i]); ++i) {}
          order.push({from: start, to: i, level: 0});
        } else {
          var pos = i, at = order.length;
          for (++i; i < len && types[i] != 'L'; ++i) {}
          for (var j = pos; j < i;) {
            if (countsAsNum.test(types[j])) {
              if (pos < j) order.splice(at, 0, {from: pos, to: j, level: 1});
              var nstart = j;
              for (++j; j < i && countsAsNum.test(types[j]); ++j) {}
              order.splice(at, 0, {from: nstart, to: j, level: 2});
              pos = j;
            } else ++j;
          }
          if (pos < i) order.splice(at, 0, {from: pos, to: i, level: 1});
        }
      }
      if (order[0].level == 1 && (m = str.match(/^\s+/))) {
        order[0].from = m[0].length;
        order.unshift({from: 0, to: m[0].length, level: 0});
      }
      if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
        lst(order).to -= m[0].length;
        order.push({from: len - m[0].length, to: len, level: 0});
      }
      if (order[0].level != lst(order).level)
        order.push({from: len, to: len, level: order[0].level});

      return order;
    };
  })();

  // THE END

  CodeMirror.version = '3.18.0';

  return CodeMirror;
})();

; browserify_shim__define__module__export__(typeof CodeMirror != "undefined" ? CodeMirror : window.CodeMirror);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],113:[function(require,module,exports){
(function (global){
CodeMirror=global.CodeMirror=require("/Users/ilya/maintained/strider/vendor/CodeMirror/js/codemirror.js");var __browserify_shim_require__=require;(function(e,t,r){CodeMirror.defineMode("shell",function(){function e(e,t){for(var r=t.split(" "),n=0;n<r.length;n++)i[r[n]]=e}function t(e,t){var s=e.sol(),u=e.next();if("'"===u||'"'===u||"`"===u)return t.tokens.unshift(r(u)),n(e,t);if("#"===u)return s&&e.eat("!")?(e.skipToEnd(),"meta"):(e.skipToEnd(),"comment");if("$"===u)return t.tokens.unshift(o),n(e,t);if("+"===u||"="===u)return"operator";if("-"===u)return e.eat("-"),e.eatWhile(/\w/),"attribute";if(/\d/.test(u)&&(e.eatWhile(/\d/),!/\w/.test(e.peek())))return"number";e.eatWhile(/[\w-]/);var l=e.current();return"="===e.peek()&&/\w+/.test(l)?"def":i.hasOwnProperty(l)?i[l]:null}function r(e){return function(t,r){for(var n,i=!1,s=!1;null!=(n=t.next());){if(n===e&&!s){i=!0;break}if("$"===n&&!s&&"'"!==e){s=!0,t.backUp(1),r.tokens.unshift(o);break}s=!s&&"\\"===n}return!i&&s||r.tokens.shift(),"`"===e||")"===e?"quote":"string"}}function n(e,r){return(r.tokens[0]||t)(e,r)}var i={};e("atom","true false"),e("keyword","if then do else elif while until for in esac fi fin fil done exit set unset export function"),e("builtin","ab awk bash beep cat cc cd chown chmod chroot clear cp curl cut diff echo find gawk gcc get git grep kill killall ln ls make mkdir openssl mv nc node npm ping ps restart rm rmdir sed service sh shopt shred source sort sleep ssh start stop su sudo tee telnet top touch vi vim wall wc wget who write yes zsh");var o=function(e,t){t.tokens.length>1&&e.eat("$");var i=e.next(),o=/\w/;return"{"===i&&(o=/[^}]/),"("===i?(t.tokens[0]=r(")"),n(e,t)):(/\d/.test(i)||(e.eatWhile(o),e.eat("}")),t.tokens.shift(),"def")};return{startState:function(){return{tokens:[]}},token:function(e,t){return e.eatSpace()?null:n(e,t)}}}),CodeMirror.defineMIME("text/x-sh","shell")}).call(global,module,void 0,void 0);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"/Users/ilya/maintained/strider/vendor/CodeMirror/js/codemirror.js":112}],114:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */


(function (factory){
  'use strict';

  if( typeof define === 'function' && define.amd ){
    define(factory);
  } else if( typeof module != 'undefined' && typeof module.exports != 'undefined' ){
    module.exports = factory();
  } else {
    window['Sortable'] = factory();
  }
})(function (){
  'use strict';

  var
		  dragEl,
		 ghostEl,
		 rootEl,
		 nextEl,

		 lastEl,
		 lastCSS,
		 lastRect,

		 activeGroup,

		 tapEvt,
		 touchEvt,

		 expando = `Sortable${  (new Date).getTime()}`,

    win = window,
		 document = win.document,
		 parseInt = win.parseInt,
		 supportIEdnd = !!document.createElement('div').dragDrop,

		 _silent = false,

		 _createEvent = function (event/**String*/, item/**HTMLElement*/){
      var evt = document.createEvent('Event');
      evt.initEvent(event, true, true);
      evt.item = item;
      return evt;
    },

		 noop = function (){},
		 slice = [].slice,

		 touchDragOverListeners = []
	;



	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}       [options]
	 */
  function Sortable(el, options){
    this.el = el; // root element
    this.options = options = (options || {});


    // Defaults
    options.group = options.group || Math.random();
    options.store = options.store || null;
    options.handle = options.handle || null;
    options.draggable = options.draggable || el.children[0] && el.children[0].nodeName || (/[uo]l/i.test(el.nodeName) ? 'li' : '*');
    options.ghostClass = options.ghostClass || 'sortable-ghost';
    options.ignore = options.ignore || 'a, img';


    // Define events
    'onAdd onUpdate onRemove onStart onEnd'.split(' ').forEach(function (name) {
      options[name] = _bind(this, options[name] || noop);
    });


    // Export group name
    el[expando] = options.group;


    // Bind all private methods
    for( var fn in this ){
      if( fn.charAt(0) === '_' ){
        this[fn] = _bind(this, this[fn]);
      }
    }


    // Bind events
    _on(el, 'add', options.onAdd);
    _on(el, 'update', options.onUpdate);
    _on(el, 'remove', options.onRemove);
    _on(el, 'start', options.onStart);
    _on(el, 'stop', options.onEnd);

    _on(el, 'mousedown', this._onTapStart);
    _on(el, 'touchstart', this._onTapStart);
    supportIEdnd && _on(el, 'selectstart', this._onTapStart);

    _on(el, 'dragover', this._onDragOver);
    _on(el, 'dragenter', this._onDragOver);

    touchDragOverListeners.push(this._onDragOver);

    // Restore sorting
    options.store && this.sort(options.store.get(this));
  }


  Sortable.prototype = /** @lends Sortable.prototype */ {
    constructor: Sortable,


    _applyEffects: function (){
      _toggleClass(dragEl, this.options.ghostClass, true);
    },


    _onTapStart: function (evt/**Event|TouchEvent*/){
      var
				  touch = evt.touches && evt.touches[0],
				 target = (touch || evt).target,
				 options =  this.options,
				 el = this.el
			;

      if( options.handle ){
        target = _closest(target, options.handle, el);
      }

      target = _closest(target, options.draggable, el);

      // IE 9 Support
      if( target && evt.type == 'selectstart' ){
        if( target.tagName != 'A' && target.tagName != 'IMG'){
          target.dragDrop();
        }
      }

      if( target && !dragEl && (target.parentNode === el) ){
        tapEvt = evt;

        rootEl = this.el;
        dragEl = target;
        nextEl = dragEl.nextSibling;
        activeGroup = this.options.group;

        dragEl.draggable = true;

        // Disable "draggable"
        options.ignore.split(',').forEach(function (criteria) {
          _find(target, criteria.trim(), _disableDraggable);
        });

        if( touch ){
          // Touch device support
          tapEvt = {
						  target:  target,
						 clientX: touch.clientX,
						 clientY: touch.clientY
          };

          this._onDragStart(tapEvt, true);
          evt.preventDefault();
        }

        _on(document, 'mouseup', this._onDrop);
        _on(document, 'touchend', this._onDrop);
        _on(document, 'touchcancel', this._onDrop);

        _on(this.el, 'dragstart', this._onDragStart);
        _on(this.el, 'dragend', this._onDrop);
        _on(document, 'dragover', _globalDragOver);


        try {
          if( document.selection ){
            document.selection.empty();
          } else {
            window.getSelection().removeAllRanges();
          }
        } catch (err){ }


        dragEl.dispatchEvent(_createEvent('start', dragEl));
      }
    },

    _emulateDragOver: function (){
      if( touchEvt ){
        _css(ghostEl, 'display', 'none');

        var
					  target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
					 parent = target,
					 group = this.options.group,
					 i = touchDragOverListeners.length
				;

        if( parent ){
          do {
            if( parent[expando] === group ){
              while( i-- ){
                touchDragOverListeners[i]({
                  clientX: touchEvt.clientX,
                  clientY: touchEvt.clientY,
                  target: target,
                  rootEl: parent
                });
              }
              break;
            }

            target = parent; // store last element
          }
          while( parent = parent.parentNode );
        }

        _css(ghostEl, 'display', '');
      }
    },


    _onTouchMove: function (evt/**TouchEvent*/){
      if( tapEvt ){
        var
					  touch = evt.touches[0],
					 dx = touch.clientX - tapEvt.clientX,
					 dy = touch.clientY - tapEvt.clientY,
					 translate3d = `translate3d(${  dx  }px,${  dy  }px,0)`
				;

        touchEvt = touch;

        _css(ghostEl, 'webkitTransform', translate3d);
        _css(ghostEl, 'mozTransform', translate3d);
        _css(ghostEl, 'msTransform', translate3d);
        _css(ghostEl, 'transform', translate3d);

        evt.preventDefault();
      }
    },


    _onDragStart: function (evt/**Event*/, isTouch/**Boolean*/){
      var dataTransfer = evt.dataTransfer;

      this._offUpEvents();

      if( isTouch ){
        var
					  rect = dragEl.getBoundingClientRect(),
					 css = _css(dragEl),
					 ghostRect
				;

        ghostEl = dragEl.cloneNode(true);

        _css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
        _css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
        _css(ghostEl, 'width', rect.width);
        _css(ghostEl, 'height', rect.height);
        _css(ghostEl, 'opacity', '0.8');
        _css(ghostEl, 'position', 'fixed');
        _css(ghostEl, 'zIndex', '100000');

        rootEl.appendChild(ghostEl);

        // Fixing dimensions.
        ghostRect = ghostEl.getBoundingClientRect();
        _css(ghostEl, 'width', rect.width*2 - ghostRect.width);
        _css(ghostEl, 'height', rect.height*2 - ghostRect.height);

        // Bind touch events
        _on(document, 'touchmove', this._onTouchMove);
        _on(document, 'touchend', this._onDrop);
        _on(document, 'touchcancel', this._onDrop);

        this._loopId = setInterval(this._emulateDragOver, 150);
      } else {
        dataTransfer.effectAllowed = 'move';
        dataTransfer.setData('Text', dragEl.textContent);

        _on(document, 'drop', this._onDrop);
      }

      setTimeout(this._applyEffects);
    },


    _onDragOver: function (evt/**Event*/){
      if( !_silent && (activeGroup === this.options.group) && (evt.rootEl === void 0 || evt.rootEl === this.el) ){
        var
					  el = this.el,
					 target = _closest(evt.target, this.options.draggable, el)
				;

        if( el.children.length === 0 || el.children[0] === ghostEl || (el === evt.target) && _ghostInBottom(el, evt) ){
          el.appendChild(dragEl);
        } else if( target && target !== dragEl && (target.parentNode[expando] !== void 0) ){
          if( lastEl !== target ){
            lastEl = target;
            lastCSS = _css(target);
            lastRect = target.getBoundingClientRect();
          }


          var
						  rect = lastRect,
						 width = rect.right - rect.left,
						 height = rect.bottom - rect.top,
						 floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display),
						 isWide = (target.offsetWidth > dragEl.offsetWidth),
						 isLong = (target.offsetHeight > dragEl.offsetHeight),
						 halfway = (floating ? (evt.clientX - rect.left)/width : (evt.clientY - rect.top)/height) > .5,
						 nextSibling = target.nextElementSibling,
						 after
					;

          _silent = true;
          setTimeout(_unsilent, 30);

          if( floating ){
            after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
          } else {
            after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
          }

          if( after && !nextSibling ){
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          }
        }
      }
    },

    _offUpEvents: function () {
      _off(document, 'mouseup', this._onDrop);
      _off(document, 'touchmove', this._onTouchMove);
      _off(document, 'touchend', this._onDrop);
      _off(document, 'touchcancel', this._onDrop);
    },

    _onDrop: function (evt/**Event*/){
      clearInterval(this._loopId);

      // Unbind events
      _off(document, 'drop', this._onDrop);
      _off(document, 'dragover', _globalDragOver);

      _off(this.el, 'dragend', this._onDrop);
      _off(this.el, 'dragstart', this._onDragStart);
      _off(this.el, 'selectstart', this._onTapStart);

      this._offUpEvents();

      if( evt ){
        evt.preventDefault();
        evt.stopPropagation();

        if( ghostEl ){
          ghostEl.parentNode.removeChild(ghostEl);
        }

        if( dragEl ){
          _disableDraggable(dragEl);
          _toggleClass(dragEl, this.options.ghostClass, false);

          if( !rootEl.contains(dragEl) ){
            // Remove event
            rootEl.dispatchEvent(_createEvent('remove', dragEl));

            // Add event
            dragEl.dispatchEvent(_createEvent('add', dragEl));
          } else if( dragEl.nextSibling !== nextEl ){
            // Update event
            dragEl.dispatchEvent(_createEvent('update', dragEl));
          }

          dragEl.dispatchEvent(_createEvent('stop', dragEl));
        }

        // Set NULL
        rootEl =
				dragEl =
				ghostEl =
				nextEl =

				tapEvt =
				touchEvt =

				lastEl =
				lastCSS =

				activeGroup = null;

        // Save sorting
        this.options.store && this.options.store.set(this);
      }
    },


    /**
		 * Serializes the item into an array of string.
		 * @returns {String[]}
		 */
    toArray: function () {
      var order = [],
        el,
        children = this.el.children,
        i = 0,
        n = children.length
			;

      for (; i < n; i++) {
        el = children[i];
        order.push(el.getAttribute('data-id') || _generateId(el));
      }

      return order;
    },


    /**
		 * Sorts the elements according to the array.
		 * @param  {String[]}  order  order of the items
		 */
    sort: function (order) {
      var items = {}, el = this.el;

      this.toArray().forEach(function (id, i) {
        items[id] = el.children[i];
      });

      order.forEach(function (id) {
        if (items[id]) {
          el.removeChild(items[id]);
          el.appendChild(items[id]);
        }
      });
    },


    /**
		 * Destroy
		 */
    destroy: function () {
      var el = this.el, options = this.options;

      _off(el, 'add', options.onAdd);
      _off(el, 'update', options.onUpdate);
      _off(el, 'remove', options.onRemove);
      _off(el, 'start', options.onStart);
      _off(el, 'stop', options.onEnd);
      _off(el, 'mousedown', this._onTapStart);
      _off(el, 'touchstart', this._onTapStart);
      _off(el, 'selectstart', this._onTapStart);

      _off(el, 'dragover', this._onDragOver);
      _off(el, 'dragenter', this._onDragOver);

      //remove draggable attributes
      Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
        el.removeAttribute('draggable');
      });

      touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

      this._onDrop();

      this.el = null;
    }
  };


  function _bind(ctx, fn){
    var args = slice.call(arguments, 2);
    return	fn.bind ? fn.bind.apply(fn, [ctx].concat(args)) : function (){
      return fn.apply(ctx, args.concat(slice.call(arguments)));
    };
  }


  function _closest(el, selector, ctx){
    if( selector === '*' ){
      return el;
    } else if( el ){
      ctx = ctx || document;
      selector = selector.split('.');

      var
				  tag = selector.shift().toUpperCase(),
				 re = new RegExp(`\\s(${selector.join('|')})\\s`, 'g')
			;

      do {
        if(
					   (tag === '' || el.nodeName == tag)
					&& (!selector.length || ((` ${el.className} `).match(re) || []).length == selector.length)
        ){
          return	el;
        }
      }
      while( el !== ctx && (el = el.parentNode) );
    }

    return	null;
  }


  function _globalDragOver(evt){
    evt.dataTransfer.dropEffect = 'move';
    evt.preventDefault();
  }


  function _on(el, event, fn){
    el.addEventListener(event, fn, false);
  }


  function _off(el, event, fn){
    el.removeEventListener(event, fn, false);
  }


  function _toggleClass(el, name, state){
    if( el ){
      if( el.classList ){
        el.classList[state ? 'add' : 'remove'](name);
      } else {
        var className = (` ${el.className} `).replace(/\s+/g, ' ').replace(` ${name} `, '');
        el.className = className + (state ? ` ${name}` : '');
      }
    }
  }


  function _css(el, prop, val){
    if( el && el.style ){
      if( val === void 0 ){
        if( document.defaultView && document.defaultView.getComputedStyle ){
          val = document.defaultView.getComputedStyle(el, '');
        } else if( el.currentStyle ){
          val	= el.currentStyle;
        }
        return	prop === void 0 ? val : val[prop];
      } else {
        el.style[prop] = val + (typeof val === 'string' ? '' : 'px');
      }
    }
  }


  function _find(ctx, tagName, iterator){
    if( ctx ){
      var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
      if( iterator ){
        for( ; i < n; i++ ){
          iterator(list[i], i);
        }
      }
      return	list;
    }
    return	[];
  }


  function _disableDraggable(el){
    return el.draggable = false;
  }


  function _unsilent(){
    _silent = false;
  }


  function _ghostInBottom(el, evt){
    var last = el.lastElementChild.getBoundingClientRect();
    return evt.clientY - (last.top + last.height) > 5; // min delta
  }


  /**
	 * Generate id
	 * @param   {HTMLElement} el
	 * @returns {String}
	 * @private
	 */
  function _generateId(el) {
    var str = el.innerHTML + el.className + el.src,
      i = str.length,
      sum = 0
		;
    while (i--) {
      sum += str.charCodeAt(i);
    }
    return sum.toString(36);
  }


  // Export utils
  Sortable.utils = {
    on: _on,
    off: _off,
    css: _css,
    find: _find,
    bind: _bind,
    closest: _closest,
    toggleClass: _toggleClass
  };


  Sortable.version = '0.4.1';


  // Export
  return	Sortable;
});

; browserify_shim__define__module__export__(typeof Sortable != "undefined" ? Sortable : window.Sortable);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],115:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/**
 * bootbox.js v3.3.0
 *
 * http://bootboxjs.com/license.txt
 */
var bootbox = window.bootbox || (function (document, $) {
  /*jshint scripturl:true sub:true */

  var _locale        = 'en',
    _defaultLocale = 'en',
    _animate       = true,
    _backdrop      = 'static',
    _defaultHref   = 'javascript:;',
    _classes       = '',
    _btnClasses    = {},
    _icons         = {},
    /* last var should always be the public object we'll return */
    that           = {};


    /**
     * public API
     */
  that.setLocale = function (locale) {
    for (var i in _locales) {
      if (i == locale) {
        _locale = locale;
        return;
      }
    }
    throw new Error(`Invalid locale: ${locale}`);
  };

  that.addLocale = function (locale, translations) {
    if (typeof _locales[locale] === 'undefined') {
      _locales[locale] = {};
    }
    for (var str in translations) {
      _locales[locale][str] = translations[str];
    }
  };

  that.setIcons = function (icons) {
    _icons = icons;
    if (typeof _icons !== 'object' || _icons === null) {
      _icons = {};
    }
  };

  that.setBtnClasses = function (btnClasses) {
    _btnClasses = btnClasses;
    if (typeof _btnClasses !== 'object' || _btnClasses === null) {
      _btnClasses = {};
    }
  };

  that.alert = function (/*str, label, cb*/) {
    var str   = '',
      label = _translate('OK'),
      cb    = null;

    switch (arguments.length) {
    case 1:
      // no callback, default button label
      str = arguments[0];
      break;
    case 2:
      // callback *or* custom button label dependent on type
      str = arguments[0];
      if (typeof arguments[1] == 'function') {
        cb = arguments[1];
      } else {
        label = arguments[1];
      }
      break;
    case 3:
      // callback and custom button label
      str   = arguments[0];
      label = arguments[1];
      cb    = arguments[2];
      break;
    default:
      throw new Error('Incorrect number of arguments: expected 1-3');
    }

    return that.dialog(str, {
      // only button (ok)
      'label'   : label,
      'icon'    : _icons.OK,
      'class'   : _btnClasses.OK,
      'callback': cb
    }, {
      // ensure that the escape key works; either invoking the user's
      // callback or true to just close the dialog
      'onEscape': cb || true
    });
  };

  that.confirm = function (/*str, labelCancel, labelOk, cb*/) {
    var str         = '',
      labelCancel = _translate('CANCEL'),
      labelOk     = _translate('CONFIRM'),
      cb          = null;

    switch (arguments.length) {
    case 1:
      str = arguments[0];
      break;
    case 2:
      str = arguments[0];
      if (typeof arguments[1] == 'function') {
        cb = arguments[1];
      } else {
        labelCancel = arguments[1];
      }
      break;
    case 3:
      str         = arguments[0];
      labelCancel = arguments[1];
      if (typeof arguments[2] == 'function') {
        cb = arguments[2];
      } else {
        labelOk = arguments[2];
      }
      break;
    case 4:
      str         = arguments[0];
      labelCancel = arguments[1];
      labelOk     = arguments[2];
      cb          = arguments[3];
      break;
    default:
      throw new Error('Incorrect number of arguments: expected 1-4');
    }

    var cancelCallback = function () {
      if (typeof cb === 'function') {
        return cb(false);
      }
    };

    var confirmCallback = function () {
      if (typeof cb === 'function') {
        return cb(true);
      }
    };

    return that.dialog(str, [{
      // first button (cancel)
      'label'   : labelCancel,
      'icon'    : _icons.CANCEL,
      'class'   : _btnClasses.CANCEL,
      'callback': cancelCallback
    }, {
      // second button (confirm)
      'label'   : labelOk,
      'icon'    : _icons.CONFIRM,
      'class'   : _btnClasses.CONFIRM,
      'callback': confirmCallback
    }], {
      // escape key bindings
      'onEscape': cancelCallback
    });
  };

  that.prompt = function (/*str, labelCancel, labelOk, cb, defaultVal*/) {
    var str         = '',
      labelCancel = _translate('CANCEL'),
      labelOk     = _translate('CONFIRM'),
      cb          = null,
      defaultVal  = '';

    switch (arguments.length) {
    case 1:
      str = arguments[0];
      break;
    case 2:
      str = arguments[0];
      if (typeof arguments[1] == 'function') {
        cb = arguments[1];
      } else {
        labelCancel = arguments[1];
      }
      break;
    case 3:
      str         = arguments[0];
      labelCancel = arguments[1];
      if (typeof arguments[2] == 'function') {
        cb = arguments[2];
      } else {
        labelOk = arguments[2];
      }
      break;
    case 4:
      str         = arguments[0];
      labelCancel = arguments[1];
      labelOk     = arguments[2];
      cb          = arguments[3];
      break;
    case 5:
      str         = arguments[0];
      labelCancel = arguments[1];
      labelOk     = arguments[2];
      cb          = arguments[3];
      defaultVal  = arguments[4];
      break;
    default:
      throw new Error('Incorrect number of arguments: expected 1-5');
    }

    var header = str;

    // let's keep a reference to the form object for later
    var form = $('<form></form>');
    form.append(`<input class='input-block-level' autocomplete=off type=text value='${  defaultVal  }' />`);

    var cancelCallback = function () {
      if (typeof cb === 'function') {
        // yep, native prompts dismiss with null, whereas native
        // confirms dismiss with false...
        return cb(null);
      }
    };

    var confirmCallback = function () {
      if (typeof cb === 'function') {
        return cb(form.find('input[type=text]').val());
      }
    };

    var div = that.dialog(form, [{
      // first button (cancel)
      'label'   : labelCancel,
      'icon'    : _icons.CANCEL,
      'class'   : _btnClasses.CANCEL,
      'callback':  cancelCallback
    }, {
      // second button (confirm)
      'label'   : labelOk,
      'icon'    : _icons.CONFIRM,
      'class'   : _btnClasses.CONFIRM,
      'callback': confirmCallback
    }], {
      // prompts need a few extra options
      'header'  : header,
      // explicitly tell dialog NOT to show the dialog...
      'show'    : false,
      'onEscape': cancelCallback
    });

    // ... the reason the prompt needs to be hidden is because we need
    // to bind our own "shown" handler, after creating the modal but
    // before any show(n) events are triggered
    // @see https://github.com/makeusabrew/bootbox/issues/69

    div.on('shown', function () {
      form.find('input[type=text]').focus();

      // ensure that submitting the form (e.g. with the enter key)
      // replicates the behaviour of a normal prompt()
      form.on('submit', function (e) {
        e.preventDefault();
        div.find('.btn-primary').click();
      });
    });

    div.modal('show');

    return div;
  };

  that.dialog = function (str, handlers, options) {
    var buttons    = '',
      callbacks  = [];

    if (!options) {
      options = {};
    }

    // check for single object and convert to array if necessary
    if (typeof handlers === 'undefined') {
      handlers = [];
    } else if (typeof handlers.length == 'undefined') {
      handlers = [handlers];
    }

    var i = handlers.length;
    while (i--) {
      var label    = null,
        href     = null,
        _class   = null,
        icon     = '',
        callback = null;

      if (typeof handlers[i]['label']    == 'undefined' &&
                typeof handlers[i]['class']    == 'undefined' &&
                typeof handlers[i]['callback'] == 'undefined') {
        // if we've got nothing we expect, check for condensed format

        var propCount = 0,      // condensed will only match if this == 1
          property  = null;   // save the last property we found

        // be nicer to count the properties without this, but don't think it's possible...
        for (var j in handlers[i]) {
          property = j;
          if (++propCount > 1) {
            // forget it, too many properties
            break;
          }
        }

        if (propCount == 1 && typeof handlers[i][j] == 'function') {
          // matches condensed format of label -> function
          handlers[i]['label']    = property;
          handlers[i]['callback'] = handlers[i][j];
        }
      }

      if (typeof handlers[i]['callback']== 'function') {
        callback = handlers[i]['callback'];
      }

      if (handlers[i]['class']) {
        _class = handlers[i]['class'];
      } else if (i == handlers.length -1 && handlers.length <= 2) {
        // always add a primary to the main option in a two-button dialog
        _class = 'btn-primary';
      }

      if (handlers[i]['link'] !== true) {
        _class = `btn ${  _class}`;
      }

      if (handlers[i]['label']) {
        label = handlers[i]['label'];
      } else {
        label = `Option ${i+1}`;
      }

      if (handlers[i]['icon']) {
        icon = `<i class='${handlers[i]['icon']}'></i> `;
      }

      if (handlers[i]['href']) {
        href = handlers[i]['href'];
      } else {
        href = _defaultHref;
      }

      buttons = `<a data-handler='${i}' class='${_class}' href='${  href  }'>${icon}${label}</a>${  buttons}`;

      callbacks[i] = callback;
    }

    // @see https://github.com/makeusabrew/bootbox/issues/46#issuecomment-8235302
    // and https://github.com/twitter/bootstrap/issues/4474
    // for an explanation of the inline overflow: hidden
    // @see https://github.com/twitter/bootstrap/issues/4854
    // for an explanation of tabIndex=-1

    var parts = ['<div class=\'bootbox modal\' tabindex=\'-1\' style=\'overflow:hidden;\'>'];

    if (options['header']) {
      var closeButton = '';
      if (typeof options['headerCloseButton'] == 'undefined' || options['headerCloseButton']) {
        closeButton = `<a href='${_defaultHref}' class='close'>&times;</a>`;
      }

      parts.push(`<div class='modal-header'>${closeButton}<h3>${options['header']}</h3></div>`);
    }

    // push an empty body into which we'll inject the proper content later
    parts.push('<div class=\'modal-body\'></div>');

    if (buttons) {
      parts.push(`<div class='modal-footer'>${buttons}</div>`);
    }

    parts.push('</div>');

    var div = $(parts.join('\n'));

    // check whether we should fade in/out
    var shouldFade = (typeof options.animate === 'undefined') ? _animate : options.animate;

    if (shouldFade) {
      div.addClass('fade');
    }

    var optionalClasses = (typeof options.classes === 'undefined') ? _classes : options.classes;
    if (optionalClasses) {
      div.addClass(optionalClasses);
    }

    // now we've built up the div properly we can inject the content whether it was a string or a jQuery object
    div.find('.modal-body').html(str);

    function onCancel(source) {
      // for now source is unused, but it will be in future
      var hideModal = null;
      if (typeof options.onEscape === 'function') {
        // @see https://github.com/makeusabrew/bootbox/issues/91
        hideModal = options.onEscape();
      }

      if (hideModal !== false) {
        div.modal('hide');
      }
    }

    // hook into the modal's keyup trigger to check for the escape key
    div.on('keyup.dismiss.modal', function (e) {
      // any truthy value passed to onEscape will dismiss the dialog
      // as long as the onEscape function (if defined) doesn't prevent it
      if (e.which === 27 && options.onEscape) {
        onCancel('escape');
      }
    });

    // handle close buttons too
    div.on('click', 'a.close', function (e) {
      e.preventDefault();
      onCancel('close');
    });

    // well, *if* we have a primary - give the first dom element focus
    div.on('shown', function () {
      div.find('a.btn-primary:first').focus();
    });

    div.on('hidden', function (e) {
      // @see https://github.com/makeusabrew/bootbox/issues/115
      // allow for the fact hidden events can propagate up from
      // child elements like tooltips
      if (e.target === this) {
        div.remove();
      }
    });

    // wire up button handlers
    div.on('click', '.modal-footer a', function (e) {

      var handler   = $(this).data('handler'),
        cb        = callbacks[handler],
        hideModal = null;

      // sort of @see https://github.com/makeusabrew/bootbox/pull/68 - heavily adapted
      // if we've got a custom href attribute, all bets are off
      if (typeof handler                   !== 'undefined' &&
                typeof handlers[handler]['href'] !== 'undefined') {

        return;
      }

      e.preventDefault();

      if (typeof cb === 'function') {
        hideModal = cb(e);
      }

      // the only way hideModal *will* be false is if a callback exists and
      // returns it as a value. in those situations, don't hide the dialog
      // @see https://github.com/makeusabrew/bootbox/pull/25
      if (hideModal !== false) {
        div.modal('hide');
      }
    });

    // stick the modal right at the bottom of the main body out of the way
    $('body').append(div);

    div.modal({
      // unless explicitly overridden take whatever our default backdrop value is
      backdrop : (typeof options.backdrop  === 'undefined') ? _backdrop : options.backdrop,
      // ignore bootstrap's keyboard options; we'll handle this ourselves (more fine-grained control)
      keyboard : false,
      // @ see https://github.com/makeusabrew/bootbox/issues/69
      // we *never* want the modal to be shown before we can bind stuff to it
      // this method can also take a 'show' option, but we'll only use that
      // later if we need to
      show     : false
    });

    // @see https://github.com/makeusabrew/bootbox/issues/64
    // @see https://github.com/makeusabrew/bootbox/issues/60
    // ...caused by...
    // @see https://github.com/twitter/bootstrap/issues/4781
    div.on('show', function (e) {
      $(document).off('focusin.modal');
    });

    if (typeof options.show === 'undefined' || options.show === true) {
      div.modal('show');
    }

    return div;
  };

  /**
     * #modal is deprecated in v3; it can still be used but no guarantees are
     * made - have never been truly convinced of its merit but perhaps just
     * needs a tidyup and some TLC
     */
  that.modal = function (/*str, label, options*/) {
    var str;
    var label;
    var options;

    var defaultOptions = {
      'onEscape': null,
      'keyboard': true,
      'backdrop': _backdrop
    };

    switch (arguments.length) {
    case 1:
      str = arguments[0];
      break;
    case 2:
      str = arguments[0];
      if (typeof arguments[1] == 'object') {
        options = arguments[1];
      } else {
        label = arguments[1];
      }
      break;
    case 3:
      str     = arguments[0];
      label   = arguments[1];
      options = arguments[2];
      break;
    default:
      throw new Error('Incorrect number of arguments: expected 1-3');
    }

    defaultOptions['header'] = label;

    if (typeof options == 'object') {
      options = $.extend(defaultOptions, options);
    } else {
      options = defaultOptions;
    }

    return that.dialog(str, [], options);
  };


  that.hideAll = function () {
    $('.bootbox').modal('hide');
  };

  that.animate = function (animate) {
    _animate = animate;
  };

  that.backdrop = function (backdrop) {
    _backdrop = backdrop;
  };

  that.classes = function (classes) {
    _classes = classes;
  };

  /**
     * private API
     */

  /**
     * standard locales. Please add more according to ISO 639-1 standard. Multiple language variants are
     * unlikely to be required. If this gets too large it can be split out into separate JS files.
     */
  var _locales = {
    'br' : {
      OK      : 'OK',
      CANCEL  : 'Cancelar',
      CONFIRM : 'Sim'
    },
    'da' : {
      OK      : 'OK',
      CANCEL  : 'Annuller',
      CONFIRM : 'Accepter'
    },
    'de' : {
      OK      : 'OK',
      CANCEL  : 'Abbrechen',
      CONFIRM : 'Akzeptieren'
    },
    'en' : {
      OK      : 'OK',
      CANCEL  : 'Cancel',
      CONFIRM : 'OK'
    },
    'es' : {
      OK      : 'OK',
      CANCEL  : 'Cancelar',
      CONFIRM : 'Aceptar'
    },
    'fr' : {
      OK      : 'OK',
      CANCEL  : 'Annuler',
      CONFIRM : 'D\'accord'
    },
    'it' : {
      OK      : 'OK',
      CANCEL  : 'Annulla',
      CONFIRM : 'Conferma'
    },
    'nl' : {
      OK      : 'OK',
      CANCEL  : 'Annuleren',
      CONFIRM : 'Accepteren'
    },
    'pl' : {
      OK      : 'OK',
      CANCEL  : 'Anuluj',
      CONFIRM : 'Potwierdź'
    },
    'ru' : {
      OK      : 'OK',
      CANCEL  : 'Отмена',
      CONFIRM : 'Применить'
    },
    'zh_CN' : {
      OK      : 'OK',
      CANCEL  : '取消',
      CONFIRM : '确认'
    },
    'zh_TW' : {
      OK      : 'OK',
      CANCEL  : '取消',
      CONFIRM : '確認'
    }
  };

  function _translate(str, locale) {
    // we assume if no target locale is probided then we should take it from current setting
    if (typeof locale === 'undefined') {
      locale = _locale;
    }
    if (typeof _locales[locale][str] === 'string') {
      return _locales[locale][str];
    }

    // if we couldn't find a lookup then try and fallback to a default translation

    if (locale != _defaultLocale) {
      return _translate(str, _defaultLocale);
    }

    // if we can't do anything then bail out with whatever string was passed in - last resort
    return str;
  }

  return that;

}(document, window.jQuery));

// @see https://github.com/makeusabrew/bootbox/issues/71
window.bootbox = bootbox;

; browserify_shim__define__module__export__(typeof bootbox != "undefined" ? bootbox : window.bootbox);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],116:[function(require,module,exports){
(function (global){

; jQuery = global.jQuery = require("jquery");
; var __browserify_shim_require__=require;(function browserifyShim(module, define, require) {
/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  'use strict'; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap'),
          transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd otransitionend',
            'transition'       : 'transitionend'
          },
          name;

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name];
          }
        }

      }());

      return transitionEnd && {
        end: transitionEnd
      };

    })();

  });

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  'use strict'; // jshint ;_;


  /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]',
    Alert = function (el) {
      $(el).on('click', dismiss, this.close);
    };

  Alert.prototype.close = function (e) {
    var $this = $(this),
      selector = $this.attr('data-target'),
      $parent;

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
    }

    $parent = $(selector);

    e && e.preventDefault();

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent());

    $parent.trigger(e = $.Event('close'));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      $parent
        .trigger('closed')
        .remove();
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement();
  };


  /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert;

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('alert');
      if (!data) $this.data('alert', (data = new Alert(this)));
      if (typeof option == 'string') data[option].call($this);
    });
  };

  $.fn.alert.Constructor = Alert;


  /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };


  /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close);

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  'use strict'; // jshint ;_;


  /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.button.defaults, options);
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled',
      $el = this.$element,
      data = $el.data(),
      val = $el.is('input') ? 'val' : 'html';

    state = `${state  }Text`;
    data.resetText || $el.data('resetText', $el[val]());

    $el[val](data[state] || this.options[state]);

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0);
  };

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]');

    $parent && $parent
      .find('.active')
      .removeClass('active');

    this.$element.toggleClass('active');
  };


  /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button;

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('button'),
        options = typeof option == 'object' && option;
      if (!data) $this.data('button', (data = new Button(this, options)));
      if (option == 'toggle') data.toggle();
      else if (option) data.setState(option);
    });
  };

  $.fn.button.defaults = {
    loadingText: 'loading...'
  };

  $.fn.button.Constructor = Button;


  /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };


  /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target);
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');
    $btn.button('toggle');
  });

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  'use strict'; // jshint ;_;


  /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this));
  };

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false;
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));
      return this;
    },

    getActiveIndex: function () {
      this.$active = this.$element.find('.item.active');
      this.$items = this.$active.parent().children();
      return this.$items.index(this.$active);
    },

    to: function (pos) {
      var activeIndex = this.getActiveIndex(),
        that = this;

      if (pos > (this.$items.length - 1) || pos < 0) return;

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos);
        });
      }

      if (activeIndex == pos) {
        return this.pause().cycle();
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]));
    },

    pause: function (e) {
      if (!e) this.paused = true;
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end);
        this.cycle(true);
      }
      clearInterval(this.interval);
      this.interval = null;
      return this;
    },

    next: function () {
      if (this.sliding) return;
      return this.slide('next');
    },

    prev: function () {
      if (this.sliding) return;
      return this.slide('prev');
    },

    slide: function (type, next) {
      var $active = this.$element.find('.item.active'),
        $next = next || $active[type](),
        isCycling = this.interval,
        direction = type == 'next' ? 'left' : 'right',
        fallback  = type == 'next' ? 'first' : 'last',
        that = this,
        e;

      this.sliding = true;

      isCycling && this.pause();

      $next = $next.length ? $next : this.$element.find('.item')[fallback]();

      e = $.Event('slide', {
        relatedTarget: $next[0],
        direction: direction
      });

      if ($next.hasClass('active')) return;

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active');
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()]);
          $nextIndicator && $nextIndicator.addClass('active');
        });
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $next.addClass(type);
        $next[0].offsetWidth; // force reflow
        $active.addClass(direction);
        $next.addClass(direction);
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active');
          $active.removeClass(['active', direction].join(' '));
          that.sliding = false;
          setTimeout(function () {
            that.$element.trigger('slid'); 
          }, 0);
        });
      } else {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $active.removeClass('active');
        $next.addClass('active');
        this.sliding = false;
        this.$element.trigger('slid');
      }

      isCycling && this.cycle();

      return this;
    }

  };


  /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel;

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('carousel'),
        options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option),
        action = typeof option == 'string' ? option : options.slide;
      if (!data) $this.data('carousel', (data = new Carousel(this, options)));
      if (typeof option == 'number') data.to(option);
      else if (action) data[action]();
      else if (options.interval) data.pause().cycle();
    });
  };

  $.fn.carousel.defaults = {
    interval: 5000,
    pause: 'hover'
  };

  $.fn.carousel.Constructor = Carousel;


  /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href,
      $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')), //strip for ie7
      options = $.extend({}, $target.data(), $this.data()),
      slideIndex;

    $target.carousel(options);

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle();
    }

    e.preventDefault();
  });

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  'use strict'; // jshint ;_;


  /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.collapse.defaults, options);

    if (this.options.parent) {
      this.$parent = $(this.options.parent);
    }

    this.options.toggle && this.toggle();
  };

  Collapse.prototype = {

    constructor: Collapse,

    dimension: function () {
      var hasWidth = this.$element.hasClass('width');
      return hasWidth ? 'width' : 'height';
    },

    show: function () {
      var dimension,
        scroll,
        actives,
        hasData;

      if (this.transitioning || this.$element.hasClass('in')) return;

      dimension = this.dimension();
      scroll = $.camelCase(['scroll', dimension].join('-'));
      actives = this.$parent && this.$parent.find('> .accordion-group > .in');

      if (actives && actives.length) {
        hasData = actives.data('collapse');
        if (hasData && hasData.transitioning) return;
        actives.collapse('hide');
        hasData || actives.data('collapse', null);
      }

      this.$element[dimension](0);
      this.transition('addClass', $.Event('show'), 'shown');
      $.support.transition && this.$element[dimension](this.$element[0][scroll]);
    },

    hide: function () {
      var dimension;
      if (this.transitioning || !this.$element.hasClass('in')) return;
      dimension = this.dimension();
      this.reset(this.$element[dimension]());
      this.transition('removeClass', $.Event('hide'), 'hidden');
      this.$element[dimension](0);
    },

    reset: function (size) {
      var dimension = this.dimension();

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth;

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse');

      return this;
    },

    transition: function (method, startEvent, completeEvent) {
      var that = this,
        complete = function () {
          if (startEvent.type == 'show') that.reset();
          that.transitioning = 0;
          that.$element.trigger(completeEvent);
        };

      this.$element.trigger(startEvent);

      if (startEvent.isDefaultPrevented()) return;

      this.transitioning = 1;

      this.$element[method]('in');

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete();
    },

    toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']();
    }

  };


  /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse;

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('collapse'),
        options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option);
      if (!data) $this.data('collapse', (data = new Collapse(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.collapse.defaults = {
    toggle: true
  };

  $.fn.collapse.Constructor = Collapse;


  /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };


  /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href,
      target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''), //strip for ie7
      option = $(target).data('collapse') ? 'toggle' : $this.data();
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed');
    $(target).collapse(option);
  });

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  'use strict'; // jshint ;_;


  /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]',
    Dropdown = function (element) {
      var $el = $(element).on('click.dropdown.data-api', this.toggle);
      $('html').on('click.dropdown.data-api', function () {
        $el.parent().removeClass('open');
      });
    };

  Dropdown.prototype = {

    constructor: Dropdown,

    toggle: function (e) {
      var $this = $(this),
        $parent,
        isActive;

      if ($this.is('.disabled, :disabled')) return;

      $parent = getParent($this);

      isActive = $parent.hasClass('open');

      clearMenus();

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus);
        }
        $parent.toggleClass('open');
      }

      $this.focus();

      return false;
    },

    keydown: function (e) {
      var $this,
        $items,
        $active,
        $parent,
        isActive,
        index;

      if (!/(38|40|27)/.test(e.keyCode)) return;

      $this = $(this);

      e.preventDefault();
      e.stopPropagation();

      if ($this.is('.disabled, :disabled')) return;

      $parent = getParent($this);

      isActive = $parent.hasClass('open');

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus();
        return $this.click();
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent);

      if (!$items.length) return;

      index = $items.index($items.filter(':focus'));

      if (e.keyCode == 38 && index > 0) index--;                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++;                        // down
      if (!~index) index = 0;

      $items
        .eq(index)
        .focus();
    }

  };

  function clearMenus() {
    $('.dropdown-backdrop').remove();
    $(toggle).each(function () {
      getParent($(this)).removeClass('open');
    });
  }

  function getParent($this) {
    var selector = $this.attr('data-target'),
      $parent;

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
    }

    $parent = selector && $(selector);

    if (!$parent || !$parent.length) $parent = $this.parent();

    return $parent;
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown;

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('dropdown');
      if (!data) $this.data('dropdown', (data = new Dropdown(this)));
      if (typeof option == 'string') data[option].call($this);
    });
  };

  $.fn.dropdown.Constructor = Dropdown;


  /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) {
      e.stopPropagation(); 
    })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', `${toggle  }, [role=menu]` , Dropdown.prototype.keydown);

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  'use strict'; // jshint ;_;


  /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options;
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this));
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote);
  };

  Modal.prototype = {

    constructor: Modal,

    toggle: function () {
      return this[!this.isShown ? 'show' : 'hide']();
    },

    show: function () {
      var that = this,
        e = $.Event('show');

      this.$element.trigger(e);

      if (this.isShown || e.isDefaultPrevented()) return;

      this.isShown = true;

      this.escape();

      this.backdrop(function () {
        var transition = $.support.transition && that.$element.hasClass('fade');

        if (!that.$element.parent().length) {
          that.$element.appendTo(document.body); //don't move modals dom position
        }

        that.$element.show();

        if (transition) {
          that.$element[0].offsetWidth; // force reflow
        }

        that.$element
          .addClass('in')
          .attr('aria-hidden', false);

        that.enforceFocus();

        transition ?
          that.$element.one($.support.transition.end, function () {
            that.$element.focus().trigger('shown'); 
          }) :
          that.$element.focus().trigger('shown');

      });
    },

    hide: function (e) {
      e && e.preventDefault();

      var that = this;

      e = $.Event('hide');

      this.$element.trigger(e);

      if (!this.isShown || e.isDefaultPrevented()) return;

      this.isShown = false;

      this.escape();

      $(document).off('focusin.modal');

      this.$element
        .removeClass('in')
        .attr('aria-hidden', true);

      $.support.transition && this.$element.hasClass('fade') ?
        this.hideWithTransition() :
        this.hideModal();
    },

    enforceFocus: function () {
      var that = this;
      $(document).on('focusin.modal', function (e) {
        if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
          that.$element.focus();
        }
      });
    },

    escape: function () {
      var that = this;
      if (this.isShown && this.options.keyboard) {
        this.$element.on('keyup.dismiss.modal', function ( e ) {
          e.which == 27 && that.hide();
        });
      } else if (!this.isShown) {
        this.$element.off('keyup.dismiss.modal');
      }
    },

    hideWithTransition: function () {
      var that = this,
        timeout = setTimeout(function () {
          that.$element.off($.support.transition.end);
          that.hideModal();
        }, 500);

      this.$element.one($.support.transition.end, function () {
        clearTimeout(timeout);
        that.hideModal();
      });
    },

    hideModal: function () {
      var that = this;
      this.$element.hide();
      this.backdrop(function () {
        that.removeBackdrop();
        that.$element.trigger('hidden');
      });
    },

    removeBackdrop: function () {
      this.$backdrop && this.$backdrop.remove();
      this.$backdrop = null;
    },

    backdrop: function (callback) {
      var that = this,
        animate = this.$element.hasClass('fade') ? 'fade' : '';

      if (this.isShown && this.options.backdrop) {
        var doAnimate = $.support.transition && animate;

        this.$backdrop = $(`<div class="modal-backdrop ${  animate  }" />`)
          .appendTo(document.body);

        this.$backdrop.click(
          this.options.backdrop == 'static' ?
            $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
        );

        if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

        this.$backdrop.addClass('in');

        if (!callback) return;

        doAnimate ?
          this.$backdrop.one($.support.transition.end, callback) :
          callback();

      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass('in');

        $.support.transition && this.$element.hasClass('fade')?
          this.$backdrop.one($.support.transition.end, callback) :
          callback();

      } else if (callback) {
        callback();
      }
    }
  };


  /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal;

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('modal'),
        options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option);
      if (!data) $this.data('modal', (data = new Modal(this, options)));
      if (typeof option == 'string') data[option]();
      else if (options.show) data.show();
    });
  };

  $.fn.modal.defaults = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  $.fn.modal.Constructor = Modal;


  /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };


  /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this),
      href = $this.attr('href'),
      $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))), //strip for ie7
      option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data());

    e.preventDefault();

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus();
      });
  });

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  'use strict'; // jshint ;_;


  /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options);
  };

  Tooltip.prototype = {

    constructor: Tooltip,

    init: function (type, element, options) {
      var eventIn,
        eventOut,
        triggers,
        trigger,
        i;

      this.type = type;
      this.$element = $(element);
      this.options = this.getOptions(options);
      this.enabled = true;

      triggers = this.options.trigger.split(' ');

      for (i = triggers.length; i--;) {
        trigger = triggers[i];
        if (trigger == 'click') {
          this.$element.on(`click.${  this.type}`, this.options.selector, $.proxy(this.toggle, this));
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus';
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur';
          this.$element.on(`${eventIn  }.${  this.type}`, this.options.selector, $.proxy(this.enter, this));
          this.$element.on(`${eventOut  }.${  this.type}`, this.options.selector, $.proxy(this.leave, this));
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle();
    },

    getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay,
          hide: options.delay
        };
      }

      return options;
    },

    enter: function (e) {
      var defaults = $.fn[this.type].defaults,
        options = {},
        self;

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value;
      }, this);

      self = $(e.currentTarget)[this.type](options).data(this.type);

      if (!self.options.delay || !self.options.delay.show) return self.show();

      clearTimeout(this.timeout);
      self.hoverState = 'in';
      this.timeout = setTimeout(function () {
        if (self.hoverState == 'in') self.show();
      }, self.options.delay.show);
    },

    leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type);

      if (this.timeout) clearTimeout(this.timeout);
      if (!self.options.delay || !self.options.delay.hide) return self.hide();

      self.hoverState = 'out';
      this.timeout = setTimeout(function () {
        if (self.hoverState == 'out') self.hide();
      }, self.options.delay.hide);
    },

    show: function () {
      var $tip,
        pos,
        actualWidth,
        actualHeight,
        placement,
        tp,
        e = $.Event('show');

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $tip = this.tip();
        this.setContent();

        if (this.options.animation) {
          $tip.addClass('fade');
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement;

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' });

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);

        pos = this.getPosition();

        actualWidth = $tip[0].offsetWidth;
        actualHeight = $tip[0].offsetHeight;

        switch (placement) {
        case 'bottom':
          tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2};
          break;
        case 'top':
          tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
          break;
        case 'left':
          tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth};
          break;
        case 'right':
          tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width};
          break;
        }

        this.applyPlacement(tp, placement);
        this.$element.trigger('shown');
      }
    },

    applyPlacement: function (offset, placement){
      var $tip = this.tip(),
        width = $tip[0].offsetWidth,
        height = $tip[0].offsetHeight,
        actualWidth,
        actualHeight,
        delta,
        replace;

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in');

      actualWidth = $tip[0].offsetWidth;
      actualHeight = $tip[0].offsetHeight;

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight;
        replace = true;
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0;

        if (offset.left < 0){
          delta = offset.left * -2;
          offset.left = 0;
          $tip.offset(offset);
          actualWidth = $tip[0].offsetWidth;
          actualHeight = $tip[0].offsetHeight;
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left');
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top');
      }

      if (replace) $tip.offset(offset);
    },

    replaceArrow: function (delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (`${50 * (1 - delta / dimension)  }%`) : '');
    },

    setContent: function () {
      var $tip = this.tip(),
        title = this.getTitle();

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
      $tip.removeClass('fade in top bottom left right');
    },

    hide: function () {
      var that = this,
        $tip = this.tip(),
        e = $.Event('hide');

      this.$element.trigger(e);
      if (e.isDefaultPrevented()) return;

      $tip.removeClass('in');

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach();
        }, 500);

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout);
          $tip.detach();
        });
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach();

      this.$element.trigger('hidden');

      return this;
    },

    fixTitle: function () {
      var $e = this.$element;
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
      }
    },

    hasContent: function () {
      return this.getTitle();
    },

    getPosition: function () {
      var el = this.$element[0];
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth,
        height: el.offsetHeight
      }, this.$element.offset());
    },

    getTitle: function () {
      var title,
        $e = this.$element,
        o = this.options;

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title);

      return title;
    },

    tip: function () {
      return this.$tip = this.$tip || $(this.options.template);
    },

    arrow: function (){
      return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
    },

    validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide();
        this.$element = null;
        this.options = null;
      }
    },

    enable: function () {
      this.enabled = true;
    },

    disable: function () {
      this.enabled = false;
    },

    toggleEnabled: function () {
      this.enabled = !this.enabled;
    },

    toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this;
      self.tip().hasClass('in') ? self.hide() : self.show();
    },

    destroy: function () {
      this.hide().$element.off(`.${  this.type}`).removeData(this.type);
    }

  };


  /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip;

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('tooltip'),
        options = typeof option == 'object' && option;
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.tooltip.Constructor = Tooltip;

  $.fn.tooltip.defaults = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false
  };


  /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  'use strict'; // jshint ;_;


  /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options);
  };


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover,

    setContent: function () {
      var $tip = this.tip(),
        title = this.getTitle(),
        content = this.getContent();

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content);

      $tip.removeClass('fade top bottom left right in');
    },

    hasContent: function () {
      return this.getTitle() || this.getContent();
    },

    getContent: function () {
      var content,
        $e = this.$element,
        o = this.options;

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content');

      return content;
    },

    tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template);
      }
      return this.$tip;
    },

    destroy: function () {
      this.hide().$element.off(`.${  this.type}`).removeData(this.type);
    }

  });


  /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover;

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('popover'),
        options = typeof option == 'object' && option;
      if (!data) $this.data('popover', (data = new Popover(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.popover.Constructor = Popover;

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });


  /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  'use strict'; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this),
      $element = $(element).is('body') ? $(window) : $(element),
      href;
    this.options = $.extend({}, $.fn.scrollspy.defaults, options);
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process);
    this.selector = `${this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || ''  } .nav li > a`;
    this.$body = $('body');
    this.refresh();
    this.process();
  }

  ScrollSpy.prototype = {

    constructor: ScrollSpy,

    refresh: function () {
      var self = this,
        $targets;

      this.offsets = $([]);
      this.targets = $([]);

      $targets = this.$body
        .find(this.selector)
        .map(function () {
          var $el = $(this),
            href = $el.data('target') || $el.attr('href'),
            $href = /^#\w/.test(href) && $(href);
          return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null;
        })
        .sort(function (a, b) {
          return a[0] - b[0]; 
        })
        .each(function () {
          self.offsets.push(this[0]);
          self.targets.push(this[1]);
        });
    },

    process: function () {
      var scrollTop = this.$scrollElement.scrollTop() + this.options.offset,
        scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight,
        maxScroll = scrollHeight - this.$scrollElement.height(),
        offsets = this.offsets,
        targets = this.targets,
        activeTarget = this.activeTarget,
        i;

      if (scrollTop >= maxScroll) {
        return activeTarget != (i = targets.last()[0])
            && this.activate ( i );
      }

      for (i = offsets.length; i--;) {
        activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] );
      }
    },

    activate: function (target) {
      var active,
        selector;

      this.activeTarget = target;

      $(this.selector)
        .parent('.active')
        .removeClass('active');

      selector = `${this.selector
      }[data-target="${  target  }"],${
        this.selector  }[href="${  target  }"]`;

      active = $(selector)
        .parent('li')
        .addClass('active');

      if (active.parent('.dropdown-menu').length)  {
        active = active.closest('li.dropdown').addClass('active');
      }

      active.trigger('activate');
    }

  };


  /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy;

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('scrollspy'),
        options = typeof option == 'object' && option;
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.scrollspy.Constructor = ScrollSpy;

  $.fn.scrollspy.defaults = {
    offset: 10
  };


  /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };


  /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      $spy.scrollspy($spy.data());
    });
  });

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  'use strict'; // jshint ;_;


  /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element);
  };

  Tab.prototype = {

    constructor: Tab,

    show: function () {
      var $this = this.element,
        $ul = $this.closest('ul:not(.dropdown-menu)'),
        selector = $this.attr('data-target'),
        previous,
        $target,
        e;

      if (!selector) {
        selector = $this.attr('href');
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return;

      previous = $ul.find('.active:last a')[0];

      e = $.Event('show', {
        relatedTarget: previous
      });

      $this.trigger(e);

      if (e.isDefaultPrevented()) return;

      $target = $(selector);

      this.activate($this.parent('li'), $ul);
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown',
          relatedTarget: previous
        });
      });
    },

    activate: function ( element, container, callback) {
      var $active = container.find('> .active'),
        transition = callback
            && $.support.transition
            && $active.hasClass('fade');

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active');

        element.addClass('active');

        if (transition) {
          element[0].offsetWidth; // reflow for transition
          element.addClass('in');
        } else {
          element.removeClass('fade');
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active');
        }

        callback && callback();
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next();

      $active.removeClass('in');
    }
  };


  /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab;

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('tab');
      if (!data) $this.data('tab', (data = new Tab(this)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.tab.Constructor = Tab;


  /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };


  /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($){

  'use strict'; // jshint ;_;


  /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.typeahead.defaults, options);
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.updater = this.options.updater || this.updater;
    this.source = this.options.source;
    this.$menu = $(this.options.menu);
    this.shown = false;
    this.listen();
  };

  Typeahead.prototype = {

    constructor: Typeahead,

    select: function () {
      var val = this.$menu.find('.active').attr('data-value');
      this.$element
        .val(this.updater(val))
        .change();
      return this.hide();
    },

    updater: function (item) {
      return item;
    },

    show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      });

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height,
          left: pos.left
        })
        .show();

      this.shown = true;
      return this;
    },

    hide: function () {
      this.$menu.hide();
      this.shown = false;
      return this;
    },

    lookup: function (event) {
      var items;

      this.query = this.$element.val();

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this;
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source;

      return items ? this.process(items) : this;
    },

    process: function (items) {
      var that = this;

      items = $.grep(items, function (item) {
        return that.matcher(item);
      });

      items = this.sorter(items);

      if (!items.length) {
        return this.shown ? this.hide() : this;
      }

      return this.render(items.slice(0, this.options.items)).show();
    },

    matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase());
    },

    sorter: function (items) {
      var beginswith = [],
        caseSensitive = [],
        caseInsensitive = [],
        item;

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
        else if (~item.indexOf(this.query)) caseSensitive.push(item);
        else caseInsensitive.push(item);
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    },

    highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
      return item.replace(new RegExp(`(${  query  })`, 'ig'), function ($1, match) {
        return `<strong>${  match  }</strong>`;
      });
    },

    render: function (items) {
      var that = this;

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item);
        i.find('a').html(that.highlighter(item));
        return i[0];
      });

      items.first().addClass('active');
      this.$menu.html(items);
      return this;
    },

    next: function (event) {
      var active = this.$menu.find('.active').removeClass('active'),
        next = active.next();

      if (!next.length) {
        next = $(this.$menu.find('li')[0]);
      }

      next.addClass('active');
    },

    prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active'),
        prev = active.prev();

      if (!prev.length) {
        prev = this.$menu.find('li').last();
      }

      prev.addClass('active');
    },

    listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this));

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this));
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this));
    },

    eventSupported: function (eventName) {
      var isSupported = eventName in this.$element;
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;');
        isSupported = typeof this.$element[eventName] === 'function';
      }
      return isSupported;
    },

    move: function (e) {
      if (!this.shown) return;

      switch(e.keyCode) {
      case 9: // tab
      case 13: // enter
      case 27: // escape
        e.preventDefault();
        break;

      case 38: // up arrow
        e.preventDefault();
        this.prev();
        break;

      case 40: // down arrow
        e.preventDefault();
        this.next();
        break;
      }

      e.stopPropagation();
    },

    keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
      this.move(e);
    },

    keypress: function (e) {
      if (this.suppressKeyPressRepeat) return;
      this.move(e);
    },

    keyup: function (e) {
      switch(e.keyCode) {
      case 40: // down arrow
      case 38: // up arrow
      case 16: // shift
      case 17: // ctrl
      case 18: // alt
        break;

      case 9: // tab
      case 13: // enter
        if (!this.shown) return;
        this.select();
        break;

      case 27: // escape
        if (!this.shown) return;
        this.hide();
        break;

      default:
        this.lookup();
      }

      e.stopPropagation();
      e.preventDefault();
    },

    focus: function (e) {
      this.focused = true;
    },

    blur: function (e) {
      this.focused = false;
      if (!this.mousedover && this.shown) this.hide();
    },

    click: function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.select();
      this.$element.focus();
    },

    mouseenter: function (e) {
      this.mousedover = true;
      this.$menu.find('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    },

    mouseleave: function (e) {
      this.mousedover = false;
      if (!this.focused && this.shown) this.hide();
    }

  };


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead;

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('typeahead'),
        options = typeof option == 'object' && option;
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.typeahead.defaults = {
    source: [],
    items: 8,
    menu: '<ul class="typeahead dropdown-menu"></ul>',
    item: '<li><a href="#"></a></li>',
    minLength: 1
  };

  $.fn.typeahead.Constructor = Typeahead;


  /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old;
    return this;
  };


  /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this);
    if ($this.data('typeahead')) return;
    $this.typeahead($this.data());
  });

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  'use strict'; // jshint ;_;


  /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options);
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () {
        setTimeout($.proxy(this.checkPosition, this), 1); 
      }, this));
    this.$element = $(element);
    this.checkPosition();
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var scrollHeight = $(document).height(),
      scrollTop = this.$window.scrollTop(),
      position = this.$element.offset(),
      offset = this.options.offset,
      offsetBottom = offset.bottom,
      offsetTop = offset.top,
      reset = 'affix affix-top affix-bottom',
      affix;

    if (typeof offset != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top();
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom();

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
        'bottom' : offsetTop != null && scrollTop <= offsetTop ?
          'top'    : false;

    if (this.affixed === affix) return;

    this.affixed = affix;
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null;

    this.$element.removeClass(reset).addClass(`affix${  affix ? `-${  affix}` : ''}`);
  };


  /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix;

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('affix'),
        options = typeof option == 'object' && option;
      if (!data) $this.data('affix', (data = new Affix(this, options)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.affix.Constructor = Affix;

  $.fn.affix.defaults = {
    offset: 0
  };


  /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };


  /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this),
        data = $spy.data();

      data.offset = data.offset || {};

      data.offsetBottom && (data.offset.bottom = data.offsetBottom);
      data.offsetTop && (data.offset.top = data.offsetTop);

      $spy.affix(data);
    });
  });


}(window.jQuery);
}).call(global, module, undefined, undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"jquery":85}],117:[function(require,module,exports){
(function (global){

; jQuery = global.jQuery = require("jquery");
; var __browserify_shim_require__=require;(function browserifyShim(module, define, require) {
/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.3.0
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  $.timeago = function (timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === 'string') {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === 'number') {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: 'ago',
        suffixFromNow: 'from now',
        seconds: 'less than a minute',
        minute: 'about a minute',
        minutes: '%d minutes',
        hour: 'about an hour',
        hours: 'about %d hours',
        day: 'a day',
        days: '%d days',
        month: 'about a month',
        months: '%d months',
        year: 'about a year',
        years: '%d years',
        wordSeparator: ' ',
        numbers: []
      }
    },
    inWords: function (distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator || '';
      if ($l.wordSeparator === undefined) {
        separator = ' '; 
      }
      return $.trim([prefix, words, suffix].join(separator));
    },
    parse: function (iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,''); // remove milliseconds
      s = s.replace(/-/,'/').replace(/-/,'/');
      s = s.replace(/T/,' ').replace(/Z/,' UTC');
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/,' $1$2'); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function (elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr('datetime') : $(elem).attr('title');
      return $t.parse(iso8601);
    },
    isTime: function (elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === 'time'; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function (){
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function (time){
      $(this).data('timeago', { datetime: $t.parse(time) });
      refresh.apply(this);
    },
    updateFromDOM: function (){
      $(this).data('timeago', { datetime: $t.parse( $t.isTime(this) ? $(this).attr('datetime') : $(this).attr('title') ) });
      refresh.apply(this);
    }
  };

  $.fn.timeago = function (action, options) {
    var fn = action ? functions[action] : functions.init;
    if(!fn){
      throw new Error(`Unknown function name '${ action }' for timeago`);
    }
    // each over objects here and call the requested function
    this.each(function (){
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    var data = prepareData(this);
    var $s = $t.settings;

    if (!isNaN(data.datetime)) {
      if ( $s.cutoff == 0 || distance(data.datetime) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data('timeago')) {
      element.data('timeago', { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr('title', element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr('title'))) {
        element.attr('title', text);
      }
    }
    return element.data('timeago');
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement('abbr');
  document.createElement('time');
}));

}).call(global, module, undefined, undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"jquery":85}]},{},[9])


//# sourceMappingURL=bundle.map