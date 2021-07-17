import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import copy from 'rollup-plugin-copy';

const path = require('path');
import { copyFileSync } from 'fs';

/* global process require */

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

const
warWWlib = 'node_modules/web-audio-recorder-js/lib',
buildDir = 'public/build';
function copyFiletoBuild(lib, fileName) {
  copyFileSync(
    path.resolve(lib + '/' + fileName),
    path.resolve(buildDir + '/' + fileName)
  );
}
/**
 * @param moduleName e.g. Mp3LameEncoder, 
 * @param mem true if the .min.js.mem should be copied also
 */
function copyWWtobuild(moduleName, mem) {
  copyFiletoBuild(warWWlib, moduleName + '.min.js');
  if (mem) {
    copyFiletoBuild(warWWlib, moduleName + '.min.js.mem');
  }
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		// file path includes build/, but served URL is just /public/
		file: 'public/build/bundle.js',
		globals: {
		  'Mp3LameEncoder' : 'web-worker:Mp3LameEncoder',
		}
	},
	/*external: [
	  warWWlib + '/WebAudioRecorderWav.js',
	  warWWlib + '/WebAudioRecorderOgg.js',
	  warWWlib + '/WebAudioRecorderMp3.js',
	  ], */
	moduleContext: {
	    // warWWlib/
	  'node_modules/web-audio-recorder-js/lib/WebAudioRecorder.js': 'window',
	  'node_modules/web-audio-recorder-js/lib/Mp3LameEncoder.min.js' : 'window'
	},

	plugins: [
		svelte({
			compilerOptions: {
			  customElement: true,
			  tag : null, // "war-wc",
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			moduleDirectories : [
			  'node_modules',
			  warWWlib,
			  warWWlib + '-minified',
			],

			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		webWorkerLoader({
		  loadPath : warWWlib + '-minified'
		}),

		copy({
		  targets: [
		      { src: [
			  warWWlib + '-minified/*',
			  warWWlib + '/Mp3LameEncoder.min.js',
			  warWWlib + '/OggVorbisEncoder.min.js',
			  warWWlib + '/WavAudioEncoder.min.js',
			  warWWlib + '/WebAudioRecorder???.js'
		      ], dest: 'public/js' },


		  ]
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
