/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var myapp = {};

  StackMob.init({
    appName: "sm_crud",
    clientSubdomain: "stackmob339",
    apiVersion: 0
  });

(function($){
    
     myapp.Todo = StackMob.Model.extend({
        schemaName: 'todo'
    });

    
    myapp.Todos = StackMob.Collection.extend({
        model: myapp.Todo
    });


    myapp.ListView = Backbone.View.extend({
        tagName: 'ul',
        id: 'todoList',
        attributes: {"data-role": 'listview', "data-inset": "true", "data-theme" : "b"},

        initialize: function() {
            this.collection.bind('change', this.render,this);
            this.collection.bind('reset', this.render, this);
            this.template = _.template($('#listItemTemplate').html());
        },

        render: function() {
            var container = this.options.viewContainer,
                todos = this.collection,
                template = this.template,
                listView = $(this.el);
            
            listView.empty();

            todos.each(function(todo){
                listView.append(template(todo.toJSON()));
            });
            
            container.html($(this.el));
            container.trigger('create');
            container.trigger('updateLayout');

            return this;
        }
     
    });




     myapp.UpdateForm = Backbone.View.extend({

        el: "#updatePage",
        events: {
           "click #submitBtn": "update",     
        },


        initialize: function() {
          this.template = _.template($('#addItemTemplate').html());
        },
      
        render: function() {
          
          var   updateForm = $("#updateForm"),
                model = this.options.model;
         
            updateForm.empty(); 
            updateForm.append(this.template(model.toJSON()));
            updateForm.trigger('create');
        },

        update: function() {
           console.log('up')
              var list = $('#todoList'),
                item = $('#updateForm').serializeObject(),
                collection = this.collection,
                model = this.options.model;
              
            
              console.log(JSON.stringify(item));
            
              //var todo = new myapp.Todo(model);

             // this.model.save(item);
              console.log(this.model);
              this.model.save(item,
              {
                success: function(item) {
                  //collection.trigger('change');
                  $(this.el).remove();
                  $(this.el).unbind()
                  $.mobile.changePage('#listPage',{ transition: "slide", reverse: true, changeHash: false  });
              }
            });

            
        }

      });


    myapp.AddView = Backbone.View.extend({

        el: "#addPage",
        events: {
           "click #addBtn": "add",     
        },
   
        add: function() {
            var list = $('#todoList'),
                item = $('#addForm').serializeObject(),
                collection = this.collection;
            
            var todo = new myapp.Todo(item);

            todo.create({
                success: function(model) {
                    collection.add(model);
                    collection.trigger('change');

                    $.mobile.changePage('#listPage',{ transition: "slide", reverse: true, changeHash: false  });
                }
            });

            return this;
        }
    });


    myapp.initData = function(){
        myapp.todos = new myapp.Todos();
        myapp.todos.fetch({async: false});
    };

    

    
    
}(jQuery));


$('#listPage').live('pageinit', function(event){

    var listContainer = $('#listPage').find(":jqmData(role='content')"),
    addContainer = $('#addPage').find(":jqmData(role='content')"),
    listView;

    myapp.initData();
   
    listView = new myapp.ListView({collection: myapp.todos, viewContainer: listContainer});
    listView.render();

   
    addView = new myapp.AddView({collection: myapp.todos, viewContainer: addContainer});
    addView.render();
    

});

$('#todoList .detail').live('click', function(e){
  var model,updateForm;

  model = null;
  model = myapp.todos.get($(e.currentTarget).data("id"));
  

  updateForm = new myapp.UpdateForm({collection: myapp.todos, model: model});
  updateForm.render();
 
});

$(document).bind("mobileinit", function(){
    $.mobile.page.prototype.options.addBackBtn= true;
});


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
