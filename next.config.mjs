/** @type {import('next').NextConfig} */
const config = {
	experimental: {
		esmExternals: "loose",

	},
	 eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default config;
