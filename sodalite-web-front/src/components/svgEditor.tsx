import React, { useState, useRef, ChangeEvent, MouseEvent } from "react";

const SvgCanvasEditor: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string>(
    '<svg width="400" height="400"><circle cx="200" cy="200" r="50" fill="blue" /></svg>'
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [pathData, setPathData] = useState<string>("");
  const [livePath, setLivePath] = useState<string>("");

  const startDrawing = (event: MouseEvent<SVGSVGElement>) => {
    setDrawing(true);
    const startPoint = `M ${event.nativeEvent.offsetX} ${event.nativeEvent.offsetY}`;
    setPathData(startPoint);
    setLivePath(`<path d='${startPoint}' stroke='red' fill='none' stroke-width='2' />`);
  };

  const stopDrawing = () => {
    if (pathData) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, "image/svg+xml");
      const newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      newPath.setAttribute("d", pathData);
      newPath.setAttribute("stroke", "red");
      newPath.setAttribute("fill", "none");
      newPath.setAttribute("stroke-width", "2");
      doc.documentElement.appendChild(newPath);
      setSvgContent(new XMLSerializer().serializeToString(doc));
    }
    setDrawing(false);
    setPathData("");
    setLivePath("");
  };

  const draw = (event: MouseEvent<SVGSVGElement>) => {
    if (!drawing) return;
    const newPath = pathData + ` L ${event.nativeEvent.offsetX} ${event.nativeEvent.offsetY}`;
    setPathData(newPath);
    setLivePath(`<path d='${newPath}' stroke='red' fill='none' stroke-width='2' />`);
  };

  const downloadSvg = () => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawing.svg";
    a.click();
    URL.revokeObjectURL(url);
  };


const downloadPNG = () => {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("width", "400");
    svgElement.setAttribute("height", "400");
    svgElement.innerHTML = svgContent.replace('</svg>', livePath + '</svg>');
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
        requestAnimationFrame(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
    
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
    
            canvas.toBlob((blob) => {
            if (blob) {
                const pngUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = pngUrl;
                a.download = "drawing.png";
                a.click();
                URL.revokeObjectURL(pngUrl);
            }
            }, "image/png");
        }
        URL.revokeObjectURL(url);
        });
    };
    
    img.onerror = (err) => {
        console.error("Failed to load SVG as image:", err);
    };
    
    img.src = url;
};
  

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setSvgContent(result);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h2>SVG Canvas Editor</h2>
      <div style={{ border: "1px solid black", width: "400px", height: "400px" }}>
        <svg
          width="400"
          height="400"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          dangerouslySetInnerHTML={{ __html: svgContent.replace('</svg>', livePath + '</svg>') }}
        />
      </div>
      <textarea
        value={svgContent}
        onChange={(e) => setSvgContent(e.target.value)}
        rows={10}
        cols={50}
        style={{ marginTop: "1rem", display: "block" }}
      ></textarea>
      <div>
        <button onClick={downloadSvg}>Download SVG</button>
        <button onClick={downloadPNG}>Download PNG</button>
        <input
          type="file"
          accept=".svg"
          ref={fileInputRef}
          onChange={handleUpload}
          style={{ marginLeft: "1rem" }}
        />
      </div>
    </div>
  );
};

export default SvgCanvasEditor;
