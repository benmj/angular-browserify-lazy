// Run some tasks in parallel to speed up the build process
module.exports = {
    server: [
        'copy:styles'
    ],
    test: [
        'copy:styles'
    ],
    dist: [
        'copy:styles',
        'imagemin',
    ]
};