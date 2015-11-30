var AppView = Backbone.View.extend({

    options: null,
    template: null,
    model: {
        persons: null,
        selected: null
    },

    el: '#layout',
    ui: {
        list: {
            items: '#list a',
            findById: function (id) {
                return $(this.items).filter('[data-id=' + id + ']');
            },
            extractId: function (el) {
                return $(el).attr('data-id');
            }
        },
        controls: {
            prev: "#controls .prev",
            next: "#controls .next"
        }
    },

    events: function () {
        var events = {};
        events["click " + this.ui.list.items] = "onSelect";
        events["click " + this.ui.controls.prev] = "prev";
        events["click " + this.ui.controls.next] = "next";
        return events;
    },

    initialize: function (options) {
        this.options = options;

        this.buildTemplate();
        this.buildModel();

        var selectedItemIndex = location.hash ? location.hash.replace(/\D/, '') : this.options.defaultItemIndex;
        this.load(selectedItemIndex);
    },

    buildTemplate: function () {
        this.template = Handlebars.templates[this.options.template];
    },

    buildModel: function () {
        var self = this;
        var Person = Backbone.Model.extend();
        var Persons = Backbone.Collection.extend({
            model: Person,
            url: self.options.data,
            parse: function (response) {
                return response;
            },
        });
        self.model.persons = new Persons;
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
            index: self.getSelectedIndex()
        });

        var target = self.ui.list.findById(id);

        target.parent().siblings().find('a').removeClass(self.options.listItemActiveClass);
        target.addClass(self.options.listItemActiveClass);

        location.hash = '#' + self.getSelectedIndex();
    },

    getSelected: function () {
        var self = this;
        return self.model.persons.get({id: self.model.selected.id});
    },
    getSelectedIndex: function () {
        var self = this;
        return self.model.persons.indexOf(self.model.selected) + 1;
    },
    getNext: function () {
        var self = this;
        var next = self.getSelectedIndex() + 1;
        if (next > $(self.ui.list.items).length) next = 1;
        return self.model.persons.models[next - 1].id;
    },
    getPrev: function () {
        var self = this;
        var prev = self.getSelectedIndex() - 1;
        if (prev < 1) prev = $(self.ui.list.items).length;
        return self.model.persons.models[prev - 1].id;
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

    load: function (selectedItemIndex) {
        var self = this;
        self.model.persons.fetch({
            success: function (collection, response) {
                self.model.persons = collection;

                var selected = collection.models[selectedItemIndex - 1];
                if (!selected) {
                    selected = collection.models[self.options.defaultItemIndex - 1];
                }

                self.setSelected(selected.id);
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

var appView = new AppView({
    listItemActiveClass: 'act',
    template: 'main.hbs',
    data: 'data.json',
    defaultItemIndex: 2,
});