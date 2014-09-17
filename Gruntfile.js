module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            options: {
                debug: true
            },
            injected: {
                src: ['app/injected.js'],
                dest: 'build/injected.js'
            },
            restyling: {
                src: ['js/app.js'],
                dest: 'build/app.js'
            }
        },
        watch: {
            scripts: {
                files: ['js/**/*.js'],
                tasks: ['browserify'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
};