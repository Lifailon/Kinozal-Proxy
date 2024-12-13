## Kinozal-Proxy

This is a serverless function for running a mirror to the Kinozal torrent tracker using [Next.js](https://nextjs.org).

The proxy was created to access the tracker in the [Kinozal-Bot](https://github.com/Lifailon/Kinozal-Bot) project without using a VPN, for this reason, there is an access restriction at the level of checking the agent used when sending requests.

It is recommended to launch your application from the original Kinozal-Proxy repository, in order to avoid unnecessary load on one copy and keep your authorization data in the tracker.

The proxy is not universal and requires some work to proxy to other domains.

## 🔼 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Using the button below and following the instructions:

[![Vercel](https://img.shields.io/badge/Deploy-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/torapi/clone?repository-url=https://github.com/lifailon/Kinozal-Proxy)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
