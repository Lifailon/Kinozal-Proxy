module.exports = {
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: 'https://kinozal.tv/:path*',
            },
        ];
    },
};
