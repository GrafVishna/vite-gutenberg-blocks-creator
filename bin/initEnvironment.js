#!/usr/bin/env node

import { existsSync, mkdirSync, cpSync, copyFileSync, constants as fsConstants, writeFileSync } from "node:fs"
import { createInterface } from "node:readline/promises"
import { resolve, dirname, join } from "node:path" // Додаємо join для нормалізації шляхів
import { fileURLToPath } from "node:url"
import chalk from "chalk"

async function findViteConfig() {
	let currentDir = process.cwd()
	while (currentDir !== dirname(currentDir)) {
		const viteConfigPath = resolve(currentDir, "vite.config.js")
		if (existsSync(viteConfigPath)) {
			const viteConfig = await import(viteConfigPath)
			return viteConfig.default || viteConfig
		}
		currentDir = dirname(currentDir)
	}
	return {}
}

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

(async function () {
	try {
		const viteConfig = await findViteConfig()
		const developmentPath = viteConfig?.gutenbergPaths?.developmentPath || "/development"
		const packagesPath = viteConfig?.gutenbergPaths?.packagesPath || "/packages"

		const shouldPublish = await rl.question(
			"Do you want to publish the stub files to your development folder? (yes/y or no/n) "
		)

		const __dirname = resolve(dirname(fileURLToPath(import.meta.url)) + "/../")
		const cwd = process.cwd()

		const dirs = [
			developmentPath,
			join(developmentPath, packagesPath),
			join(developmentPath, "stubs"),
		]

		for (let directory of dirs) {
			const fullPath = resolve(cwd, directory)
			if (!existsSync(fullPath)) {
				mkdirSync(fullPath)
			}
		}

		if (/^y/i.test(shouldPublish)) {
			cpSync(resolve(__dirname, "stubs/blocks"), resolve(cwd, join(developmentPath, "stubs")), { recursive: true })
		}

		copyFileSync(
			resolve(__dirname, "stubs/register-blocks.php.stub"),
			resolve(cwd, "register-blocks.php"),
			fsConstants.COPYFILE_FICLONE
		)
		copyFileSync(
			resolve(__dirname, "stubs/package.json.stub"),
			resolve(cwd, join(developmentPath, "package.json")),
			fsConstants.COPYFILE_FICLONE
		)
		copyFileSync(
			resolve(__dirname, "stubs/lerna.json.stub"),
			resolve(cwd, join(developmentPath, "lerna.json")),
			fsConstants.COPYFILE_FICLONE
		)

		const ignore = `build node_modules`

		writeFileSync(resolve(cwd, join(developmentPath, ".gitignore")), ignore, { encoding: "utf-8" })

		console.log(chalk.green(`Development environment created successfully at ${join(developmentPath, packagesPath)}`))
	} catch (error) {
		console.error(chalk.red(`Error: ${error.message}`))
	} finally {
		rl.close()
		process.exit(1)
	}
})()