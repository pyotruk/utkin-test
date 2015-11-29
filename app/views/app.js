var AppView = Backbone.View.extend({
    el: '#layout',

    template: Handlebars.templates['main.hbs'],

    model: {
        persons: null,
        selected: null
    },

    events: {
        "click #list a": "onSelect",
    },

    initialize: function () {
        this.load();
    },

    onSelect: function (e) {
        var self = this;

        var target = $(e.currentTarget);
        target.parent().siblings().find('a').removeClass('act');
        target.addClass('act');

        self.model.selected = self.model.persons.get({id: target.attr('data-id')});
        self.render();

        return false;
    },

    load: function(){
        var self = this;

        var Person = Backbone.Model.extend();

        var Persons = Backbone.Collection.extend({
            model: Person,
            url: 'data.json',
            parse: function (response) {
                return response;
            },
        });

        self.model.persons = new Persons;
        self.model.persons.fetch({
            success: function (collection, response) {
                self.model.persons = collection;
                self.model.selected = collection.get({id: 2});
                self.render();
            }
        });
    },

    render: function () {
        var self = this;
        self.$el.html(self.template({
            persons: self.model.persons.toJSON(),
            selected: self.model.selected.toJSON()
        }));
    }
});

var appView = new AppView();