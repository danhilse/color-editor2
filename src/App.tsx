import { framer, CanvasNode } from "framer-plugin"
import { useState, useEffect } from "react"
import "./App.css"

framer.showUI({
    position: "top right",
    width: 240,
    height: 200,
})

function useSelection() {
    const [selection, setSelection] = useState<CanvasNode[]>([])

    useEffect(() => {
        return framer.subscribeToSelection(setSelection)
    }, [])

    return selection
}

export function App() {
    const selection = useSelection()
    const layer = selection.length === 1 ? "layer" : "layers"
    const [color, setColor] = useState("#000000")

    const handleAddSvg = async () => {
        await framer.addSVG({
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#999" d="M20 0v8h-8L4 0ZM4 8h8l8 8h-8v8l-8-8Z"/></svg>`,
            name: "Logo.svg",
        })
    }

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = event.target.value
        setColor(newColor)
        updateLayerColor(newColor)
    }

    const updateLayerColor = async (newColor: string) => {
        for (const node of selection) {
            if (framer.supportsBackgroundColor(node)) {
                await node.setAttributes({ backgroundColor: newColor })
            }
            if (framer.supportsBorderColor(node)) {
                await node.setAttributes({ borderColor: newColor })
            }
            if (framer.supportsTextColor(node)) {
                await node.setAttributes({ textColor: newColor })
            }
        }
    }

    return (
        <main>
            <p>
                Welcome! Check out the{" "}
                <a href="https://framer.com/developers/plugins/introduction" target="_blank">
                    Docs
                </a>{" "}
                to start. You have {selection.length} {layer} selected.
            </p>
            <button className="framer-button-primary" onClick={handleAddSvg}>
                Insert Logo
            </button>
            <input
                type="color"
                value={color}
                onChange={handleColorChange}
                style={{ width: "100%" }}
            />
            <input
                type="text"
                value={color}
                onChange={handleColorChange}
                style={{ width: "100%" }}
            />
        </main>
    )
}
