(function (){
  function r(e,n,t){
    function o(i,f){
      if(!n[i]){
        if(!e[i]){
          var c='function'==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error(`Cannot find module '${i}'`);throw a.code='MODULE_NOT_FOUND',a;
        }var p=n[i]={exports:{}};e[i][0].call(p.exports,function (r){
          var n=e[i][1][r];return o(n||r);
        },p,p.exports,r,e,n,t);
      }return n[i].exports;
    }for(var u='function'==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o;
  }return r;
})()({1:[function (require,module,exports){
  (function (global){
    'use strict';function AccountController(e,c){
      e.user=user,e.providers=providers,e.accounts=setupAccounts(e.user);var s=c.location.hash;s&&$(`a[href="${s}"]`).tab('show'),e.deleteAccount=function (c){
        if(c.unsaved){
          var s=e.accounts[c.provider].indexOf(c);return e.accounts[c.provider].splice(s,1),s=e.user.accounts.indexOf(c),e.user.accounts.splice(s,1),void e.success('Account removed');
        }$.ajax(`/api/account/${c.provider}/${c.id}`,{type:'DELETE',success:function (){
          var s=e.accounts[c.provider].indexOf(c);e.accounts[c.provider].splice(s,1),s=e.user.accounts.indexOf(c),e.user.accounts.splice(s,1),e.success('Account removed',!0);
        },error:function (c){
          e.error(c&&c.responseText?c.responseText:'Failed to remove account',!0);
        }});
      },e.addAccount=function (c){
        var s=0;e.accounts[c]||(e.accounts[c]=[]);for(var a=0;a<e.accounts[c].length;a++){
          var o=parseInt(e.accounts[c][a].id,10);o>=s&&(s=o+1);
        }var n={id:s,provider:c,title:`${c} ${s}`,last_updated:new Date,config:{},cache:[],unsaved:!0};e.accounts[c].push(n),e.user.accounts.push(n);
      },e.saveAccount=function (c,s,a){
        $.ajax(`/api/account/${c}/${s.id}`,{type:'PUT',data:JSON.stringify(s),contentType:'application/json',error:function (){
          e.error('Unable to save account',!0);
        },success:function (){
          delete s.unsaved,a(),e.success('Account saved',!0);
        }});
      },e.changePassword=function (){
        $.ajax('/api/account/password',{data:{password:e.password},dataType:'json',error:function (){
          e.error('Unable to change password',!0);
        },success:function (){
          e.password='',e.confirm_password='',e.success('Password changed',!0);
        },type:'POST'});
      },e.changeEmail=function (){
        $.ajax('/api/account/email',{data:{email:e.user.email},dataType:'json',error:function (c){
          var s=$.parseJSON(c.responseText);e.error(`Failed to change email: ${s.errors[0].message}`,!0);
        },success:function (){
          e.success('Email successfully changed',!0);
        },type:'POST'});
      },e.changeJobsQuantityOnPage=function (){
        $.ajax('/api/account/jobsQuantityOnPage',{type:'POST',data:{quantity:e.user.jobsQuantityOnPage},dataType:'json',error:function (c){
          var s=$.parseJSON(c.responseText);e.error(`Failed to change jobs quantity on build page: ${s.errors[0].message}`,!0);
        },success:function (){
          e.success('Jobs quantity on build page successfully changed',!0);
        }});
      };
    }function setupAccounts(e){
      var c={};if(!e.accounts||!e.accounts.length)return c;for(var s=0;s<e.accounts.length;s++)c[e.accounts[s].provider]||(c[e.accounts[s].provider]=[]),c[e.accounts[s].provider].push(e.accounts[s]);return c;
    }var $=require('jquery'),user=global.user||{},providers=global.providers||{};module.exports=AccountController;
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'jquery':85}],2:[function (require,module,exports){
  'use strict';function JobController(o,t,n){
    var r=n.id.split('-')[1];o.$watch(`user.jobplugins["${r}"]`,function (t){
      o.config=t;
    });
  }module.exports=JobController;
},{}],3:[function (require,module,exports){
  'use strict';function ProviderController(n,o,c){
    var t=c.id.split('-')[2];n.$watch('account.config',function (o){
      n.config=o;
    }),n.save=function (){
      n.saving=!0,n.saveAccount(t,n.account,function (){
        n.saving=!1;
      });
    };
  }module.exports=ProviderController;
},{}],4:[function (require,module,exports){
  'use strict';var angular=require('angular'),AccountController=require('./controllers/account'),ProviderController=require('./controllers/provider'),JobController=require('./controllers/job'),interpolate=require('../utils/interpolate'),app=angular.module('account',['alerts']).config(['$interpolateProvider',interpolate]).controller('AccountController',['$scope','$window',AccountController]).controller('Account.ProviderController',['$scope','$element','$attrs',ProviderController]).controller('Account.JobController',['$scope','$element','$attrs',JobController]);module.exports=app;
},{'../utils/interpolate':38,'./controllers/account':1,'./controllers/job':2,'./controllers/provider':3,'angular':50}],5:[function (require,module,exports){
  'use strict';module.exports=function (e,s){
    e.message=null,e.error=function (t,o){
      e.message={text:s.trustAsHtml(t),type:'error',showing:!0},o&&e.$root.$digest();
    },e.info=function (t,o){
      e.message={text:s.trustAsHtml(t),type:'info',showing:!0},o&&e.$root.$digest();
    };var t=null,o=null;e.success=function (n,u,i){
      t&&(clearTimeout(t),t=null),o&&(clearTimeout(o),o=null),e.message={text:s.trustAsHtml(`<strong>Done.</strong> ${n}`),type:'success',showing:!0},i||(t=setTimeout(function (){
        e.clearMessage(),e.$digest();
      },5e3)),u&&e.$root.$digest();
    },e.clearMessage=function (){
      o&&clearTimeout(o),e.message&&(e.message.showing=!1),o=setTimeout(function (){
        o=null,e.message=null,e.$digest();
      },1e3);
    };
  };
},{}],6:[function (require,module,exports){
  'use strict';var angular=require('angular'),AlertsController=require('./controllers/alerts'),app=angular.module('alerts',[]).controller('AlertsController',['$scope','$sce',AlertsController]);module.exports=app;
},{'./controllers/alerts':5,'angular':50}],7:[function (require,module,exports){
  'use strict';var AU=require('ansi_up'),ansi_up=new AU.default,stripAnsi=require('strip-ansi');module.exports=function (){
    return function (r,e){
      if(!r)return'';if(r.length>1e5)return r;var n=/^[^\n]*\r[^\n]/.test(r);return r=r.replace(/^[^\n\r]*\u001b\[2K/gm,'').replace(/\u001b\[K[^\n\r]*/g,'').replace(/[^\n]*\r([^\n])/g,'$1').replace(/^[^\n]*\u001b\[0G/gm,''),n&&(r=`\r${r}`),e?stripAnsi(r):ansi_up.ansi_to_html(r);
    };
  };
},{'ansi_up':51,'strip-ansi':106}],8:[function (require,module,exports){
  'use strict';var angular=require('angular'),ansi=require('./filters/ansi');angular.module('ansi',[]).filter('ansi',ansi);
},{'./filters/ansi':7,'angular':50}],9:[function (require,module,exports){
  (function (global){
    'use strict';require('bootstrap');var $=require('jquery'),_=require('lodash'),angular=require('angular'),$navbar=$('.navbar');require('angular-route'),$navbar.find('li').removeClass('active'),$navbar.find(`a[href="${global.location.pathname}"]`).parent().addClass('active'),$('#layout-header').hide(),$('#invite-box').height($('#signup-box').height()),require('ui-bootstrap'),require('ui-codemirror'),require('./account'),require('./config'),require('./plugin-manager'),require('./job-status'),require('./dashboard'),require('./projects'),require('./alerts'),require('./ansi'),require('./moment');var app=angular.module('app',['config','account','plugin-manager','job-status','dashboard','projects']);global.app=app,global.$=$,global.angular=angular,global._=_;
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'./account':4,'./alerts':6,'./ansi':8,'./config':19,'./dashboard':21,'./job-status':25,'./moment':30,'./plugin-manager':34,'./projects':37,'angular':50,'angular-route':48,'bootstrap':116,'jquery':85,'lodash':86,'ui-bootstrap':110,'ui-codemirror':111}],10:[function (require,module,exports){
  (function (global){
    'use strict';function BranchesController(r){
      r.branchName='',r.branches=branches,r.allBranches=allBranches,r.remove=function (e){
        confirm(`Are you sure you want to remove ${e.name}?`)&&(e.loading=!0,r.clearMessage(),$.ajax({url:`/${r.project.name}/branches/`,type:'DELETE',data:{name:e.name},success:function (){
          remove(r.branches,e),r.success(`${e.name} is no longer a configured branch.`,!0);
        },error:function (n,a,s){
          if(e.loading=!1,n&&n.responseText){
            var c=$.parseJSON(n.responseText);r.error(`Error deleting branch: ${c.errors[0]}`,!0);
          }else r.error(`Error deleting branch: ${s}`,!0);
        }}));
      },r.add=function (){
        var e={name:r.branchName};$.ajax({url:`/${r.project.name}/branches/`,type:'POST',data:e,dataType:'json',success:function (e){
          r.branchName='',e.created&&r.branches.push(e.branch),r.success(e.message,!0,!e.created);
        },error:function (e,n,a){
          if(e&&e.responseText){
            var s=$.parseJSON(e.responseText);r.error(`Error adding branch: ${s.errors[0]}`,!0);
          }else r.error(`Error adding branch: ${a}`,!0);
        }});
      },r.changeBranchOrder=function (e){
        r.branches=e,$.ajax({url:`/${r.project.name}/branches/`,type:'PUT',data:JSON.stringify({branches:e}),contentType:'application/json',dataType:'json',success:function (e){
          r.success(e.message,!0,!1);
        },error:function (e,n,a){
          if(e&&e.responseText){
            var s=$.parseJSON(e.responseText);r.error(`Error changing order of branch: ${s.errors[0]}`,!0);
          }else r.error(`Error changing order of branch: ${a}`,!0);
        }});
      },r.clone=function (e){
        var n=prompt('Enter name of the clone',e.name);if(n){
          var a={name:e.name,cloneName:n};$.ajax({url:`/${r.project.name}/branches/`,type:'POST',data:a,dataType:'json',success:function (e){
            r.branchName='',e.created&&r.branches.push(e.branch),r.success(e.message,!0,!e.created);
          },error:function (e,n,a){
            if(e&&e.responseText){
              var s=$.parseJSON(e.responseText);r.error(`Error cloning branch: ${s.errors[0]}`,!0);
            }else r.error(`Error cloning branch: ${a}`,!0);
          }});
        }
      };
    }function remove(r,e){
      r.splice(r.indexOf(e),1);
    }var $=require('jquery'),branches=global.branches||[],allBranches=global.allBranches||[];module.exports=BranchesController;
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'jquery':85}],11:[function (require,module,exports){
  (function (global){
    'use strict';function CollaboratorsController(r){
      r.new_email='',r.new_access=0,r.collaborators=global.collaborators||[],r.remove=function (e){
        confirm(`Are you sure you want to remove ${e.email}?`)&&(e.loading=!0,r.clearMessage(),$.ajax({url:`/${r.project.name}/collaborators/`,type:'DELETE',data:{email:e.email},success:function (){
          remove(r.collaborators,e),r.success(`${e.email} is no longer a collaborator on this project.`,!0);
        },error:function (o,a,s){
          if(e.loading=!1,o&&o.responseText){
            var l=$.parseJSON(o.responseText);r.error(`Error deleting collaborator: ${l.errors[0]}`,!0);
          }else r.error(`Error deleting collaborator: ${s}`,!0);
        }}));
      },r.add=function (){
        var e={email:r.new_email,access:r.new_access||0,gravatar:r.gravatar(r.new_email),owner:!1};$.ajax({url:`/${r.project.name}/collaborators/`,type:'POST',data:e,dataType:'json',success:function (o){
          r.new_access=0,r.new_email='',o.created&&r.collaborators.push(e),r.success(o.message,!0,!o.created);
        },error:function (e,o,a){
          if(e&&e.responseText){
            var s=$.parseJSON(e.responseText);r.error(`Error adding collaborator: ${s.errors[0]}`,!0);
          }else r.error(`Error adding collaborator: ${a}`,!0);
        }});
      };
    }function remove(r,e){
      r.splice(r.indexOf(e),1);
    }var $=require('jquery');module.exports=CollaboratorsController;
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'jquery':85}],12:[function (require,module,exports){
  (function (global){
    'use strict';function ConfigController(n){
      function r(r){
        $('.tab-pane.active, .nav-tabs > li.active').removeClass('active'),$(`#${r}`).addClass('active'),n.selectedTab=r;
      }function e(r){
        var e=_.find(n.branches,{name:r});e&&(n.branch=e),global.sessionStorage.setItem('branchName',n.branch.name),o('tab-branch-settings',n.branch);
      }function o(n,e){
        _.isString(n)||(n=e&&'master'===e.name?'tab-project':'tab-basic'),$(`#${n}-tab-handle`).tab('show'),r(n),$(`a[href='#${n}']`).tab('show');
      }function a(){
        var r=n.branch.plugins;n.configured[n.branch.name]={};for(var e=0;e<r.length;e++)n.configured[n.branch.name][r[e].id]=!0;t();
      }function t(){
        for(var r=n.branch.plugins,e=n.branch,o=n.project,a=[],t=0;t<r.length;t++)a.push({id:r[t].id,enabled:r[t].enabled,showStatus:r[t].showStatus});saveProjectConfig({plugin_order:a},e,o,function (r){
          if(r)return n.error(`Error saving plugin order on branch ${e.name}: ${r}`,!0);n.success(`Plugin order on branch ${e.name} saved.`,!0);
        });
      }function i(r){
        var e;if(n.configured[r.name]={},n.configs[r.name]={},n.runnerConfigs[r.name]={},n.disabled_plugins[r.name]=[],!r.mirror_master){
          e=r.plugins;for(var o=0;o<e.length;o++)n.configured[r.name][e[o].id]=!0,n.configs[r.name][e[o].id]=e[o];
        }for(var a in n.plugins)n.configured[r.name][a]||(n.configs[r.name][a]={id:a,enabled:!0,config:{}},n.disabled_plugins[r.name].push(n.configs[r.name][a]));r.mirror_master||(n.runnerConfigs[r.name][r.runner.id]=r.runner.config);for(var t in n.runners)(r.mirror_master||t!==r.runner.id)&&(n.runnerConfigs[r.name][t]={});
      }n.project=project,n.plugins=plugins,n.runners=runners,n.userIsCreator=userIsCreator,n.userConfigs=userConfigs,n.statusBlocks=statusBlocks,n.configured={},n.branch=n.project.branches[0],n.branches=branches,n.disabled_plugins={},n.configs={},n.runnerConfigs={},n.api_root=`/${n.project.name}/api/`,n.page='config',n.finishedRepeat=function (){
        $('[data-toggle=tab]').on('shown',function (n){
          var r=$(n.target).attr('href');$(r).find('[ui-codemirror]').trigger('refresh');
        });
      },$(function (){
        ({init:function (){
          var n=this;$('a[data-toggle="tab"]').on('show',function (n){
            var e=$(n.target).attr('href').replace('#',''),o=global.location.pathname.split('/').slice(0,4).join('/'),a=global.history.state;r(e),a&&a.tabName===e||global.history.pushState({tabName:e},global.document.title,`${o}/${e}`);
          }),global.onpopstate=function (){
            n.route();
          },this.route();
        },route:function (){
          var n=global.location.pathname.split('/');'config'===n.slice(0,4)[3]&&this.routeConfigPage(n);
        },routeConfigPage:function (r){
          var a=global.sessionStorage.getItem('branchName');a?e(a):global.sessionStorage.removeItem('branchName');var t,i=r[r.length-1];5===r.length&&i.length&&(t=i,o(t,n.branch));
        }}).init();
      }),n.switchToBranch=e,$('[data-toggle=tab]').on('shown',function (n){
        var r=$(n.target).attr('href');$(r).find('[ui-codemirror]').trigger('refresh');
      }),n.switchToTab=o,n.refreshBranches=function (){
        throw new Error('Not implemented');
      },n.setEnabled=function (r,e){
        n.configs[n.branch.name][r].enabled=e,t();
      },n.savePluginOrder=t,n.switchToMaster=function (){
        for(var r=0;r<n.project.branches.length;r++)if('master'===n.project.branches[r].name)return void(n.branch=n.project.branches[r]);
      },n.clearCache=function (){
        n.clearingCache=!0,$.ajax(`/${n.project.name}/cache`,{type:'DELETE',success:function (){
          n.clearingCache=!1,n.success('Cleared the cache',!0);
        },error:function (){
          n.clearingCache=!1,n.error('Failed to clear the cache',!0);
        }});
      },n.$watch('branch.isCustomizable',function (){
        o('tab-branch-settings',n.branch);
      }),n.toggleBranch=function (){
        if(n.branch.mirror_master){
          n.branch.mirror_master=!1,n.branch.isCustomizable=!0;for(var r,e=n.branch.name,o=0;o<n.project.branches.length;o++)if('master'===n.project.branches[o].name){
            r=n.project.branches[o];break;
          }n.branch=$.extend(!0,n.branch,r),n.branch.name=e,i(n.branch);
        }n.saveGeneralBranch(!0);
      },n.mirrorMaster=function (){
        n.branch.mirror_master=!0,n.branch.isCustomizable=!1,delete n.branch.really_mirror_master,n.saveGeneralBranch(!0);
      },n.setRunner=function (r){
        var e=n.runnerConfigs[r];n.branch.runner.id=r,n.branch.runner.config=e,n.saveRunner(r,e);
      },n.reorderPlugins=function (r){
        n.branch.plugins=r,t();
      },n.enablePlugin=function (r,e,o){
        removeDragEl(o.target),n.branch.plugins.splice(e,0,r),_.find(n.branch.plugins,{id:r.id}).enabled=!0;var t=n.disabled_plugins[n.branch.name];t.splice(_.indexOf(_.map(t,'id'),r.id),1),a();
      },n.disablePlugin=function (r,e,o){
        removeDragEl(o.target),n.disabled_plugins[n.branch.name].splice(e,0,r);var t=n.branch.plugins;t.splice(_.indexOf(_.map(t,'id'),r.id),1),a();
      },n.setImgStyle=function (r){
        var e,o=r.id,a=n.plugins,t=a[o];if(t){
          var i=t.icon;i&&(e=`url('/ext/${o}/${i}')`);
        }r.imgStyle={'background-image':e};
      },n.saveGeneralBranch=function (r){
        var e=n.branch,o=n.project,a={active:e.active,privkey:e.privkey,pubkey:e.pubkey,envKeys:e.envKeys,mirror_master:e.mirror_master,deploy_on_green:e.deploy_on_green,deploy_on_pull_request:e.deploy_on_pull_request,runner:e.runner};r&&(a.plugins=e.plugins),saveProjectConfig(a,e,o,function (r){
          if(r)return n.error(`Error saving general config for branch ${e.name}: ${r}`,!0);n.success(`General config for branch ${e.name} saved.`,!0);
        });
      },n.generateKeyPair=function (){
        bootbox.confirm('Really generate a new keypair? This could break things if you have plugins that use the current ones.',function (r){
          r&&$.ajax(`/${n.project.name}/keygen/?branch=${encodeURIComponent(n.branch.name)}`,{type:'POST',success:function (r){
            n.branch.privkey=r.privkey,n.branch.pubkey=r.pubkey,n.success('Generated new ssh keypair',!0);
          }});
        });
      },function (){
        n.project.branches.forEach(function (n){
          i(n);
        });
      }(),n.gravatar=function (n){
        return n?`https://secure.gravatar.com/avatar/${md5(n.toLowerCase())}?d=identicon`:'';
      },n.saveRunner=function (r,e){
        $.ajax({url:`/${n.project.name}/config/branch/runner/id/?branch=${encodeURIComponent(n.branch.name)}`,data:JSON.stringify({id:r,config:e}),contentType:'application/json',type:'PUT',success:function (){
          n.success('Saved runner config.',!0);
        },error:function (e){
          e&&e.responseText&&n.error(`Error setting runner id to ${r}`);
        }});
      },n.runnerConfig=function (r,e,o){
        2===arguments.length&&(o=e,e=r,r=n.branch);var a=n.branch.runner.id;if(arguments.length<2)return n.runnerConfigs[a];$.ajax({url:`/${n.project.name}/config/branch/runner/?branch=${encodeURIComponent(n.branch.name)}`,type:'PUT',contentType:'application/json',data:JSON.stringify(e),success:function (r){
          n.success('Runner config saved.'),n.runnerConfigs[a]=r.config,o(null,r.config),n.$root.$digest();
        },error:function (r,e,a){
          if(r&&r.responseText){
            var t=$.parseJSON(r.responseText);n.error(`Error saving runner config: ${t.errors[0]}`);
          }else n.error(`Error saving runner config: ${a}`);o(),n.$root.$digest();
        }});
      },n.providerConfig=function (r,e){
        if(0===arguments.length)return n.project.provider.config;$.ajax({url:`/${n.project.name}/provider/`,type:'POST',contentType:'application/json',data:JSON.stringify(r),success:function (){
          n.success('Provider config saved.'),e&&e(),n.$root.$digest();
        },error:function (r,o,a){
          r&&r.responseText?n.error(`Error saving provider config: ${r.responseText}`):n.error(`Error saving provider config: ${a}`),e&&e(),n.$root.$digest();
        }});
      },n.pluginConfig=function (r,e,o,a){
        if(3===arguments.length&&(a=o,o=e,e=n.branch),1===arguments.length&&(e=n.branch),!e.mirror_master){
          var t=n.configs[e.name][r];if(arguments.length<3)return t.config;if(null===t)throw console.error(`pluginConfig called for a plugin that's not configured. ${r}`,!0),new Error(`Plugin not configured: ${r}`);$.ajax({url:`/${n.project.name}/config/branch/${r}/?branch=${encodeURIComponent(e.name)}`,type:'PUT',contentType:'application/json',data:JSON.stringify(o),success:function (o){
            n.success(`Config for ${r} on branch ${e.name} saved.`),n.configs[e.name][r].config=o,a(null,o),n.$root.$digest();
          },error:function (o,t,i){
            if(o&&o.responseText){
              var c=$.parseJSON(o.responseText);n.error(`Error saving ${r} config on branch ${e.name}: ${c.errors[0]}`);
            }else n.error(`Error saving ${r} config on branch ${e.name}: ${i}`);a(),n.$root.$digest();
          }});
        }
      },n.deleteProject=function (){
        $.ajax({url:`/${n.project.name}/`,type:'DELETE',success:function (){
          global.location='/';
        },error:function (){
          n.deleting=!1,n.error('failed to remove project',!0);
        }});
      },n.startTest=function (r){
        $.ajax({url:`/${n.project.name}/start`,data:{branch:n.branch.name,type:'TEST_ONLY',page:'config'},type:'POST',success:function (){
          global.location=`/${n.project.name}/`;
        },error:function (e){
          if(e&&e.responseText){
            var o=$.parseJSON(e.responseText);n.error(`Error starting test job for ${r} on branch ${n.branch.name}: ${o.errors[0]}`);
          }
        }});
      },n.startDeploy=function (r){
        $.ajax({url:`/${n.project.name}/start`,data:{branch:n.branch.name,type:'TEST_AND_DEPLOY',page:'config'},type:'POST',success:function (){
          global.location=`/${n.project.name}/`;
        },error:function (e){
          if(e&&e.responseText){
            var o=$.parseJSON(e.responseText);n.error(`Error starting deploy job for ${r} on branch ${n.branch.name}: ${o.errors[0]}`);
          }
        }});
      },n.saveProject=function (){
        $.ajax({url:`/${n.project.name}/config`,type:'PUT',data:JSON.stringify({public:n.project.public}),contentType:'application/json',success:function (){
          n.success('General config saved.',!0);
        },error:function (r,e,o){
          r&&r.responseText?n.error(`Error saving general config: ${r.responseText}`,!0):n.error(`Error saving general config: ${o}`,!0);
        }});
      },n.post=post;
    }function removeDragEl(n){
      n&&n.parentNode&&n.parentNode.removeChild(n);
    }function saveProjectConfig(n,r,e,o){
      $.ajax({url:`/${e.name}/config/branch/?branch=${encodeURIComponent(r.name)}`,type:'PUT',data:JSON.stringify(n),contentType:'application/json',success:function (n){
        o(void 0,n);
      },error:function (n,r,e){
        o(n&&n.responseText||e);
      }});
    }var $=require('jquery'),_=require('lodash'),md5=require('md5'),bootbox=require('bootbox'),post=require('../../utils/post'),branches=global.branches||[],project=global.project||{},plugins=global.plugins||{},runners=global.runners||{},userIsCreator=global.userIsCreator||!1,userConfigs=global.userConfigs||{},statusBlocks=global.statusBlocks||{};module.exports=ConfigController;
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'../../utils/post':43,'bootbox':115,'jquery':85,'lodash':86,'md5':87}],13:[function (require,module,exports){
  (function (global){
    'use strict';function DeactivateController(e){
      e.active=e.panelData.deactivate,e.loading=!1,e.toggleActive=function (){
        e.active=!e.active;var r={url:e.repo.url,active:e.active};$.ajax({url:'/api/repo',type:'POST',data:r,dataType:'json',success:function (){
          e.success(e.active?'Activated':'Deactivated'),e.$root.$digest();
        },error:function (r,t,o){
          if(r&&r.responseText){
            var a=$.parseJSON(r.responseText);e.error(`Error settings active state: ${a.errors[0]}`);
          }else e.error(`Error settings active state: ${o}`);e.active=!e.active,e.$root.$digest();
        }});
      },e.confirmDeleteProject=function (){
        bootbox.confirm('<h2>Really Delete Project Data?</h2><p>This will remove all configuration and history for this project. You can always re-add it on the /projects page</p>','Just kidding','Yes, really',function (r){
          r&&$.ajax({url:'/api/repo',type:'DELETE',data:{url:e.repo.url},success:function (){
            e.success('Project removed.'),e.$root.$digest(),setTimeout(function (){
              global.location='/';
            },500);
          },error:function (r,t,o){
            if(r&&r.responseText){
              var a=$.parseJSON(r.responseText);e.error(`Error deleting project: ${a.errors[0]}`);
            }else e.error(`Error deleting project: ${o}`);e.$root.$digest();
          }});
        });
      };
    }var $=require('jquery'),bootbox=require('bootbox');module.exports=DeactivateController;
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'bootbox':115,'jquery':85}],14:[function (require,module,exports){
  'use strict';function GithubController(o){
    o.removeWebhooks=function (){
      bootbox.confirm('<h2>Really remove the github webhooks?</h2> <p>If you only want to temporarily disable build on commit, go to the "Deactivate" tab','Just kidding','Yes, really',function (e){
        e&&(o.info('Deleting webhooks...'),$.ajax('/api/github/webhooks/unset',{data:{url:o.repo.url},dataType:'json',error:function (){
          o.error('Error removing webhooks.'),o.$root.$digest();
        },success:function (){
          o.success('Webhooks removed.'),o.$root.$digest();
        },type:'POST'}));
      });
    };
  }var $=require('jquery'),bootbox=require('bootbox');module.exports=GithubController;
},{'bootbox':115,'jquery':85}],15:[function (require,module,exports){
  'use strict';function HerokuController(e){
    e.heroku=e.panelData.heroku,e.deploy_on_green=!e.repo.prod_deploy_target||e.repo.prod_deploy_target.deploy_on_green,e.status=e.heroku?'configured':'unconfigured',e.heroku_apps=['@@new@@'],e.which_app='@@new@@',e.apikey='',e.goBack=function (){
      e.status='unconfigured';
    },e.checkApi=function (){
      e.loading=!0,$.ajax('/api/heroku/account_integration',{data:{api_key:e.apikey},dataType:'json',error:function (){
        e.error('Heroku API key invalid'),e.loading=!1,e.$root.$digest();
      },success:function (o){
        e.success('Heroku connected'),e.apikey=o.api_key,e.heroku_apps=o.heroku_apps,e.which_app='@@new@@',e.account_id=o.account_id,e.status='have-api',e.loading=!1,e.$root.$digest();
      },type:'POST'});
    },e.herokuSelect=function (){
      var o=e.which_app;'@@new@@'===o&&(o=e.new_app_name),e.loading=!0,$.ajax('/api/heroku/delivery_integration',{data:{account_id:e.account_id,gh_repo_url:e.repo.url,app_name:o},dataType:'json',error:function (o){
        var r=$.parseJSON(o.responseText);e.error(`Error: ${r.errors[0]}`),e.loading=!1,e.$root.$digest();
      },success:function (){
        e.success('Heroku continuous deployment integration complete.'),e.deploy_on_green=!0,e.which_app='@@new@@',e.new_app_name='',e.heroku={app:o},e.status='configured',e.loading=!1,e.$root.$digest();
      },type:'POST'});
    },e.toggleDeploy=function (){
      e.deploy_on_green=!e.deploy_on_green,e.loading=!0,$.ajax('/api/heroku/config',{data:{url:e.repo.url,deploy_on_green:e.deploy_on_green},error:function (){
        e.error('Error toggling deploy on green.'),e.deploy_on_green=!e.deploy_on_green,e.loading=!1,e.$root.$digest();
      },success:function (){
        e.success(`Deploy on Green ${e.deploy_on_green?'enabled':'disabled'}`),e.loading=!1,e.$root.$digest();
      },type:'POST'});
    },e.removeHeroku=function (){
      $.ajax('/api/heroku/config',{data:{url:e.repo.url,unset_heroku:1},error:function (){
        e.error('Error removing Heroku config.'),e.loading=!1,e.$root.$digest();
      },success:function (){
        e.success('Removed Heroku config.'),e.status='unconfigured',e.loading=!1,e.$root.$digest();
      },type:'POST'});
    };
  }var $=require('jquery');module.exports=HerokuController;
},{'jquery':85}],16:[function (require,module,exports){
  'use strict';function JobController(n,i){
    var o=i.attr('id').split('-').slice(1).join('-');n.saving=!1,n.$watch(`userConfigs["${o}"]`,function (i){
      n.userConfig=i;
    }),n.$watch(`configs[branch.name]["${o}"].config`,function (i){
      n.config=i;
    }),n.save=function (){
      n.saving=!0,n.pluginConfig(o,n.config,function (){
        n.saving=!1;
      });
    };
  }module.exports=JobController;
},{}],17:[function (require,module,exports){
  'use strict';function ProviderController(o){
    o.config=o.providerConfig(),o.saving=!1,o.save=function (){
      o.saving=!0,o.providerConfig(o.config,function (){
        o.saving=!1;
      });
    };
  }module.exports=ProviderController;
},{}],18:[function (require,module,exports){
  'use strict';function RunnerController(n,i){
    var o=i.attr('id').split('-').slice(1).join('-');n.saving=!1,n.$watch(`runnerConfigs[branch.name]["${o}"]`,function (i){
      n.config=i;
    }),n.save=function (){
      n.saving=!0,n.runnerConfig(n.config,function (){
        n.saving=!1;
      });
    };
  }module.exports=RunnerController;
},{}],19:[function (require,module,exports){
  'use strict';var angular=require('angular'),RunnerController=require('./controllers/runner'),ProviderController=require('./controllers/provider'),JobController=require('./controllers/job'),ConfigController=require('./controllers/config'),BranchesController=require('./controllers/branches'),CollaboratorsController=require('./controllers/collaborators'),DeactivateController=require('./controllers/deactivate'),HerokuController=require('./controllers/heroku'),GithubController=require('./controllers/github'),interpolate=require('../utils/interpolate'),ngSortableDirective=require('../utils/ng-sortable-directive'),app=angular.module('config',['ui.bootstrap','ui.codemirror','alerts','moment']).config(['$interpolateProvider',interpolate]).controller('Config',['$scope',ConfigController]).controller('Config.RunnerController',['$scope','$element',RunnerController]).controller('Config.ProviderController',['$scope',ProviderController]).controller('Config.JobController',['$scope','$element',JobController]).controller('BranchesCtrl',['$scope',BranchesController]).controller('CollaboratorsCtrl',['$scope',CollaboratorsController]).controller('DeactivateCtrl',['$scope',DeactivateController]).controller('HerokuController',['$scope',HerokuController]).controller('GithubCtrl',['$scope',GithubController]).directive('ngSortable',['$parse',ngSortableDirective]).directive('repeatEnd',function (){
    return function (r,e,o){
      r.$last&&r.$parent.finishedRepeat&&r.$parent.finishedRepeat(o);
    };
  });module.exports=app;
},{'../utils/interpolate':38,'../utils/ng-sortable-directive':41,'./controllers/branches':10,'./controllers/collaborators':11,'./controllers/config':12,'./controllers/deactivate':13,'./controllers/github':14,'./controllers/heroku':15,'./controllers/job':16,'./controllers/provider':17,'./controllers/runner':18,'angular':50}],20:[function (require,module,exports){
  (function (global){
    'use strict';function determineTargetBranch(e){
      return e.ref?e.ref.branch:'master';
    }function cleanJob(e){
      delete e.phases,delete e.std,delete e.stdout,delete e.stderr,delete e.stdmerged,delete e.plugin_data;
    }function Dashboard(e,t){
      JobMonitor.call(this,e,t.$digest.bind(t)),this.scope=t,this.scope.loadingJobs=!1,this.scope.jobs=global.jobs;
    }var $=require('jquery'),_=require('lodash'),io=require('socket.io-client'),JobMonitor=require('../../utils/job-monitor'),statusClasses=require('../../utils/status-classes');module.exports=function (e){
      var t=io.connect();new Dashboard(t,e),e.statusClasses=statusClasses,e.providers=global.providers,e.phases=['environment','prepare','test','deploy','cleanup'],$('#dashboard').show(),e.startDeploy=function (e){
        $('.tooltip').hide();var o=determineTargetBranch(e);t.emit('deploy',e.project.name,o);
      },e.startTest=function (e){
        $('.tooltip').hide();var o=determineTargetBranch(e);t.emit('test',e.project.name,o);
      },e.cancelJob=function (e){
        t.emit('cancel',e);
      };
    },_.extend(Dashboard.prototype,JobMonitor.prototype,{job:function (e,t){
      for(var o=this.scope.jobs[t],s=0;s<o.length;s++)if(o[s]._id===e)return o[s];
    },addJob:function (e,t){
      for(var o=this.scope.jobs[t],s=-1,r=0;r<o.length;r++)if(o[r].project.name===e.project.name){
        s=r;break;
      }if(-1!==s){
        var a=o.splice(s,1)[0];e.project.prev=a.project.prev;
      }e.phases&&cleanJob(e),e.phase='environment',o.unshift(e);
    }}),Dashboard.prototype.statuses['phase.done']=function (e){
      this.phase=e.next;
    };
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'../../utils/job-monitor':40,'../../utils/status-classes':45,'jquery':85,'lodash':86,'socket.io-client':91}],21:[function (require,module,exports){
  'use strict';var angular=require('angular'),interpolate=require('../utils/interpolate'),DashboardController=require('./controllers/dashboard'),app=angular.module('dashboard',['moment']).config(['$interpolateProvider',interpolate]).controller('Dashboard',['$scope',DashboardController]);module.exports=app;
},{'../utils/interpolate':38,'./controllers/dashboard':20,'angular':50}],22:[function (require,module,exports){
  'use strict';module.exports=function (t,e){
    var l={controller:'JobCtrl',templateUrl:'build-tpl.html'},o={'/':l,'/job/latest':l,'/job/:id':l};Object.keys(o).forEach(function (t){
      e.when(t,o[t]);
    }),t.html5Mode(!0);
  };
},{}],23:[function (require,module,exports){
  (function (global){
    'use strict';function BuildPage(e,o,t,s,a,n){
      JobDataMonitor.call(this,e,t),this.scope=s,this.project=o,this.jobs={},this.jobs[n._id]=n;
    }function setFavicon(e){
      $('link[rel*="icon"]').attr('href',`/images/icons/favicon-${e}.png`);
    }function animateFav(){
      function e(){
        setFavicon(`running${o?'-alt':''}`),o=!o;
      }var o=!1;return setInterval(e,500);
    }function updateFavicon(e){
      'running'===e?null===runtime&&(runtime=animateFav()):(null!==runtime&&(clearInterval(runtime),runtime=null),setFavicon(e));
    }function buildSwitcher(e){
      function o(o){
        var t,s={40:1,38:-1}[o.keyCode],a=e.job._id;if(s){
          for(var n=0;n<e.jobs.length;n++)if(e.jobs[n]._id===a){
            t=n;break;
          }if(-1===t)return console.log('Failed to find job.'),global.location=global.location;t+=s,t<0||t>=e.jobs.length||(o.preventDefault(),e.selectJob(e.jobs[t]._id),e.$root.$digest());
        }
      }global.document.addEventListener('keydown',o);
    }var _=require('lodash'),bootbox=require('bootbox'),$=require('jquery'),io=require('socket.io-client'),JobDataMonitor=require('../../utils/job-data-monitor'),PHASES=require('../../utils/phases'),SKELS=require('../../utils/skels'),statusClasses=require('../../utils/status-classes'),outputConsole,runtime=null,job=global.job;module.exports=function (e,o,t,s){
      function a(t){
        if(global.location.pathname.match(/\/config$/))return void(global.location=global.location);if(n=o.current.params,n.id||(n.id=e.jobs[0]._id),o.current=c,l!==n.id||t){
          l=n.id;if(!p.get(l,function (o,t,s){
            t.phases.environment&&(t.phases.environment.collapsed=!0),t.phases.prepare&&(t.phases.prepare.collapsed=!0),t.phases.cleanup&&(t.phases.cleanup.collapsed=!0),e.job=t,e.job.phases.test.commands.length&&(e.job.phases.environment.collapsed=!0,e.job.phases.prepare.collapsed=!0,e.job.phases.cleanup.collapsed=!0),s||e.$digest();
          }))for(var s=0;s<e.jobs.length;s++)if(e.jobs[s]._id===l){
            e.job=e.jobs[s];break;
          }
        }
      }var n=o.current?o.current.params:{},i=global.project,l=n.id||global.job&&global.job._id,r=io.connect(),c=o.current,p=new BuildPage(r,i.name,e.$digest.bind(e),e,global.jobs,global.job);outputConsole=global.document.querySelector('.console-output'),e.statusClasses=statusClasses,e.phases=['environment','prepare','test','deploy','cleanup'],e.project=i,e.jobs=global.jobs,e.job=global.job,e.canAdminProject=global.canAdminProject,e.showStatus=global.showStatus,e.job&&e.job.phases.test.commands.length&&(job.phases.environment&&(job.phases.environment.collapsed=!0),job.phases.prepare&&(job.phases.prepare.collapsed=!0),job.phases.cleanup&&(job.phases.cleanup.collapsed=!0)),e.toggleErrorDetails=function (){
        e.showErrorDetails=!e.showErrorDetails;
      },e.clearCache=function (){
        e.clearingCache=!0,$.ajax(`/${e.project.name}/cache/${e.job.ref.branch}`,{type:'DELETE',success:function (){
          e.clearingCache=!1,e.$digest();
        },error:function (){
          e.clearingCache=!1,e.$digest(),bootbox.alert('Failed to clear the cache');
        }});
      },e.$on('$locationChangeSuccess',a),a(!0),e.triggers={commit:{icon:'code-fork',title:'Commit'},manual:{icon:'hand-o-right',title:'Manual'},plugin:{icon:'puzzle-piece',title:'Plugin'},api:{icon:'cloud',title:'Cloud'}},e.page='build',e.selectJob=function (e){
        t.path(`/job/${e}`).replace();
      },e.$watch('job.status',function (e){
        updateFavicon(e);
      }),buildSwitcher(e),e.$watch('job.std.merged_latest',function (e){
        var o=s('ansi');$('.job-output').last().append(o(e)),outputConsole.scrollTop=outputConsole.scrollHeight,setTimeout(function (){
          outputConsole.scrollTop=outputConsole.scrollHeight;
        },10);
      }),e.startDeploy=function (o){
        $('.tooltip').hide(),r.emit('deploy',i.name,o&&o.ref.branch),e.job={project:e.job.project,status:'submitted'};
      },e.startTest=function (o){
        $('.tooltip').hide(),r.emit('test',i.name,o&&o.ref.branch),e.job={project:e.job.project,status:'submitted'};
      },e.restartJob=function (e){
        r.emit('restart',e);
      },e.cancelJob=function (e){
        r.emit('cancel',e);
      };
    },_.extend(BuildPage.prototype,JobDataMonitor.prototype,{emits:{getUnknown:'build:job'},job:function (e){
      return this.jobs[e];
    },addJob:function (e){
      if((e.project.name||e.project)===this.project){
        this.jobs[e._id]=e;for(var o=-1,t=0;t<this.scope.jobs.length;t++)if(this.scope.jobs[t]._id===e._id){
          o=t;break;
        }if(-1!==o&&this.scope.jobs.splice(o,1),e.phase||(e.phase='environment'),e.std||(e.std={out:'',err:'',merged:''}),e.phases)e.phases.test.commands.length&&(e.phases.environment&&(e.phases.environment.collapsed=!0),e.phases.prepare&&(e.phases.prepare.collapsed=!0),e.phases.cleanup&&(e.phases.cleanup.collapsed=!0));else{
          for(e.phases={},t=0;t<PHASES.length;t++)e.phases[PHASES[t]]=_.cloneDeep(SKELS.phase);e.phases[e.phase].started=new Date;
        }this.scope.jobs.unshift(e),this.scope.job=e;
      }
    },get:function (e,o){
      if(this.jobs[e])return o(null,this.jobs[e],!0),!0;var t=this;this.sock.emit('build:job',e,function (s){
        t.jobs[e]=s,o(null,s);
      });
    }});
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'../../utils/job-data-monitor':39,'../../utils/phases':42,'../../utils/skels':44,'../../utils/status-classes':45,'bootbox':115,'jquery':85,'lodash':86,'socket.io-client':91}],24:[function (require,module,exports){
  'use strict';module.exports=function (){
    return{restrict:'A',scope:{},link:function (t,n,a){
      t.$parent.$watch(`job.plugin_data["${a.pluginStatus}"]`,function (n){
        t.data=n;
      }),t.$parent.$watch(`showStatus[job.ref.branch]["${a.pluginStatus}"]`,function (n){
        t.show=n;
      }),t.$parent.$watch('job',function (n){
        t.job=n;
      });
    }};
  };
},{}],25:[function (require,module,exports){
  'use strict';var angular=require('angular'),routes=require('./configs/routes.js'),pluginStatus=require('./directives/plugin-status'),JobController=require('./controllers/job'),interpolate=require('../utils/interpolate'),app=angular.module('job-status',['moment','ansi','ngRoute']).config(['$interpolateProvider',interpolate]).config(['$locationProvider','$routeProvider',routes]).controller('JobCtrl',['$scope','$route','$location','$filter',JobController]).directive('pluginStatus',pluginStatus);module.exports=app;
},{'../utils/interpolate':38,'./configs/routes.js':22,'./controllers/job':23,'./directives/plugin-status':24,'angular':50}],26:[function (require,module,exports){
  'use strict';module.exports=function (){
    return{restrict:'A',link:function (t,n,r){
      var i=r.rawHtml;t.$watch(i,function (t){
        n[0].innerHTML=t||'';
      });
    }};
  };
},{}],27:[function (require,module,exports){
  'use strict';function since(t,e){
    function i(){
      var t=(new Date).getTime();textDuration(t-n,e,!0);
    }var n=new Date(t).getTime();return i(),setInterval(i,500);
  }var $=require('jquery'),textDuration=require('../utils/text-duration');module.exports=function (){
    return{restrict:'E',link:function (t,e,i){
      if(void 0!==i.since&&!i.duration){
        var n=since(i.since,e);return $(e).tooltip({title:`Started ${new Date(i.since).toLocaleString()}`}),i.$observe('since',function (){
          $(e).tooltip({title:`Started ${new Date(i.since).toLocaleString()}`}),clearInterval(n),n=since(i.since,e);
        }),t.$on('$destroy',function (){
          clearInterval(n);
        });
      }var o;if(void 0!==i.datetime&&(o=new Date(i.datetime),$(e).tooltip({title:o.toLocaleString()})),void 0!==i.duration)return i.$observe('duration',function (){
        textDuration(i.duration,e);
      }),textDuration(i.duration,e);i.$observe('datetime',function (){
        o=new Date(i.datetime),$(e).tooltip({title:o.toLocaleString()}),$(e).text($.timeago(o));
      }),$(e).text($.timeago(o)),setTimeout(function (){
        $(e).timeago();
      },0);
    }};
  };
},{'../utils/text-duration':31,'jquery':85}],28:[function (require,module,exports){
  'use strict';var $=require('jquery');module.exports=function (){
    return{restrict:'A',link:function (t,o,i){
      'tooltip'===i.toggle&&(setTimeout(function (){
        $(o).tooltip();
      },0),i.$observe('title',function (){
          $(o).tooltip();
        }),t.$on('$destroy',function (){
          $('.tooltip').hide(),$(o).tooltip('hide');
        }));
    }};
  };
},{'jquery':85}],29:[function (require,module,exports){
  'use strict';module.exports=function (){
    return function (r,t){
      if(!r&&0!==parseInt(r))return'';var e=Math.pow(10,t||1);return `${parseInt(parseFloat(r)*e,10)/e}%`;
    };
  };
},{}],30:[function (require,module,exports){
  'use strict';var $=require('jquery'),angular=require('angular'),time=require('./directives/time'),toggle=require('./directives/toggle'),rawHtml=require('./directives/raw-html'),percentage=require('./filters/percentage');require('timeago'),$.timeago.settings.strings.hour='an hour',$.timeago.settings.strings.hours='%d hours',$.timeago.settings.localeTitle=!0;var app=angular.module('moment',[]).directive('time',time).directive('toggle',toggle).directive('rawHtml',rawHtml).filter('percentage',percentage);module.exports=app;
},{'./directives/raw-html':26,'./directives/time':27,'./directives/toggle':28,'./filters/percentage':29,'angular':50,'jquery':85,'timeago':117}],31:[function (require,module,exports){
  'use strict';var $=require('jquery'),time_units=[{ms:36e5,cls:'hours',suffix:'h'},{ms:6e4,cls:'minutes',suffix:'m'},{ms:1e3,cls:'seconds',suffix:'s'},{ms:0,cls:'miliseconds',suffix:'ms'}];module.exports=function (s,i,t){
    if(!s)return $(i).text('');for(var e='',m=0;m<time_units.length;m++)if(!(s<time_units[m].ms)){
      e=time_units[m].cls;var u=`${s}`;time_units[m].ms&&(u=t?parseInt(s/time_units[m].ms):parseInt(s/time_units[m].ms*10)/10),u+=time_units[m].suffix;break;
    }$(i).addClass(e).text(u);
  };
},{'jquery':85}],32:[function (require,module,exports){
  (function (global){
    'use strict';var plugins=global.plugins||[];module.exports=function (){
      this.busy=!1,this.hasUpgrades=function (){
        for(var t in plugins){
          if(plugins[t].outdated)return!0;
        }return!1;
      }(),this.upgradeAll=function (){
        this.busy=!0;var t=0,s=[];for(var i in plugins){
          var n=plugins[i];n.outdated&&s.push(n);
        }var u=function (i){
          if(i<s.length){
            s[i].controller.upgrade(function (n){
              if(n)return global.alert(`Batch upgrade aborted due to error:\n${n.message}`);++t,u(i+1),t===s.length&&(this.busy=!1,this.hasUpgrades=!1);
            }.bind(this));
          }
        }.bind(this);u(0);
      },this.uninstall=function (t){
        this.busy=!0,t.uninstall(function (s){
          s&&global.alert(s.message),plugins[t.id].installed=!1,delete plugins[t.id].outdated,this.busy=!1;
        }.bind(this));
      },this.install=function (t){
        this.busy=!0,t.install(function (t){
          t&&global.alert(t.message),this.busy=!1;
        }.bind(this));
      },this.upgrade=function (t){
        this.busy=!0,t.upgrade(function (t){
          t&&global.alert(t.message),this.busy=!1;
        }.bind(this));
      };
    };
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{}],33:[function (require,module,exports){
  (function (global){
    'use strict';var plugins=global.plugins||{};module.exports=function (i,t){
      function s(t){
        i.head('/').success(function (){
          t();
        }).error(function (){
          s(t);
        });
      }this.idle=!0,this.status='idle',this.loadPlugin=function (i){
        this.id=i,this.plugin=plugins[i],this.plugin.controller=this;for(var t in this.plugin)this[t]=this.plugin[t];this.pluginLoaded=!0;
      },this.upgrade=function (i){
        this.perform('upgrade',function (t){
          if(t)return i(t);this.installed=!0,this.outdated=!1,this.installedVersion=this.latestVersion,i();
        }.bind(this));
      },this.install=function (i){
        this.perform('install',function (t){
          if(t)return i(t);this.installed=!0,this.installedVersion=this.latestVersion,i();
        }.bind(this));
      },this.uninstall=function (i){
        this.perform('uninstall',function (t){
          if(t)return i(t);this.installed=!1,this.installedVersion='no',i();
        }.bind(this));
      },this.perform=function (n,l){
        return this.status=`Installing ${this.id}`,this.idle=!1,i.put('/admin/plugins',{action:n,id:this.id}).success(function (){
          this.status='Restarting',t(function (){
            s(function (){
              this.status='Done',this.idle=!0,l();
            }.bind(this));
          }.bind(this),2e3);
        }.bind(this)).error(function (i){
          this.idle=!0,l(new Error(i));
        }.bind(this));
      };
    };
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{}],34:[function (require,module,exports){
  'use strict';var angular=require('angular'),PluginController=require('./controllers/plugin'),PluginTableController=require('./controllers/plugin-table'),interpolate=require('../utils/interpolate'),app=angular.module('plugin-manager',[]).config(['$interpolateProvider',interpolate]).controller('PluginController',['$http','$timeout',PluginController]).controller('PluginTableController',PluginTableController);module.exports=app;
},{'../utils/interpolate':38,'./controllers/plugin':33,'./controllers/plugin-table':32,'angular':50}],35:[function (require,module,exports){
  (function (global){
    'use strict';function validName(e){
      return!!e.match(/[\w-]+\/[\w-]+/);
    }var $=require('jquery');module.exports=function (e,r){
      var a=r.id.split('-')[1];e.config={},e.projects=global.manualProjects[a]||[],e.remove=function (r){
        r.really_remove='removing',$.ajax(`/${r.name}/`,{type:'DELETE',success:function (){
          e.projects.splice(e.projects.indexOf(r),1),e.success('Project removed',!0);
        },error:function (){
          e.error('Failed to remove project',!0);
        }});
      },e.create=function (){
        var r=e.display_name.toLowerCase();validName(r)&&$.ajax(`/${r}/`,{type:'PUT',contentType:'application/json',data:JSON.stringify({display_name:e.display_name,display_url:e.display_url,public:e.public,provider:{id:a,config:e.config}}),success:function (){
          e.projects.push({display_name:e.display_name,name:e.display_name.replace(/ /g,'-').toLowerCase(),display_url:e.display_url,provider:{id:a,config:e.config}}),e.config={},e.display_name='',e.display_url='',e.success('Created project!',!0);
        },error:function (){
          e.error('failed to create project',!0);
        }});
      };
    };
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'jquery':85}],36:[function (require,module,exports){
  (function (global){
    'use strict';var $=require('jquery');module.exports=function (e){
      setTimeout(function (){
        '#manual'===global.location.hash&&$('a[href="#manual-setup"]').tab('show');
      },200),e.accounts=global.accounts,e.repos=global.repos,e.providers=global.providers,e.projectsPage=!0,e.toggleAdd=function (e){
        e.adding='pick-type';
      },e.toggleAddCancel=function (e){
        e.adding=!1;
      },e.toggleRemove=function (e){
        e.really_remove=!0;
      },e.toggleRemoveCancel=function (e){
        e.really_remove=!1;
      },e.removeProject=function (r,o,t){
        o.really_remove='removing',o.adding=!1,$.ajax(`/${o.project.name}/`,{type:'DELETE',success:function (){
          o.project=null,o.really_remove=!1,t.configured--,e.$digest();
        },error:function (r,t,n){
          o.really_remove=!1,r&&r.responseText?e.error(`Error removing project for repo ${o.name}: ${r.responseText}`,!0):e.error(`Error removing project for repo ${o.name}: ${n}`,!0);
        }});
      },e.setupProject=function (r,o,t,n){
        o.lastError='',$.ajax(`/${o.name}/`,{type:'PUT',contentType:'application/json',data:JSON.stringify({display_name:o.display_name||o.name,display_url:o.display_url,project_type:t,provider:{id:r.provider,account:r.id,repo_id:o.id,config:o.config}}),success:function (r){
          o.project=r.project,o.adding='done',n.configured++,e.$digest();
        },error:function (r,t,n){
          var a=void 0;a=r&&r.responseText?`Error creating project for repo ${o.name}: ${r.responseText}`:`Error creating project for repo ${o.name}: ${n}`,e.error(a,!0),o.lastError=a,o.adding='';
        }});
      },e.startTest=function (r){
        $.ajax(`/${r.project.name}/start`,{type:'POST',success:function (){
          r.adding=!1,e.success(`Test started for ${r.project.name}. <a href="/${r.project.name}/">Click to watch it run</a>`,!0,!0);
        },error:function (o,t,n){
          o&&o.responseText?e.error(`Error starting test for project ${r.project.name}: ${o.responseText}`,!0):e.error(`Error starting test for project ${r.project.name}: ${n}`,!0);
        }});
      };
    };
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'jquery':85}],37:[function (require,module,exports){
  'use strict';var angular=require('angular'),interpolate=require('../utils/interpolate'),ManualController=require('./controllers/manual'),ProjectsController=require('./controllers/projects'),app=angular.module('projects',['alerts','moment','ui.bootstrap.buttons']).config(['$interpolateProvider',interpolate]).controller('ManualController',['$scope','$attrs',ManualController]).controller('ProjectsController',['$scope',ProjectsController]);module.exports=app;
},{'../utils/interpolate':38,'./controllers/manual':35,'./controllers/projects':36,'angular':50}],38:[function (require,module,exports){
  'use strict';module.exports=function (t){
    t.startSymbol('[['),t.endSymbol(']]');
  };
},{}],39:[function (require,module,exports){
  'use strict';function JobDataMonitor(){
    JobMonitor.apply(this,arguments);
  }function ensureCommand(e){
    var t=e.commands[e.commands.length-1];return t&&void 0===t.finished||(t=_.extend({},SKELS.command),e.commands.push(t)),t;
  }var _=require('lodash'),JobMonitor=require('./job-monitor'),SKELS=require('./skels');_.extend(JobDataMonitor.prototype,JobMonitor.prototype,{}),JobDataMonitor.prototype.statuses=_.extend({},JobMonitor.prototype.statuses,{'phase.done':function (e){
    this.phases[e.phase].finished=e.time,this.phases[e.phase].duration=e.elapsed,this.phases[e.phase].exitCode=e.code,-1!==['prepare','environment','cleanup'].indexOf(e.phase)&&(this.phases[e.phase].collapsed=!0),'test'===e.phase&&(this.test_status=e.code),'deploy'===e.phase&&(this.deploy_status=e.code),e.next&&this.phases[e.next]&&(this.phase=e.next,this.phases[e.next].started=e.time);
  },'command.comment':function (e){
    var t=this.phases[this.phase],s=_.extend({},SKELS.command);s.command=e.comment,s.comment=!0,s.plugin=e.plugin,s.finished=e.time,t.commands.push(s);
  },'command.start':function (e){
    var t=this.phases[this.phase],s=_.extend({},SKELS.command,e);s.started=e.time,t.commands.push(s);
  },'command.done':function (e){
    var t=this.phases[this.phase],s=t.commands[t.commands.length-1];s.finished=e.time,s.duration=e.elapsed,s.exitCode=e.exitCode,s.merged=s._merged;
  },stdout:function (e){
    var t=ensureCommand(this.phases[this.phase]);t.out+=e,t._merged+=e,this.std.out+=e,this.std.merged+=e,this.std.merged_latest=e;
  },stderr:function (e){
    var t=ensureCommand(this.phases[this.phase]);t.err+=e,t._merged+=e,this.std.err+=e,this.std.merged+=e,this.std.merged_latest=e;
  }}),module.exports=JobDataMonitor;
},{'./job-monitor':40,'./skels':44,'lodash':86}],40:[function (require,module,exports){
  'use strict';function JobMonitor(t,n){
    this.sock=t,this.changed=n,this.waiting={},this.listen();
  }var _=require('lodash'),PHASES=require('./phases');JobMonitor.prototype={emits:{getUnknown:'dashboard:unknown'},events:{'job.new':function (t,n){
    this.addJob(t[0],n),this.changed();
  },'job.done':function (t,n){
    this.addJob(t[0],n),this.changed();
  }},job:function (){
    throw new Error('You must override this');
  },addJob:function (){
    throw new Error('You must implement');
  },listen:function (){
    var t;for(var n in this.events)t=this.events[n],'string'==typeof t&&(t=this[t]),this.sock.on(n,t.bind(this));for(var i in this.statuses)this.sock.on(`job.status.${i}`,this.update.bind(this,i));
  },update:function (t,n,i,s){
    var e=n.shift(),o=this.job(e,i),a=this.statuses[t];if(!o)return this.unknown(e,t,n,i);a&&('string'==typeof a?o.status=a:a.apply(o,n),s||this.changed());
  },unknown:function (t,n,i,s){
    if(i=[t].concat(i),this.waiting[t])return this.waiting[t].push([n,i,s]);this.waiting[t]=[[n,i,s]],this.sock.emit(this.emits.getUnknown,t,this.gotUnknown.bind(this));
  },gotUnknown:function (t){
    if(!this.waiting[t._id])return console.warn('Got unknownjob:response but wan\'t waiting for it...');var n=this.waiting[t._id][0][2];'submitted'===t.status&&(t.status='running',t.started=new Date),this.addJob(t,n);for(var i=0;i<this.waiting[t._id];i++)this.update.apply(this,this.waiting[i].concat([!0]));delete this.waiting[t._id],this.changed();
  },statuses:{started:function (t){
    this.started=t,this.phase='environment',this.status='running';
  },errored:function (t){
    this.error=t,this.status='errored';
  },canceled:'errored','phase.done':function (t){
    this.phase=PHASES.indexOf(t.phase)+1;
  },stdout:function (){},stderr:function (){},warning:function (t){
    this.warnings||(this.warnings=[]),this.warnings.push(t);
  },'plugin-data':function (t){
    var n,i=t.path?[t.plugin].concat(t.path.split('.')):[t.plugin],s=i.pop(),e=t.method||'replace';n=i.reduce(function (t,n){
      return t[n]||(t[n]={});
    },this.plugin_data||(this.plugin_data={})),'replace'===e?n[s]=t.data:'push'===e?(n[s]||(n[s]=[]),n[s].push(t.data)):'extend'===e?(n[s]||(n[s]={}),_.extend(n[s],t.data)):console.error('Invalid "plugin data" method received from plugin',t.plugin,t.method,t);
  }}},module.exports=JobMonitor;
},{'./phases':42,'lodash':86}],41:[function (require,module,exports){
  'use strict';var _=require('lodash'),$=require('jquery'),Sortable=require('sortable');module.exports=function (e){
    return{compile:function (r,t){
      var o={},n=null,a=null,l=t.ngSortableGroup,u=t.ngSortable||t.ngSortableUpdate,i=t.ngSortableSource,d=t.ngModel;if(l){
        if(!i)throw new Error('Use of a group requires specifying a data source via ng-sortable-source');n=t.ngSortableAdded,a=t.ngSortableRemoved;
      }var p=t.ngSortableKey||'_id';return function (r,t){
        function g(t){
          var o=e(t)(r);return function (t){
            r.$apply(function (){
              var n='update'===t.type?d:i,a=_.cloneDeep(e(n)(r)),l=$(t.target),u=$(l).attr('ng-sortable-id'),g=null,s=l.index();if(!u)throw new Error('No ng-sortable-id on element.');var c=_.find(a,function (e,r){
                return g=r,e[p]===u;
              });if(!c)throw new Error('Could not locate target element. Did you forget to set attribute data-ng-sortable-id on your repeated HTML elements?');'update'===t.type?(a.splice(g,1),a.splice(s,0,c),o(a)):'add'===t.type&&o(c,s,t);
            });
          };
        }u&&(o.onUpdate=g(u)),l&&(o.group=l),n&&(o.onAdd=g(n)),a&&(o.onRemove=g(a)),u&&(o.onUpdate=g(u)),r.sortable=new Sortable(t.get(0),o);
      };
    }};
  };
},{'jquery':85,'lodash':86,'sortable':114}],42:[function (require,module,exports){
  'use strict';module.exports=['environment','prepare','test','deploy','cleanup'];
},{}],43:[function (require,module,exports){
  'use strict';function post(e,r,s){
    $.ajax({url:e,type:'POST',data:r,dataType:'json',success:function (){
      s(null);
    },error:function (e,r,t){
      if(e&&e.responseText){
        t=$.parseJSON(e.responseText).errors[0];
      }s(t);
    }});
  }var $=require('jquery');module.exports=post;
},{'jquery':85}],44:[function (require,module,exports){
  'use strict';var PHASES=require('./phases'),SKELS={job:{id:null,data:null,phases:{},phase:PHASES[0],queued:null,started:null,finished:null,test_status:null,deploy_status:null,plugin_data:{},warnings:[],std:{out:'',err:'',merged:'',merged_latest:''}},command:{out:'',err:'',merged:'',_merged:'',started:null,command:'',plugin:''},phase:{finished:null,exitCode:null,commands:[]}};module.exports=SKELS;
},{'./phases':42}],45:[function (require,module,exports){
  'use strict';module.exports={passed:'fa-check-circle success-text',failed:'fa-exclamation-circle failure-text',running:'fa-circle-o-notch fa-spin running-text',submitted:'fa-clock-o waiting-text',errored:'fa-minus-circle error-text'};
},{}],46:[function (require,module,exports){
  function after(o,n,t){
    function r(o,e){
      if(r.count<=0)throw new Error('after called too many times');--r.count,o?(u=!0,n(o),n=t):0!==r.count||u||n(null,e);
    }var u=!1;return t=t||noop,r.count=o,0===o?n():r;
  }function noop(){}module.exports=after;
},{}],47:[function (require,module,exports){
  !function (e,r){
    'use strict';function t(e,r){
      if(c(e)){
        r=r||[];for(var t=0,n=e.length;t<n;t++)r[t]=e[t];
      }else if(u(e)){
        r=r||{};for(var a in e)'$'===a.charAt(0)&&'$'===a.charAt(1)||(r[a]=e[a]);
      }return r||e;
    }function n(){
      function e(e,t){
        return r.extend(Object.create(e),t);
      }function n(e,r){
        var t=r.caseInsensitiveMatch,n={originalPath:e,regexp:e},a=n.keys=[];return e=e.replace(/([().])/g,'\\$1').replace(/(\/)?:(\w+)(\*\?|[\?\*])?/g,function (e,r,t,n){
          var o='?'===n||'*?'===n?'?':null,i='*'===n||'*?'===n?'*':null;return a.push({name:t,optional:!!o}),r=r||'',`${o?'':r}(?:${o?r:''}${i&&'(.+?)'||'([^/]+)'}${o||''})${o||''}`;
        }).replace(/([\/$\*])/g,'\\$1'),n.regexp=new RegExp(`^${e}$`,t?'i':''),n;
      }var a={};this.when=function (e,o){
        var i=t(o);if(r.isUndefined(i.reloadOnSearch)&&(i.reloadOnSearch=!0),r.isUndefined(i.caseInsensitiveMatch)&&(i.caseInsensitiveMatch=this.caseInsensitiveMatch),a[e]=r.extend(i,e&&n(e,i)),e){
          var c='/'==e[e.length-1]?e.substr(0,e.length-1):`${e}/`;a[c]=r.extend({redirectTo:e},n(c,i));
        }return this;
      },this.caseInsensitiveMatch=!1,this.otherwise=function (e){
        return'string'==typeof e&&(e={redirectTo:e}),this.when(null,e),this;
      },this.$get=['$rootScope','$location','$routeParams','$q','$injector','$templateRequest','$sce',function (t,n,o,i,c,u,l){
        function h(e,r){
          var t=r.keys,n={};if(!r.regexp)return null;var a=r.regexp.exec(e);if(!a)return null;for(var o=1,i=a.length;o<i;++o){
            var c=t[o-1],u=a[o];c&&u&&(n[c.name]=u);
          }return n;
        }function f(e){
          var n=C.current;g=v(),(w=g&&n&&g.$$route===n.$$route&&r.equals(g.pathParams,n.pathParams)&&!g.reloadOnSearch&&!P)||!n&&!g||t.$broadcast('$routeChangeStart',g,n).defaultPrevented&&e&&e.preventDefault();
        }function $(){
          var e=C.current,a=g;w?(e.params=a.params,r.copy(e.params,o),t.$broadcast('$routeUpdate',e)):(a||e)&&(P=!1,C.current=a,a&&a.redirectTo&&(r.isString(a.redirectTo)?n.path(m(a.redirectTo,a.params)).search(a.params).replace():n.url(a.redirectTo(a.pathParams,n.path(),n.search())).replace()),i.when(a).then(d).then(function (n){
            a==C.current&&(a&&(a.locals=n,r.copy(a.params,o)),t.$broadcast('$routeChangeSuccess',a,e));
          },function (r){
            a==C.current&&t.$broadcast('$routeChangeError',a,e,r);
          }));
        }function d(e){
          if(e){
            var t=r.extend({},e.resolve);r.forEach(t,function (e,n){
              t[n]=r.isString(e)?c.get(e):c.invoke(e,null,null,n);
            });var n=p(e);return r.isDefined(n)&&(t.$template=n),i.all(t);
          }
        }function p(e){
          var t,n;return r.isDefined(t=e.template)?r.isFunction(t)&&(t=t(e.params)):r.isDefined(n=e.templateUrl)&&(r.isFunction(n)&&(n=n(e.params)),r.isDefined(n)&&(e.loadedTemplateUrl=l.valueOf(n),t=u(n))),t;
        }function v(){
          var t,o;return r.forEach(a,function (a,i){
            !o&&(t=h(n.path(),a))&&(o=e(a,{params:r.extend({},n.search(),t),pathParams:t}),o.$$route=a);
          }),o||a[null]&&e(a[null],{params:{},pathParams:{}});
        }function m(e,t){
          var n=[];return r.forEach((e||'').split(':'),function (e,r){
            if(0===r)n.push(e);else{
              var a=e.match(/(\w+)(?:[?*])?(.*)/),o=a[1];n.push(t[o]),n.push(a[2]||''),delete t[o];
            }
          }),n.join('');
        }var g,w,P=!1,C={routes:a,reload:function (){
          P=!0;var e={defaultPrevented:!1,preventDefault:function (){
            this.defaultPrevented=!0,P=!1;
          }};t.$evalAsync(function (){
            f(e),e.defaultPrevented||$();
          });
        },updateParams:function (e){
          if(!this.current||!this.current.$$route)throw s('norout','Tried updating route when with no current route');e=r.extend({},this.current.params,e),n.path(m(this.current.$$route.originalPath,e)),n.search(e);
        }};return t.$on('$locationChangeStart',f),t.$on('$locationChangeSuccess',$),C;
      }];
    }function a(){
      this.$get=function (){
        return{};
      };
    }function o(e,t,n){
      return{restrict:'ECA',terminal:!0,priority:400,transclude:'element',link:function (a,o,i,c,u){
        function l(){
          $&&(n.cancel($),$=null),h&&(h.$destroy(),h=null),f&&($=n.leave(f),$.then(function (){
            $=null;
          }),f=null);
        }function s(){
          var i=e.current&&e.current.locals,c=i&&i.$template;if(r.isDefined(c)){
            var s=a.$new(),$=e.current,v=u(s,function (e){
              n.enter(e,null,f||o).then(function (){
                !r.isDefined(d)||d&&!a.$eval(d)||t();
              }),l();
            });f=v,h=$.scope=s,h.$emit('$viewContentLoaded'),h.$eval(p);
          }else l();
        }var h,f,$,d=i.autoscroll,p=i.onload||'';a.$on('$routeChangeSuccess',s),s();
      }};
    }function i(e,r,t){
      return{restrict:'ECA',priority:-400,link:function (n,a){
        var o=t.current,i=o.locals;a.html(i.$template);var c=e(a.contents());if(o.controller){
          i.$scope=n;var u=r(o.controller,i);o.controllerAs&&(n[o.controllerAs]=u),a.data('$ngControllerController',u),a.children().data('$ngControllerController',u);
        }n[o.resolveAs||'$resolve']=i,c(n);
      }};
    }var c=r.isArray,u=r.isObject,l=r.module('ngRoute',['ng']).provider('$route',n),s=r.$$minErr('ngRoute');l.provider('$routeParams',a),l.directive('ngView',o),l.directive('ngView',i),o.$inject=['$route','$anchorScroll','$animate'],i.$inject=['$compile','$controller','$route'];
  }(window,window.angular);
},{}],48:[function (require,module,exports){
  require('./angular-route'),module.exports='ngRoute';
},{'./angular-route':47}],49:[function (require,module,exports){
  !function (e){
    'use strict';function t(e,t){
      return t=t||Error,function (){
        var n,r,i=arguments,o=i[0],a=`[${e?`${e}:`:''}${o}] `,s=i[1];for(a+=s.replace(/\{\d+\}/g,function (e){
          var t=+e.slice(1,-1),n=t+2;return n<i.length?me(i[n]):e;
        }),a+=`\nhttp://errors.angularjs.org/1.5.7/${e?`${e}/`:''}${o}`,r=2,n='?';r<i.length;r++,n='&')a+=`${n}p${r-2}=${encodeURIComponent(me(i[r]))}`;return new t(a);
      };
    }function n(e){
      if(null==e||A(e))return!1;if(Gr(e)||w(e)||Pr&&e instanceof Pr)return!0;var t='length'in Object(e)&&e.length;return x(t)&&(t>=0&&(t-1 in e||e instanceof Array)||'function'==typeof e.item);
    }function r(e,t,i){
      var o,a;if(e)if(C(e))for(o in e)'prototype'==o||'length'==o||'name'==o||e.hasOwnProperty&&!e.hasOwnProperty(o)||t.call(i,e[o],o,e);else if(Gr(e)||n(e)){
        var s='object'!=typeof e;for(o=0,a=e.length;o<a;o++)(s||o in e)&&t.call(i,e[o],o,e);
      }else if(e.forEach&&e.forEach!==r)e.forEach(t,i,e);else if(b(e))for(o in e)t.call(i,e[o],o,e);else if('function'==typeof e.hasOwnProperty)for(o in e)e.hasOwnProperty(o)&&t.call(i,e[o],o,e);else for(o in e)Tr.call(e,o)&&t.call(i,e[o],o,e);return e;
    }function i(e,t,n){
      for(var r=Object.keys(e).sort(),i=0;i<r.length;i++)t.call(n,e[r[i]],r[i]);return r;
    }function o(e){
      return function (t,n){
        e(n,t);
      };
    }function a(){
      return++Wr;
    }function s(e,t){
      t?e.$$hashKey=t:delete e.$$hashKey;
    }function u(e,t,n){
      for(var r=e.$$hashKey,i=0,o=t.length;i<o;++i){
        var a=t[i];if(y(a)||C(a))for(var c=Object.keys(a),l=0,f=c.length;l<f;l++){
          var h=c[l],p=a[h];n&&y(p)?S(p)?e[h]=new Date(p.valueOf()):E(p)?e[h]=new RegExp(p):p.nodeName?e[h]=p.cloneNode(!0):D(p)?e[h]=p.clone():(y(e[h])||(e[h]=Gr(p)?[]:{}),u(e[h],[p],!0)):e[h]=p;
        }
      }return s(e,r),e;
    }function c(e){
      return u(e,Fr.call(arguments,1),!1);
    }function l(e){
      return u(e,Fr.call(arguments,1),!0);
    }function f(e){
      return parseInt(e,10);
    }function h(e,t){
      return c(Object.create(e),t);
    }function p(){}function d(e){
      return e;
    }function $(e){
      return function (){
        return e;
      };
    }function v(e){
      return C(e.toString)&&e.toString!==Lr;
    }function m(e){
      return void 0===e;
    }function g(e){
      return void 0!==e;
    }function y(e){
      return null!==e&&'object'==typeof e;
    }function b(e){
      return null!==e&&'object'==typeof e&&!Hr(e);
    }function w(e){
      return'string'==typeof e;
    }function x(e){
      return'number'==typeof e;
    }function S(e){
      return'[object Date]'===Lr.call(e);
    }function C(e){
      return'function'==typeof e;
    }function E(e){
      return'[object RegExp]'===Lr.call(e);
    }function A(e){
      return e&&e.window===e;
    }function k(e){
      return e&&e.$evalAsync&&e.$watch;
    }function O(e){
      return'[object File]'===Lr.call(e);
    }function M(e){
      return'[object FormData]'===Lr.call(e);
    }function T(e){
      return'[object Blob]'===Lr.call(e);
    }function N(e){
      return'boolean'==typeof e;
    }function V(e){
      return e&&C(e.then);
    }function j(e){
      return e&&x(e.length)&&Zr.test(Lr.call(e));
    }function I(e){
      return'[object ArrayBuffer]'===Lr.call(e);
    }function D(e){
      return!(!e||!(e.nodeName||e.prop&&e.attr&&e.find));
    }function P(e){
      var t,n={},r=e.split(',');for(t=0;t<r.length;t++)n[r[t]]=!0;return n;
    }function _(e){
      return Nr(e.nodeName||e[0]&&e[0].nodeName);
    }function R(e,t){
      var n=e.indexOf(t);return n>=0&&e.splice(n,1),n;
    }function F(e,t){
      function n(e,t){
        var n,r=t.$$hashKey;if(Gr(e))for(var o=0,a=e.length;o<a;o++)t.push(i(e[o]));else if(b(e))for(n in e)t[n]=i(e[n]);else if(e&&'function'==typeof e.hasOwnProperty)for(n in e)e.hasOwnProperty(n)&&(t[n]=i(e[n]));else for(n in e)Tr.call(e,n)&&(t[n]=i(e[n]));return s(t,r),t;
      }function i(e){
        if(!y(e))return e;var t=a.indexOf(e);if(-1!==t)return u[t];if(A(e)||k(e))throw Br('cpws','Can\'t copy! Making copies of Window or Scope instances is not supported.');var r=!1,i=o(e);return void 0===i&&(i=Gr(e)?[]:Object.create(Hr(e)),r=!0),a.push(e),u.push(i),r?n(e,i):i;
      }function o(e){
        switch(Lr.call(e)){
        case'[object Int8Array]':case'[object Int16Array]':case'[object Int32Array]':case'[object Float32Array]':case'[object Float64Array]':case'[object Uint8Array]':case'[object Uint8ClampedArray]':case'[object Uint16Array]':case'[object Uint32Array]':return new e.constructor(i(e.buffer));case'[object ArrayBuffer]':if(!e.slice){
          var t=new ArrayBuffer(e.byteLength);return new Uint8Array(t).set(new Uint8Array(e)),t;
        }return e.slice(0);case'[object Boolean]':case'[object Number]':case'[object String]':case'[object Date]':return new e.constructor(e.valueOf());case'[object RegExp]':var n=new RegExp(e.source,e.toString().match(/[^\/]*$/)[0]);return n.lastIndex=e.lastIndex,n;case'[object Blob]':return new e.constructor([e],{type:e.type});
        }if(C(e.cloneNode))return e.cloneNode(!0);
      }var a=[],u=[];if(t){
        if(j(t)||I(t))throw Br('cpta','Can\'t copy! TypedArray destination cannot be mutated.');if(e===t)throw Br('cpi','Can\'t copy! Source and destination are identical.');return Gr(t)?t.length=0:r(t,function (e,n){
          '$$hashKey'!==n&&delete t[n];
        }),a.push(e),u.push(t),n(e,t);
      }return i(e);
    }function q(e,t){
      if(e===t)return!0;if(null===e||null===t)return!1;if(e!==e&&t!==t)return!0;var n,r,i,o=typeof e,a=typeof t;if(o==a&&'object'==o){
        if(!Gr(e)){
          if(S(e))return!!S(t)&&q(e.getTime(),t.getTime());if(E(e))return!!E(t)&&e.toString()==t.toString();if(k(e)||k(t)||A(e)||A(t)||Gr(t)||S(t)||E(t))return!1;i=pe();for(r in e)if('$'!==r.charAt(0)&&!C(e[r])){
            if(!q(e[r],t[r]))return!1;i[r]=!0;
          }for(r in t)if(!(r in i)&&'$'!==r.charAt(0)&&g(t[r])&&!C(t[r]))return!1;return!0;
        }if(!Gr(t))return!1;if((n=e.length)==t.length){
          for(r=0;r<n;r++)if(!q(e[r],t[r]))return!1;return!0;
        }
      }return!1;
    }function U(e,t,n){
      return e.concat(Fr.call(t,n));
    }function L(e,t){
      return Fr.call(e,t||0);
    }function H(e,t){
      var n=arguments.length>2?L(arguments,2):[];return!C(t)||t instanceof RegExp?t:n.length?function (){
        return arguments.length?t.apply(e,U(n,arguments,0)):t.apply(e,n);
      }:function (){
        return arguments.length?t.apply(e,arguments):t.call(e);
      };
    }function B(t,n){
      var r=n;return'string'==typeof t&&'$'===t.charAt(0)&&'$'===t.charAt(1)?r=void 0:A(n)?r='$WINDOW':n&&e.document===n?r='$DOCUMENT':k(n)&&(r='$SCOPE'),r;
    }function z(e,t){
      if(!m(e))return x(t)||(t=t?2:null),JSON.stringify(e,B,t);
    }function W(e){
      return w(e)?JSON.parse(e):e;
    }function G(e,t){
      e=e.replace(Qr,'');var n=Date.parse(`Jan 01, 1970 00:00:00 ${e}`)/6e4;return isNaN(n)?t:n;
    }function Z(e,t){
      return e=new Date(e.getTime()),e.setMinutes(e.getMinutes()+t),e;
    }function J(e,t,n){
      n=n?-1:1;var r=e.getTimezoneOffset();return Z(e,n*(G(t,r)-r));
    }function Y(e){
      e=Pr(e).clone();try{
        e.empty();
      }catch(e){}var t=Pr('<div>').append(e).html();try{
        return e[0].nodeType===ii?Nr(t):t.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function (e,t){
          return`<${Nr(t)}`;
        });
      }catch(e){
        return Nr(t);
      }
    }function K(e){
      try{
        return decodeURIComponent(e);
      }catch(e){}
    }function X(e){
      var t={};return r((e||'').split('&'),function (e){
        var n,r,i;e&&(r=e=e.replace(/\+/g,'%20'),n=e.indexOf('='),-1!==n&&(r=e.substring(0,n),i=e.substring(n+1)),r=K(r),g(r)&&(i=!g(i)||K(i),Tr.call(t,r)?Gr(t[r])?t[r].push(i):t[r]=[t[r],i]:t[r]=i));
      }),t;
    }function Q(e){
      var t=[];return r(e,function (e,n){
        Gr(e)?r(e,function (e){
          t.push(te(n,!0)+(!0===e?'':`=${te(e,!0)}`));
        }):t.push(te(n,!0)+(!0===e?'':`=${te(e,!0)}`));
      }),t.length?t.join('&'):'';
    }function ee(e){
      return te(e,!0).replace(/%26/gi,'&').replace(/%3D/gi,'=').replace(/%2B/gi,'+');
    }function te(e,t){
      return encodeURIComponent(e).replace(/%40/gi,'@').replace(/%3A/gi,':').replace(/%24/g,'$').replace(/%2C/gi,',').replace(/%3B/gi,';').replace(/%20/g,t?'%20':'+');
    }function ne(e,t){
      var n,r,i=ei.length;for(r=0;r<i;++r)if(n=ei[r]+t,w(n=e.getAttribute(n)))return n;return null;
    }function re(e,t){
      var n,i,o={};r(ei,function (t){
        var r=`${t}app`;!n&&e.hasAttribute&&e.hasAttribute(r)&&(n=e,i=e.getAttribute(r));
      }),r(ei,function (t){
        var r,o=`${t}app`;!n&&(r=e.querySelector(`[${o.replace(':','\\:')}]`))&&(n=r,i=r.getAttribute(o));
      }),n&&(o.strictDi=null!==ne(n,'strict-di'),t(n,i?[i]:[],o));
    }function ie(t,n,i){
      y(i)||(i={}),i=c({strictDi:!1},i);var o=function (){
          if(t=Pr(t),t.injector()){
            var r=t[0]===e.document?'document':Y(t);throw Br('btstrpd','App already bootstrapped with this element \'{0}\'',r.replace(/</,'&lt;').replace(/>/,'&gt;'));
          }n=n||[],n.unshift(['$provide',function (e){
            e.value('$rootElement',t);
          }]),i.debugInfoEnabled&&n.push(['$compileProvider',function (e){
            e.debugInfoEnabled(!0);
          }]),n.unshift('ng');var o=tt(n,i.strictDi);return o.invoke(['$rootScope','$rootElement','$compile','$injector',function (e,t,n,r){
            e.$apply(function (){
              t.data('$injector',r),n(t)(e);
            });
          }]),o;
        },a=/^NG_ENABLE_DEBUG_INFO!/,s=/^NG_DEFER_BOOTSTRAP!/;if(e&&a.test(e.name)&&(i.debugInfoEnabled=!0,e.name=e.name.replace(a,'')),e&&!s.test(e.name))return o();e.name=e.name.replace(s,''),zr.resumeBootstrap=function (e){
        return r(e,function (e){
          n.push(e);
        }),o();
      },C(zr.resumeDeferredBootstrap)&&zr.resumeDeferredBootstrap();
    }function oe(){
      e.name=`NG_ENABLE_DEBUG_INFO!${e.name}`,e.location.reload();
    }function ae(e){
      var t=zr.element(e).injector();if(!t)throw Br('test','no injector found for element argument to getTestability');return t.get('$$testability');
    }function se(e,t){
      return t=t||'_',e.replace(ti,function (e,n){
        return(n?t:'')+e.toLowerCase();
      });
    }function ue(e,t,n){
      if(!e)throw Br('areq','Argument \'{0}\' is {1}',t||'?',n||'required');return e;
    }function ce(e,t,n){
      return n&&Gr(e)&&(e=e[e.length-1]),ue(C(e),t,`not a function, got ${e&&'object'==typeof e?e.constructor.name||'Object':typeof e}`),e;
    }function le(e,t){
      if('hasOwnProperty'===e)throw Br('badname','hasOwnProperty is not a valid {0} name',t);
    }function fe(e,t,n){
      if(!t)return e;for(var r,i=t.split('.'),o=e,a=i.length,s=0;s<a;s++)r=i[s],e&&(e=(o=e)[r]);return!n&&C(e)?H(o,e):e;
    }function he(e){
      for(var t,n=e[0],r=e[e.length-1],i=1;n!==r&&(n=n.nextSibling);i++)(t||e[i]!==n)&&(t||(t=Pr(Fr.call(e,0,i))),t.push(n));return t||e;
    }function pe(){
      return Object.create(null);
    }function de(e){
      function n(e,t,n){
        return e[t]||(e[t]=n());
      }var r=t('$injector'),i=t('ng'),o=n(e,'angular',Object);return o.$$minErr=o.$$minErr||t,n(o,'module',function (){
        var e={};return function (t,o,a){
          return function (e,t){
            if('hasOwnProperty'===e)throw i('badname','hasOwnProperty is not a valid {0} name',t);
          }(t,'module'),o&&e.hasOwnProperty(t)&&(e[t]=null),n(e,t,function (){
            function e(e,t,n,r){
              return r||(r=i),function (){
                return r[n||'push']([e,t,arguments]),l;
              };
            }function n(e,n){
              return function (r,o){
                return o&&C(o)&&(o.$$moduleName=t),i.push([e,n,arguments]),l;
              };
            }if(!o)throw r('nomod','Module \'{0}\' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.',t);var i=[],s=[],u=[],c=e('$injector','invoke','push',s),l={_invokeQueue:i,_configBlocks:s,_runBlocks:u,requires:o,name:t,provider:n('$provide','provider'),factory:n('$provide','factory'),service:n('$provide','service'),value:e('$provide','value'),constant:e('$provide','constant','unshift'),decorator:n('$provide','decorator'),animation:n('$animateProvider','register'),filter:n('$filterProvider','register'),controller:n('$controllerProvider','register'),directive:n('$compileProvider','directive'),component:n('$compileProvider','component'),config:c,run:function (e){
              return u.push(e),this;
            }};return a&&c(a),l;
          });
        };
      });
    }function $e(e,t){
      if(Gr(e)){
        t=t||[];for(var n=0,r=e.length;n<r;n++)t[n]=e[n];
      }else if(y(e)){
        t=t||{};for(var i in e)'$'===i.charAt(0)&&'$'===i.charAt(1)||(t[i]=e[i]);
      }return t||e;
    }function ve(e){
      var t=[];return JSON.stringify(e,function (e,n){
        if(n=B(e,n),y(n)){
          if(t.indexOf(n)>=0)return'...';t.push(n);
        }return n;
      });
    }function me(e){
      return'function'==typeof e?e.toString().replace(/ \{[\s\S]*$/,''):m(e)?'undefined':'string'!=typeof e?ve(e):e;
    }function ge(){
      return++li;
    }function ye(e){
      return e.replace(pi,function (e,t,n,r){
        return r?n.toUpperCase():n;
      }).replace(di,'Moz$1');
    }function be(e){
      return!gi.test(e);
    }function we(e){
      var t=e.nodeType;return t===ri||!t||t===ai;
    }function xe(e){
      for(var t in ci[e.ng339])return!0;return!1;
    }function Se(e){
      for(var t=0,n=e.length;t<n;t++)Ne(e[t]);
    }function Ce(e,t){
      var n,i,o,a,s=t.createDocumentFragment(),u=[];if(be(e))u.push(t.createTextNode(e));else{
        for(n=n||s.appendChild(t.createElement('div')),i=(yi.exec(e)||['',''])[1].toLowerCase(),o=wi[i]||wi._default,n.innerHTML=o[1]+e.replace(bi,'<$1></$2>')+o[2],a=o[0];a--;)n=n.lastChild;u=U(u,n.childNodes),n=s.firstChild,n.textContent='';
      }return s.textContent='',s.innerHTML='',r(u,function (e){
        s.appendChild(e);
      }),s;
    }function Ee(t,n){
      n=n||e.document;var r;return(r=mi.exec(t))?[n.createElement(r[1])]:(r=Ce(t,n))?r.childNodes:[];
    }function Ae(e,t){
      var n=e.parentNode;n&&n.replaceChild(t,e),t.appendChild(e);
    }function ke(e){
      if(e instanceof ke)return e;var t;if(w(e)&&(e=Jr(e),t=!0),!(this instanceof ke)){
        if(t&&'<'!=e.charAt(0))throw vi('nosel','Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');return new ke(e);
      }t?_e(this,Ee(e)):_e(this,e);
    }function Oe(e){
      return e.cloneNode(!0);
    }function Me(e,t){
      if(t||Ne(e),e.querySelectorAll)for(var n=e.querySelectorAll('*'),r=0,i=n.length;r<i;r++)Ne(n[r]);
    }function Te(e,t,n,i){
      if(g(i))throw vi('offargs','jqLite#off() does not support the `selector` argument');var o=Ve(e),a=o&&o.events,s=o&&o.handle;if(s)if(t){
        var u=function (t){
          var r=a[t];g(n)&&R(r||[],n),g(n)&&r&&r.length>0||(hi(e,t,s),delete a[t]);
        };r(t.split(' '),function (e){
          u(e),$i[e]&&u($i[e]);
        });
      }else for(t in a)'$destroy'!==t&&hi(e,t,s),delete a[t];
    }function Ne(e,t){
      var n=e.ng339,r=n&&ci[n];if(r){
        if(t)return void delete r.data[t];r.handle&&(r.events.$destroy&&r.handle({},'$destroy'),Te(e)),delete ci[n],e.ng339=void 0;
      }
    }function Ve(e,t){
      var n=e.ng339,r=n&&ci[n];return t&&!r&&(e.ng339=n=ge(),r=ci[n]={events:{},data:{},handle:void 0}),r;
    }function je(e,t,n){
      if(we(e)){
        var r=g(n),i=!r&&t&&!y(t),o=!t,a=Ve(e,!i),s=a&&a.data;if(r)s[t]=n;else{
          if(o)return s;if(i)return s&&s[t];c(s,t);
        }
      }
    }function Ie(e,t){
      return!!e.getAttribute&&(` ${e.getAttribute('class')||''} `).replace(/[\n\t]/g,' ').indexOf(` ${t} `)>-1;
    }function De(e,t){
      t&&e.setAttribute&&r(t.split(' '),function (t){
        e.setAttribute('class',Jr((` ${e.getAttribute('class')||''} `).replace(/[\n\t]/g,' ').replace(` ${Jr(t)} `,' ')));
      });
    }function Pe(e,t){
      if(t&&e.setAttribute){
        var n=(` ${e.getAttribute('class')||''} `).replace(/[\n\t]/g,' ');r(t.split(' '),function (e){
          e=Jr(e),-1===n.indexOf(` ${e} `)&&(n+=`${e} `);
        }),e.setAttribute('class',Jr(n));
      }
    }function _e(e,t){
      if(t)if(t.nodeType)e[e.length++]=t;else{
        var n=t.length;if('number'==typeof n&&t.window!==t){
          if(n)for(var r=0;r<n;r++)e[e.length++]=t[r];
        }else e[e.length++]=t;
      }
    }function Re(e,t){
      return Fe(e,`$${t||'ngController'}Controller`);
    }function Fe(e,t,n){
      e.nodeType==ai&&(e=e.documentElement);for(var r=Gr(t)?t:[t];e;){
        for(var i=0,o=r.length;i<o;i++)if(g(n=Pr.data(e,r[i])))return n;e=e.parentNode||e.nodeType===si&&e.host;
      }
    }function qe(e){
      for(Me(e,!0);e.firstChild;)e.removeChild(e.firstChild);
    }function Ue(e,t){
      t||Me(e);var n=e.parentNode;n&&n.removeChild(e);
    }function Le(t,n){
      n=n||e,'complete'===n.document.readyState?n.setTimeout(t):Pr(n).on('load',t);
    }function He(e,t){
      var n=Ci[t.toLowerCase()];return n&&Ei[_(e)]&&n;
    }function Be(e){
      return Ai[e];
    }function ze(e,t){
      var n=function (n,r){
        n.isDefaultPrevented=function (){
          return n.defaultPrevented;
        };var i=t[r||n.type],o=i?i.length:0;if(o){
          if(m(n.immediatePropagationStopped)){
            var a=n.stopImmediatePropagation;n.stopImmediatePropagation=function (){
              n.immediatePropagationStopped=!0,n.stopPropagation&&n.stopPropagation(),a&&a.call(n);
            };
          }n.isImmediatePropagationStopped=function (){
            return!0===n.immediatePropagationStopped;
          };var s=i.specialHandlerWrapper||We;o>1&&(i=$e(i));for(var u=0;u<o;u++)n.isImmediatePropagationStopped()||s(e,n,i[u]);
        }
      };return n.elem=e,n;
    }function We(e,t,n){
      n.call(e,t);
    }function Ge(e,t,n){
      var r=t.relatedTarget;r&&(r===e||xi.call(e,r))||n.call(e,t);
    }function Ze(){
      this.$get=function (){
        return c(ke,{hasClass:function (e,t){
          return e.attr&&(e=e[0]),Ie(e,t);
        },addClass:function (e,t){
          return e.attr&&(e=e[0]),Pe(e,t);
        },removeClass:function (e,t){
          return e.attr&&(e=e[0]),De(e,t);
        }});
      };
    }function Je(e,t){
      var n=e&&e.$$hashKey;if(n)return'function'==typeof n&&(n=e.$$hashKey()),n;var r=typeof e;return n='function'==r||'object'==r&&null!==e?e.$$hashKey=`${r}:${(t||a)()}`:`${r}:${e}`;
    }function Ye(e,t){
      if(t){
        var n=0;this.nextUid=function (){
          return++n;
        };
      }r(e,this.put,this);
    }function Ke(e){
      return `${Function.prototype.toString.call(e)} `;
    }function Xe(e){
      var t=Ke(e).replace(Vi,'');return t.match(Oi)||t.match(Mi);
    }function Qe(e){
      var t=Xe(e);return t?`function(${(t[1]||'').replace(/[\s\r\n]+/,' ')})`:'fn';
    }function et(e,t,n){
      var i,o,a;if('function'==typeof e){
        if(!(i=e.$inject)){
          if(i=[],e.length){
            if(t)throw w(n)&&n||(n=e.name||Qe(e)),ji('strictdi','{0} is not using explicit annotation and cannot be invoked in strict mode',n);o=Xe(e),r(o[1].split(Ti),function (e){
              e.replace(Ni,function (e,t,n){
                i.push(n);
              });
            });
          }e.$inject=i;
        }
      }else Gr(e)?(a=e.length-1,ce(e[a],'fn'),i=e.slice(0,a)):ce(e,'fn',!0);return i;
    }function tt(e,t){
      function n(e){
        return function (t,n){
          if(!y(t))return e(t,n);r(t,o(e));
        };
      }function i(e,t){
        if(le(e,'service'),(C(t)||Gr(t))&&(t=S.instantiate(t)),!t.$get)throw ji('pget','Provider \'{0}\' must define $get factory method.',e);return x[e+v]=t;
      }function a(e,t){
        return function (){
          var n=k.invoke(t,this);if(m(n))throw ji('undef','Provider \'{0}\' must return a value from $get factory method.',e);return n;
        };
      }function s(e,t,n){
        return i(e,{$get:!1!==n?a(e,t):t});
      }function u(e,t){
        return s(e,['$injector',function (e){
          return e.instantiate(t);
        }]);
      }function c(e,t){
        return s(e,$(t),!1);
      }function l(e,t){
        le(e,'constant'),x[e]=t,E[e]=t;
      }function f(e,t){
        var n=S.get(e+v),r=n.$get;n.$get=function (){
          var e=k.invoke(r,n);return k.invoke(t,null,{$delegate:e});
        };
      }function h(e){
        ue(m(e)||Gr(e),'modulesToLoad','not an array');var t,n=[];return r(e,function (e){
          function r(e){
            var t,n;for(t=0,n=e.length;t<n;t++){
              var r=e[t],i=S.get(r[0]);i[r[1]].apply(i,r[2]);
            }
          }if(!b.get(e)){
            b.put(e,!0);try{
              w(e)?(t=Rr(e),n=n.concat(h(t.requires)).concat(t._runBlocks),r(t._invokeQueue),r(t._configBlocks)):C(e)?n.push(S.invoke(e)):Gr(e)?n.push(S.invoke(e)):ce(e,'module');
            }catch(t){
              throw Gr(e)&&(e=e[e.length-1]),t.message&&t.stack&&-1==t.stack.indexOf(t.message)&&(t=`${t.message}\n${t.stack}`),ji('modulerr','Failed to instantiate module {0} due to:\n{1}',e,t.stack||t.message||t);
            }
          }
        }),n;
      }function p(e,n){
        function r(t,r){
          if(e.hasOwnProperty(t)){
            if(e[t]===d)throw ji('cdep','Circular dependency found: {0}',`${t} <- ${g.join(' <- ')}`);return e[t];
          }try{
            return g.unshift(t),e[t]=d,e[t]=n(t,r);
          }catch(n){
            throw e[t]===d&&delete e[t],n;
          }finally{
            g.shift();
          }
        }function i(e,n,i){
          for(var o=[],a=tt.$$annotate(e,t,i),s=0,u=a.length;s<u;s++){
            var c=a[s];if('string'!=typeof c)throw ji('itkn','Incorrect injection token! Expected service name as string, got {0}',c);o.push(n&&n.hasOwnProperty(c)?n[c]:r(c,i));
          }return o;
        }function o(e){
          return!(Dr<=11)&&('function'==typeof e&&/^(?:class\s|constructor\()/.test(Ke(e)));
        }function a(e,t,n,r){
          'string'==typeof n&&(r=n,n=null);var a=i(e,n,r);return Gr(e)&&(e=e[e.length-1]),o(e)?(a.unshift(null),new(Function.prototype.bind.apply(e,a))):e.apply(t,a);
        }function s(e,t,n){
          var r=Gr(e)?e[e.length-1]:e,o=i(e,t,n);return o.unshift(null),new(Function.prototype.bind.apply(r,o));
        }return{invoke:a,instantiate:s,get:r,annotate:tt.$$annotate,has:function (t){
          return x.hasOwnProperty(t+v)||e.hasOwnProperty(t);
        }};
      }t=!0===t;var d={},v='Provider',g=[],b=new Ye([],!0),x={$provide:{provider:n(i),factory:n(s),service:n(u),value:n(c),constant:n(l),decorator:f}},S=x.$injector=p(x,function (e,t){
          throw zr.isString(t)&&g.push(t),ji('unpr','Unknown provider: {0}',g.join(' <- '));
        }),E={},A=p(E,function (e,t){
          var n=S.get(e+v,t);return k.invoke(n.$get,n,void 0,e);
        }),k=A;x[`$injector${v}`]={$get:$(A)};var O=h(e);return k=A.get('$injector'),k.strictDi=t,r(O,function (e){
        e&&k.invoke(e);
      }),k;
    }function nt(){
      var e=!0;this.disableAutoScrolling=function (){
        e=!1;
      },this.$get=['$window','$location','$rootScope',function (t,n,r){
        function i(e){
          var t=null;return Array.prototype.some.call(e,function (e){
            if('a'===_(e))return t=e,!0;
          }),t;
        }function o(){
          var e=s.yOffset;if(C(e))e=e();else if(D(e)){
            var n=e[0],r=t.getComputedStyle(n);e='fixed'!==r.position?0:n.getBoundingClientRect().bottom;
          }else x(e)||(e=0);return e;
        }function a(e){
          if(e){
            e.scrollIntoView();var n=o();if(n){
              var r=e.getBoundingClientRect().top;t.scrollBy(0,r-n);
            }
          }else t.scrollTo(0,0);
        }function s(e){
          e=w(e)?e:n.hash();var t;e?(t=u.getElementById(e))?a(t):(t=i(u.getElementsByName(e)))?a(t):'top'===e&&a(null):a(null);
        }var u=t.document;return e&&r.$watch(function (){
          return n.hash();
        },function (e,t){
          e===t&&''===e||Le(function (){
            r.$evalAsync(s);
          });
        }),s;
      }];
    }function rt(e,t){
      return e||t?e?t?(Gr(e)&&(e=e.join(' ')),Gr(t)&&(t=t.join(' ')),`${e} ${t}`):e:t:'';
    }function it(e){
      for(var t=0;t<e.length;t++){
        var n=e[t];if(n.nodeType===Di)return n;
      }
    }function ot(e){
      w(e)&&(e=e.split(' '));var t=pe();return r(e,function (e){
        e.length&&(t[e]=!0);
      }),t;
    }function at(e){
      return y(e)?e:{};
    }function st(e,t,n,i){
      function o(e){
        try{
          e.apply(null,L(arguments,1));
        }finally{
          if(0===--g)for(;y.length;)try{
            y.pop()();
          }catch(e){
              n.error(e);
            }
        }
      }function a(e){
        var t=e.indexOf('#');return-1===t?'':e.substr(t);
      }function s(){
        C=null,u(),c();
      }function u(){
        b=E(),b=m(b)?null:b,q(b,O)&&(b=O),O=b;
      }function c(){
        x===l.url()&&w===b||(x=l.url(),w=b,r(A,function (e){
          e(l.url(),b);
        }));
      }var l=this,f=e.location,h=e.history,d=e.setTimeout,$=e.clearTimeout,v={};l.isMock=!1;var g=0,y=[];l.$$completeOutstandingRequest=o,l.$$incOutstandingRequestCount=function (){
        g++;
      },l.notifyWhenNoOutstandingRequests=function (e){
        0===g?e():y.push(e);
      };var b,w,x=f.href,S=t.find('base'),C=null,E=i.history?function (){
        try{
          return h.state;
        }catch(e){}
      }:p;u(),w=b,l.url=function (t,n,r){
        if(m(r)&&(r=null),f!==e.location&&(f=e.location),h!==e.history&&(h=e.history),t){
          var o=w===r;if(x===t&&(!i.history||o))return l;var s=x&&Ut(x)===Ut(t);return x=t,w=r,!i.history||s&&o?(s||(C=t),n?f.replace(t):s?f.hash=a(t):f.href=t,f.href!==t&&(C=t)):(h[n?'replaceState':'pushState'](r,'',t),u(),w=b),C&&(C=t),l;
        }return C||f.href.replace(/%27/g,'\'');
      },l.state=function (){
        return b;
      };var A=[],k=!1,O=null;l.onUrlChange=function (t){
        return k||(i.history&&Pr(e).on('popstate',s),Pr(e).on('hashchange',s),k=!0),A.push(t),t;
      },l.$$applicationDestroyed=function (){
        Pr(e).off('hashchange popstate',s);
      },l.$$checkUrlChange=c,l.baseHref=function (){
        var e=S.attr('href');return e?e.replace(/^(https?\:)?\/\/[^\/]*/,''):'';
      },l.defer=function (e,t){
        var n;return g++,n=d(function (){
          delete v[n],o(e);
        },t||0),v[n]=!0,n;
      },l.defer.cancel=function (e){
        return!!v[e]&&(delete v[e],$(e),o(p),!0);
      };
    }function ut(){
      this.$get=['$window','$log','$sniffer','$document',function (e,t,n,r){
        return new st(e,r,t,n);
      }];
    }function ct(){
      this.$get=function (){
        function e(e,r){
          function i(e){
            e!=h&&(p?p==e&&(p=e.n):p=e,o(e.n,e.p),o(e,h),h=e,h.n=null);
          }function o(e,t){
            e!=t&&(e&&(e.p=t),t&&(t.n=e));
          }if(e in n)throw t('$cacheFactory')('iid','CacheId \'{0}\' is already taken!',e);var a=0,s=c({},r,{id:e}),u=pe(),l=r&&r.capacity||Number.MAX_VALUE,f=pe(),h=null,p=null;return n[e]={put:function (e,t){
            if(!m(t)){
              if(l<Number.MAX_VALUE){
                i(f[e]||(f[e]={key:e}));
              }return e in u||a++,u[e]=t,a>l&&this.remove(p.key),t;
            }
          },get:function (e){
            if(l<Number.MAX_VALUE){
              var t=f[e];if(!t)return;i(t);
            }return u[e];
          },remove:function (e){
            if(l<Number.MAX_VALUE){
              var t=f[e];if(!t)return;t==h&&(h=t.p),t==p&&(p=t.n),o(t.n,t.p),delete f[e];
            }e in u&&(delete u[e],a--);
          },removeAll:function (){
            u=pe(),a=0,f=pe(),h=p=null;
          },destroy:function (){
            u=null,s=null,f=null,delete n[e];
          },info:function (){
            return c({},s,{size:a});
          }};
        }var n={};return e.info=function (){
          var e={};return r(n,function (t,n){
            e[n]=t.info();
          }),e;
        },e.get=function (e){
          return n[e];
        },e;
      };
    }function lt(){
      this.$get=['$cacheFactory',function (e){
        return e('templates');
      }];
    }function ft(){}function ht(t,n){
      function i(e,t,n){
        var i=/^\s*([@&<]|=(\*?))(\??)\s*(\w*)\s*$/,o=pe();return r(e,function (e,r){
          if(e in A)return void(o[r]=A[e]);var a=e.match(i);if(!a)throw Li('iscp','Invalid {3} for directive \'{0}\'. Definition: {... {1}: \'{2}\' ...}',t,r,e,n?'controller bindings definition':'isolate scope definition');o[r]={mode:a[1][0],collection:'*'===a[2],optional:'?'===a[3],attrName:a[4]||r},a[4]&&(A[e]=o[r]);
        }),o;
      }function a(e,t){
        var n={isolateScope:null,bindToController:null};if(y(e.scope)&&(!0===e.bindToController?(n.bindToController=i(e.scope,t,!0),n.isolateScope={}):n.isolateScope=i(e.scope,t,!1)),y(e.bindToController)&&(n.bindToController=i(e.bindToController,t,!0)),y(n.bindToController)){
          var r=e.controller,o=e.controllerAs;if(!r)throw Li('noctrl','Cannot bind to controller without directive \'{0}\'s controller.',t);if(!mt(r,o))throw Li('noident','Cannot bind to controller without identifier for directive \'{0}\'.',t);
        }return n;
      }function s(e){
        var t=e.charAt(0);if(!t||t!==Nr(t))throw Li('baddir','Directive/Component name \'{0}\' is invalid. The first character must be a lowercase letter',e);if(e!==e.trim())throw Li('baddir','Directive/Component name \'{0}\' is invalid. The name should not contain leading or trailing whitespaces',e);
      }function u(e){
        var t=e.require||e.controller&&e.name;return!Gr(t)&&y(t)&&r(t,function (e,n){
          var r=e.match(S);e.substring(r[0].length)||(t[n]=r[0]+n);
        }),t;
      }var l={},f='Directive',v=/^\s*directive\:\s*([\w\-]+)\s+(.*)$/,b=/(([\w\-]+)(?:\:([^;]+))?;?)/,x=P('ngSrc,ngSrcset,src,srcset'),S=/^(?:(\^\^?)?(\?)?(\^\^?)?)?/,E=/^(on[a-z]+|formaction)$/,A=pe();this.directive=function e(n,i){
        return le(n,'directive'),w(n)?(s(n),ue(i,'directiveFactory'),l.hasOwnProperty(n)||(l[n]=[],t.factory(n+f,['$injector','$exceptionHandler',function (e,t){
          var i=[];return r(l[n],function (r,o){
            try{
              var a=e.invoke(r);C(a)?a={compile:$(a)}:!a.compile&&a.link&&(a.compile=$(a.link)),a.priority=a.priority||0,a.index=o,a.name=a.name||n,a.require=u(a),a.restrict=a.restrict||'EA',a.$$moduleName=r.$$moduleName,i.push(a);
            }catch(e){
              t(e);
            }
          }),i;
        }])),l[n].push(i)):r(n,o(e)),this;
      },this.component=function (e,t){
        function n(e){
          function n(t){
            return C(t)||Gr(t)?function (n,r){
              return e.invoke(t,this,{$element:n,$attrs:r});
            }:t;
          }var o=t.template||t.templateUrl?t.template:'',a={controller:i,controllerAs:mt(t.controller)||t.controllerAs||'$ctrl',template:n(o),templateUrl:n(t.templateUrl),transclude:t.transclude,scope:{},bindToController:t.bindings||{},restrict:'E',require:t.require};return r(t,function (e,t){
            '$'===t.charAt(0)&&(a[t]=e);
          }),a;
        }var i=t.controller||function (){};return r(t,function (e,t){
          '$'===t.charAt(0)&&(n[t]=e,C(i)&&(i[t]=e));
        }),n.$inject=['$injector'],this.directive(e,n);
      },this.aHrefSanitizationWhitelist=function (e){
        return g(e)?(n.aHrefSanitizationWhitelist(e),this):n.aHrefSanitizationWhitelist();
      },this.imgSrcSanitizationWhitelist=function (e){
        return g(e)?(n.imgSrcSanitizationWhitelist(e),this):n.imgSrcSanitizationWhitelist();
      };var O=!0;this.debugInfoEnabled=function (e){
        return g(e)?(O=e,this):O;
      };var M=10;this.onChangesTtl=function (e){
        return arguments.length?(M=e,this):M;
      },this.$get=['$injector','$interpolate','$exceptionHandler','$templateRequest','$parse','$controller','$rootScope','$sce','$animate','$$sanitizeUri',function (t,n,i,o,s,u,$,A,T,V){
        function j(){
          try{
            if(!--xe)throw ge=void 0,Li('infchng','{0} $onChanges() iterations reached. Aborting!\n',M);$.$apply(function (){
              for(var e=[],t=0,n=ge.length;t<n;++t)try{
                ge[t]();
              }catch(t){
                  e.push(t);
                }if(ge=void 0,e.length)throw e;
            });
          }finally{
            xe++;
          }
        }function I(e,t){
          if(t){
            var n,r,i,o=Object.keys(t);for(n=0,r=o.length;n<r;n++)i=o[n],this[i]=t[i];
          }else this.$attr={};this.$$element=e;
        }function D(e,t,n){
          we.innerHTML=`<span ${t}>`;var r=we.firstChild.attributes,i=r[0];r.removeNamedItem(i.name),i.value=n,e.attributes.setNamedItem(i);
        }function P(e,t){
          try{
            e.addClass(t);
          }catch(e){}
        }function F(t,n,r,i,o){
          t instanceof Pr||(t=Pr(t));for(var a=/\S+/,s=0,u=t.length;s<u;s++){
            var c=t[s];c.nodeType===ii&&c.nodeValue.match(a)&&Ae(c,t[s]=e.document.createElement('span'));
          }var l=B(t,n,t,r,i,o);F.$$addScopeClass(t);var f=null;return function (e,n,r){
            ue(e,'scope'),o&&o.needsNewScope&&(e=e.$parent.$new()),r=r||{};var i=r.parentBoundTranscludeFn,a=r.transcludeControllers,s=r.futureParentElement;i&&i.$$boundTransclude&&(i=i.$$boundTransclude),f||(f=U(s));var u;if(u='html'!==f?Pr(le(f,Pr('<div>').append(t).html())):n?Si.clone.call(t):t,a)for(var c in a)u.data(`$${c}Controller`,a[c].instance);return F.$$addScopeInfo(u,e),n&&n(u,e),l&&l(e,u,u,i),u;
          };
        }function U(e){
          var t=e&&e[0];return t&&'foreignobject'!==_(t)&&Lr.call(t).match(/SVG/)?'svg':'html';
        }function B(e,t,n,r,i,o){
          function a(e,n,r,i){
            var o,a,s,u,c,l,f,h,$;if(p){
              var v=n.length;for($=new Array(v),c=0;c<d.length;c+=3)f=d[c],$[f]=n[f];
            }else $=n;for(c=0,l=d.length;c<l;)s=$[d[c++]],o=d[c++],a=d[c++],o?(o.scope?(u=e.$new(),F.$$addScopeInfo(Pr(s),u)):u=e,h=o.transcludeOnThisElement?z(e,o.transclude,i):!o.templateOnThisElement&&i?i:!i&&t?z(e,t):null,o(a,u,s,r,h)):a&&a(e,s.childNodes,void 0,i);
          }for(var s,u,c,l,f,h,p,d=[],$=0;$<e.length;$++)s=new I,u=W(e[$],[],s,0===$?r:void 0,i),c=u.length?K(u,e[$],s,t,n,null,[],[],o):null,c&&c.scope&&F.$$addScopeClass(s.$$element),f=c&&c.terminal||!(l=e[$].childNodes)||!l.length?null:B(l,c?(c.transcludeOnThisElement||!c.templateOnThisElement)&&c.transclude:t),(c||f)&&(d.push($,c,f),h=!0,p=p||c),o=null;return h?a:null;
        }function z(e,t,n){
          function r(r,i,o,a,s){
            return r||(r=e.$new(!1,s),r.$$transcluded=!0),t(r,i,{parentBoundTranscludeFn:n,transcludeControllers:o,futureParentElement:a});
          }var i=r.$$slots=pe();for(var o in t.$$slots)t.$$slots[o]?i[o]=z(e,t.$$slots[o],n):i[o]=null;return r;
        }function W(e,t,n,r,i){
          var o,a,s=e.nodeType,u=n.$attr;switch(s){
          case ri:te(t,dt(_(e)),'E',r,i);for(var c,l,f,h,p,d,$=e.attributes,m=0,g=$&&$.length;m<g;m++){
            var x=!1,S=!1;c=$[m],l=c.name,p=Jr(c.value),h=dt(l),(d=ke.test(h))&&(l=l.replace(Bi,'').substr(8).replace(/_(.)/g,function (e,t){
              return t.toUpperCase();
            }));var C=h.match(Me);C&&ne(C[1])&&(x=l,S=`${l.substr(0,l.length-5)}end`,l=l.substr(0,l.length-6)),f=dt(l.toLowerCase()),u[f]=l,!d&&n.hasOwnProperty(f)||(n[f]=p,He(e,f)&&(n[f]=!0)),he(e,t,p,f,d),te(t,f,'A',r,i,x,S);
          }if(a=e.className,y(a)&&(a=a.animVal),w(a)&&''!==a)for(;o=b.exec(a);)f=dt(o[2]),te(t,f,'C',r,i)&&(n[f]=Jr(o[3])),a=a.substr(o.index+o[0].length);break;case ii:if(11===Dr)for(;e.parentNode&&e.nextSibling&&e.nextSibling.nodeType===ii;)e.nodeValue=e.nodeValue+e.nextSibling.nodeValue,e.parentNode.removeChild(e.nextSibling);ce(t,e.nodeValue);break;case oi:try{
            o=v.exec(e.nodeValue),o&&(f=dt(o[1]),te(t,f,'M',r,i)&&(n[f]=Jr(o[2])));
          }catch(e){}
          }return t.sort(oe),t;
        }function G(e,t,n){
          var r=[],i=0;if(t&&e.hasAttribute&&e.hasAttribute(t))do{
            if(!e)throw Li('uterdir','Unterminated attribute, found \'{0}\' but no matching \'{1}\' found.',t,n);e.nodeType==ri&&(e.hasAttribute(t)&&i++,e.hasAttribute(n)&&i--),r.push(e),e=e.nextSibling;
          }while(i>0);else r.push(e);return Pr(r);
        }function Z(e,t,n){
          return function (r,i,o,a,s){
            return i=G(i[0],t,n),e(r,i,o,a,s);
          };
        }function J(e,t,n,r,i,o){
          var a;return e?F(t,n,r,i,o):function (){
            return a||(a=F(t,n,r,i,o),t=n=o=null),a.apply(this,arguments);
          };
        }function K(e,t,n,o,a,s,u,l,f){
          function h(e,t,n,r){
            e&&(n&&(e=Z(e,n,r)),e.require=d.require,e.directiveName=$,(E===d||d.$$isolateScope)&&(e=$e(e,{isolateScope:!0})),u.push(e)),t&&(n&&(t=Z(t,n,r)),t.require=d.require,t.directiveName=$,(E===d||d.$$isolateScope)&&(t=$e(t,{isolateScope:!0})),l.push(t));
          }function p(e,o,a,s,f){
            function h(e,t,n,r){
              var i;if(k(e)||(r=n,n=t,t=e,e=void 0),N&&(i=b),n||(n=N?O.parent():O),!r)return f(e,t,i,n,R);var o=f.$$slots[r];if(o)return o(e,t,i,n,R);if(m(o))throw Li('noslot','No parent directive that requires a transclusion with slot name "{0}". Element: {1}',r,Y(O));
            }var p,d,$,v,g,b,w,O,M,T;t===a?(M=n,O=n.$$element):(O=Pr(a),M=new I(O,n)),g=o,E?v=o.$new(!0):x&&(g=o.$parent),f&&(w=h,w.$$boundTransclude=f,w.isSlotFilled=function (e){
              return!!f.$$slots[e];
            }),S&&(b=Q(O,M,w,S,v,o,E)),E&&(F.$$addScopeInfo(O,v,!0,!(A&&(A===E||A===E.$$originalDirective))),F.$$addScopeClass(O,!0),v.$$isolateBindings=E.$$isolateBindings,T=me(o,M,v,v.$$isolateBindings,E),T.removeWatches&&v.$on('$destroy',T.removeWatches));for(var V in b){
              var j=S[V],D=b[V],P=j.$$bindings.bindToController;D.identifier&&P?D.bindingInfo=me(g,M,D.instance,P,j):D.bindingInfo={};var _=D();_!==D.instance&&(D.instance=_,O.data(`$${j.name}Controller`,_),D.bindingInfo.removeWatches&&D.bindingInfo.removeWatches(),D.bindingInfo=me(g,M,D.instance,P,j));
            }for(r(S,function (e,t){
              var n=e.require;e.bindToController&&!Gr(n)&&y(n)&&c(b[t].instance,X(t,n,O,b));
            }),r(b,function (e){
                var t=e.instance;if(C(t.$onChanges))try{
                  t.$onChanges(e.bindingInfo.initialChanges);
                }catch(e){
                    i(e);
                  }if(C(t.$onInit))try{
                  t.$onInit();
                }catch(e){
                    i(e);
                  }C(t.$onDestroy)&&g.$on('$destroy',function (){
                  t.$onDestroy();
                });
              }),p=0,
              d=u.length;p<d;p++)$=u[p],ve($,$.isolateScope?v:o,O,M,$.require&&X($.directiveName,$.require,O,b),w);var R=o;for(E&&(E.template||null===E.templateUrl)&&(R=v),e&&e(R,a.childNodes,void 0,f),p=l.length-1;p>=0;p--)$=l[p],ve($,$.isolateScope?v:o,O,M,$.require&&X($.directiveName,$.require,O,b),w);r(b,function (e){
              var t=e.instance;C(t.$postLink)&&t.$postLink();
            });
          }f=f||{};for(var d,$,v,g,b,w=-Number.MAX_VALUE,x=f.newScopeDirective,S=f.controllerDirectives,E=f.newIsolateScopeDirective,A=f.templateDirective,O=f.nonTlbTranscludeDirective,M=!1,T=!1,N=f.hasElementTranscludeDirective,V=n.$$element=Pr(t),j=s,D=o,P=!1,R=!1,q=0,U=e.length;q<U;q++){
            d=e[q];var B=d.$$start,z=d.$$end;if(B&&(V=G(t,B,z)),v=void 0,w>d.priority)break;if((b=d.scope)&&(d.templateUrl||(y(b)?(ae('new/isolated scope',E||x,d,V),E=d):ae('new/isolated scope',E,d,V)),x=x||d),$=d.name,!P&&(d.replace&&(d.templateUrl||d.template)||d.transclude&&!d.$$tlb)){
              for(var K,te=q+1;K=e[te++];)if(K.transclude&&!K.$$tlb||K.replace&&(K.templateUrl||K.template)){
                R=!0;break;
              }P=!0;
            }if(!d.templateUrl&&d.controller&&(b=d.controller,S=S||pe(),ae(`'${$}' controller`,S[$],d,V),S[$]=d),b=d.transclude)if(M=!0,d.$$tlb||(ae('transclusion',O,d,V),O=d),'element'==b)N=!0,w=d.priority,v=V,V=n.$$element=Pr(F.$$createComment($,n[$])),t=V[0],de(a,L(v),t),v[0].$$parentNode=v[0].parentNode,D=J(R,v,o,w,j&&j.name,{nonTlbTranscludeDirective:O});else{
              var ne=pe();if(v=Pr(Oe(t)).contents(),y(b)){
                v=[];var oe=pe(),se=pe();r(b,function (e,t){
                  var n='?'===e.charAt(0);e=n?e.substring(1):e,oe[e]=t,ne[t]=null,se[t]=n;
                }),r(V.contents(),function (e){
                  var t=oe[dt(_(e))];t?(se[t]=!0,ne[t]=ne[t]||[],ne[t].push(e)):v.push(e);
                }),r(se,function (e,t){
                  if(!e)throw Li('reqslot','Required transclusion slot `{0}` was not filled.',t);
                });for(var ue in ne)ne[ue]&&(ne[ue]=J(R,ne[ue],o));
              }V.empty(),D=J(R,v,o,void 0,void 0,{needsNewScope:d.$$isolateScope||d.$$newScope}),D.$$slots=ne;
            }if(d.template)if(T=!0,ae('template',A,d,V),A=d,b=C(d.template)?d.template(V,n):d.template,b=Ee(b),d.replace){
              if(j=d,v=be(b)?[]:vt(le(d.templateNamespace,Jr(b))),t=v[0],1!=v.length||t.nodeType!==ri)throw Li('tplrt','Template for directive \'{0}\' must have exactly one root element. {1}',$,'');de(a,V,t);var ce={$attr:{}},fe=W(t,[],ce),he=e.splice(q+1,e.length-(q+1));(E||x)&&ee(fe,E,x),e=e.concat(fe).concat(he),re(n,ce),U=e.length;
            }else V.html(b);if(d.templateUrl)T=!0,ae('template',A,d,V),A=d,d.replace&&(j=d),p=ie(e.splice(q,e.length-q),V,n,a,M&&D,u,l,{controllerDirectives:S,newScopeDirective:x!==d&&x,newIsolateScopeDirective:E,templateDirective:A,nonTlbTranscludeDirective:O}),U=e.length;else if(d.compile)try{
              g=d.compile(V,n,D);var ge=d.$$originalDirective||d;C(g)?h(null,H(ge,g),B,z):g&&h(H(ge,g.pre),H(ge,g.post),B,z);
            }catch(e){
                i(e,Y(V));
              }d.terminal&&(p.terminal=!0,w=Math.max(w,d.priority));
          }return p.scope=x&&!0===x.scope,p.transcludeOnThisElement=M,p.templateOnThisElement=T,p.transclude=D,f.hasElementTranscludeDirective=N,p;
        }function X(e,t,n,i){
          var o;if(w(t)){
            var a=t.match(S),s=t.substring(a[0].length),u=a[1]||a[3],c='?'===a[2];if('^^'===u?n=n.parent():(o=i&&i[s],o=o&&o.instance),!o){
              var l=`$${s}Controller`;o=u?n.inheritedData(l):n.data(l);
            }if(!o&&!c)throw Li('ctreq','Controller \'{0}\', required by directive \'{1}\', can\'t be found!',s,e);
          }else if(Gr(t)){
            o=[];for(var f=0,h=t.length;f<h;f++)o[f]=X(e,t[f],n,i);
          }else y(t)&&(o={},r(t,function (t,r){
            o[r]=X(e,t,n,i);
          }));return o||null;
        }function Q(e,t,n,r,i,o,a){
          var s=pe();for(var c in r){
            var l=r[c],f={$scope:l===a||l.$$isolateScope?i:o,$element:e,$attrs:t,$transclude:n},h=l.controller;'@'==h&&(h=t[l.name]);var p=u(h,f,!0,l.controllerAs);s[l.name]=p,e.data(`$${l.name}Controller`,p.instance);
          }return s;
        }function ee(e,t,n){
          for(var r=0,i=e.length;r<i;r++)e[r]=h(e[r],{$$isolateScope:t,$$newScope:n});
        }function te(e,n,r,o,s,u,c){
          if(n===s)return null;var p=null;if(l.hasOwnProperty(n))for(var d,$=t.get(n+f),v=0,g=$.length;v<g;v++)try{
            if(d=$[v],(m(o)||o>d.priority)&&-1!=d.restrict.indexOf(r)){
              if(u&&(d=h(d,{$$start:u,$$end:c})),!d.$$bindings){
                var b=d.$$bindings=a(d,d.name);y(b.isolateScope)&&(d.$$isolateBindings=b.isolateScope);
              }e.push(d),p=d;
            }
          }catch(e){
              i(e);
            }return p;
        }function ne(e){
          if(l.hasOwnProperty(e))for(var n,r=t.get(e+f),i=0,o=r.length;i<o;i++)if(n=r[i],n.multiElement)return!0;return!1;
        }function re(e,t){
          var n=t.$attr,i=e.$attr;e.$$element;r(e,function (r,i){
            '$'!=i.charAt(0)&&(t[i]&&t[i]!==r&&(r+=('style'===i?';':' ')+t[i]),e.$set(i,r,!0,n[i]));
          }),r(t,function (t,r){
            e.hasOwnProperty(r)||'$'===r.charAt(0)||(e[r]=t,'class'!==r&&'style'!==r&&(i[r]=n[r]));
          });
        }function ie(e,t,n,i,a,s,u,c){
          var l,f,p=[],d=t[0],$=e.shift(),v=h($,{templateUrl:null,transclude:null,replace:null,$$originalDirective:$}),m=C($.templateUrl)?$.templateUrl(t,n):$.templateUrl,g=$.templateNamespace;return t.empty(),o(m).then(function (o){
            var h,b,w,x;if(o=Ee(o),$.replace){
              if(w=be(o)?[]:vt(le(g,Jr(o))),h=w[0],1!=w.length||h.nodeType!==ri)throw Li('tplrt','Template for directive \'{0}\' must have exactly one root element. {1}',$.name,m);b={$attr:{}},de(i,t,h);var S=W(h,[],b);y($.scope)&&ee(S,!0),e=S.concat(e),re(n,b);
            }else h=d,t.html(o);for(e.unshift(v),l=K(e,h,n,a,t,$,s,u,c),r(i,function (e,n){
              e==h&&(i[n]=t[0]);
            }),f=B(t[0].childNodes,a);p.length;){
              var C=p.shift(),E=p.shift(),A=p.shift(),k=p.shift(),O=t[0];if(!C.$$destroyed){
                if(E!==d){
                  var M=E.className;c.hasElementTranscludeDirective&&$.replace||(O=Oe(h)),de(A,Pr(E),O),P(Pr(O),M);
                }x=l.transcludeOnThisElement?z(C,l.transclude,k):k,l(f,C,O,i,x);
              }
            }p=null;
          }),function (e,t,n,r,i){
            var o=i;t.$$destroyed||(p?p.push(t,n,r,o):(l.transcludeOnThisElement&&(o=z(t,l.transclude,i)),l(f,t,n,r,o)));
          };
        }function oe(e,t){
          var n=t.priority-e.priority;return 0!==n?n:e.name!==t.name?e.name<t.name?-1:1:e.index-t.index;
        }function ae(e,t,n,r){
          function i(e){
            return e?` (module: ${e})`:'';
          }if(t)throw Li('multidir','Multiple directives [{0}{1}, {2}{3}] asking for {4} on: {5}',t.name,i(t.$$moduleName),n.name,i(n.$$moduleName),e,Y(r));
        }function ce(e,t){
          var r=n(t,!0);r&&e.push({priority:0,compile:function (e){
            var t=e.parent(),n=!!t.length;return n&&F.$$addBindingClass(t),function (e,t){
              var i=t.parent();n||F.$$addBindingClass(i),F.$$addBindingInfo(i,r.expressions),e.$watch(r,function (e){
                t[0].nodeValue=e;
              });
            };
          }});
        }function le(t,n){
          switch(t=Nr(t||'html')){
          case'svg':case'math':var r=e.document.createElement('div');return r.innerHTML=`<${t}>${n}</${t}>`,r.childNodes[0].childNodes;default:return n;
          }
        }function fe(e,t){
          if('srcdoc'==t)return A.HTML;var n=_(e);return'xlinkHref'==t||'form'==n&&'action'==t||'img'!=n&&('src'==t||'ngSrc'==t)?A.RESOURCE_URL:void 0;
        }function he(e,t,r,i,o){
          var a=fe(e,i);o=x[i]||o;var s=n(r,!0,a,o);if(s){
            if('multiple'===i&&'select'===_(e))throw Li('selmulti','Binding to the \'multiple\' attribute is not supported. Element: {0}',Y(e));t.push({priority:100,compile:function (){
              return{pre:function (e,t,u){
                var c=u.$$observers||(u.$$observers=pe());if(E.test(i))throw Li('nodomevents','Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.');var l=u[i];l!==r&&(s=l&&n(l,!0,a,o),r=l),s&&(u[i]=s(e),(c[i]||(c[i]=[])).$$inter=!0,(u.$$observers&&u.$$observers[i].$$scope||e).$watch(s,function (e,t){
                  'class'===i&&e!=t?u.$updateClass(e,t):u.$set(i,e);
                }));
              }};
            }});
          }
        }function de(t,n,r){
          var i,o,a=n[0],s=n.length,u=a.parentNode;if(t)for(i=0,o=t.length;i<o;i++)if(t[i]==a){
            t[i++]=r;for(var c=i,l=c+s-1,f=t.length;c<f;c++,l++)l<f?t[c]=t[l]:delete t[c];t.length-=s-1,t.context===a&&(t.context=r);break;
          }u&&u.replaceChild(r,a);var h=e.document.createDocumentFragment();for(i=0;i<s;i++)h.appendChild(n[i]);for(Pr.hasData(a)&&(Pr.data(r,Pr.data(a)),Pr(a).off('$destroy')),Pr.cleanData(h.querySelectorAll('*')),i=1;i<s;i++)delete n[i];n[0]=r,n.length=1;
        }function $e(e,t){
          return c(function (){
            return e.apply(null,arguments);
          },e,t);
        }function ve(e,t,n,r,o,a){
          try{
            e(t,n,r,o,a);
          }catch(e){
            i(e,Y(n));
          }
        }function me(e,t,i,o,a){
          function u(t,n,r){
            C(i.$onChanges)&&n!==r&&(ge||(e.$$postDigest(j),ge=[]),l||(l={},ge.push(c)),l[t]&&(r=l[t].previousValue),l[t]=new pt(r,n));
          }function c(){
            i.$onChanges(l),l=void 0;
          }var l,f=[],h={};return r(o,function (r,o){
            var c,l,d,$,v,m=r.attrName,g=r.optional,y=r.mode;switch(y){
            case'@':g||Tr.call(t,m)||(i[o]=t[m]=void 0),t.$observe(m,function (e){
              if(w(e)||N(e)){
                var t=i[o];u(o,e,t),i[o]=e;
              }
            }),t.$$observers[m].$$scope=e,c=t[m],w(c)?i[o]=n(c)(e):N(c)&&(i[o]=c),h[o]=new pt(Hi,i[o]);break;case'=':if(!Tr.call(t,m)){
              if(g)break;t[m]=void 0;
            }if(g&&!t[m])break;l=s(t[m]),$=l.literal?q:function (e,t){
                return e===t||e!==e&&t!==t;
              },d=l.assign||function (){
                throw c=i[o]=l(e),Li('nonassign','Expression \'{0}\' in attribute \'{1}\' used with directive \'{2}\' is non-assignable!',t[m],m,a.name);
              },c=i[o]=l(e);var b=function (t){
                return $(t,i[o])||($(t,c)?d(e,t=i[o]):i[o]=t),c=t;
              };b.$stateful=!0,v=r.collection?e.$watchCollection(t[m],b):e.$watch(s(t[m],b),null,l.literal),f.push(v);break;case'<':if(!Tr.call(t,m)){
              if(g)break;t[m]=void 0;
            }if(g&&!t[m])break;l=s(t[m]);var x=i[o]=l(e);h[o]=new pt(Hi,i[o]),v=e.$watch(l,function (e,t){
                if(t===e){
                  if(t===x)return;t=x;
                }u(o,e,t),i[o]=e;
              },l.literal),f.push(v);break;case'&':if((l=t.hasOwnProperty(m)?s(t[m]):p)===p&&g)break;i[o]=function (t){
              return l(e,t);
            };
            }
          }),{initialChanges:h,removeWatches:f.length&&function (){
            for(var e=0,t=f.length;e<t;++e)f[e]();
          }};
        }var ge,ye=/^\w/,we=e.document.createElement('div'),xe=M;I.prototype={$normalize:dt,$addClass:function (e){
          e&&e.length>0&&T.addClass(this.$$element,e);
        },$removeClass:function (e){
          e&&e.length>0&&T.removeClass(this.$$element,e);
        },$updateClass:function (e,t){
          var n=$t(e,t);n&&n.length&&T.addClass(this.$$element,n);var r=$t(t,e);r&&r.length&&T.removeClass(this.$$element,r);
        },$set:function (e,t,n,o){
          var a,s=this.$$element[0],u=He(s,e),c=Be(e),l=e;if(u?(this.$$element.prop(e,t),o=u):c&&(this[c]=t,l=c),this[e]=t,o?this.$attr[e]=o:(o=this.$attr[e])||(this.$attr[e]=o=se(e,'-')),'a'===(a=_(this.$$element))&&('href'===e||'xlinkHref'===e)||'img'===a&&'src'===e)this[e]=t=V(t,'src'===e);else if('img'===a&&'srcset'===e&&g(t)){
            for(var f='',h=Jr(t),p=/(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/,d=/\s/.test(h)?p:/(,)/,$=h.split(d),v=Math.floor($.length/2),y=0;y<v;y++){
              var b=2*y;f+=V(Jr($[b]),!0),f+=` ${Jr($[b+1])}`;
            }var w=Jr($[2*y]).split(/\s/);f+=V(Jr(w[0]),!0),2===w.length&&(f+=` ${Jr(w[1])}`),this[e]=t=f;
          }!1!==n&&(null===t||m(t)?this.$$element.removeAttr(o):ye.test(o)?this.$$element.attr(o,t):D(this.$$element[0],o,t));var x=this.$$observers;x&&r(x[l],function (e){
            try{
              e(t);
            }catch(e){
              i(e);
            }
          });
        },$observe:function (e,t){
          var n=this,r=n.$$observers||(n.$$observers=pe()),i=r[e]||(r[e]=[]);return i.push(t),$.$evalAsync(function (){
            i.$$inter||!n.hasOwnProperty(e)||m(n[e])||t(n[e]);
          }),function (){
            R(i,t);
          };
        }};var Se=n.startSymbol(),Ce=n.endSymbol(),Ee='{{'==Se&&'}}'==Ce?d:function (e){
            return e.replace(/\{\{/g,Se).replace(/}}/g,Ce);
          },ke=/^ngAttr[A-Z]/,Me=/^(.+)Start$/;return F.$$addBindingInfo=O?function (e,t){
          var n=e.data('$binding')||[];Gr(t)?n=n.concat(t):n.push(t),e.data('$binding',n);
        }:p,F.$$addBindingClass=O?function (e){
          P(e,'ng-binding');
        }:p,F.$$addScopeInfo=O?function (e,t,n,r){
          var i=n?r?'$isolateScopeNoTemplate':'$isolateScope':'$scope';e.data(i,t);
        }:p,F.$$addScopeClass=O?function (e,t){
          P(e,t?'ng-isolate-scope':'ng-scope');
        }:p,F.$$createComment=function (t,n){
          var r='';return O&&(r=` ${t||''}: `,n&&(r+=`${n} `)),e.document.createComment(r);
        },F;
      }];
    }function pt(e,t){
      this.previousValue=e,this.currentValue=t;
    }function dt(e){
      return ye(e.replace(Bi,''));
    }function $t(e,t){
      var n='',r=e.split(/\s+/),i=t.split(/\s+/);e:for(var o=0;o<r.length;o++){
        for(var a=r[o],s=0;s<i.length;s++)if(a==i[s])continue e;n+=(n.length>0?' ':'')+a;
      }return n;
    }function vt(e){
      e=Pr(e);var t=e.length;if(t<=1)return e;for(;t--;){
        e[t].nodeType===oi&&qr.call(e,t,1);
      }return e;
    }function mt(e,t){
      if(t&&w(t))return t;if(w(e)){
        var n=Wi.exec(e);if(n)return n[3];
      }
    }function gt(){
      var e={},n=!1;this.has=function (t){
        return e.hasOwnProperty(t);
      },this.register=function (t,n){
        le(t,'controller'),y(t)?c(e,t):e[t]=n;
      },this.allowGlobals=function (){
        n=!0;
      },this.$get=['$injector','$window',function (r,i){
        function o(e,n,r,i){
          if(!e||!y(e.$scope))throw t('$controller')('noscp','Cannot export controller \'{0}\' as \'{1}\'! No $scope object provided via `locals`.',i,n);e.$scope[n]=r;
        }return function (t,a,s,u){
          var l,f,h,p;if(s=!0===s,u&&w(u)&&(p=u),w(t)){
            if(!(f=t.match(Wi)))throw zi('ctrlfmt','Badly formed controller string \'{0}\'. Must match `__name__ as __id__` or `__name__`.',t);h=f[1],p=p||f[3],t=e.hasOwnProperty(h)?e[h]:fe(a.$scope,h,!0)||(n?fe(i,h,!0):void 0),ce(t,h,!0);
          }if(s){
            var d=(Gr(t)?t[t.length-1]:t).prototype;l=Object.create(d||null),p&&o(a,p,l,h||t.name);return c(function (){
              var e=r.invoke(t,l,a,h);return e!==l&&(y(e)||C(e))&&(l=e,p&&o(a,p,l,h||t.name)),l;
            },{instance:l,identifier:p});
          }return l=r.instantiate(t,a,h),p&&o(a,p,l,h||t.name),l;
        };
      }];
    }function yt(){
      this.$get=['$window',function (e){
        return Pr(e.document);
      }];
    }function bt(){
      this.$get=['$log',function (e){
        return function (t,n){
          e.error.apply(e,arguments);
        };
      }];
    }function wt(e){
      return y(e)?S(e)?e.toISOString():z(e):e;
    }function xt(){
      this.$get=function (){
        return function (e){
          if(!e)return'';var t=[];return i(e,function (e,n){
            null===e||m(e)||(Gr(e)?r(e,function (e){
              t.push(`${te(n)}=${te(wt(e))}`);
            }):t.push(`${te(n)}=${te(wt(e))}`));
          }),t.join('&');
        };
      };
    }function St(){
      this.$get=function (){
        return function (e){
          function t(e,o,a){
            null===e||m(e)||(Gr(e)?r(e,function (e,n){
              t(e,`${o}[${y(e)?n:''}]`);
            }):y(e)&&!S(e)?i(e,function (e,n){
              t(e,o+(a?'':'[')+n+(a?'':']'));
            }):n.push(`${te(o)}=${te(wt(e))}`));
          }if(!e)return'';var n=[];return t(e,'',!0),n.join('&');
        };
      };
    }function Ct(e,t){
      if(w(e)){
        var n=e.replace(Xi,'').trim();if(n){
          var r=t('Content-Type');(r&&0===r.indexOf(Zi)||Et(n))&&(e=W(n));
        }
      }return e;
    }function Et(e){
      var t=e.match(Yi);return t&&Ki[t[0]].test(e);
    }function At(e){
      function t(e,t){
        e&&(i[e]=i[e]?`${i[e]}, ${t}`:t);
      }var n,i=pe();return w(e)?r(e.split('\n'),function (e){
        n=e.indexOf(':'),t(Nr(Jr(e.substr(0,n))),Jr(e.substr(n+1)));
      }):y(e)&&r(e,function (e,n){
        t(Nr(n),Jr(e));
      }),i;
    }function kt(e){
      var t;return function (n){
        if(t||(t=At(e)),n){
          var r=t[Nr(n)];return void 0===r&&(r=null),r;
        }return t;
      };
    }function Ot(e,t,n,i){
      return C(i)?i(e,t,n):(r(i,function (r){
        e=r(e,t,n);
      }),e);
    }function Mt(e){
      return 200<=e&&e<300;
    }function Tt(){
      var e=this.defaults={transformResponse:[Ct],transformRequest:[function (e){
          return!y(e)||O(e)||T(e)||M(e)?e:z(e);
        }],headers:{common:{Accept:'application/json, text/plain, */*'},post:$e(Ji),put:$e(Ji),patch:$e(Ji)},xsrfCookieName:'XSRF-TOKEN',xsrfHeaderName:'X-XSRF-TOKEN',paramSerializer:'$httpParamSerializer'},n=!1;this.useApplyAsync=function (e){
        return g(e)?(n=!!e,this):n;
      };var i=!0;this.useLegacyPromiseExtensions=function (e){
        return g(e)?(i=!!e,this):i;
      };var o=this.interceptors=[];this.$get=['$httpBackend','$$cookieReader','$cacheFactory','$rootScope','$q','$injector',function (a,s,u,l,f,h){
        function p(n){
          function o(e){
            var t=c({},e);return t.data=Ot(e.data,e.headers,e.status,s.transformResponse),Mt(e.status)?t:f.reject(t);
          }function a(e,t){
            var n,i={};return r(e,function (e,r){
              C(e)?null!=(n=e(t))&&(i[r]=n):i[r]=e;
            }),i;
          }if(!y(n))throw t('$http')('badreq','Http request configuration must be an object.  Received: {0}',n);if(!w(n.url))throw t('$http')('badreq','Http request configuration url must be a string.  Received: {0}',n.url);var s=c({method:'get',transformRequest:e.transformRequest,transformResponse:e.transformResponse,paramSerializer:e.paramSerializer},n);s.headers=function (t){
            var n,r,i,o=e.headers,s=c({},t.headers);o=c({},o.common,o[Nr(t.method)]);e:for(n in o){
              r=Nr(n);for(i in s)if(Nr(i)===r)continue e;s[n]=o[n];
            }return a(s,$e(t));
          }(n),s.method=Vr(s.method),s.paramSerializer=w(s.paramSerializer)?h.get(s.paramSerializer):s.paramSerializer;var u=function (t){
              var n=t.headers,i=Ot(t.data,kt(n),void 0,t.transformRequest);return m(i)&&r(n,function (e,t){
                'content-type'===Nr(t)&&delete n[t];
              }),m(t.withCredentials)&&!m(e.withCredentials)&&(t.withCredentials=e.withCredentials),d(t,i).then(o,o);
            },l=[u,void 0],p=f.when(s);for(r(b,function (e){
            (e.request||e.requestError)&&l.unshift(e.request,e.requestError),(e.response||e.responseError)&&l.push(e.response,e.responseError);
          });l.length;){
            var $=l.shift(),v=l.shift();p=p.then($,v);
          }return i?(p.success=function (e){
            return ce(e,'fn'),p.then(function (t){
              e(t.data,t.status,t.headers,s);
            }),p;
          },p.error=function (e){
              return ce(e,'fn'),p.then(null,function (t){
                e(t.data,t.status,t.headers,s);
              }),p;
            }):(p.success=eo('success'),p.error=eo('error')),p;
        }function d(t,i){
          function o(e){
            if(e){
              var t={};return r(e,function (e,r){
                t[r]=function (t){
                  function r(){
                    e(t);
                  }n?l.$applyAsync(r):l.$$phase?r():l.$apply(r);
                };
              }),t;
            }
          }function u(e,t,r,i){
            function o(){
              c(t,e,r,i);
            }b&&(Mt(e)?b.put(E,[e,t,At(r),i]):b.remove(E)),n?l.$applyAsync(o):(o(),l.$$phase||l.$apply());
          }function c(e,n,r,i){
            n=n>=-1?n:0,(Mt(n)?x.resolve:x.reject)({data:e,status:n,headers:kt(r),config:t,statusText:i});
          }function h(e){
            c(e.data,e.status,$e(e.headers()),e.statusText);
          }function d(){
            var e=p.pendingRequests.indexOf(t);-1!==e&&p.pendingRequests.splice(e,1);
          }var b,w,x=f.defer(),S=x.promise,C=t.headers,E=$(t.url,t.paramSerializer(t.params));if(p.pendingRequests.push(t),S.then(d,d),!t.cache&&!e.cache||!1===t.cache||'GET'!==t.method&&'JSONP'!==t.method||(b=y(t.cache)?t.cache:y(e.cache)?e.cache:v),b&&(w=b.get(E),g(w)?V(w)?w.then(h,h):Gr(w)?c(w[1],w[0],$e(w[2]),w[3]):c(w,200,{},'OK'):b.put(E,S)),m(w)){
            var A=jn(t.url)?s()[t.xsrfCookieName||e.xsrfCookieName]:void 0;A&&(C[t.xsrfHeaderName||e.xsrfHeaderName]=A),a(t.method,E,i,u,C,t.timeout,t.withCredentials,t.responseType,o(t.eventHandlers),o(t.uploadEventHandlers));
          }return S;
        }function $(e,t){
          return t.length>0&&(e+=(-1==e.indexOf('?')?'?':'&')+t),e;
        }var v=u('$http');e.paramSerializer=w(e.paramSerializer)?h.get(e.paramSerializer):e.paramSerializer;var b=[];return r(o,function (e){
          b.unshift(w(e)?h.get(e):h.invoke(e));
        }),p.pendingRequests=[],function (e){
          r(arguments,function (e){
            p[e]=function (t,n){
              return p(c({},n||{},{method:e,url:t}));
            };
          });
        }('get','delete','head','jsonp'),function (e){
          r(arguments,function (e){
            p[e]=function (t,n,r){
              return p(c({},r||{},{method:e,url:t,data:n}));
            };
          });
        }('post','put','patch'),p.defaults=e,p;
      }];
    }function Nt(){
      this.$get=function (){
        return function (){
          return new e.XMLHttpRequest;
        };
      };
    }function Vt(){
      this.$get=['$browser','$window','$document','$xhrFactory',function (e,t,n,r){
        return jt(e,r,e.defer,t.angular.callbacks,n[0]);
      }];
    }function jt(e,t,n,i,o){
      function a(e,t,n){
        var r=o.createElement('script'),a=null;return r.type='text/javascript',r.src=e,r.async=!0,a=function (e){
          hi(r,'load',a),hi(r,'error',a),o.body.removeChild(r),r=null;var s=-1,u='unknown';e&&('load'!==e.type||i[t].called||(e={type:'error'}),u=e.type,s='error'===e.type?404:200),n&&n(s,u);
        },fi(r,'load',a),fi(r,'error',a),o.body.appendChild(r),a;
      }return function (o,s,u,c,l,f,h,d,$,v){
        function y(){
          x&&x(),S&&S.abort();
        }function b(t,r,i,o,a){
          g(E)&&n.cancel(E),x=S=null,t(r,i,o,a),e.$$completeOutstandingRequest(p);
        }if(e.$$incOutstandingRequestCount(),s=s||e.url(),'jsonp'==Nr(o)){
          var w=`_${(i.counter++).toString(36)}`;i[w]=function (e){
            i[w].data=e,i[w].called=!0;
          };var x=a(s.replace('JSON_CALLBACK',`angular.callbacks.${w}`),w,function (e,t){
            b(c,e,i[w].data,'',t),i[w]=p;
          });
        }else{
          var S=t(o,s);S.open(o,s,!0),r(l,function (e,t){
            g(e)&&S.setRequestHeader(t,e);
          }),S.onload=function (){
            var e=S.statusText||'',t='response'in S?S.response:S.responseText,n=1223===S.status?204:S.status;0===n&&(n=t?200:'file'==Vn(s).protocol?404:0),b(c,n,t,S.getAllResponseHeaders(),e);
          };var C=function (){
            b(c,-1,null,null,'');
          };if(S.onerror=C,S.onabort=C,r($,function (e,t){
            S.addEventListener(t,e);
          }),r(v,function (e,t){
              S.upload.addEventListener(t,e);
            }),h&&(S.withCredentials=!0),d)try{
            S.responseType=d;
          }catch(e){
              if('json'!==d)throw e;
            }S.send(m(u)?null:u);
        }if(f>0)var E=n(y,f);else V(f)&&f.then(y);
      };
    }function It(){
      var e='{{',t='}}';this.startSymbol=function (t){
        return t?(e=t,this):e;
      },this.endSymbol=function (e){
        return e?(t=e,this):t;
      },this.$get=['$parse','$exceptionHandler','$sce',function (n,r,i){
        function o(e){
          return`\\\\\\${e}`;
        }function a(n){
          return n.replace(p,e).replace(d,t);
        }function s(e){
          if(null==e)return'';switch(typeof e){
          case'string':break;case'number':e=`${e}`;break;default:e=z(e);
          }return e;
        }function u(e,t,n,r){
          var i;return i=e.$watch(function (e){
            return i(),r(e);
          },t,n);
        }function l(o,l,p,d){
          function v(e){
            try{
              return e=N(e),d&&!g(e)?e:s(e);
            }catch(e){
              r(to.interr(o,e));
            }
          }if(!o.length||-1===o.indexOf(e)){
            var y;if(!l){
              y=$(a(o)),y.exp=o,y.expressions=[],y.$$watchDelegate=u;
            }return y;
          }d=!!d;for(var b,w,x,S=0,E=[],A=[],k=o.length,O=[],M=[];S<k;){
            if(-1==(b=o.indexOf(e,S))||-1==(w=o.indexOf(t,b+f))){
              S!==k&&O.push(a(o.substring(S)));break;
            }S!==b&&O.push(a(o.substring(S,b))),x=o.substring(b+f,w),E.push(x),A.push(n(x,v)),S=w+h,M.push(O.length),O.push('');
          }if(p&&O.length>1&&to.throwNoconcat(o),!l||E.length){
            var T=function (e){
                for(var t=0,n=E.length;t<n;t++){
                  if(d&&m(e[t]))return;O[M[t]]=e[t];
                }return O.join('');
              },N=function (e){
                return p?i.getTrusted(p,e):i.valueOf(e);
              };return c(function (e){
              var t=0,n=E.length,i=new Array(n);try{
                for(;t<n;t++)i[t]=A[t](e);return T(i);
              }catch(e){
                r(to.interr(o,e));
              }
            },{exp:o,expressions:E,$$watchDelegate:function (e,t){
              var n;return e.$watchGroup(A,function (r,i){
                var o=T(r);C(t)&&t.call(this,o,r!==i?n:o,e),n=o;
              });
            }});
          }
        }var f=e.length,h=t.length,p=new RegExp(e.replace(/./g,o),'g'),d=new RegExp(t.replace(/./g,o),'g');return l.startSymbol=function (){
          return e;
        },l.endSymbol=function (){
          return t;
        },l;
      }];
    }function Dt(){
      this.$get=['$rootScope','$window','$q','$$q','$browser',function (e,t,n,r,i){
        function o(o,s,u,c){
          function l(){
            f?o.apply(null,h):o($);
          }var f=arguments.length>4,h=f?L(arguments,4):[],p=t.setInterval,d=t.clearInterval,$=0,v=g(c)&&!c,m=(v?r:n).defer(),y=m.promise;return u=g(u)?u:0,y.$$intervalId=p(function (){
            v?i.defer(l):e.$evalAsync(l),m.notify($++),u>0&&$>=u&&(m.resolve($),d(y.$$intervalId),delete a[y.$$intervalId]),v||e.$apply();
          },s),a[y.$$intervalId]=m,y;
        }var a={};return o.cancel=function (e){
          return!!(e&&e.$$intervalId in a)&&(a[e.$$intervalId].reject('canceled'),t.clearInterval(e.$$intervalId),delete a[e.$$intervalId],!0);
        },o;
      }];
    }function Pt(e){
      for(var t=e.split('/'),n=t.length;n--;)t[n]=ee(t[n]);return t.join('/');
    }function _t(e,t){
      var n=Vn(e);t.$$protocol=n.protocol,t.$$host=n.hostname,t.$$port=f(n.port)||ro[n.protocol]||null;
    }function Rt(e,t){
      var n='/'!==e.charAt(0);n&&(e=`/${e}`);var r=Vn(e);t.$$path=decodeURIComponent(n&&'/'===r.pathname.charAt(0)?r.pathname.substring(1):r.pathname),t.$$search=X(r.search),t.$$hash=decodeURIComponent(r.hash),t.$$path&&'/'!=t.$$path.charAt(0)&&(t.$$path=`/${t.$$path}`);
    }function Ft(e,t){
      return 0===e.lastIndexOf(t,0);
    }function qt(e,t){
      if(Ft(t,e))return t.substr(e.length);
    }function Ut(e){
      var t=e.indexOf('#');return-1==t?e:e.substr(0,t);
    }function Lt(e){
      return e.replace(/(#.+)|#$/,'$1');
    }function Ht(e){
      return e.substr(0,Ut(e).lastIndexOf('/')+1);
    }function Bt(e){
      return e.substring(0,e.indexOf('/',e.indexOf('//')+2));
    }function zt(e,t,n){
      this.$$html5=!0,n=n||'',_t(e,this),this.$$parse=function (e){
        var n=qt(t,e);if(!w(n))throw io('ipthprfx','Invalid url "{0}", missing path prefix "{1}".',e,t);Rt(n,this),this.$$path||(this.$$path='/'),this.$$compose();
      },this.$$compose=function (){
        var e=Q(this.$$search),n=this.$$hash?`#${ee(this.$$hash)}`:'';this.$$url=Pt(this.$$path)+(e?`?${e}`:'')+n,this.$$absUrl=t+this.$$url.substr(1);
      },this.$$parseLinkUrl=function (r,i){
        if(i&&'#'===i[0])return this.hash(i.slice(1)),!0;var o,a,s;return g(o=qt(e,r))?(a=o,s=g(o=qt(n,o))?t+(qt('/',o)||o):e+a):g(o=qt(t,r))?s=t+o:t==`${r}/`&&(s=t),s&&this.$$parse(s),!!s;
      };
    }function Wt(e,t,n){
      _t(e,this),this.$$parse=function (r){
        var i,o=qt(e,r)||qt(t,r);m(o)||'#'!==o.charAt(0)?this.$$html5?i=o:(i='',m(o)&&(e=r,this.replace())):(i=qt(n,o),m(i)&&(i=o)),Rt(i,this),this.$$path=function (e,t,n){
          var r,i=/^\/[A-Z]:(\/.*)/;return Ft(t,n)&&(t=t.replace(n,'')),i.exec(t)?e:(r=i.exec(e),r?r[1]:e);
        }(this.$$path,i,e),this.$$compose();
      },this.$$compose=function (){
        var t=Q(this.$$search),r=this.$$hash?`#${ee(this.$$hash)}`:'';this.$$url=Pt(this.$$path)+(t?`?${t}`:'')+r,this.$$absUrl=e+(this.$$url?n+this.$$url:'');
      },this.$$parseLinkUrl=function (t,n){
        return Ut(e)==Ut(t)&&(this.$$parse(t),!0);
      };
    }function Gt(e,t,n){
      this.$$html5=!0,Wt.apply(this,arguments),this.$$parseLinkUrl=function (r,i){
        if(i&&'#'===i[0])return this.hash(i.slice(1)),!0;var o,a;return e==Ut(r)?o=r:(a=qt(t,r))?o=e+n+a:t===`${r}/`&&(o=t),o&&this.$$parse(o),!!o;
      },this.$$compose=function (){
        var t=Q(this.$$search),r=this.$$hash?`#${ee(this.$$hash)}`:'';this.$$url=Pt(this.$$path)+(t?`?${t}`:'')+r,this.$$absUrl=e+n+this.$$url;
      };
    }function Zt(e){
      return function (){
        return this[e];
      };
    }function Jt(e,t){
      return function (n){
        return m(n)?this[e]:(this[e]=t(n),this.$$compose(),this);
      };
    }function Yt(){
      var e='',t={enabled:!1,requireBase:!0,rewriteLinks:!0};this.hashPrefix=function (t){
        return g(t)?(e=t,this):e;
      },this.html5Mode=function (e){
        return N(e)?(t.enabled=e,this):y(e)?(N(e.enabled)&&(t.enabled=e.enabled),N(e.requireBase)&&(t.requireBase=e.requireBase),N(e.rewriteLinks)&&(t.rewriteLinks=e.rewriteLinks),this):t;
      },this.$get=['$rootScope','$browser','$sniffer','$rootElement','$window',function (n,r,i,o,a){
        function s(e,t,n){
          var i=c.url(),o=c.$$state;try{
            r.url(e,t,n),c.$$state=r.state();
          }catch(e){
            throw c.url(i),c.$$state=o,e;
          }
        }function u(e,t){
          n.$broadcast('$locationChangeSuccess',c.absUrl(),e,c.$$state,t);
        }var c,l,f,h=r.baseHref(),p=r.url();if(t.enabled){
          if(!h&&t.requireBase)throw io('nobase','$location in HTML5 mode requires a <base> tag to be present!');f=Bt(p)+(h||'/'),l=i.history?zt:Gt;
        }else f=Ut(p),l=Wt;var d=Ht(f);c=new l(f,d,`#${e}`),c.$$parseLinkUrl(p,p),c.$$state=r.state();var $=/^\s*(javascript|mailto):/i;o.on('click',function (e){
          if(t.rewriteLinks&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&2!=e.which&&2!=e.button){
            for(var i=Pr(e.target);'a'!==_(i[0]);)if(i[0]===o[0]||!(i=i.parent())[0])return;var s=i.prop('href'),u=i.attr('href')||i.attr('xlink:href');y(s)&&'[object SVGAnimatedString]'===s.toString()&&(s=Vn(s.animVal).href),$.test(s)||!s||i.attr('target')||e.isDefaultPrevented()||c.$$parseLinkUrl(s,u)&&(e.preventDefault(),c.absUrl()!=r.url()&&(n.$apply(),a.angular['ff-684208-preventDefault']=!0));
          }
        }),Lt(c.absUrl())!=Lt(p)&&r.url(c.absUrl(),!0);var v=!0;return r.onUrlChange(function (e,t){
          if(m(qt(d,e)))return void(a.location.href=e);n.$evalAsync(function (){
            var r,i=c.absUrl(),o=c.$$state;e=Lt(e),c.$$parse(e),c.$$state=t,r=n.$broadcast('$locationChangeStart',e,i,t,o).defaultPrevented,c.absUrl()===e&&(r?(c.$$parse(i),c.$$state=o,s(i,!1,o)):(v=!1,u(i,o)));
          }),n.$$phase||n.$digest();
        }),n.$watch(function (){
          var e=Lt(r.url()),t=Lt(c.absUrl()),o=r.state(),a=c.$$replace,l=e!==t||c.$$html5&&i.history&&o!==c.$$state;(v||l)&&(v=!1,n.$evalAsync(function (){
            var t=c.absUrl(),r=n.$broadcast('$locationChangeStart',t,e,c.$$state,o).defaultPrevented;c.absUrl()===t&&(r?(c.$$parse(e),c.$$state=o):(l&&s(t,a,o===c.$$state?null:c.$$state),u(e,o)));
          })),c.$$replace=!1;
        }),c;
      }];
    }function Kt(){
      var e=!0,t=this;this.debugEnabled=function (t){
        return g(t)?(e=t,this):e;
      },this.$get=['$window',function (n){
        function i(e){
          return e instanceof Error&&(e.stack?e=e.message&&-1===e.stack.indexOf(e.message)?`Error: ${e.message}\n${e.stack}`:e.stack:e.sourceURL&&(e=`${e.message}\n${e.sourceURL}:${e.line}`)),e;
        }function o(e){
          var t=n.console||{},o=t[e]||t.log||p,a=!1;try{
            a=!!o.apply;
          }catch(e){}return a?function (){
            var e=[];return r(arguments,function (t){
              e.push(i(t));
            }),o.apply(t,e);
          }:function (e,t){
            o(e,null==t?'':t);
          };
        }return{log:o('log'),info:o('info'),warn:o('warn'),error:o('error'),debug:function (){
          var n=o('debug');return function (){
            e&&n.apply(t,arguments);
          };
        }()};
      }];
    }function Xt(e,t){
      if('__defineGetter__'===e||'__defineSetter__'===e||'__lookupGetter__'===e||'__lookupSetter__'===e||'__proto__'===e)throw ao('isecfld','Attempting to access a disallowed field in Angular expressions! Expression: {0}',t);return e;
    }function Qt(e){
      return `${e}`;
    }function en(e,t){
      if(e){
        if(e.constructor===e)throw ao('isecfn','Referencing Function in Angular expressions is disallowed! Expression: {0}',t);if(e.window===e)throw ao('isecwindow','Referencing the Window in Angular expressions is disallowed! Expression: {0}',t);if(e.children&&(e.nodeName||e.prop&&e.attr&&e.find))throw ao('isecdom','Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}',t);if(e===Object)throw ao('isecobj','Referencing Object in Angular expressions is disallowed! Expression: {0}',t);
      }return e;
    }function tn(e,t){
      if(e){
        if(e.constructor===e)throw ao('isecfn','Referencing Function in Angular expressions is disallowed! Expression: {0}',t);if(e===so||e===uo||e===co)throw ao('isecff','Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}',t);
      }
    }function nn(e,t){
      if(e&&(e===(0).constructor||e===(!1).constructor||e===''.constructor||e==={}.constructor||e===[].constructor||e===Function.constructor))throw ao('isecaf','Assigning to a constructor is disallowed! Expression: {0}',t);
    }function rn(e,t){
      return void 0!==e?e:t;
    }function on(e,t){
      return void 0===e?t:void 0===t?e:e+t;
    }function an(e,t){
      return!e(t).$stateful;
    }function sn(e,t){
      var n,i;switch(e.type){
      case po.Program:n=!0,r(e.body,function (e){
        sn(e.expression,t),n=n&&e.expression.constant;
      }),e.constant=n;break;case po.Literal:e.constant=!0,e.toWatch=[];break;case po.UnaryExpression:sn(e.argument,t),e.constant=e.argument.constant,e.toWatch=e.argument.toWatch;break;case po.BinaryExpression:sn(e.left,t),sn(e.right,t),e.constant=e.left.constant&&e.right.constant,e.toWatch=e.left.toWatch.concat(e.right.toWatch);break;case po.LogicalExpression:sn(e.left,t),sn(e.right,t),e.constant=e.left.constant&&e.right.constant,e.toWatch=e.constant?[]:[e];break;case po.ConditionalExpression:sn(e.test,t),sn(e.alternate,t),sn(e.consequent,t),e.constant=e.test.constant&&e.alternate.constant&&e.consequent.constant,e.toWatch=e.constant?[]:[e];break;case po.Identifier:e.constant=!1,e.toWatch=[e];break;case po.MemberExpression:sn(e.object,t),e.computed&&sn(e.property,t),e.constant=e.object.constant&&(!e.computed||e.property.constant),e.toWatch=[e];break;case po.CallExpression:n=!!e.filter&&an(t,e.callee.name),i=[],r(e.arguments,function (e){
        sn(e,t),n=n&&e.constant,e.constant||i.push.apply(i,e.toWatch);
      }),e.constant=n,e.toWatch=e.filter&&an(t,e.callee.name)?i:[e];break;case po.AssignmentExpression:sn(e.left,t),sn(e.right,t),e.constant=e.left.constant&&e.right.constant,e.toWatch=[e];break;case po.ArrayExpression:n=!0,i=[],r(e.elements,function (e){
        sn(e,t),n=n&&e.constant,e.constant||i.push.apply(i,e.toWatch);
      }),e.constant=n,e.toWatch=i;break;case po.ObjectExpression:n=!0,i=[],r(e.properties,function (e){
        sn(e.value,t),n=n&&e.value.constant&&!e.computed,e.value.constant||i.push.apply(i,e.value.toWatch);
      }),e.constant=n,e.toWatch=i;break;case po.ThisExpression:case po.LocalsExpression:e.constant=!1,e.toWatch=[];
      }
    }function un(e){
      if(1==e.length){
        var t=e[0].expression,n=t.toWatch;return 1!==n.length?n:n[0]!==t?n:void 0;
      }
    }function cn(e){
      return e.type===po.Identifier||e.type===po.MemberExpression;
    }function ln(e){
      if(1===e.body.length&&cn(e.body[0].expression))return{type:po.AssignmentExpression,left:e.body[0].expression,right:{type:po.NGValueParameter},operator:'='};
    }function fn(e){
      return 0===e.body.length||1===e.body.length&&(e.body[0].expression.type===po.Literal||e.body[0].expression.type===po.ArrayExpression||e.body[0].expression.type===po.ObjectExpression);
    }function hn(e){
      return e.constant;
    }function pn(e,t){
      this.astBuilder=e,this.$filter=t;
    }function dn(e,t){
      this.astBuilder=e,this.$filter=t;
    }function $n(e){
      return'constructor'==e;
    }function vn(e){
      return C(e.valueOf)?e.valueOf():vo.call(e);
    }function mn(){
      var e,t,n=pe(),i=pe(),o={true:!0,false:!1,null:null,undefined:void 0};this.addLiteral=function (e,t){
        o[e]=t;
      },this.setIdentifierFns=function (n,r){
        return e=n,t=r,this;
      },this.$get=['$filter',function (a){
        function s(e,t,r){
          var o,s,c;switch(r=r||b,typeof e){
          case'string':e=e.trim(),c=e;var v=r?i:n;if(!(o=v[c])){
            ':'===e.charAt(0)&&':'===e.charAt(1)&&(s=!0,e=e.substring(2));var g=r?y:m,w=new ho(g);o=new $o(w,a,g).parse(e),o.constant?o.$$watchDelegate=d:s?o.$$watchDelegate=o.literal?h:f:o.inputs&&(o.$$watchDelegate=l),r&&(o=u(o)),v[c]=o;
          }return $(o,t);case'function':return $(e,t);default:return $(p,t);
          }
        }function u(e){
          function t(t,n,r,i){
            var o=b;b=!0;try{
              return e(t,n,r,i);
            }finally{
              b=o;
            }
          }if(!e)return e;t.$$watchDelegate=e.$$watchDelegate,t.assign=u(e.assign),t.constant=e.constant,t.literal=e.literal
          ;for(var n=0;e.inputs&&n<e.inputs.length;++n)e.inputs[n]=u(e.inputs[n]);return t.inputs=e.inputs,t;
        }function c(e,t){
          return null==e||null==t?e===t:('object'!=typeof e||'object'!=typeof(e=vn(e)))&&(e===t||e!==e&&t!==t);
        }function l(e,t,n,r,i){
          var o,a=r.inputs;if(1===a.length){
            var s=c;return a=a[0],e.$watch(function (e){
              var t=a(e);return c(t,s)||(o=r(e,void 0,void 0,[t]),s=t&&vn(t)),o;
            },t,n,i);
          }for(var u=[],l=[],f=0,h=a.length;f<h;f++)u[f]=c,l[f]=null;return e.$watch(function (e){
            for(var t=!1,n=0,i=a.length;n<i;n++){
              var s=a[n](e);(t||(t=!c(s,u[n])))&&(l[n]=s,u[n]=s&&vn(s));
            }return t&&(o=r(e,void 0,void 0,l)),o;
          },t,n,i);
        }function f(e,t,n,r){
          var i,o;return i=e.$watch(function (e){
            return r(e);
          },function (e,n,r){
            o=e,C(t)&&t.apply(this,arguments),g(e)&&r.$$postDigest(function (){
              g(o)&&i();
            });
          },n);
        }function h(e,t,n,i){
          function o(e){
            var t=!0;return r(e,function (e){
              g(e)||(t=!1);
            }),t;
          }var a,s;return a=e.$watch(function (e){
            return i(e);
          },function (e,n,r){
            s=e,C(t)&&t.call(this,e,n,r),o(e)&&r.$$postDigest(function (){
              o(s)&&a();
            });
          },n);
        }function d(e,t,n,r){
          var i;return i=e.$watch(function (e){
            return i(),r(e);
          },t,n);
        }function $(e,t){
          if(!t)return e;var n=e.$$watchDelegate,r=!1,i=n!==h&&n!==f,o=i?function (n,i,o,a){
            var s=r&&a?a[0]:e(n,i,o,a);return t(s,n,i);
          }:function (n,r,i,o){
            var a=e(n,r,i,o),s=t(a,n,r);return g(a)?s:a;
          };return e.$$watchDelegate&&e.$$watchDelegate!==l?o.$$watchDelegate=e.$$watchDelegate:t.$stateful||(o.$$watchDelegate=l,r=!e.inputs,o.inputs=e.inputs?e.inputs:[e]),o;
        }var v=Kr().noUnsafeEval,m={csp:v,expensiveChecks:!1,literals:F(o),isIdentifierStart:C(e)&&e,isIdentifierContinue:C(t)&&t},y={csp:v,expensiveChecks:!0,literals:F(o),isIdentifierStart:C(e)&&e,isIdentifierContinue:C(t)&&t},b=!1;return s.$$runningExpensiveChecks=function (){
          return b;
        },s;
      }];
    }function gn(){
      this.$get=['$rootScope','$exceptionHandler',function (e,t){
        return bn(function (t){
          e.$evalAsync(t);
        },t);
      }];
    }function yn(){
      this.$get=['$browser','$exceptionHandler',function (e,t){
        return bn(function (t){
          e.defer(t);
        },t);
      }];
    }function bn(e,n){
      function i(){
        this.$$state={status:0};
      }function o(e,t){
        return function (n){
          t.call(e,n);
        };
      }function a(e){
        var t,r,i;i=e.pending,e.processScheduled=!1,e.pending=void 0;for(var o=0,a=i.length;o<a;++o){
          r=i[o][0],t=i[o][e.status];try{
            C(t)?r.resolve(t(e.value)):1===e.status?r.resolve(e.value):r.reject(e.value);
          }catch(e){
            r.reject(e),n(e);
          }
        }
      }function s(t){
        !t.processScheduled&&t.pending&&(t.processScheduled=!0,e(function (){
          a(t);
        }));
      }function u(){
        this.promise=new i;
      }function l(e){
        var t=new u,n=0,i=Gr(e)?[]:{};return r(e,function (e,r){
          n++,v(e).then(function (e){
            i.hasOwnProperty(r)||(i[r]=e,--n||t.resolve(i));
          },function (e){
            i.hasOwnProperty(r)||t.reject(e);
          });
        }),0===n&&t.resolve(i),t.promise;
      }var f=t('$q',TypeError),h=function (){
        var e=new u;return e.resolve=o(e,e.resolve),e.reject=o(e,e.reject),e.notify=o(e,e.notify),e;
      };c(i.prototype,{then:function (e,t,n){
        if(m(e)&&m(t)&&m(n))return this;var r=new u;return this.$$state.pending=this.$$state.pending||[],this.$$state.pending.push([r,e,t,n]),this.$$state.status>0&&s(this.$$state),r.promise;
      },catch:function (e){
        return this.then(null,e);
      },finally:function (e,t){
        return this.then(function (t){
          return $(t,!0,e);
        },function (t){
          return $(t,!1,e);
        },t);
      }}),c(u.prototype,{resolve:function (e){
        this.promise.$$state.status||(e===this.promise?this.$$reject(f('qcycle','Expected promise to be resolved with value other than itself \'{0}\'',e)):this.$$resolve(e));
      },$$resolve:function (e){
        function t(e){
          u||(u=!0,a.$$resolve(e));
        }function r(e){
          u||(u=!0,a.$$reject(e));
        }var i,a=this,u=!1;try{
          (y(e)||C(e))&&(i=e&&e.then),C(i)?(this.promise.$$state.status=-1,i.call(e,t,r,o(this,this.notify))):(this.promise.$$state.value=e,this.promise.$$state.status=1,s(this.promise.$$state));
        }catch(e){
          r(e),n(e);
        }
      },reject:function (e){
        this.promise.$$state.status||this.$$reject(e);
      },$$reject:function (e){
        this.promise.$$state.value=e,this.promise.$$state.status=2,s(this.promise.$$state);
      },notify:function (t){
        var r=this.promise.$$state.pending;this.promise.$$state.status<=0&&r&&r.length&&e(function (){
          for(var e,i,o=0,a=r.length;o<a;o++){
            i=r[o][0],e=r[o][3];try{
              i.notify(C(e)?e(t):t);
            }catch(e){
              n(e);
            }
          }
        });
      }});var p=function (e){
          var t=new u;return t.reject(e),t.promise;
        },d=function (e,t){
          var n=new u;return t?n.resolve(e):n.reject(e),n.promise;
        },$=function (e,t,n){
          var r=null;try{
            C(n)&&(r=n());
          }catch(e){
            return d(e,!1);
          }return V(r)?r.then(function (){
            return d(e,t);
          },function (e){
            return d(e,!1);
          }):d(e,t);
        },v=function (e,t,n,r){
          var i=new u;return i.resolve(e),i.promise.then(t,n,r);
        },g=v,b=function (e){
          function t(e){
            r.resolve(e);
          }function n(e){
            r.reject(e);
          }if(!C(e))throw f('norslvr','Expected resolverFn, got \'{0}\'',e);var r=new u;return e(t,n),r.promise;
        };return b.prototype=i.prototype,b.defer=h,b.reject=p,b.when=v,b.resolve=g,b.all=l,b;
    }function wn(){
      this.$get=['$window','$timeout',function (e,t){
        var n=e.requestAnimationFrame||e.webkitRequestAnimationFrame,r=e.cancelAnimationFrame||e.webkitCancelAnimationFrame||e.webkitCancelRequestAnimationFrame,i=!!n,o=i?function (e){
          var t=n(e);return function (){
            r(t);
          };
        }:function (e){
          var n=t(e,16.66,!1);return function (){
            t.cancel(n);
          };
        };return o.supported=i,o;
      }];
    }function xn(){
      function e(e){
        function t(){
          this.$$watchers=this.$$nextSibling=this.$$childHead=this.$$childTail=null,this.$$listeners={},this.$$listenerCount={},this.$$watchersCount=0,this.$id=a(),this.$$ChildScope=null;
        }return t.prototype=e,t;
      }var i=10,o=t('$rootScope'),s=null,u=null;this.digestTtl=function (e){
        return arguments.length&&(i=e),i;
      },this.$get=['$exceptionHandler','$parse','$browser',function (t,c,l){
        function f(e){
          e.currentScope.$$destroyed=!0;
        }function h(e){
          9===Dr&&(e.$$childHead&&h(e.$$childHead),e.$$nextSibling&&h(e.$$nextSibling)),e.$parent=e.$$nextSibling=e.$$prevSibling=e.$$childHead=e.$$childTail=e.$root=e.$$watchers=null;
        }function d(){
          this.$id=a(),this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null,this.$root=this,this.$$destroyed=!1,this.$$listeners={},this.$$listenerCount={},this.$$watchersCount=0,this.$$isolateBindings=null;
        }function $(e){
          if(E.$$phase)throw o('inprog','{0} already in progress',E.$$phase);E.$$phase=e;
        }function v(){
          E.$$phase=null;
        }function g(e,t){
          do{
            e.$$watchersCount+=t;
          }while(e=e.$parent);
        }function b(e,t,n){
          do{
            e.$$listenerCount[n]-=t,0===e.$$listenerCount[n]&&delete e.$$listenerCount[n];
          }while(e=e.$parent);
        }function w(){}function x(){
          for(;O.length;)try{
            O.shift()();
          }catch(e){
              t(e);
            }u=null;
        }function S(){
          null===u&&(u=l.defer(function (){
            E.$apply(x);
          }));
        }d.prototype={constructor:d,$new:function (t,n){
          var r;return n=n||this,t?(r=new d,r.$root=this.$root):(this.$$ChildScope||(this.$$ChildScope=e(this)),r=new this.$$ChildScope),r.$parent=n,r.$$prevSibling=n.$$childTail,n.$$childHead?(n.$$childTail.$$nextSibling=r,n.$$childTail=r):n.$$childHead=n.$$childTail=r,(t||n!=this)&&r.$on('$destroy',f),r;
        },$watch:function (e,t,n,r){
          var i=c(e);if(i.$$watchDelegate)return i.$$watchDelegate(this,t,n,i,e);var o=this,a=o.$$watchers,u={fn:t,last:w,get:i,exp:r||e,eq:!!n};return s=null,C(t)||(u.fn=p),a||(a=o.$$watchers=[]),a.unshift(u),g(this,1),function (){
            R(a,u)>=0&&g(o,-1),s=null;
          };
        },$watchGroup:function (e,t){
          function n(){
            u=!1,c?(c=!1,t(o,o,s)):t(o,i,s);
          }var i=new Array(e.length),o=new Array(e.length),a=[],s=this,u=!1,c=!0;if(!e.length){
            var l=!0;return s.$evalAsync(function (){
              l&&t(o,o,s);
            }),function (){
              l=!1;
            };
          }return 1===e.length?this.$watch(e[0],function (e,n,r){
            o[0]=e,i[0]=n,t(o,e===n?o:i,r);
          }):(r(e,function (e,t){
            var r=s.$watch(e,function (e,r){
              o[t]=e,i[t]=r,u||(u=!0,s.$evalAsync(n));
            });a.push(r);
          }),function (){
              for(;a.length;)a.shift()();
            });
        },$watchCollection:function (e,t){
          function r(e){
            o=e;var t,r,i,s;if(!m(o)){
              if(y(o))if(n(o)){
                a!==p&&(a=p,v=a.length=0,f++),t=o.length,v!==t&&(f++,a.length=v=t);for(var u=0;u<t;u++)s=a[u],i=o[u],s!==s&&i!==i||s===i||(f++,a[u]=i);
              }else{
                a!==d&&(a=d={},v=0,f++),t=0;for(r in o)Tr.call(o,r)&&(t++,i=o[r],s=a[r],r in a?s!==s&&i!==i||s===i||(f++,a[r]=i):(v++,a[r]=i,f++));if(v>t){
                  f++;for(r in a)Tr.call(o,r)||(v--,delete a[r]);
                }
              }else a!==o&&(a=o,f++);return f;
            }
          }function i(){
            if($?($=!1,t(o,o,u)):t(o,s,u),l)if(y(o))if(n(o)){
              s=new Array(o.length);for(var e=0;e<o.length;e++)s[e]=o[e];
            }else{
              s={};for(var r in o)Tr.call(o,r)&&(s[r]=o[r]);
            }else s=o;
          }r.$stateful=!0;var o,a,s,u=this,l=t.length>1,f=0,h=c(e,r),p=[],d={},$=!0,v=0;return this.$watch(h,i);
        },$digest:function (){
          var e,n,r,a,c,f,h,p,d,m,g,y,b=i,S=this,O=[];$('$digest'),l.$$checkUrlChange(),this===E&&null!==u&&(l.defer.cancel(u),x()),s=null;do{
            p=!1,m=S;for(var T=0;T<A.length;T++){
              try{
                y=A[T],y.scope.$eval(y.expression,y.locals);
              }catch(e){
                t(e);
              }s=null;
            }A.length=0;e:do{
              if(f=m.$$watchers)for(h=f.length;h--;)try{
                if(e=f[h])if(c=e.get,(n=c(m))===(r=e.last)||(e.eq?q(n,r):'number'==typeof n&&'number'==typeof r&&isNaN(n)&&isNaN(r))){
                  if(e===s){
                    p=!1;break e;
                  }
                }else p=!0,s=e,e.last=e.eq?F(n,null):n,a=e.fn,a(n,r===w?n:r,m),b<5&&(g=4-b,O[g]||(O[g]=[]),O[g].push({msg:C(e.exp)?`fn: ${e.exp.name||e.exp.toString()}`:e.exp,newVal:n,oldVal:r}));
              }catch(e){
                  t(e);
                }if(!(d=m.$$watchersCount&&m.$$childHead||m!==S&&m.$$nextSibling))for(;m!==S&&!(d=m.$$nextSibling);)m=m.$parent;
            }while(m=d);if((p||A.length)&&!b--)throw v(),o('infdig','{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}',i,O);
          }while(p||A.length);for(v();M<k.length;)try{
            k[M++]();
          }catch(e){
              t(e);
            }k.length=M=0;
        },$destroy:function (){
          if(!this.$$destroyed){
            var e=this.$parent;this.$broadcast('$destroy'),this.$$destroyed=!0,this===E&&l.$$applicationDestroyed(),g(this,-this.$$watchersCount);for(var t in this.$$listenerCount)b(this,this.$$listenerCount[t],t);e&&e.$$childHead==this&&(e.$$childHead=this.$$nextSibling),e&&e.$$childTail==this&&(e.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$destroy=this.$digest=this.$apply=this.$evalAsync=this.$applyAsync=p,this.$on=this.$watch=this.$watchGroup=function (){
              return p;
            },this.$$listeners={},this.$$nextSibling=null,h(this);
          }
        },$eval:function (e,t){
          return c(e)(this,t);
        },$evalAsync:function (e,t){
          E.$$phase||A.length||l.defer(function (){
            A.length&&E.$digest();
          }),A.push({scope:this,expression:c(e),locals:t});
        },$$postDigest:function (e){
          k.push(e);
        },$apply:function (e){
          try{
            $('$apply');try{
              return this.$eval(e);
            }finally{
              v();
            }
          }catch(e){
            t(e);
          }finally{
            try{
              E.$digest();
            }catch(e){
              throw t(e),e;
            }
          }
        },$applyAsync:function (e){
          function t(){
            n.$eval(e);
          }var n=this;e&&O.push(t),e=c(e),S();
        },$on:function (e,t){
          var n=this.$$listeners[e];n||(this.$$listeners[e]=n=[]),n.push(t);var r=this;do{
            r.$$listenerCount[e]||(r.$$listenerCount[e]=0),r.$$listenerCount[e]++;
          }while(r=r.$parent);var i=this;return function (){
            var r=n.indexOf(t);-1!==r&&(n[r]=null,b(i,1,e));
          };
        },$emit:function (e,n){
          var r,i,o,a=[],s=this,u=!1,c={name:e,targetScope:s,stopPropagation:function (){
              u=!0;
            },preventDefault:function (){
              c.defaultPrevented=!0;
            },defaultPrevented:!1},l=U([c],arguments,1);do{
            for(r=s.$$listeners[e]||a,c.currentScope=s,i=0,o=r.length;i<o;i++)if(r[i])try{
              r[i].apply(null,l);
            }catch(e){
                t(e);
              }else r.splice(i,1),i--,o--;if(u)return c.currentScope=null,c;s=s.$parent;
          }while(s);return c.currentScope=null,c;
        },$broadcast:function (e,n){
          var r=this,i=r,o=r,a={name:e,targetScope:r,preventDefault:function (){
            a.defaultPrevented=!0;
          },defaultPrevented:!1};if(!r.$$listenerCount[e])return a;for(var s,u,c,l=U([a],arguments,1);i=o;){
            for(a.currentScope=i,s=i.$$listeners[e]||[],u=0,c=s.length;u<c;u++)if(s[u])try{
              s[u].apply(null,l);
            }catch(e){
                t(e);
              }else s.splice(u,1),u--,c--;if(!(o=i.$$listenerCount[e]&&i.$$childHead||i!==r&&i.$$nextSibling))for(;i!==r&&!(o=i.$$nextSibling);)i=i.$parent;
          }return a.currentScope=null,a;
        }};var E=new d,A=E.$$asyncQueue=[],k=E.$$postDigestQueue=[],O=E.$$applyAsyncQueue=[],M=0;return E;
      }];
    }function Sn(){
      var e=/^\s*(https?|ftp|mailto|tel|file):/,t=/^\s*((https?|ftp|file|blob):|data:image\/)/;this.aHrefSanitizationWhitelist=function (t){
        return g(t)?(e=t,this):e;
      },this.imgSrcSanitizationWhitelist=function (e){
        return g(e)?(t=e,this):t;
      },this.$get=function (){
        return function (n,r){
          var i,o=r?t:e;return i=Vn(n).href,''===i||i.match(o)?n:`unsafe:${i}`;
        };
      };
    }function Cn(e){
      if('self'===e)return e;if(w(e)){
        if(e.indexOf('***')>-1)throw mo('iwcard','Illegal sequence *** in string matcher.  String: {0}',e);return e=Yr(e).replace('\\*\\*','.*').replace('\\*','[^:/.?&;]*'),new RegExp(`^${e}$`);
      }if(E(e))return new RegExp(`^${e.source}$`);throw mo('imatcher','Matchers may only be "self", string patterns or RegExp objects');
    }function En(e){
      var t=[];return g(e)&&r(e,function (e){
        t.push(Cn(e));
      }),t;
    }function An(){
      this.SCE_CONTEXTS=go;var e=['self'],t=[];this.resourceUrlWhitelist=function (t){
        return arguments.length&&(e=En(t)),e;
      },this.resourceUrlBlacklist=function (e){
        return arguments.length&&(t=En(e)),t;
      },this.$get=['$injector',function (n){
        function r(e,t){
          return'self'===e?jn(t):!!e.exec(t.href);
        }function i(n){
          var i,o,a=Vn(n.toString()),s=!1;for(i=0,o=e.length;i<o;i++)if(r(e[i],a)){
            s=!0;break;
          }if(s)for(i=0,o=t.length;i<o;i++)if(r(t[i],a)){
            s=!1;break;
          }return s;
        }function o(e){
          var t=function (e){
            this.$$unwrapTrustedValue=function (){
              return e;
            };
          };return e&&(t.prototype=new e),t.prototype.valueOf=function (){
            return this.$$unwrapTrustedValue();
          },t.prototype.toString=function (){
            return this.$$unwrapTrustedValue().toString();
          },t;
        }function a(e,t){
          var n=f.hasOwnProperty(e)?f[e]:null;if(!n)throw mo('icontext','Attempted to trust a value in invalid context. Context: {0}; Value: {1}',e,t);if(null===t||m(t)||''===t)return t;if('string'!=typeof t)throw mo('itype','Attempted to trust a non-string value in a content requiring a string: Context: {0}',e);return new n(t);
        }function s(e){
          return e instanceof l?e.$$unwrapTrustedValue():e;
        }function u(e,t){
          if(null===t||m(t)||''===t)return t;var n=f.hasOwnProperty(e)?f[e]:null;if(n&&t instanceof n)return t.$$unwrapTrustedValue();if(e===go.RESOURCE_URL){
            if(i(t))return t;throw mo('insecurl','Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}',t.toString());
          }if(e===go.HTML)return c(t);throw mo('unsafe','Attempting to use an unsafe value in a safe context.');
        }var c=function (e){
          throw mo('unsafe','Attempting to use an unsafe value in a safe context.');
        };n.has('$sanitize')&&(c=n.get('$sanitize'));var l=o(),f={};return f[go.HTML]=o(l),f[go.CSS]=o(l),f[go.URL]=o(l),f[go.JS]=o(l),f[go.RESOURCE_URL]=o(f[go.URL]),{trustAs:a,getTrusted:u,valueOf:s};
      }];
    }function kn(){
      var e=!0;this.enabled=function (t){
        return arguments.length&&(e=!!t),e;
      },this.$get=['$parse','$sceDelegate',function (t,n){
        if(e&&Dr<8)throw mo('iequirks','Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.');var i=$e(go);i.isEnabled=function (){
          return e;
        },i.trustAs=n.trustAs,i.getTrusted=n.getTrusted,i.valueOf=n.valueOf,e||(i.trustAs=i.getTrusted=function (e,t){
          return t;
        },i.valueOf=d),i.parseAs=function (e,n){
          var r=t(n);return r.literal&&r.constant?r:t(n,function (t){
            return i.getTrusted(e,t);
          });
        };var o=i.parseAs,a=i.getTrusted,s=i.trustAs;return r(go,function (e,t){
          var n=Nr(t);i[ye(`parse_as_${n}`)]=function (t){
            return o(e,t);
          },i[ye(`get_trusted_${n}`)]=function (t){
            return a(e,t);
          },i[ye(`trust_as_${n}`)]=function (t){
            return s(e,t);
          };
        }),i;
      }];
    }function On(){
      this.$get=['$window','$document',function (e,t){
        var n,r,i={},o=e.chrome&&e.chrome.app&&e.chrome.app.runtime,a=!o&&e.history&&e.history.pushState,s=f((/android (\d+)/.exec(Nr((e.navigator||{}).userAgent))||[])[1]),u=/Boxee/i.test((e.navigator||{}).userAgent),c=t[0]||{},l=/^(Moz|webkit|ms)(?=[A-Z])/,h=c.body&&c.body.style,p=!1,d=!1;if(h){
          for(var $ in h)if(r=l.exec($)){
            n=r[0],n=n[0].toUpperCase()+n.substr(1);break;
          }n||(n='WebkitOpacity'in h&&'webkit'),p=!!('transition'in h||`${n}Transition`in h),d=!!('animation'in h||`${n}Animation`in h),!s||p&&d||(p=w(h.webkitTransition),d=w(h.webkitAnimation));
        }return{history:!(!a||s<4||u),hasEvent:function (e){
          if('input'===e&&Dr<=11)return!1;if(m(i[e])){
            var t=c.createElement('div');i[e]=`on${e}` in t;
          }return i[e];
        },csp:Kr(),vendorPrefix:n,transitions:p,animations:d,android:s};
      }];
    }function Mn(){
      var e;this.httpOptions=function (t){
        return t?(e=t,this):e;
      },this.$get=['$templateCache','$http','$q','$sce',function (t,n,r,i){
        function o(a,s){
          function u(e){
            if(!s)throw yo('tpload','Failed to load template: {0} (HTTP status: {1} {2})',a,e.status,e.statusText);return r.reject(e);
          }o.totalPendingRequests++,w(a)&&!m(t.get(a))||(a=i.getTrustedResourceUrl(a));var l=n.defaults&&n.defaults.transformResponse;return Gr(l)?l=l.filter(function (e){
            return e!==Ct;
          }):l===Ct&&(l=null),n.get(a,c({cache:t,transformResponse:l},e)).finally(function (){
            o.totalPendingRequests--;
          }).then(function (e){
            return t.put(a,e.data),e.data;
          },u);
        }return o.totalPendingRequests=0,o;
      }];
    }function Tn(){
      this.$get=['$rootScope','$browser','$location',function (e,t,n){
        var i={};return i.findBindings=function (e,t,n){
          var i=e.getElementsByClassName('ng-binding'),o=[];return r(i,function (e){
            var i=zr.element(e).data('$binding');i&&r(i,function (r){
              if(n){
                new RegExp(`(^|\\s)${Yr(t)}(\\s|\\||$)`).test(r)&&o.push(e);
              }else-1!=r.indexOf(t)&&o.push(e);
            });
          }),o;
        },i.findModels=function (e,t,n){
          for(var r=['ng-','data-ng-','ng\\:'],i=0;i<r.length;++i){
            var o=n?'=':'*=',a=`[${r[i]}model${o}"${t}"]`,s=e.querySelectorAll(a);if(s.length)return s;
          }
        },i.getLocation=function (){
          return n.url();
        },i.setLocation=function (t){
          t!==n.url()&&(n.url(t),e.$digest());
        },i.whenStable=function (e){
          t.notifyWhenNoOutstandingRequests(e);
        },i;
      }];
    }function Nn(){
      this.$get=['$rootScope','$browser','$q','$$q','$exceptionHandler',function (e,t,n,r,i){
        function o(o,s,u){
          C(o)||(u=s,s=o,o=p);var c,l=L(arguments,3),f=g(u)&&!u,h=(f?r:n).defer(),d=h.promise;return c=t.defer(function (){
            try{
              h.resolve(o.apply(null,l));
            }catch(e){
              h.reject(e),i(e);
            }finally{
              delete a[d.$$timeoutId];
            }f||e.$apply();
          },s),d.$$timeoutId=c,a[c]=h,d;
        }var a={};return o.cancel=function (e){
          return!!(e&&e.$$timeoutId in a)&&(a[e.$$timeoutId].reject('canceled'),delete a[e.$$timeoutId],t.defer.cancel(e.$$timeoutId));
        },o;
      }];
    }function Vn(e){
      var t=e;return Dr&&(bo.setAttribute('href',t),t=bo.href),bo.setAttribute('href',t),{href:bo.href,protocol:bo.protocol?bo.protocol.replace(/:$/,''):'',host:bo.host,search:bo.search?bo.search.replace(/^\?/,''):'',hash:bo.hash?bo.hash.replace(/^#/,''):'',hostname:bo.hostname,port:bo.port,pathname:'/'===bo.pathname.charAt(0)?bo.pathname:`/${bo.pathname}`};
    }function jn(e){
      var t=w(e)?Vn(e):e;return t.protocol===wo.protocol&&t.host===wo.host;
    }function In(){
      this.$get=$(e);
    }function Dn(e){
      function t(e){
        try{
          return decodeURIComponent(e);
        }catch(t){
          return e;
        }
      }var n=e[0]||{},r={},i='';return function (){
        var e,o,a,s,u,c=n.cookie||'';if(c!==i)for(i=c,e=i.split('; '),r={},a=0;a<e.length;a++)o=e[a],(s=o.indexOf('='))>0&&(u=t(o.substring(0,s)),m(r[u])&&(r[u]=t(o.substring(s+1))));return r;
      };
    }function Pn(){
      this.$get=Dn;
    }function _n(e){
      function t(i,o){
        if(y(i)){
          var a={};return r(i,function (e,n){
            a[n]=t(n,e);
          }),a;
        }return e.factory(i+n,o);
      }var n='Filter';this.register=t,this.$get=['$injector',function (e){
        return function (t){
          return e.get(t+n);
        };
      }],t('currency',Ln),t('date',rr),t('filter',Rn),t('json',ir),t('limitTo',or),t('lowercase',Oo),t('number',Hn),t('orderBy',sr),t('uppercase',Mo);
    }function Rn(){
      return function (e,r,i){
        if(!n(e)){
          if(null==e)return e;throw t('filter')('notarray','Expected array but received: {0}',e);
        }var o,a,s=Un(r);switch(s){
        case'function':o=r;break;case'boolean':case'null':case'number':case'string':a=!0;case'object':o=Fn(r,i,a);break;default:return e;
        }return Array.prototype.filter.call(e,o);
      };
    }function Fn(e,t,n){
      var r=y(e)&&'$'in e;return!0===t?t=q:C(t)||(t=function (e,t){
        return!m(e)&&(null===e||null===t?e===t:!(y(t)||y(e)&&!v(e))&&(e=Nr(`${e}`),t=Nr(`${t}`),-1!==e.indexOf(t)));
      }),function (i){
        return r&&!y(i)?qn(i,e.$,t,!1):qn(i,e,t,n);
      };
    }function qn(e,t,n,r,i){
      var o=Un(e),a=Un(t);if('string'===a&&'!'===t.charAt(0))return!qn(e,t.substring(1),n,r);if(Gr(e))return e.some(function (e){
        return qn(e,t,n,r);
      });switch(o){
      case'object':var s;if(r){
        for(s in e)if('$'!==s.charAt(0)&&qn(e[s],t,n,!0))return!0;return!i&&qn(e,t,n,!1);
      }if('object'===a){
          for(s in t){
            var u=t[s];if(!C(u)&&!m(u)){
              var c='$'===s;if(!qn(c?e:e[s],u,n,c,c))return!1;
            }
          }return!0;
        }return n(e,t);case'function':return!1;default:return n(e,t);
      }
    }function Un(e){
      return null===e?'null':typeof e;
    }function Ln(e){
      var t=e.NUMBER_FORMATS;return function (e,n,r){
        return m(n)&&(n=t.CURRENCY_SYM),m(r)&&(r=t.PATTERNS[1].maxFrac),null==e?e:Wn(e,t.PATTERNS[1],t.GROUP_SEP,t.DECIMAL_SEP,r).replace(/\u00A4/g,n);
      };
    }function Hn(e){
      var t=e.NUMBER_FORMATS;return function (e,n){
        return null==e?e:Wn(e,t.PATTERNS[0],t.GROUP_SEP,t.DECIMAL_SEP,n);
      };
    }function Bn(e){
      var t,n,r,i,o,a=0;for((n=e.indexOf(So))>-1&&(e=e.replace(So,'')),(r=e.search(/e/i))>0?(n<0&&(n=r),n+=+e.slice(r+1),e=e.substring(0,r)):n<0&&(n=e.length),r=0;e.charAt(r)==Co;r++);if(r==(o=e.length))t=[0],n=1;else{
        for(o--;e.charAt(o)==Co;)o--;for(n-=r,t=[],i=0;r<=o;r++,i++)t[i]=+e.charAt(r);
      }return n>xo&&(t=t.splice(0,xo-1),a=n-1,n=1),{d:t,e:a,i:n};
    }function zn(e,t,n,r){
      var i=e.d,o=i.length-e.i;t=m(t)?Math.min(Math.max(n,o),r):+t;var a=t+e.i,s=i[a];if(a>0){
        i.splice(Math.max(e.i,a));for(var u=a;u<i.length;u++)i[u]=0;
      }else{
        o=Math.max(0,o),e.i=1,i.length=Math.max(1,a=t+1),i[0]=0;for(var c=1;c<a;c++)i[c]=0;
      }if(s>=5)if(a-1<0){
        for(var l=0;l>a;l--)i.unshift(0),e.i++;i.unshift(1),e.i++;
      }else i[a-1]++;for(;o<Math.max(0,t);o++)i.push(0);var f=i.reduceRight(function (e,t,n,r){
        return t+=e,r[n]=t%10,Math.floor(t/10);
      },0);f&&(i.unshift(f),e.i++);
    }function Wn(e,t,n,r,i){
      if(!w(e)&&!x(e)||isNaN(e))return'';var o,a=!isFinite(e),s=!1,u=`${Math.abs(e)}`,c='';if(a)c='∞';else{
        o=Bn(u),zn(o,i,t.minFrac,t.maxFrac);var l=o.d,f=o.i,h=o.e,p=[];for(s=l.reduce(function (e,t){
          return e&&!t;
        },!0);f<0;)l.unshift(0),f++;f>0?p=l.splice(f,l.length):(p=l,l=[0]);var d=[];for(l.length>=t.lgSize&&d.unshift(l.splice(-t.lgSize,l.length).join(''));l.length>t.gSize;)d.unshift(l.splice(-t.gSize,l.length).join(''));l.length&&d.unshift(l.join('')),c=d.join(n),p.length&&(c+=r+p.join('')),h&&(c+=`e+${h}`);
      }return e<0&&!s?t.negPre+c+t.negSuf:t.posPre+c+t.posSuf;
    }function Gn(e,t,n,r){
      var i='';for((e<0||r&&e<=0)&&(r?e=1-e:(e=-e,i='-')),e=`${e}`;e.length<t;)e=Co+e;return n&&(e=e.substr(e.length-t)),i+e;
    }function Zn(e,t,n,r,i){
      return n=n||0,function (o){
        var a=o[`get${e}`]();return(n>0||a>-n)&&(a+=n),0===a&&-12==n&&(a=12),Gn(a,t,r,i);
      };
    }function Jn(e,t,n){
      return function (r,i){
        var o=r[`get${e}`]();return i[Vr((n?'STANDALONE':'')+(t?'SHORT':'')+e)][o];
      };
    }function Yn(e,t,n){
      var r=-1*n,i=r>=0?'+':'';return i+=Gn(Math[r>0?'floor':'ceil'](r/60),2)+Gn(Math.abs(r%60),2);
    }function Kn(e){
      var t=new Date(e,0,1).getDay();return new Date(e,0,(t<=4?5:12)-t);
    }function Xn(e){
      return new Date(e.getFullYear(),e.getMonth(),e.getDate()+(4-e.getDay()));
    }function Qn(e){
      return function (t){
        var n=Kn(t.getFullYear()),r=Xn(t),i=+r-+n;return Gn(1+Math.round(i/6048e5),e);
      };
    }function er(e,t){
      return e.getHours()<12?t.AMPMS[0]:t.AMPMS[1];
    }function tr(e,t){
      return e.getFullYear()<=0?t.ERAS[0]:t.ERAS[1];
    }function nr(e,t){
      return e.getFullYear()<=0?t.ERANAMES[0]:t.ERANAMES[1];
    }function rr(e){
      function t(e){
        var t;if(t=e.match(n)){
          var r=new Date(0),i=0,o=0,a=t[8]?r.setUTCFullYear:r.setFullYear,s=t[8]?r.setUTCHours:r.setHours;t[9]&&(i=f(t[9]+t[10]),o=f(t[9]+t[11])),a.call(r,f(t[1]),f(t[2])-1,f(t[3]));var u=f(t[4]||0)-i,c=f(t[5]||0)-o,l=f(t[6]||0),h=Math.round(1e3*parseFloat(`0.${t[7]||0}`));return s.call(r,u,c,l,h),r;
        }return e;
      }var n=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function (n,i,o){
        var a,s,u='',c=[];if(i=i||'mediumDate',i=e.DATETIME_FORMATS[i]||i,w(n)&&(n=ko.test(n)?f(n):t(n)),x(n)&&(n=new Date(n)),!S(n)||!isFinite(n.getTime()))return n;for(;i;)s=Ao.exec(i),s?(c=U(c,s,1),i=c.pop()):(c.push(i),i=null);var l=n.getTimezoneOffset();return o&&(l=G(o,l),n=J(n,o,!0)),r(c,function (t){
          a=Eo[t],u+=a?a(n,e.DATETIME_FORMATS,l):'\'\''===t?'\'':t.replace(/(^'|'$)/g,'').replace(/''/g,'\'');
        }),u;
      };
    }function ir(){
      return function (e,t){
        return m(t)&&(t=2),z(e,t);
      };
    }function or(){
      return function (e,t,r){
        return t=Math.abs(Number(t))===1/0?Number(t):f(t),isNaN(t)?e:(x(e)&&(e=e.toString()),n(e)?(r=!r||isNaN(r)?0:f(r),r=r<0?Math.max(0,e.length+r):r,t>=0?ar(e,r,r+t):0===r?ar(e,t,e.length):ar(e,Math.max(0,r+t),r)):e);
      };
    }function ar(e,t,n){
      return w(e)?e.slice(t,n):Fr.call(e,t,n);
    }function sr(e){
      function r(t){
        return t.map(function (t){
          var n=1,r=d;if(C(t))r=t;else if(w(t)&&('+'!=t.charAt(0)&&'-'!=t.charAt(0)||(n='-'==t.charAt(0)?-1:1,t=t.substring(1)),''!==t&&(r=e(t),r.constant))){
            var i=r();r=function (e){
              return e[i];
            };
          }return{get:r,descending:n};
        });
      }function i(e){
        switch(typeof e){
        case'number':case'boolean':case'string':return!0;default:return!1;
        }
      }function o(e){
        return C(e.valueOf)&&(e=e.valueOf(),i(e))?e:(v(e)&&(e=e.toString(),i(e)),e);
      }function a(e,t){
        var n=typeof e;return null===e?(n='string',e='null'):'object'===n&&(e=o(e)),{value:e,type:n,index:t};
      }function s(e,t){
        var n=0,r=e.type,i=t.type;if(r===i){
          var o=e.value,a=t.value;'string'===r?(o=o.toLowerCase(),a=a.toLowerCase()):'object'===r&&(y(o)&&(o=e.index),y(a)&&(a=t.index)),o!==a&&(n=o<a?-1:1);
        }else n=r<i?-1:1;return n;
      }return function (e,i,o,u){
        function c(e,t){
          return{value:e,tieBreaker:{value:t,type:'number',index:t},predicateValues:f.map(function (n){
            return a(n.get(e),t);
          })};
        }function l(e,t){
          for(var n=0,r=f.length;n<r;n++){
            var i=p(e.predicateValues[n],t.predicateValues[n]);if(i)return i*f[n].descending*h;
          }return p(e.tieBreaker,t.tieBreaker)*h;
        }if(null==e)return e;if(!n(e))throw t('orderBy')('notarray','Expected array but received: {0}',e);Gr(i)||(i=[i]),0===i.length&&(i=['+']);var f=r(i),h=o?-1:1,p=C(u)?u:s,d=Array.prototype.map.call(e,c);return d.sort(l),e=d.map(function (e){
          return e.value;
        });
      };
    }function ur(e){
      return C(e)&&(e={link:e}),e.restrict=e.restrict||'AC',$(e);
    }function cr(e,t){
      e.$name=t;
    }function lr(e,t,n,i,o){
      var a=this,s=[];a.$error={},a.$$success={},a.$pending=void 0,a.$name=o(t.name||t.ngForm||'')(n),a.$dirty=!1,a.$pristine=!0,a.$valid=!0,a.$invalid=!1,a.$submitted=!1,a.$$parentForm=Vo,a.$rollbackViewValue=function (){
        r(s,function (e){
          e.$rollbackViewValue();
        });
      },a.$commitViewValue=function (){
        r(s,function (e){
          e.$commitViewValue();
        });
      },a.$addControl=function (e){
        le(e.$name,'input'),s.push(e),e.$name&&(a[e.$name]=e),e.$$parentForm=a;
      },a.$$renameControl=function (e,t){
        var n=e.$name;a[n]===e&&delete a[n],a[t]=e,e.$name=t;
      },a.$removeControl=function (e){
        e.$name&&a[e.$name]===e&&delete a[e.$name],r(a.$pending,function (t,n){
          a.$setValidity(n,null,e);
        }),r(a.$error,function (t,n){
          a.$setValidity(n,null,e);
        }),r(a.$$success,function (t,n){
          a.$setValidity(n,null,e);
        }),R(s,e),e.$$parentForm=Vo;
      },Er({ctrl:this,$element:e,set:function (e,t,n){
        var r=e[t];if(r){
          -1===r.indexOf(n)&&r.push(n);
        }else e[t]=[n];
      },unset:function (e,t,n){
        var r=e[t];r&&(R(r,n),0===r.length&&delete e[t]);
      },$animate:i}),a.$setDirty=function (){
        i.removeClass(e,va),i.addClass(e,ma),a.$dirty=!0,a.$pristine=!1,a.$$parentForm.$setDirty();
      },a.$setPristine=function (){
        i.setClass(e,va,`${ma} ${jo}`),a.$dirty=!1,a.$pristine=!0,a.$submitted=!1,r(s,function (e){
          e.$setPristine();
        });
      },a.$setUntouched=function (){
        r(s,function (e){
          e.$setUntouched();
        });
      },a.$setSubmitted=function (){
        i.addClass(e,jo),a.$submitted=!0,a.$$parentForm.$setSubmitted();
      };
    }function fr(e){
      e.$formatters.push(function (t){
        return e.$isEmpty(t)?t:t.toString();
      });
    }function hr(e,t,n,r,i,o){
      pr(e,t,n,r,i,o),fr(r);
    }function pr(e,t,n,r,i,o){
      var a=Nr(t[0].type);if(!i.android){
        var s=!1;t.on('compositionstart',function (){
          s=!0;
        }),t.on('compositionend',function (){
          s=!1,c();
        });
      }var u,c=function (e){
        if(u&&(o.defer.cancel(u),u=null),!s){
          var i=t.val(),c=e&&e.type;'password'===a||n.ngTrim&&'false'===n.ngTrim||(i=Jr(i)),(r.$viewValue!==i||''===i&&r.$$hasNativeValidators)&&r.$setViewValue(i,c);
        }
      };if(i.hasEvent('input'))t.on('input',c);else{
        var l=function (e,t,n){
          u||(u=o.defer(function (){
            u=null,t&&t.value===n||c(e);
          }));
        };t.on('keydown',function (e){
          var t=e.keyCode;91===t||15<t&&t<19||37<=t&&t<=40||l(e,this,this.value);
        }),i.hasEvent('paste')&&t.on('paste cut',l);
      }t.on('change',c),Go[a]&&r.$$hasNativeValidators&&a===n.type&&t.on(Wo,function (e){
        if(!u){
          var t=this[Mr],n=t.badInput,r=t.typeMismatch;u=o.defer(function (){
            u=null,t.badInput===n&&t.typeMismatch===r||c(e);
          });
        }
      }),r.$render=function (){
        var e=r.$isEmpty(r.$viewValue)?'':r.$viewValue;t.val()!==e&&t.val(e);
      };
    }function dr(e,t){
      if(S(e))return e;if(w(e)){
        Ho.lastIndex=0;var n=Ho.exec(e);if(n){
          var r=+n[1],i=+n[2],o=0,a=0,s=0,u=0,c=Kn(r),l=7*(i-1);return t&&(o=t.getHours(),a=t.getMinutes(),s=t.getSeconds(),u=t.getMilliseconds()),new Date(r,0,c.getDate()+l,o,a,s,u);
        }
      }return NaN;
    }function $r(e,t){
      return function (n,i){
        var o,a;if(S(n))return n;if(w(n)){
          if('"'==n.charAt(0)&&'"'==n.charAt(n.length-1)&&(n=n.substring(1,n.length-1)),_o.test(n))return new Date(n);if(e.lastIndex=0,o=e.exec(n))return o.shift(),a=i?{yyyy:i.getFullYear(),MM:i.getMonth()+1,dd:i.getDate(),HH:i.getHours(),mm:i.getMinutes(),ss:i.getSeconds(),sss:i.getMilliseconds()/1e3}:{yyyy:1970,MM:1,dd:1,HH:0,mm:0,ss:0,sss:0},r(o,function (e,n){
            n<t.length&&(a[t[n]]=+e);
          }),new Date(a.yyyy,a.MM-1,a.dd,a.HH,a.mm,a.ss||0,1e3*a.sss||0);
        }return NaN;
      };
    }function vr(e,t,n,r){
      return function (i,o,a,s,u,c,l){
        function f(e){
          return e&&!(e.getTime&&e.getTime()!==e.getTime());
        }function h(e){
          return g(e)&&!S(e)?n(e)||void 0:e;
        }mr(i,o,a,s),pr(i,o,a,s,u,c);var p,d=s&&s.$options&&s.$options.timezone;if(s.$$parserName=e,s.$parsers.push(function (e){
          if(s.$isEmpty(e))return null;if(t.test(e)){
            var r=n(e,p);return d&&(r=J(r,d)),r;
          }
        }),s.$formatters.push(function (e){
            if(e&&!S(e))throw ya('datefmt','Expected `{0}` to be a date',e);return f(e)?(p=e,p&&d&&(p=J(p,d,!0)),l('date')(e,r,d)):(p=null,'');
          }),g(a.min)||a.ngMin){
          var $;s.$validators.min=function (e){
            return!f(e)||m($)||n(e)>=$;
          },a.$observe('min',function (e){
            $=h(e),s.$validate();
          });
        }if(g(a.max)||a.ngMax){
          var v;s.$validators.max=function (e){
            return!f(e)||m(v)||n(e)<=v;
          },a.$observe('max',function (e){
            v=h(e),s.$validate();
          });
        }
      };
    }function mr(e,t,n,r){
      var i=t[0];(r.$$hasNativeValidators=y(i.validity))&&r.$parsers.push(function (e){
        var n=t.prop(Mr)||{};return n.badInput||n.typeMismatch?void 0:e;
      });
    }function gr(e,t,n,r,i,o){
      if(mr(e,t,n,r),pr(e,t,n,r,i,o),r.$$parserName='number',r.$parsers.push(function (e){
        return r.$isEmpty(e)?null:qo.test(e)?parseFloat(e):void 0;
      }),r.$formatters.push(function (e){
          if(!r.$isEmpty(e)){
            if(!x(e))throw ya('numfmt','Expected `{0}` to be a number',e);e=e.toString();
          }return e;
        }),g(n.min)||n.ngMin){
        var a;r.$validators.min=function (e){
          return r.$isEmpty(e)||m(a)||e>=a;
        },n.$observe('min',function (e){
          g(e)&&!x(e)&&(e=parseFloat(e,10)),a=x(e)&&!isNaN(e)?e:void 0,r.$validate();
        });
      }if(g(n.max)||n.ngMax){
        var s;r.$validators.max=function (e){
          return r.$isEmpty(e)||m(s)||e<=s;
        },n.$observe('max',function (e){
          g(e)&&!x(e)&&(e=parseFloat(e,10)),s=x(e)&&!isNaN(e)?e:void 0,r.$validate();
        });
      }
    }function yr(e,t,n,r,i,o){
      pr(e,t,n,r,i,o),fr(r),r.$$parserName='url',r.$validators.url=function (e,t){
        var n=e||t;return r.$isEmpty(n)||Ro.test(n);
      };
    }function br(e,t,n,r,i,o){
      pr(e,t,n,r,i,o),fr(r),r.$$parserName='email',r.$validators.email=function (e,t){
        var n=e||t;return r.$isEmpty(n)||Fo.test(n);
      };
    }function wr(e,t,n,r){
      m(n.name)&&t.attr('name',a());var i=function (e){
        t[0].checked&&r.$setViewValue(n.value,e&&e.type);
      };t.on('click',i),r.$render=function (){
        var e=n.value;t[0].checked=e==r.$viewValue;
      },n.$observe('value',r.$render);
    }function xr(e,t,n,r,i){
      var o;if(g(r)){
        if(o=e(r),!o.constant)throw ya('constexpr','Expected constant expression for `{0}`, but saw `{1}`.',n,r);return o(t);
      }return i;
    }function Sr(e,t,n,r,i,o,a,s){
      var u=xr(s,e,'ngTrueValue',n.ngTrueValue,!0),c=xr(s,e,'ngFalseValue',n.ngFalseValue,!1),l=function (e){
        r.$setViewValue(t[0].checked,e&&e.type);
      };t.on('click',l),r.$render=function (){
        t[0].checked=r.$viewValue;
      },r.$isEmpty=function (e){
        return!1===e;
      },r.$formatters.push(function (e){
        return q(e,u);
      }),r.$parsers.push(function (e){
        return e?u:c;
      });
    }function Cr(e,t){
      return e=`ngClass${e}`,['$animate',function (n){
        function i(e,t){
          var n=[];e:for(var r=0;r<e.length;r++){
            for(var i=e[r],o=0;o<t.length;o++)if(i==t[o])continue e;n.push(i);
          }return n;
        }function o(e){
          var t=[];return Gr(e)?(r(e,function (e){
            t=t.concat(o(e));
          }),t):w(e)?e.split(' '):y(e)?(r(e,function (e,n){
            e&&(t=t.concat(n.split(' ')));
          }),t):e;
        }return{restrict:'AC',link:function (a,s,u){
          function c(e){
            var t=f(e,1);u.$addClass(t);
          }function l(e){
            var t=f(e,-1)
;u.$removeClass(t);
          }function f(e,t){
            var n=s.data('$classCounts')||pe(),i=[];return r(e,function (e){
              (t>0||n[e])&&(n[e]=(n[e]||0)+t,n[e]===+(t>0)&&i.push(e));
            }),s.data('$classCounts',n),i.join(' ');
          }function h(e,t){
            var r=i(t,e),o=i(e,t);r=f(r,1),o=f(o,-1),r&&r.length&&n.addClass(s,r),o&&o.length&&n.removeClass(s,o);
          }function p(e){
            if(!0===t||(1&a.$index)===t){
              var n=o(e||[]);if(d){
                if(!q(e,d)){
                  var r=o(d);h(r,n);
                }
              }else c(n);
            }d=Gr(e)?e.map(function (e){
              return $e(e);
            }):$e(e);
          }var d;a.$watch(u[e],p,!0),u.$observe('class',function (t){
            p(a.$eval(u[e]));
          }),'ngClass'!==e&&a.$watch('$index',function (n,r){
            var i=1&n;if(i!==(1&r)){
              var s=o(a.$eval(u[e]));i===t?c(s):l(s);
            }
          });
        }};
      }];
    }function Er(e){
      function t(e,t,s){
        m(t)?n('$pending',e,s):r('$pending',e,s),N(t)?t?(l(a.$error,e,s),c(a.$$success,e,s)):(c(a.$error,e,s),l(a.$$success,e,s)):(l(a.$error,e,s),l(a.$$success,e,s)),a.$pending?(i(ga,!0),a.$valid=a.$invalid=void 0,o('',null)):(i(ga,!1),a.$valid=Ar(a.$error),a.$invalid=!a.$valid,o('',a.$valid));var u;u=a.$pending&&a.$pending[e]?void 0:!a.$error[e]&&(!!a.$$success[e]||null),o(e,u),a.$$parentForm.$setValidity(e,u,a);
      }function n(e,t,n){
        a[e]||(a[e]={}),c(a[e],t,n);
      }function r(e,t,n){
        a[e]&&l(a[e],t,n),Ar(a[e])&&(a[e]=void 0);
      }function i(e,t){
        t&&!u[e]?(f.addClass(s,e),u[e]=!0):!t&&u[e]&&(f.removeClass(s,e),u[e]=!1);
      }function o(e,t){
        e=e?`-${se(e,'-')}`:'',i(da+e,!0===t),i($a+e,!1===t);
      }var a=e.ctrl,s=e.$element,u={},c=e.set,l=e.unset,f=e.$animate;u[$a]=!(u[da]=s.hasClass(da)),a.$setValidity=t;
    }function Ar(e){
      if(e)for(var t in e)if(e.hasOwnProperty(t))return!1;return!0;
    }function kr(e){
      e[0].hasAttribute('selected')&&(e[0].selected=!0);
    }var Or=/^\/(.+)\/([a-z]*)$/,Mr='validity',Tr=Object.prototype.hasOwnProperty,Nr=function (e){
        return w(e)?e.toLowerCase():e;
      },Vr=function (e){
        return w(e)?e.toUpperCase():e;
      },jr=function (e){
        return w(e)?e.replace(/[A-Z]/g,function (e){
          return String.fromCharCode(32|e.charCodeAt(0));
        }):e;
      },Ir=function (e){
        return w(e)?e.replace(/[a-z]/g,function (e){
          return String.fromCharCode(-33&e.charCodeAt(0));
        }):e;
      };'i'!=='I'.toLowerCase()&&(Nr=jr,Vr=Ir);var Dr,Pr,_r,Rr,Fr=[].slice,qr=[].splice,Ur=[].push,Lr=Object.prototype.toString,Hr=Object.getPrototypeOf,Br=t('ng'),zr=e.angular||(e.angular={}),Wr=0;Dr=e.document.documentMode,p.$inject=[],d.$inject=[];var Gr=Array.isArray,Zr=/^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/,Jr=function (e){
        return w(e)?e.trim():e;
      },Yr=function (e){
        return e.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,'\\$1').replace(/\x08/g,'\\x08');
      },Kr=function (){
        if(!g(Kr.rules)){
          var t=e.document.querySelector('[ng-csp]')||e.document.querySelector('[data-ng-csp]');if(t){
            var n=t.getAttribute('ng-csp')||t.getAttribute('data-ng-csp');Kr.rules={noUnsafeEval:!n||-1!==n.indexOf('no-unsafe-eval'),noInlineStyle:!n||-1!==n.indexOf('no-inline-style')};
          }else Kr.rules={noUnsafeEval:function (){
            try{
              return new Function(''),!1;
            }catch(e){
              return!0;
            }
          }(),noInlineStyle:!1};
        }return Kr.rules;
      },Xr=function (){
        if(g(Xr.name_))return Xr.name_;var t,n,r,i,o=ei.length;for(n=0;n<o;++n)if(r=ei[n],t=e.document.querySelector(`[${r.replace(':','\\:')}jq]`)){
          i=t.getAttribute(`${r}jq`);break;
        }return Xr.name_=i;
      },Qr=/:/g,ei=['ng-','data-ng-','ng:','x-ng-'],ti=/[A-Z]/g,ni=!1,ri=1,ii=3,oi=8,ai=9,si=11,ui={full:'1.5.7',major:1,minor:5,dot:7,codeName:'hexagonal-circumvolution'};ke.expando='ng339';var ci=ke.cache={},li=1,fi=function (e,t,n){
        e.addEventListener(t,n,!1);
      },hi=function (e,t,n){
        e.removeEventListener(t,n,!1);
      };ke._data=function (e){
      return this.cache[e[this.expando]]||{};
    };var pi=/([\:\-\_]+(.))/g,di=/^moz([A-Z])/,$i={mouseleave:'mouseout',mouseenter:'mouseover'},vi=t('jqLite'),mi=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,gi=/<|&#?\w+;/,yi=/<([\w:-]+)/,bi=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,wi={option:[1,'<select multiple="multiple">','</select>'],thead:[1,'<table>','</table>'],col:[2,'<table><colgroup>','</colgroup></table>'],tr:[2,'<table><tbody>','</tbody></table>'],td:[3,'<table><tbody><tr>','</tr></tbody></table>'],_default:[0,'','']};wi.optgroup=wi.option,wi.tbody=wi.tfoot=wi.colgroup=wi.caption=wi.thead,wi.th=wi.td;var xi=e.Node.prototype.contains||function (e){
        return!!(16&this.compareDocumentPosition(e));
      },Si=ke.prototype={ready:function (t){
        function n(){
          r||(r=!0,t());
        }var r=!1;'complete'===e.document.readyState?e.setTimeout(n):(this.on('DOMContentLoaded',n),ke(e).on('load',n));
      },toString:function (){
        var e=[];return r(this,function (t){
          e.push(`${t}`);
        }),`[${e.join(', ')}]`;
      },eq:function (e){
        return Pr(e>=0?this[e]:this[this.length+e]);
      },length:0,push:Ur,sort:[].sort,splice:[].splice},Ci={};r('multiple,selected,checked,disabled,readOnly,required,open'.split(','),function (e){
      Ci[Nr(e)]=e;
    });var Ei={};r('input,select,option,textarea,button,form,details'.split(','),function (e){
      Ei[e]=!0;
    });var Ai={ngMinlength:'minlength',ngMaxlength:'maxlength',ngMin:'min',ngMax:'max',ngPattern:'pattern'};r({data:je,removeData:Ne,hasData:xe,cleanData:Se},function (e,t){
      ke[t]=e;
    }),r({data:je,inheritedData:Fe,scope:function (e){
      return Pr.data(e,'$scope')||Fe(e.parentNode||e,['$isolateScope','$scope']);
    },isolateScope:function (e){
      return Pr.data(e,'$isolateScope')||Pr.data(e,'$isolateScopeNoTemplate');
    },controller:Re,injector:function (e){
      return Fe(e,'$injector');
    },removeAttr:function (e,t){
      e.removeAttribute(t);
    },hasClass:Ie,css:function (e,t,n){
      if(t=ye(t),!g(n))return e.style[t];e.style[t]=n;
    },attr:function (e,t,n){
      var r=e.nodeType;if(r!==ii&&2!==r&&r!==oi){
        var i=Nr(t);if(Ci[i]){
          if(!g(n))return e[t]||(e.attributes.getNamedItem(t)||p).specified?i:void 0;n?(e[t]=!0,e.setAttribute(t,i)):(e[t]=!1,e.removeAttribute(i));
        }else if(g(n))e.setAttribute(t,n);else if(e.getAttribute){
          var o=e.getAttribute(t,2);return null===o?void 0:o;
        }
      }
    },prop:function (e,t,n){
      if(!g(n))return e[t];e[t]=n;
    },text:function (){
      function e(e,t){
        if(m(t)){
          var n=e.nodeType;return n===ri||n===ii?e.textContent:'';
        }e.textContent=t;
      }return e.$dv='',e;
    }(),val:function (e,t){
      if(m(t)){
        if(e.multiple&&'select'===_(e)){
          var n=[];return r(e.options,function (e){
            e.selected&&n.push(e.value||e.text);
          }),0===n.length?null:n;
        }return e.value;
      }e.value=t;
    },html:function (e,t){
      if(m(t))return e.innerHTML;Me(e,!0),e.innerHTML=t;
    },empty:qe},function (e,t){
      ke.prototype[t]=function (t,n){
        var r,i,o=this.length;if(e!==qe&&m(2==e.length&&e!==Ie&&e!==Re?t:n)){
          if(y(t)){
            for(r=0;r<o;r++)if(e===je)e(this[r],t);else for(i in t)e(this[r],i,t[i]);return this;
          }for(var a=e.$dv,s=m(a)?Math.min(o,1):o,u=0;u<s;u++){
            var c=e(this[u],t,n);a=a?a+c:c;
          }return a;
        }for(r=0;r<o;r++)e(this[r],t,n);return this;
      };
    }),r({removeData:Ne,on:function (e,t,n,r){
      if(g(r))throw vi('onargs','jqLite#on() does not support the `selector` or `eventData` parameters');if(we(e)){
        var i=Ve(e,!0),o=i.events,a=i.handle;a||(a=i.handle=ze(e,o));for(var s=t.indexOf(' ')>=0?t.split(' '):[t],u=s.length,c=function (t,r,i){
          var s=o[t];s||(s=o[t]=[],s.specialHandlerWrapper=r,'$destroy'===t||i||fi(e,t,a)),s.push(n);
        };u--;)t=s[u],$i[t]?(c($i[t],Ge),c(t,void 0,!0)):c(t);
      }
    },off:Te,one:function (e,t,n){
      e=Pr(e),e.on(t,function r(){
        e.off(t,n),e.off(t,r);
      }),e.on(t,n);
    },replaceWith:function (e,t){
      var n,i=e.parentNode;Me(e),r(new ke(t),function (t){
        n?i.insertBefore(t,n.nextSibling):i.replaceChild(t,e),n=t;
      });
    },children:function (e){
      var t=[];return r(e.childNodes,function (e){
        e.nodeType===ri&&t.push(e);
      }),t;
    },contents:function (e){
      return e.contentDocument||e.childNodes||[];
    },append:function (e,t){
      var n=e.nodeType;if(n===ri||n===si){
        t=new ke(t);for(var r=0,i=t.length;r<i;r++){
          var o=t[r];e.appendChild(o);
        }
      }
    },prepend:function (e,t){
      if(e.nodeType===ri){
        var n=e.firstChild;r(new ke(t),function (t){
          e.insertBefore(t,n);
        });
      }
    },wrap:function (e,t){
      Ae(e,Pr(t).eq(0).clone()[0]);
    },remove:Ue,detach:function (e){
      Ue(e,!0);
    },after:function (e,t){
      var n=e,r=e.parentNode;t=new ke(t);for(var i=0,o=t.length;i<o;i++){
        var a=t[i];r.insertBefore(a,n.nextSibling),n=a;
      }
    },addClass:Pe,removeClass:De,toggleClass:function (e,t,n){
      t&&r(t.split(' '),function (t){
        var r=n;m(r)&&(r=!Ie(e,t)),(r?Pe:De)(e,t);
      });
    },parent:function (e){
      var t=e.parentNode;return t&&t.nodeType!==si?t:null;
    },next:function (e){
      return e.nextElementSibling;
    },find:function (e,t){
      return e.getElementsByTagName?e.getElementsByTagName(t):[];
    },clone:Oe,triggerHandler:function (e,t,n){
      var i,o,a,s=t.type||t,u=Ve(e),l=u&&u.events,f=l&&l[s];f&&(i={preventDefault:function (){
        this.defaultPrevented=!0;
      },isDefaultPrevented:function (){
        return!0===this.defaultPrevented;
      },stopImmediatePropagation:function (){
        this.immediatePropagationStopped=!0;
      },isImmediatePropagationStopped:function (){
        return!0===this.immediatePropagationStopped;
      },stopPropagation:p,type:s,target:e},t.type&&(i=c(i,t)),o=$e(f),a=n?[i].concat(n):[i],r(o,function (t){
          i.isImmediatePropagationStopped()||t.apply(e,a);
        }));
    }},function (e,t){
      ke.prototype[t]=function (t,n,r){
        for(var i,o=0,a=this.length;o<a;o++)m(i)?(i=e(this[o],t,n,r),g(i)&&(i=Pr(i))):_e(i,e(this[o],t,n,r));return g(i)?i:this;
      },ke.prototype.bind=ke.prototype.on,ke.prototype.unbind=ke.prototype.off;
    }),Ye.prototype={put:function (e,t){
      this[Je(e,this.nextUid)]=t;
    },get:function (e){
      return this[Je(e,this.nextUid)];
    },remove:function (e){
      var t=this[e=Je(e,this.nextUid)];return delete this[e],t;
    }};var ki=[function (){
        this.$get=[function (){
          return Ye;
        }];
      }],Oi=/^([^\(]+?)=>/,Mi=/^[^\(]*\(\s*([^\)]*)\)/m,Ti=/,/,Ni=/^\s*(_?)(\S+?)\1\s*$/,Vi=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,ji=t('$injector');tt.$$annotate=et;var Ii=t('$animate'),Di=1,Pi=function (){
        this.$get=p;
      },_i=function (){
        var e=new Ye,t=[];this.$get=['$$AnimateRunner','$rootScope',function (n,i){
          function o(e,t,n){
            var i=!1;return t&&(t=w(t)?t.split(' '):Gr(t)?t:[],r(t,function (t){
              t&&(i=!0,e[t]=n);
            })),i;
          }function a(){
            r(t,function (t){
              var n=e.get(t);if(n){
                var i=ot(t.attr('class')),o='',a='';r(n,function (e,t){
                  e!==!!i[t]&&(e?o+=(o.length?' ':'')+t:a+=(a.length?' ':'')+t);
                }),r(t,function (e){
                  o&&Pe(e,o),a&&De(e,a);
                }),e.remove(t);
              }
            }),t.length=0;
          }function s(n,r,s){
            var u=e.get(n)||{},c=o(u,r,!0),l=o(u,s,!1);(c||l)&&(e.put(n,u),t.push(n),1===t.length&&i.$$postDigest(a));
          }return{enabled:p,on:p,off:p,pin:p,push:function (e,t,r,i){
            i&&i(),r=r||{},r.from&&e.css(r.from),r.to&&e.css(r.to),(r.addClass||r.removeClass)&&s(e,r.addClass,r.removeClass);var o=new n;return o.complete(),o;
          }};
        }];
      },Ri=['$provide',function (e){
        var t=this;this.$$registeredAnimations=Object.create(null),this.register=function (n,r){
          if(n&&'.'!==n.charAt(0))throw Ii('notcsel','Expecting class selector starting with \'.\' got \'{0}\'.',n);var i=`${n}-animation`;t.$$registeredAnimations[n.substr(1)]=i,e.factory(i,r);
        },this.classNameFilter=function (e){
          if(1===arguments.length&&(this.$$classNameFilter=e instanceof RegExp?e:null,this.$$classNameFilter)){
            if(new RegExp('(\\s+|\\/)ng-animate(\\s+|\\/)').test(this.$$classNameFilter.toString()))throw Ii('nongcls','$animateProvider.classNameFilter(regex) prohibits accepting a regex value which matches/contains the "{0}" CSS class.','ng-animate');
          }return this.$$classNameFilter;
        },this.$get=['$$animateQueue',function (e){
          function t(e,t,n){
            if(n){
              var r=it(n);!r||r.parentNode||r.previousElementSibling||(n=null);
            }n?n.after(e):t.prepend(e);
          }return{on:e.on,off:e.off,pin:e.pin,enabled:e.enabled,cancel:function (e){
            e.end&&e.end();
          },enter:function (n,r,i,o){
            return r=r&&Pr(r),i=i&&Pr(i),r=r||i.parent(),t(n,r,i),e.push(n,'enter',at(o));
          },move:function (n,r,i,o){
            return r=r&&Pr(r),i=i&&Pr(i),r=r||i.parent(),t(n,r,i),e.push(n,'move',at(o));
          },leave:function (t,n){
            return e.push(t,'leave',at(n),function (){
              t.remove();
            });
          },addClass:function (t,n,r){
            return r=at(r),r.addClass=rt(r.addclass,n),e.push(t,'addClass',r);
          },removeClass:function (t,n,r){
            return r=at(r),r.removeClass=rt(r.removeClass,n),e.push(t,'removeClass',r);
          },setClass:function (t,n,r,i){
            return i=at(i),i.addClass=rt(i.addClass,n),i.removeClass=rt(i.removeClass,r),e.push(t,'setClass',i);
          },animate:function (t,n,r,i,o){
            return o=at(o),o.from=o.from?c(o.from,n):n,o.to=o.to?c(o.to,r):r,i=i||'ng-inline-animate',o.tempClasses=rt(o.tempClasses,i),e.push(t,'animate',o);
          }};
        }];
      }],Fi=function (){
        this.$get=['$$rAF',function (e){
          function t(t){
            n.push(t),n.length>1||e(function (){
              for(var e=0;e<n.length;e++)n[e]();n=[];
            });
          }var n=[];return function (){
            var e=!1;return t(function (){
              e=!0;
            }),function (n){
              e?n():t(n);
            };
          };
        }];
      },qi=function (){
        this.$get=['$q','$sniffer','$$animateAsyncRun','$document','$timeout',function (e,t,n,i,o){
          function a(e){
            this.setHost(e);var t=n(),r=function (e){
              o(e,0,!1);
            };this._doneCallbacks=[],this._tick=function (e){
              var n=i[0];n&&n.hidden?r(e):t(e);
            },this._state=0;
          }return a.chain=function (e,t){
            function n(){
              if(r===e.length)return void t(!0);e[r](function (e){
                if(!1===e)return void t(!1);r++,n();
              });
            }var r=0;n();
          },a.all=function (e,t){
            function n(n){
              o=o&&n,++i===e.length&&t(o);
            }var i=0,o=!0;r(e,function (e){
              e.done(n);
            });
          },a.prototype={setHost:function (e){
            this.host=e||{};
          },done:function (e){
            2===this._state?e():this._doneCallbacks.push(e);
          },progress:p,getPromise:function (){
            if(!this.promise){
              var t=this;this.promise=e(function (e,n){
                t.done(function (t){
                  !1===t?n():e();
                });
              });
            }return this.promise;
          },then:function (e,t){
            return this.getPromise().then(e,t);
          },catch:function (e){
            return this.getPromise().catch(e);
          },finally:function (e){
            return this.getPromise().finally(e);
          },pause:function (){
            this.host.pause&&this.host.pause();
          },resume:function (){
            this.host.resume&&this.host.resume();
          },end:function (){
            this.host.end&&this.host.end(),this._resolve(!0);
          },cancel:function (){
            this.host.cancel&&this.host.cancel(),this._resolve(!1);
          },complete:function (e){
            var t=this;0===t._state&&(t._state=1,t._tick(function (){
              t._resolve(e);
            }));
          },_resolve:function (e){
            2!==this._state&&(r(this._doneCallbacks,function (t){
              t(e);
            }),this._doneCallbacks.length=0,this._state=2);
          }},a;
        }];
      },Ui=function (){
        this.$get=['$$rAF','$q','$$AnimateRunner',function (e,t,n){
          return function (t,r){
            function i(){
              return e(function (){
                o(),s||u.complete(),s=!0;
              }),u;
            }function o(){
              a.addClass&&(t.addClass(a.addClass),a.addClass=null),a.removeClass&&(t.removeClass(a.removeClass),a.removeClass=null),a.to&&(t.css(a.to),a.to=null);
            }var a=r||{};a.$$prepared||(a=F(a)),a.cleanupStyles&&(a.from=a.to=null),a.from&&(t.css(a.from),a.from=null);var s,u=new n;return{start:i,end:i};
          };
        }];
      },Li=t('$compile'),Hi=new ft;ht.$inject=['$provide','$$sanitizeUriProvider'],pt.prototype.isFirstChange=function (){
      return this.previousValue===Hi;
    };var Bi=/^((?:x|data)[\:\-_])/i,zi=t('$controller'),Wi=/^(\S+)(\s+as\s+([\w$]+))?$/,Gi=function (){
        this.$get=['$document',function (e){
          return function (t){
            return t?!t.nodeType&&t instanceof Pr&&(t=t[0]):t=e[0].body,t.offsetWidth+1;
          };
        }];
      },Zi='application/json',Ji={'Content-Type':`${Zi};charset=utf-8`},Yi=/^\[|^\{(?!\{)/,Ki={'[':/]$/,'{':/}$/},Xi=/^\)\]\}',?\n/,Qi=t('$http'),eo=function (e){
        return function (){
          throw Qi('legacy','The method `{0}` on the promise returned from `$http` has been disabled.',e);
        };
      },to=zr.$interpolateMinErr=t('$interpolate');to.throwNoconcat=function (e){
      throw to('noconcat','Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce',e);
    },to.interr=function (e,t){
      return to('interr','Can\'t interpolate: {0}\n{1}',e,t.toString());
    };var no=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,ro={http:80,https:443,ftp:21},io=t('$location'),oo={$$absUrl:'',$$html5:!1,$$replace:!1,absUrl:Zt('$$absUrl'),url:function (e){
      if(m(e))return this.$$url;var t=no.exec(e);return(t[1]||''===e)&&this.path(decodeURIComponent(t[1])),(t[2]||t[1]||''===e)&&this.search(t[3]||''),this.hash(t[5]||''),this;
    },protocol:Zt('$$protocol'),host:Zt('$$host'),port:Zt('$$port'),path:Jt('$$path',function (e){
      return e=null!==e?e.toString():'','/'==e.charAt(0)?e:`/${e}`;
    }),search:function (e,t){
      switch(arguments.length){
      case 0:return this.$$search;case 1:if(w(e)||x(e))e=e.toString(),this.$$search=X(e);else{
        if(!y(e))throw io('isrcharg','The first argument of the `$location#search()` call must be a string or an object.');e=F(e,{}),r(e,function (t,n){
          null==t&&delete e[n];
        }),this.$$search=e;
      }break;default:m(t)||null===t?delete this.$$search[e]:this.$$search[e]=t;
      }return this.$$compose(),this;
    },hash:Jt('$$hash',function (e){
      return null!==e?e.toString():'';
    }),replace:function (){
      return this.$$replace=!0,this;
    }};r([Gt,Wt,zt],function (e){
      e.prototype=Object.create(oo),e.prototype.state=function (t){
        if(!arguments.length)return this.$$state;if(e!==zt||!this.$$html5)throw io('nostate','History API state support is available only in HTML5 mode and only in browsers supporting HTML5 History API');return this.$$state=m(t)?null:t,this;
      };
    });var ao=t('$parse'),so=Function.prototype.call,uo=Function.prototype.apply,co=Function.prototype.bind,lo=pe();r('+ - * / % === !== == != < > <= >= && || ! = |'.split(' '),function (e){
      lo[e]=!0;
    });var fo={n:'\n',f:'\f',r:'\r',t:'\t',v:'\v','\'':'\'','"':'"'},ho=function (e){
      this.options=e;
    };ho.prototype={constructor:ho,lex:function (e){
      for(this.text=e,this.index=0,this.tokens=[];this.index<this.text.length;){
        var t=this.text.charAt(this.index);if('"'===t||'\''===t)this.readString(t);else if(this.isNumber(t)||'.'===t&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdentifierStart(this.peekMultichar()))this.readIdent();else if(this.is(t,'(){}[].,;:?'))this.tokens.push({index:this.index,text:t}),this.index++;else if(this.isWhitespace(t))this.index++;else{
          var n=t+this.peek(),r=n+this.peek(2),i=lo[t],o=lo[n],a=lo[r];if(i||o||a){
            var s=a?r:o?n:t;this.tokens.push({index:this.index,text:s,operator:!0}),this.index+=s.length;
          }else this.throwError('Unexpected next character ',this.index,this.index+1);
        }
      }return this.tokens;
    },is:function (e,t){
      return-1!==t.indexOf(e);
    },peek:function (e){
      var t=e||1;return this.index+t<this.text.length&&this.text.charAt(this.index+t);
    },isNumber:function (e){
      return'0'<=e&&e<='9'&&'string'==typeof e;
    },isWhitespace:function (e){
      return' '===e||'\r'===e||'\t'===e||'\n'===e||'\v'===e||' '===e;
    },isIdentifierStart:function (e){
      return this.options.isIdentifierStart?this.options.isIdentifierStart(e,this.codePointAt(e)):this.isValidIdentifierStart(e);
    },isValidIdentifierStart:function (e){
      return'a'<=e&&e<='z'||'A'<=e&&e<='Z'||'_'===e||'$'===e;
    },isIdentifierContinue:function (e){
      return this.options.isIdentifierContinue?this.options.isIdentifierContinue(e,this.codePointAt(e)):this.isValidIdentifierContinue(e);
    },isValidIdentifierContinue:function (e,t){
      return this.isValidIdentifierStart(e,t)||this.isNumber(e);
    },codePointAt:function (e){
      return 1===e.length?e.charCodeAt(0):(e.charCodeAt(0)<<10)+e.charCodeAt(1)-56613888;
    },peekMultichar:function (){
      var e=this.text.charAt(this.index),t=this.peek();if(!t)return e;var n=e.charCodeAt(0),r=t.charCodeAt(0);return n>=55296&&n<=56319&&r>=56320&&r<=57343?e+t:e;
    },isExpOperator:function (e){
      return'-'===e||'+'===e||this.isNumber(e);
    },throwError:function (e,t,n){
      n=n||this.index;var r=g(t)?`s ${t}-${this.index} [${this.text.substring(t,n)}]`:` ${n}`;throw ao('lexerr','Lexer Error: {0} at column{1} in expression [{2}].',e,r,this.text);
    },readNumber:function (){
      for(var e='',t=this.index;this.index<this.text.length;){
        var n=Nr(this.text.charAt(this.index));if('.'==n||this.isNumber(n))e+=n;else{
          var r=this.peek();if('e'==n&&this.isExpOperator(r))e+=n;else if(this.isExpOperator(n)&&r&&this.isNumber(r)&&'e'==e.charAt(e.length-1))e+=n;else{
            if(!this.isExpOperator(n)||r&&this.isNumber(r)||'e'!=e.charAt(e.length-1))break;this.throwError('Invalid exponent');
          }
        }this.index++;
      }this.tokens.push({index:t,text:e,constant:!0,value:Number(e)});
    },readIdent:function (){
      var e=this.index;for(this.index+=this.peekMultichar().length;this.index<this.text.length;){
        var t=this.peekMultichar();if(!this.isIdentifierContinue(t))break;this.index+=t.length;
      }this.tokens.push({index:e,text:this.text.slice(e,this.index),identifier:!0});
    },readString:function (e){
      var t=this.index;this.index++;for(var n='',r=e,i=!1;this.index<this.text.length;){
        var o=this.text.charAt(this.index);if(r+=o,i){
          if('u'===o){
            var a=this.text.substring(this.index+1,this.index+5);a.match(/[\da-f]{4}/i)||this.throwError(`Invalid unicode escape [\\u${a}]`),this.index+=4,n+=String.fromCharCode(parseInt(a,16));
          }else{
            n+=fo[o]||o;
          }i=!1;
        }else if('\\'===o)i=!0;else{
          if(o===e)return this.index++,void this.tokens.push({index:t,text:r,constant:!0,value:n});n+=o;
        }this.index++;
      }this.throwError('Unterminated quote',t);
    }};var po=function (e,t){
      this.lexer=e,this.options=t;
    };po.Program='Program',po.ExpressionStatement='ExpressionStatement',po.AssignmentExpression='AssignmentExpression',po.ConditionalExpression='ConditionalExpression',po.LogicalExpression='LogicalExpression',po.BinaryExpression='BinaryExpression',po.UnaryExpression='UnaryExpression',po.CallExpression='CallExpression',po.MemberExpression='MemberExpression',po.Identifier='Identifier',po.Literal='Literal',po.ArrayExpression='ArrayExpression',po.Property='Property',po.ObjectExpression='ObjectExpression',po.ThisExpression='ThisExpression',po.LocalsExpression='LocalsExpression',po.NGValueParameter='NGValueParameter',po.prototype={ast:function (e){
      this.text=e,this.tokens=this.lexer.lex(e);var t=this.program();return 0!==this.tokens.length&&this.throwError('is an unexpected token',this.tokens[0]),t;
    },program:function (){
      for(var e=[];;)if(this.tokens.length>0&&!this.peek('}',')',';',']')&&e.push(this.expressionStatement()),!this.expect(';'))return{type:po.Program,body:e};
    },expressionStatement:function (){
      return{type:po.ExpressionStatement,expression:this.filterChain()};
    },filterChain:function (){
      for(var e=this.expression();this.expect('|');)e=this.filter(e);return e;
    },expression:function (){
      return this.assignment();
    },assignment:function (){
      var e=this.ternary();return this.expect('=')&&(e={type:po.AssignmentExpression,left:e,right:this.assignment(),operator:'='}),e;
    },ternary:function (){
      var e,t,n=this.logicalOR();return this.expect('?')&&(e=this.expression(),this.consume(':'))?(t=this.expression(),{type:po.ConditionalExpression,test:n,alternate:e,consequent:t}):n;
    },logicalOR:function (){
      for(var e=this.logicalAND();this.expect('||');)e={type:po.LogicalExpression,operator:'||',left:e,right:this.logicalAND()};return e;
    },logicalAND:function (){
      for(var e=this.equality();this.expect('&&');)e={type:po.LogicalExpression,operator:'&&',left:e,right:this.equality()};return e;
    },equality:function (){
      for(var e,t=this.relational();e=this.expect('==','!=','===','!==');)t={type:po.BinaryExpression,operator:e.text,left:t,right:this.relational()};return t;
    },relational:function (){
      for(var e,t=this.additive();e=this.expect('<','>','<=','>=');)t={type:po.BinaryExpression,operator:e.text,left:t,right:this.additive()};return t;
    },additive:function (){
      for(var e,t=this.multiplicative();e=this.expect('+','-');)t={type:po.BinaryExpression,operator:e.text,left:t,right:this.multiplicative()};return t;
    },multiplicative:function (){
      for(var e,t=this.unary();e=this.expect('*','/','%');)t={type:po.BinaryExpression,operator:e.text,left:t,right:this.unary()};return t;
    },unary:function (){
      var e;return(e=this.expect('+','-','!'))?{type:po.UnaryExpression,operator:e.text,prefix:!0,argument:this.unary()}:this.primary();
    },primary:function (){
      var e;this.expect('(')?(e=this.filterChain(),this.consume(')')):this.expect('[')?e=this.arrayDeclaration():this.expect('{')?e=this.object():this.selfReferential.hasOwnProperty(this.peek().text)?e=F(this.selfReferential[this.consume().text]):this.options.literals.hasOwnProperty(this.peek().text)?e={type:po.Literal,value:this.options.literals[this.consume().text]}:this.peek().identifier?e=this.identifier():this.peek().constant?e=this.constant():this.throwError('not a primary expression',this.peek());for(var t;t=this.expect('(','[','.');)'('===t.text?(e={type:po.CallExpression,callee:e,arguments:this.parseArguments()},this.consume(')')):'['===t.text?(e={type:po.MemberExpression,object:e,property:this.expression(),computed:!0},this.consume(']')):'.'===t.text?e={type:po.MemberExpression,object:e,property:this.identifier(),computed:!1}:this.throwError('IMPOSSIBLE');return e;
    },filter:function (e){
      for(var t=[e],n={type:po.CallExpression,callee:this.identifier(),arguments:t,filter:!0};this.expect(':');)t.push(this.expression());return n;
    },parseArguments:function (){
      var e=[];if(')'!==this.peekToken().text)do{
        e.push(this.filterChain());
      }while(this.expect(','));return e;
    },identifier:function (){
      var e=this.consume();return e.identifier||this.throwError('is not a valid identifier',e),{type:po.Identifier,name:e.text};
    },constant:function (){
      return{type:po.Literal,value:this.consume().value};
    },arrayDeclaration:function (){
      var e=[];if(']'!==this.peekToken().text)do{
        if(this.peek(']'))break;e.push(this.expression());
      }while(this.expect(','));return this.consume(']'),{type:po.ArrayExpression,elements:e};
    },object:function (){
      var e,t=[];if('}'!==this.peekToken().text)do{
        if(this.peek('}'))break;e={type:po.Property,kind:'init'},this.peek().constant?(e.key=this.constant(),e.computed=!1,this.consume(':'),e.value=this.expression()):this.peek().identifier?(e.key=this.identifier(),e.computed=!1,this.peek(':')?(this.consume(':'),e.value=this.expression()):e.value=e.key):this.peek('[')?(this.consume('['),e.key=this.expression(),this.consume(']'),e.computed=!0,this.consume(':'),e.value=this.expression()):this.throwError('invalid key',this.peek()),t.push(e);
      }while(this.expect(','));return this.consume('}'),{type:po.ObjectExpression,properties:t};
    },throwError:function (e,t){
      throw ao('syntax','Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].',t.text,e,t.index+1,this.text,this.text.substring(t.index));
    },consume:function (e){
      if(0===this.tokens.length)throw ao('ueoe','Unexpected end of expression: {0}',this.text);var t=this.expect(e);return t||this.throwError(`is unexpected, expecting [${e}]`,this.peek()),t;
    },peekToken:function (){
      if(0===this.tokens.length)throw ao('ueoe','Unexpected end of expression: {0}',this.text);return this.tokens[0];
    },peek:function (e,t,n,r){
      return this.peekAhead(0,e,t,n,r);
    },peekAhead:function (e,t,n,r,i){
      if(this.tokens.length>e){
        var o=this.tokens[e],a=o.text;if(a===t||a===n||a===r||a===i||!t&&!n&&!r&&!i)return o;
      }return!1;
    },expect:function (e,t,n,r){
      var i=this.peek(e,t,n,r);return!!i&&(this.tokens.shift(),i);
    },selfReferential:{this:{type:po.ThisExpression},$locals:{type:po.LocalsExpression}}},pn.prototype={compile:function (e,t){
      var n=this,i=this.astBuilder.ast(e);this.state={nextId:0,filters:{},expensiveChecks:t,fn:{vars:[],body:[],own:{}},assign:{vars:[],body:[],own:{}},inputs:[]},sn(i,n.$filter);var o,a='';if(this.stage='assign',o=ln(i)){
        this.state.computing='assign';var s=this.nextId();this.recurse(o,s),this.return_(s),a=`fn.assign=${this.generateFunction('assign','s,v,l')}`;
      }var u=un(i.body);n.stage='inputs',r(u,function (e,t){
        var r=`fn${t}`;n.state[r]={vars:[],body:[],own:{}},n.state.computing=r;var i=n.nextId();n.recurse(e,i),n.return_(i),n.state.inputs.push(r),e.watchId=t;
      }),this.state.computing='fn',this.stage='main',this.recurse(i);var c=`"${this.USE} ${this.STRICT}";\n${this.filterPrefix()}var fn=${this.generateFunction('fn','s,l,a,i')}${a}${this.watchFns()}return fn;`,l=new Function('$filter','ensureSafeMemberName','ensureSafeObject','ensureSafeFunction','getStringValue','ensureSafeAssignContext','ifDefined','plus','text',c)(this.$filter,Xt,en,tn,Qt,nn,rn,on,e);return this.state=this.stage=void 0,l.literal=fn(i),l.constant=hn(i),l;
    },USE:'use',STRICT:'strict',watchFns:function (){
      var e=[],t=this.state.inputs,n=this;return r(t,function (t){
        e.push(`var ${t}=${n.generateFunction(t,'s')}`);
      }),t.length&&e.push(`fn.inputs=[${t.join(',')}];`),e.join('');
    },generateFunction:function (e,t){
      return`function(${t}){${this.varsPrefix(e)}${this.body(e)}};`;
    },filterPrefix:function (){
      var e=[],t=this;return r(this.state.filters,function (n,r){
        e.push(`${n}=$filter(${t.escape(r)})`);
      }),e.length?`var ${e.join(',')};`:'';
    },varsPrefix:function (e){
      return this.state[e].vars.length?`var ${this.state[e].vars.join(',')};`:'';
    },body:function (e){
      return this.state[e].body.join('');
    },recurse:function (e,t,n,i,o,a){
      var s,u,c,l,f,h=this;if(i=i||p,!a&&g(e.watchId))return t=t||this.nextId(),void this.if_('i',this.lazyAssign(t,this.computedMember('i',e.watchId)),this.lazyRecurse(e,t,n,i,o,!0));switch(e.type){
      case po.Program:r(e.body,function (t,n){
        h.recurse(t.expression,void 0,void 0,function (e){
          u=e;
        }),n!==e.body.length-1?h.current().body.push(u,';'):h.return_(u);
      });break;case po.Literal:l=this.escape(e.value),this.assign(t,l),i(l);break;case po.UnaryExpression:this.recurse(e.argument,void 0,void 0,function (e){
        u=e;
      }),l=`${e.operator}(${this.ifDefined(u,0)})`,this.assign(t,l),i(l);break;case po.BinaryExpression:this.recurse(e.left,void 0,void 0,function (e){
        s=e;
      }),this.recurse(e.right,void 0,void 0,function (e){
          u=e;
        }),l='+'===e.operator?this.plus(s,u):'-'===e.operator?this.ifDefined(s,0)+e.operator+this.ifDefined(u,0):`(${s})${e.operator}(${u})`,this.assign(t,l),i(l);break;case po.LogicalExpression:t=t||this.nextId(),h.recurse(e.left,t),h.if_('&&'===e.operator?t:h.not(t),h.lazyRecurse(e.right,t)),i(t);break;case po.ConditionalExpression:t=t||this.nextId(),h.recurse(e.test,t),h.if_(t,h.lazyRecurse(e.alternate,t),h.lazyRecurse(e.consequent,t)),i(t);break;case po.Identifier:t=t||this.nextId(),n&&(n.context='inputs'===h.stage?'s':this.assign(this.nextId(),`${this.getHasOwnProperty('l',e.name)}?l:s`),n.computed=!1,n.name=e.name),Xt(e.name),h.if_('inputs'===h.stage||h.not(h.getHasOwnProperty('l',e.name)),function (){
        h.if_('inputs'===h.stage||'s',function (){
          o&&1!==o&&h.if_(h.not(h.nonComputedMember('s',e.name)),h.lazyAssign(h.nonComputedMember('s',e.name),'{}')),h.assign(t,h.nonComputedMember('s',e.name));
        });
      },t&&h.lazyAssign(t,h.nonComputedMember('l',e.name))),(h.state.expensiveChecks||$n(e.name))&&h.addEnsureSafeObject(t),i(t);break;case po.MemberExpression:s=n&&(n.context=this.nextId())||this.nextId(),t=t||this.nextId(),h.recurse(e.object,s,void 0,function (){
        h.if_(h.notNull(s),function (){
          o&&1!==o&&h.addEnsureSafeAssignContext(s),e.computed?(u=h.nextId(),h.recurse(e.property,u),h.getStringValue(u),h.addEnsureSafeMemberName(u),o&&1!==o&&h.if_(h.not(h.computedMember(s,u)),h.lazyAssign(h.computedMember(s,u),'{}')),l=h.ensureSafeObject(h.computedMember(s,u)),h.assign(t,l),n&&(n.computed=!0,n.name=u)):(Xt(e.property.name),o&&1!==o&&h.if_(h.not(h.nonComputedMember(s,e.property.name)),h.lazyAssign(h.nonComputedMember(s,e.property.name),'{}')),l=h.nonComputedMember(s,e.property.name),(h.state.expensiveChecks||$n(e.property.name))&&(l=h.ensureSafeObject(l)),h.assign(t,l),n&&(n.computed=!1,n.name=e.property.name));
        },function (){
          h.assign(t,'undefined');
        }),i(t);
      },!!o);break;case po.CallExpression:t=t||this.nextId(),e.filter?(u=h.filter(e.callee.name),c=[],r(e.arguments,function (e){
        var t=h.nextId();h.recurse(e,t),c.push(t);
      }),l=`${u}(${c.join(',')})`,h.assign(t,l),i(t)):(u=h.nextId(),s={},c=[],h.recurse(e.callee,u,s,function (){
        h.if_(h.notNull(u),function (){
          h.addEnsureSafeFunction(u),r(e.arguments,function (e){
            h.recurse(e,h.nextId(),void 0,function (e){
              c.push(h.ensureSafeObject(e));
            });
          }),s.name?(h.state.expensiveChecks||h.addEnsureSafeObject(s.context),l=`${h.member(s.context,s.name,s.computed)}(${c.join(',')})`):l=`${u}(${c.join(',')})`,l=h.ensureSafeObject(l),h.assign(t,l);
        },function (){
          h.assign(t,'undefined');
        }),i(t);
      }));break;case po.AssignmentExpression:if(u=this.nextId(),s={},!cn(e.left))throw ao('lval','Trying to assign a value to a non l-value');this.recurse(e.left,void 0,s,function (){
        h.if_(h.notNull(s.context),function (){
          h.recurse(e.right,u),h.addEnsureSafeObject(h.member(s.context,s.name,s.computed)),h.addEnsureSafeAssignContext(s.context),l=h.member(s.context,s.name,s.computed)+e.operator+u,h.assign(t,l),i(t||l);
        });
      },1);break;case po.ArrayExpression:c=[],r(e.elements,function (e){
        h.recurse(e,h.nextId(),void 0,function (e){
          c.push(e);
        });
      }),l=`[${c.join(',')}]`,this.assign(t,l),i(l);break;case po.ObjectExpression:c=[],f=!1,r(e.properties,function (e){
        e.computed&&(f=!0);
      }),f?(t=t||this.nextId(),this.assign(t,'{}'),r(e.properties,function (e){
          e.computed?(s=h.nextId(),h.recurse(e.key,s)):s=e.key.type===po.Identifier?e.key.name:`${e.key.value}`,u=h.nextId(),h.recurse(e.value,u),h.assign(h.member(t,s,e.computed),u);
        })):(r(e.properties,function (t){
          h.recurse(t.value,e.constant?void 0:h.nextId(),void 0,function (e){
            c.push(`${h.escape(t.key.type===po.Identifier?t.key.name:`${t.key.value}`)}:${e}`);
          });
        }),l=`{${c.join(',')}}`,this.assign(t,l)),i(t||l);break;case po.ThisExpression:this.assign(t,'s'),i('s');break
        ;case po.LocalsExpression:this.assign(t,'l'),i('l');break;case po.NGValueParameter:this.assign(t,'v'),i('v');
      }
    },getHasOwnProperty:function (e,t){
      var n=`${e}.${t}`,r=this.current().own;return r.hasOwnProperty(n)||(r[n]=this.nextId(!1,`${e}&&(${this.escape(t)} in ${e})`)),r[n];
    },assign:function (e,t){
      if(e)return this.current().body.push(e,'=',t,';'),e;
    },filter:function (e){
      return this.state.filters.hasOwnProperty(e)||(this.state.filters[e]=this.nextId(!0)),this.state.filters[e];
    },ifDefined:function (e,t){
      return`ifDefined(${e},${this.escape(t)})`;
    },plus:function (e,t){
      return`plus(${e},${t})`;
    },return_:function (e){
      this.current().body.push('return ',e,';');
    },if_:function (e,t,n){
      if(!0===e)t();else{
        var r=this.current().body;r.push('if(',e,'){'),t(),r.push('}'),n&&(r.push('else{'),n(),r.push('}'));
      }
    },not:function (e){
      return`!(${e})`;
    },notNull:function (e){
      return `${e}!=null`;
    },nonComputedMember:function (e,t){
      var n=/[$_a-zA-Z][$_a-zA-Z0-9]*/,r=/[^$_a-zA-Z0-9]/g;return n.test(t)?`${e}.${t}`:`${e}["${t.replace(r,this.stringEscapeFn)}"]`;
    },computedMember:function (e,t){
      return `${e}[${t}]`;
    },member:function (e,t,n){
      return n?this.computedMember(e,t):this.nonComputedMember(e,t);
    },addEnsureSafeObject:function (e){
      this.current().body.push(this.ensureSafeObject(e),';');
    },addEnsureSafeMemberName:function (e){
      this.current().body.push(this.ensureSafeMemberName(e),';');
    },addEnsureSafeFunction:function (e){
      this.current().body.push(this.ensureSafeFunction(e),';');
    },addEnsureSafeAssignContext:function (e){
      this.current().body.push(this.ensureSafeAssignContext(e),';');
    },ensureSafeObject:function (e){
      return`ensureSafeObject(${e},text)`;
    },ensureSafeMemberName:function (e){
      return`ensureSafeMemberName(${e},text)`;
    },ensureSafeFunction:function (e){
      return`ensureSafeFunction(${e},text)`;
    },getStringValue:function (e){
      this.assign(e,`getStringValue(${e})`);
    },ensureSafeAssignContext:function (e){
      return`ensureSafeAssignContext(${e},text)`;
    },lazyRecurse:function (e,t,n,r,i,o){
      var a=this;return function (){
        a.recurse(e,t,n,r,i,o);
      };
    },lazyAssign:function (e,t){
      var n=this;return function (){
        n.assign(e,t);
      };
    },stringEscapeRegex:/[^ a-zA-Z0-9]/g,stringEscapeFn:function (e){
      return`\\u${(`0000${e.charCodeAt(0).toString(16)}`).slice(-4)}`;
    },escape:function (e){
      if(w(e))return`'${e.replace(this.stringEscapeRegex,this.stringEscapeFn)}'`;if(x(e))return e.toString();if(!0===e)return'true';if(!1===e)return'false';if(null===e)return'null';if(void 0===e)return'undefined';throw ao('esc','IMPOSSIBLE');
    },nextId:function (e,t){
      var n=`v${this.state.nextId++}`;return e||this.current().vars.push(n+(t?`=${t}`:'')),n;
    },current:function (){
      return this.state[this.state.computing];
    }},dn.prototype={compile:function (e,t){
      var n=this,i=this.astBuilder.ast(e);this.expression=e,this.expensiveChecks=t,sn(i,n.$filter);var o,a;(o=ln(i))&&(a=this.recurse(o));var s,u=un(i.body);u&&(s=[],r(u,function (e,t){
        var r=n.recurse(e);e.input=r,s.push(r),e.watchId=t;
      }));var c=[];r(i.body,function (e){
        c.push(n.recurse(e.expression));
      });var l=0===i.body.length?p:1===i.body.length?c[0]:function (e,t){
        var n;return r(c,function (r){
          n=r(e,t);
        }),n;
      };return a&&(l.assign=function (e,t,n){
        return a(e,n,t);
      }),s&&(l.inputs=s),l.literal=fn(i),l.constant=hn(i),l;
    },recurse:function (e,t,n){
      var i,o,a,s=this;if(e.input)return this.inputs(e.input,e.watchId);switch(e.type){
      case po.Literal:return this.value(e.value,t);case po.UnaryExpression:return o=this.recurse(e.argument),this[`unary${e.operator}`](o,t);case po.BinaryExpression:case po.LogicalExpression:return i=this.recurse(e.left),o=this.recurse(e.right),this[`binary${e.operator}`](i,o,t);case po.ConditionalExpression:return this['ternary?:'](this.recurse(e.test),this.recurse(e.alternate),this.recurse(e.consequent),t);case po.Identifier:return Xt(e.name,s.expression),s.identifier(e.name,s.expensiveChecks||$n(e.name),t,n,s.expression);case po.MemberExpression:return i=this.recurse(e.object,!1,!!n),e.computed||(Xt(e.property.name,s.expression),o=e.property.name),e.computed&&(o=this.recurse(e.property)),e.computed?this.computedMember(i,o,t,n,s.expression):this.nonComputedMember(i,o,s.expensiveChecks,t,n,s.expression);case po.CallExpression:return a=[],r(e.arguments,function (e){
        a.push(s.recurse(e));
      }),e.filter&&(o=this.$filter(e.callee.name)),e.filter||(o=this.recurse(e.callee,!0)),e.filter?function (e,n,r,i){
          for(var s=[],u=0;u<a.length;++u)s.push(a[u](e,n,r,i));var c=o.apply(void 0,s,i);return t?{context:void 0,name:void 0,value:c}:c;
        }:function (e,n,r,i){
          var u,c=o(e,n,r,i);if(null!=c.value){
            en(c.context,s.expression),tn(c.value,s.expression);for(var l=[],f=0;f<a.length;++f)l.push(en(a[f](e,n,r,i),s.expression));u=en(c.value.apply(c.context,l),s.expression);
          }return t?{value:u}:u;
        };case po.AssignmentExpression:return i=this.recurse(e.left,!0,1),o=this.recurse(e.right),function (e,n,r,a){
        var u=i(e,n,r,a),c=o(e,n,r,a);return en(u.value,s.expression),nn(u.context),u.context[u.name]=c,t?{value:c}:c;
      };case po.ArrayExpression:return a=[],r(e.elements,function (e){
        a.push(s.recurse(e));
      }),function (e,n,r,i){
          for(var o=[],s=0;s<a.length;++s)o.push(a[s](e,n,r,i));return t?{value:o}:o;
        };case po.ObjectExpression:return a=[],r(e.properties,function (e){
        e.computed?a.push({key:s.recurse(e.key),computed:!0,value:s.recurse(e.value)}):a.push({key:e.key.type===po.Identifier?e.key.name:`${e.key.value}`,computed:!1,value:s.recurse(e.value)});
      }),function (e,n,r,i){
          for(var o={},s=0;s<a.length;++s)a[s].computed?o[a[s].key(e,n,r,i)]=a[s].value(e,n,r,i):o[a[s].key]=a[s].value(e,n,r,i);return t?{value:o}:o;
        };case po.ThisExpression:return function (e){
        return t?{value:e}:e;
      };case po.LocalsExpression:return function (e,n){
        return t?{value:n}:n;
      };case po.NGValueParameter:return function (e,n,r){
        return t?{value:r}:r;
      };
      }
    },'unary+':function (e,t){
      return function (n,r,i,o){
        var a=e(n,r,i,o);return a=g(a)?+a:0,t?{value:a}:a;
      };
    },'unary-':function (e,t){
      return function (n,r,i,o){
        var a=e(n,r,i,o);return a=g(a)?-a:0,t?{value:a}:a;
      };
    },'unary!':function (e,t){
      return function (n,r,i,o){
        var a=!e(n,r,i,o);return t?{value:a}:a;
      };
    },'binary+':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a),u=t(r,i,o,a),c=on(s,u);return n?{value:c}:c;
      };
    },'binary-':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a),u=t(r,i,o,a),c=(g(s)?s:0)-(g(u)?u:0);return n?{value:c}:c;
      };
    },'binary*':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)*t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary/':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)/t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary%':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)%t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary===':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)===t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary!==':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)!==t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary==':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)==t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary!=':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)!=t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary<':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)<t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary>':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)>t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary<=':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)<=t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary>=':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)>=t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary&&':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)&&t(r,i,o,a);return n?{value:s}:s;
      };
    },'binary||':function (e,t,n){
      return function (r,i,o,a){
        var s=e(r,i,o,a)||t(r,i,o,a);return n?{value:s}:s;
      };
    },'ternary?:':function (e,t,n,r){
      return function (i,o,a,s){
        var u=e(i,o,a,s)?t(i,o,a,s):n(i,o,a,s);return r?{value:u}:u;
      };
    },value:function (e,t){
      return function (){
        return t?{context:void 0,name:void 0,value:e}:e;
      };
    },identifier:function (e,t,n,r,i){
      return function (o,a,s,u){
        var c=a&&e in a?a:o;r&&1!==r&&c&&!c[e]&&(c[e]={});var l=c?c[e]:void 0;return t&&en(l,i),n?{context:c,name:e,value:l}:l;
      };
    },computedMember:function (e,t,n,r,i){
      return function (o,a,s,u){
        var c,l,f=e(o,a,s,u);return null!=f&&(c=t(o,a,s,u),c=Qt(c),Xt(c,i),r&&1!==r&&(nn(f),f&&!f[c]&&(f[c]={})),l=f[c],en(l,i)),n?{context:f,name:c,value:l}:l;
      };
    },nonComputedMember:function (e,t,n,r,i,o){
      return function (a,s,u,c){
        var l=e(a,s,u,c);i&&1!==i&&(nn(l),l&&!l[t]&&(l[t]={}));var f=null!=l?l[t]:void 0;return(n||$n(t))&&en(f,o),r?{context:l,name:t,value:f}:f;
      };
    },inputs:function (e,t){
      return function (n,r,i,o){
        return o?o[t]:e(n,r,i);
      };
    }};var $o=function (e,t,n){
      this.lexer=e,this.$filter=t,this.options=n,this.ast=new po(e,n),this.astCompiler=n.csp?new dn(this.ast,t):new pn(this.ast,t);
    };$o.prototype={constructor:$o,parse:function (e){
      return this.astCompiler.compile(e,this.options.expensiveChecks);
    }};var vo=Object.prototype.valueOf,mo=t('$sce'),go={HTML:'html',CSS:'css',URL:'url',RESOURCE_URL:'resourceUrl',JS:'js'},yo=t('$compile'),bo=e.document.createElement('a'),wo=Vn(e.location.href);Dn.$inject=['$document'],_n.$inject=['$provide'];var xo=22,So='.',Co='0';Ln.$inject=['$locale'],Hn.$inject=['$locale'];var Eo={yyyy:Zn('FullYear',4,0,!1,!0),yy:Zn('FullYear',2,0,!0,!0),y:Zn('FullYear',1,0,!1,!0),MMMM:Jn('Month'),MMM:Jn('Month',!0),MM:Zn('Month',2,1),M:Zn('Month',1,1),LLLL:Jn('Month',!1,!0),dd:Zn('Date',2),d:Zn('Date',1),HH:Zn('Hours',2),H:Zn('Hours',1),hh:Zn('Hours',2,-12),h:Zn('Hours',1,-12),mm:Zn('Minutes',2),m:Zn('Minutes',1),ss:Zn('Seconds',2),s:Zn('Seconds',1),sss:Zn('Milliseconds',3),EEEE:Jn('Day'),EEE:Jn('Day',!0),a:er,Z:Yn,ww:Qn(2),w:Qn(1),G:tr,GG:tr,GGG:tr,GGGG:nr},Ao=/((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,ko=/^\-?\d+$/;rr.$inject=['$locale'];var Oo=$(Nr),Mo=$(Vr);sr.$inject=['$parse'];var To=$({restrict:'E',compile:function (e,t){
        if(!t.href&&!t.xlinkHref)return function (e,t){
          if('a'===t[0].nodeName.toLowerCase()){
            var n='[object SVGAnimatedString]'===Lr.call(t.prop('href'))?'xlink:href':'href';t.on('click',function (e){
              t.attr(n)||e.preventDefault();
            });
          }
        };
      }}),No={};r(Ci,function (e,t){
      function n(e,n,i){
        e.$watch(i[r],function (e){
          i.$set(t,!!e);
        });
      }if('multiple'!=e){
        var r=dt(`ng-${t}`),i=n;'checked'===e&&(i=function (e,t,i){
          i.ngModel!==i[r]&&n(e,t,i);
        }),No[r]=function (){
          return{restrict:'A',priority:100,link:i};
        };
      }
    }),r(Ai,function (e,t){
      No[t]=function (){
        return{priority:100,link:function (e,n,r){
          if('ngPattern'===t&&'/'==r.ngPattern.charAt(0)){
            var i=r.ngPattern.match(Or);if(i)return void r.$set('ngPattern',new RegExp(i[1],i[2]));
          }e.$watch(r[t],function (e){
            r.$set(t,e);
          });
        }};
      };
    }),r(['src','srcset','href'],function (e){
      var t=dt(`ng-${e}`);No[t]=function (){
        return{priority:99,link:function (n,r,i){
          var o=e,a=e;'href'===e&&'[object SVGAnimatedString]'===Lr.call(r.prop('href'))&&(a='xlinkHref',i.$attr[a]='xlink:href',o=null),i.$observe(t,function (t){
            if(!t)return void('href'===e&&i.$set(a,null));i.$set(a,t),Dr&&o&&r.prop(o,i[a]);
          });
        }};
      };
    });var Vo={$addControl:p,$$renameControl:cr,$removeControl:p,$setValidity:p,$setDirty:p,$setPristine:p,$setSubmitted:p},jo='ng-submitted';lr.$inject=['$element','$attrs','$scope','$animate','$interpolate'];var Io=function (e){
        return['$timeout','$parse',function (t,n){
          function r(e){
            return''===e?n('this[""]').assign:n(e).assign||p;
          }return{name:'form',restrict:e?'EAC':'E',require:['form','^^?form'],controller:lr,compile:function (n,i){
            n.addClass(va).addClass(da);var o=i.name?'name':!(!e||!i.ngForm)&&'ngForm';return{pre:function (e,n,i,a){
              var s=a[0];if(!('action'in i)){
                var u=function (t){
                  e.$apply(function (){
                    s.$commitViewValue(),s.$setSubmitted();
                  }),t.preventDefault();
                };fi(n[0],'submit',u),n.on('$destroy',function (){
                  t(function (){
                    hi(n[0],'submit',u);
                  },0,!1);
                });
              }(a[1]||s.$$parentForm).$addControl(s);var l=o?r(s.$name):p;o&&(l(e,s),i.$observe(o,function (t){
                s.$name!==t&&(l(e,void 0),s.$$parentForm.$$renameControl(s,t),(l=r(s.$name))(e,s));
              })),n.on('$destroy',function (){
                s.$$parentForm.$removeControl(s),l(e,void 0),c(s,Vo);
              });
            }};
          }};
        }];
      },Do=Io(),Po=Io(!0),_o=/^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/,Ro=/^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+\])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i,Fo=/^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/,qo=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/,Uo=/^(\d{4,})-(\d{2})-(\d{2})$/,Lo=/^(\d{4,})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,Ho=/^(\d{4,})-W(\d\d)$/,Bo=/^(\d{4,})-(\d\d)$/,zo=/^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,Wo='keydown wheel mousedown',Go=pe();r('date,datetime-local,month,time,week'.split(','),function (e){
      Go[e]=!0;
    });var Zo={text:hr,date:vr('date',Uo,$r(Uo,['yyyy','MM','dd']),'yyyy-MM-dd'),'datetime-local':vr('datetimelocal',Lo,$r(Lo,['yyyy','MM','dd','HH','mm','ss','sss']),'yyyy-MM-ddTHH:mm:ss.sss'),time:vr('time',zo,$r(zo,['HH','mm','ss','sss']),'HH:mm:ss.sss'),week:vr('week',Ho,dr,'yyyy-Www'),month:vr('month',Bo,$r(Bo,['yyyy','MM']),'yyyy-MM'),number:gr,url:yr,email:br,radio:wr,checkbox:Sr,hidden:p,button:p,submit:p,reset:p,file:p},Jo=['$browser','$sniffer','$filter','$parse',function (e,t,n,r){
        return{restrict:'E',require:['?ngModel'],link:{pre:function (i,o,a,s){
          s[0]&&(Zo[Nr(a.type)]||Zo.text)(i,o,a,s[0],t,e,n,r);
        }}};
      }],Yo=/^(true|false|\d+)$/,Ko=function (){
        return{restrict:'A',priority:100,compile:function (e,t){
          return Yo.test(t.ngValue)?function (e,t,n){
            n.$set('value',e.$eval(n.ngValue));
          }:function (e,t,n){
            e.$watch(n.ngValue,function (e){
              n.$set('value',e);
            });
          };
        }};
      },Xo=['$compile',function (e){
        return{restrict:'AC',compile:function (t){
          return e.$$addBindingClass(t),function (t,n,r){
            e.$$addBindingInfo(n,r.ngBind),n=n[0],t.$watch(r.ngBind,function (e){
              n.textContent=m(e)?'':e;
            });
          };
        }};
      }],Qo=['$interpolate','$compile',function (e,t){
        return{compile:function (n){
          return t.$$addBindingClass(n),function (n,r,i){
            var o=e(r.attr(i.$attr.ngBindTemplate));t.$$addBindingInfo(r,o.expressions),r=r[0],i.$observe('ngBindTemplate',function (e){
              r.textContent=m(e)?'':e;
            });
          };
        }};
      }],ea=['$sce','$parse','$compile',function (e,t,n){
        return{restrict:'A',compile:function (r,i){
          var o=t(i.ngBindHtml),a=t(i.ngBindHtml,function (t){
            return e.valueOf(t);
          });return n.$$addBindingClass(r),function (t,r,i){
            n.$$addBindingInfo(r,i.ngBindHtml),t.$watch(a,function (){
              var n=o(t);r.html(e.getTrustedHtml(n)||'');
            });
          };
        }};
      }],ta=$({restrict:'A',require:'ngModel',link:function (e,t,n,r){
        r.$viewChangeListeners.push(function (){
          e.$eval(n.ngChange);
        });
      }}),na=Cr('',!0),ra=Cr('Odd',0),ia=Cr('Even',1),oa=ur({compile:function (e,t){
        t.$set('ngCloak',void 0),e.removeClass('ng-cloak');
      }}),aa=[function (){
        return{restrict:'A',scope:!0,controller:'@',priority:500};
      }],sa={},ua={blur:!0,focus:!0};r('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),function (e){
      var t=dt(`ng-${e}`);sa[t]=['$parse','$rootScope',function (n,r){
        return{restrict:'A',compile:function (i,o){
          var a=n(o[t],null,!0);return function (t,n){
            n.on(e,function (n){
              var i=function (){
                a(t,{$event:n});
              };ua[e]&&r.$$phase?t.$evalAsync(i):t.$apply(i);
            });
          };
        }};
      }];
    });var ca=['$animate','$compile',function (e,t){
        return{multiElement:!0,transclude:'element',priority:600,terminal:!0,restrict:'A',$$tlb:!0,link:function (n,r,i,o,a){
          var s,u,c;n.$watch(i.ngIf,function (n){
            n?u||a(function (n,o){
              u=o,n[n.length++]=t.$$createComment('end ngIf',i.ngIf),s={clone:n},e.enter(n,r.parent(),r);
            }):(c&&(c.remove(),c=null),u&&(u.$destroy(),u=null),s&&(c=he(s.clone),e.leave(c).then(function (){
              c=null;
            }),s=null));
          });
        }};
      }],la=['$templateRequest','$anchorScroll','$animate',function (e,t,n){
        return{restrict:'ECA',priority:400,terminal:!0,transclude:'element',controller:zr.noop,compile:function (r,i){
          var o=i.ngInclude||i.src,a=i.onload||'',s=i.autoscroll;return function (r,i,u,c,l){
            var f,h,p,d=0,$=function (){
              h&&(h.remove(),h=null),f&&(f.$destroy(),f=null),p&&(n.leave(p).then(function (){
                h=null;
              }),h=p,p=null);
            };r.$watch(o,function (o){
              var u=function (){
                  !g(s)||s&&!r.$eval(s)||t();
                },h=++d;o?(e(o,!0).then(function (e){
                if(!r.$$destroyed&&h===d){
                  var t=r.$new();c.template=e;var s=l(t,function (e){
                    $(),n.enter(e,null,i).then(u);
                  });f=t,p=s,f.$emit('$includeContentLoaded',o),r.$eval(a);
                }
              },function (){
                r.$$destroyed||h===d&&($(),r.$emit('$includeContentError',o));
              }),r.$emit('$includeContentRequested',o)):($(),c.template=null);
            });
          };
        }};
      }],fa=['$compile',function (t){
        return{restrict:'ECA',priority:-400,require:'ngInclude',link:function (n,r,i,o){
          if(Lr.call(r[0]).match(/SVG/))return r.empty(),void t(Ce(o.template,e.document).childNodes)(n,function (e){
            r.append(e);
          },{futureParentElement:r});r.html(o.template),t(r.contents())(n);
        }};
      }],ha=ur({priority:450,compile:function (){
        return{pre:function (e,t,n){
          e.$eval(n.ngInit);
        }};
      }}),pa=function (){
        return{restrict:'A',priority:100,require:'ngModel',link:function (e,t,n,i){
          var o=t.attr(n.$attr.ngList)||', ',a='false'!==n.ngTrim,s=a?Jr(o):o,u=function (e){
            if(!m(e)){
              var t=[];return e&&r(e.split(s),function (e){
                e&&t.push(a?Jr(e):e);
              }),t;
            }
          };i.$parsers.push(u),i.$formatters.push(function (e){
            if(Gr(e))return e.join(o);
          }),i.$isEmpty=function (e){
            return!e||!e.length;
          };
        }};
      },da='ng-valid',$a='ng-invalid',va='ng-pristine',ma='ng-dirty',ga='ng-pending',ya=t('ngModel'),ba=['$scope','$exceptionHandler','$attrs','$element','$parse','$animate','$timeout','$rootScope','$q','$interpolate',function (e,t,n,i,o,a,s,u,c,l){
        this.$viewValue=Number.NaN,this.$modelValue=Number.NaN,this.$$rawModelValue=void 0,this.$validators={},this.$asyncValidators={},this.$parsers=[],this.$formatters=[],this.$viewChangeListeners=[],this.$untouched=!0,this.$touched=!1,this.$pristine=!0,this.$dirty=!1,this.$valid=!0,this.$invalid=!1,this.$error={},this.$$success={},this.$pending=void 0,this.$name=l(n.name||'',!1)(e),this.$$parentForm=Vo;var f,h=o(n.ngModel),d=h.assign,$=h,v=d,y=null,b=this;this.$$setOptions=function (e){
          if(b.$options=e,e&&e.getterSetter){
            var t=o(`${n.ngModel}()`),r=o(`${n.ngModel}($$$p)`);$=function (e){
              var n=h(e);return C(n)&&(n=t(e)),n;
            },v=function (e,t){
              C(h(e))?r(e,{$$$p:t}):d(e,t);
            };
          }else if(!h.assign)throw ya('nonassign','Expression \'{0}\' is non-assignable. Element: {1}',n.ngModel,Y(i));
        },this.$render=p,this.$isEmpty=function (e){
          return m(e)||''===e||null===e||e!==e;
        },this.$$updateEmptyClasses=function (e){
          b.$isEmpty(e)?(a.removeClass(i,'ng-not-empty'),a.addClass(i,'ng-empty')):(a.removeClass(i,'ng-empty'),a.addClass(i,'ng-not-empty'));
        };var w=0;Er({ctrl:this,$element:i,set:function (e,t){
          e[t]=!0;
        },unset:function (e,t){
          delete e[t];
        },$animate:a}),this.$setPristine=function (){
          b.$dirty=!1,b.$pristine=!0,a.removeClass(i,ma),a.addClass(i,va);
        },this.$setDirty=function (){
          b.$dirty=!0,b.$pristine=!1,a.removeClass(i,va),a.addClass(i,ma),b.$$parentForm.$setDirty();
        },this.$setUntouched=function (){
          b.$touched=!1,b.$untouched=!0,a.setClass(i,'ng-untouched','ng-touched');
        },this.$setTouched=function (){
          b.$touched=!0,b.$untouched=!1,a.setClass(i,'ng-touched','ng-untouched');
        },this.$rollbackViewValue=function (){
          s.cancel(y),b.$viewValue=b.$$lastCommittedViewValue,b.$render();
        },this.$validate=function (){
          if(!x(b.$modelValue)||!isNaN(b.$modelValue)){
            var e=b.$$lastCommittedViewValue,t=b.$$rawModelValue,n=b.$valid,r=b.$modelValue,i=b.$options&&b.$options.allowInvalid;b.$$runValidators(t,e,function (e){
              i||n===e||(b.$modelValue=e?t:void 0,b.$modelValue!==r&&b.$$writeModelToScope());
            });
          }
        },this.$$runValidators=function (e,t,n){
          function i(e,t){
            a===w&&b.$setValidity(e,t);
          }function o(e){
            a===w&&n(e);
          }w++;var a=w;return function (){
            var e=b.$$parserName||'parse';return m(f)?(i(e,null),!0):(f||(r(b.$validators,function (e,t){
              i(t,null);
            }),r(b.$asyncValidators,function (e,t){
                i(t,null);
              })),i(e,f),f);
          }()&&function (){
            var n=!0;return r(b.$validators,function (r,o){
              var a=r(e,t);n=n&&a,i(o,a);
            }),!!n||(r(b.$asyncValidators,function (e,t){
              i(t,null);
            }),!1);
          }()?void function (){
              var n=[],a=!0;r(b.$asyncValidators,function (r,o){
                var s=r(e,t);if(!V(s))throw ya('nopromise','Expected asynchronous validator to return a promise but got \'{0}\' instead.',s);i(o,void 0),n.push(s.then(function (){
                  i(o,!0);
                },function (){
                  a=!1,i(o,!1);
                }));
              }),n.length?c.all(n).then(function (){
                o(a);
              },p):o(!0);
            }():void o(!1);
        },this.$commitViewValue=function (){
          var e=b.$viewValue;s.cancel(y),(b.$$lastCommittedViewValue!==e||''===e&&b.$$hasNativeValidators)&&(b.$$updateEmptyClasses(e),b.$$lastCommittedViewValue=e,b.$pristine&&this.$setDirty(),this.$$parseAndValidate());
        },this.$$parseAndValidate=function (){
          function t(){
            b.$modelValue!==o&&b.$$writeModelToScope();
          }var n=b.$$lastCommittedViewValue,r=n;if(f=!m(r)||void 0)for(var i=0;i<b.$parsers.length;i++)if(r=b.$parsers[i](r),m(r)){
            f=!1;break;
          }x(b.$modelValue)&&isNaN(b.$modelValue)&&(b.$modelValue=$(e));var o=b.$modelValue,a=b.$options&&b.$options.allowInvalid;b.$$rawModelValue=r,a&&(b.$modelValue=r,t()),b.$$runValidators(r,b.$$lastCommittedViewValue,function (e){
            a||(b.$modelValue=e?r:void 0,t());
          });
        },this.$$writeModelToScope=function (){
          v(e,b.$modelValue),r(b.$viewChangeListeners,function (e){
            try{
              e();
            }catch(e){
              t(e);
            }
          });
        },this.$setViewValue=function (e,t){
          b.$viewValue=e,b.$options&&!b.$options.updateOnDefault||b.$$debounceViewValueCommit(t);
        },this.$$debounceViewValueCommit=function (t){
          var n,r=0,i=b.$options;i&&g(i.debounce)&&(n=i.debounce,x(n)?r=n:x(n[t])?r=n[t]:x(n.default)&&(r=n.default)),s.cancel(y),r?y=s(function (){
            b.$commitViewValue();
          },r):u.$$phase?b.$commitViewValue():e.$apply(function (){
            b.$commitViewValue();
          });
        },e.$watch(function (){
          var t=$(e);if(t!==b.$modelValue&&(b.$modelValue===b.$modelValue||t===t)){
            b.$modelValue=b.$$rawModelValue=t,f=void 0;for(var n=b.$formatters,r=n.length,i=t;r--;)i=n[r](i);b.$viewValue!==i&&(b.$$updateEmptyClasses(i),b.$viewValue=b.$$lastCommittedViewValue=i,b.$render(),b.$$runValidators(t,i,p));
          }return t;
        });
      }],wa=['$rootScope',function (e){
        return{restrict:'A',require:['ngModel','^?form','^?ngModelOptions'],controller:ba,priority:1,compile:function (t){
          return t.addClass(va).addClass('ng-untouched').addClass(da),{pre:function (e,t,n,r){
            var i=r[0],o=r[1]||i.$$parentForm;i.$$setOptions(r[2]&&r[2].$options),o.$addControl(i),n.$observe('name',function (e){
              i.$name!==e&&i.$$parentForm.$$renameControl(i,e);
            }),e.$on('$destroy',function (){
              i.$$parentForm.$removeControl(i);
            });
          },post:function (t,n,r,i){
            var o=i[0];o.$options&&o.$options.updateOn&&n.on(o.$options.updateOn,function (e){
              o.$$debounceViewValueCommit(e&&e.type);
            }),n.on('blur',function (){
              o.$touched||(e.$$phase?t.$evalAsync(o.$setTouched):t.$apply(o.$setTouched));
            });
          }};
        }};
      }],xa=/(\s+|^)default(\s+|$)/,Sa=function (){
        return{restrict:'A',controller:['$scope','$attrs',function (e,t){
          var n=this;this.$options=F(e.$eval(t.ngModelOptions)),g(this.$options.updateOn)?(this.$options.updateOnDefault=!1,this.$options.updateOn=Jr(this.$options.updateOn.replace(xa,function (){
            return n.$options.updateOnDefault=!0,' ';
          }))):this.$options.updateOnDefault=!0;
        }]};
      },Ca=ur({terminal:!0,priority:1e3}),Ea=t('ngOptions'),Aa=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,ka=['$compile','$document','$parse',function (t,i,o){
        function a(e,t,r){
          function i(e,t,n,r,i){
            this.selectValue=e,this.viewValue=t,this.label=n,this.group=r,this.disabled=i;
          }function a(e){
            var t;if(!c&&n(e))t=e;else{
              t=[];for(var r in e)e.hasOwnProperty(r)&&'$'!==r.charAt(0)&&t.push(r);
            }return t;
          }var s=e.match(Aa);if(!s)throw Ea('iexp','Expected expression in form of \'_select_ (as _label_)? for (_key_,)?_value_ in _collection_\' but got \'{0}\'. Element: {1}',e,Y(t));var u=s[5]||s[7],c=s[6],l=/ as /.test(s[0])&&s[1],f=s[9],h=o(s[2]?s[1]:u),p=l&&o(l),d=p||h,$=f&&o(f),v=f?function (e,t){
              return $(r,t);
            }:function (e){
              return Je(e);
            },m=function (e,t){
              return v(e,S(e,t));
            },g=o(s[2]||s[1]),y=o(s[3]||''),b=o(s[4]||''),w=o(s[8]),x={},S=c?function (e,t){
              return x[c]=t,x[u]=e,x;
            }:function (e){
              return x[u]=e,x;
            };return{trackBy:f,getTrackByValue:m,getWatchables:o(w,function (e){
            var t=[];e=e||[];for(var n=a(e),i=n.length,o=0;o<i;o++){
              var u=e===n?o:n[o],c=e[u],l=S(c,u),f=v(c,l);if(t.push(f),s[2]||s[1]){
                var h=g(r,l);t.push(h);
              }if(s[4]){
                var p=b(r,l);t.push(p);
              }
            }return t;
          }),getOptions:function (){
            for(var e=[],t={},n=w(r)||[],o=a(n),s=o.length,u=0;u<s;u++){
              var c=n===o?u:o[u],l=n[c],h=S(l,c),p=d(r,h),$=v(p,h),x=g(r,h),C=y(r,h),E=b(r,h),A=new i($,p,x,C,E);e.push(A),t[$]=A;
            }return{items:e,selectValueMap:t,getOptionFromViewValue:function (e){
              return t[m(e)];
            },getViewValueFromOption:function (e){
              return f?zr.copy(e.viewValue):e.viewValue;
            }};
          }};
        }function s(e,n,o,s){
          function l(e,t){
            var n=u.cloneNode(!1);t.appendChild(n),f(e,n);
          }function f(e,t){
            e.element=t,t.disabled=e.disabled,e.label!==t.label&&(t.label=e.label,t.textContent=e.label),e.value!==t.value&&(t.value=e.selectValue);
          }function h(){
            var e=S&&d.readValue();if(S)for(var t=S.items.length-1;t>=0;t--){
              var r=S.items[t];Ue(r.group?r.element.parentNode:r.element);
            }S=C.getOptions();var i={};if(w&&n.prepend(p),S.items.forEach(function (e){
              var t;g(e.group)?(t=i[e.group],t||(t=c.cloneNode(!1),E.appendChild(t),t.label=e.group,i[e.group]=t),l(e,t)):l(e,E);
            }),n[0].appendChild(E),$.$render(),!$.$isEmpty(e)){
              var o=d.readValue();(C.trackBy||v?q(e,o):e===o)||($.$setViewValue(o),$.$render());
            }
          }for(var p,d=s[0],$=s[1],v=o.multiple,m=0,y=n.children(),b=y.length;m<b;m++)if(''===y[m].value){
            p=y.eq(m);break;
          }var w=!!p,x=Pr(u.cloneNode(!1));x.val('?');var S,C=a(o.ngOptions,n,e),E=i[0].createDocumentFragment(),A=function (){
              w||n.prepend(p),n.val(''),p.prop('selected',!0),p.attr('selected',!0);
            },k=function (){
              w||p.remove();
            },O=function (){
              n.prepend(x),n.val('?'),x.prop('selected',!0),x.attr('selected',!0);
            },M=function (){
              x.remove();
            };v?($.$isEmpty=function (e){
            return!e||0===e.length;
          },d.writeValue=function (e){
              S.items.forEach(function (e){
                e.element.selected=!1;
              }),e&&e.forEach(function (e){
                var t=S.getOptionFromViewValue(e);t&&(t.element.selected=!0);
              });
            },d.readValue=function (){
              var e=n.val()||[],t=[];return r(e,function (e){
                var n=S.selectValueMap[e];n&&!n.disabled&&t.push(S.getViewValueFromOption(n));
              }),t;
            },C.trackBy&&e.$watchCollection(function (){
              if(Gr($.$viewValue))return $.$viewValue.map(function (e){
                return C.getTrackByValue(e);
              });
            },function (){
              $.$render();
            })):(d.writeValue=function (e){
            var t=S.getOptionFromViewValue(e);t?(n[0].value!==t.selectValue&&(M(),k(),n[0].value=t.selectValue,t.element.selected=!0),t.element.setAttribute('selected','selected')):null===e||w?(M(),A()):(k(),O());
          },d.readValue=function (){
              var e=S.selectValueMap[n.val()];return e&&!e.disabled?(k(),M(),S.getViewValueFromOption(e)):null;
            },C.trackBy&&e.$watch(function (){
              return C.getTrackByValue($.$viewValue);
            },function (){
              $.$render();
            })),w?(p.remove(),t(p)(e),p.removeClass('ng-scope')):p=Pr(u.cloneNode(!1)),n.empty(),h(),e.$watchCollection(C.getWatchables,h);
        }var u=e.document.createElement('option'),c=e.document.createElement('optgroup');return{restrict:'A',terminal:!0,require:['select','ngModel'],link:{pre:function (e,t,n,r){
          r[0].registerOption=p;
        },post:s}};
      }],Oa=['$locale','$interpolate','$log',function (e,t,n){
        var i=/{}/g,o=/^when(Minus)?(.+)$/;return{link:function (a,s,u){
          function c(e){
            s.text(e||'');
          }var l,f=u.count,h=u.$attr.when&&s.attr(u.$attr.when),d=u.offset||0,$=a.$eval(h)||{},v={},g=t.startSymbol(),y=t.endSymbol(),b=`${g+f}-${d}${y}`,w=zr.noop;r(u,function (e,t){
            var n=o.exec(t);if(n){
              var r=(n[1]?'-':'')+Nr(n[2]);$[r]=s.attr(u.$attr[t]);
            }
          }),r($,function (e,n){
            v[n]=t(e.replace(i,b));
          }),a.$watch(f,function (t){
            var r=parseFloat(t),i=isNaN(r);if(i||r in $||(r=e.pluralCat(r-d)),r!==l&&!(i&&x(l)&&isNaN(l))){
              w();var o=v[r];m(o)?(null!=t&&n.debug(`ngPluralize: no rule defined for '${r}' in ${h}`),w=p,c()):w=a.$watch(o,c),l=r;
            }
          });
        }};
      }],Ma=['$parse','$animate','$compile',function (e,i,o){
        var a=t('ngRepeat'),s=function (e,t,n,r,i,o,a){
            e[n]=r,i&&(e[i]=o),e.$index=t,e.$first=0===t,e.$last=t===a-1,e.$middle=!(e.$first||e.$last),e.$odd=!(e.$even=0==(1&t));
          },u=function (e){
            return e.clone[0];
          },c=function (e){
            return e.clone[e.clone.length-1];
          };return{restrict:'A',multiElement:!0,transclude:'element',priority:1e3,terminal:!0,$$tlb:!0,compile:function (t,l){
          var f=l.ngRepeat,h=o.$$createComment('end ngRepeat',f),p=f.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);if(!p)throw a('iexp','Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.',f);var d=p[1],$=p[2],v=p[3],m=p[4];if(!(p=d.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/)))throw a('iidexp','\'_item_\' in \'_item_ in _collection_\' should be an identifier or \'(_key_, _value_)\' expression, but got \'{0}\'.',d);var g=p[3]||p[1],y=p[2];if(v&&(!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(v)||/^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(v)))throw a('badident','alias \'{0}\' is invalid --- must be a valid JS identifier which is not a reserved name.',v);var b,w,x,S,C={$id:Je};return m?b=e(m):(x=function (e,t){
            return Je(t);
          },S=function (e){
              return e;
            }),function (e,t,o,l,p){
            b&&(w=function (t,n,r){
              return y&&(C[y]=t),C[g]=n,C.$index=r,b(e,C);
            });var d=pe();e.$watchCollection($,function (o){
              var l,$,m,b,C,E,A,k,O,M,T,N,V=t[0],j=pe();if(v&&(e[v]=o),n(o))O=o,k=w||x;else{
                k=w||S,O=[];for(var I in o)Tr.call(o,I)&&'$'!==I.charAt(0)&&O.push(I);
              }for(b=O.length,T=new Array(b),l=0;l<b;l++)if(C=o===O?l:O[l],E=o[C],A=k(C,E,l),d[A])M=d[A],delete d[A],j[A]=M,T[l]=M;else{
                if(j[A])throw r(T,function (e){
                  e&&e.scope&&(d[e.id]=e);
                }),a('dupes','Duplicates in a repeater are not allowed. Use \'track by\' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}',f,A,E);T[l]={id:A,scope:void 0,clone:void 0},j[A]=!0;
              }for(var D in d){
                if(M=d[D],N=he(M.clone),i.leave(N),N[0].parentNode)for(l=0,$=N.length;l<$;l++)N[l].$$NG_REMOVED=!0;M.scope.$destroy();
              }for(l=0;l<b;l++)if(C=o===O?l:O[l],E=o[C],M=T[l],M.scope){
                m=V;do{
                  m=m.nextSibling;
                }while(m&&m.$$NG_REMOVED);u(M)!=m&&i.move(he(M.clone),null,V),V=c(M),s(M.scope,l,g,E,y,C,b);
              }else p(function (e,t){
                  M.scope=t;var n=h.cloneNode(!1);e[e.length++]=n,i.enter(e,null,V),V=n,M.clone=e,j[M.id]=M,s(M.scope,l,g,E,y,C,b);
                });d=j;
            });
          };
        }};
      }],Ta=['$animate',function (e){
        return{restrict:'A',multiElement:!0,link:function (t,n,r){
          t.$watch(r.ngShow,function (t){
            e[t?'removeClass':'addClass'](n,'ng-hide',{tempClasses:'ng-hide-animate'});
          });
        }};
      }],Na=['$animate',function (e){
        return{restrict:'A',multiElement:!0,link:function (t,n,r){
          t.$watch(r.ngHide,function (t){
            e[t?'addClass':'removeClass'](n,'ng-hide',{tempClasses:'ng-hide-animate'});
          });
        }};
      }],Va=ur(function (e,t,n){
        e.$watch(n.ngStyle,function (e,n){
          n&&e!==n&&r(n,function (e,n){
            t.css(n,'');
          }),e&&t.css(e);
        },!0);
      }),ja=['$animate','$compile',function (e,t){
        return{require:'ngSwitch',controller:['$scope',function (){
          this.cases={};
        }],link:function (n,i,o,a){
          var s=o.ngSwitch||o.on,u=[],c=[],l=[],f=[],h=function (e,t){
            return function (){
              e.splice(t,1);
            };
          };n.$watch(s,function (n){
            var i,o;for(i=0,o=l.length;i<o;++i)e.cancel(l[i]);for(l.length=0,i=0,o=f.length;i<o;++i){
              var s=he(c[i].clone);f[i].$destroy();(l[i]=e.leave(s)).then(h(l,i));
            }c.length=0,f.length=0,(u=a.cases[`!${n}`]||a.cases['?'])&&r(u,function (n){
              n.transclude(function (r,i){
                f.push(i);var o=n.element;r[r.length++]=t.$$createComment('end ngSwitchWhen');var a={clone:r};c.push(a),e.enter(r,o.parent(),o);
              });
            });
          });
        }};
      }],Ia=ur({transclude:'element',priority:1200,require:'^ngSwitch',multiElement:!0,link:function (e,t,n,r,i){
        r.cases[`!${n.ngSwitchWhen}`]=r.cases[`!${n.ngSwitchWhen}`]||[],r.cases[`!${n.ngSwitchWhen}`].push({transclude:i,element:t});
      }}),Da=ur({transclude:'element',priority:1200,require:'^ngSwitch',multiElement:!0,link:function (e,t,n,r,i){
        r.cases['?']=r.cases['?']||[],r.cases['?'].push({transclude:i,element:t});
      }}),Pa=t('ngTransclude'),_a=ur({restrict:'EAC',link:function (e,t,n,r,i){
        function o(e){
          e.length&&(t.empty(),t.append(e));
        }if(n.ngTransclude===n.$attr.ngTransclude&&(n.ngTransclude=''),!i)throw Pa('orphan','Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}',Y(t));i(o,null,n.ngTransclude||n.ngTranscludeSlot);
      }}),Ra=['$templateCache',function (e){
        return{restrict:'E',terminal:!0,compile:function (t,n){
          if('text/ng-template'==n.type){
            var r=n.id,i=t[0].text;e.put(r,i);
          }
        }};
      }],Fa={$setViewValue:p,$render:p},qa=['$element','$scope',function (t,n){
        var r=this,i=new Ye;r.ngModelCtrl=Fa,
        r.unknownOption=Pr(e.document.createElement('option')),r.renderUnknownOption=function (e){
          var n=`? ${Je(e)} ?`;r.unknownOption.val(n),t.prepend(r.unknownOption),t.val(n);
        },n.$on('$destroy',function (){
          r.renderUnknownOption=p;
        }),r.removeUnknownOption=function (){
          r.unknownOption.parent()&&r.unknownOption.remove();
        },r.readValue=function (){
          return r.removeUnknownOption(),t.val();
        },r.writeValue=function (e){
          r.hasOption(e)?(r.removeUnknownOption(),t.val(e),''===e&&r.emptyOption.prop('selected',!0)):null==e&&r.emptyOption?(r.removeUnknownOption(),t.val('')):r.renderUnknownOption(e);
        },r.addOption=function (e,t){
          if(t[0].nodeType!==oi){
            le(e,'"option value"'),''===e&&(r.emptyOption=t);var n=i.get(e)||0;i.put(e,n+1),r.ngModelCtrl.$render(),kr(t);
          }
        },r.removeOption=function (e){
          var t=i.get(e);t&&(1===t?(i.remove(e),''===e&&(r.emptyOption=void 0)):i.put(e,t-1));
        },r.hasOption=function (e){
          return!!i.get(e);
        },r.registerOption=function (e,t,n,i,o){
          if(i){
            var a;n.$observe('value',function (e){
              g(a)&&r.removeOption(a),a=e,r.addOption(e,t);
            });
          }else o?e.$watch(o,function (e,i){
            n.$set('value',e),i!==e&&r.removeOption(i),r.addOption(e,t);
          }):r.addOption(n.value,t);t.on('$destroy',function (){
            r.removeOption(n.value),r.ngModelCtrl.$render();
          });
        };
      }],Ua=function (){
        function e(e,t,n,i){
          var o=i[1];if(o){
            var a=i[0];if(a.ngModelCtrl=o,t.on('change',function (){
              e.$apply(function (){
                o.$setViewValue(a.readValue());
              });
            }),n.multiple){
              a.readValue=function (){
                var e=[];return r(t.find('option'),function (t){
                  t.selected&&e.push(t.value);
                }),e;
              },a.writeValue=function (e){
                var n=new Ye(e);r(t.find('option'),function (e){
                  e.selected=g(n.get(e.value));
                });
              };var s,u=NaN;e.$watch(function (){
                u!==o.$viewValue||q(s,o.$viewValue)||(s=$e(o.$viewValue),o.$render()),u=o.$viewValue;
              }),o.$isEmpty=function (e){
                return!e||0===e.length;
              };
            }
          }
        }function t(e,t,n,r){
          var i=r[1];if(i){
            var o=r[0];i.$render=function (){
              o.writeValue(i.$viewValue);
            };
          }
        }return{restrict:'E',require:['select','?ngModel'],controller:qa,priority:1,link:{pre:e,post:t}};
      },La=['$interpolate',function (e){
        return{restrict:'E',priority:100,compile:function (t,n){
          if(g(n.value))var r=e(n.value,!0);else{
            var i=e(t.text(),!0);i||n.$set('value',t.text());
          }return function (e,t,n){
            var o=t.parent(),a=o.data('$selectController')||o.parent().data('$selectController');a&&a.registerOption(e,t,n,r,i);
          };
        }};
      }],Ha=$({restrict:'E',terminal:!1}),Ba=function (){
        return{restrict:'A',require:'?ngModel',link:function (e,t,n,r){
          r&&(n.required=!0,r.$validators.required=function (e,t){
            return!n.required||!r.$isEmpty(t);
          },n.$observe('required',function (){
              r.$validate();
            }));
        }};
      },za=function (){
        return{restrict:'A',require:'?ngModel',link:function (e,n,r,i){
          if(i){
            var o,a=r.ngPattern||r.pattern;r.$observe('pattern',function (e){
              if(w(e)&&e.length>0&&(e=new RegExp(`^${e}$`)),e&&!e.test)throw t('ngPattern')('noregexp','Expected {0} to be a RegExp but was {1}. Element: {2}',a,e,Y(n));o=e||void 0,i.$validate();
            }),i.$validators.pattern=function (e,t){
              return i.$isEmpty(t)||m(o)||o.test(t);
            };
          }
        }};
      },Wa=function (){
        return{restrict:'A',require:'?ngModel',link:function (e,t,n,r){
          if(r){
            var i=-1;n.$observe('maxlength',function (e){
              var t=f(e);i=isNaN(t)?-1:t,r.$validate();
            }),r.$validators.maxlength=function (e,t){
              return i<0||r.$isEmpty(t)||t.length<=i;
            };
          }
        }};
      },Ga=function (){
        return{restrict:'A',require:'?ngModel',link:function (e,t,n,r){
          if(r){
            var i=0;n.$observe('minlength',function (e){
              i=f(e)||0,r.$validate();
            }),r.$validators.minlength=function (e,t){
              return r.$isEmpty(t)||t.length>=i;
            };
          }
        }};
      };if(e.angular.bootstrap)return void(e.console&&console.log('WARNING: Tried to load angular more than once.'));!function (){
      var t;if(!ni){
        var n=Xr();_r=m(n)?e.jQuery:n?e[n]:void 0,_r&&_r.fn.on?(Pr=_r,c(_r.fn,{scope:Si.scope,isolateScope:Si.isolateScope,controller:Si.controller,injector:Si.injector,inheritedData:Si.inheritedData}),t=_r.cleanData,_r.cleanData=function (e){
          for(var n,r,i=0;null!=(r=e[i]);i++)(n=_r._data(r,'events'))&&n.$destroy&&_r(r).triggerHandler('$destroy');t(e);
        }):Pr=ke,zr.element=Pr,ni=!0;
      }
    }(),function (n){
      c(n,{bootstrap:ie,copy:F,extend:c,merge:l,equals:q,element:Pr,forEach:r,injector:tt,noop:p,bind:H,toJson:z,fromJson:W,identity:d,isUndefined:m,isDefined:g,isString:w,isFunction:C,isObject:y,isNumber:x,isElement:D,isArray:Gr,version:ui,isDate:S,lowercase:Nr,uppercase:Vr,callbacks:{counter:0},getTestability:ae,$$minErr:t,$$csp:Kr,reloadWithDebugInfo:oe}),(Rr=de(e))('ng',['ngLocale'],['$provide',function (e){
        e.provider({$$sanitizeUri:Sn}),e.provider('$compile',ht).directive({a:To,input:Jo,textarea:Jo,form:Do,script:Ra,select:Ua,style:Ha,option:La,ngBind:Xo,ngBindHtml:ea,ngBindTemplate:Qo,ngClass:na,ngClassEven:ia,ngClassOdd:ra,ngCloak:oa,ngController:aa,ngForm:Po,ngHide:Na,ngIf:ca,ngInclude:la,ngInit:ha,ngNonBindable:Ca,ngPluralize:Oa,ngRepeat:Ma,ngShow:Ta,ngStyle:Va,ngSwitch:ja,ngSwitchWhen:Ia,ngSwitchDefault:Da,ngOptions:ka,ngTransclude:_a,ngModel:wa,ngList:pa,ngChange:ta,pattern:za,ngPattern:za,required:Ba,ngRequired:Ba,minlength:Ga,ngMinlength:Ga,maxlength:Wa,ngMaxlength:Wa,ngValue:Ko,ngModelOptions:Sa}).directive({ngInclude:fa}).directive(No).directive(sa),e.provider({$anchorScroll:nt,$animate:Ri,$animateCss:Ui,$$animateJs:Pi,$$animateQueue:_i,$$AnimateRunner:qi,$$animateAsyncRun:Fi,$browser:ut,$cacheFactory:ct,$controller:gt,$document:yt,$exceptionHandler:bt,$filter:_n,$$forceReflow:Gi,$interpolate:It,$interval:Dt,$http:Tt,$httpParamSerializer:xt,$httpParamSerializerJQLike:St,$httpBackend:Vt,$xhrFactory:Nt,$location:Yt,$log:Kt,$parse:mn,$rootScope:xn,$q:gn,$$q:yn,$sce:kn,$sceDelegate:An,$sniffer:On,$templateCache:lt,$templateRequest:Mn,$$testability:Tn,$timeout:Nn,$window:In,$$rAF:wn,$$jqLite:Ze,$$HashMap:ki,$$cookieReader:Pn});
      }]);
    }(zr),zr.module('ngLocale',[],['$provide',function (e){
      function t(e){
        e+='';var t=e.indexOf('.');return-1==t?0:e.length-t-1;
      }function n(e,n){
        var r=n;void 0===r&&(r=Math.min(t(e),3));var i=Math.pow(10,r);return{v:r,f:(e*i|0)%i};
      }var r={ZERO:'zero',ONE:'one',TWO:'two',FEW:'few',MANY:'many',OTHER:'other'};e.value('$locale',{DATETIME_FORMATS:{AMPMS:['AM','PM'],DAY:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],ERANAMES:['Before Christ','Anno Domini'],ERAS:['BC','AD'],FIRSTDAYOFWEEK:6,MONTH:['January','February','March','April','May','June','July','August','September','October','November','December'],SHORTDAY:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],SHORTMONTH:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],STANDALONEMONTH:['January','February','March','April','May','June','July','August','September','October','November','December'],WEEKENDRANGE:[5,6],fullDate:'EEEE, MMMM d, y',longDate:'MMMM d, y',medium:'MMM d, y h:mm:ss a',mediumDate:'MMM d, y',mediumTime:'h:mm:ss a',short:'M/d/yy h:mm a',shortDate:'M/d/yy',shortTime:'h:mm a'},NUMBER_FORMATS:{CURRENCY_SYM:'$',DECIMAL_SEP:'.',GROUP_SEP:',',PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:'-',negSuf:'',posPre:'',posSuf:''},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:'-¤',negSuf:'',posPre:'¤',posSuf:''}]},id:'en-us',localeID:'en_US',pluralCat:function (e,t){
        var i=0|e,o=n(e,t);return 1==i&&0==o.v?r.ONE:r.OTHER;
      }});
    }]),Pr(e.document).ready(function (){
      re(e.document,ie);
    });
  }(window),!window.angular.$$csp().noInlineStyle&&window.angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>');
},{}],50:[function (require,module,exports){
  require('./angular'),module.exports=angular;
},{'./angular':49}],51:[function (require,module,exports){
  !function (e,t){
    if('function'==typeof define&&define.amd)define(['exports'],t);else if('object'==typeof exports&&'string'!=typeof exports.nodeName)t(exports);else{
      var n={};t(n),e.AnsiUp=n.default;
    }
  }(this,function (e){
    'use strict';function t(e){
      for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var i=e.raw[0],s=/^\s+|\s+\n|\s*#[\s\S]*?\n|\n/gm,r=i.replace(s,'');return new RegExp(r);
    }function n(e){
      for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var i=e.raw[0],s=/^\s+|\s+\n|\s*#[\s\S]*?\n|\n/gm,r=i.replace(s,'');return new RegExp(r,'g');
    }var i,s=this&&this.__makeTemplateObject||function (e,t){
      return Object.defineProperty?Object.defineProperty(e,'raw',{value:t}):e.raw=t,e;
    };!function (e){
      e[e.EOS=0]='EOS',e[e.Text=1]='Text',e[e.Incomplete=2]='Incomplete',e[e.ESC=3]='ESC',e[e.Unknown=4]='Unknown',e[e.SGR=5]='SGR',e[e.OSCURL=6]='OSCURL';
    }(i||(i={}));var r=function (){
      function e(){
        this.VERSION='4.0.3',this.setup_palettes(),this._use_classes=!1,this._escape_for_html=!0,this.bold=!1,this.fg=this.bg=null,this._buffer='',this._url_whitelist={http:1,https:1};
      }return Object.defineProperty(e.prototype,'use_classes',{get:function (){
        return this._use_classes;
      },set:function (e){
        this._use_classes=e;
      },enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,'escape_for_html',{get:function (){
        return this._escape_for_html;
      },set:function (e){
        this._escape_for_html=e;
      },enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,'url_whitelist',{get:function (){
        return this._url_whitelist;
      },set:function (e){
        this._url_whitelist=e;
      },enumerable:!0,configurable:!0}),e.prototype.setup_palettes=function (){
        var e=this;this.ansi_colors=[[{rgb:[0,0,0],class_name:'ansi-black'},{rgb:[187,0,0],class_name:'ansi-red'},{rgb:[0,187,0],class_name:'ansi-green'},{rgb:[187,187,0],class_name:'ansi-yellow'},{rgb:[0,0,187],class_name:'ansi-blue'},{rgb:[187,0,187],class_name:'ansi-magenta'},{rgb:[0,187,187],class_name:'ansi-cyan'},{rgb:[255,255,255],class_name:'ansi-white'}],[{rgb:[85,85,85],class_name:'ansi-bright-black'},{rgb:[255,85,85],class_name:'ansi-bright-red'},{rgb:[0,255,0],class_name:'ansi-bright-green'},{rgb:[255,255,85],class_name:'ansi-bright-yellow'},{rgb:[85,85,255],class_name:'ansi-bright-blue'},{rgb:[255,85,255],class_name:'ansi-bright-magenta'},{rgb:[85,255,255],class_name:'ansi-bright-cyan'},{rgb:[255,255,255],class_name:'ansi-bright-white'}]],this.palette_256=[],this.ansi_colors.forEach(function (t){
          t.forEach(function (t){
            e.palette_256.push(t);
          });
        });for(var t=[0,95,135,175,215,255],n=0;n<6;++n)for(var i=0;i<6;++i)for(var s=0;s<6;++s){
          var r={rgb:[t[n],t[i],t[s]],class_name:'truecolor'};this.palette_256.push(r);
        }for(var a=8,l=0;l<24;++l,a+=10){
          var f={rgb:[a,a,a],class_name:'truecolor'};this.palette_256.push(f);
        }
      },e.prototype.escape_txt_for_html=function (e){
        return e.replace(/[&<>]/gm,function (e){
          return'&'===e?'&amp;':'<'===e?'&lt;':'>'===e?'&gt;':void 0;
        });
      },e.prototype.append_buffer=function (e){
        var t=this._buffer+e;this._buffer=t;
      },e.prototype.get_next_packet=function (){
        var e={kind:i.EOS,text:'',url:''},r=this._buffer.length;if(0==r)return e;var a=this._buffer.indexOf('');if(-1==a)return e.kind=i.Text,e.text=this._buffer,this._buffer='',e;if(a>0)return e.kind=i.Text,e.text=this._buffer.slice(0,a),this._buffer=this._buffer.slice(a),e;if(0==a){
          if(1==r)return e.kind=i.Incomplete,e;var l=this._buffer.charAt(1);if('['!=l&&']'!=l)return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;if('['==l){
            this._csi_regex||(this._csi_regex=t(s(['\n                        ^                           # beginning of line\n                                                    #\n                                                    # First attempt\n                        (?:                         # legal sequence\n                          [                      # CSI\n                          ([<-?]?)              # private-mode char\n                          ([d;]*)                    # any digits or semicolons\n                          ([ -/]?               # an intermediate modifier\n                          [@-~])                # the command\n                        )\n                        |                           # alternate (second attempt)\n                        (?:                         # illegal sequence\n                          [                      # CSI\n                          [ -~]*                # anything legal\n                          ([\0-:])              # anything illegal\n                        )\n                    '],['\n                        ^                           # beginning of line\n                                                    #\n                                                    # First attempt\n                        (?:                         # legal sequence\n                          \\x1b\\[                      # CSI\n                          ([\\x3c-\\x3f]?)              # private-mode char\n                          ([\\d;]*)                    # any digits or semicolons\n                          ([\\x20-\\x2f]?               # an intermediate modifier\n                          [\\x40-\\x7e])                # the command\n                        )\n                        |                           # alternate (second attempt)\n                        (?:                         # illegal sequence\n                          \\x1b\\[                      # CSI\n                          [\\x20-\\x7e]*                # anything legal\n                          ([\\x00-\\x1f:])              # anything illegal\n                        )\n                    '])));var f=this._buffer.match(this._csi_regex);if(null===f)return e.kind=i.Incomplete,e;if(f[4])return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;''!=f[1]||'m'!=f[3]?e.kind=i.Unknown:e.kind=i.SGR,e.text=f[2];var h=f[0].length;return this._buffer=this._buffer.slice(h),e;
          }if(']'==l){
            if(r<4)return e.kind=i.Incomplete,e;if('8'!=this._buffer.charAt(2)||';'!=this._buffer.charAt(3))return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;this._osc_st||(this._osc_st=n(s(['\n                        (?:                         # legal sequence\n                          (\\)                    # ESC                           |                           # alternate\n                          ()                      # BEL (what xterm did)\n                        )\n                        |                           # alternate (second attempt)\n                        (                           # illegal sequence\n                          [\0-]                 # anything illegal\n                          |                           # alternate\n                          [\b-]                 # anything illegal\n                          |                           # alternate\n                          [-]                 # anything illegal\n                        )\n                    '],['\n                        (?:                         # legal sequence\n                          (\\x1b\\\\)                    # ESC \\\n                          |                           # alternate\n                          (\\x07)                      # BEL (what xterm did)\n                        )\n                        |                           # alternate (second attempt)\n                        (                           # illegal sequence\n                          [\\x00-\\x06]                 # anything illegal\n                          |                           # alternate\n                          [\\x08-\\x1a]                 # anything illegal\n                          |                           # alternate\n                          [\\x1c-\\x1f]                 # anything illegal\n                        )\n                    ']))),this._osc_st.lastIndex=0;var o=this._osc_st.exec(this._buffer);if(null===o)return e.kind=i.Incomplete,e;if(o[3])return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;var c=this._osc_st.exec(this._buffer);if(null===c)return e.kind=i.Incomplete,e;if(c[3])return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;this._osc_regex||(this._osc_regex=t(s(['\n                        ^                           # beginning of line\n                                                    #\n                        ]8;                    # OSC Hyperlink\n                        [ -:<-~]*       # params (excluding ;)\n                        ;                           # end of params\n                        ([!-~]{0,512})        # URL capture\n                        (?:                         # ST\n                          (?:\\)                  # ESC                           |                           # alternate\n                          (?:)                    # BEL (what xterm did)\n                        )\n                        ([!-~]+)              # TEXT capture\n                        ]8;;                   # OSC Hyperlink End\n                        (?:                         # ST\n                          (?:\\)                  # ESC                           |                           # alternate\n                          (?:)                    # BEL (what xterm did)\n                        )\n                    '],['\n                        ^                           # beginning of line\n                                                    #\n                        \\x1b\\]8;                    # OSC Hyperlink\n                        [\\x20-\\x3a\\x3c-\\x7e]*       # params (excluding ;)\n                        ;                           # end of params\n                        ([\\x21-\\x7e]{0,512})        # URL capture\n                        (?:                         # ST\n                          (?:\\x1b\\\\)                  # ESC \\\n                          |                           # alternate\n                          (?:\\x07)                    # BEL (what xterm did)\n                        )\n                        ([\\x21-\\x7e]+)              # TEXT capture\n                        \\x1b\\]8;;                   # OSC Hyperlink End\n                        (?:                         # ST\n                          (?:\\x1b\\\\)                  # ESC \\\n                          |                           # alternate\n                          (?:\\x07)                    # BEL (what xterm did)\n                        )\n                    '])));var f=this._buffer.match(this._osc_regex);if(null===f)return e.kind=i.ESC,e.text=this._buffer.slice(0,1),this._buffer=this._buffer.slice(1),e;e.kind=i.OSCURL,e.url=f[1],e.text=f[2];var h=f[0].length;return this._buffer=this._buffer.slice(h),e;
          }
        }
      },e.prototype.ansi_to_html=function (e){
        this.append_buffer(e);for(var t=[];;){
          var n=this.get_next_packet();if(n.kind==i.EOS||n.kind==i.Incomplete)break;n.kind!=i.ESC&&n.kind!=i.Unknown&&(n.kind==i.Text?t.push(this.transform_to_html(this.with_state(n))):n.kind==i.SGR?this.process_ansi(n):n.kind==i.OSCURL&&t.push(this.process_hyperlink(n)));
        }return t.join('');
      },e.prototype.with_state=function (e){
        return{bold:this.bold,fg:this.fg,bg:this.bg,text:e.text};
      },e.prototype.process_ansi=function (e){
        for(var t=e.text.split(';');t.length>0;){
          var n=t.shift(),i=parseInt(n,10);if(isNaN(i)||0===i)this.fg=this.bg=null,this.bold=!1;else if(1===i)this.bold=!0;else if(22===i)this.bold=!1;else if(39===i)this.fg=null;else if(49===i)this.bg=null;else if(i>=30&&i<38)this.fg=this.ansi_colors[0][i-30];else if(i>=40&&i<48)this.bg=this.ansi_colors[0][i-40];else if(i>=90&&i<98)this.fg=this.ansi_colors[1][i-90];else if(i>=100&&i<108)this.bg=this.ansi_colors[1][i-100];else if((38===i||48===i)&&t.length>0){
            var s=38===i,r=t.shift();if('5'===r&&t.length>0){
              var a=parseInt(t.shift(),10);a>=0&&a<=255&&(s?this.fg=this.palette_256[a]:this.bg=this.palette_256[a]);
            }if('2'===r&&t.length>2){
              var l=parseInt(t.shift(),10),f=parseInt(t.shift(),10),h=parseInt(t.shift(),10);if(l>=0&&l<=255&&f>=0&&f<=255&&h>=0&&h<=255){
                var o={rgb:[l,f,h],class_name:'truecolor'};s?this.fg=o:this.bg=o;
              }
            }
          }
        }
      },e.prototype.transform_to_html=function (e){
        var t=e.text;if(0===t.length)return t;if(this._escape_for_html&&(t=this.escape_txt_for_html(t)),!e.bold&&null===e.fg&&null===e.bg)return t;var n=[],i=[],s=e.fg,r=e.bg;e.bold&&n.push('font-weight:bold'),this._use_classes?(s&&('truecolor'!==s.class_name?i.push(`${s.class_name}-fg`):n.push(`color:rgb(${s.rgb.join(',')})`)),r&&('truecolor'!==r.class_name?i.push(`${r.class_name}-bg`):n.push(`background-color:rgb(${r.rgb.join(',')})`))):(s&&n.push(`color:rgb(${s.rgb.join(',')})`),r&&n.push(`background-color:rgb(${r.rgb})`));var a='',l='';return i.length&&(a=` class="${i.join(' ')}"`),n.length&&(l=` style="${n.join(';')}"`),`<span${l}${a}>${t}</span>`;
      },e.prototype.process_hyperlink=function (e){
        var t=e.url.split(':');return t.length<1?'':this._url_whitelist[t[0]]?`<a href="${this.escape_txt_for_html(e.url)}">${this.escape_txt_for_html(e.text)}</a>`:'';
      },e;
    }();Object.defineProperty(e,'__esModule',{value:!0}),e.default=r;
  });
},{}],52:[function (require,module,exports){
  module.exports=function (r,e,n){
    var t=r.byteLength;if(e=e||0,n=n||t,r.slice)return r.slice(e,n);if(e<0&&(e+=t),n<0&&(n+=t),n>t&&(n=t),e>=t||e>=n||0===t)return new ArrayBuffer(0);for(var f=new Uint8Array(r),i=new Uint8Array(n-e),u=e,a=0;u<n;u++,a++)i[a]=f[u];return i.buffer;
  };
},{}],53:[function (require,module,exports){
  function Backoff(t){
    t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0;
  }module.exports=Backoff,Backoff.prototype.duration=function (){
    var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){
      var o=Math.random(),i=Math.floor(o*this.jitter*t);t=0==(1&Math.floor(10*o))?t-i:t+i;
    }return 0|Math.min(t,this.max);
  },Backoff.prototype.reset=function (){
    this.attempts=0;
  },Backoff.prototype.setMin=function (t){
    this.ms=t;
  },Backoff.prototype.setMax=function (t){
    this.max=t;
  },Backoff.prototype.setJitter=function (t){
    this.jitter=t;
  };
},{}],54:[function (require,module,exports){
  !function (){
    'use strict';for(var r='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',e=new Uint8Array(256),t=0;t<r.length;t++)e[r.charCodeAt(t)]=t;exports.encode=function (e){
      var t,n=new Uint8Array(e),o=n.length,a='';for(t=0;t<o;t+=3)a+=r[n[t]>>2],a+=r[(3&n[t])<<4|n[t+1]>>4],a+=r[(15&n[t+1])<<2|n[t+2]>>6],a+=r[63&n[t+2]];return o%3==2?a=`${a.substring(0,a.length-1)}=`:o%3==1&&(a=`${a.substring(0,a.length-2)}==`),a;
    },exports.decode=function (r){
      var t,n,o,a,h,c=.75*r.length,g=r.length,i=0;'='===r[r.length-1]&&(c--,'='===r[r.length-2]&&c--);var u=new ArrayBuffer(c),A=new Uint8Array(u);for(t=0;t<g;t+=4)n=e[r.charCodeAt(t)],o=e[r.charCodeAt(t+1)],a=e[r.charCodeAt(t+2)],h=e[r.charCodeAt(t+3)],A[i++]=n<<2|o>>4,A[i++]=(15&o)<<4|a>>2,A[i++]=(3&a)<<6|63&h;return u;
    };
  }();
},{}],55:[function (require,module,exports){
  'use strict';function getLens(o){
    var r=o.length;if(r%4>0)throw new Error('Invalid string. Length must be a multiple of 4');var e=o.indexOf('=');return-1===e&&(e=r),[e,e===r?0:4-e%4];
  }function byteLength(o){
    var r=getLens(o),e=r[0],t=r[1];return 3*(e+t)/4-t;
  }function _byteLength(o,r,e){
    return 3*(r+e)/4-e;
  }function toByteArray(o){
    for(var r,e=getLens(o),t=e[0],n=e[1],u=new Arr(_byteLength(o,t,n)),p=0,a=n>0?t-4:t,h=0;h<a;h+=4)r=revLookup[o.charCodeAt(h)]<<18|revLookup[o.charCodeAt(h+1)]<<12|revLookup[o.charCodeAt(h+2)]<<6|revLookup[o.charCodeAt(h+3)],u[p++]=r>>16&255,u[p++]=r>>8&255,u[p++]=255&r;return 2===n&&(r=revLookup[o.charCodeAt(h)]<<2|revLookup[o.charCodeAt(h+1)]>>4,u[p++]=255&r),1===n&&(r=revLookup[o.charCodeAt(h)]<<10|revLookup[o.charCodeAt(h+1)]<<4|revLookup[o.charCodeAt(h+2)]>>2,u[p++]=r>>8&255,u[p++]=255&r),u;
  }function tripletToBase64(o){
    return lookup[o>>18&63]+lookup[o>>12&63]+lookup[o>>6&63]+lookup[63&o];
  }function encodeChunk(o,r,e){
    for(var t,n=[],u=r;u<e;u+=3)t=(o[u]<<16&16711680)+(o[u+1]<<8&65280)+(255&o[u+2]),n.push(tripletToBase64(t));return n.join('');
  }function fromByteArray(o){
    for(var r,e=o.length,t=e%3,n=[],u=0,p=e-t;u<p;u+=16383)n.push(encodeChunk(o,u,u+16383>p?p:u+16383));return 1===t?(r=o[e-1],n.push(`${lookup[r>>2]+lookup[r<<4&63]}==`)):2===t&&(r=(o[e-2]<<8)+o[e-1],n.push(`${lookup[r>>10]+lookup[r>>4&63]+lookup[r<<2&63]}=`)),n.join('');
  }exports.byteLength=byteLength,exports.toByteArray=toByteArray,exports.fromByteArray=fromByteArray;for(var lookup=[],revLookup=[],Arr='undefined'!=typeof Uint8Array?Uint8Array:Array,code='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',i=0,len=code.length;i<len;++i)lookup[i]=code[i],revLookup[code.charCodeAt(i)]=i;revLookup['-'.charCodeAt(0)]=62,revLookup['_'.charCodeAt(0)]=63;
},{}],56:[function (require,module,exports){
  function mapArrayBufferViews(r){
    return r.map(function (r){
      if(r.buffer instanceof ArrayBuffer){
        var e=r.buffer;if(r.byteLength!==e.byteLength){
          var o=new Uint8Array(r.byteLength);o.set(new Uint8Array(e,r.byteOffset,r.byteLength)),e=o.buffer;
        }return e;
      }return r;
    });
  }function BlobBuilderConstructor(r,e){
    e=e||{};var o=new BlobBuilder;return mapArrayBufferViews(r).forEach(function (r){
      o.append(r);
    }),e.type?o.getBlob(e.type):o.getBlob();
  }function BlobConstructor(r,e){
    return new Blob(mapArrayBufferViews(r),e||{});
  }var BlobBuilder=void 0!==BlobBuilder?BlobBuilder:'undefined'!=typeof WebKitBlobBuilder?WebKitBlobBuilder:'undefined'!=typeof MSBlobBuilder?MSBlobBuilder:'undefined'!=typeof MozBlobBuilder&&MozBlobBuilder,blobSupported=function (){
      try{
        return 2===new Blob(['hi']).size;
      }catch(r){
        return!1;
      }
    }(),blobSupportsArrayBufferView=blobSupported&&function (){
      try{
        return 2===new Blob([new Uint8Array([1,2])]).size;
      }catch(r){
        return!1;
      }
    }(),blobBuilderSupported=BlobBuilder&&BlobBuilder.prototype.append&&BlobBuilder.prototype.getBlob;'undefined'!=typeof Blob&&(BlobBuilderConstructor.prototype=Blob.prototype,BlobConstructor.prototype=Blob.prototype),module.exports=function (){
    return blobSupported?blobSupportsArrayBufferView?Blob:BlobConstructor:blobBuilderSupported?BlobBuilderConstructor:void 0;
  }();
},{}],57:[function (require,module,exports){

},{}],58:[function (require,module,exports){
  (function (Buffer){
    'use strict';function typedArraySupport(){
      try{
        var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function (){
          return 42;
        }},42===e.foo();
      }catch(e){
        return!1;
      }
    }function createBuffer(e){
      if(e>K_MAX_LENGTH)throw new RangeError(`The value "${e}" is invalid for option "size"`);var t=new Uint8Array(e);return t.__proto__=Buffer.prototype,t;
    }function Buffer(e,t,r){
      if('number'==typeof e){
        if('string'==typeof t)throw new TypeError('The "string" argument must be of type string. Received type number');return allocUnsafe(e);
      }return from(e,t,r);
    }function from(e,t,r){
      if('string'==typeof e)return fromString(e,t);if(ArrayBuffer.isView(e))return fromArrayLike(e);if(null==e)throw TypeError(`The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ${typeof e}`);if(isInstance(e,ArrayBuffer)||e&&isInstance(e.buffer,ArrayBuffer))return fromArrayBuffer(e,t,r);if('number'==typeof e)throw new TypeError('The "value" argument must not be of type number. Received type number');var n=e.valueOf&&e.valueOf();if(null!=n&&n!==e)return Buffer.from(n,t,r);var f=fromObject(e);if(f)return f;if('undefined'!=typeof Symbol&&null!=Symbol.toPrimitive&&'function'==typeof e[Symbol.toPrimitive])return Buffer.from(e[Symbol.toPrimitive]('string'),t,r);throw new TypeError(`The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ${typeof e}`);
    }function assertSize(e){
      if('number'!=typeof e)throw new TypeError('"size" argument must be of type number');if(e<0)throw new RangeError(`The value "${e}" is invalid for option "size"`);
    }function alloc(e,t,r){
      return assertSize(e),e<=0?createBuffer(e):void 0!==t?'string'==typeof r?createBuffer(e).fill(t,r):createBuffer(e).fill(t):createBuffer(e);
    }function allocUnsafe(e){
      return assertSize(e),createBuffer(e<0?0:0|checked(e));
    }function fromString(e,t){
      if('string'==typeof t&&''!==t||(t='utf8'),!Buffer.isEncoding(t))throw new TypeError(`Unknown encoding: ${t}`);var r=0|byteLength(e,t),n=createBuffer(r),f=n.write(e,t);return f!==r&&(n=n.slice(0,f)),n;
    }function fromArrayLike(e){
      for(var t=e.length<0?0:0|checked(e.length),r=createBuffer(t),n=0;n<t;n+=1)r[n]=255&e[n];return r;
    }function fromArrayBuffer(e,t,r){
      if(t<0||e.byteLength<t)throw new RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw new RangeError('"length" is outside of buffer bounds');var n;return n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),n.__proto__=Buffer.prototype,n;
    }function fromObject(e){
      if(Buffer.isBuffer(e)){
        var t=0|checked(e.length),r=createBuffer(t);return 0===r.length?r:(e.copy(r,0,0,t),r);
      }return void 0!==e.length?'number'!=typeof e.length||numberIsNaN(e.length)?createBuffer(0):fromArrayLike(e):'Buffer'===e.type&&Array.isArray(e.data)?fromArrayLike(e.data):void 0;
    }function checked(e){
      if(e>=K_MAX_LENGTH)throw new RangeError(`Attempt to allocate Buffer larger than maximum size: 0x${K_MAX_LENGTH.toString(16)} bytes`);return 0|e;
    }function SlowBuffer(e){
      return+e!=e&&(e=0),Buffer.alloc(+e);
    }function byteLength(e,t){
      if(Buffer.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||isInstance(e,ArrayBuffer))return e.byteLength;if('string'!=typeof e)throw new TypeError(`The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ${typeof e}`);var r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;for(var f=!1;;)switch(t){
      case'ascii':case'latin1':case'binary':return r;case'utf8':case'utf-8':return utf8ToBytes(e).length;case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return 2*r;case'hex':return r>>>1;case'base64':return base64ToBytes(e).length;default:if(f)return n?-1:utf8ToBytes(e).length;t=(`${t}`).toLowerCase(),f=!0;
        }
    }function slowToString(e,t,r){
      var n=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return'';if((void 0===r||r>this.length)&&(r=this.length),r<=0)return'';if(r>>>=0,t>>>=0,r<=t)return'';for(e||(e='utf8');;)switch(e){
      case'hex':return hexSlice(this,t,r);case'utf8':case'utf-8':return utf8Slice(this,t,r);case'ascii':return asciiSlice(this,t,r);case'latin1':case'binary':return latin1Slice(this,t,r);case'base64':return base64Slice(this,t,r);case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return utf16leSlice(this,t,r);default:if(n)throw new TypeError(`Unknown encoding: ${e}`);e=(`${e}`).toLowerCase(),n=!0;
        }
    }function swap(e,t,r){
      var n=e[t];e[t]=e[r],e[r]=n;
    }function bidirectionalIndexOf(e,t,r,n,f){
      if(0===e.length)return-1;if('string'==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,numberIsNaN(r)&&(r=f?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){
        if(f)return-1;r=e.length-1;
      }else if(r<0){
        if(!f)return-1;r=0;
      }if('string'==typeof t&&(t=Buffer.from(t,n)),Buffer.isBuffer(t))return 0===t.length?-1:arrayIndexOf(e,t,r,n,f);if('number'==typeof t)return t&=255,'function'==typeof Uint8Array.prototype.indexOf?f?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):arrayIndexOf(e,[t],r,n,f);throw new TypeError('val must be string, number or Buffer');
    }function arrayIndexOf(e,t,r,n,f){
      function i(e,t){
        return 1===o?e[t]:e.readUInt16BE(t*o);
      }var o=1,u=e.length,s=t.length;if(void 0!==n&&('ucs2'===(n=String(n).toLowerCase())||'ucs-2'===n||'utf16le'===n||'utf-16le'===n)){
        if(e.length<2||t.length<2)return-1;o=2,u/=2,s/=2,r/=2;
      }var a;if(f){
        var h=-1;for(a=r;a<u;a++)if(i(e,a)===i(t,-1===h?0:a-h)){
          if(-1===h&&(h=a),a-h+1===s)return h*o;
        }else-1!==h&&(a-=a-h),h=-1;
      }else for(r+s>u&&(r=u-s),a=r;a>=0;a--){
        for(var c=!0,l=0;l<s;l++)if(i(e,a+l)!==i(t,l)){
          c=!1;break;
        }if(c)return a;
      }return-1;
    }function hexWrite(e,t,r,n){
      r=Number(r)||0;var f=e.length-r;n?(n=Number(n))>f&&(n=f):n=f;var i=t.length;n>i/2&&(n=i/2);for(var o=0;o<n;++o){
        var u=parseInt(t.substr(2*o,2),16);if(numberIsNaN(u))return o;e[r+o]=u;
      }return o;
    }function utf8Write(e,t,r,n){
      return blitBuffer(utf8ToBytes(t,e.length-r),e,r,n);
    }function asciiWrite(e,t,r,n){
      return blitBuffer(asciiToBytes(t),e,r,n);
    }function latin1Write(e,t,r,n){
      return asciiWrite(e,t,r,n);
    }function base64Write(e,t,r,n){
      return blitBuffer(base64ToBytes(t),e,r,n);
    }function ucs2Write(e,t,r,n){
      return blitBuffer(utf16leToBytes(t,e.length-r),e,r,n);
    }function base64Slice(e,t,r){
      return 0===t&&r===e.length?base64.fromByteArray(e):base64.fromByteArray(e.slice(t,r));
    }function utf8Slice(e,t,r){
      r=Math.min(e.length,r);for(var n=[],f=t;f<r;){
        var i=e[f],o=null,u=i>239?4:i>223?3:i>191?2:1;if(f+u<=r){
          var s,a,h,c;switch(u){
          case 1:i<128&&(o=i);break;case 2:s=e[f+1],128==(192&s)&&(c=(31&i)<<6|63&s)>127&&(o=c);break;case 3:s=e[f+1],a=e[f+2],128==(192&s)&&128==(192&a)&&(c=(15&i)<<12|(63&s)<<6|63&a)>2047&&(c<55296||c>57343)&&(o=c);break;case 4:s=e[f+1],a=e[f+2],h=e[f+3],128==(192&s)&&128==(192&a)&&128==(192&h)&&(c=(15&i)<<18|(63&s)<<12|(63&a)<<6|63&h)>65535&&c<1114112&&(o=c);
          }
        }null===o?(o=65533,u=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),f+=u;
      }return decodeCodePointsArray(n);
    }function decodeCodePointsArray(e){
      var t=e.length;if(t<=MAX_ARGUMENTS_LENGTH)return String.fromCharCode.apply(String,e);for(var r='',n=0;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=MAX_ARGUMENTS_LENGTH));return r;
    }function asciiSlice(e,t,r){
      var n='';r=Math.min(e.length,r);for(var f=t;f<r;++f)n+=String.fromCharCode(127&e[f]);return n;
    }function latin1Slice(e,t,r){
      var n='';r=Math.min(e.length,r);for(var f=t;f<r;++f)n+=String.fromCharCode(e[f]);return n;
    }function hexSlice(e,t,r){
      var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var f='',i=t;i<r;++i)f+=toHex(e[i]);return f;
    }function utf16leSlice(e,t,r){
      for(var n=e.slice(t,r),f='',i=0;i<n.length;i+=2)f+=String.fromCharCode(n[i]+256*n[i+1]);return f;
    }function checkOffset(e,t,r){
      if(e%1!=0||e<0)throw new RangeError('offset is not uint');if(e+t>r)throw new RangeError('Trying to access beyond buffer length');
    }function checkInt(e,t,r,n,f,i){
      if(!Buffer.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>f||t<i)throw new RangeError('"value" argument is out of bounds');if(r+n>e.length)throw new RangeError('Index out of range');
    }function checkIEEE754(e,t,r,n,f,i){
      if(r+n>e.length)throw new RangeError('Index out of range');if(r<0)throw new RangeError('Index out of range');
    }function writeFloat(e,t,r,n,f){
      return t=+t,r>>>=0,f||checkIEEE754(e,t,r,4,3.4028234663852886e38,-3.4028234663852886e38),ieee754.write(e,t,r,n,23,4),r+4;
    }function writeDouble(e,t,r,n,f){
      return t=+t,r>>>=0,f||checkIEEE754(e,t,r,8,1.7976931348623157e308,-1.7976931348623157e308),ieee754.write(e,t,r,n,52,8),r+8;
    }function base64clean(e){
      if(e=e.split('=')[0],e=e.trim().replace(INVALID_BASE64_RE,''),e.length<2)return'';for(;e.length%4!=0;)e+='=';return e;
    }function toHex(e){
      return e<16?`0${e.toString(16)}`:e.toString(16);
    }function utf8ToBytes(e,t){
      t=t||1/0;for(var r,n=e.length,f=null,i=[],o=0;o<n;++o){
        if((r=e.charCodeAt(o))>55295&&r<57344){
          if(!f){
            if(r>56319){
              (t-=3)>-1&&i.push(239,191,189);continue;
            }if(o+1===n){
              (t-=3)>-1&&i.push(239,191,189);continue;
            }f=r;continue;
          }if(r<56320){
            (t-=3)>-1&&i.push(239,191,189),f=r;continue;
          }r=65536+(f-55296<<10|r-56320);
        }else f&&(t-=3)>-1&&i.push(239,191,189);if(f=null,r<128){
          if((t-=1)<0)break;i.push(r);
        }else if(r<2048){
          if((t-=2)<0)break;i.push(r>>6|192,63&r|128);
        }else if(r<65536){
          if((t-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128);
        }else{
          if(!(r<1114112))throw new Error('Invalid code point');if((t-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128);
        }
      }return i;
    }function asciiToBytes(e){
      for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t;
    }function utf16leToBytes(e,t){
      for(var r,n,f,i=[],o=0;o<e.length&&!((t-=2)<0);++o)r=e.charCodeAt(o),n=r>>8,f=r%256,i.push(f),i.push(n);return i;
    }function base64ToBytes(e){
      return base64.toByteArray(base64clean(e));
    }function blitBuffer(e,t,r,n){
      for(var f=0;f<n&&!(f+r>=t.length||f>=e.length);++f)t[f+r]=e[f];return f;
    }function isInstance(e,t){
      return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name;
    }function numberIsNaN(e){
      return e!==e;
    }var base64=require('base64-js'),ieee754=require('ieee754');exports.Buffer=Buffer,exports.SlowBuffer=SlowBuffer,exports.INSPECT_MAX_BYTES=50;var K_MAX_LENGTH=2147483647;exports.kMaxLength=K_MAX_LENGTH,Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport(),Buffer.TYPED_ARRAY_SUPPORT||'undefined'==typeof console||'function'!=typeof console.error||console.error('This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.'),Object.defineProperty(Buffer.prototype,'parent',{enumerable:!0,get:function (){
      if(Buffer.isBuffer(this))return this.buffer;
    }}),Object.defineProperty(Buffer.prototype,'offset',{enumerable:!0,get:function (){
      if(Buffer.isBuffer(this))return this.byteOffset;
    }}),'undefined'!=typeof Symbol&&null!=Symbol.species&&Buffer[Symbol.species]===Buffer&&Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0,enumerable:!1,writable:!1}),Buffer.poolSize=8192,Buffer.from=function (e,t,r){
      return from(e,t,r);
    },Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array,Buffer.alloc=function (e,t,r){
      return alloc(e,t,r);
    },Buffer.allocUnsafe=function (e){
      return allocUnsafe(e);
    },Buffer.allocUnsafeSlow=function (e){
      return allocUnsafe(e);
    },Buffer.isBuffer=function (e){
      return null!=e&&!0===e._isBuffer&&e!==Buffer.prototype;
    },Buffer.compare=function (e,t){
      if(isInstance(e,Uint8Array)&&(e=Buffer.from(e,e.offset,e.byteLength)),isInstance(t,Uint8Array)&&(t=Buffer.from(t,t.offset,t.byteLength)),!Buffer.isBuffer(e)||!Buffer.isBuffer(t))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;for(var r=e.length,n=t.length,f=0,i=Math.min(r,n);f<i;++f)if(e[f]!==t[f]){
        r=e[f],n=t[f];break;
      }return r<n?-1:n<r?1:0;
    },Buffer.isEncoding=function (e){
      switch(String(e).toLowerCase()){
      case'hex':case'utf8':case'utf-8':case'ascii':case'latin1':case'binary':case'base64':case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return!0;default:return!1;
      }
    },Buffer.concat=function (e,t){
      if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return Buffer.alloc(0);var r;if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;var n=Buffer.allocUnsafe(t),f=0;for(r=0;r<e.length;++r){
        var i=e[r];if(isInstance(i,Uint8Array)&&(i=Buffer.from(i)),!Buffer.isBuffer(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(n,f),f+=i.length;
      }return n;
    },Buffer.byteLength=byteLength,Buffer.prototype._isBuffer=!0,Buffer.prototype.swap16=function (){
      var e=this.length;if(e%2!=0)throw new RangeError('Buffer size must be a multiple of 16-bits');for(var t=0;t<e;t+=2)swap(this,t,t+1);return this;
    },Buffer.prototype.swap32=function (){
      var e=this.length;if(e%4!=0)throw new RangeError('Buffer size must be a multiple of 32-bits');for(var t=0;t<e;t+=4)swap(this,t,t+3),swap(this,t+1,t+2);return this;
    },Buffer.prototype.swap64=function (){
      var e=this.length;if(e%8!=0)throw new RangeError('Buffer size must be a multiple of 64-bits');for(var t=0;t<e;t+=8)swap(this,t,t+7),swap(this,t+1,t+6),swap(this,t+2,t+5),swap(this,t+3,t+4);return this;
    },Buffer.prototype.toString=function (){
      var e=this.length;return 0===e?'':0===arguments.length?utf8Slice(this,0,e):slowToString.apply(this,arguments);
    },Buffer.prototype.toLocaleString=Buffer.prototype.toString,Buffer.prototype.equals=function (e){
      if(!Buffer.isBuffer(e))throw new TypeError('Argument must be a Buffer');return this===e||0===Buffer.compare(this,e);
    },Buffer.prototype.inspect=function (){
      var e='',t=exports.INSPECT_MAX_BYTES;return e=this.toString('hex',0,t).replace(/(.{2})/g,'$1 ').trim(),this.length>t&&(e+=' ... '),`<Buffer ${e}>`;
    },Buffer.prototype.compare=function (e,t,r,n,f){
      if(isInstance(e,Uint8Array)&&(e=Buffer.from(e,e.offset,e.byteLength)),!Buffer.isBuffer(e))throw new TypeError(`The "target" argument must be one of type Buffer or Uint8Array. Received type ${typeof e}`);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===f&&(f=this.length),t<0||r>e.length||n<0||f>this.length)throw new RangeError('out of range index');if(n>=f&&t>=r)return 0;if(n>=f)return-1;if(t>=r)return 1;if(t>>>=0,r>>>=0,n>>>=0,f>>>=0,this===e)return 0;for(var i=f-n,o=r-t,u=Math.min(i,o),s=this.slice(n,f),a=e.slice(t,r),h=0;h<u;++h)if(s[h]!==a[h]){
        i=s[h],o=a[h];break;
      }return i<o?-1:o<i?1:0;
    },Buffer.prototype.includes=function (e,t,r){
      return-1!==this.indexOf(e,t,r);
    },Buffer.prototype.indexOf=function (e,t,r){
      return bidirectionalIndexOf(this,e,t,r,!0);
    },Buffer.prototype.lastIndexOf=function (e,t,r){
      return bidirectionalIndexOf(this,e,t,r,!1);
    },Buffer.prototype.write=function (e,t,r,n){
      if(void 0===t)n='utf8',r=this.length,t=0;else if(void 0===r&&'string'==typeof t)n=t,r=this.length,t=0;else{
        if(!isFinite(t))throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n='utf8')):(n=r,r=void 0);
      }var f=this.length-t;if((void 0===r||r>f)&&(r=f),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError('Attempt to write outside buffer bounds');n||(n='utf8');for(var i=!1;;)switch(n){
      case'hex':return hexWrite(this,e,t,r);case'utf8':case'utf-8':return utf8Write(this,e,t,r);case'ascii':return asciiWrite(this,e,t,r);case'latin1':case'binary':return latin1Write(this,e,t,r);case'base64':return base64Write(this,e,t,r);case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return ucs2Write(this,e,t,r);default:if(i)throw new TypeError(`Unknown encoding: ${n}`);n=(`${n}`).toLowerCase(),i=!0;
        }
    },Buffer.prototype.toJSON=function (){
      return{type:'Buffer',data:Array.prototype.slice.call(this._arr||this,0)};
    };var MAX_ARGUMENTS_LENGTH=4096;Buffer.prototype.slice=function (e,t){
      var r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var n=this.subarray(e,t);return n.__proto__=Buffer.prototype,n;
    },Buffer.prototype.readUIntLE=function (e,t,r){
      e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e],f=1,i=0;++i<t&&(f*=256);)n+=this[e+i]*f;return n;
    },Buffer.prototype.readUIntBE=function (e,t,r){
      e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e+--t],f=1;t>0&&(f*=256);)n+=this[e+--t]*f;return n;
    },Buffer.prototype.readUInt8=function (e,t){
      return e>>>=0,t||checkOffset(e,1,this.length),this[e];
    },Buffer.prototype.readUInt16LE=function (e,t){
      return e>>>=0,t||checkOffset(e,2,this.length),this[e]|this[e+1]<<8;
    },Buffer.prototype.readUInt16BE=function (e,t){
      return e>>>=0,t||checkOffset(e,2,this.length),this[e]<<8|this[e+1];
    },Buffer.prototype.readUInt32LE=function (e,t){
      return e>>>=0,t||checkOffset(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3];
    },Buffer.prototype.readUInt32BE=function (e,t){
      return e>>>=0,t||checkOffset(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3]);
    },Buffer.prototype.readIntLE=function (e,t,r){
      e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e],f=1,i=0;++i<t&&(f*=256);)n+=this[e+i]*f;return f*=128,n>=f&&(n-=Math.pow(2,8*t)),n;
    },Buffer.prototype.readIntBE=function (e,t,r){
      e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=t,f=1,i=this[e+--n];n>0&&(f*=256);)i+=this[e+--n]*f;return f*=128,i>=f&&(i-=Math.pow(2,8*t)),i;
    },Buffer.prototype.readInt8=function (e,t){
      return e>>>=0,t||checkOffset(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e];
    },Buffer.prototype.readInt16LE=function (e,t){
      e>>>=0,t||checkOffset(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r;
    },Buffer.prototype.readInt16BE=function (e,t){
      e>>>=0,t||checkOffset(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r;
    },Buffer.prototype.readInt32LE=function (e,t){
      return e>>>=0,t||checkOffset(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24;
    },Buffer.prototype.readInt32BE=function (e,t){
      return e>>>=0,t||checkOffset(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3];
    },Buffer.prototype.readFloatLE=function (e,t){
      return e>>>=0,t||checkOffset(e,4,this.length),ieee754.read(this,e,!0,23,4);
    },Buffer.prototype.readFloatBE=function (e,t){
      return e>>>=0,t||checkOffset(e,4,this.length),ieee754.read(this,e,!1,23,4);
    },Buffer.prototype.readDoubleLE=function (e,t){
      return e>>>=0,t||checkOffset(e,8,this.length),ieee754.read(this,e,!0,52,8);
    },Buffer.prototype.readDoubleBE=function (e,t){
      return e>>>=0,t||checkOffset(e,8,this.length),ieee754.read(this,e,!1,52,8);
    },Buffer.prototype.writeUIntLE=function (e,t,r,n){
      if(e=+e,t>>>=0,r>>>=0,!n){
        checkInt(this,e,t,r,Math.pow(2,8*r)-1,0);
      }var f=1,i=0;for(this[t]=255&e;++i<r&&(f*=256);)this[t+i]=e/f&255;return t+r;
    },Buffer.prototype.writeUIntBE=function (e,t,r,n){
      if(e=+e,t>>>=0,r>>>=0,!n){
        checkInt(this,e,t,r,Math.pow(2,8*r)-1,0);
      }var f=r-1,i=1;for(this[t+f]=255&e;--f>=0&&(i*=256);)this[t+f]=e/i&255;return t+r;
    },Buffer.prototype.writeUInt8=function (e,t,r){
      return e=+e,t>>>=0,r||checkInt(this,e,t,1,255,0),this[t]=255&e,t+1;
    },Buffer.prototype.writeUInt16LE=function (e,t,r){
      return e=+e,t>>>=0,r||checkInt(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2;
    },Buffer.prototype.writeUInt16BE=function (e,t,r){
      return e=+e,t>>>=0,r||checkInt(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2;
    },Buffer.prototype.writeUInt32LE=function (e,t,r){
      return e=+e,t>>>=0,r||checkInt(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4;
    },Buffer.prototype.writeUInt32BE=function (e,t,r){
      return e=+e,t>>>=0,r||checkInt(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4;
    },Buffer.prototype.writeIntLE=function (e,t,r,n){
      if(e=+e,t>>>=0,!n){
        var f=Math.pow(2,8*r-1);checkInt(this,e,t,r,f-1,-f);
      }var i=0,o=1,u=0;for(this[t]=255&e;++i<r&&(o*=256);)e<0&&0===u&&0!==this[t+i-1]&&(u=1),this[t+i]=(e/o>>0)-u&255;return t+r;
    },Buffer.prototype.writeIntBE=function (e,t,r,n){
      if(e=+e,t>>>=0,!n){
        var f=Math.pow(2,8*r-1);checkInt(this,e,t,r,f-1,-f);
      }var i=r-1,o=1,u=0;for(this[t+i]=255&e;--i>=0&&(o*=256);)e<0&&0===u&&0!==this[t+i+1]&&(u=1),this[t+i]=(e/o>>0)-u&255;return t+r;
    },Buffer.prototype.writeInt8=function (e,t,r){
      return e=+e,t>>>=0,r||checkInt(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1;
    },Buffer.prototype.writeInt16LE=function (e,t,r){
      return e=+e,t>>>=0,r||checkInt(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2;
    },Buffer.prototype.writeInt16BE=function (e,t,r){
      return e=+e,t>>>=0,r||checkInt(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2;
    },Buffer.prototype.writeInt32LE=function (e,t,r){
      return e=+e,t>>>=0,r||checkInt(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4;
    },Buffer.prototype.writeInt32BE=function (e,t,r){
      return e=+e,t>>>=0,r||checkInt(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4;
    },Buffer.prototype.writeFloatLE=function (e,t,r){
      return writeFloat(this,e,t,!0,r);
    },Buffer.prototype.writeFloatBE=function (e,t,r){
      return writeFloat(this,e,t,!1,r);
    },Buffer.prototype.writeDoubleLE=function (e,t,r){
      return writeDouble(this,e,t,!0,r);
    },Buffer.prototype.writeDoubleBE=function (e,t,r){
      return writeDouble(this,e,t,!1,r);
    },Buffer.prototype.copy=function (e,t,r,n){
      if(!Buffer.isBuffer(e))throw new TypeError('argument should be a Buffer');if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError('targetStart out of bounds');if(r<0||r>=this.length)throw new RangeError('Index out of range');if(n<0)throw new RangeError('sourceEnd out of bounds');n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var f=n-r;if(this===e&&'function'==typeof Uint8Array.prototype.copyWithin)this.copyWithin(t,r,n);else if(this===e&&r<t&&t<n)for(var i=f-1;i>=0;--i)e[i+t]=this[i+r];else Uint8Array.prototype.set.call(e,this.subarray(r,n),t);return f;
    },Buffer.prototype.fill=function (e,t,r,n){
      if('string'==typeof e){
        if('string'==typeof t?(n=t,t=0,r=this.length):'string'==typeof r&&(n=r,r=this.length),void 0!==n&&'string'!=typeof n)throw new TypeError('encoding must be a string');if('string'==typeof n&&!Buffer.isEncoding(n))throw new TypeError(`Unknown encoding: ${n}`);if(1===e.length){
          var f=e.charCodeAt(0);('utf8'===n&&f<128||'latin1'===n)&&(e=f);
        }
      }else'number'==typeof e&&(e&=255);if(t<0||this.length<t||this.length<r)throw new RangeError('Out of range index');if(r<=t)return this;t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0);var i;if('number'==typeof e)for(i=t;i<r;++i)this[i]=e;else{
        var o=Buffer.isBuffer(e)?e:Buffer.from(e,n),u=o.length;if(0===u)throw new TypeError(`The value "${e}" is invalid for argument "value"`);for(i=0;i<r-t;++i)this[i+t]=o[i%u];
      }return this;
    };var INVALID_BASE64_RE=/[^+/0-9A-Za-z-_]/g;
  }).call(this,require('buffer').Buffer);

},{'base64-js':55,'buffer':58,'ieee754':82}],59:[function (require,module,exports){
  var charenc={utf8:{stringToBytes:function (n){
    return charenc.bin.stringToBytes(unescape(encodeURIComponent(n)));
  },bytesToString:function (n){
    return decodeURIComponent(escape(charenc.bin.bytesToString(n)));
  }},bin:{stringToBytes:function (n){
    for(var e=[],r=0;r<n.length;r++)e.push(255&n.charCodeAt(r));return e;
  },bytesToString:function (n){
    for(var e=[],r=0;r<n.length;r++)e.push(String.fromCharCode(n[r]));return e.join('');
  }}};module.exports=charenc;
},{}],60:[function (require,module,exports){
  var slice=[].slice;module.exports=function (n,r){
    if('string'==typeof r&&(r=n[r]),'function'!=typeof r)throw new Error('bind() requires a function');var e=slice.call(arguments,2);return function (){
      return r.apply(n,e.concat(slice.call(arguments)));
    };
  };
},{}],61:[function (require,module,exports){
  function Emitter(t){
    if(t)return mixin(t);
  }function mixin(t){
    for(var e in Emitter.prototype)t[e]=Emitter.prototype[e];return t;
  }'undefined'!=typeof module&&(module.exports=Emitter),Emitter.prototype.on=Emitter.prototype.addEventListener=function (t,e){
    return this._callbacks=this._callbacks||{},(this._callbacks[`$${t}`]=this._callbacks[`$${t}`]||[]).push(e),this;
  },Emitter.prototype.once=function (t,e){
    function i(){
      this.off(t,i),e.apply(this,arguments);
    }return i.fn=e,this.on(t,i),this;
  },Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function (t,e){
    if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var i=this._callbacks[`$${t}`];if(!i)return this;if(1==arguments.length)return delete this._callbacks[`$${t}`],this;for(var r,s=0;s<i.length;s++)if((r=i[s])===e||r.fn===e){
      i.splice(s,1);break;
    }return this;
  },Emitter.prototype.emit=function (t){
    this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),i=this._callbacks[`$${t}`];if(i){
      i=i.slice(0);for(var r=0,s=i.length;r<s;++r)i[r].apply(this,e);
    }return this;
  },Emitter.prototype.listeners=function (t){
    return this._callbacks=this._callbacks||{},this._callbacks[`$${t}`]||[];
  },Emitter.prototype.hasListeners=function (t){
    return!!this.listeners(t).length;
  };
},{}],62:[function (require,module,exports){
  module.exports=function (o,t){
    var p=function (){};p.prototype=t.prototype,o.prototype=new p,o.prototype.constructor=o;
  };
},{}],63:[function (require,module,exports){
  !function (){
    var r='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',t={rotl:function (r,t){
      return r<<t|r>>>32-t;
    },rotr:function (r,t){
      return r<<32-t|r>>>t;
    },endian:function (r){
      if(r.constructor==Number)return 16711935&t.rotl(r,8)|4278255360&t.rotl(r,24);for(var n=0;n<r.length;n++)r[n]=t.endian(r[n]);return r;
    },randomBytes:function (r){
      for(var t=[];r>0;r--)t.push(Math.floor(256*Math.random()));return t;
    },bytesToWords:function (r){
      for(var t=[],n=0,o=0;n<r.length;n++,o+=8)t[o>>>5]|=r[n]<<24-o%32;return t;
    },wordsToBytes:function (r){
      for(var t=[],n=0;n<32*r.length;n+=8)t.push(r[n>>>5]>>>24-n%32&255);return t;
    },bytesToHex:function (r){
      for(var t=[],n=0;n<r.length;n++)t.push((r[n]>>>4).toString(16)),t.push((15&r[n]).toString(16));return t.join('');
    },hexToBytes:function (r){
      for(var t=[],n=0;n<r.length;n+=2)t.push(parseInt(r.substr(n,2),16));return t;
    },bytesToBase64:function (t){
      for(var n=[],o=0;o<t.length;o+=3)for(var e=t[o]<<16|t[o+1]<<8|t[o+2],u=0;u<4;u++)8*o+6*u<=8*t.length?n.push(r.charAt(e>>>6*(3-u)&63)):n.push('=');return n.join('');
    },base64ToBytes:function (t){
      t=t.replace(/[^A-Z0-9+\/]/gi,'');for(var n=[],o=0,e=0;o<t.length;e=++o%4)0!=e&&n.push((r.indexOf(t.charAt(o-1))&Math.pow(2,-2*e+8)-1)<<2*e|r.indexOf(t.charAt(o))>>>6-2*e);return n;
    }};module.exports=t;
  }();
},{}],64:[function (require,module,exports){
  module.exports=require('./socket'),module.exports.parser=require('engine.io-parser');
},{'./socket':65,'engine.io-parser':76}],65:[function (require,module,exports){
  function Socket(e,t){
    if(!(this instanceof Socket))return new Socket(e,t);t=t||{},e&&'object'==typeof e&&(t=e,e=null),e?(e=parseuri(e),t.hostname=e.host,t.secure='https'===e.protocol||'wss'===e.protocol,t.port=e.port,e.query&&(t.query=e.query)):t.host&&(t.hostname=parseuri(t.host).host),this.secure=null!=t.secure?t.secure:'undefined'!=typeof location&&'https:'===location.protocol,t.hostname&&!t.port&&(t.port=this.secure?'443':'80'),this.agent=t.agent||!1,this.hostname=t.hostname||('undefined'!=typeof location?location.hostname:'localhost'),this.port=t.port||('undefined'!=typeof location&&location.port?location.port:this.secure?443:80),this.query=t.query||{},'string'==typeof this.query&&(this.query=parseqs.decode(this.query)),this.upgrade=!1!==t.upgrade,this.path=`${(t.path||'/engine.io').replace(/\/$/,'')}/`,this.forceJSONP=!!t.forceJSONP,this.jsonp=!1!==t.jsonp,this.forceBase64=!!t.forceBase64,this.enablesXDR=!!t.enablesXDR,this.timestampParam=t.timestampParam||'t',this.timestampRequests=t.timestampRequests,this.transports=t.transports||['polling','websocket'],this.transportOptions=t.transportOptions||{},this.readyState='',this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=t.policyPort||843,this.rememberUpgrade=t.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=t.onlyBinaryUpgrades,this.perMessageDeflate=!1!==t.perMessageDeflate&&(t.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=t.pfx||null,this.key=t.key||null,this.passphrase=t.passphrase||null,this.cert=t.cert||null,this.ca=t.ca||null,this.ciphers=t.ciphers||null,this.rejectUnauthorized=void 0===t.rejectUnauthorized||t.rejectUnauthorized,this.forceNode=!!t.forceNode,this.isReactNative='undefined'!=typeof navigator&&'string'==typeof navigator.product&&'reactnative'===navigator.product.toLowerCase(),('undefined'==typeof self||this.isReactNative)&&(t.extraHeaders&&Object.keys(t.extraHeaders).length>0&&(this.extraHeaders=t.extraHeaders),t.localAddress&&(this.localAddress=t.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,this.open();
  }function clone(e){
    var t={};for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t;
  }var transports=require('./transports/index'),Emitter=require('component-emitter'),debug=require('debug')('engine.io-client:socket'),index=require('indexof'),parser=require('engine.io-parser'),parseuri=require('parseuri'),parseqs=require('parseqs');module.exports=Socket,Socket.priorWebsocketSuccess=!1,Emitter(Socket.prototype),Socket.protocol=parser.protocol,Socket.Socket=Socket,Socket.Transport=require('./transport'),Socket.transports=require('./transports/index'),Socket.parser=require('engine.io-parser'),Socket.prototype.createTransport=function (e){
    debug('creating transport "%s"',e);var t=clone(this.query);t.EIO=parser.protocol,t.transport=e;var r=this.transportOptions[e]||{};return this.id&&(t.sid=this.id),new transports[e]({query:t,socket:this,agent:r.agent||this.agent,hostname:r.hostname||this.hostname,port:r.port||this.port,secure:r.secure||this.secure,path:r.path||this.path,forceJSONP:r.forceJSONP||this.forceJSONP,jsonp:r.jsonp||this.jsonp,forceBase64:r.forceBase64||this.forceBase64,enablesXDR:r.enablesXDR||this.enablesXDR,timestampRequests:r.timestampRequests||this.timestampRequests,timestampParam:r.timestampParam||this.timestampParam,policyPort:r.policyPort||this.policyPort,pfx:r.pfx||this.pfx,key:r.key||this.key,passphrase:r.passphrase||this.passphrase,cert:r.cert||this.cert,ca:r.ca||this.ca,ciphers:r.ciphers||this.ciphers,rejectUnauthorized:r.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:r.perMessageDeflate||this.perMessageDeflate,extraHeaders:r.extraHeaders||this.extraHeaders,forceNode:r.forceNode||this.forceNode,localAddress:r.localAddress||this.localAddress,requestTimeout:r.requestTimeout||this.requestTimeout,protocols:r.protocols||void 0,isReactNative:this.isReactNative});
  },Socket.prototype.open=function (){
    var e;if(this.rememberUpgrade&&Socket.priorWebsocketSuccess&&-1!==this.transports.indexOf('websocket'))e='websocket';else{
      if(0===this.transports.length){
        var t=this;return void setTimeout(function (){
          t.emit('error','No transports available');
        },0);
      }e=this.transports[0];
    }this.readyState='opening';try{
      e=this.createTransport(e);
    }catch(e){
      return this.transports.shift(),void this.open();
    }e.open(),this.setTransport(e);
  },Socket.prototype.setTransport=function (e){
    debug('setting transport %s',e.name);var t=this;this.transport&&(debug('clearing existing transport %s',this.transport.name),this.transport.removeAllListeners()),this.transport=e,e.on('drain',function (){
      t.onDrain();
    }).on('packet',function (e){
      t.onPacket(e);
    }).on('error',function (e){
      t.onError(e);
    }).on('close',function (){
      t.onClose('transport close');
    });
  },Socket.prototype.probe=function (e){
    function t(){
      if(h.onlyBinaryUpgrades){
        var t=!this.supportsBinary&&h.transport.supportsBinary;c=c||t;
      }c||(debug('probe transport "%s" opened',e),p.send([{type:'ping',data:'probe'}]),p.once('packet',function (t){
        if(!c)if('pong'===t.type&&'probe'===t.data){
          if(debug('probe transport "%s" pong',e),h.upgrading=!0,h.emit('upgrading',p),!p)return;Socket.priorWebsocketSuccess='websocket'===p.name,debug('pausing current transport "%s"',h.transport.name),h.transport.pause(function (){
            c||'closed'!==h.readyState&&(debug('changing transport and sending upgrade packet'),a(),h.setTransport(p),p.send([{type:'upgrade'}]),h.emit('upgrade',p),p=null,h.upgrading=!1,h.flush());
          });
        }else{
          debug('probe transport "%s" failed',e);var r=new Error('probe error');r.transport=p.name,h.emit('upgradeError',r);
        }
      }));
    }function r(){
      c||(c=!0,a(),p.close(),p=null);
    }function s(t){
      var s=new Error(`probe error: ${t}`);s.transport=p.name,r(),debug('probe transport "%s" failed because of error: %s',e,t),h.emit('upgradeError',s);
    }function o(){
      s('transport closed');
    }function i(){
      s('socket closed');
    }function n(e){
      p&&e.name!==p.name&&(debug('"%s" works - aborting "%s"',e.name,p.name),r());
    }function a(){
      p.removeListener('open',t),p.removeListener('error',s),p.removeListener('close',o),h.removeListener('close',i),h.removeListener('upgrading',n);
    }debug('probing transport "%s"',e);var p=this.createTransport(e,{probe:1}),c=!1,h=this;Socket.priorWebsocketSuccess=!1,p.once('open',t),p.once('error',s),p.once('close',o),this.once('close',i),this.once('upgrading',n),p.open();
  },Socket.prototype.onOpen=function (){
    if(debug('socket open'),this.readyState='open',Socket.priorWebsocketSuccess='websocket'===this.transport.name,this.emit('open'),this.flush(),'open'===this.readyState&&this.upgrade&&this.transport.pause){
      debug('starting upgrade probes');for(var e=0,t=this.upgrades.length;e<t;e++)this.probe(this.upgrades[e]);
    }
  },Socket.prototype.onPacket=function (e){
    if('opening'===this.readyState||'open'===this.readyState||'closing'===this.readyState)switch(debug('socket receive: type "%s", data "%s"',e.type,e.data),this.emit('packet',e),this.emit('heartbeat'),e.type){
    case'open':this.onHandshake(JSON.parse(e.data));break;case'pong':this.setPing(),this.emit('pong');break;case'error':var t=new Error('server error');t.code=e.data,this.onError(t);break;case'message':this.emit('data',e.data),this.emit('message',e.data);
      }else debug('packet received with socket readyState "%s"',this.readyState);
  },Socket.prototype.onHandshake=function (e){
    this.emit('handshake',e),this.id=e.sid,this.transport.query.sid=e.sid,this.upgrades=this.filterUpgrades(e.upgrades),this.pingInterval=e.pingInterval,this.pingTimeout=e.pingTimeout,this.onOpen(),'closed'!==this.readyState&&(this.setPing(),this.removeListener('heartbeat',this.onHeartbeat),this.on('heartbeat',this.onHeartbeat));
  },Socket.prototype.onHeartbeat=function (e){
    clearTimeout(this.pingTimeoutTimer);var t=this;t.pingTimeoutTimer=setTimeout(function (){
      'closed'!==t.readyState&&t.onClose('ping timeout');
    },e||t.pingInterval+t.pingTimeout);
  },Socket.prototype.setPing=function (){
    var e=this;clearTimeout(e.pingIntervalTimer),e.pingIntervalTimer=setTimeout(function (){
      debug('writing ping packet - expecting pong within %sms',e.pingTimeout),e.ping(),e.onHeartbeat(e.pingTimeout);
    },e.pingInterval);
  },Socket.prototype.ping=function (){
    var e=this;this.sendPacket('ping',function (){
      e.emit('ping');
    });
  },Socket.prototype.onDrain=function (){
    this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit('drain'):this.flush();
  },Socket.prototype.flush=function (){
    'closed'!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(debug('flushing %d packets in socket',this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit('flush'));
  },Socket.prototype.write=Socket.prototype.send=function (e,t,r){
    return this.sendPacket('message',e,t,r),this;
  },Socket.prototype.sendPacket=function (e,t,r,s){
    if('function'==typeof t&&(s=t,t=void 0),'function'==typeof r&&(s=r,r=null),'closing'!==this.readyState&&'closed'!==this.readyState){
      r=r||{},r.compress=!1!==r.compress;var o={type:e,data:t,options:r};this.emit('packetCreate',o),this.writeBuffer.push(o),s&&this.once('flush',s),this.flush();
    }
  },Socket.prototype.close=function (){
    function e(){
      s.onClose('forced close'),debug('socket closing - telling transport to close'),s.transport.close();
    }function t(){
      s.removeListener('upgrade',t),s.removeListener('upgradeError',t),e();
    }function r(){
      s.once('upgrade',t),s.once('upgradeError',t);
    }if('opening'===this.readyState||'open'===this.readyState){
      this.readyState='closing';var s=this;this.writeBuffer.length?this.once('drain',function (){
        this.upgrading?r():e();
      }):this.upgrading?r():e();
    }return this;
  },Socket.prototype.onError=function (e){
    debug('socket error %j',e),Socket.priorWebsocketSuccess=!1,this.emit('error',e),this.onClose('transport error',e);
  },Socket.prototype.onClose=function (e,t){
    if('opening'===this.readyState||'open'===this.readyState||'closing'===this.readyState){
      debug('socket close with reason: "%s"',e);var r=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners('close'),this.transport.close(),this.transport.removeAllListeners(),this.readyState='closed',this.id=null,this.emit('close',e,t),r.writeBuffer=[],r.prevBufferLen=0;
    }
  },Socket.prototype.filterUpgrades=function (e){
    for(var t=[],r=0,s=e.length;r<s;r++)~index(this.transports,e[r])&&t.push(e[r]);return t;
  };
},{'./transport':66,'./transports/index':67,'component-emitter':61,'debug':73,'engine.io-parser':76,'indexof':83,'parseqs':88,'parseuri':89}],66:[function (require,module,exports){
  function Transport(t){
    this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState='',this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.isReactNative=t.isReactNative,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress;
  }var parser=require('engine.io-parser'),Emitter=require('component-emitter');module.exports=Transport,Emitter(Transport.prototype),Transport.prototype.onError=function (t,e){
    var r=new Error(t);return r.type='TransportError',r.description=e,this.emit('error',r),this;
  },Transport.prototype.open=function (){
    return'closed'!==this.readyState&&''!==this.readyState||(this.readyState='opening',this.doOpen()),this;
  },Transport.prototype.close=function (){
    return'opening'!==this.readyState&&'open'!==this.readyState||(this.doClose(),this.onClose()),this;
  },Transport.prototype.send=function (t){
    if('open'!==this.readyState)throw new Error('Transport not open');this.write(t);
  },Transport.prototype.onOpen=function (){
    this.readyState='open',this.writable=!0,this.emit('open');
  },Transport.prototype.onData=function (t){
    var e=parser.decodePacket(t,this.socket.binaryType);this.onPacket(e);
  },Transport.prototype.onPacket=function (t){
    this.emit('packet',t);
  },Transport.prototype.onClose=function (){
    this.readyState='closed',this.emit('close');
  };
},{'component-emitter':61,'engine.io-parser':76}],67:[function (require,module,exports){
  function polling(e){
    var o=!1,t=!1,r=!1!==e.jsonp;if('undefined'!=typeof location){
      var n='https:'===location.protocol,i=location.port;i||(i=n?443:80),o=e.hostname!==location.hostname||i!==e.port,t=e.secure!==n;
    }if(e.xdomain=o,e.xscheme=t,'open'in new XMLHttpRequest(e)&&!e.forceJSONP)return new XHR(e);if(!r)throw new Error('JSONP disabled');return new JSONP(e);
  }var XMLHttpRequest=require('xmlhttprequest-ssl'),XHR=require('./polling-xhr'),JSONP=require('./polling-jsonp'),websocket=require('./websocket');exports.polling=polling,exports.websocket=websocket;
},{'./polling-jsonp':68,'./polling-xhr':69,'./websocket':71,'xmlhttprequest-ssl':72}],68:[function (require,module,exports){
  (function (global){
    function empty(){}function glob(){
      return'undefined'!=typeof self?self:'undefined'!=typeof window?window:'undefined'!=typeof global?global:{};
    }function JSONPPolling(e){
      if(Polling.call(this,e),this.query=this.query||{},!callbacks){
        var t=glob();callbacks=t.___eio=t.___eio||[];
      }this.index=callbacks.length;var i=this;callbacks.push(function (e){
        i.onData(e);
      }),this.query.j=this.index,'function'==typeof addEventListener&&addEventListener('beforeunload',function (){
        i.script&&(i.script.onerror=empty);
      },!1);
    }var Polling=require('./polling'),inherit=require('component-inherit');module.exports=JSONPPolling;var rNewline=/\n/g,rEscapedNewline=/\\n/g,callbacks;inherit(JSONPPolling,Polling),JSONPPolling.prototype.supportsBinary=!1,JSONPPolling.prototype.doClose=function (){
      this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),Polling.prototype.doClose.call(this);
    },JSONPPolling.prototype.doPoll=function (){
      var e=this,t=document.createElement('script');this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),t.async=!0,t.src=this.uri(),t.onerror=function (t){
        e.onError('jsonp poll error',t);
      };var i=document.getElementsByTagName('script')[0];i?i.parentNode.insertBefore(t,i):(document.head||document.body).appendChild(t),this.script=t,'undefined'!=typeof navigator&&/gecko/i.test(navigator.userAgent)&&setTimeout(function (){
        var e=document.createElement('iframe');document.body.appendChild(e),document.body.removeChild(e);
      },100);
    },JSONPPolling.prototype.doWrite=function (e,t){
      function i(){
        r(),t();
      }function r(){
        if(o.iframe)try{
          o.form.removeChild(o.iframe);
        }catch(e){
            o.onError('jsonp polling iframe removal error',e);
          }try{
          var e=`<iframe src="javascript:0" name="${o.iframeId}">`;n=document.createElement(e);
        }catch(e){
          n=document.createElement('iframe'),n.name=o.iframeId,n.src='javascript:0';
        }n.id=o.iframeId,o.form.appendChild(n),o.iframe=n;
      }var o=this;if(!this.form){
        var n,a=document.createElement('form'),l=document.createElement('textarea'),s=this.iframeId=`eio_iframe_${this.index}`;a.className='socketio',a.style.position='absolute',a.style.top='-1000px',a.style.left='-1000px',a.target=s,a.method='POST',a.setAttribute('accept-charset','utf-8'),l.name='d',a.appendChild(l),document.body.appendChild(a),this.form=a,this.area=l;
      }this.form.action=this.uri(),r(),e=e.replace(rEscapedNewline,'\\\n'),this.area.value=e.replace(rNewline,'\\n');try{
        this.form.submit();
      }catch(e){}this.iframe.attachEvent?this.iframe.onreadystatechange=function (){
        'complete'===o.iframe.readyState&&i();
      }:this.iframe.onload=i;
    };
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'./polling':70,'component-inherit':62}],69:[function (require,module,exports){
  function empty(){}function XHR(t){
    if(Polling.call(this,t),this.requestTimeout=t.requestTimeout,this.extraHeaders=t.extraHeaders,'undefined'!=typeof location){
      var e='https:'===location.protocol,s=location.port;s||(s=e?443:80),this.xd='undefined'!=typeof location&&t.hostname!==location.hostname||s!==t.port,this.xs=t.secure!==e;
    }
  }function Request(t){
    this.method=t.method||'GET',this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create();
  }function unloadHandler(){
    for(var t in Request.requests)Request.requests.hasOwnProperty(t)&&Request.requests[t].abort();
  }var XMLHttpRequest=require('xmlhttprequest-ssl'),Polling=require('./polling'),Emitter=require('component-emitter'),inherit=require('component-inherit'),debug=require('debug')('engine.io-client:polling-xhr');if(module.exports=XHR,module.exports.Request=Request,inherit(XHR,Polling),XHR.prototype.supportsBinary=!0,XHR.prototype.request=function (t){
    return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new Request(t);
  },XHR.prototype.doWrite=function (t,e){
      var s='string'!=typeof t&&void 0!==t,r=this.request({method:'POST',data:t,isBinary:s}),i=this;r.on('success',e),r.on('error',function (t){
        i.onError('xhr post error',t);
      }),this.sendXhr=r;
    },XHR.prototype.doPoll=function (){
      debug('xhr poll');var t=this.request(),e=this;t.on('data',function (t){
        e.onData(t);
      }),t.on('error',function (t){
        e.onError('xhr poll error',t);
      }),this.pollXhr=t;
    },Emitter(Request.prototype),Request.prototype.create=function (){
      var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var e=this.xhr=new XMLHttpRequest(t),s=this;try{
        debug('xhr open %s: %s',this.method,this.uri),e.open(this.method,this.uri,this.async);try{
          if(this.extraHeaders){
            e.setDisableHeaderCheck&&e.setDisableHeaderCheck(!0);for(var r in this.extraHeaders)this.extraHeaders.hasOwnProperty(r)&&e.setRequestHeader(r,this.extraHeaders[r]);
          }
        }catch(t){}if('POST'===this.method)try{
          this.isBinary?e.setRequestHeader('Content-type','application/octet-stream'):e.setRequestHeader('Content-type','text/plain;charset=UTF-8');
        }catch(t){}try{
          e.setRequestHeader('Accept','*/*');
        }catch(t){}'withCredentials'in e&&(e.withCredentials=!0),this.requestTimeout&&(e.timeout=this.requestTimeout),this.hasXDR()?(e.onload=function (){
          s.onLoad();
        },e.onerror=function (){
            s.onError(e.responseText);
          }):e.onreadystatechange=function (){
          if(2===e.readyState)try{
            var t=e.getResponseHeader('Content-Type');s.supportsBinary&&'application/octet-stream'===t&&(e.responseType='arraybuffer');
          }catch(t){}4===e.readyState&&(200===e.status||1223===e.status?s.onLoad():setTimeout(function (){
            s.onError(e.status);
          },0));
        },debug('xhr data %s',this.data),e.send(this.data);
      }catch(t){
        return void setTimeout(function (){
          s.onError(t);
        },0);
      }'undefined'!=typeof document&&(this.index=Request.requestsCount++,Request.requests[this.index]=this);
    },Request.prototype.onSuccess=function (){
      this.emit('success'),this.cleanup();
    },Request.prototype.onData=function (t){
      this.emit('data',t),this.onSuccess();
    },Request.prototype.onError=function (t){
      this.emit('error',t),this.cleanup(!0);
    },Request.prototype.cleanup=function (t){
      if(void 0!==this.xhr&&null!==this.xhr){
        if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=empty:this.xhr.onreadystatechange=empty,t)try{
          this.xhr.abort();
        }catch(t){}'undefined'!=typeof document&&delete Request.requests[this.index],this.xhr=null;
      }
    },Request.prototype.onLoad=function (){
      var t;try{
        var e;try{
          e=this.xhr.getResponseHeader('Content-Type');
        }catch(t){}t='application/octet-stream'===e?this.xhr.response||this.xhr.responseText:this.xhr.responseText;
      }catch(t){
        this.onError(t);
      }null!=t&&this.onData(t);
    },Request.prototype.hasXDR=function (){
      return'undefined'!=typeof XDomainRequest&&!this.xs&&this.enablesXDR;
    },Request.prototype.abort=function (){
      this.cleanup();
    },Request.requestsCount=0,Request.requests={},'undefined'!=typeof document)if('function'==typeof attachEvent)attachEvent('onunload',unloadHandler);else if('function'==typeof addEventListener){
    var terminationEvent='onpagehide'in self?'pagehide':'unload';addEventListener(terminationEvent,unloadHandler,!1);
  }
},{'./polling':70,'component-emitter':61,'component-inherit':62,'debug':73,'xmlhttprequest-ssl':72}],70:[function (require,module,exports){
  function Polling(t){
    var e=t&&t.forceBase64;hasXHR2&&!e||(this.supportsBinary=!1),Transport.call(this,t);
  }var Transport=require('../transport'),parseqs=require('parseqs'),parser=require('engine.io-parser'),inherit=require('component-inherit'),yeast=require('yeast'),debug=require('debug')('engine.io-client:polling');module.exports=Polling;var hasXHR2=function (){
    return null!=new(require('xmlhttprequest-ssl'))({xdomain:!1}).responseType;
  }();inherit(Polling,Transport),Polling.prototype.name='polling',Polling.prototype.doOpen=function (){
    this.poll();
  },Polling.prototype.pause=function (t){
    function e(){
      debug('paused'),i.readyState='paused',t();
    }var i=this;if(this.readyState='pausing',this.polling||!this.writable){
      var o=0;this.polling&&(debug('we are currently polling - waiting to pause'),o++,this.once('pollComplete',function (){
        debug('pre-pause polling complete'),--o||e();
      })),this.writable||(debug('we are currently writing - waiting to pause'),o++,this.once('drain',function (){
        debug('pre-pause writing complete'),--o||e();
      }));
    }else e();
  },Polling.prototype.poll=function (){
    debug('polling'),this.polling=!0,this.doPoll(),this.emit('poll');
  },Polling.prototype.onData=function (t){
    var e=this;debug('polling got data %s',t);var i=function (t,i,o){
      if('opening'===e.readyState&&e.onOpen(),'close'===t.type)return e.onClose(),!1;e.onPacket(t);
    };parser.decodePayload(t,this.socket.binaryType,i),'closed'!==this.readyState&&(this.polling=!1,this.emit('pollComplete'),'open'===this.readyState?this.poll():debug('ignoring poll - transport state "%s"',this.readyState));
  },Polling.prototype.doClose=function (){
    function t(){
      debug('writing close packet'),e.write([{type:'close'}]);
    }var e=this;'open'===this.readyState?(debug('transport open - closing'),t()):(debug('transport not open - deferring close'),this.once('open',t));
  },Polling.prototype.write=function (t){
    var e=this;this.writable=!1;var i=function (){
      e.writable=!0,e.emit('drain');
    };parser.encodePayload(t,this.supportsBinary,function (t){
      e.doWrite(t,i);
    });
  },Polling.prototype.uri=function (){
    var t=this.query||{},e=this.secure?'https':'http',i='';return!1!==this.timestampRequests&&(t[this.timestampParam]=yeast()),this.supportsBinary||t.sid||(t.b64=1),t=parseqs.encode(t),this.port&&('https'===e&&443!==Number(this.port)||'http'===e&&80!==Number(this.port))&&(i=`:${this.port}`),t.length&&(t=`?${t}`),`${e}://${-1!==this.hostname.indexOf(':')?`[${this.hostname}]`:this.hostname}${i}${this.path}${t}`;
  };
},{'../transport':66,'component-inherit':62,'debug':73,'engine.io-parser':76,'parseqs':88,'xmlhttprequest-ssl':72,'yeast':109}],71:[function (require,module,exports){
  (function (Buffer){
    function WS(e){
      e&&e.forceBase64&&(this.supportsBinary=!1),this.perMessageDeflate=e.perMessageDeflate,this.usingBrowserWebSocket=BrowserWebSocket&&!e.forceNode,this.protocols=e.protocols,this.usingBrowserWebSocket||(WebSocketImpl=NodeWebSocket),Transport.call(this,e);
    }var Transport=require('../transport'),parser=require('engine.io-parser'),parseqs=require('parseqs'),inherit=require('component-inherit'),yeast=require('yeast'),debug=require('debug')('engine.io-client:websocket'),BrowserWebSocket,NodeWebSocket;if('undefined'!=typeof WebSocket)BrowserWebSocket=WebSocket;else if('undefined'!=typeof self)BrowserWebSocket=self.WebSocket||self.MozWebSocket;else try{
      NodeWebSocket=require('ws');
    }catch(e){}var WebSocketImpl=BrowserWebSocket||NodeWebSocket;module.exports=WS,inherit(WS,Transport),WS.prototype.name='websocket',WS.prototype.supportsBinary=!0,WS.prototype.doOpen=function (){
      if(this.check()){
        var e=this.uri(),t=this.protocols,s={agent:this.agent,perMessageDeflate:this.perMessageDeflate};s.pfx=this.pfx,s.key=this.key,s.passphrase=this.passphrase,s.cert=this.cert,s.ca=this.ca,s.ciphers=this.ciphers,s.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(s.headers=this.extraHeaders),this.localAddress&&(s.localAddress=this.localAddress);try{
          this.ws=this.usingBrowserWebSocket&&!this.isReactNative?t?new WebSocketImpl(e,t):new WebSocketImpl(e):new WebSocketImpl(e,t,s);
        }catch(e){
          return this.emit('error',e);
        }void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType='nodebuffer'):this.ws.binaryType='arraybuffer',this.addEventListeners();
      }
    },WS.prototype.addEventListeners=function (){
      var e=this;this.ws.onopen=function (){
        e.onOpen();
      },this.ws.onclose=function (){
        e.onClose();
      },this.ws.onmessage=function (t){
        e.onData(t.data);
      },this.ws.onerror=function (t){
        e.onError('websocket error',t);
      };
    },WS.prototype.write=function (e){
      function t(){
        s.emit('flush'),setTimeout(function (){
          s.writable=!0,s.emit('drain');
        },0);
      }var s=this;this.writable=!1;for(var r=e.length,o=0,i=r;o<i;o++)!function (e){
        parser.encodePacket(e,s.supportsBinary,function (o){
          if(!s.usingBrowserWebSocket){
            var i={};if(e.options&&(i.compress=e.options.compress),s.perMessageDeflate){
              ('string'==typeof o?Buffer.byteLength(o):o.length)<s.perMessageDeflate.threshold&&(i.compress=!1);
            }
          }try{
            s.usingBrowserWebSocket?s.ws.send(o):s.ws.send(o,i);
          }catch(e){
            debug('websocket closed before onclose event');
          }--r||t();
        });
      }(e[o]);
    },WS.prototype.onClose=function (){
      Transport.prototype.onClose.call(this);
    },WS.prototype.doClose=function (){
      void 0!==this.ws&&this.ws.close();
    },WS.prototype.uri=function (){
      var e=this.query||{},t=this.secure?'wss':'ws',s='';return this.port&&('wss'===t&&443!==Number(this.port)||'ws'===t&&80!==Number(this.port))&&(s=`:${this.port}`),this.timestampRequests&&(e[this.timestampParam]=yeast()),this.supportsBinary||(e.b64=1),e=parseqs.encode(e),e.length&&(e=`?${e}`),`${t}://${-1!==this.hostname.indexOf(':')?`[${this.hostname}]`:this.hostname}${s}${this.path}${e}`;
    },WS.prototype.check=function (){
      return!(!WebSocketImpl||'__initialize'in WebSocketImpl&&this.name===WS.prototype.name);
    };
  }).call(this,require('buffer').Buffer);

},{'../transport':66,'buffer':58,'component-inherit':62,'debug':73,'engine.io-parser':76,'parseqs':88,'ws':57,'yeast':109}],72:[function (require,module,exports){
  var hasCORS=require('has-cors');module.exports=function (e){
    var t=e.xdomain,n=e.xscheme,r=e.enablesXDR;try{
      if('undefined'!=typeof XMLHttpRequest&&(!t||hasCORS))return new XMLHttpRequest;
    }catch(e){}try{
      if('undefined'!=typeof XDomainRequest&&!n&&r)return new XDomainRequest;
    }catch(e){}if(!t)try{
      return new(self[['Active'].concat('Object').join('X')])('Microsoft.XMLHTTP');
    }catch(e){}
  };
},{'has-cors':81}],73:[function (require,module,exports){
  (function (process){
    function useColors(){
      return!('undefined'==typeof window||!window.process||'renderer'!==window.process.type)||('undefined'==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&('undefined'!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||'undefined'!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||'undefined'!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||'undefined'!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }function formatArgs(e){
      var o=this.useColors;if(e[0]=`${(o?'%c':'')+this.namespace+(o?' %c':' ')+e[0]+(o?'%c ':' ')}+${exports.humanize(this.diff)}`,o){
        var C=`color: ${this.color}`;e.splice(1,0,C,'color: inherit');var t=0,r=0;e[0].replace(/%[a-zA-Z%]/g,function (e){
          '%%'!==e&&(t++,'%c'===e&&(r=t));
        }),e.splice(r,0,C);
      }
    }function log(){
      return'object'==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments);
    }function save(e){
      try{
        null==e?exports.storage.removeItem('debug'):exports.storage.debug=e;
      }catch(e){}
    }function load(){
      var e;try{
        e=exports.storage.debug;
      }catch(e){}return!e&&'undefined'!=typeof process&&'env'in process&&(e=process.env.DEBUG),e;
    }function localstorage(){
      try{
        return window.localStorage;
      }catch(e){}
    }exports=module.exports=require('./debug'),exports.log=log,exports.formatArgs=formatArgs,exports.save=save,exports.load=load,exports.useColors=useColors,exports.storage='undefined'!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:localstorage(),exports.colors=['#0000CC','#0000FF','#0033CC','#0033FF','#0066CC','#0066FF','#0099CC','#0099FF','#00CC00','#00CC33','#00CC66','#00CC99','#00CCCC','#00CCFF','#3300CC','#3300FF','#3333CC','#3333FF','#3366CC','#3366FF','#3399CC','#3399FF','#33CC00','#33CC33','#33CC66','#33CC99','#33CCCC','#33CCFF','#6600CC','#6600FF','#6633CC','#6633FF','#66CC00','#66CC33','#9900CC','#9900FF','#9933CC','#9933FF','#99CC00','#99CC33','#CC0000','#CC0033','#CC0066','#CC0099','#CC00CC','#CC00FF','#CC3300','#CC3333','#CC3366','#CC3399','#CC33CC','#CC33FF','#CC6600','#CC6633','#CC9900','#CC9933','#CCCC00','#CCCC33','#FF0000','#FF0033','#FF0066','#FF0099','#FF00CC','#FF00FF','#FF3300','#FF3333','#FF3366','#FF3399','#FF33CC','#FF33FF','#FF6600','#FF6633','#FF9900','#FF9933','#FFCC00','#FFCC33'],exports.formatters.j=function (e){
      try{
        return JSON.stringify(e);
      }catch(e){
        return`[UnexpectedJSONParseError]: ${e.message}`;
      }
    },exports.enable(load());
  }).call(this,require('_process'));

},{'./debug':74,'_process':90}],74:[function (require,module,exports){
  function selectColor(e){
    var r,t=0;for(r in e)t=(t<<5)-t+e.charCodeAt(r),t|=0;return exports.colors[Math.abs(t)%exports.colors.length];
  }function createDebug(e){
    function r(){
      if(r.enabled){
        var e=r,s=+new Date,o=s-(t||s);e.diff=o,e.prev=t,e.curr=s,t=s;for(var n=new Array(arguments.length),a=0;a<n.length;a++)n[a]=arguments[a];n[0]=exports.coerce(n[0]),'string'!=typeof n[0]&&n.unshift('%O');var p=0;n[0]=n[0].replace(/%([a-zA-Z%])/g,function (r,t){
          if('%%'===r)return r;p++;var s=exports.formatters[t];if('function'==typeof s){
            var o=n[p];r=s.call(e,o),n.splice(p,1),p--;
          }return r;
        }),exports.formatArgs.call(e,n);(r.log||exports.log||console.log.bind(console)).apply(e,n);
      }
    }var t;return r.namespace=e,r.enabled=exports.enabled(e),r.useColors=exports.useColors(),r.color=selectColor(e),r.destroy=destroy,'function'==typeof exports.init&&exports.init(r),exports.instances.push(r),r;
  }function destroy(){
    var e=exports.instances.indexOf(this);return-1!==e&&(exports.instances.splice(e,1),!0);
  }function enable(e){
    exports.save(e),exports.names=[],exports.skips=[];var r,t=('string'==typeof e?e:'').split(/[\s,]+/),s=t.length;for(r=0;r<s;r++)t[r]&&(e=t[r].replace(/\*/g,'.*?'),'-'===e[0]?exports.skips.push(new RegExp(`^${e.substr(1)}$`)):exports.names.push(new RegExp(`^${e}$`)));for(r=0;r<exports.instances.length;r++){
      var o=exports.instances[r];o.enabled=exports.enabled(o.namespace);
    }
  }function disable(){
    exports.enable('');
  }function enabled(e){
    if('*'===e[e.length-1])return!0;var r,t;for(r=0,t=exports.skips.length;r<t;r++)if(exports.skips[r].test(e))return!1;for(r=0,t=exports.names.length;r<t;r++)if(exports.names[r].test(e))return!0;return!1;
  }function coerce(e){
    return e instanceof Error?e.stack||e.message:e;
  }exports=module.exports=createDebug.debug=createDebug.default=createDebug,exports.coerce=coerce,exports.disable=disable,exports.enable=enable,exports.enabled=enabled,exports.humanize=require('ms'),exports.instances=[],exports.names=[],exports.skips=[],exports.formatters={};
},{'ms':75}],75:[function (require,module,exports){
  function parse(e){
    if(e=String(e),!(e.length>100)){
      var r=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(r){
        var a=parseFloat(r[1]);switch((r[2]||'ms').toLowerCase()){
        case'years':case'year':case'yrs':case'yr':case'y':return a*y;case'days':case'day':case'd':return a*d;case'hours':case'hour':case'hrs':case'hr':case'h':return a*h;case'minutes':case'minute':case'mins':case'min':case'm':return a*m;case'seconds':case'second':case'secs':case'sec':case's':return a*s;case'milliseconds':case'millisecond':case'msecs':case'msec':case'ms':return a;default:return;
        }
      }
    }
  }function fmtShort(e){
    return e>=d?`${Math.round(e/d)}d`:e>=h?`${Math.round(e/h)}h`:e>=m?`${Math.round(e/m)}m`:e>=s?`${Math.round(e/s)}s`:`${e}ms`;
  }function fmtLong(e){
    return plural(e,d,'day')||plural(e,h,'hour')||plural(e,m,'minute')||plural(e,s,'second')||`${e} ms`;
  }function plural(s,e,r){
    if(!(s<e))return s<1.5*e?`${Math.floor(s/e)} ${r}`:`${Math.ceil(s/e)} ${r}s`;
  }var s=1e3,m=60*s,h=60*m,d=24*h,y=365.25*d;module.exports=function (s,e){
    e=e||{};var r=typeof s;if('string'===r&&s.length>0)return parse(s);if('number'===r&&!1===isNaN(s))return e.long?fmtLong(s):fmtShort(s);throw new Error(`val is not a non-empty string or a valid number. val=${JSON.stringify(s)}`);
  };
},{}],76:[function (require,module,exports){
  function encodeBase64Object(e,r){
    return r(`b${exports.packets[e.type]}${e.data.data}`);
  }function encodeArrayBuffer(e,r,t){
    if(!r)return exports.encodeBase64Packet(e,t);var n=e.data,a=new Uint8Array(n),o=new Uint8Array(1+n.byteLength);o[0]=packets[e.type];for(var f=0;f<a.length;f++)o[f+1]=a[f];return t(o.buffer);
  }function encodeBlobAsArrayBuffer(e,r,t){
    if(!r)return exports.encodeBase64Packet(e,t);var n=new FileReader;return n.onload=function (){
      exports.encodePacket({type:e.type,data:n.result},r,!0,t);
    },n.readAsArrayBuffer(e.data);
  }function encodeBlob(e,r,t){
    if(!r)return exports.encodeBase64Packet(e,t);if(dontSendBlobs)return encodeBlobAsArrayBuffer(e,r,t);var n=new Uint8Array(1);return n[0]=packets[e.type],t(new Blob([n.buffer,e.data]));
  }function tryDecode(e){
    try{
      e=utf8.decode(e,{strict:!1});
    }catch(e){
      return!1;
    }return e;
  }function map(e,r,t){
    for(var n=new Array(e.length),a=after(e.length,t),o=0;o<e.length;o++)!function (e,t,a){
      r(t,function (r,t){
        n[e]=t,a(r,n);
      });
    }(o,e[o],a);
  }var keys=require('./keys'),hasBinary=require('has-binary2'),sliceBuffer=require('arraybuffer.slice'),after=require('after'),utf8=require('./utf8'),base64encoder;'undefined'!=typeof ArrayBuffer&&(base64encoder=require('base64-arraybuffer'));var isAndroid='undefined'!=typeof navigator&&/Android/i.test(navigator.userAgent),isPhantomJS='undefined'!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),dontSendBlobs=isAndroid||isPhantomJS;exports.protocol=3;var packets=exports.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},packetslist=keys(packets),err={type:'error',data:'parser error'},Blob=require('blob');exports.encodePacket=function (e,r,t,n){
    'function'==typeof r&&(n=r,r=!1),'function'==typeof t&&(n=t,t=null);var a=void 0===e.data?void 0:e.data.buffer||e.data;if('undefined'!=typeof ArrayBuffer&&a instanceof ArrayBuffer)return encodeArrayBuffer(e,r,n);if(void 0!==Blob&&a instanceof Blob)return encodeBlob(e,r,n);if(a&&a.base64)return encodeBase64Object(e,n);var o=packets[e.type];return void 0!==e.data&&(o+=t?utf8.encode(String(e.data),{strict:!1}):String(e.data)),n(`${o}`);
  },exports.encodeBase64Packet=function (e,r){
    var t=`b${exports.packets[e.type]}`;if(void 0!==Blob&&e.data instanceof Blob){
      var n=new FileReader;return n.onload=function (){
        var e=n.result.split(',')[1];r(t+e);
      },n.readAsDataURL(e.data);
    }var a;try{
      a=String.fromCharCode.apply(null,new Uint8Array(e.data));
    }catch(r){
      for(var o=new Uint8Array(e.data),f=new Array(o.length),i=0;i<o.length;i++)f[i]=o[i];a=String.fromCharCode.apply(null,f);
    }return t+=btoa(a),r(t);
  },exports.decodePacket=function (e,r,t){
    if(void 0===e)return err;if('string'==typeof e){
      if('b'===e.charAt(0))return exports.decodeBase64Packet(e.substr(1),r);if(t&&!1===(e=tryDecode(e)))return err;var n=e.charAt(0);return Number(n)==n&&packetslist[n]?e.length>1?{type:packetslist[n],data:e.substring(1)}:{type:packetslist[n]}:err;
    }var a=new Uint8Array(e),n=a[0],o=sliceBuffer(e,1);return Blob&&'blob'===r&&(o=new Blob([o])),{type:packetslist[n],data:o};
  },exports.decodeBase64Packet=function (e,r){
    var t=packetslist[e.charAt(0)];if(!base64encoder)return{type:t,data:{base64:!0,data:e.substr(1)}};var n=base64encoder.decode(e.substr(1));return'blob'===r&&Blob&&(n=new Blob([n])),{type:t,data:n};
  },exports.encodePayload=function (e,r,t){
    function n(e){
      return `${e.length}:${e}`;
    }function a(e,t){
      exports.encodePacket(e,!!o&&r,!1,function (e){
        t(null,n(e));
      });
    }'function'==typeof r&&(t=r,r=null);var o=hasBinary(e);return r&&o?Blob&&!dontSendBlobs?exports.encodePayloadAsBlob(e,t):exports.encodePayloadAsArrayBuffer(e,t):e.length?void map(e,a,function (e,r){
      return t(r.join(''));
    }):t('0:');
  },exports.decodePayload=function (e,r,t){
    if('string'!=typeof e)return exports.decodePayloadAsBinary(e,r,t);'function'==typeof r&&(t=r,r=null);var n;if(''===e)return t(err,0,1);for(var a,o,f='',i=0,u=e.length;i<u;i++){
      var c=e.charAt(i);if(':'===c){
        if(''===f||f!=(a=Number(f)))return t(err,0,1);if(o=e.substr(i+1,a),f!=o.length)return t(err,0,1);if(o.length){
          if(n=exports.decodePacket(o,r,!1),err.type===n.type&&err.data===n.data)return t(err,0,1);if(!1===t(n,i+a,u))return;
        }i+=a,f='';
      }else f+=c;
    }return''!==f?t(err,0,1):void 0;
  },exports.encodePayloadAsArrayBuffer=function (e,r){
    function t(e,r){
      exports.encodePacket(e,!0,!0,function (e){
        return r(null,e);
      });
    }if(!e.length)return r(new ArrayBuffer(0));map(e,t,function (e,t){
      var n=t.reduce(function (e,r){
          var t;return t='string'==typeof r?r.length:r.byteLength,e+t.toString().length+t+2;
        },0),a=new Uint8Array(n),o=0;return t.forEach(function (e){
        var r='string'==typeof e,t=e;if(r){
          for(var n=new Uint8Array(e.length),f=0;f<e.length;f++)n[f]=e.charCodeAt(f);t=n.buffer;
        }a[o++]=r?0:1;for(var i=t.byteLength.toString(),f=0;f<i.length;f++)a[o++]=parseInt(i[f]);a[o++]=255;for(var n=new Uint8Array(t),f=0;f<n.length;f++)a[o++]=n[f];
      }),r(a.buffer);
    });
  },exports.encodePayloadAsBlob=function (e,r){
    function t(e,r){
      exports.encodePacket(e,!0,!0,function (e){
        var t=new Uint8Array(1);if(t[0]=1,'string'==typeof e){
          for(var n=new Uint8Array(e.length),a=0;a<e.length;a++)n[a]=e.charCodeAt(a);e=n.buffer,t[0]=0;
        }for(var o=e instanceof ArrayBuffer?e.byteLength:e.size,f=o.toString(),i=new Uint8Array(f.length+1),a=0;a<f.length;a++)i[a]=parseInt(f[a]);if(i[f.length]=255,Blob){
          var u=new Blob([t.buffer,i.buffer,e]);r(null,u);
        }
      });
    }map(e,t,function (e,t){
      return r(new Blob(t));
    });
  },exports.decodePayloadAsBinary=function (e,r,t){
    'function'==typeof r&&(t=r,r=null);for(var n=e,a=[];n.byteLength>0;){
      for(var o=new Uint8Array(n),f=0===o[0],i='',u=1;255!==o[u];u++){
        if(i.length>310)return t(err,0,1);i+=o[u];
      }n=sliceBuffer(n,2+i.length),i=parseInt(i);var c=sliceBuffer(n,0,i);if(f)try{
        c=String.fromCharCode.apply(null,new Uint8Array(c));
      }catch(e){
          var s=new Uint8Array(c);c='';for(var u=0;u<s.length;u++)c+=String.fromCharCode(s[u]);
        }a.push(c),n=sliceBuffer(n,i);
    }var d=a.length;a.forEach(function (e,n){
      t(exports.decodePacket(e,r,!0),n,d);
    });
  };
},{'./keys':77,'./utf8':78,'after':46,'arraybuffer.slice':52,'base64-arraybuffer':54,'blob':56,'has-binary2':79}],77:[function (require,module,exports){
  module.exports=Object.keys||function (r){
    var e=[],t=Object.prototype.hasOwnProperty;for(var o in r)t.call(r,o)&&e.push(o);return e;
  };
},{}],78:[function (require,module,exports){
  function ucs2decode(e){
    for(var r,t,n=[],o=0,a=e.length;o<a;)r=e.charCodeAt(o++),r>=55296&&r<=56319&&o<a?(t=e.charCodeAt(o++),56320==(64512&t)?n.push(((1023&r)<<10)+(1023&t)+65536):(n.push(r),o--)):n.push(r);return n;
  }function ucs2encode(e){
    for(var r,t=e.length,n=-1,o='';++n<t;)r=e[n],r>65535&&(r-=65536,o+=stringFromCharCode(r>>>10&1023|55296),r=56320|1023&r),o+=stringFromCharCode(r);return o;
  }function checkScalarValue(e,r){
    if(e>=55296&&e<=57343){
      if(r)throw Error(`Lone surrogate U+${e.toString(16).toUpperCase()} is not a scalar value`);return!1;
    }return!0;
  }function createByte(e,r){
    return stringFromCharCode(e>>r&63|128);
  }function encodeCodePoint(e,r){
    if(0==(4294967168&e))return stringFromCharCode(e);var t='';return 0==(4294965248&e)?t=stringFromCharCode(e>>6&31|192):0==(4294901760&e)?(checkScalarValue(e,r)||(e=65533),t=stringFromCharCode(e>>12&15|224),t+=createByte(e,6)):0==(4292870144&e)&&(t=stringFromCharCode(e>>18&7|240),t+=createByte(e,12),t+=createByte(e,6)),t+=stringFromCharCode(63&e|128);
  }function utf8encode(e,r){
    r=r||{};for(var t,n=!1!==r.strict,o=ucs2decode(e),a=o.length,i=-1,d='';++i<a;)t=o[i],d+=encodeCodePoint(t,n);return d;
  }function readContinuationByte(){
    if(byteIndex>=byteCount)throw Error('Invalid byte index');var e=255&byteArray[byteIndex];if(byteIndex++,128==(192&e))return 63&e;throw Error('Invalid continuation byte');
  }function decodeSymbol(e){
    var r,t,n,o,a;if(byteIndex>byteCount)throw Error('Invalid byte index');if(byteIndex==byteCount)return!1;if(r=255&byteArray[byteIndex],byteIndex++,0==(128&r))return r;if(192==(224&r)){
      if(t=readContinuationByte(),(a=(31&r)<<6|t)>=128)return a;throw Error('Invalid continuation byte');
    }if(224==(240&r)){
      if(t=readContinuationByte(),n=readContinuationByte(),(a=(15&r)<<12|t<<6|n)>=2048)return checkScalarValue(a,e)?a:65533;throw Error('Invalid continuation byte');
    }if(240==(248&r)&&(t=readContinuationByte(),n=readContinuationByte(),o=readContinuationByte(),(a=(7&r)<<18|t<<12|n<<6|o)>=65536&&a<=1114111))return a;throw Error('Invalid UTF-8 detected');
  }function utf8decode(e,r){
    r=r||{};var t=!1!==r.strict;byteArray=ucs2decode(e),byteCount=byteArray.length,byteIndex=0;for(var n,o=[];!1!==(n=decodeSymbol(t));)o.push(n);return ucs2encode(o);
  }var stringFromCharCode=String.fromCharCode,byteArray,byteCount,byteIndex;module.exports={version:'2.1.2',encode:utf8encode,decode:utf8decode};
},{}],79:[function (require,module,exports){
  (function (Buffer){
    function hasBinary(t){
      if(!t||'object'!=typeof t)return!1;if(isArray(t)){
        for(var r=0,e=t.length;r<e;r++)if(hasBinary(t[r]))return!0;return!1;
      }if('function'==typeof Buffer&&Buffer.isBuffer&&Buffer.isBuffer(t)||'function'==typeof ArrayBuffer&&t instanceof ArrayBuffer||withNativeBlob&&t instanceof Blob||withNativeFile&&t instanceof File)return!0;if(t.toJSON&&'function'==typeof t.toJSON&&1===arguments.length)return hasBinary(t.toJSON(),!0);for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)&&hasBinary(t[i]))return!0;return!1;
    }var isArray=require('isarray'),toString=Object.prototype.toString,withNativeBlob='function'==typeof Blob||'undefined'!=typeof Blob&&'[object BlobConstructor]'===toString.call(Blob),withNativeFile='function'==typeof File||'undefined'!=typeof File&&'[object FileConstructor]'===toString.call(File);module.exports=hasBinary;
  }).call(this,require('buffer').Buffer);

},{'buffer':58,'isarray':80}],80:[function (require,module,exports){
  var toString={}.toString;module.exports=Array.isArray||function (r){
    return'[object Array]'==toString.call(r);
  };
},{}],81:[function (require,module,exports){
  try{
    module.exports='undefined'!=typeof XMLHttpRequest&&'withCredentials'in new XMLHttpRequest;
  }catch(e){
    module.exports=!1;
  }
},{}],82:[function (require,module,exports){
  exports.read=function (a,o,t,r,h){
    var M,p,w=8*h-r-1,f=(1<<w)-1,e=f>>1,i=-7,N=t?h-1:0,n=t?-1:1,s=a[o+N];for(N+=n,M=s&(1<<-i)-1,s>>=-i,i+=w;i>0;M=256*M+a[o+N],N+=n,i-=8);for(p=M&(1<<-i)-1,M>>=-i,i+=r;i>0;p=256*p+a[o+N],N+=n,i-=8);if(0===M)M=1-e;else{
      if(M===f)return p?NaN:1/0*(s?-1:1);p+=Math.pow(2,r),M-=e;
    }return(s?-1:1)*p*Math.pow(2,M-r);
  },exports.write=function (a,o,t,r,h,M){
    var p,w,f,e=8*M-h-1,i=(1<<e)-1,N=i>>1,n=23===h?Math.pow(2,-24)-Math.pow(2,-77):0,s=r?0:M-1,u=r?1:-1,l=o<0||0===o&&1/o<0?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(w=isNaN(o)?1:0,p=i):(p=Math.floor(Math.log(o)/Math.LN2),o*(f=Math.pow(2,-p))<1&&(p--,f*=2),o+=p+N>=1?n/f:n*Math.pow(2,1-N),o*f>=2&&(p++,f/=2),p+N>=i?(w=0,p=i):p+N>=1?(w=(o*f-1)*Math.pow(2,h),p+=N):(w=o*Math.pow(2,N-1)*Math.pow(2,h),p=0));h>=8;a[t+s]=255&w,s+=u,w/=256,h-=8);for(p=p<<h|w,e+=h;e>0;a[t+s]=255&p,s+=u,p/=256,e-=8);a[t+s-u]|=128*l;
  };
},{}],83:[function (require,module,exports){
  var indexOf=[].indexOf;module.exports=function (e,n){
    if(indexOf)return e.indexOf(n);for(var r=0;r<e.length;++r)if(e[r]===n)return r;return-1;
  };
},{}],84:[function (require,module,exports){
  function isBuffer(f){
    return!!f.constructor&&'function'==typeof f.constructor.isBuffer&&f.constructor.isBuffer(f);
  }function isSlowBuffer(f){
    return'function'==typeof f.readFloatLE&&'function'==typeof f.slice&&isBuffer(f.slice(0,0));
  }module.exports=function (f){
    return null!=f&&(isBuffer(f)||isSlowBuffer(f)||!!f._isBuffer);
  };
},{}],85:[function (require,module,exports){
  !function (e,t){
    'use strict';'object'==typeof module&&'object'==typeof module.exports?module.exports=e.document?t(e,!0):function (e){
      if(!e.document)throw new Error('jQuery requires a window with a document');return t(e);
    }:t(e);
  }('undefined'!=typeof window?window:this,function (e,t){
    'use strict';function n(e,t,n){
      n=n||ue;var r,i,o=n.createElement('script');if(o.text=e,t)for(r in Te)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o);
    }function r(e){
      return null==e?`${e}`:'object'==typeof e||'function'==typeof e?he[ge.call(e)]||'object':typeof e;
    }function i(e){
      var t=!!e&&'length'in e&&e.length,n=r(e);return!be(e)&&!we(e)&&('array'===n||0===t||'number'==typeof t&&t>0&&t-1 in e);
    }function o(e,t){
      return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase();
    }function a(e,t,n){
      return be(t)?Ce.grep(e,function (e,r){
        return!!t.call(e,r,e)!==n;
      }):t.nodeType?Ce.grep(e,function (e){
        return e===t!==n;
      }):'string'!=typeof t?Ce.grep(e,function (e){
        return de.call(t,e)>-1!==n;
      }):Ce.filter(t,e,n);
    }function s(e,t){
      for(;(e=e[t])&&1!==e.nodeType;);return e;
    }function u(e){
      var t={};return Ce.each(e.match(Oe)||[],function (e,n){
        t[n]=!0;
      }),t;
    }function l(e){
      return e;
    }function c(e){
      throw e;
    }function f(e,t,n,r){
      var i;try{
        e&&be(i=e.promise)?i.call(e).done(t).fail(n):e&&be(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r));
      }catch(e){
        n.apply(void 0,[e]);
      }
    }function p(){
      ue.removeEventListener('DOMContentLoaded',p),e.removeEventListener('load',p),Ce.ready();
    }function d(e,t){
      return t.toUpperCase();
    }function h(e){
      return e.replace(Ie,'ms-').replace(We,d);
    }function g(){
      this.expando=Ce.expando+g.uid++;
    }function v(e){
      return'true'===e||'false'!==e&&('null'===e?null:e===`${+e}`?+e:_e.test(e)?JSON.parse(e):e);
    }function y(e,t,n){
      var r;if(void 0===n&&1===e.nodeType)if(r=`data-${t.replace(ze,'-$&').toLowerCase()}`,'string'==typeof(n=e.getAttribute(r))){
        try{
          n=v(n);
        }catch(e){}Be.set(e,t,n);
      }else n=void 0;return n;
    }function m(e,t,n,r){
      var i,o,a=20,s=r?function (){
          return r.cur();
        }:function (){
          return Ce.css(e,t,'');
        },u=s(),l=n&&n[3]||(Ce.cssNumber[t]?'':'px'),c=e.nodeType&&(Ce.cssNumber[t]||'px'!==l&&+u)&&Xe.exec(Ce.css(e,t));if(c&&c[3]!==l){
        for(u/=2,l=l||c[3],c=+u||1;a--;)Ce.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,Ce.style(e,t,c+l),n=n||[];
      }return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i;
    }function x(e){
      var t,n=e.ownerDocument,r=e.nodeName,i=Ze[r];return i||(t=n.body.appendChild(n.createElement(r)),i=Ce.css(t,'display'),t.parentNode.removeChild(t),'none'===i&&(i='block'),Ze[r]=i,i);
    }function b(e,t){
      for(var n,r,i=[],o=0,a=e.length;o<a;o++)r=e[o],r.style&&(n=r.style.display,t?('none'===n&&(i[o]=Fe.get(r,'display')||null,i[o]||(r.style.display='')),''===r.style.display&&Je(r)&&(i[o]=x(r))):'none'!==n&&(i[o]='none',Fe.set(r,'display',n)));for(o=0;o<a;o++)null!=i[o]&&(e[o].style.display=i[o]);return e;
    }function w(e,t){
      var n;return n=void 0!==e.getElementsByTagName?e.getElementsByTagName(t||'*'):void 0!==e.querySelectorAll?e.querySelectorAll(t||'*'):[],void 0===t||t&&o(e,t)?Ce.merge([e],n):n;
    }function T(e,t){
      for(var n=0,r=e.length;n<r;n++)Fe.set(e[n],'globalEval',!t||Fe.get(t[n],'globalEval'));
    }function C(e,t,n,i,o){
      for(var a,s,u,l,c,f,p=t.createDocumentFragment(),d=[],h=0,g=e.length;h<g;h++)if((a=e[h])||0===a)if('object'===r(a))Ce.merge(d,a.nodeType?[a]:a);else if(it.test(a)){
        for(s=s||p.appendChild(t.createElement('div')),u=(tt.exec(a)||['',''])[1].toLowerCase(),l=rt[u]||rt._default,s.innerHTML=l[1]+Ce.htmlPrefilter(a)+l[2],f=l[0];f--;)s=s.lastChild;Ce.merge(d,s.childNodes),s=p.firstChild,s.textContent='';
      }else d.push(t.createTextNode(a));for(p.textContent='',h=0;a=d[h++];)if(i&&Ce.inArray(a,i)>-1)o&&o.push(a);else if(c=Ye(a),s=w(p.appendChild(a),'script'),c&&T(s),n)for(f=0;a=s[f++];)nt.test(a.type||'')&&n.push(a);return p;
    }function E(){
      return!0;
    }function k(){
      return!1;
    }function S(e,t){
      return e===N()==('focus'===t);
    }function N(){
      try{
        return ue.activeElement;
      }catch(e){}
    }function A(e,t,n,r,i,o){
      var a,s;if('object'==typeof t){
        'string'!=typeof n&&(r=r||n,n=void 0);for(s in t)A(e,s,n,r,t[s],o);return e;
      }if(null==r&&null==i?(i=n,r=n=void 0):null==i&&('string'==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=k;else if(!i)return e;return 1===o&&(a=i,i=function (e){
        return Ce().off(e),a.apply(this,arguments);
      },i.guid=a.guid||(a.guid=Ce.guid++)),e.each(function (){
        Ce.event.add(this,t,i,r,n);
      });
    }function D(e,t,n){
      if(!n)return void(void 0===Fe.get(e,t)&&Ce.event.add(e,t,E));Fe.set(e,t,!1),Ce.event.add(e,t,{namespace:!1,handler:function (e){
        var r,i,o=Fe.get(this,t);if(1&e.isTrigger&&this[t]){
          if(o.length)(Ce.event.special[t]||{}).delegateType&&e.stopPropagation();else if(o=ce.call(arguments),Fe.set(this,t,o),r=n(this,t),this[t](),i=Fe.get(this,t),o!==i||r?Fe.set(this,t,!1):i={},o!==i)return e.stopImmediatePropagation(),e.preventDefault(),i.value;
        }else o.length&&(Fe.set(this,t,{value:Ce.event.trigger(Ce.extend(o[0],Ce.Event.prototype),o.slice(1),this)}),e.stopImmediatePropagation());
      }});
    }function j(e,t){
      return o(e,'table')&&o(11!==t.nodeType?t:t.firstChild,'tr')?Ce(e).children('tbody')[0]||e:e;
    }function q(e){
      return e.type=`${null!==e.getAttribute('type')}/${e.type}`,e;
    }function L(e){
      return'true/'===(e.type||'').slice(0,5)?e.type=e.type.slice(5):e.removeAttribute('type'),e;
    }function H(e,t){
      var n,r,i,o,a,s,u,l;if(1===t.nodeType){
        if(Fe.hasData(e)&&(o=Fe.access(e),a=Fe.set(t,o),l=o.events)){
          delete a.handle,a.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)Ce.event.add(t,i,l[i][n]);
        }Be.hasData(e)&&(s=Be.access(e),u=Ce.extend({},s),Be.set(t,u));
      }
    }function O(e,t){
      var n=t.nodeName.toLowerCase();'input'===n&&et.test(e.type)?t.checked=e.checked:'input'!==n&&'textarea'!==n||(t.defaultValue=e.defaultValue);
    }function P(e,t,r,i){
      t=fe.apply([],t);var o,a,s,u,l,c,f=0,p=e.length,d=p-1,h=t[0],g=be(h);if(g||p>1&&'string'==typeof h&&!xe.checkClone&&ct.test(h))return e.each(function (n){
        var o=e.eq(n);g&&(t[0]=h.call(this,n,o.html())),P(o,t,r,i);
      });if(p&&(o=C(t,e[0].ownerDocument,!1,e,i),a=o.firstChild,1===o.childNodes.length&&(o=a),a||i)){
        for(s=Ce.map(w(o,'script'),q),u=s.length;f<p;f++)l=o,f!==d&&(l=Ce.clone(l,!0,!0),u&&Ce.merge(s,w(l,'script'))),r.call(e[f],l,f);if(u)for(c=s[s.length-1].ownerDocument,Ce.map(s,L),f=0;f<u;f++)l=s[f],nt.test(l.type||'')&&!Fe.access(l,'globalEval')&&Ce.contains(c,l)&&(l.src&&'module'!==(l.type||'').toLowerCase()?Ce._evalUrl&&!l.noModule&&Ce._evalUrl(l.src,{nonce:l.nonce||l.getAttribute('nonce')}):n(l.textContent.replace(ft,''),l,c));
      }return e;
    }function R(e,t,n){
      for(var r,i=t?Ce.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||Ce.cleanData(w(r)),r.parentNode&&(n&&Ye(r)&&T(w(r,'script')),r.parentNode.removeChild(r));return e;
    }function M(e,t,n){
      var r,i,o,a,s=e.style;return n=n||dt(e),n&&(a=n.getPropertyValue(t)||n[t],''!==a||Ye(e)||(a=Ce.style(e,t)),!xe.pixelBoxStyles()&&pt.test(a)&&ht.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?`${a}`:a;
    }function I(e,t){
      return{get:function (){
        return e()?void delete this.get:(this.get=t).apply(this,arguments);
      }};
    }function W(e){
      for(var t=e[0].toUpperCase()+e.slice(1),n=gt.length;n--;)if((e=gt[n]+t)in vt)return e;
    }function $(e){
      var t=Ce.cssProps[e]||yt[e];return t||(e in vt?e:yt[e]=W(e)||e);
    }function F(e,t,n){
      var r=Xe.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||'px'):t;
    }function B(e,t,n,r,i,o){
      var a='width'===t?1:0,s=0,u=0;if(n===(r?'border':'content'))return 0;for(;a<4;a+=2)'margin'===n&&(u+=Ce.css(e,n+Ve[a],!0,i)),r?('content'===n&&(u-=Ce.css(e,`padding${Ve[a]}`,!0,i)),'margin'!==n&&(u-=Ce.css(e,`border${Ve[a]}Width`,!0,i))):(u+=Ce.css(e,`padding${Ve[a]}`,!0,i),'padding'!==n?u+=Ce.css(e,`border${Ve[a]}Width`,!0,i):s+=Ce.css(e,`border${Ve[a]}Width`,!0,i));return!r&&o>=0&&(u+=Math.max(0,Math.ceil(e[`offset${t[0].toUpperCase()}${t.slice(1)}`]-o-u-s-.5))||0),u;
    }function _(e,t,n){
      var r=dt(e),i=!xe.boxSizingReliable()||n,o=i&&'border-box'===Ce.css(e,'boxSizing',!1,r),a=o,s=M(e,t,r),u=`offset${t[0].toUpperCase()}${t.slice(1)}`;if(pt.test(s)){
        if(!n)return s;s='auto';
      }return(!xe.boxSizingReliable()&&o||'auto'===s||!parseFloat(s)&&'inline'===Ce.css(e,'display',!1,r))&&e.getClientRects().length&&(o='border-box'===Ce.css(e,'boxSizing',!1,r),(a=u in e)&&(s=e[u])),`${(s=parseFloat(s)||0)+B(e,t,n||(o?'border':'content'),a,r,s)}px`;
    }function z(e,t,n,r,i){
      return new z.prototype.init(e,t,n,r,i);
    }function U(){
      Ct&&(!1===ue.hidden&&e.requestAnimationFrame?e.requestAnimationFrame(U):e.setTimeout(U,Ce.fx.interval),Ce.fx.tick());
    }function X(){
      return e.setTimeout(function (){
        Tt=void 0;
      }),Tt=Date.now();
    }function V(e,t){
      var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)n=Ve[r],i[`margin${n}`]=i[`padding${n}`]=e;return t&&(i.opacity=i.width=e),i;
    }function G(e,t,n){
      for(var r,i=(J.tweeners[t]||[]).concat(J.tweeners['*']),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r;
    }function Y(e,t,n){
      var r,i,o,a,s,u,l,c,f='width'in t||'height'in t,p=this,d={},h=e.style,g=e.nodeType&&Je(e),v=Fe.get(e,'fxshow');n.queue||(a=Ce._queueHooks(e,'fx'),null==a.unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function (){
        a.unqueued||s();
      }),a.unqueued++,p.always(function (){
          p.always(function (){
            a.unqueued--,Ce.queue(e,'fx').length||a.empty.fire();
          });
        }));for(r in t)if(i=t[r],Et.test(i)){
        if(delete t[r],o=o||'toggle'===i,i===(g?'hide':'show')){
          if('show'!==i||!v||void 0===v[r])continue;g=!0;
        }d[r]=v&&v[r]||Ce.style(e,r);
      }if((u=!Ce.isEmptyObject(t))||!Ce.isEmptyObject(d)){
        f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],l=v&&v.display,null==l&&(l=Fe.get(e,'display')),c=Ce.css(e,'display'),'none'===c&&(l?c=l:(b([e],!0),l=e.style.display||l,c=Ce.css(e,'display'),b([e]))),('inline'===c||'inline-block'===c&&null!=l)&&'none'===Ce.css(e,'float')&&(u||(p.done(function (){
          h.display=l;
        }),null==l&&(c=h.display,l='none'===c?'':c)),h.display='inline-block')),n.overflow&&(h.overflow='hidden',p.always(function (){
          h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2];
        })),u=!1;for(r in d)u||(v?'hidden'in v&&(g=v.hidden):v=Fe.access(e,'fxshow',{display:l}),o&&(v.hidden=!g),g&&b([e],!0),p.done(function (){
          g||b([e]),Fe.remove(e,'fxshow');for(r in d)Ce.style(e,r,d[r]);
        })),u=G(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0));
      }
    }function Q(e,t){
      var n,r,i,o,a;for(n in e)if(r=h(n),i=t[r],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=Ce.cssHooks[r])&&'expand'in a){
        o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i);
      }else t[r]=i;
    }function J(e,t,n){
      var r,i,o=0,a=J.prefilters.length,s=Ce.Deferred().always(function (){
          delete u.elem;
        }),u=function (){
          if(i)return!1;for(var t=Tt||X(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,a=0,u=l.tweens.length;a<u;a++)l.tweens[a].run(o);return s.notifyWith(e,[l,o,n]),o<1&&u?n:(u||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1);
        },l=s.promise({elem:e,props:Ce.extend({},t),opts:Ce.extend(!0,{specialEasing:{},easing:Ce.easing._default},n),originalProperties:t,originalOptions:n,startTime:Tt||X(),duration:n.duration,tweens:[],createTween:function (t,n){
          var r=Ce.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r;
        },stop:function (t){
          var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this;
        }}),c=l.props;for(Q(c,l.opts.specialEasing);o<a;o++)if(r=J.prefilters[o].call(l,e,c,l.opts))return be(r.stop)&&(Ce._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return Ce.map(c,G,l),be(l.opts.start)&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),Ce.fx.timer(Ce.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l;
    }function K(e){
      return(e.match(Oe)||[]).join(' ');
    }function Z(e){
      return e.getAttribute&&e.getAttribute('class')||'';
    }function ee(e){
      return Array.isArray(e)?e:'string'==typeof e?e.match(Oe)||[]:[];
    }function te(e,t,n,i){
      var o;if(Array.isArray(t))Ce.each(t,function (t,r){
        n||Rt.test(e)?i(e,r):te(`${e}[${'object'==typeof r&&null!=r?t:''}]`,r,n,i);
      });else if(n||'object'!==r(t))i(e,t);else for(o in t)te(`${e}[${o}]`,t[o],n,i);
    }function ne(e){
      return function (t,n){
        'string'!=typeof t&&(n=t,t='*');var r,i=0,o=t.toLowerCase().match(Oe)||[];if(be(n))for(;r=o[i++];)'+'===r[0]?(r=r.slice(1)||'*',(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n);
      };
    }function re(e,t,n,r){
      function i(s){
        var u;return o[s]=!0,Ce.each(e[s]||[],function (e,s){
          var l=s(t,n,r);return'string'!=typeof l||a||o[l]?a?!(u=l):void 0:(t.dataTypes.unshift(l),i(l),!1);
        }),u;
      }var o={},a=e===Gt;return i(t.dataTypes[0])||!o['*']&&i('*');
    }function ie(e,t){
      var n,r,i=Ce.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&Ce.extend(!0,e,r),e;
    }function oe(e,t,n){
      for(var r,i,o,a,s=e.contents,u=e.dataTypes;'*'===u[0];)u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader('Content-Type'));if(r)for(i in s)if(s[i]&&s[i].test(r)){
        u.unshift(i);break;
      }if(u[0]in n)o=u[0];else{
        for(i in n){
          if(!u[0]||e.converters[`${i} ${u[0]}`]){
            o=i;break;
          }a||(a=i);
        }o=o||a;
      }if(o)return o!==u[0]&&u.unshift(o),n[o];
    }function ae(e,t,n,r){
      var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];for(o=c.shift();o;)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if('*'===o)o=u;else if('*'!==u&&u!==o){
        if(!(a=l[`${u} ${o}`]||l[`* ${o}`]))for(i in l)if(s=i.split(' '),s[1]===o&&(a=l[`${u} ${s[0]}`]||l[`* ${s[0]}`])){
          !0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break;
        }if(!0!==a)if(a&&e.throws)t=a(t);else try{
          t=a(t);
        }catch(e){
            return{state:'parsererror',error:a?e:`No conversion from ${u} to ${o}`};
          }
      }return{state:'success',data:t};
    }var se=[],ue=e.document,le=Object.getPrototypeOf,ce=se.slice,fe=se.concat,pe=se.push,de=se.indexOf,he={},ge=he.toString,ve=he.hasOwnProperty,ye=ve.toString,me=ye.call(Object),xe={},be=function (e){
        return'function'==typeof e&&'number'!=typeof e.nodeType;
      },we=function (e){
        return null!=e&&e===e.window;
      },Te={type:!0,src:!0,nonce:!0,noModule:!0},Ce=function (e,t){
        return new Ce.fn.init(e,t);
      },Ee=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;Ce.fn=Ce.prototype={jquery:'3.4.1',constructor:Ce,length:0,toArray:function (){
      return ce.call(this);
    },get:function (e){
      return null==e?ce.call(this):e<0?this[e+this.length]:this[e];
    },pushStack:function (e){
      var t=Ce.merge(this.constructor(),e);return t.prevObject=this,t;
    },each:function (e){
      return Ce.each(this,e);
    },map:function (e){
      return this.pushStack(Ce.map(this,function (t,n){
        return e.call(t,n,t);
      }));
    },slice:function (){
      return this.pushStack(ce.apply(this,arguments));
    },first:function (){
      return this.eq(0);
    },last:function (){
      return this.eq(-1);
    },eq:function (e){
      var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[]);
    },end:function (){
      return this.prevObject||this.constructor();
    },push:pe,sort:se.sort,splice:se.splice},Ce.extend=Ce.fn.extend=function (){
      var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for('boolean'==typeof a&&(l=a,a=arguments[s]||{},s++),'object'==typeof a||be(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],'__proto__'!==t&&a!==r&&(l&&r&&(Ce.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||Ce.isPlainObject(n)?n:{},i=!1,a[t]=Ce.extend(l,o,r)):void 0!==r&&(a[t]=r));return a;
    },Ce.extend({expando:`jQuery${(`3.4.1${Math.random()}`).replace(/\D/g,'')}`,isReady:!0,error:function (e){
      throw new Error(e);
    },noop:function (){},isPlainObject:function (e){
      var t,n;return!(!e||'[object Object]'!==ge.call(e))&&(!(t=le(e))||'function'==typeof(n=ve.call(t,'constructor')&&t.constructor)&&ye.call(n)===me);
    },isEmptyObject:function (e){
      var t;for(t in e)return!1;return!0;
    },globalEval:function (e,t){
      n(e,{nonce:t&&t.nonce});
    },each:function (e,t){
      var n,r=0;if(i(e))for(n=e.length;r<n&&!1!==t.call(e[r],r,e[r]);r++);else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e;
    },trim:function (e){
      return null==e?'':(`${e}`).replace(Ee,'');
    },makeArray:function (e,t){
      var n=t||[];return null!=e&&(i(Object(e))?Ce.merge(n,'string'==typeof e?[e]:e):pe.call(n,e)),n;
    },inArray:function (e,t,n){
      return null==t?-1:de.call(t,e,n);
    },merge:function (e,t){
      for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e;
    },grep:function (e,t,n){
      for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r;
    },map:function (e,t,n){
      var r,o,a=0,s=[];if(i(e))for(r=e.length;a<r;a++)null!=(o=t(e[a],a,n))&&s.push(o);else for(a in e)null!=(o=t(e[a],a,n))&&s.push(o);return fe.apply([],s);
    },guid:1,support:xe}),'function'==typeof Symbol&&(Ce.fn[Symbol.iterator]=se[Symbol.iterator]),Ce.each('Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' '),function (e,t){
      he[`[object ${t}]`]=t.toLowerCase();
    });var ke=function (e){
      function t(e,t,n,r){
        var i,o,a,s,u,c,p,d=t&&t.ownerDocument,h=t?t.nodeType:9;if(n=n||[],'string'!=typeof e||!e||1!==h&&9!==h&&11!==h)return n;if(!r&&((t?t.ownerDocument||t:W)!==q&&j(t),t=t||q,H)){
          if(11!==h&&(u=ye.exec(e)))if(i=u[1]){
            if(9===h){
              if(!(a=t.getElementById(i)))return n;if(a.id===i)return n.push(a),n;
            }else if(d&&(a=d.getElementById(i))&&M(t,a)&&a.id===i)return n.push(a),n;
          }else{
            if(u[2])return J.apply(n,t.getElementsByTagName(e)),n;if((i=u[3])&&b.getElementsByClassName&&t.getElementsByClassName)return J.apply(n,t.getElementsByClassName(i)),n;
          }if(b.qsa&&!U[`${e} `]&&(!O||!O.test(e))&&(1!==h||'object'!==t.nodeName.toLowerCase())){
            if(p=e,d=t,1===h&&le.test(e)){
              for((s=t.getAttribute('id'))?s=s.replace(we,Te):t.setAttribute('id',s=I),c=E(e),o=c.length;o--;)c[o]=`#${s} ${f(c[o])}`;p=c.join(','),d=me.test(e)&&l(t.parentNode)||t;
            }try{
              return J.apply(n,d.querySelectorAll(p)),n;
            }catch(t){
              U(e,!0);
            }finally{
              s===I&&t.removeAttribute('id');
            }
          }
        }return S(e.replace(ae,'$1'),t,n,r);
      }function n(){
        function e(n,r){
          return t.push(`${n} `)>w.cacheLength&&delete e[t.shift()],e[`${n} `]=r;
        }var t=[];return e;
      }function r(e){
        return e[I]=!0,e;
      }function i(e){
        var t=q.createElement('fieldset');try{
          return!!e(t);
        }catch(e){
          return!1;
        }finally{
          t.parentNode&&t.parentNode.removeChild(t),t=null;
        }
      }function o(e,t){
        for(var n=e.split('|'),r=n.length;r--;)w.attrHandle[n[r]]=t;
      }function a(e,t){
        var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1;
      }function s(e){
        return function (t){
          return'form'in t?t.parentNode&&!1===t.disabled?'label'in t?'label'in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&Ee(t)===e:t.disabled===e:'label'in t&&t.disabled===e;
        };
      }function u(e){
        return r(function (t){
          return t=+t,r(function (n,r){
            for(var i,o=e([],n.length,t),a=o.length;a--;)n[i=o[a]]&&(n[i]=!(r[i]=n[i]));
          });
        });
      }function l(e){
        return e&&void 0!==e.getElementsByTagName&&e;
      }function c(){}function f(e){
        for(var t=0,n=e.length,r='';t<n;t++)r+=e[t].value;return r;
      }function p(e,t,n){
        var r=t.dir,i=t.next,o=i||r,a=n&&'parentNode'===o,s=F++;return t.first?function (t,n,i){
          for(;t=t[r];)if(1===t.nodeType||a)return e(t,n,i);return!1;
        }:function (t,n,u){
          var l,c,f,p=[$,s];if(u){
            for(;t=t[r];)if((1===t.nodeType||a)&&e(t,n,u))return!0;
          }else for(;t=t[r];)if(1===t.nodeType||a)if(f=t[I]||(t[I]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{
            if((l=c[o])&&l[0]===$&&l[1]===s)return p[2]=l[2];if(c[o]=p,p[2]=e(t,n,u))return!0;
          }return!1;
        };
      }function d(e){
        return e.length>1?function (t,n,r){
          for(var i=e.length;i--;)if(!e[i](t,n,r))return!1;return!0;
        }:e[0];
      }function h(e,n,r){
        for(var i=0,o=n.length;i<o;i++)t(e,n[i],r);return r;
      }function g(e,t,n,r,i){
        for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a;
      }function v(e,t,n,i,o,a){
        return i&&!i[I]&&(i=v(i)),o&&!o[I]&&(o=v(o,a)),r(function (r,a,s,u){
          var l,c,f,p=[],d=[],v=a.length,y=r||h(t||'*',s.nodeType?[s]:s,[]),m=!e||!r&&t?y:g(y,p,e,s,u),x=n?o||(r?e:v||i)?[]:a:m;if(n&&n(m,x,s,u),i)for(l=g(x,d),i(l,[],s,u),c=l.length;c--;)(f=l[c])&&(x[d[c]]=!(m[d[c]]=f));if(r){
            if(o||e){
              if(o){
                for(l=[],c=x.length;c--;)(f=x[c])&&l.push(m[c]=f);o(null,x=[],l,u);
              }for(c=x.length;c--;)(f=x[c])&&(l=o?Z(r,f):p[c])>-1&&(r[l]=!(a[l]=f));
            }
          }else x=g(x===a?x.splice(v,x.length):x),o?o(null,a,x,u):J.apply(a,x);
        });
      }function y(e){
        for(var t,n,r,i=e.length,o=w.relative[e[0].type],a=o||w.relative[' '],s=o?1:0,u=p(function (e){
            return e===t;
          },a,!0),l=p(function (e){
            return Z(t,e)>-1;
          },a,!0),c=[function (e,n,r){
            var i=!o&&(r||n!==N)||((t=n).nodeType?u(e,n,r):l(e,n,r));return t=null,i;
          }];s<i;s++)if(n=w.relative[e[s].type])c=[p(d(c),n)];else{
          if(n=w.filter[e[s].type].apply(null,e[s].matches),n[I]){
            for(r=++s;r<i&&!w.relative[e[r].type];r++);return v(s>1&&d(c),s>1&&f(e.slice(0,s-1).concat({value:' '===e[s-2].type?'*':''})).replace(ae,'$1'),n,s<r&&y(e.slice(s,r)),r<i&&y(e=e.slice(r)),r<i&&f(e));
          }c.push(n);
        }return d(c);
      }function m(e,n){
        var i=n.length>0,o=e.length>0,a=function (r,a,s,u,l){
          var c,f,p,d=0,h='0',v=r&&[],y=[],m=N,x=r||o&&w.find.TAG('*',l),b=$+=null==m?1:Math.random()||.1,T=x.length;for(l&&(N=a===q||a||l);h!==T&&null!=(c=x[h]);h++){
            if(o&&c){
              for(f=0,a||c.ownerDocument===q||(j(c),s=!H);p=e[f++];)if(p(c,a||q,s)){
                u.push(c);break;
              }l&&($=b);
            }i&&((c=!p&&c)&&d--,r&&v.push(c));
          }if(d+=h,i&&h!==d){
            for(f=0;p=n[f++];)p(v,y,a,s);if(r){
              if(d>0)for(;h--;)v[h]||y[h]||(y[h]=Y.call(u));y=g(y);
            }J.apply(u,y),l&&!r&&y.length>0&&d+n.length>1&&t.uniqueSort(u);
          }return l&&($=b,N=m),v;
        };return i?r(a):a;
      }var x,b,w,T,C,E,k,S,N,A,D,j,q,L,H,O,P,R,M,I=`sizzle${1*new Date}`,W=e.document,$=0,F=0,B=n(),_=n(),z=n(),U=n(),X=function (e,t){
          return e===t&&(D=!0),0;
        },V={}.hasOwnProperty,G=[],Y=G.pop,Q=G.push,J=G.push,K=G.slice,Z=function (e,t){
          for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1;
        },ee='checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',te='[\\x20\\t\\r\\n\\f]',ne='(?:\\\\.|[\\w-]|[^\0-\\xa0])+',re=`\\[${te}*(${ne})(?:${te}*([*^$|!~]?=)${te}*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(${ne}))|)${te}*\\]`,ie=`:(${ne})(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|${re})*)|.*)\\)|)`,oe=new RegExp(`${te}+`,'g'),ae=new RegExp(`^${te}+|((?:^|[^\\\\])(?:\\\\.)*)${te}+$`,'g'),se=new RegExp(`^${te}*,${te}*`),ue=new RegExp(`^${te}*([>+~]|${te})${te}*`),le=new RegExp(`${te}|>`),ce=new RegExp(ie),fe=new RegExp(`^${ne}$`),pe={ID:new RegExp(`^#(${ne})`),CLASS:new RegExp(`^\\.(${ne})`),TAG:new RegExp(`^(${ne}|[*])`),ATTR:new RegExp(`^${re}`),PSEUDO:new RegExp(`^${ie}`),CHILD:new RegExp(`^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(${te}*(even|odd|(([+-]|)(\\d*)n|)${te}*(?:([+-]|)${te}*(\\d+)|))${te}*\\)|)`,'i'),bool:new RegExp(`^(?:${ee})$`,'i'),needsContext:new RegExp(`^${te}*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(${te}*((?:-\\d)?\\d*)${te}*\\)|)(?=[^-]|$)`,'i')},de=/HTML$/i,he=/^(?:input|select|textarea|button)$/i,ge=/^h\d$/i,ve=/^[^{]+\{\s*\[native \w/,ye=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,me=/[+~]/,xe=new RegExp(`\\\\([\\da-f]{1,6}${te}?|(${te})|.)`,'ig'),be=function (e,t,n){
          var r=`0x${t}`-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320);
        },we=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,Te=function (e,t){
          return t?'\0'===e?'�':`${e.slice(0,-1)}\\${e.charCodeAt(e.length-1).toString(16)} `:`\\${e}`;
        },Ce=function (){
          j();
        },Ee=p(function (e){
          return!0===e.disabled&&'fieldset'===e.nodeName.toLowerCase();
        },{dir:'parentNode',next:'legend'});try{
        J.apply(G=K.call(W.childNodes),W.childNodes),G[W.childNodes.length].nodeType;
      }catch(e){
        J={apply:G.length?function (e,t){
          Q.apply(e,K.call(t));
        }:function (e,t){
          for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1;
        }};
      }b=t.support={},C=t.isXML=function (e){
        var t=e.namespaceURI,n=(e.ownerDocument||e).documentElement;return!de.test(t||n&&n.nodeName||'HTML');
      },j=t.setDocument=function (e){
        var t,n,r=e?e.ownerDocument||e:W;return r!==q&&9===r.nodeType&&r.documentElement?(q=r,L=q.documentElement,H=!C(q),W!==q&&(n=q.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener('unload',Ce,!1):n.attachEvent&&n.attachEvent('onunload',Ce)),b.attributes=i(function (e){
          return e.className='i',!e.getAttribute('className');
        }),b.getElementsByTagName=i(function (e){
            return e.appendChild(q.createComment('')),!e.getElementsByTagName('*').length;
          }),b.getElementsByClassName=ve.test(q.getElementsByClassName),b.getById=i(function (e){
            return L.appendChild(e).id=I,!q.getElementsByName||!q.getElementsByName(I).length;
          }),b.getById?(w.filter.ID=function (e){
            var t=e.replace(xe,be);return function (e){
              return e.getAttribute('id')===t;
            };
          },w.find.ID=function (e,t){
              if(void 0!==t.getElementById&&H){
                var n=t.getElementById(e);return n?[n]:[];
              }
            }):(w.filter.ID=function (e){
            var t=e.replace(xe,be);return function (e){
              var n=void 0!==e.getAttributeNode&&e.getAttributeNode('id');return n&&n.value===t;
            };
          },w.find.ID=function (e,t){
              if(void 0!==t.getElementById&&H){
                var n,r,i,o=t.getElementById(e);if(o){
                  if((n=o.getAttributeNode('id'))&&n.value===e)return[o];for(i=t.getElementsByName(e),r=0;o=i[r++];)if((n=o.getAttributeNode('id'))&&n.value===e)return[o];
                }return[];
              }
            }),w.find.TAG=b.getElementsByTagName?function (e,t){
            return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):b.qsa?t.querySelectorAll(e):void 0;
          }:function (e,t){
            var n,r=[],i=0,o=t.getElementsByTagName(e);if('*'===e){
              for(;n=o[i++];)1===n.nodeType&&r.push(n);return r;
            }return o;
          },w.find.CLASS=b.getElementsByClassName&&function (e,t){
            if(void 0!==t.getElementsByClassName&&H)return t.getElementsByClassName(e);
          },P=[],O=[],(b.qsa=ve.test(q.querySelectorAll))&&(i(function (e){
            L.appendChild(e).innerHTML=`<a id='${I}'></a><select id='${I}-\r\\' msallowcapture=''><option selected=''></option></select>`,e.querySelectorAll('[msallowcapture^=\'\']').length&&O.push(`[*^$]=${te}*(?:''|"")`),e.querySelectorAll('[selected]').length||O.push(`\\[${te}*(?:value|${ee})`),e.querySelectorAll(`[id~=${I}-]`).length||O.push('~='),e.querySelectorAll(':checked').length||O.push(':checked'),e.querySelectorAll(`a#${I}+*`).length||O.push('.#.+[+~]');
          }),i(function (e){
              e.innerHTML='<a href=\'\' disabled=\'disabled\'></a><select disabled=\'disabled\'><option/></select>';var t=q.createElement('input');t.setAttribute('type','hidden'),e.appendChild(t).setAttribute('name','D'),e.querySelectorAll('[name=d]').length&&O.push(`name${te}*[*^$|!~]?=`),2!==e.querySelectorAll(':enabled').length&&O.push(':enabled',':disabled'),L.appendChild(e).disabled=!0,2!==e.querySelectorAll(':disabled').length&&O.push(':enabled',':disabled'),e.querySelectorAll('*,:x'),O.push(',.*:');
            })),(b.matchesSelector=ve.test(R=L.matches||L.webkitMatchesSelector||L.mozMatchesSelector||L.oMatchesSelector||L.msMatchesSelector))&&i(function (e){
            b.disconnectedMatch=R.call(e,'*'),R.call(e,'[s!=\'\']:x'),P.push('!=',ie);
          }),O=O.length&&new RegExp(O.join('|')),P=P.length&&new RegExp(P.join('|')),t=ve.test(L.compareDocumentPosition),M=t||ve.test(L.contains)?function (e,t){
            var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)));
          }:function (e,t){
            if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1;
          },X=t?function (e,t){
            if(e===t)return D=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(n=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1,1&n||!b.sortDetached&&t.compareDocumentPosition(e)===n?e===q||e.ownerDocument===W&&M(W,e)?-1:t===q||t.ownerDocument===W&&M(W,t)?1:A?Z(A,e)-Z(A,t):0:4&n?-1:1);
          }:function (e,t){
            if(e===t)return D=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,s=[e],u=[t];if(!i||!o)return e===q?-1:t===q?1:i?-1:o?1:A?Z(A,e)-Z(A,t):0;if(i===o)return a(e,t);for(n=e;n=n.parentNode;)s.unshift(n);for(n=t;n=n.parentNode;)u.unshift(n);for(;s[r]===u[r];)r++;return r?a(s[r],u[r]):s[r]===W?-1:u[r]===W?1:0;
          },q):q;
      },t.matches=function (e,n){
        return t(e,null,null,n);
      },t.matchesSelector=function (e,n){
        if((e.ownerDocument||e)!==q&&j(e),b.matchesSelector&&H&&!U[`${n} `]&&(!P||!P.test(n))&&(!O||!O.test(n)))try{
          var r=R.call(e,n);if(r||b.disconnectedMatch||e.document&&11!==e.document.nodeType)return r;
        }catch(e){
            U(n,!0);
          }return t(n,q,null,[e]).length>0;
      },t.contains=function (e,t){
        return(e.ownerDocument||e)!==q&&j(e),M(e,t);
      },t.attr=function (e,t){
        (e.ownerDocument||e)!==q&&j(e);var n=w.attrHandle[t.toLowerCase()],r=n&&V.call(w.attrHandle,t.toLowerCase())?n(e,t,!H):void 0;return void 0!==r?r:b.attributes||!H?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null;
      },t.escape=function (e){
        return(`${e}`).replace(we,Te);
      },t.error=function (e){
        throw new Error(`Syntax error, unrecognized expression: ${e}`);
      },t.uniqueSort=function (e){
        var t,n=[],r=0,i=0;if(D=!b.detectDuplicates,A=!b.sortStable&&e.slice(0),e.sort(X),D){
          for(;t=e[i++];)t===e[i]&&(r=n.push(i));for(;r--;)e.splice(n[r],1);
        }return A=null,e;
      },T=t.getText=function (e){
        var t,n='',r=0,i=e.nodeType;if(i){
          if(1===i||9===i||11===i){
            if('string'==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=T(e);
          }else if(3===i||4===i)return e.nodeValue;
        }else for(;t=e[r++];)n+=T(t);return n;
      },w=t.selectors={cacheLength:50,createPseudo:r,match:pe,attrHandle:{},find:{},relative:{'>':{dir:'parentNode',first:!0},' ':{dir:'parentNode'},'+':{dir:'previousSibling',first:!0},'~':{dir:'previousSibling'}},preFilter:{ATTR:function (e){
        return e[1]=e[1].replace(xe,be),e[3]=(e[3]||e[4]||e[5]||'').replace(xe,be),'~='===e[2]&&(e[3]=` ${e[3]} `),e.slice(0,4);
      },CHILD:function (e){
        return e[1]=e[1].toLowerCase(),'nth'===e[1].slice(0,3)?(e[3]||t.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*('even'===e[3]||'odd'===e[3])),e[5]=+(e[7]+e[8]||'odd'===e[3])):e[3]&&t.error(e[0]),e;
      },PSEUDO:function (e){
        var t,n=!e[6]&&e[2];return pe.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||'':n&&ce.test(n)&&(t=E(n,!0))&&(t=n.indexOf(')',n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3));
      }},filter:{TAG:function (e){
        var t=e.replace(xe,be).toLowerCase();return'*'===e?function (){
          return!0;
        }:function (e){
          return e.nodeName&&e.nodeName.toLowerCase()===t;
        };
      },CLASS:function (e){
        var t=B[`${e} `];return t||(t=new RegExp(`(^|${te})${e}(${te}|$)`))&&B(e,function (e){
          return t.test('string'==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute('class')||'');
        });
      },ATTR:function (e,n,r){
        return function (i){
          var o=t.attr(i,e);return null==o?'!='===n:!n||(o+='','='===n?o===r:'!='===n?o!==r:'^='===n?r&&0===o.indexOf(r):'*='===n?r&&o.indexOf(r)>-1:'$='===n?r&&o.slice(-r.length)===r:'~='===n?(` ${o.replace(oe,' ')} `).indexOf(r)>-1:'|='===n&&(o===r||o.slice(0,r.length+1)===`${r}-`));
        };
      },CHILD:function (e,t,n,r,i){
        var o='nth'!==e.slice(0,3),a='last'!==e.slice(-4),s='of-type'===t;return 1===r&&0===i?function (e){
          return!!e.parentNode;
        }:function (t,n,u){
          var l,c,f,p,d,h,g=o!==a?'nextSibling':'previousSibling',v=t.parentNode,y=s&&t.nodeName.toLowerCase(),m=!u&&!s,x=!1;if(v){
            if(o){
              for(;g;){
                for(p=t;p=p[g];)if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g='only'===e&&!h&&'nextSibling';
              }return!0;
            }if(h=[a?v.firstChild:v.lastChild],a&&m){
              for(p=v,f=p[I]||(p[I]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),l=c[e]||[],d=l[0]===$&&l[1],x=d&&l[2],p=d&&v.childNodes[d];p=++d&&p&&p[g]||(x=d=0)||h.pop();)if(1===p.nodeType&&++x&&p===t){
                c[e]=[$,d,x];break;
              }
            }else if(m&&(p=t,f=p[I]||(p[I]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),l=c[e]||[],d=l[0]===$&&l[1],x=d),!1===x)for(;(p=++d&&p&&p[g]||(x=d=0)||h.pop())&&((s?p.nodeName.toLowerCase()!==y:1!==p.nodeType)||!++x||(m&&(f=p[I]||(p[I]={}),c=f[p.uniqueID]||(f[p.uniqueID]={}),c[e]=[$,x]),p!==t)););return(x-=i)===r||x%r==0&&x/r>=0;
          }
        };
      },PSEUDO:function (e,n){
        var i,o=w.pseudos[e]||w.setFilters[e.toLowerCase()]||t.error(`unsupported pseudo: ${e}`);return o[I]?o(n):o.length>1?(i=[e,e,'',n],w.setFilters.hasOwnProperty(e.toLowerCase())?r(function (e,t){
          for(var r,i=o(e,n),a=i.length;a--;)r=Z(e,i[a]),e[r]=!(t[r]=i[a]);
        }):function (e){
          return o(e,0,i);
        }):o;
      }},pseudos:{not:r(function (e){
        var t=[],n=[],i=k(e.replace(ae,'$1'));return i[I]?r(function (e,t,n,r){
          for(var o,a=i(e,null,r,[]),s=e.length;s--;)(o=a[s])&&(e[s]=!(t[s]=o));
        }):function (e,r,o){
          return t[0]=e,i(t,null,o,n),t[0]=null,!n.pop();
        };
      }),has:r(function (e){
        return function (n){
          return t(e,n).length>0;
        };
      }),contains:r(function (e){
        return e=e.replace(xe,be),function (t){
          return(t.textContent||T(t)).indexOf(e)>-1;
        };
      }),lang:r(function (e){
        return fe.test(e||'')||t.error(`unsupported lang: ${e}`),e=e.replace(xe,be).toLowerCase(),function (t){
          var n;do{
            if(n=H?t.lang:t.getAttribute('xml:lang')||t.getAttribute('lang'))return(n=n.toLowerCase())===e||0===n.indexOf(`${e}-`);
          }while((t=t.parentNode)&&1===t.nodeType);return!1;
        };
      }),target:function (t){
        var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id;
      },root:function (e){
        return e===L;
      },focus:function (e){
        return e===q.activeElement&&(!q.hasFocus||q.hasFocus())&&!!(e.type||e.href||~e.tabIndex);
      },enabled:s(!1),disabled:s(!0),checked:function (e){
        var t=e.nodeName.toLowerCase();return'input'===t&&!!e.checked||'option'===t&&!!e.selected;
      },selected:function (e){
        return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected;
      },empty:function (e){
        for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0;
      },parent:function (e){
        return!w.pseudos.empty(e);
      },header:function (e){
        return ge.test(e.nodeName);
      },input:function (e){
        return he.test(e.nodeName);
      },button:function (e){
        var t=e.nodeName.toLowerCase();return'input'===t&&'button'===e.type||'button'===t;
      },text:function (e){
        var t;return'input'===e.nodeName.toLowerCase()&&'text'===e.type&&(null==(t=e.getAttribute('type'))||'text'===t.toLowerCase());
      },first:u(function (){
        return[0];
      }),last:u(function (e,t){
        return[t-1];
      }),eq:u(function (e,t,n){
        return[n<0?n+t:n];
      }),even:u(function (e,t){
        for(var n=0;n<t;n+=2)e.push(n);return e;
      }),odd:u(function (e,t){
        for(var n=1;n<t;n+=2)e.push(n);return e;
      }),lt:u(function (e,t,n){
        for(var r=n<0?n+t:n>t?t:n;--r>=0;)e.push(r);return e;
      }),gt:u(function (e,t,n){
        for(var r=n<0?n+t:n;++r<t;)e.push(r);return e;
      })}},w.pseudos.nth=w.pseudos.eq;for(x in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})w.pseudos[x]=function (e){
        return function (t){
          return'input'===t.nodeName.toLowerCase()&&t.type===e;
        };
      }(x);for(x in{submit:!0,reset:!0})w.pseudos[x]=function (e){
        return function (t){
          var n=t.nodeName.toLowerCase();return('input'===n||'button'===n)&&t.type===e;
        };
      }(x);return c.prototype=w.filters=w.pseudos,w.setFilters=new c,E=t.tokenize=function (e,n){
        var r,i,o,a,s,u,l,c=_[`${e} `];if(c)return n?0:c.slice(0);for(s=e,u=[],l=w.preFilter;s;){
          r&&!(i=se.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),r=!1,(i=ue.exec(s))&&(r=i.shift(),o.push({value:r,type:i[0].replace(ae,' ')}),s=s.slice(r.length));for(a in w.filter)!(i=pe[a].exec(s))||l[a]&&!(i=l[a](i))||(r=i.shift(),o.push({value:r,type:a,matches:i}),s=s.slice(r.length));if(!r)break;
        }return n?s.length:s?t.error(e):_(e,u).slice(0);
      },k=t.compile=function (e,t){
        var n,r=[],i=[],o=z[`${e} `];if(!o){
          for(t||(t=E(e)),n=t.length;n--;)o=y(t[n]),o[I]?r.push(o):i.push(o);o=z(e,m(i,r)),o.selector=e;
        }return o;
      },S=t.select=function (e,t,n,r){
        var i,o,a,s,u,c='function'==typeof e&&e,p=!r&&E(e=c.selector||e);if(n=n||[],1===p.length){
          if(o=p[0]=p[0].slice(0),o.length>2&&'ID'===(a=o[0]).type&&9===t.nodeType&&H&&w.relative[o[1].type]){
            if(!(t=(w.find.ID(a.matches[0].replace(xe,be),t)||[])[0]))return n;c&&(t=t.parentNode),e=e.slice(o.shift().value.length);
          }for(i=pe.needsContext.test(e)?0:o.length;i--&&(a=o[i],!w.relative[s=a.type]);)if((u=w.find[s])&&(r=u(a.matches[0].replace(xe,be),me.test(o[0].type)&&l(t.parentNode)||t))){
            if(o.splice(i,1),!(e=r.length&&f(o)))return J.apply(n,r),n;break;
          }
        }return(c||k(e,p))(r,t,!H,n,!t||me.test(e)&&l(t.parentNode)||t),n;
      },b.sortStable=I.split('').sort(X).join('')===I,b.detectDuplicates=!!D,j(),b.sortDetached=i(function (e){
        return 1&e.compareDocumentPosition(q.createElement('fieldset'));
      }),i(function (e){
        return e.innerHTML='<a href=\'#\'></a>','#'===e.firstChild.getAttribute('href');
      })||o('type|href|height|width',function (e,t,n){
        if(!n)return e.getAttribute(t,'type'===t.toLowerCase()?1:2);
      }),b.attributes&&i(function (e){
        return e.innerHTML='<input/>',e.firstChild.setAttribute('value',''),''===e.firstChild.getAttribute('value');
      })||o('value',function (e,t,n){
        if(!n&&'input'===e.nodeName.toLowerCase())return e.defaultValue;
      }),i(function (e){
        return null==e.getAttribute('disabled');
      })||o(ee,function (e,t,n){
        var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null;
      }),t;
    }(e);Ce.find=ke,Ce.expr=ke.selectors,Ce.expr[':']=Ce.expr.pseudos,Ce.uniqueSort=Ce.unique=ke.uniqueSort,Ce.text=ke.getText,Ce.isXMLDoc=ke.isXML,Ce.contains=ke.contains,Ce.escapeSelector=ke.escape;var Se=function (e,t,n){
        for(var r=[],i=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){
          if(i&&Ce(e).is(n))break;r.push(e);
        }return r;
      },Ne=function (e,t){
        for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n;
      },Ae=Ce.expr.match.needsContext,De=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;Ce.filter=function (e,t,n){
      var r=t[0];return n&&(e=`:not(${e})`),1===t.length&&1===r.nodeType?Ce.find.matchesSelector(r,e)?[r]:[]:Ce.find.matches(e,Ce.grep(t,function (e){
        return 1===e.nodeType;
      }));
    },Ce.fn.extend({find:function (e){
      var t,n,r=this.length,i=this;if('string'!=typeof e)return this.pushStack(Ce(e).filter(function (){
        for(t=0;t<r;t++)if(Ce.contains(i[t],this))return!0;
      }));for(n=this.pushStack([]),t=0;t<r;t++)Ce.find(e,i[t],n);return r>1?Ce.uniqueSort(n):n;
    },filter:function (e){
      return this.pushStack(a(this,e||[],!1));
    },not:function (e){
      return this.pushStack(a(this,e||[],!0));
    },is:function (e){
      return!!a(this,'string'==typeof e&&Ae.test(e)?Ce(e):e||[],!1).length;
    }});var je,qe=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(Ce.fn.init=function (e,t,n){
      var r,i;if(!e)return this;if(n=n||je,'string'==typeof e){
        if(!(r='<'===e[0]&&'>'===e[e.length-1]&&e.length>=3?[null,e,null]:qe.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){
          if(t=t instanceof Ce?t[0]:t,Ce.merge(this,Ce.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:ue,!0)),De.test(r[1])&&Ce.isPlainObject(t))for(r in t)be(this[r])?this[r](t[r]):this.attr(r,t[r]);return this;
        }return i=ue.getElementById(r[2]),i&&(this[0]=i,this.length=1),this;
      }return e.nodeType?(this[0]=e,this.length=1,this):be(e)?void 0!==n.ready?n.ready(e):e(Ce):Ce.makeArray(e,this);
    }).prototype=Ce.fn,je=Ce(ue);var Le=/^(?:parents|prev(?:Until|All))/,He={children:!0,contents:!0,next:!0,prev:!0};Ce.fn.extend({has:function (e){
      var t=Ce(e,this),n=t.length;return this.filter(function (){
        for(var e=0;e<n;e++)if(Ce.contains(this,t[e]))return!0;
      });
    },closest:function (e,t){
      var n,r=0,i=this.length,o=[],a='string'!=typeof e&&Ce(e);if(!Ae.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&Ce.find.matchesSelector(n,e))){
        o.push(n);break;
      }return this.pushStack(o.length>1?Ce.uniqueSort(o):o);
    },index:function (e){
      return e?'string'==typeof e?de.call(Ce(e),this[0]):de.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1;
    },add:function (e,t){
      return this.pushStack(Ce.uniqueSort(Ce.merge(this.get(),Ce(e,t))));
    },addBack:function (e){
      return this.add(null==e?this.prevObject:this.prevObject.filter(e));
    }}),Ce.each({parent:function (e){
      var t=e.parentNode;return t&&11!==t.nodeType?t:null;
    },parents:function (e){
      return Se(e,'parentNode');
    },parentsUntil:function (e,t,n){
      return Se(e,'parentNode',n);
    },next:function (e){
      return s(e,'nextSibling');
    },prev:function (e){
      return s(e,'previousSibling');
    },nextAll:function (e){
      return Se(e,'nextSibling');
    },prevAll:function (e){
      return Se(e,'previousSibling');
    },nextUntil:function (e,t,n){
      return Se(e,'nextSibling',n);
    },prevUntil:function (e,t,n){
      return Se(e,'previousSibling',n);
    },siblings:function (e){
      return Ne((e.parentNode||{}).firstChild,e);
    },children:function (e){
      return Ne(e.firstChild);
    },contents:function (e){
      return void 0!==e.contentDocument?e.contentDocument:(o(e,'template')&&(e=e.content||e),Ce.merge([],e.childNodes));
    }},function (e,t){
      Ce.fn[e]=function (n,r){
        var i=Ce.map(this,t,n);return'Until'!==e.slice(-5)&&(r=n),r&&'string'==typeof r&&(i=Ce.filter(r,i)),this.length>1&&(He[e]||Ce.uniqueSort(i),Le.test(e)&&i.reverse()),this.pushStack(i);
      };
    });var Oe=/[^\x20\t\r\n\f]+/g;Ce.Callbacks=function (e){
      e='string'==typeof e?u(e):Ce.extend({},e);var t,n,i,o,a=[],s=[],l=-1,c=function (){
          for(o=o||e.once,i=t=!0;s.length;l=-1)for(n=s.shift();++l<a.length;)!1===a[l].apply(n[0],n[1])&&e.stopOnFalse&&(l=a.length,n=!1);e.memory||(n=!1),t=!1,o&&(a=n?[]:'');
        },f={add:function (){
          return a&&(n&&!t&&(l=a.length-1,s.push(n)),function t(n){
            Ce.each(n,function (n,i){
              be(i)?e.unique&&f.has(i)||a.push(i):i&&i.length&&'string'!==r(i)&&t(i);
            });
          }(arguments),n&&!t&&c()),this;
        },remove:function (){
          return Ce.each(arguments,function (e,t){
            for(var n;(n=Ce.inArray(t,a,n))>-1;)a.splice(n,1),n<=l&&l--;
          }),this;
        },has:function (e){
          return e?Ce.inArray(e,a)>-1:a.length>0;
        },empty:function (){
          return a&&(a=[]),this;
        },disable:function (){
          return o=s=[],a=n='',this;
        },disabled:function (){
          return!a;
        },lock:function (){
          return o=s=[],n||t||(a=n=''),this;
        },locked:function (){
          return!!o;
        },fireWith:function (e,n){
          return o||(n=n||[],n=[e,n.slice?n.slice():n],s.push(n),t||c()),this;
        },fire:function (){
          return f.fireWith(this,arguments),this;
        },fired:function (){
          return!!i;
        }};return f;
    },Ce.extend({Deferred:function (t){
      var n=[['notify','progress',Ce.Callbacks('memory'),Ce.Callbacks('memory'),2],['resolve','done',Ce.Callbacks('once memory'),Ce.Callbacks('once memory'),0,'resolved'],['reject','fail',Ce.Callbacks('once memory'),Ce.Callbacks('once memory'),1,'rejected']],r='pending',i={state:function (){
          return r;
        },always:function (){
          return o.done(arguments).fail(arguments),this;
        },catch:function (e){
          return i.then(null,e);
        },pipe:function (){
          var e=arguments;return Ce.Deferred(function (t){
            Ce.each(n,function (n,r){
              var i=be(e[r[4]])&&e[r[4]];o[r[1]](function (){
                var e=i&&i.apply(this,arguments);e&&be(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[`${r[0]}With`](this,i?[e]:arguments);
              });
            }),e=null;
          }).promise();
        },then:function (t,r,i){
          function o(t,n,r,i){
            return function (){
              var s=this,u=arguments,f=function (){
                  var e,f;if(!(t<a)){
                    if((e=r.apply(s,u))===n.promise())throw new TypeError('Thenable self-resolution');f=e&&('object'==typeof e||'function'==typeof e)&&e.then,be(f)?i?f.call(e,o(a,n,l,i),o(a,n,c,i)):(a++,f.call(e,o(a,n,l,i),o(a,n,c,i),o(a,n,l,n.notifyWith))):(r!==l&&(s=void 0,u=[e]),(i||n.resolveWith)(s,u));
                  }
                },p=i?f:function (){
                  try{
                    f();
                  }catch(e){
                    Ce.Deferred.exceptionHook&&Ce.Deferred.exceptionHook(e,p.stackTrace),t+1>=a&&(r!==c&&(s=void 0,u=[e]),n.rejectWith(s,u));
                  }
                };t?p():(Ce.Deferred.getStackHook&&(p.stackTrace=Ce.Deferred.getStackHook()),e.setTimeout(p));
            };
          }var a=0;return Ce.Deferred(function (e){
            n[0][3].add(o(0,e,be(i)?i:l,e.notifyWith)),n[1][3].add(o(0,e,be(t)?t:l)),n[2][3].add(o(0,e,be(r)?r:c));
          }).promise();
        },promise:function (e){
          return null!=e?Ce.extend(e,i):i;
        }},o={};return Ce.each(n,function (e,t){
        var a=t[2],s=t[5];i[t[1]]=a.add,s&&a.add(function (){
          r=s;
        },n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),a.add(t[3].fire),o[t[0]]=function (){
          return o[`${t[0]}With`](this===o?void 0:this,arguments),this;
        },o[`${t[0]}With`]=a.fireWith;
      }),i.promise(o),t&&t.call(o,o),o;
    },when:function (e){
      var t=arguments.length,n=t,r=Array(n),i=ce.call(arguments),o=Ce.Deferred(),a=function (e){
        return function (n){
          r[e]=this,i[e]=arguments.length>1?ce.call(arguments):n,--t||o.resolveWith(r,i);
        };
      };if(t<=1&&(f(e,o.done(a(n)).resolve,o.reject,!t),'pending'===o.state()||be(i[n]&&i[n].then)))return o.then();for(;n--;)f(i[n],a(n),o.reject);return o.promise();
    }});var Pe=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;Ce.Deferred.exceptionHook=function (t,n){
      e.console&&e.console.warn&&t&&Pe.test(t.name)&&e.console.warn(`jQuery.Deferred exception: ${t.message}`,t.stack,n);
    },Ce.readyException=function (t){
      e.setTimeout(function (){
        throw t;
      });
    };var Re=Ce.Deferred();Ce.fn.ready=function (e){
      return Re.then(e).catch(function (e){
        Ce.readyException(e);
      }),this;
    },Ce.extend({isReady:!1,readyWait:1,ready:function (e){
      (!0===e?--Ce.readyWait:Ce.isReady)||(Ce.isReady=!0,!0!==e&&--Ce.readyWait>0||Re.resolveWith(ue,[Ce]));
    }}),Ce.ready.then=Re.then,'complete'===ue.readyState||'loading'!==ue.readyState&&!ue.documentElement.doScroll?e.setTimeout(Ce.ready):(ue.addEventListener('DOMContentLoaded',p),e.addEventListener('load',p));var Me=function (e,t,n,i,o,a,s){
        var u=0,l=e.length,c=null==n;if('object'===r(n)){
          o=!0;for(u in n)Me(e,t,u,n[u],!0,a,s);
        }else if(void 0!==i&&(o=!0,be(i)||(s=!0),c&&(s?(t.call(e,i),t=null):(c=t,t=function (e,t,n){
          return c.call(Ce(e),n);
        })),t))for(;u<l;u++)t(e[u],n,s?i:i.call(e[u],u,t(e[u],n)));return o?e:c?t.call(e):l?t(e[0],n):a;
      },Ie=/^-ms-/,We=/-([a-z])/g,$e=function (e){
        return 1===e.nodeType||9===e.nodeType||!+e.nodeType;
      };g.uid=1,g.prototype={cache:function (e){
      var t=e[this.expando];return t||(t={},$e(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t;
    },set:function (e,t,n){
      var r,i=this.cache(e);if('string'==typeof t)i[h(t)]=n;else for(r in t)i[h(r)]=t[r];return i;
    },get:function (e,t){
      return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][h(t)];
    },access:function (e,t,n){
      return void 0===t||t&&'string'==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t);
    },remove:function (e,t){
      var n,r=e[this.expando];if(void 0!==r){
        if(void 0!==t){
          Array.isArray(t)?t=t.map(h):(t=h(t),t=t in r?[t]:t.match(Oe)||[]),n=t.length;for(;n--;)delete r[t[n]];
        }(void 0===t||Ce.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando]);
      }
    },hasData:function (e){
      var t=e[this.expando];return void 0!==t&&!Ce.isEmptyObject(t);
    }};var Fe=new g,Be=new g,_e=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ze=/[A-Z]/g;Ce.extend({hasData:function (e){
      return Be.hasData(e)||Fe.hasData(e);
    },data:function (e,t,n){
      return Be.access(e,t,n);
    },removeData:function (e,t){
      Be.remove(e,t);
    },_data:function (e,t,n){
      return Fe.access(e,t,n);
    },_removeData:function (e,t){
      Fe.remove(e,t);
    }}),Ce.fn.extend({data:function (e,t){
      var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){
        if(this.length&&(i=Be.get(o),1===o.nodeType&&!Fe.get(o,'hasDataAttrs'))){
          for(n=a.length;n--;)a[n]&&(r=a[n].name,0===r.indexOf('data-')&&(r=h(r.slice(5)),y(o,r,i[r])));Fe.set(o,'hasDataAttrs',!0);
        }return i;
      }return'object'==typeof e?this.each(function (){
        Be.set(this,e);
      }):Me(this,function (t){
        var n;if(o&&void 0===t){
          if(void 0!==(n=Be.get(o,e)))return n;if(void 0!==(n=y(o,e)))return n;
        }else this.each(function (){
          Be.set(this,e,t);
        });
      },null,t,arguments.length>1,null,!0);
    },removeData:function (e){
      return this.each(function (){
        Be.remove(this,e);
      });
    }}),Ce.extend({queue:function (e,t,n){
      var r;if(e)return t=`${t||'fx'}queue`,r=Fe.get(e,t),n&&(!r||Array.isArray(n)?r=Fe.access(e,t,Ce.makeArray(n)):r.push(n)),r||[];
    },dequeue:function (e,t){
      t=t||'fx';var n=Ce.queue(e,t),r=n.length,i=n.shift(),o=Ce._queueHooks(e,t),a=function (){
        Ce.dequeue(e,t);
      };'inprogress'===i&&(i=n.shift(),r--),i&&('fx'===t&&n.unshift('inprogress'),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire();
    },_queueHooks:function (e,t){
      var n=`${t}queueHooks`;return Fe.get(e,n)||Fe.access(e,n,{empty:Ce.Callbacks('once memory').add(function (){
        Fe.remove(e,[`${t}queue`,n]);
      })});
    }}),Ce.fn.extend({queue:function (e,t){
      var n=2;return'string'!=typeof e&&(t=e,e='fx',n--),arguments.length<n?Ce.queue(this[0],e):void 0===t?this:this.each(function (){
        var n=Ce.queue(this,e,t);Ce._queueHooks(this,e),'fx'===e&&'inprogress'!==n[0]&&Ce.dequeue(this,e);
      });
    },dequeue:function (e){
      return this.each(function (){
        Ce.dequeue(this,e);
      });
    },clearQueue:function (e){
      return this.queue(e||'fx',[]);
    },promise:function (e,t){
      var n,r=1,i=Ce.Deferred(),o=this,a=this.length,s=function (){
        --r||i.resolveWith(o,[o]);
      };for('string'!=typeof e&&(t=e,e=void 0),e=e||'fx';a--;)(n=Fe.get(o[a],`${e}queueHooks`))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t);
    }});var Ue=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,Xe=new RegExp(`^(?:([+-])=|)(${Ue})([a-z%]*)$`,'i'),Ve=['Top','Right','Bottom','Left'],Ge=ue.documentElement,Ye=function (e){
        return Ce.contains(e.ownerDocument,e);
      },Qe={composed:!0};Ge.getRootNode&&(Ye=function (e){
      return Ce.contains(e.ownerDocument,e)||e.getRootNode(Qe)===e.ownerDocument;
    });var Je=function (e,t){
        return e=t||e,'none'===e.style.display||''===e.style.display&&Ye(e)&&'none'===Ce.css(e,'display');
      },Ke=function (e,t,n,r){
        var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i;
      },Ze={};Ce.fn.extend({show:function (){
      return b(this,!0);
    },hide:function (){
      return b(this);
    },toggle:function (e){
      return'boolean'==typeof e?e?this.show():this.hide():this.each(function (){
        Je(this)?Ce(this).show():Ce(this).hide();
      });
    }});var et=/^(?:checkbox|radio)$/i,tt=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,nt=/^$|^module$|\/(?:java|ecma)script/i,rt={option:[1,'<select multiple=\'multiple\'>','</select>'],thead:[1,'<table>','</table>'],col:[2,'<table><colgroup>','</colgroup></table>'],tr:[2,'<table><tbody>','</tbody></table>'],td:[3,'<table><tbody><tr>','</tr></tbody></table>'],_default:[0,'','']};rt.optgroup=rt.option,rt.tbody=rt.tfoot=rt.colgroup=rt.caption=rt.thead,rt.th=rt.td;var it=/<|&#?\w+;/;!function (){
      var e=ue.createDocumentFragment(),t=e.appendChild(ue.createElement('div')),n=ue.createElement('input');n.setAttribute('type','radio'),n.setAttribute('checked','checked'),n.setAttribute('name','t'),t.appendChild(n),xe.checkClone=t.cloneNode(!0).cloneNode(!0).lastChild.checked,t.innerHTML='<textarea>x</textarea>',xe.noCloneChecked=!!t.cloneNode(!0).lastChild.defaultValue;
    }();var ot=/^key/,at=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,st=/^([^.]*)(?:\.(.+)|)/;Ce.event={global:{},add:function (e,t,n,r,i){
      var o,a,s,u,l,c,f,p,d,h,g,v=Fe.get(e);if(v)for(n.handler&&(o=n,n=o.handler,i=o.selector),i&&Ce.find.matchesSelector(Ge,i),n.guid||(n.guid=Ce.guid++),(u=v.events)||(u=v.events={}),(a=v.handle)||(a=v.handle=function (t){
        return void 0!==Ce&&Ce.event.triggered!==t.type?Ce.event.dispatch.apply(e,arguments):void 0;
      }),t=(t||'').match(Oe)||[''],l=t.length;l--;)s=st.exec(t[l])||[],d=g=s[1],h=(s[2]||'').split('.').sort(),d&&(f=Ce.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=Ce.event.special[d]||{},c=Ce.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&Ce.expr.match.needsContext.test(i),namespace:h.join('.')},o),(p=u[d])||(p=u[d]=[],p.delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),Ce.event.global[d]=!0);
    },remove:function (e,t,n,r,i){
      var o,a,s,u,l,c,f,p,d,h,g,v=Fe.hasData(e)&&Fe.get(e);if(v&&(u=v.events)){
        for(t=(t||'').match(Oe)||[''],l=t.length;l--;)if(s=st.exec(t[l])||[],d=g=s[1],h=(s[2]||'').split('.').sort(),d){
          for(f=Ce.event.special[d]||{},d=(r?f.delegateType:f.bindType)||d,p=u[d]||[],s=s[2]&&new RegExp(`(^|\\.)${h.join('\\.(?:.*\\.|)')}(\\.|$)`),a=o=p.length;o--;)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&('**'!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||Ce.removeEvent(e,d,v.handle),delete u[d]);
        }else for(d in u)Ce.event.remove(e,d+t[l],n,r,!0);Ce.isEmptyObject(u)&&Fe.remove(e,'handle events');
      }
    },dispatch:function (e){
      var t,n,r,i,o,a,s=Ce.event.fix(e),u=new Array(arguments.length),l=(Fe.get(this,'events')||{})[s.type]||[],c=Ce.event.special[s.type]||{};for(u[0]=s,t=1;t<arguments.length;t++)u[t]=arguments[t];if(s.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,s)){
        for(a=Ce.event.handlers.call(this,s,l),t=0;(i=a[t++])&&!s.isPropagationStopped();)for(s.currentTarget=i.elem,n=0;(o=i.handlers[n++])&&!s.isImmediatePropagationStopped();)s.rnamespace&&!1!==o.namespace&&!s.rnamespace.test(o.namespace)||(s.handleObj=o,s.data=o.data,void 0!==(r=((Ce.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,u))&&!1===(s.result=r)&&(s.preventDefault(),s.stopPropagation()));return c.postDispatch&&c.postDispatch.call(this,s),s.result;
      }
    },handlers:function (e,t){
      var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!('click'===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&('click'!==e.type||!0!==l.disabled)){
        for(o=[],a={},n=0;n<u;n++)r=t[n],i=`${r.selector} `,void 0===a[i]&&(a[i]=r.needsContext?Ce(i,this).index(l)>-1:Ce.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o});
      }return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s;
    },addProp:function (e,t){
      Object.defineProperty(Ce.Event.prototype,e,{enumerable:!0,configurable:!0,get:be(t)?function (){
        if(this.originalEvent)return t(this.originalEvent);
      }:function (){
        if(this.originalEvent)return this.originalEvent[e];
      },set:function (t){
        Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t});
      }});
    },fix:function (e){
      return e[Ce.expando]?e:new Ce.Event(e);
    },special:{load:{noBubble:!0},click:{setup:function (e){
      var t=this||e;return et.test(t.type)&&t.click&&o(t,'input')&&D(t,'click',E),!1;
    },trigger:function (e){
      var t=this||e;return et.test(t.type)&&t.click&&o(t,'input')&&D(t,'click'),!0;
    },_default:function (e){
      var t=e.target;return et.test(t.type)&&t.click&&o(t,'input')&&Fe.get(t,'click')||o(t,'a');
    }},beforeunload:{postDispatch:function (e){
      void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result);
    }}}},Ce.removeEvent=function (e,t,n){
      e.removeEventListener&&e.removeEventListener(t,n);
    },Ce.Event=function (e,t){
      if(!(this instanceof Ce.Event))return new Ce.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?E:k,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&Ce.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[Ce.expando]=!0;
    },Ce.Event.prototype={constructor:Ce.Event,isDefaultPrevented:k,isPropagationStopped:k,isImmediatePropagationStopped:k,isSimulated:!1,preventDefault:function (){
      var e=this.originalEvent;this.isDefaultPrevented=E,e&&!this.isSimulated&&e.preventDefault();
    },stopPropagation:function (){
      var e=this.originalEvent;this.isPropagationStopped=E,e&&!this.isSimulated&&e.stopPropagation();
    },stopImmediatePropagation:function (){
      var e=this.originalEvent;this.isImmediatePropagationStopped=E,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation();
    }},Ce.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function (e){
      var t=e.button;return null==e.which&&ot.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&at.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which;
    }},Ce.event.addProp),Ce.each({focus:'focusin',blur:'focusout'},function (e,t){
      Ce.event.special[e]={setup:function (){
        return D(this,e,S),!1;
      },trigger:function (){
        return D(this,e),!0;
      },delegateType:t};
    }),Ce.each({mouseenter:'mouseover',mouseleave:'mouseout',pointerenter:'pointerover',pointerleave:'pointerout'},function (e,t){
      Ce.event.special[e]={delegateType:t,bindType:t,handle:function (e){
        var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||Ce.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n;
      }};
    }),Ce.fn.extend({on:function (e,t,n,r){
      return A(this,e,t,n,r);
    },one:function (e,t,n,r){
      return A(this,e,t,n,r,1);
    },off:function (e,t,n){
      var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,Ce(e.delegateTarget).off(r.namespace?`${r.origType}.${r.namespace}`:r.origType,r.selector,r.handler),this;if('object'==typeof e){
        for(i in e)this.off(i,t,e[i]);return this;
      }return!1!==t&&'function'!=typeof t||(n=t,t=void 0),!1===n&&(n=k),this.each(function (){
        Ce.event.remove(this,e,n,t);
      });
    }});var ut=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,lt=/<script|<style|<link/i,ct=/checked\s*(?:[^=]|=\s*.checked.)/i,ft=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;Ce.extend({htmlPrefilter:function (e){
      return e.replace(ut,'<$1></$2>');
    },clone:function (e,t,n){
      var r,i,o,a,s=e.cloneNode(!0),u=Ye(e);if(!(xe.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||Ce.isXMLDoc(e)))for(a=w(s),o=w(e),r=0,i=o.length;r<i;r++)O(o[r],a[r]);if(t)if(n)for(o=o||w(e),a=a||w(s),r=0,i=o.length;r<i;r++)H(o[r],a[r]);else H(e,s);return a=w(s,'script'),a.length>0&&T(a,!u&&w(e,'script')),s;
    },cleanData:function (e){
      for(var t,n,r,i=Ce.event.special,o=0;void 0!==(n=e[o]);o++)if($e(n)){
        if(t=n[Fe.expando]){
          if(t.events)for(r in t.events)i[r]?Ce.event.remove(n,r):Ce.removeEvent(n,r,t.handle);n[Fe.expando]=void 0;
        }n[Be.expando]&&(n[Be.expando]=void 0);
      }
    }}),Ce.fn.extend({detach:function (e){
      return R(this,e,!0);
    },remove:function (e){
      return R(this,e);
    },text:function (e){
      return Me(this,function (e){
        return void 0===e?Ce.text(this):this.empty().each(function (){
          1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e);
        });
      },null,e,arguments.length);
    },append:function (){
      return P(this,arguments,function (e){
        if(1===this.nodeType||11===this.nodeType||9===this.nodeType){
          j(this,e).appendChild(e);
        }
      });
    },prepend:function (){
      return P(this,arguments,function (e){
        if(1===this.nodeType||11===this.nodeType||9===this.nodeType){
          var t=j(this,e);t.insertBefore(e,t.firstChild);
        }
      });
    },before:function (){
      return P(this,arguments,function (e){
        this.parentNode&&this.parentNode.insertBefore(e,this);
      });
    },after:function (){
      return P(this,arguments,function (e){
        this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling);
      });
    },empty:function (){
      for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(Ce.cleanData(w(e,!1)),e.textContent='');return this;
    },clone:function (e,t){
      return e=null!=e&&e,t=null==t?e:t,this.map(function (){
        return Ce.clone(this,e,t);
      });
    },html:function (e){
      return Me(this,function (e){
        var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if('string'==typeof e&&!lt.test(e)&&!rt[(tt.exec(e)||['',''])[1].toLowerCase()]){
          e=Ce.htmlPrefilter(e);try{
            for(;n<r;n++)t=this[n]||{},1===t.nodeType&&(Ce.cleanData(w(t,!1)),t.innerHTML=e);t=0;
          }catch(e){}
        }t&&this.empty().append(e);
      },null,e,arguments.length);
    },replaceWith:function (){
      var e=[];return P(this,arguments,function (t){
        var n=this.parentNode;Ce.inArray(this,e)<0&&(Ce.cleanData(w(this)),n&&n.replaceChild(t,this));
      },e);
    }}),Ce.each({appendTo:'append',prependTo:'prepend',insertBefore:'before',insertAfter:'after',replaceAll:'replaceWith'},function (e,t){
      Ce.fn[e]=function (e){
        for(var n,r=[],i=Ce(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),Ce(i[a])[t](n),pe.apply(r,n.get());return this.pushStack(r);
      };
    });var pt=new RegExp(`^(${Ue})(?!px)[a-z%]+$`,'i'),dt=function (t){
        var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t);
      },ht=new RegExp(Ve.join('|'),'i');!function (){
      function t(){
        if(l){
          u.style.cssText='position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0',l.style.cssText='position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%',Ge.appendChild(u).appendChild(l);var t=e.getComputedStyle(l);r='1%'!==t.top,s=12===n(t.marginLeft),l.style.right='60%',a=36===n(t.right),i=36===n(t.width),l.style.position='absolute',o=12===n(l.offsetWidth/3),Ge.removeChild(u),l=null;
        }
      }function n(e){
        return Math.round(parseFloat(e));
      }var r,i,o,a,s,u=ue.createElement('div'),l=ue.createElement('div');l.style&&(l.style.backgroundClip='content-box',l.cloneNode(!0).style.backgroundClip='',xe.clearCloneStyle='content-box'===l.style.backgroundClip,Ce.extend(xe,{boxSizingReliable:function (){
        return t(),i;
      },pixelBoxStyles:function (){
        return t(),a;
      },pixelPosition:function (){
        return t(),r;
      },reliableMarginLeft:function (){
        return t(),s;
      },scrollboxSize:function (){
        return t(),o;
      }}));
    }();var gt=['Webkit','Moz','ms'],vt=ue.createElement('div').style,yt={},mt=/^(none|table(?!-c[ea]).+)/,xt=/^--/,bt={position:'absolute',visibility:'hidden',display:'block'},wt={letterSpacing:'0',fontWeight:'400'};Ce.extend({cssHooks:{opacity:{get:function (e,t){
      if(t){
        var n=M(e,'opacity');return''===n?'1':n;
      }
    }}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function (e,t,n,r){
      if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){
        var i,o,a,s=h(t),u=xt.test(t),l=e.style;if(u||(t=$(s)),a=Ce.cssHooks[t]||Ce.cssHooks[s],void 0===n)return a&&'get'in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];o=typeof n,'string'===o&&(i=Xe.exec(n))&&i[1]&&(n=m(e,t,i),o='number'),null!=n&&n===n&&('number'!==o||u||(n+=i&&i[3]||(Ce.cssNumber[s]?'':'px')),xe.clearCloneStyle||''!==n||0!==t.indexOf('background')||(l[t]='inherit'),a&&'set'in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n));
      }
    },css:function (e,t,n,r){
      var i,o,a,s=h(t);return xt.test(t)||(t=$(s)),a=Ce.cssHooks[t]||Ce.cssHooks[s],a&&'get'in a&&(i=a.get(e,!0,n)),void 0===i&&(i=M(e,t,r)),'normal'===i&&t in wt&&(i=wt[t]),''===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i;
    }}),Ce.each(['height','width'],function (e,t){
      Ce.cssHooks[t]={get:function (e,n,r){
        if(n)return!mt.test(Ce.css(e,'display'))||e.getClientRects().length&&e.getBoundingClientRect().width?_(e,t,r):Ke(e,bt,function (){
          return _(e,t,r);
        });
      },set:function (e,n,r){
        var i,o=dt(e),a=!xe.scrollboxSize()&&'absolute'===o.position,s=a||r,u=s&&'border-box'===Ce.css(e,'boxSizing',!1,o),l=r?B(e,t,r,u,o):0;return u&&a&&(l-=Math.ceil(e[`offset${t[0].toUpperCase()}${t.slice(1)}`]-parseFloat(o[t])-B(e,t,'border',!1,o)-.5)),l&&(i=Xe.exec(n))&&'px'!==(i[3]||'px')&&(e.style[t]=n,n=Ce.css(e,t)),F(e,n,l);
      }};
    }),Ce.cssHooks.marginLeft=I(xe.reliableMarginLeft,function (e,t){
      if(t)return`${parseFloat(M(e,'marginLeft'))||e.getBoundingClientRect().left-Ke(e,{marginLeft:0},function (){
        return e.getBoundingClientRect().left;
      })}px`;
    }),Ce.each({margin:'',padding:'',border:'Width'},function (e,t){
      Ce.cssHooks[e+t]={expand:function (n){
        for(var r=0,i={},o='string'==typeof n?n.split(' '):[n];r<4;r++)i[e+Ve[r]+t]=o[r]||o[r-2]||o[0];return i;
      }},'margin'!==e&&(Ce.cssHooks[e+t].set=F);
    }),Ce.fn.extend({css:function (e,t){
      return Me(this,function (e,t,n){
        var r,i,o={},a=0;if(Array.isArray(t)){
          for(r=dt(e),i=t.length;a<i;a++)o[t[a]]=Ce.css(e,t[a],!1,r);return o;
        }return void 0!==n?Ce.style(e,t,n):Ce.css(e,t);
      },e,t,arguments.length>1);
    }}),Ce.Tween=z,z.prototype={constructor:z,init:function (e,t,n,r,i,o){
      this.elem=e,this.prop=n,this.easing=i||Ce.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(Ce.cssNumber[n]?'':'px');
    },cur:function (){
      var e=z.propHooks[this.prop];return e&&e.get?e.get(this):z.propHooks._default.get(this);
    },run:function (e){
      var t,n=z.propHooks[this.prop];return this.options.duration?this.pos=t=Ce.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):z.propHooks._default.set(this),this;
    }},z.prototype.init.prototype=z.prototype,z.propHooks={_default:{get:function (e){
      var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=Ce.css(e.elem,e.prop,''),t&&'auto'!==t?t:0);
    },set:function (e){
      Ce.fx.step[e.prop]?Ce.fx.step[e.prop](e):1!==e.elem.nodeType||!Ce.cssHooks[e.prop]&&null==e.elem.style[$(e.prop)]?e.elem[e.prop]=e.now:Ce.style(e.elem,e.prop,e.now+e.unit);
    }}},z.propHooks.scrollTop=z.propHooks.scrollLeft={set:function (e){
      e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now);
    }},Ce.easing={linear:function (e){
      return e;
    },swing:function (e){
      return.5-Math.cos(e*Math.PI)/2;
    },_default:'swing'},Ce.fx=z.prototype.init,Ce.fx.step={};var Tt,Ct,Et=/^(?:toggle|show|hide)$/,kt=/queueHooks$/;Ce.Animation=Ce.extend(J,{tweeners:{'*':[function (e,t){
      var n=this.createTween(e,t);return m(n.elem,e,Xe.exec(t),n),n;
    }]},tweener:function (e,t){
      be(e)?(t=e,e=['*']):e=e.match(Oe);for(var n,r=0,i=e.length;r<i;r++)n=e[r],J.tweeners[n]=J.tweeners[n]||[],J.tweeners[n].unshift(t);
    },prefilters:[Y],prefilter:function (e,t){
      t?J.prefilters.unshift(e):J.prefilters.push(e);
    }}),Ce.speed=function (e,t,n){
      var r=e&&'object'==typeof e?Ce.extend({},e):{complete:n||!n&&t||be(e)&&e,duration:e,easing:n&&t||t&&!be(t)&&t};return Ce.fx.off?r.duration=0:'number'!=typeof r.duration&&(r.duration in Ce.fx.speeds?r.duration=Ce.fx.speeds[r.duration]:r.duration=Ce.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue='fx'),r.old=r.complete,r.complete=function (){
        be(r.old)&&r.old.call(this),r.queue&&Ce.dequeue(this,r.queue);
      },r;
    },Ce.fn.extend({fadeTo:function (e,t,n,r){
      return this.filter(Je).css('opacity',0).show().end().animate({opacity:t},e,n,r);
    },animate:function (e,t,n,r){
      var i=Ce.isEmptyObject(e),o=Ce.speed(t,n,r),a=function (){
        var t=J(this,Ce.extend({},e),o);(i||Fe.get(this,'finish'))&&t.stop(!0);
      };return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a);
    },stop:function (e,t,n){
      var r=function (e){
        var t=e.stop;delete e.stop,t(n);
      };return'string'!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||'fx',[]),this.each(function (){
        var t=!0,i=null!=e&&`${e}queueHooks`,o=Ce.timers,a=Fe.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&kt.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||Ce.dequeue(this,e);
      });
    },finish:function (e){
      return!1!==e&&(e=e||'fx'),this.each(function (){
        var t,n=Fe.get(this),r=n[`${e}queue`],i=n[`${e}queueHooks`],o=Ce.timers,a=r?r.length:0;for(n.finish=!0,Ce.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish;
      });
    }}),Ce.each(['toggle','show','hide'],function (e,t){
      var n=Ce.fn[t];Ce.fn[t]=function (e,r,i){
        return null==e||'boolean'==typeof e?n.apply(this,arguments):this.animate(V(t,!0),e,r,i);
      };
    }),Ce.each({slideDown:V('show'),slideUp:V('hide'),slideToggle:V('toggle'),fadeIn:{opacity:'show'},fadeOut:{opacity:'hide'},fadeToggle:{opacity:'toggle'}},function (e,t){
      Ce.fn[e]=function (e,n,r){
        return this.animate(t,e,n,r);
      };
    }),Ce.timers=[],Ce.fx.tick=function (){
      var e,t=0,n=Ce.timers;for(Tt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||Ce.fx.stop(),Tt=void 0;
    },Ce.fx.timer=function (e){
      Ce.timers.push(e),Ce.fx.start();
    },Ce.fx.interval=13,Ce.fx.start=function (){
      Ct||(Ct=!0,U());
    },Ce.fx.stop=function (){
      Ct=null;
    },Ce.fx.speeds={slow:600,fast:200,_default:400},Ce.fn.delay=function (t,n){
      return t=Ce.fx?Ce.fx.speeds[t]||t:t,n=n||'fx',this.queue(n,function (n,r){
        var i=e.setTimeout(n,t);r.stop=function (){
          e.clearTimeout(i);
        };
      });
    },function (){
      var e=ue.createElement('input'),t=ue.createElement('select'),n=t.appendChild(ue.createElement('option'));e.type='checkbox',xe.checkOn=''!==e.value,xe.optSelected=n.selected,e=ue.createElement('input'),e.value='t',e.type='radio',xe.radioValue='t'===e.value;
    }();var St,Nt=Ce.expr.attrHandle;Ce.fn.extend({attr:function (e,t){
      return Me(this,Ce.attr,e,t,arguments.length>1);
    },removeAttr:function (e){
      return this.each(function (){
        Ce.removeAttr(this,e);
      });
    }}),Ce.extend({attr:function (e,t,n){
      var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return void 0===e.getAttribute?Ce.prop(e,t,n):(1===o&&Ce.isXMLDoc(e)||(i=Ce.attrHooks[t.toLowerCase()]||(Ce.expr.match.bool.test(t)?St:void 0)),void 0!==n?null===n?void Ce.removeAttr(e,t):i&&'set'in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,`${n}`),n):i&&'get'in i&&null!==(r=i.get(e,t))?r:(r=Ce.find.attr(e,t),null==r?void 0:r));
    },attrHooks:{type:{set:function (e,t){
      if(!xe.radioValue&&'radio'===t&&o(e,'input')){
        var n=e.value;return e.setAttribute('type',t),n&&(e.value=n),t;
      }
    }}},removeAttr:function (e,t){
      var n,r=0,i=t&&t.match(Oe);if(i&&1===e.nodeType)for(;n=i[r++];)e.removeAttribute(n);
    }}),St={set:function (e,t,n){
      return!1===t?Ce.removeAttr(e,n):e.setAttribute(n,n),n;
    }},Ce.each(Ce.expr.match.bool.source.match(/\w+/g),function (e,t){
      var n=Nt[t]||Ce.find.attr;Nt[t]=function (e,t,r){
        var i,o,a=t.toLowerCase();return r||(o=Nt[a],Nt[a]=i,i=null!=n(e,t,r)?a:null,Nt[a]=o),i;
      };
    });var At=/^(?:input|select|textarea|button)$/i,Dt=/^(?:a|area)$/i;Ce.fn.extend({prop:function (e,t){
      return Me(this,Ce.prop,e,t,arguments.length>1);
    },removeProp:function (e){
      return this.each(function (){
        delete this[Ce.propFix[e]||e];
      });
    }}),Ce.extend({prop:function (e,t,n){
      var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&Ce.isXMLDoc(e)||(t=Ce.propFix[t]||t,i=Ce.propHooks[t]),void 0!==n?i&&'set'in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&'get'in i&&null!==(r=i.get(e,t))?r:e[t];
    },propHooks:{tabIndex:{get:function (e){
      var t=Ce.find.attr(e,'tabindex');return t?parseInt(t,10):At.test(e.nodeName)||Dt.test(e.nodeName)&&e.href?0:-1;
    }}},propFix:{for:'htmlFor',class:'className'}}),xe.optSelected||(Ce.propHooks.selected={get:function (e){
      var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null;
    },set:function (e){
      var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex);
    }}),Ce.each(['tabIndex','readOnly','maxLength','cellSpacing','cellPadding','rowSpan','colSpan','useMap','frameBorder','contentEditable'],function (){
      Ce.propFix[this.toLowerCase()]=this;
    }),Ce.fn.extend({addClass:function (e){
      var t,n,r,i,o,a,s,u=0;if(be(e))return this.each(function (t){
        Ce(this).addClass(e.call(this,t,Z(this)));
      });if(t=ee(e),t.length)for(;n=this[u++];)if(i=Z(n),r=1===n.nodeType&&` ${K(i)} `){
        for(a=0;o=t[a++];)r.indexOf(` ${o} `)<0&&(r+=`${o} `);s=K(r),i!==s&&n.setAttribute('class',s);
      }return this;
    },removeClass:function (e){
      var t,n,r,i,o,a,s,u=0;if(be(e))return this.each(function (t){
        Ce(this).removeClass(e.call(this,t,Z(this)));
      });if(!arguments.length)return this.attr('class','');if(t=ee(e),t.length)for(;n=this[u++];)if(i=Z(n),r=1===n.nodeType&&` ${K(i)} `){
        for(a=0;o=t[a++];)for(;r.indexOf(` ${o} `)>-1;)r=r.replace(` ${o} `,' ');s=K(r),i!==s&&n.setAttribute('class',s);
      }return this;
    },toggleClass:function (e,t){
      var n=typeof e,r='string'===n||Array.isArray(e);return'boolean'==typeof t&&r?t?this.addClass(e):this.removeClass(e):be(e)?this.each(function (n){
        Ce(this).toggleClass(e.call(this,n,Z(this),t),t);
      }):this.each(function (){
        var t,i,o,a;if(r)for(i=0,o=Ce(this),a=ee(e);t=a[i++];)o.hasClass(t)?o.removeClass(t):o.addClass(t);else void 0!==e&&'boolean'!==n||(t=Z(this),t&&Fe.set(this,'__className__',t),this.setAttribute&&this.setAttribute('class',t||!1===e?'':Fe.get(this,'__className__')||''));
      });
    },hasClass:function (e){
      var t,n,r=0;for(t=` ${e} `;n=this[r++];)if(1===n.nodeType&&(` ${K(Z(n))} `).indexOf(t)>-1)return!0;return!1;
    }});var jt=/\r/g;Ce.fn.extend({val:function (e){
      var t,n,r,i=this[0];{if(arguments.length)return r=be(e),this.each(function (n){
        var i;1===this.nodeType&&(i=r?e.call(this,n,Ce(this).val()):e,null==i?i='':'number'==typeof i?i+='':Array.isArray(i)&&(i=Ce.map(i,function (e){
          return null==e?'':`${e}`;
        })),(t=Ce.valHooks[this.type]||Ce.valHooks[this.nodeName.toLowerCase()])&&'set'in t&&void 0!==t.set(this,i,'value')||(this.value=i));
      });if(i)return(t=Ce.valHooks[i.type]||Ce.valHooks[i.nodeName.toLowerCase()])&&'get'in t&&void 0!==(n=t.get(i,'value'))?n:(n=i.value,'string'==typeof n?n.replace(jt,''):null==n?'':n);}
    }}),Ce.extend({valHooks:{option:{get:function (e){
      var t=Ce.find.attr(e,'value');return null!=t?t:K(Ce.text(e));
    }},select:{get:function (e){
      var t,n,r,i=e.options,a=e.selectedIndex,s='select-one'===e.type,u=s?null:[],l=s?a+1:i.length;for(r=a<0?l:s?a:0;r<l;r++)if(n=i[r],(n.selected||r===a)&&!n.disabled&&(!n.parentNode.disabled||!o(n.parentNode,'optgroup'))){
        if(t=Ce(n).val(),s)return t;u.push(t);
      }return u;
    },set:function (e,t){
      for(var n,r,i=e.options,o=Ce.makeArray(t),a=i.length;a--;)r=i[a],(r.selected=Ce.inArray(Ce.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o;
    }}}}),Ce.each(['radio','checkbox'],function (){
      Ce.valHooks[this]={set:function (e,t){
        if(Array.isArray(t))return e.checked=Ce.inArray(Ce(e).val(),t)>-1;
      }},xe.checkOn||(Ce.valHooks[this].get=function (e){
        return null===e.getAttribute('value')?'on':e.value;
      });
    }),xe.focusin='onfocusin'in e;var qt=/^(?:focusinfocus|focusoutblur)$/,Lt=function (e){
      e.stopPropagation();
    };Ce.extend(Ce.event,{trigger:function (t,n,r,i){
      var o,a,s,u,l,c,f,p,d=[r||ue],h=ve.call(t,'type')?t.type:t,g=ve.call(t,'namespace')?t.namespace.split('.'):[];if(a=p=s=r=r||ue,3!==r.nodeType&&8!==r.nodeType&&!qt.test(h+Ce.event.triggered)&&(h.indexOf('.')>-1&&(g=h.split('.'),h=g.shift(),g.sort()),l=h.indexOf(':')<0&&`on${h}`,t=t[Ce.expando]?t:new Ce.Event(h,'object'==typeof t&&t),t.isTrigger=i?2:3,t.namespace=g.join('.'),t.rnamespace=t.namespace?new RegExp(`(^|\\.)${g.join('\\.(?:.*\\.|)')}(\\.|$)`):null,t.result=void 0,t.target||(t.target=r),n=null==n?[t]:Ce.makeArray(n,[t]),f=Ce.event.special[h]||{},i||!f.trigger||!1!==f.trigger.apply(r,n))){
        if(!i&&!f.noBubble&&!we(r)){
          for(u=f.delegateType||h,qt.test(u+h)||(a=a.parentNode);a;a=a.parentNode)d.push(a),s=a;s===(r.ownerDocument||ue)&&d.push(s.defaultView||s.parentWindow||e);
        }for(o=0;(a=d[o++])&&!t.isPropagationStopped();)p=a,t.type=o>1?u:f.bindType||h,c=(Fe.get(a,'events')||{})[t.type]&&Fe.get(a,'handle'),c&&c.apply(a,n),(c=l&&a[l])&&c.apply&&$e(a)&&(t.result=c.apply(a,n),!1===t.result&&t.preventDefault());return t.type=h,i||t.isDefaultPrevented()||f._default&&!1!==f._default.apply(d.pop(),n)||!$e(r)||l&&be(r[h])&&!we(r)&&(s=r[l],s&&(r[l]=null),Ce.event.triggered=h,t.isPropagationStopped()&&p.addEventListener(h,Lt),r[h](),t.isPropagationStopped()&&p.removeEventListener(h,Lt),Ce.event.triggered=void 0,s&&(r[l]=s)),t.result;
      }
    },simulate:function (e,t,n){
      var r=Ce.extend(new Ce.Event,n,{type:e,isSimulated:!0});Ce.event.trigger(r,null,t);
    }}),Ce.fn.extend({trigger:function (e,t){
      return this.each(function (){
        Ce.event.trigger(e,t,this);
      });
    },triggerHandler:function (e,t){
      var n=this[0];if(n)return Ce.event.trigger(e,t,n,!0);
    }}),xe.focusin||Ce.each({focus:'focusin',blur:'focusout'},function (e,t){
      var n=function (e){
        Ce.event.simulate(t,e.target,Ce.event.fix(e));
      };Ce.event.special[t]={setup:function (){
        var r=this.ownerDocument||this,i=Fe.access(r,t);i||r.addEventListener(e,n,!0),Fe.access(r,t,(i||0)+1);
      },teardown:function (){
        var r=this.ownerDocument||this,i=Fe.access(r,t)-1;i?Fe.access(r,t,i):(r.removeEventListener(e,n,!0),Fe.remove(r,t));
      }};
    });var Ht=e.location,Ot=Date.now(),Pt=/\?/;Ce.parseXML=function (t){
      var n;if(!t||'string'!=typeof t)return null;try{
        n=(new e.DOMParser).parseFromString(t,'text/xml');
      }catch(e){
        n=void 0;
      }return n&&!n.getElementsByTagName('parsererror').length||Ce.error(`Invalid XML: ${t}`),n;
    };var Rt=/\[\]$/,Mt=/\r?\n/g,It=/^(?:submit|button|image|reset|file)$/i,Wt=/^(?:input|select|textarea|keygen)/i;Ce.param=function (e,t){
      var n,r=[],i=function (e,t){
        var n=be(t)?t():t;r[r.length]=`${encodeURIComponent(e)}=${encodeURIComponent(null==n?'':n)}`;
      };if(null==e)return'';if(Array.isArray(e)||e.jquery&&!Ce.isPlainObject(e))Ce.each(e,function (){
        i(this.name,this.value);
      });else for(n in e)te(n,e[n],t,i);return r.join('&');
    },Ce.fn.extend({serialize:function (){
      return Ce.param(this.serializeArray());
    },serializeArray:function (){
      return this.map(function (){
        var e=Ce.prop(this,'elements');return e?Ce.makeArray(e):this;
      }).filter(function (){
        var e=this.type;return this.name&&!Ce(this).is(':disabled')&&Wt.test(this.nodeName)&&!It.test(e)&&(this.checked||!et.test(e));
      }).map(function (e,t){
        var n=Ce(this).val();return null==n?null:Array.isArray(n)?Ce.map(n,function (e){
          return{name:t.name,value:e.replace(Mt,'\r\n')};
        }):{name:t.name,value:n.replace(Mt,'\r\n')};
      }).get();
    }});var $t=/%20/g,Ft=/#.*$/,Bt=/([?&])_=[^&]*/,_t=/^(.*?):[ \t]*([^\r\n]*)$/gm,zt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Ut=/^(?:GET|HEAD)$/,Xt=/^\/\//,Vt={},Gt={},Yt='*/'.concat('*'),Qt=ue.createElement('a');Qt.href=Ht.href,Ce.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ht.href,type:'GET',isLocal:zt.test(Ht.protocol),global:!0,processData:!0,async:!0,contentType:'application/x-www-form-urlencoded; charset=UTF-8',accepts:{'*':Yt,text:'text/plain',html:'text/html',xml:'application/xml, text/xml',json:'application/json, text/javascript'},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:'responseXML',text:'responseText',json:'responseJSON'},converters:{'* text':String,'text html':!0,'text json':JSON.parse,'text xml':Ce.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function (e,t){
      return t?ie(ie(e,Ce.ajaxSettings),t):ie(Ce.ajaxSettings,e);
    },ajaxPrefilter:ne(Vt),ajaxTransport:ne(Gt),ajax:function (t,n){
      function r(t,n,r,s){
        var l,p,d,b,w,T=n;c||(c=!0,u&&e.clearTimeout(u),i=void 0,a=s||'',C.readyState=t>0?4:0,l=t>=200&&t<300||304===t,r&&(b=oe(h,C,r)),b=ae(h,b,C,l),l?(h.ifModified&&(w=C.getResponseHeader('Last-Modified'),w&&(Ce.lastModified[o]=w),(w=C.getResponseHeader('etag'))&&(Ce.etag[o]=w)),204===t||'HEAD'===h.type?T='nocontent':304===t?T='notmodified':(T=b.state,p=b.data,d=b.error,l=!d)):(d=T,!t&&T||(T='error',t<0&&(t=0))),C.status=t,C.statusText=`${n||T}`,l?y.resolveWith(g,[p,T,C]):y.rejectWith(g,[C,T,d]),C.statusCode(x),x=void 0,f&&v.trigger(l?'ajaxSuccess':'ajaxError',[C,h,l?p:d]),m.fireWith(g,[C,T]),f&&(v.trigger('ajaxComplete',[C,h]),--Ce.active||Ce.event.trigger('ajaxStop')));
      }'object'==typeof t&&(n=t,t=void 0),n=n||{};var i,o,a,s,u,l,c,f,p,d,h=Ce.ajaxSetup({},n),g=h.context||h,v=h.context&&(g.nodeType||g.jquery)?Ce(g):Ce.event,y=Ce.Deferred(),m=Ce.Callbacks('once memory'),x=h.statusCode||{},b={},w={},T='canceled',C={readyState:0,getResponseHeader:function (e){
        var t;if(c){
          if(!s)for(s={};t=_t.exec(a);)s[`${t[1].toLowerCase()} `]=(s[`${t[1].toLowerCase()} `]||[]).concat(t[2]);t=s[`${e.toLowerCase()} `];
        }return null==t?null:t.join(', ');
      },getAllResponseHeaders:function (){
        return c?a:null;
      },setRequestHeader:function (e,t){
        return null==c&&(e=w[e.toLowerCase()]=w[e.toLowerCase()]||e,b[e]=t),this;
      },overrideMimeType:function (e){
        return null==c&&(h.mimeType=e),this;
      },statusCode:function (e){
        var t;if(e)if(c)C.always(e[C.status]);else for(t in e)x[t]=[x[t],e[t]];return this;
      },abort:function (e){
        var t=e||T;return i&&i.abort(t),r(0,t),this;
      }};if(y.promise(C),h.url=(`${t||h.url||Ht.href}`).replace(Xt,`${Ht.protocol}//`),h.type=n.method||n.type||h.method||h.type,h.dataTypes=(h.dataType||'*').toLowerCase().match(Oe)||[''],null==h.crossDomain){
        l=ue.createElement('a');try{
          l.href=h.url,l.href=l.href,h.crossDomain=`${Qt.protocol}//${Qt.host}`!=`${l.protocol}//${l.host}`;
        }catch(e){
          h.crossDomain=!0;
        }
      }if(h.data&&h.processData&&'string'!=typeof h.data&&(h.data=Ce.param(h.data,h.traditional)),re(Vt,h,n,C),c)return C;f=Ce.event&&h.global,f&&0==Ce.active++&&Ce.event.trigger('ajaxStart'),h.type=h.type.toUpperCase(),h.hasContent=!Ut.test(h.type),o=h.url.replace(Ft,''),h.hasContent?h.data&&h.processData&&0===(h.contentType||'').indexOf('application/x-www-form-urlencoded')&&(h.data=h.data.replace($t,'+')):(d=h.url.slice(o.length),h.data&&(h.processData||'string'==typeof h.data)&&(o+=(Pt.test(o)?'&':'?')+h.data,delete h.data),!1===h.cache&&(o=o.replace(Bt,'$1'),d=`${Pt.test(o)?'&':'?'}_=${Ot++}${d}`),h.url=o+d),h.ifModified&&(Ce.lastModified[o]&&C.setRequestHeader('If-Modified-Since',Ce.lastModified[o]),Ce.etag[o]&&C.setRequestHeader('If-None-Match',Ce.etag[o])),(h.data&&h.hasContent&&!1!==h.contentType||n.contentType)&&C.setRequestHeader('Content-Type',h.contentType),C.setRequestHeader('Accept',h.dataTypes[0]&&h.accepts[h.dataTypes[0]]?h.accepts[h.dataTypes[0]]+('*'!==h.dataTypes[0]?`, ${Yt}; q=0.01`:''):h.accepts['*']);for(p in h.headers)C.setRequestHeader(p,h.headers[p]);if(h.beforeSend&&(!1===h.beforeSend.call(g,C,h)||c))return C.abort();if(T='abort',m.add(h.complete),C.done(h.success),C.fail(h.error),i=re(Gt,h,n,C)){
        if(C.readyState=1,f&&v.trigger('ajaxSend',[C,h]),c)return C;h.async&&h.timeout>0&&(u=e.setTimeout(function (){
          C.abort('timeout');
        },h.timeout));try{
          c=!1,i.send(b,r);
        }catch(e){
          if(c)throw e;r(-1,e);
        }
      }else r(-1,'No Transport');return C;
    },getJSON:function (e,t,n){
      return Ce.get(e,t,n,'json');
    },getScript:function (e,t){
      return Ce.get(e,void 0,t,'script');
    }}),Ce.each(['get','post'],function (e,t){
      Ce[t]=function (e,n,r,i){
        return be(n)&&(i=i||r,r=n,n=void 0),Ce.ajax(Ce.extend({url:e,type:t,dataType:i,data:n,success:r},Ce.isPlainObject(e)&&e));
      };
    }),Ce._evalUrl=function (e,t){
      return Ce.ajax({url:e,type:'GET',dataType:'script',cache:!0,async:!1,global:!1,converters:{'text script':function (){}},dataFilter:function (e){
        Ce.globalEval(e,t);
      }});
    },Ce.fn.extend({wrapAll:function (e){
      var t;return this[0]&&(be(e)&&(e=e.call(this[0])),t=Ce(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function (){
        for(var e=this;e.firstElementChild;)e=e.firstElementChild;return e;
      }).append(this)),this;
    },wrapInner:function (e){
      return be(e)?this.each(function (t){
        Ce(this).wrapInner(e.call(this,t));
      }):this.each(function (){
        var t=Ce(this),n=t.contents();n.length?n.wrapAll(e):t.append(e);
      });
    },wrap:function (e){
      var t=be(e);return this.each(function (n){
        Ce(this).wrapAll(t?e.call(this,n):e);
      });
    },unwrap:function (e){
      return this.parent(e).not('body').each(function (){
        Ce(this).replaceWith(this.childNodes);
      }),this;
    }}),Ce.expr.pseudos.hidden=function (e){
      return!Ce.expr.pseudos.visible(e);
    },Ce.expr.pseudos.visible=function (e){
      return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length);
    },Ce.ajaxSettings.xhr=function (){
      try{
        return new e.XMLHttpRequest;
      }catch(e){}
    };var Jt={0:200,1223:204},Kt=Ce.ajaxSettings.xhr();xe.cors=!!Kt&&'withCredentials'in Kt,xe.ajax=Kt=!!Kt,Ce.ajaxTransport(function (t){
      var n,r;if(xe.cors||Kt&&!t.crossDomain)return{send:function (i,o){
        var a,s=t.xhr();if(s.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(a in t.xhrFields)s[a]=t.xhrFields[a];t.mimeType&&s.overrideMimeType&&s.overrideMimeType(t.mimeType),t.crossDomain||i['X-Requested-With']||(i['X-Requested-With']='XMLHttpRequest');for(a in i)s.setRequestHeader(a,i[a]);n=function (e){
          return function (){
            n&&(n=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,'abort'===e?s.abort():'error'===e?'number'!=typeof s.status?o(0,'error'):o(s.status,s.statusText):o(Jt[s.status]||s.status,s.statusText,'text'!==(s.responseType||'text')||'string'!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()));
          };
        },s.onload=n(),r=s.onerror=s.ontimeout=n('error'),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function (){
          4===s.readyState&&e.setTimeout(function (){
            n&&r();
          });
        },n=n('abort');try{
          s.send(t.hasContent&&t.data||null);
        }catch(e){
          if(n)throw e;
        }
      },abort:function (){
        n&&n();
      }};
    }),Ce.ajaxPrefilter(function (e){
      e.crossDomain&&(e.contents.script=!1);
    }),Ce.ajaxSetup({accepts:{script:'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'},contents:{script:/\b(?:java|ecma)script\b/},converters:{'text script':function (e){
      return Ce.globalEval(e),e;
    }}}),Ce.ajaxPrefilter('script',function (e){
      void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type='GET');
    }),Ce.ajaxTransport('script',function (e){
      if(e.crossDomain||e.scriptAttrs){
        var t,n;return{send:function (r,i){
          t=Ce('<script>').attr(e.scriptAttrs||{}).prop({charset:e.scriptCharset,src:e.url}).on('load error',n=function (e){
            t.remove(),n=null,e&&i('error'===e.type?404:200,e.type);
          }),ue.head.appendChild(t[0]);
        },abort:function (){
          n&&n();
        }};
      }
    });var Zt=[],en=/(=)\?(?=&|$)|\?\?/;Ce.ajaxSetup({jsonp:'callback',jsonpCallback:function (){
      var e=Zt.pop()||`${Ce.expando}_${Ot++}`;return this[e]=!0,e;
    }}),Ce.ajaxPrefilter('json jsonp',function (t,n,r){
      var i,o,a,s=!1!==t.jsonp&&(en.test(t.url)?'url':'string'==typeof t.data&&0===(t.contentType||'').indexOf('application/x-www-form-urlencoded')&&en.test(t.data)&&'data');if(s||'jsonp'===t.dataTypes[0])return i=t.jsonpCallback=be(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(en,`$1${i}`):!1!==t.jsonp&&(t.url+=`${(Pt.test(t.url)?'&':'?')+t.jsonp}=${i}`),t.converters['script json']=function (){
        return a||Ce.error(`${i} was not called`),a[0];
      },t.dataTypes[0]='json',o=e[i],e[i]=function (){
          a=arguments;
        },r.always(function (){
          void 0===o?Ce(e).removeProp(i):e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,Zt.push(i)),a&&be(o)&&o(a[0]),a=o=void 0;
        }),'script';
    }),xe.createHTMLDocument=function (){
      var e=ue.implementation.createHTMLDocument('').body;return e.innerHTML='<form></form><form></form>',2===e.childNodes.length;
    }(),Ce.parseHTML=function (e,t,n){
      if('string'!=typeof e)return[];'boolean'==typeof t&&(n=t,t=!1);var r,i,o;return t||(xe.createHTMLDocument?(t=ue.implementation.createHTMLDocument(''),r=t.createElement('base'),r.href=ue.location.href,t.head.appendChild(r)):t=ue),i=De.exec(e),o=!n&&[],i?[t.createElement(i[1])]:(i=C([e],t,o),o&&o.length&&Ce(o).remove(),Ce.merge([],i.childNodes));
    },Ce.fn.load=function (e,t,n){
      var r,i,o,a=this,s=e.indexOf(' ');return s>-1&&(r=K(e.slice(s)),e=e.slice(0,s)),be(t)?(n=t,t=void 0):t&&'object'==typeof t&&(i='POST'),a.length>0&&Ce.ajax({url:e,type:i||'GET',dataType:'html',data:t}).done(function (e){
        o=arguments,a.html(r?Ce('<div>').append(Ce.parseHTML(e)).find(r):e);
      }).always(n&&function (e,t){
        a.each(function (){
          n.apply(this,o||[e.responseText,t,e]);
        });
      }),this;
    },Ce.each(['ajaxStart','ajaxStop','ajaxComplete','ajaxError','ajaxSuccess','ajaxSend'],function (e,t){
      Ce.fn[t]=function (e){
        return this.on(t,e);
      };
    }),Ce.expr.pseudos.animated=function (e){
      return Ce.grep(Ce.timers,function (t){
        return e===t.elem;
      }).length;
    },Ce.offset={setOffset:function (e,t,n){
      var r,i,o,a,s,u,l,c=Ce.css(e,'position'),f=Ce(e),p={};'static'===c&&(e.style.position='relative'),s=f.offset(),o=Ce.css(e,'top'),u=Ce.css(e,'left'),l=('absolute'===c||'fixed'===c)&&(o+u).indexOf('auto')>-1,l?(r=f.position(),a=r.top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),be(t)&&(t=t.call(e,n,Ce.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),'using'in t?t.using.call(e,p):f.css(p);
    }},Ce.fn.extend({offset:function (e){
      if(arguments.length)return void 0===e?this:this.each(function (t){
        Ce.offset.setOffset(this,e,t);
      });var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0};
    },position:function (){
      if(this[0]){
        var e,t,n,r=this[0],i={top:0,left:0};if('fixed'===Ce.css(r,'position'))t=r.getBoundingClientRect();else{
          for(t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;e&&(e===n.body||e===n.documentElement)&&'static'===Ce.css(e,'position');)e=e.parentNode;e&&e!==r&&1===e.nodeType&&(i=Ce(e).offset(),i.top+=Ce.css(e,'borderTopWidth',!0),i.left+=Ce.css(e,'borderLeftWidth',!0));
        }return{top:t.top-i.top-Ce.css(r,'marginTop',!0),left:t.left-i.left-Ce.css(r,'marginLeft',!0)};
      }
    },offsetParent:function (){
      return this.map(function (){
        for(var e=this.offsetParent;e&&'static'===Ce.css(e,'position');)e=e.offsetParent;return e||Ge;
      });
    }}),Ce.each({scrollLeft:'pageXOffset',scrollTop:'pageYOffset'},function (e,t){
      var n='pageYOffset'===t;Ce.fn[e]=function (r){
        return Me(this,function (e,r,i){
          var o;if(we(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i;
        },e,r,arguments.length);
      };
    }),Ce.each(['top','left'],function (e,t){
      Ce.cssHooks[t]=I(xe.pixelPosition,function (e,n){
        if(n)return n=M(e,t),pt.test(n)?`${Ce(e).position()[t]}px`:n;
      });
    }),Ce.each({Height:'height',Width:'width'},function (e,t){
      Ce.each({padding:`inner${e}`,content:t,'':`outer${e}`},function (n,r){
        Ce.fn[r]=function (i,o){
          var a=arguments.length&&(n||'boolean'!=typeof i),s=n||(!0===i||!0===o?'margin':'border');return Me(this,function (t,n,i){
            var o;return we(t)?0===r.indexOf('outer')?t[`inner${e}`]:t.document.documentElement[`client${e}`]:9===t.nodeType?(o=t.documentElement,Math.max(t.body[`scroll${e}`],o[`scroll${e}`],t.body[`offset${e}`],o[`offset${e}`],o[`client${e}`])):void 0===i?Ce.css(t,n,s):Ce.style(t,n,i,s);
          },t,a?i:void 0,a);
        };
      });
    }),Ce.each('blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu'.split(' '),function (e,t){
      Ce.fn[t]=function (e,n){
        return arguments.length>0?this.on(t,null,e,n):this.trigger(t);
      };
    }),Ce.fn.extend({hover:function (e,t){
      return this.mouseenter(e).mouseleave(t||e);
    }}),Ce.fn.extend({bind:function (e,t,n){
      return this.on(e,null,t,n);
    },unbind:function (e,t){
      return this.off(e,null,t);
    },delegate:function (e,t,n,r){
      return this.on(t,e,n,r);
    },undelegate:function (e,t,n){
      return 1===arguments.length?this.off(e,'**'):this.off(t,e||'**',n);
    }}),Ce.proxy=function (e,t){
      var n,r,i;if('string'==typeof t&&(n=e[t],t=e,e=n),be(e))return r=ce.call(arguments,2),i=function (){
        return e.apply(t||this,r.concat(ce.call(arguments)));
      },i.guid=e.guid=e.guid||Ce.guid++,i;
    },Ce.holdReady=function (e){
      e?Ce.readyWait++:Ce.ready(!0);
    },Ce.isArray=Array.isArray,Ce.parseJSON=JSON.parse,Ce.nodeName=o,Ce.isFunction=be,Ce.isWindow=we,Ce.camelCase=h,Ce.type=r,Ce.now=Date.now,Ce.isNumeric=function (e){
      var t=Ce.type(e);return('number'===t||'string'===t)&&!isNaN(e-parseFloat(e));
    },'function'==typeof define&&define.amd&&define('jquery',[],function (){
      return Ce;
    });var tn=e.jQuery,nn=e.$;return Ce.noConflict=function (t){
      return e.$===Ce&&(e.$=nn),t&&e.jQuery===Ce&&(e.jQuery=tn),Ce;
    },t||(e.jQuery=e.$=Ce),Ce;
  });
},{}],86:[function (require,module,exports){
  (function (global){
    (function (){
      function n(n,t,r){
        switch(r.length){
        case 0:return n.call(t);case 1:return n.call(t,r[0]);case 2:return n.call(t,r[0],r[1]);case 3:return n.call(t,r[0],r[1],r[2]);
        }return n.apply(t,r);
      }function t(n,t,r,e){
        for(var u=-1,i=null==n?0:n.length;++u<i;){
          var o=n[u];t(e,o,r(o),n);
        }return e;
      }function r(n,t){
        for(var r=-1,e=null==n?0:n.length;++r<e&&!1!==t(n[r],r,n););return n;
      }function e(n,t){
        for(var r=null==n?0:n.length;r--&&!1!==t(n[r],r,n););return n;
      }function u(n,t){
        for(var r=-1,e=null==n?0:n.length;++r<e;)if(!t(n[r],r,n))return!1;return!0;
      }function i(n,t){
        for(var r=-1,e=null==n?0:n.length,u=0,i=[];++r<e;){
          var o=n[r];t(o,r,n)&&(i[u++]=o);
        }return i;
      }function o(n,t){
        return!!(null==n?0:n.length)&&y(n,t,0)>-1;
      }function f(n,t,r){
        for(var e=-1,u=null==n?0:n.length;++e<u;)if(r(t,n[e]))return!0;return!1;
      }function c(n,t){
        for(var r=-1,e=null==n?0:n.length,u=Array(e);++r<e;)u[r]=t(n[r],r,n);return u;
      }function a(n,t){
        for(var r=-1,e=t.length,u=n.length;++r<e;)n[u+r]=t[r];return n;
      }function l(n,t,r,e){
        var u=-1,i=null==n?0:n.length;for(e&&i&&(r=n[++u]);++u<i;)r=t(r,n[u],u,n);return r;
      }function s(n,t,r,e){
        var u=null==n?0:n.length;for(e&&u&&(r=n[--u]);u--;)r=t(r,n[u],u,n);return r;
      }function h(n,t){
        for(var r=-1,e=null==n?0:n.length;++r<e;)if(t(n[r],r,n))return!0;return!1;
      }function p(n){
        return n.split('');
      }function _(n){
        return n.match(Wt)||[];
      }function v(n,t,r){
        var e;return r(n,function (n,r,u){
          if(t(n,r,u))return e=r,!1;
        }),e;
      }function g(n,t,r,e){
        for(var u=n.length,i=r+(e?1:-1);e?i--:++i<u;)if(t(n[i],i,n))return i;return-1;
      }function y(n,t,r){
        return t===t?q(n,t,r):g(n,b,r);
      }function d(n,t,r,e){
        for(var u=r-1,i=n.length;++u<i;)if(e(n[u],t))return u;return-1;
      }function b(n){
        return n!==n;
      }function w(n,t){
        var r=null==n?0:n.length;return r?k(n,t)/r:zn;
      }function m(n){
        return function (t){
          return null==t?Y:t[n];
        };
      }function x(n){
        return function (t){
          return null==n?Y:n[t];
        };
      }function j(n,t,r,e,u){
        return u(n,function (n,u,i){
          r=e?(e=!1,n):t(r,n,u,i);
        }),r;
      }function A(n,t){
        var r=n.length;for(n.sort(t);r--;)n[r]=n[r].value;return n;
      }function k(n,t){
        for(var r,e=-1,u=n.length;++e<u;){
          var i=t(n[e]);i!==Y&&(r=r===Y?i:r+i);
        }return r;
      }function O(n,t){
        for(var r=-1,e=Array(n);++r<n;)e[r]=t(r);return e;
      }function I(n,t){
        return c(t,function (t){
          return[t,n[t]];
        });
      }function R(n){
        return function (t){
          return n(t);
        };
      }function z(n,t){
        return c(t,function (t){
          return n[t];
        });
      }function E(n,t){
        return n.has(t);
      }function S(n,t){
        for(var r=-1,e=n.length;++r<e&&y(t,n[r],0)>-1;);return r;
      }function L(n,t){
        for(var r=n.length;r--&&y(t,n[r],0)>-1;);return r;
      }function W(n,t){
        for(var r=n.length,e=0;r--;)n[r]===t&&++e;return e;
      }function C(n){
        return`\\${wr[n]}`;
      }function U(n,t){
        return null==n?Y:n[t];
      }function B(n){
        return sr.test(n);
      }function T(n){
        return hr.test(n);
      }function $(n){
        for(var t,r=[];!(t=n.next()).done;)r.push(t.value);return r;
      }function D(n){
        var t=-1,r=Array(n.size);return n.forEach(function (n,e){
          r[++t]=[e,n];
        }),r;
      }function M(n,t){
        return function (r){
          return n(t(r));
        };
      }function F(n,t){
        for(var r=-1,e=n.length,u=0,i=[];++r<e;){
          var o=n[r];o!==t&&o!==en||(n[r]=en,i[u++]=r);
        }return i;
      }function N(n){
        var t=-1,r=Array(n.size);return n.forEach(function (n){
          r[++t]=n;
        }),r;
      }function P(n){
        var t=-1,r=Array(n.size);return n.forEach(function (n){
          r[++t]=[n,n];
        }),r;
      }function q(n,t,r){
        for(var e=r-1,u=n.length;++e<u;)if(n[e]===t)return e;return-1;
      }function Z(n,t,r){
        for(var e=r+1;e--;)if(n[e]===t)return e;return e;
      }function K(n){
        return B(n)?G(n):Tr(n);
      }function V(n){
        return B(n)?H(n):p(n);
      }function G(n){
        for(var t=ar.lastIndex=0;ar.test(n);)++t;return t;
      }function H(n){
        return n.match(ar)||[];
      }function J(n){
        return n.match(lr)||[];
      }var Y,Q=200,X='Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',nn='Expected a function',tn='__lodash_hash_undefined__',rn=500,en='__lodash_placeholder__',un=1,on=2,fn=4,cn=1,an=2,ln=1,sn=2,hn=4,pn=8,_n=16,vn=32,gn=64,yn=128,dn=256,bn=512,wn=30,mn='...',xn=800,jn=16,An=1,kn=2,On=1/0,In=9007199254740991,Rn=1.7976931348623157e308,zn=NaN,En=4294967295,Sn=En-1,Ln=En>>>1,Wn=[['ary',yn],['bind',ln],['bindKey',sn],['curry',pn],['curryRight',_n],['flip',bn],['partial',vn],['partialRight',gn],['rearg',dn]],Cn='[object Arguments]',Un='[object Array]',Bn='[object AsyncFunction]',Tn='[object Boolean]',$n='[object Date]',Dn='[object DOMException]',Mn='[object Error]',Fn='[object Function]',Nn='[object GeneratorFunction]',Pn='[object Map]',qn='[object Number]',Zn='[object Null]',Kn='[object Object]',Vn='[object Proxy]',Gn='[object RegExp]',Hn='[object Set]',Jn='[object String]',Yn='[object Symbol]',Qn='[object Undefined]',Xn='[object WeakMap]',nt='[object WeakSet]',tt='[object ArrayBuffer]',rt='[object DataView]',et='[object Float32Array]',ut='[object Float64Array]',it='[object Int8Array]',ot='[object Int16Array]',ft='[object Int32Array]',ct='[object Uint8Array]',at='[object Uint8ClampedArray]',lt='[object Uint16Array]',st='[object Uint32Array]',ht=/\b__p \+= '';/g,pt=/\b(__p \+=) '' \+/g,_t=/(__e\(.*?\)|\b__t\)) \+\n'';/g,vt=/&(?:amp|lt|gt|quot|#39);/g,gt=/[&<>"']/g,yt=RegExp(vt.source),dt=RegExp(gt.source),bt=/<%-([\s\S]+?)%>/g,wt=/<%([\s\S]+?)%>/g,mt=/<%=([\s\S]+?)%>/g,xt=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,jt=/^\w*$/,At=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,kt=/[\\^$.*+?()[\]{}|]/g,Ot=RegExp(kt.source),It=/^\s+|\s+$/g,Rt=/^\s+/,zt=/\s+$/,Et=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,St=/\{\n\/\* \[wrapped with (.+)\] \*/,Lt=/,? & /,Wt=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,Ct=/\\(\\)?/g,Ut=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Bt=/\w*$/,Tt=/^[-+]0x[0-9a-f]+$/i,$t=/^0b[01]+$/i,Dt=/^\[object .+?Constructor\]$/,Mt=/^0o[0-7]+$/i,Ft=/^(?:0|[1-9]\d*)$/,Nt=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Pt=/($^)/,qt=/['\n\r\u2028\u2029\\]/g,Zt='\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff',Kt='\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',Vt=`[${Kt}]`,Gt=`[${Zt}]`,Ht='[a-z\\xdf-\\xf6\\xf8-\\xff]',Jt=`[^\\ud800-\\udfff${Kt}\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]`,Yt='\\ud83c[\\udffb-\\udfff]',Qt='(?:\\ud83c[\\udde6-\\uddff]){2}',Xt='[\\ud800-\\udbff][\\udc00-\\udfff]',nr='[A-Z\\xc0-\\xd6\\xd8-\\xde]',tr=`(?:${Ht}|${Jt})`,rr='(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?',er=`(?:\\u200d(?:${['[^\\ud800-\\udfff]',Qt,Xt].join('|')})[\\ufe0e\\ufe0f]?${rr})*`,ur=`[\\ufe0e\\ufe0f]?${rr}${er}`,ir=`(?:${['[\\u2700-\\u27bf]',Qt,Xt].join('|')})${ur}`,or=`(?:${[`[^\\ud800-\\udfff]${Gt}?`,Gt,Qt,Xt,'[\\ud800-\\udfff]'].join('|')})`,fr=RegExp('[\'’]','g'),cr=RegExp(Gt,'g'),ar=RegExp(`${Yt}(?=${Yt})|${or}${ur}`,'g'),lr=RegExp([`${nr}?${Ht}+(?:['’](?:d|ll|m|re|s|t|ve))?(?=${[Vt,nr,'$'].join('|')})`,`(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=${[Vt,nr+tr,'$'].join('|')})`,`${nr}?${tr}+(?:['’](?:d|ll|m|re|s|t|ve))?`,`${nr}+(?:['’](?:D|LL|M|RE|S|T|VE))?`,'\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])','\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])','\\d+',ir].join('|'),'g'),sr=RegExp(`[\\u200d\\ud800-\\udfff${Zt}\\ufe0e\\ufe0f]`),hr=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,pr=['Array','Buffer','DataView','Date','Error','Float32Array','Float64Array','Function','Int8Array','Int16Array','Int32Array','Map','Math','Object','Promise','RegExp','Set','String','Symbol','TypeError','Uint8Array','Uint8ClampedArray','Uint16Array','Uint32Array','WeakMap','_','clearTimeout','isFinite','parseInt','setTimeout'],_r=-1,vr={};vr[et]=vr[ut]=vr[it]=vr[ot]=vr[ft]=vr[ct]=vr[at]=vr[lt]=vr[st]=!0,vr[Cn]=vr[Un]=vr[tt]=vr[Tn]=vr[rt]=vr[$n]=vr[Mn]=vr[Fn]=vr[Pn]=vr[qn]=vr[Kn]=vr[Gn]=vr[Hn]=vr[Jn]=vr[Xn]=!1;var gr={};gr[Cn]=gr[Un]=gr[tt]=gr[rt]=gr[Tn]=gr[$n]=gr[et]=gr[ut]=gr[it]=gr[ot]=gr[ft]=gr[Pn]=gr[qn]=gr[Kn]=gr[Gn]=gr[Hn]=gr[Jn]=gr[Yn]=gr[ct]=gr[at]=gr[lt]=gr[st]=!0,gr[Mn]=gr[Fn]=gr[Xn]=!1;var yr={'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','Ç':'C','ç':'c','Ð':'D','ð':'d','È':'E','É':'E','Ê':'E','Ë':'E','è':'e','é':'e','ê':'e','ë':'e','Ì':'I','Í':'I','Î':'I','Ï':'I','ì':'i','í':'i','î':'i','ï':'i','Ñ':'N','ñ':'n','Ò':'O','Ó':'O','Ô':'O','Õ':'O','Ö':'O','Ø':'O','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ø':'o','Ù':'U','Ú':'U','Û':'U','Ü':'U','ù':'u','ú':'u','û':'u','ü':'u','Ý':'Y','ý':'y','ÿ':'y','Æ':'Ae','æ':'ae','Þ':'Th','þ':'th','ß':'ss','Ā':'A','Ă':'A','Ą':'A','ā':'a','ă':'a','ą':'a','Ć':'C','Ĉ':'C','Ċ':'C','Č':'C','ć':'c','ĉ':'c','ċ':'c','č':'c','Ď':'D','Đ':'D','ď':'d','đ':'d','Ē':'E','Ĕ':'E','Ė':'E','Ę':'E','Ě':'E','ē':'e','ĕ':'e','ė':'e','ę':'e','ě':'e','Ĝ':'G','Ğ':'G','Ġ':'G','Ģ':'G','ĝ':'g','ğ':'g','ġ':'g','ģ':'g','Ĥ':'H','Ħ':'H','ĥ':'h','ħ':'h','Ĩ':'I','Ī':'I','Ĭ':'I','Į':'I','İ':'I','ĩ':'i','ī':'i','ĭ':'i','į':'i','ı':'i','Ĵ':'J','ĵ':'j','Ķ':'K','ķ':'k','ĸ':'k','Ĺ':'L','Ļ':'L','Ľ':'L','Ŀ':'L','Ł':'L','ĺ':'l','ļ':'l','ľ':'l','ŀ':'l','ł':'l','Ń':'N','Ņ':'N','Ň':'N','Ŋ':'N','ń':'n','ņ':'n','ň':'n','ŋ':'n','Ō':'O','Ŏ':'O','Ő':'O','ō':'o','ŏ':'o','ő':'o','Ŕ':'R','Ŗ':'R','Ř':'R','ŕ':'r','ŗ':'r','ř':'r','Ś':'S','Ŝ':'S','Ş':'S','Š':'S','ś':'s','ŝ':'s','ş':'s','š':'s','Ţ':'T','Ť':'T','Ŧ':'T','ţ':'t','ť':'t','ŧ':'t','Ũ':'U','Ū':'U','Ŭ':'U','Ů':'U','Ű':'U','Ų':'U','ũ':'u','ū':'u','ŭ':'u','ů':'u','ű':'u','ų':'u','Ŵ':'W','ŵ':'w','Ŷ':'Y','ŷ':'y','Ÿ':'Y','Ź':'Z','Ż':'Z','Ž':'Z','ź':'z','ż':'z','ž':'z','Ĳ':'IJ','ĳ':'ij','Œ':'Oe','œ':'oe','ŉ':'\'n','ſ':'s'},dr={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'},br={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':'\''},wr={'\\':'\\','\'':'\'','\n':'n','\r':'r','\u2028':'u2028','\u2029':'u2029'},mr=parseFloat,xr=parseInt,jr='object'==typeof global&&global&&global.Object===Object&&global,Ar='object'==typeof self&&self&&self.Object===Object&&self,kr=jr||Ar||Function('return this')(),Or='object'==typeof exports&&exports&&!exports.nodeType&&exports,Ir=Or&&'object'==typeof module&&module&&!module.nodeType&&module,Rr=Ir&&Ir.exports===Or,zr=Rr&&jr.process,Er=function (){
          try{
            var n=Ir&&Ir.require&&Ir.require('util').types;return n||zr&&zr.binding&&zr.binding('util');
          }catch(n){}
        }(),Sr=Er&&Er.isArrayBuffer,Lr=Er&&Er.isDate,Wr=Er&&Er.isMap,Cr=Er&&Er.isRegExp,Ur=Er&&Er.isSet,Br=Er&&Er.isTypedArray,Tr=m('length'),$r=x(yr),Dr=x(dr),Mr=x(br),Fr=function p(x){
          function q(n){
            if(rc(n)&&!ph(n)&&!(n instanceof Wt)){
              if(n instanceof H)return n;if(pl.call(n,'__wrapped__'))return Yi(n);
            }return new H(n);
          }function G(){}function H(n,t){
            this.__wrapped__=n,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=Y;
          }function Wt(n){
            this.__wrapped__=n,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=En,this.__views__=[];
          }function Zt(){
            var n=new Wt(this.__wrapped__);return n.__actions__=Lu(this.__actions__),n.__dir__=this.__dir__,n.__filtered__=this.__filtered__,n.__iteratees__=Lu(this.__iteratees__),n.__takeCount__=this.__takeCount__,n.__views__=Lu(this.__views__),n;
          }function Kt(){
            if(this.__filtered__){
              var n=new Wt(this);n.__dir__=-1,n.__filtered__=!0;
            }else n=this.clone(),n.__dir__*=-1;return n;
          }function Vt(){
            var n=this.__wrapped__.value(),t=this.__dir__,r=ph(n),e=t<0,u=r?n.length:0,i=mi(0,u,this.__views__),o=i.start,f=i.end,c=f-o,a=e?f:o-1,l=this.__iteratees__,s=l.length,h=0,p=Pl(c,this.__takeCount__);if(!r||!e&&u==c&&p==c)return vu(n,this.__actions__);var _=[];n:for(;c--&&h<p;){
              a+=t;for(var v=-1,g=n[a];++v<s;){
                var y=l[v],d=y.iteratee,b=y.type,w=d(g);if(b==kn)g=w;else if(!w){
                  if(b==An)continue n;break n;
                }
              }_[h++]=g;
            }return _;
          }function Gt(n){
            var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){
              var e=n[t];this.set(e[0],e[1]);
            }
          }function Ht(){
            this.__data__=Xl?Xl(null):{},this.size=0;
          }function Jt(n){
            var t=this.has(n)&&delete this.__data__[n];return this.size-=t?1:0,t;
          }function Yt(n){
            var t=this.__data__;if(Xl){
              var r=t[n];return r===tn?Y:r;
            }return pl.call(t,n)?t[n]:Y;
          }function Qt(n){
            var t=this.__data__;return Xl?t[n]!==Y:pl.call(t,n);
          }function Xt(n,t){
            var r=this.__data__;return this.size+=this.has(n)?0:1,r[n]=Xl&&t===Y?tn:t,this;
          }function nr(n){
            var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){
              var e=n[t];this.set(e[0],e[1]);
            }
          }function tr(){
            this.__data__=[],this.size=0;
          }function rr(n){
            var t=this.__data__,r=Vr(t,n);return!(r<0)&&(r==t.length-1?t.pop():Il.call(t,r,1),--this.size,!0);
          }function er(n){
            var t=this.__data__,r=Vr(t,n);return r<0?Y:t[r][1];
          }function ur(n){
            return Vr(this.__data__,n)>-1;
          }function ir(n,t){
            var r=this.__data__,e=Vr(r,n);return e<0?(++this.size,r.push([n,t])):r[e][1]=t,this;
          }function or(n){
            var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){
              var e=n[t];this.set(e[0],e[1]);
            }
          }function ar(){
            this.size=0,this.__data__={hash:new Gt,map:new(Hl||nr),string:new Gt};
          }function lr(n){
            var t=yi(this,n).delete(n);return this.size-=t?1:0,t;
          }function sr(n){
            return yi(this,n).get(n);
          }function hr(n){
            return yi(this,n).has(n);
          }function yr(n,t){
            var r=yi(this,n),e=r.size;return r.set(n,t),this.size+=r.size==e?0:1,this;
          }function dr(n){
            var t=-1,r=null==n?0:n.length;for(this.__data__=new or;++t<r;)this.add(n[t]);
          }function br(n){
            return this.__data__.set(n,tn),this;
          }function wr(n){
            return this.__data__.has(n);
          }function jr(n){
            var t=this.__data__=new nr(n);this.size=t.size;
          }function Ar(){
            this.__data__=new nr,this.size=0;
          }function Or(n){
            var t=this.__data__,r=t.delete(n);return this.size=t.size,r;
          }function Ir(n){
            return this.__data__.get(n);
          }function zr(n){
            return this.__data__.has(n);
          }function Er(n,t){
            var r=this.__data__;if(r instanceof nr){
              var e=r.__data__;if(!Hl||e.length<Q-1)return e.push([n,t]),this.size=++r.size,this;r=this.__data__=new or(e);
            }return r.set(n,t),this.size=r.size,this;
          }function Tr(n,t){
            var r=ph(n),e=!r&&hh(n),u=!r&&!e&&vh(n),i=!r&&!e&&!u&&wh(n),o=r||e||u||i,f=o?O(n.length,ol):[],c=f.length;for(var a in n)!t&&!pl.call(n,a)||o&&('length'==a||u&&('offset'==a||'parent'==a)||i&&('buffer'==a||'byteLength'==a||'byteOffset'==a)||zi(a,c))||f.push(a);return f;
          }function Nr(n){
            var t=n.length;return t?n[Je(0,t-1)]:Y;
          }function Pr(n,t){
            return Vi(Lu(n),Xr(t,0,n.length));
          }function qr(n){
            return Vi(Lu(n));
          }function Zr(n,t,r){
            (r===Y||Nf(n[t],r))&&(r!==Y||t in n)||Yr(n,t,r);
          }function Kr(n,t,r){
            var e=n[t];pl.call(n,t)&&Nf(e,r)&&(r!==Y||t in n)||Yr(n,t,r);
          }function Vr(n,t){
            for(var r=n.length;r--;)if(Nf(n[r][0],t))return r;return-1;
          }function Gr(n,t,r,e){
            return ss(n,function (n,u,i){
              t(e,n,r(n),i);
            }),e;
          }function Hr(n,t){
            return n&&Wu(t,Tc(t),n);
          }function Jr(n,t){
            return n&&Wu(t,$c(t),n);
          }function Yr(n,t,r){
            '__proto__'==t&&Sl?Sl(n,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):n[t]=r;
          }function Qr(n,t){
            for(var r=-1,e=t.length,u=Xa(e),i=null==n;++r<e;)u[r]=i?Y:Cc(n,t[r]);return u;
          }function Xr(n,t,r){
            return n===n&&(r!==Y&&(n=n<=r?n:r),t!==Y&&(n=n>=t?n:t)),n;
          }function ne(n,t,e,u,i,o){
            var f,c=t&un,a=t&on,l=t&fn;if(e&&(f=i?e(n,u,i,o):e(n)),f!==Y)return f;if(!tc(n))return n;var s=ph(n);if(s){
              if(f=Ai(n),!c)return Lu(n,f);
            }else{
              var h=js(n),p=h==Fn||h==Nn;if(vh(n))return xu(n,c);if(h==Kn||h==Cn||p&&!i){
                if(f=a||p?{}:ki(n),!c)return a?Uu(n,Jr(f,n)):Cu(n,Hr(f,n));
              }else{
                if(!gr[h])return i?n:{};f=Oi(n,h,c);
              }
            }o||(o=new jr);var _=o.get(n);if(_)return _;o.set(n,f),bh(n)?n.forEach(function (r){
              f.add(ne(r,t,e,r,n,o));
            }):yh(n)&&n.forEach(function (r,u){
              f.set(u,ne(r,t,e,u,n,o));
            });var v=l?a?pi:hi:a?$c:Tc,g=s?Y:v(n);return r(g||n,function (r,u){
              g&&(u=r,r=n[u]),Kr(f,u,ne(r,t,e,u,n,o));
            }),f;
          }function te(n){
            var t=Tc(n);return function (r){
              return re(r,n,t);
            };
          }function re(n,t,r){
            var e=r.length;if(null==n)return!e;for(n=ul(n);e--;){
              var u=r[e],i=t[u],o=n[u];if(o===Y&&!(u in n)||!i(o))return!1;
            }return!0;
          }function ee(n,t,r){
            if('function'!=typeof n)throw new fl(nn);return Os(function (){
              n.apply(Y,r);
            },t);
          }function ue(n,t,r,e){
            var u=-1,i=o,a=!0,l=n.length,s=[],h=t.length;if(!l)return s;r&&(t=c(t,R(r))),e?(i=f,a=!1):t.length>=Q&&(i=E,a=!1,t=new dr(t));n:for(;++u<l;){
              var p=n[u],_=null==r?p:r(p);if(p=e||0!==p?p:0,a&&_===_){
                for(var v=h;v--;)if(t[v]===_)continue n;s.push(p);
              }else i(t,_,e)||s.push(p);
            }return s;
          }function ie(n,t){
            var r=!0;return ss(n,function (n,e,u){
              return r=!!t(n,e,u);
            }),r;
          }function oe(n,t,r){
            for(var e=-1,u=n.length;++e<u;){
              var i=n[e],o=t(i);if(null!=o&&(f===Y?o===o&&!pc(o):r(o,f)))var f=o,c=i;
            }return c;
          }function fe(n,t,r,e){
            var u=n.length;for(r=bc(r),r<0&&(r=-r>u?0:u+r),e=e===Y||e>u?u:bc(e),e<0&&(e+=u),e=r>e?0:wc(e);r<e;)n[r++]=t;return n;
          }function ce(n,t){
            var r=[];return ss(n,function (n,e,u){
              t(n,e,u)&&r.push(n);
            }),r;
          }function ae(n,t,r,e,u){
            var i=-1,o=n.length;for(r||(r=Ri),u||(u=[]);++i<o;){
              var f=n[i];t>0&&r(f)?t>1?ae(f,t-1,r,e,u):a(u,f):e||(u[u.length]=f);
            }return u;
          }function le(n,t){
            return n&&ps(n,t,Tc);
          }function se(n,t){
            return n&&_s(n,t,Tc);
          }function he(n,t){
            return i(t,function (t){
              return Qf(n[t]);
            });
          }function pe(n,t){
            t=wu(t,n);for(var r=0,e=t.length;null!=n&&r<e;)n=n[Gi(t[r++])];return r&&r==e?n:Y;
          }function _e(n,t,r){
            var e=t(n);return ph(n)?e:a(e,r(n));
          }function ve(n){
            return null==n?n===Y?Qn:Zn:El&&El in ul(n)?wi(n):Mi(n);
          }function ge(n,t){
            return n>t;
          }function ye(n,t){
            return null!=n&&pl.call(n,t);
          }function de(n,t){
            return null!=n&&t in ul(n);
          }function be(n,t,r){
            return n>=Pl(t,r)&&n<Nl(t,r);
          }function we(n,t,r){
            for(var e=r?f:o,u=n[0].length,i=n.length,a=i,l=Xa(i),s=1/0,h=[];a--;){
              var p=n[a];a&&t&&(p=c(p,R(t))),s=Pl(p.length,s),l[a]=!r&&(t||u>=120&&p.length>=120)?new dr(a&&p):Y;
            }p=n[0];var _=-1,v=l[0];n:for(;++_<u&&h.length<s;){
              var g=p[_],y=t?t(g):g;if(g=r||0!==g?g:0,!(v?E(v,y):e(h,y,r))){
                for(a=i;--a;){
                  var d=l[a];if(!(d?E(d,y):e(n[a],y,r)))continue n;
                }v&&v.push(y),h.push(g);
              }
            }return h;
          }function me(n,t,r,e){
            return le(n,function (n,u,i){
              t(e,r(n),u,i);
            }),e;
          }function xe(t,r,e){
            r=wu(r,t),t=Ni(t,r);var u=null==t?t:t[Gi(go(r))];return null==u?Y:n(u,t,e);
          }function je(n){
            return rc(n)&&ve(n)==Cn;
          }function Ae(n){
            return rc(n)&&ve(n)==tt;
          }function ke(n){
            return rc(n)&&ve(n)==$n;
          }function Oe(n,t,r,e,u){
            return n===t||(null==n||null==t||!rc(n)&&!rc(t)?n!==n&&t!==t:Ie(n,t,r,e,Oe,u));
          }function Ie(n,t,r,e,u,i){
            var o=ph(n),f=ph(t),c=o?Un:js(n),a=f?Un:js(t);c=c==Cn?Kn:c,a=a==Cn?Kn:a;var l=c==Kn,s=a==Kn,h=c==a;if(h&&vh(n)){
              if(!vh(t))return!1;o=!0,l=!1;
            }if(h&&!l)return i||(i=new jr),o||wh(n)?ci(n,t,r,e,u,i):ai(n,t,c,r,e,u,i);if(!(r&cn)){
              var p=l&&pl.call(n,'__wrapped__'),_=s&&pl.call(t,'__wrapped__');if(p||_){
                var v=p?n.value():n,g=_?t.value():t;return i||(i=new jr),u(v,g,r,e,i);
              }
            }return!!h&&(i||(i=new jr),li(n,t,r,e,u,i));
          }function Re(n){
            return rc(n)&&js(n)==Pn;
          }function ze(n,t,r,e){
            var u=r.length,i=u,o=!e;if(null==n)return!i;for(n=ul(n);u--;){
              var f=r[u];if(o&&f[2]?f[1]!==n[f[0]]:!(f[0]in n))return!1;
            }for(;++u<i;){
              f=r[u];var c=f[0],a=n[c],l=f[1];if(o&&f[2]){
                if(a===Y&&!(c in n))return!1;
              }else{
                var s=new jr;if(e)var h=e(a,l,c,n,t,s);if(!(h===Y?Oe(l,a,cn|an,e,s):h))return!1;
              }
            }return!0;
          }function Ee(n){
            return!(!tc(n)||Ci(n))&&(Qf(n)?bl:Dt).test(Hi(n));
          }function Se(n){
            return rc(n)&&ve(n)==Gn;
          }function Le(n){
            return rc(n)&&js(n)==Hn;
          }function We(n){
            return rc(n)&&nc(n.length)&&!!vr[ve(n)];
          }function Ce(n){
            return'function'==typeof n?n:null==n?Ia:'object'==typeof n?ph(n)?Me(n[0],n[1]):De(n):Ua(n);
          }function Ue(n){
            if(!Ui(n))return Fl(n);var t=[];for(var r in ul(n))pl.call(n,r)&&'constructor'!=r&&t.push(r);return t;
          }function Be(n){
            if(!tc(n))return Di(n);var t=Ui(n),r=[];for(var e in n)('constructor'!=e||!t&&pl.call(n,e))&&r.push(e);return r;
          }function Te(n,t){
            return n<t;
          }function $e(n,t){
            var r=-1,e=Pf(n)?Xa(n.length):[];return ss(n,function (n,u,i){
              e[++r]=t(n,u,i);
            }),e;
          }function De(n){
            var t=di(n);return 1==t.length&&t[0][2]?Ti(t[0][0],t[0][1]):function (r){
              return r===n||ze(r,n,t);
            };
          }function Me(n,t){
            return Si(n)&&Bi(t)?Ti(Gi(n),t):function (r){
              var e=Cc(r,n);return e===Y&&e===t?Bc(r,n):Oe(t,e,cn|an);
            };
          }function Fe(n,t,r,e,u){
            n!==t&&ps(t,function (i,o){
              if(u||(u=new jr),tc(i))Ne(n,t,o,r,Fe,e,u);else{
                var f=e?e(qi(n,o),i,`${o}`,n,t,u):Y;f===Y&&(f=i),Zr(n,o,f);
              }
            },$c);
          }function Ne(n,t,r,e,u,i,o){
            var f=qi(n,r),c=qi(t,r),a=o.get(c);if(a)return void Zr(n,r,a);var l=i?i(f,c,`${r}`,n,t,o):Y,s=l===Y;if(s){
              var h=ph(c),p=!h&&vh(c),_=!h&&!p&&wh(c);l=c,h||p||_?ph(f)?l=f:qf(f)?l=Lu(f):p?(s=!1,l=xu(c,!0)):_?(s=!1,l=Iu(c,!0)):l=[]:lc(c)||hh(c)?(l=f,hh(f)?l=xc(f):tc(f)&&!Qf(f)||(l=ki(c))):s=!1;
            }s&&(o.set(c,l),u(l,c,e,i,o),o.delete(c)),Zr(n,r,l);
          }function Pe(n,t){
            var r=n.length;if(r)return t+=t<0?r:0,zi(t,r)?n[t]:Y;
          }function qe(n,t,r){
            var e=-1;return t=c(t.length?t:[Ia],R(gi())),A($e(n,function (n,r,u){
              return{criteria:c(t,function (t){
                return t(n);
              }),index:++e,value:n};
            }),function (n,t){
              return zu(n,t,r);
            });
          }function Ze(n,t){
            return Ke(n,t,function (t,r){
              return Bc(n,r);
            });
          }function Ke(n,t,r){
            for(var e=-1,u=t.length,i={};++e<u;){
              var o=t[e],f=pe(n,o);r(f,o)&&ru(i,wu(o,n),f);
            }return i;
          }function Ve(n){
            return function (t){
              return pe(t,n);
            };
          }function Ge(n,t,r,e){
            var u=e?d:y,i=-1,o=t.length,f=n;for(n===t&&(t=Lu(t)),r&&(f=c(n,R(r)));++i<o;)for(var a=0,l=t[i],s=r?r(l):l;(a=u(f,s,a,e))>-1;)f!==n&&Il.call(f,a,1),Il.call(n,a,1);return n;
          }function He(n,t){
            for(var r=n?t.length:0,e=r-1;r--;){
              var u=t[r];if(r==e||u!==i){
                var i=u;zi(u)?Il.call(n,u,1):hu(n,u);
              }
            }return n;
          }function Je(n,t){
            return n+Bl(Kl()*(t-n+1));
          }function Ye(n,t,r,e){
            for(var u=-1,i=Nl(Ul((t-n)/(r||1)),0),o=Xa(i);i--;)o[e?i:++u]=n,n+=r;return o;
          }function Qe(n,t){
            var r='';if(!n||t<1||t>In)return r;do{
              t%2&&(r+=n),(t=Bl(t/2))&&(n+=n);
            }while(t);return r;
          }function Xe(n,t){
            return Is(Fi(n,t,Ia),`${n}`);
          }function nu(n){
            return Nr(Jc(n));
          }function tu(n,t){
            var r=Jc(n);return Vi(r,Xr(t,0,r.length));
          }function ru(n,t,r,e){
            if(!tc(n))return n;t=wu(t,n);for(var u=-1,i=t.length,o=i-1,f=n;null!=f&&++u<i;){
              var c=Gi(t[u]),a=r;if(u!=o){
                var l=f[c];a=e?e(l,c,f):Y,a===Y&&(a=tc(l)?l:zi(t[u+1])?[]:{});
              }Kr(f,c,a),f=f[c];
            }return n;
          }function eu(n){
            return Vi(Jc(n));
          }function uu(n,t,r){
            var e=-1,u=n.length;t<0&&(t=-t>u?0:u+t),r=r>u?u:r,r<0&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0;for(var i=Xa(u);++e<u;)i[e]=n[e+t];return i;
          }function iu(n,t){
            var r;return ss(n,function (n,e,u){
              return!(r=t(n,e,u));
            }),!!r;
          }function ou(n,t,r){
            var e=0,u=null==n?e:n.length;if('number'==typeof t&&t===t&&u<=Ln){
              for(;e<u;){
                var i=e+u>>>1,o=n[i];null!==o&&!pc(o)&&(r?o<=t:o<t)?e=i+1:u=i;
              }return u;
            }return fu(n,t,Ia,r);
          }function fu(n,t,r,e){
            t=r(t);for(var u=0,i=null==n?0:n.length,o=t!==t,f=null===t,c=pc(t),a=t===Y;u<i;){
              var l=Bl((u+i)/2),s=r(n[l]),h=s!==Y,p=null===s,_=s===s,v=pc(s);if(o)var g=e||_;else g=a?_&&(e||h):f?_&&h&&(e||!p):c?_&&h&&!p&&(e||!v):!p&&!v&&(e?s<=t:s<t);g?u=l+1:i=l;
            }return Pl(i,Sn);
          }function cu(n,t){
            for(var r=-1,e=n.length,u=0,i=[];++r<e;){
              var o=n[r],f=t?t(o):o;if(!r||!Nf(f,c)){
                var c=f;i[u++]=0===o?0:o;
              }
            }return i;
          }function au(n){
            return'number'==typeof n?n:pc(n)?zn:+n;
          }function lu(n){
            if('string'==typeof n)return n;if(ph(n))return `${c(n,lu)}`;if(pc(n))return as?as.call(n):'';var t=`${n}`;return'0'==t&&1/n==-On?'-0':t;
          }function su(n,t,r){
            var e=-1,u=o,i=n.length,c=!0,a=[],l=a;if(r)c=!1,u=f;else if(i>=Q){
              var s=t?null:bs(n);if(s)return N(s);c=!1,u=E,l=new dr;
            }else l=t?[]:a;n:for(;++e<i;){
              var h=n[e],p=t?t(h):h;if(h=r||0!==h?h:0,c&&p===p){
                for(var _=l.length;_--;)if(l[_]===p)continue n;t&&l.push(p),a.push(h);
              }else u(l,p,r)||(l!==a&&l.push(p),a.push(h));
            }return a;
          }function hu(n,t){
            return t=wu(t,n),null==(n=Ni(n,t))||delete n[Gi(go(t))];
          }function pu(n,t,r,e){
            return ru(n,t,r(pe(n,t)),e);
          }function _u(n,t,r,e){
            for(var u=n.length,i=e?u:-1;(e?i--:++i<u)&&t(n[i],i,n););return r?uu(n,e?0:i,e?i+1:u):uu(n,e?i+1:0,e?u:i);
          }function vu(n,t){
            var r=n;return r instanceof Wt&&(r=r.value()),l(t,function (n,t){
              return t.func.apply(t.thisArg,a([n],t.args));
            },r);
          }function gu(n,t,r){
            var e=n.length;if(e<2)return e?su(n[0]):[];for(var u=-1,i=Xa(e);++u<e;)for(var o=n[u],f=-1;++f<e;)f!=u&&(i[u]=ue(i[u]||o,n[f],t,r));return su(ae(i,1),t,r);
          }function yu(n,t,r){
            for(var e=-1,u=n.length,i=t.length,o={};++e<u;){
              var f=e<i?t[e]:Y;r(o,n[e],f);
            }return o;
          }function du(n){
            return qf(n)?n:[];
          }function bu(n){
            return'function'==typeof n?n:Ia;
          }function wu(n,t){
            return ph(n)?n:Si(n,t)?[n]:Rs(Ac(n));
          }function mu(n,t,r){
            var e=n.length;return r=r===Y?e:r,!t&&r>=e?n:uu(n,t,r);
          }function xu(n,t){
            if(t)return n.slice();var r=n.length,e=jl?jl(r):new n.constructor(r);return n.copy(e),e;
          }function ju(n){
            var t=new n.constructor(n.byteLength);return new xl(t).set(new xl(n)),t;
          }function Au(n,t){
            var r=t?ju(n.buffer):n.buffer;return new n.constructor(r,n.byteOffset,n.byteLength);
          }function ku(n){
            var t=new n.constructor(n.source,Bt.exec(n));return t.lastIndex=n.lastIndex,t;
          }function Ou(n){
            return cs?ul(cs.call(n)):{};
          }function Iu(n,t){
            var r=t?ju(n.buffer):n.buffer;return new n.constructor(r,n.byteOffset,n.length);
          }function Ru(n,t){
            if(n!==t){
              var r=n!==Y,e=null===n,u=n===n,i=pc(n),o=t!==Y,f=null===t,c=t===t,a=pc(t);if(!f&&!a&&!i&&n>t||i&&o&&c&&!f&&!a||e&&o&&c||!r&&c||!u)return 1;if(!e&&!i&&!a&&n<t||a&&r&&u&&!e&&!i||f&&r&&u||!o&&u||!c)return-1;
            }return 0;
          }function zu(n,t,r){
            for(var e=-1,u=n.criteria,i=t.criteria,o=u.length,f=r.length;++e<o;){
              var c=Ru(u[e],i[e]);if(c){
                if(e>=f)return c;return c*('desc'==r[e]?-1:1);
              }
            }return n.index-t.index;
          }function Eu(n,t,r,e){
            for(var u=-1,i=n.length,o=r.length,f=-1,c=t.length,a=Nl(i-o,0),l=Xa(c+a),s=!e;++f<c;)l[f]=t[f];for(;++u<o;)(s||u<i)&&(l[r[u]]=n[u]);for(;a--;)l[f++]=n[u++];return l;
          }function Su(n,t,r,e){
            for(var u=-1,i=n.length,o=-1,f=r.length,c=-1,a=t.length,l=Nl(i-f,0),s=Xa(l+a),h=!e;++u<l;)s[u]=n[u];for(var p=u;++c<a;)s[p+c]=t[c];for(;++o<f;)(h||u<i)&&(s[p+r[o]]=n[u++]);return s;
          }function Lu(n,t){
            var r=-1,e=n.length;for(t||(t=Xa(e));++r<e;)t[r]=n[r];return t;
          }function Wu(n,t,r,e){
            var u=!r;r||(r={});for(var i=-1,o=t.length;++i<o;){
              var f=t[i],c=e?e(r[f],n[f],f,r,n):Y;c===Y&&(c=n[f]),u?Yr(r,f,c):Kr(r,f,c);
            }return r;
          }function Cu(n,t){
            return Wu(n,ms(n),t);
          }function Uu(n,t){
            return Wu(n,xs(n),t);
          }function Bu(n,r){
            return function (e,u){
              var i=ph(e)?t:Gr,o=r?r():{};return i(e,n,gi(u,2),o);
            };
          }function Tu(n){
            return Xe(function (t,r){
              var e=-1,u=r.length,i=u>1?r[u-1]:Y,o=u>2?r[2]:Y;for(i=n.length>3&&'function'==typeof i?(u--,i):Y,o&&Ei(r[0],r[1],o)&&(i=u<3?Y:i,u=1),t=ul(t);++e<u;){
                var f=r[e];f&&n(t,f,e,i);
              }return t;
            });
          }function $u(n,t){
            return function (r,e){
              if(null==r)return r;if(!Pf(r))return n(r,e);for(var u=r.length,i=t?u:-1,o=ul(r);(t?i--:++i<u)&&!1!==e(o[i],i,o););return r;
            };
          }function Du(n){
            return function (t,r,e){
              for(var u=-1,i=ul(t),o=e(t),f=o.length;f--;){
                var c=o[n?f:++u];if(!1===r(i[c],c,i))break;
              }return t;
            };
          }function Mu(n,t,r){
            function e(){
              return(this&&this!==kr&&this instanceof e?i:n).apply(u?r:this,arguments);
            }var u=t&ln,i=Pu(n);return e;
          }function Fu(n){
            return function (t){
              t=Ac(t);var r=B(t)?V(t):Y,e=r?r[0]:t.charAt(0),u=r?mu(r,1).join(''):t.slice(1);return e[n]()+u;
            };
          }function Nu(n){
            return function (t){
              return l(xa(ra(t).replace(fr,'')),n,'');
            };
          }function Pu(n){
            return function (){
              var t=arguments;switch(t.length){
              case 0:return new n;case 1:return new n(t[0]);case 2:return new n(t[0],t[1]);case 3:return new n(t[0],t[1],t[2]);case 4:return new n(t[0],t[1],t[2],t[3]);case 5:return new n(t[0],t[1],t[2],t[3],t[4]);case 6:return new n(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new n(t[0],t[1],t[2],t[3],t[4],t[5],t[6]);
              }var r=ls(n.prototype),e=n.apply(r,t);return tc(e)?e:r;
            };
          }function qu(t,r,e){
            function u(){
              for(var o=arguments.length,f=Xa(o),c=o,a=vi(u);c--;)f[c]=arguments[c];var l=o<3&&f[0]!==a&&f[o-1]!==a?[]:F(f,a);return(o-=l.length)<e?ti(t,r,Vu,u.placeholder,Y,f,l,Y,Y,e-o):n(this&&this!==kr&&this instanceof u?i:t,this,f);
            }var i=Pu(t);return u;
          }function Zu(n){
            return function (t,r,e){
              var u=ul(t);if(!Pf(t)){
                var i=gi(r,3);t=Tc(t),r=function (n){
                  return i(u[n],n,u);
                };
              }var o=n(t,r,e);return o>-1?u[i?t[o]:o]:Y;
            };
          }function Ku(n){
            return si(function (t){
              var r=t.length,e=r,u=H.prototype.thru;for(n&&t.reverse();e--;){
                var i=t[e];if('function'!=typeof i)throw new fl(nn);if(u&&!o&&'wrapper'==_i(i))var o=new H([],!0);
              }for(e=o?e:r;++e<r;){
                i=t[e];var f=_i(i),c='wrapper'==f?ws(i):Y;o=c&&Wi(c[0])&&c[1]==(yn|pn|vn|dn)&&!c[4].length&&1==c[9]?o[_i(c[0])].apply(o,c[3]):1==i.length&&Wi(i)?o[f]():o.thru(i);
              }return function (){
                var n=arguments,e=n[0];if(o&&1==n.length&&ph(e))return o.plant(e).value();for(var u=0,i=r?t[u].apply(this,n):e;++u<r;)i=t[u].call(this,i);return i;
              };
            });
          }function Vu(n,t,r,e,u,i,o,f,c,a){
            function l(){
              for(var y=arguments.length,d=Xa(y),b=y;b--;)d[b]=arguments[b];if(_)var w=vi(l),m=W(d,w);if(e&&(d=Eu(d,e,u,_)),i&&(d=Su(d,i,o,_)),y-=m,_&&y<a){
                var x=F(d,w);return ti(n,t,Vu,l.placeholder,r,d,x,f,c,a-y);
              }var j=h?r:this,A=p?j[n]:n;return y=d.length,f?d=Pi(d,f):v&&y>1&&d.reverse(),s&&c<y&&(d.length=c),this&&this!==kr&&this instanceof l&&(A=g||Pu(A)),A.apply(j,d);
            }var s=t&yn,h=t&ln,p=t&sn,_=t&(pn|_n),v=t&bn,g=p?Y:Pu(n);return l;
          }function Gu(n,t){
            return function (r,e){
              return me(r,n,t(e),{});
            };
          }function Hu(n,t){
            return function (r,e){
              var u;if(r===Y&&e===Y)return t;if(r!==Y&&(u=r),e!==Y){
                if(u===Y)return e;'string'==typeof r||'string'==typeof e?(r=lu(r),e=lu(e)):(r=au(r),e=au(e)),u=n(r,e);
              }return u;
            };
          }function Ju(t){
            return si(function (r){
              return r=c(r,R(gi())),Xe(function (e){
                var u=this;return t(r,function (t){
                  return n(t,u,e);
                });
              });
            });
          }function Yu(n,t){
            t=t===Y?' ':lu(t);var r=t.length;if(r<2)return r?Qe(t,n):t;var e=Qe(t,Ul(n/K(t)));return B(t)?mu(V(e),0,n).join(''):e.slice(0,n);
          }function Qu(t,r,e,u){
            function i(){
              for(var r=-1,c=arguments.length,a=-1,l=u.length,s=Xa(l+c),h=this&&this!==kr&&this instanceof i?f:t;++a<l;)s[a]=u[a];for(;c--;)s[a++]=arguments[++r];return n(h,o?e:this,s);
            }var o=r&ln,f=Pu(t);return i;
          }function Xu(n){
            return function (t,r,e){
              return e&&'number'!=typeof e&&Ei(t,r,e)&&(r=e=Y),t=dc(t),r===Y?(r=t,t=0):r=dc(r),e=e===Y?t<r?1:-1:dc(e),Ye(t,r,e,n);
            };
          }function ni(n){
            return function (t,r){
              return'string'==typeof t&&'string'==typeof r||(t=mc(t),r=mc(r)),n(t,r);
            };
          }function ti(n,t,r,e,u,i,o,f,c,a){
            var l=t&pn,s=l?o:Y,h=l?Y:o,p=l?i:Y,_=l?Y:i;t|=l?vn:gn,(t&=~(l?gn:vn))&hn||(t&=~(ln|sn));var v=[n,t,u,p,s,_,h,f,c,a],g=r.apply(Y,v);return Wi(n)&&ks(g,v),g.placeholder=e,Zi(g,n,t);
          }function ri(n){
            var t=el[n];return function (n,r){
              if(n=mc(n),(r=null==r?0:Pl(bc(r),292))&&Dl(n)){
                var e=(`${Ac(n)}e`).split('e');return e=(`${Ac(t(`${e[0]}e${+e[1]+r}`))}e`).split('e'),+(`${e[0]}e${+e[1]-r}`);
              }return t(n);
            };
          }function ei(n){
            return function (t){
              var r=js(t);return r==Pn?D(t):r==Hn?P(t):I(t,n(t));
            };
          }function ui(n,t,r,e,u,i,o,f){
            var c=t&sn;if(!c&&'function'!=typeof n)throw new fl(nn);var a=e?e.length:0;if(a||(t&=~(vn|gn),e=u=Y),o=o===Y?o:Nl(bc(o),0),f=f===Y?f:bc(f),a-=u?u.length:0,t&gn){
              var l=e,s=u;e=u=Y;
            }var h=c?Y:ws(n),p=[n,t,r,e,u,l,s,i,o,f];if(h&&$i(p,h),n=p[0],t=p[1],r=p[2],e=p[3],u=p[4],f=p[9]=p[9]===Y?c?0:n.length:Nl(p[9]-a,0),!f&&t&(pn|_n)&&(t&=~(pn|_n)),t&&t!=ln)_=t==pn||t==_n?qu(n,t,f):t!=vn&&t!=(ln|vn)||u.length?Vu.apply(Y,p):Qu(n,t,r,e);else var _=Mu(n,t,r);return Zi((h?vs:ks)(_,p),n,t);
          }function ii(n,t,r,e){
            return n===Y||Nf(n,ll[r])&&!pl.call(e,r)?t:n;
          }function oi(n,t,r,e,u,i){
            return tc(n)&&tc(t)&&(i.set(t,n),Fe(n,t,Y,oi,i),i.delete(t)),n;
          }function fi(n){
            return lc(n)?Y:n;
          }function ci(n,t,r,e,u,i){
            var o=r&cn,f=n.length,c=t.length;if(f!=c&&!(o&&c>f))return!1;var a=i.get(n);if(a&&i.get(t))return a==t;var l=-1,s=!0,p=r&an?new dr:Y;for(i.set(n,t),i.set(t,n);++l<f;){
              var _=n[l],v=t[l];if(e)var g=o?e(v,_,l,t,n,i):e(_,v,l,n,t,i);if(g!==Y){
                if(g)continue;s=!1;break;
              }if(p){
                if(!h(t,function (n,t){
                  if(!E(p,t)&&(_===n||u(_,n,r,e,i)))return p.push(t);
                })){
                  s=!1;break;
                }
              }else if(_!==v&&!u(_,v,r,e,i)){
                s=!1;break;
              }
            }return i.delete(n),i.delete(t),s;
          }function ai(n,t,r,e,u,i,o){
            switch(r){
            case rt:if(n.byteLength!=t.byteLength||n.byteOffset!=t.byteOffset)return!1;n=n.buffer,t=t.buffer;case tt:return!(n.byteLength!=t.byteLength||!i(new xl(n),new xl(t)));case Tn:case $n:case qn:return Nf(+n,+t);case Mn:return n.name==t.name&&n.message==t.message;case Gn:case Jn:return n==`${t}`;case Pn:var f=D;case Hn:var c=e&cn;if(f||(f=N),n.size!=t.size&&!c)return!1;var a=o.get(n);if(a)return a==t;e|=an,o.set(n,t);var l=ci(f(n),f(t),e,u,i,o);return o.delete(n),l;case Yn:if(cs)return cs.call(n)==cs.call(t);
            }return!1;
          }function li(n,t,r,e,u,i){
            var o=r&cn,f=hi(n),c=f.length;if(c!=hi(t).length&&!o)return!1;for(var a=c;a--;){
              var l=f[a];if(!(o?l in t:pl.call(t,l)))return!1;
            }var s=i.get(n);if(s&&i.get(t))return s==t;var h=!0;i.set(n,t),i.set(t,n);for(var p=o;++a<c;){
              l=f[a]
              ;var _=n[l],v=t[l];if(e)var g=o?e(v,_,l,t,n,i):e(_,v,l,n,t,i);if(!(g===Y?_===v||u(_,v,r,e,i):g)){
                h=!1;break;
              }p||(p='constructor'==l);
            }if(h&&!p){
              var y=n.constructor,d=t.constructor;y!=d&&'constructor'in n&&'constructor'in t&&!('function'==typeof y&&y instanceof y&&'function'==typeof d&&d instanceof d)&&(h=!1);
            }return i.delete(n),i.delete(t),h;
          }function si(n){
            return Is(Fi(n,Y,co),`${n}`);
          }function hi(n){
            return _e(n,Tc,ms);
          }function pi(n){
            return _e(n,$c,xs);
          }function _i(n){
            for(var t=`${n.name}`,r=ts[t],e=pl.call(ts,t)?r.length:0;e--;){
              var u=r[e],i=u.func;if(null==i||i==n)return u.name;
            }return t;
          }function vi(n){
            return(pl.call(q,'placeholder')?q:n).placeholder;
          }function gi(){
            var n=q.iteratee||Ra;return n=n===Ra?Ce:n,arguments.length?n(arguments[0],arguments[1]):n;
          }function yi(n,t){
            var r=n.__data__;return Li(t)?r['string'==typeof t?'string':'hash']:r.map;
          }function di(n){
            for(var t=Tc(n),r=t.length;r--;){
              var e=t[r],u=n[e];t[r]=[e,u,Bi(u)];
            }return t;
          }function bi(n,t){
            var r=U(n,t);return Ee(r)?r:Y;
          }function wi(n){
            var t=pl.call(n,El),r=n[El];try{
              n[El]=Y;var e=!0;
            }catch(n){}var u=gl.call(n);return e&&(t?n[El]=r:delete n[El]),u;
          }function mi(n,t,r){
            for(var e=-1,u=r.length;++e<u;){
              var i=r[e],o=i.size;switch(i.type){
              case'drop':n+=o;break;case'dropRight':t-=o;break;case'take':t=Pl(t,n+o);break;case'takeRight':n=Nl(n,t-o);
              }
            }return{start:n,end:t};
          }function xi(n){
            var t=n.match(St);return t?t[1].split(Lt):[];
          }function ji(n,t,r){
            t=wu(t,n);for(var e=-1,u=t.length,i=!1;++e<u;){
              var o=Gi(t[e]);if(!(i=null!=n&&r(n,o)))break;n=n[o];
            }return i||++e!=u?i:!!(u=null==n?0:n.length)&&nc(u)&&zi(o,u)&&(ph(n)||hh(n));
          }function Ai(n){
            var t=n.length,r=new n.constructor(t);return t&&'string'==typeof n[0]&&pl.call(n,'index')&&(r.index=n.index,r.input=n.input),r;
          }function ki(n){
            return'function'!=typeof n.constructor||Ui(n)?{}:ls(Al(n));
          }function Oi(n,t,r){
            var e=n.constructor;switch(t){
            case tt:return ju(n);case Tn:case $n:return new e(+n);case rt:return Au(n,r);case et:case ut:case it:case ot:case ft:case ct:case at:case lt:case st:return Iu(n,r);case Pn:return new e;case qn:case Jn:return new e(n);case Gn:return ku(n);case Hn:return new e;case Yn:return Ou(n);
            }
          }function Ii(n,t){
            var r=t.length;if(!r)return n;var e=r-1;return t[e]=(r>1?'& ':'')+t[e],t=t.join(r>2?', ':' '),n.replace(Et,`{\n/* [wrapped with ${t}] */\n`);
          }function Ri(n){
            return ph(n)||hh(n)||!!(Rl&&n&&n[Rl]);
          }function zi(n,t){
            var r=typeof n;return!!(t=null==t?In:t)&&('number'==r||'symbol'!=r&&Ft.test(n))&&n>-1&&n%1==0&&n<t;
          }function Ei(n,t,r){
            if(!tc(r))return!1;var e=typeof t;return!!('number'==e?Pf(r)&&zi(t,r.length):'string'==e&&t in r)&&Nf(r[t],n);
          }function Si(n,t){
            if(ph(n))return!1;var r=typeof n;return!('number'!=r&&'symbol'!=r&&'boolean'!=r&&null!=n&&!pc(n))||(jt.test(n)||!xt.test(n)||null!=t&&n in ul(t));
          }function Li(n){
            var t=typeof n;return'string'==t||'number'==t||'symbol'==t||'boolean'==t?'__proto__'!==n:null===n;
          }function Wi(n){
            var t=_i(n),r=q[t];if('function'!=typeof r||!(t in Wt.prototype))return!1;if(n===r)return!0;var e=ws(r);return!!e&&n===e[0];
          }function Ci(n){
            return!!vl&&vl in n;
          }function Ui(n){
            var t=n&&n.constructor;return n===('function'==typeof t&&t.prototype||ll);
          }function Bi(n){
            return n===n&&!tc(n);
          }function Ti(n,t){
            return function (r){
              return null!=r&&(r[n]===t&&(t!==Y||n in ul(r)));
            };
          }function $i(n,t){
            var r=n[1],e=t[1],u=r|e,i=u<(ln|sn|yn),o=e==yn&&r==pn||e==yn&&r==dn&&n[7].length<=t[8]||e==(yn|dn)&&t[7].length<=t[8]&&r==pn;if(!i&&!o)return n;e&ln&&(n[2]=t[2],u|=r&ln?0:hn);var f=t[3];if(f){
              var c=n[3];n[3]=c?Eu(c,f,t[4]):f,n[4]=c?F(n[3],en):t[4];
            }return f=t[5],f&&(c=n[5],n[5]=c?Su(c,f,t[6]):f,n[6]=c?F(n[5],en):t[6]),f=t[7],f&&(n[7]=f),e&yn&&(n[8]=null==n[8]?t[8]:Pl(n[8],t[8])),null==n[9]&&(n[9]=t[9]),n[0]=t[0],n[1]=u,n;
          }function Di(n){
            var t=[];if(null!=n)for(var r in ul(n))t.push(r);return t;
          }function Mi(n){
            return gl.call(n);
          }function Fi(t,r,e){
            return r=Nl(r===Y?t.length-1:r,0),function (){
              for(var u=arguments,i=-1,o=Nl(u.length-r,0),f=Xa(o);++i<o;)f[i]=u[r+i];i=-1;for(var c=Xa(r+1);++i<r;)c[i]=u[i];return c[r]=e(f),n(t,this,c);
            };
          }function Ni(n,t){
            return t.length<2?n:pe(n,uu(t,0,-1));
          }function Pi(n,t){
            for(var r=n.length,e=Pl(t.length,r),u=Lu(n);e--;){
              var i=t[e];n[e]=zi(i,r)?u[i]:Y;
            }return n;
          }function qi(n,t){
            if(('constructor'!==t||'function'!=typeof n[t])&&'__proto__'!=t)return n[t];
          }function Zi(n,t,r){
            var e=`${t}`;return Is(n,Ii(e,Ji(xi(e),r)));
          }function Ki(n){
            var t=0,r=0;return function (){
              var e=ql(),u=jn-(e-r);if(r=e,u>0){
                if(++t>=xn)return arguments[0];
              }else t=0;return n.apply(Y,arguments);
            };
          }function Vi(n,t){
            var r=-1,e=n.length,u=e-1;for(t=t===Y?e:t;++r<t;){
              var i=Je(r,u),o=n[i];n[i]=n[r],n[r]=o;
            }return n.length=t,n;
          }function Gi(n){
            if('string'==typeof n||pc(n))return n;var t=`${n}`;return'0'==t&&1/n==-On?'-0':t;
          }function Hi(n){
            if(null!=n){
              try{
                return hl.call(n);
              }catch(n){}try{
                return `${n}`;
              }catch(n){}
            }return'';
          }function Ji(n,t){
            return r(Wn,function (r){
              var e=`_.${r[0]}`;t&r[1]&&!o(n,e)&&n.push(e);
            }),n.sort();
          }function Yi(n){
            if(n instanceof Wt)return n.clone();var t=new H(n.__wrapped__,n.__chain__);return t.__actions__=Lu(n.__actions__),t.__index__=n.__index__,t.__values__=n.__values__,t;
          }function Qi(n,t,r){
            t=(r?Ei(n,t,r):t===Y)?1:Nl(bc(t),0);var e=null==n?0:n.length;if(!e||t<1)return[];for(var u=0,i=0,o=Xa(Ul(e/t));u<e;)o[i++]=uu(n,u,u+=t);return o;
          }function Xi(n){
            for(var t=-1,r=null==n?0:n.length,e=0,u=[];++t<r;){
              var i=n[t];i&&(u[e++]=i);
            }return u;
          }function no(){
            var n=arguments.length;if(!n)return[];for(var t=Xa(n-1),r=arguments[0],e=n;e--;)t[e-1]=arguments[e];return a(ph(r)?Lu(r):[r],ae(t,1));
          }function to(n,t,r){
            var e=null==n?0:n.length;return e?(t=r||t===Y?1:bc(t),uu(n,t<0?0:t,e)):[];
          }function ro(n,t,r){
            var e=null==n?0:n.length;return e?(t=r||t===Y?1:bc(t),t=e-t,uu(n,0,t<0?0:t)):[];
          }function eo(n,t){
            return n&&n.length?_u(n,gi(t,3),!0,!0):[];
          }function uo(n,t){
            return n&&n.length?_u(n,gi(t,3),!0):[];
          }function io(n,t,r,e){
            var u=null==n?0:n.length;return u?(r&&'number'!=typeof r&&Ei(n,t,r)&&(r=0,e=u),fe(n,t,r,e)):[];
          }function oo(n,t,r){
            var e=null==n?0:n.length;if(!e)return-1;var u=null==r?0:bc(r);return u<0&&(u=Nl(e+u,0)),g(n,gi(t,3),u);
          }function fo(n,t,r){
            var e=null==n?0:n.length;if(!e)return-1;var u=e-1;return r!==Y&&(u=bc(r),u=r<0?Nl(e+u,0):Pl(u,e-1)),g(n,gi(t,3),u,!0);
          }function co(n){
            return(null==n?0:n.length)?ae(n,1):[];
          }function ao(n){
            return(null==n?0:n.length)?ae(n,On):[];
          }function lo(n,t){
            return(null==n?0:n.length)?(t=t===Y?1:bc(t),ae(n,t)):[];
          }function so(n){
            for(var t=-1,r=null==n?0:n.length,e={};++t<r;){
              var u=n[t];e[u[0]]=u[1];
            }return e;
          }function ho(n){
            return n&&n.length?n[0]:Y;
          }function po(n,t,r){
            var e=null==n?0:n.length;if(!e)return-1;var u=null==r?0:bc(r);return u<0&&(u=Nl(e+u,0)),y(n,t,u);
          }function _o(n){
            return(null==n?0:n.length)?uu(n,0,-1):[];
          }function vo(n,t){
            return null==n?'':Ml.call(n,t);
          }function go(n){
            var t=null==n?0:n.length;return t?n[t-1]:Y;
          }function yo(n,t,r){
            var e=null==n?0:n.length;if(!e)return-1;var u=e;return r!==Y&&(u=bc(r),u=u<0?Nl(e+u,0):Pl(u,e-1)),t===t?Z(n,t,u):g(n,b,u,!0);
          }function bo(n,t){
            return n&&n.length?Pe(n,bc(t)):Y;
          }function wo(n,t){
            return n&&n.length&&t&&t.length?Ge(n,t):n;
          }function mo(n,t,r){
            return n&&n.length&&t&&t.length?Ge(n,t,gi(r,2)):n;
          }function xo(n,t,r){
            return n&&n.length&&t&&t.length?Ge(n,t,Y,r):n;
          }function jo(n,t){
            var r=[];if(!n||!n.length)return r;var e=-1,u=[],i=n.length;for(t=gi(t,3);++e<i;){
              var o=n[e];t(o,e,n)&&(r.push(o),u.push(e));
            }return He(n,u),r;
          }function Ao(n){
            return null==n?n:Vl.call(n);
          }function ko(n,t,r){
            var e=null==n?0:n.length;return e?(r&&'number'!=typeof r&&Ei(n,t,r)?(t=0,r=e):(t=null==t?0:bc(t),r=r===Y?e:bc(r)),uu(n,t,r)):[];
          }function Oo(n,t){
            return ou(n,t);
          }function Io(n,t,r){
            return fu(n,t,gi(r,2));
          }function Ro(n,t){
            var r=null==n?0:n.length;if(r){
              var e=ou(n,t);if(e<r&&Nf(n[e],t))return e;
            }return-1;
          }function zo(n,t){
            return ou(n,t,!0);
          }function Eo(n,t,r){
            return fu(n,t,gi(r,2),!0);
          }function So(n,t){
            if(null==n?0:n.length){
              var r=ou(n,t,!0)-1;if(Nf(n[r],t))return r;
            }return-1;
          }function Lo(n){
            return n&&n.length?cu(n):[];
          }function Wo(n,t){
            return n&&n.length?cu(n,gi(t,2)):[];
          }function Co(n){
            var t=null==n?0:n.length;return t?uu(n,1,t):[];
          }function Uo(n,t,r){
            return n&&n.length?(t=r||t===Y?1:bc(t),uu(n,0,t<0?0:t)):[];
          }function Bo(n,t,r){
            var e=null==n?0:n.length;return e?(t=r||t===Y?1:bc(t),t=e-t,uu(n,t<0?0:t,e)):[];
          }function To(n,t){
            return n&&n.length?_u(n,gi(t,3),!1,!0):[];
          }function $o(n,t){
            return n&&n.length?_u(n,gi(t,3)):[];
          }function Do(n){
            return n&&n.length?su(n):[];
          }function Mo(n,t){
            return n&&n.length?su(n,gi(t,2)):[];
          }function Fo(n,t){
            return t='function'==typeof t?t:Y,n&&n.length?su(n,Y,t):[];
          }function No(n){
            if(!n||!n.length)return[];var t=0;return n=i(n,function (n){
              if(qf(n))return t=Nl(n.length,t),!0;
            }),O(t,function (t){
              return c(n,m(t));
            });
          }function Po(t,r){
            if(!t||!t.length)return[];var e=No(t);return null==r?e:c(e,function (t){
              return n(r,Y,t);
            });
          }function qo(n,t){
            return yu(n||[],t||[],Kr);
          }function Zo(n,t){
            return yu(n||[],t||[],ru);
          }function Ko(n){
            var t=q(n);return t.__chain__=!0,t;
          }function Vo(n,t){
            return t(n),n;
          }function Go(n,t){
            return t(n);
          }function Ho(){
            return Ko(this);
          }function Jo(){
            return new H(this.value(),this.__chain__);
          }function Yo(){
            this.__values__===Y&&(this.__values__=yc(this.value()));var n=this.__index__>=this.__values__.length;return{done:n,value:n?Y:this.__values__[this.__index__++]};
          }function Qo(){
            return this;
          }function Xo(n){
            for(var t,r=this;r instanceof G;){
              var e=Yi(r);e.__index__=0,e.__values__=Y,t?u.__wrapped__=e:t=e;var u=e;r=r.__wrapped__;
            }return u.__wrapped__=n,t;
          }function nf(){
            var n=this.__wrapped__;if(n instanceof Wt){
              var t=n;return this.__actions__.length&&(t=new Wt(this)),t=t.reverse(),t.__actions__.push({func:Go,args:[Ao],thisArg:Y}),new H(t,this.__chain__);
            }return this.thru(Ao);
          }function tf(){
            return vu(this.__wrapped__,this.__actions__);
          }function rf(n,t,r){
            var e=ph(n)?u:ie;return r&&Ei(n,t,r)&&(t=Y),e(n,gi(t,3));
          }function ef(n,t){
            return(ph(n)?i:ce)(n,gi(t,3));
          }function uf(n,t){
            return ae(sf(n,t),1);
          }function of(n,t){
            return ae(sf(n,t),On);
          }function ff(n,t,r){
            return r=r===Y?1:bc(r),ae(sf(n,t),r);
          }function cf(n,t){
            return(ph(n)?r:ss)(n,gi(t,3));
          }function af(n,t){
            return(ph(n)?e:hs)(n,gi(t,3));
          }function lf(n,t,r,e){
            n=Pf(n)?n:Jc(n),r=r&&!e?bc(r):0;var u=n.length;return r<0&&(r=Nl(u+r,0)),hc(n)?r<=u&&n.indexOf(t,r)>-1:!!u&&y(n,t,r)>-1;
          }function sf(n,t){
            return(ph(n)?c:$e)(n,gi(t,3));
          }function hf(n,t,r,e){
            return null==n?[]:(ph(t)||(t=null==t?[]:[t]),r=e?Y:r,ph(r)||(r=null==r?[]:[r]),qe(n,t,r));
          }function pf(n,t,r){
            var e=ph(n)?l:j,u=arguments.length<3;return e(n,gi(t,4),r,u,ss);
          }function _f(n,t,r){
            var e=ph(n)?s:j,u=arguments.length<3;return e(n,gi(t,4),r,u,hs);
          }function vf(n,t){
            return(ph(n)?i:ce)(n,zf(gi(t,3)));
          }function gf(n){
            return(ph(n)?Nr:nu)(n);
          }function yf(n,t,r){
            return t=(r?Ei(n,t,r):t===Y)?1:bc(t),(ph(n)?Pr:tu)(n,t);
          }function df(n){
            return(ph(n)?qr:eu)(n);
          }function bf(n){
            if(null==n)return 0;if(Pf(n))return hc(n)?K(n):n.length;var t=js(n);return t==Pn||t==Hn?n.size:Ue(n).length;
          }function wf(n,t,r){
            var e=ph(n)?h:iu;return r&&Ei(n,t,r)&&(t=Y),e(n,gi(t,3));
          }function mf(n,t){
            if('function'!=typeof t)throw new fl(nn);return n=bc(n),function (){
              if(--n<1)return t.apply(this,arguments);
            };
          }function xf(n,t,r){
            return t=r?Y:t,t=n&&null==t?n.length:t,ui(n,yn,Y,Y,Y,Y,t);
          }function jf(n,t){
            var r;if('function'!=typeof t)throw new fl(nn);return n=bc(n),function (){
              return--n>0&&(r=t.apply(this,arguments)),n<=1&&(t=Y),r;
            };
          }function Af(n,t,r){
            t=r?Y:t;var e=ui(n,pn,Y,Y,Y,Y,Y,t);return e.placeholder=Af.placeholder,e;
          }function kf(n,t,r){
            t=r?Y:t;var e=ui(n,_n,Y,Y,Y,Y,Y,t);return e.placeholder=kf.placeholder,e;
          }function Of(n,t,r){
            function e(t){
              var r=h,e=p;return h=p=Y,d=t,v=n.apply(e,r);
            }function u(n){
              return d=n,g=Os(f,t),b?e(n):v;
            }function i(n){
              var r=n-y,e=n-d,u=t-r;return w?Pl(u,_-e):u;
            }function o(n){
              var r=n-y,e=n-d;return y===Y||r>=t||r<0||w&&e>=_;
            }function f(){
              var n=th();if(o(n))return c(n);g=Os(f,i(n));
            }function c(n){
              return g=Y,m&&h?e(n):(h=p=Y,v);
            }function a(){
              g!==Y&&ds(g),d=0,h=y=p=g=Y;
            }function l(){
              return g===Y?v:c(th());
            }function s(){
              var n=th(),r=o(n);if(h=arguments,p=this,y=n,r){
                if(g===Y)return u(y);if(w)return ds(g),g=Os(f,t),e(y);
              }return g===Y&&(g=Os(f,t)),v;
            }var h,p,_,v,g,y,d=0,b=!1,w=!1,m=!0;if('function'!=typeof n)throw new fl(nn);return t=mc(t)||0,tc(r)&&(b=!!r.leading,w='maxWait'in r,_=w?Nl(mc(r.maxWait)||0,t):_,m='trailing'in r?!!r.trailing:m),s.cancel=a,s.flush=l,s;
          }function If(n){
            return ui(n,bn);
          }function Rf(n,t){
            if('function'!=typeof n||null!=t&&'function'!=typeof t)throw new fl(nn);var r=function (){
              var e=arguments,u=t?t.apply(this,e):e[0],i=r.cache;if(i.has(u))return i.get(u);var o=n.apply(this,e);return r.cache=i.set(u,o)||i,o;
            };return r.cache=new(Rf.Cache||or),r;
          }function zf(n){
            if('function'!=typeof n)throw new fl(nn);return function (){
              var t=arguments;switch(t.length){
              case 0:return!n.call(this);case 1:return!n.call(this,t[0]);case 2:return!n.call(this,t[0],t[1]);case 3:return!n.call(this,t[0],t[1],t[2]);
              }return!n.apply(this,t);
            };
          }function Ef(n){
            return jf(2,n);
          }function Sf(n,t){
            if('function'!=typeof n)throw new fl(nn);return t=t===Y?t:bc(t),Xe(n,t);
          }function Lf(t,r){
            if('function'!=typeof t)throw new fl(nn);return r=null==r?0:Nl(bc(r),0),Xe(function (e){
              var u=e[r],i=mu(e,0,r);return u&&a(i,u),n(t,this,i);
            });
          }function Wf(n,t,r){
            var e=!0,u=!0;if('function'!=typeof n)throw new fl(nn);return tc(r)&&(e='leading'in r?!!r.leading:e,u='trailing'in r?!!r.trailing:u),Of(n,t,{leading:e,maxWait:t,trailing:u});
          }function Cf(n){
            return xf(n,1);
          }function Uf(n,t){
            return fh(bu(t),n);
          }function Bf(){
            if(!arguments.length)return[];var n=arguments[0];return ph(n)?n:[n];
          }function Tf(n){
            return ne(n,fn);
          }function $f(n,t){
            return t='function'==typeof t?t:Y,ne(n,fn,t);
          }function Df(n){
            return ne(n,un|fn);
          }function Mf(n,t){
            return t='function'==typeof t?t:Y,ne(n,un|fn,t);
          }function Ff(n,t){
            return null==t||re(n,t,Tc(t));
          }function Nf(n,t){
            return n===t||n!==n&&t!==t;
          }function Pf(n){
            return null!=n&&nc(n.length)&&!Qf(n);
          }function qf(n){
            return rc(n)&&Pf(n);
          }function Zf(n){
            return!0===n||!1===n||rc(n)&&ve(n)==Tn;
          }function Kf(n){
            return rc(n)&&1===n.nodeType&&!lc(n);
          }function Vf(n){
            if(null==n)return!0;if(Pf(n)&&(ph(n)||'string'==typeof n||'function'==typeof n.splice||vh(n)||wh(n)||hh(n)))return!n.length;var t=js(n);if(t==Pn||t==Hn)return!n.size;if(Ui(n))return!Ue(n).length;for(var r in n)if(pl.call(n,r))return!1;return!0;
          }function Gf(n,t){
            return Oe(n,t);
          }function Hf(n,t,r){
            r='function'==typeof r?r:Y;var e=r?r(n,t):Y;return e===Y?Oe(n,t,Y,r):!!e;
          }function Jf(n){
            if(!rc(n))return!1;var t=ve(n);return t==Mn||t==Dn||'string'==typeof n.message&&'string'==typeof n.name&&!lc(n);
          }function Yf(n){
            return'number'==typeof n&&Dl(n);
          }function Qf(n){
            if(!tc(n))return!1;var t=ve(n);return t==Fn||t==Nn||t==Bn||t==Vn;
          }function Xf(n){
            return'number'==typeof n&&n==bc(n);
          }function nc(n){
            return'number'==typeof n&&n>-1&&n%1==0&&n<=In;
          }function tc(n){
            var t=typeof n;return null!=n&&('object'==t||'function'==t);
          }function rc(n){
            return null!=n&&'object'==typeof n;
          }function ec(n,t){
            return n===t||ze(n,t,di(t));
          }function uc(n,t,r){
            return r='function'==typeof r?r:Y,ze(n,t,di(t),r);
          }function ic(n){
            return ac(n)&&n!=+n;
          }function oc(n){
            if(As(n))throw new tl(X);return Ee(n);
          }function fc(n){
            return null===n;
          }function cc(n){
            return null==n;
          }function ac(n){
            return'number'==typeof n||rc(n)&&ve(n)==qn;
          }function lc(n){
            if(!rc(n)||ve(n)!=Kn)return!1;var t=Al(n);if(null===t)return!0;var r=pl.call(t,'constructor')&&t.constructor;return'function'==typeof r&&r instanceof r&&hl.call(r)==yl;
          }function sc(n){
            return Xf(n)&&n>=-In&&n<=In;
          }function hc(n){
            return'string'==typeof n||!ph(n)&&rc(n)&&ve(n)==Jn;
          }function pc(n){
            return'symbol'==typeof n||rc(n)&&ve(n)==Yn;
          }function _c(n){
            return n===Y;
          }function vc(n){
            return rc(n)&&js(n)==Xn;
          }function gc(n){
            return rc(n)&&ve(n)==nt;
          }function yc(n){
            if(!n)return[];if(Pf(n))return hc(n)?V(n):Lu(n);if(zl&&n[zl])return $(n[zl]());var t=js(n);return(t==Pn?D:t==Hn?N:Jc)(n);
          }function dc(n){
            if(!n)return 0===n?n:0;if((n=mc(n))===On||n===-On){
              return(n<0?-1:1)*Rn;
            }return n===n?n:0;
          }function bc(n){
            var t=dc(n),r=t%1;return t===t?r?t-r:t:0;
          }function wc(n){
            return n?Xr(bc(n),0,En):0;
          }function mc(n){
            if('number'==typeof n)return n;if(pc(n))return zn;if(tc(n)){
              var t='function'==typeof n.valueOf?n.valueOf():n;n=tc(t)?`${t}`:t;
            }if('string'!=typeof n)return 0===n?n:+n;n=n.replace(It,'');var r=$t.test(n);return r||Mt.test(n)?xr(n.slice(2),r?2:8):Tt.test(n)?zn:+n;
          }function xc(n){
            return Wu(n,$c(n));
          }function jc(n){
            return n?Xr(bc(n),-In,In):0===n?n:0;
          }function Ac(n){
            return null==n?'':lu(n);
          }function kc(n,t){
            var r=ls(n);return null==t?r:Hr(r,t);
          }function Oc(n,t){
            return v(n,gi(t,3),le);
          }function Ic(n,t){
            return v(n,gi(t,3),se);
          }function Rc(n,t){
            return null==n?n:ps(n,gi(t,3),$c);
          }function zc(n,t){
            return null==n?n:_s(n,gi(t,3),$c);
          }function Ec(n,t){
            return n&&le(n,gi(t,3));
          }function Sc(n,t){
            return n&&se(n,gi(t,3));
          }function Lc(n){
            return null==n?[]:he(n,Tc(n));
          }function Wc(n){
            return null==n?[]:he(n,$c(n));
          }function Cc(n,t,r){
            var e=null==n?Y:pe(n,t);return e===Y?r:e;
          }function Uc(n,t){
            return null!=n&&ji(n,t,ye);
          }function Bc(n,t){
            return null!=n&&ji(n,t,de);
          }function Tc(n){
            return Pf(n)?Tr(n):Ue(n);
          }function $c(n){
            return Pf(n)?Tr(n,!0):Be(n);
          }function Dc(n,t){
            var r={};return t=gi(t,3),le(n,function (n,e,u){
              Yr(r,t(n,e,u),n);
            }),r;
          }function Mc(n,t){
            var r={};return t=gi(t,3),le(n,function (n,e,u){
              Yr(r,e,t(n,e,u));
            }),r;
          }function Fc(n,t){
            return Nc(n,zf(gi(t)));
          }function Nc(n,t){
            if(null==n)return{};var r=c(pi(n),function (n){
              return[n];
            });return t=gi(t),Ke(n,r,function (n,r){
              return t(n,r[0]);
            });
          }function Pc(n,t,r){
            t=wu(t,n);var e=-1,u=t.length;for(u||(u=1,n=Y);++e<u;){
              var i=null==n?Y:n[Gi(t[e])];i===Y&&(e=u,i=r),n=Qf(i)?i.call(n):i;
            }return n;
          }function qc(n,t,r){
            return null==n?n:ru(n,t,r);
          }function Zc(n,t,r,e){
            return e='function'==typeof e?e:Y,null==n?n:ru(n,t,r,e);
          }function Kc(n,t,e){
            var u=ph(n),i=u||vh(n)||wh(n);if(t=gi(t,4),null==e){
              var o=n&&n.constructor;e=i?u?new o:[]:tc(n)&&Qf(o)?ls(Al(n)):{};
            }return(i?r:le)(n,function (n,r,u){
              return t(e,n,r,u);
            }),e;
          }function Vc(n,t){
            return null==n||hu(n,t);
          }function Gc(n,t,r){
            return null==n?n:pu(n,t,bu(r));
          }function Hc(n,t,r,e){
            return e='function'==typeof e?e:Y,null==n?n:pu(n,t,bu(r),e);
          }function Jc(n){
            return null==n?[]:z(n,Tc(n));
          }function Yc(n){
            return null==n?[]:z(n,$c(n));
          }function Qc(n,t,r){
            return r===Y&&(r=t,t=Y),r!==Y&&(r=mc(r),r=r===r?r:0),t!==Y&&(t=mc(t),t=t===t?t:0),Xr(mc(n),t,r);
          }function Xc(n,t,r){
            return t=dc(t),r===Y?(r=t,t=0):r=dc(r),n=mc(n),be(n,t,r);
          }function na(n,t,r){
            if(r&&'boolean'!=typeof r&&Ei(n,t,r)&&(t=r=Y),r===Y&&('boolean'==typeof t?(r=t,t=Y):'boolean'==typeof n&&(r=n,n=Y)),n===Y&&t===Y?(n=0,t=1):(n=dc(n),t===Y?(t=n,n=0):t=dc(t)),n>t){
              var e=n;n=t,t=e;
            }if(r||n%1||t%1){
              var u=Kl();return Pl(n+u*(t-n+mr(`1e-${(`${u}`).length-1}`)),t);
            }return Je(n,t);
          }function ta(n){
            return Kh(Ac(n).toLowerCase());
          }function ra(n){
            return(n=Ac(n))&&n.replace(Nt,$r).replace(cr,'');
          }function ea(n,t,r){
            n=Ac(n),t=lu(t);var e=n.length;r=r===Y?e:Xr(bc(r),0,e);var u=r;return(r-=t.length)>=0&&n.slice(r,u)==t;
          }function ua(n){
            return n=Ac(n),n&&dt.test(n)?n.replace(gt,Dr):n;
          }function ia(n){
            return n=Ac(n),n&&Ot.test(n)?n.replace(kt,'\\$&'):n;
          }function oa(n,t,r){
            n=Ac(n),t=bc(t);var e=t?K(n):0;if(!t||e>=t)return n;var u=(t-e)/2;return Yu(Bl(u),r)+n+Yu(Ul(u),r);
          }function fa(n,t,r){
            n=Ac(n),t=bc(t);var e=t?K(n):0;return t&&e<t?n+Yu(t-e,r):n;
          }function ca(n,t,r){
            n=Ac(n),t=bc(t);var e=t?K(n):0;return t&&e<t?Yu(t-e,r)+n:n;
          }function aa(n,t,r){
            return r||null==t?t=0:t&&(t=+t),Zl(Ac(n).replace(Rt,''),t||0);
          }function la(n,t,r){
            return t=(r?Ei(n,t,r):t===Y)?1:bc(t),Qe(Ac(n),t);
          }function sa(){
            var n=arguments,t=Ac(n[0]);return n.length<3?t:t.replace(n[1],n[2]);
          }function ha(n,t,r){
            return r&&'number'!=typeof r&&Ei(n,t,r)&&(t=r=Y),(r=r===Y?En:r>>>0)?(n=Ac(n),n&&('string'==typeof t||null!=t&&!dh(t))&&!(t=lu(t))&&B(n)?mu(V(n),0,r):n.split(t,r)):[];
          }function pa(n,t,r){
            return n=Ac(n),r=null==r?0:Xr(bc(r),0,n.length),t=lu(t),n.slice(r,r+t.length)==t;
          }function _a(n,t,r){
            var e=q.templateSettings;r&&Ei(n,t,r)&&(t=Y),n=Ac(n),t=kh({},t,e,ii);var u,i,o=kh({},t.imports,e.imports,ii),f=Tc(o),c=z(o,f),a=0,l=t.interpolate||Pt,s='__p += \'',h=il(`${(t.escape||Pt).source}|${l.source}|${(l===mt?Ut:Pt).source}|${(t.evaluate||Pt).source}|$`,'g'),p=`//# sourceURL=${pl.call(t,'sourceURL')?(`${t.sourceURL}`).replace(/[\r\n]/g,' '):`lodash.templateSources[${ ++_r}]`}\n`;n.replace(h,function (t,r,e,o,f,c){
              return e||(e=o),s+=n.slice(a,c).replace(qt,C),r&&(u=!0,s+=`' +\n__e(${r}) +\n'`),f&&(i=!0,s+=`';\n${f};\n__p += '`),e&&(s+=`' +\n((__t = (${e})) == null ? '' : __t) +\n'`),a=c+t.length,t;
            }),s+='\';\n';var _=pl.call(t,'variable')&&t.variable;_||(s=`with (obj) {\n${s}\n}\n`),s=(i?s.replace(ht,''):s).replace(pt,'$1').replace(_t,'$1;'),s=`function(${_||'obj'}) {\n${_?'':'obj || (obj = {});\n'}var __t, __p = ''${u?', __e = _.escape':''}${i?', __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, \'\') }\n':';\n'}${s}return __p\n}`;var v=Vh(function (){
              return rl(f,`${p}return ${s}`).apply(Y,c);
            });if(v.source=s,Jf(v))throw v;return v;
          }function va(n){
            return Ac(n).toLowerCase();
          }function ga(n){
            return Ac(n).toUpperCase();
          }function ya(n,t,r){
            if((n=Ac(n))&&(r||t===Y))return n.replace(It,'');if(!n||!(t=lu(t)))return n;var e=V(n),u=V(t);return mu(e,S(e,u),L(e,u)+1).join('');
          }function da(n,t,r){
            if((n=Ac(n))&&(r||t===Y))return n.replace(zt,'');if(!n||!(t=lu(t)))return n;var e=V(n);return mu(e,0,L(e,V(t))+1).join('');
          }function ba(n,t,r){
            if((n=Ac(n))&&(r||t===Y))return n.replace(Rt,'');if(!n||!(t=lu(t)))return n;var e=V(n);return mu(e,S(e,V(t))).join('');
          }function wa(n,t){
            var r=wn,e=mn;if(tc(t)){
              var u='separator'in t?t.separator:u;r='length'in t?bc(t.length):r,e='omission'in t?lu(t.omission):e;
            }n=Ac(n);var i=n.length;if(B(n)){
              var o=V(n);i=o.length;
            }if(r>=i)return n;var f=r-K(e);if(f<1)return e;var c=o?mu(o,0,f).join(''):n.slice(0,f);if(u===Y)return c+e;if(o&&(f+=c.length-f),dh(u)){
              if(n.slice(f).search(u)){
                var a,l=c;for(u.global||(u=il(u.source,`${Ac(Bt.exec(u))}g`)),u.lastIndex=0;a=u.exec(l);)var s=a.index;c=c.slice(0,s===Y?f:s);
              }
            }else if(n.indexOf(lu(u),f)!=f){
              var h=c.lastIndexOf(u);h>-1&&(c=c.slice(0,h));
            }return c+e;
          }function ma(n){
            return n=Ac(n),n&&yt.test(n)?n.replace(vt,Mr):n;
          }function xa(n,t,r){
            return n=Ac(n),t=r?Y:t,t===Y?T(n)?J(n):_(n):n.match(t)||[];
          }function ja(t){
            var r=null==t?0:t.length,e=gi();return t=r?c(t,function (n){
              if('function'!=typeof n[1])throw new fl(nn);return[e(n[0]),n[1]];
            }):[],Xe(function (e){
              for(var u=-1;++u<r;){
                var i=t[u];if(n(i[0],this,e))return n(i[1],this,e);
              }
            });
          }function Aa(n){
            return te(ne(n,un));
          }function ka(n){
            return function (){
              return n;
            };
          }function Oa(n,t){
            return null==n||n!==n?t:n;
          }function Ia(n){
            return n;
          }function Ra(n){
            return Ce('function'==typeof n?n:ne(n,un));
          }function za(n){
            return De(ne(n,un));
          }function Ea(n,t){
            return Me(n,ne(t,un));
          }function Sa(n,t,e){
            var u=Tc(t),i=he(t,u);null!=e||tc(t)&&(i.length||!u.length)||(e=t,t=n,n=this,i=he(t,Tc(t)));var o=!(tc(e)&&'chain'in e&&!e.chain),f=Qf(n);return r(i,function (r){
              var e=t[r];n[r]=e,f&&(n.prototype[r]=function (){
                var t=this.__chain__;if(o||t){
                  var r=n(this.__wrapped__);return(r.__actions__=Lu(this.__actions__)).push({func:e,args:arguments,thisArg:n}),r.__chain__=t,r;
                }return e.apply(n,a([this.value()],arguments));
              });
            }),n;
          }function La(){
            return kr._===this&&(kr._=dl),this;
          }function Wa(){}function Ca(n){
            return n=bc(n),Xe(function (t){
              return Pe(t,n);
            });
          }function Ua(n){
            return Si(n)?m(Gi(n)):Ve(n);
          }function Ba(n){
            return function (t){
              return null==n?Y:pe(n,t);
            };
          }function Ta(){
            return[];
          }function $a(){
            return!1;
          }function Da(){
            return{};
          }function Ma(){
            return'';
          }function Fa(){
            return!0;
          }function Na(n,t){
            if((n=bc(n))<1||n>In)return[];var r=En,e=Pl(n,En);t=gi(t),n-=En;for(var u=O(e,t);++r<n;)t(r);return u;
          }function Pa(n){
            return ph(n)?c(n,Gi):pc(n)?[n]:Lu(Rs(Ac(n)));
          }function qa(n){
            var t=++_l;return Ac(n)+t;
          }function Za(n){
            return n&&n.length?oe(n,Ia,ge):Y;
          }function Ka(n,t){
            return n&&n.length?oe(n,gi(t,2),ge):Y;
          }function Va(n){
            return w(n,Ia);
          }function Ga(n,t){
            return w(n,gi(t,2));
          }function Ha(n){
            return n&&n.length?oe(n,Ia,Te):Y;
          }function Ja(n,t){
            return n&&n.length?oe(n,gi(t,2),Te):Y;
          }function Ya(n){
            return n&&n.length?k(n,Ia):0;
          }function Qa(n,t){
            return n&&n.length?k(n,gi(t,2)):0;
          }x=null==x?kr:Fr.defaults(kr.Object(),x,Fr.pick(kr,pr));var Xa=x.Array,nl=x.Date,tl=x.Error,rl=x.Function,el=x.Math,ul=x.Object,il=x.RegExp,ol=x.String,fl=x.TypeError,cl=Xa.prototype,al=rl.prototype,ll=ul.prototype,sl=x['__core-js_shared__'],hl=al.toString,pl=ll.hasOwnProperty,_l=0,vl=function (){
              var n=/[^.]+$/.exec(sl&&sl.keys&&sl.keys.IE_PROTO||'');return n?`Symbol(src)_1.${n}`:'';
            }(),gl=ll.toString,yl=hl.call(ul),dl=kr._,bl=il(`^${hl.call(pl).replace(kt,'\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,'$1.*?')}$`),wl=Rr?x.Buffer:Y,ml=x.Symbol,xl=x.Uint8Array,jl=wl?wl.allocUnsafe:Y,Al=M(ul.getPrototypeOf,ul),kl=ul.create,Ol=ll.propertyIsEnumerable,Il=cl.splice,Rl=ml?ml.isConcatSpreadable:Y,zl=ml?ml.iterator:Y,El=ml?ml.toStringTag:Y,Sl=function (){
              try{
                var n=bi(ul,'defineProperty');return n({},'',{}),n;
              }catch(n){}
            }(),Ll=x.clearTimeout!==kr.clearTimeout&&x.clearTimeout,Wl=nl&&nl.now!==kr.Date.now&&nl.now,Cl=x.setTimeout!==kr.setTimeout&&x.setTimeout,Ul=el.ceil,Bl=el.floor,Tl=ul.getOwnPropertySymbols,$l=wl?wl.isBuffer:Y,Dl=x.isFinite,Ml=cl.join,Fl=M(ul.keys,ul),Nl=el.max,Pl=el.min,ql=nl.now,Zl=x.parseInt,Kl=el.random,Vl=cl.reverse,Gl=bi(x,'DataView'),Hl=bi(x,'Map'),Jl=bi(x,'Promise'),Yl=bi(x,'Set'),Ql=bi(x,'WeakMap'),Xl=bi(ul,'create'),ns=Ql&&new Ql,ts={},rs=Hi(Gl),es=Hi(Hl),us=Hi(Jl),is=Hi(Yl),os=Hi(Ql),fs=ml?ml.prototype:Y,cs=fs?fs.valueOf:Y,as=fs?fs.toString:Y,ls=function (){
              function n(){}return function (t){
                if(!tc(t))return{};if(kl)return kl(t);n.prototype=t;var r=new n;return n.prototype=Y,r;
              };
            }();q.templateSettings={escape:bt,evaluate:wt,interpolate:mt,variable:'',imports:{_:q}},q.prototype=G.prototype,q.prototype.constructor=q,H.prototype=ls(G.prototype),H.prototype.constructor=H,Wt.prototype=ls(G.prototype),Wt.prototype.constructor=Wt,Gt.prototype.clear=Ht,Gt.prototype.delete=Jt,Gt.prototype.get=Yt,Gt.prototype.has=Qt,Gt.prototype.set=Xt,nr.prototype.clear=tr,nr.prototype.delete=rr,nr.prototype.get=er,nr.prototype.has=ur,nr.prototype.set=ir,or.prototype.clear=ar,or.prototype.delete=lr,or.prototype.get=sr,or.prototype.has=hr,or.prototype.set=yr,dr.prototype.add=dr.prototype.push=br,dr.prototype.has=wr,jr.prototype.clear=Ar,jr.prototype.delete=Or,jr.prototype.get=Ir,jr.prototype.has=zr,jr.prototype.set=Er;var ss=$u(le),hs=$u(se,!0),ps=Du(),_s=Du(!0),vs=ns?function (n,t){
              return ns.set(n,t),n;
            }:Ia,gs=Sl?function (n,t){
              return Sl(n,'toString',{configurable:!0,enumerable:!1,value:ka(t),writable:!0});
            }:Ia,ys=Xe,ds=Ll||function (n){
              return kr.clearTimeout(n);
            },bs=Yl&&1/N(new Yl([,-0]))[1]==On?function (n){
              return new Yl(n);
            }:Wa,ws=ns?function (n){
              return ns.get(n);
            }:Wa,ms=Tl?function (n){
              return null==n?[]:(n=ul(n),i(Tl(n),function (t){
                return Ol.call(n,t);
              }));
            }:Ta,xs=Tl?function (n){
              for(var t=[];n;)a(t,ms(n)),n=Al(n);return t;
            }:Ta,js=ve;(Gl&&js(new Gl(new ArrayBuffer(1)))!=rt||Hl&&js(new Hl)!=Pn||Jl&&'[object Promise]'!=js(Jl.resolve())||Yl&&js(new Yl)!=Hn||Ql&&js(new Ql)!=Xn)&&(js=function (n){
            var t=ve(n),r=t==Kn?n.constructor:Y,e=r?Hi(r):'';if(e)switch(e){
            case rs:return rt;case es:return Pn;case us:return'[object Promise]';case is:return Hn;case os:return Xn;
              }return t;
          });var As=sl?Qf:$a,ks=Ki(vs),Os=Cl||function (n,t){
              return kr.setTimeout(n,t);
            },Is=Ki(gs),Rs=function (n){
              var t=Rf(n,function (n){
                  return r.size===rn&&r.clear(),n;
                }),r=t.cache;return t;
            }(function (n){
              var t=[];return 46===n.charCodeAt(0)&&t.push(''),n.replace(At,function (n,r,e,u){
                t.push(e?u.replace(Ct,'$1'):r||n);
              }),t;
            }),zs=Xe(function (n,t){
              return qf(n)?ue(n,ae(t,1,qf,!0)):[];
            }),Es=Xe(function (n,t){
              var r=go(t);return qf(r)&&(r=Y),qf(n)?ue(n,ae(t,1,qf,!0),gi(r,2)):[];
            }),Ss=Xe(function (n,t){
              var r=go(t);return qf(r)&&(r=Y),qf(n)?ue(n,ae(t,1,qf,!0),Y,r):[];
            }),Ls=Xe(function (n){
              var t=c(n,du);return t.length&&t[0]===n[0]?we(t):[];
            }),Ws=Xe(function (n){
              var t=go(n),r=c(n,du);return t===go(r)?t=Y:r.pop(),r.length&&r[0]===n[0]?we(r,gi(t,2)):[];
            }),Cs=Xe(function (n){
              var t=go(n),r=c(n,du);return t='function'==typeof t?t:Y,t&&r.pop(),r.length&&r[0]===n[0]?we(r,Y,t):[];
            }),Us=Xe(wo),Bs=si(function (n,t){
              var r=null==n?0:n.length,e=Qr(n,t);return He(n,c(t,function (n){
                return zi(n,r)?+n:n;
              }).sort(Ru)),e;
            }),Ts=Xe(function (n){
              return su(ae(n,1,qf,!0));
            }),$s=Xe(function (n){
              var t=go(n);return qf(t)&&(t=Y),su(ae(n,1,qf,!0),gi(t,2));
            }),Ds=Xe(function (n){
              var t=go(n);return t='function'==typeof t?t:Y,su(ae(n,1,qf,!0),Y,t);
            }),Ms=Xe(function (n,t){
              return qf(n)?ue(n,t):[];
            }),Fs=Xe(function (n){
              return gu(i(n,qf));
            }),Ns=Xe(function (n){
              var t=go(n);return qf(t)&&(t=Y),gu(i(n,qf),gi(t,2));
            }),Ps=Xe(function (n){
              var t=go(n);return t='function'==typeof t?t:Y,gu(i(n,qf),Y,t);
            }),qs=Xe(No),Zs=Xe(function (n){
              var t=n.length,r=t>1?n[t-1]:Y;return r='function'==typeof r?(n.pop(),r):Y,Po(n,r);
            }),Ks=si(function (n){
              var t=n.length,r=t?n[0]:0,e=this.__wrapped__,u=function (t){
                return Qr(t,n);
              };return!(t>1||this.__actions__.length)&&e instanceof Wt&&zi(r)?(e=e.slice(r,+r+(t?1:0)),e.__actions__.push({func:Go,args:[u],thisArg:Y}),new H(e,this.__chain__).thru(function (n){
                return t&&!n.length&&n.push(Y),n;
              })):this.thru(u);
            }),Vs=Bu(function (n,t,r){
              pl.call(n,r)?++n[r]:Yr(n,r,1);
            }),Gs=Zu(oo),Hs=Zu(fo),Js=Bu(function (n,t,r){
              pl.call(n,r)?n[r].push(t):Yr(n,r,[t]);
            }),Ys=Xe(function (t,r,e){
              var u=-1,i='function'==typeof r,o=Pf(t)?Xa(t.length):[];return ss(t,function (t){
                o[++u]=i?n(r,t,e):xe(t,r,e);
              }),o;
            }),Qs=Bu(function (n,t,r){
              Yr(n,r,t);
            }),Xs=Bu(function (n,t,r){
              n[r?0:1].push(t);
            },function (){
              return[[],[]];
            }),nh=Xe(function (n,t){
              if(null==n)return[];var r=t.length;return r>1&&Ei(n,t[0],t[1])?t=[]:r>2&&Ei(t[0],t[1],t[2])&&(t=[t[0]]),qe(n,ae(t,1),[]);
            }),th=Wl||function (){
              return kr.Date.now();
            },rh=Xe(function (n,t,r){
              var e=ln;if(r.length){
                var u=F(r,vi(rh));e|=vn;
              }return ui(n,e,t,r,u);
            }),eh=Xe(function (n,t,r){
              var e=ln|sn;if(r.length){
                var u=F(r,vi(eh));e|=vn;
              }return ui(t,e,n,r,u);
            }),uh=Xe(function (n,t){
              return ee(n,1,t);
            }),ih=Xe(function (n,t,r){
              return ee(n,mc(t)||0,r);
            });Rf.Cache=or;var oh=ys(function (t,r){
              r=1==r.length&&ph(r[0])?c(r[0],R(gi())):c(ae(r,1),R(gi()));var e=r.length;return Xe(function (u){
                for(var i=-1,o=Pl(u.length,e);++i<o;)u[i]=r[i].call(this,u[i]);return n(t,this,u);
              });
            }),fh=Xe(function (n,t){
              var r=F(t,vi(fh));return ui(n,vn,Y,t,r);
            }),ch=Xe(function (n,t){
              var r=F(t,vi(ch));return ui(n,gn,Y,t,r);
            }),ah=si(function (n,t){
              return ui(n,dn,Y,Y,Y,t);
            }),lh=ni(ge),sh=ni(function (n,t){
              return n>=t;
            }),hh=je(function (){
              return arguments;
            }())?je:function (n){
                return rc(n)&&pl.call(n,'callee')&&!Ol.call(n,'callee');
              },ph=Xa.isArray,_h=Sr?R(Sr):Ae,vh=$l||$a,gh=Lr?R(Lr):ke,yh=Wr?R(Wr):Re,dh=Cr?R(Cr):Se,bh=Ur?R(Ur):Le,wh=Br?R(Br):We,mh=ni(Te),xh=ni(function (n,t){
              return n<=t;
            }),jh=Tu(function (n,t){
              if(Ui(t)||Pf(t))return void Wu(t,Tc(t),n);for(var r in t)pl.call(t,r)&&Kr(n,r,t[r]);
            }),Ah=Tu(function (n,t){
              Wu(t,$c(t),n);
            }),kh=Tu(function (n,t,r,e){
              Wu(t,$c(t),n,e);
            }),Oh=Tu(function (n,t,r,e){
              Wu(t,Tc(t),n,e);
            }),Ih=si(Qr),Rh=Xe(function (n,t){
              n=ul(n);var r=-1,e=t.length,u=e>2?t[2]:Y;for(u&&Ei(t[0],t[1],u)&&(e=1);++r<e;)for(var i=t[r],o=$c(i),f=-1,c=o.length;++f<c;){
                var a=o[f],l=n[a];(l===Y||Nf(l,ll[a])&&!pl.call(n,a))&&(n[a]=i[a]);
              }return n;
            }),zh=Xe(function (t){
              return t.push(Y,oi),n(Ch,Y,t);
            }),Eh=Gu(function (n,t,r){
              null!=t&&'function'!=typeof t.toString&&(t=gl.call(t)),n[t]=r;
            },ka(Ia)),Sh=Gu(function (n,t,r){
              null!=t&&'function'!=typeof t.toString&&(t=gl.call(t)),pl.call(n,t)?n[t].push(r):n[t]=[r];
            },gi),Lh=Xe(xe),Wh=Tu(function (n,t,r){
              Fe(n,t,r);
            }),Ch=Tu(function (n,t,r,e){
              Fe(n,t,r,e);
            }),Uh=si(function (n,t){
              var r={};if(null==n)return r;var e=!1;t=c(t,function (t){
                return t=wu(t,n),e||(e=t.length>1),t;
              }),Wu(n,pi(n),r),e&&(r=ne(r,un|on|fn,fi));for(var u=t.length;u--;)hu(r,t[u]);return r;
            }),Bh=si(function (n,t){
              return null==n?{}:Ze(n,t);
            }),Th=ei(Tc),$h=ei($c),Dh=Nu(function (n,t,r){
              return t=t.toLowerCase(),n+(r?ta(t):t);
            }),Mh=Nu(function (n,t,r){
              return n+(r?'-':'')+t.toLowerCase();
            }),Fh=Nu(function (n,t,r){
              return n+(r?' ':'')+t.toLowerCase();
            }),Nh=Fu('toLowerCase'),Ph=Nu(function (n,t,r){
              return n+(r?'_':'')+t.toLowerCase();
            }),qh=Nu(function (n,t,r){
              return n+(r?' ':'')+Kh(t);
            }),Zh=Nu(function (n,t,r){
              return n+(r?' ':'')+t.toUpperCase();
            }),Kh=Fu('toUpperCase'),Vh=Xe(function (t,r){
              try{
                return n(t,Y,r);
              }catch(n){
                return Jf(n)?n:new tl(n);
              }
            }),Gh=si(function (n,t){
              return r(t,function (t){
                t=Gi(t),Yr(n,t,rh(n[t],n));
              }),n;
            }),Hh=Ku(),Jh=Ku(!0),Yh=Xe(function (n,t){
              return function (r){
                return xe(r,n,t);
              };
            }),Qh=Xe(function (n,t){
              return function (r){
                return xe(n,r,t);
              };
            }),Xh=Ju(c),np=Ju(u),tp=Ju(h),rp=Xu(),ep=Xu(!0),up=Hu(function (n,t){
              return n+t;
            },0),ip=ri('ceil'),op=Hu(function (n,t){
              return n/t;
            },1),fp=ri('floor'),cp=Hu(function (n,t){
              return n*t;
            },1),ap=ri('round'),lp=Hu(function (n,t){
              return n-t;
            },0);return q.after=mf,q.ary=xf,q.assign=jh,q.assignIn=Ah,q.assignInWith=kh,q.assignWith=Oh,q.at=Ih,q.before=jf,q.bind=rh,q.bindAll=Gh,q.bindKey=eh,q.castArray=Bf,q.chain=Ko,q.chunk=Qi,q.compact=Xi,q.concat=no,q.cond=ja,q.conforms=Aa,q.constant=ka,q.countBy=Vs,q.create=kc,q.curry=Af,q.curryRight=kf,q.debounce=Of,q.defaults=Rh,q.defaultsDeep=zh,q.defer=uh,q.delay=ih,q.difference=zs,q.differenceBy=Es,q.differenceWith=Ss,q.drop=to,q.dropRight=ro,q.dropRightWhile=eo,q.dropWhile=uo,q.fill=io,q.filter=ef,q.flatMap=uf,q.flatMapDeep=of,q.flatMapDepth=ff,q.flatten=co,q.flattenDeep=ao,q.flattenDepth=lo,q.flip=If,q.flow=Hh,q.flowRight=Jh,q.fromPairs=so,q.functions=Lc,q.functionsIn=Wc,q.groupBy=Js,q.initial=_o,q.intersection=Ls,q.intersectionBy=Ws,q.intersectionWith=Cs,q.invert=Eh,q.invertBy=Sh,q.invokeMap=Ys,q.iteratee=Ra,q.keyBy=Qs,q.keys=Tc,q.keysIn=$c,q.map=sf,q.mapKeys=Dc,q.mapValues=Mc,q.matches=za,q.matchesProperty=Ea,q.memoize=Rf,q.merge=Wh,q.mergeWith=Ch,q.method=Yh,q.methodOf=Qh,q.mixin=Sa,q.negate=zf,q.nthArg=Ca,q.omit=Uh,q.omitBy=Fc,q.once=Ef,q.orderBy=hf,q.over=Xh,q.overArgs=oh,q.overEvery=np,q.overSome=tp,q.partial=fh,q.partialRight=ch,q.partition=Xs,q.pick=Bh,q.pickBy=Nc,q.property=Ua,q.propertyOf=Ba,q.pull=Us,q.pullAll=wo,q.pullAllBy=mo,q.pullAllWith=xo,q.pullAt=Bs,q.range=rp,q.rangeRight=ep,q.rearg=ah,q.reject=vf,q.remove=jo,q.rest=Sf,q.reverse=Ao,q.sampleSize=yf,q.set=qc,q.setWith=Zc,q.shuffle=df,q.slice=ko,q.sortBy=nh,q.sortedUniq=Lo,q.sortedUniqBy=Wo,q.split=ha,q.spread=Lf,q.tail=Co,q.take=Uo,q.takeRight=Bo,q.takeRightWhile=To,q.takeWhile=$o,q.tap=Vo,q.throttle=Wf,q.thru=Go,q.toArray=yc,q.toPairs=Th,q.toPairsIn=$h,q.toPath=Pa,q.toPlainObject=xc,q.transform=Kc,q.unary=Cf,q.union=Ts,q.unionBy=$s,q.unionWith=Ds,q.uniq=Do,q.uniqBy=Mo,q.uniqWith=Fo,q.unset=Vc,q.unzip=No,q.unzipWith=Po,q.update=Gc,q.updateWith=Hc,q.values=Jc,q.valuesIn=Yc,q.without=Ms,q.words=xa,q.wrap=Uf,q.xor=Fs,q.xorBy=Ns,q.xorWith=Ps,q.zip=qs,q.zipObject=qo,q.zipObjectDeep=Zo,q.zipWith=Zs,q.entries=Th,q.entriesIn=$h,q.extend=Ah,q.extendWith=kh,Sa(q,q),q.add=up,q.attempt=Vh,q.camelCase=Dh,q.capitalize=ta,q.ceil=ip,q.clamp=Qc,q.clone=Tf,q.cloneDeep=Df,q.cloneDeepWith=Mf,q.cloneWith=$f,q.conformsTo=Ff,q.deburr=ra,q.defaultTo=Oa,q.divide=op,q.endsWith=ea,q.eq=Nf,q.escape=ua,q.escapeRegExp=ia,q.every=rf,q.find=Gs,q.findIndex=oo,q.findKey=Oc,q.findLast=Hs,q.findLastIndex=fo,q.findLastKey=Ic,q.floor=fp,q.forEach=cf,q.forEachRight=af,q.forIn=Rc,q.forInRight=zc,q.forOwn=Ec,q.forOwnRight=Sc,q.get=Cc,q.gt=lh,q.gte=sh,q.has=Uc,q.hasIn=Bc,q.head=ho,q.identity=Ia,q.includes=lf,q.indexOf=po,q.inRange=Xc,q.invoke=Lh,q.isArguments=hh,q.isArray=ph,q.isArrayBuffer=_h,q.isArrayLike=Pf,q.isArrayLikeObject=qf,q.isBoolean=Zf,q.isBuffer=vh,q.isDate=gh,q.isElement=Kf,q.isEmpty=Vf,q.isEqual=Gf,q.isEqualWith=Hf,q.isError=Jf,q.isFinite=Yf,q.isFunction=Qf,q.isInteger=Xf,q.isLength=nc,q.isMap=yh,q.isMatch=ec,q.isMatchWith=uc,q.isNaN=ic,q.isNative=oc,q.isNil=cc,q.isNull=fc,q.isNumber=ac,q.isObject=tc,q.isObjectLike=rc,q.isPlainObject=lc,q.isRegExp=dh,q.isSafeInteger=sc,q.isSet=bh,q.isString=hc,q.isSymbol=pc,q.isTypedArray=wh,q.isUndefined=_c,q.isWeakMap=vc,q.isWeakSet=gc,q.join=vo,q.kebabCase=Mh,q.last=go,q.lastIndexOf=yo,q.lowerCase=Fh,q.lowerFirst=Nh,q.lt=mh,q.lte=xh,q.max=Za,q.maxBy=Ka,q.mean=Va,q.meanBy=Ga,q.min=Ha,q.minBy=Ja,q.stubArray=Ta,q.stubFalse=$a,q.stubObject=Da,q.stubString=Ma,q.stubTrue=Fa,q.multiply=cp,q.nth=bo,q.noConflict=La,q.noop=Wa,q.now=th,q.pad=oa,q.padEnd=fa,q.padStart=ca,q.parseInt=aa,q.random=na,q.reduce=pf,q.reduceRight=_f,q.repeat=la,q.replace=sa,q.result=Pc,q.round=ap,q.runInContext=p,q.sample=gf,q.size=bf,q.snakeCase=Ph,q.some=wf,q.sortedIndex=Oo,q.sortedIndexBy=Io,q.sortedIndexOf=Ro,q.sortedLastIndex=zo,q.sortedLastIndexBy=Eo,q.sortedLastIndexOf=So,q.startCase=qh,q.startsWith=pa,q.subtract=lp,q.sum=Ya,q.sumBy=Qa,q.template=_a,q.times=Na,q.toFinite=dc,q.toInteger=bc,q.toLength=wc,q.toLower=va,q.toNumber=mc,q.toSafeInteger=jc,q.toString=Ac,q.toUpper=ga,q.trim=ya,q.trimEnd=da,q.trimStart=ba,q.truncate=wa,q.unescape=ma,q.uniqueId=qa,q.upperCase=Zh,q.upperFirst=Kh,q.each=cf,q.eachRight=af,q.first=ho,Sa(q,function (){
            var n={};return le(q,function (t,r){
              pl.call(q.prototype,r)||(n[r]=t);
            }),n;
          }(),{chain:!1}),q.VERSION='4.17.14',r(['bind','bindKey','curry','curryRight','partial','partialRight'],function (n){
            q[n].placeholder=q;
          }),r(['drop','take'],function (n,t){
            Wt.prototype[n]=function (r){
              r=r===Y?1:Nl(bc(r),0);var e=this.__filtered__&&!t?new Wt(this):this.clone();return e.__filtered__?e.__takeCount__=Pl(r,e.__takeCount__):e.__views__.push({size:Pl(r,En),type:n+(e.__dir__<0?'Right':'')}),e;
            },Wt.prototype[`${n}Right`]=function (t){
              return this.reverse()[n](t).reverse();
            };
          }),r(['filter','map','takeWhile'],function (n,t){
            var r=t+1,e=r==An||3==r;Wt.prototype[n]=function (n){
              var t=this.clone();return t.__iteratees__.push({iteratee:gi(n,3),type:r}),t.__filtered__=t.__filtered__||e,t;
            };
          }),r(['head','last'],function (n,t){
            var r=`take${t?'Right':''}`;Wt.prototype[n]=function (){
              return this[r](1).value()[0];
            };
          }),r(['initial','tail'],function (n,t){
            var r=`drop${t?'':'Right'}`;Wt.prototype[n]=function (){
              return this.__filtered__?new Wt(this):this[r](1);
            };
          }),Wt.prototype.compact=function (){
            return this.filter(Ia);
          },Wt.prototype.find=function (n){
            return this.filter(n).head();
          },Wt.prototype.findLast=function (n){
            return this.reverse().find(n);
          },Wt.prototype.invokeMap=Xe(function (n,t){
            return'function'==typeof n?new Wt(this):this.map(function (r){
              return xe(r,n,t);
            });
          }),Wt.prototype.reject=function (n){
            return this.filter(zf(gi(n)));
          },Wt.prototype.slice=function (n,t){
            n=bc(n);var r=this;return r.__filtered__&&(n>0||t<0)?new Wt(r):(n<0?r=r.takeRight(-n):n&&(r=r.drop(n)),t!==Y&&(t=bc(t),r=t<0?r.dropRight(-t):r.take(t-n)),r);
          },Wt.prototype.takeRightWhile=function (n){
            return this.reverse().takeWhile(n).reverse();
          },Wt.prototype.toArray=function (){
            return this.take(En);
          },le(Wt.prototype,function (n,t){
            var r=/^(?:filter|find|map|reject)|While$/.test(t),e=/^(?:head|last)$/.test(t),u=q[e?`take${'last'==t?'Right':''}`:t],i=e||/^find/.test(t);u&&(q.prototype[t]=function (){
              var t=this.__wrapped__,o=e?[1]:arguments,f=t instanceof Wt,c=o[0],l=f||ph(t),s=function (n){
                var t=u.apply(q,a([n],o));return e&&h?t[0]:t;
              };l&&r&&'function'==typeof c&&1!=c.length&&(f=l=!1);var h=this.__chain__,p=!!this.__actions__.length,_=i&&!h,v=f&&!p;if(!i&&l){
                t=v?t:new Wt(this);var g=n.apply(t,o);return g.__actions__.push({func:Go,args:[s],thisArg:Y}),new H(g,h);
              }return _&&v?n.apply(this,o):(g=this.thru(s),_?e?g.value()[0]:g.value():g);
            });
          }),r(['pop','push','shift','sort','splice','unshift'],function (n){
            var t=cl[n],r=/^(?:push|sort|unshift)$/.test(n)?'tap':'thru',e=/^(?:pop|shift)$/.test(n);q.prototype[n]=function (){
              var n=arguments;if(e&&!this.__chain__){
                var u=this.value();return t.apply(ph(u)?u:[],n);
              }return this[r](function (r){
                return t.apply(ph(r)?r:[],n);
              });
            };
          }),le(Wt.prototype,function (n,t){
            var r=q[t];if(r){
              var e=`${r.name}`;pl.call(ts,e)||(ts[e]=[]),ts[e].push({name:t,func:r});
            }
          }),ts[Vu(Y,sn).name]=[{name:'wrapper',func:Y}],Wt.prototype.clone=Zt,Wt.prototype.reverse=Kt,Wt.prototype.value=Vt,q.prototype.at=Ks,q.prototype.chain=Ho,q.prototype.commit=Jo,q.prototype.next=Yo,q.prototype.plant=Xo,q.prototype.reverse=nf,q.prototype.toJSON=q.prototype.valueOf=q.prototype.value=tf,q.prototype.first=q.prototype.head,zl&&(q.prototype[zl]=Qo),q;
        }();'function'==typeof define&&'object'==typeof define.amd&&define.amd?(kr._=Fr,define(function (){
        return Fr;
      })):Ir?((Ir.exports=Fr)._=Fr,Or._=Fr):kr._=Fr;
    }).call(this);
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{}],87:[function (require,module,exports){
  !function (){
    var r=require('crypt'),n=require('charenc').utf8,e=require('is-buffer'),t=require('charenc').bin,i=function (o,u){
      o.constructor==String?o=u&&'binary'===u.encoding?t.stringToBytes(o):n.stringToBytes(o):e(o)?o=Array.prototype.slice.call(o,0):Array.isArray(o)||(o=o.toString());for(var a=r.bytesToWords(o),s=8*o.length,c=1732584193,f=-271733879,g=-1732584194,l=271733878,y=0;y<a.length;y++)a[y]=16711935&(a[y]<<8|a[y]>>>24)|4278255360&(a[y]<<24|a[y]>>>8);a[s>>>5]|=128<<s%32,a[14+(s+64>>>9<<4)]=s;for(var h=i._ff,v=i._gg,_=i._hh,b=i._ii,y=0;y<a.length;y+=16){
        var d=c,T=f,p=g,q=l;c=h(c,f,g,l,a[y+0],7,-680876936),l=h(l,c,f,g,a[y+1],12,-389564586),g=h(g,l,c,f,a[y+2],17,606105819),f=h(f,g,l,c,a[y+3],22,-1044525330),c=h(c,f,g,l,a[y+4],7,-176418897),l=h(l,c,f,g,a[y+5],12,1200080426),g=h(g,l,c,f,a[y+6],17,-1473231341),f=h(f,g,l,c,a[y+7],22,-45705983),c=h(c,f,g,l,a[y+8],7,1770035416),l=h(l,c,f,g,a[y+9],12,-1958414417),g=h(g,l,c,f,a[y+10],17,-42063),f=h(f,g,l,c,a[y+11],22,-1990404162),c=h(c,f,g,l,a[y+12],7,1804603682),l=h(l,c,f,g,a[y+13],12,-40341101),g=h(g,l,c,f,a[y+14],17,-1502002290),f=h(f,g,l,c,a[y+15],22,1236535329),c=v(c,f,g,l,a[y+1],5,-165796510),l=v(l,c,f,g,a[y+6],9,-1069501632),g=v(g,l,c,f,a[y+11],14,643717713),f=v(f,g,l,c,a[y+0],20,-373897302),c=v(c,f,g,l,a[y+5],5,-701558691),l=v(l,c,f,g,a[y+10],9,38016083),g=v(g,l,c,f,a[y+15],14,-660478335),f=v(f,g,l,c,a[y+4],20,-405537848),c=v(c,f,g,l,a[y+9],5,568446438),l=v(l,c,f,g,a[y+14],9,-1019803690),g=v(g,l,c,f,a[y+3],14,-187363961),f=v(f,g,l,c,a[y+8],20,1163531501),c=v(c,f,g,l,a[y+13],5,-1444681467),l=v(l,c,f,g,a[y+2],9,-51403784),g=v(g,l,c,f,a[y+7],14,1735328473),f=v(f,g,l,c,a[y+12],20,-1926607734),c=_(c,f,g,l,a[y+5],4,-378558),l=_(l,c,f,g,a[y+8],11,-2022574463),g=_(g,l,c,f,a[y+11],16,1839030562),f=_(f,g,l,c,a[y+14],23,-35309556),c=_(c,f,g,l,a[y+1],4,-1530992060),l=_(l,c,f,g,a[y+4],11,1272893353),g=_(g,l,c,f,a[y+7],16,-155497632),f=_(f,g,l,c,a[y+10],23,-1094730640),c=_(c,f,g,l,a[y+13],4,681279174),l=_(l,c,f,g,a[y+0],11,-358537222),g=_(g,l,c,f,a[y+3],16,-722521979),f=_(f,g,l,c,a[y+6],23,76029189),c=_(c,f,g,l,a[y+9],4,-640364487),l=_(l,c,f,g,a[y+12],11,-421815835),g=_(g,l,c,f,a[y+15],16,530742520),f=_(f,g,l,c,a[y+2],23,-995338651),c=b(c,f,g,l,a[y+0],6,-198630844),l=b(l,c,f,g,a[y+7],10,1126891415),g=b(g,l,c,f,a[y+14],15,-1416354905),f=b(f,g,l,c,a[y+5],21,-57434055),c=b(c,f,g,l,a[y+12],6,1700485571),l=b(l,c,f,g,a[y+3],10,-1894986606),g=b(g,l,c,f,a[y+10],15,-1051523),f=b(f,g,l,c,a[y+1],21,-2054922799),c=b(c,f,g,l,a[y+8],6,1873313359),l=b(l,c,f,g,a[y+15],10,-30611744),g=b(g,l,c,f,a[y+6],15,-1560198380),f=b(f,g,l,c,a[y+13],21,1309151649),c=b(c,f,g,l,a[y+4],6,-145523070),l=b(l,c,f,g,a[y+11],10,-1120210379),g=b(g,l,c,f,a[y+2],15,718787259),f=b(f,g,l,c,a[y+9],21,-343485551),c=c+d>>>0,f=f+T>>>0,g=g+p>>>0,l=l+q>>>0;
      }return r.endian([c,f,g,l]);
    };i._ff=function (r,n,e,t,i,o,u){
      var a=r+(n&e|~n&t)+(i>>>0)+u;return(a<<o|a>>>32-o)+n;
    },i._gg=function (r,n,e,t,i,o,u){
      var a=r+(n&t|e&~t)+(i>>>0)+u;return(a<<o|a>>>32-o)+n;
    },i._hh=function (r,n,e,t,i,o,u){
      var a=r+(n^e^t)+(i>>>0)+u;return(a<<o|a>>>32-o)+n;
    },i._ii=function (r,n,e,t,i,o,u){
      var a=r+(e^(n|~t))+(i>>>0)+u;return(a<<o|a>>>32-o)+n;
    },i._blocksize=16,i._digestsize=16,module.exports=function (n,e){
      if(void 0===n||null===n)throw new Error(`Illegal argument ${n}`);var o=r.wordsToBytes(i(n,e));return e&&e.asBytes?o:e&&e.asString?t.bytesToString(o):r.bytesToHex(o);
    };
  }();
},{'charenc':59,'crypt':63,'is-buffer':84}],88:[function (require,module,exports){
  exports.encode=function (e){
    var n='';for(var o in e)e.hasOwnProperty(o)&&(n.length&&(n+='&'),n+=`${encodeURIComponent(o)}=${encodeURIComponent(e[o])}`);return n;
  },exports.decode=function (e){
    for(var n={},o=e.split('&'),t=0,r=o.length;t<r;t++){
      var d=o[t].split('=');n[decodeURIComponent(d[0])]=decodeURIComponent(d[1]);
    }return n;
  };
},{}],89:[function (require,module,exports){
  var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,parts=['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'];module.exports=function (r){
    var e=r,t=r.indexOf('['),s=r.indexOf(']');-1!=t&&-1!=s&&(r=r.substring(0,t)+r.substring(t,s).replace(/:/g,';')+r.substring(s,r.length));for(var o=re.exec(r||''),a={},u=14;u--;)a[parts[u]]=o[u]||'';return-1!=t&&-1!=s&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,':'),a.authority=a.authority.replace('[','').replace(']','').replace(/;/g,':'),a.ipv6uri=!0),a;
  };
},{}],90:[function (require,module,exports){
  function defaultSetTimout(){
    throw new Error('setTimeout has not been defined');
  }function defaultClearTimeout(){
    throw new Error('clearTimeout has not been defined');
  }function runTimeout(e){
    if(cachedSetTimeout===setTimeout)return setTimeout(e,0);if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout)return cachedSetTimeout=setTimeout,setTimeout(e,0);try{
      return cachedSetTimeout(e,0);
    }catch(t){
      try{
        return cachedSetTimeout.call(null,e,0);
      }catch(t){
        return cachedSetTimeout.call(this,e,0);
      }
    }
  }function runClearTimeout(e){
    if(cachedClearTimeout===clearTimeout)return clearTimeout(e);if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout)return cachedClearTimeout=clearTimeout,clearTimeout(e);try{
      return cachedClearTimeout(e);
    }catch(t){
      try{
        return cachedClearTimeout.call(null,e);
      }catch(t){
        return cachedClearTimeout.call(this,e);
      }
    }
  }function cleanUpNextTick(){
    draining&&currentQueue&&(draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue());
  }function drainQueue(){
    if(!draining){
      var e=runTimeout(cleanUpNextTick);draining=!0;for(var t=queue.length;t;){
        for(currentQueue=queue,queue=[];++queueIndex<t;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,t=queue.length;
      }currentQueue=null,draining=!1,runClearTimeout(e);
    }
  }function Item(e,t){
    this.fun=e,this.array=t;
  }function noop(){}var process=module.exports={},cachedSetTimeout,cachedClearTimeout;!function (){
    try{
      cachedSetTimeout='function'==typeof setTimeout?setTimeout:defaultSetTimout;
    }catch(e){
      cachedSetTimeout=defaultSetTimout;
    }try{
      cachedClearTimeout='function'==typeof clearTimeout?clearTimeout:defaultClearTimeout;
    }catch(e){
      cachedClearTimeout=defaultClearTimeout;
    }
  }();var queue=[],draining=!1,currentQueue,queueIndex=-1;process.nextTick=function (e){
    var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];queue.push(new Item(e,t)),1!==queue.length||draining||runTimeout(drainQueue);
  },Item.prototype.run=function (){
    this.fun.apply(null,this.array);
  },process.title='browser',process.browser=!0,process.env={},process.argv=[],process.version='',process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.prependListener=noop,process.prependOnceListener=noop,process.listeners=function (e){
    return[];
  },process.binding=function (e){
    throw new Error('process.binding is not supported');
  },process.cwd=function (){
    return'/';
  },process.chdir=function (e){
    throw new Error('process.chdir is not supported');
  },process.umask=function (){
    return 0;
  };
},{}],91:[function (require,module,exports){
  function lookup(e,r){
    'object'==typeof e&&(r=e,e=void 0),r=r||{};var o,c=url(e),a=c.source,t=c.id,u=c.path,n=cache[t]&&u in cache[t].nsps,s=r.forceNew||r['force new connection']||!1===r.multiplex||n;return s?(debug('ignoring socket cache for %s',a),o=Manager(a,r)):(cache[t]||(debug('new io instance for %s',a),cache[t]=Manager(a,r)),o=cache[t]),c.query&&!r.query&&(r.query=c.query),o.socket(c.path,r);
  }var url=require('./url'),parser=require('socket.io-parser'),Manager=require('./manager'),debug=require('debug')('socket.io-client');module.exports=exports=lookup;var cache=exports.managers={};exports.protocol=parser.protocol,exports.connect=lookup,exports.Manager=require('./manager'),exports.Socket=require('./socket');
},{'./manager':92,'./socket':94,'./url':95,'debug':96,'socket.io-parser':100}],92:[function (require,module,exports){
  function Manager(t,e){
    if(!(this instanceof Manager))return new Manager(t,e);t&&'object'==typeof t&&(e=t,t=void 0),e=e||{},e.path=e.path||'/socket.io',this.nsps={},this.subs=[],this.opts=e,this.reconnection(!1!==e.reconnection),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new Backoff({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState='closed',this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[];var n=e.parser||parser;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this.autoConnect=!1!==e.autoConnect,this.autoConnect&&this.open();
  }var eio=require('engine.io-client'),Socket=require('./socket'),Emitter=require('component-emitter'),parser=require('socket.io-parser'),on=require('./on'),bind=require('component-bind'),debug=require('debug')('socket.io-client:manager'),indexOf=require('indexof'),Backoff=require('backo2'),has=Object.prototype.hasOwnProperty;module.exports=Manager,Manager.prototype.emitAll=function (){
    this.emit.apply(this,arguments);for(var t in this.nsps)has.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments);
  },Manager.prototype.updateSocketIds=function (){
    for(var t in this.nsps)has.call(this.nsps,t)&&(this.nsps[t].id=this.generateId(t));
  },Manager.prototype.generateId=function (t){
    return('/'===t?'':`${t}#`)+this.engine.id;
  },Emitter(Manager.prototype),Manager.prototype.reconnection=function (t){
    return arguments.length?(this._reconnection=!!t,this):this._reconnection;
  },Manager.prototype.reconnectionAttempts=function (t){
    return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts;
  },Manager.prototype.reconnectionDelay=function (t){
    return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay;
  },Manager.prototype.randomizationFactor=function (t){
    return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor;
  },Manager.prototype.reconnectionDelayMax=function (t){
    return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax;
  },Manager.prototype.timeout=function (t){
    return arguments.length?(this._timeout=t,this):this._timeout;
  },Manager.prototype.maybeReconnectOnOpen=function (){
    !this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect();
  },Manager.prototype.open=Manager.prototype.connect=function (t,e){
    if(debug('readyState %s',this.readyState),~this.readyState.indexOf('open'))return this;debug('opening %s',this.uri),this.engine=eio(this.uri,this.opts);var n=this.engine,o=this;this.readyState='opening',this.skipReconnect=!1;var i=on(n,'open',function (){
        o.onopen(),t&&t();
      }),s=on(n,'error',function (e){
        if(debug('connect_error'),o.cleanup(),o.readyState='closed',o.emitAll('connect_error',e),t){
          var n=new Error('Connection error');n.data=e,t(n);
        }else o.maybeReconnectOnOpen();
      });if(!1!==this._timeout){
      var r=this._timeout;debug('connect attempt will timeout after %d',r);var c=setTimeout(function (){
        debug('connect attempt timed out after %d',r),i.destroy(),n.close(),n.emit('error','timeout'),o.emitAll('connect_timeout',r);
      },r);this.subs.push({destroy:function (){
        clearTimeout(c);
      }});
    }return this.subs.push(i),this.subs.push(s),this;
  },Manager.prototype.onopen=function (){
    debug('open'),this.cleanup(),this.readyState='open',this.emit('open');var t=this.engine;this.subs.push(on(t,'data',bind(this,'ondata'))),this.subs.push(on(t,'ping',bind(this,'onping'))),this.subs.push(on(t,'pong',bind(this,'onpong'))),this.subs.push(on(t,'error',bind(this,'onerror'))),this.subs.push(on(t,'close',bind(this,'onclose'))),this.subs.push(on(this.decoder,'decoded',bind(this,'ondecoded')));
  },Manager.prototype.onping=function (){
    this.lastPing=new Date,this.emitAll('ping');
  },Manager.prototype.onpong=function (){
    this.emitAll('pong',new Date-this.lastPing);
  },Manager.prototype.ondata=function (t){
    this.decoder.add(t);
  },Manager.prototype.ondecoded=function (t){
    this.emit('packet',t);
  },Manager.prototype.onerror=function (t){
    debug('error',t),this.emitAll('error',t);
  },Manager.prototype.socket=function (t,e){
    function n(){
      ~indexOf(i.connecting,o)||i.connecting.push(o);
    }var o=this.nsps[t];if(!o){
      o=new Socket(this,t,e),this.nsps[t]=o;var i=this;o.on('connecting',n),o.on('connect',function (){
        o.id=i.generateId(t);
      }),this.autoConnect&&n();
    }return o;
  },Manager.prototype.destroy=function (t){
    var e=indexOf(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close();
  },Manager.prototype.packet=function (t){
    debug('writing packet %j',t);var e=this;t.query&&0===t.type&&(t.nsp+=`?${t.query}`),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function (n){
      for(var o=0;o<n.length;o++)e.engine.write(n[o],t.options);e.encoding=!1,e.processPacketQueue();
    }));
  },Manager.prototype.processPacketQueue=function (){
    if(this.packetBuffer.length>0&&!this.encoding){
      var t=this.packetBuffer.shift();this.packet(t);
    }
  },Manager.prototype.cleanup=function (){
    debug('cleanup');for(var t=this.subs.length,e=0;e<t;e++){
      this.subs.shift().destroy();
    }this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy();
  },Manager.prototype.close=Manager.prototype.disconnect=function (){
    debug('disconnect'),this.skipReconnect=!0,this.reconnecting=!1,'opening'===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState='closed',this.engine&&this.engine.close();
  },Manager.prototype.onclose=function (t){
    debug('onclose'),this.cleanup(),this.backoff.reset(),this.readyState='closed',this.emit('close',t),this._reconnection&&!this.skipReconnect&&this.reconnect();
  },Manager.prototype.reconnect=function (){
    if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)debug('reconnect failed'),this.backoff.reset(),this.emitAll('reconnect_failed'),this.reconnecting=!1;else{
      var e=this.backoff.duration();debug('will wait %dms before reconnect attempt',e),this.reconnecting=!0;var n=setTimeout(function (){
        t.skipReconnect||(debug('attempting reconnect'),t.emitAll('reconnect_attempt',t.backoff.attempts),t.emitAll('reconnecting',t.backoff.attempts),t.skipReconnect||t.open(function (e){
          e?(debug('reconnect attempt error'),t.reconnecting=!1,t.reconnect(),t.emitAll('reconnect_error',e.data)):(debug('reconnect success'),t.onreconnect());
        }));
      },e);this.subs.push({destroy:function (){
        clearTimeout(n);
      }});
    }
  },Manager.prototype.onreconnect=function (){
    var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll('reconnect',t);
  };
},{'./on':93,'./socket':94,'backo2':53,'component-bind':60,'component-emitter':61,'debug':96,'engine.io-client':64,'indexof':83,'socket.io-parser':100}],93:[function (require,module,exports){
  function on(n,o,e){
    return n.on(o,e),{destroy:function (){
      n.removeListener(o,e);
    }};
  }module.exports=on;
},{}],94:[function (require,module,exports){
  function Socket(t,e,s){
    this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,this.flags={},s&&s.query&&(this.query=s.query),this.io.autoConnect&&this.open();
  }var parser=require('socket.io-parser'),Emitter=require('component-emitter'),toArray=require('to-array'),on=require('./on'),bind=require('component-bind'),debug=require('debug')('socket.io-client:socket'),parseqs=require('parseqs'),hasBin=require('has-binary2');module.exports=exports=Socket;var events={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},emit=Emitter.prototype.emit;Emitter(Socket.prototype),Socket.prototype.subEvents=function (){
    if(!this.subs){
      var t=this.io;this.subs=[on(t,'open',bind(this,'onopen')),on(t,'packet',bind(this,'onpacket')),on(t,'close',bind(this,'onclose'))];
    }
  },Socket.prototype.open=Socket.prototype.connect=function (){
    return this.connected?this:(this.subEvents(),this.io.open(),'open'===this.io.readyState&&this.onopen(),this.emit('connecting'),this);
  },Socket.prototype.send=function (){
    var t=toArray(arguments);return t.unshift('message'),this.emit.apply(this,t),this;
  },Socket.prototype.emit=function (t){
    if(events.hasOwnProperty(t))return emit.apply(this,arguments),this;var e=toArray(arguments),s={type:(void 0!==this.flags.binary?this.flags.binary:hasBin(e))?parser.BINARY_EVENT:parser.EVENT,data:e};return s.options={},s.options.compress=!this.flags||!1!==this.flags.compress,'function'==typeof e[e.length-1]&&(debug('emitting packet with ack id %d',this.ids),this.acks[this.ids]=e.pop(),s.id=this.ids++),this.connected?this.packet(s):this.sendBuffer.push(s),this.flags={},this;
  },Socket.prototype.packet=function (t){
    t.nsp=this.nsp,this.io.packet(t);
  },Socket.prototype.onopen=function (){
    if(debug('transport is open - connecting'),'/'!==this.nsp)if(this.query){
      var t='object'==typeof this.query?parseqs.encode(this.query):this.query;debug('sending connect packet with query %s',t),this.packet({type:parser.CONNECT,query:t});
    }else this.packet({type:parser.CONNECT});
  },Socket.prototype.onclose=function (t){
    debug('close (%s)',t),this.connected=!1,this.disconnected=!0,delete this.id,this.emit('disconnect',t);
  },Socket.prototype.onpacket=function (t){
    var e=t.nsp===this.nsp,s=t.type===parser.ERROR&&'/'===t.nsp;if(e||s)switch(t.type){
    case parser.CONNECT:this.onconnect();break;case parser.EVENT:case parser.BINARY_EVENT:this.onevent(t);break;case parser.ACK:case parser.BINARY_ACK:this.onack(t);break;case parser.DISCONNECT:this.ondisconnect();break;case parser.ERROR:this.emit('error',t.data);
      }
  },Socket.prototype.onevent=function (t){
    var e=t.data||[];debug('emitting event %j',e),null!=t.id&&(debug('attaching ack callback to event'),e.push(this.ack(t.id))),this.connected?emit.apply(this,e):this.receiveBuffer.push(e);
  },Socket.prototype.ack=function (t){
    var e=this,s=!1;return function (){
      if(!s){
        s=!0;var i=toArray(arguments);debug('sending ack %j',i),e.packet({type:hasBin(i)?parser.BINARY_ACK:parser.ACK,id:t,data:i});
      }
    };
  },Socket.prototype.onack=function (t){
    var e=this.acks[t.id];'function'==typeof e?(debug('calling ack %s with %j',t.id,t.data),e.apply(this,t.data),delete this.acks[t.id]):debug('bad ack %s',t.id);
  },Socket.prototype.onconnect=function (){
    this.connected=!0,this.disconnected=!1,this.emit('connect'),this.emitBuffered();
  },Socket.prototype.emitBuffered=function (){
    var t;for(t=0;t<this.receiveBuffer.length;t++)emit.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[];
  },Socket.prototype.ondisconnect=function (){
    debug('server disconnect (%s)',this.nsp),this.destroy(),this.onclose('io server disconnect');
  },Socket.prototype.destroy=function (){
    if(this.subs){
      for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null;
    }this.io.destroy(this);
  },Socket.prototype.close=Socket.prototype.disconnect=function (){
    return this.connected&&(debug('performing disconnect (%s)',this.nsp),this.packet({type:parser.DISCONNECT})),this.destroy(),this.connected&&this.onclose('io client disconnect'),this;
  },Socket.prototype.compress=function (t){
    return this.flags.compress=t,this;
  },Socket.prototype.binary=function (t){
    return this.flags.binary=t,this;
  };
},{'./on':93,'component-bind':60,'component-emitter':61,'debug':96,'has-binary2':79,'parseqs':88,'socket.io-parser':100,'to-array':108}],95:[function (require,module,exports){
  function url(o,t){
    var r=o;t=t||'undefined'!=typeof location&&location,null==o&&(o=`${t.protocol}//${t.host}`),'string'==typeof o&&('/'===o.charAt(0)&&(o='/'===o.charAt(1)?t.protocol+o:t.host+o),/^(https?|wss?):\/\//.test(o)||(debug('protocol-less url %s',o),o=void 0!==t?`${t.protocol}//${o}`:`https://${o}`),debug('parse %s',o),r=parseuri(o)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port='80':/^(http|ws)s$/.test(r.protocol)&&(r.port='443')),r.path=r.path||'/';var p=-1!==r.host.indexOf(':'),e=p?`[${r.host}]`:r.host;return r.id=`${r.protocol}://${e}:${r.port}`,r.href=`${r.protocol}://${e}${t&&t.port===r.port?'':`:${r.port}`}`,r;
  }var parseuri=require('parseuri'),debug=require('debug')('socket.io-client:url');module.exports=url;
},{'debug':96,'parseuri':89}],96:[function (require,module,exports){
  (function (process){
    function useColors(){
      return!('undefined'==typeof window||!window.process||'renderer'!==window.process.type)||('undefined'==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&('undefined'!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||'undefined'!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||'undefined'!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||'undefined'!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }function formatArgs(e){
      var o=this.useColors;if(e[0]=`${(o?'%c':'')+this.namespace+(o?' %c':' ')+e[0]+(o?'%c ':' ')}+${exports.humanize(this.diff)}`,o){
        var C=`color: ${this.color}`;e.splice(1,0,C,'color: inherit');var t=0,r=0;e[0].replace(/%[a-zA-Z%]/g,function (e){
          '%%'!==e&&(t++,'%c'===e&&(r=t));
        }),e.splice(r,0,C);
      }
    }function log(){
      return'object'==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments);
    }function save(e){
      try{
        null==e?exports.storage.removeItem('debug'):exports.storage.debug=e;
      }catch(e){}
    }function load(){
      var e;try{
        e=exports.storage.debug;
      }catch(e){}return!e&&'undefined'!=typeof process&&'env'in process&&(e=process.env.DEBUG),e;
    }function localstorage(){
      try{
        return window.localStorage;
      }catch(e){}
    }exports=module.exports=require('./debug'),exports.log=log,exports.formatArgs=formatArgs,exports.save=save,exports.load=load,exports.useColors=useColors,exports.storage='undefined'!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:localstorage(),exports.colors=['#0000CC','#0000FF','#0033CC','#0033FF','#0066CC','#0066FF','#0099CC','#0099FF','#00CC00','#00CC33','#00CC66','#00CC99','#00CCCC','#00CCFF','#3300CC','#3300FF','#3333CC','#3333FF','#3366CC','#3366FF','#3399CC','#3399FF','#33CC00','#33CC33','#33CC66','#33CC99','#33CCCC','#33CCFF','#6600CC','#6600FF','#6633CC','#6633FF','#66CC00','#66CC33','#9900CC','#9900FF','#9933CC','#9933FF','#99CC00','#99CC33','#CC0000','#CC0033','#CC0066','#CC0099','#CC00CC','#CC00FF','#CC3300','#CC3333','#CC3366','#CC3399','#CC33CC','#CC33FF','#CC6600','#CC6633','#CC9900','#CC9933','#CCCC00','#CCCC33','#FF0000','#FF0033','#FF0066','#FF0099','#FF00CC','#FF00FF','#FF3300','#FF3333','#FF3366','#FF3399','#FF33CC','#FF33FF','#FF6600','#FF6633','#FF9900','#FF9933','#FFCC00','#FFCC33'],exports.formatters.j=function (e){
      try{
        return JSON.stringify(e);
      }catch(e){
        return`[UnexpectedJSONParseError]: ${e.message}`;
      }
    },exports.enable(load());
  }).call(this,require('_process'));

},{'./debug':97,'_process':90}],97:[function (require,module,exports){
  arguments[4][74][0].apply(exports,arguments);
},{'dup':74,'ms':98}],98:[function (require,module,exports){
  arguments[4][75][0].apply(exports,arguments);
},{'dup':75}],99:[function (require,module,exports){
  function _deconstructPacket(t,e){
    if(!t)return t;if(isBuf(t)){
      var r={_placeholder:!0,num:e.length};return e.push(t),r;
    }if(isArray(t)){
      for(var n=new Array(t.length),o=0;o<t.length;o++)n[o]=_deconstructPacket(t[o],e);return n;
    }if('object'==typeof t&&!(t instanceof Date)){
      var n={};for(var i in t)n[i]=_deconstructPacket(t[i],e);return n;
    }return t;
  }function _reconstructPacket(t,e){
    if(!t)return t;if(t&&t._placeholder)return e[t.num];if(isArray(t))for(var r=0;r<t.length;r++)t[r]=_reconstructPacket(t[r],e);else if('object'==typeof t)for(var n in t)t[n]=_reconstructPacket(t[n],e);return t;
  }var isArray=require('isarray'),isBuf=require('./is-buffer'),toString=Object.prototype.toString,withNativeBlob='function'==typeof Blob||'undefined'!=typeof Blob&&'[object BlobConstructor]'===toString.call(Blob),withNativeFile='function'==typeof File||'undefined'!=typeof File&&'[object FileConstructor]'===toString.call(File);exports.deconstructPacket=function (t){
    var e=[],r=t.data,n=t;return n.data=_deconstructPacket(r,e),n.attachments=e.length,{packet:n,buffers:e};
  },exports.reconstructPacket=function (t,e){
    return t.data=_reconstructPacket(t.data,e),t.attachments=void 0,t;
  },exports.removeBlobs=function (t,e){
    function r(t,i,a){
      if(!t)return t;if(withNativeBlob&&t instanceof Blob||withNativeFile&&t instanceof File){
        n++;var c=new FileReader;c.onload=function (){
          a?a[i]=this.result:o=this.result,--n||e(o);
        },c.readAsArrayBuffer(t);
      }else if(isArray(t))for(var f=0;f<t.length;f++)r(t[f],f,t);else if('object'==typeof t&&!isBuf(t))for(var u in t)r(t[u],u,t);
    }var n=0,o=t;r(o),n||e(o);
  };
},{'./is-buffer':101,'isarray':104}],100:[function (require,module,exports){
  function Encoder(){}function encodeAsString(r){
    var t=`${r.type}`;if(exports.BINARY_EVENT!==r.type&&exports.BINARY_ACK!==r.type||(t+=`${r.attachments}-`),r.nsp&&'/'!==r.nsp&&(t+=`${r.nsp},`),null!=r.id&&(t+=r.id),null!=r.data){
      var e=tryStringify(r.data);if(!1===e)return ERROR_PACKET;t+=e;
    }return debug('encoded %j as %s',r,t),t;
  }function tryStringify(r){
    try{
      return JSON.stringify(r);
    }catch(r){
      return!1;
    }
  }function encodeAsBinary(r,t){
    function e(r){
      var e=binary.deconstructPacket(r),n=encodeAsString(e.packet),o=e.buffers;o.unshift(n),t(o);
    }binary.removeBlobs(r,e);
  }function Decoder(){
    this.reconstructor=null;
  }function decodeString(r){
    var t=0,e={type:Number(r.charAt(0))};if(null==exports.types[e.type])return error(`unknown packet type ${e.type}`);if(exports.BINARY_EVENT===e.type||exports.BINARY_ACK===e.type){
      for(var n='';'-'!==r.charAt(++t)&&(n+=r.charAt(t),t!=r.length););if(n!=Number(n)||'-'!==r.charAt(t))throw new Error('Illegal attachments');e.attachments=Number(n);
    }if('/'===r.charAt(t+1))for(e.nsp='';++t;){
      var o=r.charAt(t);if(','===o)break;if(e.nsp+=o,t===r.length)break;
    }else e.nsp='/';var i=r.charAt(t+1);if(''!==i&&Number(i)==i){
      for(e.id='';++t;){
        var o=r.charAt(t);if(null==o||Number(o)!=o){
          --t;break;
        }if(e.id+=r.charAt(t),t===r.length)break;
      }e.id=Number(e.id);
    }if(r.charAt(++t)){
      var s=tryParse(r.substr(t));if(!(!1!==s&&(e.type===exports.ERROR||isArray(s))))return error('invalid payload');e.data=s;
    }return debug('decoded %s as %j',r,e),e;
  }function tryParse(r){
    try{
      return JSON.parse(r);
    }catch(r){
      return!1;
    }
  }function BinaryReconstructor(r){
    this.reconPack=r,this.buffers=[];
  }function error(r){
    return{type:exports.ERROR,data:`parser error: ${r}`};
  }var debug=require('debug')('socket.io-parser'),Emitter=require('component-emitter'),binary=require('./binary'),isArray=require('isarray'),isBuf=require('./is-buffer');exports.protocol=4,exports.types=['CONNECT','DISCONNECT','EVENT','ACK','ERROR','BINARY_EVENT','BINARY_ACK'],exports.CONNECT=0,exports.DISCONNECT=1,exports.EVENT=2,exports.ACK=3,exports.ERROR=4,exports.BINARY_EVENT=5,exports.BINARY_ACK=6,exports.Encoder=Encoder,exports.Decoder=Decoder;var ERROR_PACKET=`${exports.ERROR}"encode error"`;Encoder.prototype.encode=function (r,t){
    if(debug('encoding packet %j',r),exports.BINARY_EVENT===r.type||exports.BINARY_ACK===r.type)encodeAsBinary(r,t);else{
      t([encodeAsString(r)]);
    }
  },Emitter(Decoder.prototype),Decoder.prototype.add=function (r){
    var t;if('string'==typeof r)t=decodeString(r),exports.BINARY_EVENT===t.type||exports.BINARY_ACK===t.type?(this.reconstructor=new BinaryReconstructor(t),0===this.reconstructor.reconPack.attachments&&this.emit('decoded',t)):this.emit('decoded',t);else{
      if(!isBuf(r)&&!r.base64)throw new Error(`Unknown type: ${r}`);if(!this.reconstructor)throw new Error('got binary data when not reconstructing a packet');(t=this.reconstructor.takeBinaryData(r))&&(this.reconstructor=null,this.emit('decoded',t));
    }
  },Decoder.prototype.destroy=function (){
    this.reconstructor&&this.reconstructor.finishedReconstruction();
  },BinaryReconstructor.prototype.takeBinaryData=function (r){
    if(this.buffers.push(r),this.buffers.length===this.reconPack.attachments){
      var t=binary.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),t;
    }return null;
  },BinaryReconstructor.prototype.finishedReconstruction=function (){
    this.reconPack=null,this.buffers=[];
  };
},{'./binary':99,'./is-buffer':101,'component-emitter':61,'debug':102,'isarray':104}],101:[function (require,module,exports){
  (function (Buffer){
    function isBuf(f){
      return withNativeBuffer&&Buffer.isBuffer(f)||withNativeArrayBuffer&&(f instanceof ArrayBuffer||isView(f));
    }module.exports=isBuf;var withNativeBuffer='function'==typeof Buffer&&'function'==typeof Buffer.isBuffer,withNativeArrayBuffer='function'==typeof ArrayBuffer,isView=function (f){
      return'function'==typeof ArrayBuffer.isView?ArrayBuffer.isView(f):f.buffer instanceof ArrayBuffer;
    };
  }).call(this,require('buffer').Buffer);

},{'buffer':58}],102:[function (require,module,exports){
  (function (process){
    function useColors(){
      return!('undefined'==typeof window||!window.process||'renderer'!==window.process.type)||('undefined'==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&('undefined'!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||'undefined'!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||'undefined'!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||'undefined'!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }function formatArgs(e){
      var o=this.useColors;if(e[0]=`${(o?'%c':'')+this.namespace+(o?' %c':' ')+e[0]+(o?'%c ':' ')}+${exports.humanize(this.diff)}`,o){
        var C=`color: ${this.color}`;e.splice(1,0,C,'color: inherit');var t=0,r=0;e[0].replace(/%[a-zA-Z%]/g,function (e){
          '%%'!==e&&(t++,'%c'===e&&(r=t));
        }),e.splice(r,0,C);
      }
    }function log(){
      return'object'==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments);
    }function save(e){
      try{
        null==e?exports.storage.removeItem('debug'):exports.storage.debug=e;
      }catch(e){}
    }function load(){
      var e;try{
        e=exports.storage.debug;
      }catch(e){}return!e&&'undefined'!=typeof process&&'env'in process&&(e=process.env.DEBUG),e;
    }function localstorage(){
      try{
        return window.localStorage;
      }catch(e){}
    }exports=module.exports=require('./debug'),exports.log=log,exports.formatArgs=formatArgs,exports.save=save,exports.load=load,exports.useColors=useColors,exports.storage='undefined'!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:localstorage(),exports.colors=['#0000CC','#0000FF','#0033CC','#0033FF','#0066CC','#0066FF','#0099CC','#0099FF','#00CC00','#00CC33','#00CC66','#00CC99','#00CCCC','#00CCFF','#3300CC','#3300FF','#3333CC','#3333FF','#3366CC','#3366FF','#3399CC','#3399FF','#33CC00','#33CC33','#33CC66','#33CC99','#33CCCC','#33CCFF','#6600CC','#6600FF','#6633CC','#6633FF','#66CC00','#66CC33','#9900CC','#9900FF','#9933CC','#9933FF','#99CC00','#99CC33','#CC0000','#CC0033','#CC0066','#CC0099','#CC00CC','#CC00FF','#CC3300','#CC3333','#CC3366','#CC3399','#CC33CC','#CC33FF','#CC6600','#CC6633','#CC9900','#CC9933','#CCCC00','#CCCC33','#FF0000','#FF0033','#FF0066','#FF0099','#FF00CC','#FF00FF','#FF3300','#FF3333','#FF3366','#FF3399','#FF33CC','#FF33FF','#FF6600','#FF6633','#FF9900','#FF9933','#FFCC00','#FFCC33'],exports.formatters.j=function (e){
      try{
        return JSON.stringify(e);
      }catch(e){
        return`[UnexpectedJSONParseError]: ${e.message}`;
      }
    },exports.enable(load());
  }).call(this,require('_process'));

},{'./debug':103,'_process':90}],103:[function (require,module,exports){
  arguments[4][74][0].apply(exports,arguments);
},{'dup':74,'ms':105}],104:[function (require,module,exports){
  arguments[4][80][0].apply(exports,arguments);
},{'dup':80}],105:[function (require,module,exports){
  arguments[4][75][0].apply(exports,arguments);
},{'dup':75}],106:[function (require,module,exports){
  'use strict';
  const ansiRegex = require('ansi-regex');

  const stripAnsi = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;

  module.exports = stripAnsi;
  module.exports.default = stripAnsi;

},{'ansi-regex':107}],107:[function (require,module,exports){
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

},{}],108:[function (require,module,exports){
  function toArray(r,o){
    var t=[];o=o||0;for(var a=o||0;a<r.length;a++)t[a-o]=r[a];return t;
  }module.exports=toArray;
},{}],109:[function (require,module,exports){
  'use strict';function encode(e){
    var t='';do{
      t=alphabet[e%length]+t,e=Math.floor(e/length);
    }while(e>0);return t;
  }function decode(e){
    var t=0;for(i=0;i<e.length;i++)t=t*length+map[e.charAt(i)];return t;
  }function yeast(){
    var e=encode(+new Date);return e!==prev?(seed=0,prev=e):`${e}.${encode(seed++)}`;
  }for(var alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''),length=64,map={},seed=0,i=0,prev;i<length;i++)map[alphabet[i]]=i;yeast.encode=encode,yeast.decode=decode,module.exports=yeast;
},{}],110:[function (require,module,exports){
  (function (global){
    angular=global.angular=require('angular');var __browserify_shim_require__=require;(function (e,t,a){
      angular.module('ui.bootstrap',['ui.bootstrap.buttons','ui.bootstrap.position','ui.bootstrap.datepicker','ui.bootstrap.pagination','ui.bootstrap.rating','ui.bootstrap.timepicker','ui.bootstrap.bindHtml','ui.bootstrap.typeahead']),angular.module('ui.bootstrap.buttons',[]).constant('buttonConfig',{activeClass:'active',toggleEvent:'click'}).directive('btnRadio',['buttonConfig',function (e){
        var t=e.activeClass||'active',a=e.toggleEvent||'click';return{require:'ngModel',link:function (e,n,i,r){
          r.$render=function (){
            n.toggleClass(t,angular.equals(r.$modelValue,e.$eval(i.btnRadio)));
          },n.bind(a,function (){
            n.hasClass(t)||e.$apply(function (){
              r.$setViewValue(e.$eval(i.btnRadio)),r.$render();
            });
          });
        }};
      }]).directive('btnCheckbox',['buttonConfig',function (e){
        var t=e.activeClass||'active',a=e.toggleEvent||'click';return{require:'ngModel',link:function (e,n,i,r){
          function o(){
            var t=e.$eval(i.btnCheckboxTrue);return!angular.isDefined(t)||t;
          }function l(){
            var t=e.$eval(i.btnCheckboxFalse);return!!angular.isDefined(t)&&t;
          }r.$render=function (){
            n.toggleClass(t,angular.equals(r.$modelValue,o()));
          },n.bind(a,function (){
            e.$apply(function (){
              r.$setViewValue(n.hasClass(t)?l():o()),r.$render();
            });
          });
        }};
      }]),angular.module('ui.bootstrap.position',[]).factory('$position',['$document','$window',function (e,t){
        function a(e,a){
          return e.currentStyle?e.currentStyle[a]:t.getComputedStyle?t.getComputedStyle(e)[a]:e.style[a];
        }function n(e){
          return'static'===(a(e,'position')||'static');
        }var i=function (t){
          for(var a=e[0],i=t.offsetParent||a;i&&i!==a&&n(i);)i=i.offsetParent;return i||a;
        };return{position:function (t){
          var a=this.offset(t),n={top:0,left:0},r=i(t[0]);return r!=e[0]&&(n=this.offset(angular.element(r)),n.top+=r.clientTop-r.scrollTop,n.left+=r.clientLeft-r.scrollLeft),{width:t.prop('offsetWidth'),height:t.prop('offsetHeight'),top:a.top-n.top,left:a.left-n.left};
        },offset:function (a){
          var n=a[0].getBoundingClientRect();return{width:a.prop('offsetWidth'),height:a.prop('offsetHeight'),top:n.top+(t.pageYOffset||e[0].body.scrollTop||e[0].documentElement.scrollTop),left:n.left+(t.pageXOffset||e[0].body.scrollLeft||e[0].documentElement.scrollLeft)};
        }};
      }]),angular.module('ui.bootstrap.datepicker',['ui.bootstrap.position']).constant('datepickerConfig',{dayFormat:'dd',monthFormat:'MMMM',yearFormat:'yyyy',dayHeaderFormat:'EEE',dayTitleFormat:'MMMM yyyy',monthTitleFormat:'yyyy',showWeeks:!0,startingDay:0,yearRange:20,minDate:null,maxDate:null}).controller('DatepickerController',['$scope','$attrs','dateFilter','datepickerConfig',function (e,t,a,n){
        function i(t,a){
          return angular.isDefined(t)?e.$parent.$eval(t):a;
        }function r(e,t){
          return new Date(e,t,0).getDate();
        }function o(e,t){
          for(var a=new Array(t),n=e,i=0;i<t;)a[i++]=new Date(n),n.setDate(n.getDate()+1);return a;
        }function l(e,t,n,i){
          return{date:e,label:a(e,t),selected:!!n,secondary:!!i};
        }var s={day:i(t.dayFormat,n.dayFormat),month:i(t.monthFormat,n.monthFormat),year:i(t.yearFormat,n.yearFormat),dayHeader:i(t.dayHeaderFormat,n.dayHeaderFormat),dayTitle:i(t.dayTitleFormat,n.dayTitleFormat),monthTitle:i(t.monthTitleFormat,n.monthTitleFormat)},u=i(t.startingDay,n.startingDay),c=i(t.yearRange,n.yearRange);this.minDate=n.minDate?new Date(n.minDate):null,this.maxDate=n.maxDate?new Date(n.maxDate):null,this.modes=[{name:'day',getVisibleDates:function (e,t){
          var n=e.getFullYear(),i=e.getMonth(),c=new Date(n,i,1),p=u-c.getDay(),d=p>0?7-p:-p,f=new Date(c),g=0;d>0&&(f.setDate(1-d),g+=d),g+=r(n,i+1),g+=(7-g%7)%7;for(var m=o(f,g),h=new Array(7),v=0;v<g;v++){
            var $=new Date(m[v]);m[v]=l($,s.day,t&&t.getDate()===$.getDate()&&t.getMonth()===$.getMonth()&&t.getFullYear()===$.getFullYear(),$.getMonth()!==i);
          }for(var y=0;y<7;y++)h[y]=a(m[y].date,s.dayHeader);return{objects:m,title:a(e,s.dayTitle),labels:h};
        },compare:function (e,t){
          return new Date(e.getFullYear(),e.getMonth(),e.getDate())-new Date(t.getFullYear(),t.getMonth(),t.getDate());
        },split:7,step:{months:1}},{name:'month',getVisibleDates:function (e,t){
          for(var n=new Array(12),i=e.getFullYear(),r=0;r<12;r++){
            var o=new Date(i,r,1);n[r]=l(o,s.month,t&&t.getMonth()===r&&t.getFullYear()===i);
          }return{objects:n,title:a(e,s.monthTitle)};
        },compare:function (e,t){
          return new Date(e.getFullYear(),e.getMonth())-new Date(t.getFullYear(),t.getMonth());
        },split:3,step:{years:1}},{name:'year',getVisibleDates:function (e,t){
          for(var a=new Array(c),n=e.getFullYear(),i=parseInt((n-1)/c,10)*c+1,r=0;r<c;r++){
            var o=new Date(i+r,0,1);a[r]=l(o,s.year,t&&t.getFullYear()===o.getFullYear());
          }return{objects:a,title:[a[0].label,a[c-1].label].join(' - ')};
        },compare:function (e,t){
          return e.getFullYear()-t.getFullYear();
        },split:5,step:{years:c}}],this.isDisabled=function (t,a){
          var n=this.modes[a||0];return this.minDate&&n.compare(t,this.minDate)<0||this.maxDate&&n.compare(t,this.maxDate)>0||e.dateDisabled&&e.dateDisabled({date:t,mode:n.name});
        };
      }]).directive('datepicker',['dateFilter','$parse','datepickerConfig','$log',function (e,t,a,n){
        return{restrict:'EA',replace:!0,templateUrl:'template/datepicker/datepicker.html',scope:{dateDisabled:'&'},require:['datepicker','?^ngModel'],controller:'DatepickerController',link:function (e,i,r,o){
          function l(){
            e.showWeekNumbers=0===g&&h;
          }function s(e,t){
            for(var a=[];e.length>0;)a.push(e.splice(0,t));return a;
          }function u(t){
            var a=null,i=!0;f.$modelValue&&(a=new Date(f.$modelValue),isNaN(a)?(i=!1,n.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):t&&(m=a)),f.$setValidity('date',i);var r=d.modes[g],o=r.getVisibleDates(m,a);angular.forEach(o.objects,function (e){
              e.disabled=d.isDisabled(e.date,g);
            }),f.$setValidity('date-disabled',!a||!d.isDisabled(a)),e.rows=s(o.objects,r.split),e.labels=o.labels||[],e.title=o.title;
          }function c(e){
            g=e,l(),u();
          }function p(e){
            var t=new Date(e);t.setDate(t.getDate()+4-(t.getDay()||7));var a=t.getTime();return t.setMonth(0),t.setDate(1),Math.floor(Math.round((a-t)/864e5)/7)+1;
          }var d=o[0],f=o[1];if(f){
            var g=0,m=new Date,h=a.showWeeks;r.showWeeks?e.$parent.$watch(t(r.showWeeks),function (e){
              h=!!e,l();
            }):l(),r.min&&e.$parent.$watch(t(r.min),function (e){
              d.minDate=e?new Date(e):null,u();
            }),r.max&&e.$parent.$watch(t(r.max),function (e){
              d.maxDate=e?new Date(e):null,u();
            }),f.$render=function (){
              u(!0);
            },e.select=function (e){
              if(0===g){
                var t=new Date(f.$modelValue);t.setFullYear(e.getFullYear(),e.getMonth(),e.getDate()),f.$setViewValue(t),u(!0);
              }else m=e,c(g-1);
            },e.move=function (e){
              var t=d.modes[g].step;m.setMonth(m.getMonth()+e*(t.months||0)),m.setFullYear(m.getFullYear()+e*(t.years||0)),u();
            },e.toggleMode=function (){
              c((g+1)%d.modes.length);
            },e.getWeekNumber=function (t){
              return 0===g&&e.showWeekNumbers&&7===t.length?p(t[0].date):null;
            };
          }
        }};
      }]).constant('datepickerPopupConfig',{dateFormat:'yyyy-MM-dd',closeOnDateSelection:!0}).directive('datepickerPopup',['$compile','$parse','$document','$position','dateFilter','datepickerPopupConfig',function (e,t,a,n,i,r){
        return{restrict:'EA',require:'ngModel',link:function (o,l,s,u){
          function c(e){
            y?y(o,!!e):v.isOpen=!!e;
          }function p(e){
            if(e){
              if(angular.isDate(e))return u.$setValidity('date',!0),e;if(angular.isString(e)){
                var t=new Date(e);return isNaN(t)?void u.$setValidity('date',!1):(u.$setValidity('date',!0),t);
              }return void u.$setValidity('date',!1);
            }return u.$setValidity('date',!0),null;
          }function d(){
            v.date=u.$modelValue,g();
          }function f(e,a,n){
            e&&(o.$watch(t(e),function (e){
              v[a]=e;
            }),k.attr(n||a,a));
          }function g(){
            v.position=n.position(l),v.position.top=v.position.top+l.prop('offsetHeight');
          }var m=angular.isDefined(s.closeOnDateSelection)?v.$eval(s.closeOnDateSelection):r.closeOnDateSelection,h=s.datepickerPopup||r.dateFormat,v=o.$new();o.$on('$destroy',function (){
            v.$destroy();
          });var $,y;s.isOpen&&($=t(s.isOpen),y=$.assign,o.$watch($,function (e){
            v.isOpen=!!e;
          })),v.isOpen=!!$&&$(o);var b=function (e){
              v.isOpen&&e.target!==l[0]&&v.$apply(function (){
                c(!1);
              });
            },w=function (){
              v.$apply(function (){
                c(!0);
              });
            },D=angular.element('<datepicker-popup-wrap><datepicker></datepicker></datepicker-popup-wrap>');D.attr({'ng-model':'date','ng-change':'dateSelection()'});var k=D.find('datepicker');s.datepickerOptions&&k.attr(angular.extend({},o.$eval(s.datepickerOptions))),u.$parsers.unshift(p),v.dateSelection=function (){
            u.$setViewValue(v.date),u.$render(),m&&c(!1);
          },l.bind('input change keyup',function (){
            v.$apply(function (){
              d();
            });
          }),u.$render=function (){
            var e=u.$viewValue?i(u.$viewValue,h):'';l.val(e),d();
          },f(s.min,'min'),f(s.max,'max'),s.showWeeks?f(s.showWeeks,'showWeeks','show-weeks'):(v.showWeeks=!0,k.attr('show-weeks','showWeeks')),s.dateDisabled&&k.attr('date-disabled',s.dateDisabled);var M=!1,x=!1;v.$watch('isOpen',function (e){
            e?(g(),a.bind('click',b),x&&l.unbind('focus',w),l[0].focus(),M=!0):(M&&a.unbind('click',b),l.bind('focus',w),x=!0),y&&y(o,e);
          });var P=t(s.ngModel).assign;v.today=function (){
            P(o,new Date);
          },v.clear=function (){
            P(o,null);
          },l.after(e(D)(v));
        }};
      }]).directive('datepickerPopupWrap',[function (){
        return{restrict:'E',replace:!0,transclude:!0,templateUrl:'template/datepicker/popup.html',link:function (e,t,a){
          t.bind('click',function (e){
            e.preventDefault(),e.stopPropagation();
          });
        }};
      }]),angular.module('ui.bootstrap.pagination',[]).controller('PaginationController',['$scope','$attrs','$parse','$interpolate',function (e,t,a,n){
        var i=this;this.init=function (n){
          t.itemsPerPage?e.$parent.$watch(a(t.itemsPerPage),function (t){
            i.itemsPerPage=parseInt(t,10),e.totalPages=i.calculateTotalPages();
          }):this.itemsPerPage=n;
        },this.noPrevious=function (){
          return 1===this.page;
        },this.noNext=function (){
          return this.page===e.totalPages;
        },this.isActive=function (e){
          return this.page===e;
        },this.calculateTotalPages=function (){
          return this.itemsPerPage<1?1:Math.ceil(e.totalItems/this.itemsPerPage);
        },this.getAttributeValue=function (t,a,i){
          return angular.isDefined(t)?i?n(t)(e.$parent):e.$parent.$eval(t):a;
        },this.render=function (){
          this.page=parseInt(e.page,10)||1,e.pages=this.getPages(this.page,e.totalPages);
        },e.selectPage=function (t){
          !i.isActive(t)&&t>0&&t<=e.totalPages&&(e.page=t,e.onSelectPage({page:t}));
        },e.$watch('totalItems',function (){
          e.totalPages=i.calculateTotalPages();
        }),e.$watch('totalPages',function (a){
          t.numPages&&(e.numPages=a),i.page>a?e.selectPage(a):i.render();
        }),e.$watch('page',function (){
          i.render();
        });
      }]).constant('paginationConfig',{itemsPerPage:10,boundaryLinks:!1,directionLinks:!0,firstText:'First',previousText:'Previous',nextText:'Next',lastText:'Last',rotate:!0}).directive('pagination',['$parse','paginationConfig',function (e,t){
        return{restrict:'EA',scope:{page:'=',totalItems:'=',onSelectPage:' &',numPages:'='},controller:'PaginationController',templateUrl:'template/pagination/pagination.html',replace:!0,link:function (a,n,i,r){
          function o(e,t,a,n){
            return{number:e,text:t,active:a,disabled:n};
          }var l,s=r.getAttributeValue(i.boundaryLinks,t.boundaryLinks),u=r.getAttributeValue(i.directionLinks,t.directionLinks),c=r.getAttributeValue(i.firstText,t.firstText,!0),p=r.getAttributeValue(i.previousText,t.previousText,!0),d=r.getAttributeValue(i.nextText,t.nextText,!0),f=r.getAttributeValue(i.lastText,t.lastText,!0),g=r.getAttributeValue(i.rotate,t.rotate);r.init(t.itemsPerPage),i.maxSize&&a.$parent.$watch(e(i.maxSize),function (e){
            l=parseInt(e,10),r.render();
          }),r.getPages=function (e,t){
            var a=[],n=1,i=t,m=angular.isDefined(l)&&l<t;m&&(g?(n=Math.max(e-Math.floor(l/2),1),(i=n+l-1)>t&&(i=t,n=i-l+1)):(n=(Math.ceil(e/l)-1)*l+1,i=Math.min(n+l-1,t)));for(var h=n;h<=i;h++){
              var v=o(h,h,r.isActive(h),!1);a.push(v);
            }if(m&&!g){
              if(n>1){
                var $=o(n-1,'...',!1,!1);a.unshift($);
              }if(i<t){
                var y=o(i+1,'...',!1,!1);a.push(y);
              }
            }if(u){
              var b=o(e-1,p,!1,r.noPrevious());a.unshift(b);var w=o(e+1,d,!1,r.noNext());a.push(w);
            }if(s){
              var D=o(1,c,!1,r.noPrevious());a.unshift(D);var k=o(t,f,!1,r.noNext());a.push(k);
            }return a;
          };
        }};
      }]).constant('pagerConfig',{itemsPerPage:10,previousText:'« Previous',nextText:'Next »',align:!0}).directive('pager',['pagerConfig',function (e){
        return{restrict:'EA',scope:{page:'=',totalItems:'=',onSelectPage:' &',numPages:'='},controller:'PaginationController',templateUrl:'template/pagination/pager.html',replace:!0,link:function (t,a,n,i){
          function r(e,t,a,n,i){
            return{number:e,text:t,disabled:a,previous:s&&n,next:s&&i};
          }var o=i.getAttributeValue(n.previousText,e.previousText,!0),l=i.getAttributeValue(n.nextText,e.nextText,!0),s=i.getAttributeValue(n.align,e.align);i.init(e.itemsPerPage),i.getPages=function (e){
            return[r(e-1,o,i.noPrevious(),!0,!1),r(e+1,l,i.noNext(),!1,!0)];
          };
        }};
      }]),angular.module('ui.bootstrap.rating',[]).constant('ratingConfig',{max:5,stateOn:null,stateOff:null}).controller('RatingController',['$scope','$attrs','$parse','ratingConfig',function (e,t,a,n){
        this.maxRange=angular.isDefined(t.max)?e.$parent.$eval(t.max):n.max,this.stateOn=angular.isDefined(t.stateOn)?e.$parent.$eval(t.stateOn):n.stateOn,this.stateOff=angular.isDefined(t.stateOff)?e.$parent.$eval(t.stateOff):n.stateOff,this.createDefaultRange=function (e){
          for(var t={stateOn:this.stateOn,stateOff:this.stateOff},a=new Array(e),n=0;n<e;n++)a[n]=t;return a;
        },this.normalizeRange=function (e){
          for(var t=0,a=e.length;t<a;t++)e[t].stateOn=e[t].stateOn||this.stateOn,e[t].stateOff=e[t].stateOff||this.stateOff;return e;
        },e.range=angular.isDefined(t.ratingStates)?this.normalizeRange(angular.copy(e.$parent.$eval(t.ratingStates))):this.createDefaultRange(this.maxRange),e.rate=function (t){
          e.readonly||e.value===t||(e.value=t);
        },e.enter=function (t){
          e.readonly||(e.val=t),e.onHover({value:t});
        },e.reset=function (){
          e.val=angular.copy(e.value),e.onLeave();
        },e.$watch('value',function (t){
          e.val=t;
        }),e.readonly=!1,t.readonly&&e.$parent.$watch(a(t.readonly),function (t){
          e.readonly=!!t;
        });
      }]).directive('rating',function (){
        return{restrict:'EA',scope:{value:'=',onHover:'&',onLeave:'&'},controller:'RatingController',templateUrl:'template/rating/rating.html',replace:!0};
      }),angular.module('ui.bootstrap.timepicker',[]).constant('timepickerConfig',{hourStep:1,minuteStep:1,showMeridian:!0,meridians:['AM','PM'],readonlyInput:!1,mousewheel:!0}).directive('timepicker',['$parse','$log','timepickerConfig',function (e,t,a){
        return{restrict:'EA',require:'?^ngModel',replace:!0,scope:{},templateUrl:'template/timepicker/timepicker.html',link:function (n,i,r,o){
          function l(){
            var e=parseInt(n.hours,10);if(n.showMeridian?e>0&&e<13:e>=0&&e<24)return n.showMeridian&&(12===e&&(e=0),n.meridian===m[1]&&(e+=12)),e;
          }function s(){
            var e=parseInt(n.minutes,10);return e>=0&&e<60?e:void 0;
          }function u(e){
            return angular.isDefined(e)&&e.toString().length<2?`0${e}`:e;
          }function c(e){
            p(),o.$setViewValue(new Date(g)),d(e);
          }function p(){
            o.$setValidity('time',!0),n.invalidHours=!1,n.invalidMinutes=!1;
          }function d(e){
            var t=g.getHours(),a=g.getMinutes();n.showMeridian&&(t=0===t||12===t?12:t%12),n.hours='h'===e?t:u(t),n.minutes='m'===e?a:u(a),n.meridian=g.getHours()<12?m[0]:m[1];
          }function f(e){
            var t=new Date(g.getTime()+6e4*e);g.setHours(t.getHours(),t.getMinutes()),c();
          }if(o){
            var g=new Date,m=a.meridians,h=a.hourStep;r.hourStep&&n.$parent.$watch(e(r.hourStep),function (e){
              h=parseInt(e,10);
            });var v=a.minuteStep;r.minuteStep&&n.$parent.$watch(e(r.minuteStep),function (e){
              v=parseInt(e,10);
            }),n.showMeridian=a.showMeridian,r.showMeridian&&n.$parent.$watch(e(r.showMeridian),function (e){
              if(n.showMeridian=!!e,o.$error.time){
                var t=l(),a=s();angular.isDefined(t)&&angular.isDefined(a)&&(g.setHours(t),c());
              }else d();
            });var $=i.find('input'),y=$.eq(0),b=$.eq(1);if(angular.isDefined(r.mousewheel)?n.$eval(r.mousewheel):a.mousewheel){
              var w=function (e){
                e.originalEvent&&(e=e.originalEvent);var t=e.wheelDelta?e.wheelDelta:-e.deltaY;return e.detail||t>0;
              };y.bind('mousewheel wheel',function (e){
                n.$apply(w(e)?n.incrementHours():n.decrementHours()),e.preventDefault();
              }),b.bind('mousewheel wheel',function (e){
                n.$apply(w(e)?n.incrementMinutes():n.decrementMinutes()),e.preventDefault();
              });
            }if(n.readonlyInput=angular.isDefined(r.readonlyInput)?n.$eval(r.readonlyInput):a.readonlyInput,n.readonlyInput)n.updateHours=angular.noop,n.updateMinutes=angular.noop;else{
              var D=function (e,t){
                o.$setViewValue(null),o.$setValidity('time',!1),angular.isDefined(e)&&(n.invalidHours=e),angular.isDefined(t)&&(n.invalidMinutes=t);
              };n.updateHours=function (){
                var e=l();angular.isDefined(e)?(g.setHours(e),c('h')):D(!0);
              },y.bind('blur',function (e){
                !n.validHours&&n.hours<10&&n.$apply(function (){
                  n.hours=u(n.hours);
                });
              }),n.updateMinutes=function (){
                var e=s();angular.isDefined(e)?(g.setMinutes(e),c('m')):D(void 0,!0);
              },b.bind('blur',function (e){
                !n.invalidMinutes&&n.minutes<10&&n.$apply(function (){
                  n.minutes=u(n.minutes);
                });
              });
            }o.$render=function (){
              var e=o.$modelValue?new Date(o.$modelValue):null;isNaN(e)?(o.$setValidity('time',!1),t.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):(e&&(g=e),p(),d());
            },n.incrementHours=function (){
              f(60*h);
            },n.decrementHours=function (){
              f(60*-h);
            },n.incrementMinutes=function (){
              f(v);
            },n.decrementMinutes=function (){
              f(-v);
            },n.toggleMeridian=function (){
              f(720*(g.getHours()<12?1:-1));
            };
          }
        }};
      }]),angular.module('ui.bootstrap.bindHtml',[]).directive('bindHtmlUnsafe',function (){
        return function (e,t,a){
          t.addClass('ng-binding').data('$binding',a.bindHtmlUnsafe),e.$watch(a.bindHtmlUnsafe,function (e){
            t.html(e||'');
          });
        };
      }),angular.module('ui.bootstrap.typeahead',['ui.bootstrap.position','ui.bootstrap.bindHtml']).factory('typeaheadParser',['$parse',function (e){
        var t=/^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;return{parse:function (a){
          var n=a.match(t);if(!n)throw new Error(`Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_' but got '${a}'.`);return{itemName:n[3],source:e(n[4]),viewMapper:e(n[2]||n[1]),modelMapper:e(n[1])};
        }};
      }]).directive('typeahead',['$compile','$parse','$q','$timeout','$document','$position','typeaheadParser',function (e,t,a,n,i,r,o){
        var l=[9,13,27,38,40];return{require:'ngModel',link:function (s,u,c,p){
          var d=s.$eval(c.typeaheadMinLength)||1,f=s.$eval(c.typeaheadWaitMs)||0,g=!1!==s.$eval(c.typeaheadEditable),m=t(c.typeaheadLoading).assign||angular.noop,h=t(c.typeaheadOnSelect),v=c.typeaheadInputFormatter?t(c.typeaheadInputFormatter):void 0,$=t(c.ngModel).assign,y=o.parse(c.typeahead),b=angular.element('<typeahead-popup></typeahead-popup>');b.attr({matches:'matches',active:'activeIdx',select:'select(activeIdx)',query:'query',position:'position'}),angular.isDefined(c.typeaheadTemplateUrl)&&b.attr('template-url',c.typeaheadTemplateUrl);var w=s.$new();s.$on('$destroy',function (){
            w.$destroy();
          });var D=function (){
              w.matches=[],w.activeIdx=-1;
            },k=function (e){
              var t={$viewValue:e};m(s,!0),a.when(y.source(w,t)).then(function (a){
                if(e===p.$viewValue){
                  if(a.length>0){
                    w.activeIdx=0,w.matches.length=0;for(var n=0;n<a.length;n++)t[y.itemName]=a[n],w.matches.push({label:y.viewMapper(w,t),model:a[n]});w.query=e,w.position=r.position(u),w.position.top=w.position.top+u.prop('offsetHeight');
                  }else D();m(s,!1);
                }
              },function (){
                D(),m(s,!1);
              });
            };D(),w.query=void 0;var M;p.$parsers.unshift(function (e){
            return D(),e&&e.length>=d&&(f>0?(M&&n.cancel(M),M=n(function (){
              k(e);
            },f)):k(e)),g?e:void p.$setValidity('editable',!1);
          }),p.$formatters.push(function (e){
            var t,a,n={};return v?(n.$model=e,v(s,n)):(n[y.itemName]=e,t=y.viewMapper(s,n),n[y.itemName]=void 0,a=y.viewMapper(s,n),t!==a?t:e);
          }),w.select=function (e){
            var t,a,n={};n[y.itemName]=a=w.matches[e].model,t=y.modelMapper(s,n),$(s,t),p.$setValidity('editable',!0),h(s,{$item:a,$model:t,$label:y.viewMapper(s,n)}),D(),u[0].focus();
          },u.bind('keydown',function (e){
            0!==w.matches.length&&-1!==l.indexOf(e.which)&&(e.preventDefault(),40===e.which?(w.activeIdx=(w.activeIdx+1)%w.matches.length,w.$digest()):38===e.which?(w.activeIdx=(w.activeIdx?w.activeIdx:w.matches.length)-1,w.$digest()):13===e.which||9===e.which?w.$apply(function (){
              w.select(w.activeIdx);
            }):27===e.which&&(e.stopPropagation(),D(),w.$digest()));
          });var x=function (e){
            u[0]!==e.target&&(D(),w.$digest());
          };i.bind('click',x),s.$on('$destroy',function (){
            i.unbind('click',x);
          }),u.after(e(b)(w));
        }};
      }]).directive('typeaheadPopup',function (){
        return{restrict:'E',scope:{matches:'=',query:'=',active:'=',position:'=',select:'&'},replace:!0,templateUrl:'/ui-bootstrap/template/typeahead/typeahead-popup.html',link:function (e,t,a){
          e.templateUrl=a.templateUrl,e.isOpen=function (){
            return e.matches.length>0;
          },e.isActive=function (t){
            return e.active==t;
          },e.selectActive=function (t){
            e.active=t;
          },e.selectMatch=function (t){
            e.select({activeIdx:t});
          };
        }};
      }).directive('typeaheadMatch',['$http','$templateCache','$compile','$parse',function (e,t,a,n){
        return{restrict:'E',scope:{index:'=',match:'=',query:'='},link:function (i,r,o){
          var l=n(o.templateUrl)(i.$parent)||'template/typeahead/typeahead-match.html';e.get(l,{cache:t}).success(function (e){
            r.replaceWith(a(e.trim())(i));
          });
        }};
      }]).filter('typeaheadHighlight',function (){
        function e(e){
          return e.replace(/([.?*+^$[\]\\(){}|-])/g,'\\$1');
        }return function (t,a){
          return a?t.replace(new RegExp(e(a),'gi'),'<strong>$&</strong>'):t;
        };
      });
    }).call(global,module,void 0,void 0);
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'angular':50}],111:[function (require,module,exports){
  (function (global){
    angular=global.angular=require('angular'),CodeMirror=global.CodeMirror=require('/Users/ilya/maintained/strider/vendor/CodeMirror/js/codemirror.js'),require('/Users/ilya/maintained/strider/vendor/CodeMirror/js/shell.js');var __browserify_shim_require__=require;(function (r,e,o){
      angular.module('ui.codemirror',[]).constant('uiCodemirrorConfig',{}).directive('uiCodemirror',['uiCodemirrorConfig','$timeout',function (r,e){
        'use strict';var o=['cursorActivity','viewportChange','gutterClick','focus','blur','scroll','update'];return{restrict:'A',require:'ngModel',link:function (i,n,a,t){
          var u,l,s,d,c;if('textarea'!==n[0].type)throw new Error('uiCodemirror3 can only be applied to a textarea element');u=r.codemirror||{},l=angular.extend({},u,i.$eval(a.uiCodemirror)),s=function (r){
            return function (e,o){
              var n=e.getValue();n!==t.$viewValue&&t.$setViewValue(n),'function'==typeof r&&r(e,o),i.$$phase||i.$apply();
            };
          },d=function (){
            c=CodeMirror.fromTextArea(n[0],l),n.on('refresh',function (){
              c.refresh();
            }),angular.isDefined(i[a.uiCodemirror])&&i.$watch(a.uiCodemirror,function (r){
              for(var e in r)r.hasOwnProperty(e)&&c.setOption(e,r[e]);
            },!0),c.on('change',s(l.onChange));for(var r,u=0,d=o.length;u<d;++u)void 0!==(r=l[`on${o[u].charAt(0).toUpperCase()}${o[u].slice(1)}`])&&'function'==typeof r&&c.on(o[u],r);t.$formatters.push(function (r){
              if(angular.isUndefined(r)||null===r)return'';if(angular.isObject(r)||angular.isArray(r))throw new Error('ui-codemirror cannot use an object or an array as a model');return r;
            }),t.$render=function (){
              c.setValue(t.$viewValue);
            },t.$viewValue||(t.$setViewValue(n.text()),t.$render()),a.uiRefresh&&i.$watch(a.uiRefresh,function (r,o){
              r!==o&&e(function (){
                c.refresh();
              });
            }),angular.isFunction(l.onLoad)&&l.onLoad(c);
          },e(d);
        }};
      }]);
    }).call(global,module,void 0,void 0);
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'/Users/ilya/maintained/strider/vendor/CodeMirror/js/codemirror.js':112,'/Users/ilya/maintained/strider/vendor/CodeMirror/js/shell.js':113,'angular':50}],112:[function (require,module,exports){
  (function (global){
    var __browserify_shim_require__=require;(function (t,e,r,n,i){
      window.CodeMirror=function (){
        'use strict';function t(r,n){
          if(!(this instanceof t))return new t(r,n);this.options=n=n||{};for(var i in li)!n.hasOwnProperty(i)&&li.hasOwnProperty(i)&&(n[i]=li[i]);h(n);var o='string'==typeof n.value?0:n.value.first,l=this.display=e(r,o);l.wrapper.CodeMirror=this,u(this),n.autofocus&&!Bn&&pt(this),this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,draggingText:!1,highlight:new Yr},s(this),n.lineWrapping&&(this.display.wrapper.className+=' CodeMirror-wrap');var a=n.value;'string'==typeof a&&(a=new xi(n.value,n.mode)),lt(this,hr)(this,a),Tn&&setTimeout(rn(dt,this,!0),20),mt(this);var c;try{
            c=document.activeElement==l.input;
          }catch(t){}c||n.autofocus&&!Bn?setTimeout(rn(Et,this),20):zt(this),lt(this,function (){
            for(var t in oi)oi.propertyIsEnumerable(t)&&oi[t](this,n[t],si);for(var e=0;e<fi.length;++e)fi[e](this);
          })();
        }function e(t,e){
          var r={},n=r.input=ln('textarea',null,null,'position: absolute; padding: 0; width: 1px; height: 1em; outline: none; font-size: 4px;');return Hn?n.style.width='1000px':n.setAttribute('wrap','off'),Rn&&(n.style.border='1px solid black'),n.setAttribute('autocorrect','off'),n.setAttribute('autocapitalize','off'),n.setAttribute('spellcheck','false'),r.inputDiv=ln('div',[n],null,'overflow: hidden; position: relative; width: 3px; height: 0px;'),r.scrollbarH=ln('div',[ln('div',null,null,'height: 1px')],'CodeMirror-hscrollbar'),r.scrollbarV=ln('div',[ln('div',null,null,'width: 1px')],'CodeMirror-vscrollbar'),r.scrollbarFiller=ln('div',null,'CodeMirror-scrollbar-filler'),r.gutterFiller=ln('div',null,'CodeMirror-gutter-filler'),r.lineDiv=ln('div',null,'CodeMirror-code'),r.selectionDiv=ln('div',null,null,'position: relative; z-index: 1'),r.cursor=ln('div',' ','CodeMirror-cursor'),r.otherCursor=ln('div',' ','CodeMirror-cursor CodeMirror-secondarycursor'),r.measure=ln('div',null,'CodeMirror-measure'),r.lineSpace=ln('div',[r.measure,r.selectionDiv,r.lineDiv,r.cursor,r.otherCursor],null,'position: relative; outline: none'),r.mover=ln('div',[ln('div',[r.lineSpace],'CodeMirror-lines')],null,'position: relative'),r.sizer=ln('div',[r.mover],'CodeMirror-sizer'),r.heightForcer=ln('div',null,null,`position: absolute; height: ${Si}px; width: 1px;`),r.gutters=ln('div',null,'CodeMirror-gutters'),r.lineGutter=null,r.scroller=ln('div',[r.sizer,r.heightForcer,r.gutters],'CodeMirror-scroll'),r.scroller.setAttribute('tabIndex','-1'),r.wrapper=ln('div',[r.inputDiv,r.scrollbarH,r.scrollbarV,r.scrollbarFiller,r.gutterFiller,r.scroller],'CodeMirror'),An&&(r.gutters.style.zIndex=-1,r.scroller.style.paddingRight=0),t.appendChild?t.appendChild(r.wrapper):t(r.wrapper),Rn&&(n.style.width='0px'),Hn||(r.scroller.draggable=!0),zn?(r.inputDiv.style.height='1px',r.inputDiv.style.position='absolute'):An&&(r.scrollbarH.style.minWidth=r.scrollbarV.style.minWidth='18px'),r.viewOffset=r.lastSizeC=0,r.showingFrom=r.showingTo=e,r.lineNumWidth=r.lineNumInnerWidth=r.lineNumChars=null,r.prevInput='',r.alignWidgets=!1,r.pollingFast=!1,r.poll=new Yr,r.cachedCharWidth=r.cachedTextHeight=null,r.measureLineCache=[],r.measureLineCachePos=0,r.inaccurateSelection=!1,r.maxLine=null,r.maxLineLength=0,r.maxLineChanged=!1,r.wheelDX=r.wheelDY=r.wheelStartX=r.wheelStartY=null,r;
        }function r(e){
          e.doc.mode=t.getMode(e.options,e.doc.modeOption),e.doc.iter(function (t){
            t.stateAfter&&(t.stateAfter=null),t.styles&&(t.styles=null);
          }),e.doc.frontier=e.doc.first,W(e,100),e.state.modeGen++,e.curOp&&ut(e);
        }function n(t){
          t.options.lineWrapping?(t.display.wrapper.className+=' CodeMirror-wrap',t.display.sizer.style.minWidth=''):(t.display.wrapper.className=t.display.wrapper.className.replace(' CodeMirror-wrap',''),f(t)),o(t),ut(t),X(t),setTimeout(function (){
            d(t);
          },100);
        }function i(t){
          var e=rt(t.display),r=t.options.lineWrapping,n=r&&Math.max(5,t.display.scroller.clientWidth/nt(t.display)-3);return function (i){
            return Ve(t.doc,i)?0:r?(Math.ceil(i.text.length/n)||1)*e:e;
          };
        }function o(t){
          var e=t.doc,r=i(t);e.iter(function (t){
            var e=r(t);e!=t.height&&mr(t,e);
          });
        }function l(t){
          var e=pi[t.options.keyMap],r=e.style;t.display.wrapper.className=t.display.wrapper.className.replace(/\s*cm-keymap-\S+/g,'')+(r?` cm-keymap-${r}`:''),t.state.disableInput=e.disableInput;
        }function s(t){
          t.display.wrapper.className=t.display.wrapper.className.replace(/\s*cm-s-\S+/g,'')+t.options.theme.replace(/(^|\s)\s*/g,' cm-s-'),X(t);
        }function a(t){
          u(t),ut(t),setTimeout(function (){
            g(t);
          },20);
        }function u(t){
          var e=t.display.gutters,r=t.options.gutters;sn(e);for(var n=0;n<r.length;++n){
            var i=r[n],o=e.appendChild(ln('div',null,`CodeMirror-gutter ${i}`));'CodeMirror-linenumbers'==i&&(t.display.lineGutter=o,o.style.width=`${t.display.lineNumWidth||1}px`);
          }e.style.display=n?'':'none';
        }function c(t,e){
          if(0==e.height)return 0;for(var r,n=e.text.length,i=e;r=Re(i);){
            var o=r.find();i=dr(t,o.from.line),n+=o.from.ch-o.to.ch;
          }for(i=e;r=Be(i);){
            var o=r.find();n-=i.text.length-o.from.ch,i=dr(t,o.to.line),n+=i.text.length-o.to.ch;
          }return n;
        }function f(t){
          var e=t.display,r=t.doc;e.maxLine=dr(r,r.first),e.maxLineLength=c(r,e.maxLine),e.maxLineChanged=!0,r.iter(function (t){
            var n=c(r,t);n>e.maxLineLength&&(e.maxLineLength=n,e.maxLine=t);
          });
        }function h(t){
          var e=Qr(t.gutters,'CodeMirror-linenumbers');-1==e&&t.lineNumbers?t.gutters=t.gutters.concat(['CodeMirror-linenumbers']):e>-1&&!t.lineNumbers&&(t.gutters=t.gutters.slice(0),t.gutters.splice(e,1));
        }function d(t){
          var e=t.display,r=t.doc.height,n=r+F(e);e.sizer.style.minHeight=e.heightForcer.style.top=`${n}px`,e.gutters.style.height=`${Math.max(n,e.scroller.clientHeight-Si)}px`;var i=Math.max(n,e.scroller.scrollHeight),o=e.scroller.scrollWidth>e.scroller.clientWidth+1,l=i>e.scroller.clientHeight+1;l?(e.scrollbarV.style.display='block',e.scrollbarV.style.bottom=o?`${hn(e.measure)}px`:'0',e.scrollbarV.firstChild.style.height=`${i-e.scroller.clientHeight+e.scrollbarV.clientHeight}px`):(e.scrollbarV.style.display='',e.scrollbarV.firstChild.style.height='0'),o?(e.scrollbarH.style.display='block',e.scrollbarH.style.right=l?`${hn(e.measure)}px`:'0',e.scrollbarH.firstChild.style.width=`${e.scroller.scrollWidth-e.scroller.clientWidth+e.scrollbarH.clientWidth}px`):(e.scrollbarH.style.display='',e.scrollbarH.firstChild.style.width='0'),o&&l?(e.scrollbarFiller.style.display='block',e.scrollbarFiller.style.height=e.scrollbarFiller.style.width=`${hn(e.measure)}px`):e.scrollbarFiller.style.display='',o&&t.options.coverGutterNextToScrollbar&&t.options.fixedGutter?(e.gutterFiller.style.display='block',e.gutterFiller.style.height=`${hn(e.measure)}px`,e.gutterFiller.style.width=`${e.gutters.offsetWidth}px`):e.gutterFiller.style.display='',In&&0===hn(e.measure)&&(e.scrollbarV.style.minWidth=e.scrollbarH.style.minHeight=Fn?'18px':'12px');
        }function p(t,e,r){
          var n=t.scroller.scrollTop,i=t.wrapper.clientHeight;'number'==typeof r?n=r:r&&(n=r.top,i=r.bottom-r.top),n=Math.floor(n-I(t));var o=Math.ceil(n+i);return{from:yr(e,n),to:yr(e,o)};
        }function g(t){
          var e=t.display;if(e.alignWidgets||e.gutters.firstChild&&t.options.fixedGutter){
            for(var r=y(e)-e.scroller.scrollLeft+t.doc.scrollLeft,n=e.gutters.offsetWidth,i=`${r}px`,o=e.lineDiv.firstChild;o;o=o.nextSibling)if(o.alignable)for(var l=0,s=o.alignable;l<s.length;++l)s[l].style.left=i;t.options.fixedGutter&&(e.gutters.style.left=`${r+n}px`);
          }
        }function m(t){
          if(!t.options.lineNumbers)return!1;var e=t.doc,r=v(t.options,e.first+e.size-1),n=t.display;if(r.length!=n.lineNumChars){
            var i=n.measure.appendChild(ln('div',[ln('div',r)],'CodeMirror-linenumber CodeMirror-gutter-elt')),o=i.firstChild.offsetWidth,l=i.offsetWidth-o;return n.lineGutter.style.width='',n.lineNumInnerWidth=Math.max(o,n.lineGutter.offsetWidth-l),n.lineNumWidth=n.lineNumInnerWidth+l,n.lineNumChars=n.lineNumInnerWidth?r.length:-1,n.lineGutter.style.width=`${n.lineNumWidth}px`,!0;
          }return!1;
        }function v(t,e){
          return String(t.lineNumberFormatter(e+t.firstLineNumber));
        }function y(t){
          return cn(t.scroller).left-cn(t.sizer).left;
        }function b(t,e,r,n){
          for(var i,o=t.display.showingFrom,l=t.display.showingTo,s=p(t.display,t.doc,r),a=!0;;a=!1){
            var u=t.display.scroller.clientWidth;if(!x(t,e,s,n))break;if(i=!0,e=[],A(t),d(t),a&&t.options.lineWrapping&&u!=t.display.scroller.clientWidth)n=!0;else if(n=!1,r&&(r=Math.min(t.display.scroller.scrollHeight-t.display.scroller.clientHeight,'number'==typeof r?r:r.top)),s=p(t.display,t.doc,r),s.from>=t.display.showingFrom&&s.to<=t.display.showingTo)break;
          }return i&&(Vr(t,'update',t),t.display.showingFrom==o&&t.display.showingTo==l||Vr(t,'viewportChange',t,t.display.showingFrom,t.display.showingTo)),i;
        }function x(t,e,r,n){
          var i=t.display,o=t.doc;if(!i.wrapper.clientWidth)return i.showingFrom=i.showingTo=o.first,void(i.viewOffset=0);if(!(!n&&0==e.length&&r.from>i.showingFrom&&r.to<i.showingTo)){
            m(t)&&(e=[{from:o.first,to:o.first+o.size}]);var l=i.sizer.style.marginLeft=`${i.gutters.offsetWidth}px`;i.scrollbarH.style.left=t.options.fixedGutter?l:'0';var s=1/0;if(t.options.lineNumbers)for(var a=0;a<e.length;++a)e[a].diff&&e[a].from<s&&(s=e[a].from);var u=o.first+o.size,c=Math.max(r.from-t.options.viewportMargin,o.first),f=Math.min(u,r.to+t.options.viewportMargin);if(i.showingFrom<c&&c-i.showingFrom<20&&(c=Math.max(o.first,i.showingFrom)),i.showingTo>f&&i.showingTo-f<20&&(f=Math.min(u,i.showingTo)),Zn)for(c=vr(Ge(o,dr(o,c)));f<u&&Ve(o,dr(o,f));)++f;var h=[{from:Math.max(i.showingFrom,o.first),to:Math.min(i.showingTo,u)}];if(h=h[0].from>=h[0].to?[]:L(h,e),Zn)for(var a=0;a<h.length;++a)for(var d,p=h[a];d=Be(dr(o,p.to-1));){
              var g=d.find().from.line;if(!(g>p.from)){
                h.splice(a--,1);break;
              }p.to=g;
            }for(var v=0,a=0;a<h.length;++a){
              var p=h[a];p.from<c&&(p.from=c),p.to>f&&(p.to=f),p.from>=p.to?h.splice(a--,1):v+=p.to-p.from;
            }if(!n&&v==f-c&&c==i.showingFrom&&f==i.showingTo)return void w(t);h.sort(function (t,e){
              return t.from-e.from;
            });try{
              var y=document.activeElement;
            }catch(t){}v<.7*(f-c)&&(i.lineDiv.style.display='none'),S(t,c,f,h,s),i.lineDiv.style.display='',y&&document.activeElement!=y&&y.offsetHeight&&y.focus();return(c!=i.showingFrom||f!=i.showingTo||i.lastSizeC!=i.wrapper.clientHeight)&&(i.lastSizeC=i.wrapper.clientHeight,W(t,400)),i.showingFrom=c,i.showingTo=f,C(t),w(t),!0;
          }
        }function C(t){
          for(var e,r=t.display,n=r.lineDiv.offsetTop,i=r.lineDiv.firstChild;i;i=i.nextSibling)if(i.lineObj){
            if(An){
              var o=i.offsetTop+i.offsetHeight;e=o-n,n=o;
            }else{
              var l=cn(i);e=l.bottom-l.top;
            }var s=i.lineObj.height-e;if(e<2&&(e=rt(r)),s>.001||s<-.001){
              mr(i.lineObj,e);var a=i.lineObj.widgets;if(a)for(var u=0;u<a.length;++u)a[u].height=a[u].node.offsetHeight;
            }
          }
        }function w(t){
          var e=t.display.viewOffset=br(t,dr(t.doc,t.display.showingFrom));t.display.mover.style.top=`${e}px`;
        }function L(t,e){
          for(var r=0,n=e.length||0;r<n;++r){
            for(var i=e[r],o=[],l=i.diff||0,s=0,a=t.length;s<a;++s){
              var u=t[s];i.to<=u.from&&i.diff?o.push({from:u.from+l,to:u.to+l}):i.to<=u.from||i.from>=u.to?o.push(u):(i.from>u.from&&o.push({from:u.from,to:i.from}),i.to<u.to&&o.push({from:i.to+l,to:u.to+l}));
            }t=o;
          }return t;
        }function k(t){
          for(var e=t.display,r={},n={},i=e.gutters.firstChild,o=0;i;i=i.nextSibling,++o)r[t.options.gutters[o]]=i.offsetLeft,n[t.options.gutters[o]]=i.offsetWidth;return{fixedPos:y(e),gutterTotalWidth:e.gutters.offsetWidth,gutterLeft:r,gutterWidth:n,wrapperWidth:e.wrapper.clientWidth};
        }function S(t,e,r,n,i){
          function o(e){
            var r=e.nextSibling;return Hn&&Gn&&t.display.currentWheelTarget==e?(e.style.display='none',e.lineObj=null):e.parentNode.removeChild(e),r;
          }var l=k(t),s=t.display,a=t.options.lineNumbers;n.length||Hn&&t.display.currentWheelTarget||sn(s.lineDiv);var u=s.lineDiv,c=u.firstChild,f=n.shift(),h=e;for(t.doc.iter(e,r,function (e){
            if(f&&f.to==h&&(f=n.shift()),Ve(t.doc,e)){
              if(0!=e.height&&mr(e,0),e.widgets&&c&&c.previousSibling)for(var r=0;r<e.widgets.length;++r){
                var s=e.widgets[r];if(s.showIfHidden){
                  var d=c.previousSibling;if(/pre/i.test(d.nodeName)){
                    var p=ln('div',null,null,'position: relative');d.parentNode.replaceChild(p,d),p.appendChild(d),d=p;
                  }var g=d.appendChild(ln('div',[s.node],'CodeMirror-linewidget'));s.handleMouseEvents||(g.ignoreEvents=!0),T(s,g,d,l);
                }
              }
            }else if(f&&f.from<=h&&f.to>h){
              for(;c.lineObj!=e;)c=o(c);a&&i<=h&&c.lineNumber&&un(c.lineNumber,v(t.options,h)),c=c.nextSibling;
            }else{
              if(e.widgets)for(var m,y=0,b=c;b&&y<20;++y,b=b.nextSibling)if(b.lineObj==e&&/div/i.test(b.nodeName)){
                m=b;break;
              }var x=M(t,e,h,l,m);if(x!=m)u.insertBefore(x,c);else{
                for(;c!=m;)c=o(c);c=c.nextSibling;
              }x.lineObj=e;
            }++h;
          });c;)c=o(c);
        }function M(t,e,r,n,i){
          var o,l=rr(t,e),s=l.pre,a=e.gutterMarkers,u=t.display,c=l.bgClass?`${l.bgClass} ${e.bgClass||''}`:e.bgClass;if(!(t.options.lineNumbers||a||c||e.wrapClass||e.widgets))return s;if(i){
            i.alignable=null;for(var f,h=!0,d=0,p=null,g=i.firstChild;g;g=f)if(f=g.nextSibling,/\bCodeMirror-linewidget\b/.test(g.className)){
              for(var m=0;m<e.widgets.length;++m){
                var y=e.widgets[m];if(y.node==g.firstChild){
                  y.above||p||(p=g),T(y,g,i,n),++d;break;
                }
              }if(m==e.widgets.length){
                h=!1;break;
              }
            }else i.removeChild(g);i.insertBefore(s,p),h&&d==e.widgets.length&&(o=i,i.className=e.wrapClass||'');
          }if(o||(o=ln('div',null,e.wrapClass,'position: relative'),o.appendChild(s)),c&&o.insertBefore(ln('div',null,`${c} CodeMirror-linebackground`),o.firstChild),t.options.lineNumbers||a){
            var b=o.insertBefore(ln('div',null,null,`position: absolute; left: ${t.options.fixedGutter?n.fixedPos:-n.gutterTotalWidth}px`),o.firstChild);if(t.options.fixedGutter&&(o.alignable||(o.alignable=[])).push(b),!t.options.lineNumbers||a&&a['CodeMirror-linenumbers']||(o.lineNumber=b.appendChild(ln('div',v(t.options,r),'CodeMirror-linenumber CodeMirror-gutter-elt',`left: ${n.gutterLeft['CodeMirror-linenumbers']}px; width: ${u.lineNumInnerWidth}px`))),a)for(var x=0;x<t.options.gutters.length;++x){
              var C=t.options.gutters[x],w=a.hasOwnProperty(C)&&a[C];w&&b.appendChild(ln('div',[w],'CodeMirror-gutter-elt',`left: ${n.gutterLeft[C]}px; width: ${n.gutterWidth[C]}px`));
            }
          }if(An&&(o.style.zIndex=2),e.widgets&&o!=i)for(var m=0,L=e.widgets;m<L.length;++m){
            var y=L[m],k=ln('div',[y.node],'CodeMirror-linewidget');y.handleMouseEvents||(k.ignoreEvents=!0),T(y,k,o,n),y.above?o.insertBefore(k,t.options.lineNumbers&&0!=e.height?b:s):o.appendChild(k),Vr(y,'redraw');
          }return o;
        }function T(t,e,r,n){
          if(t.noHScroll){
            (r.alignable||(r.alignable=[])).push(e);var i=n.wrapperWidth;e.style.left=`${n.fixedPos}px`,t.coverGutter||(i-=n.gutterTotalWidth,e.style.paddingLeft=`${n.gutterTotalWidth}px`),e.style.width=`${i}px`;
          }t.coverGutter&&(e.style.zIndex=5,e.style.position='relative',t.noHScroll||(e.style.marginLeft=`${-n.gutterTotalWidth}px`));
        }function A(t){
          var e=t.display,r=jt(t.doc.sel.from,t.doc.sel.to);if(r||t.options.showCursorWhenSelecting?N(t):e.cursor.style.display=e.otherCursor.style.display='none',r?e.selectionDiv.style.display='none':H(t),t.options.moveInputWithCursor){
            var n=Q(t,t.doc.sel.head,'div'),i=cn(e.wrapper),o=cn(e.lineDiv);e.inputDiv.style.top=`${Math.max(0,Math.min(e.wrapper.clientHeight-10,n.top+o.top-i.top))}px`,e.inputDiv.style.left=`${Math.max(0,Math.min(e.wrapper.clientWidth-10,n.left+o.left-i.left))}px`;
          }
        }function N(t){
          var e=t.display,r=Q(t,t.doc.sel.head,'div');e.cursor.style.left=`${r.left}px`,e.cursor.style.top=`${r.top}px`,e.cursor.style.height=`${Math.max(0,r.bottom-r.top)*t.options.cursorHeight}px`,e.cursor.style.display='',r.other?(e.otherCursor.style.display='',e.otherCursor.style.left=`${r.other.left}px`,e.otherCursor.style.top=`${r.other.top}px`,e.otherCursor.style.height=`${.85*(r.other.bottom-r.other.top)}px`):e.otherCursor.style.display='none';
        }function H(t){
          function e(t,e,r,n){
            e<0&&(e=0),l.appendChild(ln('div',null,'CodeMirror-selected',`position: absolute; left: ${t}px; top: ${e}px; width: ${null==r?s-t:r}px; height: ${n-e}px`));
          }function r(r,n,o){
            function l(e,n){
              return q(t,Yt(r,e),'div',f,n);
            }var u,c,f=dr(i,r),h=f.text.length;return pn(xr(f),n||0,null==o?h:o,function (t,r,i){
              var f,d,p,g=l(t,'left');if(t==r)f=g,d=p=g.left;else{
                if(f=l(r-1,'right'),'rtl'==i){
                  var m=g;g=f,f=m;
                }d=g.left,p=f.right;
              }null==n&&0==t&&(d=a),f.top-g.top>3&&(e(d,g.top,null,g.bottom),d=a,g.bottom<f.top&&e(d,g.bottom,null,f.top)),null==o&&r==h&&(p=s),(!u||g.top<u.top||g.top==u.top&&g.left<u.left)&&(u=g),(!c||f.bottom>c.bottom||f.bottom==c.bottom&&f.right>c.right)&&(c=f),d<a+1&&(d=a),e(d,f.top,p-d,f.bottom);
            }),{start:u,end:c};
          }var n=t.display,i=t.doc,o=t.doc.sel,l=document.createDocumentFragment(),s=n.lineSpace.offsetWidth,a=P(t.display);if(o.from.line==o.to.line)r(o.from.line,o.from.ch,o.to.ch);else{
            var u=dr(i,o.from.line),c=dr(i,o.to.line),f=Ge(i,u)==Ge(i,c),h=r(o.from.line,o.from.ch,f?u.text.length:null).end,d=r(o.to.line,f?0:null,o.to.ch).start;f&&(h.top<d.top-2?(e(h.right,h.top,null,h.bottom),e(a,d.top,d.left,d.bottom)):e(h.right,h.top,d.left-h.right,h.bottom)),h.bottom<d.top&&e(a,h.bottom,null,d.top);
          }an(n.selectionDiv,l),n.selectionDiv.style.display='';
        }function D(t){
          if(t.state.focused){
            var e=t.display;clearInterval(e.blinker);var r=!0;e.cursor.style.visibility=e.otherCursor.style.visibility='',t.options.cursorBlinkRate>0&&(e.blinker=setInterval(function (){
              e.cursor.style.visibility=e.otherCursor.style.visibility=(r=!r)?'':'hidden';
            },t.options.cursorBlinkRate));
          }
        }function W(t,e){
          t.doc.mode.startState&&t.doc.frontier<t.display.showingTo&&t.state.highlight.set(e,rn(O,t));
        }function O(t){
          var e=t.doc;if(e.frontier<e.first&&(e.frontier=e.first),!(e.frontier>=t.display.showingTo)){
            var r,n=+new Date+t.options.workTime,i=be(e.mode,z(t,e.frontier)),o=[];e.iter(e.frontier,Math.min(e.first+e.size,t.display.showingTo+500),function (l){
              if(e.frontier>=t.display.showingFrom){
                var s=l.styles;l.styles=Qe(t,l,i);for(var a=!s||s.length!=l.styles.length,u=0;!a&&u<s.length;++u)a=s[u]!=l.styles[u];a&&(r&&r.end==e.frontier?r.end++:o.push(r={start:e.frontier,end:e.frontier+1})),l.stateAfter=be(e.mode,i);
              }else tr(t,l,i),l.stateAfter=e.frontier%5==0?be(e.mode,i):null;if(++e.frontier,+new Date>n)return W(t,t.options.workDelay),!0;
            }),o.length&&lt(t,function (){
              for(var t=0;t<o.length;++t)ut(this,o[t].start,o[t].end);
            })();
          }
        }function E(t,e,r){
          for(var n,i,o=t.doc,l=t.doc.mode.innerMode?1e3:100,s=e,a=e-l;s>a;--s){
            if(s<=o.first)return o.first;var u=dr(o,s-1);if(u.stateAfter&&(!r||s<=o.frontier))return s;var c=jr(u.text,null,t.options.tabSize);(null==i||n>c)&&(i=s-1,n=c);
          }return i;
        }function z(t,e,r){
          var n=t.doc,i=t.display;if(!n.mode.startState)return!0;var o=E(t,e,r),l=o>n.first&&dr(n,o-1).stateAfter;return l=l?be(n.mode,l):xe(n.mode),n.iter(o,e,function (r){
            tr(t,r,l);var s=o==e-1||o%5==0||o>=i.showingFrom&&o<i.showingTo;r.stateAfter=s?be(n.mode,l):null,++o;
          }),l;
        }function I(t){
          return t.lineSpace.offsetTop;
        }function F(t){
          return t.mover.offsetHeight-t.lineSpace.offsetHeight;
        }function P(t){
          return an(t.measure,ln('pre',null,null,'text-align: left')).appendChild(ln('span','x')).offsetLeft;
        }function R(t,e,r,n,i){
          var o=-1;if(n=n||V(t,e),n.crude){
            var l=n.left+r*n.width;return{left:l,right:l+n.width,top:n.top,bottom:n.bottom};
          }for(var s=r;;s+=o){
            var a=n[s];if(a)break;o<0&&0==s&&(o=1);
          }return i=s>r?'left':s<r?'right':i,'left'==i&&a.leftSide?a=a.leftSide:'right'==i&&a.rightSide&&(a=a.rightSide),{left:s<r?a.right:a.left,right:s>r?a.left:a.right,top:a.top,bottom:a.bottom};
        }function B(t,e){
          for(var r=t.display.measureLineCache,n=0;n<r.length;++n){
            var i=r[n];if(i.text==e.text&&i.markedSpans==e.markedSpans&&t.display.scroller.clientWidth==i.width&&i.classes==`${e.textClass}|${e.wrapClass}`)return i;
          }
        }function G(t,e){
          var r=B(t,e);r&&(r.text=r.measure=r.markedSpans=null);
        }function V(t,e){
          var r=B(t,e);if(r)return r.measure;var n=K(t,e),i=t.display.measureLineCache,o={text:e.text,width:t.display.scroller.clientWidth,markedSpans:e.markedSpans,measure:n,classes:`${e.textClass}|${e.wrapClass}`};return 16==i.length?i[++t.display.measureLineCachePos%16]=o:i.push(o),n;
        }function K(t,e){
          function r(t){
            var e=t.top-d.top,r=t.bottom-d.top;r>m&&(r=m),e<0&&(e=0);for(var n=p.length-2;n>=0;n-=2){
              var i=p[n],o=p[n+1];if(!(i>r||o<e)&&(i<=e&&o>=r||e<=i&&r>=o||Math.min(r,o)-Math.max(e,i)>=r-e>>1)){
                p[n]=Math.min(e,i),p[n+1]=Math.max(r,o);break;
              }
            }return n<0&&(n=p.length,p.push(e,r)),{left:t.left-d.left,right:t.right-d.left,top:n,bottom:null};
          }function n(t){
            t.bottom=p[t.top+1],t.top=p[t.top];
          }if(!t.options.lineWrapping&&e.text.length>=t.options.crudeMeasuringFrom)return _(t,e);var i=t.display,o=en(e.text.length),l=rr(t,e,o,!0).pre;if(Tn&&!An&&!t.options.lineWrapping&&l.childNodes.length>100){
            for(var s=document.createDocumentFragment(),a=l.childNodes.length,u=0,c=Math.ceil(a/10);u<c;++u){
              for(var f=ln('div',null,null,'display: inline-block'),h=0;h<10&&a;++h)f.appendChild(l.firstChild),--a;s.appendChild(f);
            }l.appendChild(s);
          }an(i.measure,l);var d=cn(i.lineDiv),p=[],g=en(e.text.length),m=l.offsetHeight;Nn&&i.measure.first!=l&&an(i.measure,l);for(var v,u=0;u<o.length;++u)if(v=o[u]){
            var y=v,b=null;if(/\bCodeMirror-widget\b/.test(v.className)&&v.getClientRects){
              1==v.firstChild.nodeType&&(y=v.firstChild);var x=y.getClientRects();x.length>1&&(b=g[u]=r(x[0]),b.rightSide=r(x[x.length-1]));
            }b||(b=g[u]=r(cn(y))),v.measureRight&&(b.right=cn(v.measureRight).left),v.leftSide&&(b.leftSide=r(cn(v.leftSide)));
          }sn(t.display.measure);for(var v,u=0;u<g.length;++u)(v=g[u])&&(n(v),v.leftSide&&n(v.leftSide),v.rightSide&&n(v.rightSide));return g;
        }function _(t,e){
          var r=new mi(e.text.slice(0,100),null);e.textClass&&(r.textClass=e.textClass);var n=K(t,r),i=R(t,r,0,n,'left'),o=R(t,r,99,n,'right');return{crude:!0,top:i.top,left:i.left,bottom:i.bottom,width:(o.right-i.left)/100};
        }function U(t,e){
          var r=!1;if(e.markedSpans)for(var n=0;n<e.markedSpans;++n){
            var i=e.markedSpans[n];!i.collapsed||null!=i.to&&i.to!=e.text.length||(r=!0);
          }var o=!r&&B(t,e);if(o||e.text.length>=t.options.crudeMeasuringFrom)return R(t,e,e.text.length,o&&o.measure,'right').right;var l=rr(t,e,null,!0).pre,s=l.appendChild(dn(t.display.measure));return an(t.display.measure,l),cn(s).right-cn(t.display.lineDiv).left;
        }function X(t){
          t.display.measureLineCache.length=t.display.measureLineCachePos=0,t.display.cachedCharWidth=t.display.cachedTextHeight=null,t.options.lineWrapping||(t.display.maxLineChanged=!0),t.display.lineNumChars=null;
        }function Y(){
          return window.pageXOffset||(document.documentElement||document.body).scrollLeft;
        }function j(){
          return window.pageYOffset||(document.documentElement||document.body).scrollTop;
        }function $(t,e,r,n){
          if(e.widgets)for(var i=0;i<e.widgets.length;++i)if(e.widgets[i].above){
            var o=Ye(e.widgets[i]);r.top+=o,r.bottom+=o;
          }if('line'==n)return r;n||(n='local');var l=br(t,e);if('local'==n?l+=I(t.display):l-=t.display.viewOffset,'page'==n||'window'==n){
            var s=cn(t.display.lineSpace);l+=s.top+('window'==n?0:j());var a=s.left+('window'==n?0:Y());r.left+=a,r.right+=a;
          }return r.top+=l,r.bottom+=l,r;
        }function Z(t,e,r){
          if('div'==r)return e;var n=e.left,i=e.top;if('page'==r)n-=Y(),i-=j();else if('local'==r||!r){
            var o=cn(t.display.sizer);n+=o.left,i+=o.top;
          }var l=cn(t.display.lineSpace);return{left:n-l.left,top:i-l.top};
        }function q(t,e,r,n,i){
          return n||(n=dr(t.doc,e.line)),$(t,n,R(t,n,e.ch,null,i),r);
        }function Q(t,e,r,n,i){
          function o(e,o){
            var l=R(t,n,e,i,o?'right':'left');return o?l.left=l.right:l.right=l.left,$(t,n,l,r);
          }function l(t,e){
            var r=s[e],n=r.level%2;return t==gn(r)&&e&&r.level<s[e-1].level?(r=s[--e],t=mn(r)-(r.level%2?0:1),n=!0):t==mn(r)&&e<s.length-1&&r.level<s[e+1].level&&(r=s[++e],t=gn(r)-r.level%2,n=!1),n&&t==r.to&&t>r.from?o(t-1):o(t,n);
          }n=n||dr(t.doc,e.line),i||(i=V(t,n));var s=xr(n),a=e.ch;if(!s)return o(a);var u=wn(s,a),c=l(a,u);return null!=Fi&&(c.other=l(a,Fi)),c;
        }function J(t,e,r,n){
          var i=new Yt(t,e);return i.xRel=n,r&&(i.outside=!0),i;
        }function tt(t,e,r){
          var n=t.doc;if((r+=t.display.viewOffset)<0)return J(n.first,0,!0,-1);var i=yr(n,r),o=n.first+n.size-1;if(i>o)return J(n.first+n.size-1,dr(n,o).text.length,!0,1);for(e<0&&(e=0);;){
            var l=dr(n,i),s=et(t,l,i,e,r),a=Be(l),u=a&&a.find();if(!a||!(s.ch>u.from.ch||s.ch==u.from.ch&&s.xRel>0))return s;i=u.to.line;
          }
        }function et(t,e,r,n,i){
          function o(n){
            var i=Q(t,Yt(r,n),'line',e,u);return s=!0,l>i.bottom?i.left-a:l<i.top?i.left+a:(s=!1,i.left);
          }var l=i-br(t,e),s=!1,a=2*t.display.wrapper.clientWidth,u=V(t,e),c=xr(e),f=e.text.length,h=vn(e),d=yn(e),p=o(h),g=s,m=o(d),v=s;if(n>m)return J(r,d,v,1);for(;;){
            if(c?d==h||d==kn(e,h,1):d-h<=1){
              for(var y=n<p||n-p<=m-n?h:d,b=n-(y==h?p:m);Ni.test(e.text.charAt(y));)++y;return J(r,y,y==h?g:v,b<0?-1:b?1:0);
            }var x=Math.ceil(f/2),C=h+x;if(c){
              C=h;for(var w=0;w<x;++w)C=kn(e,C,1);
            }var L=o(C);L>n?(d=C,m=L,(v=s)&&(m+=1e3),f=x):(h=C,p=L,g=s,f-=x);
          }
        }function rt(t){
          if(null!=t.cachedTextHeight)return t.cachedTextHeight;if(null==_n){
            _n=ln('pre');for(var e=0;e<49;++e)_n.appendChild(document.createTextNode('x')),_n.appendChild(ln('br'));_n.appendChild(document.createTextNode('x'));
          }an(t.measure,_n);var r=_n.offsetHeight/50;return r>3&&(t.cachedTextHeight=r),sn(t.measure),r||1;
        }function nt(t){
          if(null!=t.cachedCharWidth)return t.cachedCharWidth;var e=ln('span','x'),r=ln('pre',[e]);an(t.measure,r);var n=e.offsetWidth;return n>2&&(t.cachedCharWidth=n),n||10;
        }function it(t){
          t.curOp={changes:[],forceUpdate:!1,updateInput:null,userSelChange:null,textChanged:null,selectionChanged:!1,cursorActivity:!1,updateMaxLine:!1,updateScrollPos:!1,id:++qn},ki++||(Li=[]);
        }function ot(t){
          var e=t.curOp,r=t.doc,n=t.display;if(t.curOp=null,e.updateMaxLine&&f(t),n.maxLineChanged&&!t.options.lineWrapping&&n.maxLine){
            var i=U(t,n.maxLine);n.sizer.style.minWidth=`${Math.max(0,i+3+Si)}px`,n.maxLineChanged=!1;var o=Math.max(0,n.sizer.offsetLeft+n.sizer.offsetWidth-n.scroller.clientWidth);o<r.scrollLeft&&!e.updateScrollPos&&Mt(t,Math.min(n.scroller.scrollLeft,o),!0);
          }var l,s;if(e.updateScrollPos)l=e.updateScrollPos;else if(e.selectionChanged&&n.scroller.clientHeight){
            var a=Q(t,r.sel.head);l=ue(t,a.left,a.top,a.left,a.bottom);
          }(e.changes.length||e.forceUpdate||l&&null!=l.scrollTop)&&(s=b(t,e.changes,l&&l.scrollTop,e.forceUpdate),t.display.scroller.offsetHeight&&(t.doc.scrollTop=t.display.scroller.scrollTop)),!s&&e.selectionChanged&&A(t),e.updateScrollPos?(n.scroller.scrollTop=n.scrollbarV.scrollTop=r.scrollTop=l.scrollTop,n.scroller.scrollLeft=n.scrollbarH.scrollLeft=r.scrollLeft=l.scrollLeft,g(t),e.scrollToPos&&se(t,Qt(t.doc,e.scrollToPos),e.scrollToPosMargin)):l&&le(t),e.selectionChanged&&D(t),t.state.focused&&e.updateInput&&dt(t,e.userSelChange);var u=e.maybeHiddenMarkers,c=e.maybeUnhiddenMarkers;if(u)for(var h=0;h<u.length;++h)u[h].lines.length||Gr(u[h],'hide');if(c)for(var h=0;h<c.length;++h)c[h].lines.length&&Gr(c[h],'unhide');var d;if(--ki||(d=Li,Li=null),e.textChanged&&Gr(t,'change',t,e.textChanged),e.cursorActivity&&Gr(t,'cursorActivity',t),d)for(var h=0;h<d.length;++h)d[h]();
        }function lt(t,e){
          return function (){
            var r=t||this,n=!r.curOp;n&&it(r);try{
              var i=e.apply(r,arguments);
            }finally{
              n&&ot(r);
            }return i;
          };
        }function st(t){
          return function (){
            var e,r=this.cm&&!this.cm.curOp;r&&it(this.cm);try{
              e=t.apply(this,arguments);
            }finally{
              r&&ot(this.cm);
            }return e;
          };
        }function at(t,e){
          var r,n=!t.curOp;n&&it(t);try{
            r=e();
          }finally{
            n&&ot(t);
          }return r;
        }function ut(t,e,r,n){
          null==e&&(e=t.doc.first),null==r&&(r=t.doc.first+t.doc.size),t.curOp.changes.push({from:e,to:r,diff:n});
        }function ct(t){
          t.display.pollingFast||t.display.poll.set(t.options.pollInterval,function (){
            ht(t),t.state.focused&&ct(t);
          });
        }function ft(t){
          function e(){
            ht(t)||r?(t.display.pollingFast=!1,ct(t)):(r=!0,t.display.poll.set(60,e));
          }var r=!1;t.display.pollingFast=!0,t.display.poll.set(20,e);
        }function ht(t){
          var e=t.display.input,r=t.display.prevInput,n=t.doc,i=n.sel;if(!t.state.focused||Ei(e)||gt(t)||t.state.disableInput)return!1;t.state.pasteIncoming&&t.state.fakedLastChar&&(e.value=e.value.substring(0,e.value.length-1),t.state.fakedLastChar=!1);var o=e.value;if(o==r&&jt(i.from,i.to))return!1;if(Tn&&!Nn&&t.display.inputHasSelection===o)return dt(t,!0),!1;var l=!t.curOp;l&&it(t),i.shift=!1;for(var s=0,a=Math.min(r.length,o.length);s<a&&r.charCodeAt(s)==o.charCodeAt(s);)++s;var u=i.from,c=i.to;s<r.length?u=Yt(u.line,u.ch-(r.length-s)):t.state.overwrite&&jt(u,c)&&!t.state.pasteIncoming&&(c=Yt(c.line,Math.min(dr(n,c.line).text.length,c.ch+(o.length-s))));var f=t.curOp.updateInput,h={from:u,to:c,text:Oi(o.slice(s)),origin:t.state.pasteIncoming?'paste':'+input'};return Bt(t.doc,h,'end'),t.curOp.updateInput=f,Vr(t,'inputRead',t,h),o.length>1e3||o.indexOf('\n')>-1?e.value=t.display.prevInput='':t.display.prevInput=o,l&&ot(t),t.state.pasteIncoming=!1,!0;
        }function dt(t,e){
          var r,n,i=t.doc;if(jt(i.sel.from,i.sel.to))e&&(t.display.prevInput=t.display.input.value='',Tn&&!Nn&&(t.display.inputHasSelection=null));else{
            t.display.prevInput='',r=zi&&(i.sel.to.line-i.sel.from.line>100||(n=t.getSelection()).length>1e3);var o=r?'-':n||t.getSelection();t.display.input.value=o,t.state.focused&&qr(t.display.input),Tn&&!Nn&&(t.display.inputHasSelection=o);
          }t.display.inaccurateSelection=r;
        }function pt(t){
          'nocursor'==t.options.readOnly||Bn&&document.activeElement==t.display.input||t.display.input.focus();
        }function gt(t){
          return t.options.readOnly||t.doc.cantEdit;
        }function mt(t){
          function e(){
            t.state.focused&&setTimeout(rn(pt,t),0);
          }function r(){
            null==s&&(s=setTimeout(function (){
              s=null,l.cachedCharWidth=l.cachedTextHeight=Di=null,X(t),at(t,rn(ut,t));
            },100));
          }function n(){
            for(var t=l.wrapper.parentNode;t&&t!=document.body;t=t.parentNode);t?setTimeout(n,5e3):Br(window,'resize',r);
          }function i(e){
            Kr(t,e)||t.options.onDragEvent&&t.options.onDragEvent(t,Wr(e))||Ir(e);
          }function o(){
            l.inaccurateSelection&&(l.prevInput='',l.inaccurateSelection=!1,l.input.value=t.getSelection(),qr(l.input));
          }var l=t.display;Rr(l.scroller,'mousedown',lt(t,bt)),Tn?Rr(l.scroller,'dblclick',lt(t,function (e){
            if(!Kr(t,e)){
              var r=yt(t,e);if(r&&!wt(t,e)&&!vt(t.display,e)){
                Or(e);var n=me(dr(t.doc,r.line).text,r);ee(t.doc,n.from,n.to);
              }
            }
          })):Rr(l.scroller,'dblclick',function (e){
            Kr(t,e)||Or(e);
          }),Rr(l.lineSpace,'selectstart',function (t){
            vt(l,t)||Or(t);
          }),jn||Rr(l.scroller,'contextmenu',function (e){
            It(t,e);
          }),Rr(l.scroller,'scroll',function (){
            l.scroller.clientHeight&&(St(t,l.scroller.scrollTop),Mt(t,l.scroller.scrollLeft,!0),Gr(t,'scroll',t));
          }),Rr(l.scrollbarV,'scroll',function (){
            l.scroller.clientHeight&&St(t,l.scrollbarV.scrollTop);
          }),Rr(l.scrollbarH,'scroll',function (){
            l.scroller.clientHeight&&Mt(t,l.scrollbarH.scrollLeft);
          }),Rr(l.scroller,'mousewheel',function (e){
            Tt(t,e);
          }),Rr(l.scroller,'DOMMouseScroll',function (e){
            Tt(t,e);
          }),Rr(l.scrollbarH,'mousedown',e),Rr(l.scrollbarV,'mousedown',e),Rr(l.wrapper,'scroll',function (){
            l.wrapper.scrollTop=l.wrapper.scrollLeft=0;
          });var s;Rr(window,'resize',r),setTimeout(n,5e3),Rr(l.input,'keyup',lt(t,function (e){
            Kr(t,e)||t.options.onKeyEvent&&t.options.onKeyEvent(t,Wr(e))||16==e.keyCode&&(t.doc.sel.shift=!1);
          })),Rr(l.input,'input',function (){
            Tn&&!Nn&&t.display.inputHasSelection&&(t.display.inputHasSelection=null),ft(t);
          }),Rr(l.input,'keydown',lt(t,Wt)),Rr(l.input,'keypress',lt(t,Ot)),Rr(l.input,'focus',rn(Et,t)),Rr(l.input,'blur',rn(zt,t)),t.options.dragDrop&&(Rr(l.scroller,'dragstart',function (e){
            kt(t,e);
          }),Rr(l.scroller,'dragenter',i),Rr(l.scroller,'dragover',i),Rr(l.scroller,'drop',lt(t,Lt))),Rr(l.scroller,'paste',function (e){
            vt(l,e)||(pt(t),ft(t));
          }),Rr(l.input,'paste',function (){
            if(Hn&&!t.state.fakedLastChar&&!(new Date-t.state.lastMiddleDown<200)){
              var e=l.input.selectionStart,r=l.input.selectionEnd;l.input.value+='$',l.input.selectionStart=e,l.input.selectionEnd=r,t.state.fakedLastChar=!0;
            }t.state.pasteIncoming=!0,ft(t);
          }),Rr(l.input,'cut',o),Rr(l.input,'copy',o),zn&&Rr(l.sizer,'mouseup',function (){
            document.activeElement==l.input&&l.input.blur(),pt(t);
          });
        }function vt(t,e){
          for(var r=Fr(e);r!=t.wrapper;r=r.parentNode)if(!r||r.ignoreEvents||r.parentNode==t.sizer&&r!=t.mover)return!0;
        }function yt(t,e,r){
          var n=t.display;if(!r){
            var i=Fr(e);if(i==n.scrollbarH||i==n.scrollbarH.firstChild||i==n.scrollbarV||i==n.scrollbarV.firstChild||i==n.scrollbarFiller||i==n.gutterFiller)return null;
          }var o,l,s=cn(n.lineSpace);try{
            o=e.clientX,l=e.clientY;
          }catch(e){
            return null;
          }return tt(t,o-s.left,l-s.top);
        }function bt(t){
          function e(t){
            if(!jt(v,t)){
              if(v=t,'single'==c)return void ee(i.doc,Qt(l,a),t);if(g=Qt(l,g),m=Qt(l,m),'double'==c){
                var e=me(dr(l,t.line).text,t);$t(t,g)?ee(i.doc,e.from,m):ee(i.doc,g,e.to);
              }else'triple'==c&&($t(t,g)?ee(i.doc,m,Qt(l,Yt(t.line,0))):ee(i.doc,g,Qt(l,Yt(t.line+1,0))));
            }
          }function r(t){
            var n=++b,s=yt(i,t,!0);if(s)if(jt(s,h)){
              var a=t.clientY<y.top?-20:t.clientY>y.bottom?20:0;a&&setTimeout(lt(i,function (){
                b==n&&(o.scroller.scrollTop+=a,r(t));
              }),50);
            }else{
              i.state.focused||Et(i),h=s,e(s);var u=p(o,l);(s.line>=u.to||s.line<u.from)&&setTimeout(lt(i,function (){
                b==n&&r(t);
              }),150);
            }
          }function n(t){
            b=1/0,Or(t),pt(i),Br(document,'mousemove',x),Br(document,'mouseup',C);
          }if(!Kr(this,t)){
            var i=this,o=i.display,l=i.doc,s=l.sel;if(s.shift=t.shiftKey,vt(o,t))return void(Hn||(o.scroller.draggable=!1,setTimeout(function (){
              o.scroller.draggable=!0;
            },100)));if(!wt(i,t)){
              var a=yt(i,t);switch(Pr(t)){
              case 3:return void(jn&&It.call(i,i,t));case 2:return Hn&&(i.state.lastMiddleDown=+new Date),a&&ee(i.doc,a),setTimeout(rn(pt,i),20),void Or(t);
              }if(!a)return void(Fr(t)==o.scroller&&Or(t));i.state.focused||Et(i);var u=+new Date,c='single';if(Xn&&Xn.time>u-400&&jt(Xn.pos,a))c='triple',Or(t),setTimeout(rn(pt,i),20),ve(i,a.line);else if(Un&&Un.time>u-400&&jt(Un.pos,a)){
                c='double',Xn={time:u,pos:a},Or(t);var f=me(dr(l,a.line).text,a);ee(i.doc,f.from,f.to);
              }else Un={time:u,pos:a};var h=a;if(i.options.dragDrop&&Hi&&!gt(i)&&!jt(s.from,s.to)&&!$t(a,s.from)&&!$t(s.to,a)&&'single'==c){
                var d=lt(i,function (e){
                  Hn&&(o.scroller.draggable=!1),i.state.draggingText=!1,Br(document,'mouseup',d),Br(o.scroller,'drop',d),Math.abs(t.clientX-e.clientX)+Math.abs(t.clientY-e.clientY)<10&&(Or(e),ee(i.doc,a),pt(i));
                });return Hn&&(o.scroller.draggable=!0),i.state.draggingText=d,o.scroller.dragDrop&&o.scroller.dragDrop(),Rr(document,'mouseup',d),void Rr(o.scroller,'drop',d);
              }Or(t),'single'==c&&ee(i.doc,Qt(l,a));var g=s.from,m=s.to,v=a,y=cn(o.wrapper),b=0,x=lt(i,function (t){
                  Tn||Pr(t)?r(t):n(t);
                }),C=lt(i,n);Rr(document,'mousemove',x),Rr(document,'mouseup',C);
            }
          }
        }function xt(t,e,r,n,i){
          try{
            var o=e.clientX,l=e.clientY;
          }catch(e){
            return!1;
          }if(o>=Math.floor(cn(t.display.gutters).right))return!1;n&&Or(e);var s=t.display,a=cn(s.lineDiv);if(l>a.bottom||!Ur(t,r))return zr(e);l-=a.top-s.viewOffset;for(var u=0;u<t.options.gutters.length;++u){
            var c=s.gutters.childNodes[u];if(c&&cn(c).right>=o){
              return i(t,r,t,yr(t.doc,l),t.options.gutters[u],e),zr(e);
            }
          }
        }function Ct(t,e){
          return!!Ur(t,'gutterContextMenu')&&xt(t,e,'gutterContextMenu',!1,Gr);
        }function wt(t,e){
          return xt(t,e,'gutterClick',!0,Vr);
        }function Lt(t){
          var e=this;if(!(Kr(e,t)||vt(e.display,t)||e.options.onDragEvent&&e.options.onDragEvent(e,Wr(t)))){
            Or(t),Tn&&(Qn=+new Date);var r=yt(e,t,!0),n=t.dataTransfer.files;if(r&&!gt(e))if(n&&n.length&&window.FileReader&&window.File)for(var i=n.length,o=Array(i),l=0,s=0;s<i;++s)!function (t,n){
              var s=new FileReader;s.onload=function (){
                o[n]=s.result,++l==i&&(r=Qt(e.doc,r),Bt(e.doc,{from:r,to:r,text:Oi(o.join('\n')),origin:'paste'},'around'));
              },s.readAsText(t);
            }(n[s],s);else{
              if(e.state.draggingText&&!$t(r,e.doc.sel.from)&&!$t(e.doc.sel.to,r))return e.state.draggingText(t),void setTimeout(rn(pt,e),20);try{
                var o=t.dataTransfer.getData('Text');if(o){
                  var a=e.doc.sel.from,u=e.doc.sel.to;ne(e.doc,r,r),e.state.draggingText&&Xt(e.doc,'',a,u,'paste'),e.replaceSelection(o,null,'paste'),pt(e),Et(e);
                }
              }catch(t){}
            }
          }
        }function kt(t,e){
          if(Tn&&(!t.state.draggingText||+new Date-Qn<100))return void Ir(e);if(!Kr(t,e)&&!vt(t.display,e)){
            var r=t.getSelection();if(e.dataTransfer.setData('Text',r),e.dataTransfer.setDragImage&&!En){
              var n=ln('img',null,null,'position: fixed; left: 0; top: 0;');n.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',On&&(n.width=n.height=1,t.display.wrapper.appendChild(n),n._top=n.offsetTop),e.dataTransfer.setDragImage(n,0,0),On&&n.parentNode.removeChild(n);
            }
          }
        }function St(t,e){
          Math.abs(t.doc.scrollTop-e)<2||(t.doc.scrollTop=e,Mn||b(t,[],e),t.display.scroller.scrollTop!=e&&(t.display.scroller.scrollTop=e),t.display.scrollbarV.scrollTop!=e&&(t.display.scrollbarV.scrollTop=e),Mn&&b(t,[]),W(t,100));
        }function Mt(t,e,r){
          (r?e==t.doc.scrollLeft:Math.abs(t.doc.scrollLeft-e)<2)||(e=Math.min(e,t.display.scroller.scrollWidth-t.display.scroller.clientWidth),t.doc.scrollLeft=e,g(t),t.display.scroller.scrollLeft!=e&&(t.display.scroller.scrollLeft=e),t.display.scrollbarH.scrollLeft!=e&&(t.display.scrollbarH.scrollLeft=e));
        }function Tt(t,e){
          var r=e.wheelDeltaX,n=e.wheelDeltaY;null==r&&e.detail&&e.axis==e.HORIZONTAL_AXIS&&(r=e.detail),null==n&&e.detail&&e.axis==e.VERTICAL_AXIS?n=e.detail:null==n&&(n=e.wheelDelta);var i=t.display,o=i.scroller;if(r&&o.scrollWidth>o.clientWidth||n&&o.scrollHeight>o.clientHeight){
            if(n&&Gn&&Hn)for(var l=e.target;l!=o;l=l.parentNode)if(l.lineObj){
              t.display.currentWheelTarget=l;break;
            }if(r&&!Mn&&!On&&null!=ti)return n&&St(t,Math.max(0,Math.min(o.scrollTop+n*ti,o.scrollHeight-o.clientHeight))),Mt(t,Math.max(0,Math.min(o.scrollLeft+r*ti,o.scrollWidth-o.clientWidth))),Or(e),void(i.wheelStartX=null);if(n&&null!=ti){
              var s=n*ti,a=t.doc.scrollTop,u=a+i.wrapper.clientHeight;s<0?a=Math.max(0,a+s-50):u=Math.min(t.doc.height,u+s+50),b(t,[],{top:a,bottom:u});
            }Jn<20&&(null==i.wheelStartX?(i.wheelStartX=o.scrollLeft,i.wheelStartY=o.scrollTop,i.wheelDX=r,i.wheelDY=n,setTimeout(function (){
              if(null!=i.wheelStartX){
                var t=o.scrollLeft-i.wheelStartX,e=o.scrollTop-i.wheelStartY,r=e&&i.wheelDY&&e/i.wheelDY||t&&i.wheelDX&&t/i.wheelDX;i.wheelStartX=i.wheelStartY=null,r&&(ti=(ti*Jn+r)/(Jn+1),++Jn);
              }
            },200)):(i.wheelDX+=r,i.wheelDY+=n));
          }
        }function At(t,e,r){
          if('string'==typeof e&&!(e=di[e]))return!1;t.display.pollingFast&&ht(t)&&(t.display.pollingFast=!1);var n=t.doc,i=n.sel.shift,o=!1;try{
            gt(t)&&(t.state.suppressEdits=!0),r&&(n.sel.shift=!1),o=e(t)!=Mi;
          }finally{
            n.sel.shift=i,t.state.suppressEdits=!1;
          }return o;
        }function Nt(t){
          var e=t.state.keyMaps.slice(0);return t.options.extraKeys&&e.push(t.options.extraKeys),e.push(t.options.keyMap),e;
        }function Ht(t,e){
          var r=Ce(t.options.keyMap),n=r.auto;clearTimeout(ei),n&&!Le(e)&&(ei=setTimeout(function (){
            Ce(t.options.keyMap)==r&&(t.options.keyMap=n.call?n.call(null,t):n,l(t));
          },50));var i=ke(e,!0),o=!1;if(!i)return!1;var s=Nt(t);return o=e.shiftKey?we(`Shift-${i}`,s,function (e){
            return At(t,e,!0);
          })||we(i,s,function (e){
            if('string'==typeof e?/^go[A-Z]/.test(e):e.motion)return At(t,e);
          }):we(i,s,function (e){
            return At(t,e);
          }),o&&(Or(e),D(t),Nn&&(e.oldKeyCode=e.keyCode,e.keyCode=0),Vr(t,'keyHandled',t,i,e)),o;
        }function Dt(t,e,r){
          var n=we(`'${r}'`,Nt(t),function (e){
            return At(t,e,!0);
          });return n&&(Or(e),D(t),Vr(t,'keyHandled',t,`'${r}'`,e)),n;
        }function Wt(t){
          var e=this;if(e.state.focused||Et(e),!(Kr(e,t)||e.options.onKeyEvent&&e.options.onKeyEvent(e,Wr(t)))){
            Tn&&27==t.keyCode&&(t.returnValue=!1);var r=t.keyCode;e.doc.sel.shift=16==r||t.shiftKey;var n=Ht(e,t);On&&(ni=n?r:null,!n&&88==r&&!zi&&(Gn?t.metaKey:t.ctrlKey)&&e.replaceSelection(''));
          }
        }function Ot(t){
          var e=this;if(!(Kr(e,t)||e.options.onKeyEvent&&e.options.onKeyEvent(e,Wr(t)))){
            var r=t.keyCode,n=t.charCode;if(On&&r==ni)return ni=null,void Or(t);if(!(On&&(!t.which||t.which<10)||zn)||!Ht(e,t)){
              var i=String.fromCharCode(null==n?r:n);this.options.electricChars&&this.doc.mode.electricChars&&this.options.smartIndent&&!gt(this)&&this.doc.mode.electricChars.indexOf(i)>-1&&setTimeout(lt(e,function (){
                he(e,e.doc.sel.to.line,'smart');
              }),75),Dt(e,t,i)||(Tn&&!Nn&&(e.display.inputHasSelection=null),ft(e));
            }
          }
        }function Et(t){
          'nocursor'!=t.options.readOnly&&(t.state.focused||(Gr(t,'focus',t),t.state.focused=!0,-1==t.display.wrapper.className.search(/\bCodeMirror-focused\b/)&&(t.display.wrapper.className+=' CodeMirror-focused'),t.curOp||(dt(t,!0),Hn&&setTimeout(rn(dt,t,!0),0))),ct(t),D(t));
        }function zt(t){
          t.state.focused&&(Gr(t,'blur',t),t.state.focused=!1,t.display.wrapper.className=t.display.wrapper.className.replace(' CodeMirror-focused','')),clearInterval(t.display.blinker),setTimeout(function (){
            t.state.focused||(t.doc.sel.shift=!1);
          },150);
        }function It(t,e){
          function r(){
            if(null!=i.input.selectionStart){
              var t=i.input.value=`​${jt(o.from,o.to)?'':i.input.value}`;i.prevInput='​',i.input.selectionStart=1,i.input.selectionEnd=t.length;
            }
          }function n(){
            if(i.inputDiv.style.position='relative',i.input.style.cssText=a,Nn&&(i.scrollbarV.scrollTop=i.scroller.scrollTop=s),ct(t),null!=i.input.selectionStart){
              Tn&&!Nn||r(),clearTimeout(ri);var e=0,n=function (){
                ' '==i.prevInput&&0==i.input.selectionStart?lt(t,di.selectAll)(t):e++<10?ri=setTimeout(n,500):dt(t);
              };ri=setTimeout(n,200);
            }
          }if(!Kr(t,e,'contextmenu')){
            var i=t.display,o=t.doc.sel;if(!vt(i,e)&&!Ct(t,e)){
              var l=yt(t,e),s=i.scroller.scrollTop;if(l&&!On){
                (jt(o.from,o.to)||$t(l,o.from)||!$t(l,o.to))&&lt(t,ne)(t.doc,l,l);var a=i.input.style.cssText;if(i.inputDiv.style.position='absolute',i.input.style.cssText=`position: fixed; width: 30px; height: 30px; top: ${e.clientY-5}px; left: ${e.clientX-5}px; z-index: 1000; background: white; outline: none;border-width: 0; outline: none; overflow: hidden; opacity: .05; -ms-opacity: .05; filter: alpha(opacity=5);`,pt(t),dt(t,!0),jt(o.from,o.to)&&(i.input.value=i.prevInput=' '),Tn&&!Nn&&r(),jn){
                  Ir(e);var u=function (){
                    Br(window,'mouseup',u),setTimeout(n,20);
                  };Rr(window,'mouseup',u);
                }else setTimeout(n,50);
              }
            }
          }
        }function Ft(t,e,r){
          if(!$t(e.from,r))return Qt(t,r);var n=e.text.length-1-(e.to.line-e.from.line);if(r.line>e.to.line+n){
            var i=r.line-n,o=t.first+t.size-1;return i>o?Yt(o,dr(t,o).text.length):Jt(r,dr(t,i).text.length);
          }if(r.line==e.to.line+n)return Jt(r,Zr(e.text).length+(1==e.text.length?e.from.ch:0)+dr(t,e.to.line).text.length-e.to.ch);var l=r.line-e.from.line;return Jt(r,e.text[l].length+(l?0:e.from.ch));
        }function Pt(t,e,r){
          if(r&&'object'==typeof r)return{anchor:Ft(t,e,r.anchor),head:Ft(t,e,r.head)};if('start'==r)return{anchor:e.from,head:e.from};var n=ii(e);if('around'==r)return{anchor:e.from,head:n};if('end'==r)return{anchor:n,head:n};var i=function (t){
            if($t(t,e.from))return t;if(!$t(e.to,t))return n;var r=t.line+e.text.length-(e.to.line-e.from.line)-1,i=t.ch;return t.line==e.to.line&&(i+=n.ch-e.to.ch),Yt(r,i);
          };return{anchor:i(t.sel.anchor),head:i(t.sel.head)};
        }function Rt(t,e,r){
          var n={canceled:!1,from:e.from,to:e.to,text:e.text,origin:e.origin,cancel:function (){
            this.canceled=!0;
          }};return r&&(n.update=function (e,r,n,i){
            e&&(this.from=Qt(t,e)),r&&(this.to=Qt(t,r)),n&&(this.text=n),void 0!==i&&(this.origin=i);
          }),Gr(t,'beforeChange',t,n),t.cm&&Gr(t.cm,'beforeChange',t.cm,n),n.canceled?null:{from:n.from,to:n.to,text:n.text,origin:n.origin};
        }function Bt(t,e,r,n){
          if(t.cm){
            if(!t.cm.curOp)return lt(t.cm,Bt)(t,e,r,n);if(t.cm.state.suppressEdits)return;
          }if(!(Ur(t,'beforeChange')||t.cm&&Ur(t.cm,'beforeChange'))||(e=Rt(t,e,!0))){
            var i=$n&&!n&&Fe(t,e.from,e.to);if(i){
              for(var o=i.length-1;o>=1;--o)Gt(t,{from:i[o].from,to:i[o].to,text:['']});i.length&&Gt(t,{from:i[0].from,to:i[0].to,text:e.text},r);
            }else Gt(t,e,r);
          }
        }function Gt(t,e,r){
          if(1!=e.text.length||''!=e.text[0]||!jt(e.from,e.to)){
            var n=Pt(t,e,r);kr(t,e,n,t.cm?t.cm.curOp.id:NaN),_t(t,e,n,ze(t,e));var i=[];fr(t,function (t,r){
              r||-1!=Qr(i,t.history)||(Hr(t.history,e),i.push(t.history)),_t(t,e,null,ze(t,e));
            });
          }
        }function Vt(t,e){
          if(!t.cm||!t.cm.state.suppressEdits){
            var r=t.history,n=('undo'==e?r.done:r.undone).pop();if(n){
              var i={changes:[],anchorBefore:n.anchorAfter,headBefore:n.headAfter,anchorAfter:n.anchorBefore,headAfter:n.headBefore,generation:r.generation};('undo'==e?r.undone:r.done).push(i),r.generation=n.generation||++r.maxGeneration;for(var o=Ur(t,'beforeChange')||t.cm&&Ur(t.cm,'beforeChange'),l=n.changes.length-1;l>=0;--l){
                var s=n.changes[l];if(s.origin=e,o&&!Rt(t,s,!1))return void(('undo'==e?r.done:r.undone).length=0);i.changes.push(Lr(t,s));var a=l?Pt(t,s,null):{anchor:n.anchorBefore,head:n.headBefore};_t(t,s,a,Ie(t,s));var u=[];fr(t,function (t,e){
                  e||-1!=Qr(u,t.history)||(Hr(t.history,s),u.push(t.history)),_t(t,s,null,Ie(t,s));
                });
              }
            }
          }
        }function Kt(t,e){
          function r(t){
            return Yt(t.line+e,t.ch);
          }t.first+=e,t.cm&&ut(t.cm,t.first,t.first,e),t.sel.head=r(t.sel.head),t.sel.anchor=r(t.sel.anchor),t.sel.from=r(t.sel.from),t.sel.to=r(t.sel.to);
        }function _t(t,e,r,n){
          if(t.cm&&!t.cm.curOp)return lt(t.cm,_t)(t,e,r,n);if(e.to.line<t.first)return void Kt(t,e.text.length-1-(e.to.line-e.from.line));if(!(e.from.line>t.lastLine())){
            if(e.from.line<t.first){
              var i=e.text.length-1-(t.first-e.from.line);Kt(t,i),e={from:Yt(t.first,0),to:Yt(e.to.line+i,e.to.ch),text:[Zr(e.text)],origin:e.origin};
            }var o=t.lastLine();e.to.line>o&&(e={from:e.from,to:Yt(o,dr(t,o).text.length),text:[e.text[0]],origin:e.origin}),e.removed=pr(t,e.from,e.to),r||(r=Pt(t,e,null)),t.cm?Ut(t.cm,e,n,r):ar(t,e,n,r);
          }
        }function Ut(t,e,r,n){
          var o=t.doc,l=t.display,s=e.from,a=e.to,u=!1,f=s.line;t.options.lineWrapping||(f=vr(Ge(o,dr(o,s.line))),o.iter(f,a.line+1,function (t){
            if(t==l.maxLine)return u=!0,!0;
          })),$t(o.sel.head,e.from)||$t(e.to,o.sel.head)||(t.curOp.cursorActivity=!0),ar(o,e,r,n,i(t)),t.options.lineWrapping||(o.iter(f,s.line+e.text.length,function (t){
            var e=c(o,t);e>l.maxLineLength&&(l.maxLine=t,l.maxLineLength=e,l.maxLineChanged=!0,u=!1);
          }),u&&(t.curOp.updateMaxLine=!0)),o.frontier=Math.min(o.frontier,s.line),W(t,400);var h=e.text.length-(a.line-s.line)-1;if(ut(t,s.line,a.line+1,h),Ur(t,'change')){
            var d={from:s,to:a,text:e.text,removed:e.removed,origin:e.origin};if(t.curOp.textChanged){
              for(var p=t.curOp.textChanged;p.next;p=p.next);p.next=d;
            }else t.curOp.textChanged=d;
          }
        }function Xt(t,e,r,n,i){
          if(n||(n=r),$t(n,r)){
            var o=n;n=r,r=o;
          }'string'==typeof e&&(e=Oi(e)),Bt(t,{from:r,to:n,text:e,origin:i},null);
        }function Yt(t,e){
          if(!(this instanceof Yt))return new Yt(t,e);this.line=t,this.ch=e;
        }function jt(t,e){
          return t.line==e.line&&t.ch==e.ch;
        }function $t(t,e){
          return t.line<e.line||t.line==e.line&&t.ch<e.ch;
        }function Zt(t){
          return Yt(t.line,t.ch);
        }function qt(t,e){
          return Math.max(t.first,Math.min(e,t.first+t.size-1));
        }function Qt(t,e){
          if(e.line<t.first)return Yt(t.first,0);var r=t.first+t.size-1;return e.line>r?Yt(r,dr(t,r).text.length):Jt(e,dr(t,e.line).text.length);
        }function Jt(t,e){
          var r=t.ch;return null==r||r>e?Yt(t.line,e):r<0?Yt(t.line,0):t;
        }function te(t,e){
          return e>=t.first&&e<t.first+t.size;
        }function ee(t,e,r,n){
          if(t.sel.shift||t.sel.extend){
            var i=t.sel.anchor;if(r){
              var o=$t(e,i);o!=$t(r,i)?(i=e,e=r):o!=$t(e,r)&&(e=r);
            }ne(t,i,e,n);
          }else ne(t,e,r||e,n);t.cm&&(t.cm.curOp.userSelChange=!0);
        }function re(t,e,r){
          var n={anchor:e,head:r};return Gr(t,'beforeSelectionChange',t,n),t.cm&&Gr(t.cm,'beforeSelectionChange',t.cm,n),n.anchor=Qt(t,n.anchor),n.head=Qt(t,n.head),n;
        }function ne(t,e,r,n,i){
          if(!i&&Ur(t,'beforeSelectionChange')||t.cm&&Ur(t.cm,'beforeSelectionChange')){
            var o=re(t,e,r);r=o.head,e=o.anchor;
          }var l=t.sel;if(l.goalColumn=null,null==n&&(n=$t(r,l.head)?-1:1),!i&&jt(e,l.anchor)||(e=oe(t,e,n,'push'!=i)),!i&&jt(r,l.head)||(r=oe(t,r,n,'push'!=i)),!jt(l.anchor,e)||!jt(l.head,r)){
            l.anchor=e,l.head=r;var s=$t(r,e);l.from=s?r:e,l.to=s?e:r,t.cm&&(t.cm.curOp.updateInput=t.cm.curOp.selectionChanged=t.cm.curOp.cursorActivity=!0),Vr(t,'cursorActivity',t);
          }
        }function ie(t){
          ne(t.doc,t.doc.sel.from,t.doc.sel.to,null,'push');
        }function oe(t,e,r,n){
          var i=!1,o=e,l=r||1;t.cantEdit=!1;t:for(;;){
            var s=dr(t,o.line);if(s.markedSpans)for(var a=0;a<s.markedSpans.length;++a){
              var u=s.markedSpans[a],c=u.marker;if((null==u.from||(c.inclusiveLeft?u.from<=o.ch:u.from<o.ch))&&(null==u.to||(c.inclusiveRight?u.to>=o.ch:u.to>o.ch))){
                if(n&&(Gr(c,'beforeCursorEnter'),c.explicitlyCleared)){
                  if(s.markedSpans){
                    --a;continue;
                  }break;
                }if(!c.atomic)continue;var f=c.find()[l<0?'from':'to'];if(jt(f,o)&&(f.ch+=l,f.ch<0?f=f.line>t.first?Qt(t,Yt(f.line-1)):null:f.ch>s.text.length&&(f=f.line<t.first+t.size-1?Yt(f.line+1,0):null),!f)){
                  if(i)return n?(t.cantEdit=!0,Yt(t.first,0)):oe(t,e,r,!0);i=!0,f=e,l=-l;
                }o=f;continue t;
              }
            }return o;
          }
        }function le(t){
          var e=se(t,t.doc.sel.head,t.options.cursorScrollMargin);if(t.state.focused){
            var r=t.display,n=cn(r.sizer),i=null;if(e.top+n.top<0?i=!0:e.bottom+n.top>(window.innerHeight||document.documentElement.clientHeight)&&(i=!1),null!=i&&!Pn){
              var o='none'==r.cursor.style.display;o&&(r.cursor.style.display='',r.cursor.style.left=`${e.left}px`,r.cursor.style.top=`${e.top-r.viewOffset}px`),r.cursor.scrollIntoView(i),o&&(r.cursor.style.display='none');
            }
          }
        }function se(t,e,r){
          for(null==r&&(r=0);;){
            var n=!1,i=Q(t,e),o=ue(t,i.left,i.top-r,i.left,i.bottom+r),l=t.doc.scrollTop,s=t.doc.scrollLeft;if(null!=o.scrollTop&&(St(t,o.scrollTop),Math.abs(t.doc.scrollTop-l)>1&&(n=!0)),null!=o.scrollLeft&&(Mt(t,o.scrollLeft),Math.abs(t.doc.scrollLeft-s)>1&&(n=!0)),!n)return i;
          }
        }function ae(t,e,r,n,i){
          var o=ue(t,e,r,n,i);null!=o.scrollTop&&St(t,o.scrollTop),null!=o.scrollLeft&&Mt(t,o.scrollLeft);
        }function ue(t,e,r,n,i){
          var o=t.display,l=rt(t.display);r<0&&(r=0);var s=o.scroller.clientHeight-Si,a=o.scroller.scrollTop,u={},c=t.doc.height+F(o),f=r<l,h=i>c-l;if(r<a)u.scrollTop=f?0:r;else if(i>a+s){
            var d=Math.min(r,(h?c:i)-s);d!=a&&(u.scrollTop=d);
          }var p=o.scroller.clientWidth-Si,g=o.scroller.scrollLeft;e+=o.gutters.offsetWidth,n+=o.gutters.offsetWidth;var m=o.gutters.offsetWidth,v=e<m+10;return e<g+m||v?(v&&(e=0),u.scrollLeft=Math.max(0,e-10-m)):n>p+g-3&&(u.scrollLeft=n+10-p),u;
        }function ce(t,e,r){
          t.curOp.updateScrollPos={scrollLeft:null==e?t.doc.scrollLeft:e,scrollTop:null==r?t.doc.scrollTop:r};
        }function fe(t,e,r){
          var n=t.curOp.updateScrollPos||(t.curOp.updateScrollPos={scrollLeft:t.doc.scrollLeft,scrollTop:t.doc.scrollTop}),i=t.display.scroller;n.scrollTop=Math.max(0,Math.min(i.scrollHeight-i.clientHeight,n.scrollTop+r)),n.scrollLeft=Math.max(0,Math.min(i.scrollWidth-i.clientWidth,n.scrollLeft+e));
        }function he(t,e,r,n){
          var i=t.doc;if(null==r&&(r='add'),'smart'==r)if(t.doc.mode.indent)var o=z(t,e);else r='prev';var l,s=t.options.tabSize,a=dr(i,e),u=jr(a.text,null,s),c=a.text.match(/^\s*/)[0];if('smart'==r&&(l=t.doc.mode.indent(o,a.text.slice(c.length),a.text))==Mi){
            if(!n)return;r='prev';
          }'prev'==r?l=e>i.first?jr(dr(i,e-1).text,null,s):0:'add'==r?l=u+t.options.indentUnit:'subtract'==r?l=u-t.options.indentUnit:'number'==typeof r&&(l=u+r),l=Math.max(0,l);var f='',h=0;if(t.options.indentWithTabs)for(var d=Math.floor(l/s);d;--d)h+=s,f+='\t';h<l&&(f+=$r(l-h)),f!=c&&Xt(t.doc,f,Yt(e,0),Yt(e,c.length),'+input'),a.stateAfter=null;
        }function de(t,e,r){
          var n=e,i=e,o=t.doc;return'number'==typeof e?i=dr(o,qt(o,e)):n=vr(e),null==n?null:r(i,n)?(ut(t,n,n+1),i):null;
        }function pe(t,e,r,n,i){
          function o(){
            var e=s+r;return e<t.first||e>=t.first+t.size?f=!1:(s=e,c=dr(t,e));
          }function l(t){
            var e=(i?kn:Sn)(c,a,r,!0);if(null==e){
              if(t||!o())return f=!1;a=i?(r<0?yn:vn)(c):r<0?c.text.length:0;
            }else a=e;return!0;
          }var s=e.line,a=e.ch,u=r,c=dr(t,s),f=!0;if('char'==n)l();else if('column'==n)l(!0);else if('word'==n||'group'==n)for(var h=null,d='group'==n,p=!0;!(r<0)||l(!p);p=!1){
            var g=c.text.charAt(a)||'\n',m=nn(g)?'w':d?/\s/.test(g)?null:'p':null;if(h&&h!=m){
              r<0&&(r=1,l());break;
            }if(m&&(h=m),r>0&&!l(!p))break;
          }var v=oe(t,Yt(s,a),u,!0);return f||(v.hitSide=!0),v;
        }function ge(t,e,r,n){
          var i,o=t.doc,l=e.left;if('page'==n){
            var s=Math.min(t.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight);i=e.top+r*(s-(r<0?1.5:.5)*rt(t.display));
          }else'line'==n&&(i=r>0?e.bottom+3:e.top-3);for(;;){
            var a=tt(t,l,i);if(!a.outside)break;if(r<0?i<=0:i>=o.height){
              a.hitSide=!0;break;
            }i+=5*r;
          }return a;
        }function me(t,e){
          var r=e.ch,n=e.ch;if(t){
            (e.xRel<0||n==t.length)&&r?--r:++n;for(var i=t.charAt(r),o=nn(i)?nn:/\s/.test(i)?function (t){
              return/\s/.test(t);
            }:function (t){
              return!/\s/.test(t)&&!nn(t);
            };r>0&&o(t.charAt(r-1));)--r;for(;n<t.length&&o(t.charAt(n));)++n;
          }return{from:Yt(e.line,r),to:Yt(e.line,n)};
        }function ve(t,e){
          ee(t.doc,Yt(e,0),Qt(t.doc,Yt(e+1,0)));
        }function ye(e,r,n,i){
          t.defaults[e]=r,n&&(oi[e]=i?function (t,e,r){
            r!=si&&n(t,e,r);
          }:n);
        }function be(t,e){
          if(!0===e)return e;if(t.copyState)return t.copyState(e);var r={};for(var n in e){
            var i=e[n];i instanceof Array&&(i=i.concat([])),r[n]=i;
          }return r;
        }function xe(t,e,r){
          return!t.startState||t.startState(e,r);
        }function Ce(t){
          return'string'==typeof t?pi[t]:t;
        }function we(t,e,r){
          function n(e){
            e=Ce(e);var i=e[t];if(!1===i)return'stop';if(null!=i&&r(i))return!0;if(e.nofallthrough)return'stop';var o=e.fallthrough;if(null==o)return!1;if('[object Array]'!=Object.prototype.toString.call(o))return n(o);for(var l=0,s=o.length;l<s;++l){
              var a=n(o[l]);if(a)return a;
            }return!1;
          }for(var i=0;i<e.length;++i){
            var o=n(e[i]);if(o)return'stop'!=o;
          }
        }function Le(t){
          var e=Ii[t.keyCode];return'Ctrl'==e||'Alt'==e||'Shift'==e||'Mod'==e;
        }function ke(t,e){
          if(On&&34==t.keyCode&&t.char)return!1;var r=Ii[t.keyCode];return null!=r&&!t.altGraphKey&&(t.altKey&&(r=`Alt-${r}`),(Yn?t.metaKey:t.ctrlKey)&&(r=`Ctrl-${r}`),(Yn?t.ctrlKey:t.metaKey)&&(r=`Cmd-${r}`),!e&&t.shiftKey&&(r=`Shift-${r}`),r);
        }function Se(t,e){
          this.pos=this.start=0,this.string=t,this.tabSize=e||8,this.lastColumnPos=this.lastColumnValue=0;
        }function Me(t,e){
          this.lines=[],this.type=e,this.doc=t;
        }function Te(t,e,r,n,i){
          if(n&&n.shared)return Ne(t,e,r,n,i);if(t.cm&&!t.cm.curOp)return lt(t.cm,Te)(t,e,r,n,i);var o=new Me(t,i);if('range'==i&&!$t(e,r))return o;n&&tn(n,o),o.replacedWith&&(o.collapsed=!0,o.replacedWith=ln('span',[o.replacedWith],'CodeMirror-widget'),n.handleMouseEvents||(o.replacedWith.ignoreEvents=!0)),o.collapsed&&(Zn=!0),o.addToHistory&&kr(t,{from:e,to:r,origin:'markText'},{head:t.sel.head,anchor:t.sel.anchor},NaN);var l,s,a,u=e.line,c=0,f=t.cm;if(t.iter(u,r.line+1,function (n){
            f&&o.collapsed&&!f.options.lineWrapping&&Ge(t,n)==f.display.maxLine&&(a=!0);var i={from:null,to:null,marker:o};c+=n.text.length,u==e.line&&(i.from=e.ch,c-=e.ch),u==r.line&&(i.to=r.ch,c-=n.text.length-r.ch),o.collapsed&&(u==r.line&&(s=Pe(n,r.ch)),u==e.line?l=Pe(n,e.ch):mr(n,0)),We(n,i),++u;
          }),o.collapsed&&t.iter(e.line,r.line+1,function (e){
              Ve(t,e)&&mr(e,0);
            }),o.clearOnEnter&&Rr(o,'beforeCursorEnter',function (){
              o.clear();
            }),o.readOnly&&($n=!0,(t.history.done.length||t.history.undone.length)&&t.clearHistory()),o.collapsed){
            if(l!=s)throw new Error('Inserting collapsed marker overlapping an existing one');o.size=c,o.atomic=!0;
          }return f&&(a&&(f.curOp.updateMaxLine=!0),(o.className||o.title||o.startStyle||o.endStyle||o.collapsed)&&ut(f,e.line,r.line+1),o.atomic&&ie(f)),o;
        }function Ae(t,e){
          this.markers=t,this.primary=e;for(var r=0,n=this;r<t.length;++r)t[r].parent=this,Rr(t[r],'clear',function (){
            n.clear();
          });
        }function Ne(t,e,r,n,i){
          n=tn(n),n.shared=!1;var o=[Te(t,e,r,n,i)],l=o[0],s=n.replacedWith;return fr(t,function (t){
            s&&(n.replacedWith=s.cloneNode(!0)),o.push(Te(t,Qt(t,e),Qt(t,r),n,i));for(var a=0;a<t.linked.length;++a)if(t.linked[a].isParent)return;l=Zr(o);
          }),new Ae(o,l);
        }function He(t,e){
          if(t)for(var r=0;r<t.length;++r){
            var n=t[r];if(n.marker==e)return n;
          }
        }function De(t,e){
          for(var r,n=0;n<t.length;++n)t[n]!=e&&(r||(r=[])).push(t[n]);return r;
        }function We(t,e){
          t.markedSpans=t.markedSpans?t.markedSpans.concat([e]):[e],e.marker.attachLine(t);
        }function Oe(t,e,r){
          if(t)for(var n,i=0;i<t.length;++i){
            var o=t[i],l=o.marker,s=null==o.from||(l.inclusiveLeft?o.from<=e:o.from<e);if(s||'bookmark'==l.type&&o.from==e&&(!r||!o.marker.insertLeft)){
              var a=null==o.to||(l.inclusiveRight?o.to>=e:o.to>e);(n||(n=[])).push({from:o.from,to:a?null:o.to,marker:l});
            }
          }return n;
        }function Ee(t,e,r){
          if(t)for(var n,i=0;i<t.length;++i){
            var o=t[i],l=o.marker,s=null==o.to||(l.inclusiveRight?o.to>=e:o.to>e);if(s||'bookmark'==l.type&&o.from==e&&(!r||o.marker.insertLeft)){
              var a=null==o.from||(l.inclusiveLeft?o.from<=e:o.from<e);(n||(n=[])).push({from:a?null:o.from-e,to:null==o.to?null:o.to-e,marker:l});
            }
          }return n;
        }function ze(t,e){
          var r=te(t,e.from.line)&&dr(t,e.from.line).markedSpans,n=te(t,e.to.line)&&dr(t,e.to.line).markedSpans;if(!r&&!n)return null;var i=e.from.ch,o=e.to.ch,l=jt(e.from,e.to),s=Oe(r,i,l),a=Ee(n,o,l),u=1==e.text.length,c=Zr(e.text).length+(u?i:0);if(s)for(var f=0;f<s.length;++f){
            var h=s[f];if(null==h.to){
              var d=He(a,h.marker);d?u&&(h.to=null==d.to?null:d.to+c):h.to=i;
            }
          }if(a)for(var f=0;f<a.length;++f){
            var h=a[f];if(null!=h.to&&(h.to+=c),null==h.from){
              var d=He(s,h.marker);d||(h.from=c,u&&(s||(s=[])).push(h));
            }else h.from+=c,u&&(s||(s=[])).push(h);
          }if(u&&s){
            for(var f=0;f<s.length;++f)null!=s[f].from&&s[f].from==s[f].to&&'bookmark'!=s[f].marker.type&&s.splice(f--,1);s.length||(s=null);
          }var p=[s];if(!u){
            var g,m=e.text.length-2;if(m>0&&s)for(var f=0;f<s.length;++f)null==s[f].to&&(g||(g=[])).push({from:null,to:null,marker:s[f].marker});for(var f=0;f<m;++f)p.push(g);p.push(a);
          }return p;
        }function Ie(t,e){
          var r=Mr(t,e),n=ze(t,e);if(!r)return n;if(!n)return r;for(var i=0;i<r.length;++i){
            var o=r[i],l=n[i];if(o&&l)t:for(var s=0;s<l.length;++s){
              for(var a=l[s],u=0;u<o.length;++u)if(o[u].marker==a.marker)continue t;o.push(a);
            }else l&&(r[i]=l);
          }return r;
        }function Fe(t,e,r){
          var n=null;if(t.iter(e.line,r.line+1,function (t){
            if(t.markedSpans)for(var e=0;e<t.markedSpans.length;++e){
              var r=t.markedSpans[e].marker;!r.readOnly||n&&-1!=Qr(n,r)||(n||(n=[])).push(r);
            }
          }),!n)return null;for(var i=[{from:e,to:r}],o=0;o<n.length;++o)for(var l=n[o],s=l.find(),a=0;a<i.length;++a){
            var u=i[a];if(!$t(u.to,s.from)&&!$t(s.to,u.from)){
              var c=[a,1];($t(u.from,s.from)||!l.inclusiveLeft&&jt(u.from,s.from))&&c.push({from:u.from,to:s.from}),($t(s.to,u.to)||!l.inclusiveRight&&jt(u.to,s.to))&&c.push({from:s.to,to:u.to}),i.splice.apply(i,c),a+=c.length-1;
            }
          }return i;
        }function Pe(t,e){
          var r,n=Zn&&t.markedSpans;if(n)for(var i,o=0;o<n.length;++o)i=n[o],i.marker.collapsed&&(null==i.from||i.from<e)&&(null==i.to||i.to>e)&&(!r||r.width<i.marker.width)&&(r=i.marker);return r;
        }function Re(t){
          return Pe(t,-1);
        }function Be(t){
          return Pe(t,t.text.length+1);
        }function Ge(t,e){
          for(var r;r=Re(e);)e=dr(t,r.find().from.line);return e;
        }function Ve(t,e){
          var r=Zn&&e.markedSpans;if(r)for(var n,i=0;i<r.length;++i)if(n=r[i],n.marker.collapsed){
            if(null==n.from)return!0;if(!n.marker.replacedWith&&0==n.from&&n.marker.inclusiveLeft&&Ke(t,e,n))return!0;
          }
        }function Ke(t,e,r){
          if(null==r.to){
            var n=r.marker.find().to,i=dr(t,n.line);return Ke(t,i,He(i.markedSpans,r.marker));
          }if(r.marker.inclusiveRight&&r.to==e.text.length)return!0;for(var o,l=0;l<e.markedSpans.length;++l)if(o=e.markedSpans[l],o.marker.collapsed&&!o.marker.replacedWith&&o.from==r.to&&(o.marker.inclusiveLeft||r.marker.inclusiveRight)&&Ke(t,e,o))return!0;
        }function _e(t){
          var e=t.markedSpans;if(e){
            for(var r=0;r<e.length;++r)e[r].marker.detachLine(t);t.markedSpans=null;
          }
        }function Ue(t,e){
          if(e){
            for(var r=0;r<e.length;++r)e[r].marker.attachLine(t);t.markedSpans=e;
          }
        }function Xe(t){
          return function (){
            var e=!this.cm.curOp;e&&it(this.cm);try{
              var r=t.apply(this,arguments);
            }finally{
              e&&ot(this.cm);
            }return r;
          };
        }function Ye(t){
          return null!=t.height?t.height:(t.node.parentNode&&1==t.node.parentNode.nodeType||an(t.cm.display.measure,ln('div',[t.node],null,'position: relative')),t.height=t.node.offsetHeight);
        }function je(t,e,r,n){
          var i=new gi(t,r,n);return i.noHScroll&&(t.display.alignWidgets=!0),de(t,e,function (e){
            var r=e.widgets||(e.widgets=[]);if(null==i.insertAt?r.push(i):r.splice(Math.min(r.length-1,Math.max(0,i.insertAt)),0,i),i.line=e,!Ve(t.doc,e)||i.showIfHidden){
              var n=br(t,e)<t.doc.scrollTop;mr(e,e.height+Ye(i)),n&&fe(t,0,i.height);
            }return!0;
          }),i;
        }function $e(t,e,r,n){
          t.text=e,t.stateAfter&&(t.stateAfter=null),t.styles&&(t.styles=null),null!=t.order&&(t.order=null),_e(t),Ue(t,r);var i=n?n(t):1;i!=t.height&&mr(t,i);
        }function Ze(t){
          t.parent=null,_e(t);
        }function qe(t,e,r,n,i){
          var o=r.flattenSpans;null==o&&(o=t.options.flattenSpans);var l,s=0,a=null,u=new Se(e,t.options.tabSize);for(''==e&&r.blankLine&&r.blankLine(n);!u.eol();)u.pos>t.options.maxHighlightLength?(o=!1,u.pos=e.length,l=null):l=r.token(u,n),o&&a==l||(s<u.start&&i(u.start,a),s=u.start,a=l),u.start=u.pos;for(;s<u.pos;){
            var c=Math.min(u.pos,s+5e4);i(c,a),s=c;
          }
        }function Qe(t,e,r){
          var n=[t.state.modeGen];qe(t,e.text,t.doc.mode,r,function (t,e){
            n.push(t,e);
          });for(var i=0;i<t.state.overlays.length;++i){
            var o=t.state.overlays[i],l=1,s=0;qe(t,e.text,o.mode,!0,function (t,e){
              for(var r=l;s<t;){
                var i=n[l];i>t&&n.splice(l,1,t,n[l+1],i),l+=2,s=Math.min(t,i);
              }if(e)if(o.opaque)n.splice(r,l-r,t,e),l=r+2;else for(;r<l;r+=2){
                var a=n[r+1];n[r+1]=a?`${a} ${e}`:e;
              }
            });
          }return n;
        }function Je(t,e){
          return e.styles&&e.styles[0]==t.state.modeGen||(e.styles=Qe(t,e,e.stateAfter=z(t,vr(e)))),e.styles;
        }function tr(t,e,r){
          var n=t.doc.mode,i=new Se(e.text,t.options.tabSize);for(''==e.text&&n.blankLine&&n.blankLine(r);!i.eol()&&i.pos<=t.options.maxHighlightLength;)n.token(i,r),i.start=i.pos;
        }function er(t,e){
          if(!t)return null;for(;;){
            var r=t.match(/(?:^|\s)line-(background-)?(\S+)/);if(!r)break;t=t.slice(0,r.index)+t.slice(r.index+r[0].length);var n=r[1]?'bgClass':'textClass';null==e[n]?e[n]=r[2]:new RegExp(`(?:^|s)${r[2]}(?:$|s)`).test(e[n])||(e[n]+=` ${r[2]}`);
          }return vi[t]||(vi[t]=`cm-${t.replace(/ +/g,' cm-')}`);
        }function rr(t,e,r,n){
          for(var i,o=e,l=!0;i=Re(o);)o=dr(t.doc,i.find().from.line);var s={pre:ln('pre'),col:0,pos:0,measure:null,measuredSomething:!1,cm:t,copyWidgets:n};do{
            o.text&&(l=!1),s.measure=o==e&&r,s.pos=0,s.addToken=s.measure?ir:nr,(Tn||Hn)&&t.getOption('lineWrapping')&&(s.addToken=or(s.addToken));var a=sr(o,s,Je(t,o));r&&o==e&&!s.measuredSomething&&(r[0]=s.pre.appendChild(dn(t.display.measure)),s.measuredSomething=!0),a&&(o=dr(t.doc,a.to.line));
          }while(a);!r||s.measuredSomething||r[0]||(r[0]=s.pre.appendChild(l?ln('span',' '):dn(t.display.measure))),s.pre.firstChild||Ve(t.doc,e)||s.pre.appendChild(document.createTextNode(' '));var u;if(r&&Tn&&(u=xr(o))){
            var c=u.length-1;u[c].from==u[c].to&&--c;var f=u[c],h=u[c-1];if(f.from+1==f.to&&h&&f.level<h.level){
              var d=r[s.pos-1];d&&d.parentNode.insertBefore(d.measureRight=dn(t.display.measure),d.nextSibling);
            }
          }var p=s.textClass?`${s.textClass} ${e.textClass||''}`:e.textClass;return p&&(s.pre.className=p),Gr(t,'renderLine',t,e,s.pre),s;
        }function nr(t,e,r,n,i,o){
          if(e){
            if(yi.test(e))for(var l=document.createDocumentFragment(),s=0;;){
              yi.lastIndex=s;var a=yi.exec(e),u=a?a.index-s:e.length-s;if(u&&(l.appendChild(document.createTextNode(e.slice(s,s+u))),t.col+=u),!a)break;if(s+=u+1,'\t'==a[0]){
                var c=t.cm.options.tabSize,f=c-t.col%c;l.appendChild(ln('span',$r(f),'cm-tab')),t.col+=f;
              }else{
                var h=ln('span','•','cm-invalidchar');h.title=`\\u${a[0].charCodeAt(0).toString(16)}`,l.appendChild(h),t.col+=1;
              }
            }else{
              t.col+=e.length;var l=document.createTextNode(e);
            }if(r||n||i||t.measure){
              var d=r||'';n&&(d+=n),i&&(d+=i);var h=ln('span',[l],d);return o&&(h.title=o),t.pre.appendChild(h);
            }t.pre.appendChild(l);
          }
        }function ir(t,e,r,n,i){
          for(var o=t.cm.options.lineWrapping,l=0;l<e.length;++l){
            var s=e.charAt(l),a=0==l;s>='�'&&s<'�'&&l<e.length-1?(s=e.slice(l,l+2),++l):l&&o&&fn(e,l)&&t.pre.appendChild(ln('wbr'));var u=t.measure[t.pos],c=t.measure[t.pos]=nr(t,s,r,a&&n,l==e.length-1&&i);u&&(c.leftSide=u.leftSide||u),Tn&&o&&' '==s&&l&&!/\s/.test(e.charAt(l-1))&&l<e.length-1&&!/\s/.test(e.charAt(l+1))&&(c.style.whiteSpace='normal'),t.pos+=s.length;
          }e.length&&(t.measuredSomething=!0);
        }function or(t){
          function e(t){
            for(var e=' ',r=0;r<t.length-2;++r)e+=r%2?' ':' ';return e+=' ';
          }return function (r,n,i,o,l,s){
            return t(r,n.replace(/ {3,}/,e),i,o,l,s);
          };
        }function lr(t,e,r,n){
          var i=!n&&r.replacedWith;if(i&&(t.copyWidgets&&(i=i.cloneNode(!0)),t.pre.appendChild(i),t.measure)){
            if(e)t.measure[t.pos]=i;else{
              var o=dn(t.cm.display.measure);if('bookmark'!=r.type||r.insertLeft){
                if(t.measure[t.pos])return;t.measure[t.pos]=t.pre.insertBefore(o,i);
              }else t.measure[t.pos]=t.pre.appendChild(o);
            }t.measuredSomething=!0;
          }t.pos+=e;
        }function sr(t,e,r){
          var n=t.markedSpans,i=t.text,o=0;if(n)for(var l,s,a,u,c,f,h=i.length,d=0,p=1,g='',m=0;;){
            if(m==d){
              s=a=u=c='',f=null,m=1/0;for(var v=[],y=0;y<n.length;++y){
                var b=n[y],x=b.marker;b.from<=d&&(null==b.to||b.to>d)?(null!=b.to&&m>b.to&&(m=b.to,a=''),x.className&&(s+=` ${x.className}`),x.startStyle&&b.from==d&&(u+=` ${x.startStyle}`),x.endStyle&&b.to==m&&(a+=` ${x.endStyle}`),x.title&&!c&&(c=x.title),x.collapsed&&(!f||f.marker.size<x.size)&&(f=b)):b.from>d&&m>b.from&&(m=b.from),'bookmark'==x.type&&b.from==d&&x.replacedWith&&v.push(x);
              }if(f&&(f.from||0)==d&&(lr(e,(null==f.to?h:f.to)-d,f.marker,null==f.from),null==f.to))return f.marker.find();if(!f&&v.length)for(var y=0;y<v.length;++y)lr(e,0,v[y]);
            }if(d>=h)break;for(var C=Math.min(h,m);;){
              if(g){
                var w=d+g.length;if(!f){
                  var L=w>C?g.slice(0,C-d):g;e.addToken(e,L,l?l+s:s,u,d+L.length==m?a:'',c);
                }if(w>=C){
                  g=g.slice(C-d),d=C;break;
                }d=w,u='';
              }g=i.slice(o,o=r[p++]),l=er(r[p++],e);
            }
          }else for(var p=1;p<r.length;p+=2)e.addToken(e,i.slice(o,o=r[p]),er(r[p+1],e));
        }function ar(t,e,r,n,i){
          function o(t){
            return r?r[t]:null;
          }function l(t,r,n){
            $e(t,r,n,i),Vr(t,'change',t,e);
          }
          var s=e.from,a=e.to,u=e.text,c=dr(t,s.line),f=dr(t,a.line),h=Zr(u),d=o(u.length-1),p=a.line-s.line;if(0==s.ch&&0==a.ch&&''==h){
            for(var g=0,m=u.length-1,v=[];g<m;++g)v.push(new mi(u[g],o(g),i));l(f,f.text,d),p&&t.remove(s.line,p),v.length&&t.insert(s.line,v);
          }else if(c==f)if(1==u.length)l(c,c.text.slice(0,s.ch)+h+c.text.slice(a.ch),d);else{
            for(var v=[],g=1,m=u.length-1;g<m;++g)v.push(new mi(u[g],o(g),i));v.push(new mi(h+c.text.slice(a.ch),d,i)),l(c,c.text.slice(0,s.ch)+u[0],o(0)),t.insert(s.line+1,v);
          }else if(1==u.length)l(c,c.text.slice(0,s.ch)+u[0]+f.text.slice(a.ch),o(0)),t.remove(s.line+1,p);else{
            l(c,c.text.slice(0,s.ch)+u[0],o(0)),l(f,h+f.text.slice(a.ch),d);for(var g=1,m=u.length-1,v=[];g<m;++g)v.push(new mi(u[g],o(g),i));p>1&&t.remove(s.line+1,p-1),t.insert(s.line+1,v);
          }Vr(t,'change',t,e),ne(t,n.anchor,n.head,null,!0);
        }function ur(t){
          this.lines=t,this.parent=null;for(var e=0,r=t.length,n=0;e<r;++e)t[e].parent=this,n+=t[e].height;this.height=n;
        }function cr(t){
          this.children=t;for(var e=0,r=0,n=0,i=t.length;n<i;++n){
            var o=t[n];e+=o.chunkSize(),r+=o.height,o.parent=this;
          }this.size=e,this.height=r,this.parent=null;
        }function fr(t,e,r){
          function n(t,i,o){
            if(t.linked)for(var l=0;l<t.linked.length;++l){
              var s=t.linked[l];if(s.doc!=i){
                var a=o&&s.sharedHist;r&&!a||(e(s.doc,a),n(s.doc,t,a));
              }
            }
          }n(t,null,!0);
        }function hr(t,e){
          if(e.cm)throw new Error('This document is already in use.');t.doc=e,e.cm=t,o(t),r(t),t.options.lineWrapping||f(t),t.options.mode=e.modeOption,ut(t);
        }function dr(t,e){
          for(e-=t.first;!t.lines;)for(var r=0;;++r){
            var n=t.children[r],i=n.chunkSize();if(e<i){
              t=n;break;
            }e-=i;
          }return t.lines[e];
        }function pr(t,e,r){
          var n=[],i=e.line;return t.iter(e.line,r.line+1,function (t){
            var o=t.text;i==r.line&&(o=o.slice(0,r.ch)),i==e.line&&(o=o.slice(e.ch)),n.push(o),++i;
          }),n;
        }function gr(t,e,r){
          var n=[];return t.iter(e,r,function (t){
            n.push(t.text);
          }),n;
        }function mr(t,e){
          for(var r=e-t.height,n=t;n;n=n.parent)n.height+=r;
        }function vr(t){
          if(null==t.parent)return null;for(var e=t.parent,r=Qr(e.lines,t),n=e.parent;n;e=n,n=n.parent)for(var i=0;n.children[i]!=e;++i)r+=n.children[i].chunkSize();return r+e.first;
        }function yr(t,e){
          var r=t.first;t:do{
            for(var n=0,i=t.children.length;n<i;++n){
              var o=t.children[n],l=o.height;if(e<l){
                t=o;continue t;
              }e-=l,r+=o.chunkSize();
            }return r;
          }while(!t.lines);for(var n=0,i=t.lines.length;n<i;++n){
            var s=t.lines[n],a=s.height;if(e<a)break;e-=a;
          }return r+n;
        }function br(t,e){
          e=Ge(t.doc,e);for(var r=0,n=e.parent,i=0;i<n.lines.length;++i){
            var o=n.lines[i];if(o==e)break;r+=o.height;
          }for(var l=n.parent;l;n=l,l=n.parent)for(var i=0;i<l.children.length;++i){
            var s=l.children[i];if(s==n)break;r+=s.height;
          }return r;
        }function xr(t){
          var e=t.order;return null==e&&(e=t.order=Pi(t.text)),e;
        }function Cr(t){
          return{done:[],undone:[],undoDepth:1/0,lastTime:0,lastOp:null,lastOrigin:null,generation:t||1,maxGeneration:t||1};
        }function wr(t,e,r,n){
          var i=e[`spans_${t.id}`],o=0;t.iter(Math.max(t.first,r),Math.min(t.first+t.size,n),function (r){
            r.markedSpans&&((i||(i=e[`spans_${t.id}`]={}))[o]=r.markedSpans),++o;
          });
        }function Lr(t,e){
          var r={line:e.from.line,ch:e.from.ch},n={from:r,to:ii(e),text:pr(t,e.from,e.to)};return wr(t,n,e.from.line,e.to.line+1),fr(t,function (t){
            wr(t,n,e.from.line,e.to.line+1);
          },!0),n;
        }function kr(t,e,r,n){
          var i=t.history;i.undone.length=0;var o=+new Date,l=Zr(i.done);if(l&&(i.lastOp==n||i.lastOrigin==e.origin&&e.origin&&('+'==e.origin.charAt(0)&&t.cm&&i.lastTime>o-t.cm.options.historyEventDelay||'*'==e.origin.charAt(0)))){
            var s=Zr(l.changes);jt(e.from,e.to)&&jt(e.from,s.to)?s.to=ii(e):l.changes.push(Lr(t,e)),l.anchorAfter=r.anchor,l.headAfter=r.head;
          }else for(l={changes:[Lr(t,e)],generation:i.generation,anchorBefore:t.sel.anchor,headBefore:t.sel.head,anchorAfter:r.anchor,headAfter:r.head},i.done.push(l),i.generation=++i.maxGeneration;i.done.length>i.undoDepth;)i.done.shift();i.lastTime=o,i.lastOp=n,i.lastOrigin=e.origin;
        }function Sr(t){
          if(!t)return null;for(var e,r=0;r<t.length;++r)t[r].marker.explicitlyCleared?e||(e=t.slice(0,r)):e&&e.push(t[r]);return e?e.length?e:null:t;
        }function Mr(t,e){
          var r=e[`spans_${t.id}`];if(!r)return null;for(var n=0,i=[];n<e.text.length;++n)i.push(Sr(r[n]));return i;
        }function Tr(t,e){
          for(var r=0,n=[];r<t.length;++r){
            var i=t[r],o=i.changes,l=[];n.push({changes:l,anchorBefore:i.anchorBefore,headBefore:i.headBefore,anchorAfter:i.anchorAfter,headAfter:i.headAfter});for(var s=0;s<o.length;++s){
              var a,u=o[s];if(l.push({from:u.from,to:u.to,text:u.text}),e)for(var c in u)(a=c.match(/^spans_(\d+)$/))&&Qr(e,Number(a[1]))>-1&&(Zr(l)[c]=u[c],delete u[c]);
            }
          }return n;
        }function Ar(t,e,r,n){
          r<t.line?t.line+=n:e<t.line&&(t.line=e,t.ch=0);
        }function Nr(t,e,r,n){
          for(var i=0;i<t.length;++i){
            for(var o=t[i],l=!0,s=0;s<o.changes.length;++s){
              var a=o.changes[s];if(o.copied||(a.from=Zt(a.from),a.to=Zt(a.to)),r<a.from.line)a.from.line+=n,a.to.line+=n;else if(e<=a.to.line){
                l=!1;break;
              }
            }o.copied||(o.anchorBefore=Zt(o.anchorBefore),o.headBefore=Zt(o.headBefore),o.anchorAfter=Zt(o.anchorAfter),o.readAfter=Zt(o.headAfter),o.copied=!0),l?(Ar(o.anchorBefore),Ar(o.headBefore),Ar(o.anchorAfter),Ar(o.headAfter)):(t.splice(0,i+1),i=0);
          }
        }function Hr(t,e){
          var r=e.from.line,n=e.to.line,i=e.text.length-(n-r)-1;Nr(t.done,r,n,i),Nr(t.undone,r,n,i);
        }function Dr(){
          Ir(this);
        }function Wr(t){
          return t.stop||(t.stop=Dr),t;
        }function Or(t){
          t.preventDefault?t.preventDefault():t.returnValue=!1;
        }function Er(t){
          t.stopPropagation?t.stopPropagation():t.cancelBubble=!0;
        }function zr(t){
          return null!=t.defaultPrevented?t.defaultPrevented:0==t.returnValue;
        }function Ir(t){
          Or(t),Er(t);
        }function Fr(t){
          return t.target||t.srcElement;
        }function Pr(t){
          var e=t.which;return null==e&&(1&t.button?e=1:2&t.button?e=3:4&t.button&&(e=2)),Gn&&t.ctrlKey&&1==e&&(e=3),e;
        }function Rr(t,e,r){
          if(t.addEventListener)t.addEventListener(e,r,!1);else if(t.attachEvent)t.attachEvent(`on${e}`,r);else{
            var n=t._handlers||(t._handlers={}),i=n[e]||(n[e]=[]);i.push(r);
          }
        }function Br(t,e,r){
          if(t.removeEventListener)t.removeEventListener(e,r,!1);else if(t.detachEvent)t.detachEvent(`on${e}`,r);else{
            var n=t._handlers&&t._handlers[e];if(!n)return;for(var i=0;i<n.length;++i)if(n[i]==r){
              n.splice(i,1);break;
            }
          }
        }function Gr(t,e){
          var r=t._handlers&&t._handlers[e];if(r)for(var n=Array.prototype.slice.call(arguments,2),i=0;i<r.length;++i)r[i].apply(null,n);
        }function Vr(t,e){
          var r=t._handlers&&t._handlers[e];if(r){
            var n=Array.prototype.slice.call(arguments,2);Li||(++ki,Li=[],setTimeout(_r,0));for(var i=0;i<r.length;++i)Li.push(function (t){
              return function (){
                t.apply(null,n);
              };
            }(r[i]));
          }
        }function Kr(t,e,r){
          return Gr(t,r||e.type,t,e),zr(e)||e.codemirrorIgnore;
        }function _r(){
          --ki;var t=Li;Li=null;for(var e=0;e<t.length;++e)t[e]();
        }function Ur(t,e){
          var r=t._handlers&&t._handlers[e];return r&&r.length>0;
        }function Xr(t){
          t.prototype.on=function (t,e){
            Rr(this,t,e);
          },t.prototype.off=function (t,e){
            Br(this,t,e);
          };
        }function Yr(){
          this.id=null;
        }function jr(t,e,r,n,i){
          null==e&&-1==(e=t.search(/[^\s\u00a0]/))&&(e=t.length);for(var o=n||0,l=i||0;o<e;++o)'\t'==t.charAt(o)?l+=r-l%r:++l;return l;
        }function $r(t){
          for(;Ti.length<=t;)Ti.push(`${Zr(Ti)} `);return Ti[t];
        }function Zr(t){
          return t[t.length-1];
        }function qr(t){
          if(Rn)t.selectionStart=0,t.selectionEnd=t.value.length;else try{
            t.select();
          }catch(t){}
        }function Qr(t,e){
          if(t.indexOf)return t.indexOf(e);for(var r=0,n=t.length;r<n;++r)if(t[r]==e)return r;return-1;
        }function Jr(t,e){
          function r(){}r.prototype=t;var n=new r;return e&&tn(e,n),n;
        }function tn(t,e){
          e||(e={});for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e;
        }function en(t){
          for(var e=[],r=0;r<t;++r)e.push(void 0);return e;
        }function rn(t){
          var e=Array.prototype.slice.call(arguments,1);return function (){
            return t.apply(null,e);
          };
        }function nn(t){
          return/\w/.test(t)||t>''&&(t.toUpperCase()!=t.toLowerCase()||Ai.test(t));
        }function on(t){
          for(var e in t)if(t.hasOwnProperty(e)&&t[e])return!1;return!0;
        }function ln(t,e,r,n){
          var i=document.createElement(t);if(r&&(i.className=r),n&&(i.style.cssText=n),'string'==typeof e)un(i,e);else if(e)for(var o=0;o<e.length;++o)i.appendChild(e[o]);return i;
        }function sn(t){
          for(var e=t.childNodes.length;e>0;--e)t.removeChild(t.firstChild);return t;
        }function an(t,e){
          return sn(t).appendChild(e);
        }function un(t,e){
          Nn?(t.innerHTML='',t.appendChild(document.createTextNode(e))):t.textContent=e;
        }function cn(t){
          return t.getBoundingClientRect();
        }function fn(){
          return!1;
        }function hn(t){
          if(null!=Di)return Di;var e=ln('div',null,null,'width: 50px; height: 50px; overflow-x: scroll');return an(t,e),e.offsetWidth&&(Di=e.offsetHeight-e.clientHeight),Di||0;
        }function dn(t){
          if(null==Wi){
            var e=ln('span','​');an(t,ln('span',[e,document.createTextNode('x')])),0!=t.firstChild.offsetHeight&&(Wi=e.offsetWidth<=1&&e.offsetHeight>2&&!An);
          }return Wi?ln('span','​'):ln('span',' ',null,'display: inline-block; width: 1px; margin-right: -1px');
        }function pn(t,e,r,n){
          if(!t)return n(e,r,'ltr');for(var i=!1,o=0;o<t.length;++o){
            var l=t[o];(l.from<r&&l.to>e||e==r&&l.to==e)&&(n(Math.max(l.from,e),Math.min(l.to,r),1==l.level?'rtl':'ltr'),i=!0);
          }i||n(e,r,'ltr');
        }function gn(t){
          return t.level%2?t.to:t.from;
        }function mn(t){
          return t.level%2?t.from:t.to;
        }function vn(t){
          var e=xr(t);return e?gn(e[0]):0;
        }function yn(t){
          var e=xr(t);return e?mn(Zr(e)):t.text.length;
        }function bn(t,e){
          var r=dr(t.doc,e),n=Ge(t.doc,r);n!=r&&(e=vr(n));var i=xr(n);return Yt(e,i?i[0].level%2?yn(n):vn(n):0);
        }function xn(t,e){
          for(var r,n;r=Be(n=dr(t.doc,e));)e=r.find().to.line;var i=xr(n);return Yt(e,i?i[0].level%2?vn(n):yn(n):n.text.length);
        }function Cn(t,e,r){
          var n=t[0].level;return e==n||r!=n&&e<r;
        }function wn(t,e){
          for(var r,n=0;n<t.length;++n){
            var i=t[n];if(i.from<e&&i.to>e)return Fi=null,n;if(i.from==e||i.to==e){
              if(null!=r)return Cn(t,i.level,t[r].level)?(Fi=r,n):(Fi=n,r);r=n;
            }
          }return Fi=null,r;
        }function Ln(t,e,r,n){
          if(!n)return e+r;do{
            e+=r;
          }while(e>0&&Ni.test(t.text.charAt(e)));return e;
        }function kn(t,e,r,n){
          var i=xr(t);if(!i)return Sn(t,e,r,n);for(var o=wn(i,e),l=i[o],s=Ln(t,e,l.level%2?-r:r,n);;){
            if(s>l.from&&s<l.to)return s;if(s==l.from||s==l.to)return wn(i,s)==o?s:(l=i[o+=r],r>0==l.level%2?l.to:l.from);if(!(l=i[o+=r]))return null;s=r>0==l.level%2?Ln(t,l.to,-1,n):Ln(t,l.from,1,n);
          }
        }function Sn(t,e,r,n){
          var i=e+r;if(n)for(;i>0&&Ni.test(t.text.charAt(i));)i+=r;return i<0||i>t.text.length?null:i;
        }var Mn=/gecko\/\d/i.test(navigator.userAgent),Tn=/MSIE \d/.test(navigator.userAgent),An=Tn&&(null==document.documentMode||document.documentMode<8),Nn=Tn&&(null==document.documentMode||document.documentMode<9),Hn=/WebKit\//.test(navigator.userAgent),Dn=Hn&&/Qt\/\d+\.\d+/.test(navigator.userAgent),Wn=/Chrome\//.test(navigator.userAgent),On=/Opera\//.test(navigator.userAgent),En=/Apple Computer/.test(navigator.vendor),zn=/KHTML\//.test(navigator.userAgent),In=/Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent),Fn=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent),Pn=/PhantomJS/.test(navigator.userAgent),Rn=/AppleWebKit/.test(navigator.userAgent)&&/Mobile\/\w+/.test(navigator.userAgent),Bn=Rn||/Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),Gn=Rn||/Mac/.test(navigator.platform),Vn=/win/i.test(navigator.platform),Kn=On&&navigator.userAgent.match(/Version\/(\d*\.\d*)/);Kn&&(Kn=Number(Kn[1])),Kn&&Kn>=15&&(On=!1,Hn=!0);var _n,Un,Xn,Yn=Gn&&(Dn||On&&(null==Kn||Kn<12.11)),jn=Mn||Tn&&!Nn,$n=!1,Zn=!1,qn=0,Qn=0,Jn=0,ti=null;Tn?ti=-.53:Mn?ti=15:Wn?ti=-.7:En&&(ti=-1/3);var ei,ri,ni=null,ii=t.changeEnd=function (t){
          return t.text?Yt(t.from.line+t.text.length-1,Zr(t.text).length+(1==t.text.length?t.from.ch:0)):t.to;
        };t.Pos=Yt,t.prototype={constructor:t,focus:function (){
          window.focus(),pt(this),Et(this),ft(this);
        },setOption:function (t,e){
          var r=this.options,n=r[t];r[t]==e&&'mode'!=t||(r[t]=e,oi.hasOwnProperty(t)&&lt(this,oi[t])(this,e,n));
        },getOption:function (t){
          return this.options[t];
        },getDoc:function (){
          return this.doc;
        },addKeyMap:function (t,e){
          this.state.keyMaps[e?'push':'unshift'](t);
        },removeKeyMap:function (t){
          for(var e=this.state.keyMaps,r=0;r<e.length;++r)if(e[r]==t||'string'!=typeof e[r]&&e[r].name==t)return e.splice(r,1),!0;
        },addOverlay:lt(null,function (e,r){
          var n=e.token?e:t.getMode(this.options,e);if(n.startState)throw new Error('Overlays may not be stateful.');this.state.overlays.push({mode:n,modeSpec:e,opaque:r&&r.opaque}),this.state.modeGen++,ut(this);
        }),removeOverlay:lt(null,function (t){
          for(var e=this.state.overlays,r=0;r<e.length;++r){
            var n=e[r].modeSpec;if(n==t||'string'==typeof t&&n.name==t)return e.splice(r,1),this.state.modeGen++,void ut(this);
          }
        }),indentLine:lt(null,function (t,e,r){
          'string'!=typeof e&&'number'!=typeof e&&(e=null==e?this.options.smartIndent?'smart':'prev':e?'add':'subtract'),te(this.doc,t)&&he(this,t,e,r);
        }),indentSelection:lt(null,function (t){
          var e=this.doc.sel;if(jt(e.from,e.to))return he(this,e.from.line,t);for(var r=e.to.line-(e.to.ch?0:1),n=e.from.line;n<=r;++n)he(this,n,t);
        }),getTokenAt:function (t,e){
          var r=this.doc;t=Qt(r,t);for(var n=z(this,t.line,e),i=this.doc.mode,o=dr(r,t.line),l=new Se(o.text,this.options.tabSize);l.pos<t.ch&&!l.eol();){
            l.start=l.pos;var s=i.token(l,n);
          }return{start:l.start,end:l.pos,string:l.current(),className:s||null,type:s||null,state:n};
        },getTokenTypeAt:function (t){
          t=Qt(this.doc,t);var e=Je(this,dr(this.doc,t.line)),r=0,n=(e.length-1)/2,i=t.ch;if(0==i)return e[2];for(;;){
            var o=r+n>>1;if((o?e[2*o-1]:0)>=i)n=o;else{
              if(!(e[2*o+1]<i))return e[2*o+2];r=o+1;
            }
          }
        },getModeAt:function (e){
          var r=this.doc.mode;return r.innerMode?t.innerMode(r,this.getTokenAt(e).state).mode:r;
        },getHelper:function (t,e){
          if(hi.hasOwnProperty(e)){
            var r=hi[e],n=this.getModeAt(t);return n[e]&&r[n[e]]||n.helperType&&r[n.helperType]||r[n.name];
          }
        },getStateAfter:function (t,e){
          var r=this.doc;return t=qt(r,null==t?r.first+r.size-1:t),z(this,t+1,e);
        },cursorCoords:function (t,e){
          var r,n=this.doc.sel;return r=null==t?n.head:'object'==typeof t?Qt(this.doc,t):t?n.from:n.to,Q(this,r,e||'page');
        },charCoords:function (t,e){
          return q(this,Qt(this.doc,t),e||'page');
        },coordsChar:function (t,e){
          return t=Z(this,t,e||'page'),tt(this,t.left,t.top);
        },lineAtHeight:function (t,e){
          return t=Z(this,{top:t,left:0},e||'page').top,yr(this.doc,t+this.display.viewOffset);
        },heightAtLine:function (t,e){
          var r=!1,n=this.doc.first+this.doc.size-1;t<this.doc.first?t=this.doc.first:t>n&&(t=n,r=!0);var i=dr(this.doc,t);return $(this,dr(this.doc,t),{top:0,left:0},e||'page').top+(r?i.height:0);
        },defaultTextHeight:function (){
          return rt(this.display);
        },defaultCharWidth:function (){
          return nt(this.display);
        },setGutterMarker:lt(null,function (t,e,r){
          return de(this,t,function (t){
            var n=t.gutterMarkers||(t.gutterMarkers={});return n[e]=r,!r&&on(n)&&(t.gutterMarkers=null),!0;
          });
        }),clearGutter:lt(null,function (t){
          var e=this,r=e.doc,n=r.first;r.iter(function (r){
            r.gutterMarkers&&r.gutterMarkers[t]&&(r.gutterMarkers[t]=null,ut(e,n,n+1),on(r.gutterMarkers)&&(r.gutterMarkers=null)),++n;
          });
        }),addLineClass:lt(null,function (t,e,r){
          return de(this,t,function (t){
            var n='text'==e?'textClass':'background'==e?'bgClass':'wrapClass';if(t[n]){
              if(new RegExp(`(?:^|\\s)${r}(?:$|\\s)`).test(t[n]))return!1;t[n]+=` ${r}`;
            }else t[n]=r;return!0;
          });
        }),removeLineClass:lt(null,function (t,e,r){
          return de(this,t,function (t){
            var n='text'==e?'textClass':'background'==e?'bgClass':'wrapClass',i=t[n];if(!i)return!1;if(null==r)t[n]=null;else{
              var o=i.match(new RegExp(`(?:^|\\s+)${r}(?:$|\\s+)`));if(!o)return!1;var l=o.index+o[0].length;t[n]=i.slice(0,o.index)+(o.index&&l!=i.length?' ':'')+i.slice(l)||null;
            }return!0;
          });
        }),addLineWidget:lt(null,function (t,e,r){
          return je(this,t,e,r);
        }),removeLineWidget:function (t){
          t.clear();
        },lineInfo:function (t){
          if('number'==typeof t){
            if(!te(this.doc,t))return null;var e=t;if(!(t=dr(this.doc,t)))return null;
          }else{
            var e=vr(t);if(null==e)return null;
          }return{line:e,handle:t,text:t.text,gutterMarkers:t.gutterMarkers,textClass:t.textClass,bgClass:t.bgClass,wrapClass:t.wrapClass,widgets:t.widgets};
        },getViewport:function (){
          return{from:this.display.showingFrom,to:this.display.showingTo};
        },addWidget:function (t,e,r,n,i){
          var o=this.display;t=Q(this,Qt(this.doc,t));var l=t.bottom,s=t.left;if(e.style.position='absolute',o.sizer.appendChild(e),'over'==n)l=t.top;else if('above'==n||'near'==n){
            var a=Math.max(o.wrapper.clientHeight,this.doc.height),u=Math.max(o.sizer.clientWidth,o.lineSpace.clientWidth);('above'==n||t.bottom+e.offsetHeight>a)&&t.top>e.offsetHeight?l=t.top-e.offsetHeight:t.bottom+e.offsetHeight<=a&&(l=t.bottom),s+e.offsetWidth>u&&(s=u-e.offsetWidth);
          }e.style.top=`${l}px`,e.style.left=e.style.right='','right'==i?(s=o.sizer.clientWidth-e.offsetWidth,e.style.right='0px'):('left'==i?s=0:'middle'==i&&(s=(o.sizer.clientWidth-e.offsetWidth)/2),e.style.left=`${s}px`),r&&ae(this,s,l,s+e.offsetWidth,l+e.offsetHeight);
        },triggerOnKeyDown:lt(null,Wt),execCommand:function (t){
          return di[t](this);
        },findPosH:function (t,e,r,n){
          var i=1;e<0&&(i=-1,e=-e);for(var o=0,l=Qt(this.doc,t);o<e&&(l=pe(this.doc,l,i,r,n),!l.hitSide);++o);return l;
        },moveH:lt(null,function (t,e){
          var r,n=this.doc.sel;r=n.shift||n.extend||jt(n.from,n.to)?pe(this.doc,n.head,t,e,this.options.rtlMoveVisually):t<0?n.from:n.to,ee(this.doc,r,r,t);
        }),deleteH:lt(null,function (t,e){
          var r=this.doc.sel;jt(r.from,r.to)?Xt(this.doc,'',r.from,pe(this.doc,r.head,t,e,!1),'+delete'):Xt(this.doc,'',r.from,r.to,'+delete'),this.curOp.userSelChange=!0;
        }),findPosV:function (t,e,r,n){
          var i=1,o=n;e<0&&(i=-1,e=-e);for(var l=0,s=Qt(this.doc,t);l<e;++l){
            var a=Q(this,s,'div');if(null==o?o=a.left:a.left=o,s=ge(this,a,i,r),s.hitSide)break;
          }return s;
        },moveV:lt(null,function (t,e){
          var r=this.doc.sel,n=Q(this,r.head,'div');null!=r.goalColumn&&(n.left=r.goalColumn);var i=ge(this,n,t,e);'page'==e&&fe(this,0,q(this,i,'div').top-n.top),ee(this.doc,i,i,t),r.goalColumn=n.left;
        }),toggleOverwrite:function (t){
          null!=t&&t==this.state.overwrite||((this.state.overwrite=!this.state.overwrite)?this.display.cursor.className+=' CodeMirror-overwrite':this.display.cursor.className=this.display.cursor.className.replace(' CodeMirror-overwrite',''));
        },hasFocus:function (){
          return this.state.focused;
        },scrollTo:lt(null,function (t,e){
          ce(this,t,e);
        }),getScrollInfo:function (){
          var t=this.display.scroller,e=Si;return{left:t.scrollLeft,top:t.scrollTop,height:t.scrollHeight-e,width:t.scrollWidth-e,clientHeight:t.clientHeight-e,clientWidth:t.clientWidth-e};
        },scrollIntoView:lt(null,function (t,e){
          'number'==typeof t&&(t=Yt(t,0)),e||(e=0);var r=t;t&&null==t.line||(this.curOp.scrollToPos=t?Qt(this.doc,t):this.doc.sel.head,this.curOp.scrollToPosMargin=e,r=Q(this,this.curOp.scrollToPos));var n=ue(this,r.left,r.top-e,r.right,r.bottom+e);ce(this,n.scrollLeft,n.scrollTop);
        }),setSize:lt(null,function (t,e){
          function r(t){
            return'number'==typeof t||/^\d+$/.test(String(t))?`${t}px`:t;
          }null!=t&&(this.display.wrapper.style.width=r(t)),null!=e&&(this.display.wrapper.style.height=r(e)),this.options.lineWrapping&&(this.display.measureLineCache.length=this.display.measureLineCachePos=0),this.curOp.forceUpdate=!0;
        }),operation:function (t){
          return at(this,t);
        },refresh:lt(null,function (){
          var t=null==this.display.cachedTextHeight;X(this),ce(this,this.doc.scrollLeft,this.doc.scrollTop),ut(this),t&&o(this);
        }),swapDoc:lt(null,function (t){
          var e=this.doc;return e.cm=null,hr(this,t),X(this),dt(this,!0),ce(this,t.scrollLeft,t.scrollTop),e;
        }),getInputField:function (){
          return this.display.input;
        },getWrapperElement:function (){
          return this.display.wrapper;
        },getScrollerElement:function (){
          return this.display.scroller;
        },getGutterElement:function (){
          return this.display.gutters;
        }},Xr(t);var oi=t.optionHandlers={},li=t.defaults={},si=t.Init={toString:function (){
          return'CodeMirror.Init';
        }};ye('value','',function (t,e){
          t.setValue(e);
        },!0),ye('mode',null,function (t,e){
          t.doc.modeOption=e,r(t);
        },!0),ye('indentUnit',2,r,!0),ye('indentWithTabs',!1),ye('smartIndent',!0),ye('tabSize',4,function (t){
          r(t),X(t),ut(t);
        },!0),ye('electricChars',!0),ye('rtlMoveVisually',!Vn),ye('theme','default',function (t){
          s(t),a(t);
        },!0),ye('keyMap','default',l),ye('extraKeys',null),ye('onKeyEvent',null),ye('onDragEvent',null),ye('lineWrapping',!1,n,!0),ye('gutters',[],function (t){
          h(t.options),a(t);
        },!0),ye('fixedGutter',!0,function (t,e){
          t.display.gutters.style.left=e?`${y(t.display)}px`:'0',t.refresh();
        },!0),ye('coverGutterNextToScrollbar',!1,d,!0),ye('lineNumbers',!1,function (t){
          h(t.options),a(t);
        },!0),ye('firstLineNumber',1,a,!0),ye('lineNumberFormatter',function (t){
          return t;
        },a,!0),ye('showCursorWhenSelecting',!1,A,!0),ye('readOnly',!1,function (t,e){
          'nocursor'==e?(zt(t),t.display.input.blur()):e||dt(t,!0);
        }),ye('dragDrop',!0),ye('cursorBlinkRate',530),ye('cursorScrollMargin',0),ye('cursorHeight',1),ye('workTime',100),ye('workDelay',100),ye('flattenSpans',!0),ye('pollInterval',100),ye('undoDepth',40,function (t,e){
          t.doc.history.undoDepth=e;
        }),ye('historyEventDelay',500),ye('viewportMargin',10,function (t){
          t.refresh();
        },!0),ye('maxHighlightLength',1e4,function (t){
          r(t),t.refresh();
        },!0),ye('crudeMeasuringFrom',1e4),ye('moveInputWithCursor',!0,function (t,e){
          e||(t.display.inputDiv.style.top=t.display.inputDiv.style.left=0);
        }),ye('tabindex',null,function (t,e){
          t.display.input.tabIndex=e||'';
        }),ye('autofocus',null);var ai=t.modes={},ui=t.mimeModes={};t.defineMode=function (e,r){
          if(t.defaults.mode||'null'==e||(t.defaults.mode=e),arguments.length>2){
            r.dependencies=[];for(var n=2;n<arguments.length;++n)r.dependencies.push(arguments[n]);
          }ai[e]=r;
        },t.defineMIME=function (t,e){
          ui[t]=e;
        },t.resolveMode=function (e){
          if('string'==typeof e&&ui.hasOwnProperty(e))e=ui[e];else if(e&&'string'==typeof e.name&&ui.hasOwnProperty(e.name)){
            var r=ui[e.name];e=Jr(r,e),e.name=r.name;
          }else if('string'==typeof e&&/^[\w\-]+\/[\w\-]+\+xml$/.test(e))return t.resolveMode('application/xml');return'string'==typeof e?{name:e}:e||{name:'null'};
        },t.getMode=function (e,r){
          var r=t.resolveMode(r),n=ai[r.name];if(!n)return t.getMode(e,'text/plain');var i=n(e,r);if(ci.hasOwnProperty(r.name)){
            var o=ci[r.name];for(var l in o)o.hasOwnProperty(l)&&(i.hasOwnProperty(l)&&(i[`_${l}`]=i[l]),i[l]=o[l]);
          }return i.name=r.name,i;
        },t.defineMode('null',function (){
          return{token:function (t){
            t.skipToEnd();
          }};
        }),t.defineMIME('text/plain','null');var ci=t.modeExtensions={};t.extendMode=function (t,e){
          tn(e,ci.hasOwnProperty(t)?ci[t]:ci[t]={});
        },t.defineExtension=function (e,r){
          t.prototype[e]=r;
        },t.defineDocExtension=function (t,e){
          xi.prototype[t]=e;
        },t.defineOption=ye;var fi=[];t.defineInitHook=function (t){
          fi.push(t);
        };var hi=t.helpers={};t.registerHelper=function (e,r,n){
          hi.hasOwnProperty(e)||(hi[e]=t[e]={}),hi[e][r]=n;
        },t.isWordChar=nn,t.copyState=be,t.startState=xe,t.innerMode=function (t,e){
          for(;t.innerMode;){
            var r=t.innerMode(e);if(!r||r.mode==t)break;e=r.state,t=r.mode;
          }return r||{mode:t,state:e};
        };var di=t.commands={selectAll:function (t){
            t.setSelection(Yt(t.firstLine(),0),Yt(t.lastLine()));
          },killLine:function (t){
            var e=t.getCursor(!0),r=t.getCursor(!1),n=!jt(e,r);n||t.getLine(e.line).length!=e.ch?t.replaceRange('',e,n?r:Yt(e.line),'+delete'):t.replaceRange('',e,Yt(e.line+1,0),'+delete');
          },deleteLine:function (t){
            var e=t.getCursor().line;t.replaceRange('',Yt(e,0),Yt(e),'+delete');
          },delLineLeft:function (t){
            var e=t.getCursor();t.replaceRange('',Yt(e.line,0),e,'+delete');
          },undo:function (t){
            t.undo();
          },redo:function (t){
            t.redo();
          },goDocStart:function (t){
            t.extendSelection(Yt(t.firstLine(),0));
          },goDocEnd:function (t){
            t.extendSelection(Yt(t.lastLine()));
          },goLineStart:function (t){
            t.extendSelection(bn(t,t.getCursor().line));
          },goLineStartSmart:function (t){
            var e=t.getCursor(),r=bn(t,e.line),n=t.getLineHandle(r.line),i=xr(n);if(i&&0!=i[0].level)t.extendSelection(r);else{
              var o=Math.max(0,n.text.search(/\S/)),l=e.line==r.line&&e.ch<=o&&e.ch;t.extendSelection(Yt(r.line,l?0:o));
            }
          },goLineEnd:function (t){
            t.extendSelection(xn(t,t.getCursor().line));
          },goLineRight:function (t){
            var e=t.charCoords(t.getCursor(),'div').top+5;t.extendSelection(t.coordsChar({left:t.display.lineDiv.offsetWidth+100,top:e},'div'));
          },goLineLeft:function (t){
            var e=t.charCoords(t.getCursor(),'div').top+5;t.extendSelection(t.coordsChar({left:0,top:e},'div'));
          },goLineUp:function (t){
            t.moveV(-1,'line');
          },goLineDown:function (t){
            t.moveV(1,'line');
          },goPageUp:function (t){
            t.moveV(-1,'page');
          },goPageDown:function (t){
            t.moveV(1,'page');
          },goCharLeft:function (t){
            t.moveH(-1,'char');
          },goCharRight:function (t){
            t.moveH(1,'char');
          },goColumnLeft:function (t){
            t.moveH(-1,'column');
          },goColumnRight:function (t){
            t.moveH(1,'column');
          },goWordLeft:function (t){
            t.moveH(-1,'word');
          },goGroupRight:function (t){
            t.moveH(1,'group');
          },goGroupLeft:function (t){
            t.moveH(-1,'group');
          },goWordRight:function (t){
            t.moveH(1,'word');
          },delCharBefore:function (t){
            t.deleteH(-1,'char');
          },delCharAfter:function (t){
            t.deleteH(1,'char');
          },delWordBefore:function (t){
            t.deleteH(-1,'word');
          },delWordAfter:function (t){
            t.deleteH(1,'word');
          },delGroupBefore:function (t){
            t.deleteH(-1,'group');
          },delGroupAfter:function (t){
            t.deleteH(1,'group');
          },indentAuto:function (t){
            t.indentSelection('smart');
          },indentMore:function (t){
            t.indentSelection('add');
          },indentLess:function (t){
            t.indentSelection('subtract');
          },insertTab:function (t){
            t.replaceSelection('\t','end','+input');
          },defaultTab:function (t){
            t.somethingSelected()?t.indentSelection('add'):t.replaceSelection('\t','end','+input');
          },transposeChars:function (t){
            var e=t.getCursor(),r=t.getLine(e.line);e.ch>0&&e.ch<r.length-1&&t.replaceRange(r.charAt(e.ch)+r.charAt(e.ch-1),Yt(e.line,e.ch-1),Yt(e.line,e.ch+1));
          },newlineAndIndent:function (t){
            lt(t,function (){
              t.replaceSelection('\n','end','+input'),t.indentLine(t.getCursor().line,null,!0);
            })();
          },toggleOverwrite:function (t){
            t.toggleOverwrite();
          }},pi=t.keyMap={};pi.basic={Left:'goCharLeft',Right:'goCharRight',Up:'goLineUp',Down:'goLineDown',End:'goLineEnd',Home:'goLineStartSmart',PageUp:'goPageUp',PageDown:'goPageDown',Delete:'delCharAfter',Backspace:'delCharBefore',Tab:'defaultTab','Shift-Tab':'indentAuto',Enter:'newlineAndIndent',Insert:'toggleOverwrite'},pi.pcDefault={'Ctrl-A':'selectAll','Ctrl-D':'deleteLine','Ctrl-Z':'undo','Shift-Ctrl-Z':'redo','Ctrl-Y':'redo','Ctrl-Home':'goDocStart','Alt-Up':'goDocStart','Ctrl-End':'goDocEnd','Ctrl-Down':'goDocEnd','Ctrl-Left':'goGroupLeft','Ctrl-Right':'goGroupRight','Alt-Left':'goLineStart','Alt-Right':'goLineEnd','Ctrl-Backspace':'delGroupBefore','Ctrl-Delete':'delGroupAfter','Ctrl-S':'save','Ctrl-F':'find','Ctrl-G':'findNext','Shift-Ctrl-G':'findPrev','Shift-Ctrl-F':'replace','Shift-Ctrl-R':'replaceAll','Ctrl-[':'indentLess','Ctrl-]':'indentMore',fallthrough:'basic'},pi.macDefault={'Cmd-A':'selectAll','Cmd-D':'deleteLine','Cmd-Z':'undo','Shift-Cmd-Z':'redo','Cmd-Y':'redo','Cmd-Up':'goDocStart','Cmd-End':'goDocEnd','Cmd-Down':'goDocEnd','Alt-Left':'goGroupLeft','Alt-Right':'goGroupRight','Cmd-Left':'goLineStart','Cmd-Right':'goLineEnd','Alt-Backspace':'delGroupBefore','Ctrl-Alt-Backspace':'delGroupAfter','Alt-Delete':'delGroupAfter','Cmd-S':'save','Cmd-F':'find','Cmd-G':'findNext','Shift-Cmd-G':'findPrev','Cmd-Alt-F':'replace','Shift-Cmd-Alt-F':'replaceAll','Cmd-[':'indentLess','Cmd-]':'indentMore','Cmd-Backspace':'delLineLeft',fallthrough:['basic','emacsy']},pi.default=Gn?pi.macDefault:pi.pcDefault,pi.emacsy={'Ctrl-F':'goCharRight','Ctrl-B':'goCharLeft','Ctrl-P':'goLineUp','Ctrl-N':'goLineDown','Alt-F':'goWordRight','Alt-B':'goWordLeft','Ctrl-A':'goLineStart','Ctrl-E':'goLineEnd','Ctrl-V':'goPageDown','Shift-Ctrl-V':'goPageUp','Ctrl-D':'delCharAfter','Ctrl-H':'delCharBefore','Alt-D':'delWordAfter','Alt-Backspace':'delWordBefore','Ctrl-K':'killLine','Ctrl-T':'transposeChars'},t.lookupKey=we,t.isModifierKey=Le,t.keyName=ke,t.fromTextArea=function (e,r){
          function n(){
            e.value=a.getValue();
          }if(r||(r={}),r.value=e.value,!r.tabindex&&e.tabindex&&(r.tabindex=e.tabindex),!r.placeholder&&e.placeholder&&(r.placeholder=e.placeholder),null==r.autofocus){
            var i=document.body;try{
              i=document.activeElement;
            }catch(t){}r.autofocus=i==e||null!=e.getAttribute('autofocus')&&i==document.body;
          }if(e.form&&(Rr(e.form,'submit',n),!r.leaveSubmitMethodAlone)){
            var o=e.form,l=o.submit;try{
              var s=o.submit=function (){
                n(),o.submit=l,o.submit(),o.submit=s;
              };
            }catch(t){}
          }e.style.display='none';var a=t(function (t){
            e.parentNode.insertBefore(t,e.nextSibling);
          },r);return a.save=n,a.getTextArea=function (){
            return e;
          },a.toTextArea=function (){
            n(),e.parentNode.removeChild(a.getWrapperElement()),e.style.display='',e.form&&(Br(e.form,'submit',n),'function'==typeof e.form.submit&&(e.form.submit=l));
          },a;
        },Se.prototype={eol:function (){
          return this.pos>=this.string.length;
        },sol:function (){
          return 0==this.pos;
        },peek:function (){
          return this.string.charAt(this.pos)||void 0;
        },next:function (){
          if(this.pos<this.string.length)return this.string.charAt(this.pos++);
        },eat:function (t){
          var e=this.string.charAt(this.pos);if('string'==typeof t)var r=e==t;else var r=e&&(t.test?t.test(e):t(e));if(r)return++this.pos,e;
        },eatWhile:function (t){
          for(var e=this.pos;this.eat(t););return this.pos>e;
        },eatSpace:function (){
          for(var t=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>t;
        },skipToEnd:function (){
          this.pos=this.string.length;
        },skipTo:function (t){
          var e=this.string.indexOf(t,this.pos);if(e>-1)return this.pos=e,!0;
        },backUp:function (t){
          this.pos-=t;
        },column:function (){
          return this.lastColumnPos<this.start&&(this.lastColumnValue=jr(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start),this.lastColumnValue;
        },indentation:function (){
          return jr(this.string,null,this.tabSize);
        },match:function (t,e,r){
          if('string'!=typeof t){
            var n=this.string.slice(this.pos).match(t);return n&&n.index>0?null:(n&&!1!==e&&(this.pos+=n[0].length),n);
          }var i=function (t){
            return r?t.toLowerCase():t;
          };if(i(this.string.substr(this.pos,t.length))==i(t))return!1!==e&&(this.pos+=t.length),!0;
        },current:function (){
          return this.string.slice(this.start,this.pos);
        }},t.StringStream=Se,t.TextMarker=Me,Xr(Me),Me.prototype.clear=function (){
          if(!this.explicitlyCleared){
            var t=this.doc.cm,e=t&&!t.curOp;if(e&&it(t),Ur(this,'clear')){
              var r=this.find();r&&Vr(this,'clear',r.from,r.to);
            }for(var n=null,i=null,o=0;o<this.lines.length;++o){
              var l=this.lines[o],s=He(l.markedSpans,this);null!=s.to&&(i=vr(l)),l.markedSpans=De(l.markedSpans,s),null!=s.from?n=vr(l):this.collapsed&&!Ve(this.doc,l)&&t&&mr(l,rt(t.display));
            }if(t&&this.collapsed&&!t.options.lineWrapping)for(var o=0;o<this.lines.length;++o){
              var a=Ge(t.doc,this.lines[o]),u=c(t.doc,a);u>t.display.maxLineLength&&(t.display.maxLine=a,t.display.maxLineLength=u,t.display.maxLineChanged=!0);
            }null!=n&&t&&ut(t,n,i+1),this.lines.length=0,this.explicitlyCleared=!0,this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,t&&ie(t)),e&&ot(t);
          }
        },Me.prototype.find=function (){
          for(var t,e,r=0;r<this.lines.length;++r){
            var n=this.lines[r],i=He(n.markedSpans,this);if(null!=i.from||null!=i.to){
              var o=vr(n);null!=i.from&&(t=Yt(o,i.from)),null!=i.to&&(e=Yt(o,i.to));
            }
          }return'bookmark'==this.type?t:t&&{from:t,to:e};
        },Me.prototype.changed=function (){
          var t=this.find(),e=this.doc.cm;if(t&&e){
            'bookmark'!=this.type&&(t=t.from);var r=dr(this.doc,t.line);if(G(e,r),t.line>=e.display.showingFrom&&t.line<e.display.showingTo){
              for(var n=e.display.lineDiv.firstChild;n;n=n.nextSibling)if(n.lineObj==r){
                n.offsetHeight!=r.height&&mr(r,n.offsetHeight);break;
              }at(e,function (){
                e.curOp.selectionChanged=e.curOp.forceUpdate=e.curOp.updateMaxLine=!0;
              });
            }
          }
        },Me.prototype.attachLine=function (t){
          if(!this.lines.length&&this.doc.cm){
            var e=this.doc.cm.curOp;e.maybeHiddenMarkers&&-1!=Qr(e.maybeHiddenMarkers,this)||(e.maybeUnhiddenMarkers||(e.maybeUnhiddenMarkers=[])).push(this);
          }this.lines.push(t);
        },Me.prototype.detachLine=function (t){
          if(this.lines.splice(Qr(this.lines,t),1),!this.lines.length&&this.doc.cm){
            var e=this.doc.cm.curOp;(e.maybeHiddenMarkers||(e.maybeHiddenMarkers=[])).push(this);
          }
        },t.SharedTextMarker=Ae,Xr(Ae),Ae.prototype.clear=function (){
          if(!this.explicitlyCleared){
            this.explicitlyCleared=!0;for(var t=0;t<this.markers.length;++t)this.markers[t].clear();Vr(this,'clear');
          }
        },Ae.prototype.find=function (){
          return this.primary.find();
        };var gi=t.LineWidget=function (t,e,r){
          if(r)for(var n in r)r.hasOwnProperty(n)&&(this[n]=r[n]);this.cm=t,this.node=e;
        };Xr(gi),gi.prototype.clear=Xe(function (){
          var t=this.line.widgets,e=vr(this.line);if(null!=e&&t){
            for(var r=0;r<t.length;++r)t[r]==this&&t.splice(r--,1);t.length||(this.line.widgets=null);var n=br(this.cm,this.line)<this.cm.doc.scrollTop;mr(this.line,Math.max(0,this.line.height-Ye(this))),n&&fe(this.cm,0,-this.height),
            ut(this.cm,e,e+1);
          }
        }),gi.prototype.changed=Xe(function (){
          var t=this.height;this.height=null;var e=Ye(this)-t;if(e){
            mr(this.line,this.line.height+e);var r=vr(this.line);ut(this.cm,r,r+1);
          }
        });var mi=t.Line=function (t,e,r){
          this.text=t,Ue(this,e),this.height=r?r(this):1;
        };Xr(mi);var vi={},yi=/[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\uFEFF]/g;ur.prototype={chunkSize:function (){
          return this.lines.length;
        },removeInner:function (t,e){
          for(var r=t,n=t+e;r<n;++r){
            var i=this.lines[r];this.height-=i.height,Ze(i),Vr(i,'delete');
          }this.lines.splice(t,e);
        },collapse:function (t){
          t.splice.apply(t,[t.length,0].concat(this.lines));
        },insertInner:function (t,e,r){
          this.height+=r,this.lines=this.lines.slice(0,t).concat(e).concat(this.lines.slice(t));for(var n=0,i=e.length;n<i;++n)e[n].parent=this;
        },iterN:function (t,e,r){
          for(var n=t+e;t<n;++t)if(r(this.lines[t]))return!0;
        }},cr.prototype={chunkSize:function (){
          return this.size;
        },removeInner:function (t,e){
          this.size-=e;for(var r=0;r<this.children.length;++r){
            var n=this.children[r],i=n.chunkSize();if(t<i){
              var o=Math.min(e,i-t),l=n.height;if(n.removeInner(t,o),this.height-=l-n.height,i==o&&(this.children.splice(r--,1),n.parent=null),0==(e-=o))break;t=0;
            }else t-=i;
          }if(this.size-e<25){
            var s=[];this.collapse(s),this.children=[new ur(s)],this.children[0].parent=this;
          }
        },collapse:function (t){
          for(var e=0,r=this.children.length;e<r;++e)this.children[e].collapse(t);
        },insertInner:function (t,e,r){
          this.size+=e.length,this.height+=r;for(var n=0,i=this.children.length;n<i;++n){
            var o=this.children[n],l=o.chunkSize();if(t<=l){
              if(o.insertInner(t,e,r),o.lines&&o.lines.length>50){
                for(;o.lines.length>50;){
                  var s=o.lines.splice(o.lines.length-25,25),a=new ur(s);o.height-=a.height,this.children.splice(n+1,0,a),a.parent=this;
                }this.maybeSpill();
              }break;
            }t-=l;
          }
        },maybeSpill:function (){
          if(!(this.children.length<=10)){
            var t=this;do{
              var e=t.children.splice(t.children.length-5,5),r=new cr(e);if(t.parent){
                t.size-=r.size,t.height-=r.height;var n=Qr(t.parent.children,t);t.parent.children.splice(n+1,0,r);
              }else{
                var i=new cr(t.children);i.parent=t,t.children=[i,r],t=i;
              }r.parent=t.parent;
            }while(t.children.length>10);t.parent.maybeSpill();
          }
        },iterN:function (t,e,r){
          for(var n=0,i=this.children.length;n<i;++n){
            var o=this.children[n],l=o.chunkSize();if(t<l){
              var s=Math.min(e,l-t);if(o.iterN(t,s,r))return!0;if(0==(e-=s))break;t=0;
            }else t-=l;
          }
        }};var bi=0,xi=t.Doc=function (t,e,r){
          if(!(this instanceof xi))return new xi(t,e,r);null==r&&(r=0),cr.call(this,[new ur([new mi('',null)])]),this.first=r,this.scrollTop=this.scrollLeft=0,this.cantEdit=!1,this.history=Cr(),this.cleanGeneration=1,this.frontier=r;var n=Yt(r,0);this.sel={from:n,to:n,head:n,anchor:n,shift:!1,extend:!1,goalColumn:null},this.id=++bi,this.modeOption=e,'string'==typeof t&&(t=Oi(t)),ar(this,{from:n,to:n,text:t},null,{head:n,anchor:n});
        };xi.prototype=Jr(cr.prototype,{constructor:xi,iter:function (t,e,r){
          r?this.iterN(t-this.first,e-t,r):this.iterN(this.first,this.first+this.size,t);
        },insert:function (t,e){
          for(var r=0,n=0,i=e.length;n<i;++n)r+=e[n].height;this.insertInner(t-this.first,e,r);
        },remove:function (t,e){
          this.removeInner(t-this.first,e);
        },getValue:function (t){
          var e=gr(this,this.first,this.first+this.size);return!1===t?e:e.join(t||'\n');
        },setValue:function (t){
          var e=Yt(this.first,0),r=this.first+this.size-1;Bt(this,{from:e,to:Yt(r,dr(this,r).text.length),text:Oi(t),origin:'setValue'},{head:e,anchor:e},!0);
        },replaceRange:function (t,e,r,n){
          e=Qt(this,e),r=r?Qt(this,r):e,Xt(this,t,e,r,n);
        },getRange:function (t,e,r){
          var n=pr(this,Qt(this,t),Qt(this,e));return!1===r?n:n.join(r||'\n');
        },getLine:function (t){
          var e=this.getLineHandle(t);return e&&e.text;
        },setLine:function (t,e){
          te(this,t)&&Xt(this,e,Yt(t,0),Qt(this,Yt(t)));
        },removeLine:function (t){
          t?Xt(this,'',Qt(this,Yt(t-1)),Qt(this,Yt(t))):Xt(this,'',Yt(0,0),Qt(this,Yt(1,0)));
        },getLineHandle:function (t){
          if(te(this,t))return dr(this,t);
        },getLineNumber:function (t){
          return vr(t);
        },getLineHandleVisualStart:function (t){
          return'number'==typeof t&&(t=dr(this,t)),Ge(this,t);
        },lineCount:function (){
          return this.size;
        },firstLine:function (){
          return this.first;
        },lastLine:function (){
          return this.first+this.size-1;
        },clipPos:function (t){
          return Qt(this,t);
        },getCursor:function (t){
          var e,r=this.sel;return e=null==t||'head'==t?r.head:'anchor'==t?r.anchor:'end'==t||!1===t?r.to:r.from,Zt(e);
        },somethingSelected:function (){
          return!jt(this.sel.head,this.sel.anchor);
        },setCursor:st(function (t,e,r){
          var n=Qt(this,'number'==typeof t?Yt(t,e||0):t);r?ee(this,n):ne(this,n,n);
        }),setSelection:st(function (t,e,r){
          ne(this,Qt(this,t),Qt(this,e||t),r);
        }),extendSelection:st(function (t,e,r){
          ee(this,Qt(this,t),e&&Qt(this,e),r);
        }),getSelection:function (t){
          return this.getRange(this.sel.from,this.sel.to,t);
        },replaceSelection:function (t,e,r){
          Bt(this,{from:this.sel.from,to:this.sel.to,text:Oi(t),origin:r},e||'around');
        },undo:st(function (){
          Vt(this,'undo');
        }),redo:st(function (){
          Vt(this,'redo');
        }),setExtending:function (t){
          this.sel.extend=t;
        },historySize:function (){
          var t=this.history;return{undo:t.done.length,redo:t.undone.length};
        },clearHistory:function (){
          this.history=Cr(this.history.maxGeneration);
        },markClean:function (){
          this.cleanGeneration=this.changeGeneration();
        },changeGeneration:function (){
          return this.history.lastOp=this.history.lastOrigin=null,this.history.generation;
        },isClean:function (t){
          return this.history.generation==(t||this.cleanGeneration);
        },getHistory:function (){
          return{done:Tr(this.history.done),undone:Tr(this.history.undone)};
        },setHistory:function (t){
          var e=this.history=Cr(this.history.maxGeneration);e.done=t.done.slice(0),e.undone=t.undone.slice(0);
        },markText:function (t,e,r){
          return Te(this,Qt(this,t),Qt(this,e),r,'range');
        },setBookmark:function (t,e){
          var r={replacedWith:e&&(null==e.nodeType?e.widget:e),insertLeft:e&&e.insertLeft};return t=Qt(this,t),Te(this,t,t,r,'bookmark');
        },findMarksAt:function (t){
          t=Qt(this,t);var e=[],r=dr(this,t.line).markedSpans;if(r)for(var n=0;n<r.length;++n){
            var i=r[n];(null==i.from||i.from<=t.ch)&&(null==i.to||i.to>=t.ch)&&e.push(i.marker.parent||i.marker);
          }return e;
        },getAllMarks:function (){
          var t=[];return this.iter(function (e){
            var r=e.markedSpans;if(r)for(var n=0;n<r.length;++n)null!=r[n].from&&t.push(r[n].marker);
          }),t;
        },posFromIndex:function (t){
          var e,r=this.first;return this.iter(function (n){
            var i=n.text.length+1;if(i>t)return e=t,!0;t-=i,++r;
          }),Qt(this,Yt(r,e));
        },indexFromPos:function (t){
          t=Qt(this,t);var e=t.ch;return t.line<this.first||t.ch<0?0:(this.iter(this.first,t.line,function (t){
            e+=t.text.length+1;
          }),e);
        },copy:function (t){
          var e=new xi(gr(this,this.first,this.first+this.size),this.modeOption,this.first);return e.scrollTop=this.scrollTop,e.scrollLeft=this.scrollLeft,e.sel={from:this.sel.from,to:this.sel.to,head:this.sel.head,anchor:this.sel.anchor,shift:this.sel.shift,extend:!1,goalColumn:this.sel.goalColumn},t&&(e.history.undoDepth=this.history.undoDepth,e.setHistory(this.getHistory())),e;
        },linkedDoc:function (t){
          t||(t={});var e=this.first,r=this.first+this.size;null!=t.from&&t.from>e&&(e=t.from),null!=t.to&&t.to<r&&(r=t.to);var n=new xi(gr(this,e,r),t.mode||this.modeOption,e);return t.sharedHist&&(n.history=this.history),(this.linked||(this.linked=[])).push({doc:n,sharedHist:t.sharedHist}),n.linked=[{doc:this,isParent:!0,sharedHist:t.sharedHist}],n;
        },unlinkDoc:function (e){
          if(e instanceof t&&(e=e.doc),this.linked)for(var r=0;r<this.linked.length;++r){
            var n=this.linked[r];if(n.doc==e){
              this.linked.splice(r,1),e.unlinkDoc(this);break;
            }
          }if(e.history==this.history){
            var i=[e.id];fr(e,function (t){
              i.push(t.id);
            },!0),e.history=Cr(),e.history.done=Tr(this.history.done,i),e.history.undone=Tr(this.history.undone,i);
          }
        },iterLinkedDocs:function (t){
          fr(this,t);
        },getMode:function (){
          return this.mode;
        },getEditor:function (){
          return this.cm;
        }}),xi.prototype.eachLine=xi.prototype.iter;var Ci='iter insert remove copy getEditor'.split(' ');for(var wi in xi.prototype)xi.prototype.hasOwnProperty(wi)&&Qr(Ci,wi)<0&&(t.prototype[wi]=function (t){
          return function (){
            return t.apply(this.doc,arguments);
          };
        }(xi.prototype[wi]));Xr(xi),t.e_stop=Ir,t.e_preventDefault=Or,t.e_stopPropagation=Er;var Li,ki=0;t.on=Rr,t.off=Br,t.signal=Gr;var Si=30,Mi=t.Pass={toString:function (){
          return'CodeMirror.Pass';
        }};Yr.prototype={set:function (t,e){
          clearTimeout(this.id),this.id=setTimeout(e,t);
        }},t.countColumn=jr;var Ti=[''],Ai=/[\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,Ni=/[\u0300-\u036F\u0483-\u0487\u0488-\u0489\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\uA66F\uA670-\uA672\uA674-\uA67D\uA69F\udc00-\udfff]/;t.replaceGetRect=function (t){
          cn=t;
        };var Hi=function (){
          if(Nn)return!1;var t=ln('div');return'draggable'in t||'dragDrop'in t;
        }();Mn?fn=function (t,e){
          return 36==t.charCodeAt(e-1)&&39==t.charCodeAt(e);
        }:En&&!/Version\/([6-9]|\d\d)\b/.test(navigator.userAgent)?fn=function (t,e){
          return/\-[^ \-?]|\?[^ !\'\"\),.\-\/:;\?\]\}]/.test(t.slice(e-1,e+1));
        }:Hn&&/Chrome\/(?:29|[3-9]\d|\d\d\d)\./.test(navigator.userAgent)?fn=function (t,e){
          var r=t.charCodeAt(e-1);return r>=8208&&r<=8212;
        }:Hn&&(fn=function (t,e){
          if(e>1&&45==t.charCodeAt(e-1)){
            if(/\w/.test(t.charAt(e-2))&&/[^\-?\.]/.test(t.charAt(e)))return!0;if(e>2&&/[\d\.,]/.test(t.charAt(e-2))&&/[\d\.,]/.test(t.charAt(e)))return!1;
          }return/[~!#%&*)=+}\]\\|\"\.>,:;][({[<]|-[^\-?\.\u2010-\u201f\u2026]|\?[\w~`@#$%\^&*(_=+{[|><]|…[\w~`@#$%\^&*(_=+{[><]/.test(t.slice(e-1,e+1));
        });var Di,Wi,Oi=3!='\n\nb'.split(/\n/).length?function (t){
          for(var e=0,r=[],n=t.length;e<=n;){
            var i=t.indexOf('\n',e);-1==i&&(i=t.length);var o=t.slice(e,'\r'==t.charAt(i-1)?i-1:i),l=o.indexOf('\r');-1!=l?(r.push(o.slice(0,l)),e+=l+1):(r.push(o),e=i+1);
          }return r;
        }:function (t){
          return t.split(/\r\n?|\n/);
        };t.splitLines=Oi;var Ei=window.getSelection?function (t){
            try{
              return t.selectionStart!=t.selectionEnd;
            }catch(t){
              return!1;
            }
          }:function (t){
            try{
              var e=t.ownerDocument.selection.createRange();
            }catch(t){}return!(!e||e.parentElement()!=t)&&0!=e.compareEndPoints('StartToEnd',e);
          },zi=function (){
            var t=ln('div');return'oncopy'in t||(t.setAttribute('oncopy','return;'),'function'==typeof t.oncopy);
          }(),Ii={3:'Enter',8:'Backspace',9:'Tab',13:'Enter',16:'Shift',17:'Ctrl',18:'Alt',19:'Pause',20:'CapsLock',27:'Esc',32:'Space',33:'PageUp',34:'PageDown',35:'End',36:'Home',37:'Left',38:'Up',39:'Right',40:'Down',44:'PrintScrn',45:'Insert',46:'Delete',59:';',91:'Mod',92:'Mod',93:'Mod',109:'-',107:'=',127:'Delete',186:';',187:'=',188:',',189:'-',190:'.',191:'/',192:'`',219:'[',220:'\\',221:']',222:'\'',63276:'PageUp',63277:'PageDown',63275:'End',63273:'Home',63234:'Left',63232:'Up',63235:'Right',63233:'Down',63302:'Insert',63272:'Delete'};t.keyNames=Ii,function (){
          for(var t=0;t<10;t++)Ii[t+48]=String(t);for(var t=65;t<=90;t++)Ii[t]=String.fromCharCode(t);for(var t=1;t<=12;t++)Ii[t+111]=Ii[t+63235]=`F${t}`;
        }();var Fi,Pi=function (){
          function t(t){
            return t<=255?e.charAt(t):1424<=t&&t<=1524?'R':1536<=t&&t<=1791?r.charAt(t-1536):1792<=t&&t<=2220?'r':'L';
          }var e='bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLL',r='rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmmrrrrrrrrrrrrrrrrrr',n=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,i=/[stwN]/,o=/[LRr]/,l=/[Lb1n]/,s=/[1n]/;return function (e){
            if(!n.test(e))return!1;for(var r,a=e.length,u=[],c=0;c<a;++c)u.push(r=t(e.charCodeAt(c)));for(var c=0,f='L';c<a;++c){
              var r=u[c];'m'==r?u[c]=f:f=r;
            }for(var c=0,h='L';c<a;++c){
              var r=u[c];'1'==r&&'r'==h?u[c]='n':o.test(r)&&(h=r,'r'==r&&(u[c]='R'));
            }for(var c=1,f=u[0];c<a-1;++c){
              var r=u[c];'+'==r&&'1'==f&&'1'==u[c+1]?u[c]='1':','!=r||f!=u[c+1]||'1'!=f&&'n'!=f||(u[c]=f),f=r;
            }for(var c=0;c<a;++c){
              var r=u[c];if(','==r)u[c]='N';else if('%'==r){
                for(var d=c+1;d<a&&'%'==u[d];++d);for(var p=c&&'!'==u[c-1]||d<a-1&&'1'==u[d]?'1':'N',g=c;g<d;++g)u[g]=p;c=d-1;
              }
            }for(var c=0,h='L';c<a;++c){
              var r=u[c];'L'==h&&'1'==r?u[c]='L':o.test(r)&&(h=r);
            }for(var c=0;c<a;++c)if(i.test(u[c])){
              for(var d=c+1;d<a&&i.test(u[d]);++d);for(var m='L'==(c?u[c-1]:'L'),v='L'==(d<a-1?u[d]:'L'),p=m||v?'L':'R',g=c;g<d;++g)u[g]=p;c=d-1;
            }for(var y,b=[],c=0;c<a;)if(l.test(u[c])){
              var x=c;for(++c;c<a&&l.test(u[c]);++c);b.push({from:x,to:c,level:0});
            }else{
              var C=c,w=b.length;for(++c;c<a&&'L'!=u[c];++c);for(var g=C;g<c;)if(s.test(u[g])){
                C<g&&b.splice(w,0,{from:C,to:g,level:1});var L=g;for(++g;g<c&&s.test(u[g]);++g);b.splice(w,0,{from:L,to:g,level:2}),C=g;
              }else++g;C<c&&b.splice(w,0,{from:C,to:c,level:1});
            }return 1==b[0].level&&(y=e.match(/^\s+/))&&(b[0].from=y[0].length,b.unshift({from:0,to:y[0].length,level:0})),1==Zr(b).level&&(y=e.match(/\s+$/))&&(Zr(b).to-=y[0].length,b.push({from:a-y[0].length,to:a,level:0})),b[0].level!=Zr(b).level&&b.push({from:a,to:a,level:b[0].level}),b;
          };
        }();return t.version='3.18.0',t;
      }(),i('undefined'!=typeof CodeMirror?CodeMirror:window.CodeMirror);
    }).call(global,void 0,void 0,void 0,void 0,function (t){
      module.exports=t;
    });
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{}],113:[function (require,module,exports){
  (function (global){
    CodeMirror=global.CodeMirror=require('/Users/ilya/maintained/strider/vendor/CodeMirror/js/codemirror.js');var __browserify_shim_require__=require;(function (e,t,r){
      CodeMirror.defineMode('shell',function (){
        function e(e,t){
          for(var r=t.split(' '),n=0;n<r.length;n++)i[r[n]]=e;
        }function t(e,t){
          var s=e.sol(),u=e.next();if('\''===u||'"'===u||'`'===u)return t.tokens.unshift(r(u)),n(e,t);if('#'===u)return s&&e.eat('!')?(e.skipToEnd(),'meta'):(e.skipToEnd(),'comment');if('$'===u)return t.tokens.unshift(o),n(e,t);if('+'===u||'='===u)return'operator';if('-'===u)return e.eat('-'),e.eatWhile(/\w/),'attribute';if(/\d/.test(u)&&(e.eatWhile(/\d/),!/\w/.test(e.peek())))return'number';e.eatWhile(/[\w-]/);var l=e.current();return'='===e.peek()&&/\w+/.test(l)?'def':i.hasOwnProperty(l)?i[l]:null;
        }function r(e){
          return function (t,r){
            for(var n,i=!1,s=!1;null!=(n=t.next());){
              if(n===e&&!s){
                i=!0;break;
              }if('$'===n&&!s&&'\''!==e){
                s=!0,t.backUp(1),r.tokens.unshift(o);break;
              }s=!s&&'\\'===n;
            }return!i&&s||r.tokens.shift(),'`'===e||')'===e?'quote':'string';
          };
        }function n(e,r){
          return(r.tokens[0]||t)(e,r);
        }var i={};e('atom','true false'),e('keyword','if then do else elif while until for in esac fi fin fil done exit set unset export function'),e('builtin','ab awk bash beep cat cc cd chown chmod chroot clear cp curl cut diff echo find gawk gcc get git grep kill killall ln ls make mkdir openssl mv nc node npm ping ps restart rm rmdir sed service sh shopt shred source sort sleep ssh start stop su sudo tee telnet top touch vi vim wall wc wget who write yes zsh');var o=function (e,t){
          t.tokens.length>1&&e.eat('$');var i=e.next(),o=/\w/;return'{'===i&&(o=/[^}]/),'('===i?(t.tokens[0]=r(')'),n(e,t)):(/\d/.test(i)||(e.eatWhile(o),e.eat('}')),t.tokens.shift(),'def');
        };return{startState:function (){
          return{tokens:[]};
        },token:function (e,t){
          return e.eatSpace()?null:n(e,t);
        }};
      }),CodeMirror.defineMIME('text/x-sh','shell');
    }).call(global,module,void 0,void 0);
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'/Users/ilya/maintained/strider/vendor/CodeMirror/js/codemirror.js':112}],114:[function (require,module,exports){
  (function (global){
    var __browserify_shim_require__=require;(function (t,e,o,n,i){
      !function (e){
        'use strict';'function'==typeof n&&n.amd?n(e):void 0!==t&&void 0!==t.exports?t.exports=e():window.Sortable=e();
      }(function (){
        'use strict';function t(t,o){
          this.el=t,this.options=o=o||{},o.group=o.group||Math.random(),o.store=o.store||null,o.handle=o.handle||null,o.draggable=o.draggable||t.children[0]&&t.children[0].nodeName||(/[uo]l/i.test(t.nodeName)?'li':'*'),o.ghostClass=o.ghostClass||'sortable-ghost',o.ignore=o.ignore||'a, img','onAdd onUpdate onRemove onStart onEnd'.split(' ').forEach(function (t){
            o[t]=e(this,o[t]||O);
          }),t[b]=o.group;for(var n in this)'_'===n.charAt(0)&&(this[n]=e(this,this[n]));i(t,'add',o.onAdd),i(t,'update',o.onUpdate),i(t,'remove',o.onRemove),i(t,'start',o.onStart),i(t,'stop',o.onEnd),i(t,'mousedown',this._onTapStart),i(t,'touchstart',this._onTapStart),N&&i(t,'selectstart',this._onTapStart),i(t,'dragover',this._onDragOver),i(t,'dragenter',this._onDragOver),Y.push(this._onDragOver),o.store&&this.sort(o.store.get(this));
        }function e(t,e){
          var o=R.call(arguments,2);return e.bind?e.bind.apply(e,[t].concat(o)):function (){
            return e.apply(t,o.concat(R.call(arguments)));
          };
        }function o(t,e,o){
          if('*'===e)return t;if(t){
            o=o||T,e=e.split('.');var n=e.shift().toUpperCase(),i=new RegExp(`\\s(${e.join('|')})\\s`,'g');do{
              if(!(''!==n&&t.nodeName!=n||e.length&&((` ${t.className} `).match(i)||[]).length!=e.length))return t;
            }while(t!==o&&(t=t.parentNode));
          }return null;
        }function n(t){
          t.dataTransfer.dropEffect='move',t.preventDefault();
        }function i(t,e,o){
          t.addEventListener(e,o,!1);
        }function r(t,e,o){
          t.removeEventListener(e,o,!1);
        }function a(t,e,o){
          if(t)if(t.classList)t.classList[o?'add':'remove'](e);else{
            var n=(` ${t.className} `).replace(/\s+/g,' ').replace(` ${e} `,'');t.className=n+(o?` ${e}`:'');
          }
        }function s(t,e,o){
          if(t&&t.style){
            if(void 0===o)return T.defaultView&&T.defaultView.getComputedStyle?o=T.defaultView.getComputedStyle(t,''):t.currentStyle&&(o=t.currentStyle),void 0===e?o:o[e];t.style[e]=o+('string'==typeof o?'':'px');
          }
        }function l(t,e,o){
          if(t){
            var n=t.getElementsByTagName(e),i=0,r=n.length;if(o)for(;i<r;i++)o(n[i],i);return n;
          }return[];
        }function h(t){
          return t.draggable=!1;
        }function d(){
          x=!1;
        }function c(t,e){
          var o=t.lastElementChild.getBoundingClientRect();return e.clientY-(o.top+o.height)>5;
        }function p(t){
          for(var e=t.innerHTML+t.className+t.src,o=e.length,n=0;o--;)n+=e.charCodeAt(o);return n.toString(36);
        }var u,f,g,v,m,_,D,E,S,y,b=`Sortable${(new Date).getTime()}`,w=window,T=w.document,C=w.parseInt,N=!!T.createElement('div').dragDrop,x=!1,A=function (t,e){
            var o=T.createEvent('Event');return o.initEvent(t,!0,!0),o.item=e,o;
          },O=function (){},R=[].slice,Y=[];return t.prototype={constructor:t,_applyEffects:function (){
          a(u,this.options.ghostClass,!0);
        },_onTapStart:function (t){
          var e=t.touches&&t.touches[0],r=(e||t).target,a=this.options,s=this.el;if(a.handle&&(r=o(r,a.handle,s)),r=o(r,a.draggable,s),r&&'selectstart'==t.type&&'A'!=r.tagName&&'IMG'!=r.tagName&&r.dragDrop(),r&&!u&&r.parentNode===s){
            S=t,g=this.el,u=r,v=u.nextSibling,E=this.options.group,u.draggable=!0,a.ignore.split(',').forEach(function (t){
              l(r,t.trim(),h);
            }),e&&(S={target:r,clientX:e.clientX,clientY:e.clientY},this._onDragStart(S,!0),t.preventDefault()),i(T,'mouseup',this._onDrop),i(T,'touchend',this._onDrop),i(T,'touchcancel',this._onDrop),i(this.el,'dragstart',this._onDragStart),i(this.el,'dragend',this._onDrop),i(T,'dragover',n);try{
              T.selection?T.selection.empty():window.getSelection().removeAllRanges();
            }catch(t){}u.dispatchEvent(A('start',u));
          }
        },_emulateDragOver:function (){
          if(y){
            s(f,'display','none');var t=T.elementFromPoint(y.clientX,y.clientY),e=t,o=this.options.group,n=Y.length;if(e)do{
              if(e[b]===o){
                for(;n--;)Y[n]({clientX:y.clientX,clientY:y.clientY,target:t,rootEl:e});break;
              }t=e;
            }while(e=e.parentNode);s(f,'display','');
          }
        },_onTouchMove:function (t){
          if(S){
            var e=t.touches[0],o=e.clientX-S.clientX,n=e.clientY-S.clientY,i=`translate3d(${o}px,${n}px,0)`;y=e,s(f,'webkitTransform',i),s(f,'mozTransform',i),s(f,'msTransform',i),s(f,'transform',i),t.preventDefault();
          }
        },_onDragStart:function (t,e){
          var o=t.dataTransfer;if(this._offUpEvents(),e){
            var n,r=u.getBoundingClientRect(),a=s(u);f=u.cloneNode(!0),s(f,'top',r.top-C(a.marginTop,10)),s(f,'left',r.left-C(a.marginLeft,10)),s(f,'width',r.width),s(f,'height',r.height),s(f,'opacity','0.8'),s(f,'position','fixed'),s(f,'zIndex','100000'),g.appendChild(f),n=f.getBoundingClientRect(),s(f,'width',2*r.width-n.width),s(f,'height',2*r.height-n.height),i(T,'touchmove',this._onTouchMove),i(T,'touchend',this._onDrop),i(T,'touchcancel',this._onDrop),this._loopId=setInterval(this._emulateDragOver,150);
          }else o.effectAllowed='move',o.setData('Text',u.textContent),i(T,'drop',this._onDrop);setTimeout(this._applyEffects);
        },_onDragOver:function (t){
          if(!x&&E===this.options.group&&(void 0===t.rootEl||t.rootEl===this.el)){
            var e=this.el,n=o(t.target,this.options.draggable,e);if(0===e.children.length||e.children[0]===f||e===t.target&&c(e,t))e.appendChild(u);else if(n&&n!==u&&void 0!==n.parentNode[b]){
              m!==n&&(m=n,_=s(n),D=n.getBoundingClientRect());var i,r=D,a=r.right-r.left,l=r.bottom-r.top,h=/left|right|inline/.test(_.cssFloat+_.display),p=n.offsetWidth>u.offsetWidth,g=n.offsetHeight>u.offsetHeight,v=(h?(t.clientX-r.left)/a:(t.clientY-r.top)/l)>.5,S=n.nextElementSibling;x=!0,setTimeout(d,30),i=h?n.previousElementSibling===u&&!p||v&&p:S!==u&&!g||v&&g,i&&!S?e.appendChild(u):n.parentNode.insertBefore(u,i?S:n);
            }
          }
        },_offUpEvents:function (){
          r(T,'mouseup',this._onDrop),r(T,'touchmove',this._onTouchMove),r(T,'touchend',this._onDrop),r(T,'touchcancel',this._onDrop);
        },_onDrop:function (t){
          clearInterval(this._loopId),r(T,'drop',this._onDrop),r(T,'dragover',n),r(this.el,'dragend',this._onDrop),r(this.el,'dragstart',this._onDragStart),r(this.el,'selectstart',this._onTapStart),this._offUpEvents(),t&&(t.preventDefault(),t.stopPropagation(),f&&f.parentNode.removeChild(f),u&&(h(u),a(u,this.options.ghostClass,!1),g.contains(u)?u.nextSibling!==v&&u.dispatchEvent(A('update',u)):(g.dispatchEvent(A('remove',u)),u.dispatchEvent(A('add',u))),u.dispatchEvent(A('stop',u))),g=u=f=v=S=y=m=_=E=null,this.options.store&&this.options.store.set(this));
        },toArray:function (){
          for(var t,e=[],o=this.el.children,n=0,i=o.length;n<i;n++)t=o[n],e.push(t.getAttribute('data-id')||p(t));return e;
        },sort:function (t){
          var e={},o=this.el;this.toArray().forEach(function (t,n){
            e[t]=o.children[n];
          }),t.forEach(function (t){
            e[t]&&(o.removeChild(e[t]),o.appendChild(e[t]));
          });
        },destroy:function (){
          var t=this.el,e=this.options;r(t,'add',e.onAdd),r(t,'update',e.onUpdate),r(t,'remove',e.onRemove),r(t,'start',e.onStart),r(t,'stop',e.onEnd),r(t,'mousedown',this._onTapStart),r(t,'touchstart',this._onTapStart),r(t,'selectstart',this._onTapStart),r(t,'dragover',this._onDragOver),r(t,'dragenter',this._onDragOver),Array.prototype.forEach.call(t.querySelectorAll('[draggable]'),function (t){
            t.removeAttribute('draggable');
          }),Y.splice(Y.indexOf(this._onDragOver),1),this._onDrop(),this.el=null;
        }},t.utils={on:i,off:r,css:s,find:l,bind:e,closest:o,toggleClass:a},t.version='0.4.1',t;
      }),i('undefined'!=typeof Sortable?Sortable:window.Sortable);
    }).call(global,void 0,void 0,void 0,void 0,function (t){
      module.exports=t;
    });
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{}],115:[function (require,module,exports){
  (function (global){
    var __browserify_shim_require__=require;(function (e,n,o,a,t){
      var r=window.bootbox||function (e,n){
        function o(e,n){
          return void 0===n&&(n=a),'string'==typeof u[n][e]?u[n][e]:n!=t?o(e,t):e;
        }var a='en',t='en',r=!0,c='static',l='',i={},s={},d={};d.setLocale=function (e){
          for(var n in u)if(n==e)return void(a=e);throw new Error(`Invalid locale: ${e}`);
        },d.addLocale=function (e,n){
          void 0===u[e]&&(u[e]={});for(var o in n)u[e][o]=n[o];
        },d.setIcons=function (e){
          'object'==typeof(s=e)&&null!==s||(s={});
        },d.setBtnClasses=function (e){
          'object'==typeof(i=e)&&null!==i||(i={});
        },d.alert=function (){
          var e='',n=o('OK'),a=null;switch(arguments.length){
          case 1:e=arguments[0];break;case 2:e=arguments[0],'function'==typeof arguments[1]?a=arguments[1]:n=arguments[1];break;case 3:e=arguments[0],n=arguments[1],a=arguments[2];break;default:throw new Error('Incorrect number of arguments: expected 1-3');
          }return d.dialog(e,{label:n,icon:s.OK,class:i.OK,callback:a},{onEscape:a||!0});
        },d.confirm=function (){
          var e='',n=o('CANCEL'),a=o('CONFIRM'),t=null;switch(arguments.length){
          case 1:e=arguments[0];break;case 2:e=arguments[0],'function'==typeof arguments[1]?t=arguments[1]:n=arguments[1];break;case 3:e=arguments[0],n=arguments[1],'function'==typeof arguments[2]?t=arguments[2]:a=arguments[2];break;case 4:e=arguments[0],n=arguments[1],a=arguments[2],t=arguments[3];break;default:throw new Error('Incorrect number of arguments: expected 1-4');
          }var r=function (){
              if('function'==typeof t)return t(!1);
            },c=function (){
              if('function'==typeof t)return t(!0);
            };return d.dialog(e,[{label:n,icon:s.CANCEL,class:i.CANCEL,callback:r},{label:a,icon:s.CONFIRM,class:i.CONFIRM,callback:c}],{onEscape:r});
        },d.prompt=function (){
          var e='',a=o('CANCEL'),t=o('CONFIRM'),r=null,c='';switch(arguments.length){
          case 1:e=arguments[0];break;case 2:e=arguments[0],'function'==typeof arguments[1]?r=arguments[1]:a=arguments[1];break;case 3:e=arguments[0],a=arguments[1],'function'==typeof arguments[2]?r=arguments[2]:t=arguments[2];break;case 4:e=arguments[0],a=arguments[1],t=arguments[2],r=arguments[3];break;case 5:e=arguments[0],a=arguments[1],t=arguments[2],r=arguments[3],c=arguments[4];break;default:throw new Error('Incorrect number of arguments: expected 1-5');
          }var l=e,u=n('<form></form>');u.append(`<input class='input-block-level' autocomplete=off type=text value='${c}' />`);var f=function (){
              if('function'==typeof r)return r(null);
            },b=function (){
              if('function'==typeof r)return r(u.find('input[type=text]').val());
            },p=d.dialog(u,[{label:a,icon:s.CANCEL,class:i.CANCEL,callback:f},{label:t,icon:s.CONFIRM,class:i.CONFIRM,callback:b}],{header:l,show:!1,onEscape:f});return p.on('shown',function (){
            u.find('input[type=text]').focus(),u.on('submit',function (e){
              e.preventDefault(),p.find('.btn-primary').click();
            });
          }),p.modal('show'),p;
        },d.dialog=function (o,a,t){
          function i(e){
            var n=null;'function'==typeof t.onEscape&&(n=t.onEscape()),!1!==n&&w.modal('hide');
          }var s='',d=[];t||(t={}),void 0===a?a=[]:void 0===a.length&&(a=[a]);for(var u=a.length;u--;){
            var f=null,b=null,p=null,C='',v=null;if(void 0===a[u].label&&void 0===a[u].class&&void 0===a[u].callback){
              var h=0,O=null;for(var m in a[u])if(O=m,++h>1)break;1==h&&'function'==typeof a[u][m]&&(a[u].label=O,a[u].callback=a[u][m]);
            }'function'==typeof a[u].callback&&(v=a[u].callback),a[u].class?p=a[u].class:u==a.length-1&&a.length<=2&&(p='btn-primary'),!0!==a[u].link&&(p=`btn ${p}`),f=a[u].label?a[u].label:`Option ${u+1}`,a[u].icon&&(C=`<i class='${a[u].icon}'></i> `),b=a[u].href?a[u].href:'javascript:;',s=`<a data-handler='${u}' class='${p}' href='${b}'>${C}${f}</a>${s}`,d[u]=v;
          }var k=['<div class=\'bootbox modal\' tabindex=\'-1\' style=\'overflow:hidden;\'>'];if(t.header){
            var N='';(void 0===t.headerCloseButton||t.headerCloseButton)&&(N='<a href=\'javascript:;\' class=\'close\'>&times;</a>'),k.push(`<div class='modal-header'>${N}<h3>${t.header}</h3></div>`);
          }k.push('<div class=\'modal-body\'></div>'),s&&k.push(`<div class='modal-footer'>${s}</div>`),k.push('</div>');var w=n(k.join('\n'));(void 0===t.animate?r:t.animate)&&w.addClass('fade');var y=void 0===t.classes?l:t.classes;return y&&w.addClass(y),w.find('.modal-body').html(o),w.on('keyup.dismiss.modal',function (e){
            27===e.which&&t.onEscape&&i('escape');
          }),w.on('click','a.close',function (e){
            e.preventDefault(),i('close');
          }),w.on('shown',function (){
            w.find('a.btn-primary:first').focus();
          }),w.on('hidden',function (e){
            e.target===this&&w.remove();
          }),w.on('click','.modal-footer a',function (e){
            var o=n(this).data('handler'),t=d[o],r=null;void 0!==o&&void 0!==a[o].href||(e.preventDefault(),'function'==typeof t&&(r=t(e)),!1!==r&&w.modal('hide'));
          }),n('body').append(w),w.modal({backdrop:void 0===t.backdrop?c:t.backdrop,keyboard:!1,show:!1}),w.on('show',function (o){
            n(e).off('focusin.modal');
          }),void 0!==t.show&&!0!==t.show||w.modal('show'),w;
        },d.modal=function (){
          var e,o,a,t={onEscape:null,keyboard:!0,backdrop:c};switch(arguments.length){
          case 1:e=arguments[0];break;case 2:e=arguments[0],'object'==typeof arguments[1]?a=arguments[1]:o=arguments[1];break;case 3:e=arguments[0],o=arguments[1],a=arguments[2];break;default:throw new Error('Incorrect number of arguments: expected 1-3');
          }return t.header=o,a='object'==typeof a?n.extend(t,a):t,d.dialog(e,[],a);
        },d.hideAll=function (){
          n('.bootbox').modal('hide');
        },d.animate=function (e){
          r=e;
        },d.backdrop=function (e){
          c=e;
        },d.classes=function (e){
          l=e;
        };var u={br:{OK:'OK',CANCEL:'Cancelar',CONFIRM:'Sim'},da:{OK:'OK',CANCEL:'Annuller',CONFIRM:'Accepter'},de:{OK:'OK',CANCEL:'Abbrechen',CONFIRM:'Akzeptieren'},en:{OK:'OK',CANCEL:'Cancel',CONFIRM:'OK'},es:{OK:'OK',CANCEL:'Cancelar',CONFIRM:'Aceptar'},fr:{OK:'OK',CANCEL:'Annuler',CONFIRM:'D\'accord'},it:{OK:'OK',CANCEL:'Annulla',CONFIRM:'Conferma'},nl:{OK:'OK',CANCEL:'Annuleren',CONFIRM:'Accepteren'},pl:{OK:'OK',CANCEL:'Anuluj',CONFIRM:'Potwierdź'},ru:{OK:'OK',CANCEL:'Отмена',CONFIRM:'Применить'},zh_CN:{OK:'OK',CANCEL:'取消',CONFIRM:'确认'},zh_TW:{OK:'OK',CANCEL:'取消',CONFIRM:'確認'}};return d;
      }(document,window.jQuery);window.bootbox=r,t(void 0!==r?r:window.bootbox);
    }).call(global,void 0,void 0,void 0,void 0,function (e){
      module.exports=e;
    });
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{}],116:[function (require,module,exports){
  (function (global){
    jQuery=global.jQuery=require('jquery');var __browserify_shim_require__=require;(function (t,e,i){
      !function (t){
        'use strict';t(function (){
          t.support.transition=function (){
            var t=function (){
              var t,e=document.createElement('bootstrap'),i={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'};for(t in i)if(void 0!==e.style[t])return i[t];
            }();return t&&{end:t};
          }();
        });
      }(window.jQuery),function (t){
        'use strict';var e='[data-dismiss="alert"]',i=function (i){
          t(i).on('click',e,this.close);
        };i.prototype.close=function (e){
          function i(){
            n.trigger('closed').remove();
          }var n,s=t(this),o=s.attr('data-target');o||(o=s.attr('href'),o=o&&o.replace(/.*(?=#[^\s]*$)/,'')),n=t(o),e&&e.preventDefault(),n.length||(n=s.hasClass('alert')?s:s.parent()),n.trigger(e=t.Event('close')),e.isDefaultPrevented()||(n.removeClass('in'),t.support.transition&&n.hasClass('fade')?n.on(t.support.transition.end,i):i());
        };var n=t.fn.alert;t.fn.alert=function (e){
          return this.each(function (){
            var n=t(this),s=n.data('alert');s||n.data('alert',s=new i(this)),'string'==typeof e&&s[e].call(n);
          });
        },t.fn.alert.Constructor=i,t.fn.alert.noConflict=function (){
          return t.fn.alert=n,this;
        },t(document).on('click.alert.data-api',e,i.prototype.close);
      }(window.jQuery),function (t){
        'use strict';var e=function (e,i){
          this.$element=t(e),this.options=t.extend({},t.fn.button.defaults,i);
        };e.prototype.setState=function (t){
          var e='disabled',i=this.$element,n=i.data(),s=i.is('input')?'val':'html';t+='Text',n.resetText||i.data('resetText',i[s]()),i[s](n[t]||this.options[t]),setTimeout(function (){
            'loadingText'==t?i.addClass(e).attr(e,e):i.removeClass(e).removeAttr(e);
          },0);
        },e.prototype.toggle=function (){
          var t=this.$element.closest('[data-toggle="buttons-radio"]');t&&t.find('.active').removeClass('active'),this.$element.toggleClass('active');
        };var i=t.fn.button;t.fn.button=function (i){
          return this.each(function (){
            var n=t(this),s=n.data('button'),o='object'==typeof i&&i;s||n.data('button',s=new e(this,o)),'toggle'==i?s.toggle():i&&s.setState(i);
          });
        },t.fn.button.defaults={loadingText:'loading...'},t.fn.button.Constructor=e,t.fn.button.noConflict=function (){
          return t.fn.button=i,this;
        },t(document).on('click.button.data-api','[data-toggle^=button]',function (e){
          var i=t(e.target);i.hasClass('btn')||(i=i.closest('.btn')),i.button('toggle');
        });
      }(window.jQuery),function (t){
        'use strict';var e=function (e,i){
          this.$element=t(e),this.$indicators=this.$element.find('.carousel-indicators'),this.options=i,'hover'==this.options.pause&&this.$element.on('mouseenter',t.proxy(this.pause,this)).on('mouseleave',t.proxy(this.cycle,this));
        };e.prototype={cycle:function (e){
          return e||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(t.proxy(this.next,this),this.options.interval)),this;
        },getActiveIndex:function (){
          return this.$active=this.$element.find('.item.active'),this.$items=this.$active.parent().children(),this.$items.index(this.$active);
        },to:function (e){
          var i=this.getActiveIndex(),n=this;if(!(e>this.$items.length-1||e<0))return this.sliding?this.$element.one('slid',function (){
            n.to(e);
          }):i==e?this.pause().cycle():this.slide(e>i?'next':'prev',t(this.$items[e]));
        },pause:function (e){
          return e||(this.paused=!0),this.$element.find('.next, .prev').length&&t.support.transition.end&&(this.$element.trigger(t.support.transition.end),this.cycle(!0)),clearInterval(this.interval),this.interval=null,this;
        },next:function (){
          if(!this.sliding)return this.slide('next');
        },prev:function (){
          if(!this.sliding)return this.slide('prev');
        },slide:function (e,i){
          var n,s=this.$element.find('.item.active'),o=i||s[e](),a=this.interval,r='next'==e?'left':'right',h='next'==e?'first':'last',l=this;if(this.sliding=!0,a&&this.pause(),o=o.length?o:this.$element.find('.item')[h](),n=t.Event('slide',{relatedTarget:o[0],direction:r}),!o.hasClass('active')){
            if(this.$indicators.length&&(this.$indicators.find('.active').removeClass('active'),this.$element.one('slid',function (){
              var e=t(l.$indicators.children()[l.getActiveIndex()]);e&&e.addClass('active');
            })),t.support.transition&&this.$element.hasClass('slide')){
              if(this.$element.trigger(n),n.isDefaultPrevented())return;o.addClass(e),o[0].offsetWidth,s.addClass(r),o.addClass(r),this.$element.one(t.support.transition.end,function (){
                o.removeClass([e,r].join(' ')).addClass('active'),s.removeClass(['active',r].join(' ')),l.sliding=!1,setTimeout(function (){
                  l.$element.trigger('slid');
                },0);
              });
            }else{
              if(this.$element.trigger(n),n.isDefaultPrevented())return;s.removeClass('active'),o.addClass('active'),this.sliding=!1,this.$element.trigger('slid');
            }return a&&this.cycle(),this;
          }
        }};var i=t.fn.carousel;t.fn.carousel=function (i){
          return this.each(function (){
            var n=t(this),s=n.data('carousel'),o=t.extend({},t.fn.carousel.defaults,'object'==typeof i&&i),a='string'==typeof i?i:o.slide;s||n.data('carousel',s=new e(this,o)),'number'==typeof i?s.to(i):a?s[a]():o.interval&&s.pause().cycle();
          });
        },t.fn.carousel.defaults={interval:5e3,pause:'hover'},t.fn.carousel.Constructor=e,t.fn.carousel.noConflict=function (){
          return t.fn.carousel=i,this;
        },t(document).on('click.carousel.data-api','[data-slide], [data-slide-to]',function (e){
          var i,n,s=t(this),o=t(s.attr('data-target')||(i=s.attr('href'))&&i.replace(/.*(?=#[^\s]+$)/,'')),a=t.extend({},o.data(),s.data());o.carousel(a),(n=s.attr('data-slide-to'))&&o.data('carousel').pause().to(n).cycle(),e.preventDefault();
        });
      }(window.jQuery),function (t){
        'use strict';var e=function (e,i){
          this.$element=t(e),this.options=t.extend({},t.fn.collapse.defaults,i),this.options.parent&&(this.$parent=t(this.options.parent)),this.options.toggle&&this.toggle();
        };e.prototype={constructor:e,dimension:function (){
          return this.$element.hasClass('width')?'width':'height';
        },show:function (){
          var e,i,n,s;if(!this.transitioning&&!this.$element.hasClass('in')){
            if(e=this.dimension(),i=t.camelCase(['scroll',e].join('-')),(n=this.$parent&&this.$parent.find('> .accordion-group > .in'))&&n.length){
              if((s=n.data('collapse'))&&s.transitioning)return;n.collapse('hide'),s||n.data('collapse',null);
            }this.$element[e](0),this.transition('addClass',t.Event('show'),'shown'),t.support.transition&&this.$element[e](this.$element[0][i]);
          }
        },hide:function (){
          var e;!this.transitioning&&this.$element.hasClass('in')&&(e=this.dimension(),this.reset(this.$element[e]()),this.transition('removeClass',t.Event('hide'),'hidden'),this.$element[e](0));
        },reset:function (t){
          var e=this.dimension();return this.$element.removeClass('collapse')[e](t||'auto')[0].offsetWidth,this.$element[null!==t?'addClass':'removeClass']('collapse'),this;
        },transition:function (e,i,n){
          var s=this,o=function (){
            'show'==i.type&&s.reset(),s.transitioning=0,s.$element.trigger(n);
          };this.$element.trigger(i),i.isDefaultPrevented()||(this.transitioning=1,this.$element[e]('in'),t.support.transition&&this.$element.hasClass('collapse')?this.$element.one(t.support.transition.end,o):o());
        },toggle:function (){
          this[this.$element.hasClass('in')?'hide':'show']();
        }};var i=t.fn.collapse;t.fn.collapse=function (i){
          return this.each(function (){
            var n=t(this),s=n.data('collapse'),o=t.extend({},t.fn.collapse.defaults,n.data(),'object'==typeof i&&i);s||n.data('collapse',s=new e(this,o)),'string'==typeof i&&s[i]();
          });
        },t.fn.collapse.defaults={toggle:!0},t.fn.collapse.Constructor=e,t.fn.collapse.noConflict=function (){
          return t.fn.collapse=i,this;
        },t(document).on('click.collapse.data-api','[data-toggle=collapse]',function (e){
          var i,n=t(this),s=n.attr('data-target')||e.preventDefault()||(i=n.attr('href'))&&i.replace(/.*(?=#[^\s]+$)/,''),o=t(s).data('collapse')?'toggle':n.data();n[t(s).hasClass('in')?'addClass':'removeClass']('collapsed'),t(s).collapse(o);
        });
      }(window.jQuery),function (t){
        'use strict';function e(){
          t('.dropdown-backdrop').remove(),t(n).each(function (){
            i(t(this)).removeClass('open');
          });
        }function i(e){
          var i,n=e.attr('data-target');return n||(n=e.attr('href'),n=n&&/#/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,'')),i=n&&t(n),i&&i.length||(i=e.parent()),i;
        }var n='[data-toggle=dropdown]',s=function (e){
          var i=t(e).on('click.dropdown.data-api',this.toggle);t('html').on('click.dropdown.data-api',function (){
            i.parent().removeClass('open');
          });
        };s.prototype={constructor:s,toggle:function (n){
          var s,o,a=t(this);if(!a.is('.disabled, :disabled'))return s=i(a),o=s.hasClass('open'),e(),o||('ontouchstart'in document.documentElement&&t('<div class="dropdown-backdrop"/>').insertBefore(t(this)).on('click',e),s.toggleClass('open')),a.focus(),!1;
        },keydown:function (e){
          var s,o,a,r,h;if(/(38|40|27)/.test(e.keyCode)&&(s=t(this),e.preventDefault(),e.stopPropagation(),!s.is('.disabled, :disabled'))){
            if(a=i(s),!(r=a.hasClass('open'))||r&&27==e.keyCode)return 27==e.which&&a.find(n).focus(),s.click();o=t('[role=menu] li:not(.divider):visible a',a),o.length&&(h=o.index(o.filter(':focus')),38==e.keyCode&&h>0&&h--,40==e.keyCode&&h<o.length-1&&h++,~h||(h=0),o.eq(h).focus());
          }
        }};var o=t.fn.dropdown;t.fn.dropdown=function (e){
          return this.each(function (){
            var i=t(this),n=i.data('dropdown');n||i.data('dropdown',n=new s(this)),'string'==typeof e&&n[e].call(i);
          });
        },t.fn.dropdown.Constructor=s,t.fn.dropdown.noConflict=function (){
          return t.fn.dropdown=o,this;
        },t(document).on('click.dropdown.data-api',e).on('click.dropdown.data-api','.dropdown form',function (t){
          t.stopPropagation();
        }).on('click.dropdown.data-api',n,s.prototype.toggle).on('keydown.dropdown.data-api',`${n}, [role=menu]`,s.prototype.keydown);
      }(window.jQuery),function (t){
        'use strict';var e=function (e,i){
          this.options=i,this.$element=t(e).delegate('[data-dismiss="modal"]','click.dismiss.modal',t.proxy(this.hide,this)),this.options.remote&&this.$element.find('.modal-body').load(this.options.remote);
        };e.prototype={constructor:e,toggle:function (){
          return this[this.isShown?'hide':'show']();
        },show:function (){
          var e=this,i=t.Event('show');this.$element.trigger(i),this.isShown||i.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.backdrop(function (){
            var i=t.support.transition&&e.$element.hasClass('fade');e.$element.parent().length||e.$element.appendTo(document.body),e.$element.show(),i&&e.$element[0].offsetWidth,e.$element.addClass('in').attr('aria-hidden',!1),e.enforceFocus(),i?e.$element.one(t.support.transition.end,function (){
              e.$element.focus().trigger('shown');
            }):e.$element.focus().trigger('shown');
          }));
        },hide:function (e){
          e&&e.preventDefault();e=t.Event('hide'),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,this.escape(),t(document).off('focusin.modal'),this.$element.removeClass('in').attr('aria-hidden',!0),t.support.transition&&this.$element.hasClass('fade')?this.hideWithTransition():this.hideModal());
        },enforceFocus:function (){
          var e=this;t(document).on('focusin.modal',function (t){
            e.$element[0]===t.target||e.$element.has(t.target).length||e.$element.focus();
          });
        },escape:function (){
          var t=this;this.isShown&&this.options.keyboard?this.$element.on('keyup.dismiss.modal',function (e){
            27==e.which&&t.hide();
          }):this.isShown||this.$element.off('keyup.dismiss.modal');
        },hideWithTransition:function (){
          var e=this,i=setTimeout(function (){
            e.$element.off(t.support.transition.end),e.hideModal();
          },500);this.$element.one(t.support.transition.end,function (){
            clearTimeout(i),e.hideModal();
          });
        },hideModal:function (){
          var t=this;this.$element.hide(),this.backdrop(function (){
            t.removeBackdrop(),t.$element.trigger('hidden');
          });
        },removeBackdrop:function (){
          this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null;
        },backdrop:function (e){
          var i=this.$element.hasClass('fade')?'fade':'';if(this.isShown&&this.options.backdrop){
            var n=t.support.transition&&i;if(this.$backdrop=t(`<div class="modal-backdrop ${i}" />`).appendTo(document.body),this.$backdrop.click('static'==this.options.backdrop?t.proxy(this.$element[0].focus,this.$element[0]):t.proxy(this.hide,this)),n&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass('in'),!e)return;n?this.$backdrop.one(t.support.transition.end,e):e();
          }else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass('in'),t.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one(t.support.transition.end,e):e()):e&&e();
        }};var i=t.fn.modal;t.fn.modal=function (i){
          return this.each(function (){
            var n=t(this),s=n.data('modal'),o=t.extend({},t.fn.modal.defaults,n.data(),'object'==typeof i&&i);s||n.data('modal',s=new e(this,o)),'string'==typeof i?s[i]():o.show&&s.show();
          });
        },t.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},t.fn.modal.Constructor=e,t.fn.modal.noConflict=function (){
          return t.fn.modal=i,this;
        },t(document).on('click.modal.data-api','[data-toggle="modal"]',function (e){
          var i=t(this),n=i.attr('href'),s=t(i.attr('data-target')||n&&n.replace(/.*(?=#[^\s]+$)/,'')),o=s.data('modal')?'toggle':t.extend({remote:!/#/.test(n)&&n},s.data(),i.data());e.preventDefault(),s.modal(o).one('hide',function (){
            i.focus();
          });
        });
      }(window.jQuery),function (t){
        'use strict';var e=function (t,e){
          this.init('tooltip',t,e);
        };e.prototype={constructor:e,init:function (e,i,n){
          var s,o,a,r,h;for(this.type=e,this.$element=t(i),this.options=this.getOptions(n),this.enabled=!0,a=this.options.trigger.split(' '),h=a.length;h--;)r=a[h],'click'==r?this.$element.on(`click.${this.type}`,this.options.selector,t.proxy(this.toggle,this)):'manual'!=r&&(s='hover'==r?'mouseenter':'focus',o='hover'==r?'mouseleave':'blur',this.$element.on(`${s}.${this.type}`,this.options.selector,t.proxy(this.enter,this)),this.$element.on(`${o}.${this.type}`,this.options.selector,t.proxy(this.leave,this)));this.options.selector?this._options=t.extend({},this.options,{trigger:'manual',selector:''}):this.fixTitle();
        },getOptions:function (e){
          return e=t.extend({},t.fn[this.type].defaults,this.$element.data(),e),e.delay&&'number'==typeof e.delay&&(e.delay={show:e.delay,hide:e.delay}),e;
        },enter:function (e){
          var i,n=t.fn[this.type].defaults,s={};if(this._options&&t.each(this._options,function (t,e){
            n[t]!=e&&(s[t]=e);
          },this),i=t(e.currentTarget)[this.type](s).data(this.type),!i.options.delay||!i.options.delay.show)return i.show();clearTimeout(this.timeout),i.hoverState='in',this.timeout=setTimeout(function (){
            'in'==i.hoverState&&i.show();
          },i.options.delay.show);
        },leave:function (e){
          var i=t(e.currentTarget)[this.type](this._options).data(this.type);if(this.timeout&&clearTimeout(this.timeout),!i.options.delay||!i.options.delay.hide)return i.hide();i.hoverState='out',this.timeout=setTimeout(function (){
            'out'==i.hoverState&&i.hide();
          },i.options.delay.hide);
        },show:function (){
          var e,i,n,s,o,a,r=t.Event('show');if(this.hasContent()&&this.enabled){
            if(this.$element.trigger(r),r.isDefaultPrevented())return;switch(e=this.tip(),this.setContent(),this.options.animation&&e.addClass('fade'),o='function'==typeof this.options.placement?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement,e.detach().css({top:0,left:0,display:'block'}),this.options.container?e.appendTo(this.options.container):e.insertAfter(this.$element),i=this.getPosition(),n=e[0].offsetWidth,s=e[0].offsetHeight,o){
            case'bottom':a={top:i.top+i.height,left:i.left+i.width/2-n/2};break;case'top':a={top:i.top-s,left:i.left+i.width/2-n/2};break;case'left':a={top:i.top+i.height/2-s/2,left:i.left-n};break;case'right':a={top:i.top+i.height/2-s/2,left:i.left+i.width};
            }this.applyPlacement(a,o),this.$element.trigger('shown');
          }
        },applyPlacement:function (t,e){
          var i,n,s,o,a=this.tip(),r=a[0].offsetWidth,h=a[0].offsetHeight;a.offset(t).addClass(e).addClass('in'),i=a[0].offsetWidth,n=a[0].offsetHeight,'top'==e&&n!=h&&(t.top=t.top+h-n,o=!0),'bottom'==e||'top'==e?(s=0,t.left<0&&(s=-2*t.left,t.left=0,a.offset(t),i=a[0].offsetWidth,n=a[0].offsetHeight),this.replaceArrow(s-r+i,i,'left')):this.replaceArrow(n-h,n,'top'),o&&a.offset(t);
        },replaceArrow:function (t,e,i){
          this.arrow().css(i,t?`${50*(1-t/e)}%`:'');
        },setContent:function (){
          var t=this.tip(),e=this.getTitle();t.find('.tooltip-inner')[this.options.html?'html':'text'](e),t.removeClass('fade in top bottom left right');
        },hide:function (){
          var e=this.tip(),i=t.Event('hide');if(this.$element.trigger(i),!i.isDefaultPrevented())return e.removeClass('in'),t.support.transition&&this.$tip.hasClass('fade')?function (){
            var i=setTimeout(function (){
              e.off(t.support.transition.end).detach();
            },500);e.one(t.support.transition.end,function (){
              clearTimeout(i),e.detach();
            });
          }():e.detach(),this.$element.trigger('hidden'),this;
        },fixTitle:function (){
          var t=this.$element;(t.attr('title')||'string'!=typeof t.attr('data-original-title'))&&t.attr('data-original-title',t.attr('title')||'').attr('title','');
        },hasContent:function (){
          return this.getTitle();
        },getPosition:function (){
          var e=this.$element[0];return t.extend({},'function'==typeof e.getBoundingClientRect?e.getBoundingClientRect():{width:e.offsetWidth,height:e.offsetHeight},this.$element.offset());
        },getTitle:function (){
          var t=this.$element,e=this.options;return t.attr('data-original-title')||('function'==typeof e.title?e.title.call(t[0]):e.title);
        },tip:function (){
          return this.$tip=this.$tip||t(this.options.template);
        },arrow:function (){
          return this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow');
        },validate:function (){
          this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null);
        },enable:function (){
          this.enabled=!0;
        },disable:function (){
          this.enabled=!1;
        },toggleEnabled:function (){
          this.enabled=!this.enabled;
        },toggle:function (e){
          var i=e?t(e.currentTarget)[this.type](this._options).data(this.type):this;i.tip().hasClass('in')?i.hide():i.show();
        },destroy:function (){
          this.hide().$element.off(`.${this.type}`).removeData(this.type);
        }};var i=t.fn.tooltip;t.fn.tooltip=function (i){
          return this.each(function (){
            var n=t(this),s=n.data('tooltip'),o='object'==typeof i&&i;s||n.data('tooltip',s=new e(this,o)),'string'==typeof i&&s[i]();
          });
        },t.fn.tooltip.Constructor=e,t.fn.tooltip.defaults={animation:!0,placement:'top',selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:!1,container:!1},t.fn.tooltip.noConflict=function (){
          return t.fn.tooltip=i,this;
        };
      }(window.jQuery),function (t){
        'use strict';var e=function (t,e){
          this.init('popover',t,e);
        };e.prototype=t.extend({},t.fn.tooltip.Constructor.prototype,{constructor:e,setContent:function (){
          var t=this.tip(),e=this.getTitle(),i=this.getContent();t.find('.popover-title')[this.options.html?'html':'text'](e),t.find('.popover-content')[this.options.html?'html':'text'](i),t.removeClass('fade top bottom left right in');
        },hasContent:function (){
          return this.getTitle()||this.getContent();
        },getContent:function (){
          var t=this.$element,e=this.options;return('function'==typeof e.content?e.content.call(t[0]):e.content)||t.attr('data-content');
        },tip:function (){
          return this.$tip||(this.$tip=t(this.options.template)),this.$tip;
        },destroy:function (){
          this.hide().$element.off(`.${this.type}`).removeData(this.type);
        }});var i=t.fn.popover;t.fn.popover=function (i){
          return this.each(function (){
            var n=t(this),s=n.data('popover'),o='object'==typeof i&&i;s||n.data('popover',s=new e(this,o)),'string'==typeof i&&s[i]();
          });
        },t.fn.popover.Constructor=e,t.fn.popover.defaults=t.extend({},t.fn.tooltip.defaults,{placement:'right',trigger:'click',content:'',template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),t.fn.popover.noConflict=function (){
          return t.fn.popover=i,this;
        };
      }(window.jQuery),function (t){
        'use strict';function e(e,i){
          var n,s=t.proxy(this.process,this),o=t(t(e).is('body')?window:e);this.options=t.extend({},t.fn.scrollspy.defaults,i),this.$scrollElement=o.on('scroll.scroll-spy.data-api',s),this.selector=`${this.options.target||(n=t(e).attr('href'))&&n.replace(/.*(?=#[^\s]+$)/,'')||''} .nav li > a`,this.$body=t('body'),this.refresh(),this.process();
        }e.prototype={constructor:e,refresh:function (){
          var e=this;this.offsets=t([]),this.targets=t([]),this.$body.find(this.selector).map(function (){
            var i=t(this),n=i.data('target')||i.attr('href'),s=/^#\w/.test(n)&&t(n);return s&&s.length&&[[s.position().top+(!t.isWindow(e.$scrollElement.get(0))&&e.$scrollElement.scrollTop()),n]]||null;
          }).sort(function (t,e){
            return t[0]-e[0];
          }).each(function (){
            e.offsets.push(this[0]),e.targets.push(this[1]);
          });
        },process:function (){
          var t,e=this.$scrollElement.scrollTop()+this.options.offset,i=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,n=i-this.$scrollElement.height(),s=this.offsets,o=this.targets,a=this.activeTarget;if(e>=n)return a!=(t=o.last()[0])&&this.activate(t);for(t=s.length;t--;)a!=o[t]&&e>=s[t]&&(!s[t+1]||e<=s[t+1])&&this.activate(o[t]);
        },activate:function (e){
          var i,n;this.activeTarget=e,t(this.selector).parent('.active').removeClass('active'),n=`${this.selector}[data-target="${e}"],${this.selector}[href="${e}"]`,i=t(n).parent('li').addClass('active'),i.parent('.dropdown-menu').length&&(i=i.closest('li.dropdown').addClass('active')),i.trigger('activate');
        }};var i=t.fn.scrollspy;t.fn.scrollspy=function (i){
          return this.each(function (){
            var n=t(this),s=n.data('scrollspy'),o='object'==typeof i&&i;s||n.data('scrollspy',s=new e(this,o)),'string'==typeof i&&s[i]();
          });
        },t.fn.scrollspy.Constructor=e,t.fn.scrollspy.defaults={offset:10},t.fn.scrollspy.noConflict=function (){
          return t.fn.scrollspy=i,this;
        },t(window).on('load',function (){
          t('[data-spy="scroll"]').each(function (){
            var e=t(this);e.scrollspy(e.data());
          });
        });
      }(window.jQuery),function (t){
        'use strict';var e=function (e){
          this.element=t(e);
        };e.prototype={constructor:e,show:function (){
          var e,i,n,s=this.element,o=s.closest('ul:not(.dropdown-menu)'),a=s.attr('data-target');a||(a=s.attr('href'),a=a&&a.replace(/.*(?=#[^\s]*$)/,'')),s.parent('li').hasClass('active')||(e=o.find('.active:last a')[0],n=t.Event('show',{relatedTarget:e}),s.trigger(n),n.isDefaultPrevented()||(i=t(a),this.activate(s.parent('li'),o),this.activate(i,i.parent(),function (){
            s.trigger({type:'shown',relatedTarget:e});
          })));
        },activate:function (e,i,n){
          function s(){
            o.removeClass('active').find('> .dropdown-menu > .active').removeClass('active'),e.addClass('active'),a?(e[0].offsetWidth,e.addClass('in')):e.removeClass('fade'),e.parent('.dropdown-menu')&&e.closest('li.dropdown').addClass('active'),n&&n();
          }var o=i.find('> .active'),a=n&&t.support.transition&&o.hasClass('fade');a?o.one(t.support.transition.end,s):s(),o.removeClass('in');
        }};var i=t.fn.tab;t.fn.tab=function (i){
          return this.each(function (){
            var n=t(this),s=n.data('tab');s||n.data('tab',s=new e(this)),'string'==typeof i&&s[i]();
          });
        },t.fn.tab.Constructor=e,t.fn.tab.noConflict=function (){
          return t.fn.tab=i,this;
        },t(document).on('click.tab.data-api','[data-toggle="tab"], [data-toggle="pill"]',function (e){
          e.preventDefault(),t(this).tab('show');
        });
      }(window.jQuery),function (t){
        'use strict';var e=function (e,i){
          this.$element=t(e),this.options=t.extend({},t.fn.typeahead.defaults,i),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.source=this.options.source,this.$menu=t(this.options.menu),this.shown=!1,this.listen();
        };e.prototype={constructor:e,select:function (){
          var t=this.$menu.find('.active').attr('data-value');return this.$element.val(this.updater(t)).change(),this.hide();
        },updater:function (t){
          return t;
        },show:function (){
          var e=t.extend({},this.$element.position(),{height:this.$element[0].offsetHeight});return this.$menu.insertAfter(this.$element).css({top:e.top+e.height,left:e.left}).show(),this.shown=!0,this;
        },hide:function (){
          return this.$menu.hide(),this.shown=!1,this;
        },lookup:function (e){
          var i;return this.query=this.$element.val(),!this.query||this.query.length<this.options.minLength?this.shown?this.hide():this:(i=t.isFunction(this.source)?this.source(this.query,t.proxy(this.process,this)):this.source,i?this.process(i):this);
        },process:function (e){
          var i=this;return e=t.grep(e,function (t){
            return i.matcher(t);
          }),e=this.sorter(e),e.length?this.render(e.slice(0,this.options.items)).show():this.shown?this.hide():this;
        },matcher:function (t){
          return~t.toLowerCase().indexOf(this.query.toLowerCase());
        },sorter:function (t){
          for(var e,i=[],n=[],s=[];e=t.shift();)e.toLowerCase().indexOf(this.query.toLowerCase())?~e.indexOf(this.query)?n.push(e):s.push(e):i.push(e);return i.concat(n,s);
        },highlighter:function (t){
          var e=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,'\\$&');return t.replace(new RegExp(`(${e})`,'ig'),function (t,e){
            return`<strong>${e}</strong>`;
          });
        },render:function (e){
          var i=this;return e=t(e).map(function (e,n){
            return e=t(i.options.item).attr('data-value',n),e.find('a').html(i.highlighter(n)),e[0];
          }),e.first().addClass('active'),this.$menu.html(e),this;
        },next:function (e){
          var i=this.$menu.find('.active').removeClass('active'),n=i.next();n.length||(n=t(this.$menu.find('li')[0])),n.addClass('active');
        },prev:function (t){
          var e=this.$menu.find('.active').removeClass('active'),i=e.prev();i.length||(i=this.$menu.find('li').last()),i.addClass('active');
        },listen:function (){
          this.$element.on('focus',t.proxy(this.focus,this)).on('blur',t.proxy(this.blur,this)).on('keypress',t.proxy(this.keypress,this)).on('keyup',t.proxy(this.keyup,this)),this.eventSupported('keydown')&&this.$element.on('keydown',t.proxy(this.keydown,this)),this.$menu.on('click',t.proxy(this.click,this)).on('mouseenter','li',t.proxy(this.mouseenter,this)).on('mouseleave','li',t.proxy(this.mouseleave,this));
        },eventSupported:function (t){
          var e=t in this.$element;return e||(this.$element.setAttribute(t,'return;'),e='function'==typeof this.$element[t]),e;
        },move:function (t){
          if(this.shown){
            switch(t.keyCode){
            case 9:case 13:case 27:t.preventDefault();break;case 38:t.preventDefault(),this.prev();break;case 40:t.preventDefault(),this.next();
            }t.stopPropagation();
          }
        },keydown:function (e){
          this.suppressKeyPressRepeat=~t.inArray(e.keyCode,[40,38,9,13,27]),this.move(e);
        },keypress:function (t){
          this.suppressKeyPressRepeat||this.move(t);
        },keyup:function (t){
          switch(t.keyCode){
          case 40:case 38:case 16:case 17:case 18:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup();
          }t.stopPropagation(),t.preventDefault();
        },focus:function (t){
          this.focused=!0;
        },blur:function (t){
          this.focused=!1,!this.mousedover&&this.shown&&this.hide();
        },click:function (t){
          t.stopPropagation(),t.preventDefault(),this.select(),this.$element.focus();
        },mouseenter:function (e){
          this.mousedover=!0,this.$menu.find('.active').removeClass('active'),t(e.currentTarget).addClass('active');
        },mouseleave:function (t){
          this.mousedover=!1,!this.focused&&this.shown&&this.hide();
        }};var i=t.fn.typeahead;t.fn.typeahead=function (i){
          return this.each(function (){
            var n=t(this),s=n.data('typeahead'),o='object'==typeof i&&i;s||n.data('typeahead',s=new e(this,o)),'string'==typeof i&&s[i]();
          });
        },t.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1},t.fn.typeahead.Constructor=e,t.fn.typeahead.noConflict=function (){
          return t.fn.typeahead=i,this;
        },t(document).on('focus.typeahead.data-api','[data-provide="typeahead"]',function (e){
          var i=t(this);i.data('typeahead')||i.typeahead(i.data());
        });
      }(window.jQuery),function (t){
        'use strict';var e=function (e,i){
          this.options=t.extend({},t.fn.affix.defaults,i),this.$window=t(window).on('scroll.affix.data-api',t.proxy(this.checkPosition,this)).on('click.affix.data-api',t.proxy(function (){
            setTimeout(t.proxy(this.checkPosition,this),1);
          },this)),this.$element=t(e),this.checkPosition();
        };e.prototype.checkPosition=function (){
          if(this.$element.is(':visible')){
            var e,i=t(document).height(),n=this.$window.scrollTop(),s=this.$element.offset(),o=this.options.offset,a=o.bottom,r=o.top;'object'!=typeof o&&(a=r=o),'function'==typeof r&&(r=o.top()),'function'==typeof a&&(a=o.bottom()),e=!(null!=this.unpin&&n+this.unpin<=s.top)&&(null!=a&&s.top+this.$element.height()>=i-a?'bottom':null!=r&&n<=r&&'top'),this.affixed!==e&&(this.affixed=e,this.unpin='bottom'==e?s.top-n:null,this.$element.removeClass('affix affix-top affix-bottom').addClass(`affix${e?`-${e}`:''}`));
          }
        };var i=t.fn.affix;t.fn.affix=function (i){
          return this.each(function (){
            var n=t(this),s=n.data('affix'),o='object'==typeof i&&i;s||n.data('affix',s=new e(this,o)),'string'==typeof i&&s[i]();
          });
        },t.fn.affix.Constructor=e,t.fn.affix.defaults={offset:0},t.fn.affix.noConflict=function (){
          return t.fn.affix=i,this;
        },t(window).on('load',function (){
          t('[data-spy="affix"]').each(function (){
            var e=t(this),i=e.data();i.offset=i.offset||{},i.offsetBottom&&(i.offset.bottom=i.offsetBottom),i.offsetTop&&(i.offset.top=i.offsetTop),e.affix(i);
          });
        });
      }(window.jQuery);
    }).call(global,module,void 0,void 0);
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'jquery':85}],117:[function (require,module,exports){
  (function (global){
    jQuery=global.jQuery=require('jquery');var __browserify_shim_require__=require;(function (t,e,a){
      !function (t){
        'function'==typeof e&&e.amd?e(['jquery'],t):t(jQuery);
      }(function (t){
        function e(){
          var e=a(this),o=n.settings;return isNaN(e.datetime)||(0==o.cutoff||r(e.datetime)<o.cutoff)&&t(this).text(i(e.datetime)),this;
        }function a(e){
          if(e=t(e),!e.data('timeago')){
            e.data('timeago',{datetime:n.datetime(e)});var a=t.trim(e.text());n.settings.localeTitle?e.attr('title',e.data('timeago').datetime.toLocaleString()):!(a.length>0)||n.isTime(e)&&e.attr('title')||e.attr('title',a);
          }return e.data('timeago');
        }function i(t){
          return n.inWords(r(t));
        }function r(t){
          return(new Date).getTime()-t.getTime();
        }t.timeago=function (e){
          return i(e instanceof Date?e:'string'==typeof e?t.timeago.parse(e):'number'==typeof e?new Date(e):t.timeago.datetime(e));
        };var n=t.timeago;t.extend(t.timeago,{settings:{refreshMillis:6e4,allowFuture:!1,localeTitle:!1,cutoff:0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:'ago',suffixFromNow:'from now',seconds:'less than a minute',minute:'about a minute',minutes:'%d minutes',hour:'about an hour',hours:'about %d hours',day:'a day',days:'%d days',month:'about a month',months:'%d months',year:'about a year',years:'%d years',wordSeparator:' ',numbers:[]}},inWords:function (e){
          function a(a,r){
            var n=t.isFunction(a)?a(r,e):a,o=i.numbers&&i.numbers[r]||r;return n.replace(/%d/i,o);
          }var i=this.settings.strings,r=i.prefixAgo,n=i.suffixAgo;this.settings.allowFuture&&e<0&&(r=i.prefixFromNow,n=i.suffixFromNow);var o=Math.abs(e)/1e3,s=o/60,u=s/60,m=u/24,d=m/365,f=o<45&&a(i.seconds,Math.round(o))||o<90&&a(i.minute,1)||s<45&&a(i.minutes,Math.round(s))||s<90&&a(i.hour,1)||u<24&&a(i.hours,Math.round(u))||u<42&&a(i.day,1)||m<30&&a(i.days,Math.round(m))||m<45&&a(i.month,1)||m<365&&a(i.months,Math.round(m/30))||d<1.5&&a(i.year,1)||a(i.years,Math.round(d)),l=i.wordSeparator||'';return void 0===i.wordSeparator&&(l=' '),t.trim([r,f,n].join(l));
        },parse:function (e){
          var a=t.trim(e);return a=a.replace(/\.\d+/,''),a=a.replace(/-/,'/').replace(/-/,'/'),a=a.replace(/T/,' ').replace(/Z/,' UTC'),a=a.replace(/([\+\-]\d\d)\:?(\d\d)/,' $1$2'),new Date(a);
        },datetime:function (e){
          var a=n.isTime(e)?t(e).attr('datetime'):t(e).attr('title');return n.parse(a);
        },isTime:function (e){
          return'time'===t(e).get(0).tagName.toLowerCase();
        }});var o={init:function (){
          var a=t.proxy(e,this);a();var i=n.settings;i.refreshMillis>0&&setInterval(a,i.refreshMillis);
        },update:function (a){
          t(this).data('timeago',{datetime:n.parse(a)}),e.apply(this);
        },updateFromDOM:function (){
          t(this).data('timeago',{datetime:n.parse(n.isTime(this)?t(this).attr('datetime'):t(this).attr('title'))}),e.apply(this);
        }};t.fn.timeago=function (t,e){
          var a=t?o[t]:o.init;if(!a)throw new Error(`Unknown function name '${t}' for timeago`);return this.each(function (){
            a.call(this,e);
          }),this;
        },document.createElement('abbr'),document.createElement('time');
      });
    }).call(global,module,void 0,void 0);
  }).call(this,typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

},{'jquery':85}]},{},[9]);


//# sourceMappingURL=bundle.map