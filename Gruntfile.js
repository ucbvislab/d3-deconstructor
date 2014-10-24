module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            options: {
                debug: true
            },
            injected: {
                src: ['js/injected.js'],
                dest: 'dist/injected.js'
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
    grunt.loadNpmTasks('grunt-chrome-compile');
};
