import { DETAILS_PATH } from './shared/constants/route'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	debug: import.meta.dev,

	future: {
		compatibilityVersion: 4,
	},

	ssr: true,

	// when enabling ssr option you need to disable inlineStyles and maybe devLogs
	features: {
		inlineStyles: false,
		devLogs: false,
	},

	app: {
		layoutTransition: { name: 'page', mode: 'out-in' },
		pageTransition: { name: 'page', mode: 'out-in' },
		keepalive: {
			max: 3,
		},
	},

	hooks: {
		'pages:extend'(pages) {
			const idPageParent: RouteNameArr = ['index', 'search']

			pages.forEach(page => {
				if (idPageParent.some(name => name === page.name)) {
					page.children = page.children ?? []

					page.children.push({
						name: `${page.name}-id`,
						path: `${DETAILS_PATH}/:id(\\d+)`,
						file: '~/extendpages/SingleImgDetails.vue',
					})
				}
			})
		},
	},

	runtimeConfig: {
		public: {
			appName: process.env.NUXT_PUBLIC_APP_NAME,
			imgGroupSize: process.env.NUXT_PUBLIC_IMG_GROUP_SIZE,
			accountLength: process.env.NUXT_PUBLIC_ACCOUNT_LENGTH,
			jwtRefreshExp: process.env.NUXT_PUBLIC_JWT_REFRESH_EXP,
			jwtAccessExp: process.env.NUXT_PUBLIC_JWT_ACCESS_EXP,
		},
		pexelsApiBaseUrl: process.env.NUXT_PEXELS_API_BASE_URL,
		pexelsApiAuth: process.env.NUXT_PEXELS_API_AUTH,
		mongodbUrl: process.env.NUXT_MONGODB_URL,
		jwtPrivateKey: process.env.NUXT_JWT_PRIVATE_KEY,
		jwtPublicKey: process.env.NUXT_JWT_PUBLIC_KEY,
		jwtIssuer: process.env.NUXT_JWT_ISSUER,
		jwtAudience: process.env.NUXT_JWT_AUDIENCE,
	},

	experimental: {
		typedPages: true,
	},

	build: {
		transpile: ['vuetify'],
	},

	vite: {
		ssr: {
			noExternal: ['vuetify'],
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "assets/scss/variables" as var;',
					api: 'modern-compiler',
				},
			},
			modules: {
				localsConvention: 'camelCase',
				generateScopedName: '[hash:base64:5]',
			},
		},
	},

	css: ['assets/scss/main.scss'],
	modules: [
		'@nuxt/fonts',
		'vuetify-nuxt-module',
		'@nuxt/eslint',
		'@vueuse/nuxt',
		[
			'@pinia/nuxt',
			{
				autoImports: [
					// 自动引入 `defineStore()`
					'defineStore',
					// 自动引入 `defineStore()` 并重命名为 `definePiniaStore()`
					['defineStore', 'definePiniaStore'],
				],
			},
		],
	],

	imports: {
		dirs: ['composables/**', 'extendpages/**'],
		presets: [
			{
				from: 'nanoid',
				imports: ['nanoid'],
			},
		],
	},

	nitro: {
		imports: {
			presets: [
				{
					from: 'nanoid',
					imports: ['nanoid'],
				},
			],
		},
	},

	plugins: ['~~/plugins/api', '~~/plugins/swiper.client'],

	vuetify: {
		moduleOptions: {
			// check https://nuxt.vuetifyjs.com/guide/server-side-rendering.html
			ssrClientHints: {
				reloadOnFirstRequest: false,
				viewportSize: true,
				prefersColorScheme: false,
				prefersColorSchemeOptions: {
					useBrowserThemeOnly: false,
				},
			},

			// /* If customizing sass global variables ($utilities, $reset, $color-pack, $body-font-family, etc) */
			// disableVuetifyStyles: true,
			styles: {
				configFile: 'assets/scss/settings.scss',
			},
		},
	},
})
