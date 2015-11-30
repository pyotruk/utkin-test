var AppView = Backbone.View.extend({
    el: '#layout',

    ui: {
        list: {
            items: '#list a',
            findById: function (id) {
                return $(this.items).filter('[data-id=' + id + ']');
            },
            extractId: function(el){
                return $(el).attr('data-id');
            }
        },
        controls: {
            prev: "#controls .prev",
            next: "#controls .next"
        }
    },

    template: Handlebars.templates['main.hbs'],

    model: {
        persons: null,
        selected: null
    },

    events: function(){
        var events = {};
        events["click " + this.ui.list.items] = "onSelect";
        events["click " + this.ui.controls.prev] = "prev";
        events["click " + this.ui.controls.next] = "next";
        return events;
    },

    initialize: function () {
        this.load();
    },

    onSelect: function (e) {
        var self = this;

        self.setSelected(self.ui.list.extractId(e.currentTarget));
        self.render();

        return false;
    },

    setSelected: function (id) {
        var self = this;

        self.model.selected = self.model.persons.get({id: id});
        self.model.selected.set({
            index: self.getSelectedIndex() + 1
        });

        var target = self.ui.list.findById(id);

        target.parent().siblings().find('a').removeClass('act');
        target.addClass('act');

    },

    getSelected: function () {
        var self = this;
        return self.model.persons.get({id: self.model.selected.id});
    },
    getSelectedIndex: function () {
        var self = this;
        return self.model.persons.indexOf(self.model.selected);
    },
    getNext: function () {
        var self = this;
        var next = self.getSelectedIndex() + 1;
        if (next >= $(self.ui.list.items).length) next = 0;
        return self.model.persons.models[next].id;
    },
    getPrev: function () {
        var self = this;
        var prev = self.getSelectedIndex() - 1;
        if (prev < 0) prev = $(self.ui.list.items).length - 1;
        return self.model.persons.models[prev].id;
    },

    prev: function () {
        this.setSelected(this.getPrev());
        this.render();
        return false;
    },
    next: function () {
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