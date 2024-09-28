# Vanila React App With Typscript, Webpack and Esbuild 

## Descirption
This is the base app that shows all the examples in the mono repo in a blog format

## React
pnpm install -D react react-dom --filter=basic-react-app

## Types
pnpm install -D @types/node @types/react @types/react-dom @types/copy-webpack-plugin --filter=basic-react-app

## Build tools
pnpm install -D typescript esbuild-loader webpack webpack-cli copy-webpack-plugin style-loader css-loader ts-node webpack-dev-server --filter=basic-react-app

## Reference 
https://www.fullstackfoundations.com/blog/react18-typescript-webpack-vanilla-setup#directory-structure
https://react-typescript-cheatsheet.netlify.app/

## Styles
Add Shadcn UI 
pnpm install -D tailwindcss --filter=basic-react-app

cd ./apps/basic-react-app
pnpx tailwindcss init

pnpm add tailwindcss-animate class-variance-authority clsx tailwind-merge --filter=basic-react-app

pnpm add lucide-react --filter=basic-react-app
pnpm add @radix-ui/react-icons --filter=basic-react-app


## Code Spliting 

### Dynamically load data through async imports

Use the esnext module target in your tsconfig.json file.
Avoid using wildcard imports (import * as) with dynamic imports, as they can prevent tree-shaking and make it harder for bundlers to optimize your code.
Use string literals for module paths in dynamic imports, as this allows bundlers to resolve the imports correctly.
Be mindful of the performance implications of dynamic imports, as they can introduce additional overhead and slow down your application.