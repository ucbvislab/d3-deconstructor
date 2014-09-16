module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            options: {
                debug: true
            },
            injected: {
                src: ['js/injected.js'],
                dest: 'build/injected.js'
            },
            restyling: {
                src: ['js/restyling.js'],
                dest: 'build/restyling.js'
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