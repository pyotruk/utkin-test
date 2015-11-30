module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            all: {
                files: {
                    "css/css.css": "css/css.less"
                }
            }
        },
        handlebars: {
            all: {
                options: {
                    namespace: 'CHSH.Templates'
                },
                files: {
                    "app/templates/main.hbs.js": ["app/templates/**/*.hbs"]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    grunt.registerTask('default', ['less', 'handlebars']);
};