Handlebars.registerHelper('addActiveClass', function (options) {
    return this.id == options.data.root.selected.id ? 'act' : '';
});