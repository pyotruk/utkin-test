var AppView = Backbone.View.extend({
    el: '#layout',

    template: Handlebars.templates['main.hbs'],

    model: {
        persons: null,
        selected: null
    },

    events: {
        "click #list a": "onSelect",
        "click #controls .prev": "prev",
        "click #controls .next": "next",
    },

    initialize: function () {
        this.load();
    },

    onSelect: function (e) {
        var self = this;

        self.setSelected($(e.currentTarget).attr('data-id'));
        self.render();

        return false;
    },

    setSelected: function (id) {
        var self = this;

        self.model.selected = self.model.persons.get({id: id});
        self.model.selected.set({
            index: self.model.persons.indexOf(self.model.selected) + 1
        });

        //TODO too dirty
        var target = self.$el.find('a[data-id=' + target + ']');

        target.parent().siblings().find('a').removeClass('act');
        target.addClass('act');

    },

    getSelected: function () {
        return this.$el.find('a.act');
    },
    getNext: function () {
        return this.getSelected().parent().next().find('a').attr('data-id');
    },
    getPrev: function () {
        return this.getSelected().parent().prev().find('a').attr('data-id');
    },

    prev: function () {
        // TODO round to last item
        this.setSelected(this.getPrev());
        this.render();
        return false;
    },
    next: function () {
        // TODO round to first item
        this.setSelected(this.getNext());
        this.render();
        return false;
    },

    load: function () {
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
                self.setSelected(collection.get({id: 2}).id);
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