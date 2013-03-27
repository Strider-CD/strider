/** JOBS **/
window.Job = Backbone.Model.extend({
  defaults: function() {
    return {
      enabled: false,
      progress: 0,
      in_progress: false
    };
  }
});


window.JobListCollection = Backbone.Collection.extend({
  model: Job,
  url: "/api/jobs",
  parse: function(response) {
    return response;
  }
});

//sort in reverse chron order
JobListCollection.comparator = function(job1,job2) {
  if (job1.get("created_timestamp")<=job2.get("created_timestamp")) {
    return 1;
  } else {
    return -1;
  }
};

window.JobList = new JobListCollection();


window.AdminJobListCollection = JobListCollection.extend({
  url : "/api/admin/jobs"
});
