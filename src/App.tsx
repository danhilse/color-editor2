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
                You have {selection.length} {layer} selected.
            </p>
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
