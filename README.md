# Vite Gutenberg Blocks Creator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/vite-gutenberg-blocks-creator.svg)](https://badge.fury.io/js/vite-gutenberg-blocks-creator)
[![npm downloads](https://img.shields.io/npm/dt/vite-gutenberg-blocks-creator.svg?color=blue)](https://www.npmjs.com/package/vite-gutenberg-blocks-creator)
[![npm monthly downloads](https://img.shields.io/npm/dm/vite-gutenberg-blocks-creator.svg?color=red)](https://www.npmjs.com/package/vite-gutenberg-blocks-creator)


A modern toolkit for creating WordPress Gutenberg blocks using Vite and React. This project helps developers quickly scaffold and develop custom Gutenberg blocks with an optimized development experience.

## Features

- 🚀 Fast development with Vite
- ⚛️ React-powered block development
- 📦 Monorepo support with Lerna
- 🔥 Hot Module Replacement
- 🎨 SCSS support out of the box
- 🛠️ Modern build tools and optimizations

## Prerequisites

Before you start, make sure you have:
- Node.js (version 14 or higher)
- npm or yarn package manager
- WordPress installation (version 5.8 or higher)

## Installation

While something of a hybrid package (since it creates a PHP-based plugin in WordPress), we gave this one to NPM because it’s mostly JavaScript-powered. There’s a small amount of setup involved so let’s get to the numbers:

* Create a new folder in your wp-content/plugins folder to house your new block library
* Initiate a new JavaScript package by running `npm init -y` inside your new plugin folder
* Install this package inside your new plugin folder (i.e. `npm install -D vite-plugin-gutenberg-blocks`
* Run `npx -p vite-plugin-gutenberg-blocks` init in your plugin folder to create a development folder and a `register-blocks.php` file
cd development
* npm install to install the required node dependencies
* Now you can run npm run create to start off the block creation script. Answer the questions and a new block will be created in your development folder. You can add as many blocks as you like and they will be automatically loaded by WordPress once you…
* `require_once 'register-blocks.php';` in your plugins entry PHP file.

From the development folder you can now npm run dev and npm run prod to develop your Gutenberg blocks library with Vite.

## Dynamic Blocks (PHP-rendered)

Your average Gutenberg block is really just a fancy React mini-app that allows users to save HTML output into their post via the editor. When the output is delivered to the frontend, it’s generally just static HTML with some settings from Gutenberg’s editor. This works fine for elements like buttons, forms, galleries et al., but it’s not so good for things that require dynamic content, like posts or other pieces of live data.

This is where Gutenberg’s dynamic blocks come in. Essentially, you let JavaScript handle the backend editor stuff and then handover the actual rendering to good old PHP.

We won’t go through the actual process of setting this up beyond what’s related to this package:

In your blocks block.json file, add either `"render": "file:./template.php"` or `"render": "file:./render.php"` to the JSON (the plugin will only look for one of these two filenames).

Create the PHP file in your block’s development folder. It will be automatically copied to your block’s build folder along with the other build files.

## Create Block Stubs

Stubs are template files that are used when creating a new block from within your development environment. By default, the create script will use stub files from inside the package. However, if you wish to override these with your own stub files, you can do so by placing one or more of them inside your development folder at the locations shown below:

```
📦 development/
└── 📂 blocks-folder/
└── 📂 .stubs/
    ├── 📂 src/
    │   ├── 📄 block.json.stub
    │   ├── 📄 edit.jsx.stub
    │   └── 📄 editor-style.scss.stub
    │   ├── 📄 index.jsx.stub
    │   ├── 📄 save.jsx.stub
    │   ├── 📄 style.scss.stub
    ├── 📄 vite.config.js.stub
    └── 📄 package.json.stub
```

#### Using default stubs with optional overrides

Rather than publishing the createBlock template stubs during your `init` function and relying on those, the default is now to use stubs defined inside the package unless there is an override file inside your development environment folder.

You will now be asked during the `init` script whether or not you wish to publish the stubs.

If you change your mind later, you can use `npx -p vite-plugin-gutenberg-blocks publish` to publish the stubs to your development environment.

For full instructions, see the section on `stubs` above.

## Usage

### Development Commands

Available commands in your root `package.json`:

```json
"scripts": {
    "create": "npx -p vite-gutenberg-blocks-creator create blocks-folder",
    "dev": "npx lerna run dev",
    "build": "npx lerna run build"
},

"workspaces": [
    "blocks-folder/*"
]
```

### Creating a New Block

There are several ways to create a new block:

1. Using npx directly:
```bash
# Basic usage
npx vite-gutenberg-blocks-creator

# With custom directory
npx vite-gutenberg-blocks-creator custom-folder
```

The tool will prompt you for the following information:
1. NPM package namespace (optional)
2. Library namespace for your block
3. Name of the new block

### Development Workflow

1. Create a new block using either method above
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Make your changes with hot module replacement
6. Build for production when ready:
   ```bash
   npm run build
   ```

### Project Structure

When using a monorepo approach, your project structure looks like this:

#### Project Structure Overview

```
📦 project/
├── 📄 package.json # Root package.json with scripts
├── 📄 lerna.json # Lerna configuration
└── 📂 blocks-folder/ # Blocks directory
    ├── 📂 block-1/ # Your first block
    │   ├── 📂 src/
    │   │   ├── 📄 index.jsx # Block entry point
    │   │   ├── 📄 edit.jsx # Editor component
    │   │   ├── 📄 edit.jsx # Frontend component
    │   │   ├── 📄 style.scss # Main styles
    │   │   └── 📄 editor-style.scss # Editor-specific styles
    │   ├── 📄 block.json # Block configuration
    │   └── 📄 package.json # Block dependencies
    └── 📂 block-2/ # Your second block
    │   ├── 📂 src/
    │   │   ├── 📄 index.jsx
    │   │   ├── 📄 edit.jsx
    │   │   ├── 📄 save.jsx
    │   │   ├── 📄 style.scss
    │   │   └── 📄 editor-style.scss
    │   ├── 📄 block.json
    │   └── 📄 package.json
```

#### 🔍 File Descriptions

| Icon | File | Description |
|------|------|-------------|
| 📄 | `package.json` | Contains project dependencies and scripts |
| 📄 | `lerna.json` | Monorepo configuration for managing multiple packages |
| 📄 | `index.jsx` | Main entry point for the block |
| 📄 | `edit.jsx` | React component for the block editor |
| 📄 | `save.jsx` | React component for the frontend display |
| 📄 | `style.scss` | Global styles for both editor and frontend |
| 📄 | `editor-style.scss` | Editor-specific styles |
| 📄 | `block.json` | Block configuration and metadata |

### Block Configuration

Each block is configured through the `block.json` file, which includes:
- Block name and namespace
- Title and description
- Category and keywords
- Attributes definition
- Supported features

Example configuration:
```json
{
    "apiVersion": 2,
    "name": "my-namespace/my-block",
    "title": "My Block",
    "category": "common",
    "icon": "smiley",
    "description": "A custom block description",
    "supports": {
        "html": false,
        "align": true
    },
    "attributes": {
        "content": {
            "type": "string",
            "source": "html",
            "selector": "p"
        }
    }
}
```

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the existing coding style.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any problems or have questions:

1. Check the [Documentation](docs-url)
2. Look through the [Issues](issues-url) section
3. Create a new issue if your problem isn't already listed
4. Join our [Community Discord](discord-url) for real-time help

## Acknowledgments

- Thanks to the WordPress team for Gutenberg
- The Vite team for the amazing build tool
- All contributors who have helped shape this project

---

Made with ❤️ by [GrafVishna]