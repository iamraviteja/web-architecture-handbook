import { useState } from 'react'

export default function Home() {
    const [data, setData] = useState<string[]>([])

    const loadData = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const res =  (await import('../utils/data/index.ts' /* webpackChunkName: "utilites" */)).default
        const makeUpperCase =  (await import('../utils/data/index.ts')).makeUpperCase

        setData(res.map(makeUpperCase));
    }

    return (
        <>
            <p>Home</p>
            <button onClick={loadData}>Load Data Dynamically</button>
            <p>{ JSON.stringify(data) }</p>
        </>
    )
}