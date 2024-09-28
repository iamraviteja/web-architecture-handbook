import * as esbuild from 'esbuild';

let config = {
    entryPoints: ['./src/index.ts'],
    outfile: 'dist/index.cjs',
    format: "cjs",
    allowOverwrite: true,
    bundle: true,
    platform: 'node'
}

if(process.env.NODE_ENV != 'production'){
    let ctx = await esbuild.context(config)
    await ctx.watch();
}else {
    await esbuild.build(config)
}